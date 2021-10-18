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
          <div slot="extra" class="my-extra-time">
            <div class="send-time">{{ item.sendTime| dayjs }}</div>
            <div class="read-status">
              <div class="read-flag-dot" v-if="item.readFlag === '0'"></div>
            </div>
          </div>
          <a-list-item-meta :description="item.msgContent" @click="handleViewItem(item)">
            <a slot="title">{{ item.titile }}</a>
            <img class="message-icon" slot="avatar" src="~@/assets/icons/header/message.png"/>
          </a-list-item-meta>
          <div class="action-bar">
            <!--// TODO 不同的消息类型不同的处理按钮逻辑-->
            <template v-if="item.busType === notificationTypeMap.collaborateInvite">
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
      }).finally(() => {
        this.loading = false
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
    display: flex;
    flex-direction: column;
    width: 300px;
    position: absolute;
    right: 40px;
    line-height: 24px;
    color: #B2B2B2;
    top: 10px;
    .send-time {
      position: absolute;
      right: 0px;
      line-height: 24px;
      color: #B2B2B2;
      top: 0px;
    }

    .read-status {
      position: absolute;
      right: -40px;
      top: -5px;
    }
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

.read-flag-dot {
  height: 10px;
  width: 10px;
  border-radius: 10px;
  background-color: rgba(21, 195, 154, 1);
}
</style>
