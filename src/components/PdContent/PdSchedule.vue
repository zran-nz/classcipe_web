<template>
  <a-modal
    v-model="visible"
    :closable='false'
    destroyOnClose
    title=''
    width="850px"
    :zIndex="6000"
    ok-text='Confirm'
    @ok="confirmSchedule"
    @cancel="closeSchedule">
    <modal-header title='Schedule' @close='closeSchedule'/>
    <schedule-pay-info ref='personal-schedule' v-show='userMode === USER_MODE.SELF' />
    <school-schedule ref='school-schedule' v-show='userMode === USER_MODE.SCHOOL' />
  </a-modal>
</template>

<script>
import SchedulePayInfo from '@/components/Schedule/SchedulePayInfo'
import ModalHeader from '@/components/Common/ModalHeader'
import SchoolSchedule from '@/components/Schedule/SchoolSchedule'
import { mapState } from 'vuex'
import { USER_MODE } from '@/const/common'

export default {
  name: 'PdSchedule',
  components: { SchoolSchedule, ModalHeader, SchedulePayInfo },
  data() {
    return {
      visible: false,
      USER_MODE: USER_MODE
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode
    })
  },
  methods: {
    confirmSchedule() {
      const personalScheduleConfig = this.$refs['personal-schedule'].getPaidInfo()
      const schoolScheduleInfo = this.$refs['school-schedule'].getScheduleInfo()
      this.$logger.info('confirmSchedule', personalScheduleConfig)
      this.$logger.info('schoolScheduleInfo', schoolScheduleInfo)
      this.closeSchedule()
    },

    closeSchedule () {
      this.visible = false
      this.$emit('close')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
