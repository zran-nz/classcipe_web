import vuexStore from '@/store'
import UserInfo from '@/websocket/model/userInfo'

export class WebSocketMessage {
    cmd;
    tos;
    messageUid = 0;
    constructor() {
        console.log('constuctor WebSocketMessage')
    }

    setMessageId(messageId) {
        this.messageId = messageId
    }

    setTos(tos) {
      this.tos = tos
    }

    setCmd(cmd) {
        this.cmd = cmd
    }

    setContent(content) {
        this.content = content
    }

    toJson() {
        const message = {
            cmd: this.cmd,
            messageId: this.messageId == null ? 0 : this.messageId,
            content: this.content,
            from: UserInfo.convert2UserInfo(vuexStore.getters.userInfo),
            tos: this.tos,
            timestamp: new Date().getTime()
        }
        return JSON.stringify(message)
    }
}
