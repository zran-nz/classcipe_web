<template>
  <a-row class='common-form-header'>
    <a-col span='15'>
      <a-space>
        <span class='back-icon' v-if='showBack'>
          <a-icon type='left' />
        </span>
        <a-button class='nav-back-btn' type='link' @click='handleBack' v-if='showBack'>{{ $t('teacher.add-lesson.back') }}</a-button>
        <span> <content-type-icon :type='form.type' /></span>
        <template v-if='form.type === typeMap.classSessionEvaluation'>
          <div class='edit-form-name'>
            <div class='form-name'>
              <template v-if='!editFormNameMode'>{{ form.className ? form.className : 'Untitled session' }}</template>
              <template v-else>
                <a-input v-model='formName' :maxLength='240' @keyup.enter='handleEnsureNewFormName' @click.stop />
              </template>
            </div>
            <div class='class-name'>
              {{ form.name ? form.name : 'Untitled className' }}
            </div>
          </div>
        </template>
        <template v-if='form.type !== typeMap.evaluation'>
          <span class='unit-last-change-time' v-if='lastChangeSavedTime'>
            <span class='unit-nav-title'>
              {{ form.name ? form.name : 'Untitled' }}
            </span>
            <a-divider type='vertical' v-if='!!form.name' />
            {{ $t('teacher.add-lesson.last-change-saved-at-time', { time: lastChangeSavedTime }) }}
          </span>
        </template>
      </a-space>
    </a-col>
    <a-col span='9' class='unit-right-action'>
      <a-space>
        <template v-if='showCollaborate'>
          <div class='collaborate-users' v-if='form.type !== typeMap.classSessionEvaluation'>
            <div :style="{'z-index': 1000-index}" :class="{'item-avator':true,'gray':onlineUsers.indexOf(user.email) === -1}" v-if='index < 5' v-for='(user,index) in collaborateUserList' :key='index'>
              <a-tooltip :title='user.userName' placement='bottom'>
                <a-badge color="green"> <a-avatar :size="30" class='user-item' :src='user.userAvatar' /></a-badge>
              </a-tooltip>
            </div>
            <a-dropdown v-show='collaborateUserList.length > 5' :overlayStyle="{ 'z-index': '3000'}">
              <a class='ant-dropdown-link' style="font-size: 16px;margin-left: 15px;">
                +{{ collaborateUserList.length - 5 }}
              </a>
              <a-menu slot='overlay'>
                <a-menu-item v-if='index > 4' v-for='(user,index) in collaborateUserList' :key='index'>
                  <a-avatar size='small' :class="{'user-item':true,'gray':onlineUsers.indexOf(user.email) === -1}" :src='user.userAvatar' />
                  {{ user.userName }}
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
          <a-tooltip placement='bottom' title='Collaborate' v-show='isOwner && form.type !== typeMap.classSessionEvaluation'>
            <div class='collaborate-comment' @click='handleStartCollaborate'>
              <collaborate-user-icon class='active-icon' />
            </div>
          </a-tooltip>
          <div
            class='collaborate-comment'
            @click='handleViewComment'
            v-if='form.type !== typeMap.evaluation && form.type !== typeMap.classSessionEvaluation && (isOwner || isEditCollaborater)'>
            <comment-icon class='active-icon' />
          </div>
        </template>
        <a-button
          v-show='showShare && (isOwner || isEditCollaborater)'
          @click='handleSharing'
          class='my-form-header-btn'>
          <div class='btn-icon'>
            <a-icon type='share-alt' :style="{ fontSize: '16px' }" />
          </div>
          <div
            class='btn-text'>
            <template v-if='isShare'>
              Sharing
            </template>
            <template v-else>
              Share
            </template>
          </div>
        </a-button>
        <a-button
          v-show='isOwner || isEditCollaborater'
          @click='handleSave'
          :loading='saving'
          class='my-form-header-btn'>
          <div class='btn-icon'>
            <img src='~@/assets/icons/common/form/baocun@2x.png' />
          </div>
          <div
            class='btn-text'
            :data-isOwner="isOwner + ''"
            :data-isEditCollaborater="isEditCollaborater + ''">
            Save & Exit
          </div>
          <!--          <div class="btn-text" v-else>-->
          <!--            Copy & Exit-->
          <!--          </div>-->
        </a-button>
        <a-button
          v-if='isOwner && form.status === 0 && form.type !== typeMap.classSessionEvaluation'
          :loading='publishing'
          class='my-form-header-btn'
          @click='handlePublish(1)'>
          <div class='btn-icon'>
            <img src='~@/assets/icons/common/form/fabu@2x.png' />
          </div>
          <div
            class='btn-text'
            :data-isOwner="isOwner + ''"
            :data-form-status="form.status + ''">
            Save & Publish
          </div>
        </a-button>
        <a-button
          v-if='isOwner && form.status === 1'
          :loading='publishing'
          class='my-form-header-btn'
          @click='handlePublish(0)'>
          <div class='btn-icon'>
            <a-icon style='font-size: 16px' theme='filled' type='down-square' />
          </div>
          <div
            class='btn-text'
            :data-isOwner="isOwner + ''"
            :data-form-status="form.status + ''">
            Unpublish
          </div>
        </a-button>
      </a-space>
    </a-col>
  </a-row>
