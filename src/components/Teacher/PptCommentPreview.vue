<template>
  <div class="ppt-comment-preview">
    <div class="img-list-wrapper">
      <div class="img-list">
        <div class="img-item" v-for="(img,index) in imgList" :key="index" @click="handleGotoImgIndex(index)">
          <img :src="img.imgUrl" />
          {{ img.pageId }}
        </div>
      </div>
    </div>
    <div class="ppt-preview" v-if="!loading && imgList.length">
      <a-carousel ref="carousel" dot-position="right">
        <a slot="customPaging"></a>
        <div
          slot="prevArrow"
          class="custom-slick-arrow"
          style="left: 10px;z-index: 1"
        >
          <a-icon type="left-circle" />
        </div>
        <div
          slot="nextArrow"
          class="custom-slick-arrow"
          style="right: 10px">
          <a-icon type="right-circle" />
        </div>
        <div class="preview-img-item" v-for="(img,index) in imgList" :key="index">
          <div class="preview-block" :style="{backgroundImage: 'url(' + img.imgUrl + ')' }" :data-img="img.imgUrl"></div>
        </div>
      </a-carousel>
    </div>
    <div class="comment-detail" >
      <div class="comment-item" v-for="(comment,index) in commentData" :key="index">
        <template v-if="comment.page_id === currentPageId && comment.type === 'text'">

          <div class="comment-content"> {{ comment.link }}</div>
          <div class="comment-info">
            <div class="comment-user">
              {{ comment.user_id }}
            </div>
            <div class="comment-time">
              {{ comment.time * 1000 | dayjs }}
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="empty-comment-preview" v-if="!loading && !imgList.length">
      <a-empty />
    </div>
  </div>
</template>

<script>

import { GetStudentResponse } from '@/api/lesson'
import { TemplatesGetPresentation, TemplatesGetPageThumbnail } from '@/api/template'

export default {
  name: 'PptCommentPreview',
  props: {
    slideId: {
      type: String,
      default: '1tfhTKkxPXsgfh_9mYZUVqHQn_1up1sAOln5PHiRXmj4'
    },
    classId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      loading: true,
      commentData: [],
      imgList: [],
      currentImgIndex: 0,
      currentPageId: null
    }
  },
  created () {
    this.$logger.info('PptCommentPreview' + this.slideId + ' classId ' + this.classId)
    this.loadData()
  },
  methods: {
    loadData () {
      Promise.all([
        GetStudentResponse({ class_id: this.classId }),
        TemplatesGetPresentation({ presentationId: this.slideId })
      ]).then(response => {
        this.$logger.info('PptCommentPreview loadData', response)
        const rawCommentDataList = response[0].data.presentation_comments
        rawCommentDataList.forEach((item) => {
          const data = JSON.parse(item.data)
          this.commentData.push({
            ...data,
            user_id: item.user_id
          })
        })

        const pageObjectIds = response[1].result.pageObjectIds
        if (pageObjectIds.length) {
          pageObjectIds.forEach(id => {
            TemplatesGetPageThumbnail({
              pageObjectId: id,
              presentationId: this.slideId,
              mimeType: 'SMALL'
            }).then(response => {
              this.imgList.push({
                pageId: id,
                imgUrl: response.result.contentUrl
              })
            }).finally(() => {
              this.$logger.info('current imgList.length ' + (this.imgList.length) + ' total:' + pageObjectIds.length)
              if (this.imgList.length === pageObjectIds.length) {
                this.currentPageId = this.imgList[this.currentImgIndex].pageId
                this.loading = false
              }
            })
          })
        } else {
          this.loading = false
          this.$logger.info('loaded data', this.imgList, this.commentData)
        }
      })
    },
    handleGotoImgIndex (index) {
      this.$logger.info('handleGotoImgIndex ' + index)
      this.currentImgIndex = index
      this.currentPageId = this.imgList[this.currentImgIndex].pageId
      this.$refs.carousel.goTo(index)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.ppt-comment-preview {
  display: flex;
  height: 400px;
  overflow-y: scroll;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  border: 1px solid #fafafa;

  .img-list-wrapper {
    display: flex;
    height: 400px;
    width: 150px;
    overflow-y: scroll;
    flex-direction: column;
    .img-list {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      .img-item {
        border: 1px solid #999;
        box-shadow: 0 4px 8px 0 rgba(31, 33, 44, 10%);
        margin: 10px 0;
        img {
          width: 100%;
        }
      }
    }
  }

  .ppt-preview {
    padding: 0 10px;
    box-sizing: border-box;
    height: 400px;
    width: 500px;

    .ant-carousel {

      /deep/ .slick-list {
        border: 1px solid #eee;
        box-shadow: 0 4px 8px 0 rgba(31, 33, 44, 10%);
      }

      /deep/ .slick-slide {
        text-align: center;
        height: 400px;
        line-height: 400px;
        overflow: hidden;
      }

      /deep/ .custom-slick-arrow {
        width: 25px;
        height: 25px;
        font-size: 25px;
        color: #fff;
        background-color: rgba(31, 45, 61, 0.81);
        opacity: 0.1;
        border-radius: 50%;
        transition: all 0.3s ease-in;
      }

      &:hover {
        /deep/ .custom-slick-arrow {
          opacity: 0.3;
        }
      }

      /deep/ .custom-slick-arrow:before {
        display: none;
      }

      /deep/ .custom-slick-arrow:hover {
        opacity: 0.3;
      }

      /deep/ .slick-slide h3 {
        color: #fff;
      }

      /deep/ .no-preview-img {
        padding: 20px;
        .description {
        }
      }

      /deep/ .preview-img-item {
        .preview-block {
          height: 400px;
          background-position: center;
          background-size: cover;
        }
      }
    }
  }

  .comment-detail {
    height: 400px;
    width: 200px;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    .comment-item {
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      border-bottom: 1px solid #fafafa;
      padding: 0 5px 10px 5px;

      .comment-content {
        padding: 5px 0;
        color: @text-color;
      }
      .comment-info {
        display: flex;
        width: 100%;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
        font-size: 13px;
        .comment-user {
          color: @text-color-secondary;
        }
        .comment-time {
          color: @text-color-secondary;
        }
      }
    }
  }
}

*::-webkit-scrollbar {
  width: 3px;
  height: 0;
}
*::-webkit-scrollbar-track {
  border-radius: 1px;
  background: rgba(0,0,0,0.00);
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
}
/* 滚动条滑块 */
*::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0,0,0,0.12);
  -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
}
</style>
