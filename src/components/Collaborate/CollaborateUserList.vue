<template>
  <div class="collaborate" @click='showUser = false'>
    <div class="toggle-header">
      <div class="toggle-mode-type-wrapper">
        <div class="header-icon"><img src="~@/assets/icons/collaborate/group.png" /></div>
        <div>Invite People</div>
      </div>
    </div>
    <div class="user-select-wrapper">
      <div class="user-search-wrapper">
        <a-skeleton :loading="loading" active>
          <div class="search-content">
            <div class='search-left' :style="{ width: selectedUserEmailList.length === 0 ? '600px' : '500px' }">
              <div
                :class="{'tag-input-wrapper': true, 'active': active, 'tag-dom': true}"
                @click.stop="handleFocusInput">
                <div class="tag-input-list tag-dom">
                  <div class="tag-list tag-dom">
                    <div class="tag-item tag-dom" v-for="(user) in selectedUserList" :key="user.email">
                      <a-tag closable @close="handleCloseTag(user.email)" class="tag-dom input-tag-item">
                        <a-avatar size="small" :src="user.avatar"/>
                        {{ user.email }}
                      </a-tag>
                    </div>

                    <div class="tag-input tag-dom" :style="{ width: selectedUserEmailList.length === 0 ? '220px' : '220px' }">
                      <input
                        v-if='debounceSearchUser'
                        type="text"
                        :placeholder="selectedUserEmailList.length === 0 ? 'Invite teacher by email' : ''"
                        @keyup.enter="debounceSearchUser"
                        @focus="debounceSearchUser"
                        @search="debounceSearchUser"
                        @keyup="debounceSearchUser"
                        v-model="userNameOrEmail"
                        ref="input"
                        class="search-input">
                    </div>
                  </div>
                </div>
              </div>
              <div class='search-user-list' @click.stop='' v-if='showUser'>
                <div class="user-list" :style="{ width: selectedUserEmailList.length === 0 ? '590px' : '500px' }" v-if="displaySelectUserList.length && active">
                  <a-skeleton :loading="loading" active>
                    <div class="user-item" v-for="user in displaySelectUserList" :key="user.email" @click="handleAddToSelect(user)">
                      <div class="user-avatar-email">
                        <div class="avatar">
                          <img :src="user.avatar" v-if="collaborateHistoryUserEmails.indexOf(user.email) !== -1" alt=''/>
                          <img src="~@/assets/icons/collaborate/group.png" v-else alt=''/>
                        </div>
                        <div class='email-name'>
                          <div class="user-name">
                            {{ user.email }}
                          </div>
                          <div class="email">
                            {{ user.nickname }}
                          </div>
                        </div>
                      </div>
                      <div class="action" >
                        <div slot="actions">
                          <div class="action-wrapper">
                          </div>
                        </div>
                      </div>
                    </div>
                  </a-skeleton>
                </div>
              </div>
            </div>
            <a-dropdown v-if="selectedUserEmailList.length">
              <div class='my-collaborate-select'>
                <span class='permission-set'>{{ permission }}</span>
                <a-icon type="caret-down" />
              </div>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a @click="permission = 'Edit'">
                    Edit
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="permission = 'Viewer'">
                    Viewer
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
          <div class='send-message' v-if='selectedUserEmailList.length'>
            <a-checkbox default-checked @change="onChangeSendMessage" class="message-check-wrapper">
              Send a message
            </a-checkbox>
            <div class="message-wrapper" v-if="sendMessage">
              <a-textarea
                :auto-size="{ minRows: 4, maxRows: 6 }"
                allow-clear
                v-model="inviteMessage"
                placeholder="Entre message"
                aria-placeholder="Entre message"
                class="my-collaborate-textarea" />
            </div>
          </div>

          <template v-if='selectedUserEmailList.length === 0'>
            <div
              class="collaborate-user"
              v-if="collaborateUserList.length">
              <div class="collaborate-user-list">
                <div class="user-item" v-for="(user,index) in collaborateUserList" :key="index">
                  <div class="user-avatar-email">
                    <div class="avatar">
                      <img :src="user.userAvatar" />
                    </div>
                    <div class='email-name'>
                      <div class="user-name">
                        {{ user.nickName }}
                      </div>
                      <div class="email">
                        {{ user.userName }}
                      </div>
                    </div>
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
                          <a-button class="action-item action-cancel" shape="round" @click="handleAccept(user,collaborateStatus.refuse)">Reject</a-button>
                          <a-button class="action-ensure action-item" :loading="agreeLoading" type="primary" shape="round" @click="handleAccept(user,collaborateStatus.agree)">Approve</a-button>
                        </div>
                      </div>
                      <div class="action-wrapper" v-else>
                        <div style="width: 80px">
                          <a-dropdown>
                            <a-menu slot="overlay">
                              <a-menu-item @click="handleChange(user,'Edit',index)">
                                <span>Edit</span>
                              </a-menu-item>
                              <a-menu-item @click="handleChange(user,'Viewer',index)">
                                <span>Viewer</span>
                              </a-menu-item>
                              <a-divider style="margin: 10px 0;" />
                              <a-menu-item @click="handleRemove(user,index)">
                                <span>Remove</span>
                              </a-menu-item>
                            </a-menu>
                            <div class='my-collaborate-list-item-select'>
                              <span class='permission-set'>{{ user.permissions }}</span>
                              <a-icon type="caret-down" />
                            </div>
                          </a-dropdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="no-collaborate-users" v-if="collaborateUserList.length === 0">
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
                <a-tooltip placement="top" title="Click to Reset link">
                  <img @click="resetLink" src="~@/assets/icons/collaborate/refresh.png" class="refresh-icon" alt=''/>
                </a-tooltip>
                <div class="link-text" >
                  {{ linkUrl }}
                </div>
                <div class="action-copy" @click="handleCopy()" style="width:40px;font-size: 20px;cursor: pointer;">
                  <a-tooltip placement="top" title="Copy link">  <a-icon type="link" /></a-tooltip>
                </div>
                <div class="action-copy" @click="handleEmail()" style="width:40px;font-size: 20px;cursor: pointer;">
                  <a-tooltip placement="top" title="Send email">   <a-icon type="mail" /></a-tooltip>
                </div>
              </div>
              <div class="link-approve">
                <a-radio @click="changeApprove" :checked="approveFlag">Approval is required for collaborating via this link</a-radio>
              </div>
            </div>
          </template>

          <div class="action-line" v-if='selectedUserEmailList.length'>
            <a-button
              :disabled="selectedUserList.length === 0"
              :loading="conformLoading"
              class="button-item"
              type="primary"
              shape="round"
              @click="handleEnsureSelect"> Confirm </a-button>
          </div>
        </a-skeleton>
      </div>
    </div>

    <a-modal width="600px" title="Invite by email" @cancel="sendEmailVisibility=false" :footer="null" :visible="sendEmailVisibility">
      <a-form-model ref="form" :model="model" :rules="validatorRules">
        <a-form-model-item prop="email" label="email" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="Please input invite email" v-model="model.email" />
        </a-form-model-item>
        <a-button type="primary" :loading="sendLoading" @click="handleSendEmail" style="margin-left: 40%;margin-bottom: 20px;">
          Send an email
        </a-button>
      </a-form-model>
    </a-modal>

  </div>
