<template>
  <div class="task-preview">
    <template v-if="loading">
      <a-skeleton active />
    </template>
    <template v-else>
      <a-row class="top-header" :gutter="[16,24]">
        <a-col span="24">
          <span class="title">
            {{ task.name }}
          </span>
          <template v-if="task && (task.updateTime || task.createTime)">
            <a-divider type="vertical" />
            <span class="last-change-time">
              {{ (task.updateTime | task.createTime) | dayjs }}
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
          <div class="edit-item" v-if="canEdit">
            <a-button type="primary">
              <router-link :to="'/teacher/task-redirect/' + taskId">{{ $t('teacher.unit-plan-preview.edit') }}</router-link>
            </a-button>
          </div>
        </a-col>
      </a-row>

      <a-row class="top-info" :gutter="[16,24]" v-show="viewMode === 'Preview'">
        <a-spin v-show="slideLoading" class="spin-loading"/>
        <a-col span="24">
          <div v-if="!loading && !imgList.length" class="no-preview-img">
            <a-empty>
            </a-empty>
          </div>
        </a-col>
        <a-col class="left-preview" span="19">
          <a-carousel ref="carousel" v-if="!loading && imgList.length">
            <a slot="customPaging">
            </a>
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
              <div class="preview-block" :style="{backgroundImage: `url('${img}')` }" :data-img="img"></div>
            </div>
          </a-carousel>
          <div class="img-text-info">
            <span class="page" v-if="imgList.length">{{ (currentImgIndex + 1) }} / {{ imgList.length }}</span>
            <span class="label" v-if="task && task.presentationId">
              <a target="_blank" :href="'https://docs.google.com/presentation/d/' + task.presentationId">Edit</a>
            </span>
          </div>
        </a-col>
        <a-col span="5">
          <div class="img-list-wrapper">
            <div class="img-list">
              <div class="img-item" v-for="(img,index) in imgList" :key="index" @click="handleGotoImgIndex(index)">
                <img :src="img" />
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-row class="top-info" :gutter="[16,24]" v-show="viewMode === 'Detail'">
        <a-col class="right-detail" span="24">
          <div class="detail-wrapper">
            <div class="detail-block">
              <div class="block-title">
                {{ task.overview }}
                <span class="title-icon">
                  <a-tooltip>
                    <template slot="title">
                      Overview
                    </template>
                    <a-icon type="info-circle" />
                  </a-tooltip>
                </span>
              </div>
              <div class="block-title" v-if="task.audioUrl">
                <audio :src="task.audioUrl" controls />
              </div>
              <div class="block-content">
                <div class="content-list" v-if="task.suggestingTag">
                  <div class="label">
                    knowledge Tags
                  </div>
                  <div class="content-sub-list">
                    <div class="content-sub-item" v-for="(knowledgeTag, kIndex) in task.suggestingTag.knowledgeTags" :key="kIndex">
                      <div class="sub-title">
                        {{ kIndex + 1 }}、{{ knowledgeTag.description }}
                        <span class="subject-name">{{ knowledgeTag.subSubjectName }}</span>
                        <a-tag :color="tagColorList[kIndex % tagColorList.length]">
                          {{ knowledgeTag.name }}
                        </a-tag>
                      </div>
                    </div>
                  </div>
                  <div class="label">
                    skill Tags
                  </div>
                  <div class="content-sub-list">
                    <div class="content-sub-item" v-for="(skillTag, sIndex) in task.suggestingTag.skillTags" :key="sIndex">
                      <div class="sub-title">
                        {{ sIndex + 1 }}、{{ skillTag.description }}
                        <a-tag :color="tagColorList[sIndex % tagColorList.length]">
                          {{ skillTag.name }}
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
          </div>
        </a-col>
      </a-row>
    </template>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { TemplatesGetPublishedPresentation } from '@/api/template'
