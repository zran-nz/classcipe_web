<template>
  <a-row class="new-tag-ui">
    <a-col offset="4" span="18">
      <div class="skt-search-wrapper">
        <!-- skt-input search-->
        <div class="search-input">
          <div class="knowledge-tag-search-input">
            <input v-model="inputTag" @keyup="handleKeyup" :placeholder="$t('teacher.add-unit-plan.please-enter-knowledge-tag')"/>
          </div>
        </div>
        <div class="toggle-mode-type-wrapper">
          <div class="toggle-mode-type">
            <div class="toggle-mode">
              <div :class="{'mode-item': true, 'skill-active-mode' : currentMode === mode.skill}" @click="handleToggleMode(mode.skill)">
                Skill tags
              </div>
              <div :class="{'mode-item': true, 'knowledge-active-mode' : currentMode === mode.knowledge}" @click="handleToggleMode(mode.knowledge)">
                Knowledge tags
              </div>
              <div :class="{'mode-item': true, 'general-active-mode' : currentMode === mode.general}" @click="handleToggleMode(mode.general)">
                General ability
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="skt-tag-wrapper" v-show="tagListVisible">
        <!--      skt-tag-list-->
        <a-row>
          <a-col span="24">
            <div class="skt-tag-list">
              <div class="triangle"></div>
              <div
                v-if="searchTagList && searchTagList.length"
                :class="{
                  'search-tag-wrapper': true,
                  'tag-wrapper': true,
                  'knowledge-mode': currentMode === mode.knowledge,
                  'skill-mode': currentMode === mode.skill,
                  'general-mode': currentMode === mode.general,
                }">
                <template v-for="(tag,index) in searchTagList">
                  <div
                    :key="index"
                    class="skt-tag-item"
                    :data-tag-type="tag.type"
                    @dblclick="handleDbClickTagListTag(tag)"
                    v-if="tag.type === tagOriginType.Search">
                    <a-tag
                      draggable="true"
                      @dragstart="handleTagItemDragStart(tag, $event)"
                      class="tag-item">
                      <div class="tag-icon">
                        <img src="~@/assets/icons/tag/search_icon.png" class="search-icon"/>
                        <div class="tag-name">
                          {{ tag.name }}
                        </div>
                      </div>
                    </a-tag>
                    <a-tag
                      draggable="true"
                      @dragstart="handleTagItemDragStart(tag, $event)"
                      class="tag-item"
                      v-if="tag.type === tagOriginType.Create"
                      closable
                      @close="handleDeleteCreatedTag(tag)"><a-icon type="highlight" /> {{ tag.name }}
                    </a-tag>
                  </div>
                </template>
              </div>
              <div
                v-if="recommendTagList && recommendTagList.length"
                :class="{
                  'search-tag-wrapper': true,
                  'tag-wrapper': true,
                  'knowledge-mode': currentMode === mode.knowledge,
                  'skill-mode': currentMode === mode.skill,
                  'general-mode': currentMode === mode.general,
                }">
                <div class="skt-tag-item" v-for="(tag,index) in recommendTagList" :key="index" :data-tag-type="tag.type" @dblclick="handleDbClickTagListTag(tag)">
                  <a-tag
                    draggable="true"
                    @dragstart="handleTagItemDragStart(tag, $event)"
                    class="tag-item recommend-tag-item">
                    <div class="tag-icon">
                      <img src="~@/assets/icons/tag/recommend_red.png" class="recommend-icon"/>
                      <div class="tag-name">
                        {{ tag.name }}
                      </div>
                    </div>
                  </a-tag>
                </div>
              </div>
              <div
                :class="{
                  'create-tag-wrapper': true,
                  'tag-wrapper': true,
                  'knowledge-mode': currentMode === mode.knowledge,
                  'skill-mode': currentMode === mode.skill,
                  'general-mode': currentMode === mode.general,
                }">
                <div class="skt-tag-create-line">
                  <div class="create-tag-label">
                    Create
                  </div>
                  <div class="create-tag">
                    <a-tag class="created-tag-item" v-if="createTagName && createTagName.length >= 1">
                      {{ createTagName }}
                    </a-tag>
                    <a-icon type="plus-circle" @click="handleCreateTagByInput"/>
                  </div>
                  <div
                    class="create-tag"
                    v-if="createdTagList && createdTagList.length"
                    v-for="(tag,index) in createdTagList"
                    :key="index"
                    :data-tag-type="tag.type"
                    @dblclick="handleDbClickTagListTag(tag)">
                    <a-tag
                      draggable="true"
                      @dragstart="handleTagItemDragStart(tag, $event)"
                      @close="handleDeleteCreatedTag(tag)"
                      closable
                      class="created-tag-item">
                      {{ tag.name }}
                    </a-tag>
                  </div>
                </div>
              </div>
            </div>

          </a-col>
        </a-row>
      </div>
      <div class="open-curriculum-wrapper">
        <a-row>
          <a-col span="24">
            <div class="open-curriculum-btn-wrapper">
              <div class="open-curriculum" @click="handleCreateDescription">
                <img src="~@/assets/icons/tag/kecheng@2x.png" />
                <span class="open-curriculum-text">Choose from curriculum
                </span>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="skt-description-list-wrapper" v-if="descriptionTagList.length">
        <!--      description-list-->
        <a-row>
          <a-col span="24">
            <div class="skt-description-list">
              <div
                :class="{
                  'skt-description-tag-item': true,
                  'skt-description-tag-item-top-fixed': true,
                  'active-description-line': descriptionTagList[0].subKnowledgeId === activeSubKnowledgeId}"
                :data-id="descriptionTagList[0].subKnowledgeId"
                v-if="descriptionTagList.length"
                :key="descriptionTagList[0].subKnowledgeId"
                @dblclick="handleActiveDescription(descriptionTagList[0].subKnowledgeId)">
                <div class="skt-description">
                  <a-tooltip :mouseEnterDelay="1" class="description-txt" >
                    <template slot="title">
                      {{ subKnowledgeId2InfoMap.get(descriptionTagList[0].subKnowledgeId).description }}
                    </template>
                    {{ subKnowledgeId2InfoMap.get(descriptionTagList[0].subKnowledgeId).description }}
                  </a-tooltip>
                </div>
                <div class="skt-description-tag-list" :droppable="activeSubKnowledgeId === descriptionTagList[0].subKnowledgeId ? 'true' : 'false'" @dragover.prevent @drop="handleTagItemDrop(descriptionTagList[0], $event)">
                  <div
                    :class="{
                      'tag-list-item': true,
                      'knowledge-mode': currentMode === mode.knowledge,
                      'skill-mode': currentMode === mode.skill,
                      'general-mode': currentMode === mode.general,
                    }"
                    v-for="(tag,tIndex) in descriptionTagList[0].tagList"
                    :key="tIndex + tag.name + tag.type">
                    <a-tag
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
                <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteKnowledgeItem(descriptionTagList[0].subKnowledgeId)" cancel-text="No">
                  <span class="delete-action" v-show="descriptionTagList[0].subKnowledgeId === activeSubKnowledgeId" >
                    <img src="~@/assets/icons/tag/delete.png"/>
                  </span>
                </a-popconfirm>
              </div>
              <div class="skt-description-sub-list">
                <div
                  :class="{
                    'skt-description-tag-item': true,
                    'active-description-line': item.subKnowledgeId === activeSubKnowledgeId}"
                  :data-id="item.subKnowledgeId"
                  v-for="(item, dIndex) in descriptionTagList"
                  v-if="descriptionTagList.length && dIndex > 0"
                  :key="item.subKnowledgeId"
                  @dblclick="handleActiveDescription(item.subKnowledgeId)">
                  <div class="skt-description">
                    <a-tooltip :mouseEnterDelay="1" class="description-txt" >
                      <template slot="title">
                        {{ subKnowledgeId2InfoMap.get(item.subKnowledgeId).description }}
                      </template>
                      {{ subKnowledgeId2InfoMap.get(item.subKnowledgeId).description }}
                    </a-tooltip>
                  </div>
                  <div class="skt-description-tag-list" :droppable="activeSubKnowledgeId === item.subKnowledgeId ? 'true' : 'false'" @dragover.prevent @drop="handleTagItemDrop(item, $event)">
                    <div
                      :class="{
                        'tag-list-item': true,
                        'knowledge-mode': currentMode === mode.knowledge,
                        'skill-mode': currentMode === mode.skill,
                        'general-mode': currentMode === mode.general,
                      }"
                      v-for="(tag,tIndex) in item.tagList"
                      :key="tIndex + tag.name + tag.type">
                      <a-tag
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
                  <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteKnowledgeItem(item.subKnowledgeId)" cancel-text="No">
                    <span class="delete-action" v-show="item.subKnowledgeId === activeSubKnowledgeId" >
                      <img src="~@/assets/icons/tag/delete.png"/>
                    </span>
                  </a-popconfirm>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <a-modal v-model="skillTagNameSearchListDialogueVisible" @ok="handleEnsureTagSearchList" destroyOnClose width="800px">
        <div class="search-tag-list skill-tag">
          <a-checkbox-group :value="skillTagNameSearchListSelected" v-if="skillTagNameSearchList.length" @change="skillTagNameSearchListChange">
            <a-row v-for="(item,index) in skillTagNameSearchList" :key="index" :gutter="[16,16]">
              <a-col :span="24">
                <a-checkbox :value="item.descriptionId">
                  {{ item.description }}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
          <div class="empty-search-list" v-if="!skillTagNameSearchList.length">
            <a-empty />
            <div class="open-curriculum">
              click 【
              <a class="open-curriculum-text">Select Skill</a>】 to select description
            </div>
          </div>
        </div>
      </a-modal>
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
            <div class="open-curriculum">
              click 【
              <a class="open-curriculum-text">Open Curriculum</a>】 to select description
            </div>
          </div>
        </div>
      </a-modal>
      <a-modal v-model="associateLibraryVisible" @ok="handleEnsureAssociate" destroyOnClose width="80%" :dialog-style="{ top: '20px' }">
        <div class="associate-library">
          <new-browser :select-mode="selectModel.knowledgeDescription" :question-index="questionIndex"/>
        </div>
      </a-modal>

      <a-modal v-model="skillAssociateLibraryVisible" @ok="handleEnsureAssociate" destroyOnClose width="80%" :dialog-style="{ top: '20px' }">
        <div class="associate-library">
          <skill-browser :select-mode="skillSelectModel.skillDescription" :question-index="questionIndex"/>
        </div>
      </a-modal>
    </a-col>
  </a-row>
