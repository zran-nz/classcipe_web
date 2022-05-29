<template>
  <div class="library-iframe-container">
    <div class='library-search'>
      <div class='create-new'>
        <a-space>
          <global-search-input />
          <user-profile-avatar />
        </a-space>
      </div>
    </div>
    <div class='library-iframe-wrapper'>
      <iframe v-if='iframeSrc' :src='iframeSrc' id='library-iframe' />
    </div>
  </div>
</template>

<script>

import GlobalSearchInput from '@/components/GlobalSearch/GlobalSearchInput'
import UserProfileAvatar from '@/components/User/UserProfileAvatar'
import { ClasscipeEvent, ClasscipeEventBus } from '@/classcipeEventBus'
import { getLibraryRecommend, getLibraryResource, librarySearch, queryAllResource } from '@/api/v2/library'

export default {
  name: 'LibraryIframe',
  components: { UserProfileAvatar, GlobalSearchInput },
  data () {
    return {
      baseUrl: null
    }
  },
  computed: {
    iframeSrc() {
      if (this.baseUrl) {
        return this.baseUrl + '/v2/iframe/library'
      }
      return null
    }
  },
  created() {
    const host = window.location.host
    if (host.indexOf('localhost') !== -1) {
      this.baseUrl = 'http://localhost:9004'
    } else if (host.indexOf('dev.classcipe.com') !== -1) {
      this.baseUrl = 'https://dev.rssmv.cn'
    } else if (host.indexOf('my.classcipe.com') !== -1) {
      this.baseUrl = 'https://my.classcipe.com'
    } else {
      this.$logger.warn('ContentPreview: unknown host', host)
    }

    ClasscipeEventBus.$on(ClasscipeEvent.LIBRARY_IFRAME_EVENT, this.handleIframeEvent)
  },
  beforeDestroy() {
    ClasscipeEventBus.$off(ClasscipeEvent.LIBRARY_IFRAME_EVENT, this.handleIframeEvent)
  },
  mounted () {
  },
  methods: {

    async handleIframeEvent (data) {
      this.$logger.info('handleIframeEvent', JSON.stringify(data))
      data.callbackData = await this.getEventCallbackData(data)
      delete data.event
      data.from = 'form_page'
      this.$logger.info('handleIframeEvent send message', JSON.stringify(data))
      window.frames['library-iframe'].contentWindow.postMessage(data, '*')
    },

    async getEventCallbackData(data) {
      this.$logger.info('getEventCallbackData', JSON.stringify(data))
      if (data.act === 'getLibraryResource') {
        return getLibraryResource(data.param)
      } else if (data.act === 'getLibraryRecommend') {
        return getLibraryRecommend(data.param)
      } else if (data.act === 'librarySearch') {
        return librarySearch(data.param)
      } else if (data.act === 'queryAllResource') {
        return queryAllResource(data.param)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.library-iframe-container {
  background-color: #fff;
  height: 100vh;
  width: 100%;
  .library-search {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
    height: 80px;
    width: 100%;
  }

  .library-iframe-wrapper {
    height: calc(100vh - 80px);
    width: 100%;
    #library-iframe {
      height: 100%;
      width: 100%;
      border: none;
      outline: none;
    }
  }
}
</style>
