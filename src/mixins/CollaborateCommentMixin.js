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
      originalCommentList: [],
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
  },
  methods: {

    // formatComment () {
    //   /**
    //    * 格式化处理回复数据
    //    * 按rootCommentId进行分组，为空的代表是一个评论组，
    //    * 然后把下面的子评论(rootCommentId相同即为一组)追加到
    //    * subCommentList数组中，按时间排序展示
    //    */
    //   // 过滤rootComment
    //   const fcList = []
    //   this.rootCommentMap = new Map()
    //   this.rawCommentList.forEach(item => {
    //     const dataItem = Object.assign({}, item)
    //     if (!dataItem.commentToId) {
    //       dataItem.subCommentList = []
    //       this.rootCommentMap.set(dataItem.id, dataItem)
    //     }
    //   })
    //   // 追加下面的子讨论列表,按时间排序展示
    //   this.rawCommentList.forEach(item => {
    //     if (item.commentToId) {
    //       if (this.rootCommentMap.has(item.commentToId)) {
    //         const rootComment = this.rootCommentMap.get(item.commentToId)
    //         rootComment.subCommentList.push(item)
    //       } else {
    //         this.$logger.info('no exit rootCommentId ' + item.rootCommentId, this.rootCommentMap)
    //       }
    //     }
    //   })
    //
    //   for (const [rootCommentId, rootComment] of this.rootCommentMap.entries()) {
    //     this.$logger.info('rootCommentId ' + rootCommentId, rootComment)
    //     fcList.push(rootComment)
    //   }
    //   this.addRoot = fcList.length === 0
    //   this.formatCommentList = fcList
    //   this.$logger.info('formatCommentList', this.formatCommentList)
    // },
    formatNewReply() {
      // map转为数组
      this.newComments = []
      this.formatCommentList.forEach((root, index) => {
        console.log(index)
        this.newComments.push({
          commentToId: root.id,
          index: index,
          editing: false,
          content: '',
          sendLoading: false
        })
      })
      this.$logger.info('newComments', this.newComments)
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
        item.subCommentList = []
        this.formatCommentList.unshift(item)
      }).finally(() => {
        this.newComment.sendLoading = false
        this.newComment.editing = false
        this.newComment.content = ''
        this.addRoot = false
        this.$emit('update-comment')
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
      let rootIndex = ''
      const isRoot = !comment.commentToId
      if (!this.field || !isRoot) {
        // 从父节点获取
        rootIndex = this.formatCommentList.findIndex(item => item.id === comment.commentToId)
        comment.fieldName = this.rawCommentList[rootIndex].fieldName
      } else {
        comment.fieldName = this.fieldName
      }
      comment.sourceId = this.sourceId
      comment.sourceType = this.sourceType
      comment.sendLoading = true
      let isAdd = false
      if (!comment.id) {
        isAdd = true
        this.$set(this.newComments, comment.index, comment)
      }
      this.$logger.info('handleSend', comment)
      AddCollaborateComment(comment).then(response => {
        // 减少load时间
        if (isAdd) {
          comment.sendLoading = false
          comment.editing = false
          comment.content = ''
          this.$set(this.newComments, comment.index, comment)
          const newComment = response.result
          if (isRoot) {
            newComment.subCommentList = []
            this.formatCommentList.unshift(newComment)
          } else {
            this.formatCommentList[rootIndex].subCommentList.push(newComment)
          }
        } else {
          comment.sendLoading = false
          comment.editing = false
          if (rootIndex) {
            this.$set(this.formatCommentList, rootIndex, comment)
          } else {
            const index = this.formatCommentList[rootIndex].subCommentList.findIndex(item => item.id === comment.id)
            this.$set(this.formatCommentList[rootIndex], index, comment)
          }
        }
      }).finally(() => {
        this.$emit('update-comment')
      })
    },
    handleDeleteRootCommentConfirm (comment, rootIndex, isDelete) {
      comment.deleteThread = isDelete
      this.$set(this.formatCommentList, rootIndex, comment)
    },
    handleDeleteCommentConfirm (comment, index, rootIndex, isDelete) {
      this.$logger.info('handleDeleteCommentConfirm', comment)
      comment.delete = isDelete
      this.$set(this.formatCommentList[rootIndex].subCommentList, index, comment)
    },
    handleDeleteCommentRoot (comment, rootIndex) {
      this.$logger.info('handleDeleteCommentRoot', comment, rootIndex)
      DeleteCollaborateCommentById(comment).then(response => {
        this.formatCommentList.splice(rootIndex, 1)
      }).finally(() => {
        this.$emit('update-comment')
      })
    },
    // TODO 删除逻辑
    handleDeleteComment (comment, index, rootIndex) {
      this.$logger.info('handleDeleteComment', comment, index, rootIndex)
      DeleteCollaborateCommentById(comment).then(response => {
        this.formatCommentList[rootIndex].subCommentList.splice(index, 1)
      }).finally(() => {
        this.$emit('update-comment')
      })
    },
    cancelDeleteThread(index) {
      this.formatCommentList[index].deleteThread = false
      this.$set(this.formatCommentList, index, this.formatCommentList[index])
      this.removeCommentContent(this.formatCommentList[index], true)
    },
    handleCancelNewComment (comment) {
      this.$logger.info('handleFocusInput')
      comment.editing = false
      if (comment.index && comment.index !== -1) {
        this.$set(this.newComments, comment.index, comment)
      }
    },
    handleEditComment (comment, index, rootIndex) {
      this.$logger.info('handleEditComment', comment)
      comment.editing = !comment.editing
      this.$set(this.formatCommentList[rootIndex].subCommentList, index, comment)
    },
    handleEditCommentRoot (comment, rootIndex) {
      this.$logger.info('handleEditCommentRoot', comment)
      comment.editing = !comment.editing
      this.$set(this.formatCommentList[rootIndex], rootIndex, comment)
    },
    handleFocusInput(comment) {
      this.$logger.info('handleFocusInput')
      comment.editing = true
      this.$set(this.newComments, comment.index, comment)
    }
  }

}
