<template>
  <div class='record-area'>
    <div v-if='!isAniInFixed' class='float-line audio-line animation-line'>
      <div class='audio-play'></div>
      <div class='audio-play'></div>
      <div class='audio-play'></div>
      <div class='audio-play'></div>
      <div class='audio-play'></div>
    </div>
    <div v-show='!endRecording'>
      <div v-if='!audioUrl'>
        <div class='record-footer'>
          <i class='done scale-animation' @click='done'></i>
          <div v-if='!endRecording' class='record-time'>{{ getTime(timeValue) }} / 02:00</div>
        </div>
      </div>
    </div>
    <div v-show='!endRecording'>
      <div v-if='!audioUrl' class='fixed-area'>
        <audio id='record-audio' height='1' src='opacity: 0' width='1' />
        <div v-if='isAniInFixed' class='audio-line animation-line'>
          <div class='audio-play'></div>
          <div class='audio-play'></div>
          <div class='audio-play'></div>
          <div class='audio-play'></div>
          <div class='audio-play'></div>
        </div>
        <div class='record-footer'>
          <i class='done scale-animation' @click='done'></i>
          <div v-if='!endRecording' class='record-time'>{{ getTime(timeValue) }} / 02:00</div>
        </div>
      </div>
    </div>
    <common-progress :cancel='cancelUp' :progress='progress' />
  </div>
</template>
<script>
import { cancelUpAudio, endRecordAudio, saveRecordAudio, startRecordAudio } from '@/components/AddMaterial/Utils/Audio'
import AudioPlayer from '@/components/AddMaterial/Audio/AudioPlayer'
import CommonProgress from '@/components/AddMaterial/Common/CommonProgress'

export default {
  components: { AudioPlayer, CommonProgress },
  props: {
    onSend: {
      type: Function,
      default: () => null
    },
    cancel: {
      type: Function,
      default: () => null
    },
    onRecordDone: {
      type: Function,
      default: () => null
    },
    autoDone: {
      type: Boolean,
      default: false // 自动完成提交，不要二次确认
    },
    isAniInFixed: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      endRecording: false,
      timeValue: 0,
      color: '#999',
      maxTime: 120, // 秒
      audioUrl: '',
      visible: false,
      progress: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.startRecord()
    })
  },
  beforeDestroy() {
    this.clearCount()
    if (!this.endRecording) {
      endRecordAudio()
    }
  },
  methods: {
    count() {
      this.timer = setInterval(() => {
        if (this.timeValue >= this.maxTime) {
          this.done()
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
      // if(value < 60) {
      //   return `00:00:${value}`
      // }
      const hours = Math.floor(value / 3600)
      const minutes = Math.floor((value - hours * 3600) / 60)
      const seconds = value - hours * 3600 - minutes * 60
      return `${('0' + minutes).substr(-2)}:${('0' + seconds).substr(-2)}`
    },
    done() {
      if (!this.endRecording) {
        this.onRecordDone()
        this.endRecording = true
        saveRecordAudio(this.$store.getters.userInfo.id, this.onProgressUpLoad).then((url) => {
          if (url) {
            if (this.autoDone) {
              this.onSend(url)
            } else {
              // 发送url信息
              this.audioUrl = url
              this.sendRecord()
            }
          }
        })
        this.clearCount()
      }
    },
    onProgressUpLoad(progress) {
      this.progress = progress
    },
    startRecord() {
      this.timeValue = 0
      startRecordAudio(document.getElementById('record-audio'), () => {
        this.endRecording = false
        this.count()
      }, () => {
        this.cancelUp()
      })
    },
    sendRecord() {
      this.onSend(this.audioUrl, 'audio')
    },
    cancelUp() {
      cancelUpAudio()
      this.onProgressUpLoad(0)
      this.cancel()
    }
  }

}
</script>

<style scoped>
.record-area {
  width: 100%;
  position: relative;
}

.tips-area {
  width: 5px;
  height: 5px;
  background: transparent;
  display: inline-block;
  float: left;
  margin-left: 10px;
  margin-top: 5px;
}

.record-button-group {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.record-tip-text {
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #474747;
}

.cancel {
  width: 60px;
  height: 24px;
  background: #D0D2DF;
  opacity: 1;
  border-radius: 25px;
  font-size: 12px;
  font-family: FZCuYuan-M03S;
  font-weight: 400;
  line-height: 24px;
  color: #FFFFFF;
  cursor: pointer;
  text-align: center;
}

.cancel:hover {
  background-color: rgba(21, 195, 154, 1);
}

.cancel.primary {
  /* background-color: rgba(21, 195, 154, 1); */
  margin-left: 12px;
}

.fixed-area {
  height: 60px;
  width: 280px;
  position: fixed;
  top: 5px;
  right: 35px
}

.record-footer {
  padding: 5px 10px;
  box-sizing: border-box;
  background-color: rgba(43, 51, 63, 0.7);
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: row;
}

.done {
  width: 15px;
  height: 15px;
  border-radius: 15px;
  cursor: pointer;
  background-color: red;
  margin-right: 10px;
}

.record-time {
  height: 20px;
  line-height: 20px;
  font-size: 10px;
  color: #fff;
  display: flex;
  align-items: center;
  flex-direction: row;
}

.float-line {
}
</style>
