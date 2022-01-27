<template>
  <div class='img-draw'>
    <div class="tool-wrap">
      <div class='tool-list'>
        <div class='tool-item' @click="drawingType = 'rectangle'">
          <rect-icon />
        </div>
        <div class='tool-item' @click="drawingType = 'route'">
          <line-icon />
        </div>
        <div class='tool-item' @click="drawingType = 'radius'">
          <circle-icon />
        </div>
        <div class='tool-item' @click="drawingType = 'font'">
          <text-icon />
        </div>
        <div class='tool-item' @click="clear">
          <clear-icon />
        </div>
        <div class='tool-item cancel-item' @click="drawingCancel">
          <close-icon />
        </div>
        <div class='tool-item' @click="drawingSure">
          <yes-icon />
        </div>
      </div>
    </div>
    <div class="canvas-wrap" ref="canvasWrap">
      <canvas
        class="canvas"
        ref="canvas"
        @mousedown="mousedown"
        @mouseup="mouseup"
        @mousemove="mousemove"
        @click="canvasClick">Your device does not support drawing. Please use a modern browser</canvas>
    </div>
    <div v-show="textareaShow" class="textarea-wrap" ref="textarea">
      <a-input type="textarea" :rows="3" placeholder="Please enter the content." v-model="textareaText"></a-input>
      <div class="btn-wrap">
        <a-button @click="fontSure" type="success">Confirm</a-button>
        <a-button @click="fontCancel">Cancel</a-button>
      </div>
    </div>
  </div>
</template>

<script>

import RectIcon from '@/assets/icons/feedback/rect.svg?inline'
import ClearIcon from '@/assets/icons/feedback/clear.svg?inline'
import LineIcon from '@/assets/icons/feedback/line.svg?inline'
import RedoIcon from '@/assets/icons/feedback/redo.svg?inline'
import CircleIcon from '@/assets/icons/feedback/circle.svg?inline'
import TextIcon from '@/assets/icons/feedback/text.svg?inline'
import CloseIcon from '@/assets/icons/feedback/close.svg?inline'
import YesIcon from '@/assets/icons/feedback/yes.svg?inline'

