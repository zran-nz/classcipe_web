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

      localPassword: '',
      typeMap: typeMap
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
        this.$logger.info('loadShareInfo response' + this.shareCode, response)
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
              this.$logger.info('ShareRedirect AnonGetShareContentDetails ' + this.shareCode, response)
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
      this.$logger.info('ShareRedirect handleTryPassword ' + this.shareCode, password, this.$refs)
      AnonGetShareContentDetails({
        code: this.shareCode,
        password: password
      }).then(response => {
        this.$logger.info('AnonGetShareContentDetails ' + this.shareCode, response)
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
