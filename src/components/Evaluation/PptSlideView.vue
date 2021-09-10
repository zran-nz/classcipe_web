<template>
  <div class="ppt-slide-view">
    <div class="go-session-detail">
      <div class="view-back" @click="handleAddEvidenceClose">
        <div class="back-icon">
          <img src="~@/assets/icons/common/back.png" />
        </div>
      </div>
      <a-space>
        <a-button shape="round" type="primary" @click="handleEnsureEvidence">Ensure</a-button>
        <a-button shape="round" type="primary">Session details</a-button>
      </a-space>
    </div>
    <div class="slide-header">
      <div class="slide-header-item">Slide</div>
      <div class="slide-header-item">Response</div>
      <div class="slide-header-item">Comments/Score</div>
    </div>
    <div class="slide-content-list" v-if="!loading">
      <div :class="{'slide-comment-item': true, 'active-slide-item': selectedSlidePageIdList.indexOf(slideItem.pageObjectId) !== -1}" v-for="(slideItem, sIndex) in slideDataList" :key="sIndex" @click="handleAddSlideItem(slideItem)">
        <div class="slide-img">
          <img :src="slideItem.contentUrl" :data-url="slideItem.contentUrl" @click="handleClickImg($event)">
        </div>
        <div class="slide-response">
          <div class="data-list">
            <div class="data-item" v-for="(data, rIndex) in slideItem.responseList" :key="rIndex">
              <template v-if="data.responseData.type === 'media'">
                <template v-if="data.responseData.content.mediaType === 'audio'">
                  <audio :src="data.responseData.content.link" controls />
                </template>
              </template>
              <template v-if="data.responseData.type === 'audio'">
                <audio :src="data.responseData.content.link" controls />
              </template>
              <template v-if="data.responseData.type === 'draw'">
                <img :src="data.responseData.content" />
              </template>
              <template v-if="data.responseData.type === 'text'">
                <div class="text">
                  {{ data.responseData.content }}
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="slide-comment">
          <div class="data-list">
            <div class="data-item" v-for="(data, rIndex) in slideItem.commentList" :key="rIndex">
              <template v-if="data.type === 'audio'">
                <audio :src="data.link" controls />
              </template>
              <template v-if="data.type === 'video'">
                <video :src="data.link" controls/>
              </template>
            </div>
          </div>
        </div>
        <div class="action-item">
          <template v-if="selectedSlidePageIdList.indexOf(slideItem.pageObjectId) !== -1">
            <div class="action-btn-delete">
              <div class="action-icon">
                <img src="~@/assets/icons/evaluation/shanchu@2x.png" alt="">
              </div>
              <div class="text">
                Delete
              </div>
            </div>
          </template>
          <template v-if="selectedSlidePageIdList.indexOf(slideItem.pageObjectId) === -1">
            <div class="action-btn-add">
              <div class="action-icon">
                <img src="~@/assets/icons/evaluation/tianjia@2x.png" alt="">
              </div>
              <div class="text">
                Add
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="loading">
      <a-spin v-if="loading" />
    </div>
  </div>
</template>

<script>

import { GetStudentResponse } from '@/api/lesson'
import { TemplatesGetPresentation } from '@/api/template'

