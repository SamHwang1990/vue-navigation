<script>

  const { StackNavigator, NavigationActions } = require('/libs/vue-navigation/index.js');

  const p1 = {
    template: '<div>P1 <div @click="navigation.navigate(\'P2\')">toP2</div> </div>',
    mounted: function() {
      this.navigation.state.key = 'p1';
    }
  };

  const p2 = {
    template: '<div>P2 <div @click="navigation.navigate(\'P3\')">toP3</div></div>',
    mounted: function() {
      this.navigation.state.key = 'p2';
    }
  }

  const p3 = {
    template: '<div>P3 <div @click="toP1">toP1</div></div>',
    methods: {
      toP1: function (/*$event*/) {
        log('p3 to p1');
        this.navigation.goBackTo('p1');
      }
    }
  }

  const rootNavigator = StackNavigator({
    P1: {
      screen: p1
    },
    P2: {
      screen: p2
    },
    P3: {
      screen: p3
    }
  })

    module.exports = {
      el: '__init__',
      template: '<nav></nav>',
      components: {
        nav: rootNavigator
      }
    }
</script>