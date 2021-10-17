<template>
  <a-card :bordered="false" title="Notification">
    <a slot="extra" href="#">Mark as read</a>
    <div>
      <a-list
        item-layout="vertical"
        size="large"
        :loading="loading"
        :pagination="pagination"
        :data-source="messageList">
        <a-list-item
          slot="renderItem"
          key="item.id"
          slot-scope="item"
          :class="{'my-list-item': true, 'my-notification-list-item': true}">
          <div slot="extra" class="my-extra-time">{{ item.sendTime| dayjs }}</div>
          <a-list-item-meta :description="item.msgContent" @click="handleViewItem(item)">
            <a slot="title">{{ item.title }}</a>
            <img class="message-icon" slot="avatar" src="~@/assets/icons/header/message.png"/>
          </a-list-item-meta>
          <div class="action-bar">
            <!--// TODO 不同的消息类型不同的处理按钮逻辑-->
            <template v-if="item.type === notificationTypeMap.collaborate">
              <div class="action-item">
                <a-button class="gray-btn" :style="{'background': ' #E5E5E5', 'border-color': '#E5E5E5', 'color': '#000000'}" shape="round" @click="handleRefuseCollaborate">Refuse</a-button>
              </div>
              <div class="action-item">
                <a-button type="primary" shape="round" @click="handleAcceptCollaborate">Accept</a-button>
              </div>
            </template>
          </div>
        </a-list-item>
      </a-list>
    </div>
  </a-card>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'
import * as logger from '@/utils/logger'
import { ListByMessage } from '@/api/notice'
import { NotificationTypeMap } from '@/views/dashboard/NotificationTypeMap'

const directionType = {
  horizontal: 'horizontal',
  vertical: 'vertical'
}

export default {
  name: 'Notification',
  mixins: [baseMixin],
  data () {
    this.directionType = directionType
    return {
      pagination: {
        onChange: page => {
          logger.info('pagination onChange', page)
          this.pageNo = page
          this.loadMessageData()
        },
        showTotal: total => `Total ${total} items`,
        total: 0,
        pageSize: 10
      },
      pageNo: 1,
      loading: true,
      messageList: [],
      notificationTypeMap: NotificationTypeMap
    }
  },
  computed: {

  },
  created () {
    this.loadMessageData()
  },
  methods: {
    loadMessageData () {
      this.loading = true
      ListByMessage({
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize
      }).then((res) => {
        logger.info('ListByMessage ', res)
        this.loading = false
        if (res.success) {
          // TODO 演示假数据，待删除
          res.result.records = [
            {
              id: 0,
              avatar: 'https://dcdkqlzgpl5ba.cloudfront.net/file/202106290118339914-avatar.png',
              readFlag: 0, // 已读状态
              type: NotificationTypeMap.collaborate, // 消息类型
              title: '测试，邀请你参加协作表单',
              msgContent: 'I had heard tales of Stanley being formidable and demanding, so I was slightly on guard already. “I know,” I said, still rather taken aback. “I’m Scottish!” During the previous year, I had auditioned on tape four or five times for his new film Eyes Wide Shut. It was for a role that appeared in only one scene, with only a few minutes’ time. Finally, I was offered the part, or actually, asked were I to be offered it, would I be available. And were I available, would I accept the role? I said yes I was and yes I would, and so I did. This was Stanley Kubrick. The genius. I couldn’t pass up the chance to work with such a legend.',
              sendTime: '2021-10-11 12:43:23'
            },
            {
              id: 1,
              avatar: 'https://dcdkqlzgpl5ba.cloudfront.net/file/202106290118339914-avatar.png',
              readFlag: 0, // 已读状态
              type: NotificationTypeMap.star, // 消息类型
              title: '测试，你的文件被xxx点赞了',
              msgContent: 'Finally the day came, and I found myself on set. By then, the film had been shooting for over a year and would eventually hold the record for the world’s longest continuous film shoot, coming in at 400 days! So, things were pretty well into their stride by the time I rolled up as a new boy, and here the director was already seemingly angry with me for being Scottish.',
              sendTime: '2021-10-11 12:43:23'
            }
          ]
          res.result.total = 2
          res.result.current = 0
          if (res.result.records && res.result.records.length) {
            this.messageList = res.result.records
            this.pagination.total = res.result.total
            this.pagination.current = res.result.current
          } else {
            this.myContentList = []
            this.pagination.total = 0
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },

    // TODO 根据不同的通知类型，进行不同的操作。collaborate跳转协作页面，其他通知跳转消息详情等等。
    handleViewItem (data) {
      this.$logger.info('handleView ', data)
      if (data.type === NotificationTypeMap.collaborate) {
        this.$router.push({
          path: '/'
        })
      } else {
        this.$router.push({
          path: '/notification-detail/' + data.id
        })
      }
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
.message-icon{
  width: 50px;
  height: 50px;
  line-height: 50px;
  border-radius: 50%;
}
.no-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60%;
  margin: auto;
}

.action-bar {
  margin-left: 55px;
  display: flex;
  flex-direction: row;
  align-items: center;
  .action-item {
    margin-right: 10px;
  }
}

.my-notification-list-item {
  position: relative;
  cursor: pointer;

  .my-extra-time {
    position: absolute;
    right: 40px;
    line-height: 24px;
    color: #B2B2B2;
    top: 10px;
  }
  .message-icon {
    width: 35px;
    height: 35px;
  }
  .ant-list-item-meta-title {
    font-family: Arial;
    font-weight: 900;
    line-height: 20px;
    color: #363636;

    a {
      font-family: Arial;
      font-weight: 900;
      line-height: 20px;
      color: #363636;
    }
  }
  .ant-list-item-meta-description {
    font-family: Inter-Bold;
    color: #11142D;
  }
}
</style>
