<template>
  <div class="collaborate-user-list">
    <div class="toggle-header">
      <div v-if="showUser" class="view-back" @click="back()">
        <div class="back-icon">
          <img src="~@/assets/icons/common/back.png" />
        </div>
      </div>
      <div class="toggle-mode-type-wrapper">
        <div class="header-icon"><img src="~@/assets/icons/collaborate/group.png" /></div>
        <div>Invite People</div>
      </div>
    </div>
    <div class="user-select-wrapper">
      <div class="user-search-wrapper">
        <div class="search-header">

          <div
            :class="{'tag-input-wrapper': true, 'active': active, 'tag-dom': true}"
            :style="{ width: selectedUserEmailList.length === 0 ? '100%' : '88%' }"
            @click="handleFocusInput">
            <div class="tag-input-list tag-dom">
              <div class="tag-list tag-dom">
                <a-icon type="search" :style="{ fontSize: '20px','margin-right':'5px' }" />
                <div class="tag-item tag-dom" v-for="(user,index) in selectedUserList" :key="index">
                  <a-tag closable @close="handleCloseTag(user.email)" class="tag-dom input-tag-item">
                    <a-avatar size="small" :src="user.avatar"/>
                    {{ user.email }}
                  </a-tag>
                </div>

                <div class="tag-input tag-dom ">
                  <input
                    type="text"
                    placeholder="Invite teacher by email"
                    @keyup.enter="searchUser"
                    @focus="searchUser"
                    @blur="active = false"
                    @search="searchUser"
                    @keyup="searchUser"
                    v-model="userNameOrEmail"
                    ref="input"
                    class="tag-dom">
                </div>
              </div>
            </div>
          </div>

          <a-select
            :getPopupContainer="trigger => trigger.parentElement"
            size="large"
            default-value="Edit"
            style="width: 10%;height:40px"
            v-model="permission"
            v-if="selectedUserEmailList.length > 0">
            <a-select-option value="Edit">
              Edit
            </a-select-option>
            <a-select-option value="Viewer">
              Viewer
            </a-select-option>
          </a-select>

        </div>

        <template v-if="showUser">

          <div class="user-list">
            <a-skeleton :loading="loading" active>
              <div class="user-item" v-for="(user,index) in userList" :key="index" v-if="userList.length">
                <div class="user-avatar-email">
                  <div class="avatar">
                    <img :src="user.avatar" v-if="collaborateHistoryUserEmails.indexOf(user.email) !== -1" />
                    <img src="~@/assets/icons/collaborate/group.png" v-else />
                  </div>
                  <div class="email">
                    {{ user.nickname }}
                  </div>
                </div>
                <div class="user-name">
                  {{ user.email }}
                </div>
                <div class="action" >
                  <div slot="actions">
                    <div class="action-wrapper">
                      <div v-if="user.email !== $store.getters.userInfo.email" class="action-item" @click="handleAddToSelect(user)">
                        <div class="active-status-icon">
                          <img src="~@/assets/icons/collaborate/round.png" v-if="selectedUserEmailList.indexOf(user.email) === -1"/>
                          <a-icon theme="filled" type="check-circle" v-if="selectedUserEmailList.indexOf(user.email) !== -1" />
                        </div>
                        <div class="action-name"> + Select</div>
                      </div>
                      <div v-else>Owner</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="empty-user" v-if="userList.length === 0">
                <no-more-resources tips="no user found!"/>
              </div>
            </a-skeleton>
          </div>

          <a-checkbox default-checked @change="onChangeSendMessage" class="message-check-wrapper">
            Send a message
          </a-checkbox>
          <div class="message-wrapper" v-if="sendMessage">
            <a-textarea v-model="inviteMessage" placeholder="Entre message" aria-placeholder="Entre message" class="my-textarea" />
          </div>
          <div class="action-line">
            <a-button
              :disabled="selectedUserList.length === 0"
              :loading="conformLoading"
              class="button-item"
              type="primary"
              shape="round"
              @click="handleEnsureSelect"> Confirm </a-button>
          </div>
        </template>
        <a-skeleton :loading="loading" active>
          <template v-if="!showUser">
            <div
              class="collaborate-user"
              v-if="collaborateUserList.length && !showUser">
              <div class="collaborate-title">
                Collaborators({{ collaborateUserList.length }})
              </div>
              <div class="collaborate-user-list">
                <div class="user-item" v-for="(user,index) in collaborateUserList" :key="index">
                  <div class="user-avatar-email">
                    <div class="avatar">
                      <img :src="user.userAvatar" />
                    </div>
                    <div class="email">
                      {{ user.nickName }}
                    </div>
                    <a-tag color="red" style="position: absolute;top: -15px;right: 0px;" v-if="user.linkUser!== 0">
                      Apply to join
                    </a-tag>
                  </div>
                  <div class="user-email">
                    {{ user.userName }}
                  </div>
                  <div class="user-status">
                    <span v-if="user.receiveStatus === 0">
                      Waiting agree...
                    </span>
                    <span v-if="user.receiveStatus === 1 && user.agreeFlag === collaborateStatus.disAgree">
                      Not Accept
                    </span>
                    <span v-if="user.receiveStatus === 1 && user.agreeFlag === collaborateStatus.refuse">
                      Application was rejected
                    </span>
                  </div>
                  <div class="action" >
                    <div slot="actions">
                      <div v-if="user.agreeFlag === collaborateStatus.apply" >
                        <div class="action-wrapper">
                          <a-button class="action-item action-cancel" shape="round" @click="handleAccept(user,collaborateStatus.refuse)">Disagree</a-button>
                          <a-button class="action-ensure action-item" :loading="agreeLoading" type="primary" shape="round" @click="handleAccept(user,collaborateStatus.agree)">Agree</a-button>
                        </div>
                      </div>
                      <div class="action-wrapper" v-else>
                        <a-select default-value="Edit" style="width: 100px;" v-model="user.permissions" @change="handleChange(user)">
                          <a-select-option value="Edit">
                            Edit
                          </a-select-option>
                          <a-select-option value="Viewer">
                            Viewer
                          </a-select-option>
                        </a-select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="no-collaborate-users" v-if="!showUser && collaborateUserList.length === 0">
              <div class="icon">
                <img src="~@/assets/icons/collaborate/no_user.png" />
              </div>
              <div class="tips">
                <a>
                  No collaborated users find
                </a>
              </div>
            </div>

            <div class="link-wrapper">

              <div class="link-setting">
                <a-tooltip placement="top" title="Click to Reset link"><img @click="resetLink" src="~@/assets/icons/collaborate/refresh.png" class="refresh-icon" /></a-tooltip>
                <div class="link-text" >
                  {{ linkUrl }}
                </div>
                <div class="action-copy" @click="handleCopy()" style="width:50px;font-size: 20px;cursor: pointer;">
                  <a-tooltip placement="top" title="Copy link">  <a-icon type="link" /></a-tooltip>
                </div>
                <!--                <div class="action-copy" @click="handleCopy()" style="width:50px;font-size: 20px;cursor: pointer;">-->
                <!--                  <a-tooltip placement="top" title="Send email">   <a-icon type="mail" /></a-tooltip>-->
                <!--                </div>-->

                <!--                <a-button class="action-copy" type="primary" shape="round" @click="handleCopy()">-->
                <!--                  copy-->
                <!--                </a-button>-->
              </div>
              <div class="link-approve">
                <a-radio @click="changeApprove" :checked="approveFlag">Approval confirmation is required when passing the link</a-radio>
              </div>
            </div>
          </template>
        </a-skeleton>
      </div>
    </div>
  </div>
