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
      <a-button type="primary" :loading="commentItem.sendLoading" @click="reply" :class="{'button-item':true,'disabled-button':isDisabled}" :disabled="isDisabled">
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
      isDisabled: true
    }
  },
  created () {
    this.commentItem.sendLoading = false
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
    reply() {
      if (!this.inputValue) {
        return
      }
      this.commentItem.content = this.inputValue
      this.commentItem.sendLoading = true
      this.$emit('send', this.commentItem)
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
