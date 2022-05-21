<template>
  <div class='my-vertical-step-item' :class="{ 'my-vertical-step-item-active': stepIndex === currentStepIndex, 'is-satisfied': showRequiredTips, 'is-required': showRequiredTips }">
    <div class='step-check-icon' :style="{'opacity': stepIndex == currentStepIndex && !showRequiredTips ? '1' : '0'}">
      <check-icon :size='15' />
    </div>
    <div class='step-info'>
      <div class='name'>{{ (stepIndex + 1) }}. {{ name }}</div>
      <div class='description'>{{ description }}</div>
    </div>
    <div class='step-tips' v-if='tips'>
      <a-tooltip :title="tips" placement="left">
        <a-icon type="question-circle" :style="{color: '#666'}" />
      </a-tooltip>
    </div>
    <div class='satisfied-step check-result-icon' v-if='showSatisfiedTips'>
      <a-icon type="check-circle" :style="{fontSize: '20px', color: 'green'}" />
    </div>
    <div class='required-step check-result-icon' v-if='showRequiredTips'>
      <a-tooltip title="Current step has unfilled required fields">
        <a-icon type="exclamation-circle" :style="{fontSize: '20px', color: 'red'}" />
      </a-tooltip>
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
    tips: {
      type: String,
      default: null
    },
    showIndex: {
      type: Boolean,
      default: true
    },
    showSatisfiedTips: {
      type: Boolean,
      default: false
    },
    showRequiredTips: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.my-vertical-step-item {
  cursor: pointer;
  padding: 7px;
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
    line-height: 35px;

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

  .step-tips {
    margin-left: 5px;
  }
}

.is-required {
  .step-info {
    .name {
      color: #f5222d;
    }
  }

  &::before {
    background-color: #f5222d;
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

.check-result-icon {
  position: absolute;
  top: 0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 15px;
  font-size: 14px;
}
</style>