</template>

<script>
import { LibraryEvent, LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'
import * as logger from '@/utils/logger'
import { KnowledgeSearch, KnowledgeQueryTagsByKnowledgeId, KnowledgeAddOrUpdateTag } from '@/api/knowledge'
import NewBrowser from '@/components/NewLibrary/NewBrowser'
import { SelectModel } from '@/components/NewLibrary/SelectModel'
import SkillBrowser from '@/components/SkillLibrary/SkillBrowser'
import { SkillSelectModel } from '@/components/SkillLibrary/SkillSelectModel'
const { debounce, sortBy } = require('lodash-es')

const { SkillLibraryEventBus, SkillLibraryEvent } = require('@/components/SkillLibrary/SkillLibraryEventBus')
const { SkillSearch, SkillQueryTagsBySkillId, SkillAddOrUpdateTag } = require('@/api/skill')

const TagOriginType = {
  Origin: 'Origin',
  Search: 'Search',
  Description: 'Description',
  Create: 'Create'
}

const mode = {
  skill: 'skill',
  knowledge: 'knowledge',
  general: 'general'
}
export default {
  name: 'NewUiClickableKnowledgeTag',
  components: {
    NewBrowser,
    SkillBrowser
  },
  props: {
    questionIndex: {
      type: String,
      default: ''
    },
    selectedKnowledgeTags: {
      type: Array,
      default: () => []
    },
    selectedSkillTags: {
      type: Array,
      default: () => []
    }
  },
  mounted () {
    logger.info('NewClickableKnowledgeTag ' + this.questionIndex + ' selectedKnowledgeTags')
    LibraryEventBus.$on(LibraryEvent.ContentListSelectClick, this.handleContentListSelectClick)
    SkillLibraryEventBus.$on(SkillLibraryEvent.SkillContentListSelectClick, this.handleSkillContentListSelectClick)
  },
  destroyed () {
    LibraryEventBus.$off(LibraryEvent.ContentListSelectClick, this.handleContentListSelectClick)
    SkillLibraryEventBus.$off(SkillLibraryEvent.SkillContentListSelectClick, this.handleSkillContentListSelectClick)
    this.$logger.info('off NewClickableKnowledgeTag ContentListSelectClick handler')
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
    },
    searchSkillTagList () {
      return this.skillTagList.filter(skillSkillTag => skillSkillTag.type === this.tagOriginType.Search)
    },
    recommendSkillTagList () {
      return this.skillTagList.filter(skillSkillTag => skillSkillTag.type === this.tagOriginType.Description)
    },
    createdSkillTagList () {
      return this.skillTagList.filter(skillSkillTag => skillSkillTag.type === this.tagOriginType.Create)
    }
  },
  data () {
    return {
      inputTag: '',
      searchList: [],
      tagList: [],
      tagOriginType: TagOriginType,
      selectModel: SelectModel,
      descriptionTagList: [],
      subKnowledgeId2InfoMap: new Map(), // subKnowledgeId 对应的父级信息标签

      activeSubKnowledgeId: null,
      tagNameSearchListDialogueVisible: false,
      tagNameSearchList: [],
      tagNameSearchListSelected: [],

      associateLibraryVisible: false,
      createTagName: '',
      currentMode: mode.skill,
      mode: mode,

      // skill tag
      skillTagList: [],
      skillSelectModel: SkillSelectModel,
      skillDescriptionTagList: [],
      descriptionId2InfoMap: new Map(), // descriptionId 对应的父级信息标签

      activeDescriptionId: null,
      skillTagNameSearchListDialogueVisible: false,
      skillTagNameSearchList: [],
      skillTagNameSearchListSelected: [],

      skillAssociateLibraryVisible: false,

      // general tag
      generalTagList: [],

      tagListVisible: false
    }
  },
  created () {
    this.debouncedSearchKnowledge = debounce(this.searchKnowledge, 500)
    const descriptionTagMap = new Map()
    const tagNameSet = new Set()

    this.selectedKnowledgeTags.forEach(item => {
      // 逐条去重添加tag
      if (!tagNameSet.has(item.name)) {
        this.tagList.push({
          ...item,
          type: TagOriginType.Origin
        })
      } else {
        this.$logger.info('tag name ' + item.name + ' exist', item, tagNameSet)
      }

      // descriptionTagMap按照subKnowledgeId初始化对应的tagList
      if (!!item.subKnowledgeId && item.curriculumId === this.$store.getters.bindCurriculum && !descriptionTagMap.has(item.subKnowledgeId)) {
        descriptionTagMap.set(item.subKnowledgeId, [])
        this.subKnowledgeId2InfoMap.set(item.subKnowledgeId, {
          ...item
        })
      }

      // descriptionTagMap筛选相同大纲的大纲描述和tag
      if (item.curriculumId === this.$store.getters.bindCurriculum) {
        this.$logger.info('current bindCurriculum  match curriculumId, add ' + item.subKnowledgeId + ' to descriptionTagMap', item, descriptionTagMap[item.subKnowledgeId])
        const tagList = descriptionTagMap.get(item.subKnowledgeId)
        tagList.push({
          ...item,
          type: TagOriginType.Origin
        })
        descriptionTagMap.set(item.subKnowledgeId, tagList)
      } else {
        this.$logger.info('skip! current bindCurriculum not match curriculumId', item, this.$store.getters.bindCurriculum)
      }
    })

    // trans descriptionTagMap to list
    for (const [subKnowledgeId, tagList] of descriptionTagMap) {
      this.descriptionTagList.push(Object.assign({}, {
        subKnowledgeId,
        tagList,
        _updateTimestamp: new Date().getTime()
      }))
      this.$logger.info('add ' + subKnowledgeId + ' tagList ', tagList)
    }
    this.descriptionTagList = sortBy(this.descriptionTagList, '_updateTimestamp', 'asc').reverse()
    this.$logger.info('after add tagList', this.tagList)
    this.$logger.info('after add descriptionTagList', this.descriptionTagList)
    this.$logger.info('after add subKnowledgeId2InfoMap', this.subKnowledgeId2InfoMap)

    // skill tag 部分
    descriptionTagMap.clear()
    tagNameSet.clear()
    this.selectedSkillTags.forEach(item => {
      // 逐条去重添加tag
      if (!tagNameSet.has(item.name)) {
        this.skillTagList.push({
          ...item,
          type: TagOriginType.Origin
        })
      } else {
        this.$logger.info('skill tag name ' + item.name + ' exist', item, tagNameSet)
      }

      // descriptionTagMap按照descriptionId初始化对应的skillTagList
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
    for (const [descriptionId, tagList] of descriptionTagMap) {
      this.skillDescriptionTagList.push(Object.assign({}, {
        descriptionId,
        tagList,
        _updateTimestamp: new Date().getTime()
      }))
      this.$logger.info('skill add ' + descriptionId + ' tagList ', tagList)
    }
    this.skillDescriptionTagList = sortBy(this.skillDescriptionTagList, '_updateTimestamp', 'asc').reverse()
    this.$logger.info('skill after add tagList', this.skillTagList)
    this.$logger.info('skill after add skillDescriptionTagList', this.skillDescriptionTagList)
    this.$logger.info('skill after add descriptionId2InfoMap', this.descriptionId2InfoMap)
  },
  watch: {
    searchList () {
      this.$logger.info('update search tag list with list size ' + (this.searchList.length), this.searchList)
      let tagList = []
      if (this.currentMode === mode.knowledge) {
        tagList = this.tagList
      } else if (this.currentMode === mode.skill) {
        tagList = this.skillTagList
      } else if (this.currentMode === mode.general) {
        tagList = this.generalTagList
      }
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
    handleSkillContentListSelectClick (data) {
      if (data.questionIndex === this.questionIndex) {
        this.$logger.info('skill handleSkillContentListSelectClick hit ' + this.questionIndex, data)
        const tagIndex = this.skillDescriptionTagList.findIndex(tItem => tItem.descriptionId === data.descriptionId)
        if (tagIndex === -1) {
          this.descriptionId2InfoMap.set(data.descriptionId, {
            ...data
          })
          this.skillDescriptionTagList.push({
            descriptionId: data.descriptionId,
            tagList: [],
            _updateTimestamp: 0
          })
        }
        SkillLibraryEventBus.$emit(SkillLibraryEvent.SkillContentListSelectedListUpdate, { id: data.descriptionId })
        this.$logger.info('skill descriptionId2InfoMap[' + data.descriptionId + ']', this.descriptionId2InfoMap.get(data.descriptionId))
      }
    },

    handleContentListSelectClick (data) {
      if (data.questionIndex === this.questionIndex) {
        this.$logger.info('handleContentListSelectClick hit ' + this.questionIndex, data)
        const tagIndex = this.descriptionTagList.findIndex(tItem => tItem.subKnowledgeId === data.subKnowledgeId)
        if (tagIndex === -1) {
          this.subKnowledgeId2InfoMap.set(data.subKnowledgeId, {
            ...data
          })
          this.descriptionTagList.push({
            subKnowledgeId: data.subKnowledgeId,
            tagList: [],
            _updateTimestamp: 0
          })
        }
        LibraryEventBus.$emit(LibraryEvent.ContentListSelectedListUpdate, { id: data.subKnowledgeId })
        this.$logger.info('subKnowledgeId2InfoMap[' + data.subKnowledgeId + ']', this.subKnowledgeId2InfoMap.get(data.subKnowledgeId))
      }
    },
    handleKeyup () {
      this.$logger.info('handleKeyup ', this.inputTag)
      this.debouncedSearchKnowledge(this.inputTag)
      this.createTagName = this.inputTag
    },
    searchKnowledge (keyword) {
      logger.info('searchKnowledge', keyword)
      this.searchList = []
      if (typeof keyword === 'string' && keyword.trim().length >= 1) {
        if (this.currentMode === mode.knowledge) {
          KnowledgeSearch({
            key: keyword
          }).then((response) => {
            logger.info('searchKnowledge response', response)
            this.searchList = response.result
          })
        } else if (this.currentMode === mode.skill) {
          SkillSearch({
            key: keyword
          }).then((response) => {
            logger.info('skill searchKnowledge response', response)
            this.searchList = response.result
          })
        } else if (this.currentMode === mode.general) {
        }
      }
    },

    handleDescriptionTagClose (tag) {
      if (this.currentMode === mode.knowledge) {
        this.$logger.info('handleDescriptionTagClose ', tag)
        const tagIndex = this.descriptionTagList.findIndex(item => item.subKnowledgeId === tag.subKnowledgeId)
        const item = this.descriptionTagList[tagIndex]
        this.$logger.info('raw handleDescriptionTagClose ', item)
        item.tagList = item.tagList.filter(item => item.name !== tag.name)
        this.descriptionTagList.splice(tagIndex, 1, item)
        this.$emit('remove-knowledge-tag', {
          questionIndex: this.questionIndex,
          ...tag
        })
        this.$logger.info('after handleDescriptionTagClose ', this.descriptionTagList[tagIndex])
      } else if (this.currentMode === mode.skill) {
        this.$logger.info('skill handleDescriptionTagClose ', tag)
        const tagIndex = this.skillDescriptionTagList.findIndex(item => item.descriptionId === tag.descriptionId)
        const item = this.skillDescriptionTagList[tagIndex]
        this.$logger.info('skill raw handleDescriptionTagClose ', item)
        item.tagList = item.tagList.filter(item => item.name !== tag.name)
        this.skillDescriptionTagList.splice(tagIndex, 1, item)
        this.$emit('remove-skill-tag', {
          questionIndex: this.questionIndex,
          ...tag
        })
        this.$logger.info('skill after handleDescriptionTagClose ', this.skillDescriptionTagList[tagIndex])
      } else if (this.currentMode === mode.general) {

      }
    },

    handleActiveDescription (subKnowledge) {
      if (this.currentMode === mode.knowledge) {
        this.$logger.info('handleActiveDescription TagList' + subKnowledge, ' old tag list', this.tagList, this.descriptionTagList)
        this.activeSubKnowledgeId = subKnowledge
        this.$logger.info('activeSubKnowledgeId ' + this.activeSubKnowledgeId)
        // 改变排序
        const tagIndex = this.descriptionTagList.findIndex(item => item.subKnowledgeId === this.activeSubKnowledgeId)
        const tagItem = this.descriptionTagList[tagIndex]
        tagItem._updateTimestamp = new Date().getTime()
        this.descriptionTagList.splice(tagIndex, 1, tagItem)
        this.descriptionTagList = sortBy(this.descriptionTagList, '_updateTimestamp', 'asc').reverse()
        this.$logger.info('update sort ', this.descriptionTagList)

        logger.info('dblclick desc searchKnowledge')
        KnowledgeQueryTagsByKnowledgeId({
          knowledgeId: this.activeSubKnowledgeId
        }).then((response) => {
          this.$logger.info('KnowledgeQueryTagsByKnowledgeId response', response.result)
          const descriptionList = response.result

          let tagList = [...this.tagList]
          this.$logger.info('tag list filter before tag list' + this.tagOriginType.Description, tagList)
          tagList = tagList.filter(item => item.type !== this.tagOriginType.Description)
          this.$logger.info('tag list filter after tag list' + this.tagOriginType.Description, tagList)
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
      } else if (this.currentMode === mode.skill) {
        this.$logger.info('skill handleActiveDescription TagList' + subKnowledge, ' old tag list', this.tagList, this.skillDescriptionTagList)
        this.activeDescriptionId = subKnowledge
        this.$logger.info('skill activeDescriptionId ' + this.activeDescriptionId)
        // 改变排序
        const tagIndex = this.skillDescriptionTagList.findIndex(item => item.descriptionId === this.activeDescriptionId)
        const tagItem = this.skillDescriptionTagList[tagIndex]
        tagItem._updateTimestamp = new Date().getTime()
        this.skillDescriptionTagList.splice(tagIndex, 1, tagItem)
        this.skillDescriptionTagList = sortBy(this.skillDescriptionTagList, '_updateTimestamp', 'asc').reverse()
        this.$logger.info('skill update sort ', this.skillDescriptionTagList)

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
          this.skillTagList = tagList
          this.$logger.info('skill handleActiveDescription after update search tag list', this.tagList)
        })
      }
    },

    handleCreateTagByInput () {
      this.$logger.info('handleCreateTagByInput ' + this.createTagName)
      if (this.createTagName) {
        if (this.currentMode === mode.knowledge) {
          const existTag = this.tagList.find(item => item.name === this.createTagName)
          if (existTag) {
            this.$message.warn('already exist same name tag')
          } else {
            this.tagList.push({
              name: this.createTagName,
              type: this.tagOriginType.Create
            })
          }
        } else if (this.currentMode === mode.skill) {
          this.$logger.info('skill handleCreateTagByInput ' + this.createTagName)
          const existTag = this.skillTagList.find(item => item.name === this.createTagName)
          if (existTag) {
            this.$message.warn('already exist same name tag')
          } else {
            this.skillTagList.push({
              name: this.createTagName,
              type: this.tagOriginType.Create
            })
          }
        }
      }
    },

    handleDeleteCreatedTag (tag) {
      this.$logger.info('handleDeleteCreatedTag ', tag)
      if (this.currentMode === mode.knowledge) {
        const tagList = []
        this.tagList.forEach(item => {
          if (!(item.type === this.tagOriginType.Create && item.name === tag.name)) {
            tagList.push(item)
          }
        })
        this.tagList = tagList
        this.$logger.info('after handleDeleteCreatedTag tag list', this.tagList)
      } else if (this.currentMode === mode.skill) {
        const tagList = []
        this.tagList.forEach(item => {
          if (!(item.type === this.tagOriginType.Create && item.name === tag.name)) {
            tagList.push(item)
          }
        })
        this.tagList = tagList
        this.$logger.info('skill after handleDeleteCreatedTag tag list', this.tagList)
      }
    },

    handleDeleteKnowledgeItem (subKnowledgeId) {
      this.$logger.info('handleDeleteKnowledgeItem ' + subKnowledgeId, this.descriptionTagList)
      if (this.currentMode === mode.knowledge) {
        const tagIndex = this.descriptionTagList.findIndex(item => item.subKnowledgeId === subKnowledgeId)
        const item = this.descriptionTagList[tagIndex]
        if (tagIndex !== -1) {
          item.tagList.forEach(item => {
            this.$emit('remove-knowledge-tag', {
              questionIndex: this.questionIndex,
              ...item
            })
          })
          this.descriptionTagList.splice(tagIndex, 1)
          this.$logger.info('after delete ' + subKnowledgeId, this.descriptionTagList)
        } else {
          this.$logger.info('descriptionTagMap dont exist ' + subKnowledgeId)
        }
      } else if (this.currentMode === mode.skill) {
        const tagIndex = this.skillDescriptionTagList.findIndex(item => item.descriptionId === subKnowledgeId)
        const item = this.skillDescriptionTagList[tagIndex]
        if (tagIndex !== -1) {
          item.tagList.forEach(item => {
            this.$emit('remove-skill-tag', {
              questionIndex: this.questionIndex,
              ...item
            })
          })
          this.skillDescriptionTagList.splice(tagIndex, 1)
          this.$logger.info('skill after delete ' + subKnowledgeId, this.skillDescriptionTagList)
        } else {
          this.$logger.info('skill descriptionTagMap dont exist ' + subKnowledgeId)
        }
      }
    },

    handleDbClickTagListTag (tag) {
      this.$logger.info('handleDbClickTagListTag', tag)

      if (this.currentMode === mode.knowledge) {
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
      } else if (this.currentMode === mode.skill) {
        // name 搜索是否有匹配的大纲描述
        SkillSearch({
          key: tag.name
        }).then((response) => {
          logger.info('skill handleDbClickTagListTag searchKnowledge response', response)
          this.skillTagNameSearchList = response.result.filter(item => item.curriculumId === this.$store.getters.bindCurriculum)
          this.$logger.info('skill after filter curriculumId skillTagNameSearchList', this.skillTagNameSearchList)
          this.skillTagNameSearchListSelected = []
          this.skillTagNameSearchListDialogueVisible = true
        })
      }
    },

    handleEnsureTagSearchList () {
      this.$logger.info('handleEnsureTagSearchList', this.tagNameSearchListSelected)
      if (this.currentMode === mode.knowledge) {
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
          let tagIndex = this.descriptionTagList.findIndex(tItem => tItem.subKnowledgeId === item.subKnowledgeId)
          if (tagIndex === -1) {
            this.descriptionTagList.push({
              subKnowledgeId: item.subKnowledgeId,
              tagList: [],
              _updateTimestamp: new Date().getTime()
            })
            this.subKnowledgeId2InfoMap.set(item.subKnowledgeId, {
              ...item
            })
          }

          tagIndex = this.descriptionTagList.findIndex(tItem => tItem.subKnowledgeId === item.subKnowledgeId)
          const tagItem = this.descriptionTagList[tagIndex]
          if (!tagItem.tagList.find(eItem => eItem.name === item.name)) {
            tagItem.tagList.push({
              ...item,
              type: TagOriginType.Origin
            })
            this.$emit('add-knowledge-tag', {
              questionIndex: this.questionIndex,
              ...item
            })
            this.descriptionTagList.splice(tagIndex, 1, tagItem)
          } else {
            this.$logger.info('skip! exist ' + item.name + ' ' + item.id)
          }
        })

        this.tagNameSearchListSelected = []
        this.tagNameSearchList = []
        this.tagNameSearchListDialogueVisible = false
      } else if (this.currentMode === mode.skill) {
        const ensureKnowledgeTagList = []
        this.skillTagNameSearchList.forEach(item => {
          if (this.skillTagNameSearchListSelected.indexOf(item.descriptionId) !== -1) {
            ensureKnowledgeTagList.push(item)
          } else {
            this.$logger.info(item.descriptionId + ' dont exist in ', this.skillTagNameSearchListSelected)
          }
        })
        this.$logger.info('skill ensureKnowledgeTagList', ensureKnowledgeTagList)

        ensureKnowledgeTagList.forEach(item => {
          let tagIndex = this.skillDescriptionTagList.findIndex(tItem => tItem.descriptionId === item.descriptionId)
          if (tagIndex === -1) {
            this.skillDescriptionTagList.push({
              descriptionId: item.descriptionId,
              tagList: [],
              _updateTimestamp: new Date().getTime()
            })
            this.descriptionId2InfoMap.set(item.descriptionId, {
              ...item
            })
          }

          tagIndex = this.skillDescriptionTagList.findIndex(tItem => tItem.descriptionId === item.descriptionId)
          this.$logger.info('tagItem', this.skillDescriptionTagList[tagIndex], item)
          const tagItem = this.skillDescriptionTagList[tagIndex]
          if (!tagItem.tagList.find(eItem => eItem.name === item.name)) {
            tagItem.tagList.push({
              ...item,
              type: TagOriginType.Origin
            })
            this.$emit('add-skill-tag', {
              questionIndex: this.questionIndex,
              ...item
            })
            this.skillDescriptionTagList.splice(tagIndex, 1, tagItem)
          } else {
            this.$logger.info('skill skip! exist ' + item.name + ' ' + item.id)
          }
        })

        this.skillTagNameSearchListSelected = []
        this.skillTagNameSearchList = []
        this.skillTagNameSearchListDialogueVisible = false
      }
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
    },

    handleTagItemDragStart (tag, event) {
      this.$logger.info('handleTagItemDragStart', tag, event)
      event.dataTransfer.setData('tag', JSON.stringify(tag))
    },

    handleTagItemDrop (item, event) {
      if (this.currentMode === mode.knowledge) {
        const subKnowledgeId = item.subKnowledgeId
        if (this.activeSubKnowledgeId === subKnowledgeId) {
          this.$logger.info('handleTagItemDrop ' + subKnowledgeId, item, event)
          const knowledgeInfo = this.subKnowledgeId2InfoMap.get(subKnowledgeId)
          this.$logger.info('knowledgeInfo ', knowledgeInfo)
          let rawTag = event.dataTransfer.getData('tag')
          this.$logger.info('drag tag ', rawTag)
          rawTag = JSON.parse(rawTag)
          const tag = Object.assign({}, knowledgeInfo)
          delete tag.id
          tag.name = rawTag.name
          this.$logger.info('ready add tag ', tag)

          const tagIndex = this.descriptionTagList.findIndex(tItem => tItem.subKnowledgeId === subKnowledgeId)
          const tagItem = this.descriptionTagList[tagIndex]
          if (!tagItem.tagList.find(eItem => eItem.name === tag.name)) {
            this.$logger.info('add tag', tag)
            tagItem.tagList.push({
              ...tag,
              type: TagOriginType.Origin
            })
            this.descriptionTagList.splice(tagIndex, 1, tagItem)

            // 检查是否已存在相同name的tag没有则创建
            let existSameNameTag = false
            let replaceTag = null
            KnowledgeQueryTagsByKnowledgeId({
              knowledgeId: subKnowledgeId
            }).then((response) => {
              this.$logger.info('KnowledgeQueryTagsByKnowledgeId response check', response.result)
              const descriptionList = response.result
              descriptionList.forEach(item => {
                if (item.name === tag.name) {
                  existSameNameTag = true
                  replaceTag = item
                }
              })
            }).finally(() => {
              if (!existSameNameTag) {
                KnowledgeAddOrUpdateTag({
                  subKnowledgeId: tag.subKnowledgeId,
                  name: tag.name,
                  description: tag.description
                }).then((response) => {
                  this.$logger.info('KnowledgeAddOrUpdate response', response)

                  if (response.success) {
                    KnowledgeQueryTagsByKnowledgeId({
                      knowledgeId: tag.subKnowledgeId
                    }).then((response) => {
                      this.$logger.info('KnowledgeQueryTagsByKnowledgeId sub response check', response.result)
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
                    this.$logger.error('KnowledgeAddOrUpdate', response)
                  }
                })
              } else {
                this.replaceTempTag(replaceTag)
              }
            })
          } else {
            this.$logger.info('skip! exist ' + tag.name + ' ' + tag.id)
            this.$message.warn('already exist same name tag')
          }
        } else {
          this.$logger.info('not in edit mode', subKnowledgeId, this.activeSubKnowledgeId)
        }
      } else if (this.currentMode === mode.skill) {
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

          const tagIndex = this.skillDescriptionTagList.findIndex(tItem => tItem.descriptionId === descriptionId)
          const tagItem = this.skillDescriptionTagList[tagIndex]
          if (!tagItem.tagList.find(eItem => eItem.name === tag.name)) {
            this.$logger.info('skill add tag', tag)
            tagItem.tagList.push({
              ...tag,
              type: TagOriginType.Origin
            })
            this.skillDescriptionTagList.splice(tagIndex, 1, tagItem)

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
      }
    },

    skillTagNameSearchListChange (checkedValue) {
      this.$logger.info('skill skillTagNameSearchListChange', checkedValue)
      this.skillTagNameSearchListSelected = checkedValue
    },

    replaceTempTag (tag) {
      this.$logger.info('replace tag', tag)
      if (this.currentMode === mode.knowledge) {
        const tagIndex = this.descriptionTagList.findIndex(tItem => tItem.subKnowledgeId === (tag.subKnowledgeId || tag.id))
        const tagItem = this.descriptionTagList[tagIndex]
        this.$logger.info('replace tag target list', tagItem.tagList)
        tagItem.tagList = tagItem.tagList.filter(item => item.name !== tag.name)
        tagItem.tagList.push({
          ...tag,
          type: TagOriginType.Origin
        })
        this.$emit('add-knowledge-tag', {
          questionIndex: this.questionIndex,
          ...tag
        })
        this.descriptionTagList.splice(tagIndex, 1, tagItem)
      } else if (this.currentMode === mode.skill) {
        const tagIndex = this.skillDescriptionTagList.findIndex(tItem => tItem.descriptionId === (tag.descriptionId || tag.id))
        const tagItem = this.skillDescriptionTagList[tagIndex]
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
        this.skillDescriptionTagList.splice(tagIndex, 1, tagItem)
      }
    },
    handleToggleMode (mode) {
      this.$logger.info('handleToggleMode ' + mode)
      this.currentMode = mode
      this.tagListVisible = false
      if (this.inputTag) {
        this.debouncedSearchKnowledge(this.inputTag)
        this.createTagName = this.inputTag
      }
    }
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";
.new-tag-ui {
  user-select: none;

  .skt-search-wrapper {
    display: flex;
    flex-direction: row;
    .search-input {
      width: calc(100% - 280px);
    }

    .toggle-mode-type-wrapper {
      width: 280px;
      box-sizing: border-box;
      text-align: right;
      .toggle-mode-type {
        height: 35px;
        display: inline-block;
        border-radius: 35px;
        background: rgba(228, 228, 228, 0.3);

        .toggle-mode {
          border-radius: 35px;
          height: 35px;
          display: flex;
          flex-direction: row;
          font-size: 14px;

          //.mode-item:first-child {
          //  border-bottom-left-radius: 35px;
          //  border-top-left-radius: 35px;
          //}
          //
          //.mode-item:last-child {
          //  border-bottom-right-radius: 35px;
          //  border-top-right-radius: 35px;
          //}

          .mode-item {
            padding: 0 8px;
            font-size: 12px;
            height: 35px;
            color: rgba(17, 20, 45, 1);
            border-radius: 35px;
            font-family: Inter-Bold;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .skill-active-mode {
            color: #fff;
            background: rgba(21, 195, 154, 1);
          }

          .knowledge-active-mode {
            color: #fff;
            background: rgba(239, 78, 78, 1);
          }

          .general-active-mode {
            color: #fff;
            background: rgba(114, 46, 209, 1);
          }
        }
      }
    }
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

        .tag-item {
          padding: 3px 6px;

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
        background-color: rgba(250, 250, 250, 1);
        padding: 0 10px;
        width: 100%;
      }

      .knowledge-mode {
        background: rgba(243, 234, 233, 0.5);

        .tag-item {
          background-color: rgba(239, 78, 78, 1);
          color: #fff;
        }

        .recommend-tag-item {
          padding: 3px 6px;
          border-radius: 18px;
          font-family: Inter-Bold;
          background-color: rgba(239, 78, 78, 0.1);
          color: #EF4E4E;
          border: 1px solid #EF4E4E;
        }

        .create-tag {
          margin-right: 5px;
          .created-tag-item {
            margin: 0 3px;
            padding: 3px 6px;
            border-radius: 18px;
            font-family: Inter-Bold;
            background-color: rgba(239, 78, 78, 0.1);
            color: #EF4E4E;
            border: 1px solid #EF4E4E;
          }
        }
      }

      .skill-mode {
        background: rgba(21, 195, 154, 0.1);

        .tag-item {
          background-color: rgba(21, 195, 154, 1);
          color: #fff;
        }

        .recommend-tag-item {
          padding: 3px 6px;
          border-radius: 18px;
          font-family: Inter-Bold;
          background-color: rgba(21, 195, 154, 0.1);
          color: rgba(21, 195, 154, 1);
          border: 1px solid rgba(21, 195, 154, 1);
        }

        .create-tag {
          margin-right: 5px;
          .created-tag-item {
            margin: 0 3px;
            padding: 3px 6px;
            border-radius: 18px;
            font-family: Inter-Bold;
            background-color: rgba(21, 195, 154, 0.1);
            color: rgba(21, 195, 154, 1);
            border: 1px solid rgba(21, 195, 154, 1);
          }
        }
      }

      .general-mode {
        background: rgba(114, 46, 209, 0.1);

        .tag-item {
          background-color: rgba(114, 46, 209, 1);
          color: #fff;
        }

        .recommend-tag-item {
          padding: 3px 6px;
          border-radius: 18px;
          font-family: Inter-Bold;
          background-color: rgba(114, 46, 209, 0.1);
          color: #722ED1;
          border: 1px solid #722ED1;
        }

        .create-tag {
          margin-right: 5px;
          .created-tag-item {
            margin: 0 3px;
            padding: 3px 6px;
            border-radius: 18px;
            font-family: Inter-Bold;
            background-color: rgba(114, 46, 209, 0.1);
            color: #722ED1;
            border: 1px solid #722ED1;
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
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 5px 0;

        .create-tag-label {
          font-size: 14px;
          padding-right: 5px;
          padding-left: 5px;
          color: #000;
        }

        .create-tag {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      }
    }
  }

  .open-curriculum-btn-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-top: 15px;
    margin-bottom: 15px;
    .open-curriculum {
      font-size: 12px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 5px 10px;
      background: #fff;
      border: 1px solid rgba(216, 216, 216, 1);
      opacity: 1;
      border-radius: 4px;

      img {
        width: 20px;
      }

      .open-curriculum-text {
        margin-left: 10px;
        font-family: Inter-Bold;
        line-height: 24px;
        color: #15C39A;
        opacity: 1;
      }
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
        background: #FFFFFF;
        border: 1px solid #15C39A;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        opacity: 1;
        border-radius: 4px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 10px;
        padding: 15px;
        position: relative;
        &:hover {
          color: @primary-color;
        }
        .skt-description {
          width: 60%;
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
        }

        .delete-action {
          position: absolute;
          right: -40px;

          img {
            width: 40px;
          }
        }
      }

      .active-description-line {
        color: @primary-color;
        border: 1px solid @primary-color;

        &:hover {
          border: 1px solid @primary-color;
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
      color: @primary-color;
      padding-left: 5px;
      font-size: 12px;
      text-decoration: underline;
    }
  }
}

*::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
*::-webkit-scrollbar-track {
  border-radius: 1px;
  background: rgba(0,0,0,0.00);
}
/* 滚动条滑块 */
*::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0,0,0,0.12);
  -webkit-box-shadow: rgba(210, 210, 210, 1);
}

.associate-library {
  margin-top: 20px;

}
</style>
