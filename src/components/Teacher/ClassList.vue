<template>
  <div class="my-class-list">
    <div class="class-list-wrapper">
      <div class="class-list" v-if="!loading">
        <div class="list-item" v-for="(classItem, cIndex) in data" :key="cIndex">
          <div class="class-icon">
            <img src="~@/assets/icons/myClass/class_icon.png" />
          </div>
          <div class="class-name">
            <div class="class-name-text">{{ classItem.className }}</div>
            <!--            <div class="class-name-text">{{ classItem.className }}</div>-->
            <!--            <div class="class-tag">-->
            <!--              <div class="class-tag-list">-->
            <!--                <div class="class-tag-item" :key="tIndex" v-for="(tagName, tIndex) in classItem.tags">-->
            <!--                  <a-tag :color="colorList[tIndex % colorList.length]" class="my-class-tag">-->
            <!--                    {{ tagName }}-->
            <!--                  </a-tag>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
          <div class="class-date">{{ classItem.date | formatDate }}</div>
          <div class="class-number">
            <div class="class-number-detail">
              <a-tooltip>
                <template v-if="classItem.evaluationId">
                  <template slot="title">
                    {{ classItem.answerCount }}/{{ classItem.formCount }} have been evaluated
                  </template>
                  <div class="class-number-item">
                    <div class="active-num">{{ classItem.answerCount }}</div> /
                    <div class="total-num">{{ classItem.formCount }}</div>
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
      <template v-if="!data.length && !loading">
        <div class="no-data">
          <no-more-resources tips="No previous session" />
        </div>
      </template>
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
        <review-evaluation :class-id="currentReviewEvaluationSessionItem.classId" :slide-id="classData.presentationId" :evaluation-id="currentReviewEvaluationSessionItem.evaluationId" />
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

    <a-modal
      v-model="selectEvaluationFormVisible"
      :footer="null"
      :title="null"
      destroyOnClose
    >
      <div class="evaluation-select">
        <div class="evaluation-select-header">
          <div class="evaluation-icon">
            <evaluate-icon />
          </div>
          <div class="evaluation-title">
            <h2>Evaluation</h2>
          </div>
        </div>
        <div class="evaluation-select-body">
          <div class="select-type">
            <div class="select-type-item" @click="handleSelectType('exist')">
              <div :class="{'type-item': true, 'selected-type': selectType === 'exist'}">
                <div class="select-icon">
                  <exist-type-icon />
                </div>
                <div class="select-label">
                  <div class="label-title">
                    Evaluation
                  </div>
                  <div class="label-name">
                    Reuse existing
                  </div>
                </div>
                <div class="active-icon" v-if="selectType === 'exist'">
                  <active-icon />
                </div>
              </div>
            </div>
            <div class="select-type-item" @click="handleSelectType('create')">
              <div :class="{'type-item': true, 'selected-type': selectType === 'create'}">
                <div class="select-icon">
                  <create-type-icon />
                </div>
                <div class="select-label">
                  <div class="label-title">
                    Evaluation
                  </div>
                  <div class="label-name">
                    Create new
                  </div>
                </div>
                <div class="active-icon" v-if="selectType === 'create'">
                  <active-icon />
                </div>
              </div>
            </div>
          </div>
          <div class="select-detail">
            <template v-if="selectType === 'exist'">
              <div class="switch-type-wrapper">
                <div class="switch-type">
                  <div class="switch-label">
                    <a-dropdown :trigger="['click']">
                      <a-menu slot="overlay">
                        <a-menu-item disabled>
                          <span>Select the evaluation form</span>
                        </a-menu-item>
                        <a-menu-item class="my-menu-item" @click="handleSelectItem(item)" v-for="(item, eIndex) in existEvaluationList" :key="eIndex">
                          <span>{{ item.name ? item.name : 'untitled' }}</span>
                        </a-menu-item>
                      </a-menu>
                      <a-button
                        style="padding: 5px 10px;
                        display:flex; width: 100%;
                        word-wrap: normal;
                        align-items:center;
                        border-radius: 4px;
                        background: rgba(245, 245, 245, 0.5);
                        font-size:13px;
                        height: 35px;
                        border: 1px solid #BCBCBC;
                        font-family: Inter-Bold;
                        color: #182552;">
                        <span class="btn-text" v-if="selectExistName">{{ selectExistName }}</span> <span
                          v-else>Select the evaluation form</span>
                        <a-icon type="caret-down"/>
                      </a-button>
                    </a-dropdown>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="modal-ensure-action-line-center">
            <a-button class="action-ensure action-item" type="primary" shape="round" @click="handleEnsure">Start</a-button>
          </div>
        </div>
      </div>
    </a-modal>

  </div>
</template>

<script>
import { FindMyClasses } from '@/api/evaluation'
import TvSvg from '@/assets/icons/lesson/tv.svg?inline'
import * as logger from '@/utils/logger'
import { ownerMap, statusMap, typeMap } from '@/const/teacher'
import { FindMyContent } from '@/api/teacher'
import PptCommentPreview from '@/components/Teacher/PptCommentPreview'
import { lessonHost } from '@/const/googleSlide'
import ReviewEvaluation from '@/components/Evaluation/ReviewEvaluation'
import ArchiveSessionIcon from '@/assets/svgIcon/evaluation/ArchiveSession.svg?inline'
import EvaluateIcon from '@/assets/svgIcon/evaluation/Evaluate.svg?inline'
import NoMoreResources from '@/components/Common/NoMoreResources'
import ActiveIcon from '@/assets/svgIcon/evaluation/classList/active.svg?inline'
import CreateTypeIcon from '@/assets/svgIcon/evaluation/classList/create.svg?inline'
import ExistTypeIcon from '@/assets/svgIcon/evaluation/classList/exist.svg?inline'