export default {
  name: 'ImageDraw',
  components: {
    RectIcon,
    ClearIcon,
    CircleIcon,
    LineIcon,
    RedoIcon,
    TextIcon,
    CloseIcon,
    YesIcon,
  },
  props: {
    imgRawData: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      imgBase64Data: null,
      canvas: null,
      downX: 0,
      downY: 0,
      downMs: 0,
      drawingType: '',
      drawingStatus: false,
      imgData: [],
      imgDataIndex: 0,
      textareaText: '',
      textareaShow: false,
      lineWidth: 2,
      strokeStyle: '#ff0000'
    }
  },
  created() {
    this.imgBase64Data = this.imgData
  },
  mounted() {
    this.canvas = this.$refs.canvas.getContext('2d')
    this.drawingImg()
  },
  methods: {
    // push历史记录list
    pushCanvasData() {
      const W = this.$refs.canvas.width
      const H = this.$refs.canvas.height
      this.imgData = this.imgData.slice(0, this.imgDataIndex + 1)
      this.imgData.push(this.canvas.getImageData(0, 0, W, H))
      this.imgDataIndex = this.imgData.length - 1
    },
    // 设置canvas最大尺寸是img尺寸最小尺寸是100%
    setCanvasAttr(imgW, imgH) {
      const canvasWrapW = this.$refs.canvasWrap.offsetWidth
      const canvasWrapH = this.$refs.canvasWrap.offsetHeight
      this.$refs.canvas.width = imgW < canvasWrapW ? canvasWrapW : imgW
      this.$refs.canvas.height = imgH < canvasWrapH ? canvasWrapH : imgH
      return {
        x: (this.$refs.canvas.width - imgW) / 2,
        y: (this.$refs.canvas.height - imgH) / 2,
        w: imgW,
        h: imgH
      }
    },
    drawingImg() {
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.src = this.imgRawData
      image.onload = () => {
        const pixelRatio = 1000 / image.width
        const imageH = image.height * pixelRatio
        const position = this.setCanvasAttr(1000, imageH)
        this.canvas.drawImage(image, position.x, position.y, position.w, position.h)
        this.setStyle()
        this.pushCanvasData()
      }
    },
    setStyle() {
      this.canvas.font = '14px Arial'
      this.canvas.fillStyle = '#15c39a'
      this.canvas.strokeStyle = '#15c39a'
      this.canvas.lineWidth = 2
    },
    strokeStyleChange(color) {
      this.canvas.fillStyle = color
      this.canvas.strokeStyle = color
    },
    mousedown(event) {
      if (this.drawingType === '') {
        return
      }
      this.downMs += new Date().getTime()
      this.drawingStatus = true
      this.downX = event.offsetX
      this.downY = event.offsetY
      this.$logger.info('x:', this.downX, 'y:', this.downY)
      this.canvas.beginPath()
    },
    mouseup() {
      const interval = (new Date().getTime()) - this.downMs > 20 && this.downMs
      if (interval) {
        this.pushCanvasData()
      }
      if (this.drawingType !== '') {
        this.drawingStatus = false
      }
    },
    mousemove(event) {
      if (!this.drawingType || !this.drawingStatus) {
        return
      }
      this.canvas.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
      this.canvas.putImageData(this.imgData[this.imgDataIndex], 0, 0)
      const x = event.offsetX
      const y = event.offsetY
      if (this.drawingType === 'rectangle') { // 矩形
        this.rectangle(x, y)
      } else if (this.drawingType === 'radius') { // 半径
        this.radius(x, y)
      } else if (this.drawingType === 'route') { // 自定义路径
        this.route(x, y)
      }
    },
    canvasClick(event) {
      if (this.drawingType !== 'font') {
        return
      }
      this.$logger.info('canvasClick font')
      this.textareaShow = true
      const x = event.offsetX
      const y = event.offsetY
      this.downX = x
      this.downY = y
      this.$refs.textarea.style.left = `${x}px`
      this.$refs.textarea.style.top = `${y}px`
    },
    fontCancel() {
      this.textareaText = ''
      this.textareaShow = false
    },
    fontSure() {
      let X = 0; let Y = 0
      for (let i = 0, length = this.textareaText.length; i < length; i++) {
        X = (i % 11) * 8 + 12 // 15是文字水平间隔 12用来解决padding造成的文字跳动
        Y = (Math.floor(i / 11) + 1) * 15 + 2 // 20是文字纵向间隔 2用来解决padding造成的文字跳动
        this.canvas.fillText(this.textareaText[i], X + this.downX, Y + this.downY)
      }
      this.fontCancel()
      this.pushCanvasData()
    },
    rectangle(X, Y) { // 矩形
      this.canvas.strokeRect(this.downX, this.downY, X - this.downX, Y - this.downY)
    },
    radius(X, Y) { // 半径
      const radius = Math.sqrt(Math.pow(X - this.downX, 2) + Math.pow(Y - this.downY, 2))
      this.canvas.beginPath()
      this.canvas.arc(this.downX, this.downY, radius, 0, Math.PI * 2, true)
      this.canvas.stroke()
      this.canvas.closePath()
    },
    route(X, Y) { // 自定义路径
      this.canvas.lineTo(X, Y)
      this.canvas.stroke()
    },
    revokeAndRecovery(n) {
      this.imgDataIndex += n
      this.imgDataIndex = this.imgDataIndex < 0 ? 0 : this.imgDataIndex
      this.imgDataIndex = this.imgDataIndex === this.imgData.length ? this.imgData.length - 1 : this.imgDataIndex
      this.canvas.putImageData(this.imgData[this.imgDataIndex], 0, 0)
    },
    clear() {
      this.imgData = this.imgData.slice(0, this.imgDataIndex + 1)
      this.imgData.push(this.imgData[0])
      this.imgDataIndex = this.imgData.length - 1
      this.canvas.putImageData(this.imgData[this.imgDataIndex], 0, 0)
    },
    async drawingSure() {
      const base64 = this.$refs.canvas.toDataURL()
      this.$emit('close-drawing', base64)
    },
    async drawingCancel() {
      return this.$emit('close-drawing')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.img-draw {
  position: relative;
  width: 1000px;
}

.drawing-wrap{
  width: 100%;
  height: 100%;
  background: #f1f1f1;
  display: flex;
  flex-direction: column;
}

.canvas-wrap{
  flex: 1;
  background-size: 30px;
  overflow: auto;
  .canvas{
    width: 100%;
    display: block;
  }
}
.textarea-wrap{
  position: absolute;
  width: 180px;
}

.tool-wrap{
  position: absolute;
  bottom: -45px;
  left: 50%;
  margin-left: -142px;
  width: 285px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .tool-list {
    display: flex;
    align-items: center;
    background: #fff;
    height: 40px;

    .tool-item {
      cursor: pointer;
      padding: 0 8px;
      height: 40px;
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: #f6f6f6;
      }
      svg {
        height: 20px;
        width: 20px;
      }
    }

    .cancel-item {
      border-left: 1px solid #e5e5e5;
      margin-left: 5px;
    }
  }
}
</style>
