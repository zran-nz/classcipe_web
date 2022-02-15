<template>
  <div class="all-collaborate-comment-view">
    <div class="filter-line">
      <div class="filter-name">
        <a-input v-model="filterName" size="large" placeholder="Search teacher name" @change="handleFilterNameChange"/>
      </div>
      <div class="filter-type">
        <div class="type-filter">
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item @click="toggleType(0, 'All')">
                <span>All</span>
              </a-menu-item>
              <a-menu-item @click="toggleType(1, 'My')">
                <span>My</span>
              </a-menu-item>
            </a-menu>
            <a-button
              class="type-filter-button"
              style="padding: 0 30px; border-color: #D8D8D8; display:flex; align-items:center ;height: 40px;border-radius: 6px;background: #FFFFFF;font-family: Inter-Bold;color: #182552;">
              <span v-if="currentTypeLabel">{{ currentTypeLabel }}</span> <span v-else>Choose type(s)of content</span>
              <a-icon type="caret-down" /> </a-button>
          </a-dropdown>
        </div>
      </div>
    </div>
    <div class="root-comment" style=" box-shadow: rgb(0 0 0 / 16%) 0px 3px 6px;" v-for="(rootComment,rootIndex) in formatCommentList" :key="rootIndex">
      <div class="root-comment-tab">Selected element | {{ getFieldDisplayName(rootComment.fieldName) }}
        <div style="float: right;" v-if="rootComment.isDelete"><a-tag color="cyan">Marked as read</a-tag></div>
      </div>
      <div class="comment-record-wrapper">
        <div class='delete-thread-mask' v-if="rootComment.deleteThread">
          <div class="delete-group">
            <div style="color: #fff;margin: 5px;">
              Delete this comment Thread?
            </div>
            <div class="delete-group-button">
              <div class='upload-text'>
                <a-button shape='round' type='primary' @click="handleDeleteComment(rootComment,rootIndex)">Delete</a-button>
              </div>
              <div class='upload-text'>
                <a-button shape='round' @click="cancelDeleteThread(rootIndex)">Cancel</a-button>
              </div>
            </div>
          </div>
        </div>
        <div class="record-list" v-for="(commentItem, cIndex) in getCommentList(rootComment)" :key="cIndex">
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
                <div class="input">
                  <input-reply-button :collaborate-user-list="collaborateUserList" @send="handleSend" :comment-item="commentItem" @cancel="handleCancel" />
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="comment-input-wrapper" style="margin-top:10px">
          <div class="input">
            <input-reply-button
              :collaborate-user-list="collaborateUserList"
              @send="handleSend"
              :reply-mode="true"
              @cancel="handleCancelNewComment"
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
import { PlanFieldDisplayName, TaskFieldDisplayName } from '@/const/common'
import { typeMap } from '@/const/teacher'

export default {
  name: 'CollaborateCommentView',
  components: {
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
    }
  },
  data () {
    return {
      deleteCommentModalVisible: false,
      currentDeleteComment: null,
      filterName: null,
      currentType: 0, // 0-All 1-My
      currentTypeLabel: 'All'
    }
  },
  computed: {
    getFieldDisplayName() {
      return function (field) {
        if (this.sourceType === typeMap.task) {
          return TaskFieldDisplayName[field]
        } else if (this.sourceType === typeMap['unit-plan']) {
          return PlanFieldDisplayName[field]
        } else {
          return field
        }
      }
    }

  },
  watch: {
    commentList (value) {
      this.$logger.info('commentList update ', value)
      this.rawCommentList = value
      this.rawCommentList.forEach(item => { item.sendLoading = false })
      // this.formatComment()
    }
  },
  created () {
    this.$logger.info('CollaborateCommentPanel commentList', this.commentList)
    this.rawCommentList = this.commentList
    this.rawCommentList.forEach(item => { item.sendLoading = false })
    this.formatComment()
  },
  methods: {

    // 按姓名过滤评论
    handleFilterNameChange (name) {
      let fName = this.filterName
      if (name && typeof name === 'string') {
        fName = name
      }
      this.$logger.info('handleFilterNameChange', fName, this.rootCommentMap)
      this.formatCommentList = []
      if (this.currentType === 0) {
        for (const [rootCommentId, rootComment] of this.rootCommentMap.entries()) {
          this.$logger.info('rootCommentId ' + rootCommentId, rootComment)
          let isInvolvedMe = false
          if (rootComment.username && rootComment.username.toLowerCase().indexOf(fName.toLowerCase()) !== -1) {
            isInvolvedMe = true
          } else {
            rootComment.subCommentList.forEach(item => {
              if (item.username && item.username.toLowerCase().indexOf(fName.toLowerCase()) !== -1) {
                isInvolvedMe = true
              }
            })
          }

          if (isInvolvedMe) {
            this.formatCommentList.push(rootComment)
          }
        }
      } else {
        for (const [rootCommentId, rootComment] of this.rootCommentMap.entries()) {
          this.$logger.info('rootCommentId ' + rootCommentId, rootComment)
          let isInvolvedMe = false
          if (rootComment.username === this.$store.getters.userInfo.username && (rootComment.username && rootComment.username.toLowerCase().indexOf(fName.toLowerCase()) !== -1)) {
            isInvolvedMe = true
          } else {
            rootComment.subCommentList.forEach(item => {
              if (item.username === this.$store.getters.userInfo.username && (item.username && item.username.toLowerCase().indexOf(fName.toLowerCase()) !== -1)) {
                isInvolvedMe = true
              }
            })
          }

          if (isInvolvedMe) {
            this.formatCommentList.push(rootComment)
          }
        }
        this.$logger.info('formatCommentList', this.formatCommentList)
      }
    },

    toggleType (type, label) {
      this.$logger.info('toggleType ' + type + ' label ' + label)
      this.currentType = type
      this.currentTypeLabel = label
      this.formatCommentList = []
      if (this.currentType === 0) {
        this.formatComment()
      } else {
        this.handleFilterNameChange(this.$store.getters.userInfo.username)

        this.$logger.info('formatCommentList', this.formatCommentList)
      }
    }

  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.all-collaborate-comment-view {
  padding: 20px;
  z-index: 100;
  max-height: 1200px;
  overflow-y: auto;

  .filter-line {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .filter-name {
      width: 76%;
    }

    .filter-type {
      width: 22%;
    }
  }

  .add-comment-wrapper {
    padding: 20px 15px;
    border-radius: 5px;
    background: rgba(245, 245, 245, 0.5);
    border: 1px solid #15C39A;
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
      margin-top: 5px;
      .input {
        padding-left: 20px;
      }
    }
  }

  .root-comment {
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    .root-comment-tab{
      background-color: #f1f3f4;
      padding: 10px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      font-size: 16px;
      white-space: nowrap;
      text-align: left;
      margin-top: 10px;
      border-top-right-radius: 6px;
      border-top-left-radius: 6px;
      &:hover{
        background-color:#feefc3
      }
    }
  }

  .comment-record-wrapper {
    padding: 20px 15px;
    max-height: 1000px;
    overflow-y: auto;
    background: #FFFFFF;
    position:relative;
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;

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
}

.ensure-delete-modal {
  padding: 20px;
  .tips {
    margin-bottom: 20px;
    font-family: Inter-Bold;
    font-size: 15px;
    color: #474747;
  }

  .modal-ensure-action-line-center {
    width: 40%;
    display: flex;
    justify-content: space-between;
    margin: 20px auto;
  }
}

.type-filter {
  justify-content: flex-end;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
