<template>
  <div class='my-feed-back'>
    <div
      id='feed-back'
      :style="{'left': feedbackLeft + 'px', 'top': feedbackTop + 'px'}">
      <a-popover
        :getPopupContainer="trigger => trigger.parentElement"
        trigger="click"
        placement="leftBottom"
        class='feed-back-detail'
        :visible="feedbackTypeVisible"
        @visibleChange="handleFeedbackTypeClickChange"
      >
        <div slot="content" class='feed-back-content'>
          <div class='feed-type-title'>
            Ready to streamline your customer support? Here we go!
          </div>
          <div class='feed-type-item' @click='handleSelectCaptureFeedback'>
            Leave text comment
          </div>
          <div class='feed-type-item' @click='handleSelectChatFeedback'>
            Chat with support
          </div>
        </div>
        <div class='feed-back-icon'>
          <server-icon-svg />
        </div>
        <div class='feed-back-text'>
          <div class='text-item'>Help & </div>
          <div class='text-item'>Support</div>
        </div>
      </a-popover>
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

export default {
  name: 'Feedback',
  components: { NoMoreResources, FeedbackForm, ServerIconSvg },
  data() {
    return {
      feedbackTypeVisible: false,
      feedbackModalVisible: false,
      feedbackImgData: null,
      captureCreating: false,
      feedbackLeft: -1000,
      feedbackTop: -1000
    }
  },
  created() {
    this.feedbackLeft = document.documentElement.clientWidth - 65
    this.feedbackTop = document.documentElement.clientHeight - 180
  },
  methods: {
    handleFeedbackTypeClickChange (visible) {
      this.feedbackTypeVisible = visible
    },

    handleSelectChatFeedback () {
      this.feedbackTypeVisible = false
      document.getElementById('chat-widget-container').style.display = 'block'
    },

    handleSelectCaptureFeedback () {
      this.feedbackTypeVisible = false
      this.$logger.info('handleSelectCaptureFeedback')
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
      this.$logger.info('handleCancelFeedback', this.feedbackModalVisible)
      this.feedbackModalVisible = false
      this.feedbackImgData = null
    },

    handleSubmitFeedback (data) {
      this.$logger.info('handleSubmitFeedback', data)
    },

    startMoving (event) {
      if (this.movingFlag) {
        if (event.clientX > document.documentElement.clientWidth - 80) {
          this.feedbackLeft = document.documentElement.clientWidth - 80
        } else if (event.clientX < 80) {
          this.feedbackLeft = 80
        } else {
          this.feedbackLeft = event.clientX
        }

        if (event.clientY > document.documentElement.clientHeight - 80) {
          this.feedbackTop = document.documentElement.clientHeight - 80
        } else if (event.clientY < 80) {
          this.feedbackTop = 80
        } else {
          this.feedbackTop = event.clientY
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

#feed-back {
  position: fixed;
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

</style>
