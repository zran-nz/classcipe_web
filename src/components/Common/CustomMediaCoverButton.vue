<template>
  <div
    class='cc-custom-button'
    @click='handleClick'
    @dblclick='handleDbClick'
    :style="{
      backgroundColor: bgColor,
      color: fontColor
    }">
    <div class='icon'>
      <slot name='icon'>
      </slot>
    </div>
    <div class='label'>
      {{ label }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomMediaCoverButton',
  props: {
    label: {
      type: String,
      default: ''
    },
    bgColor: {
      type: String,
      default: '#EEF1F3'
    },
    fontColor: {
      type: String,
      default: '#515564'
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    },
    handleDbClick() {
      this.$emit('dblclick')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.cc-custom-button {
  padding: 10px 18px;
  border-radius: 40px;
  font-family: Arial;
  font-weight: 400;
  color: #16274A;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease-in-out;

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    padding-bottom: 1px;
    svg {
      width: 13px;
      height: 14px;
    }
  }

  .label {
    font-size: 13px;
    padding: 0 6px;
    line-height: 16px;
    white-space: nowrap;
  }
}
</style>
