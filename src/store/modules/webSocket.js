import { RECEIVE_MSG, WEBSOCKET_TYPE_INIT } from '@/store/mutation-types'
import VueWebSocket from '@/websocket'
import { COLLABORATE, SAVE_CONTENT } from '@/websocket/cmd'

const websocket = {
  state: {
    vueSocket: null,
    receiveMsg: false,
    collaborateMsg: null,
    saveContentMsg: null,
    msgUnreadCount: 0,
    needRefreshCollaborate: false,
    removedCollaborate: false,
    changeCollaborate: false
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
    SET_REMOVED_COLLABORATE: (state, removedCollaborate) => {
      state.removedCollaborate = removedCollaborate
    },
    SET_PERMISSION_COLLABORATE: (state, changeCollaborate) => {
      state.changeCollaborate = changeCollaborate
    }
  },
  actions: {
    initData: ({ commit }) => commit(WEBSOCKET_TYPE_INIT),
    receiveMsg: ({ commit }, receiveMsg) => commit(RECEIVE_MSG, receiveMsg),
    receiveCollaborate: ({ commit }, collaborateMsg) => commit(COLLABORATE, collaborateMsg),
    receiveSaveContentMsg: ({ commit }, saveContentMsg) => commit(SAVE_CONTENT, saveContentMsg),
    refreshCollaborateAction: ({ commit }, needRefreshCollaborate) => commit('SET_REFRESH_COLLABORATE', needRefreshCollaborate),
    removedCollaborateAction: ({ commit }, removedCollaborate) => commit('SET_REMOVED_COLLABORATE', removedCollaborate),
    changeCollaborateAction: ({ commit }, changeCollaborate) => commit('SET_PERMISSION_COLLABORATE', changeCollaborate)
  }
}

export default websocket
