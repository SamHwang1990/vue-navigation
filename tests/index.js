/**
 * Created by zhiyuan.huang@ddder.net on 17/7/7.
 */

'use strict';

const { StackNavigator, install } = require('libs/vue-navigation/index.js')

Vue.use(install)

const rootNavigator = StackNavigator({
    profile: { screen: require('./Profile.vue') },
    foo: { screen: require('./fooNavigator.js') },
    photo: { screen: require('./Photo.vue') },
}, {
    initialRouteName: 'profile',
    initialRouteParams: {
        user_id: 'Sam'
    },
    statusBarScenes: {
        a: {
            component: require('./statusBarScenes/a.vue'),
            priority: 2
        },
        b: {
            component: require('./statusBarScenes/b.vue'),
            priority: 1
        }
    }
})

exports.init = function() {
    new Vue({
        el: '__init__',
        template: '<nav></nav>',
        components: {
            nav: rootNavigator
        }
    })
}