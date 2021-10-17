<template>
  <a-popover
    trigger="click"
    v-model="visible"
    placement="bottomRight"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    overlayClassName="header-notice-wrapper"
    @visibleChange="handleHoverChange"
    :overlayStyle="{ width: '300px', top: '50px' }"
  >
    <template slot="content">
      <a-spin :spinning="loading">
        <a-tabs>
          <a-tab-pane tab="Notification" key="1" >
            <template v-if="announcement1.length === 0" >
              <div class="no-data">
                <no-more-resources tips="No notification"/>
              </div>
            </template>
            <a-list v-if="announcement1.length > 0">
              <a-list-item class="content-item" :key="index" v-for="(record, index) in announcement1">
                <a-list-item-meta :title="record.titile" :description="record.sendTime| dayjs" @click="showAnnouncement(record)">
                  <!-- TODO 是触发消息的用户头像 -->
                  <img class="message-icon" slot="avatar" :src="record.avatar ? record.avatar : ''"/>
                  <div class="my-read-status" slot="extra">
                    <div class="read-flag-dot"></div>
                  </div>
                </a-list-item-meta>
              </a-list-item>
              <div style="margin-top: 5px;text-align: center">
                <a-button @click="goPage()" type="dashed" block>Show More</a-button>
              </div>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
    <span class="header-notice" ref="noticeRef" >
      <a-badge :count="msgTotal" >
        <a-icon type="mail" theme="filled" :style="{ fontSize: '18px' }" :class="{'icon-active': routeActive, 'icon-inactive': !routeActive}" />
      </a-badge>
    </span>
    <dynamic-notice ref="showDynamNotice" :path="openPath" :formData="formData"/>
  </a-popover>
</template>

<script>
import * as logger from '@/utils/logger'
import { EditCementSend, ListCementByUser } from '@/api/notice'
import DynamicNotice from '@/components/NoticeIcon/DynamicNotice'
import { RECEIVE_MSG } from '../../store/mutation-types'
import NoMoreResources from '@/components/Common/NoMoreResources'

export default {
  name: 'HeaderNotice',
  data () {
    return {
      loading: false,
      visible: false,
      routeActive: false,
      announcement1: [],
      announcement2: [],
      msg1Count: '0',
      msg2Count: '0',
      stopTimer: false,
      formData: {},
      openPath: ''
    }
  },
  components: {
    DynamicNotice, NoMoreResources
  },
  computed: {
    msgTotal () {
      return parseInt(this.msg1Count) + parseInt(this.msg2Count)
    }
  },
  mounted () {
    this.loadData()
    // 轮询消息
    this.timerFun()
  },
  watch: {
    '$store.state.app.receiveMsg': function (newValue) {
      if (newValue) {
        this.loadData()
        this.$store.commit(RECEIVE_MSG, false)
      }
    },
    '$route.path' (toPath) {
      logger.debug('icon route change ' + toPath)
      if (this.announcement1.length === 0) {
        return
      }
      this.announcement1.forEach(item => {
        if (item.openPage === toPath) {
          EditCementSend({ anntId: item.id }).then((res) => {
            if (res.success) {
              this.loadData()
            }
          })
        }
      })
    }
  },
  methods: {
    goPage () {
      this.handleHoverChange(false)
      this.$router.push({ path: '/notification' })
    },
    timerFun () {
      this.stopTimer = false
      const myTimer = setInterval(() => {
        // 停止定时器
        if (this.stopTimer) {
          clearInterval(myTimer)
          return
        }
        this.loadData()
      }, 6000)
    },
    loadData () {
      try {
        // 获取系统消息
        ListCementByUser().then((res) => {
          if (res.success) {
            this.announcement1 = res.result.anntMsgList
            this.msg1Count = res.result.anntMsgTotal
            this.announcement2 = res.result.sysMsgList
            this.msg2Count = res.result.sysMsgTotal
            this.$store.commit('SET_SHARED_COUNT', res.result.collaborate ? res.result.collaborate : 0)
            this.$store.commit('SET_SHARED_FIND_COUNT', res.result.collaborateFind ? res.result.collaborateFind : 0)
          }
        }).catch(error => {
          logger.error('系统消息通知异常', error)
          this.stopTimer = true
          logger.error('清理timer')
        })
      } catch (err) {
        this.stopTimer = true
        logger.info('通知异常', err)
      }
    },
    fetchNotice () {
      if (this.loadding) {
        this.loadding = false
        return
      }
      this.loadding = true
      setTimeout(() => {
        this.loadding = false
      }, 200)
    },
    showAnnouncement (record) {
      EditCementSend({ anntId: record.id }).then((res) => {
        if (res.success) {
          this.loadData()
        }
      })
      this.visible = false
      if (record.openType === 'url') {
        this.openPath = record.openPage
        this.formData = { id: record.busId }
        this.$router.push({ path: record.openPage })
      } else if (record.openType === 'component') {
        this.openPath = record.openPage
        this.formData = { id: record.busId }
        this.$refs.showDynamNotice.detail(record.openPage)
      } else {
        this.goPage()
      }
    },
    handleHoverChange (visible) {
      this.visible = visible
    }
  }
}
</script>

<style lang="css">
  .header-notice .ant-badge-count {
    left: 5px;
    min-width: 16px;
    height: 16px;
    padding: 0 1px;
    color: #fff;
    font-size: 10px;
    line-height: 16px;
    border-radius: 10px;
  }
  .header-notice-wrapper {
    top: 40px !important;
  }
</style>
<style lang="less" scoped>
@import "~@/components/index.less";
  .ant-badge {
    svg {
      height: 35px;
      width: 35px;
      color: #fff;
    }
    .icon-inactive {
      color: #fff;
    }
    .icon-active {
      color: @primary-color;
    }

  }
.content-item{
  cursor: pointer;
}
.header-notice{
  display: inline-block;
  transition: all 0.3s;
  padding: 0px 16px;
  cursor: pointer;
  vertical-align: middle;

  span {
    vertical-align: initial;
  }
}
.message-icon{
  width: 40px;
  height: 40px;
  line-height: 40px;
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

.content-item {
  position: relative;
}

.my-read-status {
  position: absolute;
  right: 10px;
  top: 10px;
}
.read-flag-dot {
  height: 10px;
  width: 10px;
  border-radius: 10px;
  background-color: #07AB84;
}
</style>
