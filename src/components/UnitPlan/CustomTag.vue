<template>
  <div class="custom-tag" v-show='mergeTagList.length || tagList.length'>
    <div>
      <a-card class="cover-card" :head-style="{ background:'#15c39a',color:'#fff'}" :body-style="{'padding': '10px'}" title="Tag your content" :bordered="false">
        <a v-if="showArrow" class="header-triangle"></a>
        <a-button class="setting-button" slot="extra" href="#" @click="handleSetting">My tags <a-icon type="edit" /></a-button>
        <div class='tag-selected-label'>
          <template v-if="tagList.length === 0">No tags added : </template>
          <template v-if='tagList.length !== 0'>Tags added :</template>
        </div>
        <div class='tag-content-wrapper'>
          <div class='selected-tag' v-show="tagList.length">
            <div class="skt-tag-list">
              <div class="skt-tag-item " v-for="tag in showTagList" :key="tag.name" v-if='tag.fieldName === currentFieldName' >
                <a-tooltip :title="tag.parentName">
                  <a-tag
                    :closable="canCloseTag(tag)"
                    @close="closeTag(tag)"
                    :class="{'tag-item':true,'tag-disable':!canCloseTag(tag) }">
                    {{ tag.name }}
                  </a-tag>
                </a-tooltip>
              </div>
            </div>
          </div>
          <div class='no-selected-tag' v-show='!tagList.length'>
            <div class='no-tag-content'>
              Click on the tag below to select
            </div>
          </div>
        </div>

        <a-spin :spinning="tagLoading">
          <div class="tag-category" >
            <a-row>
              <a-col offset="0" span="24">
                <div>
                  <a-tabs
                    tab-position="top"
                  >
                    <a-tab-pane v-for="(parent,index) in mergeTagList" :key="index" :tab="parent.name">
                      <a-row>
                        <a-col offset="0" :span="24">
                          <div class="tag-search-input">
                            <a-input-search
                              v-model="inputTag"
                              placeholder="Search or create tags"
                              class="search-input"
                              @keyup.enter.native="handleKeyEnter(parent)"
                              @search="searchTag"
                              @keyup="searchTag" >
                            </a-input-search>
                          </div>
                        </a-col>
                      </a-row>

                      <div class="skt-tag-wrapper">
                        <div class="triangle"></div>
                        <template v-if="parent.customDeep === 1">
                          <div class="skt-tag-list">
                            <div class="search-tag-wrapper tag-wrapper" v-if="filterKeywordListInput(parent.keywords).length > 0">
                              <div class="skt-tag-item" v-for="(keyword,tagIndex) in filterKeywordListInput(parent.keywords)" :key="tagIndex" >
                                <a-tag
                                  draggable="true"
                                  @click="selectChooseTag(parent,keyword)"
                                  class="tag-item">
                                  {{ keyword }}
                                </a-tag>
                              </div>
                            </div>
                            <dvi class='no-tag-content' v-if='filterKeywordListInput(parent.keywords).length === 0 && !parent.createOwn'>
                              <div class='no-tag-text'>Tag does not exist</div>
                            </dvi>
                            <div class="create-tag-wrapper tag-wrapper" v-show="parent.createOwn && !tagNameIsExist(createTagName,showTagList) && !tagIsExist(createTagName,filterKeywordListInput(parent.keywords)) && createTagName && createTagName.length >= 1">
                              <div class="skt-tag-create-line" @click="handleCreateTagByInput(parent)">
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
                          </div>
                        </template>
                        <template v-else>
                          <a-tabs
                            tab-position="top"
                          >
                            <a-tab-pane v-for="(child, childIndex) in parent.children" :key="childIndex" :tab="child.name">
                              <div class="skt-tag-list">
                                <div class="search-tag-wrapper tag-wrapper" v-if="filterKeywordListInput(child.keywords).length > 0">
                                  <div class="skt-tag-item" v-for="(keyword, tagIndex) in filterKeywordListInput(child.keywords)" :key="tagIndex" >
                                    <a-tag
                                      @click="selectChooseTag(child,keyword,parent)"
                                      class="tag-item">
                                      {{ keyword }}
                                    </a-tag>
                                  </div>
                                </div>
                                <div class="create-tag-wrapper tag-wrapper">
                                  <div class="skt-tag-create-line" @click="handleCreateTagByInput(child, parent)" v-show="!tagNameIsExist(createTagName,showTagList) && !tagIsExist(createTagName, filterKeywordListInput(child.keywords)) && createTagName && createTagName.length >= 1">
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
                              </div>
                            </a-tab-pane>
                          </a-tabs>

                        </template>
                      </div>
                    </a-tab-pane>
                  </a-tabs>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-spin>
      </a-card>
    </div>

    <a-modal
      title="My tags"
      v-model="settingVisible"
      :footer="null"
      width='600px'
      destroyOnClose
      :afterClose="refreshTag">
      <div>
        <tag-setting />
      </div>
    </a-modal>

  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import TagBrowser from '@/components/UnitPlan/TagBrowser'
