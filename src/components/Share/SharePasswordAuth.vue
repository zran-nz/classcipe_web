<template>
  <div class='share-password-auth'>
    <div class='password-cover' :style="{'background-image': `url('${coverUrl}')`}">
    </div>
    <div class='share-title'>
      {{ title }}
    </div>
    <div class='password-input'>
      <a-input-search
        :loading='loading'
        placeholder="Enter the passpord"
        @search="handleTryPassword">
        <a-button slot="enterButton" type='primary'>
          <a-icon type="unlock" />
        </a-button>
      </a-input-search>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SharePasswordAuth',
  props: {
    title: {
      type: String,
      required: true
    },
    coverUrl: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  created() {
    this.$logger.info('SharePasswordAuth created ' + this.title + ' ' + this.coverUrl)
  },
  methods: {
    handleTryPassword (password) {
       if (password && password.trim()) {
         this.$emit('try-password', password.trim())
         this.loading = true
         setTimeout(() => {
           this.loading = false
         }, 1000)
       } else {
         this.$message.warn('Password cannot be empty!')
       }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.share-password-auth {
  padding: 35px 25px;

  .password-cover {
    height: 250px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }

  .share-title {
    display: flex;
    align-items: center;
    height: 60px;
    justify-content: center;
    color: #000;
    font-size: 19px;
    font-weight: 500;
  }

  .password-input {
    margin-top: 20px;
    margin-bottom: 20px;
  }
}

</style>
