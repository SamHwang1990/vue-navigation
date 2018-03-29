'use strict';

/**
 * Created by zhiyuan.huang@ddder.net on 17/7/6.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error = void 0;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





















var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};





















var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/**
 * Utilities to perform atomic operation with navigate state and routes.
 *
 * ```javascript
 * const state1 = {key: 'screen 1'};
 * const state2 = NavigationStateUtils.push(state1, {key: 'screen 2'});
 * ```
 */
var StateUtils = {
  /**
   * Gets a route by key. If the route isn't found, returns `null`.
   */
  get: function get$$1(state, key) {
    return state.routes.find(function (route) {
      return route.key === key;
    }) || null;
  },


  /**
   * Returns the first index at which a given route's key can be found in the
   * routes of the navigation state, or -1 if it is not present.
   */
  indexOf: function indexOf(state, key) {
    return state.routes.map(function (route) {
      return route.key;
    }).indexOf(key);
  },


  /**
   * Returns `true` at which a given route's key can be found in the
   * routes of the navigation state.
   */
  has: function has(state, key) {
    return !!state.routes.some(function (route) {
      return route.key === key;
    });
  },


  /**
   * Pushes a new route into the navigation state.
   * Note that this moves the index to the positon to where the last route in the
   * stack is at.
   */
  push: function push(state, route) {
    invariant(StateUtils.indexOf(state, route.key) === -1, 'should not push route with duplicated key %s', route.key);

    var routes = state.routes.slice();
    routes.push(route);

    return _extends({}, state, {
      index: routes.length - 1,
      routes: routes
    });
  },


  /**
   * Pops out a route from the navigation state.
   * Note that this moves the index to the positon to where the last route in the
   * stack is at.
   */
  pop: function pop(state) {
    if (state.index <= 0) {
      // [Note]: Over-popping does not throw error. Instead, it will be no-op.
      return state;
    }
    var routes = state.routes.slice(0, -1);
    return _extends({}, state, {
      index: routes.length - 1,
      routes: routes
    });
  },


  /**
   * Sets the focused route of the navigation state by index.
   */
  jumpToIndex: function jumpToIndex(state, index) {
    if (index === state.index) {
      return state;
    }

    invariant(!!state.routes[index], 'invalid index %s to jump to', index);

    return _extends({}, state, {
      index: index
    });
  },


  /**
   * Sets the focused route of the navigation state by key.
   */
  jumpTo: function jumpTo(state, key) {
    var index = StateUtils.indexOf(state, key);
    return StateUtils.jumpToIndex(state, index);
  },


  /**
   * Sets the focused route to the previous route.
   */
  back: function back(state) {
    var index = state.index - 1;
    var route = state.routes[index];
    return route ? StateUtils.jumpToIndex(state, index) : state;
  },


  /**
   * Sets the focused route to the next route.
   */
  forward: function forward(state) {
    var index = state.index + 1;
    var route = state.routes[index];
    return route ? StateUtils.jumpToIndex(state, index) : state;
  },


  /**
   * Replace a route by a key.
   * Note that this moves the index to the positon to where the new route in the
   * stack is at.
   */
  replaceAt: function replaceAt(state, key, route) {
    var index = StateUtils.indexOf(state, key);
    return StateUtils.replaceAtIndex(state, index, route);
  },


  /**
   * Replace a route by a index.
   * Note that this moves the index to the positon to where the new route in the
   * stack is at.
   */
  replaceAtIndex: function replaceAtIndex(state, index, route) {
    invariant(!!state.routes[index], 'invalid index %s for replacing route %s', index, route.key);

    if (state.routes[index] === route) {
      return state;
    }

    var routes = state.routes.slice();
    routes[index] = route;

    return _extends({}, state, {
      index: index,
      routes: routes
    });
  },


  /**
   * Resets all routes.
   * Note that this moves the index to the positon to where the last route in the
   * stack is at if the param `index` isn't provided.
   */
  reset: function reset(state, routes, index) {
    invariant(routes.length && Array.isArray(routes), 'invalid routes to replace');

    var nextIndex = index === undefined ? routes.length - 1 : index;

    if (state.routes.length === routes.length && state.index === nextIndex) {
      var compare = function compare(route, ii) {
        return routes[ii] === route;
      };
      if (state.routes.every(compare)) {
        return state;
      }
    }

    invariant(!!routes[nextIndex], 'invalid index %s to reset', nextIndex);

    return _extends({}, state, {
      index: nextIndex,
      routes: routes
    });
  }
};

/**
 * Created by zhiyuan.huang@ddder.net on 17/7/6.
 */

var BACK = 'Navigation/BACK';
var BACK_TO = 'Navigation/BACK_TO';
var INIT = 'Navigation/INIT';
var NAVIGATE = 'Navigation/NAVIGATE';
var RESET = 'Navigation/RESET';
var SET_PARAMS = 'Navigation/SET_PARAMS';
var URI = 'Navigation/URI';

var createAction = function createAction(type) {
  return function () {
    var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return _extends({
      type: type
    }, payload);
  };
};

var back = createAction(BACK);
var backTo = createAction(BACK_TO);
var init = createAction(INIT);
var navigate = createAction(NAVIGATE);
var reset = createAction(RESET);
var setParams = createAction(SET_PARAMS);
var uri = createAction(URI);

var NavigationActions = {
  // Action constants
  BACK: BACK,
  BACK_TO: BACK_TO,
  INIT: INIT,
  NAVIGATE: NAVIGATE,
  RESET: RESET,
  SET_PARAMS: SET_PARAMS,
  // URI,

  // Action creators
  back: back,
  backTo: backTo,
  init: init,
  navigate: navigate,
  reset: reset,
  setParams: setParams,
  uri: uri
};

/**
 * Helpers for navigation.
 */

var addNavigationHelpers = function (navigation) {
  return _extends({}, navigation, {
    goBackTo: function goBackTo(key) {
      return navigation.dispatch(NavigationActions.backTo({
        key: key
      }));
    },
    goBack: function goBack(key) {
      return navigation.dispatch(NavigationActions.back({
        key: key === undefined ? navigation.state.key : key
      }));
    },
    navigate: function navigate(routeName, params, action) {
      return navigation.dispatch(NavigationActions.navigate({
        routeName: routeName,
        params: params,
        action: action
      }));
    },
    setParams: function setParams(params) {
      return navigation.dispatch(NavigationActions.setParams({
        params: params,
        key: navigation.state.key
      }));
    }
  });
};

/**
 * Created by zhiyuan.huang@ddder.net.
 */

var CardStatusBar = {
  name: 'Navigation_CardStatusBar',

  data: function data() {
    return {
      statusBarHeight: this.navigation.sceneStatusBarHeight()
    };
  },

  props: {
    screenProps: Object,
    navigation: Object,
    backgroundColor: {
      type: String,
      default: '#fff'
    }
  },

  template: '\n  <div :style="barStyle" @globalSceneStatusBar.notification="onChangeSceneStatusBar"></div>\n  ',

  computed: {
    barStyle: function barStyle() {
      return {
        width: '100%',
        height: this.statusBarHeight,
        backgroundColor: this.backgroundColor
      };
    }
  },

  methods: {
    onChangeSceneStatusBar: function onChangeSceneStatusBar(e) {
      this.statusBarHeight = e.iData;
    }
  }
};

