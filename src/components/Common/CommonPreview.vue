<template>
  <div class="unit-plan-preview">
    <template v-if="loading">
      <a-skeleton active />
    </template>
    <template v-else>
      <a-row class="action-header">
        <a-col span="24" class="action-header-toggle">
          <a-radio-group v-model="viewMode" button-style="solid" @change="handleViewModeChange">
            <a-radio-button value="Detail" class="left-button">
              Detail
            </a-radio-button>
            <a-radio-button value="Preview" class="right-button">
              Preview
            </a-radio-button>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-row class="top-header">
        <a-col span="24">
          <div class="title-line">
            <div class="name">
              {{ data.name }}
            </div>
            <div class="action-item">
              <div class="star">
                <img src="~@/assets/icons/common/preview/star_gray.png" @click="handleFavorite(data)" v-if="!isFavorite"/>
                <img src="~@/assets/icons/common/preview/star_yellow.png" @click="handleFavorite(data)" v-if="isFavorite"/>
              </div>
              <div class="edit" >
                <a-button type="primary" shape="round" @click="handleEditItem(data)">
                  <div class="button-content" >
                    Edit <img class="edit-icon" src="~@/assets/icons/common/preview/edit_white.png" />
                  </div>
                </a-button>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row class="author-info">
        <a-col span="3" class="avatar-icon">
          <img src="~@/assets/icons/library/default-avatar.png" />
        </a-col>
        <a-col span="21">
          <div class="sub-info">
            <div class="created-by">
              {{ data.createBy }}
            </div>
            <div class="created-time">
              <template v-if="lastChangeSavedTime">
                {{ lastChangeSavedTime }}
              </template>
            </div>
          </div>
          <div class="star-info">
            <a-tooltip placement="right">
              <template slot="title">
                10 people gave a score of 5 stars
              </template>
              <a-rate :default-value="5" allow-half disabled/>
            </a-tooltip>
          </div>
        </a-col>
      </a-row>
      <a-row class="data-info" v-show="viewMode === 'Detail'">
        <a-col class="right-detail" span="24" >
          <div class="detail-wrapper">
            <div class="detail-block" v-if="data && data.scenario">
              <div class="block-title">
                {{ data.scenario && data.scenario.description }}
              </div>
              <div class="scenario-block-content">
                <div class="content-list" v-if="data.scenario && data.scenario.sdgKeyWords">
                  <div class="content-item" v-for="(sdgKeyword,index) in data.scenario.sdgKeyWords" :key="index">
                    <div class="question">
                      {{ sdgKeyword.sdgName }}
                    </div>
                    <div class="tags">
                      <div class="tag-item" v-for="(tag,tagIndex) in sdgKeyword.keywords" :key="tagIndex">
                        <a-tag class="tag">
                          {{ tag.name }}
                        </a-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="detail-block" v-if="data && data.questions && data.questions.length">
              <div class="block-title" v-if="data.inquiry">
                {{ data.inquiry }}
              </div>
              <div class="keyword-block-content">
                <div class="content-list" v-if="data.questions && data.questions.length">
                  <div class="content-item" v-for="(question,qIndex) in data.questions" :key="qIndex">
                    <div class="question" v-if="question.name">
                      {{ question.name }}
                    </div>
                    <div class="content-sub-list">
                      <div class="content-sub-item" v-for="(knowledgeTag, kIndex) in question.knowledgeTags" :key="kIndex">
                        <div class="sub-title">
                          <div class="sub-title-name">
                            {{ knowledgeTag.description }}
                            <div class="subject-name" v-if="knowledgeTag.subSubjectName">
                              {{ knowledgeTag.subSubjectName }}
                            </div>
                          </div>
                          <div class="sub-detail">
                            <a-tag class="tag">
                              {{ knowledgeTag.name }}
                            </a-tag>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="content-sub-list">
                      <div class="content-sub-item" v-for="(skillTag, sIndex) in question.skillTags" :key="sIndex">
                        <div class="sub-title">
                          <div class="sub-title-name">
                            {{ skillTag.description }}
                          </div>
                          <div class="sub-detail">
                            <a-tag class="tag">
                              {{ skillTag.name }}
                            </a-tag>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="detail-block" v-if="data && data.overview">
              <div class="block-title">
                Overview
              </div>
              <div class="overview-block">
                <div class="view-text">
                  {{ data.overview }}
                </div>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row class="data-info" :gutter="[16,24]" v-show="viewMode === 'Preview'">
        <a-col class="left-preview" span="24">
          <a-carousel arrows>
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
            <div v-if="!loading && !imgList.length" class="no-preview-img">
              <a-empty>
                <!--                <span slot="description"></span>-->
              </a-empty>
            </div>
            <div class="preview-img-item" v-for="(img,index) in imgList" :key="index">
              <div class="preview-block" :style="{backgroundImage: 'url(' + img + ')' }" :data-img="img"></div>
            </div>
          </a-carousel>
        </a-col>
      </a-row>
      <div class="associate-info" v-if="type === typeMap['unit-plan'] || type === typeMap.topic">
        <common-associate-preview :id="id" :content-type="type"/>
      </div>
    </template>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'
