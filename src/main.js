// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// import './mock'

import bootstrap from './core/bootstrap'
import 'vue-photo-preview/dist/skin.css'
import './core/lazy_use' // use lazy load components
import './permission' // permission control
import './utils/filter' // global filter
import './global.less' // global style

import { FormModel } from 'ant-design-vue'

import Moment from 'moment'

import EventBus from './utils/eventBus'
Vue.prototype.$EventBus = EventBus

// import VueRecord from '@codekraft-studio/vue-record'
import preview from 'vue-photo-preview'
import VueClipboard from 'vue-clipboard2'
Vue.use(preview, { maxSpreadZoom: 4 })
Vue.use(VueClipboard)

Vue.use(FormModel)

// formatDate
Vue.filter('formatDate', function (value) {
  return Moment(value).format('YYYY-MM-DD HH:mm:ss')
})

// localFormatDate
Vue.filter('localFormatDate', function (value) {
  return Moment(value).format('LLLL')
})

Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)
// VueRecord for material audio
// Vue.use(VueRecord)

window.umi_plugin_ant_themeVar = themePluginConfig.theme

// globalClick
window.__globalClickHandler = new Map()
Vue.prototype.globalClick = function (callback, pageName = '', reBind = false) {
  if (pageName && window.__globalClickHandler.get(pageName)) {
    if (reBind) {
      document.getElementById('app').removeEventListener('click', function (event) {
        callback(event)
      })
      document.getElementById('app').addEventListener('click', function (event) {
        callback(event)
      })
      window.__globalClickHandler.set(pageName, callback)
    }
  } else {
    document.getElementById('app').addEventListener('click', function (event) {
      callback(event)
    })
    window.__globalClickHandler.set(pageName, callback)
  }
}

new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
