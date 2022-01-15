import { WEBSOCKET_TYPE_INIT } from '@/store/mutation-types'
import VueWebSocket from '@/websocket'

const websocket = {
  state: {
    vueSocket: null
  },
  mutations: {
    [WEBSOCKET_TYPE_INIT]: (state) => {
      console.log('init VueWebSocket')
      const vueSocket = new VueWebSocket()
      state.vueSocket = vueSocket
      // state.selectTarget = LocalStore.getSelectTarget()
      // const userInfoList = LocalStore.getUserInfoList()
      // if (userInfoList) {
      //   state.userInfoList = userInfoList
      // }
    }
  },
  actions: {
    initData: ({ commit }) => commit(WEBSOCKET_TYPE_INIT)
    // setLang ({ commit }, lang) {
    //   return new Promise((resolve, reject) => {
    //     commit(APP_LANGUAGE, lang)
    //     loadLanguageAsync(lang).then(() => {
    //       resolve()
    //     }).catch((e) => {
    //       reject(e)
    //     })
    //   })
    // }
  }
}

export default websocket
