<template>
  <div class='cc-form-header-action-bar'>
    <a-space>
      <div class='collaborate-user-list'></div>

      <div class='action-item invite' @click="emitEvent('invite')">
        <a-tooltip title='Invite'>
          <invite-icon />
        </a-tooltip>
      </div>
      <div class='action-item collaborate' @click="emitEvent('collaborate')">
        <a-tooltip title='Collaborate'>
          <message-icon />
        </a-tooltip>
      </div>
      <div class='action-item share' @click="emitEvent('share')">
        <a-tooltip title='Share'>
          <share-icon />
        </a-tooltip>
      </div>
      <div class='action-item publish' @click="emitEvent('publish')">
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
