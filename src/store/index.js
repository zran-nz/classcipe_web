import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

// default router permission control
import permission from './modules/permission'
import formConfig from './modules/formConfig'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'
import websocket from '@/store/modules/webSocket'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    websocket,
    formConfig
  },
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters
})