</template>

<script>

import CommentIcon from '@/assets/icons/collaborate/comment.svg?inline'
import CollaborateUserIcon from '@/assets/icons/collaborate/collaborate_user.svg?inline'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { typeMap } from '@/const/teacher'
import EditIcon from '@/assets/svgIcon/evaluation/bianji.svg?inline'

export default {
  name: 'CommonFormHeader',
  components: {
    CommentIcon,
    ContentTypeIcon,
    EditIcon,
    CollaborateUserIcon
  },
  props: {
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
    }
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
      onlineUsers: [this.$store.getters.userInfo.email]
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
    }
  },
  watch: {
    collaborate(val) {
      this.owner = val.owner
      this.formatUserList(val.users)
    },
    shareStatus(val) {
      console.log('update is share ' + val)
      this.isShare = val === 1
    }
  },
  created() {
    this.$logger.info('form header name:' + this.form.name + ' lastChangeSavedTime:' + this.lastChangeSavedTime)
    if (this.form && this.form.name) {
      this.formName = this.form.name
    }
  },
  methods: {
    formatUserList(users) {
      let userList = [({ userName: this.owner.nickname, userAvatar: this.owner.avatar, email: this.owner.email })]
      userList = userList.concat(users.filter(user => this.onlineUsers.indexOf(user.email) > -1 && user.email !== this.owner.email))
      userList = userList.concat(users.filter(user => this.onlineUsers.indexOf(user.email) === -1 && user.email !== this.owner.email))
      this.collaborateUserList = userList
    },
    handleBack() {
      this.$logger.info('handleBack')
      if (this.isOwner) {
        this.$router.push({ path: '/teacher/main/created-by-me' })
      } else if (this.isCollaborater) {
        this.$router.push({ path: '/teacher/main/shared' })
      } else {
        this.$router.push({ path: '/teacher/main/created-by-me' })
      }

      // this.$emit('back')
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
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.gray {
  filter: grayscale(100%);
  filter: gray;
}

.common-form-header {
  padding: 15px;
  background: #fff;
  z-index: 1000;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  display: flex;
  align-items: center;

  .back-icon {
    color: rgba(24, 37, 82, 1);
  }

  .nav-back-btn {
    padding-left: 0;
    font-size: 14px;
    font-family: Inter-Bold;
    line-height: 24px;
    color: #15C39A;
  }

  .unit-nav-title {
    font-size: 15px;
    font-family: Inter-Bold;
    line-height: 24px;
    color: #182552;
    max-width: 450px;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: middle;
  }

  .unit-last-change-time {
    line-height: 32px;
    font-family: Inter-Bold;
    line-height: 24px;
    color: #aaa;
    font-size: 13px;
  }

  .unit-right-action {
    display: flex;
    //right: 10px;
    justify-content: flex-end;

    .my-form-header-btn {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      background: rgba(21, 195, 154, 0.08);
      border: 1px solid #15C39A;
      border-radius: 20px;
      padding: 15px 20px;
    }

    /deep/ .ant-badge-status-green {
      right: 12px;
      top: 2px;
      background: #52c41a;
    }

    .collaborate-users {
      display: flex;
      min-width: 160px;
      justify-content: flex-end;
      margin-right:10px;
      margin-top: 3px;
      .item-avator{
        margin-right: -15px;
      }
      .user-item {
        margin: 0px 4px;
      }
    }

    .collaborate-comment {
      display: flex;
      cursor: pointer;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      svg {
        width: 30px;
      }
    }
  }
}

.btn-icon {
  height: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  img {
    height: 15px;
    width: 15px;
  }
}

.btn-text {
  font-family: Inter-Bold;
  line-height: 24px;
  color: #15C39A;
  padding-left: 10px;
}

.edit-form-name {
  display: flex;
  flex-direction: row;
  align-items: center;

  .edit-icon {
    margin-left: 10px;
    margin-right: 30px;
    cursor: pointer;

    img {
      width: 17px;
    }
  }

  .class-name {
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: pointer;
    padding: 5px 15px;
    background: #E7E7E7;
    opacity: 1;
    min-width: 60px;
    border-radius: 30px;
    font-size: 14px;
    font-family: Inter-Bold;
    line-height: 24px;
    color: #11142D;
    margin-left: 15px;
  }
}

</style>
