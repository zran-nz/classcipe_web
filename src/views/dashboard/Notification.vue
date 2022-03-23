<template>
  <a-card :bordered="false">
    <div slot="title" class="notification-title">
      <div class='back' @click='goBack'>
        <span class='back-icon'>
          <a-icon type='left' /> Back
        </span>
      </div>
      <div>Notification</div>
      <div class="ant-tabs-nav-wrap">
        <div class="ant-tabs-nav-scroll">
          <div class="ant-tabs-nav ant-tabs-nav-animated">
            <div>
              <div :class="{'ant-tabs-tab':true,'ant-tabs-tab-active':selectTab === 'all'}" @click="handleSelectTab('all')">All</div>
              <div :class="{'ant-tabs-tab':true,'ant-tabs-tab-active':selectTab === '0'}">
                <a-badge style="width: 80px;" :count="$store.state.websocket.msgUnreadCount" :overflow-count="999" @click="handleSelectTab('0')">Unread</a-badge>
              </div>
              <div :class="{'ant-tabs-tab':true,'ant-tabs-tab-active':selectTab === '1'}" @click="handleSelectTab('1')">Read</div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
          <a-list-item-meta :description="item.msgContent" @click="viewNotification(item)">
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
          <!--          <div class="action-bar">-->
          <!--            &lt;!&ndash;// TODO 不同的消息类型不同的处理按钮逻辑&ndash;&gt;-->
          <!--            <template v-if="item.busType === notificationTypeMap.collaborateInvite && item.busFlag === '0'">-->
          <!--              <div class="action-item">-->
          <!--                <a-button class="gray-btn" :style="{'background': ' #E5E5E5', 'border-color': '#E5E5E5', 'color': '#000000'}" shape="round" @click="handleRefuseCollaborate(item)">Refuse</a-button>-->
          <!--              </div>-->
          <!--              <div class="action-item">-->
          <!--                <a-button type="primary" shape="round" @click="handleAcceptCollaborate(item)">Accept</a-button>-->
          <!--              </div>-->
          <!--            </template>-->
          <!--          </div>-->
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
import { NoticeMixin } from '@/mixins/NoticeMixin'

const directionType = {
  horizontal: 'horizontal',
  vertical: 'vertical'
}

export default {
  name: 'Notification',
  mixins: [baseMixin, NoticeMixin],
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
      markAlertVisible: false,
      selectTab: 'all'
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
        pageSize: this.pagination.pageSize,
        flag: this.selectTab === 'all' ? '' : this.selectTab
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
    },
    handleSelectTab(tab) {
      this.selectTab = tab
      this.loadMessageData()
    },
    goBack () {
      if (window.history.length <= 1) {
        this.$router.push({ path: '/' })
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

.notification-title {
  display: flex;
  align-items: center;
  .ant-tabs-nav-wrap{
    margin-left: 50px;
  }
  .ant-tabs-nav{
    margin: 0 12px 0 0;
    padding: 5px 6px;
  }
}

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

.back {
  padding-right: 20px;
  color: #15c39a;
  cursor: pointer;
}
</style>
