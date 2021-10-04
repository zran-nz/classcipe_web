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
    <div class="comment-record-wrapper">
      <div class="record-list" v-for="(commentItem, cIndex) in formatCommentList" :key="cIndex">
        <div class="record-item">
          <template v-if="!commentItem.isDelete">
            <div class="record-action" v-show="commentItem.userId === $store.getters.userInfo.id">
              <div class="record-delete" @click="handleDeleteComment(commentItem)">
                <delete-icon />
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
            <div class="comment-detail">
              <div class="comment-text">
                {{ commentItem.content }}
              </div>
            </div>
            <div class="comment-input-wrapper">
              <div class="input">
                <input-with-button @send="handleSend" :reply-mode="true" :reply-username="commentItem.username" :extra="commentItem"/>
              </div>
            </div>
            <div class="sub-comment-list-wrapper">
              <div class="record-list" v-for="(subCommentItem, scIndex) in commentItem.subCommentList" :key="scIndex">
                <template v-if="!subCommentItem.isDelete">
                  <div class="record-item">
                    <div class="record-action" v-show="subCommentItem.userId === $store.getters.userInfo.id">
                      <div class="record-delete" @click="handleDeleteComment(subCommentItem)">
                        <delete-icon />
                      </div>
                    </div>
                    <div class="comment-user-info">
                      <div class="avatar">
                        <img :src="commentItem.avatar" />
                      </div>
                      <div class="user-name">
                        <div class="name-text"> {{ subCommentItem.username }}</div>
                        <div class="time-text"> {{ subCommentItem.createdTime | dayjs }}</div>
                      </div>
                    </div>
                    <div class="comment-detail">
                      <div class="comment-text">
                        {{ subCommentItem.content }}
                      </div>
                    </div>
                    <div class="comment-input-wrapper">
                      <div class="input">
                        <input-with-button @send="handleSend" :reply-mode="true" :reply-username="subCommentItem.username" :extra="subCommentItem"/>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-if="subCommentItem.isDelete">
                  <div class="sub-deleted-comment">
                    <div class="sub-deleted-tips">
                      The comment has been deleted.
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
          <template v-if="commentItem.isDelete">
            <div class="deleted-comment">
              <div class="deleted-tips">
                The comment has been deleted.
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <a-modal
      v-model="deleteCommentModalVisible"
      :footer="null"
      destroyOnClose
      title="Delete comment">
      <div class="ensure-delete-modal">
        <div class="tips">
          Your comments have been replied by other ,which cannot be revoked after deletion.
        </div>
        <div class="modal-ensure-action-line-center">
          <a-button class="action-item action-cancel" shape="round" @click="handleCancelDelete">Cancel</a-button>
          <a-button class="action-ensure action-item" type="primary" shape="round" @click="handleEnsureDelete">Confirm</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>

import deleteIcon from '@/assets/icons/collaborate/delete.svg?inline'
import InputWithButton from '@/components/Collaborate/InputWithButton'
import { DeleteCollaborateCommentById, AddCollaborateComment } from '@/api/collaborate'

export default {
  name: 'CollaborateCommentView',
  components: {
    InputWithButton,
    deleteIcon
  },
  props: {
    commentList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      rawCommentList: [],
      formatCommentList: [],

      deleteCommentModalVisible: false,
      currentDeleteComment: null,
      filterName: null,
      currentType: 0, // 0-All 1-My
      currentTypeLabel: 'All'
    }
  },
  watch: {
    commentList (value) {
      this.$logger.info('commentList update ', value)
      this.rawCommentList = value
      this.formatComment()
    }
  },
  created () {
    this.$logger.info('CollaborateCommentPanel commentList', this.commentList)
    this.rawCommentList = this.commentList
    this.formatComment()
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
      const rootCommentMap = new Map()
      this.rawCommentList.forEach(item => {
        const dataItem = Object.assign({}, item)
        if (!dataItem.rootCommentId) {
          dataItem.subCommentList = []
          rootCommentMap.set(dataItem.id, dataItem)
        }
      })
      // 追加下面的子讨论列表,按时间排序展示
      this.rawCommentList.forEach(item => {
        if (item.rootCommentId) {
          if (rootCommentMap.has(item.rootCommentId)) {
            const rootComment = rootCommentMap.get(item.rootCommentId)
            rootComment.subCommentList.push(item)
            rootComment.subCommentList = rootComment.subCommentList.sort((i, j) => i.createdTime < j.createdTime)
          } else {
            this.$logger.info('no exit rootCommentId ' + item.rootCommentId, rootCommentMap)
          }
        }
      })
      // map转为数组
      for (const [rootCommentId, rootComment] of rootCommentMap.entries()) {
        this.$logger.info('rootCommentId ' + rootCommentId, rootComment)
        this.formatCommentList.push(rootComment)
      }
      this.$logger.info('formatCommentList', this.formatCommentList)
    },

    // TODO 评论提交逻辑
    handleSend (data) {
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

    handleFilterNameChange () {
      this.$logger.info('handleFilterNameChange', this.filterName)
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
        const rootCommentMap = new Map()
        this.rawCommentList.forEach(item => {
          const dataItem = Object.assign({}, item)
          if (!dataItem.rootCommentId) {
            dataItem.subCommentList = []
            rootCommentMap.set(dataItem.id, dataItem)
          }
        })
        // 追加下面的子讨论列表,按时间排序展示
        this.rawCommentList.forEach(item => {
          if (item.rootCommentId) {
            if (rootCommentMap.has(item.rootCommentId)) {
              const rootComment = rootCommentMap.get(item.rootCommentId)
              rootComment.subCommentList.push(item)
              rootComment.subCommentList = rootComment.subCommentList.sort((i, j) => i.createdTime < j.createdTime)
            } else {
              this.$logger.info('no exit rootCommentId ' + item.rootCommentId, rootCommentMap)
            }
          }
        })
        // map转为数组
        for (const [rootCommentId, rootComment] of rootCommentMap.entries()) {
          this.$logger.info('rootCommentId ' + rootCommentId, rootComment)
          let isInvolvedMe = false
          if (rootComment.userId === this.$store.getters.userInfo.id) {
            isInvolvedMe = true
          } else {
            rootComment.subCommentList.forEach(item => {
              if (item.userId === this.$store.getters.userInfo.id) {
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
    background: rgba(245, 245, 245, 0.5);
    padding: 20px 15px;
    border-radius: 5px;

    .record-list {
      margin-top: 10px;
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
