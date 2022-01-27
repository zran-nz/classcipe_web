<template>
  <div class='feed-back-form'>
    <div class='feed-back-img'>
      <div class='img-mask'>
        <div class='img-edit'>
          <img src="~@/assets/icons/feedback/screenshot.png" />
          <div class='edit-text'>
            Click to edit screenshot.
          </div>
        </div>
      </div>
      <div :style="{backgroundImage: 'url(' + imgBase64Data + ')'}" alt='feedback-img' class='img-item' v-if='imgBase64Data' />
    </div>
    <div class='feed-back-comment'>
      <div class='feed-back-tips'>
        The screenshot will be submitted with your text comment.
      </div>
      <div class='feed-back-comment-input'>
        <a-textarea :auto-size="{ minRows: 3, maxRows: 6 }" allow-clear v-model='feedbackComment' placeholder='Enter text comment.'></a-textarea>
      </div>
      <div class='feed-back-submit'>
         <a-space>
          <a-button @click='handleCancelFeedback'>Cancel</a-button>
           <a-button type='primary' @click='handleSubmitFeedback'>Submit</a-button>
         </a-space>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'FeedbackForm',
  props: {
    imgData: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      imgBase64Data: null,
      feedbackComment: ''
    }
  },
  created() {
    this.imgBase64Data = this.imgData;
  },
  methods: {
    handleSubmitFeedback () {
      this.$emit('submit-feedback', {
        imgData: this.imgData,
        comment: this.feedbackComment
      })
    },

    handleCancelFeedback () {
      this.$emit('cancel-feedback')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.feed-back-form {
  width: 500px;
}

.feed-back-img {
  position: relative;
  width: 500px;
  overflow: hidden;

  .img-mask {
    z-index: 200;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.6);

    .img-edit {
      width: 200px;
      line-height: 40px;
      cursor: pointer;
      position: absolute;
      left: 50%;
      top: 30%;
      margin-left: -100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      img {
        width: 40px;
        height: 40px;
      }

      .edit-text {
        color: #fff;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }

  .img-item {
    z-index: 100;
    width: 500px;
    height: 200px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }
}

.feed-back-comment {
  .feed-back-tips {
    text-align: left;
    font-size: 14px;
    font-family: Inter-Bold;
    line-height: 40px;
    color: rgba(24, 37, 82, 1);
  }
}

.feed-back-submit {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>
