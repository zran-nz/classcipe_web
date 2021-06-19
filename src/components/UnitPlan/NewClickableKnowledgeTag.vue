<template>
  <div class="knowledge-skill-tag-selector">
    <div class="skt-search-wrapper">
      <!-- skt-input search-->
      <a-form-model-item :label="$t('teacher.add-unit-plan.knowledge-tags')">
        <div class="knowledge-tag-search-input">
          <input v-model="inputTag" @keyup="handleKeyup" :placeholder="$t('teacher.add-unit-plan.please-enter-knowledge-tag')"/>
          <a-tooltip :mouseEnterDelay="1">
            <template slot="title">
              Create Tag
            </template>
            <a-tag class="create-btn" v-show="inputTag && inputTag.length >= 1" @click="handleCreateTagByInput">
              + Create
            </a-tag>
          </a-tooltip>
        </div>
      </a-form-model-item>
    </div>
    <div class="skt-tag-wrapper">
      <!--      skt-tag-list-->
      <a-row>
        <a-col offset="4" span="18">
          <div class="skt-tag-list">
            <div class="skt-tag-item" v-for="(tag,index) in tagList" :key="index" :data-tag-type="tag.type" @dblclick="handleDbClickTagListTag(tag)">
              <a-tag
                :color="tagColorList[index % tagColorList.length]"
                class="tag-item"
                v-if="tag.type === tagOriginType.Origin">
                {{ tag.name }}
              </a-tag>
              <a-tag
                color="#108ee9"
                class="tag-item"
                v-if="tag.type === tagOriginType.Search">
                <a-icon type="search" /> {{ tag.name }}
              </a-tag>
              <a-tag
                color="#87d068"
                class="tag-item"
                v-if="tag.type === tagOriginType.Description">
                <a-icon type="tag" /> {{ tag.name }}
              </a-tag>
              <a-tag
                color="#2db7f5"
                class="tag-item"
                v-if="tag.type === tagOriginType.Create"
                closable
                @close="handleDeleteCreatedTag(tag)"><a-icon type="highlight" /> {{ tag.name }}
              </a-tag>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="skt-description-list-wrapper">
      <!--      description-list-->
      <a-row>
        <a-col offset="4" span="18">
          <div class="skt-description-list">
            <div></div>
            <div
              :class="{
                'skt-description-tag-item': true,
                'active-description-line': subKnowledgeId === activeSubKnowledgeId}"
              :data-id="subKnowledgeId"
              v-for="(descriptionTagList, subKnowledgeId) in descriptionTagMap"
              v-if="descriptionTagList.length"
              :key="subKnowledgeId"
              @dblclick="handleActiveDescription(subKnowledgeId)">
              <div class="skt-description">
                <a-tooltip :mouseEnterDelay="1" class="description-txt" >
                  <template slot="title">
                    {{ descriptionTagList[0].description }}
                  </template>
                  {{ descriptionTagList[0].description }}
                </a-tooltip>
              </div>
              <div class="skt-description-tag-list">
                <div class="tag-list-item" v-for="(tag,tIndex) in descriptionTagList" :key="tIndex">
                  <a-tag
                    :color="tagColorList[tIndex % tagColorList.length]"
                    class="tag-item"
                    v-if="tag.type === tagOriginType.Origin"
                    :closable="tag.subKnowledgeId === activeSubKnowledgeId"
                    @close="handleDescriptionTagClose(tag)">
                    {{ tag.name }}
                  </a-tag>
                  <a-tag
                    class="tag-item"
                    v-if="tag.type === tagOriginType.Search"
                    :closable="tag.subKnowledgeId === activeSubKnowledgeId"
                    @close="handleDescriptionTagClose(tag)">
                    {{ tag.name }}
                  </a-tag>
                  <a-tag
                    class="tag-item"
                    v-if="tag.type === tagOriginType.Description"
                    :closable="tag.subKnowledgeId === activeSubKnowledgeId"
                    @close="handleDescriptionTagClose(tag)">
                    {{ tag.name }}
                  </a-tag>
                </div>
              </div>
              <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteKnowledgeItem(subKnowledgeId)" cancel-text="No">
                <span class="delete-action" v-show="subKnowledgeId === activeSubKnowledgeId" >
                  <a-icon type="delete" />
                </span>
              </a-popconfirm>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    <a-modal v-model="tagNameSearchListDialogueVisible" @ok="handleEnsureTagSearchList" destroyOnClose width="800px">
      <div class="search-tag-list">
        <a-checkbox-group :value="tagNameSearchListSelected" v-if="tagNameSearchList.length" @change="tagNameSearchListChange">
          <a-row v-for="(item,index) in tagNameSearchList" :key="index" :gutter="[16,16]">
            <a-col :span="24">
              <a-checkbox :value="item.subKnowledgeId">
                {{ item.description }}
              </a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
        <div class="empty-search-list" v-if="!tagNameSearchList.length">
          <a-empty />
          <span class="create-description" @click="handleCreateDescription"><a>Create A Description now</a></span>
        </div>
      </div>
    </a-modal>

    <a-modal v-model="associateLibraryVisible" @ok="handleEnsureAssociate" destroyOnClose width="90%" :dialog-style="{ top: '20px' }">
      <div class="associate-library">
        <new-browser />
      </div>
    </a-modal>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { KnowledgeSearch, KnowledgeQueryTagsByKnowledgeId } from '@/api/knowledge'
