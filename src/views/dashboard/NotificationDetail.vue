<template>
  <a-card :bordered="false">
    <div class="notification-detail">
      <div class="top">
        <div class="left-wrapper">
          <div class="back" @click="handleGoBack">
            <div class="back-icon">
              <img src="~@/assets/svgIcon/notification/back.png" />
            </div>
            <div class="back-text">
              Back
            </div>
          </div>
        </div>
      </div>
      <div class="main-body">
        <div class="header-line">
          <div class="user-info">
            <div class="avatar-wrapper">
              <img :src="notificationData.avatar" />
            </div>
            <div class="post-info">
              <div class="post-by">
                {{ notificationData.postBy }}
              </div>
              <div class="post-time">
                {{ notificationData.sendTime | dayjs }}
              </div>
            </div>
          </div>
          <div class="action-btn-wrapper">
            <div class="action-btn-list">
              <!--// TODO 不同的消息类型不同的处理按钮逻辑-->
              <template v-if="notificationData.busType === notificationTypeMap.collaborateInvite">
                <!--                <div class="action-item">-->
                <!--                  <router-link :to="'/teacher/add-task/' + notificationData.busId">-->
                <!--                    <a-button type="primary" shape="round" >Enter</a-button>-->
                <!--                  </router-link>-->
                <!--                </div>-->
                <!--                <div class="action-item">-->
                <!--                  <a-button class="gray-btn" :loading="refuseLoading" :style="{'background': '#E5E5E5', 'border-color': '#E5E5E5', 'color': '#000000'}" shape="round" @click="handleRefuseCollaborate">Refuse</a-button>-->
                <!--                </div>-->
                <!--                <div class="action-item">-->
                <!--                  <a-button type="primary" :loading="acceptLoading" shape="round" @click="handleAcceptCollaborate">Accept</a-button>-->
                <!--                </div>-->
              </template>
            </div>
          </div>
        </div>
        <div class="content-body" style="cursor: pointer" @click="showAnnouncement">
          <div class="content-title">
            {{ notificationData.titile }}
          </div>
          <div class="content-detail">
            {{ notificationData.msgContent }}
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import backIconSvg from '@/assets/svgIcon/notification/back.svg?inline'
import { NotificationTypeMap } from '@/views/dashboard/NotificationTypeMap'
import { EditCementSend, NoticeQueryById } from '@/api/notice'
import { RECEIVE_MSG } from '@/store/mutation-types'
import { CollaboratesAgree, DeleteCollaborate } from '@/api/collaborate'
import * as logger from '@/utils/logger'
import { CollaborateStatus } from '@/const/teacher'
import { NoticeMixin } from '@/mixins/NoticeMixin'

export default {
  name: 'NotificationDetail',
  components: {
    backIconSvg
  },
  mixins: [NoticeMixin],
  props: {
    id: {
      type: String,
      required: true
    }
  },

  watch: { $route (to, from) { this.loadMessageData() } },
  data () {
    return {
      notificationData: {},
      notificationTypeMap: NotificationTypeMap,
      acceptLoading: false,
      refuseLoading: false

    }
  },
    created () {
      console.info('loadMessageData ' + this.id)
      this.loadMessageData()
    },
    methods: {
      loadMessageData () {
        // TODO 查询消息详情
        NoticeQueryById({ id: this.id }).then((res) => {
          console.info('loadMessageData ', res)
          this.loading = false
          if (res.success) {
            this.notificationData = res.result
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          if (this.notificationData.readFlag === '0') {
            EditCementSend({ anntId: this.id }).then(() => {
              this.$store.commit(RECEIVE_MSG, true)
            })
          }
          if (this.$route.query) {
            if (this.$route.query.direct === '1') {
              this.viewNotification(this.notificationData)
            }
          }
        })
      },

      // TODO 处理拒绝按钮逻辑
      handleAcceptCollaborate () {
        console.info('handleAcceptCollaborate', this.notificationData)
        this.acceptLoading = true
        CollaboratesAgree({ id: this.notificationData.busId, agreeFlag: CollaborateStatus.agree }).then(res => {
          console.info('handleApply', res)
          this.$message.success('collaborate successfully')
        }).then(() => {
          this.acceptLoading = false
          this.loadMessageData()
        })
        // console.info('handleAcceptCollaborate', this.notificationData)
        // this.acceptLoading = true
        // ReceiveCollaborate({ id: this.notificationData.busId }).then(res => {
        //   console.info('ReceiveCollaborate', res)
        //   this.$message.success('collaborate successfully')
        // }).then(() => {
        //   this.acceptLoading = false
        // }).finally(() => {
        //   this.loadMessageData()
        // })
      },

      // TODO 处理按钮逻辑
      handleRefuseCollaborate () {
        console.info('handleRefuseCollaborate', this.notificationData)
        this.refuseLoading = true
        DeleteCollaborate({ id: this.notificationData.busId }).then(res => {
          console.info('handleRefuseCollaborate', res)
        }).then(() => {
          this.loadMessageData()
        }).finally(() => {
          this.refuseLoading = false
        })
      },

      handleLinkItem (item, event) {
        console.info('handleLinkItem', item)
        event.preventDefault()
        event.stopPropagation()
        const index = this.mySelectedList.indexOf(item.id)
        if (index !== -1) {
          this.mySelectedList.splice(index, 1)
        } else {
          this.mySelectedList.push(item.id)
        }
      },

      handleGoBack () {
        this.$router.replace({ path: '/notification' })
        this.$router.go(-1)
        return false
      },
      showAnnouncement () {
        if (this.notificationData.openType === 'url') {
          this.openPath = this.notificationData.openPage
          this.formData = { id: this.notificationData.busId }
          this.$router.push({ path: this.notificationData.openPage })
        }
      }
    }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.notification-detail {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 400px;
  .top {
    padding: 0 0 10px 0;
    .left-wrapper {
      .back {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        .back-icon {
          img {
            width: 50px;
          }
        }

        .back-text {
          height: 26px;
          font-size: 18px;
          font-family: Arial;
          font-weight: 600;
          color: #808191;
          opacity: 1;
          margin-left: 10px;
        }
      }
    }
  }

  .main-body {
    width: 100%;
    background-color: #fafafa;
    opacity: 1;
    border-radius: 4px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .header-line {
      display: flex;
      padding-bottom: 10px;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      .user-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        .avatar-wrapper {
          img {
            height: 45px;
            border-radius: 45px;
          }
        }

        .post-info {
          margin-left: 10px;
          display: flex;
          flex-direction: column;

          .post-by {
            font-size: 19px;
            font-family: Arial;
            font-weight: 600;
            color: #363636;
          }

          .post-time {
            font-size: 12px;
            font-family: Inter-Bold;
            color: #B2B2B2;
            opacity: 1;
          }
        }
      }

      .action-btn-wrapper {
        margin-left: 30px;
        .action-btn-list {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          .action-item {
            margin-right: 10px;
          }
        }
      }
    }

    .content-body {
      display: flex;
      flex-direction: column;
      .content-title {
        padding: 10px 0;
        font-size: 18px;
        font-family: Arial;
        font-weight: 900;
        color: #363636;
      }

      .content-body {
        font-size: 14px;
        font-family: Inter-Bold;
        color: #11142D;
      }
    }
  }
}

</style>