/**
 * Created by zhiyuan.huang@ddder.net on 17/7/6.
 */

function isPlainObject(v) {
  return {}.toString.apply(v) === '[object Object]';
}

var Card = {
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

  data: function data() {
    return {
      cardStatus: {
        sticky: this._isSticky(),
        transition: 'INIT'
      }
    };
  },

  mounted: function mounted() {
    this.componentInstance = this.$children[this.$children.length - 1];
    this._injectScreenRouteChange();
    this._executeAnimation();
  },

  watch: {
    'parentPosition': {
      handler: function handler() {
        this._executeAnimation();
      },
      deep: true
    },
    isScreenActive: {
      handler: function handler(isActive) {
        var componentInstance = this.componentInstance;
        var componentOptions = this.shallowComponent;
        componentOptions.onScreenActive && componentOptions.onScreenActive.call(componentInstance, isActive);
      }
    }
  },

  computed: {
    isScreenActive: function isScreenActive() {
      return this.cardStatus.sticky && this.cardStatus.transition === 'COMPLETE';
    },
    shallowComponent: function shallowComponent() {
      return this.$options._base.extend(this.component).options;
    },
    styleInterpolator: function styleInterpolator() {
      return this.screenInterpolator({
        current: this.stackStateIndex,
        layout: this.layout,
        scene: this.scene
      });
    }
  },
  methods: {
    _executeAnimation: function _executeAnimation() {
      var _this = this;

      var animationMap = this._formatAnimationMap();
      this._validateAnimationMap(animationMap);

      var elm = this.$el;
      var animationName = 'positionChangeAnimation';
      if (elm.data(animationName)) {
        elm.data(animationName).stop();
        elm.data(animationName, null);
      }

      var _transitionSpec = this.transitionSpec,
          tween = _transitionSpec.tween,
          easing = _transitionSpec.easing,
          duration = _transitionSpec.duration;


      var styleNames = Object.keys(animationMap);

      var componentInstance = this.componentInstance;
      var componentOptions = this.shallowComponent;

      if (!styleNames.length) {
        setTimeout(function () {
          _this._invokeStartAnimationHook(true);
          _this._invokeCompleteAnimationHook(true);
        }, 0);
        return;
      }

      var animationFrames = {};
      for (var i = 0; i < styleNames.length; ++i) {
        var styleName = styleNames[i];
        var animationState = animationMap[styleName];
        if (animationState.current != null && animationState.to != null) {
          animationFrames[styleName] = {
            value: [animationState.current, animationState.to]
          };
        }
      }

      var transitionRunnerId = void 0;
      elm.data(animationName, elm.anime(animationFrames, {
        easing: 'spring',
        stiffness: 200,
        dampingRadio: .9
      }).onStart(function () {
        _this._invokeStartAnimationHook();
        transitionRunnerId = _this.startTransitionRunner();
      }).onComplete(function () {
        _this._invokeCompleteAnimationHook();
        _this.endTransitionRunner(transitionRunnerId);
        elm.data(animationName, null);
      }).play());
    },
    _formatAnimationMap: function _formatAnimationMap() {
      var _this2 = this;

      var styleNames = Object.keys(this.styleInterpolator);
      var _parentPosition = this.parentPosition,
          currentPosition = _parentPosition.current,
          nextPosition = _parentPosition.next;


      var animationMap = {};
      styleNames.forEach(function (styleName) {
        var interpolator = _this2.styleInterpolator[styleName];

        var animation = {
          current: null,
          to: null
        };

        if (!isPlainObject(interpolator)) {
          animation.current = animation.to = interpolator;
        } else {
          var input = interpolator.inputRange,
              output = interpolator.outputRange;


          for (var i = 0; i < input.length; ++i) {
            if (input[i] === currentPosition) animation.current = output[i];
            if (input[i] === nextPosition) animation.to = output[i];
          }
        }

        animationMap[styleName] = animation;
      });

      return animationMap;
    },
    _validateAnimationMap: function _validateAnimationMap(animationMap) {
      if (!isPlainObject(animationMap)) return;
      var styleNames = Object.keys(animationMap);
      styleNames.forEach(function (styleName) {
        var animation = animationMap[styleName];
        if (animation.current === null) animation.current = 'current';

        if (animation == null || animation.to == null || animation.current === animation.to) delete animationMap[styleName];
      });
      return animationMap;
    },

    _invokeStartAnimationHook: function _invokeStartAnimationHook(fake) {
      this.cardStatus.transition = 'START';

      var componentInstance = this.componentInstance;
      var componentOptions = this.shallowComponent;

      !fake && componentOptions.onScreenTransitionStart && componentOptions.onScreenTransitionStart.apply(componentInstance);
    },

    _invokeCompleteAnimationHook: function _invokeCompleteAnimationHook(fake) {
      this.cardStatus.transition = 'COMPLETE';

      var componentInstance = this.componentInstance;
      var componentOptions = this.shallowComponent;

      !fake && componentOptions.onScreenTransitionComplete && componentOptions.onScreenTransitionComplete.apply(componentInstance);
    },

    _injectScreenRouteChange: function _injectScreenRouteChange() {
      var _this3 = this;

      var componentInstance = this.componentInstance;
      var componentOptions = this.shallowComponent;

      var stickyToggleListener = componentOptions.onScreenStickyToggle;

      if (!stickyToggleListener) {
        stickyToggleListener = function stickyToggleListener() {};
      }

      if (typeof stickyToggleListener === 'function') {
        stickyToggleListener = {
          handler: stickyToggleListener,
          immediate: false
        };
      }

      this.cardStatus.sticky = this._isSticky();

      var onStateChange = function onStateChange() /*state, prevState*/{
        var isSticky = _this3._isSticky();

        if (isSticky === _this3.cardStatus.sticky) return;

        _this3.cardStatus.sticky = isSticky;
        stickyToggleListener.handler.call(componentInstance, isSticky);

        if (_this3.cardStatus.transition !== 'START') {
          _this3.cardStatus.transition = 'INIT';
        }
      };

      this.navigation.onStateChange(onStateChange);

      var beforeHooks = this.$options.beforeDestroy;
      if (!beforeHooks) {
        beforeHooks = [];
      } else if (!Array.isArray(beforeHooks)) {
        beforeHooks = [beforeHooks];
      } else {
        beforeHooks = Array.from(beforeHooks);
      }

      beforeHooks.push(function () {
        this.navigation.offStateChange(onStateChange);
      });

      this.$options.beforeDestroy = beforeHooks;

      if (stickyToggleListener.immediate === true) {
        stickyToggleListener.handler.call(componentInstance, this.cardStatus.sticky);
      }
    },

    _isSticky: function _isSticky() {
      var currentRoute = this.navigation.getCurrentRoute();
      if (!currentRoute) return null;

      var cardState = this.navigation.state;
      return cardState.uid === currentRoute.uid && cardState.routeName === currentRoute.routeName;
    }
  },

  render: function render(h) {
    var animationMap = this._formatAnimationMap();
    var initStyle = {
      opacity: animationMap.opacity.current || 1,
      transform: 'translate(' + (animationMap.translateX.current || 0) + ',' + (animationMap.translateY.current || 0) + ')'
    };

    // extend component props to standard screen props
    var defaultProps = { screenProps: Object, navigation: Object };
    this.shallowComponent.props = _extends({}, defaultProps, this.shallowComponent.props);

    var statusBarOptions = {
      custom: false,
      backgroundColor: '#fff'
    };

    var screenStatusBarOptions = this.shallowComponent.StatusBarOptions;
    if (screenStatusBarOptions) {
      if (screenStatusBarOptions.custom === true) {
        statusBarOptions.custom = true;
        statusBarOptions.backgroundColor = 'rgba(255, 255, 255, 255)';
      } else {
        screenStatusBarOptions.backgroundColor && (statusBarOptions.backgroundColor = screenStatusBarOptions.backgroundColor);
      }
    }

    var childNodes = [];

    if (!this.shallowComponent.router && !statusBarOptions.custom) {
      childNodes.push(h(CardStatusBar, {
        props: {
          backgroundColor: statusBarOptions.backgroundColor,
          screenProps: this.screenProps,
          navigation: this.navigation
        }
      }));
    }

    childNodes.push(h('div', {
      staticStyle: { 'stretchWeight': 1, width: '100%' }
    }, [h(this.shallowComponent, {
      props: {
        screenProps: this.screenProps,
        navigation: this.navigation
      }
    })]));

    return h('div', {
      key: this.navigation.state.uid,
      staticStyle: _extends({
        position: 'fixed',
        display: 'flex',
        justification: 'vertical',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
        backgroundColor: '#fff'
      }, initStyle)
    }, childNodes);
  }
};

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule shallowEqual
 * @typechecks
 */

