import { RECEIVE_MSG, WEBSOCKET_TYPE_INIT } from '@/store/mutation-types'
import VueWebSocket from '@/websocket'

const websocket = {
  state: {
    vueSocket: null,
    receiveMsg: false
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
    },
    [RECEIVE_MSG]: (state, receiveMsg) => {
      state.receiveMsg = receiveMsg
    }
  },
  actions: {
    initData: ({ commit }) => commit(WEBSOCKET_TYPE_INIT),
    receiveMsg: ({ commit }, receiveMsg) => commit(RECEIVE_MSG, receiveMsg)
  }
}

export default websocket
