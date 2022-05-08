<template>
  <div class='cc-custom-form-item'>
    <div class='label'>
      <slot name='label'></slot>
      <div class='tips'>
        <slot name='tips'></slot>
      </div>
    </div>
    <div class='form-item-content'>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomFormItem',
  data() {
    return {}
  },
  created() {
  },
  methods: {}
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.cc-custom-form-item {
  padding-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
  overflow: visible;
  .label {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
    font-family: Arial;
    font-weight: bold;
    color: #202020;
    line-height: 40px;

    .tips {
      padding-left: 5px;
    }
  }

  .form-item-content {
    box-sizing: border-box;
    overflow: visible;
  }
}
</style>