import TagSetting from '@/components/UnitPlan/TagSetting'
import { AddUserTagNew } from '@/api/tag'
import { UtilMixin } from '@/mixins/UtilMixin'
import NoMoreResources from '@/components/Common/NoMoreResources'

export default {
  name: 'CustomTag',
  components: {
    NoMoreResources,
    TagBrowser,
    TagSetting
  },
  mixins: [UtilMixin],
  props: {
    selectedTagsList: {
      type: Array,
      default: () => []
    },
    customTags: {
      type: Object,
      required: true
    },
    scopeTagsList: {
      type: Array,
      default: () => []
    },
    showArrow: {
      type: Boolean,
      default: false
    },
    currentFieldName: {
      type: String,
      default: null
    }
  },
  mounted () {
  },
  destroyed () {

  },
  data () {
    return {
      tagList: this.selectedTagsList,
      globalRootKey: '',
      tagLoading: false,
      visible: true,
      settingVisible: false,
      browseVisible: false,
      inputTag: '',
      tagName: '',
      createTagName: '',
      tagSearchList: []
    }
  },
  created () {
    this.$logger.info('customTags', this.customTags)
  },
  computed: {
    showTagList: function () {
       const showList = []
       this.tagList.forEach(item => {
         showList.push(item)
       })
      return showList
    },

    mergeTagList: function () {
      const list = []
      this.$logger.info('customTags', this.customTags)
      this.$logger.info('scopeTagsList', this.scopeTagsList)
      const userGlobalTags = this.customTags.userGlobalTags
      this.scopeTagsList.forEach(scope => {
       const scopeIndex = this.customTags.recommends.findIndex(item => item.name === scope)
        let parent = ''
        if (scopeIndex > -1) {
          parent = this.customTags.recommends[scopeIndex]
          if (parent.customDeep > 1) {
            // 从user中合并tag
            if (userGlobalTags.length > 0) {
            parent.children.forEach(child => {
                userGlobalTags.forEach(tag => {
                  if (tag.parentId === child.id && child.keywords.indexOf(tag.name) === -1) {
                    child.keywords.push(tag.name)
                  }
                })
            })
            }
          }
        }
        // 再拼接user tags
        const userIndex = this.customTags.userTags.findIndex(item => item.name === scope)
        if (userIndex > -1) {
          // recommend不存在
          if (!parent) {
            parent = this.customTags.userTags[userIndex]
            if (!parent.customDeep) {
              parent.customDeep = 1
            }
          } else {
            // 合并
            this.customTags.userTags[userIndex].keywords.forEach(key => {
              if (parent.keywords.indexOf(key) === -1) {
                parent.keywords.push(key)
              }
            })
          }
        }

        if (parent) {
          list.push(parent)
        }
      })

      this.$logger.info('mergeTagList', list)
      return list
    },
    filterKeywordListInput() {
      return function(keywords) {
        let result = keywords
        if (this.inputTag) {
          result = keywords.filter(item => item.toLowerCase().indexOf(this.inputTag.toLowerCase()) > -1)
        }
        // 去除已经选择的
        const existTagNames = this.tagList.map(item => {
          return item.name.toLowerCase()
        })
        return result.filter(item => existTagNames.indexOf(item.toLowerCase()) === -1)
      }
    },
    canCloseTag() {
      return function(tag) {
        if (this.scopeTagsList.indexOf(tag.parentName) !== -1) {
          return true
        } else if (tag.parentName.indexOf('-') > -1) {
          if (this.scopeTagsList.indexOf(tag.parentName.split('-')[0] > -1)) {
            return true
          }
        }
        return false
      }
    }
  },
  watch: {
    selectedTagsList () {
      this.$logger.info('selectedTagsList change', this.selectedTagsList)
       this.tagList = this.selectedTagsList
    }
  },
  methods: {
    handleOk () {
    },
    handleCancel () {
      this.visible = false
    },
    handleSetting () {
      this.settingVisible = true
    },
    handleBrowse () {
      this.browseVisible = true
    },
    closeTag (tag) {
      console.log(tag)
      this.tagList.splice(this.tagList.findIndex(item => item.name === tag.name), 1)
      this.tagName = ''
      // this.$message.success('Remove label successfully')
      this.$emit('change-user-tags', this.tagList)
    },
    selectChooseTag (parent, tag, superParent) {
      this.$logger.info('choose tag ', parent, tag, superParent)
        this.tagList.unshift({
          'parentName': superParent ? (superParent.name + '-' + parent.name) : parent.name,
          'name': tag,
          'fieldName': this.currentFieldName,
          'id': 'unique_id_' + Math.random()
        })
    },
    // 选词功能，联想关键词获取关键词对应的tag，并自动填入，目前只有bloom,knowledge
    // "1440218576252366850"
    remoteChooseTag(parentId, tag) {
      // customDeep?
      const parent = this.mergeTagList.find(item => item.id === parentId)
      if (parent && tag) {
        if (typeof tag === 'string') {
          tag = [tag]
        }
        tag.forEach(tagName => {
          const isExist = this.tagList.find(item => item.name === tagName)
          if (!isExist) {
            this.selectChooseTag(parent, tagName)
          }
        })
      }
    },
    handleTagItemDrop (item, event) {
      console.log(item)
    },
    handleCreateTagByInput (parent, superParent) {
      this.$logger.info('skill handleCreateTagByInput ' + this.createTagName, 'parent', parent)
      const existTag = this.tagList.find(item => item.name.toLowerCase() === this.createTagName.toLowerCase())
      if (existTag) {
        this.$message.warn('already exist same name tag')
      } else {
        var item = {
          name: this.createTagName,
          parentName: parent.name,
          parentId: superParent ? parent.id : '',
          isGlobal: !!superParent
        }
        this.tagLoading = true
        AddUserTagNew(item).then((response) => {
          this.$logger.info('add AddUserTagNew ', response.result)
          if (response.success) {
            item.id = response.result.id
            this.createTagName = ''
            this.inputTag = ''
            this.$message.success('Add tag successfully')
            this.$emit('change-add-keywords', item)

            this.selectChooseTag(parent, item.name, superParent)
          } else {
            this.$message.error(response.message)
          }
          this.tagLoading = false
        })
      }
    },

    handleKeyEnter (parent) {
      this.$logger.info('tag handleKeyEnter ', this.inputTag, parent)
      this.createTagName = this.inputTag
      this.handleCreateTagByInput(parent)
    },

    searchTag (keyword) {
      logger.info('tag searchTag', keyword)
      this.createTagName = this.inputTag
    },
    refreshTag () {
      this.$emit('reload-user-tags')
    }

  }

}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";
.custom-tag {
  box-sizing: border-box;
  position: relative;
  margin-top: 20px;
  .header-triangle{
    display: block;
    left: -20px;
    top: 6px;
    border-style: solid;
    position: absolute;
    border-width: 25px 40px 25px 0px;
    border-color: transparent #15c39a transparent transparent;
  }
  .cover-card  /deep/ .ant-card-body{
    padding: 15px;
    border: 1px solid #e8e8e8;
  }
  .setting-button{
    color: #fff;
    background-color: #15c39a;
    border-color: #15c39a;
    background-color: rgba(255,255,255,0.2);
    &:hover {
      background-color: rgba(255,255,255,0.1);
    }
  }
  .skt-tag-wrapper {
    margin-top: 10px;
    position: relative;
    .triangle {
      position: absolute;
      top: -18px;
      left: 20px;
      width: 0;
      height: 0;
      border: 10px solid transparent;
      border-bottom: 10px solid rgba(21, 195, 154, 0.1);
    }
    .skt-tag-list {
      background: rgba(255, 255, 255, 1);
      border: 1px solid #f1f1f1;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      position: relative;

      .tag-wrapper {
        width: 100%;
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
          border: 1px solid #15c39a;
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

  .tag-category {
    margin-top: 15px;
    background: #f9f9f9;
    padding: 10px 10px 15px 10px;
    border-radius: 6px;
    .skt-tag-list {
      max-height: 250px;
      overflow-y: auto;
      box-shadow: 0 5px 10px rgba(78, 78, 78, 0.16);
    }
    .ant-radio-button-wrapper{
      margin-bottom: 10px;
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
}

/deep/ .ant-tabs-nav .ant-tabs-tab {
  margin: 0 10px 0 0;
  padding: 12px 10px;

}
/deep/ .ant-tag .anticon-close {
  height: 17px;
  display: flex;
  align-items: center;
  color: rgba(21, 195, 154, 1);
}

.tag-selected-label {
  padding-bottom: 10px;
}

.tag-content-wrapper {
  min-height: 100px;
  border-radius: 5px;
  border: 1px dashed #D3D3D3;
  background: #f9f9f9;
  width: 100%;

  .no-selected-tag {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    cursor: pointer;
    color: #bbb;
  }

  .selected-tag {
    position: relative;
  }

  .skt-tag-list {
    max-height: 300px;
    overflow-y: auto;
    padding: 7px 5px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    position: relative;

    .skt-tag-item {
      margin: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      vertical-align: middle;
      cursor: pointer;

      .tag-item {
        cursor: pointer;
        font-size: 13px;
        border-radius: 30px;
        padding: 3px 6px;
        word-break: normal;
        width: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow: hidden;
        opacity: 1;
        background-color: rgba(21, 195, 154, 0.1);
        color: #15c39a;
        border: 1px solid #15c39a;

        &:hover {
          background-color: rgba(21, 195, 154, 0.2);
        }
      }

      .tag-disable {
        color: rgba(0, 0, 0, .25);
        background-color: #f5f5f5;
        border-color: #d9d9d9;
        text-shadow: none;
        box-shadow: none;
        cursor: not-allowed;
      }
    }

  }
}

.skt-tag-list {
  .no-tag-content {
    width: 100%;
    height: 50px;
    display: flex;
    background: rgba(21, 195, 154, 0.1);
    justify-content: center;
    align-items: center;
    user-select: none;
    cursor: pointer;
    color: #aaa;
  }
}
</style>
