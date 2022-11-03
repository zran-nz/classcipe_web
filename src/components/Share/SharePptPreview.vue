<template>
  <div class='share-ppt-preview'>
    <div class='slide-select-wrapper' ref='slide'>
      <div class='slide-select'>
        <div class='slide-select-and-preview'>
          <div class='slide-select-action' v-if='pptImages.length === 0'>
            <img
              src='https://dcdkqlzgpl5ba.cloudfront.net/file/202111271330492511-Welcome_slide.png' />
          </div>
          <div
            class='slide-preview'
            :style="{'width':(leftWidth- 50) + 'px'}"
            v-show='pptImages.length'>
            <a-carousel ref='carousel' arrows :after-change='onChangePage'>
              <div slot='prevArrow' class='custom-slick-arrow' style='left: 10px;zIndex: 9'>
                <a-icon type='left-circle' />
              </div>
              <div slot='nextArrow' class='custom-slick-arrow' style='right: 10px;zIndex: 9'>
                <a-icon type='right-circle' />
              </div>
              <div v-for='(item,index) in pptImages' :key='index'>
                <img :src='item.imageUrl' />
              </div>
            </a-carousel>
            <div class='page-info' v-if='pptImages && pptImages.length'>
              {{ currentImgIndex + 1 }} / {{ pptImages.length }}
            </div>
          </div>
        </div>
      </div>
      <div class='carousel-page'>
        <div class='img-list-wrapper'>
          <div class='img-list'>
            <div
              class='img-item'
              v-for='(item,index) in pptImages'
              :key="'index' + index"
              @click='handleGotoImgIndex(index)'>
              <img :src='item.imageUrl' />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SharePptPreview',
  props: {
    pptImages: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      rightWidth: 600,
      leftWidth: 730,
      currentImgIndex: 0
    }
  },
  methods: {
    onChangePage (page) {
      this.currentImgIndex = page
    },
    handleGotoImgIndex(index) {
      console.info('handleGotoImgIndex ' + index)
      this.currentImgIndex = index
      this.$refs.carousel.goTo(index)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.slide-select-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;

  /deep/ .ant-carousel .slick-slide img {
    width: 100%;
  }

  /deep/ .ant-carousel {
    .custom-slick-arrow:before {
      display: none;
    }

    .custom-slick-arrow:hover {
      opacity: 0.5;
    }

    .slick-slide h3 {
      color: #fff;
    }

    .slick-prev {
      left: -40px !important;
      svg {
        fill: #38cfa6;
      }
    }

    .slick-next {
      right: -30px !important;
      svg {
        fill: #38cfa6;
      }
    }

    .anticon {
      color: fade(@black, 45%);
      font-size: 30px;
    }
  }

  .slide-select {
    background: #fff;
    position: relative;

    .slide-select-and-preview {
      width: 100%;
      //min-height: 400px;

      .reset-edit-basic-info {
        z-index: 100;
        position: absolute;
        top: 10px;
        left: 3px;
        background: rgba(0, 0, 0, 0.8);
        opacity: 0.7;
        padding: 5px 10px;
        font-size: 12px;
        border-radius: 20px;
        cursor: pointer;
        color: #fff;
      }

      .slide-select-action {
        height: 400px;
        width: 600px;

        img {
          width: 100%
        }
      }

      .slide-preview {
        border: 1px solid rgba(0, 0, 0, 0.1);
        position: relative;

        .slide-hover-action-mask {
          display: none;
          z-index: 100;
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);

          .slide-hover-action {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 500px;
            margin-top: -30px;
            margin-left: -250px;

            .update-select-slide {

            }
          }
        }

        &:hover {
          .slide-hover-action-mask {
            display: block;
          }
        }
      }
    }
  }

  .slide-recommend {
    width: 600px;
    padding: 0 20px;
    box-sizing: border-box;
  }
}

.carousel-page {
  padding-left: 20px;
  height: 400px;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.00);
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.03);
  }

  /* 滚动条滑块 */

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.06);
    -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.04);
  }

  .img-list-wrapper {
    width: 90%;
    padding-right: 15px;

    .img-list {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      .img-item {
        box-shadow: 0 0 8px 0 rgba(31, 33, 44, 40%);
        margin-bottom: 20px;
        background: #FFFFFF;
        border: 1px solid #E7E7E7;
        overflow: hidden;
        border-radius: 6px;

        img {
          width: 100%;
        }
      }
    }
  }
}

.page-info {
  padding: 0 5px;
}

</style>
