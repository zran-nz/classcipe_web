<template>
  <div class='cc-custom-button' :style="{'background-color': bgColor, 'color': color}" @click='handleClick' @dblclick='handleDbClick'>
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
  name: 'CustomButton',
  props: {
    label: {
      type: String,
      default: ''
    },
    bgColor: {
      type: String,
      default: '#EEF1F3'
    },
    color: {
      type: String,
      default: '#16274A'
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
  background-color: #EEF1F3;
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
      fill: #515564 !important;
    }
    i {
      color: #515564 !important;
    }
  }

  &:hover {
    background-color: #14C39A !important;
    color: #fff !important;

    .icon {
      svg {
        fill: #fff !important;
      }
      i {
        color: #fff !important;
      }
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
