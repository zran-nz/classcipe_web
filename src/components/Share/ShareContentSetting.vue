<template>
  <div class='share-content-setting'>
    <template v-if='loading'>
      <div class='loading-wrapper'>
        <a-spin />
      </div>
    </template>
    <template v-if='!loading'>
      <template v-if='shareContent.status'>
        <div class='share-tips'>
          <div class='tips-text'>Who gets the link can access the file and multiple files linked with this file.</div>
        </div>
        <div class='turn-off' @click='switchShareStatus'>
          <div class='turn-off-text'>
            <template v-if='shareContent.status'>
              Turn off sharing
            </template>
            <template v-else>
              Turn on sharing
            </template>
          </div>
        </div>
        <div class='share-setting'>
          <div class='url-info'>
            <div class='url-and-copy'>
              <div class='url-text'>
                <div class='url-text-text'>{{ shareUrl }}</div>
              </div>
              <div class='copy-text'>
                <a-button type='primary' shape='round' size='small' @click='handleCopyLink'>
                  Copy
                </a-button>
              </div>
            </div>
            <div class='is-need-password'>
              <a-radio @click='changeNeedPassword' :checked='shareContent.needPassword'>
                Need password
              </a-radio>
            </div>
          </div>
          <div class='password-info'>
            <div class='password-setting'>
              <div class='refresh-password'>
                <refresh-svg @click='refreshPassword' />
              </div>
              <div class='password-item'>
                Password : <span class='password-text'>{{ shareContent.password }}</span>
              </div>
              <a-spin v-if='refreshing'>
                <a-icon slot='indicator' type='loading' style='font-size: 16px' spin />
              </a-spin>
            </div>
          </div>
        </div>
      </template>
      <template v-if='!shareContent.status'>
        <div class='turn-on'>
          <div class='turn-on-img'>
            <img src="~@/assets/background/share.png" />
          </div>
          <div class='turn-on-text'>
            When opened to share , this file can be shared through links
          </div>
          <div class='turn-on-button'>
            <a-button type='primary' shape='round' @click='switchShareStatus'>Open to share</a-button>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>

import { ShareStatus, QueryContentShare, ShareAddOrUpdate, ResetPassword } from '@/api/share'
import RefreshSvg from '@/assets/svgIcon/share/refresh.svg?inline'

export default {
  name: 'ShareContentSetting',
  components: {
    RefreshSvg
  },
  props: {
    sourceId: {
      type: String,
      required: true
    },
    sourceType: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      shareContent: {
        needPassword: false,
        code: '',
        password: ''
      },
      refreshing: false
    }
  },
  computed: {
    shareUrl() {
      return this.shareContent.code ? (window.location.origin + '/share/' + this.shareContent.code) : ''
    }
  },
  created() {
    this.$logger.info('ShareContentSetting created ' + this.sourceId + ' ' + this.sourceType)
    this.loadingShareContent()
  },
  methods: {
    loadingShareContent() {
      this.loading = true
      QueryContentShare({
        sourceId: this.sourceId,
        sourceType: this.sourceType
      }).then(response => {
        this.$logger.info('QueryContentShare response', response)
        if (response.result) {
          this.shareContent = response.result
          this.loading = false
        } else {
          // 初次进入页面,设置一下分享状态,获取分享设置
          ShareStatus({
            sourceId: this.sourceId,
            sourceType: this.sourceType,
            status: 0
          }).then((response) => {
            this.$logger.info('ShareStatus response', response)
            this.shareContent = response.result
            this.loading = false
          })
        }
      })
    },
    changeNeedPassword() {
      this.$logger.info('changeNeedPassword ' + !this.shareContent.needPassword)
      this.shareContent.needPassword = !this.shareContent.needPassword
      if (!this.shareContent.password) {
        this.refreshPassword()
      }
      this.updateContentShare()
    },

    refreshPassword() {
      this.refreshing = true
      ResetPassword({
        sourceId: this.sourceId,
        sourceType: this.sourceType
      }).then((response) => {
        this.$logger.info('ResetPassword response', response)
        this.shareContent.password = response.result.password
      }).finally(() => {
        this.refreshing = false
      })
    },

    handleCopyLink() {
      this.$copyText(this.shareUrl).then(() => {
        this.$message.success('Copy successfully')
      }).catch(() => {
        this.$message.error('Copy failed')
      })
    },

    switchShareStatus() {
      ShareStatus({
        sourceId: this.sourceId,
        sourceType: this.sourceType,
        status: this.shareContent.status ? 0 : 1
      }).then(response => {
        this.$logger.info('switchShareStatus response', response)
        this.shareContent = response.result
        this.$message.success('Set successfully')
        this.$emit('update-share-status', this.shareContent.status)
      })
    },

    updateContentShare() {
      ShareAddOrUpdate(this.shareContent).then(response => {
        this.$logger.info('ShareAddOrUpdate response', response)
        this.$message.success('Set successfully')
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.loading-wrapper {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.share-content-setting {
  padding: 20px;
  width: 100%;
  height: 100%;
  min-height: 300px;
  margin: auto;

  .share-tips {
    padding: 5px 0;

    .tips-text {
      user-select: none;
      font-size: 14px;
      font-family: Arial;
      font-weight: 400;
      color: #070707;
    }
  }

  .turn-off {
    font-size: 14px;
    font-family: Arial;
    font-weight: 400;
    padding: 5px 0;
    cursor: pointer;
    color: #15C39A;
  }

  .share-setting {
    padding: 30px 15px;
    box-sizing: border-box;
    position: relative;
    .url-info {
      z-index: 100;
      .url-and-copy {
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #F7F9FD;
        border-radius: 6px;
        padding: 10px;

        .url-text {
          .url-text-text {
            user-select: all;
            font-size: 14px;
            font-family: Segoe UI;
            font-weight: 500;
            color: #000000;
            cursor: pointer;
          }
        }
      }

      .is-need-password {
        padding: 10px 0;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #000000;
      }
    }

    .password-info {
      z-index: 100;
      padding-top: 40px;

      .password-setting {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        background: #F7F9FD;
        border-radius: 6px;
        padding: 10px;
        height: 44px;

        .refresh-password {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          cursor: pointer;

          svg {
            height: 15px;
          }
        }

        .password-item {
          cursor: pointer;
          padding-left: 10px;
          font-size: 14px;
          font-family: Segoe UI;
          font-weight: 500;
          color: #000000;
          padding-right: 30px;

          .password-text {
            user-select: all;
          }
        }
      }
    }
  }
}

.turn-on {
  padding: 20px;
  margin: auto;
  text-align: center;

  .turn-on-img {
    img {
      width: 200px;
    }
  }

  .turn-on-text {
    padding: 20px 0;
    font-size: 20px;
    font-family: Arial;
    font-weight: 400;
    color: #070707;
  }

  .turn-on-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0;
  }
}

</style>
