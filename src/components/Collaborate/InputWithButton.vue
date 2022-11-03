<template>
  <div class="comment-input">
    <a-row>
      <a-mentions v-model="inputValue" @change="onChange" @select="onSelect" rows="2" placeholder="Comment or add others with @">
        <a-mentions-option :value="userInfo.nickName" v-for="(userInfo,index) in collaborateUserList" :key="index">
          {{ userInfo.nickName }}
        </a-mentions-option>
      </a-mentions>
    </a-row>
    <div class="confirm-button">
      <a-button type="primary" :loading="sending" @click="handleComment" :class="{'button-item':true,'disabled-button':isDisabled}" :disabled="isDisabled">
        Comment
      </a-button>
      <a-button class="button-item" @click="cancelComment">
        Cancel
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputWithButton',
  props: {
    sending: {
      type: Boolean,
      default: false
    },
    collaborateUserList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      inputValue: '',
      oldValue: '',
      isDisabled: true
    }
  },
  methods: {
    created () {
      this.oldValue = this.inputValue
    },
    onSelect(option) {
      console.log('select', option)
    },
    onChange(value) {
      console.log(this.oldValue)
      this.isDisabled = (value === this.oldValue)
      console.log('Change:', value)
    },
    handleComment() {
      console.info('trigger handleComment ' + this.inputValue)
      if (!this.inputValue) {
        return
      }
      this.$emit('comment', this.inputValue)
    },
    cancelComment() {
      this.inputValue = ''
      this.$emit('cancelComment')
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
