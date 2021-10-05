<template>
  <div class="comment-switch">
    <div class="comment-active-icon" @click="handleClickSwitch($event)">
      <!--svg元素点击无法获取dom属性，加一个mask-->
      <div class="mask"></div>
      <comment-icon v-if="activeStatus" class="active-icon"/>
      <in-active-comment-icon v-if="!activeStatus" class="in-active-icon"/>
    </div>
  </div>
</template>

<script>

import CommentIcon from '@/assets/icons/collaborate/comment.svg?inline'
import InActiveCommentIcon from '@/assets/icons/collaborate/in_active_comment.svg?inline'
export default {
  name: 'CommentSwitch',
  components: {
    CommentIcon,
    InActiveCommentIcon
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
      this.$logger.info('handleClickSwitch', this.activeStatus)
      this.activeStatus = !this.activeStatus

      const eventDom = event.target
      let formTop = eventDom.offsetTop
      let currentDom = eventDom.offsetParent
      while (currentDom !== null) {
        formTop += currentDom.offsetTop
        currentDom = currentDom.offsetParent
        if (currentDom.classList && currentDom.classList.contains('root-locate-form')) {
          console.log(currentDom.classList)
          break
        }
      }

      const eventData = {
        fieldName: this.fieldName,
        activeStatus: this.activeStatus,
        top: formTop
      }
      this.$logger.info('event data', eventData)
      this.$emit('switch', eventData)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.active-icon {
  width: 40px;
  cursor: pointer;
  padding: 0 10px;
  z-index: 50;
}

.in-active-icon {
  cursor: pointer;
  z-index: 50;
}

.comment-active-icon {
  position: relative;
}

.mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  opacity: 0;
  cursor: pointer;
}

</style>
