<template>
  <div class='schedule-session'>
    <div class='fixed-header'>
      <my-vertical-steps
        ref='steps-nav'
        :allow-switch='false'
        :steps='$classcipe.ScheduleSteps'
        :step-index='currentActiveStepIndex'
        @step-change='handleStepChange'/>
    </div>
    <div class='schedule-content'>

    </div>
  </div>
</template>

<script>
import MyVerticalSteps from '@/components/Steps/MyVerticalSteps'
export default {
  name: 'ScheduleSession',
  components: { MyVerticalSteps },
  data() {
    return {
      currentActiveStepIndex: 0
    }
  },
  created() {
  },
  methods: {
    handleStepChange(data) {
      this.$logger.info('ScheduleSession handleStepChange ', data)
      this.currentActiveStepIndex = data.index
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.schedule-session {
  background-color: #fff;
  padding: 15px;
  min-height: calc(100vh - 50px);
}

</style>
