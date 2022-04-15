<template>
  <div class='my-steps'>
    <my-vertical-step-item
      :name='step.name'
      :current-step-index='currentStepIndex'
      :description='step.description'
      :step-index='sIdx'
      v-for='(step, sIdx) in steps'
      :key='step.id'
      @select-step='handleSelectStep'/>
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
    }
  },
  data () {
    return {
      currentStepIndex: this.stepIndex
    }
  },
  methods: {
    handleSelectStep (index) {
      if (this.currentStepIndex !== index) {
        this.currentStepIndex = index
        this.$emit('step-change', index)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.my-steps {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-shadow: rgb(232 232 232) 0px -1px 0px 0px inset;
}
</style>
