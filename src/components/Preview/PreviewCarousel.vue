<template>
  <div class='preview-carousel'>
    <a-carousel ref='carousel' arrows :after-change='onChangePage'>
      <div slot="prevArrow" class="custom-slick-arrow" style="left: -15px;zIndex: 1">
        <a-icon type="left-circle" />
      </div>
      <div slot="nextArrow" class="custom-slick-arrow" style="right: -15px">
        <a-icon type="right-circle" />
      </div>
      <div class='slider-img-cover' :style="{backgroundImage: 'url(' + pageObject.contentUrl + ')' }" v-for='(pageObject,idx) in pageObjectList' :key='idx'>
      </div>
      <div class='slider-video-cover' v-for='(videoItem,idx) in videoList' :key='idx'>
        <video controls :src='videoItem.url' />
      </div>
    </a-carousel>
  </div>
</template>

<script>

import { PptPreviewMixin } from '@/mixins/PptPreviewMixin'

export default {
  name: 'PreviewCarousel',
  props: {
    pageObjectList: {
      type: Array,
      default: () => []
    },
    videoList: {
      type: Array,
      default: () => []
    },
    width: {
      type: String,
      default: '400px'
    }
  },
  mixins: [ PptPreviewMixin ],
  computed: {
    showArrow () {
      return this.pageObjectList.length + this.videoList.length > 1
    }
  },
  data() {
    return {
      currentImgIndex: 0
    }
  },
  created() {
    this.$logger.info('PreviewCarousel created pageObjectList', this.pageObjectList, 'videoList', this.videoList)
  },
  methods: {
    onChangePage (page) {
      this.currentImgIndex = page
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.preview-carousel {
  position: relative;
}

.slider-img-cover {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 400px;
  position: relative;
  box-sizing: border-box;
  min-height: 100px;
}

.slider-video-cover {
  width: 100%;
  height: 400px;
  position: relative;

  video {
    width: 100%;
    height: 400px;
  }
}

.preview-carousel {

  .custom-slick-arrow {
    width: 30px;
    height: 30px;
    font-size: 30px;
    opacity: 0.2;
    color: #fff;
    background-color: rgba(31, 45, 61, 0.4);
    border-radius: 50%;
  }

  &:hover {
    .custom-slick-arrow {
      width: 30px;
      height: 30px;
      font-size: 30px;
      opacity: 0.5;
      color: #fff;
      background-color: rgba(31, 45, 61, 0.4);
      border-radius: 50%;

      &:hover {
        opacity: 0.7;
        color: #fff;
        background-color: rgba(31, 45, 61, 0.8);
      }
    }
  }
}

.custom-slick-arrow:before {
  display: none;
}
</style>
