/**
 * Created by zhiyuan.huang@ddder.net on 17/7/6.
 */

'use strict';

import invariant from '../utils/invariant'

export default function validateRouteConfigMap(routeConfigs) {
  const routeNames = Object.keys(routeConfigs);
  invariant(
      routeNames.length > 0,
      'Please specify at least one route when configuring a navigator.'
  );

  routeNames.forEach(routeName => {
    const routeConfig = routeConfigs[routeName];

    invariant(
        routeConfig.screen || routeConfig.getScreen,
        `Route '${routeName}' should declare a screen. ` +
        'For example:\n\n' +
        "import MyScreen from './MyScreen';\n" +
        '...\n' +
        `${routeName}: {\n` +
        '  screen: MyScreen,\n' +
        '}'
    );

    if (routeConfig.screen && routeConfig.getScreen) {
      invariant(
          false,
          `Route '${routeName}' should declare a screen or ` +
          'a getScreen, not both.'
      );
    }
  });
}