import NewBrowser from '@/components/NewLibrary/NewBrowser'
const { debounce } = require('lodash-es')

const TagOriginType = {
  Origin: 'Origin',
  Search: 'Search',
  Description: 'Description',
  Create: 'Create'
}
export default {
  name: 'NewClickableKnowledgeTag',
  components: {
    NewBrowser
  },
  props: {
    questionIndex: {
      type: String,
      default: ''
    },
    selectedKnowledgeTags: {
      type: Array,
      default: () => []
    }
  },
  mounted () {
    logger.info('NewClickableKnowledgeTag ' + this.questionIndex + ' selectedKnowledgeTags')
  },
  beforeDestroy () {
  },
  data () {
    return {
      inputTag: '',
      searchList: [],
      tagList: [],
      tagColorList: [
        'pink',
        'orange',
        'green',
        'cyan',
        'blue',
        'red',
        'purple'
      ],
      tagOriginType: TagOriginType,
      descriptionTagMap: {},

      activeSubKnowledgeId: null,
      tagNameSearchListDialogueVisible: false,
      tagNameSearchList: [],
      tagNameSearchListSelected: [],

      associateLibraryVisible: false
    }
  },
  created () {
    this.debouncedSearchKnowledge = debounce(this.searchKnowledge, 500)
    this.selectedKnowledgeTags.forEach(item => {
      this.tagList.push({
        ...item,
        type: TagOriginType.Origin
      })

      // descriptionTagMap
      if (!this.descriptionTagMap.hasOwnProperty(item.subKnowledgeId)) {
        this.$set(this.descriptionTagMap, item.subKnowledgeId, [])
      }

      if (item.curriculumId === this.$store.getters.bindCurriculum) {
        this.$logger.info('current bindCurriculum  match curriculumId, add ' + item.subKnowledgeId + ' to descriptionTagMap', item, this.descriptionTagMap[item.subKnowledgeId])
        const list = this.descriptionTagMap[item.subKnowledgeId]
        list.push({
          ...item,
          type: TagOriginType.Origin
        })
        this.$set(this.descriptionTagMap, item.subKnowledgeId, list)
      } else {
        this.$logger.info('skip! current bindCurriculum not match curriculumId', item, this.$store.getters.bindCurriculum)
      }
    })

    this.$logger.info('after add tagList', this.tagList)
    this.$logger.info('after add descriptionTagMap', this.descriptionTagMap)
  },
  watch: {
    searchList () {
      this.$logger.info('update search tag list with list size ' + (this.searchList.length), this.searchList)
      let tagList = this.tagList
      tagList = tagList.filter(item => item.type !== this.tagOriginType.Search)
      const existNameList = []
      this.searchList.forEach(item => {
        if (existNameList.indexOf(item.name) === -1) {
          tagList.push({
            ...item,
            type: TagOriginType.Search
          })
          existNameList.push(item.name)
        }
      })
      this.tagList = tagList
      this.$logger.info('after update search tag list', this.tagList)
    }
  },
  methods: {
    handleKeyup () {
      this.$logger.info('handleKeyup ', this.inputTag)
      this.debouncedSearchKnowledge(this.inputTag)
    },
    searchKnowledge (keyword) {
      logger.info('searchKnowledge', keyword)
      this.searchList = []
      if (typeof keyword === 'string' && keyword.trim().length >= 1) {
        KnowledgeSearch({
          key: keyword
        }).then((response) => {
          logger.info('searchKnowledge response', response)
          this.searchList = response.result
        })
      }
    },

    handleDescriptionTagClose (tag) {
      this.$logger.info('handleDescriptionTagClose ', tag)
      let list = this.descriptionTagMap[tag.subKnowledgeId]
      list = list.filter(item => item.name !== tag.name)
      this.$set(this.descriptionTagMap, tag.subKnowledgeId, list)
      this.$logger.info('after handleDescriptionTagClose ', this.descriptionTagMap[tag.subKnowledgeId])
    },

    handleActiveDescription (subKnowledge) {
      this.$logger.info('handleActiveDescription TagList' + subKnowledge)
      this.activeSubKnowledgeId = subKnowledge
      this.$logger.info('activeSubKnowledgeId ' + this.activeSubKnowledgeId)
      logger.info('dbclick desc searchKnowledge')
      this.searchList = []
      KnowledgeQueryTagsByKnowledgeId({
        knowledgeId: this.activeSubKnowledgeId
      }).then((response) => {
        this.$logger.info('KnowledgeQueryTagsByKnowledgeId response', response.result)
        const descriptionList = response.result

        let tagList = this.tagList
        tagList = tagList.filter(item => item.type !== this.tagOriginType.Description)
        this.$logger.info('tag list filter ' + this.tagOriginType.Description)
        const existNameList = []
        descriptionList.forEach(item => {
          if (existNameList.indexOf(item.name) === -1) {
            tagList.push({
              ...item,
              type: TagOriginType.Description
            })
            existNameList.push(item.name)
          }
        })
        this.tagList = tagList
        this.$logger.info('handleActiveDescription after update search tag list', this.tagList)
      })
    },

    handleCreateTagByInput () {
      this.$logger.info('handleCreateTagByInput ' + this.inputTag)
      const existTag = this.tagList.find(item => item.name === this.inputTag)
      if (existTag) {
        this.$message.warn('duplicate tag name')
      } else {
        this.tagList.push({
          name: this.inputTag,
          type: this.tagOriginType.Create
        })
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
      this.$logger.info('handleDeleteKnowledgeItem ' + subKnowledgeId)
      if (this.descriptionTagMap.hasOwnProperty(subKnowledgeId)) {
        this.$delete(this.descriptionTagMap, subKnowledgeId)
        this.$logger.info('after delete ' + subKnowledgeId, this.descriptionTagMap)
      } else {
        this.$logger.info('descriptionTagMap dont exist ' + subKnowledgeId)
      }
    },

    handleDbClickTagListTag (tag) {
      this.$logger.info('handleDbClickTagListTag', tag)
      // name 搜索是否有匹配的大纲描述
      KnowledgeSearch({
        key: tag.name
      }).then((response) => {
        logger.info('handleDbClickTagListTag searchKnowledge response', response)
        this.tagNameSearchList = response.result.filter(item => item.curriculumId === this.$store.getters.bindCurriculum)
        this.$logger.info('after filter curriculumId tagNameSearchList', this.tagNameSearchList)
        this.tagNameSearchListSelected = []
        this.tagNameSearchListDialogueVisible = true
      })
    },

    handleEnsureTagSearchList () {
      this.$logger.info('handleEnsureTagSearchList', this.tagNameSearchListSelected)
      const ensureKnowledgeTagList = []
      this.tagNameSearchList.forEach(item => {
        if (this.tagNameSearchListSelected.indexOf(item.subKnowledgeId) !== -1) {
          ensureKnowledgeTagList.push(item)
        } else {
          this.$logger.info(item.subKnowledgeId + ' dont exist in ', this.tagNameSearchListSelected)
        }
      })
      this.$logger.info('ensureKnowledgeTagList', ensureKnowledgeTagList)

      ensureKnowledgeTagList.forEach(item => {
        if (!this.descriptionTagMap.hasOwnProperty(item.subKnowledgeId)) {
          this.$set(this.descriptionTagMap, item.subKnowledgeId, [])
        }

        const list = this.descriptionTagMap[item.subKnowledgeId]
        if (!list.find(eItem => eItem.id === item.id && eItem.name === item.name)) {
          list.push({
            ...item,
            type: TagOriginType.Origin
          })
          this.$set(this.descriptionTagMap, item.subKnowledgeId, list)
        } else {
          this.$logger.info('skip! exist ' + item.name + ' ' + item.id)
        }
      })

      this.tagNameSearchListSelected = []
      this.tagNameSearchList = []
      this.tagNameSearchListDialogueVisible = false
    },

    tagNameSearchListChange (checkedValue) {
      this.$logger.info('tagNameSearchListChange', checkedValue)
      this.tagNameSearchListSelected = checkedValue
    },

    handleCreateDescription () {
      this.$logger.info('handleCreateDescription')
      this.associateLibraryVisible = true
    },

    handleEnsureAssociate () {
      this.$logger.info('handleEnsureAssociate')
      this.associateLibraryVisible = false
    }
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";
.knowledge-skill-tag-selector {
  user-select: none;
  .skt-search-wrapper {
    .knowledge-tag-search-input {
      position: relative;
      margin: 0;
      padding: 0;
      line-height: 32px;

      input {
        position: relative;
        display: inline-block;
        width: 100%;
        line-height: @input-height-base;
        text-align: start;
        vertical-align: top;
        color: @text-color;
        cursor: pointer;
        transition: all 0.3s;
        padding: 0 100px 0 @input-padding-horizontal-base;
        border: @border-width-base solid #d9d9d9;
        outline: 0;

        &:hover {
          border-color: @input-hover-border-color;
          border-right-width: @border-width-base !important;
        }
      }

      .create-btn {
        position: absolute;
        right: 0;
        top: 7px;
        cursor: pointer;
        background-color: @primary-color;
        color: #fff;
        font-weight: 600;
      }
    }
  }

  .skt-tag-wrapper {
    margin-top: -15px;
    .skt-tag-list {
      padding: 10px;
      border: 1px dashed #ccc;
      background-color: #fafafa;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .skt-tag-item {
        margin: 5px 10px 5px 0;
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
    }
  }

  .skt-description-list-wrapper {
    margin-top: 10px;
    .skt-description-list {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .skt-description-tag-item {
        border: 1px solid #fff;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 10px;
        padding: 10px 5px 10px 10px;
        position: relative;
        &:hover {
          background-color: #F8F8F8;
          color: @primary-color;
        }
        .skt-description {
          width: 60%;
          padding-right: 10px;
          position: relative;
          .description-txt {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
            font-weight: 500;
            display: inline-block;
            width: 100%;
          }
        }

        .skt-description-tag-list {
          border: 1px dashed #ccc;
          padding: 5px 10px;
          width: 40%;
          min-height: 50px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          overflow: hidden;
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
        }

        .delete-action {
          position: absolute;
          right: -25px;
        }
      }

      .active-description-line {
        background-color: fade(@outline-color, 10%);
        color: @primary-color;
        border: 1px solid @primary-color;

        &:hover {
          border: 1px solid @primary-color;
          background-color: fade(@outline-color, 10%);
          color: @primary-color;
        }
      }
    }
  }
}

.search-tag-list {
  margin-top: 20px;
  padding: 10px;
  height: 500px;
  overflow-y: scroll;
}

.empty-search-list {
  margin-top: 80px;
  text-align: center;
  .create-description {
    display: block;
    margin-top: 20px;
    text-decoration: underline;
  }
}

*::-webkit-scrollbar {
  width: 3px;
  height: 0;
}
*::-webkit-scrollbar-track {
  border-radius: 1px;
  background: rgba(0,0,0,0.00);
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
}
/* 滚动条滑块 */
*::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0,0,0,0.12);
  -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
}

.associate-library {
  margin-top: 20px;

}
</style>
