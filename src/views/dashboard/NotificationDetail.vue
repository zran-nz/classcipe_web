<template>
  <div class="notification-detail">
    <div class="top">
      <div class="left-wrapper">
        <div class="back">
          <div class="back-icon">
            <back-icon-svg />
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
            <img :src="avatar" />
          </div>
          <div class="post-info">
            <div class="post-by">
              {{ notificationData.postBy }}
            </div>
            <div class="post-time">
              {{ notificationData.postTime | dayjs }}
            </div>
          </div>
        </div>
        <div class="action-btn-wrapper">
          <div class="action-btn-list">
            <!--// TODO 不同的消息类型不同的处理按钮逻辑-->
            <template v-if="notificationData.notificationType === notificationTypeMap.collaborate">
              <div class="action-item">
                <a-button class="gray-btn" :style="{'background': ' #E5E5E5', 'color': '#000000'}" shape="round" @click="handleRefuseCollaborate">Refuse</a-button>
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
          {{ notificationData.title }}
        </div>
        <div class="content-detail">
          {{ notificationData.detail }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import backIconSvg from '@/assets/svgIcon/notification/back.svg?inline'
import { NotificationTypeMap } from '@/views/dashboard/NotificationTypeMap'
import { NoticeQueryById } from '@/api/notice'
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
  data () {
    return {
      notificationData: {
        avatar: null,
        postBy: null,
        postTime: '2021-10-12 12:34:24',
        notificationType: NotificationTypeMap.collaborate
      },
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
        })
      },

      // TODO 处理按钮逻辑
      handleRefuseCollaborate () {

      },

      // TODO 处理拒绝按钮逻辑
      handleAcceptCollaborate () {

      }
    }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.notification-detail {
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .top {
    padding: 5px 0 10px 0;
    .left-wrapper {
      .back {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        .back-icon {
          height: 30px;
        }

        .back-text {
          height: 26px;
          font-size: 18px;
          font-family: Arial;
          font-weight: 900;
          line-height: 20px;
          color: #808191;
          opacity: 1;
          margin-left: 10px;
        }
      }
    }
  }

  .main-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .header-line {
      padding-bottom: 10px;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      .user-info {
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        .avatar-wrapper {
          img {
            height: 40px;
            border-radius: 40px;
          }
        }

        .post-info {
          margin-left: 5px;
          display: flex;
          flex-direction: column;

          .post-by {
            height: 26px;
            font-size: 18px;
            font-family: Arial;
            font-weight: 900;
            line-height: 20px;
            color: #363636;
          }

          .post-time {
            height: 19px;
            font-size: 14px;
            font-family: Inter-Bold;
            line-height: 24px;
            color: #B2B2B2;
            opacity: 1;
          }
        }
      }

      .action-btn-wrapper {
        margin-left: 20px;
        .action-btn-list {
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
        height: 26px;
        font-size: 18px;
        font-family: Arial;
        font-weight: 900;
        line-height: 20px;
        color: #363636;
      }

      .content-body {
        font-size: 14px;
        font-family: Inter-Bold;
        line-height: 26px;
        color: #11142D;
      }
    }
  }
}
</style>
