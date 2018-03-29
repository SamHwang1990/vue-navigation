/**
 * Created by zhiyuan.huang@ddder.net on 17/7/10.
 */

'use strict';

const { StackNavigator } = require('libs/vue-navigation/index.js')

module.exports = StackNavigator({
    foo: { screen: require('./Foo.vue') },
    profile: { screen: require('./Profile.vue') },
    photo: { screen: require('./Photo.vue') },
})