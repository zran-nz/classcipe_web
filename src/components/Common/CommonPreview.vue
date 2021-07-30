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
                <img src="~@/assets/icons/common/preview/star_gray.png" />
              </div>
              <div class="edit" >
                <a-button type="primary" shape="round">
                  <div class="button-content">
                    Edit <img class="edit-icon" src="~@/assets/icons/common/preview/edit_white.png" />
                  </div>
                </a-button>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col span="3">
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
        </a-col>
      </a-row>
      <a-row class="top-info" :gutter="[16,24]" v-show="viewMode === 'Preview'">
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
      <a-row class="top-info" :gutter="[16, 24]" v-show="viewMode === 'Detail'">
        <a-col class="right-detail" span="24" >
          <div class="detail-wrapper">
            <div class="detail-block">
              <div class="block-title">
                {{ data.scenario && data.scenario.description }}
                <span class="title-icon">
                  <a-tooltip>
                    <template slot="title">
                      {{ $t('teacher.unit-plan-preview.scenario-description') }}
                    </template>
                    <a-icon type="info-circle" />
                  </a-tooltip>
                </span>
              </div>
              <div class="block-content">
                <div class="content-list" v-if="data.scenario && data.scenario.sdgKeyWords">
                  <div class="content-item" v-for="(sdgKeyword,index) in data.scenario.sdgKeyWords" :key="index">
                    <div class="question">
                      {{ index + 1 }}、{{ sdgKeyword.sdgName }}
                    </div>
                    <div class="tags">
                      <div class="tag-item" v-for="(tag,tagIndex) in sdgKeyword.keywords" :key="tagIndex">
                        <a-tag :color="tagColorList[tagIndex % tagColorList.length]">
                          {{ tag.name }}
                        </a-tag>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="content-list" v-else>
                  <a-empty />
                </div>
              </div>
            </div>
            <div class="detail-block">
              <div class="block-title">
                {{ data.inquiry }}
                <span class="title-icon">
                  <a-tooltip>
                    <template slot="title">
                      {{ $t('teacher.unit-plan-preview.direction-of-inquiry') }}
                    </template>
                    <a-icon type="info-circle" />
                  </a-tooltip>
                </span>
              </div>
              <div class="block-content">
                <div class="content-list" v-if="data.questions && data.questions.length">
                  <div class="content-item" v-for="(question,qIndex) in data.questions" :key="qIndex">
                    <div class="question">
                      {{ question.name }}
                    </div>
                    <div class="content-sub-list">
                      <div class="content-sub-item" v-for="(knowledgeTag, kIndex) in question.knowledgeTags" :key="kIndex">
                        <div class="sub-title">
                          {{ qIndex + 1 }}.{{ kIndex + 1 }}、{{ knowledgeTag.description }}
                          <span class="subject-name" v-if="knowledgeTag.subSubjectName">{{ knowledgeTag.subSubjectName }}</span>
                          <a-tag :color="tagColorList[kIndex % tagColorList.length]">
                            {{ knowledgeTag.name }}
                          </a-tag>
                        </div>
                      </div>
                    </div>
                    <div class="content-sub-list">
                      <div class="content-sub-item" v-for="(skillTag, sIndex) in question.skillTags" :key="sIndex">
                        <div class="sub-title">
                          {{ qIndex + 1 }}.{{ sIndex + 1 }}、{{ skillTag.description }}
                          <a-tag :color="tagColorList[sIndex % tagColorList.length]">
                            {{ skillTag.name }}
                          </a-tag>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="content-list" v-else>
                  <a-empty />
                </div>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </template>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'

const { formatLocalUTC } = require('@/utils/util')
const { UnitPlanQueryById } = require('@/api/unitPlan')
const { LessonQueryById } = require('@/api/myLesson')
const { TaskQueryById } = require('@/api/task')
const { EvaluationQueryById } = require('@/api/evaluation')

export default {
  name: 'CommonPreview',
  props: {
    id: {
      type: String,
      default: null
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
    this.loadUnitPlanData()
  },
  methods: {
    loadUnitPlanData () {
      logger.info('loadUnitPlanData ' + this.id)
      this.loading = true
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
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
      }

      .action-item {
        display: flex;
        flex-direction: row;
        align-items: center;

        .star {
          img {
            width: 22px;
          }
        }

        .edit {
          margin-left: 10px;
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

  .top-info {
    padding: 20px 0 0 0;
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
        margin-bottom: 10px;
        border: 1px solid #f3f3f3;

        .block-title {
          font-weight: 700;
          font-size: 16px;
          padding: 10px;
          background-color: #fafafa;
          .title-icon {
            font-size: 14px;
            font-weight: normal;
            color: @text-color-secondary;
          }
        }

        .block-content {
          padding: 10px;
          .content-list {
            .content-item {
              margin-bottom: 10px;
              .question {
                padding-bottom: 5px;
                font-size: 14px;
                font-weight: 500;
              }
              .tags {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                padding-bottom: 10px;

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
