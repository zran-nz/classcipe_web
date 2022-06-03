<template>
  <a-modal
    v-model="visible"
    :footer="null"
    :closable='false'
    destroyOnClose
    title=''
    width="800px"
    :zIndex="6000"
    @ok="confirmSchedule"
    @cancel="closeSchedule">
    <modal-header title='Schedule' @close='closeSchedule'/>
    <schedule-pay-info ref='schedule' />
  </a-modal>
</template>

<script>
import SchedulePayInfo from '@/components/Schedule/SchedulePayInfo'
import ModalHeader from '@/components/Common/ModalHeader'
export default {
  name: 'PdSchedule',
  components: { ModalHeader, SchedulePayInfo },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    confirmSchedule() {
      const scheduleConfig = this.$refs.schedule.getPaidInfo()
      this.$logger.info('confirmSchedule', scheduleConfig)
      this.closeSchedule()
    },

    closeSchedule () {
      this.$emit('close')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
