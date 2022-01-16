export default class CollborateMsg {
    id = '';
    type = 0;
    fieldName = '';
    inputValue = '';

    static convert2CollborateMsg(jsonObj) {
        const collborateMsg = new CollborateMsg()
        collborateMsg.id = jsonObj.id
        collborateMsg.type = jsonObj.type
        collborateMsg.fieldName = jsonObj.fieldName
        collborateMsg.inputValue = jsonObj.inputValue
        return collborateMsg
    }
}