/*eslint-disable no-self-compare */

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }
  if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

var SCENE_KEY_PREFIX = 'scene_';

/**
 * Helper function to compare route keys (e.g. "9", "11").
 */
function compareKey(one, two) {
  var delta = one.length - two.length;
  if (delta > 0) {
    return 1;
  }
  if (delta < 0) {
    return -1;
  }
  return one > two ? 1 : -1;
}

/**
 * Helper function to sort scenes based on their index and view key.
 */
function compareScenes(one, two) {
  if (one.index > two.index) {
    return 1;
  }
  if (one.index < two.index) {
    return -1;
  }

  return compareKey(one.key, two.key);
}

/**
 * Whether two routes are the same.
 */
function areScenesShallowEqual(one, two) {
  return one.key === two.key && one.index === two.index && one.isStale === two.isStale && one.isActive === two.isActive && areRoutesShallowEqual(one.route, two.route);
}

/**
 *
 * */
function uniqueScenesWithIndex(scenes) {
  var indexPrevScenes = {};

  scenes.splice(0, scenes.length).forEach(function (scene) {
    var index = scene.index;

    var indexPrevScene = indexPrevScenes[index];

    if (!indexPrevScene) {
      indexPrevScenes[index] = scene;
      return;
    }

    if (indexPrevScene.isStale) {
      indexPrevScenes[index] = scene;
    }
  });

  for (var index in indexPrevScenes) {
    if (!indexPrevScenes.hasOwnProperty(index)) continue;
    scenes.push(indexPrevScenes[index]);
  }
}

/**
 * Whether two routes are the same.
 */
function areRoutesShallowEqual(one, two) {
  if (!one || !two) {
    return one === two;
  }

  if (one.key !== two.key) {
    return false;
  }

  return shallowEqual(one, two);
}

function ScenesReducer(scenes, nextState, prevState) {
  if (prevState === nextState) {
    return scenes;
  }

  var prevScenes = new Map();
  var freshScenes = new Map();
  var staleScenes = new Map();

  // Populate stale scenes from previous scenes marked as stale.
  scenes.forEach(function (scene) {
    var key = scene.key;

    if (scene.isStale) {
      staleScenes.set(key, scene);
    }
    prevScenes.set(key, scene);
  });

  var nextKeys = new Set();
  nextState.routes.forEach(function (route, index) {
    var key = SCENE_KEY_PREFIX + route.uid;
    var scene = {
      index: index,
      isActive: false,
      isStale: false,
      key: key,
      route: route
    };
    invariant(!nextKeys.has(key), 'navigation.state.routes[' + index + '].key "' + key + '" conflicts with ' + 'another route!');
    nextKeys.add(key);

    if (staleScenes.has(key)) {
      // A previously `stale` scene is now part of the nextState, so we
      // revive it by removing it from the stale scene map.
      staleScenes.delete(key);
    }
    freshScenes.set(key, scene);
  });

  if (prevState) {
    // Look at the previous routes and classify any removed scenes as `stale`.
    prevState.routes.forEach(function (route, index) {
      var key = SCENE_KEY_PREFIX + route.uid;
      if (freshScenes.has(key)) {
        return;
      }
      staleScenes.set(key, {
        index: index,
        isActive: false,
        isStale: true,
        key: key,
        route: route
      });
    });
  }

  var nextScenes = [];

  var mergeScene = function mergeScene(nextScene) {
    var key = nextScene.key;

    var prevScene = prevScenes.has(key) ? prevScenes.get(key) : null;
    if (prevScene && areScenesShallowEqual(prevScene, nextScene)) {
      // Reuse `prevScene` as `scene` so view can avoid unnecessary re-render.
      // This assumes that the scene's navigation state is immutable.
      nextScenes.push(prevScene);
    } else {
      nextScenes.push(nextScene);
    }
  };

  staleScenes.forEach(mergeScene);
  freshScenes.forEach(mergeScene);

  uniqueScenesWithIndex(nextScenes);

  nextScenes.sort(compareScenes);

  var activeScenesCount = 0;
  nextScenes.forEach(function (scene, ii) {
    var isActive = !scene.isStale && scene.index === nextState.index;
    if (isActive !== scene.isActive) {
      nextScenes[ii] = _extends({}, scene, {
        isActive: isActive
      });
    }
    if (isActive) {
      activeScenesCount++;
    }
  });

  invariant(activeScenesCount === 1, 'there should always be only one scene active, not %s.', activeScenesCount);

  if (nextScenes.length !== scenes.length) {
    return nextScenes;
  }

  if (nextScenes.some(function (scene, index) {
    return !areScenesShallowEqual(scenes[index], scene);
  })) {
    return nextScenes;
  }

  // scenes haven't changed.
  return scenes;
}

/**
 * Utility that builds the style for the card in the cards stack.
 *
 *     +------------+
 *   +-+            |
 * +-+ |            |
 * | | |            |
 * | | |  Focused   |
 * | | |   Card     |
 * | | |            |
 * +-+ |            |
 *   +-+            |
 *     +------------+
 */

/**
 * Render the initial style when the initial layout isn't measured yet.
 */
function forInitial(props) {
  var current = props.current,
      scene = props.scene;


  var focused = current === scene.index;
  var opacity = focused ? 1 : 0;
  // If not focused, move the scene far away.
  var translate = focused ? 0 : 1000000;
  return {
    opacity: opacity,
    translateX: translate,
    translateY: translate
  };
}

