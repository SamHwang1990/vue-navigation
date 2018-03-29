/**
 * Created by zhiyuan.huang@ddder.net on 17/7/10.
 */

'use strict';

export let _Vue

export function install(Vue) {
  if (install.installed) return
  install.installed = true

  _Vue = Vue

  const isDef = v => v !== undefined

  Vue.mixin({
    beforeCreate: function beforeCreate() {
      // navigation inherit before create as a watcher
      if (!isDef(this.$options.props))
        this.$options.props = {}

      if (!isDef(this.$options.props['navigation']) && this.$parent && this.$parent.navigation) {
        const computed = this.$options.computed || (this.$options.computed = {})
        computed.navigation = function() {
          return this.$parent.navigation
        }
      }
    }
  });
}