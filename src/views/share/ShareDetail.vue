<template>
  <div class='share-detail'>
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '300px' }" v-if='!shareInfoLoaded'>
      <a-spin class="redirect-spin" tip="Loading..." size="large"/>
    </a-card>

    <div class='share-content' v-if='shareInfoLoaded && !shareContentLoading && !shareExpired'>
      {{ shareContent }}
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

export default {
  name: 'ShareDetail',
  components: { ShareExpired, SharePasswordAuth },
  props: {
    shareCode: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      shareContentLoading: true,
      passwordDialogVisible: false,
      shareContent: {},

      shareInfoLoaded: false,
      coverUrl: '',
      title: '',
      needPassword: true,

      shareExpired: false,

      localPassword: ''
    }
  },
  created () {
    this.$logger.info('ShareRedirect created ' + this.shareCode)
    this.localPassword = sessionStorage.getItem('share-password-' + this.shareCode)
    this.$logger.info('local password ' + this.localPassword)
    this.loadShareInfo()
  },
  methods: {
    loadShareInfo () {
      this.$logger.info('loadShareInfo ' + this.shareCode)
      this.shareInfoLoaded = false
      GetShareInfo({
        code: this.shareCode
      }).then((response) => {
        this.$logger.info('ShareRedirect loadShareInfo ' + this.shareCode, response)
        if (response.result) {
          this.title = response.result.title
          this.coverUrl = response.result.cover
          this.needPassword = response.result.needPassword
          if (this.needPassword && !this.localPassword) {
            this.shareInfoLoaded = true
            this.passwordDialogVisible = true
          } else if (this.needPassword && this.localPassword) {
            this.handleTryPassword(this.localPassword)
          } else {
            AnonGetShareContentDetails({
              code: this.shareCode
            }).then(response => {
              this.$logger.info('ShareRedirect AnonGetShareContentDetails ' + this.shareCode, response)
              if (response.result) {
                this.shareContent = response.result
              }
              this.shareContentLoading = false
            })
          }
        } else {
          this.shareExpired = true
        }
      })
    },

    handleTryPassword (password) {
      this.$logger.info('ShareRedirect handleTryPassword ' + this.shareCode, password, this.$refs)
      AnonGetShareContentDetails({
        code: this.shareCode,
        password: password
      }).then(response => {
        this.$logger.info('ShareRedirect AnonGetShareContentDetails ' + this.shareCode, response)
        if (response.result) {
          this.shareContent = response.result
          this.passwordDialogVisible = false
          sessionStorage.setItem('share-password-' + this.shareCode, password)
          this.$message.success('Password verification successful!')
        } else {
          this.passwordDialogVisible = true
        }
        this.shareContentLoading = false
      }).finally(() => {
        this.shareInfoLoaded = true
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
