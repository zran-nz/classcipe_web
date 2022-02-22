import { RECEIVE_MSG, WEBSOCKET_TYPE_INIT } from '@/store/mutation-types'
import VueWebSocket from '@/websocket'
import { COLLABORATE, SAVE_CONTENT, EVALUATION_SET_CHANGE } from '@/websocket/cmd'

const websocket = {
  state: {
    vueSocket: null,
    receiveMsg: false,
    collaborateMsg: null,
    saveContentMsg: null,
    msgUnreadCount: 0,
    needRefreshCollaborate: '',
    evaluationSet: null
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
    },
    [SAVE_CONTENT]: (state, saveContentMsg) => {
      state.saveContentMsg = saveContentMsg
    },
    SET_UNREAD_COUNT: (state, msgUnreadCount) => {
      state.msgUnreadCount = msgUnreadCount
    },
    SET_REFRESH_COLLABORATE: (state, needRefreshCollaborate) => {
      state.needRefreshCollaborate = needRefreshCollaborate
    },
    [EVALUATION_SET_CHANGE]: (state, evaluationSetMsg) => {
      state.evaluationSet = evaluationSetMsg.content
    }
  },
  actions: {
    initData: ({ commit }) => commit(WEBSOCKET_TYPE_INIT),
    receiveMsg: ({ commit }, receiveMsg) => commit(RECEIVE_MSG, receiveMsg),
    receiveCollaborate: ({ commit }, collaborateMsg) => commit(COLLABORATE, collaborateMsg),
    receiveSaveContentMsg: ({ commit }, saveContentMsg) => commit(SAVE_CONTENT, saveContentMsg),
    refreshCollaborate: ({ commit }, needRefreshCollaborate) => commit('SET_REFRESH_COLLABORATE', needRefreshCollaborate),
    receiveEvaluationSetChange: ({ commit }, evaluationSetMsg) => commit(EVALUATION_SET_CHANGE, evaluationSetMsg)
  }
}

export default websocket
