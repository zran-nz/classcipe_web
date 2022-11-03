<template>
  <div class="comment-switch" @click="handleClickSwitch($event)">
    <a-icon type="message" />
  </div>
</template>

<script>

import MessageIcon from '@/assets/v2/icons/message.svg?inline'
export default {
  name: 'CommentSwitch',
  components: {
    MessageIcon
  },
  props: {
    fieldName: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      activeStatus: this.isActive
    }
  },
  watch: {
    isActive (value) {
      this.activeStatus = value
    }
  },
  methods: {
    handleClickSwitch (event) {
      console.info('handleClickSwitch', this.activeStatus)
      this.activeStatus = !this.activeStatus
      const eventData = {
        fieldName: this.fieldName,
        activeStatus: this.activeStatus
      }
      console.info('event data', eventData)
      this.$emit('switch', eventData)
      event.stopPropagation()
      event.preventDefault()
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.comment-switch {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 15px;
    height: 15px;
  }
}

</style>
