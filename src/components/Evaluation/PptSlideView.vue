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
      </a-space>
    </div>
    <div class="student-profile" v-if="!loading">
      <div class="student-info">
        <div class="student-name">Student :</div> {{ studentName }}
      </div>
      <div class="student-info">
        <div class="student-score">Score :</div> {{ studentScore }}/{{ totalScore }}
      </div>
    </div>
    <div class="tips" v-if="!loading">
      <h3>Multiple choice</h3>
    </div>
    <div class="slide-content-list" v-if="!loading">
      <div
        :class="{
          'slide-comment-item': true,
          'active-slide-item': selectedSlidePageIdList.indexOf(slideItem.pageObjectId) !== -1 || selectedStudentSlidePageIdList.indexOf(slideItem.pageObjectId) !== -1}"
        v-for="(slideItem, sIndex) in slideDataList"
        :key="sIndex"
        @click="handleAddSlideItem(slideItem)">
        <div class="slide-header-label">
          <h3>Slide {{ sIndex + 1 }}</h3>
        </div>
        <div class="slide-body">
          <div class="slide-img">
            <img :src="slideItem.contentUrl" :data-url="slideItem.contentUrl" @click="handleClickImg($event)">
            <div class="top-icon-groups">
              <a-col class="material-row" >
                <div class="icon-group" v-if="Object.keys(slideItem.material).length > 0">
                  <a-badge :count="slideItem.material['text'] ? slideItem.material['text'].length : 0" v-if="slideItem.material.hasOwnProperty('text')">
                    <div class="icon" @click="showPluginMaterial(slideItem,'text')">
                      <text-type-svg />
                      <div class="icon-text">Text</div>
                    </div>
                  </a-badge>
                  <a-badge :count="slideItem.material['image'] ? slideItem.material['image'].length : 0" v-if="slideItem.material.hasOwnProperty('image')">
                    <div class="icon" @click="showPluginMaterial(slideItem,'image')">
                      <image-type-svg />
                      <div class="icon-text">Image</div>
                    </div>
                  </a-badge>
                  <a-badge :count="slideItem.material['video'] ? slideItem.material['video'].length : 0" v-if="slideItem.material.hasOwnProperty('video')">
                    <div class="icon" @click="showPluginMaterial(slideItem,'video')">
                      <video-type-svg />
                      <div class="icon-text">Video</div>
                    </div>
                  </a-badge>
                  <a-badge :count="slideItem.material['audio'] ? slideItem.material['audio'].length : 0" v-if="slideItem.material.hasOwnProperty('audio')">
                    <div class="icon" @click="showPluginMaterial(slideItem,'audio')">
                      <audio-type-svg />
                      <div class="icon-text">Audio</div>
                    </div>
                  </a-badge>
                  <a-badge :count="slideItem.material['iframe'] ? slideItem.material['iframe'].length : 0" v-if="slideItem.material.hasOwnProperty('iframe')">
                    <div class="icon" @click="showPluginMaterial(slideItem,'iframe')">
                      <youtube-type-svg />
                      <div class="icon-text">Youtube</div>
                    </div>
                  </a-badge>
                  <a-badge :count="slideItem.material['pdf'] ? slideItem.material['pdf'].length : 0" v-if="slideItem.material.hasOwnProperty('pdf')" >
                    <div class="icon" @click="showPluginMaterial(slideItem,'pdf')">
                      <pdf-type-svg />
                      <div class="icon-text">PDF</div>
                    </div>
                  </a-badge>
                  <a-badge :count="slideItem.material['website'] ? slideItem.material['website'].length : 0" v-if="slideItem.material.hasOwnProperty('website')">
                    <div class="icon" @click="showPluginMaterial(slideItem,'website')">
                      <url-type-svg />
                      <div class="icon-text">Website</div>
                    </div>
                  </a-badge>
                </div>
              </a-col>
            </div>
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
            <div class="selected-icon">
              <div class="icon-item" v-if="selectedSlidePageIdList.indexOf(slideItem.pageObjectId) !== -1">
                <teacher-icon />
              </div>
              <div class="icon-item" v-if="selectedStudentSlidePageIdList.indexOf(slideItem.pageObjectId) !== -1">
                <student-icon />
              </div>
            </div>
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
            <template v-if="mode === EvaluationTableMode.TeacherEvaluate">
              <template v-if="(selectedSlidePageIdList.indexOf(slideItem.pageObjectId) !== -1)">
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
            </template>
            <template v-if="mode === EvaluationTableMode.StudentEvaluate">
              <template v-if="selectedStudentSlidePageIdList.indexOf(slideItem.pageObjectId) !== -1">
                <div class="action-btn-delete">
                  <div class="action-icon">
                    <img src="~@/assets/icons/evaluation/shanchu@2x.png" alt="">
                  </div>
                  <div class="text">
                    Delete
                  </div>
                </div>
              </template>
              <template v-if="selectedStudentSlidePageIdList.indexOf(slideItem.pageObjectId) === -1">
                <div class="action-btn-add">
                  <div class="action-icon">
                    <img src="~@/assets/icons/evaluation/tianjia@2x.png" alt="">
                  </div>
                  <div class="text">
                    Add
                  </div>
                </div>
              </template>
            </template>

          </div>
        </div>
      </div>
    </div>
    <div class="loading">
      <a-spin v-if="loading" />
    </div>

    <a-modal
      v-model="materialVisible"
      :footer="null"
      destroyOnClose
      width="800px"
      :zIndex="6000"
      title="My Materials"
      @ok="materialVisible = false"
      @cancel="materialVisible = false">
      <task-material-preview :current-page-element-lists="currentPageElementLists" :filter-type="filterMaterialType"></task-material-preview>
    </a-modal>

    <a-modal
      v-model="mediaVisible"
      :footer="null"
      destroyOnClose
      width="900px"
      :zIndex="5000"
      :title="null"
      @ok="mediaVisible = false"
      @cancel="mediaVisible = false">
      <media-preview :media-list="mediaList" :material-type="filterMaterialType"></media-preview>
    </a-modal>
  </div>
