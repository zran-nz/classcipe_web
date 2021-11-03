<template>
  <div class="old-session">
    <div class="session-header">
      <div class="row-title">
        <div class="header-icon" >
          <img src="~@/assets/icons/task/destop.png" />
        </div>
        <div class="title">Teacher presenting mode</div>
      </div>
      <div class="description">
        you can start a new session or check the previous sessions
      </div>
      <div class="header-action-item">
        <a-button class="button" :loading="startLoading" @click="handleStartSession" type="primary" >
          <div class="btn-text">
            Start a new session
          </div>
        </a-button>
      </div>
    </div>

    <a-divider>Or</a-divider>

    <div class="my-class-list">
      <div class="class-list-wrapper">
        <a-table :columns="columns" :data-source="data" :pagination="false" :row-selection="rowSelection" >
          <span slot="expireDay" slot-scope="text">{{ text * 1000 | dayjs1 }} </span>
          <span slot="dateTime" slot-scope="text">{{ text * 1000 | dayjs }}</span>
        </a-table>
        <div class="loading" v-if="loading">
          <a-spin />
        </div>
      </div>

    </div>

    <div class="modal-ensure-action-line">
      <a-button class="action-item action-cancel" shape="round" @click="handleCancelSelectData">Cancel</a-button>
      <a-button class="action-ensure action-item" type="primary" shape="round" @click="handleEnsureSelectData">Resume</a-button>
    </div>
  </div>
</template>

<script>
import TvSvg from '@/assets/icons/lesson/tv.svg?inline'
import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'

import { lessonHost } from '@/const/googleSlide'
import ArchiveSessionIcon from '@/assets/svgIcon/evaluation/ArchiveSession.svg?inline'
import EvaluateIcon from '@/assets/svgIcon/evaluation/Evaluate.svg?inline'

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
    }
  },
  data () {
    return {
      loading: false,
      startLoading: false,
      typeMap: typeMap,
      reviewEvaluationVisible: false,
      currentReviewEvaluationSessionItem: null,
      selectedRowKeys: [],
      columns: [
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'dateTime',
          scopedSlots: { customRender: 'dateTime' }
        },
        {
          title: 'Class',
          dataIndex: 'className'
        },
        {
          title: 'Code',
          dataIndex: 'classId'
        },
        {
          title: 'Expire day',
          key: 'expireDay',
          dataIndex: 'date',
          scopedSlots: { customRender: 'expireDay' }
        }
      ],
      data: []
    }
  },
  created () {
    this.data = this.sessionList
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
      const targetUrl = lessonHost + 't/' + this.sessionList[this.selectedRowKeys[0]].classId
      this.$logger.info('try open ' + targetUrl)
      // window.open(targetUrl, '_blank')
      // 课堂那边需要点击返回回到表单，改成location.href跳转
      window.location.href = targetUrl
    },
    handleCancelSelectData () {
      this.$emit('cancel')
    },
    handleStartSession () {
      this.startLoading = true
      this.$emit('start-new-session')
    },

    handleTeacherProjecting (item) {
      this.$logger.info('handleStartSession', item)
      window.open(lessonHost + 't/' + item.classId, '_blank')
    },

    handleDashboard (item) {
      this.$logger.info('handleDashboard', item)
      window.open(lessonHost + 'd/' + item.classId, '_blank')
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
      margin: 10px;
      height: 22px;
      font-size: 16px;
      font-family: Arial;
      font-weight: 400;
      line-height: 23px;
      color: #070707;
      opacity: 1;
    }

    .header-action-item {
      display: flex;
      justify-content: center;
      margin: 30px;
      .button {
        height: 40px;
        background: #2DC9A4;
        padding: 0px 50px;
        border-radius: 20px;
      }
      .btn-text {
        height: 31px;
        font-size: 20px;
        font-family: Arial;
        font-weight: 200;
        line-height: 32px;
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
  min-height: 300px;
  max-height: 600px;
  margin-top: 10px;
  margin-bottom: 15px;
  overflow-y: scroll;
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
    padding: 15px 20px;
  }
}
}
.modal-ensure-action-line{
  text-align: center;
  margin: 0 auto;
  .action-item{
    padding: 20px 50px;
    font-size: 20px;
    font-family: Arial;
    font-weight: 100;
    line-height: 0px
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
