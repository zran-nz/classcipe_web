<template>
  <div class='cc-form-header'>
    <div class='cc-header-left'>
      <div class='cc-back-icon' @click='handleBack'>
        <back-arrow-icon />
      </div>
      <div class='cc-header-title'>
        <slot name='left'>
          {{ title }}
        </slot>
      </div>
    </div>
    <div class='cc-header-right'>
      <slot name='right'>
        <form-header-action-bar
          :show-publish="isOwner"
          :show-invite="isOwner"
          :show-collaborate="isOwner || isCollaborater"
          :show-share="isOwner || isCollaborater"
          @invite="handleStartCollaborate"
          @share="handleSharing"
          @collaborate="handleViewComment"
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

export default {
  name: 'FormHeader',
  components: {
    FormHeaderActionBar,
    BackArrowIcon
  },
  data() {
    return {
      publishing: false,
      saving: false,
      typeMap: typeMap,
      editFormNameMode: false,
      formName: '',
      collaborateUserList: [],
      owner: {},
      isShare: false,
      onlineUsers: [this.$store.getters.userInfo.email],
      debounceHiddenHeader: null
    }
  },
  computed: {
    isOwner() {
      return this.$store.getters.userInfo.email === this.form.createBy
    },
    isCollaborater() {
      const index = this.collaborateUserList.findIndex(item => item.email === this.$store.getters.userInfo.email)
      return index > -1
    },
    isEditCollaborater() {
      const index = this.collaborateUserList.findIndex(item => item.email === this.$store.getters.userInfo.email)
      if (index > -1) {
        return this.collaborateUserList[index].permissions === 'Edit'
      }
      return false
    },
    ...mapState({
      removedCollaborate: state => state.websocket.removedCollaborate,
      hiddenHeader: state => state.app.hiddenHeader
    })
  },
  watch: {
    collaborate(val) {
      this.owner = val.owner
      const onlineList = [this.$store.getters.userInfo.email].concat(val.onlineEmails)
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
      const index = this.collaborate.users.findIndex(item => item.email === this.$store.getters.userInfo.email)
      if (index > -1) {
        this.collaborate.users.splice(index, 1)
      }
      this.removedCollaborateAction(false)
    }
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
    }
  },
  created() {
    this.$logger.info('form header name:' + this.form.name + ' lastChangeSavedTime:' + this.lastChangeSavedTime)
    if (this.form && this.form.name) {
      this.formName = this.form.name
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
      if (this.isPreviewMode) {
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
</style>