</template>

<script>
import NoMoreResources from '@/components/Common/NoMoreResources'
import {
  CollaboratesAgree,
  CollaboratesInvite,
  CollaboratesSearchUser, CollaboratesUpdate,
  CollaboratesUpdateLink,
  QueryContentCollaborates
} from '@/api/collaborate'
import * as logger from '@/utils/logger'
import { CollaborateStatus } from '@/const/teacher'
import { isEmail } from '@/utils/util'

export default {
  name: 'CollaborateUserList',
  components: { NoMoreResources },
  props: {
    mainContent: {
      type: Object,
      required: true
    },
    contentId: {
      type: String,
      required: true
    },
    contentType: {
      type: Number,
      required: true
    }
  },
  computed: {
    inputWidth () {
      const value = this.inputValue || ''
      const length = value.trim().length * 20 + 22
      return (length > 100 ? length : 100) + 'px'
    },
    selectedUserEmailList () {
      return this.selectedUserList.map(user => {
        return user.email
      })
    },
    collaborateUserEmailList () {
      return this.collaborateUserList.map(user => {
        return user.email
      })
    },
    linkUrl () {
      let linkUrl = this.collaborate.link ? (process.env.VUE_APP_API_BASE_URL + '/collaborate/' + this.collaborate.link.linkCode) : ''
      if (linkUrl.indexOf('https://api') > -1) {
        linkUrl = linkUrl.replace('https://api', 'https://my')
      }
      return linkUrl
    }
  },
  watch: {
  },
  data () {
    return {
      active: false,
      loading: false,
      conformLoading: false,
      userNameOrEmail: null,
      collaborate: {},
      userList: [],
      collaborateUserList: [],
      selectedUserList: [],
      inviteMessage: null,
      publishMessage: null,

      inviteExperts: false,
      inviteAll: false,
      showUser: false,
      approveFlag: false,
      sendMessage: true,
      permission: 'Edit',
      collaborateStatus: CollaborateStatus,
      agreeLoading: false,
      collaborateHistoryUsers: [],
      collaborateHistoryUserEmails: []
    }
  },
  created () {
    this.queryContentCollaborates()
    this.findHistoryUsers()
  },
  methods: {
    handleFocusInput () {
      console.log('handleFocusInput')
      this.$refs['input'].focus()
      this.active = true
    },
    handleCloseTag (email) {
      logger.info('handleCloseTag ' + email)
      const index = this.selectedUserList.findIndex(item => item.email === email)
      if (index !== -1) {
        this.selectedUserList.splice(index, 1)
      }
    },
    handleEnsureSelect () {
      this.$logger.info('handleEnsureSelect', this.selectedUserList)
      const inviteData = {
        id: this.contentId,
        type: this.contentType,
        users: this.selectedUserEmailList,
        permission: this.permission,
        message: this.inviteMessage
      }
      this.conformLoading = true
      CollaboratesInvite(inviteData).then(response => {
        if (response.success) {
          this.showUser = false
          this.$message.success('Invite successfully')
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.conformLoading = false
        this.selectedUserList = []
        this.userNameOrEmail = ''
        this.queryContentCollaborates()
        this.searchUser()
      })
    },
    searchUser () {
      this.showUser = true
      if (!this.userNameOrEmail) {
        this.userList = this.collaborateHistoryUsers
        return
      } else if (!isEmail(this.userNameOrEmail)) {
        // 已经邀请的用户中选择
        this.userList = this.collaborateHistoryUsers.filter(item =>
          item.email.toLowerCase().indexOf(this.userNameOrEmail.toLowerCase()) !== -1 ||
          item.nickname.toLowerCase().indexOf(this.userNameOrEmail.toLowerCase()) !== -1)
        return
      }
      this.loading = true
      CollaboratesSearchUser({ name: this.userNameOrEmail }).then(response => {
        this.$logger.info('SearchUser response', response)
        this.userList = response.result
      }).finally(() => {
        this.loading = false
      })
    },
    findHistoryUsers () {
      CollaboratesSearchUser({ name: '' }).then(response => {
        this.$logger.info('SearchUser response', response)
        this.collaborateHistoryUsers = response.result
        this.collaborateHistoryUserEmails = response.result.map(user => {
          return user.email
        })
      }).finally(() => {
      })
    },
    handleAddToSelect (user) {
      this.$logger.info('handleAddToSelect ' + user.email + ' permisson ' + this.permission)
      const index = this.selectedUserList.findIndex(item => item.email === user.email)
      if (index !== -1) {
        this.selectedUserList.splice(index, 1)
      } else {
        user.permission = this.permission
        this.selectedUserList.push(user)
      }
      this.userNameOrEmail = ''
      this.$logger.info('selectedUserList ', this.selectedUserList)
    },

    handleToggleType (currentType) {
      this.$logger.info('handleToggleType ' + currentType)
      this.userSelectMode = currentType
    },

    handleCancel () {
      this.$logger.info('handleCancel')
      this.$emit('cancel')
    },
    handleCopy () {
      this.$logger.info('handleCopy')
      this.$copyText(this.linkUrl).then(() => {
        this.$message.success('Copy successfully')
      }).catch(() => {
        this.$message.error('Copy failed')
      })
    },
    resetLink () {
      this.collaborate.link.needUpdateCode = true
      CollaboratesUpdateLink(this.collaborate.link).then(response => {
        this.$logger.info('CollaboratesUpdateLink response:', response)
        if (response.success) {
          this.collaborate.link = response.result
          this.$message.success('Reset link successfully')
        }
      }).finally(() => {

      })
    },
    changeApprove () {
      this.approveFlag = !this.approveFlag
      this.collaborate.link.approveFlag = this.approveFlag
      CollaboratesUpdateLink(this.collaborate.link).then(response => {
        this.$logger.info('CollaboratesUpdateLink response:', response)
        if (response.success) {
          this.collaborate.link = response.result
        }
      }).finally(() => {

      })
    },
    queryContentCollaborates () {
      this.collaborate = {}
      this.loading = true
      QueryContentCollaborates({ id: this.contentId, type: this.contentType }).then(response => {
        this.$logger.info('QueryContentCollaborates response:', response)
        if (response.success) {
          this.collaborate = response.result
          this.collaborateUserList = this.collaborate.users
          this.approveFlag = this.collaborate.link.approveFlag
        }
      }).finally(() => {
        this.loading = false
        this.$emit('confirmSelect', this.collaborate)
      })
    },

    onChangeSendMessage (e) {
      console.log(e.target.checked)
      this.sendMessage = e.target.checked
    },
    back () {
      this.showUser = false
      this.selectedUserList = []
      this.userNameOrEmail = ''
    },
    handleAccept (item, flag) {
      this.$logger.info('handleAccept', item)
      this.agreeLoading = true
      CollaboratesAgree({ id: item.id, agreeFlag: flag }).then(res => {
        logger.info('handleApply', res)
        if (flag === this.collaborateStatus.agree) {
          this.$message.success('Agree successfully')
        } else {
          this.$message.success('Disagree successfully')
        }
      }).then(() => {
        this.agreeLoading = false
        this.queryContentCollaborates()
      })
    },
    handleChange (user) {
      this.$logger.info('handleChange', user)
      CollaboratesUpdate(user).then(res => {
        logger.info('handleChange', res)
        this.$message.success('Update successfully')
      }).then(() => {
      })
    }
  }
}
</script>

<style>
.ant-select-dropdown {
  z-index: 1000;
}
</style>
<style lang="less" scoped>
@import "~@/components/index.less";

.collaborate-user-list {
  margin-top: 5px;

  .toggle-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-bottom: 10px;

    .toggle-mode-type-wrapper {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .header-icon{
        img{
          width:40px;
          margin:5px;
        }
      }
      font-size: 16px;
      font-family: Segoe UI;
      font-weight: bold;
      line-height: 20px;
      color: #000000;
      opacity: 1;
    }
  }

  .user-search-wrapper {
    display: flex;
    flex-direction: column;
    opacity: 1;
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 20px;
    .search-header {
      display: flex;
      justify-content:space-between;
      margin: auto;
      width: 90%;
      border-radius: 4px;
      margin-bottom: 10px;
      //padding: 15px 10px 5px 10px;

      .search-line {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .label {
          display: flex;
          flex-direction: row;
          align-items: center;

          img {
            height: 30px;
          }

          .label-title {
            font-family: PingFang SC;
            font-weight: bold;
            color: #11142D;
            padding-left: 10px;
          }
        }

        .search-by-id {
          border-radius: 4px;
          .user-search {
            border-radius: 4px;
            outline: none;
            border: 1px solid rgba(216, 216, 216, 1);
            box-shadow: none;
          }
          .search-icon {
            height: 15px;
          }
        }

        .search-by-group {
          margin-left: 10px;
        }
      }

      .header-label-line {
        padding: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 24px;
        color: #11142D;
        cursor: pointer;

        .label-item-email {
          width: 30%;
        }

        .label-item-name {
          width: 30%;
        }

        .label-item-action {
          width: 40%;
        }
      }

      /deep/ .ant-input{
        border-bottom-left-radius: 30px;
        border-top-left-radius: 30px
      }
    }

    .user-list {
      display: flex;
      padding: 0 10px;
      max-height: 380px;
      width: 90%;
      margin: auto;
      overflow-y: auto;
      border: 1px solid #D8D8D8;
      flex-direction: column;

      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }
      &::-webkit-scrollbar-track {
        border-radius: 3px;
        background: rgba(0,0,0,0.00);
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
      }
      /* 滚动条滑块 */
      &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: rgba(0,0,0,0.12);
        -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
      }
      .empty-user {
        padding: 15px 0;
      }
      .user-item {
        margin: 1px 0;
        //box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        /* box-shadow: 0px 3px 6px rgb(0 0 0 / 16%); */
        border-bottom: 1px solid #D8D8D8;
        opacity: 1;
        border-radius: 4px;
        padding: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        &:last-child{
          border-bottom: none;
        }
        .user-avatar-email {
          width: 40%;
          line-height: 24px;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #000000;
          display: flex;
          flex-direction: row;
          align-items: center;
          .avatar {
            img {
              height: 40px;
              border-radius: 40px;
            }
          }
          .email {
            padding-left: 10px;
          }
        }

        .user-name {
          width: 40%;
          text-align: center;
          font-family: Inter-Bold;
          line-height: 24px;
          padding-left: 15px;
          color: #000000;
        }

        .action {
          width: 20%;
          display: flex;
          text-align: center;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          .action-wrapper {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            .action-item {
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              padding: 0 10px;
              user-select: none;

              .active-status-icon {
                display: flex;
                flex-direction: row;
                align-items: center;
                width: 20px;
                img {
                  height: 18px;
                }

                font-size: 15px;
                color: rgba(21, 195, 154, 1);
              }
              .action-name {
                padding: 0 5px;
              }

              .active-icon {
                img {
                  height: 14px;
                }
              }
            }
          }
        }
      }
    }

    .collaborate-user {
      margin-top:20px;
      min-height:250px;
      .collaborate-title {
        font-size: 16px;
        line-height: 25px;
        width: 90%;
        margin: auto;
        color: #000;
        padding: 5px 18px;
      }
      .collaborate-user-list {
        display: flex;
        width: 90%;
        margin: auto;
        padding: 0px 10px;
        max-height: 380px;
        margin-bottom: 20px;
        overflow-y: auto;
        border: 1px solid #D8D8D8;
        flex-direction: column;

        &::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        &::-webkit-scrollbar-track {
          border-radius: 3px;
          background: rgba(0,0,0,0.00);
          -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
        }
        /* 滚动条滑块 */
        &::-webkit-scrollbar-thumb {
          border-radius: 5px;
          background: rgba(0,0,0,0.12);
          -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
        }
        .empty-user {
          padding: 15px 0;
        }
        .user-item {
          margin: 10px 0;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          opacity: 1;
          border-radius: 4px;
          padding: 10px;
          display: flex;
          flex-direction: row;
          align-items: center;

          .user-avatar-email {
            width: 30%;
            line-height: 24px;
            font-family: Inter-Bold;
            line-height: 24px;
            color: #000000;
            display: flex;
            flex-direction: row;
            align-items: center;
            position: relative;
            .avatar {
              img {
                height: 40px;
                border-radius: 40px;
              }
            }
            .email {
              padding-left: 10px;
            }
          }

          .user-email {
            width: 30%;
            font-family: Inter-Bold;
            text-align: center;
            line-height: 24px;
            padding-left: 15px;
            color: #000000;
          }
          .user-status {
            width: 20%;
            font-family: Inter-Bold;
            text-align: center;
            line-height: 24px;
            padding-left: 15px;
            color: #000000;
          }

          .action {
            width: 20%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            .action-wrapper {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              .action-item {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                padding: 0 10px;
                user-select: none;

                .active-status-icon {
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  width: 20px;
                  img {
                    height: 18px;
                  }

                  font-size: 15px;
                  color: rgba(21, 195, 154, 1);
                }
                .action-name {
                  padding: 0 5px;
                }

                .active-icon {
                  img {
                    height: 14px;
                  }
                }
              }
              .action-ensure{
                margin-left:10px;
              }
            }
          }
        }
      }
    }
  }

  .message-action-wrapper {
    height: 50px;
    display: flex;
    margin-top: 10px;
    padding-bottom: 10px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}

