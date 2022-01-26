<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
      <div id='feed-back' @click='captureScreen'>
        Feedback
      </div>
      <a-modal
        @cancel='feedbackModalVisible = false'
        width='800px'
        :visible='feedbackModalVisible'>
        <img :src='feedbackImgData' v-if='feedbackImgData' class='feedback-img'/>
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
        html2canvas(document.body, {
          allowTaint: true,
          backgroundColor: '#fff',
          foreignObjectRendering: true,
          useCORS: true,
          scrollX: 0,
          scrollY: 0
        }).then(canvas => {
          this.feedbackImgData = canvas.toDataURL('image/png')
          this.feedbackModalVisible = true
        })
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
  z-index: 5000;
  cursor: pointer;
  padding: 0 5px;
  font-size: 12px;
}

.feedback-img {
  width: 100%;
  height: 100%;
  margin: auto;
  max-width: 100%;
}
</style>
