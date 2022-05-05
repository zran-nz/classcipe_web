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

    <select-session-unit
      v-if='selectSessionUnitVisible'
      :list='associateUnitList'
      @back='handleBack'
      @select='handleSelectUnit' />
  </div>
</template>

<script>

import MyVerticalSteps from '@/components/Steps/MyVerticalSteps'
import { AssociateMixin } from '@/mixins/AssociateMixin'
import { SchoolClassGetMyClasses } from '@/api/schoolClass'
import SelectSessionUnit from '@/components/Schedule/SelectSessionUnit'

export default {
  name: 'ScheduleSession',
  components: { SelectSessionUnit, MyVerticalSteps },
  mixins: [ AssociateMixin ],
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
      selectSessionUnitVisible: false,
      associateUnit: null,
      associateUnitList: []
    }
  },
  created() {
    this.$logger.info(`ScheduleSession created with id: ${this.id} type ${this.type}`)
    this.handleAssociate()
    this.loading = false
  },
  methods: {
    handleStepChange(data) {
      this.$logger.info('ScheduleSession handleStepChange ', data)
      this.currentActiveStepIndex = data.index
    },

    async handleAssociate() {
      this.$logger.info('ScheduleSession associateUnitList start', this.associateUnitList)
      const associateData = await this.getAssociate(this.id, this.type, 1)
      associateData.ownerLinkList.forEach(groupItem => {
        groupItem.contents.forEach(item => {
          if (item.type === this.$classcipe.typeMap['unit-plan']) {
            this.associateUnitList.push(item)
          }
        })
      })
      this.$logger.info('ScheduleSession associateUnitList', this.associateUnitList)
      if (this.associateUnitList.length === 0) {
        this.$confirm({
          title: 'Warn',
          content: 'The current task is not yet associated with any unit plan. Please associate the task with a unit plan first.',
          centered: true,
          onOk: () => {
            this.$router.go(-1)
          },
          onCancel: () => {
            this.$router.go(-1)
          }
        })
      } else if (this.associateUnitList.length === 1) {
        this.associateUnit = this.associateUnitList[0]
      } else {
        this.selectSessionUnitVisible = true
      }
    },

    getClassList() {
      SchoolClassGetMyClasses().then(res => {
        this.$logger.info('ScheduleSession getClassList ', res)
      })
    },

    handleBack () {
      this.$router.go(-1)
    },

    handleSelectUnit(data) {
      this.$logger.info('ScheduleSession handleSelectUnit ', data)
      this.selectSessionUnitVisible = false
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
