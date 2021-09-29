<template>
  <div class="custom-tag">
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
              >
                <a-tab-pane v-for="tag in userTagsMap" :key="tag[0]" :tab="tag[0]" :closable="editTab">
                  <div class="tab-content">
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
                    <div class="skt-tag-wrapper" v-show="tagSearchList.length || createTagName">
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
                          <div class="skt-tag-create-line" @click="handleCreateTagByInput" v-show="createTagName && createTagName.length >= 1">
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
              </a-tabs>
            </div>
          </a-col>
        </a-row>
      </div>

      <br />
    </div>

  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { AddUserTagNew, FindCustomTags } from '@/api/tag'

const { debounce } = require('lodash-es')

export default {
  name: 'TagSetting',
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
      editTab: true,
      tagLoading: false,
      inputTag: '',
      tagName: '',
      createTagName: '',
      tagSearchList: [],
      userTagsMap: new Map(),
      selectLabel: ''
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

    },
    add () {
      // const panes = this.panes
      // const activeKey = `newTab${this.newTabIndex++}`
      // panes.push({ title: 'New Tab', content: 'Content of new Tab', key: activeKey })
      // this.panes = panes
      // this.activeKey = activeKey
    },
    remove (targetKey) {

      // this.selectLabel = activeKey
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
    closeTag (tag) {
      console.log(tag)
      this.tagList.splice(this.tagList.findIndex(item => item.name === tag.name), 1)
      this.filterKeyword()
      this.tagName = ''
      // this.$message.success('Remove label successfully')
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
          this.changeTab(this.selectLabel)
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
    selectChooseTag (parent, tag) {
      // this.tagList.push({
      //   'parentName': parent,
      //   'name': tag,
      //   'id': this.tagList.length
      // })
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
      const userTypeTags = this.userTagsMap.get(this.selectLabel)
      if (userTypeTags.has(this.createTagName)) {
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
  margin-top: 20px;

  .tag-category {
    min-height: 450px;
    border-radius: 6px;
    .ant-radio-button-wrapper{
      margin-bottom: 10px;
    }
  }

  .skt-tag-wrapper {
    margin-top: 10px;
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
/deep/ .ant-tag .anticon-close {
  font-size: 14px;
  color: red;
  vertical-align: top;
}
.tab-content{
  margin: 0 5%;
  width: 90%;
}
</style>
