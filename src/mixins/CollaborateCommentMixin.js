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
      formatCommentList: [],
      deleteThread: false,
      rawCommentList: [],
      deleteCommentModalVisible: false,
      currentDeleteComment: null,
      commentSending: false
    }
  },
  created () {

  },
  computed: {

  },
  methods: {

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
      this.commentSending = true
      this.$logger.info('handleComment', comment)
      AddCollaborateComment(comment).then(response => {
        // 减少load时间
        this.rawCommentList.push(response.result)
      }).finally(() => {
        this.commentSending = false
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
    }
  }

}
