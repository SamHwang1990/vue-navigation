/**
 * @flow
 * Created by zhiyuan.huang@ddder.net on 17/7/6.
 */

// FIXME: Include Vue Component Flow Type Declaration
export type VueComponent = {}

export type NavigationState = {
  index: number,
  routes: Array<NavigationRoute>
};

export type NavigationRoute = NavigationLeafRoute | NavigationStateRoute

export type NavigationLeafRoute = {
  key: string,
  routeName: string,
  path?: string,
  params?: NavigationParams,
}

export type NavigationStateRoute = NavigationLeafRoute & NavigationState

export type NavigationParams = {
  [key: string]: string
}

export type NavigationNavigateAction = {
  type: 'Navigation/NAVIGATE',
  routeName: string,
  params?: NavigationParams,
  action?: NavigationNavigateAction,
};

export type NavigationBackAction = {
  type: 'Navigate/BACK',
  key: ?string
};

export type NavigationSetParamsAction = {
  type: 'Navigation/SET_PARAMS',

  // The key of the route where the params should be set
  key: string,

  // The new params to merge into the existing route params
  params?: NavigationParams,
};

export type NavigationInitAction = {
  type: 'Navigation/INIT',
  params?: NavigationParams,
};

export type NavigationResetAction = {
  type: 'Navigation/RESET',
  index: number,
  key?: ?string,
  actions: Array<NavigationNavigateAction>,
};

export type NavigationStackAction =
    | NavigationInitAction
    | NavigationNavigateAction
    | NavigationBackAction
    | NavigationSetParamsAction
    | NavigationResetAction;

export type NavigationTabAction =
    | NavigationInitAction
    | NavigationNavigateAction
    | NavigationBackAction;

export type NavigationAction =
    | NavigationInitAction
    | NavigationStackAction
    | NavigationTabAction;

export type NavigationDispatch<A> = (action: A) => boolean;

export type NavigationScreenComponent<T, Options> = VueComponent & {
  navigationOptions?: {}
}

export type NavigationNavigator<T, State, Action, Options> = VueComponent & {
  router?: NavigationRouter<State, Action, Options>,
  navigationOptions?: {}
}

export type NavigationComponent = NavigationScreenComponent<*, *> | NavigationNavigator<*, *, *, *>;


export type NavigationRouter<State, Action, Options> = {
  getStateForAction: (action: Action, lastState: ?State) => ?State,

  getActionForPathAndParams: ( path: string, params: ?NavigationParams) => ?Action,

  getPathAndParamsForState: (state: State) => { path: string, params?: NavigationParams },

  getComponentForRouteName: (routeName: string) => NavigationComponent,

  getComponentForState: (state: State) => NavigationComponent,

  getScreenOptions: NavigationScreenOptionsGetter<Options, Action>,
}

export type NavigationScreenOptionsGetter<Options, Action> = (
    navigation: NavigationScreenProp<NavigationRoute, Action>,
    screenProps: ?{}
) => Options;

export type NavigationScreenProp<S, A> = {
  state: S,
  dispatch: NavigationDispatch<A>,
  goBack: (routeKey: ?string) => boolean,
  navigate: (
      routeName: string,
      params: ?NavigationParams,
      action: ?NavigationAction
  ) => boolean,
  setParams: (newParams: NavigationParams) => boolean,
};