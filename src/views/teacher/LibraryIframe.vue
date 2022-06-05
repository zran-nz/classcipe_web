<template>
  <div class="library-iframe-container">
    <div class='library-search'>
      <div class='create-new'>
        <a-space>
          <global-search-input @search='handleSearch' @view-content='handleViewContent' />
          <user-profile-avatar />
        </a-space>
      </div>
    </div>
    <div class='library-iframe-wrapper'>
    </div>
  </div>
</template>

<script>

import GlobalSearchInput from '@/components/GlobalSearch/GlobalSearchInput'
import UserProfileAvatar from '@/components/User/UserProfileAvatar'
import { mapState } from 'vuex'

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
        return this.baseUrl + '/v2/library'
      }
      return null
    },
    ...mapState({
      currentSchool: state => state.user.currentSchool
    })
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
    this.$logger.info('open library page', this.iframeSrc)
    window.open(this.iframeSrc, '_blank')
  },
  methods: {

    handleSearch (data) {
      this.$logger.info('handleSearch', data)
      if (data && data.length >= 3) {
        this.$router.push({ path: '/teacher/library/search/' + data })
      }
    },

    handleViewContent (item) {
      this.$logger.info('handleViewContent', item)
      item.fromType = parseInt(item.fromType)
      if (item.fromType === this.$classcipe.typeMap.pd) {
        this.$router.push({
          path: '/teacher/pd-content-redirect/' + item.id
        })
      } else if (item.fromType === this.$classcipe.typeMap.task) {
        this.$router.push({
          path: '/teacher/task-redirect/' + item.id
        })
      } else if (item.fromType === this.$classcipe.typeMap['unit-plan']) {
        this.$router.push({
          path: '/teacher/unit-plan-redirect/' + item.id
        })
      } else if (item.fromType === this.$classcipe.typeMap.video) {
        this.$router.push({
          path: '/teacher/video-redirect/' + item.id
        })
      } else {
        this.$logger.warn('handleViewContent: unknown type', item.fromType)
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
  }
}
</style>
