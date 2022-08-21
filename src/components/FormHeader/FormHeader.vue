<template>
  <div class='cc-form-header'>
    <div class='cc-header-left'>
      <div class='cc-back-icon' @click='handleBack'>
        <slot name='back'>
          <back-arrow-icon />
        </slot>
      </div>
      <div class='cc-header-title' @click='handleBack'>
        <slot name='left'>
          {{ title }}
        </slot>
      </div>
      <div class='last-save-date'>
        <div class='spin' v-if='spin'>
          <a-spin>
            <a-icon slot="indicator" type="loading" style="font-size: 18px" spin />
          </a-spin>
          &nbsp;Saving...
        </div>
        <div class='last-save-date-text' v-if='lastChangeSavedTime && !spin'>
          last save at {{ lastChangeSavedTime }}
        </div>
      </div>
    </div>
    <div class='cc-header-right'>
      <slot name='right'>
        <form-header-action-bar
          :collaborate-user-list="collaborateUserList"
          :online-users="onlineUsers"
          :show-publish="isOwner && userMode !== USER_MODE.SCHOOL"
          :show-invite="showCollaborate && isOwner"
          :show-collaborate="showCollaborate && (isOwner || isCollaborater)"
          :show-share="showShare && (isOwner || isCollaborater)"
          :disable-publish='disablePublish'
          @collaborate="handleStartCollaborate"
          @share="handleSharing"
          @comment="handleViewComment"
          @publish="handlePublish"/>
      </slot>
    </div>
  </div>
</template>

<script>

import BackArrowIcon from '@/assets/v2/icons/back_arrow.svg?inline'
import FormHeaderActionBar from '@/components/FormHeader/FormHeaderActionBar'
import { mapActions, mapState } from 'vuex'
import { typeMap } from '@/const/teacher'
import { Modal } from 'ant-design-vue'
import { USER_MODE } from '@/const/common'

export default {
  name: 'FormHeader',
  components: {
    FormHeaderActionBar,
    BackArrowIcon
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default: () => null
    },
    collaborate: {
      type: Object,
      default: () => null
    },
    lastChangeSavedTime: {
      type: String,
      default: ''
    },
    showCollaborate: {
      type: Boolean,
      default: true
    },
    showBack: {
      type: Boolean,
      default: true
    },
    shareStatus: {
      type: Number,
      default: 0
    },
    showShare: {
      type: Boolean,
      default: true
    },
    isPreviewMode: {
      type: Boolean,
      default: false
    },
    spin: {
      type: Boolean,
      default: false
    },
    disablePublish: {
      type: Boolean,
      default: false
    },
    backByRouter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      publishing: false,
      saving: false,
      typeMap: typeMap,
      editFormNameMode: false,
      formName: '',
      owner: {},
      isShare: false,
      onlineUsers: [],
      collaborateUserList: [],
      debounceHiddenHeader: null,
      USER_MODE: USER_MODE
    }
  },
  computed: {
    isOwner() {
      return this.form && this.user.email === this.form.createBy
    },
    isCollaborater() {
      const index = this.collaborateUserList.findIndex(item => item.email === this.user.email)
      return index > -1
    },
    isEditCollaborater() {
      const index = this.collaborateUserList.findIndex(item => item.email === this.user.email)
      if (index > -1) {
        return this.collaborateUserList[index].permissions === 'Edit'
      }
      return false
    },
    ...mapState({
      user: state => state.user.info,
      removedCollaborate: state => state.websocket.removedCollaborate,
      hiddenHeader: state => state.app.hiddenHeader,
      userMode: state => state.app.userMode
    })
  },
  watch: {
    collaborate(val) {
      this.owner = val.owner
      const onlineList = [this.user.email].concat(val.onlineEmails)
      this.onlineUsers = onlineList
      this.formatUserList(val.users)
    },
    shareStatus(val) {
      console.log('update is share ' + val)
      this.isShare = val === 1
    },
    removedCollaborate: function (newValue) {
      if (newValue && newValue.indexOf(this.form.id) > -1) {
        Modal.error({
          title: 'Alert',
          content: 'You have been removed from the collaborating list of ' + this.form.name,
          okText: 'Ok',
          mask: true,
          onOk: () => {
            this.$router.push({ path: '/teacher/main/created-by-me' })
          }
        })
      }
      const index = this.collaborate.users.findIndex(item => item.email === this.user.email)
      if (index > -1) {
        this.collaborate.users.splice(index, 1)
      }
      this.removedCollaborateAction(false)
    }
  },
  methods: {
    handleMouseEnterOutHoverBar() {
      this.debounceHiddenHeader()
    },
    ...mapActions(['removedCollaborateAction']),
    formatUserList(users) {
      let userList = []
      if (this.owner) {
        userList = [({ userName: this.owner.nickname, userAvatar: this.owner.avatar, email: this.owner.email })]
      }
      if (users) {
        userList = userList.concat(users.filter(user => this.onlineUsers.indexOf(user.email) > -1 && user.email !== this.owner.email))
        userList = userList.concat(users.filter(user => this.onlineUsers.indexOf(user.email) === -1 && user.email !== this.owner.email))
      }
      this.collaborateUserList = userList
    },
    handleBack() {
      this.$logger.info('handleBack')
      if (this.isPreviewMode || this.backByRouter) {
        this.$emit('back')
      } else {
        if (this.isOwner) {
          this.$router.push({ path: '/teacher/main/created-by-me' })
        } else {
          this.$router.push({ path: '/teacher/main/created-by-me' })
        }
      }
    },
    handleSave() {
      this.saving = true
      this.$logger.info('handleSave')
      this.$emit('save')
    },
    handlePublish(status) {
      this.publishing = true
      this.$logger.info('handlePublish')
      this.$emit('publish', status)
    },
    handleStartCollaborate() {
      this.$logger.info('handleStartCollaborate')
      this.$emit('collaborate')
    },

    handleViewComment() {
      this.$emit('view-collaborate')
    },
    handleEnsureNewFormName() {
      this.$logger.info('handleEnsureNewFormName ' + this.form.name)
      this.editFormNameMode = false
      if (this.formName && this.formName !== this.form.name) {
        const data = Object.assign({}, this.form)
        data.name = this.formName
        this.$emit('update-form', data)
      }
      this.$logger.info('editFormNameMode ' + this.editFormNameMode)
    },

    handleSharing() {
      this.sharing = true
      this.$logger.info('handleSharing')
      this.$emit('share')
    },
    formatOnlineEmail(email) {
      return email === this.form.createBy ? 'Owner: ' + email : email
    },

    handleCancelBounce () {
      this.$logger.info('handleCancelBounce')
      this.debounceHiddenHeader.cancel()
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.cc-form-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;

  .cc-header-left {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;

    .cc-back-icon {
      display: flex;
      flex-direction: row;
      align-items: center;
      svg {
        width: 10px;
        height: 10px;
      }
    }

    .cc-header-title {
      font-size: 18px;
      font-family: Arial;
      font-weight: bold;
      color: #171717;
      line-height: 32px;
      padding-left: 10px;
    }
  }
}

.last-save-date {
  margin-left: 10px;
  padding-left: 5px;
  font-size: 12px;
  color: #999;
  line-height: 20px;
}
</style>
