<template>
  <div class="old-session">
    <div class="session-header">
      <div class="row-title">
        <div class="header-icon" >
          <img src="~@/assets/icons/task/destop.png" />
        </div>
        <div class="title" v-if="mode === 1">Teacher presenting mode</div>
        <div class="title" v-if="mode === 2">Student presenting mode</div>
      </div>
      <div class="description">
        <!--        you can start a new session or check the previous sessions-->
      </div>
      <div class="header-action-item">
        <a-button class="button" :loading="startLoading" @click="handleStartSession" type="primary" >
          <div class="btn-text">
            Start an open session
          </div>
        </a-button>
      </div>
    </div>

    <a-divider>Or</a-divider>

    <div class='tips'>
      <div class='tips-text'>
        <a-icon type="info-circle" /> If you have updated the slides of any task below, you might start the session with the latest slides or join the old session in the <a href='#' @click='showPreviewSessionList'>Previous Session page</a>.
      </div>
    </div>
    <div class="my-class-list">
      <div class="class-list-wrapper">
        <a-table
          rowKey="id"
          :columns="columns"
          :data-source="data"
          :pagination="false"
          :scroll="{ y: 350 }"
          class='my-mini-table'>
          <span slot="dateTime" slot-scope="text">{{ text * 1000 | dayjs1 }} </span>
          <span slot="startTime" slot-scope="text">{{ text | dayjs1 }} </span>
          <span slot="status" slot-scope="status" class="flex-center">
            {{ getStatusFormat(status) }}
          </span>
          <span slot="expireDay" slot-scope="text, record">
            <span v-if="record.responseLimitMode === 0">No expire time</span>
            <span v-if="record.responseLimitMode === 1">{{ record.responseLimitTime * 1000 | dayjs1 }}</span>
            <span v-if="record.responseLimitMode === 2">{{ (record.date + record.responseLimitTime) * 1000 | dayjs1 }}</span>
          </span>
          <span slot="action" class="flex-right" slot-scope="text, record">
            <a-button type="primary" class="flex-center" :loading="record.startLoading" @click="handleStartOrJoin(record)" v-if="record.status === classStatus.scheduled">
              Start
            </a-button>
            <a-button type="primary" class="flex-center" :loading="record.startLoading" @click="handleStartOrJoin(record)" v-else>
              Join
            </a-button>
          </span>
        </a-table>
        <div class="loading" v-if="loading">
          <a-spin />
        </div>
      </div>

    </div>

    <a-modal
      :footer="null"
      v-model="visible">
      <div style="margin:20px;font-size: 20px;">
        This session has ended, reopen it in the <a href="#" @click=showMoalPreviewSessionList >previous session page</a> if you would like to have students join this session.
      </div>
    </a-modal>
  </div>
</template>

<script>
import TvSvg from '@/assets/icons/lesson/tv.svg?inline'
import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'

import { lessonHost, lessonStatus } from '@/const/googleSlide'
import ArchiveSessionIcon from '@/assets/svgIcon/evaluation/ArchiveSession.svg?inline'
import EvaluateIcon from '@/assets/svgIcon/evaluation/Evaluate.svg?inline'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { AddOrUpdateClass } from '@/api/classroom'
import moment from 'moment'
import { EvaluationMixin } from '@/mixins/EvaluationMixin'

