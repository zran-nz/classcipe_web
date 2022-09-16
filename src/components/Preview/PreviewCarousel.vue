<template>
  <div class='preview-carousel'>
    <a-carousel ref='carousel' arrows :after-change='onChangePage'>
      <div slot="prevArrow" class="custom-slick-arrow" style="left: -15px;zIndex: 1">
        <a-icon type="left-circle" />
      </div>
      <div slot="nextArrow" class="custom-slick-arrow" style="right: -15px">
        <a-icon type="right-circle" />
      </div>
      <template v-for='(pageObject,idx) in pageObjectList'>
        <div :key="'page'+idx" class='slider-img-cover' :style="{backgroundImage: `url('${pageObject.contentUrl}')`, filter: idx > unPayPageIndex ? 'blur(3px)' : 'none' }">
        </div>
      </template>
      <div class='slider-video-cover' v-for='(videoItem,idx) in videoList' :key='idx'>
        <video controls :src='videoItem.url' v-if='!isYoutubeIframeUrl(videoItem.url)' ref='video' />
        <iframe :src='videoItem.url' class='video-iframe' v-if='isYoutubeIframeUrl(videoItem.url)' />
      </div>
    </a-carousel>
    <div class="cover-unpay" v-if="currentImgIndex > 0 && currentImgIndex > unPayIndex">Only available after purchase</div>
    <div class="carousel-page">{{ showPage }}</div>
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
    },
    filterPageObjectList: {
      type: Array,
      default: () => []
    },
    filterVideoList: {
      type: Array,
      default: () => []
    }
  },
  mixins: [ PptPreviewMixin ],
  computed: {
    showArrow () {
      return this.pageObjectList.length + this.videoList.length > 1
    },
    isYoutubeIframeUrl(url) {
      return function(url) {
        return url && url.indexOf('youtube.com/embed') !== -1
      }
    },
    showPage() {
      if (this.currentImgIndex === 0) {
        return 'Cover image'
      } else {
        const total = this.videoList.length + this.pageObjectList.length - 1
        return `${ this.currentImgIndex } / ${total}`
      }
    },
    unPayPageIndex() {
      return this.filterPageObjectList.length
    },
    unPayVideoIndex() {
      return this.filterVideoList.length
    },
    unPayIndex() {
      return this.filterPageObjectList.length + this.filterVideoList.length
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
      this.$logger.info('page', page, this.$refs.video)
      this.currentImgIndex = page
      if (this.$refs.video) {
        this.$refs.video.forEach(item => item.pause())
      }
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
  background-size: contain;
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

.video-iframe {
  border: none;
  overflow: hidden;
  height: 100%;
  width: 100%;
}
.carousel-page {
  position: absolute;
  width: 100%;
  text-align: center;
}
.cover-unpay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #333;
  opacity: .8;
  color: #d2eb1c;
  font-size: 30px;
}
</style>
