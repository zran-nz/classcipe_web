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
          <a-tab-pane tab="Message" key="1">
            <a-list>
              <a-list-item class="content-item" :key="index" v-for="(record, index) in announcement1">
                <a-list-item-meta :title="record.titile" :description="record.sendTime| dayjs" @click="showAnnouncement(record)">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                </a-list-item-meta>
              </a-list-item>

              <!--              <a-list-item @click="goPage()" class="content-item">-->
              <!--                <a-list-item-meta title="你收到了 14 份新周报" description="一年前">-->
              <!--                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>-->
              <!--                </a-list-item-meta>-->
              <!--              </a-list-item>-->
              <!--              <a-list-item>-->
              <!--                <a-list-item-meta title="你推荐的 曲妮妮 已通过第三轮面试" description="一年前">-->
              <!--                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png"/>-->
              <!--                </a-list-item-meta>-->
              <!--              </a-list-item>-->
              <!--              <a-list-item>-->
              <!--                <a-list-item-meta title="这种模板可以区分多种通知类型" description="一年前">-->
              <!--                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png"/>-->
              <!--                </a-list-item-meta>-->
              <!--              </a-list-item>-->
              <div style="margin-top: 5px;text-align: center">
                <a-button @click="goPage()" type="dashed" block>Show More</a-button>
              </div>
            </a-list>
          </a-tab-pane>
          <a-tab-pane tab="Notification" key="2">
            <a-list>
              <a-list-item :key="index" v-for="(record, index) in announcement2">
                <div style="margin-left: 5%;width: 80%">
                  <p><a @click="showAnnouncement(record)">{{ record.titile }}</a></p>
                  <p style="color: rgba(0,0,0,.45);margin-bottom: 0px">{{ record.createTime }} release</p>
                </div>
                <!--                <div style="text-align: right">-->
                <!--                  <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'L'" color="blue">一般消息</a-tag>-->
                <!--                  <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'M'" color="orange">重要消息</a-tag>-->
                <!--                  <a-tag @click="showAnnouncement(record)" v-if="record.priority === 'H'" color="red">紧急消息</a-tag>-->
                <!--                </div>-->
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
import { EditCementSend, ListCementByUser, NoticeQueryById } from '@/api/notice'
import DynamicNotice from '@/components/NoticeIcon/DynamicNotice'

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
      websock: null,
      lockReconnect: false,
      heartCheck: null,
      formData: {},
      openPath: ''
    }
  },
  components: {
    DynamicNotice
  },
  computed: {
    msgTotal () {
      return parseInt(this.msg1Count) + parseInt(this.msg2Count)
    }
  },
  mounted () {
    this.loadData()
    // this.timerFun()
    this.initWebSocket()
    this.heartCheckFun()
  },
  destroyed: function () { // 离开页面生命周期函数
    this.websocketOnclose()
  },
  watch: {
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
            // this.msg1Title = '通知(' + res.result.anntMsgTotal + ')'
            this.announcement2 = res.result.sysMsgList
            this.msg2Count = res.result.sysMsgTotal
            // this.msg2Title = '系统消息(' + res.result.sysMsgTotal + ')'
            this.$store.commit('SET_SHARED_COUNT', this.msg1Count)
          }
        }).catch(error => {
          logger.info('系统消息通知异常', error)// 这行打印permissionName is undefined
          this.stopTimer = true
          logger.info('清理timer')
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
    modalFormOk () {
    },
    handleHoverChange (visible) {
      this.visible = visible
    },

    initWebSocket: function () {
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      var userId = this.$store.getters.userInfo.id
      var url = process.env.VUE_APP_API_BASE_URL.replace('https://', 'wss://').replace('http://', 'ws://') + '/classcipe/websocket/' + userId
      // logger.info(url);
      this.websock = new WebSocket(url)
      this.websock.onopen = this.websocketOnopen
      this.websock.onerror = this.websocketOnerror
      this.websock.onmessage = this.websocketOnmessage
      this.websock.onclose = this.websocketOnclose
    },
    websocketOnopen: function () {
      logger.info('WebSocket connect success')
      // 心跳检测重置
      this.heartCheck.reset().start()
    },
    websocketOnerror: function (e) {
      logger.info('WebSocket connect error')
      this.reconnect()
    },
    websocketOnmessage: function (e) {
      logger.info('-----receive message-------', e.data)
      // if (e.data.toString() === 'HeartBeat') {
      //   // 心跳检测重置
      //   this.heartCheck.reset().start()
      //   return
      // }
      // eslint-disable-next-line no-eval
      var data = eval('(' + e.data + ')') // 解析对象
      if (data.cmd === 'topic') {
        // 系统通知
        this.loadData()
      } else if (data.cmd === 'user') {
        // 用户消息
        this.loadData()
      }
      // 心跳检测重置
      this.heartCheck.reset().start()
    },
    websocketOnclose: function (e) {
      logger.info('connection closed (' + e + ')')
      if (e) {
        logger.info('connection closed (' + e.code + ')')
      }
      this.reconnect()
    },
    websocketSend (text) { // 数据发送
      try {
        this.websock.send(text)
      } catch (err) {
        logger.info('send failed (' + err.code + ')')
      }
    },

    openNotification (data) {
      var text = data.msgTxt
      const key = `open${Date.now()}`
      this.$notification.open({
        message: 'Notification',
        placement: 'bottomRight',
        description: text,
        key,
        btn: (h) => {
          return h('a-button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            on: {
              click: () => this.showDetail(key, data)
            }
          }, '查看详情')
        }
      })
    },

    reconnect () {
      var that = this
      if (that.lockReconnect) return
      that.lockReconnect = true
      // 没连接上会一直重连，设置延迟避免请求过多
      setTimeout(function () {
        console.info('Try to reconnect...')
        that.initWebSocket()
        that.lockReconnect = false
      }, 5000)
    },
    heartCheckFun () {
      var that = this
      // 心跳检测,每20s心跳一次
      that.heartCheck = {
        timeout: 30000,
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function () {
          clearTimeout(this.timeoutObj)
          // clearTimeout(this.serverTimeoutObj);
          return this
        },
        start: function () {
          // var self = this
          this.timeoutObj = setTimeout(function () {
            // 这里发送一个心跳，后端收到后，返回一个心跳消息，
            // onmessage拿到返回的心跳就说明连接正常
            that.websocketSend(JSON.stringify({ 'cmd': 'HeartCheck' }))
            console.info('The client sends a heartcheck')
            // self.serverTimeoutObj = setTimeout(function () { // 如果超过一定时间还没重置，说明后端主动断开了
            //  that.websock.close()// 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            // }, self.timeout)
          }, this.timeout)
        }
      }
    },

    showDetail (key, data) {
      this.$notification.close(key)
      var id = data.msgId
      NoticeQueryById({ id: id }).then((res) => {
        if (res.success) {
          var record = res.result
          this.showAnnouncement(record)
        }
      })
    }
  }
}
</script>

<style lang="css">
  .header-notice .ant-badge-count {
    left: 5px;
    min-width: 16px;
    height: 16px;
    padding: 0 3px;
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
</style>