export default {
  name: 'PptSlideView',
  props: {
    mode: {
      type: String,
      default: 'view' // view或者add-evidence
    },
    slideId: {
      type: String,
      default: '1tfhTKkxPXsgfh_9mYZUVqHQn_1up1sAOln5PHiRXmj4'
    },
    classId: {
      type: String,
      default: null
    },
    selectedIdList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      loading: true,
      selectedSlidePageIdList: [],
      rawSlideDataMap: new Map(),
      slideDataList: []
    }
  },
  created () {
    this.$logger.info('PptSlideView' + this.slideId + ' classId ' + this.classId)
    this.selectedSlidePageIdList = this.selectedIdList
    this.loadData()
  },
  methods: {
    loadData () {
      this.$logger.info('TemplatesGetPresentation')
      TemplatesGetPresentation({ presentationId: this.slideId }).then(response => {
        const pageObjects = response.result.pageObjects
        this.$logger.info('TemplatesGetPresentation response', response)
        if (pageObjects.length) {
          pageObjects.forEach(pItem => {
            pItem.responseList = []
            pItem.commentList = []
            if (pItem.pageObjectId) {
              this.rawSlideDataMap.set(pItem.pageObjectId, pItem)
            }
          })
          this.loadStudentData()
        } else {
          this.loading = false
          this.$logger.info('loaded data', this.imgList, this.commentData)
        }
      })
    },

    loadStudentData () {
      this.$logger.info('loadStudentData')
      GetStudentResponse({ class_id: this.classId }).then(response => {
        this.$logger.info('GetStudentResponse response', response)
        const rawCommentDataList = response.data.presentation_comments
        rawCommentDataList.forEach((item) => {
          const data = JSON.parse(item.data)
          const pageId = data.page_id
          const slideItem = this.rawSlideDataMap.get(pageId)
          if (slideItem) {
            this.$logger.info('find slideItem comment' + data.page_id, data)
            slideItem.commentList.push({ ...data, user_id: item.user_id })
            this.rawSlideDataMap.set(pageId, slideItem)
          } else {
            // this.$logger.info('commentList no get slideIem by pageId ' + pageId)
          }
        })
        const rawResponseData = response.data.response
        rawResponseData.forEach((item) => {
          const responseData = JSON.parse(item.response_data)
          const itemData = JSON.parse(item.item_data)
          const responseType = item.response_type
          const studentUserId = item.student_user_id
          const pageId = responseData.page_id
          const slideItem = this.rawSlideDataMap.get(pageId)
          if (slideItem) {
            this.$logger.info('find slideItem response ' + responseData.page_id, responseData)
            slideItem.responseList.push({ responseData, itemData, responseType, studentUserId })
            this.rawSlideDataMap.set(pageId, slideItem)
          } else {
            // this.$logger.info('responseList no get slideIem by pageId ' + pageId)
          }
        })

        for (const [key, value] of this.rawSlideDataMap) {
          this.slideDataList.push({ ...value, pageId: key })
          if (value.commentList.length) {
            this.$logger.info('commentList have data' + JSON.stringify(value))
          }

          if (value.responseList.length) {
            this.$logger.info('responseList have data' + JSON.stringify(value))
          }
        }
        this.$logger.info('slideDataList', this.slideDataList)
      }).finally(() => {
        this.loading = false
      })
    },

    handleAddSlideItem (slideItem) {
      this.$logger.info('handleAddPageId', slideItem)
      const index = this.selectedSlidePageIdList.indexOf(slideItem.pageId)
      if (index !== -1) {
        this.selectedSlidePageIdList.splice(index, 1)
      } else {
        this.selectedSlidePageIdList.push(slideItem.pageId)
      }
    },

    handleClickImg (event) {
      this.$logger.info('handleClickImg', event)
      event.target.src = event.target.src + '#' + (new Date().getTime())
    },

    handleAddEvidenceClose () {
      this.$logger.info('handleAddEvidenceClose')
      this.$emit('add-evidence-finish', { data: this.selectedSlidePageIdList })
    },

    handleEnsureEvidence () {
      this.$logger.info('handleEnsureEvidence', this.selectedSlidePageIdList)
      this.$emit('ensure-evidence-finish', { data: this.selectedSlidePageIdList })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.ppt-slide-view {
  .slide-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;

    .slide-header-item {
      width: 220px;
      background: rgba(228, 228, 228, 0.2);
      border: 1px solid #D8D8D8;
      padding: 6px 15px;
      text-align: center;
      box-sizing: border-box;
      font-family: Inter-Bold;
      line-height: 24px;
      color: #11142D;
      font-size: 12px;
    }
  }

  .slide-content-list {
    display: flex;
    flex-direction: column;
    .slide-comment-item {
      width: 660px;
      display: flex;
      flex-direction: row;
      align-items: center;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border: 2px solid #FAFAFA;
      border-radius: 6px;
      margin-bottom: 15px;

      .slide-img {
        box-sizing: border-box;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #FAFAFA;
        border-radius: 4px;
        img {
          border-radius: 4px;
          width: 190px;
          min-height: 100px;
          border: 1px solid #DBDBDB;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        }
      }

      .slide-response {
        padding: 10px;
        background: #FAFAFA;
        .data-list {
          min-height: 100px;
          background: #fff;
          width: 200px;
          .data-item {
            padding: 5px;
            width: 200px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border-radius: 4px;

            audio {
              height: 30px;
              border: none;
              outline: none;
              width: 180px;
            }

            img {
              width: 180px;
            }

            .text {
              font-family: Inter-Bold;
              line-height: 24px;
              color: #11142D;
              font-size: 12px;
              padding: 10px;
            }
          }
        }
      }

      .slide-comment {
        padding: 10px;
        background: #FFF;
        .data-list {
          min-height: 100px;
          background: #fff;
          width: 200px;
          .data-item {
            padding: 5px;
            width: 180px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border-radius: 4px;

            audio {
              box-sizing: border-box;
              height: 30px;
              border: none;
              outline: none;
              width: 180px;
            }

            video {
              box-sizing: border-box;
              width: 180px;
              border: none;
              outline: none;
            }

            img {
              width: 180px;
            }

            .text {
              font-family: Inter-Bold;
              line-height: 24px;
              color: #11142D;
              font-size: 12px;
              padding: 10px;
            }
          }
        }
      }

      .action-item {
        margin-left: 30px;

        .action-btn-add {
          width: 80px;
          justify-content: center;
          display: flex;
          flex-direction: row;
          border-radius: 5px;
          align-items: center;
          padding: 6px 8px;
          cursor: pointer;
          user-select: none;
          border: 1px solid rgba(21, 195, 154, 1);
          background: rgba(21, 195, 154, 0.1);

          .action-icon {
            img {
              height: 15px;
            }
          }

          .text {
            padding-left: 5px;
          }
        }

        .action-btn-delete {
          width: 80px;
          justify-content: center;
          display: flex;
          border-radius: 3px;
          cursor: pointer;
          user-select: none;
          flex-direction: row;
          align-items: center;
          padding: 6px 8px;
          border: 1px solid rgba(239, 78, 78, 1);
          background: rgba(239, 78, 78, 0.1);

          .action-icon {
            img {
              height: 15px;
            }
          }

          .text {
            padding-left: 5px;
          }
        }
      }
    }

    .active-slide-item {
      border: 2px solid #15C39A;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    }
  }
}

.go-session-detail {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;

  .view-back {
    cursor: pointer;
    margin-right: 10px;
    .back-icon {
      img {
        height: 50px;
      }
    }
  }
}

</style>
