<template>
  <div class="di main-wrap" v-if="url">
    <audio
      ref="audio"
      class="dn"
      :src="url"
      preload="auto"
      @play="onPlay"
      @error="onError"
      @waiting="onWaiting"
      @pause="onPause"
      @timeupdate="onTimeupdate"
      @canplay="audioCanplay"
      @loadedmetadata="loadedmetadata"
    />
    <div class="audioplaybg">
      <div :class="`audio-line animation-line ${audio.playing ? '' : 'paused'}`" style="transform: scale(2.5);">
        <div class="audio-play"></div>
        <div class="audio-play"></div>
        <div class="audio-play"></div>
        <div class="audio-play"></div>
        <div class="audio-play"></div>
      </div>
    </div>
    <div class="play-button">
      <div class="class-audio-control" v-if="audio.maxTime !== 0">
        <button @click="startPlayOrPause" class="audio-button">
          <svg
            v-if="audio.playing"
            t="1644679876516"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2073"
            width="16"
            height="16"><path d="M373.333333 85.333333H266.666667a53.393333 53.393333 0 0 0-53.333334 53.333334v746.666666a53.393333 53.393333 0 0 0 53.333334 53.333334h106.666666a53.393333 53.393333 0 0 0 53.333334-53.333334V138.666667a53.393333 53.393333 0 0 0-53.333334-53.333334z m10.666667 800a10.666667 10.666667 0 0 1-10.666667 10.666667H266.666667a10.666667 10.666667 0 0 1-10.666667-10.666667V138.666667a10.666667 10.666667 0 0 1 10.666667-10.666667h106.666666a10.666667 10.666667 0 0 1 10.666667 10.666667z m373.333333-800H650.666667a53.393333 53.393333 0 0 0-53.333334 53.333334v746.666666a53.393333 53.393333 0 0 0 53.333334 53.333334h106.666666a53.393333 53.393333 0 0 0 53.333334-53.333334V138.666667a53.393333 53.393333 0 0 0-53.333334-53.333334z m10.666667 800a10.666667 10.666667 0 0 1-10.666667 10.666667H650.666667a10.666667 10.666667 0 0 1-10.666667-10.666667V138.666667a10.666667 10.666667 0 0 1 10.666667-10.666667h106.666666a10.666667 10.666667 0 0 1 10.666667 10.666667z" fill="#ffffff" p-id="2074"></path></svg>
          <svg
            v-else
            t="1644679960346"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3140"
            width="16"
            height="16"><path d="M128 138.666667c0-47.232 33.322667-66.666667 74.176-43.562667l663.146667 374.954667c40.96 23.168 40.853333 60.8 0 83.882666L202.176 928.896C161.216 952.064 128 932.565333 128 885.333333v-746.666666z" fill="#ffffff" p-id="3141"></path></svg>
        </button>

        <button class="audio-button">
          <el-slider
            v-show="volumeVis"
            v-model="volume"
            vertical
            :min="0"
            :max="1"
            :step="0.1"
            height="50px"
            class="audio-volume diyaudio"
            input-size="mini"
            @input="changeVolume"
            @click.stop
            :show-tooltip="false"
          />
          <svg
            @click="toggleVolume"
            v-if="volume > 0"
            t="1644680209587"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4103"
            width="16"
            height="16"><path d="M308.971 657.987l150.28 165.279a16 16 0 0 0 11.838 5.236c8.837 0 16-7.163 16-16v-600.67a16 16 0 0 0-5.236-11.839c-6.538-5.944-16.657-5.463-22.602 1.075l-150.28 165.279A112 112 0 0 1 226.105 403H177c-17.673 0-32 14.327-32 32v154.333c0 17.674 14.327 32 32 32h49.105a112 112 0 0 1 82.866 36.654zM177 701.333c-61.856 0-112-50.144-112-112V435c0-61.856 50.144-112 112-112h49.105a32 32 0 0 0 23.676-10.472l150.28-165.28c35.668-39.227 96.383-42.113 135.61-6.445a96 96 0 0 1 31.418 71.028v600.671c0 53.02-42.98 96-96 96a96 96 0 0 1-71.029-31.417l-150.28-165.28a32 32 0 0 0-23.675-10.472H177z m456.058-348.336c-18.47-12.118-23.621-36.915-11.503-55.386 12.118-18.471 36.916-23.621 55.387-11.503C752.495 335.675 799 419.908 799 512c0 92.093-46.505 176.325-122.058 225.892-18.471 12.118-43.269 6.968-55.387-11.503-12.118-18.471-6.968-43.268 11.503-55.386C686.303 636.07 719 576.848 719 512c0-64.848-32.697-124.07-85.942-159.003z m92.93-137.323c-18.07-12.71-22.415-37.66-9.706-55.73s37.66-22.415 55.73-9.706C888.942 232.478 960 366.298 960 512s-71.058 279.522-187.988 361.762c-18.07 12.71-43.021 8.364-55.73-9.706-12.709-18.07-8.363-43.02 9.706-55.73C821.838 740.912 880 631.38 880 512c0-119.38-58.161-228.912-154.012-296.326z" p-id="4104" fill="#ffffff"></path></svg>
          <svg
            @click="toggleVolume"
            v-else
            t="1644681435786"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4705"
            width="16"
            height="16"><path d="M469.333333 106.666667v810.666666a21.333333 21.333333 0 0 1-36.42 15.086667L225.833333 725.333333H53.333333a53.393333 53.393333 0 0 1-53.333333-53.333333V352a53.393333 53.393333 0 0 1 53.333333-53.333333h172.5l207.08-207.086667A21.333333 21.333333 0 0 1 469.333333 106.666667z m548.42 612.42a21.333333 21.333333 0 0 0 0-30.173334L840.833333 512l176.92-176.913333a21.333333 21.333333 0 1 0-30.173333-30.173334L810.666667 481.833333 633.753333 304.913333a21.333333 21.333333 0 0 0-30.173333 30.173334L780.5 512l-176.92 176.913333a21.333333 21.333333 0 0 0 30.173333 30.173334L810.666667 542.166667l176.913333 176.92a21.333333 21.333333 0 0 0 30.173333 0z" fill="#ffffff" p-id="4706"></path></svg>
        </button>

        <div class="timetext">
          <span class="audio-time">{{ audio.currentTime | formatSecond }}</span>
          /
          <span class="audio-time">{{ audio.maxTime | formatSecond }}</span>
        </div>
        <a-slider
          v-if="audio.maxTime > 0"
          :max="audio.maxTime - 1"
          :min="0"
          v-model="sliderTime"
          class="audioduration diyaudio"
          @change="changeCurrentTime"
          width='100%'
          :show-tooltip="false"
          @mousedown.native="mousedownChangeTime"
        />
      </div>
    </div>
    <div class="transformmask maskPlay" @click="startPlayOrPause" v-if="withMaskButton && !audio.playing ">
      <svg height="80%" version="1.1" viewBox="0 0 68 48" width="100%"><path class="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="rgba(0,0,0,0.6)"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg>
    </div>
  </div>
