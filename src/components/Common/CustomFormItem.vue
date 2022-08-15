<template>
  <div class='cc-custom-form-item'>
    <div class='label' v-if='showLabel'>
      <div class='label-left' :style="{color: labelColor, fontSize: labelSize + 'px'}">
        <div class='required-dot vertical-center' v-if='requiredField'>*</div>
        <slot name='label'></slot>
        <div class='required' v-if='required'>
          *Required
        </div>
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
  props: {
    showLabel: {
      type: Boolean,
      default: true
    },
    labelColor: {
      type: String,
      default: '#202020'
    },
    labelSize: {
      type: Number,
      default: 14
    },
    required: {
      type: Boolean,
      default: false
    },
    requiredField: {
      type: Boolean,
      default: false
    }
  },
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
    font-family: Arial;
    font-weight: bold;
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
      color: #007A8E;
      fill: #007A8E;
    }
  }

  .required {
    padding: 0 5px;
    color: #f5222d;
    vertical-align: middle;
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

.required-dot {
  padding-right: 3px;
  font-weight: bold;
  font-size: 18px;
  color: #f5222d;
  vertical-align: middle;
}
</style>
