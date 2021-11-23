<template>
  <div class="custom-tag" @click="handleEnsureInput($event)">
    <div>

      <a-spin v-show="tagLoading" class="spin-loading"/>

      <div class="tag-category" v-show="!userTagsMap.length">
        <a-row>
          <a-col offset="0" span="24">
            <div>
              <a-tabs
                :activeKey="selectLabel"
                tab-position="top"
                type="editable-card"
                @edit="onEdit"
                @change="changeTab"
                hide-add
              >
                <a-tab-pane v-for="(tag,index) in userTagsMap" :key="tag[0]" >
                  <span slot="tab">
                    <div v-if="editTabIndex === index">
                      <a-input
                        class="my-tag-input"
                        v-model="editTabName"
                        placeholder="Name your category"
                        id="input"
                        @keyup.enter="handleTabInputConfirm(editTabName)"
                      ></a-input>
                    </div>
                    <div v-if="editTabIndex !== index">{{ tag[0] }}<a-icon v-show="canDeleteTab" @click="deleteTab(tag[0])" type="close-circle" /></div>
                  </span>
                  <div class="tab-content">
                    <a-col offset="0" :span="24">
                      <div class="tag-search-input">
                        <a-input-search
                          v-model="inputTag"
                          size="large"
                          placeholder="Create Tags"
                          class="search-input"
                          @keyup.enter.native="handleKeyup"
                          @search="searchTag"
                          @keyup="searchTag" >
                          <a-icon slot="prefix" type="plus-circle" :style="{ fontSize: '16px', color: '#15c39a','margin-right':'5px' }" />
                        </a-input-search>
                      </div>
                    </a-col>
                    <div class="skt-tag-wrapper" v-show="tagSearchList.length || createTagName">
                      <!--      skt-tag-list-->
                      <div class="skt-tag-list">

                        <div class="search-tag-wrapper tag-wrapper">
                          <div class="skt-tag-item" v-for="(keyword,kIndex) in tagSearchList" :key="kIndex" >
                            <a-tag
                              :closable="true"
                              @close="closeTag(tag[0],keyword,$event)"
                              class="tag-item">
                              {{ keyword }}
                            </a-tag>
                          </div>
                        </div>
                        <div class="create-tag-wrapper tag-wrapper">
                          <div class="skt-tag-create-line" @click="handleCreateTagByInput" v-show="!tagIsExist(createTagName,tagSearchList) && createTagName && createTagName.length >= 1">
                            <div class="create-tag-label">
                              Create
                            </div>
                            <div class="create-tag">
                              <a-tag class="created-tag-item">
                                {{ createTagName }}
                              </a-tag>
                            <!--                    <a-icon type="plus-circle" @click="handleCreateTagByInput"/>-->
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a-tab-pane>
                <div slot="tabBarExtraContent">
                  <a-tooltip placement="top" title="Create Category">
                    <a-icon type="plus" style="cursor: pointer" @click="add"/>
                  </a-tooltip>
                </div>
              </a-tabs>
            </div>
          </a-col>
        </a-row>
      </div>

      <div>
        <a-button type="link" @click="canDeleteTab=!canDeleteTab">
          Delete Category
        </a-button>
      </div>

      <br />
    </div>
    <a-modal
      v-model="confirmVisible"
      :footer="null"
      destroyOnClose
      width="600px"
      :title="null"
      @ok="confirmVisible = false"
      @cancel="confirmVisible = false">
      <div class="confirm-content-wrapper">
        <div>
          <a-result
            status="error"
            :title="deleteTagName ? 'Delete this tag':'Delete tag type'"
          >
            <p v-if="deleteTagName">
              Are you sure you want to delete this tag?
              This is permanent and can not be undone?
            </p>
            <p v-if="!deleteTagName">
              Are you sure you want to delete this tag type?
              After deletion, its sub-tags are deleted too.
              This is permanent and cannot be undone.
            </p>
            <div class="desc">
              <a-alert v-if="deleteTabName && !deleteTagName" :message="deleteTabName" type="info" />
              <div class="confirm-tag-wrapper tag-wrapper">
                <div v-if="deleteTabName && !deleteTagName" class="skt-tag-item" v-for="(keyword,index) in tagSearchList" :key="index" >
                  <a-tag
                    class="tag-item">
                    {{ keyword }}
                  </a-tag>
                </div>
                <div v-if="deleteTabName && deleteTagName" class="skt-tag-item" style="margin: 10px auto">
                  <a-tag
                    class="tag-item">
                    {{ deleteTagName }}
                  </a-tag>
                </div>
              </div>
            </div>
          </a-result>
        </div>

        <div class="modal-ensure-action-line-center">
          <a-button class="action-item action-cancel" shape="round" @click="confirmVisible = false">Cancel</a-button>
          <a-button class="action-ensure action-item" :loading="tagDeleteLoading" type="primary" shape="round" @click="handleEnsureDelete">Confirm</a-button>
        </div>
      </div>
    </a-modal>

  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { AddUserTagNew, FindCustomTags, AddUserParentTag, UserTagDeleteNew } from '@/api/tag'
