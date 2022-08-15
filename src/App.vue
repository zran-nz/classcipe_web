<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
      <!--只允许登陆后才可以反馈-->
      <feedback v-if="showFeedback" />
      <div id='global-loading' v-show='globalLoading'>
        <div class='loading-gif'>
          <div class='loading-tips'>
            Please wait, we are taking you to Google slides...
          </div>
          <img src='~@/assets/icons/loading1.gif' />
        </div>
      </div>
    </div>
  </a-config-provider>
</template>

<script>

import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'
import Feedback from '@/components/Feedback/Feedback'
import { ClasscipeEvent, ClasscipeEventBus } from '@/classcipeEventBus'
import enquireScreen from '@/utils/device'
import { mapGetters, mapMutations, mapState } from 'vuex'
import { ACCESS_TOKEN, TOGGLE_DEVICE } from './store/mutation-types'
import storage from 'store'
import { USER_MODE } from '@/const/common'

export default {
  components: { Feedback },
  data() {
    return {
      stopTimer: false,
      websock: null,
      lockReconnect: false,
      heartCheck: null
    }
  },
  computed: {
    locale() {
      // 只是为了切换语言时，更新标题
      const { title } = this.$route.meta
      title && setDocumentTitle(`${i18nRender(title)} - ${domTitle}`)

      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    },
    showFeedback() {
      const noshowPage = window.location.href.indexOf('addon-iframe') === -1
      const noshowPage2 = window.location.href.indexOf('classroom-iframe') === -1
      const noshowPage3 = window.location.href.indexOf('/h5/') === -1
      return noshowPage && noshowPage2 && noshowPage3
    },
    ...mapGetters(['globalLoading']),
    ...mapState({
      userMode: state => state.app.userMode
    })
  },
  watch: {
    '$store.getters.bindCurriculum': function(newValue) {
      if (newValue) {
        this.$store.dispatch('GetSubjectsByCurriculum', newValue)
        this.$store.dispatch('initSubjectGradeData', {
          schoolId: this.$store.getters.school,
          bindCurriculumId: newValue
        })
      }
    },
    '$store.state.websocket.currentNotificationMsg': function(newValue) {
      console.log('currentNotificationMsg change', newValue)
      if (newValue) {
        this.showUserMessageNotification(newValue)
      }
    },
    '$store.getters.school': function(newValue) {
      if (newValue) {
        this.$store.dispatch('initSubjectGradeData', {
          schoolId: newValue,
          bindCurriculumId: this.$store.getters.bindCurriculum,
          applyType: this.userMode === USER_MODE.SCHOOL ? 1 : 2
        })
      }
    }
  },
  created() {
    if (this.$store.getters.userInfo) {
      this.$store.dispatch('initData')
    }

    window.addEventListener('message', this.handlePostMessage, false)
    this.$store.dispatch('initCurriculumData')
    this.$store.dispatch('initTagData', storage.get(ACCESS_TOKEN))
  },
  mounted() {
    var that = this
    enquireScreen(device => {
      console.log(device)
      that[TOGGLE_DEVICE](device)
    })
  },
  methods: {
    ...mapMutations([TOGGLE_DEVICE]),
    async handlePostMessage(e) {
      const eventData = e.data
      switch (eventData.event) {
        case ClasscipeEvent.GOOGLE_AUTH_REFRESH:
          ClasscipeEventBus.$emit(ClasscipeEvent.GOOGLE_AUTH_REFRESH)
          break
        case ClasscipeEvent.LIBRARY_IFRAME_EVENT:
          this.$logger.info('LIBRARY_IFRAME_EVENT', eventData)
          ClasscipeEventBus.$emit(ClasscipeEvent.LIBRARY_IFRAME_EVENT, eventData)
          break
        default:
          break
      }
    },

    showUserMessageNotification(message) {
      console.log('showUserMessageNotification', message)
      const key = Date.now().toString(36) + Math.random().toString(36).slice(2)
      this.$notification.open({
        message: 'Notification',
        description: message.msgTxt,
        duration: 5000,
        key,
        btn: h => {
          return h(
            'a-button',
            {
              props: {
                type: 'primary'
              },
              on: {
                click: () => {
                  this.$notification.close(key)
                  this.$router.push({
                    path: '/notification-detail/' + message.msgId
                  })
                }
              }
            },
            'Check detail'
          )
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

#global-loading {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  .loading-gif {
    text-align: center;
    img {
      width: 250px;
    }
  }

  .loading-tips {
    font-size: 20px;
    color: #aaa;
    padding: 10px 0;
  }
}

</style>
