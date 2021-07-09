<template>
  <div class="knowledge-skill-tag-selector">
    <div class="skt-search-wrapper">
      <!-- skt-input search-->
      <a-form-model-item :label="$t('teacher.add-unit-plan.skill-tags')" class="input-search-item">
        <div class="knowledge-tag-search-input">
          <input v-model="inputTag" @keyup="handleKeyup" :placeholder="$t('teacher.add-unit-plan.please-enter-skill-tag')"/>
        </div>
      </a-form-model-item>
    </div>
    <div class="skt-tag-wrapper" v-show="tagList.length || createTagName">
      <!--      skt-tag-list-->
      <a-row>
        <a-col offset="4" span="18">
          <div class="skt-tag-list">
            <div class="skt-tag-item" v-for="(tag,index) in tagList" :key="index" :data-tag-type="tag.type" @dblclick="handleDbClickTagListTag(tag)">
              <a-tag
                draggable="true"
                @dragstart="handleTagItemDragStart(tag, $event)"
                color="green"
                class="tag-item"
                v-if="tag.type === tagOriginType.Origin">
                {{ tag.name }}
              </a-tag>
              <a-tag
                draggable="true"
                @dragstart="handleTagItemDragStart(tag, $event)"
                color="#108ee9"
                class="tag-item"
                v-if="tag.type === tagOriginType.Search">
                <a-icon type="search" /> {{ tag.name }}
              </a-tag>
              <a-tag
                draggable="true"
                @dragstart="handleTagItemDragStart(tag, $event)"
                color="#87d068"
                class="tag-item"
                v-if="tag.type === tagOriginType.Description">
                <a-icon type="tag" /> {{ tag.name }}
              </a-tag>
              <a-tag
                draggable="true"
                @dragstart="handleTagItemDragStart(tag, $event)"
                color="#2db7f5"
                class="tag-item"
                v-if="tag.type === tagOriginType.Create"
                closable
                @close="handleDeleteCreatedTag(tag)"><a-icon type="highlight" /> {{ tag.name }}
              </a-tag>

              <a-tag
                draggable="true"
                @dragstart="handleTagItemDragStart(tag, $event)"
                class="tag-item"
                v-if="tag.type === tagOriginType.Extension"
                closable
                @close="handleDeleteCreatedTag(tag)"><a-icon type="diff" />  {{ tag.name }}
              </a-tag>
            </div>
            <div class="skt-tag-create-line" v-show="createTagName && createTagName.length >= 1">
              <div class="create-tag-label">
                Create
              </div>
              <div class="create-tag">
                <a-tag class="tag-item">
                  {{ createTagName }}
                </a-tag>
                <a-icon type="plus-circle" @click="handleCreateTagByInput"/>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="open-curriculum-wrapper">
      <a-row>
        <a-col offset="4" span="18">
          <div class="open-curriculum" @click="handleCreateDescription">
            <a-icon type="hdd" />
            <a class="open-curriculum-text">Select Skill</a>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="skt-description-list-wrapper" v-if="descriptionTagList.length">
      <!--      description-list-->
      <a-row>
        <a-col offset="4" span="18">
          <div class="skt-description-list">
            <div
              :class="{
                'skt-description-tag-item': true,
                'skt-description-tag-item-top-fixed': true,
                'active-description-line': descriptionTagList[0].descriptionId === activeDescriptionId
              }"
              :data-id="descriptionTagList[0].descriptionId"
              v-if="descriptionTagList.length"
              :key="descriptionTagList[0].descriptionId"
              @dblclick="handleActiveDescription(descriptionTagList[0].descriptionId)">
              <div class="skt-description">
                <a-tooltip :mouseEnterDelay="1" class="description-txt" >
                  <template slot="title">
                    {{ descriptionId2InfoMap.get(descriptionTagList[0].descriptionId).description }}
                  </template>
                  {{ descriptionId2InfoMap.get(descriptionTagList[0].descriptionId).description }}
                </a-tooltip>
              </div>
              <div class="skt-description-tag-list" :droppable="activeDescriptionId === descriptionTagList[0].descriptionId ? 'true' : 'false'" @dragover.prevent @drop="handleTagItemDrop(descriptionTagList[0], $event)">
                <div class="tag-list-item" v-for="(tag,tIndex) in descriptionTagList[0].tagList" :key="tIndex + tag.name + tag.type">
                  <a-tag
                    class="tag-item"
                    v-if="tag.type === tagOriginType.Origin"
                    :closable="tag.descriptionId === activeDescriptionId"
                    @close="handleDescriptionTagClose(tag)">
                    {{ tag.name }}
                  </a-tag>
                  <a-tag
                    class="tag-item"
                    v-if="tag.type === tagOriginType.Search"
                    :closable="tag.descriptionId === activeDescriptionId"
                    @close="handleDescriptionTagClose(tag)">
                    {{ tag.name }}
                  </a-tag>
                  <a-tag
                    class="tag-item"
                    v-if="tag.type === tagOriginType.Description"
                    :closable="tag.descriptionId === activeDescriptionId"
                    @close="handleDescriptionTagClose(tag)">
                    {{ tag.name }}
                  </a-tag>
                </div>
              </div>
              <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteKnowledgeItem(descriptionTagList[0].descriptionId)" cancel-text="No">
                <span class="delete-action" v-show="descriptionTagList[0].descriptionId === activeDescriptionId" >
                  <a-icon type="delete" />
                </span>
              </a-popconfirm>
            </div>
            <div class="skt-description-sub-list">
              <div
                :class="{
                  'skt-description-tag-item': true,
                  'active-description-line': item.descriptionId === activeDescriptionId}"
                :data-id="item.descriptionId"
                v-for="(item, dIndex) in descriptionTagList"
                v-if="descriptionTagList.length && dIndex > 0"
                :key="item.descriptionId"
                @dblclick="handleActiveDescription(item.descriptionId)">
                <div class="skt-description">
                  <a-tooltip :mouseEnterDelay="1" class="description-txt" >
                    <template slot="title">
                      {{ descriptionId2InfoMap.get(item.descriptionId).description }}
                    </template>
                    {{ descriptionId2InfoMap.get(item.descriptionId).description }}
                  </a-tooltip>
                </div>
                <div class="skt-description-tag-list" :droppable="activeDescriptionId === item.descriptionId ? 'true' : 'false'" @dragover.prevent @drop="handleTagItemDrop(item, $event)">
                  <div class="tag-list-item" v-for="(tag,tIndex) in item.tagList" :key="tIndex + tag.name + tag.type">
                    <a-tag
                      class="tag-item"
                      v-if="tag.type === tagOriginType.Origin"
                      :closable="tag.descriptionId === activeDescriptionId"
                      @close="handleDescriptionTagClose(tag)">
                      {{ tag.name }}
                    </a-tag>
                    <a-tag
                      class="tag-item"
                      v-if="tag.type === tagOriginType.Search"
                      :closable="tag.descriptionId === activeDescriptionId"
                      @close="handleDescriptionTagClose(tag)">
                      {{ tag.name }}
                    </a-tag>
                    <a-tag
                      class="tag-item"
                      v-if="tag.type === tagOriginType.Description"
                      :closable="tag.descriptionId === activeDescriptionId"
                      @close="handleDescriptionTagClose(tag)">
                      {{ tag.name }}
                    </a-tag>
                  </div>
                </div>
                <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteKnowledgeItem(item.descriptionId)" cancel-text="No">
                  <span class="delete-action" v-show="item.descriptionId === activeDescriptionId" >
                    <a-icon type="delete" />
                  </span>
                </a-popconfirm>
              </div>
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
              <a-checkbox :value="item.descriptionId">
                {{ item.description }}
              </a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
        <div class="empty-search-list" v-if="!tagNameSearchList.length">
          <a-empty />
          <div class="open-curriculum">
            click 【
            <a class="open-curriculum-text">Select Skill</a>】 to select description
          </div>
        </div>
      </div>
    </a-modal>

    <a-modal v-model="associateLibraryVisible" @ok="handleEnsureAssociate" destroyOnClose width="80%" :dialog-style="{ top: '20px' }">
      <div class="associate-library">
        <skill-browser :select-mode="selectModel.skillDescription" :question-index="questionIndex"/>
      </div>
    </a-modal>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import SkillBrowser from '@/components/SkillLibrary/SkillBrowser'