export default {
  name: 'OldSessionList',
  components: {
    TvSvg,
    ArchiveSessionIcon,
    EvaluateIcon
  },
  props: {
    sessionList: {
      type: Array,
      default: () => {
        return []
      }
    },
    taskId: {
      type: String,
      required: true
    },
    mode: {
      type: Number,
      default: 1
    }
  },
  mixins: [EvaluationMixin],
  data () {
    return {
      loading: false,
      typeMap: typeMap,
      reviewEvaluationVisible: false,
      currentReviewEvaluationSessionItem: null,
      selectedRowKeys: [],
      columns: [
        {
          title: 'Starting time',
          dataIndex: 'date',
          key: 'dateTime',
          scopedSlots: { customRender: 'dateTime' },
          width: '150px'
        },
        {
          title: 'Scheduled',
          dataIndex: 'sessionStartTime',
          key: 'sessionStartTime',
          scopedSlots: { customRender: 'startTime' },
          width: '150px'
        },
        {
          title: 'Class',
          dataIndex: 'className',
          width: '150px'
        },
        {
          title: 'Status',
          dataIndex: 'status',
          width: '100px',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: 'Code',
          dataIndex: 'classId',
          width: '80px'
        },
        {
          title: 'Expire date',
          key: 'expireDay',
          dataIndex: 'expireDay',
          width: '150px',
          scopedSlots: { customRender: 'expireDay' }
        },
        {
          title: '',
          dataIndex: 'action',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      data: [],
      classStatus: lessonStatus,
      startLoading: false,
      visible: false
    }
  },
  created () {
    this.data = this.sessionList
    this.sessionList.forEach(item => {
      item.startLoading = false
    })
    logger.info('sessionList :', this.data)
  },
  computed: {
    rowSelection () {
      return {
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        onSelection: this.onSelection,
        type: 'radio'
      }
    }
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    handleEnsureSelectData () {
      if (!this.selectedRowKeys || this.selectedRowKeys.length === 0) {
        this.$message.warn('Please select a record')
        return
      }
      const id = this.selectedRowKeys[0]
      const index = this.sessionList.findIndex(session => session.id === id)
      const classId = this.sessionList[index].classId
      this.goToClassPage(classId)
    },

    goToClassPage(classId) {
      const dashUrl = lessonHost + 'd/' + classId + '?token=' + storage.get(ACCESS_TOKEN)
      const url = lessonHost + 't/' + classId + '?token=' + storage.get(ACCESS_TOKEN)
      var height = document.documentElement.clientHeight * 0.7
      var width = document.documentElement.clientWidth * 0.7
      var strWindowFeatures = 'width=' + width + ',height=' + height + ',menubar=yes,location=yes,resizable=yes,scrollbars=true,status=true,top=100,left=200'
      var windowObjectReference
      if (this.mode === 1) {
        windowObjectReference = window.open(
          'about:blank',
          '_blank',
          strWindowFeatures
        )
        windowObjectReference.location = url
        setTimeout(function () {
          window.location.href = dashUrl
        }, 1000)
      } else {
        window.location.href = dashUrl
      }
    },

    handleStartOrJoin (item) {
      this.$logger.info('handleStartOrJoin item :', item)
      if (item.status === this.classStatus.close) {
        this.visible = true
        return
      }
      item.startLoading = true
      const status = this.mode === 1 ? this.classStatus.teacherPaced : this.classStatus.studentPaced
      if (item.status !== status) {
        const data = Object.assign({}, item)
        // 状态需要提交后台处理
        data.status = status
        // 课程开始时间未设置
        if (!data.date) {
          data.date = parseInt(moment.utc(new Date()).toDate().getTime() / 1000)
        }

        // 首次开课初始化评估表数据，然后再创建进入课堂
        this.evaluationForm.className = item.className
        this.evaluationForm.name = item.sessionName
        this.evaluationForm.email = this.$store.getters.userInfo.email
        this.CheckAndCreateTaskSessionEvaluationData(item.classId, this.taskId, () => {
          this.$logger.info('AddOrUpdateClass data :', data)
          AddOrUpdateClass(data).then(response => {
            item.startLoading = false
            this.goToClassPage(item.classId)
          })
        })
      } else {
        this.goToClassPage(item.classId)
        item.startLoading = false
      }
    },

    handleCancelSelectData () {
      this.$emit('cancel')
    },
    handleStartSession () {
      this.startLoading = true
      this.$emit('start-new-session')
    },

    showPreviewSessionList () {
      this.$logger.info('showPreviewSessionList')
      this.$emit('show-preview-session-list')
    },

    showMoalPreviewSessionList () {
      this.showPreviewSessionList()
      this.$emit('cancel')
    },

    handleTeacherProjecting (item) {
      this.$logger.info('handleStartSession', item)
      window.open(lessonHost + 'd/' + item.classId, '_blank')
    },

    handleDashboard (item) {
      this.$logger.info('handleDashboard', item)
      window.open(lessonHost + 'd/' + item.classId, '_blank')
    },
    getStatusFormat (status) {
      if (status === this.classStatus.close) {
        return 'Ended'
      } else if (status === this.classStatus.live || status === this.classStatus.studentPaced) {
        return this.classStatus.studentPaced
      } else if (status === this.classStatus.teacherPaced) {
        return this.classStatus.teacherPaced
      } else {
        return status
      }
    }
  }
}
</script>

<style lang="less" scoped>
.old-session{
  /deep/ .anticon-loading{
    position: absolute;
    top: 10px;
    left: 30px;
  }

  .session-header {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 10px;
    .row-title{
      display: flex;
      justify-content: center;
      flex-direction: row;
      .header-icon {
        height: 29px;
        margin-right: 10px;
        img{
          width: 25px;
          margin-bottom: -10px;
        }
      }

      .title {
        height: 37px;
        font-size: 20px;
        font-family: Arial;
        font-weight: 900;
        line-height: 37px;
        color: #070707;
        opacity: 1
      }
    }
    .description{
      display: flex;
      justify-content: center;
      height: 22px;
      font-family: Arial;
      font-weight: 400;
      line-height: 23px;
      color: #070707;
      opacity: 1;
    }

    .header-action-item {
      display: flex;
      justify-content: center;
      margin-top: 10px;
      .button {
        height: 40px;
        background: #2DC9A4;
        padding: 0px 50px;
        border-radius: 20px;
      }
      .btn-text {
        font-size: 20px;
        font-family: Arial;
        font-weight: 200;
        color: #FFFFFF;
        opacity: 1;
      }
    }
  }

.my-class-list {
  //box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.08);
  opacity: 1;
  //border: 1px solid #D8D8D8;
  border-radius: 6px;
  max-height: 400px;
  margin-top: 10px;
  margin-bottom: 40px;
  overflow-y: auto;
  background: rgba(255, 255, 255, 1);

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
    /deep/ .ant-table-row-cell-break-word{
      text-align: center;
    }
  }
}
}
.modal-ensure-action-line{
  text-align: center;
  margin: 0 auto;
  .action-item{
    font-family: Arial;
    font-weight: 100;
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
