<template>
  <div class="my-class-list">
    <div class="class-list-wrapper">
      <div class="class-list" v-if="!loading">
        <div class="list-item" v-for="(classItem, cIndex) in data" :key="cIndex">
          <div class="class-icon">
            <img src="~@/assets/icons/myClass/class_icon.png" />
          </div>
          <div class="class-name">
            <div class="class-name-text">{{ classItem.class_name }}</div>
            <div class="class-tag">
              <div class="class-tag-list">
                <div class="class-tag-item" :key="tIndex" v-for="(tagName, tIndex) in classItem.tags">
                  <a-tag :color="colorList[tIndex % colorList.length]" class="my-class-tag">
                    {{ tagName }}
                  </a-tag>
                </div>
              </div>
            </div>
          </div>
          <div class="class-date">{{ classItem.date | formatDate }}</div>
          <div class="class-number">
            <div class="class-number-detail">
              <a-tooltip>
                <template v-if="Math.random() > 0.5">
                  <template slot="title">
                    20/42, 20 students have been evaluated
                  </template>
                  <div class="class-number-item">
                    <div class="active-num">20</div> /
                    <div class="total-num">42</div>
                  </div>
                </template>
                <template v-else>
                  <template slot="title">
                    Not evaluated
                  </template>
                  <div class="class-number-item" >
                    <div class="no-evaluate">Not evaluated</div>
                  </div>
                </template>
              </a-tooltip>
            </div>
          </div>
          <div class="class-action">
            <div class="icon-action">
              <a-tooltip>
                <template slot="title">
                  teacher-projecting
                </template>
                <div class="icon-action-item" @click="handleTeacherProjecting(classItem)">
                  <img src="~@/assets/icons/myClass/Startasession@2x_color.png" class="icon-color" />
                  <img src="~@/assets/icons/myClass/Startasession@2x_gray.png" class="icon-gray"/>
                </div>
              </a-tooltip>
            </div>

            <a-popover placement="rightTop" trigger="click">
              <template slot="content">
                <div class="class-more-icon-panel">
                  <div class="class-more-item" @click="handleReviewEditEvaluation(classItem)">
                    <div class="class-action-icon">
                      <evaluate-icon />
                    </div>
                    <div class="class-action-name">
                      Evaluate
                    </div>
                  </div>
                  <div class="class-more-item" @click="handleArchiveSession(classItem)">
                    <div class="class-action-icon">
                      <archive-session-icon />
                    </div>
                    <div class="class-action-name">
                      Archive Session
                    </div>
                  </div>
                </div>
              </template>
              <div class="more-action">
                <img src="~@/assets/icons/myClass/more.png"/>
              </div>
            </a-popover>
          </div>
        </div>
      </div>
      <div class="loading" v-if="loading">
        <a-spin />
      </div>
    </div>

    <a-modal
      v-model="reviewEvaluationVisible"
      :footer="null"
      :title="null"
      destroyOnClose
      width="1300px"
      @ok="reviewEvaluationVisible = false"
      @cancel="reviewEvaluationVisible = false">
      <div class="review-evaluation-wrapper" v-if="currentReviewEvaluationSessionItem">
        <review-evaluation :class-id="currentReviewEvaluationSessionItem.class_id" :slide-id="classData.presentationId" :evaluation-id="currentReviewEvaluationSessionItem.evaluationId" />
      </div>
    </a-modal>

    <a-modal
      v-model="PPTCommentPreviewVisible"
      :footer="null"
      destroyOnClose
      width="800px"
      title="Summary"
      @ok="PPTCommentPreviewVisible = false"
      @cancel="PPTCommentPreviewVisible = false">
      <div class="view-ppt-comment">
        <ppt-comment-preview :slide-id="slideId" :class-id="currentClassId" v-if="slideId"/>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { FindMyClasses } from '@/api/evaluation'
import TvSvg from '@/assets/icons/lesson/tv.svg?inline'
import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'

import PptCommentPreview from '@/components/Teacher/PptCommentPreview'
import { lessonHost } from '@/const/googleSlide'
import ReviewEvaluation from '@/components/Evaluation/ReviewEvaluation'
import ArchiveSessionIcon from '@/assets/svgIcon/evaluation/ArchiveSession.svg?inline'
import EvaluateIcon from '@/assets/svgIcon/evaluation/Evaluate.svg?inline'

