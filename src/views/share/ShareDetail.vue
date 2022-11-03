<template>
  <div class='share-detail'>
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '300px' }" v-if='!shareInfoLoaded'>
      <a-spin class="redirect-spin" tip="Loading..." size="large"/>
    </a-card>

    <div class='share-content' v-if='shareInfoLoaded && !shareContentLoading && !shareExpired'>
      <template v-if='shareContent.contentType === typeMap.task'>
        <share-task :share-content='shareContent' />
      </template>
      <template v-if='shareContent.contentType === typeMap["unit-plan"]'>
        <share-unit-plan :share-content='shareContent' />
      </template>
    </div>
    <div class='expired-share' v-if='shareExpired'>
      <share-expired />
    </div>
    <a-modal
      v-model="passwordDialogVisible"
      :footer="null"
      :maskClosable="false"
      :closable="false"
      width='600px'
      destroyOnClose
      @ok="passwordDialogVisible = false"
      @cancel="passwordDialogVisible = false">
      <share-password-auth :title='title' :cover-url='coverUrl' v-if='shareInfoLoaded' @try-password='handleTryPassword'/>
    </a-modal>
  </div>
</template>

<script>

import SharePasswordAuth from '@/components/Share/SharePasswordAuth'
import { AnonGetShareContentDetails, GetShareInfo } from '@/api/share'
import ShareExpired from '@/components/Share/ShareExpired'
import { typeMap } from '@/const/teacher'
import ShareTask from '@/components/Share/ShareTask'
import ShareUnitPlan from '@/components/Share/ShareUnitPlan'

export default {
  name: 'ShareDetail',
  components: { ShareUnitPlan, ShareTask, ShareExpired, SharePasswordAuth },
  props: {
    code: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      shareCode: null,
      shareContentLoading: true,
      passwordDialogVisible: false,
      shareContent: {},

      shareInfoLoaded: false,
      coverUrl: '',
      title: '',
      needPassword: true,

      shareExpired: false,

      localPassword: '',
      typeMap: typeMap
    }
  },
  created () {
    console.info('ShareDetail created ' + this.code)
    // check password
    if (this.code.indexOf('Password') !== -1) {
      const urlPassword = this.code.slice(this.code.indexOf(':') + 1, this.code.indexOf(':') + 5) // 提取密码
      console.info('url contain password ' + urlPassword)
      if (urlPassword) {
        this.localPassword = urlPassword
      }
      this.shareCode = this.code.slice(0, this.code.indexOf(' '))
    } else {
      this.shareCode = this.code
      this.localPassword = sessionStorage.getItem('share-password-' + this.shareCode)
    }
    console.info('local password ' + this.localPassword)
    this.loadShareInfo()
  },
  methods: {
    loadShareInfo () {
      console.info('loadShareInfo ' + this.shareCode)
      this.shareInfoLoaded = false
      GetShareInfo({
        code: this.shareCode
      }).then((response) => {
        console.info('loadShareInfo response' + this.shareCode, response)
        if (typeof response.result !== 'string') {
          this.title = response.result.title
          this.coverUrl = response.result.cover
          this.needPassword = response.result.needPassword
          if (this.needPassword && !this.localPassword) {
            this.passwordDialogVisible = true
          } else if (this.needPassword && this.localPassword) {
            this.handleTryPassword(this.localPassword)
          } else {
            AnonGetShareContentDetails({
              code: this.shareCode
            }).then(response => {
              console.info('ShareRedirect AnonGetShareContentDetails ' + this.shareCode, response)
              if (typeof response.result !== 'string') {
                this.shareContent = response.result
              } else {
                this.$message.error(response.result)
              }
            }).finally(() => {
              this.shareContentLoading = false
            })
          }
        } else {
          this.$message.warn(response.result)
          this.shareExpired = true
        }
      }).finally(() => {
        this.shareInfoLoaded = true
      })
    },

    handleTryPassword (password) {
      console.info('ShareRedirect handleTryPassword ' + this.shareCode, password, this.$refs)
      AnonGetShareContentDetails({
        code: this.shareCode,
        password: password
      }).then(response => {
        console.info('AnonGetShareContentDetails ' + this.shareCode, response)
        if (typeof response.result !== 'string') {
          this.shareContent = response.result
          this.passwordDialogVisible = false
          sessionStorage.setItem('share-password-' + this.shareCode, password)
        } else {
          this.$message.error(response.result)
          this.passwordDialogVisible = true
        }
      }).finally(() => {
        this.shareContentLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.redirect-spin {
  position: absolute;
  top: 40%;
  left: 50%;
  margin-left: -20px;
}
</style>
