<template>
  <div class="share-button">
    <div class="share-title">Share by QR code</div>
    <a-spin :spinning="loading">
      <div class="share-qrcode">
        <img :src="qrCode" alt="qrCode">
      </div>
    </a-spin>
    <div class="share-divider">Or</div>
    <a-space class="share-out">
      <img @click="share('fb')" src="~@/assets/icons/share/fb.png" alt="share to facebook" />
      <img @click="share('in')" src="~@/assets/icons/share/in.png" alt="share to linked in" />
      <img @click="share('ins')" src="~@/assets/icons/share/ins.png" alt="share to instagram" />
      <img @click="share('twitter')" src="~@/assets/icons/share/twitter.png" alt="share to twitter" />
      <a-icon @click="handleCopy" type="link" />
    </a-space>
  </div>
</template>

<script>
import { CreateQRCode } from '@/api/v2/live'
export default {
  name: 'ShareButton',
  props: {
    link: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: 'Share'
    }
  },
  data() {
    return {
      qrCode: '',
      loading: false,
      shareLink: {
        fb: `https://www.facebook.com/share.php?title=${this.title}&u=${encodeURIComponent(this.link)}`,
        in: `https://www.linkedin.com/shareArticle?mini=true&source=str&title=${this.title}&url=${encodeURIComponent(this.link)}`,
        twitter: `https://twitter.com/intent/tweet?text=${this.title}&url=${encodeURIComponent(this.link)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(this.link)}`
      }
    }
  },
  created() {
    this.initQrcode()
  },
  methods: {
    initQrcode() {
      if (this.link) {
        this.loading = true
        CreateQRCode({
          url: this.link
        }).then(data => {
          const reader = new FileReader()
          reader.readAsDataURL(new Blob([data]))
          reader.onload = () => {
            this.qrCode = reader.result
          }
          reader.onerror = () => {
            console.log('read failed')
          }
        }).finally(res => {
          this.loading = false
        })
      }
    },
    share(type) {
      window.open(this.shareLink[type], '_blank')
    },
    handleCopy () {
      this.$copyText(this.link).then(() => {
        this.$message.success('Copy successfully')
      }).catch(() => {
        this.$message.error('Copy failed')
      })
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .ant-spin-nested-loading {
  min-height: auto!important;
  padding: 0!important;
  border: none!important;
}
.share-button {
  display: flex;
  padding: 10px;
  align-items: center;
  flex-direction: column;
  width: 140px;
  height: 140px;
  .share-title {
    font-size: 11px;
    font-family: Arial;
    font-weight: 400;
    color: #ECEFF4;
    line-height: 17px;
    width: 100%;
    text-align: center;
    margin-bottom: 8px;
  }
  .share-qrcode {
    width: 50px;
    height: 50px;
    border: 1px solid #dfdfdf;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .share-divider {
    font-size: 10px;
    font-family: Arial;
    font-weight: 400;
    color: #A1A5AE;
    line-height: 17px;
    width: 100%;
    text-align: center;
    margin: 8px 0 4px 0;
  }
  .share-out {
    img {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    i {
      font-size: 14px;
      cursor: pointer;
    }
  }
}
</style>
