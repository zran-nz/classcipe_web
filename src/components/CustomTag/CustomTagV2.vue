<template>
  <div class="custom-tag" v-show='mergeTagList.length || showTagList.length'>
    <div class='tag-header'>
      <div class='tag-selected-label'>
        Selected tags
      </div>
      <div class='tag-setting'>
        <a-icon type="setting" @click='handleSetting' />
      </div>
    </div>
    <div class='tag-content-wrapper'>
      <div class='selected-tag' v-show="showTagList.length">
        <div class="skt-tag-list">
          <div class="skt-tag-item " v-for="(tag, tIdx) in showTagList" :key="tag.name">
            <a-tooltip :title="tag.parentName">
              <a-tag
                :closable="canCloseTag(tag)"
                @close="closeTag(tag)"
                :color="color[tIdx % color.length]"
                :style="{'color': fontColor[tIdx % color.length], 'border-color': color[tIdx % color.length]}"
                :class="{ 'tag-item':true, 'tag-disable': !canCloseTag(tag) }">
                {{ tag.name }}
              </a-tag>
            </a-tooltip>
          </div>
        </div>
      </div>
      <div class='no-selected-tag' v-show='!showTagList.length'>
        <common-no-data text='No tag' />
      </div>
    </div>

    <div class='tag-category-wrapper'>
      <template v-if='currentActiveTagCategory'>
        <custom-tag-category-bar :category-list='mergeTagList' :default-active-tag-category-name='currentActiveTagCategory.name' @change='handleChangeCategory'/>
      </template>
    </div>
    <div class='tag-category-content-wrapper'>
      <div class='category-search'>
        <custom-search-input :round='true' placeholder='Search your tag' :value.sync='inputTag' @change='searchTag' @search='handleKeyEnter'/>
      </div>
      <div class='category-content'>
        <template v-if="currentActiveTagCategory">
          <div class="search-tag-wrapper tag-wrapper" v-if="filterKeywordListInput(currentActiveTagCategory.keywords).length > 0">
            <div class="skt-tag-item" v-for="(keyword,tagIndex) in filterKeywordListInput(currentActiveTagCategory.keywords)" :key="tagIndex" >
              <a-tag
                draggable="true"
                @click="selectChooseTag(currentActiveTagCategory, keyword)"
                class="tag-item cc-custom-tag-item">
                {{ keyword }}
              </a-tag>
            </div>
          </div>
          <div class='no-tag-content' v-if='filterKeywordListInput(currentActiveTagCategory.keywords).length === 0 && !currentActiveTagCategory.createOwn && !!inputTag'>
            <div class='no-tag-text'>Tag does not exist, Press the Enter key to create.</div>
          </div>
        </template>
      </div>
    </div>
    <div class='tag-category-description'>
      <a-textarea
        v-if='currentActiveTagCategory'
        :auto-size="{ minRows: 3, maxRows: 6 }"
        v-model='currentActiveTagCategory.description'
        placeholder='Explain why choose the tags'
        class='cc-form-textarea-white-bg'
        allow-clear />
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
import CommonNoData from '@/components/Common/CommonNoData'
import CustomTagCategoryBar from '@/components/CustomTag/CustomTagCategoryBar'
import CustomSearchInput from '@/components/Common/CustomSearchInput'

