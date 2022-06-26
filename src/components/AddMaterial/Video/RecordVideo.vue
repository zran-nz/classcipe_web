<template>
  <div :style="`height: '165px'}`">
    <div class="record-area" v-show="!endRecording">
      <div class="fixed-area" :style="`height: '56px'`">
        <video
          width="280"
          height="150"
          controlslist="nodownload"
          controls=""
          preload="auto"
          class="record-video"></video>
        <div class="record-footer">
          <a-tooltip title="start" placement="top" v-if="endRecording">
            <a-button type="primary" shape='round' class="record-button" icon="a-icon-video-play" @click="startRecord">
              <a-icon type="play-circle" />
            </a-button>
          </a-tooltip>
          <a-button v-if="!endRecording && timeValue > 0" shape='round' class="record-button" type="primary" @click="doneRecord">
            DONE
          </a-button>
          <p class="record-time"> {{ getTime(timeValue) }} / 02:00</p>
        </div>
      </div>
    </div>
    <common-progress :progress="progress" :cancel="cancelUp"/>
  </div>
</template>
<script>

import { startRecordVideo, pauseRecordVideo, resumeRecordVideo, saveRecordVideo, endRecord, cancelUpVideo } from '../Utils/Video'
import CommonProgress from '../Common/CommonProgress'

export default {
  name: 'RecordVideo',
  components: { CommonProgress },
  props: {
    onSend: {
      type: Function,
      default: () => null
    },
    cancel: {
      type: Function,
      default: () => null
    }
  },
  data() {
    return {
      isRecording: false,
      endRecording: true,
      timeValue: 0,
      progress: 0,
      maxTime: 120 // 秒
    }
  },
  mounted() {
    this.startRecord()
  },
  beforeDestroy() {
    if (!this.endRecording && this.isRecording) {
      endRecord()
      this.fail()
    }
    cancelUpVideo()
  },
  methods: {
    pauseVideo() {
      pauseRecordVideo()
      this.isRecording = false
    },
    resumeVideo() {
      resumeRecordVideo()
      this.isRecording = true
    },
    count() {
      this.timer = setInterval(() => {
        if (this.timeValue >= this.maxTime) {
          this.doneRecord()
        } else {
          this.timeValue++
          this.color = this.timeValue % 2 === 1 ? '#999' : 'red'
        }
      }, 1000)
    },
    clearCount() {
      if (this.timer) clearInterval(this.timer)
      this.color = '#999'
    },
    getTime(value) {
      const hours = Math.floor(value / 3600)
      const minutes = Math.floor((value - hours * 3600) / 60)
      const seconds = value - hours * 3600 - minutes * 60
      return `${('0' + minutes).substr(-2)}:${('0' + seconds).substr(-2)}`
    },
    doneRecord() {
      if (!this.endRecording) {
        this.endRecording = true
        this.isRecording = false
        saveRecordVideo(this.$store.getters.userInfo.id, this.onProgressUpLoad).then((url) => {
          if (url) {
            // 发送url信息
            this.onSend(url, 'video')
          }
        })
        this.clearCount()
      }
    },
    onProgressUpLoad(progress) {
      this.progress = progress
    },
    startRecord() {
      this.isRecording = true
      this.endRecording = false
      this.$logger.info('startRecord', document.getElementsByClassName('record-video'))
      startRecordVideo(document.getElementsByClassName('record-video')[0], this.countToRecord, this.fail)
    },
    countToRecord() {
      this.timeValue = 0
      this.count()
    },
    cancelUp() {
      cancelUpVideo()
      this.onProgressUpLoad(0)
      console.log('onProgressUpLoad')
      this.fail()
    },
    fail() {
      this.cancel()
    }
  }
}
</script>
<style scoped>
.record-video {
  background: #000
}
.fixed-area{
  height: 206px;
  width: 280px;
  position: fixed;
  top: 5px ;
  right: 35px;
  background-color: #fff;
  z-index: 10000;
  opacity: 1 !important;
}
.record-time{
  font-size: 10px;
  color: #fff;
  margin-left: 20px;
}
.record-footer{
  height: 50px;
  box-sizing: border-box;
  background-color: rgba(43,51,63,0.7);
  width: 100%;
  padding-left: 20px;
  display: flex;
  align-items: center;
}
.record-button{
  font-weight: bolder;
}
</style>
