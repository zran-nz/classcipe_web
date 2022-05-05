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
      <div class='schedule-content' v-show='!loading'>
        <select-participant
          ref='participant'
          :class-list='classList'
          v-show='currentActiveStepIndex === 0'
          @select-class-student='handleSelectClassStudent'
          @select-open-session='handleSelectOpenSession'/>
        <schedule-date v-show='!isOpenSession && currentActiveStepIndex === 1' />
        <schedule-pay-info v-show='isOpenSession && currentActiveStepIndex === 1'/>
      </div>
    </div>
    <div class='bottom-action'>
      <a-button @click='handleGoBack'><a-icon type='left' /> Back</a-button>
      <div class='right-button'>
        <a-space>
          <a-button type='primary' v-if='currentActiveStepIndex === $classcipe.ScheduleSteps.length - 1'>Teach the session now</a-button>
          <a-button type='primary' @click='handleGoNext'>
            <template v-if='currentActiveStepIndex !== $classcipe.ScheduleSteps.length - 1'>
              Next <a-icon type='right' />
            </template>
            <template v-else>Assign</template>
          </a-button>
        </a-space>
      </div>
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
import SelectParticipant from '@/components/Schedule/SelectParticipant'
import ScheduleDate from '@/components/Schedule/ScheduleDate'
import SchedulePayInfo from '@/components/Schedule/SchedulePayInfo'

export default {
  name: 'ScheduleSession',
  components: { SchedulePayInfo, ScheduleDate, SelectParticipant, SelectSessionUnit, MyVerticalSteps },
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
      associateUnitList: [],
      isOpenSession: false,

      classList: [],
      selectedClassId: [],
      selectStudents: []
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

      this.getClassList()
    },

    getClassList() {
      SchoolClassGetMyClasses().then(res => {
        this.$logger.info('ScheduleSession getClassList ', res)
        if (res.result) {
          this.classList = res.result
        }
      }).finally(() => {
        this.loading = false
      })
    },

    handleBack () {
      this.$router.go(-1)
    },

    handleSelectUnit(data) {
      this.$logger.info('ScheduleSession handleSelectUnit ', data)
      this.associateUnit = data
      this.selectSessionUnitVisible = false
      this.getClassList()
    },

    handleGoBack () {
      if (this.currentActiveStepIndex === 0) {
        this.handleBack()
      } else {
        this.$refs['steps-nav'].prevStep()
      }
    },
    handleGoNext () {
      if (this.currentActiveStepIndex === 0) {
        this.$refs['steps-nav'].nextStep()
        const participantData = this.$refs.participant.getSelectedData()
        this.$logger.info('ScheduleSession handleGoNext participantData ', participantData)
      }
      this.$logger.info('ScheduleSession handleGoNext ', this.currentActiveStepIndex)
    },

    handleSelectClassStudent () {
      this.isOpenSession = false
    },

    handleSelectOpenSession (data) {
      this.$logger.info('ScheduleSession handleSelectOpenSession ', data)
      this.isOpenSession = true
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

.schedule-content-wrapper {
  height: calc(100vh - 150px);
  .schedule-content {
    height: 100%;
  }
}

.bottom-action {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
