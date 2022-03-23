import AbstractMessageHandler from './abstractmessagehandler'
import { MSG } from '../cmd'
import * as logger from '@/utils/logger'
import { NotificationTypeMap } from '@/views/dashboard/NotificationTypeMap'
export default class ReceiveMsgHandler extends AbstractMessageHandler {
    match(proto) {
        return proto.cmd === MSG
    }

    processMessage(proto) {
        // 通知更新系统消息
        logger.info('ReceiveMsgHandler : ', proto.cmd)
        logger.info('content : ', proto)
        this.vueWebsocket.sendAction('receiveMsg', true)
        if (proto.content.busType === NotificationTypeMap.collaborateAccepted ||
          proto.content.busType === NotificationTypeMap.collaborateRejected ||
          proto.content.busType === NotificationTypeMap.collaborateInvite ||
          proto.content.busType === NotificationTypeMap.collaborateApply) {
          this.vueWebsocket.sendAction('refreshCollaborate', proto.content.busId)
        } else if (proto.content.busType === NotificationTypeMap.collaborateRemoved) {
        this.vueWebsocket.sendAction('removedCollaborate', proto.content.busId)
      }
    }
}
