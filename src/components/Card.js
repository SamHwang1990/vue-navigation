/**
 * Created by zhiyuan.huang@ddder.net on 17/7/6.
 */

'use strict';

import CardStatusBar from './CardStatusBar';

function isPlainObject(v) {
  return {}.toString.apply(v) === '[object Object]'
}

export default {
  name: 'navigation-card',
  props: {
    screenProps: Object,
    navigation: Object,
    component: Object,

    parentPosition: Object,
    transitionSpec: Object,

    screenInterpolator: Function,
    stackStateIndex: Number,
    layout: Object,
    scene: Object,

    startTransitionRunner: Function,
    endTransitionRunner: Function
  },

  data: function() {
    return {
      cardStatus: {
        sticky: this._isSticky(),
        transition: 'INIT'
      }
    }
  },

  mounted: function() {
    this.componentInstance = this.$children[this.$children.length - 1];
    this._injectScreenRouteChange();
    this._executeAnimation();
  },

  watch: {
    'parentPosition': {
      handler: function() {
        this._executeAnimation();
      },
      deep: true
    },
    isScreenActive: {
      handler: function(isActive) {
        const componentInstance = this.componentInstance;
        const componentOptions = this.shallowComponent;
        componentOptions.onScreenActive && componentOptions.onScreenActive.call(componentInstance, isActive);
      }
    }
  },

  computed: {
    isScreenActive: function() {
      return this.cardStatus.sticky && this.cardStatus.transition === 'COMPLETE';
    },
    shallowComponent: function() {
      return this.$options._base.extend(this.component).options;
    },
    styleInterpolator: function() {
      return this.screenInterpolator({
        current: this.stackStateIndex,
        layout: this.layout,
        scene: this.scene
      })
    }
  },
  methods: {
    _executeAnimation: function() {
      const animationMap = this._formatAnimationMap()
      this._validateAnimationMap(animationMap)

      const elm = this.$el
      const animationName = 'positionChangeAnimation'
      if (elm.data(animationName)) {
        elm.data(animationName).stop()
        elm.data(animationName, null)
      }

      const { tween, easing, duration } = this.transitionSpec

      const styleNames = Object.keys(animationMap)

      const componentInstance = this.componentInstance;
      const componentOptions = this.shallowComponent;

      if (!styleNames.length) {
        setTimeout(() => {
          this._invokeStartAnimationHook(true);
          this._invokeCompleteAnimationHook(true);
        }, 0);
        return;
      }

      const animationFrames = {}
      for (let i = 0; i < styleNames.length; ++i) {
        const styleName = styleNames[i]
        const animationState = animationMap[styleName]
        if (animationState.current != null && animationState.to != null) {
          animationFrames[styleName] = {
            value: [animationState.current, animationState.to]
          }
        }
      }

      let transitionRunnerId;
      elm.data(animationName, elm.anime(animationFrames, {
        easing: 'spring',
        stiffness: 200,
        dampingRadio: .9
      }).onStart(() => {
        this._invokeStartAnimationHook();
        transitionRunnerId = this.startTransitionRunner();
      }).onComplete(() => {
        this._invokeCompleteAnimationHook();
        this.endTransitionRunner(transitionRunnerId);
        elm.data(animationName, null);
      }).play());
    },
    _formatAnimationMap: function() {
      let styleNames = Object.keys(this.styleInterpolator)
      const { current: currentPosition, next: nextPosition } = this.parentPosition

      const animationMap = {}
      styleNames.forEach(styleName => {
        let interpolator = this.styleInterpolator[styleName]

        let animation = {
          current: null,
          to: null
        }

        if (!isPlainObject(interpolator)) {
          animation.current = animation.to = interpolator
        } else {
          const { inputRange: input, outputRange: output } = interpolator

          for (let i = 0; i < input.length; ++i) {
            if (input[i] === currentPosition) animation.current = output[i]
            if (input[i] === nextPosition) animation.to = output[i]
          }
        }

        animationMap[styleName] = animation
      })

      return animationMap
    },
    _validateAnimationMap: function(animationMap) {
      if (!isPlainObject(animationMap)) return
      let styleNames = Object.keys(animationMap)
      styleNames.forEach(styleName => {
        const animation = animationMap[styleName]
        if (animation.current === null) animation.current = 'current';

        if (
          animation == null ||
          animation.to == null ||
          animation.current === animation.to
        ) delete animationMap[styleName]
      })
      return animationMap
    },

    _invokeStartAnimationHook: function(fake) {
      this.cardStatus.transition = 'START';

      const componentInstance = this.componentInstance;
      const componentOptions = this.shallowComponent;

      !fake && componentOptions.onScreenTransitionStart && componentOptions.onScreenTransitionStart.apply(componentInstance);
    },

    _invokeCompleteAnimationHook: function(fake) {
      this.cardStatus.transition = 'COMPLETE';

      const componentInstance = this.componentInstance;
      const componentOptions = this.shallowComponent;

      !fake && componentOptions.onScreenTransitionComplete && componentOptions.onScreenTransitionComplete.apply(componentInstance);
    },

    _injectScreenRouteChange: function() {
      const componentInstance = this.componentInstance;
      const componentOptions = this.shallowComponent;

      let stickyToggleListener = componentOptions.onScreenStickyToggle;

      if (!stickyToggleListener) {
        stickyToggleListener = function() {};
      }

      if (typeof stickyToggleListener === 'function') {
        stickyToggleListener = {
          handler: stickyToggleListener,
          immediate: false
        }
      }

      this.cardStatus.sticky = this._isSticky();

      const onStateChange = (/*state, prevState*/) => {
        const isSticky = this._isSticky();

        if (isSticky === this.cardStatus.sticky) return;

        this.cardStatus.sticky = isSticky;
        stickyToggleListener.handler.call(componentInstance, isSticky);

        if (this.cardStatus.transition !== 'START') {
          this.cardStatus.transition = 'INIT';
        }
      };

      this.navigation.onStateChange(onStateChange);

      let beforeHooks = this.$options.beforeDestroy;
      if (!beforeHooks) {
        beforeHooks = [];
      } else if (!Array.isArray(beforeHooks)) {
        beforeHooks = [beforeHooks];
      } else {
        beforeHooks = Array.from(beforeHooks);
      }

      beforeHooks.push(function() {
        this.navigation.offStateChange(onStateChange);
      });

      this.$options.beforeDestroy = beforeHooks;

      if (stickyToggleListener.immediate === true) {
        stickyToggleListener.handler.call(componentInstance, this.cardStatus.sticky);
      }
    },

    _isSticky: function() {
      const currentRoute = this.navigation.getCurrentRoute();
      if (!currentRoute) return null;

      const cardState = this.navigation.state;
      return cardState.uid === currentRoute.uid && cardState.routeName === currentRoute.routeName;
    }
  },

  render(h) {
    const animationMap = this._formatAnimationMap();
    const initStyle = {
      opacity: animationMap.opacity.current || 1,
      transform: `translate(${animationMap.translateX.current || 0},${animationMap.translateY.current || 0})`
    };

    // extend component props to standard screen props
    const defaultProps = { screenProps: Object, navigation: Object }
    this.shallowComponent.props = {
      ...defaultProps,
      ...this.shallowComponent.props
    };

    const statusBarOptions = {
      custom: false,
      backgroundColor: '#fff'
    };

    let screenStatusBarOptions = this.shallowComponent.StatusBarOptions;
    if (screenStatusBarOptions) {
      if (screenStatusBarOptions.custom === true) {
        statusBarOptions.custom = true;
        statusBarOptions.backgroundColor = 'rgba(255, 255, 255, 255)';
      } else {
        screenStatusBarOptions.backgroundColor
        && (statusBarOptions.backgroundColor = screenStatusBarOptions.backgroundColor);
      }
    }

    const childNodes = [];

    if (!this.shallowComponent.router && !statusBarOptions.custom) {
      childNodes.push(h(CardStatusBar, {
        props: {
          backgroundColor: statusBarOptions.backgroundColor,
          screenProps: this.screenProps,
          navigation: this.navigation
        }
      }));
    }

    childNodes.push(h(
      'div',
      {
        staticStyle: { 'stretchWeight': 1, width: '100%' }
      },
      [
        h(this.shallowComponent, {
          props: {
            screenProps: this.screenProps,
            navigation: this.navigation
          }
        })
      ]
    ));

    return h(
      'div',
      {
        key: this.navigation.state.uid,
        staticStyle: {
          position: 'fixed',
          display: 'flex',
          justification: 'vertical',
          height: '100%',
          width: '100%',
          top: 0,
          left: 0,
          backgroundColor: '#fff',
          ...initStyle
        }
      },
      childNodes
    )
  }
}