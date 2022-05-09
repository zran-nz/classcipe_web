<template>
  <div class='cc-custom-text-button' @click='handleClick' @dblclick='handleDbClick'>
    <div class='label'>
      {{ label }}
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

.cc-custom-text-button {
  padding: 7px 15px;
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

  .label {
    font-size: 13px;
    padding: 0 6px;
    line-height: 16px;
    white-space: nowrap;
    font-family: Arial;
    font-weight: 400;
    color: #444444;
  }
}
</style>
