export default class UserInfo {
    id = '';
    username = '';
    avatar = '';
    email = '';
    nickname = '';
    firstname = '';
    lastname = '';

    static convert2UserInfo(jsonObj) {
        const userInfo = new UserInfo()
        userInfo.id = jsonObj.id
        userInfo.username = jsonObj.username
        userInfo.avatar = jsonObj.avatar
        userInfo.email = jsonObj.email
        userInfo.nickname = jsonObj.nickname
        userInfo.firstname = jsonObj.firstname
        userInfo.lastname = jsonObj.lastname
        return userInfo
    }
}