import NoMoreResources from '@/components/Common/NoMoreResources'
import CommonAssociatePreview from '@/components/Common/CommonAssociatePreview'

const { formatLocalUTC } = require('@/utils/util')
const { UnitPlanQueryById } = require('@/api/unitPlan')
const { LessonQueryById } = require('@/api/myLesson')
const { TaskQueryById } = require('@/api/task')
const { EvaluationQueryById } = require('@/api/evaluation')
const { FavoritesAdd } = require('@/api/favorites')
const { TopicQueryById } = require('@/api/topic')

export default {
  name: 'CommonPreview',
  components: { CommonAssociatePreview, NoMoreResources },
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: Number,
      required: true
    }
  },
  computed: {
    lastChangeSavedTime () {
      if (this.data) {
        logger.info('lastChangeSavedTime data', this.data)
        const time = this.data.createTime || this.data.updateTime
        if (time) {
          return formatLocalUTC(time)
        }
      }
      return ''
    }
  },
  mounted () {
  },
  data () {
    return {
      loading: true,
      data: null,
      imgList: [],
      viewMode: 'Detail',
      isFavorite: false,

      tagColorList: [
        'pink',
        'orange',
        'green',
        'cyan',
        'blue',
        'red',
        'purple'
      ],
      activeContentType: -1,
      typeMap: typeMap,

      subPreviewVisible: false
    }
  },
  created () {
    logger.info('CommonPreview id ' + this.id + ' type ' + this.type)
    this.loadData()
  },
  methods: {
    loadData () {
      logger.info('loadData ' + this.id + ' type ' + this.type)
      this.loading = true
      if (this.type === this.typeMap['unit-plan']) {
        UnitPlanQueryById({
          id: this.id
        }).then(response => {
          logger.info('UnitPlanQueryById ' + this.id, response.result)
          this.data = response.result
          if (this.data && this.data.image) {
            this.imgList = [this.data.image]
          }
        }).finally(() => {
          this.loading = false
        })
      } else if (this.type === this.typeMap.task) {
        TaskQueryById({
          id: this.id
        }).then(response => {
          logger.info('TaskQueryById ' + this.id, response.result)
          this.data = response.result
          if (this.data && this.data.image) {
            this.imgList = [this.data.image]
          }
        }).finally(() => {
          this.loading = false
        })
      } else if (this.type === this.typeMap.lesson) {
        LessonQueryById({
          id: this.id
        }).then(response => {
          logger.info('LessonQueryById ' + this.id, response.result)
          this.data = response.result
          this.data.questions = [response.result.suggestingTag]
          if (this.data && this.data.image) {
            this.imgList = [this.data.image]
          }
        }).finally(() => {
          this.loading = false
        })
      } else if (this.type === this.typeMap.evaluation) {
        EvaluationQueryById({
          id: this.id
        }).then(response => {
          logger.info('EvaluationQueryById ' + this.id, response.result)
          this.data = response.result
          if (this.data && this.data.image) {
            this.imgList = [this.data.image]
          }
        }).finally(() => {
          this.loading = false
        })
      } else if (this.type === this.typeMap.topic) {
        TopicQueryById({
          id: this.id
        }).then(response => {
          logger.info('TopicQueryById ' + this.id, response.result)
          this.data = response.result
          if (this.data && this.data.image) {
            this.imgList = [this.data.image]
          }
        }).finally(() => {
          this.loading = false
        })
      }
    },

    handleSelectContentType (contentType) {
      logger.info('handleSelectContentType ' + contentType)
      this.activeContentType = contentType
    },

    handleSubPreviewClose () {
      logger.info('handleSubPreviewClose')
      this.subPreviewVisible = false
    },

    handleViewModeChange () {
      this.$logger.info('handleViewModeChange ' + this.viewMode)
    },
    handleFavorite (item) {
      logger.info('handleFavorite', item)
      FavoritesAdd({
        sourceId: item.id,
        sourceType: item.type
      }).then(response => {
        logger.info('FavoritesAdd ', response)
        item.isFavorite = !item.isFavorite
        this.isFavorite = true
      })
    },
    handleEditItem (item) {
      item.type = this.type
      logger.info('handleEditItem', item)
      if (item.type === typeMap['unit-plan']) {
        window.open('/teacher/unit-plan-redirect/' + item.id
          , '_blank')
      } else if (item.type === typeMap['topic']) {
        window.open('/expert/topic-redirect/' + item.id
          , '_blank')
      } else if (item.type === typeMap['material']) {
        window.open('/teacher/add-material/' + item.id
          , '_blank')
      } else if (item.type === typeMap.task) {
        window.open('/teacher/task-redirect/' + item.id
          , '_blank')
      } else if (item.type === typeMap.lesson) {
        window.open('/teacher/lesson-redirect/' + item.id
          , '_blank')
      } else if (item.type === typeMap.evaluation) {
        window.open('/teacher/evaluation-redirect/' + item.id
          , '_blank')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.unit-plan-preview {
  padding: 20px 16px;

  .top-header {
    position: relative;
    color: rgba(0, 0, 0, 0.65);
    background: #fff;

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

    .last-change-time {
      font-size: 12px;
      color: @text-color-secondary;
    }
  }

  .author-info {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    .avatar-icon {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      img {
        width: 80%;
      }
    }
    .sub-info {
      padding-left: 5px;
    }
    .sub-info {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      .created-by {
        padding-right: 10px;
        font-size: 13px;
        font-weight: 500;
        font-family: Inter-Bold;
        color: #182552;
      }

      .created-time {
        font-family: Inter-Bold;
        font-size: 10px;
        color: #000000;
        opacity: 0.5;
      }
    }
    .star-info {
      ul {
        margin-bottom: 0;
      }
    }
  }

  .data-info {
    margin-top: 10px;
    min-height: 100px;
    padding: 5px;
    background: rgba(253, 238, 218, 0.5);
    border: 1px solid #D8D8D8;
    opacity: 1;
    border-radius: 5px;
  }

  .left-preview {
    height: 100%;

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

    .edit-action {
      margin-top: 20px;
    }
  }

  .right-detail {
    .detail-wrapper {
      .detail-block {

        .block-title {
          font-weight: 500;
          font-size: 16px;
          padding: 10px 15px;
          font-family: Inter-Bold;
          color: #000000;
        }

        .scenario-block-content {
          padding: 5px 10px;
          .content-list {
            display: flex;
            flex-direction: column;

            .content-item {
              margin-bottom: 10px;
              background: #fff;
              padding: 10px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-around;
              .question {
                font-size: 14px;
                font-weight: 500;
                padding-right: 15px;
              }
              .tags {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;

                .tag-label {
                  font-weight: bold;
                  padding-right: 10px;
                }

                .tag-item {
                  font-size: 16px;
                  margin-right: 5px;
                  margin-bottom: 5px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-break: break-all;
                  white-space: nowrap;
                  .tag {
                    background: rgba(255, 187, 0, 0.1);
                    border: 1px solid #FFBB00;
                    border-radius: 20px;
                    font-family: Inter-Bold;
                    color: #FFBB00;
                  }
                }
              }

              .content-sub-list {
                padding: 5px 0;
                background-color: #f9f9f9;
                margin-bottom: 10px;
                .subject-name {
                  cursor: pointer;
                  color: @primary-color;
                  padding: 0 10px;
                  line-height: 30px;
                  border-radius: 30px;
                  margin: 0 10px;
                  background-color: fade(@outline-color, 20%);
                }
              }
            }
          }
        }

        .keyword-block-content {
          padding: 5px 10px;
          .content-list {
            display: flex;
            flex-direction: column;

            .content-item {
              margin-bottom: 10px;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: space-around;
              .question {
                width: 100%;
                font-size: 14px;
                font-weight: 500;
                padding: 10px 10px;
                background: rgba(255, 187, 0, 0.1);
                color: rgba(255, 187, 0, 1);
                margin-bottom: 10px;
              }
              .tags {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;

                .tag-label {
                  font-weight: bold;
                  padding-right: 10px;
                }

                .tag-item {
                  font-size: 16px;
                  margin-right: 5px;
                  margin-bottom: 5px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-break: break-all;
                  white-space: nowrap;
                  .tag {
                    background: rgba(255, 187, 0, 0.1);
                    border: 1px solid #FFBB00;
                    border-radius: 20px;
                    font-family: Inter-Bold;
                    color: #FFBB00;
                  }
                }
              }

              .content-sub-list {
                padding: 5px 0;
                margin-bottom: 10px;
                width: 100%;
                .content-sub-item {
                  background: #fff;
                  margin-bottom: 10px;
                  .sub-title {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px;
                    .sub-title-name {
                      padding-right: 15px;
                      font-weight: 500;
                      display: inline-block;
                      .subject-name {
                        display: inline-block;
                        cursor: pointer;
                        color: @primary-color;
                        padding: 0 8px;
                        line-height: 20px;
                        border-radius: 20px;
                        margin: 0 5px;
                        background-color: fade(@outline-color, 20%);
                      }
                    }
                  }
                }

                .tag {
                  background: rgba(255, 187, 0, 0.1);
                  border: 1px solid #FFBB00;
                  border-radius: 20px;
                  font-family: Inter-Bold;
                  color: #FFBB00;
                }
              }
            }
          }
        }

        .overview-block {
          padding: 10px;
          margin-bottom: 10px;
          .view-text {
            padding: 10px;
            background: #fff;
            color: #000;
            font-family: Inter-Bold;
            font-weight: 500;
          }
        }
      }
    }
  }
  .bottom-relative {

    .type-button {
      width: 100px;
    }

    /deep/ .left-button {
      border-radius: 16px 0 0 16px;
    }

    /deep/ .right-button {
      border-radius: 0 16px 16px 0 ;
    }
  }
}

/deep/ .left-button {
  border-radius: 16px 0 0 16px;
  font-family: Inter-Bold;
  color: #11142D;
}

/deep/ .right-button {
  border-radius: 0 16px 16px 0 ;
  background: rgba(228, 228, 228, 1);
  font-size: 14px;
  font-family: Inter-Bold;
  color: #11142D;
  opacity: 1;
}

.action-header {
  padding: 10px 0;
  .action-header-toggle {
    position: relative;
    .edit-item {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}

.edit-action {
  text-align: right;
}

</style>
