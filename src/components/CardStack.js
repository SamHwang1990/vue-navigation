/**
 * Created by zhiyuan.huang@ddder.net on 17/7/6.
 */

'use strict';

import Card from './Card'

import addNavigationHelpers from '../addNavigationHelpers'
import scenesReducer from './scenesReducer'
import transitionConfig from './transitionConfigs'

function isSceneNotStale(scene) {
  return !scene.isStale;
}

function isSceneActive(scene) {
  return scene.isActive;
}

export default {
  name: 'navigation-card-stack',
  props: {
    screenProps: Object,
    router: Object,
    navigation: Object,
    model: String,
    transitionConfig: Function
  },
  data: function() {
    return {
      scenes: [],
      layout: {
        // hard code measured layout size
        isMeasured: true,
        initHeight: body.height,
        initWidth: body.width
      },
      position: {
        current: this.navigation.state.index,
        next: null
      }
    }
  },
  computed: {
    'scene': function() {
      return this.scenes.find(isSceneActive)
    },
    'index': function() {
      return this.scene.index
    },
  },
  watch: {
    'navigation.state': {
      immediate: true,
      handler: function(newState, oldState) {
        const nextScenes = scenesReducer(
          this.scenes,
          newState,
          oldState
        )

        if (nextScenes === this.scenes) return;

        const indexHasChanged = oldState && newState.index !== oldState.index;

        if (this._isTransitionRunning) {
          this._queuedTransition = [nextScenes, indexHasChanged];
          return;
        }

        this._startTransition(nextScenes, indexHasChanged);
      }
    }
  },

  methods: {
    getScreenDetails(scene) {
      const self = this;
      const { screenProps, navigation, router } = this._props;
      let screenDetails = this._screenDetails[scene.key];
      if (!screenDetails || screenDetails.state !== scene.route) {
        const screenNavigation = addNavigationHelpers({
          ...navigation,
          state: scene.route,
          dispatch: function(...args) {
            if (self._isTransitionRunning) return false;
            return navigation.dispatch(...args);
          }
        });
        screenDetails = {
          state: scene.route,
          navigation: screenNavigation,
          options: router.getScreenOptions(screenNavigation, screenProps),
        };
        this._screenDetails[scene.key] = screenDetails;
      }
      return screenDetails;
    },

    renderCard(h, scene) {
      const sceneDetail = this.getScreenDetails(scene)
      const component = this.router.getComponentForRouteName(scene.route.routeName)

      const { screenInterpolator } = this._getTransitionConfig()

      const props = {
        screenProps: this.screenProps,
        navigation: sceneDetail.navigation,
        component: component,
        parentPosition: this.position,
        transitionSpec: transitionConfig.DefaultTransitionSpec,

        screenInterpolator,
        stackStateIndex: this.navigation.state.index,
        layout: this.layout,
        scene,

        startTransitionRunner: this._startTransitionRunner,
        endTransitionRunner: this._endTransitionRunner
      };

      return h(Card, { props, key: scene.key })
    },

    _startTransitionRunner: function() {
      ++this._tRunnerId;
      this._transitionRunners.push(this._tRunnerId);
      return this._tRunnerId;
    },
    _endTransitionRunner: function(runnerId) {
      let i = this._transitionRunners.indexOf(runnerId);
      if ( i >= 0) {
        this._transitionRunners.splice(i, 1);
      }

      if (!this._transitionRunners.length) {
        this._endTransition();
      }
    },

    _startTransition(scenes, indexHasChanged) {
      if (this._screenDetails == null) this._screenDetails = {}

      const screenDetails = this._screenDetails || (this._screenDetails = {})

      this.scenes = scenes
      this.scenes.forEach(newScene => {
        if (
          screenDetails[newScene.key] &&
          screenDetails[newScene.key].state !== newScene.route
        ) {
          screenDetails[newScene.key] = null
        }
      })

      this._updatePosition()

      const transitionSpec = transitionConfig.DefaultTransitionSpec

      if (indexHasChanged) {
        this._isTransitionRunning = true
        this._tRunnerId = 0;
        this._transitionRunners = [];
      } else {
        this._endTransition()
      }

    },
    _endTransition() {
      this._transitionRunners = [];

      if (this._queuedTransition) {
        let queuedTransition = this._queuedTransition;
        this._queuedTransition = null;
        this._startTransition(...queuedTransition)
        return
      }

      this._isTransitionRunning = false

      const notStaleScenes = this.scenes.filter(isSceneNotStale)
      if (notStaleScenes.length !== this.scenes.length) {
        this._updatePosition()
        this.scenes = notStaleScenes
      }
    },

    _updatePosition() {
      if (this.position.next != null) {
        this.position.current = this.position.next
      }
      this.position.next = this.navigation.state.index
    },

    _getTransitionConfig() {
      const isModal = this.mode === 'modal';

      /* $FlowFixMe */
      return transitionConfig.getTransitionConfig(
        this.transitionConfig,
        {},
        {},
        isModal
      );
    }
  },

  render(h) {
    return h(
        'div',
        {
          staticStyle: {
            width: '100%',
          }
        },
        this.scenes.map((scene, index) => {
          return this.renderCard(h, scene, index)
        })
    )
  }
}