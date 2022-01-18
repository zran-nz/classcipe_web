<template>
  <div class="collaborate-comment-panel">
    <div class="add-comment-wrapper">
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
          <input-with-button @send="handleSend" />
        </div>
      </div>
    </div>
    <div class="comment-record-wrapper">
      <div class="record-list" v-for="(commentItem, cIndex) in rawCommentList" :key="cIndex">
        <div class="record-item">
          <template>
            <div class="record-action" v-show="commentItem.username === $store.getters.userInfo.username">
              <div>
                <a-dropdown>
                  <a-icon type="more" style="font-size: 20px;margin-top: 10px;" />
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a @click="handleDeleteComment(commentItem)">
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
                <div class="time-text"> {{ commentItem.createdTime | dayjs }}</div>
              </div>
            </div>
            <div class="comment-detail" v-if="!commentItem.editing">
              <div class="comment-text">
                {{ commentItem.content }}
              </div>
            </div>
            <div class="comment-input-wrapper" v-if="commentItem.editing">
              <div class="input">
                <input-reply-button @send="handleSend" :reply-mode="true" :comment-item="commentItem" @cancel="handleCancel"/>
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
        content: ''
      },
      rawCommentList: [],
      deleteCommentModalVisible: false,
      currentDeleteComment: null
    }
  },
  watch: {
    commentList (value) {
      this.$logger.info('commentList update ', value)
      this.rawCommentList = value
    }
  },
  created () {
    this.$logger.info('CollaborateCommentPanel commentList', this.commentList)
    this.rawCommentList = this.commentList
  },
  methods: {

    // TODO 评论提交逻辑
    /**
     * 1、评论分两种一种是新建，一种是回复。根据rootCommentId是否为null判断，如果当前
     * 是新增的评论那么rootCommentId为null，如果是回复他人的commentToId、rootCommentId
     * 不为空，且下面所有的回复的rootCommentId都相同，代表在一个评论下面的追加回复。
     * 2、如果有isDelete为true那么显示【该评论已被删除】,不展示数据。
     * 3、后台数据过来后按照rootCommentId为null的数据分组，然后把其他数据追加到各个分组下面，
     * 参考formatComment()逻辑
     * @param data
     */
    handleSend (data) {
      if (!data.inputValue) {
        return
      }
      if (this.fieldName) {
        data.fieldName = this.fieldName
      }
      data.sourceId = this.sourceId
      data.sourceType = this.sourceType
      this.$logger.info('handleSend', data)
      if (!data) {
        this.$message.warn('Please enter some comments!')
      } else {
        AddCollaborateComment(data).then(response => {
          this.$emit('update-comment')
        })
      }
    },

    // TODO 删除逻辑
    handleDeleteComment (comment) {
      this.$logger.info('handleDeleteComment', comment)
      this.currentDeleteComment = null
      if (comment.hasOwnProperty('subCommentList')) {
        this.deleteCommentModalVisible = true
        this.currentDeleteComment = comment
      } else {
        // 非根评论，直接删除
        DeleteCollaborateCommentById(comment).then(response => {
          this.$emit('update-comment')
        })
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
      padding-left: 20px;
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

  .record-list {
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
  }
}

</style>
