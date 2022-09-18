<template>
  <div class='cc-form-header-action-bar'>
    <a-space>
      <div class='collaborate-user-list'>
        <div :style="{'z-index': 1000-index}" :class="{'item-avator':true,'gray':onlineUsers.indexOf(user.email) === -1}" v-if='index < 5' v-for='(user,index) in collaborateUserList' :key='index'>
          <a-tooltip :title="user.email" placement='bottom'>
            <a-badge color="green"> <a-avatar :size="23" class='user-item' :src='user.userAvatar' /></a-badge>
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
      <div class='action-item invite' @click="emitEvent('collaborate')" v-if="showInvite">
        <a-tooltip :title='collaborateTips'>
          <collaborate-icon />
        </a-tooltip>
      </div>
      <div class='action-item collaborate' @click="emitEvent('comment')" v-if="showCollaborate">
        <a-tooltip title='Comment'>
          <message-icon />
        </a-tooltip>
      </div>
      <div class='action-item share' @click="emitEvent('share')" v-if="showShare">
        <a-tooltip title='Share'>
          <share-icon />
        </a-tooltip>
      </div>
      <div class='action-item publish' :class="{'disabled': disablePublish}" @click="disablePublish ? null : emitEvent('publish')" v-if="showPublish">
        <a-tooltip title='Publish'>
          <publish-icon style='width: 20px; height: 20px;' />
        </a-tooltip>
      </div>
    </a-space>
  </div>
</template>

<script>
import CollaborateIcon from '@/assets/v2/icons/collaborate.svg?inline'
import MessageIcon from '@/assets/v2/icons/message.svg?inline'
import InviteIcon from '@/assets/v2/icons/header_invite.svg?inline'
import PublishIcon from '@/assets/v2/icons/publish_new.svg?inline'
import ShareIcon from '@/assets/v2/icons/header_share.svg?inline'

export default {
  name: 'FormHeaderActionBar',
  components: {
    CollaborateIcon,
    MessageIcon,
    InviteIcon,
    PublishIcon,
    ShareIcon
  },
  data() {
    return {}
  },
  computed: {
    collaborateTips() {
      if (this.form.sourceFrom) {
        return 'The function of Collaboration cannot be used for non-original content'
      } else if (!this.form.presentationId || this.form.presentationId.startsWith('fake_')) {
        return 'Please create your slides first.'
      } else {
        return 'Collaborate'
      }
    }
  },
  props: {
    form: {
      type: Object,
      default: () => null
    },
    showInvite: {
      type: Boolean,
      default: false
    },
    showCollaborate: {
      type: Boolean,
      default: false
    },
    showPublish: {
      type: Boolean,
      default: false
    },
    showShare: {
      type: Boolean,
      default: false
    },
    onlineUsers: {
      type: Array,
      default: () => []
    },
    collaborateUserList: {
      type: Array,
      default: () => []
    },
    disablePublish: {
      type: Boolean,
      default: false
    }
  },
  created() {
  },
  methods: {
    emitEvent(eventName) {
      if (eventName === 'collaborate' && this.collaborateTips !== 'Collaborate') {
        return
      }
      this.$emit(eventName)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";
.cc-form-header-action-bar {
  display: flex;
  flex-direction: row;
  align-items: center;

  .action-item {
    user-select: none;
    outline: none;
    cursor: pointer;
    svg {
      width: 23px;
      max-height: 30px;
      outline: none;
    }
  }

  .collaborate-user-list {
    display: flex;
    justify-content: flex-end;
    margin-right:10px;
    margin-top: -5px;
    height:23px;
    width:23px;
    .item-avator{
      margin-right: -10px;
    }
    .user-item {
      margin: 0px 4px;
    }
  }

  /deep/ .ant-badge-status-green {
    right: 12px;
    top: 2px;
    background: #52c41a;
  }
  .gray {
    filter: grayscale(100%);
  }
}

.disabled {
  cursor: not-allowed !important;
}
</style>
