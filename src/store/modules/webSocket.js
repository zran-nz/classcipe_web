import { RECEIVE_MSG, WEBSOCKET_TYPE_INIT } from '@/store/mutation-types'
import VueWebSocket from '@/websocket'
import { COLLABORATE } from '@/websocket/cmd'

const websocket = {
  state: {
    vueSocket: null,
    receiveMsg: false,
    collaborateMsg: null
  },
  mutations: {
    [WEBSOCKET_TYPE_INIT]: (state) => {
      console.log('init VueWebSocket')
      const vueSocket = new VueWebSocket()
      state.vueSocket = vueSocket
    },
    [RECEIVE_MSG]: (state, receiveMsg) => {
      state.receiveMsg = receiveMsg
    },
    [COLLABORATE]: (state, receiveMsg) => {
      state.collaborateMsg = receiveMsg
    }
  },
  actions: {
    initData: ({ commit }) => commit(WEBSOCKET_TYPE_INIT),
    receiveMsg: ({ commit }, receiveMsg) => commit(RECEIVE_MSG, receiveMsg),
    receiveCollaborate: ({ commit }, collaborateMsg) => commit(COLLABORATE, collaborateMsg)
  }
}

export default websocket
