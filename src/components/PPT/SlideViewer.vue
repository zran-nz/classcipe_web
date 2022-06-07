<template>
  <div class='slide-viewer-wrapper'>
    <div class='slide-viewer'>
      <template v-if='imgList.length'>
        <div class='hover-mask' v-if='showHoverMask'>
          <div class='hover-action'>
            <a-button type='primary' shape='round' class='cc-slide-btn' @click='handlePreview'>
              <a-icon type='eye' /> Preview
            </a-button>
            <a-button shape='round' class='cc-slide-btn' @click='handleAdd' v-show='showAddButton'>
              <a-icon type='plus-circle' /> Add
            </a-button>
            <a-button shape='round' class='cc-slide-btn' @click='handleRemove' v-show='showRemoveButton'>
              <a-icon type="delete" /> Remove
            </a-button>
          </div>
        </div>
        <a-carousel ref='carousel' :arrows='showArrow && imgList.length > 1' :after-change='onChangePage'>
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
          {{ title || 'Untitled' }}
        </div>
      </template>
      <template v-if='!imgList.length'>
        <div class='no-slide-image' :style="{ height: emptyHeight }">
          <common-no-data :text='emptyTips'/>
        </div>
      </template>
    </div>
    <div class='slide-notes-wrapper' v-if='showNotes'>
      <slide-notes
        :current-page-item='currentPageItem'
        :current-page-tips='currentPageTips'
      />
    </div>
    <div class='slide-viewer-nav' v-if='showNav'>
      <div class='carousel-page'>
        <div class='img-list-wrapper'>
          <div class='slide-left' @click='scrollLeft'>
            <a-icon type="left" />
          </div>
          <div class='img-list' id='slide-img-list'>
            <div
              class='img-item'
              :class="{'active-img-item': currentImgIndex === index}"
              v-for='(img,index) in imgList'
              :key="'index' + index"
              @click='handleGotoImgIndex(index)'>
              <img :src='img' />
            </div>
          </div>
          <div class='slide-right' @click='scrollRight'>
            <a-icon type="right" />
          </div>
        </div>
      </div>
    </div>
    <div class='slider-materials-wrapper'>
      <slide-materials-and-tips
        :current-page-material='currentPageMaterial'
        v-if='showMaterialsAndTips' />
    </div>
  </div>
</template>

<script>

import CommonNoData from '@/components/Common/CommonNoData'
import SlideMaterialsAndTips from '@/components/PPT/SlideMaterialsAndTips'
import { PptPreviewMixin } from '@/mixins/PptPreviewMixin'
import SlideNotes from '@/components/PPT/SlideNotes'
import SlideEvent from '@/components/PPT/SlideEvent'

export default {
  name: 'SlideViewer',
  components: { SlideNotes, SlideMaterialsAndTips, CommonNoData },
  props: {
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
    // 显示页底标题栏
    showTitle: {
      type: Boolean,
      default: false
    },
    // 显示悬浮遮罩层
    showHoverMask: {
      type: Boolean,
      default: false
    },
    // 显示悬浮切换上下页图标按钮
    showArrow: {
      type: Boolean,
      default: false
    },
    // 显示PPT notes标签数据
    showNotes: {
      type: Boolean,
      default: false
    },
    // 显示图片导航栏
    showNav: {
      type: Boolean,
      default: false
    },
    showEditGoogleSlide: {
      type: Boolean,
      default: false
    },
    showMaterialsAndTips: {
      type: Boolean,
      default: false
    },
    defaultThumbnailList: {
      type: Array,
      default: () => []
    },
    slideItem: {
      type: Object,
      default: null
    },
    showAddButton: {
      type: Boolean,
      default: true
    },
    showRemoveButton: {
      type: Boolean,
      default: false
    },
    emptyTips: {
      type: String,
      default: 'PPT image not found.'
    },
    emptyHeight: {
      type: String,
      default: '160px'
    }
  },
  mixins: [ PptPreviewMixin ],
  watch: {
    thumbnailList: {
      handler(newVal) {
        if (this.slideId && this.showMaterialsAndTips) {
          this.getClassInfo(this.slideId)
        }
      }
    }
  },
  computed: {
    imgList () {
      if (this.defaultThumbnailList.length) {
        return this.defaultThumbnailList.map(item => item.contentUrl)
      } else if (this.thumbnailList && this.thumbnailList.length) {
        return this.thumbnailList.map(item => item.contentUrl)
      } else if (this.slideItem && this.slideItem.image) {
        return [ this.slideItem.image ]
      } else {
        return []
      }
    }
  },
  data() {
    return {
      currentImgIndex: 0
    }
  },
  methods: {
    handlePreview () {
      this.$EventBus.$emit(SlideEvent.PREVIEW_TEMPLATE, this.slideItem)
    },
    handleAdd () {
      this.$EventBus.$emit(SlideEvent.SELECT_TEMPLATE, this.slideItem)
    },
    handleRemove () {
      this.$EventBus.$emit(SlideEvent.CANCEL_SELECT_TEMPLATE, this.slideItem)
    },
    handleGotoImgIndex(index) {
      this.$logger.info('handleGotoImgIndex ' + index)
      this.currentImgIndex = index
      this.$refs.carousel.goTo(index)
    },
    scrollLeft () {
      this.$logger.info('scrollLeft')
      const dom = document.getElementById('slide-img-list')
      dom.scrollTo({
        left: dom.scrollLeft - 400,
        behavior: 'smooth'
      })
    },
    scrollRight () {
      this.$logger.info('scrollLeft')
      const dom = document.getElementById('slide-img-list')
      dom.scrollTo({
        left: dom.scrollLeft + 400,
        behavior: 'smooth'
      })
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
  padding-bottom: 55%;
  position: relative;
  box-sizing: border-box;
  min-height: 100px;
}

.slide-title {
  text-align: center;
  font-family: Arial;
  font-weight: 500;
  color: #282828;
  font-size: 13px;
  background-color: #ffffff;
  cursor: pointer;
  line-height: 25px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  padding: 0 15px;
  box-sizing: border-box;
}

.slide-viewer {
  position: relative;
  overflow: hidden;
  background: #FFFFFF;
  border: 1px solid #E1E1E1;
  box-shadow: 0 1px 2px 0px rgba(65, 65, 65, 0.07);
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
