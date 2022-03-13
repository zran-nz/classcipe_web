<template>
  <div class="collaborate-comment-panel">
    <a-tooltip v-if="formatCommentList.length > 0" title="Add comment" placement="right"><add-green-icon class='add-icon' @click="addRootComment"/></a-tooltip>
    <div class="add-comment-wrapper" v-if="addRoot" style="box-shadow: 0px 3px 6px rgb(0 0 0 / 16%)" >
      <div class="comment-user-info">
        <div class="avatar">
          <img :src="$store.getters.avatar" />
        </div>
        <div class="user-name">
          {{ $store.getters.nickname }}
        </div>
      </div>
      <div class="comment-input-wrapper">
        <div class="comment-input">
          <input-with-button :collaborate-user-list="collaborateUserList" :comment-item="newComment" @cancelComment="cancelComment" @comment="handleComment" :sending="newComment.sendLoading" />
        </div>
      </div>
    </div>
    <div class="root-comment" style=" box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px;" v-for="(rootComment,rootIndex) in formatCommentList" :key="rootIndex">
      <div class="comment-record-wrapper" style="box-shadow: 0px 3px 6px rgb(0 0 0 / 16%)">
        <div class='delete-thread-mask' v-if="rootComment.deleteThread">
          <div class="delete-group">
            <div style="color: #fff;margin: 5px;">
              Delete this comment Thread?
            </div>
            <div class="delete-group-button">
              <div class='upload-text'>
                <a-button shape='round' type='primary' @click="handleDeleteCommentRoot(rootComment,rootIndex)">Delete</a-button>
              </div>
              <div class='upload-text'>
                <a-button shape='round' @click="cancelDeleteThread(rootIndex)">Cancel</a-button>
              </div>
            </div>
          </div>
        </div>
        <div class="record-list" :key="-1">
          <div class="record-item">
            <template>
              <div class="record-action" v-show="rootComment.username === $store.getters.userInfo.username">
                <div style="margin-right: 20px;font-size: 18px;margin-top: 8px;" @click="handleMarked(rootComment,rootIndex)">
                  <a-tooltip placement="bottom" title="Marked as resolved and hide this discussion">
                    <a-icon type="check" />
                  </a-tooltip>
                </div>
                <div>
                  <a-dropdown>
                    <a-icon type="more" style="font-size: 20px;margin-top: 10px;" />
                    <a-menu slot="overlay">
                      <a-menu-item>
                        <a @click="handleDeleteRootCommentConfirm(rootComment,rootIndex,true)">
                          <a-icon type="delete" theme="filled" /> Delete
                        </a>
                      </a-menu-item>
                      <a-menu-item>
                        <a @click="handleEditCommentRoot(rootComment,rootIndex)">
                          <a-icon type="edit" theme="filled" /> Edit
                        </a>
                      </a-menu-item>
                    </a-menu>
                  </a-dropdown>
                </div>
              </div>
              <div class="comment-user-info">
                <div class="avatar">
                  <img :src="rootComment.avatar" />
                </div>
                <div class="user-name">
                  <div class="name-text"> {{ rootComment.username }}</div>
                  <div class="time-text"> {{ rootComment.createdTime | dayComment }}</div>
                </div>
              </div>
              <div class="comment-detail" v-if="!rootComment.editing">
                <div class="comment-text">
                  {{ rootComment.content }}
                </div>
              </div>
              <div class="comment-input-wrapper" v-if="rootComment.editing">
                <div class="comment-input">
                  <input-reply-button :collaborate-user-list="collaborateUserList" @send="handleSend" :comment-item="rootComment" @cancel="handleCancel" :sending="rootComment.sendLoading" />
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="record-list" v-for="(commentItem, cIndex) in rootComment.subCommentList" :key="cIndex">
          <div class='delete-mask' v-if="commentItem.delete">
            <div class="delete-group">
              <div style="color: #fff;margin: 5px;">
                Delete this comment?
              </div>
              <div class="delete-group-button">
                <div class='upload-text'>
                  <a-button shape='round' type='primary' @click="handleDeleteComment(commentItem,cIndex,rootIndex)" >Delete</a-button>
                </div>
                <div class='upload-text'>
                  <a-button shape='round' @click="handleDeleteCommentConfirm(commentItem,cIndex,rootIndex,false)" >Cancel</a-button>
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
                        <a @click="handleDeleteCommentConfirm(commentItem,cIndex,rootIndex,true)">
                          <a-icon type="delete" theme="filled" /> Delete
                        </a>
                      </a-menu-item>
                      <a-menu-item>
                        <a @click="handleEditComment(commentItem,cIndex,rootIndex)">
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
                  <div class="time-text"> {{ commentItem.createdTime | dayComment }}</div>
                </div>
              </div>
              <div class="comment-detail" v-if="!commentItem.editing">
                <div class="comment-text">
                  {{ commentItem.content }}
                </div>
              </div>
              <div class="comment-input-wrapper" v-if="commentItem.editing">
                <div class="comment-input">
                  <input-reply-button :collaborate-user-list="collaborateUserList" @send="handleSend" :comment-item="commentItem" @cancel="handleCancel" :sending="commentItem.sendLoading" />
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="comment-input-wrapper" style="margin-top:10px">
          <div class="comment-input">
            <input-reply-button
              :collaborate-user-list="collaborateUserList"
              @send="handleSend"
              @cancel="handleCancelNewComment"
              :sending="newComments[rootIndex].sendLoading"
              :comment-item="newComments[rootIndex]"
              @focusInput="handleFocusInput"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { CollaborateCommentMixin } from '@/mixins/CollaborateCommentMixin'
import AddGreenIcon from '@/assets/svgIcon/evaluation/form/tianjia_green.svg?inline'

export default {
  name: 'CollaborateCommentPanel',
  components: {
    AddGreenIcon
  },
  mixins: [CollaborateCommentMixin],
  props: {
    commentList: {
      type: Array,
      default: () => []
    },
    collaborateUserList: {
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

    }
  },
  watch: {
    commentList (value) {
      this.$logger.info('CollaborateCommentPanel commentList', value)
      this.rawCommentList = []
      value.forEach(item => {
        item.sendLoading = false
        if (!item.isDelete && this.fieldName === item.fieldName) {
          this.rawCommentList.push(item)
        }
      })
      this.formatCommentList = this.rawCommentList
      this.addRoot = this.formatCommentList.length === 0
      this.$logger.info('formatCommentList', this.formatCommentList)
      this.formatNewReply()
    }
  },
  computed: {

  },
  created () {
    this.$logger.info('CollaborateCommentPanel commentList', this.commentList)
    this.originalCommentList = this.commentList
    this.rawCommentList = []
    this.commentList.forEach(item => {
      item.sendLoading = false
      if (!item.isDelete && this.fieldName === item.fieldName) {
        this.rawCommentList.push(item)
      }
    })
    this.$logger.info('rawCommentList', this.rawCommentList)
    this.formatCommentList = this.rawCommentList
    this.addRoot = this.formatCommentList.length === 0
    this.$logger.info('formatCommentList', this.formatCommentList)
    this.formatNewReply()
  },
  methods: {
    addRootComment() {
      this.addRoot = true
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
  position:relative;
  svg.add-icon {
    top: -10px;
    position: absolute;
    left: 20px;
    cursor: pointer;
    width: 20px;
  }
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
        display: flex;
        align-items: center;

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
        .comment-input {
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
