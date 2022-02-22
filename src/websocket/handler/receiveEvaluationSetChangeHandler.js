import AbstractMessageHandler from './abstractmessagehandler'
import { EVALUATION_SET_CHANGE } from '../cmd'
import * as logger from '@/utils/logger'

export default class ReceiveEvaluationSetChangeHandler extends AbstractMessageHandler {
  match(proto) {
    return proto.cmd === EVALUATION_SET_CHANGE
  }

  processMessage(proto) {
    // 通知更新系统消息
    logger.info('ReceiveEvaluationSetChangeHandler : ', proto.cmd)
    this.vueWebsocket.sendAction('receiveEvaluationSetChange', proto)
  }
}
