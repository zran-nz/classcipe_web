<template>
  <a-row class="new-tag-ui">
    <a-col span="24">

      <div class="skt-description-list-wrapper">
        <a-row >
          <a-col span="24">
            <div class="skt-description-list">
              <div
                :class="{
                  'skt-description-tag-item': true,
                  'skt-description-tag-item-top-fixed': true,
                  'active-description-line': true}"
                @dblclick="handleActiveDescription()">
                <div class="skt-description">
                  double click one learning outcome to add relevant tags double click one learning outcome to
                  add relevant tags double click one learning outcome to add relevant tags
                </div>
                <div
                  class="actions">
                  <span class="add-action" >
                    <img src="~@/assets/icons/tag/add.png"/>
                  </span>
                  <span class="up-down" >
                    <a-icon type="down" />
                  </span>
                </div>
              </div>
              <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteKnowledgeItem(descriptionTagList[0].subKnowledgeId)" cancel-text="No">
                <span class="delete-action" >
                  <img src="~@/assets/icons/tag/delete.png"/>
                </span>
              </a-popconfirm>
            </div>
            <div class="skt-description-list">
              <div
                :class="{
                  'skt-description-tag-item': true,
                  'skt-description-tag-item-top-fixed': true,
                  'active-description-line': true}"
                @dblclick="handleActiveDescription()">
                <div class="skt-description">
                  double click one learning outcome to add relevant tags double cli
                </div>
                <!--        <span class="delete-action" >
                    <img src="~@/assets/icons/tag/delete.png"/>
                </span>-->
              </div>
              <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteKnowledgeItem(descriptionTagList[0].subKnowledgeId)" cancel-text="No">
                <span class="delete-action" >
                  <img src="~@/assets/icons/tag/delete.png"/>
                </span>
              </a-popconfirm>
            </div>
          </a-col>
        </a-row>
      </div>

    </a-col>
  </a-row>
</template>

<script>
  import * as logger from '@/utils/logger'
  import { KnowledgeSearch } from '@/api/knowledge'
  import NewBrowser from '@/components/NewLibrary/NewBrowser'
  import { SelectModel } from '@/components/NewLibrary/SelectModel'
  import NoMoreResources from '@/components/Common/NoMoreResources'
  import { TagType } from '@/const/common'
  const { debounce } = require('lodash-es')

  export default {
    name: 'UiLearnOut',
    components: {
      NewBrowser,
      NoMoreResources
    },
    props: {
      selectedKnowledgeTags: {
        type: Array,
        default: () => []
      },
      selectedSkillTags: {
        type: Array,
        default: () => []
      },
      gradeIds: {
        type: Array,
        default: () => []
      },
      subjectIds: {
        type: Array,
        default: () => []
      }
    },
    mounted () {

    },
    destroyed () {

    },
    computed: {
      searchTagList () {
        return this.tagList.filter(tag => tag.type === this.tagOriginType.Search)
      },
      recommendTagList () {
        return this.tagList.filter(tag => tag.type === this.tagOriginType.Description)
      },
      createdTagList () {
        return this.tagList.filter(tag => tag.type === this.tagOriginType.Create)
      }
    },
    data () {
      return {
        inputTag: '',
        searchList: [],
        tagList: [],
        selectModel: SelectModel,
        descriptionTagList: [],
        descriptionKnowLedgeTagList: [],
        descriptionSkillList: [],
        subKnowledgeId2InfoMap: new Map(), // subKnowledgeId 对应的父级信息标签
        activeSubKnowledgeId: null,
        tagNameSearchListDialogueVisible: false,
        tagNameSearchList: [],
        tagNameSearchListSelected: [],

        associateLibraryVisible: false,
        createTagName: '',
        activeDescriptionId: null,
        tagListVisible: false
      }
    },
    created () {
      this.debouncedSearchKnowledge = debounce(this.searchKnowledge, 500)
      this.$logger.info('after add tagList', this.tagList)
      this.$logger.info('after add descriptionKnowLedgeTagList', this.descriptionKnowLedgeTagList)
      this.$logger.info('after add descriptionSkillTagList', this.descriptionSkillTagList)
    },
    watch: {
      searchList () {
        this.$logger.info('update search tag list with list size ' + (this.searchList.length), this.searchList)
        let tagList = this.tagList
        tagList = this.tagList
        tagList = tagList.filter(item => item.type !== this.tagOriginType.Search)
        const existNameList = []
        this.searchList.forEach(item => {
          if (existNameList.indexOf(item.name) === -1) {
            tagList.push({
              ...item
            })
            existNameList.push(item.name)
          }
        })
        this.tagList = tagList
        this.$logger.info('after update search tag list', this.tagList)
        if (tagList.length > 0) {
          this.tagListVisible = true
        } else {
          if (!this.inputTag) {
            this.tagListVisible = false
          }
        }
      }
    },
    methods: {
      handleContentListSelectClick (data) {
      },
      handleKeyup () {
        this.$logger.info('handleKeyup ', this.inputTag)
        this.debouncedSearchKnowledge(this.inputTag)
        this.createTagName = this.inputTag
      },
      searchKnowledge (keyword) {
        logger.info('searchKnowledge', keyword)
        this.searchList = []
        // knowledge和skill统一数据接口
        if (typeof keyword === 'string' && keyword.trim().length >= 1) {
          KnowledgeSearch({
            key: keyword,
            tagType: TagType.knowledge
          }).then((response) => {
            logger.info('searchKnowledge response', response)
            this.searchList = response.result
          })
        }
      },

      handleDescriptionTagClose (tag) {
        this.$logger.info('handleDescriptionTagClose ', tag)
        const tagIndex = this.descriptionTagList.findIndex(item => item.subKnowledgeId === tag.subKnowledgeId)
        const item = this.descriptionTagList[tagIndex]
        this.$logger.info('raw handleDescriptionTagClose ', item)
        item.tagList = item.tagList.filter(item => item.name !== tag.name)
        this.descriptionTagList.splice(tagIndex, 1, item)
        this.$logger.info('after handleDescriptionTagClose ', this.descriptionTagList[tagIndex])
      },

      handleCreateTagByInput () {
        this.$logger.info('handleCreateTagByInput ' + this.createTagName)
        if (this.createTagName) {
          const existTag = this.tagList.find(item => item.name === this.createTagName)
          if (existTag) {
            this.$message.warn('already exist same name tag')
          } else {
            this.tagList.push({
              name: this.createTagName
            })
          }
          this.createTagName = ''
          this.inputTag = ''
        }
      },

      handleDeleteCreatedTag (tag) {
        this.$logger.info('handleDeleteCreatedTag ', tag)
        const tagList = []
        this.tagList.forEach(item => {
          if (!(item.type === this.tagOriginType.Create && item.name === tag.name)) {
            tagList.push(item)
          }
        })
        this.tagList = tagList
        this.$logger.info('after handleDeleteCreatedTag tag list', this.tagList)
      },

      handleDeleteKnowledgeItem (subKnowledgeId) {

      }
    }
  }