/**
 * Standard iOS-style slide in from the right.
 */
function forHorizontal(props) {
  var layout = props.layout,
      scene = props.scene;


  if (!layout.isMeasured) {
    return forInitial(props);
  }

  var index = scene.index;
  var inputRange = [index - 1, index, index + 1];

  var width = layout.initWidth;
  var outputRange = [width, 0, width * -0.3];

  // Add [index - 1, index - 0.99] to the interpolated opacity for screen transition.
  // This makes the screen's shadow to disappear smoothly.
  var opacity = {
    inputRange: [index - 1, index, index + 1],
    outputRange: [0, 1, 0]
  };

  var translateY = 0;
  var translateX = {
    inputRange: inputRange,
    outputRange: outputRange
  };

  return {
    opacity: opacity,
    translateX: translateX,
    translateY: translateY
  };
}

/**
 * Standard iOS-style slide in from the bottom (used for modals).
 */
function forVertical(props) {
  var layout = props.layout,
      scene = props.scene;


  if (!layout.isMeasured) {
    return forInitial(props);
  }

  var index = scene.index;
  var height = layout.initHeight;

  var opacity = {
    inputRange: [index - 1, index, index + 1],
    outputRange: [0, 1, 0]
  };

  var translateX = 0;
  var translateY = {
    inputRange: [index - 1, index, index + 1],
    outputRange: [height, 0, 0]
  };

  return {
    opacity: opacity,
    translateX: translateX,
    translateY: translateY
  };
}

/**
 * Standard Android-style fade in from the bottom.
 */
function forFadeFromBottomAndroid(props) {
  var layout = props.layout,
      scene = props.scene;

  var index = scene.index;
  var inputRange = [index - 1, index, index + 1];

  if (!layout.isMeasured) {
    return forInitial(props);
  }

  var opacity = {
    inputRange: inputRange,
    outputRange: [0, 1, 0]
  };

  var translateX = 0;
  var translateY = {
    inputRange: inputRange,
    outputRange: [50, 0, 0, 0]
  };

  return {
    opacity: opacity,
    translateX: translateX,
    translateY: translateY
  };
}

var cardStackStyleInterpolator = {
  forHorizontal: forHorizontal,
  forVertical: forVertical,
  forFadeFromBottomAndroid: forFadeFromBottomAndroid
};

// Used for all animations unless overriden
var DefaultTransitionSpec = {
  duration: 250,
  easing: 'ease-in',
  tween: 'linear'
};

var IOSTransitionSpec = {
  duration: 500,
  easing: 'ease-in',
  tween: 'linear'
};

// Standard iOS navigation transition
var SlideFromRightIOS = {
  transitionSpec: IOSTransitionSpec,
  screenInterpolator: cardStackStyleInterpolator.forHorizontal,
  containerStyle: {
    backgroundColor: '#000'
  }
};

// Standard iOS navigation transition for modals
var ModalSlideFromBottomIOS = {
  transitionSpec: IOSTransitionSpec,
  screenInterpolator: cardStackStyleInterpolator.forVertical,
  containerStyle: {
    backgroundColor: '#000'
  }
};

// Standard Android navigation transition when opening an Activity
var FadeInFromBottomAndroid = {
  transitionSpec: {
    duration: 350,
    easing: 'ease-in',
    tween: 'linear'
  },
  screenInterpolator: cardStackStyleInterpolator.forFadeFromBottomAndroid
};

// Standard Android navigation transition when closing an Activity
var FadeOutToBottomAndroid = {
  transitionSpec: {
    duration: 230,
    easing: 'ease-in',
    tween: 'linear'
  },
  screenInterpolator: cardStackStyleInterpolator.forFadeFromBottomAndroid
};

function defaultTransitionConfig(
// props for the new screen
transitionProps,
// props for the old screen
prevTransitionProps,
// whether we're animating in/out a modal screen
isModal) {
  if (Platform.isAndroid()) {
    // Use the default Android animation no matter if the screen is a modal.
    // Android doesn't have full-screen modals like iOS does, it has dialogs.
    if (prevTransitionProps && transitionProps.index < prevTransitionProps.index) {
      // Navigating back to the previous screen
      return FadeOutToBottomAndroid;
    }
    return FadeInFromBottomAndroid;
  }
  // iOS and other platforms
  if (isModal) {
    return ModalSlideFromBottomIOS;
  }
  return SlideFromRightIOS;
}

function getTransitionConfig(transitionConfigurer,
// props for the new screen
transitionProps,
// props for the old screen
prevTransitionProps, isModal) {
  var defaultConfig = defaultTransitionConfig(transitionProps, prevTransitionProps, isModal);
  if (transitionConfigurer) {
    return _extends({}, defaultConfig, transitionConfigurer());
  }
  return defaultConfig;
}

var transitionConfig = {
  DefaultTransitionSpec: DefaultTransitionSpec,
  defaultTransitionConfig: defaultTransitionConfig,
  getTransitionConfig: getTransitionConfig
};

/**
 * Created by zhiyuan.huang@ddder.net on 17/7/6.
 */

function isSceneNotStale(scene) {
  return !scene.isStale;
}

function isSceneActive(scene) {
  return scene.isActive;
}

