import { GetCollaborateComment, GetCollaborateModifiedHistory, QueryContentCollaborates } from '@/api/collaborate'
import { COLLABORATE, SAVE_CONTENT } from '@/websocket/cmd'
import CollborateMsg from '@/websocket/model/collborateMsg'
import SaveContentMsg from '@/websocket/model/saveContentMsg'
import { isEqualWith } from 'lodash-es'
import { SESSION_CURRENT_PAGE, SESSION_CURRENT_TYPE, SESSION_CURRENT_TYPE_LABEL } from '@/const/common'

export const RightModule = {
  'collaborate': 1,
  'collaborateComment': 2,
  'imageUpload': 3,
  'customTag': 4,
  'taskDetails': 5,
  'recommend': 6
}
export const BaseEventMixin = {
  data () {
    return {
      oldForm: {},
      rightModule: RightModule,
      showModuleList: [RightModule.imageUpload, RightModule.customTag, RightModule.recommend],
      rightWidth: 600,
      leftWidth: 730,
      collaborate: {},
      initCompleted: false,
      updateContentVisible: false,
      defaultHistoryKey: '1',
      showCollaborateModalVisible: false,
      collaborateContent: null,
      currentFieldName: {},
      historyList: [],
      collaborateCommentList: [],
      currentCollaborateCommentList: []
    }
  },
  watch: {
  },
  created () {
  },
  mounted () {
    this.resetWidth()
    window.onresize = () => {
      this.resetWidth()
    }
    window.addEventListener('beforeunload', (e) => this.beforeunloadHandler(e))
    // 重置协同消息提醒数据
    this.$store.getters.vueSocket.sendAction('receiveSaveContentMsg', '')
  },
  destroyed () {
    window.removeEventListener('beforeunload', (e) => this.beforeunloadHandler(e))
  },
  computed: {
    isOwner () {
      if (!this.oldForm) {
        return false
      }
      return this.$store.getters.userInfo.email === this.oldForm.createBy
    },
    isCollaborater () {
      if (!this.collaborate.users) {
        return false
      }
      const index = this.collaborate.users.findIndex(item => item.email === this.$store.getters.userInfo.email)
      return index > -1
    },
    canEdit() {
      return this.isOwner || this.isCollaborater
    },
    showRightModule () {
      return function (module) {
        if (this.showModuleList.indexOf(module) > -1) {
          return true
        }
        return false
      }
    },
    showUpdateContent() {
      const contentMsg = this.$store.state.websocket.saveContentMsg
      console.log(contentMsg)
      if (contentMsg && contentMsg.content.id === this.form.id) {
        console.log(JSON.stringify(contentMsg.content.details))
        // 默认updateTime和grade不更新
        contentMsg.content.details.updateTime = this.oldForm.updateTime
        contentMsg.content.details.gradeId = this.oldForm.gradeId
        if (contentMsg.hideUpdate) {
          return false
        } else if (!isEqualWith(contentMsg.content.details, this.oldForm)) {
          return true
        }
        return false
      } else {
        return false
      }
    }
  },
  methods: {
    setRightModuleVisible (module) {
      if (module === this.rightModule.collaborate) {
        this.showModuleList = [RightModule.collaborate]
      } else if (module === this.rightModule.collaborateComment) {
        this.showModuleList = [RightModule.collaborateComment]
      } else if (module === this.rightModule.customTag) {
        this.showModuleList = [RightModule.customTag]
      } else if (module === this.rightModule.taskDetails) {
        this.showModuleList = [RightModule.taskDetails]
      } else if (module === this.rightModule.recommend) {
        this.showModuleList = [RightModule.recommend]
      } else {
        this.showModuleList = [RightModule.imageUpload, RightModule.customTag, RightModule.recommend]
      }
    },
    resetRightModuleVisible () {
      this.showModuleList = [RightModule.imageUpload, RightModule.customTag, RightModule.recommend]
    },
    beforeunloadHandler (event) {
      // debugger
      this.$logger.info('beforeunloadHandler ', this.$route.name)
      if (this.$route.name === 'AddTask' || this.$route.name === 'UnitPlan') {
        event = event || window.event
        if (event) {
          event.returnValue = 'alert'
        }
        // debugger
        return 'alert'
      }
    },
    resetWidth () {
      if (document.body.clientWidth < 1400) {
        this.rightWidth = 480
        this.leftWidth = 550
      } else {
        this.rightWidth = 600
        this.leftWidth = 720
      }
    },
    queryContentCollaborates (id, type) {
      this.collaborate = {}
      QueryContentCollaborates({ id: id, type: type }).then(response => {
        this.$logger.info('QueryContentCollaborates response:', response)
        if (response.success) {
          this.collaborate = response.result
        }
      })
    },
    confirmSelectCollaborateUsers (data) {
      this.collaborate = data
    },
    handleBack () {
      this.$logger.info('handleBack')
      if (this.isOwner) {
        this.$router.push({ path: '/teacher/main/created-by-me' })
      } else if (this.isCollaborater) {
        this.$router.push({ path: '/teacher/main/shared' })
      } else {
        this.$router.push({ path: '/teacher/main/created-by-me' })
      }
    },
    handleCollaborateEvent(formId, fieldName, inputValue) {
      const collaborate = new CollborateMsg()
      collaborate.id = formId
      collaborate.fieldName = fieldName
      collaborate.inputValue = inputValue
      const userIds = this.collaborate.users.filter(user => user.userId !== this.$store.getters.userInfo.id)
        .map(item => { return item.userId })
      if (!this.isOwner) {
          // 通知owner
          if (userIds.indexOf(this.collaborate.owner.id) === -1) {
            userIds.push(this.collaborate.owner.id)
          }
      }
      if (userIds.length > 0) {
        this.$store.getters.vueSocket.sendMessageToUsers(COLLABORATE, userIds,
          CollborateMsg.convert2CollborateMsg(collaborate))
      }
    },

    handleSaveContentEvent(id, type, contentData) {
      const contentMsg = new SaveContentMsg()
      contentMsg.id = id
      contentMsg.type = type
      contentMsg.details = contentData
      const userIds = this.collaborate.users.filter(user => user.userId !== this.$store.getters.userInfo.id)
        .map(item => { return item.userId })
      if (!this.isOwner) {
        // 通知owner
        if (userIds.indexOf(this.collaborate.owner.id) === -1) {
          userIds.push(this.collaborate.owner.id)
        }
      }
      if (userIds.length > 0) {
        this.$store.getters.vueSocket.sendMessageToUsers(SAVE_CONTENT, userIds,
          SaveContentMsg.convert2SaveContentMsg(contentMsg))
      }
    },

    // 取消comment
    handleCancelComment() {
      this.resetRightModuleVisible()
      this.currentFieldName = ''
    },
    handleStartCollaborate() {
      this.$logger.info('handleStartCollaborate')
      this.collaborateContent = Object.assign({}, this.form)
      this.showCollaborateModalVisible = true
    },
    cleaPageCache() {
      // del cache
      sessionStorage.removeItem(SESSION_CURRENT_PAGE)
      sessionStorage.removeItem(SESSION_CURRENT_TYPE_LABEL)
      sessionStorage.removeItem(SESSION_CURRENT_TYPE)
    },

    // 加载协作的评论和历史记录数据
    GetCollaborateModifiedHistory(sourceType, sourceId) {
      GetCollaborateModifiedHistory({ sourceType: sourceType, sourceId: sourceId }).then(response => {
        this.historyList = []
        this.$logger.info('GetCollaborateModifiedHistory', response)
        if (!response.code) {
          this.historyList = response.result
        }
      })
    },
    GetCollaborateComment(sourceType, sourceId) {
      GetCollaborateComment({ sourceType: sourceType, sourceId: sourceId }).then(response => {
        this.collaborateCommentList = []
        this.$logger.info('GetCollaborateComment', response)
        if (!response.code) {
          this.collaborateCommentList = response.result
        }
      }).finally(() => {
        this.showHistoryLoading = false
        const list = []
        this.collaborateCommentList.forEach(item => {
          if (item.fieldName === this.currentFieldName) {
            list.push(item)
          }
        })
        this.currentCollaborateCommentList = list
        this.$logger.info('currentCollaborateCommentList', list)
      })
    },
    loadCollaborateData(sourceType, sourceId) {
      this.GetCollaborateModifiedHistory(sourceType, sourceId)
      this.GetCollaborateComment(sourceType, sourceId)
    }
  }

}