import { UtilMixin } from '@/utils/UtilMixin'

const { debounce } = require('lodash-es')

export default {
  name: 'TagSetting',
  mixins: [UtilMixin],
  components: {
  },
  props: {

  },
  mounted () {
  },
  destroyed () {

  },
  data () {
    return {
      canDeleteTab: false,
      tagLoading: false,
      inputTag: '',
      tagName: '',
      createTagName: '',
      tagSearchList: [],
      userTagsMap: new Map(),
      selectLabel: '',
      confirmVisible: false,
      editTabIndex: -1,
      editTabName: '',
      deleteTabName: '',
      deleteTagName: '',
      tagDeleteLoading: false,

      // 允许通过点击空白处确认输入
      allowClickEnsureInput: false
    }
  },
  created () {
    this.debouncedSearchKnowledge = debounce(this.searchTag, 500)
    this.handleUserTagsMap()
  },
  watch: {
  },
  methods: {
    onEdit (targetKey, action) {
      logger.info('action ', targetKey, action)
      this[action](targetKey)
    },
    add () {
      if (this.editTabIndex !== -1) {
        return
      }
      let activeKey = `Name your category`
      if (this.userTagsMap.has(activeKey)) {
        activeKey = activeKey + '-1'
      }
      this.editTabIndex = this.userTagsMap.size
      this.editTabName = activeKey
      this.userTagsMap.set(activeKey, [])
      this.changeTab(activeKey)
      setTimeout(function () {
        document.getElementById('input').focus()
      }, 500)

      setTimeout(() => {
        this.allowClickEnsureInput = true
      }, 1000)
    },
    remove (targetKey) {
      // this.selectLabel = activeKey
      this.confirmVisible = true
    },
    changeTab (tabName) {
      this.selectLabel = tabName
      this.filterKeyword()
    },
    handleOk () {
    },
    handleCancel () {
      this.visible = false
    },
    closeTag (parent, tag, event) {
      event.preventDefault()
      this.deleteTabName = parent
      this.deleteTagName = tag
      this.confirmVisible = true
    },
    selectTag (tag) {
      console.log(tag)
      if (this.tagName === tag.name) {
        this.tagName = ''
      } else {
        this.tagName = tag.name
      }
    },
    handleUserTagsMap () {
      this.userTagsMap = new Map()
      FindCustomTags({}).then((response) => {
        this.$logger.info('FindCustomTags response', response.result)
        if (response.success) {
          response.result.userTags.forEach(tag => {
            this.userTagsMap.set(tag.name, tag.keywords)
          })
          this.$logger.info('userTagsMap', this.userTagsMap)
          this.userTagsMap.forEach((value, key) => {
            if (!this.selectLabel) {
              this.selectLabel = key
            }
          })
          // this.changeTab(this.selectLabel)
          this.filterKeyword()
        } else {
          this.$message.error(response.message)
        }
      })
    },
    filterKeyword () {
      this.tagSearchList = []
      const keywords = this.userTagsMap.get(this.selectLabel)
      if (!keywords) {
        return
      }
      this.tagSearchList = Array.from(keywords)
      if (this.inputTag) {
        this.tagSearchList = this.tagSearchList.filter(item => item.toLowerCase().indexOf(this.inputTag.toLowerCase()) > -1)
      }
    },
    handleCreateTagByInput () {
      this.$logger.info('skill handleCreateTagByInput ' + this.createTagName)
      const userTypeTags = this.userTagsMap.get(this.selectLabel)
      if (userTypeTags.indexOf(this.createTagName) > -1) {
        this.$message.warn('already exist same name tag')
      } else {
        var item = {
          name: this.createTagName,
          parentName: this.selectLabel
        }
        this.tagLoading = true
        AddUserTagNew(item).then((response) => {
          this.$logger.info('add AddUserTagNew ', response.result)
          if (response.success) {
            item.id = response.result.id
            this.createTagName = ''
            this.inputTag = ''
            this.handleUserTagsMap()
            this.$message.success('Add tag success')
            this.$emit('change-add-keywords', item)
          } else {
            this.$message.error(response.message)
          }
          this.tagLoading = false
        })
      }
    },

    handleKeyup () {
      this.$logger.info('tag handleKeyup ', this.inputTag)
      this.debouncedSearchKnowledge(this.inputTag)
      this.createTagName = this.inputTag
      this.handleCreateTagByInput()
    },

    searchTag (keyword) {
      logger.info('tag searchTag', keyword)
      // this.debouncedSearchKnowledge(this.inputTag)
      this.createTagName = this.inputTag
      this.filterKeyword()
    },

    handleEnsureDelete () {
      this.tagDeleteLoading = true
      UserTagDeleteNew({ parentName: this.deleteTabName, name: this.deleteTagName }).then((response) => {
        this.$logger.info('add UserTagDeleteNew ', response.result)
        if (response.success) {
          this.editTabIndex = -1
          if (!this.deleteTagName) {
            this.selectLabel = ''
          }
          this.handleUserTagsMap()
          this.$message.success('Delete success')
        } else {
          this.$message.error(response.message)
        }
        this.tagDeleteLoading = false
        this.confirmVisible = false
      })
    },
    deleteTab (tab) {
        this.deleteTabName = tab
        this.deleteTagName = ''
        this.confirmVisible = true
    },

    // 如果正在编辑中，那么点击其他空白地方，自动保存当前编辑内容。和键盘按下Enter效果一样
    handleEnsureInput (event) {
      this.$logger.info('handleEnsureInput ' + this.editTabName)
      console.log(event)
      if (!event.target.classList.contains('my-tag-input') && this.editTabIndex !== -1 && this.allowClickEnsureInput) {
       this.handleTabInputConfirm(this.editTabName)
      }
    },
    handleTabInputConfirm (tag) {
      this.allowClickEnsureInput = false
      if (!tag || !tag.trim()) {
        this.$message.warn('Please input tag type name')
        return
      }
      this.tagLoading = true
      AddUserParentTag({ parentName: tag }).then((response) => {
        this.$logger.info('add AddUserParentTag ', response.result)
        if (response.success) {
          this.editTabIndex = -1
          this.selectLabel = tag
          // this.userTagsMap = new Map()
          this.handleUserTagsMap()
          this.$message.success('Add tag type success')
        } else {
          this.$message.error(response.message)
        }
        this.tagLoading = false
      })
    }
  }

}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";
.custom-tag {
  //border: 1px solid #e8e8e8;
  box-sizing: border-box;
  margin-top: 20px;

  .tag-category {
    min-height: 480px;
    border-radius: 6px;
    .ant-radio-button-wrapper{
      margin-bottom: 10px;
    }
  }

  .skt-tag-wrapper {
    margin-top: 10px;
    height: 400px;
    .skt-tag-list {
      top:10px;
      max-height: 380px;
      overflow-y: auto;
      padding: 20px 10px 5px 10px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid #D8D8D8;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      box-shadow: 0px 6px 10px rgba(91, 91, 91, 0.16);
      position: relative;

      .tag-wrapper {
        width: 100%;
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 10px;
        background: rgba(21, 195, 154, 0.1);
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
        //background-color: rgba(250, 250, 250, 1);
        padding: 0 10px;
        width: 100%;
      }

      .skt-tag-item {
        margin: 5px 10px 5px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        cursor: pointer;
        .tag-item {
          cursor: pointer;
          border-radius: 28px;
          padding-left: 10px;
          padding-right: 10px;
          word-break:normal;
          width:auto;
          display:block;
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
          color: #000;
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

  .tag-search-input {
    margin-top: 20px;
    .browse{
      padding: 10px 5px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      border-radius: 6px;
    }
    .btn-icon {
      height: 18px;
      width: 18px;
    }
    .btn-text {
      padding: 0 5px;
    }
    /deep/ .ant-input-search .ant-input-lg{
      padding-left: 35px;
    }
  }
  .spin-loading{
    top: 300px;
    margin-left: 40%;
    position: absolute;
    z-index: 9999;
  }

  position: relative;
  //border: 1px dotted #fff;
  //&:hover {
  //  border: 1px dotted @link-hover-color;
  //  box-sizing: border-box;
  //}
}

.category-tag {
  cursor: pointer;
  padding: 3px 10px;
  border-radius: 18px;
  font-family: Inter-Bold;
  background-color: #FFBB00;
  color: #fff;
  margin: 0 10px 10px 0;
  border: 1px solid rgba(255, 187, 0, 1);
  &.active{
    background-color: #15c39a;
    border: 1px solid #15c39a;
  }
}
/deep/ .ant-tabs-nav .ant-tabs-tab {
  margin: 0 10px 0 0;
  padding: 12px 10px;

}
/deep/ .tag-category .anticon-close {
  font-size: 14px;
  color: red;
  vertical-align: top;
}
.tab-content{
  margin: 0 5%;
  width: 90%;
}
.modal-ensure-action-line-center{
  display: flex;
  justify-content: space-between;
  width: 40%;
  margin: 20px auto;
}

.confirm-tag-wrapper{
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin-top: 10px;
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
    .skt-tag-item {
      margin: 5px 10px 5px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      vertical-align: middle;
      cursor: pointer;
      .tag-item {
        cursor: pointer;
        border-radius: 28px;
        padding-left: 10px;
        padding-right: 10px;
        word-break:normal;
        width:auto;
        display:block;
        white-space:pre-wrap;
        word-wrap : break-word ;
        overflow: hidden ;
        padding-bottom: 3px;
      }
    }
}
/deep/ .ant-tabs-nav .ant-tabs-tab .anticon {
  padding-left: 10px;
  vertical-align: text-top;
  color: red;
}

</style>
