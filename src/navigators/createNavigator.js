/**
 * Created by zhiyuan.huang@ddder.net on 17/7/6.
 */

'use strict';

import addNavigationHelpers from '../addNavigationHelpers';
import NavigationActions from '../NavigationActions';

import CardStack from '../components/CardStack';

import statusBarHelper from '../components/GlobalStatusBar';

export default function createNavigator(router, routeConfigs, navigatorConfig, navigatorType) {

  return {
    name: 'navigation-navigator',

    data: function() {
      const data = {};

      if (this.isStateful) {
        data.statusBarScenes = [];
        navigatorConfig.statusBarScenes && Object.keys(navigatorConfig.statusBarScenes).forEach(key => {
          let {component, priority} = navigatorConfig.statusBarScenes[key];

          priority = parseInt(priority);
          if (isNaN(priority)) {
            priority = 1;
          }

          data.statusBarScenes.push({name: key, component, priority, active: false});
        });

        data.statusBarScenes.sort((s1, s2) => {
          return s1.priority - s2.priority;
        });
      }

      return data;
    },

    props: {
      navigation: {
        type: Object,
        default: function() {
          this.isStateful = true;

          this.statusBarComponent = statusBarHelper(navigatorConfig.statusBarScenes);

          return addNavigationHelpers({

            getActiveStatusBarScene: () => {
              for (let i = 0; i < this.statusBarScenes.length; ++i) {
                let scene = this.statusBarScenes[i];
                if (scene.active) return scene.name;
              }
              return '';
            },

            activeStatusBar: sceneName => {
              for (let i = 0; i < this.statusBarScenes.length; ++i) {
                let scene = this.statusBarScenes[i];
                if (scene.name === sceneName) {
                  scene.active = true;
                  break;
                }
              }
            },

            disactiveStatusBar: sceneName => {
              for (let i = 0; i < this.statusBarScenes.length; ++i) {
                let scene = this.statusBarScenes[i];
                if (scene.name === sceneName) {
                  scene.active = false;
                  break;
                }
              }
            },

            sceneStatusBarHeight: () => {
              return this.$children[0].getSceneStatusBarHeight();
            },

            stateChangeListeners: new Set(),
            handleStateChange: (state, prevState) => {
              const listenersIterator = this.navigation.stateChangeListeners.values();
              let iteStep = listenersIterator.next();

              // don't want to use babel for-of transformer because nextly do not support Symbol
              while(!iteStep.done) {
                iteStep.value(state, prevState);
                iteStep = listenersIterator.next();
              }
            },
            onStateChange: cb => {
              this.navigation.stateChangeListeners.add(cb);
            },
            offStateChange: cb => {
              this.navigation.stateChangeListeners.delete(cb);
            },

            getCurrentRoute: () => {
              const findCurrentRoute = navState => {
                if (navState.index !== undefined) {
                  return findCurrentRoute(navState.routes[navState.index]);
                }
                return {
                  uid: navState.uid,
                  key: navState.key,
                  routeName: navState.routeName
                };
              };
              return findCurrentRoute(this.navigation.state);
            },

            dispatch: action => {
              const state = this.navigation.state;
              const nextState = router.getStateForAction(action, state);
              if (nextState && nextState !== state) {
                this.navigation.state = nextState;
                this.navigation.handleStateChange(nextState, state);
                return true
              }
              return false
            },
            state: router.getStateForAction(NavigationActions.init())
          })
        }
      },
      screenProps: {
        type: Object,
        default: null
      }
    },

    computed: {
      activeStatusBarScene: function() {
        return this.navigation.getActiveStatusBarScene();
      }
    },

    // static
    navigatorType,
    navigatorConfig,
    router,

    mounted: function() {
      // todo: add listener to open url and backpress event
    },

    beforeDestroy: function() {
      // todo: remove listener to open url or backpress event
    },

    render: function(h) {
      const props = {
        ...this._props,
        router,
        navigation: this.navigation
      };

      if (this.isStateful) {
        return h(
          'div',
          {
            staticStyle: {
              display: 'flex',
              justification: 'vertical',

              position: 'fixed',
              height: '100%',
              width: '100%',
              top: 0,
              left: 0,
            }
          },
          [
            h(this.statusBarComponent, { props: { activeScene: this.activeStatusBarScene } }),
            h(CardStack, { staticStyle: { 'stretch-weight': 1 }, props })
          ]
        )
      } else {
        return h(CardStack, { staticStyle: { position: 'fixed', height: '100%' }, props });
      }
    }
  }
}