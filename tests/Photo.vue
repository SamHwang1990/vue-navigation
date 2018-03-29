<template>
    <div id="photo_ddd">
        Photos Screen
        <div class="button" @click="navigation.navigate('profile', { user_id: 'user' + ~~(Math.random() * 100) })">Go to a profile screen</div>
        <div class="button" @click="navigation.goBack()">Go Back</div>
        <div class="button" @click="activeAStatusBar">Active global A Status</div>
        <div class="button" @click="disactiveAStatusBar">Disactive global A Status</div>
        <div class="button" @click="activeBStatusBar">Active global B Status</div>
        <div class="button" @click="disactiveBStatusBar">Disactive global B Status</div>
    </div>
</template>
<script>
    module.exports = {
      name: 'Profile',
        StatusBarOptions: {
          backgroundColor: '#ff6c57'
        },
        methods: {
            activeAStatusBar: function() {
                this.navigation.activeStatusBar('a')
            },
            disactiveAStatusBar: function() {
                this.navigation.disactiveStatusBar('a')
            },

            activeBStatusBar: function() {
                this.navigation.activeStatusBar('b')
            },
            disactiveBStatusBar: function() {
                this.navigation.disactiveStatusBar('b')
            }
        },
      data: function() {
        const { params } = this.navigation.state;

        log(params);

        return {
          name: params.name,
          styleScope: {
            button: {
              display: 'block',
              height: 50,
              margin: '10px',
              align: 'center middle',
              backgroundColor: '#1eadff'
            }
          }
        }
      },
        mounted: function() {
          log('photo screen mounted');
        },
        destroyed: function() {
          log('photo screen destroyed');
        }
    }
</script>