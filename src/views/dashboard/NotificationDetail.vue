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
              <template v-if="notificationData.type === notificationTypeMap.collaborate">
                <div class="action-item">
                  <a-button class="gray-btn" :style="{'background': ' #E5E5E5', 'color': '#000000'}" shape="round" @click="handleRefuseCollaborate">Refuse</a-button>
                </div>
                <div class="action-item">
                  <a-button type="primary" shape="round" @click="handleAcceptCollaborate">Accept</a-button>
                </div>
              </template>
              <template v-if="notificationData.type === notificationTypeMap.star">
                <div class="action-item">
                  <a-button class="gray-btn" :style="{'background': ' #E5E5E5', 'border-color': '#E5E5E5', 'color': '#000000'}" shape="round" @click="handleRefuseCollaborate">Refuse</a-button>
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
      // 测试数据，待删除
      const data = [{
        id: 0,
        avatar: 'https://dcdkqlzgpl5ba.cloudfront.net/file/202106290118339914-avatar.png',
        readFlag: 0, // 已读状态
        type: NotificationTypeMap.collaborate, // 消息类型
        title: '测试，邀请你参加协作表单',
        msgContent: 'I had heard tales of Stanley being formidable and demanding, so I was slightly on guard already. “I know,” I said, still rather taken aback. “I’m Scottish!” During the previous year, I had auditioned on tape four or five times for his new film Eyes Wide Shut. It was for a role that appeared in only one scene, with only a few minutes’ time. Finally, I was offered the part, or actually, asked were I to be offered it, would I be available. And were I available, would I accept the role? I said yes I was and yes I would, and so I did. This was Stanley Kubrick. The genius. I couldn’t pass up the chance to work with such a legend.',
        sendTime: '2021-10-11 12:43:23',
        postBy: 'xunwu'
      },
        {
          id: 1,
          avatar: 'https://dcdkqlzgpl5ba.cloudfront.net/file/202106290118339914-avatar.png',
          readFlag: 0, // 已读状态
          type: NotificationTypeMap.star, // 消息类型
          title: '测试，你的文件被xxx点赞了',
          msgContent: 'Finally the day came, and I found myself on set. By then, the film had been shooting for over a year and would eventually hold the record for the world’s longest continuous film shoot, coming in at 400 days! So, things were pretty well into their stride by the time I rolled up as a new boy, and here the director was already seemingly angry with me for being Scottish.',
          sendTime: '2021-10-11 12:43:23',
          postBy: 'xunwu'
        }]
      this.notificationData = data[parseInt(this.id)]
      this.$logger.info('notificationData ', this.notificationData)
      // this.loadMessageData()
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

      },

      handleGoBack () {
        if (window.history.length <= 1) {
          this.$router.replace({ path: '/notification' })
          return false
        } else {
          this.$router.go(-1)
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
    min-height: 200px;
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
