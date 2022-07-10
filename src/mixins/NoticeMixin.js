import { typeMap } from '@/const/teacher'
import { NotificationTypeMap } from '@/views/dashboard/NotificationTypeMap'
import { EditCementSend } from '@/api/notice'
import { RECEIVE_MSG } from '@/store/mutation-types'
import { mapActions } from 'vuex'

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
    ...mapActions(['refreshCollaborateAction']),
    gotoContent(record) {
      if (record.busId === '-1') {
        this.$router.push({ path: '/teacher/main/created-by-me' })
        return
      }
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
      // 标记已读取
      if (record.readFlag === '0') {
        EditCementSend({ anntId: record.id }).then(() => {
          this.$store.commit(RECEIVE_MSG, true)
        })
      }
      if (record.busType === NotificationTypeMap.collaborateApply) {
        this.gotoContent(record)
        setTimeout(() => {
          this.refreshCollaborateAction(record.busId)
        }, 4000)
      } else if (record.busType === NotificationTypeMap.collaborateAccepted ||
        record.busType === NotificationTypeMap.collaborateInvite) {
        this.gotoContent(record)
      } else if (record.busType === NotificationTypeMap.collaborateRejected) {
        this.$router.push({ path: '/teacher/main/created-by-me' })
      } else if (record.openType === 'url') {
        if (record.busType === NotificationTypeMap.collaborateFavoriote) {
            record.readFlag = '1'
            return
        }
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
    }
  }

}
