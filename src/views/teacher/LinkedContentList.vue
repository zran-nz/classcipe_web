<template>
  <div class='my-sub-task-list'>
    <fixed-vertical-header>
      <template v-slot:left>
        <custom-link-text @click='handleGoBack' text='Back'>
          <template v-slot:prefix>
            <a-icon type='left' />
          </template>
        </custom-link-text>
        <!-- <a-tooltip placement='leftBottom'>
          <template slot='title'>
            The task is more likely to be purchased by other educators if it is simple, clear and focus on specific learning outcome(s).
            So dividing your main task into small sub-tasks with specific tags is always a good idea.
          </template>
          <a-button class='cc-dark-button' @click='handleCreateSubtask'>
            Create sub task
          </a-button>
        </a-tooltip> -->
      </template>
    </fixed-vertical-header>
    <div class='sub-task-container'>
      <div class='sub-task-list vertical-left' v-for='content in subTaskList' :key='content.id'>
        <div class='task-item vertical-left'>
          <content-item
            @delete='loadAssociateData'
            :content='content'
            :show-button='true'
            :show-edit='true'
            :show-delete='true'
            :show-schedule='true'
            :show-publish='true'
            :show-sub='false'
            :show-set-price='content.status === 1'
            @update-publish='handleShowContentPublish'
            :show-publish-status='false'/>
        </div>
      </div>
    </div>

    <verification-tip ref="verificationTip" @continue="doUpdatePublish"/>
    <edit-price-dialog :content='currentContent' ref='editPrice' @finish='showPublishTips' v-if='currentContent'/>
  </div>
</template>

<script>
import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FixedVerticalHeader from '@/components/Common/FixedVerticalHeader'
import ContentItem from '@/components/MyContentV2/ContentItem'
import { TaskField } from '@/const/common'
import FixedFormFooter from '@/components/Common/FixedFormFooter'
import { getCookie } from '@/utils/util'
import { TEACHER_SECURITY_NOT_SHOW } from '@/store/mutation-types'
import VerificationTip from '@/components/MyContentV2/VerificationTip'
import { GetAssociate, UpdateContentStatus } from '@/api/teacher'
import { GoogleAuthCallBackMixin } from '@/mixins/GoogleAuthCallBackMixin'
import { typeMap } from '@/const/teacher'
import EditPriceDialog from '@/components/MyContentV2/EditPriceDialog'
import CustomLinkText from '@/components/Common/CustomLinkText'

export default {
  name: 'LinkedContentList',
  components: { CustomLinkText, EditPriceDialog, VerificationTip, FixedFormFooter, ContentItem, FixedVerticalHeader, FixedFormHeader },
  props: {
    contentId: {
      type: String,
      required: true
    },
    contentType: {
      type: String,
      required: true
    }
  },
  mixins: [GoogleAuthCallBackMixin],
  data() {
    return {
      loading: false,
      publishLoading: false,
      subTaskList: [],
      selectedTaskList: [],
      requiredTaskFields: [
        TaskField.Name,
        TaskField.Image,
        TaskField.Overview,
        TaskField.LearnOuts
      ],
      typeMap: typeMap,
      currentContent: null
    }
  },
  created() {
    this.loadAssociateData()
  },
  methods: {
    handleGoBack () {
      this.$router.push('/teacher/main/created-by-me')
    },
    async loadAssociateData () {
      try {
        const slideData = await GetAssociate({
          id: this.contentId,
          type: this.contentType,
          published: 0
        })
        console.log('loadAssociateData', slideData)
        const list = slideData.result.owner
        this.subTaskList = []
        const taskList = []
        const unitList = []
        list.forEach(item => {
          item.contents.forEach(content => {
            if (content.type === this.$classcipe.typeMap.task) {
              taskList.push(content)
            }

            if (content.type === this.$classcipe.typeMap['unit-plan']) {
              unitList.push(content)
            }
          })
        })
        console.log('taskList', taskList)
        console.log('unitList', unitList)
        if (this.contentType === this.$classcipe.typeMap['unit-plan'] + '') {
          this.subTaskList = [...taskList]
        } else {
          this.subTaskList = [...unitList]
        }
        this.subTaskList = this.subTaskList.filter(content => content.createBy === this.$store.getters.email)
        console.info('sub list', this.subTaskList)
      } catch (e) {
        console.error('loadSlideData', e)
      } finally {
        this.loading = false
      }
    },

    handleCreateSubtask () {
      this.$router.push({
        path: '/teacher/split-task/' + this.contentId
      })
    },
    handleShowContentPublish(data) {
      console.info('handleShowContentPublish', data)
      this.currentContent = data.content
      if ((this.currentContent.type === this.typeMap.task ||
        this.currentContent.type === this.typeMap.pd)) {
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
        this.publishLoading = true
        UpdateContentStatus({
          id: data.id,
          status: targetStatus,
          type: data.type
        }).then((res) => {
          if (res.code === 520 || res.code === 403) {
            console.info('等待授权回调')
            this.$message.loading('Waiting for Google Slides auth...', 10)
            return
          }
          console.info('handlePublishStatus res', res, 'currentContent', this.currentContent)
          this.subTaskList[index].status = targetStatus
          if (targetStatus) {
            this.$refs.editPrice.showEditPrice()
          } else {
            this.$message.success('Unpublish successfully!')
          }
        }).finally(() => {
          this.publishLoading = false
        })
      } else {
        this.$logger.warn(`no found Update item ${data.id}`)
        this.currentContent = null
      }
    },
    showPublishTips () {
      this.$message.success('Publish successfully!')
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