export default {
  name: 'CustomTagV2',
  components: {
    CustomSearchInput,
    CustomTagCategoryBar,
    CommonNoData,
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
    },
    displayMode: {
      type: String,
      default: 'edit' // readonly edit两种
    }
  },
  data () {
    return {
      color: [
        '#FFEDAF',
        '#C8F4FF',
        '#E6E4FF'
      ],
      fontColor: [
        '#734110',
        '#1A485F',
        '#201C54'
      ],
      tagList: this.selectedTagsList,
      globalRootKey: '',
      tagLoading: false,
      visible: true,
      settingVisible: false,
      browseVisible: false,
      inputTag: '',
      tagName: '',
      createTagName: '',
      tagSearchList: [],
      currentActiveTagCategory: null,
      tagMode: 'select' // select/desc
    }
  },
  created () {
    this.$logger.info('customTags', this.customTags)
  },
  mounted() {
    this.currentActiveTagCategory = this.mergeTagList.length ? this.mergeTagList[0] : null
    this.$logger.info('currentActiveTagCategory inited', this.currentActiveTagCategory)
  },
  computed: {
    showTagList: function () {
       const showList = []
       this.tagList.forEach(item => {
         if (this.currentFieldName && this.currentFieldName === item.fieldName) {
          showList.push(item)
         } else if (!this.currentFieldName) {
          showList.push(item)
         }
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

        // 拼接pd tags
        const pdIndex = this.customTags.pdTags.findIndex(item => item.name === scope)
        if (pdIndex > -1) {
          if (!parent) {
            parent = this.customTags.pdTags[pdIndex]
          } else {
            // 合并
            this.customTags.pdTags[pdIndex].keywords.forEach(key => {
              if (parent.keywords.indexOf(key) === -1) {
                parent.keywords.push(key)
              }
            })
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
        this.$logger.info('filterKeywordListInput', keywords)
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
    },
    mergeTagList () {
      if (!this.currentActiveTagCategory && this.mergeTagList.length) {
        this.currentActiveTagCategory = this.mergeTagList[0]
      }
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
        this.tagList.push({
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

    handleKeyEnter (data) {
      this.$logger.info('tag handleKeyEnter', data)
      this.handleCreateTagByInput(this.currentActiveTagCategory)
    },

    searchTag (keyword) {
      logger.info('tag searchTag', keyword)
      this.createTagName = this.inputTag
    },
    refreshTag () {
      this.$emit('reload-user-tags')
    },
    handleChangeCategory(category) {
      this.$logger.info('change category', category)
      this.currentActiveTagCategory = category
    }
  }

}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";
.custom-tag {
  position: relative;

  .tag-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .tag-selected-label {
      font-size: 16px;
      font-family: Arial;
      font-weight: bold;
      color: #191919;
      line-height: 40px;
    }
  }
}

.tag-content-wrapper {
  min-height: 110px;
  background: #FFFFFF;
  border: 1px solid #f2f3f5;
  border-radius: 4px;
  width: 100%;
  padding: 10px 15px;

  .no-selected-tag {
    height: 110px;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    cursor: pointer;
    color: #bbb;
  }

  .selected-tag {
    position: relative;
    .skt-tag-list {
      max-height: 300px;
      overflow-y: auto;
      padding: 3px 0;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      position: relative;

      .skt-tag-item {
        margin: 0 10px 10px 0;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        cursor: pointer;

        .tag-item {
          cursor: pointer;
          font-size: 13px;
          border-radius: 30px;
          line-height: 30px;
          padding-left: 15px;
          word-break: normal;
          width: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow: hidden;
          opacity: 1;

          /deep/ .anticon-close {
            opacity: 0;
            color: #f26c59;
          }

          &:hover {
            /deep/ .anticon-close {
              opacity: 1;
            }
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
}
.tag-category-wrapper {
  margin-top: 30px;
}

.tag-category-content-wrapper {
  background: #FFFFFF;
  border: 1px solid #f2f3f5;
  border-radius: 4px;
  width: 100%;
  padding: 15px;
}

.tag-category-description {
  margin-top: 20px;
}

.cc-custom-tag-item {
  background: #FFEDAF;
  border-radius: 36px;
  font-family: Arial;
  padding: 0 10px;
  font-weight: 400;
  color: #734110;
  line-height: 36px;
  border-color: #FFEDAF;
}

.category-content {
  padding-top: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.search-tag-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;

  .skt-tag-item {
    margin: 0 10px 10px 0;
    cursor: pointer;
    .ant-tag {
      cursor: pointer;
    }
  }
}
</style>
