<template>
  <div class="my-input-with-button">

    <template v-if="replyMode">
      <a-input class="my-padding-input reply-mode" v-model="value" size="large">

        <div class="reply-info" slot="addonBefore">
          <span class="reply-tips">Reply</span>
          <span class="reply-user">
            @{{ replyUsername }}
          </span>
        </div>
      </a-input>
    </template>
    <template v-if="!replyMode">
      <a-input class="my-padding-input" v-model="value" size="large"> </a-input>
    </template>
    <a-button class="my-send-btn" size="small" type="primary" @click="handleSendEvent">Send</a-button>
  </div>
</template>

<script>
export default {
  name: 'InputWithButton',
  props: {
    replyMode: {
      type: Boolean,
      default: false
    },
    replyUsername: {
      type: String,
      default: null
    },
    extra: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      value: null
    }
  },
  methods: {
    handleSendEvent () {
      // 触发事件是把extra数据带回，方便外部区分处理逻辑。
      this.$logger.info('trigger send ' + this.value)
      this.$emit('send', {
        inputValue: this.value,
        extra: this.extra
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

  .my-input-with-button {
    position: relative;
    .my-padding-input {
      border-radius: 5px;
      z-index: 50;
      padding-left: 5px;
      padding-right: 50px;
      .reply-user {
        color: #15c39a;

      }
    }
    .my-send-btn {
      z-index: 100;
      border-radius: 4px;
      position: absolute;
      right: 10px;
      top: 50%;
      margin-top: -12px;
    }
  }
</style>
