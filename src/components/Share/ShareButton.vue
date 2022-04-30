<template>
  <div class="share-button">
    <div class="share-qrcode">
      <img :src="qrCode" alt="qrCode">
    </div>
    <a-divider>Or</a-divider>
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
.share-button {
  display: flex;
  padding: 20px;
  align-items: center;
  flex-direction: column;
  .share-qrcode {
    width: 100px;
    height: 100px;
    border: 1px solid #dfdfdf;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .share-out {
    img {
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
    i {
      font-size: 24px;
      cursor: pointer;
    }
  }
}
</style>
