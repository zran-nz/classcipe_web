<template>
  <div class='content-update'>
    <div class='alert'>
      <div class='alert-img'>
        <img src="~@/assets/icons/collaborate/alert.png" />
      </div>
      <div class='alert-text'>
        {{ this.saveContentMsg.from.nickname }} saved this document！<br> This document contently is updated.
      </div>
      <div class='alert-text-sub'>Please edit on the latest</div>
      <div class='alert-button'>
        <a-button class="button-text" :loading="loading" type='primary' shape='round' @click='updateContent'>Update</a-button>
      </div>
    </div>
  </div>
</template>

<script>

import { mapActions, mapGetters, mapState } from 'vuex'

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
      loading: false,
      refreshing: false
    }
  },
  computed: {
    ...mapGetters({
      vueSocket: 'vueSocket'
    }),
    ...mapState({
      saveContentMsg: state => state.websocket.saveContentMsg
    })
  },
  created() {
    this.loading = false
  },
  methods: {
    ...mapActions(['receiveSaveContentMsg']),

    updateContent() {
      const contentMsg = this.saveContentMsg
      contentMsg.hideUpdate = true
      this.loading = true
      this.receiveSaveContentMsg(contentMsg)
      this.$emit('update-content', '')
      setTimeout(() => {
        this.$message.info({ content: 'The latest version has been loaded for you and the local offlice cache has been saved to the historical version', duration: 5 })
      }, 1000)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

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
