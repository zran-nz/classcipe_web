import AbstractMessageHandler from './abstractmessagehandler'
import { SAVE_CONTENT } from '../cmd'
import * as logger from '@/utils/logger'

export default class ReceiveSaveContentHandler extends AbstractMessageHandler {
    match(proto) {
        return proto.cmd === SAVE_CONTENT
    }

    processMessage(proto) {
        // 通知更新系统消息
        console.info('ReceiveSaveContentHandler : ', proto.cmd)
        // this.vueWebsocket.sendAction('receiveSaveContentMsg', proto)
    }
}