var CardStack = {
  name: 'navigation-card-stack',
  props: {
    screenProps: Object,
    router: Object,
    navigation: Object,
    model: String,
    transitionConfig: Function
  },
  data: function data() {
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
    };
  },
  computed: {
    'scene': function scene() {
      return this.scenes.find(isSceneActive);
    },
    'index': function index() {
      return this.scene.index;
    }
  },
  watch: {
    'navigation.state': {
      immediate: true,
      handler: function handler(newState, oldState) {
        var nextScenes = ScenesReducer(this.scenes, newState, oldState);

        if (nextScenes === this.scenes) return;

        var indexHasChanged = oldState && newState.index !== oldState.index;

        if (this._isTransitionRunning) {
          this._queuedTransition = [nextScenes, indexHasChanged];
          return;
        }

        this._startTransition(nextScenes, indexHasChanged);
      }
    }
  },

  methods: {
    getScreenDetails: function getScreenDetails(scene) {
      var self = this;
      var _props = this._props,
          screenProps = _props.screenProps,
          navigation = _props.navigation,
          router = _props.router;

      var screenDetails = this._screenDetails[scene.key];
      if (!screenDetails || screenDetails.state !== scene.route) {
        var screenNavigation = addNavigationHelpers(_extends({}, navigation, {
          state: scene.route,
          dispatch: function dispatch() {
            if (self._isTransitionRunning) return false;
            return navigation.dispatch.apply(navigation, arguments);
          }
        }));
        screenDetails = {
          state: scene.route,
          navigation: screenNavigation,
          options: router.getScreenOptions(screenNavigation, screenProps)
        };
        this._screenDetails[scene.key] = screenDetails;
      }
      return screenDetails;
    },
    renderCard: function renderCard(h, scene) {
      var sceneDetail = this.getScreenDetails(scene);
      var component = this.router.getComponentForRouteName(scene.route.routeName);

      var _getTransitionConfig = this._getTransitionConfig(),
          screenInterpolator = _getTransitionConfig.screenInterpolator;

      var props = {
        screenProps: this.screenProps,
        navigation: sceneDetail.navigation,
        component: component,
        parentPosition: this.position,
        transitionSpec: transitionConfig.DefaultTransitionSpec,

        screenInterpolator: screenInterpolator,
        stackStateIndex: this.navigation.state.index,
        layout: this.layout,
        scene: scene,

        startTransitionRunner: this._startTransitionRunner,
        endTransitionRunner: this._endTransitionRunner
      };

      return h(Card, { props: props, key: scene.key });
    },


    _startTransitionRunner: function _startTransitionRunner() {
      ++this._tRunnerId;
      this._transitionRunners.push(this._tRunnerId);
      return this._tRunnerId;
    },
    _endTransitionRunner: function _endTransitionRunner(runnerId) {
      var i = this._transitionRunners.indexOf(runnerId);
      if (i >= 0) {
        this._transitionRunners.splice(i, 1);
      }

      if (!this._transitionRunners.length) {
        this._endTransition();
      }
    },

    _startTransition: function _startTransition(scenes, indexHasChanged) {
      if (this._screenDetails == null) this._screenDetails = {};

      var screenDetails = this._screenDetails || (this._screenDetails = {});

      this.scenes = scenes;
      this.scenes.forEach(function (newScene) {
        if (screenDetails[newScene.key] && screenDetails[newScene.key].state !== newScene.route) {
          screenDetails[newScene.key] = null;
        }
      });

      this._updatePosition();

      var transitionSpec = transitionConfig.DefaultTransitionSpec;

      if (indexHasChanged) {
        this._isTransitionRunning = true;
        this._tRunnerId = 0;
        this._transitionRunners = [];
      } else {
        this._endTransition();
      }
    },
    _endTransition: function _endTransition() {
      this._transitionRunners = [];

      if (this._queuedTransition) {
        var queuedTransition = this._queuedTransition;
        this._queuedTransition = null;
        this._startTransition.apply(this, toConsumableArray(queuedTransition));
        return;
      }

      this._isTransitionRunning = false;

      var notStaleScenes = this.scenes.filter(isSceneNotStale);
      if (notStaleScenes.length !== this.scenes.length) {
        this._updatePosition();
        this.scenes = notStaleScenes;
      }
    },
    _updatePosition: function _updatePosition() {
      if (this.position.next != null) {
        this.position.current = this.position.next;
      }
      this.position.next = this.navigation.state.index;
    },
    _getTransitionConfig: function _getTransitionConfig() {
      var isModal = this.mode === 'modal';

      /* $FlowFixMe */
      return transitionConfig.getTransitionConfig(this.transitionConfig, {}, {}, isModal);
    }
  },

  render: function render(h) {
    var _this = this;

    return h('div', {
      staticStyle: {
        width: '100%'
      }
    }, this.scenes.map(function (scene, index) {
      return _this.renderCard(h, scene, index);
    }));
  }
};

/**
 * Created by zhiyuan.huang@ddder.net.
 */

function statusBarHelper() {
  var scenes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var sceneComponents = {};

  Object.keys(scenes).forEach(function (key) {
    sceneComponents[key] = Object.assign({}, scenes[key].component);
  });

  return {
    data: function data() {
      return {
        iosStatusBarHeight: 20,

        _sceneStatusBarHeight: 0
      };
    },

    props: {
      activeScene: String
    },

    computed: {
      currentComponent: function currentComponent() {
        if (this.activeScene && sceneComponents.hasOwnProperty(this.activeScene)) return this.activeScene;
        return '';
      },
      sceneComponentHeight: function sceneComponentHeight() {
        return this.currentComponent ? 28 : 0;
      },
      statusBarHeight: function statusBarHeight() {
        if (this.sceneComponentHeight) {
          return this.iosStatusBarHeight + this.sceneComponentHeight;
        } else {
          return this.iosStatusBarHeight > 20 ? this.iosStatusBarHeight : 0;
        }
      }
    },

    methods: {
      getSceneStatusBarHeight: function getSceneStatusBarHeight() {
        return this._sceneStatusBarHeight;
      }
    },

    watch: {
      'statusBarHeight': {
        handler: function handler(newHeight) {
          this._sceneStatusBarHeight = newHeight > 20 ? 0 : 20;

          Node.postNotification('globalSceneStatusBar', this._sceneStatusBarHeight);
        },
        immediate: true
      }
    },

    render: function render(h) {
      var childNodes = [];
      var sceneComponent = this.currentComponent && sceneComponents[this.currentComponent];

      if (sceneComponent) {
        childNodes.push(h('div', {
          staticStyle: {
            height: this.iosStatusBarHeight
          }
        }));
        childNodes.push(h(sceneComponent, {
          staticStyle: {
            height: this.sceneComponentHeight
          }
        }));
      }

      return h('div', {
        staticStyle: {
          width: '100%',
          backgroundColor: '#404040',
          textColor: '#fff',
          height: this.statusBarHeight,
          overflowY: 'hidden'
        }
      }, childNodes);
    }
  };
}

/**
 * Created by zhiyuan.huang@ddder.net on 17/7/6.
 */

