<template>
  <div class='my-vertical-step-item' :class="{'my-vertical-step-item-active': stepIndex === currentStepIndex}">
    <div class='step-index' v-show='showIndex'>
      <span class='step-index-number'>{{ (stepIndex + 1) }}</span>
    </div>
    <div class='step-info'>
      <div class='name'>{{ name }}</div>
      <div class='description'>{{ description }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyVerticalStepItem',
  props: {
    stepIndex: {
      type: Number,
      required: true
    },
    currentStepIndex: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: null
    },
    showIndex: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.my-vertical-step-item {
  cursor: pointer;
  padding: 10px 10px 15px 0;
  flex: 1;
  position: relative;
  text-align: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-weight: 500;

  &::before {
    position: absolute;
    bottom: 0;
    left: 50%;
    display: inline-block;
    width: 0;
    height: 2px;
    background-color: @primary-color;
    transition: width 0.3s, left 0.3s;
    transition-timing-function: ease-out;
    content: '';
  }

  .step-index {
    width: 30px;
    height: 30px;
    margin-right: 8px;
    font-size: 16px;
    font-family: -apple-system, BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
    line-height: 30px;
    border: 1px solid rgba(0,0,0,.25);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    background-color: #fff;
    color: rgba(0, 0, 0, 0.25);
    transition: all 0.3s ease-out;
  }

  .step-info {
    color: rgba(0, 0, 0, 0.45);
    transition: color 0.3s;

    .name {
      max-width: 100%;
      padding-right: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 14px;
    }

    .description {
      font-size: 13px;
      max-width: 100%;
      padding-right: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  &:hover {
    .step-info {
      color: @primary-color;
      transition: color 0.3s;
    }

    .step-index {
      color: @primary-color;
      border-color: @primary-color;
    }
  }
}

.my-vertical-step-item-active {
  &::before {
    left: 0;
    width: 100%;
  }

  .step-index {
    background: @primary-color;
    border: 1px solid @primary-color;
    color: #fff;
  }

  .step-info {
    color: @primary-color;
  }

  &:hover {
    .step-index {
      color: #fff;
    }
  }
}
</style>
