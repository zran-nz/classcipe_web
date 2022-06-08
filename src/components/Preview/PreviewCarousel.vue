<template>
  <div class='preview-carousel'>
    <a-carousel ref='carousel' :arrows='showArrow && pageObjectList.length > 1' :after-change='onChangePage'>
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

.custom-slick-arrow {
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
  color: #fff !important;
  background-color: rgba(0, 0, 0, 0.6) !important;
  opacity: 1 !important;
  padding: 4px 0;
  transition: opacity 0.3s ease-in-out;
}

.custom-slick-arrow::before {
  display: none;
}

.carousel-page {
  display: flex;
  height: 110px;
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  &::-webkit-scrollbar {
    display: none;
  }

  .img-list-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    position: relative;

    &:hover {
      .slide-left, .slide-right {
        display: flex;
        opacity: 1;
      }
    }

    .slide-left {
      display: none;
      cursor: pointer;
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -15px;
      width: 15px;
      height: 26px;
      font-size: 13px;
      line-height: 20px;
      align-items: center;
      justify-content: center;
      flex-direction: row;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.6);
      opacity: 0.3;
      transition: opacity 0.3s ease-in-out;
    }

    .slide-right {
      display: none;
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 50%;
      margin-top: -15px;
      width: 15px;
      height: 26px;
      text-align: center;
      font-size: 13px;
      line-height: 20px;
      align-items: center;
      justify-content: center;
      flex-direction: row;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.6);
      opacity: 0.3;
      transition: opacity 0.3s ease-in-out;
    }

    .img-list {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      width: 100%;
      overflow-x: auto;
      user-select: none;

      &::-webkit-scrollbar {
        display: none;
      }

      .img-item {
        height: 84px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          box-sizing: border-box;
          height: 80px;
        }
      }

      .active-img-item {
        img {
          outline: 2px solid #15C39A;
          box-shadow: 0 0 3px 3px #15C39A1A;
        }
      }
    }
  }
}
</style>
