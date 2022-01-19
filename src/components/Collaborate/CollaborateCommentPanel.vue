<template>
  <div class="collaborate-comment-panel">
    <div class="add-comment-wrapper" style="box-shadow: 0px 3px 6px rgb(0 0 0 / 16%)" v-if="rawCommentList.length === 0">
      <div class="comment-user-info">
        <div class="avatar">
          <img :src="$store.getters.avatar" />
        </div>
        <div class="user-name">
          {{ $store.getters.nickname }}
        </div>
      </div>
      <div class="comment-input-wrapper">
        <div class="input">
          <input-with-button @cancelComment="cancelComment" @comment="handleComment" :sending="commentSending" />
        </div>
      </div>
    </div>

    <div class="comment-record-wrapper" style="box-shadow: 0px 3px 6px rgb(0 0 0 / 16%)" v-if="rawCommentList.length > 0">
      <div class='delete-thread-mask' v-if="deleteThread">
        <div class="delete-group">
          <div style="color: #fff">
            Delete this comment Thread?
          </div>
          <div class="delete-group-button">
            <div class='upload-text'>
              <a-button shape='round' type='primary' @click="handleDeleteComment(rawCommentList[0])">Delete</a-button>
            </div>
            <div class='upload-text'>
              <a-button shape='round' @click="deleteThread = false">Cancel</a-button>
            </div>
          </div>
        </div>
      </div>
      <div class="record-list" v-for="(commentItem, cIndex) in rawCommentList" :key="cIndex">
        <div class='delete-mask' v-if="commentItem.delete">
          <div class="delete-group">
            <div style="color: #fff">
              Delete this comment?
            </div>
            <div class="delete-group-button">
              <div class='upload-text'>
                <a-button shape='round' type='primary' @click="handleDeleteComment(commentItem,cIndex)" >Delete</a-button>
              </div>
              <div class='upload-text'>
                <a-button shape='round' @click="handleDeleteCommentConfirm(commentItem,cIndex,false)" >Cancel</a-button>
              </div>
            </div>
          </div>
        </div>
        <div class="record-item">
          <template>
            <div class="record-action" v-show="commentItem.username === $store.getters.userInfo.username">
              <div>
                <a-dropdown>
                  <a-icon type="more" style="font-size: 20px;margin-top: 10px;" />
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a @click="handleDeleteCommentConfirm(commentItem,cIndex,true)">
                        <a-icon type="delete" theme="filled" /> Delete
                      </a>
                    </a-menu-item>
                    <a-menu-item>
                      <a @click="handleEditComment(commentItem,cIndex)">
                        <a-icon type="edit" theme="filled" /> Edit
                      </a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </div>
            </div>
            <div class="comment-user-info">
              <div class="avatar">
                <img :src="commentItem.avatar" />
              </div>
              <div class="user-name">
                <div class="name-text"> {{ commentItem.username }}</div>
                <div class="time-text"> {{ commentItem.createdTime | dayjs1 }}</div>
              </div>
            </div>
            <div class="comment-detail" v-if="!commentItem.editing">
              <div class="comment-text">
                {{ commentItem.content }}
              </div>
            </div>
            <div class="comment-input-wrapper" v-if="commentItem.editing">
              <div class="input">
                <input-reply-button @send="handleSend" :comment-item="commentItem" @cancel="handleCancel"/>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="comment-input-wrapper" style="margin-top:10px">
        <div class="input">
          <input-reply-button @send="handleSend" :reply-mode="true" @cancel="handleCancelNewComment" :comment-item="newComment"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import deleteIcon from '@/assets/icons/collaborate/delete.svg?inline'
import InputWithButton from '@/components/Collaborate/InputWithButton'
import { DeleteCollaborateCommentById, AddCollaborateComment } from '@/api/collaborate'
import InputReplyButton from '@/components/Collaborate/InputReplyButton'

