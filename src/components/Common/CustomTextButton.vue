<template>
  <div :class='{"cc-custom-text-button":true,"button-disabled":loading}' @click='handleClick' @dblclick='handleDbClick'>
    <div class='icon'>
      <slot name='icon' v-if="!loading">
      </slot>
      <a-icon type="loading" v-if="loading" />
    </div>
    <div class='label' :style="{fontSize: size + 'px'}">
      {{ label }}
    </div>
    <div class='suffix'>
      <slot name='suffix'>
      </slot>
    </div>
    <div class='cc-badge'>
      <slot name='badge'>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomTextButton',
  props: {
    label: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 13
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      if (this.loading) {
        return
      }
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

.button-disabled{
  border-color: #d9d9d9 !important;
  color: #999 !important;
  cursor: not-allowed !important;
}
.cc-custom-text-button {
  position: relative;
  padding: 7px 20px;
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
  background: #FFFEF9;
  border: 2px solid #FBD32C;
  transition: background-color 0.3s ease-in-out;

  .icon, .suffix {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    padding-bottom: 1px;
    svg {
      width: 13px;
      height: 14px;
      fill: #292929 !important;
    }
    i {
      color: #292929 !important;
    }
  }

  .label {
    padding: 0 6px;
    line-height: 16px;
    white-space: nowrap;
    font-family: Arial;
    font-weight: 400;
    color: #292929;
  }

  .cc-badge {
    position: absolute;
    top: -10px;
    right: -5px;
  }
}
</style>
