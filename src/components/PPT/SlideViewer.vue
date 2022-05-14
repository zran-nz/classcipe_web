<template>
  <div class='slide-viewer'>
    <div class='hover-mask' v-if='showHoverMask'>
      <div class='hover-action'>
        <a-button type='primary' shape='round' class='cc-slide-btn' @click='handlePreview'>
          <a-icon type='eye' /> Preview
        </a-button>
        <a-button shape='round' class='cc-slide-btn' @click='handleAdd'>
          <a-icon type='plus-circle' /> Add
        </a-button>
      </div>
    </div>
    <a-carousel :style="{width: width, height: height}">
      <div class='slider-img-cover' :style="{width: width, height: height, backgroundImage: 'url(' + image + ')'}" v-for='(image,idx) in imgList' :key='idx'>
      </div>
    </a-carousel>
    <div class='slide-title' v-show='showTitle' :style="{width: width}">
      {{ title }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'SlideViewer',
  props: {
    imgList: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: null
    },
    slideId: {
      type: String,
      default: null
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    showTitle: {
      type: Boolean,
      default: false
    },
    showScrollBar: {
      type: Boolean,
      default: false
    },
    showHoverMask: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {
    handlePreview () {
      this.$emit('preview', this.slideId)
    },
    handleAdd () {
      this.$emit('add', this.slideId)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.slider-img-cover {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}

.slide-title {
  text-align: center;
  font-family: Arial;
  font-weight: 400;
  color: #282828;
  background-color: #ffffff;
  cursor: pointer;
  line-height: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  padding: 0 15px;
  box-sizing: border-box;
}

.slide-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .hover-mask {
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease-in-out;
    .hover-action {
      width: 100px;
      position: absolute;
      left: 50%;
      margin-left: -50px;
      top: 50%;
      margin-top: -40px;

    }
  }

  &:hover {
    .hover-mask {
      display: block;
      opacity: 1;
    }
  }
}

.cc-slide-btn {
  margin: 5px 0;
  width: 110px;
  line-height: 20px;
}
</style>