.no-collaborate-users {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin:20px;

  .icon {
    img {
      width: 250px;
    }
  }

  .tips {
    line-height: 24px;
  }
}

.user-select-wrapper {
  min-height: 100px;
}
.action-line {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  .button-item {
    margin-left: 10px;
  }
}
.message-check-wrapper{
  width: 90%;
  margin: 20px auto;
}
.message-wrapper{
  width: 90%;
  margin: 5px auto;
}
.link-wrapper{
  clear:both;
  width: 80%;
  margin:0 auto;
  padding-top: 20px;
  margin-bottom:30px;
  .link-setting{
    margin: 0 auto;
    height: 50px;
    background: #F7F9FD;
    opacity: 1;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .refresh-icon{
      width:30px;
      margin:5px;
      margin-left: 10px;
      cursor: pointer;
    }
    .action-copy{
      line-height: 30px;
    }
    .link-text{
      //max-width: 450px;
      text-align: center;
      overflow: hidden;
      height: 19px;
      font-size: 14px;
      font-family: Segoe UI;
      font-weight: 400;
      line-height: 20px;
      color: #000000;
      opacity: 1;
    }
  }
  .link-approve{
    margin: 0 auto;
    font-size: 12px;
    font-family: Segoe UI;
    font-weight: 400;
    line-height: 20px;
    color: #000000;
    opacity: 1;
    margin-top:20px;
  }
}
.tag-input-wrapper {
  position: relative;
  display: inline-block;
  line-height: @input-height-base;
  text-align: start;
  vertical-align: top;
  color: @text-color;
  cursor: pointer;
  border-radius: 15px;
  transition: all 0.3s;
  padding: 0 @input-padding-horizontal-base;
  border: @border-width-base solid #d9d9d9;
  outline: 0;

  &:hover {
    border-color: @input-hover-border-color;
    border-right-width: @border-width-base !important;
  }

  .tag-input-list {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    min-height: 40px;

    .tag-list {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-items: center;

      .tag-input {
        display: inline-block;
        input {
          border: none;
          outline: none;
          height: @input-height-base;
          border-radius: @border-radius-base;
          position: relative;
          display: inline-block;
          width: 100%;
          padding: @input-padding-vertical-base 0;
          color: @black;
          //font-size: @font-size-lg;
          //line-height: @line-height-base;
          background-color: @input-bg;
          background-image: none;
          border: none;
          font-size: 14px;
          font-family: Inter-Bold;
          line-height: 24px;
          &:focus,
          &:active {
            border: none;
            outline: none;
          }
        }
      }
    }
  }
}

.active {
  border-right-width: @border-width-base !important;
  outline: 0;
  box-shadow: @input-outline-offset @outline-blur-size @outline-width fade(@outline-color, 20%);
}

.input-tag-item {
  border-radius: 26px;
  padding: 3px 10px;
  margin: 2px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #D8D8D8;
  font-size: 12px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #11142D;
}

.view-back {
  cursor: pointer;
  margin-right: 10px;
  position:absolute;
  left: 10px;
  .back-icon {
    img {
      height: 50px;
    }
  }
}
</style>
