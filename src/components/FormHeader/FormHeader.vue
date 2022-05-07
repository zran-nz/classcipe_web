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
        <form-header-action-bar />
      </slot>
    </div>
  </div>
</template>

<script>
import BackArrowIcon from '@/assets/v2/icons/back_arrow.svg?inline'
import FormHeaderActionBar from '@/components/FormHeader/FormHeaderActionBar'

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
    }
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {
    handleBack () {
      this.$emit('back')
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
