/**
 * Created by zhiyuan.huang@ddder.net on 17/7/6.
 */

'use strict';

import StackRouter from '../routers/StackRouter'
import createNavigator from './createNavigator'
import navigatorTypes from './navigatorTypes'

export default (routeConfigMap = {}, stackConfig = {}) => {
  const {
    initialRouteName,
    initialRouteParams,
    paths,
    navigationOptions,
  } = stackConfig;

  const stackRouterConfig = {
    initialRouteName,
    initialRouteParams,
    paths,
    navigationOptions,
  };

  const router = StackRouter(routeConfigMap, stackRouterConfig);
  return createNavigator(router, routeConfigMap, stackConfig, navigatorTypes.STACK);
}