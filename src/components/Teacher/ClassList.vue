<template>
  <div class="class-list">
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="data"
      :pagination="false"
      rowKey="id">

      <span slot="date" slot-scope="date"> {{ date | formatDate }}</span>

      <span slot="status" slot-scope="status">
        {{ status }}
        <!--        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />-->
      </span>

      <span slot="action" slot-scope="text, record" class="action-line">
        <div class="action-item">
          <tv-svg @click="handleTeacherProjecting(record)"/>
        </div>
        <div class="action-item">
          <a @click="handleDashboard(record)">
            <a-icon type="menu" />
          </a>
        </div>
        <div class="action-item">
          <a-dropdown>
            <a-icon type="more" style="margin-right: 8px" />

            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleEditEvaluationRubric(record)">
                  Edit evaluation rubric
                </a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleEnableStudentEvaluation(record)">
                  Enable Student Evaluation
                </a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleReviewEvaluation(record)">
                  Review & Evaluation
                </a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleEnablePeerEvaluation(record)">
                  Enable Peer Evaluation
                </a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleArchiveSession(record)">
                  Archive Session
                </a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </span>
    </a-table>
    <div class="loading-status">
      <a-spin v-if="loading && !skeletonLoading"/>
      <span v-if="loadFinished">All data loaded~</span>
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
const columns = [
  {
    title: 'Class name',
    dataIndex: 'class_name',
    width: 200
  },
  {
    title: 'Date',
    dataIndex: 'date',
    scopedSlots: { customRender: 'date' },
    width: 150
  },
  {
    title: 'Status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    width: 100
  },
  {
    title: 'Action',
    dataIndex: 'action',
    width: '100px',
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]

const statusMap = {
  'live': {
    status: 'success',
    text: 'Live'
  },
  'student-paced': {
    status: 'processing',
    text: 'Student-paced '
  },
  'close': {
    status: 'default',
    text: 'Close'
  }
}

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
      columns: columns,
      data: [],
      loading: true,
      typeMap: typeMap,

      PPTCommentPreviewVisible: false,
      currentClassId: null,
      skeletonLoading: true,
      loadFailed: false,
      cursor: 0,
      currentPage: 0,
      pageSize: 500,
      total: 0
    }
  },
  computed: {
    loadFinished: function () {
      return !this.loading && this.total === this.data.length
    }
  },
  created () {
    this.loadTeacherClasses(this.pageSize, this.slideId)
  },
  mounted () {
    window.addEventListener('scroll', this.loadTeacherClassesOnScroll, true)
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
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
      }).finally(() => {
        this.skeletonLoading = false
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

.ant-table-thead > tr > th, .ant-table-tbody > tr > td {
  padding: 5px;
}

.class-header {
  padding-bottom: 16px;
  border-bottom: 1px solid rgb(235, 238, 240);

  .nav-back-btn {
    padding-left: 0;
  }
}

.loading-status {
  display: flex;
  justify-content: center;
  padding: 30px 0 10px 0;

  span {
    color: #aaa;
  }
}

.action-item {
  height: 20px;
  svg {
    width: 20px;
    height: 20px;
  }
}

.action-line {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;
  .action-item {
    padding: 0 5px;
  }
}
</style>
