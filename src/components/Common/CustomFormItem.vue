<template>
  <div class='cc-custom-form-item'>
    <div class='label'>
      <div class='label-left'>
        <slot name='label'></slot>
        <div class='tips'>
          <slot name='tips'></slot>
        </div>
      </div>
      <div class='right-action'>
        <slot name='action'></slot>
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
    justify-content: space-between;
    font-size: 14px;
    font-family: Arial;
    font-weight: bold;
    color: #202020;
    line-height: 40px;

    .label-left {
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

    .right-action {
      cursor: pointer;
      display: none;
      height: 40px;
      line-height: 40px;
      overflow: hidden;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-end;
    }
  }

  .form-item-content {
    box-sizing: border-box;
    overflow: visible;
  }

  &:hover {
    .right-action {
      display: flex;
    }
  }
}
</style>
