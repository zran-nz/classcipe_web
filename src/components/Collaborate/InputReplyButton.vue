<template>
  <div class="comment-input">
    <div>
      <a-mentions
        @focus="commentItem.editing = true"
        v-model="inputValue"
        @change="onChange"
        @select="onSelect"
        rows="2"
        placeholder="Reply or add others with @">
        <a-mentions-option value="afc163">
          afc163
        </a-mentions-option>
        <a-mentions-option value="zombieJ">
          zombieJ
        </a-mentions-option>
        <a-mentions-option value="yesmeck">
          yesmeck
        </a-mentions-option>
      </a-mentions>
    </div>
    <div class="confirm-button" v-if="commentItem.editing">
      <a-button type="primary" :class="{'button-item':true,'disabled-button':isDisabled}" :disabled="isDisabled">
        Reply
      </a-button>
      <a-button class="button-item" @click="cancelReply">
        Cancel
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputReplyButton',
  props: {
    replyMode: {
      type: Boolean,
      default: false
    },
    commentItem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    commentItem (val) {
      this.$logger.info('commentItem ' + val)
      this.inputValue = val.content
      this.oldValue = val.content
    }
  },
  data () {
    return {
      inputValue: '',
      oldValue: '',
      isDisabled: true,
      sendLoading: false
    }
  },
  created () {
    this.inputValue = this.commentItem.content ? this.commentItem.content : ''
    this.oldValue = this.commentItem.content ? this.commentItem.content : ''
  },
  methods: {
    onSelect(option) {
      console.log('select', option)
    },
    onChange(value) {
      console.log(this.oldValue)
      this.isDisabled = (value === this.oldValue)
      console.log('Change:', value)
    },
    cancelReply() {
      this.$emit('cancel', this.commentItem)
    },
    handleSendEvent () {
      // 触发事件是把extra数据带回，方便外部区分处理逻辑。
      this.$logger.info('trigger send ' + this.inputValue)
      if (!this.inputValue) {
        return
      }
      this.sendLoading = true
      this.$emit('send', {
        inputValue: this.inputValue,
        extra: this.extra
      })
      setTimeout(() => {
        this.sendLoading = false
        this.value = ''
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

  .comment-input{
    .confirm-button{
      margin-top:10px;
      .disabled-button{
        color: rgba(0,0,0,.25);
      }
      .button-item{
        margin-right: 15px;
      }
    }
  }
</style>
