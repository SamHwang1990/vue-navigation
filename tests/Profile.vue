<template>
    <div>
        {{user_id}}'s Photos
        <zoo></zoo>
        <div class="button" @click="navigation.navigate('photo', { name: ~~(Math.random() * 100) })">Go to a photos screen</div>
        <div class="button" @click="navigation.setParams({ user_id: ~~(Math.random() * 100) })" >Change User Id</div>
        <div class="button" @click="navigation.navigate('foo')">Go to a foo screen</div>
        <div class="button" @click="navigation.dispatch({type: 'Navigation/RESET', actions: [{routeName: 'profile', params: { user_id: ~~(Math.random() * 100) }}], index: 0})">Reset to Root</div>
        <div class="button" @click="resetToFoo">Reset to Foo</div>
        <div class="button" @click="navigation.goBack()">Go Back</div>
        <div class="button" @click="navigation.state.key = 2">Change Key</div>
    </div>
</template>
<script>
    module.exports = {
      name: 'Profile',
        StatusBarOptions: {
            backgroundColor: '#1effb5'
        },
      updated: function() {
        log('profile updated')
        log(this.navigation)
      },
        onScreenActive: function(isActive) {
          log('profile onScreenActive', isActive);
        },
        onScreenStickyToggle: {
            handler: function(sticky) {
                log('profile onScreenStickyToggle', sticky, this.name);
            },
            immediate: true
        },
        onScreenTransitionStart: function() {
          log('profile onCardTransitionStart');
        },
        onScreenTransitionComplete: function() {
            log('profile onCardTransitionComplete');
        },
      components: {
        Zoo: require('./Zoo.vue')
      },
      data: function() {
        return {
          styleScope: {
            button: {
              display: 'block',
              height: 50,
              margin: '10px',
              padding: '10px',
              align: 'center middle',
              backgroundColor: '#1eadff'
            }
          }
        }
      },
      computed: {
        user_id: function() {
          return this.navigation.state.params.user_id
        }
      },
      beforeMount: function() {
        log('profile before mount');
      },
      mounted: function() {
        log('profile mounted');
      },
        destroyed: function() {
          log('profile destroyed');
        },

        methods: {
            resetToFoo: function() {
                this.navigation.dispatch({
                    type: 'Navigation/RESET',
                    key: null,
                    index: 0,
                    actions: [
                        {
                            routeName: 'foo',
                            type: 'Navigation/RESET',
                            key: null,
                            index: 0,
                            actions: [
                                {
                                    routeName: 'photo',
                                    params: {
                                        name: 'say something'
                                    }
                                }
                            ]
                        }
                    ]
                })
            }
        }
    }
</script>