export default {
  name: 'ClassList',
  components: {
    NoMoreResources,
    ReviewEvaluation,
    TvSvg,
    PptCommentPreview,
    ArchiveSessionIcon,
    EvaluateIcon,
    ActiveIcon,
    CreateTypeIcon,
    ExistTypeIcon
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

      existEvaluationList: [],
      selectEvaluationFormVisible: false,
      selectType: 'exist', // 选择已有-exist 新建-create
      selectExistId: null,
      selectExistName: null,

      // TODO 新增tag接口
      tagList: ['Content tag', 'Content tag', 'Content tag'],
      colorList: [ 'pink', 'red', 'orange', 'green', 'purple', 'cyan', 'blue' ]
    }
  },
  created () {
    this.loadTeacherClasses(this.pageSize, this.slideId)
    this.loadEvaluationList()
  },
  methods: {
    loadTeacherClasses (limit, slideId) {
      logger.info('loadTeacherClasses ' + ' limit:' + limit + ' slideId:' + slideId)
      this.loading = true
      FindMyClasses({ limit, slideId }).then(response => {
        logger.info('FindMyClasses', response.result.data)
        if (response.success) {
          response.result.forEach((item) => {
            item.date = item.date * 1000
          })
          if (limit) {
            this.data = this.data.concat(response.result)
          } else {
            this.data = response.result
          }
        }
        this.total = response.result.length
        logger.info(' data', this.data)
        this.loading = false
      })
    },

    handleTeacherProjecting (item) {
      this.$logger.info('handleStartSession', item)
      window.open(lessonHost + 't/' + item.classId, '_blank')
    },

    handleDashboard (item) {
      this.$logger.info('handleDashboard', item)
      window.open(lessonHost + 'd/' + item.classId, '_blank')
    },

    loadEvaluationList () {
      FindMyContent({
        owner: ownerMap['owner-by-me'],
        status: statusMap['all-status'],
        types: [typeMap.evaluation],
        pageNo: 1,
        pageSize: 10000,
        searchKey: ''
      }).then(res => {
        logger.info('loadEvaluationList', res)
        if (res.result && res.result.records && res.result.records.length) {
          res.result.records.forEach((record, index) => {
            record.key = index
          })
          this.existEvaluationList = res.result.records
        } else {
          this.existEvaluationList = []
        }
        logger.info('existEvaluationList', this.existEvaluationList)
      })
    },
    handleReviewEditEvaluation (item) {
      this.$logger.info('handleReviewEditEvaluation', item, this.classData)
      if (!item.evaluationId) {
        this.currentSelectEvaluationItem = item
        this.selectEvaluationFormVisible = true
      } else {
        this.$router.push({
          path: `/teacher/class-evaluation/${this.classData.id}/${this.currentSelectEvaluationItem.classId}`
        })
      }
    },
    handleArchiveSession (item) {
      this.$logger.info('handleArchiveSession', item)
    },
    handleSelectItem (item) {
      this.$logger.info('handleSelectItem', item)
      this.selectExistName = item.name
      this.selectExistId = item.id
    },
    handleSelectType (type) {
      this.$logger.info('handleSelectType ' + type)
      this.selectType = type
    },

    handleEnsure () {
      this.$logger.info('handleEnsure')
      this.selectEvaluationFormVisible = false
      if (this.selectType === 'create') {
        this.$router.push({
          path: `/teacher/class-evaluation/${this.classData.id}/${this.currentSelectEvaluationItem.classId}`
        })
      } else {
        // TODO 使用现有的evaluation数据
      }
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

.no-data {
  padding: 100px;
}

.switch-type-wrapper {
  text-align: center;
  width: 100%;

  .switch-type {
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    opacity: 1;
    border-radius: 6px;

    padding: 12px 5px;

    .switch-label {
      font-size: 14px;
      font-family: Inter-Bold;
      line-height: 20px;
      width: 90%;
      color: rgba(24, 37, 82, 1);
    }

    .switch-icon {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .icon-item {
        margin-left: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;

        svg {
          width: 22px;
          color: rgba(24, 37, 82, 1);
        }
      }

      .active-icon {
        svg {
          color: rgba(21, 195, 154, 1);
        }
      }
    }
  }
}

.my-dropdown {
  max-height: 300px;
}

.evaluation-select {
  display: flex;
  flex-direction: column;

  .evaluation-select-header {
    padding: 10px 0 0 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
    .evaluation-icon {
      svg {
        width: 35px;
        height: 35px;
      }
    }

    .evaluation-title {
      padding-left: 10px;
      h2 {
        font-weight: bold;
      }
    }
  }

  .evaluation-select-body {
    padding-left: 45px;
    .select-type {
      display: flex;
      flex-direction: row;
      align-items: center;
      .select-type-item {
        margin-right: 20px;
        border-radius: 11px;
        border: 1px solid #E4E4E4;
        background-color: #FFFFFF;
        .type-item {
          padding: 10px;
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;

          .select-label {
            padding-left: 10px;
            padding-right: 5px;
            display: flex;
            flex-direction: column;
            .label-title {
              font-size: 12px;
              line-height: 16px;
              font-family: PingFang SC;
              color: #9A9D9F;
            }
            .label-name {
              font-size: 18px;
              font-family: Bahnschrift;
              font-weight: 400;
              line-height: 16px;
              color: #070707;
            }
          }

          .active-icon {
            position: absolute;
            top: -1px;
            right: -1px;
          }
        }
      }
    }

    .select-detail {
      min-height: 100px;
      padding: 10px 0;
    }
  }
}

.btn-text {
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
}

.modal-ensure-action-line-center {
  text-align: center;
  padding-bottom: 10px;
}
</style>
