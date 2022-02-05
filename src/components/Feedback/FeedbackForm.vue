<template>
  <div class='feed-back-form'>
    <div class='feed-back-img'>
      <div class='img-mask'>
        <div class='img-edit' @click='handleEditImg'>
          <img src="~@/assets/icons/feedback/screenshot.png" alt='screenshot'/>
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
          <a-button type='primary' @click='handleSubmitFeedback' :loading='submitting'>Submit</a-button>
        </a-space>
      </div>
    </div>

    <a-modal
      destroyOnClose
      class='edit-img-modal'
      @cancel='handleCancelEditImg'
      :title='null'
      :footer='null'
      :closable="false"
      :maskClosable="false"
      width='1000px'
      :visible='imgEditModalVisible'>
      <image-draw :img-raw-data='imgBase64Data' v-if='imgBase64Data' @close-drawing='handleCloseEditImg'/>
    </a-modal>
  </div>
</template>

<script>

import ImageDraw from '@/components/Feedback/ImageDraw'
export default {
  name: 'FeedbackForm',
  components: { ImageDraw },
  props: {
    imgData: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      imgBase64Data: null,
      feedbackComment: '',
      imgEditModalVisible: false,
      submitting: false
    }
  },
  created() {
    this.imgBase64Data = this.imgData
    this.submitting = false
  },
  methods: {
    handleSubmitFeedback () {
      this.submitting = true
      this.$emit('submit-feedback', {
        imgBase64Data: this.imgBase64Data,
        comment: this.feedbackComment,
        pageUrl: window.location.href
      })
    },

    handleCancelFeedback () {
      this.submitting = false
      this.$emit('cancel-feedback')
    },

    handleEditImg () {
      this.$logger.info('handleEditImg')
      this.imgEditModalVisible = true
    },

    handleCancelEditImg () {
      this.$logger.info('handleCancelEditImg')
      this.imgEditModalVisible = false
    },

    handleCloseEditImg (data) {
      this.$logger.info('handleCloseEditImg', data)
      if (data) {
        this.imgBase64Data = data
      }
      this.imgEditModalVisible = false
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
