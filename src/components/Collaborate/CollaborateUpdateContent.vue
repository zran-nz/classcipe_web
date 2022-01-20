<template>
  <div class='content-update'>
    <div class='alert'>
      <div class='alert-img'>
        <img src="~@/assets/icons/collaborate/alert.png" />
      </div>
      <div class='alert-text'>
        Mike saved this document！<br> This document contently is updated.
      </div>
      <div class='alert-text-sub'>Please edit on the latest</div>
      <div class='alert-button'>
        <a-button class="button-text" type='primary' shape='round' @click='updateContent'>Update</a-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CollaborateUpdateContent',
  components: {
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
      refreshing: false
    }
  },
  computed: {
  },
  created() {
  },
  methods: {

    updateContent() {
      this.$store.getters.vueSocket.sendAction('receiveSaveContentMsg', '')
      // ShareStatus({
      //   sourceId: this.sourceId,
      //   sourceType: this.sourceType,
      //   status: this.shareContent.status ? 0 : 1
      // }).then(response => {
      //   this.$logger.info('switchShareStatus response', response)
      //   this.shareContent = response.result
      //   this.$message.success('Set successfully')
      //   this.$emit('update-share-status', this.shareContent.status)
      // })
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

.content-update {
  padding: 20px;
  width: 100%;
  height: 100%;
  min-height: 300px;
  margin: auto;

}

.alert {
  padding: 20px;
  margin: auto;
  text-align: center;

  .alert-img {
    img {
      width: 80px;
    }
  }

  .alert-text {
    padding: 20px 0;
    font-size: 20px;
    font-family: Arial;
    font-weight: 400;
    color: #070707;
    opacity: 1;
  }
  .alert-text-sub{
    font-size: 16px;
    font-family: Arial;
    font-weight: 400;
    line-height: 0px;
    color: #959595;
    opacity: 1;
  }
  .alert-button {
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 0 0 0;
    margin-top: 20px;
    /* padding: 10px 10px 20px 10px; */
    .button-text {
      width: 200px;
      /* padding: 20px 0px; */
      line-height: 40px;
      height: 45px;
    }
  }
}

</style>
