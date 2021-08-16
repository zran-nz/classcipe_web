<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
  import { domTitle, setDocumentTitle } from '@/utils/domUtil'
  import { i18nRender } from '@/locales'
  import * as logger from '@/utils/logger'
  import { RECEIVE_MSG } from '@/store/mutation-types'

  export default {
    data () {
      return {
        stopTimer: false,
        websock: null,
        lockReconnect: false,
        heartCheck: null
      }
    },
    methods: {
      initWebSocket: function () {
        // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
        var userId = this.$store.getters.userInfo.id
        var url = process.env.VUE_APP_API_BASE_URL.replace('https://', 'wss://')
        .replace('http://', 'ws://') + '/classcipe/websocket/' + userId + '/' + Math.random().toString(36).substr(-10)
        logger.info(url)
        logger.info(this.websock)
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
          this.$store.commit(RECEIVE_MSG, true)
        } else if (data.cmd === 'user') {
          // 用户消息
          this.$store.commit(RECEIVE_MSG, true)
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
      }
    },
    computed: {
      locale () {
        // 只是为了切换语言时，更新标题
        const { title } = this.$route.meta
        title && (setDocumentTitle(`${i18nRender(title)} - ${domTitle}`))

        return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
      }
    },
    mounted () {
      console.log('load env', process.env)
      // this.timerFun()
      this.initWebSocket()
      this.heartCheckFun()
    }
  }
</script>
