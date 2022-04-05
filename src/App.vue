<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view/>
      <!--只允许登陆后才可以反馈-->
      <feedback v-if='showFeedback' />
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'
import Feedback from '@/components/Feedback/Feedback'

export default {
  components: { Feedback },
  data () {
      return {
        stopTimer: false,
        websock: null,
        lockReconnect: false,
        heartCheck: null
      }
    },
    computed: {
      locale () {
        // 只是为了切换语言时，更新标题
        const { title } = this.$route.meta
        title && (setDocumentTitle(`${i18nRender(title)} - ${domTitle}`))

        return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
      },
      showFeedback () {
        return window.location.href.indexOf('addon-iframe') === -1
      }
    },
    watch: {
      '$store.getters.bindCurriculum': function (newValue) {
        if (newValue) {
          this.$store.dispatch('GetAllSubjects', newValue)
        }
      }
    },
    created () {
      if (this.$store.getters.userInfo) {
        this.$store.dispatch('initData')
      }
    }
  }
</script>

<style>
</style>
