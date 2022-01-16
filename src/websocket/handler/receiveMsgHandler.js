import AbstractMessageHandler from './abstractmessagehandler'
import { RECEIVE_MSG } from '../cmd'
import * as logger from '@/utils/logger'
export default class ReceiveMsgHandler extends AbstractMessageHandler {
    match(proto) {
        return proto.cmd === RECEIVE_MSG
    }

    processMessage(proto) {
        // 通知更新系统消息
        logger.info('ReceiveMsgHandler : ', proto.cmd)
        this.vueWebsocket.sendAction('receiveMsg', true)
    }
}
