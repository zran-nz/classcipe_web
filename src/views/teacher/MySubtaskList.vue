<template>
  <div class='my-sub-task-list'>
    <fixed-vertical-header>
      <template v-slot:left>
        <a-space>
          <custom-link-text @click='handleGoBack' text='Back'>
            <template v-slot:prefix>
              <a-icon type='left' />
            </template>
          </custom-link-text>
          <a-tooltip placement='leftBottom' v-if="parentTask && parentTask.pageObjects && parentTask.pageObjects.length > 0">
            <template slot='title'>
              The task is more likely to be purchased by other educators if it is simple, clear and focus on specific learning outcome(s).
              So dividing your main task into small sub-tasks with specific tags is always a good idea.
            </template>
            <a-button class='cc-dark-button' @click='handleCreateSubtask' v-if="isOwner">
              Create sub task
            </a-button>
          </a-tooltip>
          <a-tooltip placement='leftBottom' v-else>
            <template slot='title'>
              The task can not be split task without interactive slides, create edit google slides first
            </template>
            <a-button class='cc-dark-button' :disabled="true" v-if="isOwner">
              Create sub task
            </a-button>
          </a-tooltip>
        </a-space>
      </template>
    </fixed-vertical-header>
    <div class='sub-task-container'>
      <a-spin tip='Loading...' :spinning="loading">
        <radio-switch @select="handleSelectStatusType" :menu-list='menuList' :default-selected-item="getSelectItem" />
        <template v-if="subTaskList.length > 0">
          <div class='sub-task-list vertical-left' v-for='content in subTaskList' :key='content.id'>
            <div class='task-item vertical-left'>
              <content-item
                @delete='QuerySubTask'
                :content='content'
                :show-button='true'
                :show-edit='isOwner'
                :show-delete='true'
                :show-schedule='true'
                :show-publish='canPublish'
                :show-sub='false'
                :show-set-price='content.status === 1 && isOwner'
                :is-library="!isOwner"
                @update-publish='handleShowContentPublish'
                :show-archive='statusType === 0'
                :allow-permanent-delete='statusType === 1'
                :show-publish-status='false'/>
            </div>
          </div>
        </template>
        <div v-else style="margin-top: 120px">
          <common-no-data text='No Data Found!' :isBig="true">
            <template v-slot:icon>
              <no-content />
            </template>
          </common-no-data>
        </div>
      </a-spin>
    </div>

    <verification-tip ref="verificationTip" @continue="doUpdatePublish"/>
    <edit-price-dialog :content='currentContent' ref='editPrice' @finish='showPublishTips' v-if='currentContent'/>
  </div>
</template>

<script>
import { QuerySubTask, TaskQueryById } from '@/api/task'
import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FixedVerticalHeader from '@/components/Common/FixedVerticalHeader'
import ContentItem from '@/components/MyContentV2/ContentItem'
import { SESSION_SUB_FLAG, TaskField } from '@/const/common' // SESSION_SHARE_TYPE
import FixedFormFooter from '@/components/Common/FixedFormFooter'
import { getCookie } from '@/utils/util'
import { TEACHER_SECURITY_NOT_SHOW } from '@/store/mutation-types'
import VerificationTip from '@/components/MyContentV2/VerificationTip'
import { UpdateContentStatus } from '@/api/teacher'
import { GoogleAuthCallBackMixin } from '@/mixins/GoogleAuthCallBackMixin'
import { typeMap } from '@/const/teacher'
import EditPriceDialog from '@/components/MyContentV2/EditPriceDialog'
import CustomLinkText from '@/components/Common/CustomLinkText'
import RadioSwitch from '@/components/Common/RadioSwitch'
import CommonNoData from '@/components/Common/CommonNoData'
import NoContent from '@/assets/v2/icons/no_content.svg?inline'

