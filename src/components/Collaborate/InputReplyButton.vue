<template>
  <div class="comment-input">
    <div>
      <a-mentions
        @focus="focusInput"
        v-model="inputValue"
        @change="onChange"
        @select="onSelect"
        rows="2"
        placeholder="Reply or add others with @">
        <a-mentions-option :value="userInfo.email" v-for="(userInfo,index) in collaborateUserList" :key="index">
          {{ userInfo.email }}
        </a-mentions-option>
      </a-mentions>
    </div>
    <div class="confirm-button" v-if="commentItem.editing">
      <a-button type="primary" :loading="sending" @click="reply" :class="{'button-item':true,'disabled-button':isDisabled}" :disabled="isDisabled">
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
    sending: {
      type: Boolean,
      default: false
    },
    replyMode: {
      type: Boolean,
      default: false
    },
    commentItem: {
      type: Object,
      default() {
        return {}
      }
    },
    collaborateUserList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    commentItem (val) {
      this.$logger.info('commentItem ' + val)
      this.inputValue = val.content
      this.oldValue = val.content
      this.loading = val.sendLoading ? val.sendLoading : false
    },
    sending(val) {
      if (!val) {
        this.inputValue = ''
      }
    }
  },
  data () {
    return {
      inputValue: '',
      oldValue: '',
      isDisabled: true,
      loading: false
    }
  },
  created () {
    this.loading = this.commentItem.sendLoading ? this.commentItem.sendLoading : false
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
      this.$emit('send', this.commentItem)
    },
    focusInput() {
      // this.commentItem.editing = true
      this.$emit('focusInput', this.commentItem)
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