import { SkillSelectModel } from '@/components/SkillLibrary/SkillSelectModel'

const { SkillLibraryEventBus, SkillLibraryEvent } = require('@/components/SkillLibrary/SkillLibraryEventBus')
const { SkillSearch, SkillQueryTagsBySkillId, SkillAddOrUpdateTag } = require('@/api/skill')
const { debounce, sortBy } = require('lodash-es')

const TagOriginType = {
  Origin: 'Origin',
  Search: 'Search',
  Description: 'Description',
  Create: 'Create',
  Extension: 'Extension'
}
export default {
  name: 'NewClickableSkillTag',
  components: {
    SkillBrowser
  },
  props: {
    questionIndex: {
      type: String,
      default: ''
    },
    selectedSkillTags: {
      type: Array,
      default: () => []
    },
    // 扩充的tag列表，用于添加到tag列表中供选择，无其他作用
    extTagList: {
      type: Array,
      default: () => []
    }
  },
  mounted () {
    logger.info('skill NewClickableSkillTag ' + this.questionIndex + ' selectedSkillTags', this.selectedSkillTags)
    SkillLibraryEventBus.$on(SkillLibraryEvent.SkillContentListSelectClick, this.handleSkillContentListSelectClick)
  },
  destroyed () {
    SkillLibraryEventBus.$off(SkillLibraryEvent.SkillContentListSelectClick, this.handleSkillContentListSelectClick)
    this.$logger.info('skill off handleSkillContentListSelectClick ContentListSelectClick handler')
  },
  data () {
    return {
      inputTag: '',
      searchList: [],
      tagList: [],
      tagOriginType: TagOriginType,
      selectModel: SkillSelectModel,
      descriptionTagList: [],
      descriptionId2InfoMap: new Map(), // descriptionId 对应的父级信息标签

      activeDescriptionId: null,
      tagNameSearchListDialogueVisible: false,
      tagNameSearchList: [],
      tagNameSearchListSelected: [],

      associateLibraryVisible: false,
      createTagName: ''
    }
  },
  created () {
    this.debouncedSearchKnowledge = debounce(this.searchKnowledge, 500)
    const descriptionTagMap = new Map()
    const tagNameSet = new Set()
    this.selectedSkillTags.forEach(item => {
      // 逐条去重添加tag
      if (!tagNameSet.has(item.name)) {
        this.tagList.push({
          ...item,
          type: TagOriginType.Origin
        })
      } else {
        this.$logger.info('skill tag name ' + item.name + ' exist', item, tagNameSet)
      }

      // 后加扩充tag，避免冲突
      this.extTagList.forEach(item => {
        if (!tagNameSet.has(item.name)) {
          this.tagList.push({
            ...item,
            type: TagOriginType.Extension
          })
        } else {
          this.$logger.info('Extension tag name ' + item.name + ' exist', item, tagNameSet)
        }
      })

      // descriptionTagMap按照descriptionId初始化对应的tagList
      if (!!item.descriptionId && item.curriculumId === this.$store.getters.bindCurriculum && !descriptionTagMap.has(item.descriptionId)) {
        descriptionTagMap.set(item.descriptionId, [])
        this.descriptionId2InfoMap.set(item.descriptionId, {
          ...item
        })
        this.$logger.info('skill tag description match', item)
      } else {
        this.$logger.info('skill tag skip! current bindCurriculum not match curriculumId ' + item.curriculumId + ' ' + this.$store.getters.bindCurriculum)
      }

      // descriptionTagMap筛选相同大纲的大纲描述和tag
      if (item.curriculumId === this.$store.getters.bindCurriculum) {
        this.$logger.info('skill current bindCurriculum  match curriculumId, add ' + item.descriptionId + ' to descriptionTagMap', item, descriptionTagMap[item.descriptionId])
        const tagList = descriptionTagMap.get(item.descriptionId)
        tagList.push({
          ...item,
          type: TagOriginType.Origin
        })
        descriptionTagMap.set(item.descriptionId, tagList)
        this.$logger.info('skill tag description match add tag', item)
      } else {
        this.$logger.info('skill skip! current bindCurriculum not match curriculumId' + item.curriculumId, item, this.$store.getters.bindCurriculum)
      }
    })

    this.$logger.info('skill descriptionTagMap', descriptionTagMap)
    // trans descriptionTagMap to list
    for (const [descriptionId, tagList] of descriptionTagMap) {
      this.descriptionTagList.push(Object.assign({}, {
        descriptionId,
        tagList,
        _updateTimestamp: new Date().getTime()
      }))
      this.$logger.info('skill add ' + descriptionId + ' tagList ', tagList)
    }
    this.descriptionTagList = sortBy(this.descriptionTagList, '_updateTimestamp', 'asc').reverse()
    this.$logger.info('skill after add tagList', this.tagList)
    this.$logger.info('skill after add descriptionTagList', this.descriptionTagList)
    this.$logger.info('skill after add descriptionId2InfoMap', this.descriptionId2InfoMap)
  },
  watch: {
    searchList () {
      this.$logger.info('skill update search tag list with list size ' + (this.searchList.length), this.searchList)
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
      this.$logger.info('skill after update search tag list', this.tagList)
    }
  },
  methods: {
    handleSkillContentListSelectClick (data) {
      if (data.questionIndex === this.questionIndex) {
        this.$logger.info('skill handleSkillContentListSelectClick hit ' + this.questionIndex, data)
        const tagIndex = this.descriptionTagList.findIndex(tItem => tItem.descriptionId === data.descriptionId)
        if (tagIndex === -1) {
          this.descriptionId2InfoMap.set(data.descriptionId, {
            ...data
          })
          this.descriptionTagList.push({
            descriptionId: data.descriptionId,
            tagList: [],
            _updateTimestamp: 0
          })
        }
        SkillLibraryEventBus.$emit(SkillLibraryEvent.SkillContentListSelectedListUpdate, { id: data.descriptionId })
        this.$logger.info('skill descriptionId2InfoMap[' + data.descriptionId + ']', this.descriptionId2InfoMap.get(data.descriptionId))
      }
    },
    handleKeyup () {
      this.$logger.info('skill handleKeyup ', this.inputTag)
      this.debouncedSearchKnowledge(this.inputTag)
      this.createTagName = this.inputTag
    },
    searchKnowledge (keyword) {
      logger.info('skill searchKnowledge', keyword)
      this.searchList = []
      if (typeof keyword === 'string' && keyword.trim().length >= 1) {
        SkillSearch({
          key: keyword
        }).then((response) => {
          logger.info('skill searchKnowledge response', response)
          this.searchList = response.result
        })
      }
    },

    handleDescriptionTagClose (tag) {
      this.$logger.info('skill handleDescriptionTagClose ', tag)
      const tagIndex = this.descriptionTagList.findIndex(item => item.descriptionId === tag.descriptionId)
      const item = this.descriptionTagList[tagIndex]
      this.$logger.info('skill raw handleDescriptionTagClose ', item)
      item.tagList = item.tagList.filter(item => item.name !== tag.name)
      this.descriptionTagList.splice(tagIndex, 1, item)
      this.$emit('remove-skill-tag', {
        questionIndex: this.questionIndex,
        ...tag
      })
      this.$logger.info('skill after handleDescriptionTagClose ', this.descriptionTagList[tagIndex])
    },

    handleActiveDescription (subKnowledge) {
      this.$logger.info('skill handleActiveDescription TagList' + subKnowledge, ' old tag list', this.tagList, this.descriptionTagList)
      this.activeDescriptionId = subKnowledge
      this.$logger.info('skill activeDescriptionId ' + this.activeDescriptionId)
      // 改变排序
      const tagIndex = this.descriptionTagList.findIndex(item => item.descriptionId === this.activeDescriptionId)
      const tagItem = this.descriptionTagList[tagIndex]
      tagItem._updateTimestamp = new Date().getTime()
      this.descriptionTagList.splice(tagIndex, 1, tagItem)
      this.descriptionTagList = sortBy(this.descriptionTagList, '_updateTimestamp', 'asc').reverse()
      this.$logger.info('skill update sort ', this.descriptionTagList)

      logger.info('skill dblclick desc searchKnowledge')
      SkillQueryTagsBySkillId({
        skillId: this.activeDescriptionId
      }).then((response) => {
        this.$logger.info('skill SkillQueryTagsBySkillId response', response.result)
        const descriptionList = response.result

        let tagList = [...this.tagList]
        this.$logger.info('skill tag list filter before tag list' + this.tagOriginType.Description, tagList)
        tagList = tagList.filter(item => item.type !== this.tagOriginType.Description)
        this.$logger.info('skill tag list filter after tag list' + this.tagOriginType.Description, tagList)
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
        this.$logger.info('skill handleActiveDescription after update search tag list', this.tagList)
      })
    },

    handleCreateTagByInput () {
      this.$logger.info('skill handleCreateTagByInput ' + this.createTagName)
      const existTag = this.tagList.find(item => item.name === this.createTagName)
      if (existTag) {
        this.$message.warn('already exist same name tag')
      } else {
        this.tagList.push({
          name: this.createTagName,
          type: this.tagOriginType.Create
        })
        this.createTagName = ''
      }
    },

    handleDeleteCreatedTag (tag) {
      this.$logger.info('skill handleDeleteCreatedTag ', tag)
      const tagList = []
      this.tagList.forEach(item => {
        if (!(item.type === this.tagOriginType.Create && item.name === tag.name)) {
          tagList.push(item)
        }
      })
      this.tagList = tagList
      this.$logger.info('skill after handleDeleteCreatedTag tag list', this.tagList)
    },

    handleDeleteKnowledgeItem (descriptionId) {
      this.$logger.info('skill handleDeleteKnowledgeItem ' + descriptionId, this.descriptionTagList)
      const tagIndex = this.descriptionTagList.findIndex(item => item.descriptionId === descriptionId)
      const item = this.descriptionTagList[tagIndex]
      if (tagIndex !== -1) {
        item.tagList.forEach(item => {
          this.$emit('remove-skill-tag', {
            questionIndex: this.questionIndex,
            ...item
          })
        })
        this.descriptionTagList.splice(tagIndex, 1)
        this.$logger.info('skill after delete ' + descriptionId, this.descriptionTagList)
      } else {
        this.$logger.info('skill descriptionTagMap dont exist ' + descriptionId)
      }
    },

    handleDbClickTagListTag (tag) {
      this.$logger.info('skill handleDbClickTagListTag', tag)
      // name 搜索是否有匹配的大纲描述
      SkillSearch({
        key: tag.name
      }).then((response) => {
        logger.info('skill handleDbClickTagListTag searchKnowledge response', response)
        this.tagNameSearchList = response.result.filter(item => item.curriculumId === this.$store.getters.bindCurriculum)
        this.$logger.info('skill after filter curriculumId tagNameSearchList', this.tagNameSearchList)
        this.tagNameSearchListSelected = []
        this.tagNameSearchListDialogueVisible = true
      })
    },

    handleEnsureTagSearchList () {
      this.$logger.info('skill handleEnsureTagSearchList', this.tagNameSearchListSelected)
      const ensureKnowledgeTagList = []
      this.tagNameSearchList.forEach(item => {
        if (this.tagNameSearchListSelected.indexOf(item.descriptionId) !== -1) {
          ensureKnowledgeTagList.push(item)
        } else {
          this.$logger.info(item.descriptionId + ' dont exist in ', this.tagNameSearchListSelected)
        }
      })
      this.$logger.info('skill ensureKnowledgeTagList', ensureKnowledgeTagList)

      ensureKnowledgeTagList.forEach(item => {
        let tagIndex = this.descriptionTagList.findIndex(tItem => tItem.descriptionId === item.descriptionId)
        if (tagIndex === -1) {
          this.descriptionTagList.push({
            descriptionId: item.descriptionId,
            tagList: [],
            _updateTimestamp: new Date().getTime()
          })
          this.descriptionId2InfoMap.set(item.descriptionId, {
            ...item
          })
        }

        tagIndex = this.descriptionTagList.findIndex(tItem => tItem.descriptionId === item.descriptionId)
        const tagItem = this.descriptionTagList[tagIndex]
        if (!tagItem.tagList.find(eItem => eItem.name === item.name)) {
          tagItem.tagList.push({
            ...item,
            type: TagOriginType.Origin
          })
          this.$emit('add-skill-tag', {
            questionIndex: this.questionIndex,
            ...item
          })
          this.descriptionTagList.splice(tagIndex, 1, tagItem)
        } else {
          this.$logger.info('skill skip! exist ' + item.name + ' ' + item.id)
        }
      })

      this.tagNameSearchListSelected = []
      this.tagNameSearchList = []
      this.tagNameSearchListDialogueVisible = false
    },

    tagNameSearchListChange (checkedValue) {
      this.$logger.info('skill tagNameSearchListChange', checkedValue)
      this.tagNameSearchListSelected = checkedValue
    },

    handleCreateDescription () {
      this.$logger.info('skill handleCreateDescription')
      this.associateLibraryVisible = true
    },

    handleEnsureAssociate () {
      this.$logger.info('skill handleEnsureAssociate')
      this.associateLibraryVisible = false
    },

    handleTagItemDragStart (tag, event) {
      this.$logger.info('skill handleTagItemDragStart', tag, event)
      event.dataTransfer.setData('tag', JSON.stringify(tag))
    },

    handleTagItemDrop (item, event) {
      const descriptionId = item.descriptionId
      if (this.activeDescriptionId === descriptionId) {
        this.$logger.info('skill handleTagItemDrop ' + descriptionId, item, event)
        const knowledgeInfo = this.descriptionId2InfoMap.get(descriptionId)
        this.$logger.info('skill knowledgeInfo ', knowledgeInfo)
        let rawTag = event.dataTransfer.getData('tag')
        this.$logger.info('skill drag tag ', rawTag)
        rawTag = JSON.parse(rawTag)
        const tag = Object.assign({}, knowledgeInfo)
        delete tag.id
        tag.name = rawTag.name
        this.$logger.info('skill ready add tag ', tag)

        const tagIndex = this.descriptionTagList.findIndex(tItem => tItem.descriptionId === descriptionId)
        const tagItem = this.descriptionTagList[tagIndex]
        if (!tagItem.tagList.find(eItem => eItem.name === tag.name)) {
          this.$logger.info('skill add tag', tag)
          tagItem.tagList.push({
            ...tag,
            type: TagOriginType.Origin
          })
          this.descriptionTagList.splice(tagIndex, 1, tagItem)

          // 检查是否已存在相同name的tag没有则创建
          let existSameNameTag = false
          let replaceTag = null
          SkillQueryTagsBySkillId({
            skillId: descriptionId
          }).then((response) => {
            this.$logger.info('skill SkillQueryTagsBySkillId response check', response.result)
            const descriptionList = response.result
            descriptionList.forEach(item => {
              if (item.name === tag.name) {
                existSameNameTag = true
                replaceTag = item
              }
            })
          }).finally(() => {
            if (!existSameNameTag) {
              const tagInfo = this.descriptionId2InfoMap.get(tag.descriptionId)
              const newTagData = Object.assign(tagInfo, { name: tag.name })
              this.$logger.info('new tag data', newTagData)
              SkillAddOrUpdateTag(newTagData).then((response) => {
                this.$logger.info('skill SkillAddOrUpdateTag response', response)

                if (response.success) {
                  SkillQueryTagsBySkillId({
                    skillId: tag.descriptionId
                  }).then((response) => {
                    this.$logger.info('skill SkillQueryTagsBySkillId sub response check', response.result)
                    const descriptionList = response.result
                    descriptionList.forEach(item => {
                      if (item.name === tag.name) {
                        existSameNameTag = true
                        replaceTag = item
                        this.replaceTempTag(replaceTag)
                      }
                    })
                  })
                } else {
                  this.$logger.error('SkillAddOrUpdateTag', response)
                }
              })
            } else {
              this.replaceTempTag(replaceTag)
            }
          })
        } else {
          this.$logger.info('skill skip! exist ' + tag.name + ' ' + tag.id)
          this.$message.warn('already exist same name tag')
        }
      } else {
        this.$logger.info('skill not in edit mode', descriptionId, this.activeDescriptionId)
      }
    },

    replaceTempTag (tag) {
      this.$logger.info('skill replace tag', tag)
      const tagIndex = this.descriptionTagList.findIndex(tItem => tItem.descriptionId === (tag.descriptionId || tag.id))
      const tagItem = this.descriptionTagList[tagIndex]
      this.$logger.info('skill replace tag target list', tagItem.tagList)
      tagItem.tagList = tagItem.tagList.filter(item => item.name !== tag.name)
      tagItem.tagList.push({
        ...tag,
        type: TagOriginType.Origin
      })
      this.$emit('add-skill-tag', {
        questionIndex: this.questionIndex,
        ...tag
      })
      this.descriptionTagList.splice(tagIndex, 1, tagItem)
    }
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";
.knowledge-skill-tag-selector {
  user-select: none;
  .skt-search-wrapper {
    .input-search-item {
      margin-bottom: 0;
    }

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
        padding: 0 @input-padding-horizontal-base;
        border: @border-width-base solid #d9d9d9;
        outline: 0;

        &:hover {
          border-color: @input-hover-border-color;
          border-right-width: @border-width-base !important;
        }
      }
    }
  }

  .skt-tag-wrapper {
    margin-top: -15px;
    .skt-tag-list {
      padding: 5px 10px;
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

      .skt-tag-create-line {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 5px 0;

        .create-tag-label {
          font-size: 14px;
          padding-right: 10px;
          color: @text-color-secondary;
        }

        .create-tag {
          display: flex;
          flex-direction: row;
          align-items: center;
          .tag-item {
            border-radius: 10px;
            word-break:normal;
            width:auto;
            display:inline;
            white-space:pre-wrap;
            word-wrap : break-word ;
            overflow: hidden ;
            padding-bottom: 3px;
          }

          i {
            font-size: 18px;
            color: @text-color-secondary;
          }
        }
      }
    }
  }

  .open-curriculum {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-top: 5px;
    padding: 5px 0;
    color: @primary-color;
    font-size: 12px;
    font-weight: bold;

    .open-curriculum-text {
      padding-left: 5px;
      font-size: 12px;
      text-decoration: underline;
    }
  }

  .skt-description-list-wrapper {
    .skt-description-list {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      .skt-description-sub-list {
        max-height: 250px;
        overflow-y: scroll;
        border: 1px solid #f9f9f9;
      }
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
  .open-curriculum {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
    padding: 5px 0;
    font-size: 12px;

    .open-curriculum-text {
      color: @text-color-secondary;
      padding-left: 5px;
      font-size: 12px;
      text-decoration: underline;
    }
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
