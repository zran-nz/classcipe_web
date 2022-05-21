<template>
  <div class='my-steps'>
    <my-vertical-step-item
      :name='step.name'
      :current-step-index='currentStepIndex'
      :description='step.description'
      :tips='step.tips'
      :step-index='sIdx'
      v-for='(step, sIdx) in steps'
      :key='step.id'
      @click.native='handleSelectStep(step, sIdx)'/>
  </div>
</template>

<script>
import MyVerticalStepItem from '@/components/Steps/MyVerticalStepItem'
export default {
  name: 'MyVerticalSteps',
  components: { MyVerticalStepItem },
  props: {
    steps: {
      type: Array,
      default: () => []
    },
    stepIndex: {
      type: Number,
      default: 0
    },
    allowSwitch: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      currentStepIndex: this.stepIndex
    }
  },
  watch: {
    stepIndex (val) {
      this.currentStepIndex = val
    }
  },
  methods: {
    handleSelectStep (step, index, force) {
      this.$logger.info('handleSelectStep', step, index)
      if (this.allowSwitch || force) {
        if (this.currentStepIndex !== index) {
          this.currentStepIndex = index
          this.$emit('step-change', {
            index,
            step
          })
        }
      } else {
        this.$logger.info('handleSelectStep', 'allowSwitch is false')
      }
    },
    nextStep() {
      this.$logger.info('nextStep')
      if (this.currentStepIndex < this.steps.length - 1) {
        // 组件允许强制跳转step
        this.handleSelectStep(this.steps[this.currentStepIndex + 1], this.currentStepIndex + 1, true)
      }
    },
    prevStep () {
      this.$logger.info('prevStep')
      if (this.currentStepIndex > 0) {
        this.handleSelectStep(this.steps[this.currentStepIndex - 1], this.currentStepIndex - 1, true)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.my-steps {
  user-select: none;
  height: 49px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-shadow: rgb(232 232 232) 0px -1px 0px 0px inset;
}
</style>
