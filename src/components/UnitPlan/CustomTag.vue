<template>
  <div class="custom-tag">
    <div>
      <a-card class="cover-card" :head-style="{background:'#15c39a',color:'#fff'}" title="Tag your content" :bordered="false">
        <a v-if="showArrow" class="header-triangle"></a>
        <a-button class="setting-button" slot="extra" href="#" @click="handleSetting">My tags <a-icon type="edit" /></a-button>
        <div class="tag-title">
          Tags added :
        </div>
        <div class="tag-select-wrapper" v-show="tagList.length">
          <!--      skt-tag-list-->
          <a-row>
            <a-col offset="0" span="24">
              <div class="skt-tag-list" >
                <div class="skt-tag-item " v-for="tag in showTagList" :key="tag.name" >
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
            </a-col>
          </a-row>
        </div>

        <a-spin v-show="tagLoading" class="spin-loading"/>

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
                          <div class="create-tag-wrapper tag-wrapper">
                            <div class="skt-tag-create-line" @click="handleCreateTagByInput(parent)" v-show="!tagNameIsExist(createTagName,showTagList) && !tagIsExist(createTagName,filterKeywordListInput(parent.keywords)) && createTagName && createTagName.length >= 1">
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
                      </template>
                      <template v-else>
                        <a-tabs
                          tab-position="top"
                        >
                          <a-tab-pane v-for="(child,childIndex) in parent.children" :key="childIndex" :tab="child.name">
                            <div class="skt-tag-list">
                              <div class="search-tag-wrapper tag-wrapper" v-if="filterKeywordListInput(child.keywords).length > 0">
                                <div class="skt-tag-item" v-for="(keyword, tagIndex) in filterKeywordListInput(child.keywords)" :key="tagIndex" >
                                  <a-tag
                                    draggable="true"
                                    @click="selectChooseTag(child,keyword,parent)"
                                    class="tag-item">
                                    {{ keyword }}
                                  </a-tag>
                                </div>
                              </div>
                              <div class="create-tag-wrapper tag-wrapper">
                                <div class="skt-tag-create-line" @click="handleCreateTagByInput(child,parent)" v-show="!tagNameIsExist(createTagName,showTagList) && !tagIsExist(createTagName, filterKeywordListInput(child.keywords)) && createTagName && createTagName.length >= 1">
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

      </a-card>
      <br />
    </div>

    <a-modal
      title="My tags"
      v-model="settingVisible"
      :footer="null"
      destroyOnClose
      :afterClose="refreshTag"
      width="1000px"
      :dialog-style="{ top: '20px' }">
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

// const { debounce } = require('lodash-es')

export default {
  name: 'CustomTag',
  components: {
    TagBrowser, TagSetting
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
    // this.debouncedSearchKnowledge = debounce(this.searchTag, 500)
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
    // selectedTagsList () {
    //   this.$logger.info('selectedTagsList', this.selectedTagsList)
    //    this.tagList = this.selectedTagsList
    // }
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
        this.tagList.unshift({
          'parentName': superParent ? (superParent.name + '-' + parent.name) : parent.name,
          'name': tag,
          'id': this.tagList.length
        })
    },
    handleTagItemDrop (item, event) {
      console.log(item)
    },
    handleCreateTagByInput (parent, superParent) {
      this.$logger.info('skill handleCreateTagByInput ' + this.createTagName)
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
  //border: 1px solid #e8e8e8;
  box-sizing: border-box;
  position: relative;
  .header-triangle{
    display: block;
    left: -30px;
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
    border-radius: 6px;
    &:hover {
      border-color: #15c39a;
      background-color: rgba(255,255,255,0.2);
    }
  }
  margin-top: 20px;
  .tag-select-wrapper{
    margin: 10px 0px 10px 0px;
      .skt-tag-list {
        max-height: 300px;
        overflow-y: auto;
        padding: 5px 10px;
        background-color: #e7f9f5;
        //border: 1px solid #D8D8D8;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        box-shadow: 0px 6px 10px rgba(91, 91, 91, 0.16);
        position: relative;

        .skt-tag-item {
          margin: 8px 10px 8px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          vertical-align: middle;
          cursor: pointer;

          .tag-item {
            cursor: pointer;
            border-radius: 10px;
            word-break: normal;
            width: auto;
            display: block;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow: hidden;
            padding: 4px 4px 6px 4px;
            font-size: 15px;
            border: 1px solid #D8D8D8;
            box-shadow: 0px 6px 10px rgba(91, 91, 91, 0.16);
            opacity: 1;
            border-radius: 10px;
            background-color: rgba(21, 195, 154, 0.1);
            color: #15c39a;
            border: 1px solid #15c39a;
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
      border-bottom: 10px solid #eee;
    }
    .skt-tag-list {
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

  .tag-category {
    min-height: 350px;
    padding: 10px;
    border-radius: 6px;
    .skt-tag-list {
      max-height: 250px;
      overflow-y: auto;
      //padding: 5px 10px;
      //background-color: #e7f9f5;
      box-shadow: 0px 5px 10px rgba(78, 78, 78, 0.16);
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
/deep/ .ant-tag .anticon-close {
  font-size: 14px;
  color: red;
  vertical-align: top;
}

.tag-title {
  font-family: Inter-Bold;
  display: block;
  font-size: 14px;
  font-weight: 500;
  line-height: 30px;
}
</style>
