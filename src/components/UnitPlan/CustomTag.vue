<template>
  <div class="custom-tag">
    <div>
      <a-card class="cover-card" :head-style="{background:'#15c39a',color:'#fff'}" title="Tags your content" :bordered="false">
        <a v-if="showArrow" class="header-triangle"></a>
        <a-button class="setting-button" slot="extra" href="#" @click="handleSetting">My tags <a-icon type="edit" /></a-button>

        <div class="tag-select-wrapper" v-show="tagList.length">
          <!--      skt-tag-list-->
          <a-row>
            <a-col offset="0" span="24">
              <div class="skt-tag-list" >
                <div class="skt-tag-item " v-for="tag in tagList" :key="tag.id" >
                  <a-tooltip :title="tag.parentName">
                    <a-tag
                      :closable="customCategory.indexOf(tag.parentName)!== -1"
                      @close="closeTag(tag)"
                      :class="{'tag-item':true,'tag-disable':customCategory.indexOf(tag.parentName) === -1 }">
                      {{ tag.name }}
                    </a-tag>
                  </a-tooltip>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>

        <a-spin v-show="tagLoading" class="spin-loading"/>

        <div class="tag-category" v-show="!userTagsMap.length">
          <a-row>
            <a-col offset="0" span="24">
              <div>
                <a-tabs
                  :default-active-key="selectLabel"
                  tab-position="top"
                  @change="changeTab"
                >
                  <a-tab-pane v-for="tag in userTagsMap" :key="tag[0]" :tab="tag[0]">
                    <a-row>
                      <a-col offset="0" :span="24">
                        <div class="tag-search-input">
                          <a-input-search
                            v-model="inputTag"
                            size="large"
                            placeholder="Add tags"
                            class="search-input"
                            @keyup.enter.native="handleKeyup"
                            @search="searchTag"
                            @keyup="searchTag" >
                            <a-icon slot="prefix" type="plus-circle" :style="{ fontSize: '16px', color: '#15c39a','margin-right':'5px' }" />
                            <a-button slot="enterButton">
                              Add
                            </a-button>
                          </a-input-search>
                        </div>
                      </a-col>
                    </a-row>

                    <div class="skt-tag-wrapper" v-show="tagSearchList.length || createTagName">
                      <div class="triangle"></div>
                      <!--      skt-tag-list-->
                      <div class="skt-tag-list">

                        <div class="search-tag-wrapper tag-wrapper">
                          <div class="skt-tag-item" v-for="(keyword,index) in tagSearchList" :key="index" >
                            <a-tag
                              draggable="true"
                              @click="selectChooseTag(tag[0],keyword)"
                              class="tag-item">
                              {{ keyword }}
                            </a-tag>
                          </div>
                        </div>
                        <div class="create-tag-wrapper tag-wrapper">
                          <div class="skt-tag-create-line" @click="handleCreateTagByInput" v-show="!isShowBrowse && createTagName && createTagName.length >= 1">
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
      title="Tags Setting"
      v-model="settingVisible"
      :footer="null"
      destroyOnClose
      width="80%"
      :dialog-style="{ top: '20px' }">
      <div>
        <tag-setting @add-user-tag="handleAddUserTag"/>
      </div>
    </a-modal>

  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import TagBrowser from '@/components/UnitPlan/TagBrowser'
import TagSetting from '@/components/UnitPlan/TagSetting'
import { AddUserTagNew } from '@/api/tag'

const { debounce } = require('lodash-es')

export default {
  name: 'CustomTag',
  components: {
    TagBrowser, TagSetting
  },
  props: {
    selectedTagsList: {
      type: Array,
      default: () => []
    },
    userTags: {
      type: Object,
      required: true
    },
    customTagsList: {
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
      isShowBrowse: false,
      tagLoading: false,
      visible: true,
      settingVisible: false,
      browseVisible: false,
      inputTag: '',
      tagName: '',
      createTagName: '',
      tagSearchList: [],
      userTagsMap: new Map(),
      selectLabel: '',
      customCategory: []
    }
  },
  created () {
    this.debouncedSearchKnowledge = debounce(this.searchTag, 500)
    this.customCategory = this.customTagsList
    this.handleUserTagsMap()
  },
  watch: {
    selectedTagsList () {
       this.tagList = this.selectedTagsList
    },
    customTagsList (categorys, old) {
      logger.info('new customTagsList', categorys)
      this.customCategory = categorys
      this.handleUserTagsMap()
    }
  },
  methods: {
    changeTab (tabName) {
      this.selectLabel = tabName
      this.filterKeyword()
    },
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
      this.filterKeyword()
      this.tagName = ''
      // this.$message.success('Remove label successfully')
      this.$emit('change-user-tags', this.tagList)
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
      this.mergeTags(this.userTags)
      this.$logger.info('mergeTags tags', this.userTagsMap)
      this.selectLabel = ''
      this.userTagsMap.forEach((value, key) => {
        if (!this.selectLabel) {
          this.selectLabel = key
        }
      })
      this.filterKeyword()
    },
    mergeTags (result) {
      const recommendTags = result.recommends
      const myTags = result.userTags
      this.userTagsMap = new Map()
      // const categorys = ['Key words', 'Global interactions']
      if (this.customCategory.length > 0) {
        // 默认显示的tag，优先从个人库获取
        this.customCategory.forEach(parent => {
          this.userTagsMap.set(parent, new Set())
          const tagC = myTags.filter(tag => tag.name === parent)
          logger.info('tagC', tagC)
          if (tagC.length > 0) {
            this.userTagsMap.set(parent, new Set(tagC[0].keywords))
          }
          const tagCRecommend = recommendTags.filter(tag => tag.name === parent)
          if (tagCRecommend.length > 0) {
            // 合并
            const tags = new Set([...this.userTagsMap.get(parent), ...new Set(tagCRecommend[0].keywords)])
            logger.info('tagCRecommend', tags)
            this.userTagsMap.set(parent, tags)
          }
        })
      }
    },
    filterKeyword () {
      this.tagSearchList = []
      const keywords = this.userTagsMap.get(this.selectLabel)
      if (!keywords) {
        return
      }
      const tagListNames = []
      this.tagList.forEach(item => {
        tagListNames.push(item.name)
      })
      this.tagSearchList = Array.from(keywords)
      this.tagSearchList = this.tagSearchList.filter(name => tagListNames.indexOf(name) === -1)
      if (this.inputTag) {
        this.tagSearchList = this.tagSearchList.filter(item => item.toLowerCase().indexOf(this.inputTag.toLowerCase()) > -1)
      }
    },
    selectChooseTag (parent, tag) {
        this.tagList.push({
          'parentName': parent,
          'name': tag,
          'id': this.tagList.length
        })
        this.filterKeyword()
    },
    handleAddUserTag (tags, isAdd) {
       // this.handleUserTagsMap()
    },
    handleTagItemDrop (item, event) {
      console.log(item)
    },
    handleCreateTagByInput () {
      this.$logger.info('skill handleCreateTagByInput ' + this.createTagName)
      const existTag = this.tagList.find(item => item.name === this.createTagName)
      const userTypeTags = this.userTagsMap.get(this.selectLabel)
      if (!userTypeTags) {
        this.$message.warn('Please click tab')
        return
      }
      if (existTag || userTypeTags.has(this.createTagName)) {
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
            this.userTagsMap.get(this.selectLabel).add(item.name)
            this.changeTab(this.selectLabel)
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
    left: -40px;
    top: 15px;
    border-style: solid;
    position: absolute;
    border-width: 15px 40px 20px 0px;
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
</style>
