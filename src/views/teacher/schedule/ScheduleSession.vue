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
    <div class='schedule-content-wrapper'>
      <a-skeleton v-show='loading' />
      <div class='schedule-content'></div>
    </div>


  </div>
</template>

<script>

import MyVerticalSteps from '@/components/Steps/MyVerticalSteps'
export default {
  name: 'ScheduleSession',
  components: { MyVerticalSteps },
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      currentActiveStepIndex: 0,
      selectSessionUnitVisible: false
    }
  },
  created() {
    this.$logger.info(`ScheduleSession created with id: ${this.id} type ${this.type}`)
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
