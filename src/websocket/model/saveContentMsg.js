export default class SaveContentMsg {
    id = '';
    type = 0;
    details = {};

    static convert2SaveContentMsg(jsonObj) {
        const contentMsg = new SaveContentMsg()
        contentMsg.id = jsonObj.id
        contentMsg.type = jsonObj.type
        contentMsg.details = jsonObj.details
        return contentMsg
    }
}
