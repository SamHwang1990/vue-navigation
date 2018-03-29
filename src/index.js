/**
 * Created by zhiyuan.huang@ddder.net on 17/7/7.
 */

'use strict';

import StateUtils from './routers/StateUtils'
import addNavigationHelpers from './addNavigationHelpers'
import NavigationActions from './NavigationActions'

import createNavigator from './navigators/createNavigator'
import StackNavigator from './navigators/StackNavigator'

import StackRouter from './routers/StackRouter'

import CardStack from './components/CardStack'
import Card from './components/Card'

import { install } from './install'

export default {
  install,

  StateUtils,
  addNavigationHelpers,
  NavigationActions,

  createNavigator,
  StackNavigator,

  StackRouter,

  CardStack,
  Card
}