export default {
  name: 'ClassList',
  components: {
    ReviewEvaluation,
    TvSvg,
    PptCommentPreview,
    ArchiveSessionIcon,
    EvaluateIcon
  },
  props: {
    slideId: {
      type: String,
      default: null
    },
    classData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      data: [],
      loading: true,
      typeMap: typeMap,

      PPTCommentPreviewVisible: false,
      currentClassId: null,
      loadFailed: false,
      cursor: 0,
      currentPage: 0,
      pageSize: 100,
      total: 0,

      reviewEvaluationVisible: false,
      currentReviewEvaluationSessionItem: null,

      // TODO 新增tag接口
      tagList: ['Content tag', 'Content tag', 'Content tag'],
      colorList: [ 'pink', 'red', 'orange', 'green', 'purple', 'cyan', 'blue' ]
    }
  },
  created () {
    this.loadTeacherClasses(this.pageSize, this.slideId)
  },
  methods: {
    loadTeacherClasses (limit, slideId) {
      logger.info('loadTeacherClasses ' + ' limit:' + limit + ' slideId:' + slideId)
      this.loading = true
      FindMyClasses({ limit, slideId }).then(response => {
        logger.info('FindMyClasses', response.result.data)
        if (response.success) {
          response.result.data.records.forEach((item) => {
            item.date = item.date * 1000
          })
          if (limit) {
            this.data = this.data.concat(response.result.data.records)
          } else {
            this.data = response.result.data.records
          }
        }
        this.total = response.result.data.total
        logger.info(' data', this.data)
        this.loading = false
      })
    },

    handleTeacherProjecting (item) {
      this.$logger.info('handleStartSession', item)
      window.open(lessonHost + 't/' + item.class_id, '_blank')
    },

    handleDashboard (item) {
      this.$logger.info('handleDashboard', item)
      window.open(lessonHost + 'd/' + item.class_id, '_blank')
    },

    handleReviewEditEvaluation (item) {
      this.$logger.info('handleReviewEditEvaluation', item, this.classData)
      this.$router.push({
        path: `/teacher/class-evaluation/${this.classData.id}/${item.class_id}`
      })
    },
    handleArchiveSession (item) {
      this.$logger.info('handleArchiveSession', item)
    }
  }
}
</script>

<style lang="less" scoped>

.my-class-list {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
  opacity: 1;
  border: 1px solid #D8D8D8;
  border-radius: 6px;
  height: 620px;
  margin-top: 10px;
  margin-bottom: 15px;
  overflow-y: scroll;
  background: rgba(213, 213, 213, 0.21);

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 3px;
    background: rgba(0,0,0,0.00);
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.01);
  }
  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(0,0,0,0.12);
    -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.01);
  }

  .class-list-wrapper {
    padding: 15px 20px;

    .class-list {
      display: flex;
      flex-direction: column;
      .list-item {
        padding: 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 15px;
        background: #fff;
        opacity: 1;
        border-radius: 4px;

        &:hover {
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        }

        .class-icon {
          width: 40px;
          display: flex;
          flex-direction: row;
          align-items: center;

          img {
            height: 30px;
          }
        }

        .class-name {
          width: 420px;
          display: flex;
          align-items: center;
          overflow: hidden;

          .class-name-text {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            padding-right: 5px;
          }

          .class-tag {
            padding-right: 5px;
            .class-tag-list {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
              flex-wrap: wrap;

              .my-class-tag {
                margin: 5px;
                border-radius: 22px;
              }
            }
          }
        }

        .class-date {
          width: 150px;
          font-size: 12px;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #aaa;
          text-align: right;
          padding-right: 20px;
        }

        .class-number {
          padding: 0 5px;
          width: 150px;
          .class-number-detail {
            display: flex;
            width: 120px;
            align-items: center;
            justify-content: flex-start;
            .class-number-item {
              width: 120px;
              cursor: pointer;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              background: rgba(245, 245, 245, 0.5);
              border: 1px solid #d4cdcd;
              opacity: 1;
              font-size: 13px;
              border-radius: 6px;
              padding: 3px 10px;
            }

            .class-number-item {
              .active-num {
                padding: 0 3px;
                font-family: Inter-Bold;
                line-height: 24px;
                color: #15C39A;
              }

              .total-num {
                padding: 0 3px;
                font-family: Inter-Bold;
                line-height: 24px;
                color: #11142D;
              }

              .no-evaluate {
                color: #11142D;
                padding: 0 3px;
                font-family: Inter-Bold;
                line-height: 24px;
              }
            }

            .class-number-item:hover {
              background: #15C39A;
              border: 1px solid #15C39A;
              color: #fff;

              .active-num {
                color: #fff;
              }

              .total-num {
                color: #fff;
              }

              .no-evaluate {
                color: #fff;
              }
            }
          }
        }

        .class-action {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;

          .icon-action {
            display: flex;
            flex-direction: row;
            align-items: center;
            .icon-action-item {
              cursor: pointer;
              padding: 5px 8px;
              box-sizing: border-box;
              img {
                height: 20px;
              }
              .icon-gray {
                display: inline-block;
              }

              .icon-color {
                display: none;
              }
            }

            .icon-action-item:hover {
              .icon-gray {
                display: none;
              }

              .icon-color {
                display: inline-block;
              }
            }
          }

          .more-action {
            cursor: pointer;
            padding: 0 5px;
            margin-left: 8px;
            img {
              height: 15px;
            }
          }
        }
      }
    }
  }
}
.class-more-icon-panel {
  display: flex;
  flex-direction: column;
  width: 200px;

  .class-more-item {
    cursor: pointer;
    padding: 5px;
    margin-bottom: 5px;
    margin-top: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;

    .class-action-icon {
      width: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      svg {
        width: 30px;
      }
    }
  }

  .class-more-item:hover {
    background: #eee;
  }
}

.loading {
  padding: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  .ant-spin {
    text-align: center;
  }
}
</style>
