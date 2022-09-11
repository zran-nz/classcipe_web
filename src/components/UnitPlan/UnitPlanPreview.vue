<template>
  <div class="unit-plan-preview">
    <template v-if="loading">
      <a-skeleton active />
    </template>
    <template v-else>
      <a-row class="top-header" :gutter="[16,24]">
        <a-col span="24">
          <span class="title">
            {{ unitPlanData.name }}
          </span>
          <template v-if="lastChangeSavedTime">
            <a-divider type="vertical" />
            <span class="last-change-time">
              {{ $t('teacher.add-unit-plan.last-change-saved-at-time', {time: lastChangeSavedTime}) }}
            </span>
          </template>
        </a-col>
      </a-row>
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
          <div class="edit-item">
            <a-button type="primary">
              <router-link :to="'/teacher/unit-plan-redirect/' + unitPlanId">{{ $t('teacher.unit-plan-preview.edit') }}</router-link>
            </a-button>
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
              <div class="preview-block" :style="{backgroundImage: `url('${img}')` }" :data-img="img"></div>
            </div>
          </a-carousel>
        </a-col>
      </a-row>
      <a-row class="top-info" :gutter="[16, 24]" v-show="viewMode === 'Detail'">
        <a-col class="right-detail" span="24" >
          <div class="detail-wrapper">
            <div class="detail-block">
              <div class="block-title">
                {{ unitPlanData.scenario && unitPlanData.scenario.description }}
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
                <div class="content-list" v-if="unitPlanData.scenario && unitPlanData.scenario.sdgKeyWords">
                  <div class="content-item" v-for="(sdgKeyword,index) in unitPlanData.scenario.sdgKeyWords" :key="index">
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
                {{ unitPlanData.inquiry }}
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
                <div class="content-list" v-if="unitPlanData.questions && unitPlanData.questions.length">
                  <div class="content-item" v-for="(question,qIndex) in unitPlanData.questions" :key="qIndex">
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
      <a-divider v-if="showAssociate"/>
      <unit-plan-associate-preview :unit-plan-id="unitPlanId" v-if="showAssociate"/>
    </template>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'
import UnitPlanAssociatePreview from './UnitPlanAssociatePreview'

const { formatLocalUTC } = require('@/utils/util')
const { UnitPlanQueryById } = require('@/api/unitPlan')

export default {
  name: 'UnitPlanPreview',
  props: {
    unitPlanId: {
      type: String,
      default: null
    },
    showAssociate: {
      type: Boolean,
      default: false
    }
  },
  components: {
    UnitPlanAssociatePreview
  },
  computed: {
    lastChangeSavedTime () {
      if (this.unitPlanData) {
        logger.info('lastChangeSavedTime unitPlanData', this.unitPlanData)
        const time = this.unitPlanData.createTime || this.unitPlanData.updateTime
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
      unitPlanData: null,
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
    logger.info('UnitPlanPreview unitPlanId ' + this.unitPlanId)
    this.loadUnitPlanData()
  },
  methods: {
    loadUnitPlanData () {
      logger.info('loadUnitPlanData ' + this.unitPlanId)
      this.loading = true
      UnitPlanQueryById({
        id: this.unitPlanId
      }).then(response => {
        logger.info('UnitPlanQueryById ' + this.unitPlanId, response.result)
        this.unitPlanData = response.result
        if (this.unitPlanData && this.unitPlanData.image) {
          this.imgList = [this.unitPlanData.image]
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

  .top-header {
    position: relative;
    color: rgba(0, 0, 0, 0.65);
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    border-radius: 2px 2px 0 0;

    .title {
      font-weight: bold;
      width: 350px;
      overflow-x: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
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
}

/deep/ .right-button {
  border-radius: 0 16px 16px 0 ;
}

.action-header {
  margin: 30px 0 10px;
  .action-header-toggle {
    margin: auto;
    text-align: center;
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
