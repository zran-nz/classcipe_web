<template>
  <div class="tag-setting">
    <a-spin :spinning='tagLoading'>
      <div class='tag-content-wrapper'>
        <div class="user-tag-category-tabs" v-if='userTagList.length'>
          <div
            :class="{ 'user-tag-item': true, 'active-tab': userTagItem.name === currentActiveTagCategoryName }"
            v-for="(userTagItem, idx) in userTagList"
            @click="handleActiveTagCategory(userTagItem)"
            :key="idx">

            <div class="action-icon" v-show="userTagItem.editing === false">
              <div class="tag-title-item">
                <div class="tag-title" @dblclick="handleEditTagCategory(userTagItem)">{{ userTagItem.name }}</div>
                <div class="tag-delete-icon" @click='handleDeleteTagCategory(userTagItem.name)'>
                  <a-icon type="delete" :style="{ fontSize: '12px', color: '#999' }"/>
                </div>
              </div>
            </div>
            <div class="editing-title" v-show="userTagItem.editing === true">
              <a-input
                v-model="currentEditTagCategoryName"
                placeholder="Name your category"
                ref='tag-category'
                class="my-tag-category-input"
                @blur='handleEnsureUpdateTagCategory(userTagItem)'
                @keyup.enter="handleEnsureUpdateTagCategory(userTagItem)">
              </a-input>
            </div>
          </div>
        </div>
        <div class='user-tag-list-wrapper'>
          <div class="tab-content">
            <div class="skt-tag-wrapper">
              <div class="skt-tag-list">
                <div class="search-tag-wrapper tag-wrapper">
                  <div class="skt-tag-item" v-for="(keyword, kIndex) in tagSearchList" :key="kIndex" >
                    <a-tag
                      closable
                      @close='handleDeleteTag(keyword)'
                      class="tag-item">
                      {{ keyword }}
                    </a-tag>
                  </div>
                  <a-input
                    v-if='createTagInputVisible'
                    v-model="inputTag"
                    placeholder="Create Tags"
                    class="search-input"
                    @keyup.enter.native="handleEnsureSearchTag"
                    @search="searchTag"
                    @keyup="searchTag" >
                  </a-input>
                </div>
                <div class="create-tag-wrapper tag-wrapper" v-show="!tagIsExist(createTagName, tagSearchList) && createTagName && createTagName.length >= 1">
                  <div class="skt-tag-create-line" @click="handleCreateTagByInput">
                    <div class="create-tag-label">
                      Create
                    </div>
                    <div class="create-tag">
                      <a-tag class="created-tag-item">
                        {{ createTagName }}
                      </a-tag>
                    </div>
                  </div>
                </div>
                <div class='no-tag-list' v-if='userTagList.length > 0 && tagSearchList.length === 0 && !(!tagIsExist(createTagName, tagSearchList) && createTagName && createTagName.length >= 1)'>
                  <no-more-resources tips='' />
                  <div class='no-tips'>
                    There is no tag under the current type, create one now ?
                  </div>
                  <div class='create-tag'>
                    <a-button type='primary' shape='round' @click='createTagInputVisible = true'>Create</a-button>
                  </div>
                </div>
              </div>
              <div class='no-tag-tips' v-show='userTagList.length === 0 && !tagLoading'>
                <no-more-resources tips='' />
                <div class='no-tips'>
                  No tags type have been added yet, create one now ?
                </div>
                <div class='create-tag'>
                  <a-button type='primary' shape='round' @click='handleInitCreateTagCategory'>Create</a-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { AddUserParentTag, AddUserTagNew, FindCustomTags, UpdateUserParentTag, UserTagDeleteNew } from '@/api/tag'
import { UtilMixin } from '@/mixins/UtilMixin'
import NoMoreResources from '@/components/Common/NoMoreResources'

