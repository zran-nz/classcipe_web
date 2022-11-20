import { typeMap } from '@/const/teacher'
import { NotificationTypeMap } from '@/views/dashboard/NotificationTypeMap'
import { EditCementSend, ListCementByUser } from '@/api/notice'
import { RECEIVE_MSG } from '@/store/mutation-types'
import { mapActions } from 'vuex'
import { SourceType } from '@/components/MyContentV2/Constant'
import { SESSION_SHARE_TYPE } from '@/const/common'

export const NoticeMixin = {
  components: {

  },
  data () {
    return {

    }
  },
  created () {
    this.$store.watch(
      state => state.websocket.receiveMsg,
      receiveMsg => {
        if (receiveMsg) {
          this.loadNewNotifications()
          this.$store.commit(RECEIVE_MSG, false)
        }
      }
    )
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
      } else if (parseInt(typeIds[0]) === typeMap.pd) {
        this.$router.push({
          path: '/teacher/pd-content-redirect/' + typeIds[1]
        })
      } else if (parseInt(typeIds[0]) === typeMap['unit-plan']) {
        this.$router.push({
          path: '/teacher/unit-plan-redirect/' + typeIds[1]
        })
      }
    },
    setShareType(record) {
      if (record.busType === NotificationTypeMap.collaborateRejected ||
         record.busType === NotificationTypeMap.collaborateApply) {
        sessionStorage.setItem(SESSION_SHARE_TYPE, SourceType.SharedByMe.toString())
      } else if (record.busType === NotificationTypeMap.collaborateAccepted ||
        record.busType === NotificationTypeMap.collaborateInvite) {
        sessionStorage.setItem(SESSION_SHARE_TYPE, SourceType.SharedByOthers.toString())
      }
    },
    viewNotification (record) {
      console.info('viewNotification', record)
      // 标记已读取
      if (record.readFlag === '0') {
        EditCementSend({ anntId: record.id }).then(() => {
          this.$store.commit(RECEIVE_MSG, true)
        })
        record.readFlag = '1'
      }
      this.setShareType(record)
      if (record.busType === NotificationTypeMap.collaborateApply) {
        this.gotoContent(record)
        setTimeout(() => {
          this.refreshCollaborateAction(record.busId)
        }, 4000)
      } else if (record.busType === NotificationTypeMap.collaborateAccepted ||
        record.busType === NotificationTypeMap.collaborateInvite) {
        this.gotoContent(record)
      } else if (record.busType === NotificationTypeMap.collaborateRejected) {
        // this.$router.push({ path: '/teacher/main/created-by-me' })
        this.$warning({
          title: 'Alert',
          content: (<div><h2>You have been rejected by the owner, you can not edit it.</h2></div>)
        })
        return
      } else if (record.busType === NotificationTypeMap.collaborateRemoved) {
        this.$warning({
          title: 'Alert',
          content: (<div><h2>You have been removed from the collaborating list, you can no longer edit it.</h2></div>)
        })
        return
      } else if (record.openType === 'url') {
        if (record.busType === NotificationTypeMap.collaborateFavoriote) {
            record.readFlag = '1'
            return
        }
        // 链接跳转
        this.$router.push({ path: record.openPage })
      } else {
        if (this.$route.query && this.$route.query.direct === '1') {

        } else {
          this.$router.push({
            path: '/notification-detail/' + record.id
          })
        }
      }
      if (this.handleHoverChange) {
        this.handleHoverChange(false)
      }
    },
    loadNewNotifications() {
      ListCementByUser().then((res) => {
        if (res.success) {
          const msg1Count = res.result.anntMsgTotal
          this.$store.commit('SET_UNREAD_COUNT', msg1Count || 0)
        }
      }).catch(error => {
        this.$logger.error('系统消息通知异常', error)
        this.stopTimer = true
        this.$logger.error('清理timer')
      })
    }
  }

}