</template>

<script>
import NoMoreResources from '@/components/Common/NoMoreResources'
import {
  CollaboratesAgree,
  CollaboratesInvite,
  CollaboratesRemove,
  CollaboratesSearchUser,
  CollaboratesSendInviteEmail,
  CollaboratesUpdate,
  CollaboratesUpdateLink,
  QueryContentCollaborates
} from '@/api/collaborate'
import * as logger from '@/utils/logger'
import { CollaborateStatus } from '@/const/teacher'
import { isEmail } from '@/utils/util'
import { MSG } from '@/websocket/cmd'
import { mapGetters } from 'vuex'
import { NotificationTypeMap } from '@/views/dashboard/NotificationTypeMap'
const { debounce } = require('lodash-es')

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
    linkUrl () {
      let linkUrl = this.collaborate.link ? (process.env.VUE_APP_API_BASE_URL + '/collaborate/' + this.collaborate.link.linkCode) : ''
      if (linkUrl.indexOf('https://api') > -1) {
        linkUrl = linkUrl.replace('https://api', 'https://my')
      }
      return linkUrl
    },
    displaySelectUserList () {
      const displayUserList = []
      this.userList.forEach(user => {
        if (this.selectedUserEmailList.indexOf(user.email.trim()) === -1 && user.email.trim() !== this.$store.getters.userInfo.email) {
          displayUserList.push(user)
        }
      })
      return displayUserList
    },
    ...mapGetters({
      vueSocket: 'vueSocket'
    })
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
      collaborateHistoryUserEmails: [],
      sendEmailVisibility: false,
      validatorRules: {
        email: [
          { required: true, type: 'email', message: 'Please input right email!', trigger: 'blur' }
        ]
      },
      model: {},
      sendLoading: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      debounceSearchUser: null
    }
  },
  created () {
    this.debounceSearchUser = debounce(this.searchUser, 500)
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
      const list = []
      this.selectedUserList.forEach(user => {
        if (user.email !== email) {
          list.push(user)
        }
      })
      this.selectedUserList = list
      this.$logger.info('after handleCloseTag', this.selectedUserList)
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
        this.showUser = false
      })
    },
    searchUser () {
      this.$logger.info('searchUser ' + this.userNameOrEmail)
      this.showUser = true
      if (!this.userNameOrEmail) {
        this.userList = this.collaborateHistoryUsers
        return
      } else if (!isEmail(this.userNameOrEmail.trim())) {
        // 已经邀请的用户中选择
        this.userList = this.collaborateHistoryUsers.filter(item =>
          item.email.trim().toLowerCase().indexOf(this.userNameOrEmail.trim().toLowerCase()) !== -1 ||
          item.nickname.trim().toLowerCase().indexOf(this.userNameOrEmail.trim().toLowerCase()) !== -1)
        return
      }
      this.$logger.info('CollaboratesSearchUser ' + this.userNameOrEmail)
      CollaboratesSearchUser({ name: this.userNameOrEmail.trim() }).then(response => {
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
      this.active = false
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
    handleEmail() {
      this.$logger.info('handleEmail')
      this.sendEmailVisibility = true
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
      if (this.approveFlag) {
        this.collaborate.link.needUpdateCode = true
      }
      CollaboratesUpdateLink(this.collaborate.link).then(response => {
        this.$logger.info('CollaboratesUpdateLink response:', response)
        if (response.success) {
          this.collaborate.link = response.result
          this.$copyText(this.linkUrl).then(() => {
            this.$message.success('The link has been reset and copied in your clipboard')
          }).catch(() => {
            this.$message.error('Copy failed')
          })
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
    handleChange (user, permissions, index) {
      user.permissions = permissions
      this.$set(this.collaborateUserList, index, user)
      this.$logger.info('handleChange', user)
      CollaboratesUpdate(user).then(res => {
        logger.info('handleChange', res)
        this.$message.success('Update successfully')
      }).then(() => {
        this.vueSocket.sendMessageToUsers(MSG, [user.userId],
          {
            busType: NotificationTypeMap.changeCollaborate,
            busId: user.sourceId
          })
      })
    },
    handleRemove(user, index) {
      this.$logger.info('handleRemove', user)
      var that = this
      this.$confirm({
        title: 'Confirm remove user',
        content: 'Are you confirm remove user ' + user.nickName + ' ?',
        centered: true,
        onOk: () => {
          CollaboratesRemove(user).then(response => {
            this.$logger.info('handleRemove', response)
            this.$message.success('Remove successfully')
          }).finally(() => {
            that.collaborateUserList.splice(index, 1)
          })
        }
      })
    },
    handleSendEmail () {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.sendLoading = true
          CollaboratesSendInviteEmail({
            id: this.contentId,
            type: this.contentType,
            email: this.model.email
          }).then(res => {
            logger.info('handleChange', res)
            this.$message.success('Send successfully')
          }).finally(() => {
            that.sendLoading = false
            that.sendEmailVisibility = false
            that.model.email = ''
          })
        } else {
          return false
        }
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

.toggle-header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-bottom: 10px;

  .toggle-mode-type-wrapper {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    .header-icon{
      padding-right: 5px;
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
  position: relative;
  .search-content {
    display: flex;
    justify-content: space-between;
    margin: auto;
    width: 100%;
    position: relative;
  }

  .collaborate-user {
    max-height: 250px;
    overflow-y: auto;
    margin-top: 10px;
    .collaborate-user-list {
      display: flex;
      width: 100%;
      max-height: 250px;
      margin-bottom: 10px;
      overflow-y: auto;
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
        opacity: 1;
        cursor: pointer;
        border-radius: 4px;
        padding: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;

        &:hover {
          background: #f1f2f3;
        }

        .user-avatar-email {
          width: 60%;
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
          .email-name {
            padding-left: 10px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;

            .user-name {
              color: #000;
              line-height: 20px;
            }

            .email {
              color: #999;
              line-height: 12px;
            }
          }
        }

        .user-status {
          width: 20%;
          font-family: Inter-Bold;
          text-align: center;
          padding-left: 15px;
          color: #999;
          font-size: 12px;
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

.no-collaborate-users {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin:20px;

  .icon {
    img {
      width: 100px;
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
  margin: 10px auto;
  color: #111;
}

.link-wrapper{
  clear:both;
  width: 100%;
  padding-top: 20px;
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
      margin-left: 10px;
      width: 15px;
      cursor: pointer;
    }
    .action-copy{
      color: #07AB84;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .link-text{
      user-select: all;
      text-align: center;
      overflow: hidden;
      height: 19px;
      font-size: 14px;
      font-family: Segoe UI;
      font-weight: 400;
      line-height: 20px;
      color: #3c4043;
      opacity: 1;
      cursor: pointer;

      &:hover {
        color: #38cfa6;
      }
    }
  }
  .link-approve{
    margin: 10px auto;
    font-size: 12px;
    padding: 0 10px;
    font-family: Segoe UI;
    font-weight: 400;
    line-height: 20px;
    color: #000000;
    opacity: 1;
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
  transition: all 0.3s;
  outline: 0;
  width: 100%;
  background: #f1f3f4;
  -webkit-border-radius: 6px 6px 0 0;
  border-radius: 6px 6px 0 0;
  border-bottom: 1px solid #15C39A;
  padding: 4px 12px;

  &:hover {
    background: #E3E5E6;
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
          background: transparent;
          border: none;
          outline: none;
          height: @input-height-base;
          border-radius: @border-radius-base;
          position: relative;
          display: inline-block;
          padding: @input-padding-vertical-base 0;
          color: @black;
          font-size: 14px;
          font-family: Inter-Bold;
          line-height: 24px;
          margin: 4px;
          width: 100%;
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
  outline: 0;
  background: #E3E5E6;
}

.input-tag-item {
  border-radius: 26px;
  padding: 3px 10px;
  margin: 4px;
  background: #ffffff;
  border: 1px solid #D8D8D8;
  font-size: 13px;
  font-family: Inter-Bold;
  cursor: pointer;
  line-height: 24px;
  font-weight: 500;
  color: #11142D;

  &:hover {
    background: white;
    color: #000000;
  }
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

.my-collaborate-select {
  border: none;
  background: #f1f3f4;
  width: 85px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 50px;
  font-size: 14px;
  color: #5f6368;
  cursor: pointer;

  .permission-set {
    padding-right: 5px;
  }

  &:hover {
    color: #333;
    background: #E3E5E6;
  }
}

.my-collaborate-list-item-select {
  border: none;
  background: #f1f3f4;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 30px;
  height: 30px;
  font-size: 14px;
  color: #5f6368;
  cursor: pointer;

  .permission-set {
    padding-right: 5px;
  }

  &:hover {
    color: #333;
    background: #E3E5E6;
  }
}

.search-user-list {
  position: relative;
  .user-list {
    z-index: 100;
    position: fixed;
    border-top: 1px solid #15C39A;
    background: #fff;
    display: flex;
    max-height: 380px;
    margin: auto;
    overflow-y: auto;
    flex-direction: column;
    box-shadow: 0 3px 3px 3px rgba(0, 0, 0, 0.2);

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
      cursor: pointer;
      opacity: 1;
      border-radius: 4px;
      padding: 10px 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      &:hover {
        background: #f3f3f3;
      }
      &:last-child{
        border-bottom: none;
      }
      .user-avatar-email {
        width: 60%;
        line-height: 24px;
        font-family: Inter-Bold;
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
        .email-name {
          padding-left: 10px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;

          .user-name {
            color: #000;
            line-height: 20px;
          }

          .email {
            color: #999;
            line-height: 12px;
          }
        }
      }

      .action {
        width: 35%;
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
}

.send-message {
}
</style>
