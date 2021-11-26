<template>
  <a-card :bordered="false" title="Notification">
    <a slot="extra" href="#" @click="markAlertVisible = true">Mark as read</a>
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
          <div class="select-block" @click="handleLinkItem(item, $event)" v-if="showSelect">
            <a-icon
              class="select-block-icon"
              type="border"
              v-if="mySelectedList.indexOf(item.id) === -1" />
            <div class="selected-icon" v-if="mySelectedList.indexOf(item.id) !== -1">
              <img src="~@/assets/icons/lesson/selected.png"/>
            </div>
          </div>
          <div class="action-bar">
            <!--// TODO 不同的消息类型不同的处理按钮逻辑-->
            <template v-if="item.busType === notificationTypeMap.collaborateInvite && item.busFlag === '0'">
              <div class="action-item">
                <a-button class="gray-btn" :style="{'background': ' #E5E5E5', 'border-color': '#E5E5E5', 'color': '#000000'}" shape="round" @click="handleRefuseCollaborate(item)">Refuse</a-button>
              </div>
              <div class="action-item">
                <a-button type="primary" shape="round" @click="handleAcceptCollaborate(item)">Accept</a-button>
              </div>
            </template>
          </div>
        </a-list-item>
      </a-list>
    </div>

    <a-modal
      v-model="markAlertVisible"
      :footer="null"
      :title="null"
      destroyOnClose
      width="700px"
      :closable="false">
      <div class="alert-wrapper">
        <div class="modal-title">
          Mark as read
        </div>
        <div class="main-tips">
          <div class="img">
            <img src="~@/assets/icons/header/mark_alert.png" alt=""/>
          </div>
          <div class="description">
            Are you sure you want to mark all unread messages as read?
          </div>
        </div>
        <div class="alert-action row-flex-center">
          <div class="slide-btn-wrapper">
            <a-button @click="markAlertVisible = false" style="background: #D7D9D9;border: 1px solid #D7D9D9;border-radius: 25px;color: #000;" class="btn-item btn-item-no " type="primary">
              Cancel
            </a-button>
            <a-button @click="handleMarkRead" style="background: #15C39A;;border: 1px solid #15C39A;border-radius: 25px;color: #fff;" class="btn-item btn-item-yes" type="primary">
              Confirm
            </a-button>
          </div>
        </div>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'
import * as logger from '@/utils/logger'
import { EditCementSend, ListByMessage } from '@/api/notice'
import { NotificationTypeMap } from '@/views/dashboard/NotificationTypeMap'
import { RECEIVE_MSG } from '@/store/mutation-types'
import { DeleteCollaborate, ReceiveCollaborate } from '@/api/collaborate'

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
          sessionStorage.setItem('NotificationPage', this.pageNo)
          this.loadMessageData()
        },
        showTotal: total => `Total ${total} items`,
        total: 0,
        pageSize: 10
      },
      pageNo: sessionStorage.getItem('NotificationPage') ? sessionStorage.getItem('NotificationPage') : 1,
      loading: true,
      messageList: [],
      notificationTypeMap: NotificationTypeMap,
      mySelectedList: [],
      showSelect: false,
      acceptLoading: false,
      refuseLoading: false,
      markAlertVisible: false
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
      this.$router.push({
        path: '/notification-detail/' + data.id
      })
    },

    // TODO 处理按钮逻辑
    handleRefuseCollaborate (item) {
      this.$logger.info('handleRefuseCollaborate', item)
      DeleteCollaborate({ id: item.busId }).then(res => {
        logger.info('handleRefuseCollaborate', res)
      }).then(() => {
        EditCementSend({ anntId: item.id }).then(() => {
          this.$store.commit(RECEIVE_MSG, true)
        })
      }).finally(() => {
        this.loadMessageData()
      })
    },

    // TODO 处理拒绝按钮逻辑
    handleAcceptCollaborate (item) {
      this.$logger.info('handleAcceptCollaborate', item)
      this.acceptLoading = true
      ReceiveCollaborate({ id: item.busId }).then(res => {
        logger.info('ReceiveCollaborate', res)
        this.$message.success('collaborate successfully')
      }).then(() => {
        EditCementSend({ anntId: item.id }).then(() => {
          this.$store.commit(RECEIVE_MSG, true)
        })
        this.acceptLoading = false
      }).finally(() => {
        this.loadMessageData()
      })
    },
    handleLinkItem (item, event) {
      logger.info('handleLinkItem', item)
      event.preventDefault()
      event.stopPropagation()
      const index = this.mySelectedList.indexOf(item.id)
      if (index !== -1) {
        this.mySelectedList.splice(index, 1)
      } else {
        this.mySelectedList.push(item.id)
      }
    },
    handleMarkRead () {
      // this.showSelect = !this.showSelect
      const ids = this.messageList.filter(item => item.readFlag === '0').map(item => { return item.id })
      logger.info('handleMarkRead', ids)
      if (ids.length > 0) {
        EditCementSend({ anntId: ids.join(',') }).then(() => {
          this.$store.commit(RECEIVE_MSG, true)
          this.loadMessageData()
        })
      }
      this.markAlertVisible = false
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

  .select-block {
    cursor: pointer;
    float: right;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .select-block-icon {
      color: #ccc;
      font-size: 20px;
      cursor: pointer;
    }

    .selected-icon {
      img {
        width: 20px;
      }
    }
  }
}

.read-flag-dot {
  height: 10px;
  width: 10px;
  border-radius: 10px;
  background-color: rgba(21, 195, 154, 1);
}

.alert-wrapper {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .modal-title {
    margin: 5px auto;
    display: flex;
    width: 186px;
    font-size: 20px;
    font-family: Arial;
    font-weight: 900;
    line-height: 20px;
    color: #070707;
    opacity: 1;
  }

  .main-tips {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
     img {
      width: 300px;
      height: 200px;
      margin: 20px;
    }
    .description{
      margin: 10px;
      font-size: 15px;
      font-family: Inter-Bold;
      line-height: 32px;
      color: #474747;
    }
  }

  .row-flex-center {
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    .btn-item{
      margin:0px 10px;
    }
  }
}

</style>
