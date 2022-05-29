<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
      <!--只允许登陆后才可以反馈-->
      <feedback v-if="showFeedback" />
    </div>
  </a-config-provider>
</template>

<script>
import { domTitle, setDocumentTitle } from '@/utils/domUtil'
import { i18nRender } from '@/locales'
import Feedback from '@/components/Feedback/Feedback'
import { ClasscipeEvent, ClasscipeEventBus } from '@/classcipeEventBus'
import enquireScreen from '@/utils/device'
import { mapMutations } from 'vuex'
import { TOGGLE_DEVICE } from './store/mutation-types'

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
    }
  },
  watch: {
    '$store.getters.bindCurriculum': function(newValue) {
      if (newValue) {
        this.$store.dispatch('GetAllSubjects', newValue)
      }
    }
  },
  created() {
    if (this.$store.getters.userInfo) {
      this.$store.dispatch('initData')
    }

    window.addEventListener('message', this.handlePostMessage, false)
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
    handlePostMessage(e) {
      const eventData = e.data
      switch (eventData.event) {
        case ClasscipeEvent.GOOGLE_AUTH_REFRESH:
          ClasscipeEventBus.$emit(ClasscipeEvent.GOOGLE_AUTH_REFRESH)
          break
        case ClasscipeEvent.LIBRARY_IFRAME_EVENT:
          ClasscipeEventBus.$emit(ClasscipeEvent.LIBRARY_IFRAME_EVENT, eventData)
          break
        default:
          break
      }
    }
  }
}
</script>

<style></style>