import { GoogleAuthCallBackMixin } from '@/mixins/GoogleAuthCallBackMixin'
const { TaskQueryById } = require('@/api/task')

export default {
  name: 'MainTaskPreview',
  props: {
    taskId: {
      type: String,
      default: null
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    taskData: {
      type: Object,
      default: null
    }
  },
  mixins: [ GoogleAuthCallBackMixin ],
  data () {
    return {
      loading: true,
      slideLoading: true,
      task: null,
      imgList: [],
      viewMode: 'Detail',
      currentImgIndex: 0,
      tagColorList: [
        'pink',
        'orange',
        'green',
        'cyan',
        'blue',
        'red',
        'purple'
      ],
      activeContentType: -1
    }
  },
  created () {
    logger.info('TaskPreview taskId ' + this.taskId)
    ClasscipeEventBus.$on(ClasscipeEvent.GOOGLE_AUTH_REFRESH, this.handleAuthCallback)
    this.loadTaskData()
  },
  beforeDestroy() {
    ClasscipeEventBus.$off(ClasscipeEvent.GOOGLE_AUTH_REFRESH, this.handleAuthCallback)
  },
  methods: {
    loadTaskData () {
      this.loading = true
      this.slideLoading = true
      if (!this.taskData && this.taskId) {
        logger.info('TaskPreview loadTaskData ' + this.taskId)
        TaskQueryById({
          id: this.taskId
        }).then(response => {
          logger.info('TaskQueryById ' + this.taskId, response.result)
          this.task = response.result
          this.loading = false
        }).finally(() => {
          this.loadThumbnail()
        })
      } else if (this.taskData) {
        logger.info('TaskPreview taskData ', this.taskData)
        this.task = this.taskData
        this.loadThumbnail()
      }
    },

    handleAuthCallback () {
      this.$logger.info('TaskPreview handleAuthCallback')
      this.loadThumbnail()
    },

    loadThumbnail () {
      this.$logger.info('TaskPreview loadThumbnail ' + this.task.presentationId, this.task.selectPageObjectIds)
      if (this.task.presentationId) {
        TemplatesGetPublishedPresentation({
          taskId: this.task.id
        }).then(response => {
          this.$logger.info('task loadThumbnail response', response.result)
          if (response.code !== this.ErrorCode.ppt_google_token_expires && response.code !== this.ErrorCode.ppt_forbidden) {
            const pageObjects = response.result.pageObjects
            this.imgList = []
            pageObjects.forEach(page => {
              this.imgList.push(page.contentUrl)
              this.slideLoading = false
              this.$logger.info('current imgList ', this.imgList)
            })
          } else {
            this.$logger.info('等待授权事件通知')
          }
        })
      } else {
        this.slideLoading = false
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

    handleGotoImgIndex (index) {
      this.$logger.info('handleGotoImgIndex ' + index)
      this.currentImgIndex = index
      this.$refs.carousel.goTo(index)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.task-preview {

  .top-header {
    position: relative;
    color: rgba(0, 0, 0, 0.65);
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    border-radius: 2px 2px 0 0;

    .title {
      font-weight: bold;
    }

    .last-change-time {
      font-size: 12px;
      color: @text-color-secondary;
    }
  }

  .top-info {
    padding: 20px 0 0 0;
    .spin-loading{
      position: absolute;
      left: 50%;
      top: 50px;
      z-index: 999;
    }
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

          audio {
            height: 30px;
            outline: none;
          }
          .title-icon {
            font-size: 14px;
            font-weight: normal;
            color: @text-color-secondary;
          }
        }

        .block-content {
          padding: 10px;
          .content-list {
            .label {
              font-weight: 500;
              padding: 5px 0;
              font-size: 15px;
            }
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

.img-list-wrapper {
  display: flex;
  height: 350px;
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

.img-text-info {
  display: flex;
  align-items: center;
  flex-direction: row;
  padding: 10px 0;
  .label {
    padding: 0 10px;
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
