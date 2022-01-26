<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
      <div id='feed-back' @click='captureScreen'>
        Feedback
      </div>
      <a-modal
        class='feed-back-modal'
        @cancel='hiddenFeedback'
        width='800px'
        :visible='feedbackModalVisible'>
        <div id='my-canvas-container'></div>
      </a-modal>
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'
import html2canvas from 'html2canvas'

export default {
    data () {
      return {
        stopTimer: false,
        websock: null,
        lockReconnect: false,
        heartCheck: null,
        feedbackModalVisible: false,
        feedbackImgData: null
      }
    },
    methods: {
      captureScreen () {
        this.$logger.info('captureScreen')
        if (!this.feedbackModalVisible) {
          this.feedbackModalVisible = true
          html2canvas(document.body, {
            allowTaint: true,
            scrollX: window.pageXOffset,
            scrollY: window.pageYOffset,
            x: window.pageXOffset,
            y: window.pageYOffset
          }).then(canvas => {
            canvas.style.opacity = '1'
            canvas.style.zIndex = '99999999'
            canvas.className = 'my-capture-canvas'
            canvas.style.transition =
              'transform 0.3s cubic-bezier(0.42, 0, 0.58, 1),opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1),-webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1)'
            console.log('my-canvas-container', document.getElementById('my-canvas-container'))
            document.getElementById('my-canvas-container').appendChild(canvas)
          })
        }
      },
      hiddenFeedback () {
        this.$logger.info('hiddenFeedback', this.feedbackModalVisible)
        document.getElementById('my-canvas-container').innerHTML = ''
        this.feedbackModalVisible = false
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
    },
    created () {
      if (this.$store.getters.userInfo) {
        this.$store.dispatch('initData')
      }
    }
  }
</script>

<style>
#feed-back {
  position: fixed;
  right: 30px;
  bottom: 30px;
  background: #38cfa6;
  color: #fff;
  line-height: 30px;
  border-radius: 5px;
  box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.1);
  z-index: 3000;
  cursor: pointer;
  padding: 0 5px;
  font-size: 12px;
}

#my-canvas-container {
  position: relative;
  min-width: 800px;
  min-height: 500px;
}

.my-capture-canvas {
  width: 800px !important;
  height: auto !important;
}
</style>
