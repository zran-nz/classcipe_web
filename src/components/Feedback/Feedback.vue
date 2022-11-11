<template>
  <div class='my-feed-back'>
    <div
      id='feed-back'
      class="classcipe-feedback">
      <div class="classcipe-hidden-feedback" @click.stop="handleCloseFeedback">
        <img src="~@/assets/icons/feedback/close.png" alt=""/>
      </div>
      <div class='feed-back-icon'>
        <server-icon-svg @click.stop='handleSelectCaptureFeedback'/>
      </div>
      <div class='feed-back-text' @click.stop='handleSelectCaptureFeedback'>
        <div class='text-item'>Feedback</div>
      </div>
    </div>

    <a-modal
      class='feed-back-modal'
      @cancel='handleCancelFeedback'
      title='Feedback'
      :footer='null'
      width='550px'
      :visible='feedbackModalVisible'>
      <div id='my-canvas-container'>
        <div class='capture-creating' v-if='captureCreating'>
          <a-spin tip="Loading..."/>
        </div>
        <template v-if='!captureCreating'>
          <feedback-form :img-data='feedbackImgData' v-if='feedbackImgData' @cancel-feedback='handleCancelFeedback' @submit-feedback='handleSubmitFeedback'/>
          <no-more-resources tips='Something wrong' v-if='!feedbackImgData' />
        </template>
      </div>
    </a-modal>
  </div>
</template>

<script>

import html2canvas from 'html2canvas'
import ServerIconSvg from '@/assets/icons/feedback/serve.svg?inline'
import FeedbackForm from '@/components/Feedback/FeedbackForm'
import NoMoreResources from '@/components/Common/NoMoreResources'
import { FeedbackSave } from '@/api/feedback'

export default {
  name: 'Feedback',
  components: { NoMoreResources, FeedbackForm, ServerIconSvg },
  data() {
    return {
      feedbackTypeVisible: false,
      feedbackModalVisible: false,
      feedbackImgData: null,
      captureCreating: false
    }
  },
  methods: {

    handleSelectChatFeedback () {
      this.feedbackTypeVisible = false
      document.getElementById('chat-widget-container').style.display = 'block'
    },

    handleSelectCaptureFeedback () {
      this.feedbackTypeVisible = false
      console.info('handleSelectCaptureFeedback')
      if (!this.feedbackModalVisible) {
        this.captureCreating = true
        this.feedbackModalVisible = true
        this.feedbackImgData = null
        html2canvas(document.body, {
          allowTaint: true,
          useCORS: true,
          scrollX: window.pageXOffset,
          scrollY: window.pageYOffset,
          x: window.pageXOffset,
          y: window.pageYOffset
        }).then(canvas => {
          canvas.style.opacity = '1'
          canvas.style.zIndex = '99999999'
          canvas.style.transition =
            'transform 0.3s cubic-bezier(0.42, 0, 0.58, 1),opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1),-webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1)'
          this.feedbackImgData = canvas.toDataURL('image/png', 1)
        }).finally(() => {
          this.captureCreating = false
        })
      }
    },
    handleCancelFeedback () {
      console.info('handleCancelFeedback', this.feedbackModalVisible)
      this.feedbackModalVisible = false
      this.feedbackImgData = null
    },
    handleCloseFeedback () {
      console.log('handleCloseFeedback')
      // document.getElementById('chat-widget-container').style.display = 'none'
      document.getElementById('feed-back').style.display = 'none'
    },
    handleSubmitFeedback (data) {
      console.info('handleSubmitFeedback', data)
      FeedbackSave(data).then((response) => {
        console.info('submit-feedback', response)
        this.$message.success('Thank you for your feedback, we will get back to you as soon as possible.')
        this.feedbackModalVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

#feed-back {
  position: fixed;
  right: 35px;
  bottom: 80px;
  color: #fff;
  line-height: 30px;
  border-radius: 5px;
  z-index: 3000;
  cursor: pointer;
  font-size: 12px;
  user-select: none;
}

.feed-back-detail {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 5px;
}

.feed-back-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 30px;
    height: 30px;
  }
}

.feed-back-text {
  padding: 5px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.05);
  .text-item {
    color: #15C39A;
    font-weight: 500;
    font-size: 12px;
    line-height: 12px;
  }
}

#my-canvas-container {
  position: relative;
  text-align: center;

  .capture-creating {
    width: 500px;
    height: 100%;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.feed-back-content {
  user-select: none;
  width: 180px;
  font-family: "Noto Sans", sans-serif;
  box-sizing: border-box;
}

.feed-type-title {
  cursor: pointer;
  font-weight: 500;
  font-size: 13px;
  color: #15C39A;
  line-height: 15px;
  padding: 0 5px 5px 5px;
}

.feed-type-item {
  margin-top: 8px;
  padding: 5px 8px;
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  color: #ffffff;
  cursor: pointer;
  background: rgba(21, 195, 154);
  border-radius: 2px;

  &:hover {
    background: rgba(17, 174, 137);
  }
}

.classcipe-hidden-feedback {
  display: none;
}

.classcipe-hidden-feedback img {
  z-index: 100;
  width: 1.5rem;
  position: absolute;
  right: -1rem;
  top: -1rem;
}
#feed-back:hover .classcipe-hidden-feedback {
  display: block;
}

.feed-back-type {
  .feed-back-type-title {
    line-height: 30px;
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
