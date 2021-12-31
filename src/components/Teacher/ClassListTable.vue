<template>
  <div>

    <div class="my-class-list">
      <a-input-search
        size="large"
        class="preview-session-search"
        placeholder="Find by session name or class name"
        v-model="sessionName"
        @search="searchSession"
        enter-button/>
      <a-skeleton :loading="loading" active>
        <a-table
          class="class-list"
          :columns="columns"
          :data-source="data"
          :pagination="false"
          rowKey="id">

          <span slot="date" slot-scope="date" class="flex-center table-date">
            <div class="class-icon">
              <img src="~@/assets/icons/myClass/class_icon.png" />
            </div>
            {{ date * 1000 | dayjs1 }}
          </span>

          <span slot="className" slot-scope="className" class="flex-center">
            <div class="class-name">
              <div class="class-name-text">{{ className }}</div>
            </div>
          </span>

          <span slot="fileName" slot-scope="text, record" class="flex-center">
            <div class="class-name">
              <a-input
                ref="inputRef"
                @blur="handleConfirmName()"
                @pressEnter="handleConfirmName()"
                v-if="editItem.id === record.id"
                type="text"
                placeholder="Input new name"
                v-model="createNewName" />
              <div v-else class="class-name-text">{{ text }}</div>
            </div>
          </span>

          <span slot="status" slot-scope="status" class="flex-center">
            <div v-if="active" style="color: #15C39A;"> {{ status }}</div>
            <div v-else style="color: #15C39A;"> Archived </div>
          </span>

          <span slot="action" class="flex-center" slot-scope="text, record">
            <div class="class-action" v-if="active">
              <div class="icon-action">
                <a-tooltip>
                  <template slot="title">
                    teacher-projecting
                  </template>
                  <div class="icon-action-item" @click="handleTeacherProjecting(record)">
                    <img src="~@/assets/icons/myClass/Startasession@2x_color.png" class="icon-color" />
                    <img src="~@/assets/icons/myClass/Startasession@2x_gray.png" class="icon-gray"/>
                  </div>
                </a-tooltip>
              </div>

              <a-popover placement="rightTop" trigger="click">
                <template slot="content">
                  <div class="class-more-icon-panel">
                    <div class="class-more-item" @click="handleReviewEditEvaluation(record)">
                      <div class="class-action-icon">
                        <evaluate-icon />
                      </div>
                      <div class="class-action-name">
                        Evaluate
                      </div>
                    </div>
                    <div class="class-more-item" @click="handleArchiveSession(record)">
                      <div class="class-action-icon">
                        <archive-session-icon />
                      </div>
                      <div class="class-action-name">
                        Archive Session
                      </div>
                    </div>

                    <div class="class-more-item" @click="handleRenameSession(record)">
                      <div class="class-action-icon">
                        <Bianji />
                      </div>
                      <div class="class-action-name">
                        Rename the session
                      </div>
                    </div>
                    <div class="class-more-item" @click="handleReopenSession(record)" v-if="record.status === 'close'">
                      <div class="class-action-icon">
                        <a-icon type="interaction" />
                      </div>
                      <div class="class-action-name">
                        Reopen
                      </div>
                    </div>
                    <div class="class-more-item" @click="handleEndSession(record)" v-else>
                      <div class="class-action-icon">
                        <a-icon type="close-circle" />
                      </div>
                      <div class="class-action-name">
                        End the session
                      </div>
                    </div>
                  </div>
                </template>
                <div class="more-action">
                  <img src="~@/assets/icons/myClass/more.png"/>
                </div>
              </a-popover>
            </div>
            <div v-else>
              <a-button type="link" class="flex-center" @click="handleRestoreSession(record)">
                Restore
              </a-button>
            </div>
          </span>
        </a-table>
      </a-skeleton>

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
    </div>
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
import NoMoreResources from '@/components/Common/NoMoreResources'
import Bianji from '@/assets/icons/common/Bianji.svg?inline'
import { AddOrUpdateClass, ChangeClassStatus } from '@/api/classroom'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'ClassTableList',
  components: {
    NoMoreResources,
    ReviewEvaluation,
    TvSvg,
    PptCommentPreview,
    ArchiveSessionIcon,
    EvaluateIcon,
    Bianji
  },
  props: {
    slideId: {
      type: String,
      default: null
    },
    active: {
      type: Boolean,
      default: true
    },
    classData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      editItem: {},
      createNewName: '',
      sessionName: '',
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
      colorList: [ 'pink', 'red', 'orange', 'green', 'purple', 'cyan', 'blue' ],
      columns: [
        {
          title: 'Date',
          dataIndex: 'date',
          width: 250,
          scopedSlots: { customRender: 'date' }
        },
        {
          title: 'Class',
          dataIndex: 'className',
          width: 200,
          scopedSlots: { customRender: 'className' }
        },
        {
          title: 'Status',
          dataIndex: 'status',
          width: 100,
          scopedSlots: { customRender: 'status' }
        },
        {
          title: 'Session name',
          dataIndex: 'fileName',
          width: 280,
          scopedSlots: { customRender: 'fileName' }
        },
        {
          title: '',
          dataIndex: 'action',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created () {
    this.loadTeacherClasses()
  },
  methods: {
    loadTeacherClasses () {
      logger.info('loadTeacherClasses ' + ' limit:' + this.pageSize + ' slideId:' + this.slideId + ' searchKey:' + this.sessionName)
      this.loading = true
      this.data = []
      FindMyClasses({ limit: this.pageSize, slideId: this.slideId, delFlag: this.active ? 0 : 1, searchKey: this.sessionName }).then(response => {
        logger.info('FindMyClasses', response.result.data)
        if (response.success) {
          if (this.pageSize) {
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
      const targetUrl = lessonHost + 'd/' + item.classId + '?token=' + storage.get(ACCESS_TOKEN)
      this.$logger.info('try open ' + targetUrl)
      // window.open(targetUrl, '_blank')
      // 课堂那边需要点击返回回到表单，改成location.href跳转
      const url = lessonHost + 't/' + item.classId + '?token=' + storage.get(ACCESS_TOKEN)
      var height = document.documentElement.clientHeight * 0.7
      var width = document.documentElement.clientWidth * 0.7
      var strWindowFeatures = 'width=' + width + ',height=' + height + ',menubar=yes,location=yes,resizable=yes,scrollbars=true,status=true,top=100,left=200'
      var windowObjectReference
      windowObjectReference = window.open(
        'about:blank',
        '_blank',
        strWindowFeatures
      )
      windowObjectReference.location = url
      setTimeout(function () {
        window.location.href = targetUrl
      }, 1000)
    },

    handleDashboard (item) {
      this.$logger.info('handleDashboard', item)
      window.open(lessonHost + 'd/' + item.classId, '_blank')
    },

    handleReviewEditEvaluation (item) {
      this.$logger.info('handleReviewEditEvaluation', item, this.classData)
      this.$router.push({
        path: `/teacher/class-evaluation/${this.classData.id}/${item.classId}`
      })
    },
    searchSession () {
      this.$logger.info('searchSession', this.sessionName)
      this.loadTeacherClasses()
    },
    handleArchiveSession (item) {
      this.$logger.info('handleArchiveSession', item)
      this.$confirm({
        title: 'Confirm archive session',
        content: 'Are you confirm archive this session ?',
        centered: true,
        onOk: () => {
          ChangeClassStatus({ classId: item.classId, status: 1 }).then(response => {
            this.$logger.info('ChangeClassStatus', response)
          }).finally(() => {
            this.loadTeacherClasses()
          })
        }
      })
    },
    handleRenameSession (item) {
      this.createNewName = ''
      this.editItem = item
    },
    handleConfirmName () {
      if (!this.createNewName) {
        this.editItem = {}
        this.createNewName = ''
        return
      }
      this.editItem.fileName = this.createNewName
      AddOrUpdateClass(this.editItem).then(response => {
        this.editItem = {}
        this.createNewName = ''
        this.loadTeacherClasses()
      })
    },
    handleRestoreSession (item) {
      this.$logger.info('handleRestoreSession', item)
      this.$confirm({
        title: 'Confirm restore session',
        content: 'Are you confirm restore this session ?',
        centered: true,
        onOk: () => {
          ChangeClassStatus({ classId: item.classId, status: 0 }).then(response => {
            this.$logger.info('ChangeClassStatus', response)
          }).finally(() => {
            this.loadTeacherClasses()
          })
        }
      })
    },

    handleReopenSession (record) {

    },

    handleEndSession (record) {

    }
  }
}
</script>

<style lang="less" scoped>

.my-class-list {
  //box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
  opacity: 1;
  //border: 1px solid #D8D8D8;
  border-radius: 6px;
  height: 620px;
  margin-top: 10px;
  margin-bottom: 15px;
  overflow-y: scroll;
  background: #FFFFFF;

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
  .preview-session-search{
    margin: 0px 5px 20px 5px;
    width: 400px;
  }

 /deep/ .ant-table-row-cell-break-word{
   height:60px;
 }
  /deep/ .ant-table-thead > tr > th{
    font-weight: bold;
  }
  .class-list {
    font-family: Inter-Bold;
    .flex-center{
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
    }
    .table-date{
      font-size: 13px;
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
      display: flex;
      align-items: center;
      overflow: hidden;

      .class-name-text {
        display: flex;
        font-size:13px;
        flex-wrap: nowrap;
        align-items: center;
        padding-right: 5px;
      }
    }

    .class-date {
      width: 150px;
      //font-size: 12px;
      font-family: Inter-Bold;
      line-height: 24px;
      color: #aaa;
      text-align: right;
      padding-right: 20px;
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

    /deep/ .ant-table-row-cell-break-word{
      text-align: center;
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
</style>