</script>

<style lang="less" scoped>

  @import "~@/components/index.less";

  .skt-description-list-wrapper {
    .skt-description-list {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      .skt-description-sub-list {
        max-height: 300px;
        overflow-y: scroll;
        border: 1px solid #f9f9f9;
      }
      .skt-description-tag-item {
        width: 700px;
        background: #FFFFFF;
        border: 1px solid #15C39A;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        opacity: 1;
        border-radius: 4px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        padding: 10px;
        position: relative;
        &:hover {
          color: @primary-color;
        }
        .skt-description {
          width: 90%;
          padding-right: 10px;
          position: relative;
          .description-txt {
            padding: 10px;
            border: 1px dashed #666;
            line-height: 24px;
            color: #11142D;
            display: inline-block;
            width: 100%;
            height: 100px;
            overflow-y: scroll;
          }
        }

        .skt-description-tag-list {
          border: 1px dashed #666;
          padding: 5px 10px;
          width: 40%;
          height: 100px;
          overflow-y: scroll;
          min-height: 50px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          .tag-list-item {
            margin: 3px 10px 3px 0;
            display: flex;
            justify-content: center;
            align-items: center;
            vertical-align: middle;
            cursor: pointer;
            .tag-item {
              border-radius: 10px;
              word-break:normal;
              width:auto;
              display:block;
              white-space:pre-wrap;
              word-wrap : break-word ;
              overflow: hidden ;
              padding-bottom: 3px;
            }
          }

          .knowledge-mode {
            .tag-item {
              color: rgba(239, 78, 78, 1);
              background: rgba(239, 78, 78, 0.1);
              border: 1px solid #EF4E4E;
            }
          }

          .skill-mode {
            .tag-item {
              background-color: rgba(21, 195, 154, 0.1);
              color: rgba(21, 195, 154, 1);
              border: 1px solid rgba(21, 195, 154, 1);
            }
          }

        }
        .actions{
          display: flex;
          align-items: center;
          .add-action {
            display: flex;
            cursor:pointer;
            height: 20px;
            img {
              width: 20px;
            }
          }
          .up-down{
            cursor: pointer;
            display: flex;
            width: 20px;
            margin-left: 8px;
          }
        }
      }
      .delete-action {
        display: flex;
        height: 40px;
        img {
          width: 40px;
        }
      }

      .active-description-line {
        color: @primary-color;
        border: 2px solid @primary-color !important;
        background-color: fade(@outline-color, 20%);

        &:hover {
          border: 1px solid @primary-color;
          color: @primary-color;
        }
      }
    }
  }

  .search-tag-list {
    height: 300px;
    overflow-y: scroll;
    .search-description-item {
      margin-bottom: 10px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      border: 1px solid rgba(216, 216, 216, 1);
      opacity: 1;
      border-radius: 4px;
      .description-info {
        padding: 10px;
        .info-detail {
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;

          .info-checked {
            color: #15C39A;
          }
        }
      }
    }

    .selected-item {
      background: rgba(21, 195, 154, 0.1);
      border: 1px solid #15C39A;
      opacity: 1;
      border-radius: 4px;
    }
  }

</style>
