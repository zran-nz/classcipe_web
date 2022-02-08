import AbstractMessageHandler from './abstractmessagehandler'
import { COLLABORATE } from '../cmd'
import * as logger from '@/utils/logger'

export default class ReceiveCollaborateHandler extends AbstractMessageHandler {
    match(proto) {
        return proto.cmd === COLLABORATE
    }

    processMessage(proto) {
        // 通知更新系统消息
        logger.info('ReceiveCollaborateHandler : ', proto.cmd)
        this.vueWebsocket.sendAction('receiveCollaborate', proto)
    }
}