</template>

<script>
  function realFormatSecond(second) {
    var secondType = typeof second
    if (secondType === 'number' || secondType === 'string') {
      second = parseInt(second)
      // var hours = Math.floor(second / 3600)
      // second = second - hours * 3600
      var mimute = Math.floor(second / 60)
      second = second - mimute * 60
      return ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
    } else {
      return '00'
    }
  }
  export default {
    props: {
      url: {
        type: String,
        required: true
      },
      withMaskButton: {
        type: Boolean,
        default: false
      }
    },
    name: 'VueAudio',
    data() {
      return {
        audio: {
          currentTime: 0,
          maxTime: 0,
          playing: false,
          muted: false,
          speed: 1,
          waiting: true,
          preload: 'preload'
        },
        sliderTime: 0,
        speeds: 0,
        controlList: {
          // 不显示下载
          noDownload: false,
          // 不显示静音
          noMuted: false,
          // 不显示音量条
          noVolume: false,
          // 不显示进度条
          noProcess: false,
          // 只能播放一个
          onlyOnePlaying: true,
          // 不要快进按钮
          noSpeed: false
        },
        volume: 0,
        volumeVis: false,
        nextPlayStatus: false,
        isSliding: false
      }
    },
    mounted() {
      this.changeVolume()
    },
    methods: {
      changeVolume() {
        if (this.$refs.audio) {
          this.$refs.audio.volume = this.volume
        }
      },
      checkRefsInstance() {
        return this.$refs.audio
      },
      // 进度条toolTip
      formatProcessToolTip(index = 0) {
        index = parseInt(this.audio.maxTime / 100 * index)
        return 'time: ' + realFormatSecond(index)
      },
      // seek
      changeCurrentTime() {
        console.log('changeCurrentTime changeCurrentTime')
        if (!this.checkRefsInstance()) return
        this.audio.currentTime = this.sliderTime
        this.$refs.audio.currentTime = parseInt(this.audio.currentTime)
        this.isSliding = false
      },
      mousedownChangeTime() {
        console.log('this.isSliding')
        this.isSliding = true
      },
      startPlayOrPause() {
        return this.audio.playing ? this.pausePlay() : this.startPlay()
      },
      // 开始播放
      startPlay() {
        if (!this.checkRefsInstance()) return
        this.$refs.audio.play()
      },
      // 暂停
      pausePlay() {
        if (!this.checkRefsInstance()) return
        this.$refs.audio.pause()
      },
      // 当音频暂停
      onPause () {
        this.audio.playing = false
      },
      // 当发生错误, 就出现loading状态
      onError () {
        this.audio.waiting = true
      },
      // 当音频开始等待
      onWaiting (res) {
        // console.log(res)
      },
      // 当音频开始播放
      onPlay (res) {
        // console.log(res)
        this.audio.playing = true
        this.audio.loading = false
        if (!this.controlList.onlyOnePlaying) {
          return
        }
        const target = res.target
        const audios = document.getElementsByTagName('audio');
        [...audios].forEach((item) => {
          if (item !== target) {
            item.pause()
          }
        })
      },
      // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
      onTimeupdate(res) {
        // // console.log('timeupdate')
        // // console.log(res.target.currentTime)
        this.audio.currentTime = res.target.currentTime
        if (!this.isSliding) {
           this.sliderTime = this.audio.currentTime
        }
      },
      // 当加载语音流元数据完成后，会触发该事件的回调函数
      // 语音元数据主要是语音的长度之类的数据
      loadedmetadata(res) {
        // // console.log('loadedmetadata', res.target.duration)
        // this.audio.waiting = false
        // this.audio.maxTime = parseInt(res.target.duration)
      },
      async audioCanplay(e) {
        if (this.audio.maxTime === 0) {
          const firsthandAudio = e.target
          while (firsthandAudio.duration === Infinity && this.audio.maxTime === 0 && this.checkRefsInstance()) {
            // eslint-disable-next-line promise/param-names
            await new Promise(r => setTimeout(r, 200))
            firsthandAudio.currentTime = 10000000 * Math.random()
          }
          this.audio.waiting = false
          if (this.$refs.audio) this.$refs.audio.currentTime = 0
          this.audio.maxTime = firsthandAudio.duration
          // console.log('done', this.audio.maxTime)
        }
      },
      toggleVolume() {
        this.volumeVis = !this.volumeVis
      }
    },
    filters: {
      formatSecond(second = 0) {
        return realFormatSecond(second)
      },
      transPlayPause(value) {
        return value ? '暂停' : '播放'
      },
      transMutedOrNot(value) {
        return value ? '放音' : '静音'
      },
      transSpeed(value) {
        return '快进: x' + value
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .main-wrap{
    width: 100%;
    height: 100%;
    min-height: 100px;
    display: flex;
    flex-direction: column;
  }
  .audioplaybg{
    background-color: #9fd6ba;
    flex-grow: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .audio-slider {
    padding: 0 10px;
  }
  .di {
    /* display: fle; */
  }
  .download {
    color: #409EFF;
    margin-left: 15px;
  }
  .dn{
    display: none;
  }
  .el-slider__runway{
    background-color: rgba(21, 195, 154, 0.5) !important;
  }
  .el-slider__bar{
    background-color: rgba(21, 195, 154, 0.5) !important;
  }
  .el-slider__button{
    border: 2px solid rgba(21, 195, 154, 1) !important;
    background-color: rgba(21, 195, 154, 1) !important;
  }
  .class-audio-control{
    margin-top: 5px;
    height: 20px;
    /* background: rgba(0, 0, 0, 0.5); */
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0 11px;
    font-size: 10px;
    font-family: Inter-Bold;
    line-height: 24px;
    color: #FFFFFF;
    line-height: 20px;
  }
  .audio-button{
    padding: 0;
    background-color: transparent;
    border: none;
    cursor: pointer;
    margin:0 2px;
    position: relative;
  }
  .audio-button-play{
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-left: 8px solid #fff;
    border-bottom: 6px solid transparent;
  }
  .audio-button-pause{
    width: 8px;
    height: 8px;
    background: #fff;
  }
  .audio-time{
    margin: 0 5px;
  }
  /* 新的样式 */
  .play-button{
    width: 100%;
    height: 30px;
    background-color: #000;
  }
  .maskPlay{
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .timetext{
    font-size: 10px;
  }
</style>
