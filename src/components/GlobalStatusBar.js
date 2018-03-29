/**
 * Created by zhiyuan.huang@ddder.net.
 */

'use strict';

export default function statusBarHelper(scenes = {}) {
  let sceneComponents = {};

  Object.keys(scenes).forEach(key => {
    sceneComponents[key] = Object.assign({}, scenes[key].component);
  });

  return {
    data: function() {
      return {
        iosStatusBarHeight: 20,

        _sceneStatusBarHeight: 0
      }
    },

    props: {
      activeScene: String
    },

    computed: {
      currentComponent: function() {
        if (this.activeScene && sceneComponents.hasOwnProperty(this.activeScene)) return this.activeScene;
        return '';
      },
      sceneComponentHeight: function() {
        return this.currentComponent ? 28 : 0;
      },
      statusBarHeight: function() {
        if (this.sceneComponentHeight) {
          return this.iosStatusBarHeight + this.sceneComponentHeight;
        } else {
          return this.iosStatusBarHeight > 20 ? this.iosStatusBarHeight : 0
        }
      }
    },

    methods: {
      getSceneStatusBarHeight: function() {
        return this._sceneStatusBarHeight;
      }
    },

    watch: {
      'statusBarHeight': {
        handler: function(newHeight) {
          this._sceneStatusBarHeight = newHeight > 20 ? 0 : 20;

          Node.postNotification('globalSceneStatusBar', this._sceneStatusBarHeight);
        },
        immediate: true
      }
    },

    render: function(h) {
      const childNodes = [];
      const sceneComponent = this.currentComponent && sceneComponents[this.currentComponent];

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

      return h(
        'div',
        {
          staticStyle: {
            width: '100%',
            backgroundColor: '#404040',
            textColor: '#fff',
            height: this.statusBarHeight,
            overflowY: 'hidden'
          }
        },
        childNodes
      );
    }
  }
};