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
          :class="{'my-list-item': true}">
          <div slot="extra" >{{ item.sendTime| dayjs }}</div>
          <a-list-item-meta :description="item.msgContent">
            <a slot="title" @click="handleViewItem(item)">{{ item.titile }}</a>
            <img class="message-icon" slot="avatar" src="~@/assets/icons/header/message.png"/>
          </a-list-item-meta>
          <a-button type="primary" @click="handleView(item)">View details</a-button>
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
      messageList: []
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
      })
    },
    // TODO 根据不同的通知类型，进行不同的操作。collaborate跳转协作页面，其他通知跳转消息详情等等。
    handleView (key, data) {
      this.$logger.info('handleView ' + key, data)
      if (data.type === NotificationTypeMap.collaborate) {
        this.$router.push({
          path: ''
        })
      } else {
        this.$router.push({
          path: '/notification-detail/' + data.id
        })
      }
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
</style>
