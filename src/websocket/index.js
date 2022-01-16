import { WebSocketMessage } from './message/webMessage'
import vuexStore from '@/store'
import * as logger from '@/utils/logger'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import ReceiveMsgHandler from '@/websocket/handler/receiveMsgHandler'
import { CONNECT, DISCONNECT, HEARTCHECK } from '@/websocket/cmd'
import LocalStore from '@/websocket/localstore'
import ReceiveCollaborateHandler from '@/websocket/handler/receiveCollaborateHandler'

export default class VueWebSocket {
    handlerList = [];
    userDisconnect = false;
    isconnected = false;
    resolvePromiseMap = new Map();
    constructor() {
        const userId = vuexStore.getters.userInfo.id
        this.port = 443
        this.heartbeatTimeout = 25 * 1000
        this.reconnectInterval = 30 * 1000
        this.binaryType = 'blob'
        this.url = process.env.VUE_APP_API_BASE_URL.replace('https://', 'wss://') + '/classcipe/websocket/' + userId + '/' + Math.random().toString(36).substr(-10)
        logger.info('userId :', userId)
        this.initHandlerList()
        this.connect(true)
    }

    connect(isReconncect) {
        this.ws = new WebSocket(this.url)
        logger.info('current url ' + this.url + ' status ' + this.ws.readyState)
        this.ws.binaryType = this.binaryType
        var websocketObj = this
        this.ws.onopen = function (event) {
            logger.info('ws open')
            websocketObj.isconnected = true
            websocketObj.lastInteractionTime(new Date().getTime())
            websocketObj.pingIntervalId = setInterval(() => {
                 websocketObj.ping()
             }, websocketObj.heartbeatTimeout)
             websocketObj.userDisconnect = false
             // 发送connect指令
             websocketObj.sendConnectMessage()
        }
        this.ws.onmessage = function(event) {
            logger.info('ws onmessage[' + event.data + ']')
            websocketObj.processMessage(event.data)
            websocketObj.lastInteractionTime(new Date().getTime())
        }
        this.ws.onclose = function(event) {
            websocketObj.isconnected = false
            logger.info('ws onclose')
            websocketObj.ws.close()
            clearInterval(websocketObj.pingIntervalId)
            if (!websocketObj.userDisconnect) {
                logger.info('reconnect websocket')
                websocketObj.reconnect(event)
            }
        }
        this.ws.onerror = function(event) {
            logger.info('connect error')
        }
    }

    reconnect(event) {
        var websocketObj = this
        setTimeout(() => {
            websocketObj.connect(true)
        }, this.reconnectInterval)
    }

  lastInteractionTime(actionTime) {
    this.actionTime = actionTime
  }

  getLastActionTime() {
    return this.actionTime
  }

    ping() {
        var message = new WebSocketMessage()
        message.setCmd(HEARTCHECK)
        this.send(message.toJson())
    }

    send(data) {
        logger.info('send message ' + data)
        if (this.isconnected) {
            this.ws.send(data)
        } else {
            logger.info('curent websocket is close')
        }
    }

    /**
     * 分发vuex action
     */
    sendAction(type, data) {
        vuexStore.dispatch(type, data)
    }

    initHandlerList() {
        this.handlerList.push(new ReceiveMsgHandler(this))
        this.handlerList.push(new ReceiveCollaborateHandler(this))
    }

    processMessage(data) {
        var protoObj = JSON.parse(data)
        for (var i = 0; i < this.handlerList.length; i++) {
            if (this.handlerList[i].match(protoObj)) {
                 this.handlerList[i].processMessage(protoObj)
            }
        }
    }

    /**
     * 链接建立信息
     */
    sendConnectMessage() {
        logger.info('userToken ' + localStorage.getItem(ACCESS_TOKEN))
        var webMessage = new WebSocketMessage()
        webMessage.setCmd(CONNECT)
        var connectMessage = {
          userId: vuexStore.getters.userInfo.id
        }
        webMessage.content = connectMessage
        logger.info(webMessage.toJson())
        this.send(webMessage.toJson())
    }

    sendDisConnectMessage() {
        var webMessage = new WebSocketMessage()
        webMessage.setCmd(DISCONNECT)
        var disconnectMessage = {
            clearSession: 1
        }
        webMessage.content = disconnectMessage
        logger.info(webMessage.toJson())
        this.send(webMessage.toJson())
        this.userDisconnect = true
    }

    /**
     *
     * @param  cmd
     * @param  toUserIds
     * @param content
     */
    sendMessageToUsers(cmd, toUserIds, content) {
        var webMessage = new WebSocketMessage()
        webMessage.setCmd(cmd)
        webMessage.setTos(toUserIds)
        webMessage.setContent(content)
        var messageId = LocalStore.getMessageId()
        if (messageId > 65535) {
            messageId = 0
        }
        webMessage.setMessageId(++messageId)
        LocalStore.saveMessageId(messageId)
        this.send(webMessage.toJson())

        // var vueWebSocket = this
        // var pubAckPromise = new Promise((resolve) => {
        //      var timeoutId = setTimeout(() => {
        //          if (cmd === MS) {
        //             var failProtoMessage = new WebSocketMessage()
        //             failProtoMessage.setCmd(PUB_ACK)
        //             failProtoMessage.setMessageId(messageId)
        //             failProtoMessage.setContent('')
        //             vueWebSocket.processMessage(failProtoMessage.toJson())
        //          } else {
        //             resolve(new FutureResult(ERROR_CODE, ''))
        //          }
        //      }, 10000)
        //      var resolvePromise = new PromiseResolve(resolve, timeoutId)
        //      resolvePromise.protoMessageId = protoMessageId
        //      vueWebSocket.resolvePromiseMap.set(messageId, resolvePromise)
        // })
        // return pubAckPromise
    }

    sendMessage(protoMessage) {
      this.send(protoMessage)
    }
}
