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
                <div class="action-item">
                  <a-button class="gray-btn" :style="{'background': '#E5E5E5', 'border-color': '#E5E5E5', 'color': '#000000'}" shape="round" @click="handleRefuseCollaborate">Refuse</a-button>
                </div>
                <div class="action-item">
                  <a-button type="primary" shape="round" @click="handleAcceptCollaborate">Accept</a-button>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="content-body">
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
export default {
  name: 'NotificationDetail',
  components: {
    backIconSvg
  },
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
      notificationTypeMap: NotificationTypeMap
    }
  },
    created () {
      this.$logger.info('loadMessageData ' + this.id)
      this.loadMessageData()
    },
    methods: {
      loadMessageData () {
        // TODO 查询消息详情
        NoticeQueryById({ id: this.id }).then((res) => {
          this.$logger.info('loadMessageData ', res)
          this.loading = false
          if (res.success) {
            this.notificationData = res.result
          } else {
            this.$message.error(res.message)
          }
        }).finally(() => {
          if (this.notificationData.readFlag === '0') {
            EditCementSend({ anntId: this.id })
            this.$store.commit(RECEIVE_MSG, true)
          }
        })
      },

      // TODO 处理按钮逻辑
      handleRefuseCollaborate () {

      },

      // TODO 处理拒绝按钮逻辑
      handleAcceptCollaborate () {

      },

      handleGoBack () {
        this.$router.replace({ path: '/notification' })
        return false
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