</template>

<script>

import { GetStudentResponse } from '@/api/lesson'
import { TemplatesGetPresentation } from '@/api/template'
import EvaluationTableMode from '@/components/Evaluation/EvaluationTableMode'
import StudentIcon from '@/assets/svgIcon/evaluation/StudentIcon.svg?inline'
import TeacherIcon from '@/assets/svgIcon/evaluation/TeacherIcon.svg?inline'
import { QueryByClassInfoSlideId } from '@/api/classroom'
import MediaPreview from '@/components/Task/MediaPreview'
import TaskMaterialPreview from '@/components/Task/TaskMaterialPreview'

import TextTypeSvg from '@/assets/icons/material/text.svg?inline'
import ImageTypeSvg from '@/assets/icons/material/image.svg?inline'
import VideoTypeSvg from '@/assets/icons/material/video.svg?inline'
import AudioTypeSvg from '@/assets/icons/material/audio.svg?inline'
import YoutubeTypeSvg from '@/assets/icons/material/youtube.svg?inline'
import PdfTypeSvg from '@/assets/icons/material/pdf.svg?inline'
import UrlTypeSvg from '@/assets/icons/material/url.svg?inline'

export default {
  name: 'PptSlideView',
  components: {
    StudentIcon,
    TeacherIcon,
    MediaPreview,
    TaskMaterialPreview,
    TextTypeSvg,
    ImageTypeSvg,
    VideoTypeSvg,
    AudioTypeSvg,
    YoutubeTypeSvg,
    PdfTypeSvg,
    UrlTypeSvg
  },
  props: {
    mode: {
      type: String,
      default: ''
    },
    slideId: {
      type: String,
      required: true
    },
    classId: {
      type: String,
      default: null
    },
    selectedIdList: {
      type: Array,
      default: () => []
    },
    selectedIdStudentList: {
      type: Array,
      default: () => []
    },
    studentName: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      loading: true,
      EvaluationTableMode: EvaluationTableMode,
      selectedSlidePageIdList: [],
      selectedStudentSlidePageIdList: [],
      rawSlideDataMap: new Map(),
      slideDataList: [],

      elementsList: [],
      itemsList: [],
      materialVisible: false,
      mediaVisible: false,
      filterMaterialType: null,
      currentPageElementLists: [],
      mediaList: []
    }
  },
  computed: {
    studentScore () {
      return 0
    },
    totalScore () {
      return 100
    }
  },
  created () {
    this.$logger.info('PptSlideView' + this.slideId + ' classId ' + this.classId, 'selectedIdList', this.selectedIdList, 'selectedIdStudentList', this.selectedIdStudentList)
    this.selectedSlidePageIdList = this.selectedIdList
    this.selectedStudentSlidePageIdList = this.selectedIdStudentList
    this.loadData()
  },
  methods: {
    loadData () {
      this.$logger.info('加载PPT数据 ' + this.classId + ' slideId ' + this.slideId)
      Promise.all([
        TemplatesGetPresentation({ presentationId: this.slideId }),
        QueryByClassInfoSlideId({ slideId: this.slideId })
      ]).then(response => {
        const pageObjects = response[0].result.pageObjects
        this.$logger.info('TemplatesGetPresentation response', response[0])
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

        if (response[1].success) {
          this.elementsList = response[1].result.relements
          this.itemsList = response[1].result.items
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
          const material = {}
          this.elementsList.forEach(e => {
            if (key === e.pageId) {
              const data = JSON.parse(e.data)
              // 把tip从material踢出去
              if (data.type !== 'tip') {
                if (!material.hasOwnProperty(data.type)) {
                  material[data.type] = []
                }
                material[data.type].push(data)
              }
            }
          })
          this.slideDataList.push({ ...value, pageId: key, material })
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

    showPluginMaterial (slideItem, type) {
      const data = slideItem.material[type]
      const pageId = slideItem.pageId
      this.$logger.info('showPluginMaterial ', slideItem, type)

      const pageElementsList = []
      if (this.slideDataList.length !== 0) {
        this.elementsList.forEach(e => {
          if (pageId === e.pageId) {
            const data = JSON.parse(e.data)
            pageElementsList.push(data)
          }
        })
      }
      this.currentPageElementLists = pageElementsList

      if (type === 'text' || type === 'website' || type === 'pdf') {
        if (data.length > 1) {
          this.filterMaterialType = type
          this.materialVisible = true
        } else {
          if (data[0].type !== 'tip') {
            window.open(data[0].url, '_blank')
          }
        }
      } else {
        this.mediaList = data
        this.filterMaterialType = type
        this.mediaVisible = true
      }
    },

    handleAddSlideItem (slideItem) {
      this.$logger.info('handleAddPageId', slideItem)
      if (this.mode === EvaluationTableMode.TeacherEvaluate) {
        const index = this.selectedSlidePageIdList.indexOf(slideItem.pageId)
        if (index !== -1) {
          this.selectedSlidePageIdList.splice(index, 1)
        } else {
          this.selectedSlidePageIdList.push(slideItem.pageId)
        }
      } else if (this.mode === EvaluationTableMode.StudentEvaluate) {
        const index = this.selectedStudentSlidePageIdList.indexOf(slideItem.pageId)
        if (index !== -1) {
          this.selectedStudentSlidePageIdList.splice(index, 1)
        } else {
          this.selectedStudentSlidePageIdList.push(slideItem.pageId)
        }
      }
    },

    handleClickImg (event) {
      this.$logger.info('handleClickImg', event)
      event.target.src = event.target.src + '#' + (new Date().getTime())
    },

    handleAddEvidenceClose () {
      this.$logger.info('handleAddEvidenceClose ' + this.mode, this.mode === EvaluationTableMode.TeacherEvaluate ? this.selectedSlidePageIdList : this.selectedStudentSlidePageIdList)
      this.$emit('add-evidence-finish', { mode: this.mode, data: this.mode === EvaluationTableMode.TeacherEvaluate ? this.selectedSlidePageIdList : this.selectedStudentSlidePageIdList })
    },

    handleEnsureEvidence () {
      this.$logger.info('handleEnsureEvidence ' + this.mode, this.mode === EvaluationTableMode.TeacherEvaluate ? this.selectedSlidePageIdList : this.selectedStudentSlidePageIdList)
      this.$emit('ensure-evidence-finish', { mode: this.mode, data: this.mode === EvaluationTableMode.TeacherEvaluate ? this.selectedSlidePageIdList : this.selectedStudentSlidePageIdList })
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
      width: 860px;
      display: flex;
      flex-direction: column;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border: 2px solid transparent;
      border-top: 2px solid rgba(21, 195, 154, 0.15);
      border-left: none;
      border-right: none;
      border-radius: 6px;
      margin-bottom: 25px;

      .slide-header-label {
        border-radius: 6px 6px 0 0;
        background-color: rgba(21, 195, 154, 0.15);
        padding: 5px 10px 7px 10px;
        h3 {
          margin: 0;
        }
      }

      .slide-body {
        display: flex;
        flex-direction: row;
        position: relative;
        .slide-img {
          box-sizing: border-box;
          padding: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #FAFAFA;
          border-radius: 4px;

          img {
            border-radius: 4px;
            width: 250px;
            min-height: 100px;
            border: 1px solid #DBDBDB;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          }
          .slide-material {
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
          }
        }

        .slide-response {
          padding: 10px;
          background: #FAFAFA;
          .data-list {
            min-height: 100px;
            background: #fff;
            width: 300px;
            max-height: 220px;
            overflow-y: scroll;
            overflow-x: hidden;

            &::-webkit-scrollbar {
              width: 5px;
              height: 5px;
            }
            &::-webkit-scrollbar-track {
              border-radius: 3px;
              background: rgba(0,0,0,0.00);
              -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
            }
            /* 滚动条滑块 */
            &::-webkit-scrollbar-thumb {
              border-radius: 5px;
              background: rgba(0,0,0,0.12);
              -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
            }

            .data-item {
              position: relative;
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
          position: relative;
          padding: 10px;
          background: #FFF;
          .data-list {
            min-height: 220px;
            background: #fff;
            width: 240px;
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
        height: 60px;
        padding-top: 10px;
      }
    }
  }
}

.selected-icon {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  right: -5px;
  top: -5px;
  .icon-item {
    margin-right: 5px;
    svg {
      width: 20px;
    }
  }
}

.student-profile {
  padding-bottom: 10px;
  .student-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    line-height: 25px;
    .student-name, .student-score {
      padding-right: 5px;
      font-weight: bold;
      font-family: Inter-Bold;
      font-size: 14px;
      color: #11142D;
    }
  }
}

.tips {
  margin-top: 10px;
  h3 {
    margin: 0;
  }
}

.top-icon-groups {
  position: relative;
  color: rgba(0, 0, 0, 0.65);
  background: #fff;
  height:70px;
  margin-top: 10px;
  width: 100%;
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
  .icon-group{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    flex-basis: auto;
    justify-content: flex-start;
    align-items: center;
    /deep/ .ant-badge-count{
      top:10px;
      right:12px;
    }
    .icon {
      width: 50px;
      height: 50px;
      margin:10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: #fafafa;
      display: flex;
      flex-direction: column;
      font-weight: bold;
      padding:2px;
      cursor: pointer;
      align-items: center;
      .icon-text {
        display: flex;
        font-size: 12px;
      }
      svg {
        display: flex;
        width: 32px;
        height: 32px;
      }
    }
  }

  .title-line {
    padding: 5px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .name {
      width: 70%;
      overflow-x: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      font-family: Inter-Bold;
      font-size: 15px;
      font-weight: bold;
      color: #182552;
      padding-right: 10px;
      box-sizing: border-box;
    }

    .action-item {
      display: flex;
      width: 30%;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;

      .star {
        img {
          width: 22px;
        }
      }

      .edit {
        margin-left: 15px;
        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          .edit-icon {
            padding-left: 5px;
            width: 18px;
          }
        }
      }
    }
  }
}

.material-row {
  height: 70px;
  display: flex;
  align-items: center;
}

.loading {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
