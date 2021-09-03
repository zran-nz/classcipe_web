<template>
  <div class="my-class-list">
    <div class="class-list-wrapper">
      <div class="class-list" v-if="!loading">
        <div class="list-item" v-for="(classItem, cIndex) in data" :key="cIndex">
          <div class="class-icon">
            <img src="~@/assets/icons/myClass/class_icon.png" />
          </div>
          <div class="class-tag">
            <div class="class-tag-list">
              <div class="class-tag-item" :key="tIndex" v-for="(tagName, tIndex) in tagList">
                <a-tag :color="colorList[tIndex % colorList.length]" class="my-class-tag">
                  {{ tagName }}
                </a-tag>
              </div>
            </div>
          </div>
          <div class="class-date">{{ classItem.date | formatDate }}</div>
          <div class="class-number">
            <a-tooltip :mouseEnterDelay="1">
              <template slot="title">
                20/42, 20 students have been evaluated
              </template>
              <div class="class-number-item">
                <div class="active-num">20</div> /
                <div class="total-num">42</div>
              </div>
            </a-tooltip>
          </div>
          <div class="class-action">
            <div class="icon-action">
              <a-tooltip>
                <template slot="title">
                  teacher-projecting
                </template>
                <div class="icon-action-item">
                  <img src="~@/assets/icons/myClass/gengduo_gray.png" class="icon-gray" />
                  <img src="~@/assets/icons/myClass/gengduo_color.png" class="icon-color"/>
                </div>
              </a-tooltip>

              <a-tooltip>
                <template slot="title">
                  dashboard
                </template>
                <div class="icon-action-item">
                  <img src="~@/assets/icons/myClass/Startasession@2x_color.png" class="icon-gray" />
                  <img src="~@/assets/icons/myClass/Startasession@2x_gray.png" class="icon-color"/>
                </div>
              </a-tooltip>
            </div>

            <a-popover placement="rightBottom" trigger="click">
              <template slot="content">
                <div class="class-more-icon-panel">
                  <div class="class-more-item" @click="handleEditEvaluationRubric(classItem)">
                    <div class="class-action-icon">
                      <img src="~@/assets/icons/myClass/edit.png" />
                    </div>
                    <div class="class-action-name">
                      Edit evaluation rubric
                    </div>
                  </div>
                  <div class="class-more-item" @click="handleReviewEvaluation(classItem)">
                    <div class="class-action-icon">
                      <img src="~@/assets/icons/myClass/view.png" />
                    </div>
                    <div class="class-action-name">
                      Review & Evaluation
                    </div>
                  </div>
                  <div class="class-more-item" @click="handleArchiveSession(classItem)">
                    <div class="class-action-icon">
                      <img src="~@/assets/icons/myClass/archive.png" />
                    </div>
                    <div class="class-action-name">
                      Archive Session
                    </div>
                  </div>
                  <div class="class-more-item" @click="handleEnableStudentEvaluation(classItem)">
                    <div class="class-action-icon">
                      <a-switch size="small"/>
                    </div>
                    <div class="class-action-name">
                      Enable Student Evaluation
                    </div>
                  </div>
                  <div class="class-more-item" @click="handleEnablePeerEvaluation(classItem)">
                    <div class="class-action-icon">
                      <a-switch size="small"/>
                    </div>
                    <div class="class-action-name">
                      Enable Peer Evaluation
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
import { getMyClasses } from '@/api/lesson'
import TvSvg from '@/assets/icons/lesson/tv.svg?inline'
import * as logger from '@/utils/logger'
import { GetAssociate } from '@/api/teacher'
import { typeMap } from '@/const/teacher'
import { EvaluationAddOrUpdate } from '@/api/evaluation'
import PptCommentPreview from '@/components/Teacher/PptCommentPreview'

