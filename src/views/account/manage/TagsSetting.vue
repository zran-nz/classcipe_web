<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='Tags Setting'
          :show-share='false'
          :show-collaborate='false'
          :is-preview-mode='true'
          @back='goBack'>
          <template v-slot:back>
            <img @click.stop="openV2('/v2/')" src="~@/assets/logo/50.png" class='single-logo-img' alt='classcipe' />
          </template>
          <template v-slot:left>
            <a-space :size="5" align="center" @click.stop>
              <label style="cursor: pointer" @click="openV2('/v2/account/info')">Account Info</label>
              <label for="">></label>
              <label style="font-weight: normal">Tags Setting</label>
            </a-space>
          </template>
          <template v-slot:right>
          </template>
        </form-header>
      </template>
    </fixed-form-header>
    <div class="form-content">
      <a-spin :spinning="loading"></a-spin>
      <iframe :src="iframeSrc" class='preview-iframe' id='tags-iframe' v-if='iframeSrc'></iframe>
    </div>
  </div>
</template>

<script>

import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'

import { mapState } from 'vuex'
import { USER_MODE } from '@/const/common'

export default {
  name: 'TagsSetting',
  components: {
    FixedFormHeader,
    FormHeader
  },
  mixins: [UserModeMixin, CurrentSchoolMixin],
  data() {
    return {
      baseUrl: null,
      loading: false
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
      this.baseUrl = 'https://classcipe.com'
    }
    this.loading = true
    setTimeout(() => {
      this.loading = false
    }, 1000)
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
          const roles = this.currentSchool.roleNames.map(item => item.toLowerCase())
          if (roles.includes('admin')) {
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
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.cc-fixed-form-header {
  height: 60px;
}
.form-content {
  margin-top: 60px;
  height: calc(100vh - 60px);
  padding: 30px 60px;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.preview-iframe {
  height: 100%;
  width: 100%;
  border: none;
  outline: none;
}
</style>