export default {
  name: 'CollaborateCommentPanel',
  components: {
    InputWithButton,
    InputReplyButton,
    deleteIcon
  },
  props: {
    commentList: {
      type: Array,
      default: () => []
    },
    sourceId: {
      type: String,
      default: null
    },
    sourceType: {
      type: Number,
      default: null
    },
    fieldName: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      newComment: {
        editing: false,
        content: '',
        sendLoading: false
      },
      deleteThread: false,
      rawCommentList: [],
      deleteCommentModalVisible: false,
      currentDeleteComment: null,
      commentSending: false
    }
  },
  watch: {
    commentList (value) {
      this.$logger.info('commentList update ', value)
      this.rawCommentList = value
      this.rawCommentList.forEach(item => { item.sendLoading = false })
    }
  },
  created () {
    this.$logger.info('CollaborateCommentPanel commentList', this.commentList)
    this.rawCommentList = this.commentList
    this.rawCommentList.forEach(item => { item.sendLoading = false })
  },
  methods: {
    handleSend (comment) {
      if (this.fieldName) {
        comment.fieldName = this.fieldName
      }
      const index = this.rawCommentList.findIndex(item => item.id === comment.id)
      comment.sourceId = this.sourceId
      comment.sourceType = this.sourceType
      let isAdd = false
      comment.sendLoading = true
      this.$set(this.rawCommentList, index, comment)
      if (!comment.id) {
        // 新增
        isAdd = true
        this.newComment.sendLoading = true
        if (this.rawCommentList.length > 0) {
          comment.commentToId = this.rawCommentList[0].id
        }
      }
      this.$logger.info('handleSend', comment)
      AddCollaborateComment(comment).then(response => {
        // 减少load时间
        if (isAdd) {
          this.rawCommentList.push(response.result)
          this.newComment = {}
        }
      }).finally(() => {
        comment.sendLoading = false
        comment.editing = false
        this.newComment.sendLoading = false
        this.$set(this.rawCommentList, index, comment)
      })
    },

    // TODO 删除逻辑
    handleDeleteComment (comment, index) {
      this.$logger.info('handleDeleteComment', comment)
      DeleteCollaborateCommentById(comment).then(response => {
        // 直接删除
        if (comment.commentToId) {
            this.rawCommentList.splice(index, 1)
        } else {
          // 整个删除
          this.$emit('update-comment')
        }
      })
    },
    handleDeleteCommentConfirm (comment, index, isDelete) {
      this.$logger.info('handleDeleteCommentConfirm', comment)
      if (comment.commentToId) {
        comment.delete = isDelete
        this.$set(this.rawCommentList, index, comment)
      } else {
        this.deleteThread = isDelete
      }
    },
    handleEditComment (comment, index) {
      this.$logger.info('handleEditComment', comment)
      comment.editing = !comment.editing
      this.$set(this.rawCommentList, index, comment)
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

    handleCancelNewComment (comment) {
      this.newComment = { editing: false }
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
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.collaborate-comment-panel {
  background-color: #fff;
  padding: 20px;
  z-index: 100;
}
.add-comment-wrapper {
  padding: 20px 15px;
  border-radius: 5px;
  background: rgba(245, 245, 245, 0.5);
  box-shadow: 0px 3px 6px rgb(0 0 0 / 16%);
  background: #FFFFFF;
  border: 1px solid #E8E8E8;
  border-radius: 4px;
  .comment-user-info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    .avatar {
      img {
        width: 35px;
        border-radius: 50%;
      }
    }

    .user-name {
      padding-left: 10px;
      font-size: 18px;
      font-family: Inter-Bold;
      line-height: 24px;
      color: #474747;
    }
  }

  .comment-input-wrapper {
    margin-top: 10px;
    .input {
      //padding-left: 20px;
    }
  }
}

.comment-record-wrapper {
  margin-top: 10px;
  padding: 20px 15px;
  border: 1px solid #E8E8E8;
  max-height: 1000px;
  overflow-y: auto;
  box-shadow: 0px 3px 6px rgb(0 0 0 / 16%);
  background: #FFFFFF;
  border: 1px solid #E8E8E8;
  border-radius: 4px;
  position:relative;

  .record-list {
    position:relative;
    margin-top: 10px;
    border-bottom: 1px solid #D8D8D8;
    .record-item {
      margin-bottom: 10px;
      position: relative;
      .record-action {
        position: absolute;
        cursor: pointer;
        top: 0;
        right: 0;

        .record-delete {
          svg {
            width: 25px;
          }
        }
      }

      .comment-user-info {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .avatar {
          user-select: none;
          img {
            width: 35px;
            border-radius: 50%;
          }
        }

        .user-name {
          display: flex;
          flex-direction: column;
          padding-left: 10px;
          .name-text {
            font-size: 14px;
            font-family: Inter-Bold;
            color: #474747;
          }

          .time-text {
            font-size: 12px;
            font-family: Inter-Bold;
            color: #999;
            line-height: 12px;
          }

        }
      }

      .comment-detail {
        .comment-text {
          padding: 10px 45px 5px  45px ;
          color: #474747;
          line-height: 20px;
        }
      }

      .comment-input-wrapper {
        margin-top: 10px;
        padding-left: 25px;
        .input {
          padding-left: 20px;
        }
      }

      .sub-comment-list-wrapper {
        padding-left: 45px;
        .sub-deleted-comment {
          .sub-deleted-tips {
            padding: 10px;
            border-radius: 5px;
            background-color: #eee;
            font-style: italic;
            color: #999;
          }
        }
      }

      .deleted-comment {
        .deleted-tips {
          padding: 10px;
          border-radius: 5px;
          background-color: #eee;
          font-style: italic;
          color: #999;
        }
      }
    }
    .delete-mask{
      cursor: pointer;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index:99;
      background-color: rgba(0,0,0,0.7);
      .delete-group{
        display: flex;
        flex-direction: column;
        width: 200px;
        text-align: center;
        margin: 0 auto;
        .delete-group-button{
          display: flex;
          width: 200px;
          margin: 0 auto;
          justify-content: space-evenly;
        }
        .upload-text {
          text-align: center;
        }
      }
    }
  }
  .delete-thread-mask{
    cursor: pointer;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index:99;
    background-color: rgba(0,0,0,0.7);
    .delete-group{
      display: flex;
      flex-direction: column;
      width: 200px;
      text-align: center;
      margin: 0 auto;
      .delete-group-button{
        display: flex;
        width: 200px;
        margin: 0 auto;
        justify-content: space-evenly;
      }
      .upload-text {
        text-align: center;
      }
    }
  }
}

</style>