export default {
  name: 'ClassList',
  components: {
    TvSvg,
    PptCommentPreview
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
      pageSize: 500,
      total: 0,

      // TODO 新增tag接口
      tagList: ['Content tag', 'Content tag', 'Content tag'],
      colorList: ['pink', 'red', 'orange', 'green', 'purple', 'cyan', 'blue' ]
    }
  },
  created () {
    this.loadTeacherClasses(this.pageSize, this.slideId)
  },
  methods: {
    loadTeacherClasses (limit, slideId) {
      logger.info('loadTeacherClasses ' + ' limit:' + limit + ' slideId:' + slideId)
      this.loading = true
      getMyClasses({ limit, slideId }).then(response => {
        logger.info('getMyClasses', response.data)
        if (response.data.records) {
          response.data.records.forEach((item) => {
            item.date = item.date * 1000
          })
          if (limit) {
            this.data = this.data.concat(response.data.records)
          } else {
            this.data = response.data.records
          }
        }
        this.total = response.data.total
        logger.info(' data', this.data)
        this.loading = false
      })
    },

    handleTeacherProjecting (item) {
      this.$logger.info('handleStartSession', item)
      window.open(item.class_link_for_teacher, '_blank')
    },

    handleDashboard (item) {
      this.$logger.info('handleDashboard', item)
      window.open(item.dashboard_link, '_blank', 'height=700, width=1200, top=100, left= 100 toolbar=no, menubar=no, scrollbars=no, location=no, status=no')
    },

    handleEditEvaluationRubric (item) {
      this.$logger.info('handleEditEvaluationRubric', item, this.classData)
      // 根据associate获取对应的evaluation，然后跳转到编辑页面
      if (this.classData) {
        GetAssociate({
          id: this.classData.id,
          type: this.classData.type
        }).then(response => {
          this.$logger.info('GetAssociate res', response)
          const owner = response.result.owner
          const associateList = []
          owner.forEach(item => {
            const itemType = item.type
            const itemTypeName = item.typeName
            item.datas.forEach(dataItem => {
              if (dataItem.lists.length) {
                dataItem.lists.forEach(aItem => {
                  associateList.push({
                    itemType,
                    itemTypeName,
                    ...aItem
                  })
                })
              }
            })
          })
          this.$logger.info('associate list', associateList)
          const evaluationItem = associateList.find(aItem => aItem.itemType === this.typeMap.evaluation)
          if (evaluationItem) {
            this.$logger.info('find evaluation ', evaluationItem)
            window.open('/teacher/evaluation-redirect/' + evaluationItem.id, '_blank')
          } else {
            this.$logger.info('not find evaluation')
          }
        })
      }
    },

    handleEnableStudentEvaluation (item) {
      this.$logger.info('handleEnableStudentEvaluation', item, this.classData)
      if (this.classData) {
        GetAssociate({
          id: this.classData.id,
          type: this.classData.type
        }).then(response => {
          this.$logger.info('GetAssociate res', response)
          const owner = response.result.owner
          const associateList = []
          owner.forEach(item => {
            const itemType = item.type
            const itemTypeName = item.typeName
            item.datas.forEach(dataItem => {
              if (dataItem.lists.length) {
                dataItem.lists.forEach(aItem => {
                  associateList.push({
                    itemType,
                    itemTypeName,
                    ...aItem
                  })
                })
              }
            })
          })
          this.$logger.info('associate list', associateList)
          const evaluationItem = associateList.find(aItem => aItem.itemType === this.typeMap.evaluation)
          if (evaluationItem) {
            this.$logger.info('find evaluation ', evaluationItem)
            EvaluationAddOrUpdate({ id: evaluationItem.id, selfType: 1 }).then((response) => {
              logger.info('EvaluationAddOrUpdate', response.result)
              if (response.success) {
                this.$message.success('Success')
              } else {
                this.$message.error(response.message)
              }
            })
          } else {
            this.$logger.info('not find evaluation')
          }
        })
      }
    },
    handleReviewEvaluation (item) {
      this.$logger.info('handleReviewEvaluation', item, this.classData)
      this.currentClassId = item.class_id
      this.PPTCommentPreviewVisible = true
    },
    handleEnablePeerEvaluation (item) {
      this.$logger.info('handleEnablePeerEvaluation', item, this.classData)
      if (this.classData) {
        GetAssociate({
          id: this.classData.id,
          type: this.classData.type
        }).then(response => {
          this.$logger.info('GetAssociate res', response)
          const owner = response.result.owner
          const associateList = []
          owner.forEach(item => {
            const itemType = item.type
            const itemTypeName = item.typeName
            item.datas.forEach(dataItem => {
              if (dataItem.lists.length) {
                dataItem.lists.forEach(aItem => {
                  associateList.push({
                    itemType,
                    itemTypeName,
                    ...aItem
                  })
                })
              }
            })
          })
          this.$logger.info('associate list', associateList)
          const evaluationItem = associateList.find(aItem => aItem.itemType === this.typeMap.evaluation)
          if (evaluationItem) {
            this.$logger.info('find evaluation ', evaluationItem)
            EvaluationAddOrUpdate({ id: evaluationItem.id, selfType: 2 }).then((response) => {
              logger.info('EvaluationAddOrUpdate', response.result)
              if (response.success) {
                this.$message.success('Success')
              } else {
                this.$message.error(response.message)
              }
            })
          } else {
            this.$logger.info('not find evaluation')
          }
        })
      }
    },
    handleArchiveSession (item) {
      this.$logger.info('handleArchiveSession', item)
    }
  }
}
</script>

<style lang="less" scoped>

.my-class-list {
  background: rgba(228, 228, 228, 0.1);
  border: 1px solid #D8D8D8;
  opacity: 1;
  height: 620px;
  overflow-y: scroll;
  border-radius: 4px;

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

  .class-list-wrapper {
    padding: 15px;

    .class-list {
      display: flex;
      flex-direction: column;
      .list-item {
        padding: 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 20px;
        background: #fff;
        border: 1px solid #D8D8D8;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        opacity: 1;
        border-radius: 4px;

        .class-icon {
          width: 40px;
          display: flex;
          flex-direction: row;
          align-items: center;

          img {
            height: 35px;
          }
        }

        .class-tag {
          padding: 0 5px;
          width: 300px;
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
          .class-number-item {
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
          }
        }

        .class-action {
          width: 120px;
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

  .class-more-item {
    cursor: pointer;
    padding: 10px  5px ;
    display: flex;
    flex-direction: row;
    align-items: center;

    .class-action-icon {
      width: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      img {
        height: 20px;
      }
    }
  }

  .class-more-item:hover {
    background: #eee;
  }
}

.loading {
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  .ant-spin {
    text-align: center;
  }
}
</style>