export default {
  name: 'MySubtaskList',
  components: { EditPriceDialog, VerificationTip, FixedFormFooter, ContentItem, FixedVerticalHeader, FixedFormHeader, CustomLinkText, RadioSwitch, CommonNoData, NoContent },
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  mixins: [GoogleAuthCallBackMixin],
  data() {
    return {
      loading: false,
      publishLoading: false,
      menuList: [
        {
          name: 'My Sub-task',
          type: 0
        },
        {
          name: 'Archived',
          type: 1
        }
      ],
      subTaskList: [],
      selectedTaskList: [],
      requiredTaskFields: [
        TaskField.Name,
        TaskField.Image,
        TaskField.Overview,
        TaskField.LearnOuts
      ],
      contentType: typeMap,
      parentTask: null,
      currentContent: null,
      statusType: 0
    }
  },
  computed: {
    getSelectItem() {
      const statusType = sessionStorage.getItem(SESSION_SUB_FLAG) ? parseInt(sessionStorage.getItem(SESSION_SUB_FLAG)) : 0
      const index = this.menuList.findIndex(item => item.type === statusType)
      if (index > -1) {
        return this.menuList[index]
      }
      return this.menuList[0]
    },
    // filterSubTaskList() {
    //   // const flag = sessionStorage.getItem(SESSION_SUB_FLAG) ? parseInt(sessionStorage.getItem(SESSION_SUB_FLAG)) : 0
    //   return this.subTaskList// .filter(item => item.delFlag === flag)
    // },
    canPublish() {
      return this.parentTask && !this.parentTask.originalOwner && this.parentTask.owner.email === this.$store.getters.email
    },
    isOwner() {
      return this.parentTask.owner.email === this.$store.getters.email
    }
  },
  created() {
    if (this.$route.query.subFlag) {
      sessionStorage.setItem(SESSION_SUB_FLAG, this.$route.query.subFlag)
    }
    this.initTask()
  },
  methods: {
    handleGoBack () {
      this.$router.push('/teacher/main/created-by-me')
    },

    initTask() {
      this.loading = true
      TaskQueryById({
        id: this.taskId
      }).then(res => {
        console.info('sub task', res.result)
        if (res.code === 0) {
          this.parentTask = res.result
        }
        this.QuerySubTask()
      }).finally(() => {
      })
    },

    QuerySubTask() {
      this.loading = true
      this.statusType = sessionStorage.getItem(SESSION_SUB_FLAG) ? parseInt(sessionStorage.getItem(SESSION_SUB_FLAG)) : 0
      QuerySubTask({
        parentTaskId: this.taskId,
        delFlag: this.statusType
      }).then(res => {
        console.info('QuerySubTask', res.result)
        if (res.code === 0) {
          this.subTaskList = res.result
          if (this.parentTask.createBy !== this.$store.getters.userInfo.email) {
            this.subTaskList = this.subTaskList.filter(item => item.status === 1)
          }
          if (this.statusType === 1) {
            this.subTaskList.forEach(sub => {
              sub.delFlag = 1
            })
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },

    handleCreateSubtask () {
      this.$router.push({
        path: '/teacher/split-task/' + this.taskId
      })
    },
    handleShowContentPublish(data) {
      console.info('handleShowContentPublish', data)
      this.currentContent = data.content
      if ((this.currentContent.type === this.contentType.task ||
        this.currentContent.type === this.contentType.pd)) {
        if (!this.currentContent.presentationId || this.currentContent.presentationId.startsWith('fake_')) {
          this.$message.warn('There is no PPT slides linked with this task, please create slides before publishing.')
          return
        }
      }
      this.handleUpdatePublish(data)
    },

    handleUpdatePublish(data) {
      const targetStatus = data.status ? 0 : 1
      // 发布的时候需要判断是否有老师认证
      // 没有老师认证的情况下，询问是否需要进行老师认证
      // 勾选不再进行询问时，则不再跳出
      if (targetStatus) {
        const isNotShowSecurity = getCookie(TEACHER_SECURITY_NOT_SHOW)
        if (!isNotShowSecurity) {
          // TODO 查询是否已经进行老师认证
          const isExists = false
          if (!isExists) {
            this.$refs.verificationTip.doCreate()
            return
          }
        }
      }
      this.doUpdatePublish(data)
    },

    doUpdatePublish (data) {
      data = data || this.currentContent
      console.info('handleUpdatePublish', data)
      const index = this.subTaskList.findIndex(item => item.id === data.id)
      if (index !== -1) {
        const targetStatus = data.status ? 0 : 1
        if (targetStatus === 1) {
          this.$nextTick(() => {
            this.$refs.editPrice.showEditPrice()
          })
        } else {
          this.showPublishTips(data)
        }
      } else {
        this.$logger.warn(`no found Update item ${data.id}`)
        this.currentContent = null
      }
    },
    showPublishTips (data) {
      data = data || this.currentContent
      const targetStatus = data.status ? 0 : 1
      const index = this.subTaskList.findIndex(item => item.id === data.id)
      this.loading = true
      UpdateContentStatus({
        id: data.id,
        status: targetStatus,
        type: data.type
      }).then((res) => {
        console.info('handlePublishStatus res', res, 'currentContent', this.currentContent)
        if (res.code === 0) {
          this.subTaskList[index].status = targetStatus
          if (targetStatus === 1) {
            this.$message.success('Publish successfully!')
          } else {
            this.$message.success('Unpublish successfully!')
          }
        } else if (res.code === 520 || res.code === 403) {
          console.info('等待授权回调')
          this.$message.loading('Waiting for Google Slides auth...', 10)
        } else {
          this.$message.error(res.message, 5)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleSelectStatusType(item) {
      sessionStorage.setItem(SESSION_SUB_FLAG, item.type)
      this.QuerySubTask()
    },
    handleDeleteItem (data) {
      const find = this.subTaskList.find(item => item.id === data.id)
      if (find) {
        find.delFlag = !find.delFlag
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.sub-task-container {
  margin-top: 70px;
  height: calc(100vh - 70px);
  padding: 10px 20px;
  overflow-y: auto;
  /deep/ .cc-radio-switch {
    background: transparent;
    margin-bottom: 20px;
  }
  .sub-task-list {
    position: relative;
    background: #fff;
    padding: 0 15px;
    margin-bottom: 15px;
    .checked-icon {
      width: 33px;
      padding-right: 15px;

      .ant-checkbox {
        border: 2px solid #15C39A;
      }
    }

    .action-mask {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      cursor: pointer;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 16px;
      user-select: none;
      border-radius: 5px;
      z-index: 1100;
    }
  }
}

.task-item {
  width: 100%;
}
</style>
