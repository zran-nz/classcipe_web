<template>
  <div class="custom-tag">
    <div>
      <a-card class="cover-card" title="Customized tags" :bordered="false">
        <a slot="extra" href="#" @click="handleSetting">Tags setting <a-icon type="edit" /></a>

        <div class="tag-select-wrapper" v-show="tagList.length">
          <!--      skt-tag-list-->
          <a-row>
            <a-col offset="0" span="24">
              <div class="skt-tag-list" >
                <div class="skt-tag-item " v-for="tag in tagList" :key="tag.id" >
                  <a-tooltip :title="tag.parentName">
                    <a-tag
                      :closable="true"
                      @close="closeTag(tag)"
                      :color="tagName === tag.name ? 'orange': 'green'"
                      class="tag-item">
                      {{ tag.name }}
                    </a-tag>
                  </a-tooltip>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>

        <a-spin v-show="tagLoading" class="spin-loading"/>

        <div class="tag-category" v-show="userTags">
          <a-row>
            <a-col offset="0" span="24">
              <div>
                <a-radio-group v-model="selectLabel" button-style="solid">
                  <a-tag v-for="(label,index) in userTags" :key="index" :value="label.id" :class="{'category-tag': true, 'active': label.id === selectLabel}" @click="onChangeLabel(label)">
                    <span v-if="label.isGlobal"><a-badge dot>{{ label.name }}</a-badge></span>
                    <span v-else>{{ label.name }}</span>
                  </a-tag>
                </a-radio-group>
              </div>
            </a-col>
          </a-row>
        </div>

        <a-row>
          <a-col offset="0" :span="isShowBrowse ? 20 : 24">
            <div class="tag-search-input">
              <a-input-search
                v-model="inputTag"
                size="large"
                placeholder="search key words"
                class="search-input"
                @keyup.enter.native="handleKeyup"
                @search="searchTag"
                @keyup="searchTag" />
            </div>
          </a-col>
          <a-col span="4" align="middle" v-show="isShowBrowse">
            <div class="tag-search-input">
              <a-button class="browse" @click="handleBrowse" type="primary" size="large">
                <img src="~@/assets/icons/unitplan/browse.png" class="btn-icon"/>
                <div class="btn-text">
                  Browse
                </div>
              </a-button>
            </div>
          </a-col>
        </a-row>

        <div class="skt-tag-wrapper" v-show="tagSearchList.length || createTagName">
          <!--      skt-tag-list-->
          <a-row>
            <a-col offset="0" :span="isShowBrowse ? 20 : 24">
              <div class="skt-tag-list">
                <div class="triangle"></div>
                <div class="search-tag-wrapper tag-wrapper">
                  <div class="skt-tag-item" v-for="(tag,index) in tagSearchList" :key="index" >
                    <a-tag
                      draggable="true"
                      @dragstart="handleTagItemDragStart(tag, $event)"
                      @click="selectChooseTag(index,tag)"
                      class="tag-item">
                      {{ tag.name }}
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
            </a-col>
          </a-row>
        </div>
      </a-card>
      <br />
    </div>

    <a-modal v-model="browseVisible" :footer="null" destroyOnClose width="800px" :dialog-style="{ top: '20px' }">
      <div class="associate-library">
        <tag-browser :root-key="globalRootKey" :tagList="tagList" @add-global-tag="handleAddGlobalTag"/>
      </div>
    </a-modal>

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
import { GetUserTags } from '@/api/tag'
import { UserTagAddOrUpdate } from '../../api/tag'

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
    customTagsList: {
      type: Array,
      default: () => []
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
      userTags: [],
      selectLabel: '',
      selectLabelName: ''
    }
  },
  created () {
    this.debouncedSearchKnowledge = debounce(this.searchTag, 500)
    this.loadUserTags()
  },
  watch: {
    selectedTagsList () {
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
      this.tagList = this.tagList.filter(item => item.name !== tag.name)
      this.filterKeyword()
      this.tagName = ''
      this.$message.success('Remove label successfully')
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
    loadUserTags () {
      this.tagLoading = true
      GetUserTags({ defaultTags: encodeURIComponent(this.customTagsList.join(',')) }).then((response) => {
        this.$logger.info('GetUserTags response', response.result)
        if (response.success) {
          this.userTags = response.result
          if (this.userTags.length > 0) {
            this.selectLabel = this.userTags[0].id
            this.selectLabelName = this.userTags[0].name
            this.tagSearchList = this.userTags[0].keywords
          }
          this.filterKeyword()
        } else {
          this.$message.error(response.message)
        }
        this.tagLoading = false
      })
    },
    filterKeyword (tag) {
      const userTypeTags = this.userTags.filter(item => item.id === this.selectLabel)
      if (userTypeTags.length === 0) {
        return
      }
      if (userTypeTags[0].isGlobal) {
        this.isShowBrowse = true
        this.globalRootKey = userTypeTags[0].name
      }
      const tagListNames = []
      this.tagList.forEach(item => {
        tagListNames.push(item.name)
      })
      const keywords = userTypeTags[0].keywords
      if (tag) {
        keywords.push(tag)
      }
      this.tagSearchList = keywords.filter(item => tagListNames.indexOf(item.name) === -1)
      if (this.inputTag) {
        this.tagSearchList = this.tagSearchList.filter(item => item.name.toLowerCase().indexOf(this.inputTag.toLowerCase()) > -1)
      }
    },
    selectChooseTag (index, tag) {
        tag.parentName = this.selectLabelName
        this.tagList.push(tag)
        this.filterKeyword()
    },
    onChangeLabel (label) {
      this.selectLabel = label.id
      this.selectLabelName = label.name
      this.isShowBrowse = false
      this.filterKeyword()
    },
    handleTagItemDragStart (tag, event) {
      this.$logger.info('skill handleTagItemDragStart', tag, event)
      event.dataTransfer.setData('tag', JSON.stringify(tag))
    },
    handleAddGlobalTag (tags) {
      this.tagList = tags
      this.$emit('change-user-tags', this.tagList)
    },
    handleGlobalLabel (label, isAdd) {
      if (isAdd) {
        label.isGlobal = true
        this.userTags.push(label)
      } else {
        var index = this.userTags.findIndex(item => (item.isGlobal && item.name === label.name))
        this.userTags.splice(index, 1)
      }
      this.$emit('change-user-tags', this.tagList)
    },
    handleAddUserTag (tags, isAdd) {
       this.loadUserTags()
    },
    handleTagItemDrop (item, event) {
      console.log(item)
    },
    handleCreateTagByInput () {
      this.$logger.info('skill handleCreateTagByInput ' + this.createTagName)
      const existTag = this.tagList.find(item => item.name === this.createTagName)
      const userTypeTags = this.userTags.filter(item => item.id === this.selectLabel)
      if (userTypeTags.length === 0) {
        this.$message.warn('Please click Tags setting')
        return
      }
      var existTag2 = userTypeTags[0].keywords.find(item => item.name === this.createTagName)
      if (existTag || existTag2) {
        this.$message.warn('already exist same name tag')
      } else {
        var item = {
          name: this.createTagName,
          parentId: this.selectLabel,
          isGlobal: userTypeTags[0].isGlobal
        }
        this.tagLoading = true
        UserTagAddOrUpdate(item).then((response) => {
          this.$logger.info('add UserTagAddOrUpdate ', response.result)
          if (response.success) {
            item.id = response.result.id
            this.createTagName = ''
            this.inputTag = ''
            this.filterKeyword(item)
            this.$message.success('Add tag success')
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
  .cover-card .ant-card-body{
    padding: 5px;
  }
  margin-top: 20px;
  .tag-select-wrapper{
    margin: 10px 0px 10px 0px;
      .skt-tag-list {
        padding: 5px 10px;
        background-color: #e7f9f5;
        border: 1px solid #D8D8D8;
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
            padding-bottom: 3px;
            font-size: 15px;
            border: 1px solid #D8D8D8;
            box-shadow: 0px 6px 10px rgba(91, 91, 91, 0.16);
            opacity: 1;
            border-radius: 6px;
            background-color: rgba(21, 195, 154, 0.1);
            color: #15c39a;
            border: 1px solid #15c39a;
          }
        }
      }
  }
  .skt-tag-wrapper {
    margin-top: 10px;
    .skt-tag-list {
      padding: 20px 10px 5px 10px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid #D8D8D8;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      box-shadow: 0px 6px 10px rgba(91, 91, 91, 0.16);
      position: relative;

      .triangle {
        position: absolute;
        top: -20px;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-bottom: 10px solid #eee;
      }

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
    padding: 10px;
    background: rgba(255, 187, 0, 0.1);
    opacity: 0.8;
    border-radius: 6px;
    .skt-tag-list {
      padding: 5px 10px;
      background-color: #e7f9f5;
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
  }
  .spin-loading{
    margin-top: 50px;
    margin-left: 40%;
  }

  position: relative;
  border: 1px dotted #fff;
  &:hover {
    border: 1px dotted @link-hover-color;
    box-sizing: border-box;
  }
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

</style>