function createNavigator(router, routeConfigs, navigatorConfig, navigatorType) {

  return {
    name: 'navigation-navigator',

    data: function data() {
      var data = {};

      if (this.isStateful) {
        data.statusBarScenes = [];
        navigatorConfig.statusBarScenes && Object.keys(navigatorConfig.statusBarScenes).forEach(function (key) {
          var _navigatorConfig$stat = navigatorConfig.statusBarScenes[key],
              component = _navigatorConfig$stat.component,
              priority = _navigatorConfig$stat.priority;


          priority = parseInt(priority);
          if (isNaN(priority)) {
            priority = 1;
          }

          data.statusBarScenes.push({ name: key, component: component, priority: priority, active: false });
        });

        data.statusBarScenes.sort(function (s1, s2) {
          return s1.priority - s2.priority;
        });
      }

      return data;
    },

    props: {
      navigation: {
        type: Object,
        default: function _default() {
          var _this = this;

          this.isStateful = true;

          this.statusBarComponent = statusBarHelper(navigatorConfig.statusBarScenes);

          return addNavigationHelpers({

            getActiveStatusBarScene: function getActiveStatusBarScene() {
              for (var i = 0; i < _this.statusBarScenes.length; ++i) {
                var scene = _this.statusBarScenes[i];
                if (scene.active) return scene.name;
              }
              return '';
            },

            activeStatusBar: function activeStatusBar(sceneName) {
              for (var i = 0; i < _this.statusBarScenes.length; ++i) {
                var scene = _this.statusBarScenes[i];
                if (scene.name === sceneName) {
                  scene.active = true;
                  break;
                }
              }
            },

            disactiveStatusBar: function disactiveStatusBar(sceneName) {
              for (var i = 0; i < _this.statusBarScenes.length; ++i) {
                var scene = _this.statusBarScenes[i];
                if (scene.name === sceneName) {
                  scene.active = false;
                  break;
                }
              }
            },

            sceneStatusBarHeight: function sceneStatusBarHeight() {
              return _this.$children[0].getSceneStatusBarHeight();
            },

            stateChangeListeners: new Set(),
            handleStateChange: function handleStateChange(state, prevState) {
              var listenersIterator = _this.navigation.stateChangeListeners.values();
              var iteStep = listenersIterator.next();

              // don't want to use babel for-of transformer because nextly do not support Symbol
              while (!iteStep.done) {
                iteStep.value(state, prevState);
                iteStep = listenersIterator.next();
              }
            },
            onStateChange: function onStateChange(cb) {
              _this.navigation.stateChangeListeners.add(cb);
            },
            offStateChange: function offStateChange(cb) {
              _this.navigation.stateChangeListeners.delete(cb);
            },

            getCurrentRoute: function getCurrentRoute() {
              var findCurrentRoute = function findCurrentRoute(navState) {
                if (navState.index !== undefined) {
                  return findCurrentRoute(navState.routes[navState.index]);
                }
                return {
                  uid: navState.uid,
                  key: navState.key,
                  routeName: navState.routeName
                };
              };
              return findCurrentRoute(_this.navigation.state);
            },

            dispatch: function dispatch(action) {
              var state = _this.navigation.state;
              var nextState = router.getStateForAction(action, state);
              if (nextState && nextState !== state) {
                _this.navigation.state = nextState;
                _this.navigation.handleStateChange(nextState, state);
                return true;
              }
              return false;
            },
            state: router.getStateForAction(NavigationActions.init())
          });
        }
      },
      screenProps: {
        type: Object,
        default: null
      }
    },

    computed: {
      activeStatusBarScene: function activeStatusBarScene() {
        return this.navigation.getActiveStatusBarScene();
      }
    },

    // static
    navigatorType: navigatorType,
    navigatorConfig: navigatorConfig,
    router: router,

    mounted: function mounted() {
      // todo: add listener to open url and backpress event
    },

    beforeDestroy: function beforeDestroy() {
      // todo: remove listener to open url or backpress event
    },

    render: function render(h) {
      var props = _extends({}, this._props, {
        router: router,
        navigation: this.navigation
      });

      if (this.isStateful) {
        return h('div', {
          staticStyle: {
            display: 'flex',
            justification: 'vertical',

            position: 'fixed',
            height: '100%',
            width: '100%',
            top: 0,
            left: 0
          }
        }, [h(this.statusBarComponent, { props: { activeScene: this.activeStatusBarScene } }), h(CardStack, { staticStyle: { 'stretch-weight': 1 }, props: props })]);
      } else {
        return h(CardStack, { staticStyle: { position: 'fixed', height: '100%' }, props: props });
      }
    }
  };
}

