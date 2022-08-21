import { GetCollaborateComment, GetCollaborateModifiedHistory, QueryContentCollaborates } from '@/api/collaborate'
import { COLLABORATE, SAVE_CONTENT } from '@/websocket/cmd'
import CollborateMsg from '@/websocket/model/collborateMsg'
import SaveContentMsg from '@/websocket/model/saveContentMsg'
import { isEqualWith } from 'lodash-es'
import { SESSION_CURRENT_PAGE, SESSION_CURRENT_TYPE, SESSION_CURRENT_TYPE_LABEL } from '@/const/common'
import { mapActions, mapGetters, mapState } from 'vuex'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export const RightModule = {
  'collaborate': 1,
  'collaborateComment': 2,
  'imageUpload': 3,
  'customTag': 4,
  'taskDetails': 5,
  'recommend': 6,
  'associate': 7,
  'assessmentToolsLearnOuts': 8 // 评估表关联大纲条
}
export const BaseEventMixin = {
  data () {
    return {
      shareVisible: false,
      shareStatus: 0,
      oldForm: {},
      rightModule: RightModule,
      showModuleList: [RightModule.customTag, RightModule.recommend],
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
      currentCollaborateCommentList: [],
      currentRightModule: null // 当前右侧应该显示的module名称，新版本addTask使用
    }
  },
  watch: {
    needRefreshCollaborate: function (newValue) {
      if (newValue && newValue.indexOf(this.oldForm.id) > -1 && this.isOwner) {
        this.refreshCollaborateAction(false)
        this.handleStartCollaborate()
      }
    },
    changeCollaborate: function (newValue) {
      if (newValue && newValue.indexOf(this.form.id) > -1) {
        this.changeCollaborateAction(false)
        this.$logger.info('need changeCollaborate')
        this.queryContentCollaborates(this.form.id, this.form.type)
      }
    }
  },
  filters: {
    unitLabelName: (defaultName, fieldName, formConfigData) => {
      if (formConfigData && formConfigData.planFieldMap && formConfigData.planFieldMap[fieldName]) {
        return formConfigData.planFieldMap[fieldName]
      } else {
        return defaultName
      }
    },
    unitLabelHint: (defaultName, fieldName, formConfigData) => {
      if (formConfigData && formConfigData.planHintMap && formConfigData.planHintMap[fieldName]) {
        return formConfigData.planHintMap[fieldName]
      } else {
        return defaultName
      }
    },
    taskLabelName: (defaultName, fieldName, formConfigData) => {
      if (formConfigData && formConfigData.taskFieldMap && formConfigData.taskFieldMap[fieldName]) {
        return formConfigData.taskFieldMap[fieldName]
      } else {
        return defaultName
      }
    },
    taskLabelHint: (defaultName, fieldName, formConfigData) => {
      if (formConfigData && formConfigData.taskHintMap && formConfigData.taskHintMap[fieldName]) {
        return formConfigData.taskHintMap[fieldName]
      } else {
        return defaultName
      }
    }
  },
  created () {
    let token = this.$route.query.token
    if (!token) {
      token = storage.get(ACCESS_TOKEN)
    }
    // this.$store.dispatch('loadFormConfigData', token)
  },
  mounted () {
    this.resetWidth()
    window.onresize = () => {
      this.resetWidth()
    }
    window.addEventListener('beforeunload', (e) => this.beforeunloadHandler(e))
    // 重置协同消息提醒数据
    this.receiveSaveContentMsg('')
  },
  destroyed () {
    window.removeEventListener('beforeunload', (e) => this.beforeunloadHandler(e))
  },
  computed: {
    getCollaborateUsers() {
      return function (collaborate) {
        let result = []
        if (collaborate.users) {
          result = [...collaborate.users]
        }
        collaborate.owner.nickName = collaborate.owner.nickname
        result.push(collaborate.owner)
        return result
      }
    },
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
    isEditCollaborater() {
      if (!this.collaborate.users) {
        return false
      }
      const index = this.collaborate.users.findIndex(item => item.email === this.$store.getters.userInfo.email)
      if (index > -1) {
        return this.collaborate.users[index].permissions === 'Edit'
      }
      return false
    },
    canEdit() {
      return false
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
    },
    associateIdTypeList () {
      const idTypeList = []
      if (this.associateUnitPlanIdList) {
        this.associateUnitPlanIdList.forEach(id => {
          idTypeList.push({
            id,
            type: this.$classcipe.typeMap['unit-plan']
          })
        })
      }

      if (this.associateTaskIdList) {
        this.associateTaskIdList.forEach(id => {
          idTypeList.push({
            id,
            type: this.$classcipe.typeMap.task
          })
        })
      }
      return idTypeList
    },
    ...mapGetters({
      vueSocket: 'vueSocket'
    }),
    ...mapState({
      needRefreshCollaborate: state => state.websocket.needRefreshCollaborate,
      removedCollaborate: state => state.websocket.removedCollaborate,
      changeCollaborate: state => state.websocket.changeCollaborate,
      collapsed: state => state.app.sideCollapsed
    })
  },
  methods: {
    ...mapActions(['refreshCollaborateAction', 'changeCollaborateAction', 'removedCollaborateAction', 'receiveSaveContentMsg']),
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
        this.showModuleList = [RightModule.customTag, RightModule.recommend]
      }
    },
    resetRightModuleVisible () {
      this.showModuleList = [RightModule.customTag, RightModule.recommend]
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
      this.$router.push({ path: '/teacher/main/created-by-me' })
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
          this.vueSocket.sendMessageToUsers(COLLABORATE, userIds,
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
          this.vueSocket.sendMessageToUsers(SAVE_CONTENT, userIds,
          SaveContentMsg.convert2SaveContentMsg(contentMsg))
      }
    },

    // 取消comment
    handleCancelComment() {
      this.handleDisplayRightModule()
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
        this.$logger.info('GetCollaborateComment', response)
        if (!response.code) {
          this.collaborateCommentList = response.result
        }
      }).finally(() => {
        this.showHistoryLoading = false
      })
    },
    loadCollaborateData(sourceType, sourceId) {
      this.GetCollaborateModifiedHistory(sourceType, sourceId)
      this.GetCollaborateComment(sourceType, sourceId)
    },
    handleShareStatus (status) {
      this.$logger.info('handleShareStatus', status)
      this.shareStatus = status
    }
  }

}
