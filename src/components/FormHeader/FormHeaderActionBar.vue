<template>
  <div class='cc-form-header-action-bar'>
    <a-space>
      <div class='spin' v-if='spin'>
        <a-spin>
          <a-icon slot="indicator" type="loading" style="font-size: 18px" spin />
        </a-spin>
      </div>
      <div class='collaborate-user-list'></div>
      <div class='action-item invite' @click="emitEvent('invite')" v-if="showInvite">
        <a-tooltip title='Invite'>
          <invite-icon />
        </a-tooltip>
      </div>
      <div class='action-item collaborate' @click="emitEvent('collaborate')" v-if="showCollaborate">
        <a-tooltip title='Collaborate'>
          <message-icon />
        </a-tooltip>
      </div>
      <div class='action-item share' @click="emitEvent('share')" v-if="showShare">
        <a-tooltip title='Share'>
          <share-icon />
        </a-tooltip>
      </div>
      <div class='action-item publish' @click="emitEvent('publish')" v-if="showPublish">
        <a-tooltip title='Publish'>
          <publish-icon />
        </a-tooltip>
      </div>
    </a-space>
  </div>
</template>

<script>
import MessageIcon from '@/assets/v2/icons/message.svg?inline'
import InviteIcon from '@/assets/v2/icons/header_invite.svg?inline'
import PublishIcon from '@/assets/v2/icons/header_publish.svg?inline'
import ShareIcon from '@/assets/v2/icons/header_share.svg?inline'

export default {
  name: 'FormHeaderActionBar',
  components: {
    MessageIcon,
    InviteIcon,
    PublishIcon,
    ShareIcon
  },
  data() {
    return {}
  },
  props: {
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
    spin: {
      type: Boolean,
      default: false
    }
  },
  created() {
  },
  methods: {
    emitEvent(eventName) {
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
}
</style>