export default {
  name: 'TagSetting',
  mixins: [UtilMixin],
  components: {
    NoMoreResources
  },
  props: {

  },
  mounted () {
  },
  destroyed () {

  },
  data () {
    return {
      currentActiveTagCategoryName: '',
      currentEditTagCategoryName: '',

      userTagList: [],
      createTagName: '',
      tagLoading: false,
      inputTag: '',
      tagSearchList: [],
      currentEditTagName: '',
      createTagInputVisible: false
    }
  },
  created () {
    this.handleUpdateUserTags()
  },
  watch: {
  },
  methods: {

    handleActiveTagCategory (userTagItem) {
      this.$logger.info('handleActiveTagCategory', userTagItem)
      this.currentActiveTagCategoryName = userTagItem.name
      this.filterKeyword()
    },

    handleEditTagCategory (userTagItem) {
      this.$logger.info('handleEditTagCategory', userTagItem)
      this.currentEditTagCategoryName = userTagItem.name
      this.userTagList.forEach(item => { item.editing = false })
      userTagItem.editing = true
    },

    handleEnsureUpdateTagCategory (userTagItem) {
      this.$logger.info('handleEnsureUpdateTagCategory ' + this.currentEditTagCategoryName, userTagItem)
      this.currentEditTagCategoryName = (this.currentEditTagCategoryName && this.currentEditTagCategoryName.trim()) ? this.currentEditTagCategoryName.trim() : 'Untitled category ' + (this.userTagList.length + 1)
      if (userTagItem.newTag) {
        this.handleCreateTagCategory(userTagItem)
      } else {
        this.handleUpdateTagCategory(userTagItem)
      }
    },

    handleCreateTagCategory (userTagItem) {
      this.$logger.info('handleCreateTagCategory', userTagItem)
      this.tagLoading = true
      AddUserParentTag({ parentName: this.currentEditTagCategoryName }).then((response) => {
        this.$logger.info('add AddUserParentTag ', response.result)
        if (response.success) {
          this.handleUpdateUserTags()
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.tagLoading = false
      })
    },

    handleUpdateTagCategory (userTagItem) {
      this.$logger.info('handleUpdateTagCategory', userTagItem)
      this.tagLoading = true
      UpdateUserParentTag({ name: userTagItem.name, newName: this.currentEditTagCategoryName }).then((response) => {
        this.$logger.info('UpdateUserParentTag response', response.result)
        if (response.success) {
          this.handleUpdateUserTags()
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.tagLoading = false
      })
    },

    handleInitCreateTagCategory () {
      this.$logger.info('handleInitCreateTagCategory')
      this.currentEditTagName = 'Untitled category ' + (this.userTagList.length + 1)
      const newUserTagItem = {
        name: this.currentEditTagName,
        editing: true,
        newTag: true,
        keywords: []
      }
      this.currentActiveTagCategoryName = newUserTagItem.name
      this.currentEditTagCategoryName = newUserTagItem.name
      this.userTagList.push(newUserTagItem)
      this.$nextTick(() => {
        if (this.$refs['tag-category'] && this.$refs['tag-category'].length > 0) {
          this.$refs['tag-category'][0].$el.focus()
        }
      })
    },

    handleUpdateUserTags () {
      this.tagLoading = true
      FindCustomTags({}).then((response) => {
        this.$logger.info('FindCustomTags response', response.result)
        if (response.success) {
          const userTags = []
          response.result.userTags.forEach((userTag) => {
            if (userTag.name) {
              userTag.editing = false
              userTag.newTag = false
              userTags.push(userTag)
            }
          })
          this.userTagList = userTags
          this.$logger.info('userTagList', this.userTagList)
          if (!this.currentActiveTagCategoryName && this.userTagList.length > 0) {
            const firstTagCategory = this.userTagList.find(item => item.name)
            if (firstTagCategory) {
              this.currentActiveTagCategoryName = firstTagCategory.name
            }
          }
          this.$logger.info('currentActiveTagCategoryName', this.currentActiveTagCategoryName)
          this.filterKeyword()
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.tagLoading = false
      })
    },
    filterKeyword () {
      if (this.currentActiveTagCategoryName) {
        this.tagSearchList = []
        const userTagItem = this.userTagList.find(item => item.name === this.currentActiveTagCategoryName)
        this.$logger.info('userTagItem', userTagItem)
        if (!userTagItem || (userTagItem.keywords && userTagItem.keywords.length === 0)) {
          return
        }
        this.tagSearchList = Array.from(userTagItem.keywords)
        if (this.inputTag) {
          this.tagSearchList = this.tagSearchList.filter(item => item.toLowerCase().indexOf(this.inputTag.toLowerCase()) > -1)
        }
        this.$logger.info('tagSearchList', this.tagSearchList)
      }
    },

    handleEnsureSearchTag () {
      this.$logger.info('handleEnsureSearchTag', this.inputTag)
      this.searchTag(this.inputTag)
      this.createTagName = this.inputTag
      this.handleCreateTagByInput()
    },

    handleCreateTagByInput () {
      this.$logger.info('handleCreateTagByInput ' + this.createTagName)
      let existTag = false
      const userTagItem = this.userTagList.find(item => item.name === this.currentActiveTagCategoryName)
      if (userTagItem && userTagItem.keywords) {
        const tagKeyword = userTagItem.keywords.find(item => item.toLowerCase() === this.createTagName.toLowerCase())
        if (tagKeyword) {
          existTag = true
        }
      }
      if (existTag) {
        this.$message.warn('already exist same name tag')
      } else {
        const item = {
          name: this.createTagName,
          parentName: this.currentActiveTagCategoryName
        }
        this.tagLoading = true
        AddUserTagNew(item).then((response) => {
          this.$logger.info('add AddUserTagNew ', response.result)
          if (response.success) {
            this.handleUpdateUserTags()
            this.$message.success('Add tag successfully')
            this.inputTag = ''
            this.createTagName = ''
            this.$emit('change-add-keywords', item)
          } else {
            this.$message.error(response.message)
          }
        }).finally(() => {
          this.tagLoading = false
        })
      }
    },

    searchTag (keyword) {
      this.$logger.info('tag searchTag', keyword)
      this.createTagName = this.inputTag
      this.filterKeyword()
    },

    handleDeleteTag(keyword) {
      this.$confirm({
        title: 'Delete tag',
        content: h => <div class='my-delete-tips'>
          Are you sure you want to delete this tag ?
          This is permanent and can not be undone .
        </div>,
        bodyStyle: { padding: '10px' },
        okText: 'Confirm',
        centered: true,
        onOk: () => {
          this.handleEnsureDeleteTag(keyword)
        }
      })
    },

    handleEnsureDeleteTag (keyword) {
      this.$logger.info('handleEnsureDeleteTag ' + this.currentActiveTagCategoryName + ' ' + keyword)
      this.tagLoading = true
      // UserTagDeleteNew 传了parentName就删大类,传了name 就删下面的小类
      UserTagDeleteNew({ parentName: this.currentActiveTagCategoryName, name: keyword }).then((response) => {
        this.$logger.info('add UserTagDeleteNew ', response.result)
        if (response.success) {
          this.handleUpdateUserTags()
          this.$message.success('Delete successfully')
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.tagLoading = false
      })
    },

    handleDeleteTagCategory(category) {
      this.$confirm({
        title: 'Delete tag type',
        content: h => <div class='my-delete-tips'>
          Are you sure you want to delete this tag type ?
          After deletion, its sub-tags are deleted too .
          This is permanent and cannot be undone .
        </div>,
        bodyStyle: { padding: '10px' },
        okText: 'Confirm',
        centered: true,
        onOk: () => {
          this.handleEnsureDeleteTagCategory(category)
        }
      })
    },

    handleEnsureDeleteTagCategory (category) {
      this.$logger.info('handleEnsureDeleteTagCategory ' + category)
      this.tagLoading = true
      // UserTagDeleteNew 传了parentName就删大类,传了name 就删下面的小类
      UserTagDeleteNew({ parentName: category }).then((response) => {
        this.$logger.info('add UserTagDeleteNew ', response.result)
        if (response.success) {
          this.handleUpdateUserTags()
          this.$message.success('Delete successfully')
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.tagLoading = false
      })
    }
  }

}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.tag-setting {
  .tag-content-wrapper {
    .user-tag-category-tabs {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      border-bottom: 1px solid #eee;
      margin-bottom: 10px;
      overflow-x: overlay;

      &::-webkit-scrollbar-thumb{
        background: transparent;
        opacity: 0;
      }

      &:hover {
        &::-webkit-scrollbar-thumb{
          background: rgba(0, 0, 0, 0.1);
        }
      }

      .user-tag-item {
        cursor: pointer;
        font-family: Arial;
        font-weight: 400;
        line-height: 30px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        color: #070707;
        border-bottom: 3px solid #fff;

        .action-icon {
          margin-left: 8px;

          .tag-title-item {
            line-height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: row;

            .tag-title {
              display: block;
              white-space: nowrap;
              user-select: none;
              margin-right: 8px;
            }

            .tag-delete-icon {
              opacity: 0;
            }

            &:hover {
              .tag-delete-icon {
                opacity: 1;
              }
            }
          }
        }
      }

      .active-tab {
        border-bottom: 3px solid #15c39a;

        .tag-title {
          color: #07AB84;
        }
      }
    }

    .no-tag-tips {
      min-height: 190px;
      .create-tag {
        padding: 20px 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.skt-tag-wrapper {
  .skt-tag-list {
    margin-top: 5px;
    max-height: 380px;
    overflow-y: auto;
    background: rgba(255, 255, 255, 1);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    position: relative;

    .tag-wrapper {
      width: 100%;
      margin-bottom: 10px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .create-tag {
        margin-right: 5px;
        .created-tag-item {
          cursor: pointer;
          margin: 0 3px;
          padding: 3px 6px;
          border-radius: 18px;
          font-family: Inter-Bold;
          background-color: rgba(21, 195, 154, 0.1);
          color: rgba(21, 195, 154, 1);
          border: 1px solid rgba(21, 195, 154, 1);
        }
      }
      .tag-item {
        background-color: rgba(21, 195, 154, 1);
        color: #fff;
        padding: 3px 6px;
        cursor: pointer;

        .tag-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            padding-right: 3px;
            height: 12px;
          }
          img.search-icon {
            height: 10px;
          }
        }
      }
    }

    .create-tag-wrapper {
      width: 100%;
    }

    .skt-tag-item {
      margin: 5px 10px 5px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      vertical-align: middle;
      cursor: pointer;
      flex-direction: row;
      .tag-item {
        cursor: pointer;
        border-radius: 28px;
        padding-left: 10px;
        padding-right: 10px;
        word-break:normal;
        width:auto;
        display:flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        white-space:pre-wrap;
        word-wrap : break-word ;
        overflow: hidden ;
        padding-bottom: 3px;
      }
    }

    .skt-tag-create-line {
      cursor: pointer;
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 5px 0;
      &:hover {
        background: rgba(0, 0, 0, 5%)
      }

      .create-tag-label {
        cursor: pointer;
        font-size: 14px;
        padding-right: 5px;
        padding-left: 5px;
        color: #15c39a;
      }

      .create-tag {
        cursor:pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }
}

.my-tag-category-input {
  min-width: 150px;
  width: 100%;
}

.user-tag-list-wrapper {
  min-height: 250px;
}

.no-tag-list {
  text-align: center;
  width: 80%;
  height: 200px;
  margin: auto;
}

.no-tips {
  color: #999;
  line-height: 30px;
  text-align: center;
}

.create-tag {
  margin-top: 10px;
}

.search-input {
  border-radius: 30px;
}
</style>