var isarray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
// Match escaped characters that would otherwise appear in future matches.
// This allows the user to escape special characters that won't transform.
'(\\\\.)',
// Match Express-style parameters and un-named parameters with a prefix
// and optional suffixes. Matches appear as:
//
// "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
// "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
// "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
'([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse(str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue;
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?'
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens;
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile(str, options) {
  return tokensToFunction(parse(str, options));
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty(str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk(str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (_typeof(tokens[i]) === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue;
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue;
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined');
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`');
        }

        if (value.length === 0) {
          if (token.optional) {
            continue;
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty');
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`');
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue;
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"');
      }

      path += token.prefix + segment;
    }

    return path;
  };
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1');
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup(group) {
  return group.replace(/([=!:$\/()])/g, '\\$1');
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys(re, keys) {
  re.keys = keys;
  return re;
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags(options) {
  return options.sensitive ? '' : 'i';
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp(path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys);
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp(path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys);
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp(path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options);
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp(tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */keys || options;
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys);
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp(path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */keys || options;
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */keys);
  }

  if (isarray(path)) {
    return arrayToRegexp( /** @type {!Array} */path, /** @type {!Array} */keys, options);
  }

  return stringToRegexp( /** @type {string} */path, /** @type {!Array} */keys, options);
}

/**
 * Created by zhiyuan.huang@ddder.net on 17/7/6.
 */

function validateRouteConfigMap(routeConfigs) {
    var routeNames = Object.keys(routeConfigs);
    invariant(routeNames.length > 0, 'Please specify at least one route when configuring a navigator.');

    routeNames.forEach(function (routeName) {
        var routeConfig = routeConfigs[routeName];

        invariant(routeConfig.screen || routeConfig.getScreen, 'Route \'' + routeName + '\' should declare a screen. ' + 'For example:\n\n' + "import MyScreen from './MyScreen';\n" + '...\n' + (routeName + ': {\n') + '  screen: MyScreen,\n' + '}');

        if (routeConfig.screen && routeConfig.getScreen) {
            invariant(false, 'Route \'' + routeName + '\' should declare a screen or ' + 'a getScreen, not both.');
        }
    });
}

/**
 * Simple helper that gets a single screen (React component or navigator)
 * out of the navigator config.
 */
function getScreenForRouteName(routeConfigs, routeName) {
  var routeConfig = routeConfigs[routeName];

  invariant(routeConfig, 'There is no route defined for key ' + routeName + '.\n' + ('Must be one of: ' + Object.keys(routeConfigs).map(function (a) {
    return '\'' + a + '\'';
  }).join(',')));

  if (routeConfig.screen) {
    return routeConfig.screen;
  }

  if (typeof routeConfig.getScreen === 'function') {
    var screen = routeConfig.getScreen();
    invariant(typeof screen === 'function', 'The getScreen defined for route \'' + routeName + ' didn\'t return a valid ' + 'screen or navigator.\n\n' + 'Please pass it like this:\n' + (routeName + ': {\n  getScreen: () => require(\'./MyScreen\').default\n}'));
    return screen;
  }

  invariant(false, 'Route ' + routeName + ' must define a screen or a getScreen.');
}

/**
 * Make sure screen options returned by the `getScreenOption` are valid
 */
var validateScreenOptions = (function (screenOptions, route) {
  if (typeof screenOptions.title === 'function') {
    invariant(false, ['`title` cannot be defined as a function in navigation options for `' + route.routeName + '` screen. \n', 'Try replacing the following:', '{', '    title: ({ state }) => state...', '}', '', 'with:', '({ navigation }) => ({', '    title: navigation.state...', '})'].join('\n'));
  }
});

function applyConfig(configurer, navigationOptions, configProps) {
  if (typeof configurer === 'function') {
    return _extends({}, navigationOptions, configurer(_extends({}, configProps, {
      navigationOptions: navigationOptions
    })));
  }
  if ((typeof configurer === 'undefined' ? 'undefined' : _typeof(configurer)) === 'object') {
    return _extends({}, navigationOptions, configurer);
  }
  return navigationOptions;
}

var createConfigGetter = (function (routeConfigs, navigatorScreenConfig) {
  return function (navigation, screenProps) {
    var route = navigation.state,
        dispatch = navigation.dispatch;
    var routes = route.routes,
        index = route.index;


    invariant(route.routeName && typeof route.routeName === 'string', 'Cannot get config because the route does not have a routeName.');

    var Component = getScreenForRouteName(routeConfigs, route.routeName);

    var outputConfig = {};

    if (Component.router) {
      invariant(route && routes && index != null, 'Expect nav state to have routes and index, ' + JSON.stringify(route));
      var childRoute = routes[index];
      var childNavigation = addNavigationHelpers({
        state: childRoute,
        dispatch: dispatch
      });
      outputConfig = Component.router.getScreenOptions(childNavigation, screenProps);
    }

    var routeConfig = routeConfigs[route.routeName];

    var routeScreenConfig = routeConfig.navigationOptions;
    var componentScreenConfig = Component.navigationOptions;

    var configOptions = { navigation: navigation, screenProps: screenProps || {} };

    outputConfig = applyConfig(navigatorScreenConfig, outputConfig, configOptions);
    outputConfig = applyConfig(componentScreenConfig, outputConfig, configOptions);
    outputConfig = applyConfig(routeScreenConfig, outputConfig, configOptions);

    validateScreenOptions(outputConfig, route);

    return outputConfig;
  };
});

/**
 * Created by zhiyuan.huang@ddder.net on 17/7/6.
 */

var uniqueBaseId = 'id-' + Date.now();
var uuidCount = 0;

function _getUuid() {
  return uniqueBaseId + '-' + uuidCount++;
}

var StackRouter = function (routeConfigs) {
  var stackConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  validateRouteConfigMap(routeConfigs);

  var childRouters = {};
  var routeNames = Object.keys(routeConfigs);

  routeNames.forEach(function (routeName) {
    var screen = getScreenForRouteName(routeConfigs, routeName);
    if (screen && screen.router) {
      childRouters[routeName] = screen.router;
    } else {
      childRouters[routeName] = null;
    }
  });

  var initialRouteParams = stackConfig.initialRouteParams;


  if (initialRouteParams) {
    initialRouteParams = Object.freeze(initialRouteParams);
  }

  var initialRouteName = stackConfig.initialRouteName || routeNames[0];

  var initialChildRouter = childRouters[initialRouteName];
  var paths = stackConfig.paths || {};

  routeNames.forEach(function (routeName) {
    var pathPattern = paths[routeName] || routeConfigs[routeName].path;
    var matchExact = !!pathPattern && !childRouters[routeName];
    if (typeof pathPattern !== 'string') {
      pathPattern = routeName;
    }
    var keys = [];
    var re = pathToRegexp(pathPattern, keys);
    if (!matchExact) {
      var wildcardRe = pathToRegexp(pathPattern + '/*', keys);
      re = new RegExp('(?:' + re.source + ')|(?:' + wildcardRe.source + ')');
    }
    paths[routeName] = { re: re, keys: keys, toPath: compile(pathPattern) };
  });

  return {
    getComponentForState: function getComponentForState(state) {
      var activeChildRoute = state.routes[state.index];
      var routeName = activeChildRoute.routeName;

      if (childRouters[routeName]) {
        return childRouters[routeName].getComponentForState(activeChildRoute);
      }
      return getScreenForRouteName(routeConfigs, routeName);
    },
    getComponentForRouteName: function getComponentForRouteName(routeName) {
      return getScreenForRouteName(routeConfigs, routeName);
    },
    getStateForAction: function getStateForAction(action, state) {
      if (action && action.params) {
        action.params = Object.freeze(action.params);
      }

      // Set up the initial state if needed
      if (!state) {
        var route = {};
        if (action.type === NavigationActions.NAVIGATE && childRouters[action.routeName] !== undefined) {
          var _key = 'Init-' + _getUuid();
          return {
            index: 0,
            routes: [_extends({}, action, {
              type: undefined,
              key: _key,
              uid: _key
            })]
          };
        }
        if (initialChildRouter) {
          route = initialChildRouter.getStateForAction(NavigationActions.navigate({
            routeName: initialRouteName,
            params: initialRouteParams
          }));
        }
        var params = (route.params || action.params || initialRouteParams) && _extends({}, route.params || {}, action.params || {}, initialRouteParams || {});

        var key = 'Init-' + _getUuid();
        route = _extends({}, route, {
          routeName: initialRouteName,
          key: key,
          uid: key
        }, params ? { params: params } : {});
        // eslint-disable-next-line no-param-reassign
        state = {
          index: 0,
          routes: [route]
        };
      }

      // Check if a child scene wants to handle the action as long as it is not a reset to the root stack
      if (action.type !== NavigationActions.RESET || action.key !== null) {
        var keyIndex = action.key ? StateUtils.indexOf(state, action.key) : -1;
        var childIndex = keyIndex >= 0 ? keyIndex : state.index;
        var childRoute = state.routes[childIndex];
        var childRouter = childRouters[childRoute.routeName];
        if (childRouter) {
          var _route = childRouter.getStateForAction(action, childRoute);
          if (_route === null) {
            return state;
          }
          if (_route && _route !== childRoute) {
            return StateUtils.replaceAt(state, childRoute.key, _route);
          }
        }
      }

      // Handle explicit push navigation action
      if (action.type === NavigationActions.NAVIGATE && childRouters[action.routeName] !== undefined) {
        var _childRouter = childRouters[action.routeName];
        var _route2 = void 0;
        var _key2 = _getUuid();
        if (_childRouter) {
          var childAction = action.action || NavigationActions.init({ params: action.params });
          _route2 = _extends({
            params: action.params
          }, _childRouter.getStateForAction(childAction), {
            key: _key2,
            uid: _key2,
            routeName: action.routeName
          });
        } else {
          _route2 = {
            params: action.params,
            key: _key2,
            uid: _key2,
            routeName: action.routeName
          };
        }
        return StateUtils.push(state, _route2);
      }

      // Handle navigation to other child routers that are not yet pushed
      if (action.type === NavigationActions.NAVIGATE) {
        var childRouterNames = Object.keys(childRouters);
        for (var i = 0; i < childRouterNames.length; i++) {
          var childRouterName = childRouterNames[i];
          var _childRouter2 = childRouters[childRouterName];
          if (_childRouter2) {
            // For each child router, start with a blank state
            var initChildRoute = _childRouter2.getStateForAction(NavigationActions.init());
            // Then check to see if the router handles our navigate action
            var navigatedChildRoute = _childRouter2.getStateForAction(action, initChildRoute);
            var routeToPush = null;
            if (navigatedChildRoute === null) {
              // Push the route if the router has 'handled' the action and returned null
              routeToPush = initChildRoute;
            } else if (navigatedChildRoute !== initChildRoute) {
              // Push the route if the state has changed in response to this navigation
              routeToPush = _childRouter2.getStateForAction(action);
            }
            if (routeToPush) {
              var _key3 = _getUuid();
              return StateUtils.push(state, _extends({}, routeToPush, {
                key: _key3,
                uid: _key3,
                routeName: childRouterName
              }));
            }
          }
        }
      }

      if (action.type === NavigationActions.SET_PARAMS) {
        var lastRoute = state.routes.find(function (route) {
          return route.key === action.key;
        });
        if (lastRoute) {
          var _params = _extends({}, lastRoute.params, action.params);
          var routes = [].concat(toConsumableArray(state.routes));
          routes[state.routes.indexOf(lastRoute)] = _extends({}, lastRoute, {
            params: _params
          });
          return _extends({}, state, {
            routes: routes
          });
        }
      }

      if (action.type === NavigationActions.RESET) {
        var resetAction = action;

        return _extends({}, state, {
          routes: resetAction.actions.map(function (childAction) {
            var router = childRouters[childAction.routeName];
            var key = _getUuid();

            if (router) {
              return _extends({}, childAction, router.getStateForAction(childAction), {
                routeName: childAction.routeName,
                key: key,
                uid: key
              });
            }
            var route = _extends({}, childAction, {
              key: key,
              uid: key
            });
            delete route.type;
            return route;
          }),
          index: action.index
        });
      }

      if (action.type === NavigationActions.BACK) {
        var backRouteIndex = null;
        if (action.key) {
          var backRoute = state.routes.find(function (route) {
            return route.key === action.key;
          });
          if (backRoute) {
            backRouteIndex = state.routes.indexOf(backRoute);
          }
        }
        if (backRouteIndex == null) {
          return StateUtils.pop(state);
        }
        if (backRouteIndex > 0) {
          return _extends({}, state, {
            routes: state.routes.slice(0, backRouteIndex),
            index: backRouteIndex - 1
          });
        }
      }

      if (action.key && action.type === NavigationActions.BACK_TO) {
        var backToRoute = state.routes.find(function (route) {
          return route.key === action.key;
        });
        if (backToRoute) {
          var backToRouteIndex = state.routes.indexOf(backToRoute);
          if (backToRouteIndex >= 0) {
            return _extends({}, state, {
              routes: state.routes.slice(0, backToRouteIndex + 1),
              index: backToRouteIndex
            });
          }
        }
      }

      return state;
    },
    getPathAndParamsForState: function getPathAndParamsForState(state) {
      var route = state.routes[state.index];
      var routeName = route.routeName;
      var screen = getScreenForRouteName(routeConfigs, routeName);
      var subPath = paths[routeName].toPath(route.params);

      var path = subPath;
      var params = route.params;

      if (screen && screen.router) {
        // If it has a router it's a navigator.
        // If it doesn't have router it's an ordinary React component.
        var child = screen.router.getPathAndParamsForState(route);
        path = subPath ? subPath + '/' + child.path : child.path;
        params = child.params ? _extends({}, params, child.params) : params;
      }
      return {
        path: path,
        params: params
      };
    },
    getActionForPathAndParams: function getActionForPathAndParams(pathToResolve) {
      // If the path is empty (null or empty string)
      // just return the initial route action
      if (!pathToResolve) {
        return NavigationActions.navigate({
          routeName: initialRouteName
        });
      }

      var _pathToResolve$split = pathToResolve.split('?'),
          _pathToResolve$split2 = slicedToArray(_pathToResolve$split, 2),
          pathNameToResolve = _pathToResolve$split2[0],
          queryString = _pathToResolve$split2[1];

      // Attempt to match `pathNameToResolve` with a route in this router's
      // routeConfigs


      var matchedRouteName = void 0;
      var pathMatch = void 0;
      var pathMatchKeys = void 0;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.entries(paths)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = slicedToArray(_step.value, 2),
              routeName = _step$value[0],
              path = _step$value[1];

          var re = path.re,
              keys = path.keys;

          pathMatch = re.exec(pathNameToResolve);
          if (pathMatch && pathMatch.length) {
            pathMatchKeys = keys;
            matchedRouteName = routeName;
            break;
          }
        }

        // We didn't match -- return null
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (!matchedRouteName) {
        return null;
      }

      // Determine nested actions:
      // If our matched route for this router is a child router,
      // get the action for the path AFTER the matched path for this
      // router
      var nestedAction = void 0;
      if (childRouters[matchedRouteName]) {
        nestedAction = childRouters[matchedRouteName].getActionForPathAndParams(pathMatch.slice(pathMatchKeys.length).join('/'));
      }

      // reduce the items of the query string. any query params may
      // be overridden by path params
      var queryParams = (queryString || '').split('&').reduce(function (result, item) {
        if (item !== '') {
          var nextResult = result || {};

          var _item$split = item.split('='),
              _item$split2 = slicedToArray(_item$split, 2),
              key = _item$split2[0],
              value = _item$split2[1];

          nextResult[key] = value;
          return nextResult;
        }
        return result;
      }, null);

      // reduce the matched pieces of the path into the params
      // of the route. `params` is null if there are no params.
      var params = pathMatch.slice(1).reduce(function (result, matchResult, i) {
        var key = pathMatchKeys[i];
        if (key.asterisk || !key) {
          return result;
        }
        var nextResult = result || {};
        var paramName = key.name;
        nextResult[paramName] = matchResult;
        return nextResult;
      }, queryParams);

      return NavigationActions.navigate(_extends({
        routeName: matchedRouteName
      }, params ? { params: params } : {}, nestedAction ? { action: nestedAction } : {}));
    },


    getScreenOptions: createConfigGetter(routeConfigs, stackConfig.navigationOptions)
  };
};

/**
 * Created by zhiyuan.huang@ddder.net on 17/7/6.
 */

var STACK = 'vue-navigation/STACK';
var TABS = 'vue-navigation/TABS';
var DRAWER = 'vue-navigation/DRAWER';

var navigatorTypes = {
  STACK: STACK,
  TABS: TABS,
  DRAWER: DRAWER
};

/**
 * Created by zhiyuan.huang@ddder.net on 17/7/6.
 */

var StackNavigator = (function () {
  var routeConfigMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var stackConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var initialRouteName = stackConfig.initialRouteName,
      initialRouteParams = stackConfig.initialRouteParams,
      paths = stackConfig.paths,
      navigationOptions = stackConfig.navigationOptions;


  var stackRouterConfig = {
    initialRouteName: initialRouteName,
    initialRouteParams: initialRouteParams,
    paths: paths,
    navigationOptions: navigationOptions
  };

  var router = StackRouter(routeConfigMap, stackRouterConfig);
  return createNavigator(router, routeConfigMap, stackConfig, navigatorTypes.STACK);
});

/**
 * Created by zhiyuan.huang@ddder.net on 17/7/10.
 */

var _Vue = void 0;

function install(Vue) {
  if (install.installed) return;
  install.installed = true;

  _Vue = Vue;

  var isDef = function isDef(v) {
    return v !== undefined;
  };

  Vue.mixin({
    beforeCreate: function beforeCreate() {
      // navigation inherit before create as a watcher
      if (!isDef(this.$options.props)) this.$options.props = {};

      if (!isDef(this.$options.props['navigation']) && this.$parent && this.$parent.navigation) {
        var computed = this.$options.computed || (this.$options.computed = {});
        computed.navigation = function () {
          return this.$parent.navigation;
        };
      }
    }
  });
}

/**
 * Created by zhiyuan.huang@ddder.net on 17/7/7.
 */

var index = {
  install: install,

  StateUtils: StateUtils,
  addNavigationHelpers: addNavigationHelpers,
  NavigationActions: NavigationActions,

  createNavigator: createNavigator,
  StackNavigator: StackNavigator,

  StackRouter: StackRouter,

  CardStack: CardStack,
  Card: Card
};

module.exports = index;
