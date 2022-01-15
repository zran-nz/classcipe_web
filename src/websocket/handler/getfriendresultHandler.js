import AbstractMessageHandler from './abstractmessagehandler'
import { FP } from '../cmd'

export default class GetFriendResultHandler extends AbstractMessageHandler {
    match(proto) {
        return proto.cmd === FP
    }

    processMessage(proto) {
        var friendList = JSON.parse(proto.content)
        var userIds = []
        for (var i in friendList) {
            userIds[i] = friendList[i].friendUid
        }
        this.vueWebsocket.sendAction('updateFriendIds', friendList)
        // this.vueWebsocket.getUserInfos(userIds)
    }
}
