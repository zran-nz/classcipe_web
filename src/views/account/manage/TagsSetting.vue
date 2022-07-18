<template>
  <iframe :src="iframeSrc" class='preview-iframe' id='tags-iframe' v-if='iframeSrc'></iframe>
  <a-spin :spinning="true" v-else></a-spin>
</template>

<script>

import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import { mapState } from 'vuex'
import { USER_MODE } from '@/const/common'

export default {
  name: 'TagsSetting',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  data() {
    return {
      baseUrl: null
    }
  },
  created() {
    const host = window.location.host
    if (host.indexOf('local') > -1) {
      this.baseUrl = 'https://dev.classcipe.com'
    } else if (host.indexOf('dev.classcipe.com') !== -1) {
      this.baseUrl = 'https://dev.classcipe.com'
    } else if (host.indexOf('my.classcipe.com') !== -1) {
      this.baseUrl = 'https://my.classcipe.com'
    } else {
      this.$logger.warn('TagsSetting: unknown host', host)
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      currentSchool: state => state.user.currentSchool,
      userMode: state => state.app.userMode
    }),
    iframeSrc() {
      if (this.baseUrl) {
        if (this.userMode === USER_MODE.SELF) {
          return this.baseUrl + '/v2/com/tags?token=' + this.user.token
        } else {
          if (this.currentSchool.roleNames.includes('admin')) {
            return this.baseUrl + '/v2/com/tags/' + this.currentSchool.id + '?token=' + this.user.token
          } else {
            return this.baseUrl + '/v2/com/tags/school/' + this.currentSchool.id + '?token=' + this.user.token
          }
        }
      }
      return null
    }
  },
  methods: {
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.preview-iframe {
  height: 100vh;
  width: 100%;
  border: none;
  outline: none;
}
</style>
