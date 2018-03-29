/**
 * Created by zhiyuan.huang@ddder.net.
 */

'use strict';

export default {
  name: 'Navigation_CardStatusBar',

  data: function() {
    return {
      statusBarHeight: this.navigation.sceneStatusBarHeight()
    }
  },

  props: {
    screenProps: Object,
    navigation: Object,
    backgroundColor: {
      type: String,
      default: '#fff'
    }
  },

  template: `
  <div :style="barStyle" @globalSceneStatusBar.notification="onChangeSceneStatusBar"></div>
  `,

  computed: {
    barStyle: function() {
      return {
        width: '100%',
        height: this.statusBarHeight,
        backgroundColor: this.backgroundColor
      }
    }
  },

  methods: {
    onChangeSceneStatusBar: function(e) {
      this.statusBarHeight = e.iData;
    }
  }
}