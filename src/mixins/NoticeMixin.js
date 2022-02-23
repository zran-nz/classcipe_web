import { typeMap } from '@/const/teacher'
import { NotificationTypeMap } from '@/views/dashboard/NotificationTypeMap'
import { EditCementSend } from '@/api/notice'
import { RECEIVE_MSG } from '@/store/mutation-types'

export const NoticeMixin = {
  components: {

  },
  data () {
    return {

    }
  },
  created () {

  },
  methods: {
    gotoContent(record) {
      // 申请跳转到闲情页
      const typeIds = record.busId.split('#')
      if (parseInt(typeIds[0]) === typeMap.task) {
        this.$router.push({
          path: '/teacher/task-redirect/' + typeIds[1]
        })
      } else if (parseInt(typeIds[0]) === typeMap['unit-plan']) {
        this.$router.push({
          path: '/teacher/unit-plan-redirect/' + typeIds[1]
        })
      }
    },
    viewNotification (record) {
      this.$logger.info('viewNotification', record)
      if (record.busType === NotificationTypeMap.collaborateApply) {
        this.$store.dispatch('refreshCollaborate', record.busId)
        setTimeout(() => {
          this.gotoContent(record)
        }, 500)
      } else if (record.busType === NotificationTypeMap.collaborateAccepted ||
        record.busType === NotificationTypeMap.collaborateInvite ||
        record.busType === NotificationTypeMap.collaborateRejected) {
        this.gotoContent(record)
      } else if (record.openType === 'url') {
        // 链接跳转
        this.$router.push({ path: record.openPage })
      } else {
        this.$router.push({
          path: '/notification-detail/' + record.id
        })
      }
      if (this.handleHoverChange) {
        this.handleHoverChange(false)
      }
      // 标记已读取
      if (record.readFlag === '0') {
        EditCementSend({ anntId: record.id }).then(() => {
          this.$store.commit(RECEIVE_MSG, true)
        })
      }
    }
  }

}
