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
    <div class="root-comment" v-for="(rawCommentList,rootIndex) in formatCommentList" :key="rootIndex">
      <a-divider orientation="left">To {{ rawCommentList.fieldName }}:</a-divider>
      <div class="comment-record-wrapper" style="box-shadow: 0px 3px 6px rgb(0 0 0 / 16%)">
        <div class='delete-thread-mask' v-if="rawCommentList.deleteThread">
          <div class="delete-group">
            <div style="color: #fff;margin: 5px;">
              Delete this comment Thread?
            </div>
            <div class="delete-group-button">
              <div class='upload-text'>
                <a-button shape='round' type='primary' @click="handleDeleteComment(rawCommentList,rootIndex)">Delete</a-button>
              </div>
              <div class='upload-text'>
                <a-button shape='round' @click="cancelDeleteThread(rootIndex)">Cancel</a-button>
              </div>
            </div>
          </div>
        </div>
        <div class="record-list" v-for="(commentItem, cIndex) in getCommentList(rawCommentList)" :key="cIndex">
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
              :comment-item="newComment[rootIndex]"
              @focusInput="handleFocusInput"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { CollaborateCommentMixin } from '@/mixins/CollaborateCommentMixin'
import { AddCollaborateComment, DeleteCollaborateCommentById } from '@/api/collaborate'

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
      newComment: [],
      rawCommentList: [],
      rootCommentMap: new Map(),

      deleteCommentModalVisible: false,
      currentDeleteComment: null,
      filterName: null,
      currentType: 0, // 0-All 1-My
      currentTypeLabel: 'All'
    }
  },
  computed: {

    getCommentList () {
        return function (rawCommentList) {
          const res = []
          res.push(rawCommentList)
          rawCommentList.subCommentList.forEach(item => {
            res.push(item)
          })
          console.log(res)
          return res
        }
    }
  },
  watch: {
    commentList (value) {
      this.$logger.info('commentList update ', value)
      this.rawCommentList = value
      this.rawCommentList.forEach(item => { item.sendLoading = false })
      this.formatComment()
    }
  },
  created () {
    this.$logger.info('CollaborateCommentPanel commentList', this.commentList)
    this.rawCommentList = this.commentList
    this.rawCommentList.forEach(item => { item.sendLoading = false })
    this.formatComment()
  },
  methods: {
    handleSend (comment) {
      if (!this.fieldName) {
        // 从父节点获取
        var parentIndex = this.rawCommentList.findIndex(item => item.id === comment.commentToId)
        comment.fieldName = this.rawCommentList[parentIndex].fieldName
      }
      const index = this.rawCommentList.findIndex(item => item.id === comment.id)
      comment.sourceId = this.sourceId
      comment.sourceType = this.sourceType
      comment.sendLoading = true
      let isAdd = false
      if (!comment.id) {
        isAdd = true
        this.newComment.sendLoading = true
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
          this.$set(this.newComment, comment.index, comment)
        } else {
          comment.sendLoading = false
          comment.editing = false
          this.$set(this.rawCommentList, index, comment)
        }
      }).finally(() => {

      })
    },
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
      this.newComment = []
      let newCommentIndex = 0
      for (const [rootCommentId, rootComment] of this.rootCommentMap.entries()) {
        this.$logger.info('rootCommentId ' + rootCommentId, rootComment)
        this.formatCommentList.push(rootComment)
        this.newComment.push({
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

    // 按姓名过滤评论
    handleFilterNameChange () {
      this.$logger.info('handleFilterNameChange', this.filterName, this.rootCommentMap)
      this.formatCommentList = []
      if (this.currentType === 0) {
        for (const [rootCommentId, rootComment] of this.rootCommentMap.entries()) {
          this.$logger.info('rootCommentId ' + rootCommentId, rootComment)
          let isInvolvedMe = false
          if (rootComment.username && rootComment.username.toLowerCase().indexOf(this.filterName.toLowerCase()) !== -1) {
            isInvolvedMe = true
          } else {
            rootComment.subCommentList.forEach(item => {
              if (item.username && item.username.toLowerCase().indexOf(this.filterName.toLowerCase()) !== -1) {
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
          if (rootComment.username === this.$store.getters.userInfo.username && (rootComment.username && rootComment.username.toLowerCase().indexOf(this.filterName.toLowerCase()) !== -1)) {
            isInvolvedMe = true
          } else {
            rootComment.subCommentList.forEach(item => {
              if (item.username === this.$store.getters.userInfo.username && (item.username && item.username.toLowerCase().indexOf(this.filterName.toLowerCase()) !== -1)) {
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
        /**
         * 格式化处理回复数据
         * 按rootCommentId进行分组，为空的代表是一个评论组，
         * 然后把下面的子评论(rootCommentId相同即为一组)追加到
         * subCommentList数组中，按时间排序展示
         */
          // 过滤rootComment
        this.rootCommentMap = new Map()
        this.rawCommentList.forEach(item => {
          const dataItem = Object.assign({}, item)
          if (!dataItem.rootCommentId) {
            dataItem.subCommentList = []
            this.rootCommentMap.set(dataItem.id, dataItem)
          }
        })
        // 追加下面的子讨论列表,按时间排序展示
        this.rawCommentList.forEach(item => {
          if (item.rootCommentId) {
            if (this.rootCommentMap.has(item.rootCommentId)) {
              const rootComment = this.rootCommentMap.get(item.rootCommentId)
              rootComment.subCommentList.push(item)
            } else {
              this.$logger.info('no exit rootCommentId ' + item.rootCommentId, this.rootCommentMap)
            }
          }
        })
        // map转为数组
        for (const [rootCommentId, rootComment] of this.rootCommentMap.entries()) {
          this.$logger.info('rootCommentId ' + rootCommentId, rootComment)
          let isInvolvedMe = false
          if (rootComment.username === this.$store.getters.userInfo.username) {
            isInvolvedMe = true
          } else {
            rootComment.subCommentList.forEach(item => {
              if (item.username === this.$store.getters.userInfo.username) {
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
    // TODO 删除逻辑
    handleDeleteComment (comment, index, rootIndex) {
      this.$logger.info('handleDeleteComment', comment)
      DeleteCollaborateCommentById(comment).then(response => {
        this.$emit('update-comment')
      })
    },
    cancelDeleteThread(index) {
      this.formatCommentList[index].deleteThread = false
      this.$set(this.formatCommentList, index, this.formatCommentList[index])
    },
    handleCancelNewComment (comment) {
      this.$logger.info('handleFocusInput')
      comment.editing = false
      var index = this.newComment.findIndex(item => item.id === comment.id)
      if (index !== -1) {
        this.$set(this.newComment, index, comment)
      }
    },
    handleEditComment (comment, index, rootIndex) {
      this.$logger.info('handleEditComment', comment)
      comment.editing = !comment.editing
      this.$set(this.formatCommentList[rootIndex].subCommentList, index - 1, comment)
    },
    handleFocusInput(comment) {
      this.$logger.info('handleFocusInput')
      comment.editing = true
      this.$set(this.newComment, comment.index, comment)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.all-collaborate-comment-view {
  padding: 20px;
  z-index: 100;

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
