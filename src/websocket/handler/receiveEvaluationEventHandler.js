import AbstractMessageHandler from './abstractmessagehandler'
import {
  EVALUATION_SET_CHANGE,
  EVALUATION_ATTENDANCE_CHANGE,
  EVALUATION_TEACHER_SUBMMIT,
  EVALUATION_STUDENT_SUBMMIT,
  EVALUATION_PEER_SUBMMIT
} from '../cmd'
import { EvaluationEventBus } from '@/components/Evaluation/EvaluationEventBus'
import * as logger from '@/utils/logger'

export default class ReceiveEvaluationEventHandler extends AbstractMessageHandler {
  match(proto) {
    return proto.cmd === EVALUATION_SET_CHANGE
  }

  processMessage(proto) {
    // 通知更新系统消息
    logger.info('ReceiveEvaluationEventHandler: ', proto)
    switch (proto.cmd) {
      case EVALUATION_SET_CHANGE:
        EvaluationEventBus.$emit(EVALUATION_SET_CHANGE, proto)
        break
      case EVALUATION_ATTENDANCE_CHANGE:
        EvaluationEventBus.$emit(EVALUATION_ATTENDANCE_CHANGE, proto)
        break
      case EVALUATION_TEACHER_SUBMMIT:
        EvaluationEventBus.$emit(EVALUATION_TEACHER_SUBMMIT, proto)
        break
      case EVALUATION_STUDENT_SUBMMIT:
        EvaluationEventBus.$emit(EVALUATION_STUDENT_SUBMMIT, proto)
        break
      case EVALUATION_PEER_SUBMMIT:
        EvaluationEventBus.$emit(EVALUATION_PEER_SUBMMIT, proto)
        break
      default:
        console.log('Undefined Event ' + proto.cmd, proto)
        break
    }
  }
}
