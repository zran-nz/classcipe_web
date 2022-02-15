import { AddCollaborateComment, DeleteCollaborateCommentById } from '@/api/collaborate'
import InputWithButton from '@/components/Collaborate/InputWithButton'
import InputReplyButton from '@/components/Collaborate/InputReplyButton'
import deleteIcon from '@/assets/icons/collaborate/delete.svg'
export const CollaborateCommentMixin = {
  components: {
    InputWithButton,
    InputReplyButton,
    deleteIcon
  },
  data () {
    return {
      newComments: [],
      rootCommentMap: new Map(),
      formatCommentList: [],
      deleteThread: false,
      rawCommentList: [],
      deleteCommentModalVisible: false,
      currentDeleteComment: null,
      commentSending: false,
      addRoot: false,
      newComment: {
        editing: false,
        content: '',
        sendLoading: false
      }
    }
  },
  created () {

  },
  computed: {
    getCommentList () {
      return function (rawCommentList) {
        const res = []
        res.push(rawCommentList)
        // rawCommentList.subCommentList.sort((a, b) =>
        //   new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime())
        rawCommentList.subCommentList.forEach(item => {
          res.push(item)
        })
        return res
      }
    }
  },
  methods: {

    formatComment () {
      /**
       * 格式化处理回复数据
       * 按rootCommentId进行分组，为空的代表是一个评论组，
       * 然后把下面的子评论(rootCommentId相同即为一组)追加到
       * subCommentList数组中，按时间排序展示
       */
      // 过滤rootComment
      this.formatCommentList = []
      this.rootCommentMap = new Map()
      this.rawCommentList.forEach(item => {
        const dataItem = Object.assign({}, item)
        if (!dataItem.commentToId) {
          dataItem.subCommentList = []
          this.rootCommentMap.set(dataItem.id, dataItem)
        }
      })
      // 追加下面的子讨论列表,按时间排序展示
      this.rawCommentList.forEach(item => {
        if (item.commentToId) {
          if (this.rootCommentMap.has(item.commentToId)) {
            const rootComment = this.rootCommentMap.get(item.commentToId)
            rootComment.subCommentList.push(item)
          } else {
            this.$logger.info('no exit rootCommentId ' + item.rootCommentId, this.rootCommentMap)
          }
        }
      })
      // map转为数组
      this.newComments = []
      let newCommentIndex = 0
      for (const [rootCommentId, rootComment] of this.rootCommentMap.entries()) {
        this.$logger.info('rootCommentId ' + rootCommentId, rootComment)
        this.formatCommentList.push(rootComment)
        this.newComments.push({
          commentToId: rootCommentId,
          index: newCommentIndex,
          editing: false,
          content: '',
          sendLoading: false
        })
        newCommentIndex++
      }
      this.$logger.info('formatCommentList', this.formatCommentList)
    },

    handleCancel (comment) {
      this.$logger.info('handleCancel', comment)
      comment.editing = false
      var index = this.rawCommentList.findIndex(item => item.id === comment.id)
      if (index !== -1) {
        this.$set(this.rawCommentList, index, comment)
      }
    },
    handleComment(inputValue) {
      const comment = {}
      if (this.fieldName) {
        comment.fieldName = this.fieldName
      }
      comment.sourceId = this.sourceId
      comment.sourceType = this.sourceType
      comment.content = inputValue
      this.newComment.sendLoading = true
      this.$logger.info('handleComment', comment)
      AddCollaborateComment(comment).then(response => {
        // 减少load时间
        // this.rawCommentList.push(response.result)
        const item = response.result
        item.subCommentList = []
        // 添加到第一个
        this.newComments.unshift({
          commentToId: item.id,
          index: 0,
          editing: false,
          content: '',
          sendLoading: false
        })
        this.newComments.forEach((comment, i) => {
          comment.index = i
        })
        this.formatCommentList.unshift(item)
      }).finally(() => {
        this.newComment.sendLoading = false
        this.newComment.editing = false
        this.newComment.content = ''
        this.addRoot = false
        this.$emit('update-comment')
        // this.formatComment()
      })
    },
    cancelComment () {
      this.$emit('cancel-comment')
    },

    handleCancelDelete () {
      this.$logger.info('handleCancelDelete')
      this.deleteCommentModalVisible = false
      this.currentDeleteComment = null
    },

    handleEnsureDelete () {
      this.$logger.info('')
      this.deleteCommentModalVisible = false
      DeleteCollaborateCommentById(this.currentDeleteComment).then(response => {
        this.$emit('update-comment')
        this.currentDeleteComment = null
      })
    },
    handleSend (comment) {
      if (!this.fieldName) {
        // 从父节点获取
        var parentIndex = this.rawCommentList.findIndex(item => item.id === comment.commentToId)
        comment.fieldName = this.rawCommentList[parentIndex].fieldName
      } else {
        comment.fieldName = this.fieldName
      }
      const index = this.rawCommentList.findIndex(item => item.id === comment.id)
      comment.sourceId = this.sourceId
      comment.sourceType = this.sourceType
      comment.sendLoading = true
      let isAdd = false
      if (!comment.id) {
        isAdd = true
        this.$set(this.newComment, comment.index, comment)
      }
      this.$logger.info('handleSend', comment)
      AddCollaborateComment(comment).then(response => {
        // 减少load时间
        if (isAdd) {
          this.rawCommentList.push(response.result)
          comment.sendLoading = false
          comment.editing = false
          comment.content = ''
          this.$set(this.newComments, comment.index, comment)
        } else {
          comment.sendLoading = false
          comment.editing = false
          this.$set(this.rawCommentList, index, comment)
        }
      }).finally(() => {
        this.formatComment()
        this.$emit('update-comment')
      })
    },
    handleDeleteCommentConfirm (comment, index, rootIndex, isDelete) {
      this.$logger.info('handleDeleteCommentConfirm', comment)
      if (index > 0) {
        comment.delete = isDelete
        this.$set(this.formatCommentList[rootIndex].subCommentList, index - 1, comment)
      } else {
        const formatComment = this.formatCommentList[rootIndex]
        formatComment.deleteThread = true
        this.$set(this.formatCommentList, rootIndex, comment)
      }
    },
    handleDeleteCommentRoot (comment, rootIndex) {
      this.$logger.info('handleDeleteComment', comment, rootIndex)
      DeleteCollaborateCommentById(comment).then(response => {
        this.$emit('update-comment')
      }).finally(() => {
        this.formatCommentList.splice(rootIndex, 1)
        const firstIndex = this.rawCommentList.findIndex(item => item.id === comment.id)
        if (firstIndex !== -1) {
          this.rawCommentList.splice(firstIndex, 1)
        }
        comment.subCommentList.forEach(item => {
          const index = this.rawCommentList.findIndex(sub => sub.commentToId === item.id)
          if (index > -1) {
            this.rawCommentList.splice(index, 1)
          }
        })
      })
    },
    // TODO 删除逻辑
    handleDeleteComment (comment, index, rootIndex) {
      this.$logger.info('handleDeleteComment', comment, index, rootIndex)
      DeleteCollaborateCommentById(comment).then(response => {
        this.$emit('update-comment')
      }).finally(() => {
        this.formatCommentList[rootIndex].subCommentList.splice(index - 1, 1)
        const rindex = this.rawCommentList.findIndex(item => item.id === comment.id)
        this.rawCommentList.splice(rindex, 1)
      })
    },
    cancelDeleteThread(index) {
      this.formatCommentList[index].deleteThread = false
      this.$set(this.formatCommentList, index, this.formatCommentList[index])
    },
    handleCancelNewComment (comment) {
      this.$logger.info('handleFocusInput')
      comment.editing = false
      // var index = this.newComment.findIndex(item => item.id === comment.id)
      // if (index !== -1) {
      //   this.$set(this.newComment, index, comment)
      // }
    },
    handleEditComment (comment, index, rootIndex) {
      this.$logger.info('handleEditComment', comment)
      comment.editing = !comment.editing
      this.$set(this.formatCommentList[rootIndex].subCommentList, index - 1, comment)
    },
    handleFocusInput(comment) {
      this.$logger.info('handleFocusInput')
      comment.editing = true
      this.$set(this.newComments, comment.index, comment)
    }
  }

}
