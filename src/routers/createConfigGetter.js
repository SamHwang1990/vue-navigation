import invariant from '../utils/invariant';

import getScreenForRouteName from './getScreenForRouteName';
import addNavigationHelpers from '../addNavigationHelpers';
import validateScreenOptions from './validateScreenOptions';

function applyConfig(configurer, navigationOptions, configProps) {
  if (typeof configurer === 'function') {
    return {
      ...navigationOptions,
      ...configurer({
        ...configProps,
        navigationOptions,
      }),
    };
  }
  if (typeof configurer === 'object') {
    return {
      ...navigationOptions,
      ...configurer,
    };
  }
  return navigationOptions;
}

export default (routeConfigs, navigatorScreenConfig) => (navigation, screenProps) => {
  const {
    state: route,
    dispatch
  } = navigation;

  const { routes, index } = route

  invariant(
    route.routeName && typeof route.routeName === 'string',
    'Cannot get config because the route does not have a routeName.'
  );

  const Component = getScreenForRouteName(routeConfigs, route.routeName);

  let outputConfig = {};

  if (Component.router) {
    invariant(
      route && routes && index != null,
      `Expect nav state to have routes and index, ${JSON.stringify(route)}`
    );
    const childRoute = routes[index];
    const childNavigation = addNavigationHelpers({
      state: childRoute,
      dispatch,
    });
    outputConfig = Component.router.getScreenOptions(
      childNavigation,
      screenProps
    );
  }

  const routeConfig = routeConfigs[route.routeName];

  const routeScreenConfig = routeConfig.navigationOptions;
  const componentScreenConfig = Component.navigationOptions;

  const configOptions = { navigation, screenProps: screenProps || {} };

  outputConfig = applyConfig(
    navigatorScreenConfig,
    outputConfig,
    configOptions
  );
  outputConfig = applyConfig(
    componentScreenConfig,
    outputConfig,
    configOptions
  );
  outputConfig = applyConfig(routeScreenConfig, outputConfig, configOptions);

  validateScreenOptions(outputConfig, route);

  return outputConfig;
};
