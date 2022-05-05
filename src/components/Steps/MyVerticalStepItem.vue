<template>
  <div class='my-vertical-step-item' :class="{'my-vertical-step-item-active': stepIndex === currentStepIndex}">
    <div class='step-check-icon' :style="{'opacity': stepIndex == currentStepIndex ? '1' : '0'}">
      <check-icon :size='17' />
    </div>
    <div class='step-info'>
      <div class='name'>{{ (stepIndex + 1) }}. {{ name }}</div>
      <div class='description'>{{ description }}</div>
    </div>
  </div>
</template>

<script>
import CheckIcon from '@/components/Common/CheckIcon'
export default {
  name: 'MyVerticalStepItem',
  components: { CheckIcon },
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
  justify-content: center;
  transition: all 0.2s;
  font-weight: 500;

  &::before {
    position: absolute;
    bottom: 0;
    left: 50%;
    display: inline-block;
    width: 0;
    height: 4px;
    background-color: #208557;
    transition: width 0.2s, left 0.2s;
    transition-timing-function: ease-out;
    content: '';
  }

  .step-info {
    color: #5E5E5E;
    transition: color 0.3s;
    font-family: Arial;
    font-weight: 400;
    line-height: 42px;

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
      color: #171717;
      transition: color 0.3s;
    }
  }
}

.my-vertical-step-item-active {
  background-color: #F8F9FB;
  &::before {
    left: 0;
    width: 100%;
  }

  .step-info {
    color: #171717;
  }
}

.step-check-icon {
  margin-right: 6px;
}
</style>
