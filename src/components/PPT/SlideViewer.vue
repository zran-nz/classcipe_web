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
    <a-carousel :arrows='showArrow && imgList.length > 1'>
      <div
        slot="prevArrow"
        class="custom-slick-arrow"
        style="left: 0;z-index: 200"
      >
        <a-icon type="left" />
      </div>
      <div slot="nextArrow" class="custom-slick-arrow" style="right: 0; z-index: 200">
        <a-icon type="right" />
      </div>
      <div class='slider-img-cover' :style="{width: width, backgroundImage: 'url(' + image + ')'}" v-for='(image,idx) in imgList' :key='idx'>
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
    },
    showArrow: {
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
  padding-bottom: 45%;
  position: relative;
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

    .custom-slick-arrow {
      display: flex !important;
    }
  }
}

.cc-slide-btn {
  margin: 5px 0;
  width: 110px;
  line-height: 20px;
}

.custom-slick-arrow {
  display: none !important;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 200;
  width: 15px;
  height: 26px;
  text-align: center;
  font-size: 13px;
  line-height: 20px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 4px 0;
  opacity: 0.3;
  transition: opacity 0.3s ease-in-out;
}

.custom-slick-arrow::before {
  display: none;
}

.custom-slick-arrow {
  &:hover {
    color: #fff;
    background-color: rgba(0, 0, 0, 0.6);
    opacity: 1;
  }
}

</style>
