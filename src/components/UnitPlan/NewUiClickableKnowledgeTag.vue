<template>
  <a-row class="new-tag-ui">
    <a-col span="24">
      <div class="skt-search-wrapper">
        <!-- skt-input search-->
        <div class="search-input">
          <div class="knowledge-tag-search-input">
            <a-popover placement="topLeft">
              <template slot="content">
                <p>enter key words or choose from your curriculum</p>
              </template>
              <input v-model="inputTag" @keyup="handleKeyup" :placeholder="$t('teacher.add-unit-plan.please-enter-knowledge-tag')"/>
            </a-popover>
          </div>
        </div>
        <div class="toggle-mode-type-wrapper">
          <a-tooltip>
            <template slot="title">
              Matching relevant tags will help connect global teaching resources.
            </template>
            <div class="toggle-mode-type">
              <div class="toggle-mode">
                <div :class="{'mode-item': true, 'skill-active-mode' : currentMode === mode.skill}" @click="handleToggleMode(mode.skill)">
                  Skill tags
                </div>
                <div :class="{'mode-item': true, 'knowledge-active-mode' : currentMode === mode.knowledge}" @click="handleToggleMode(mode.knowledge)">
                  Knowledge tags
                </div>
              </div>
            </div>
          </a-tooltip>
        </div>
      </div>
      <div class="skt-tag-wrapper" v-show="tagListVisible">
        <!--      skt-tag-list-->
        <a-row>
          <a-col span="24">
            <div class="skt-tag-list">

              <div class="triangle"></div>

              <a-tooltip title=" double click the tag to show relevant assessment objectives from curriculum.">
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
              </a-tooltip>
              <a-tooltip title=" double click the tag to show relevant assessment objectives from curriculum.">
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
                        <img src="~@/assets/icons/tag/recommend_red.png" class="recommend-icon" v-if="currentMode === mode.knowledge"/>
                        <img src="~@/assets/icons/tag/recommend_zise.png" class="recommend-icon" v-if="currentMode === mode.general"/>
                        <img src="~@/assets/icons/tag/recommend_green.png" class="recommend-icon" v-if="currentMode === mode.skill"/>
                        <div class="tag-name">
                          {{ tag.name }}
                        </div>
                      </div>
                    </a-tag>
                  </div>
                </div>
              </a-tooltip>
              <div
                :class="{
                  'create-tag-wrapper': true,
                  'tag-wrapper': true,
                  'knowledge-mode': currentMode === mode.knowledge,
                  'skill-mode': currentMode === mode.skill,
                  'general-mode': currentMode === mode.general,
                }">
                <div class="skt-tag-create-line" @click="handleCreateTagByInput" >
                  <div class="create-tag-label" v-if="createTagName">
                    Create
                  </div>
                  <div class="create-tag">
                    <a-tag class="created-tag-item" v-if="createTagName">
                      {{ createTagName }}
                    </a-tag>
                  </div>
                  <template v-if="createdTagList && createdTagList.length">
                    <div
                      class="create-tag"
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
                  </template>
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
      <div class="skt-description-list-wrapper">
        <!--   knowledge or skill   description-list-->
        <a-row v-if="descriptionTagList.length">
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
                  <a-tooltip title="double click one learning outcome to add relevant tags" v-if="descriptionTagList[0].subKnowledgeId === activeSubKnowledgeId">
                    {{ subKnowledgeId2InfoMap.get(descriptionTagList[0].subKnowledgeId).description }}
                  </a-tooltip>
                  <template v-else>
                    {{ subKnowledgeId2InfoMap.get(descriptionTagList[0].subKnowledgeId).description }}
                  </template>
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
                    <template slot="title">
                      {{ subKnowledgeId2InfoMap.get(item.subKnowledgeId).description }}
                    </template>
                    {{ subKnowledgeId2InfoMap.get(item.subKnowledgeId).description }}
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

      <a-modal v-model="tagNameSearchListDialogueVisible" title="Select from the relevant Unit" @ok="handleEnsureTagSearchList" destroyOnClose width="600px">
        <div class="search-tag-list">
          <div :class="{'search-description-item': true, 'selected-item': tagNameSearchListSelected.indexOf(item.descriptionId) !== -1}" v-for="(item,index) in tagNameSearchList" :key="index">
            <div class="description-info" @click="handleTagNameSearchListSelected(item)">
              <div class="info-detail">
                <div class="info-text">
                  {{ item.description }}
                </div>
                <div class="info-checked" v-if="tagNameSearchListSelected.indexOf(item.descriptionId) !== -1">
                  <a-icon :style="{ fontSize: '16px', color: '#15C39A' }" type="check-circle" />
                </div>
              </div>
            </div>
          </div>
          <div class="empty-search-list" v-if="!tagNameSearchList.length">
            <no-more-resources @show-library="showLibrary()" tips="no relevant content, please open curriculum to choose"/>
          </div>
        </div>
      </a-modal>
      <a-modal
        v-model="associateLibraryVisible"
        @ok="handleEnsureAssociate"
        destroyOnClose
        width="1200px"
        :dialog-style="{ top: '20px' }">
        <div class="associate-library">
          <new-browser :select-mode="selectModel.knowledgeDescription" :question-index="questionIndex"/>
        </div>
      </a-modal>

    </a-col>
  </a-row>
</template>

<script>
  import { LibraryEvent, LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'
  import * as logger from '@/utils/logger'
  import { KnowledgeSearch, KnowledgeQueryTagsByKnowledgeId } from '@/api/knowledge'
  import NewBrowser from '@/components/NewLibrary/NewBrowser'
  import { SelectModel } from '@/components/NewLibrary/SelectModel'
  import NoMoreResources from '@/components/Common/NoMoreResources'
  import { TagType } from '@/const/common'
  const { debounce, sortBy } = require('lodash-es')

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
      NoMoreResources
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
      logger.info('NewClickableKnowledgeTag ' + this.questionIndex + ' selectedKnowledgeTags')
      LibraryEventBus.$on(LibraryEvent.ContentListSelectClick, this.handleContentListSelectClick)
    },
    destroyed () {
      LibraryEventBus.$off(LibraryEvent.ContentListSelectClick, this.handleContentListSelectClick)
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
        descriptionKnowLedgeTagList: [],
        descriptionSkillList: [],
        subKnowledgeId2InfoMap: new Map(), // subKnowledgeId 对应的父级信息标签

        activeSubKnowledgeId: null,
        tagNameSearchListDialogueVisible: false,
        tagNameSearchList: [],
        tagNameSearchListSelected: [],

        associateLibraryVisible: false,
        createTagName: '',
        currentMode: mode.skill,
        mode: mode,
        activeDescriptionId: null,
        tagListVisible: false
      }
    },
    created () {
      this.debouncedSearchKnowledge = debounce(this.searchKnowledge, 500)
      this.descriptionKnowLedgeTagList = this.initSelectTagList(this.selectedKnowledgeTags)
      this.descriptionSkillTagList = this.initSelectTagList(this.selectedSkillTags)
      this.descriptionTagList = this.currentMode === mode.knowledge ? this.descriptionKnowLedgeTagList : this.descriptionSkillTagList
      this.$logger.info('after add tagList', this.tagList)
      this.$logger.info('after add descriptionKnowLedgeTagList', this.descriptionKnowLedgeTagList)
      this.$logger.info('after add descriptionSkillTagList', this.descriptionSkillTagList)
    },
    watch: {
      currentMode (currentMode) {
        if (currentMode === mode.knowledge) {
          this.descriptionSkillList = this.descriptionTagList
          this.descriptionTagList = this.descriptionKnowLedgeTagList
        } else {
          this.descriptionKnowLedgeTagList = this.descriptionTagList
          this.descriptionTagList = this.descriptionSkillList
        }
        this.$logger.info('mode', this.currentMode, 'descriptionTagList', this.descriptionSkillTagList)
      },
      searchList () {
        this.$logger.info('update search tag list with list size ' + (this.searchList.length), this.searchList)
        let tagList = this.tagList
        tagList = this.tagList
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
      initSelectTagList (selectTags) {
        const descriptionTagMap = new Map()
        const tagNameSet = new Set()
        selectTags.forEach(item => {
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
        let _descriptionTagList = []
        for (const [subKnowledgeId, tagList] of descriptionTagMap) {
          _descriptionTagList.push(Object.assign({}, {
            subKnowledgeId,
            tagList,
            _updateTimestamp: new Date().getTime()
          }))
          this.$logger.info('add ' + subKnowledgeId + ' tagList ', tagList)
        }
        _descriptionTagList = sortBy(_descriptionTagList, '_updateTimestamp', 'asc').reverse()
        return _descriptionTagList
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
            // 同时新增大纲选择
            if (this.currentMode === mode.skill) {
              if (this.descriptionKnowLedgeTagList.findIndex(tItem => tItem.subKnowledgeId === data.subKnowledgeId) === -1) {
                this.descriptionKnowLedgeTagList.push({
                  subKnowledgeId: data.subKnowledgeId,
                  tagList: [],
                  _updateTimestamp: 0
                })
              }
            } else {
              if (this.descriptionSkillTagList.findIndex(tItem => tItem.subKnowledgeId === data.subKnowledgeId) === -1) {
              this.descriptionSkillTagList.push({
                subKnowledgeId: data.subKnowledgeId,
                tagList: [],
                _updateTimestamp: 0
              })
              }
            }
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
        // knowledge和skill统一数据接口
        if (typeof keyword === 'string' && keyword.trim().length >= 1) {
          KnowledgeSearch({
            key: keyword,
            tagType: this.currentMode === mode.knowledge ? TagType.knowledge : TagType.skill
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
        if (this.currentMode === mode.knowledge) {
          this.$emit('remove-knowledge-tag', {
            questionIndex: this.questionIndex,
            ...tag
          })
        } else {
          this.$emit('remove-skill-tag', {
            questionIndex: this.questionIndex,
            ...tag
          })
        }
        this.$logger.info('after handleDescriptionTagClose ', this.descriptionTagList[tagIndex])
      },

      handleActiveDescription (subKnowledge) {
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
      },

      handleCreateTagByInput () {
        this.$logger.info('handleCreateTagByInput ' + this.createTagName)
        if (this.createTagName) {
          const existTag = this.tagList.find(item => item.name === this.createTagName)
          if (existTag) {
            this.$message.warn('already exist same name tag')
          } else {
            this.tagList.push({
              name: this.createTagName,
              type: this.tagOriginType.Create,
              tagType: this.currentMode === mode.knowledge ? TagType.knowledge : TagType.skill
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
        this.$logger.info('handleDeleteKnowledgeItem ' + subKnowledgeId, this.descriptionTagList)
        const tagIndex = this.descriptionTagList.findIndex(item => item.subKnowledgeId === subKnowledgeId)
        const item = this.descriptionTagList[tagIndex]
        if (tagIndex !== -1) {
          item.tagList.forEach(item => {
            if (this.currentMode === mode.knowledge) {
              this.$emit('remove-knowledge-tag', {
                questionIndex: this.questionIndex,
                ...item
              })
            } else {
              this.$emit('remove-skill-tag', {
                questionIndex: this.questionIndex,
                ...item
              })
            }
          })
          this.descriptionTagList.splice(tagIndex, 1)
          this.$logger.info('after delete ' + subKnowledgeId, this.descriptionTagList)
        } else {
          this.$logger.info('descriptionTagMap dont exist ' + subKnowledgeId)
        }
      },

      handleDbClickTagListTag (tag) {
        this.$logger.info('handleDbClickTagListTag', tag)
        // name 点击name后是准确定位，同时添加筛选的subject和grade过滤条件缩小范围
        KnowledgeSearch({
          words: tag.name,
          tagType: this.currentMode === mode.knowledge ? TagType.knowledge : TagType.skill,
          gradeIds: this.gradeIds,
          subjectIds: this.subjectIds
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
              if (this.currentMode === mode.knowledge) {
                this.$emit('add-knowledge-tag', {
                  questionIndex: this.questionIndex,
                  ...item
                })
              } else {
                this.$emit('add-skill-tag', {
                  questionIndex: this.questionIndex,
                  ...item
                })
              }
              this.descriptionTagList.splice(tagIndex, 1, tagItem)
            } else {
              this.$logger.info('skip! exist ' + item.name + ' ' + item.id)
            }
          })

          this.tagNameSearchListSelected = []
          this.tagNameSearchList = []
          this.tagNameSearchListDialogueVisible = false
      },

      handleTagNameSearchListSelected (item) {
        this.$logger.info('handleTagNameSearchListSelected', item)
        const index = this.tagNameSearchListSelected.indexOf(item.descriptionId)
        if (index !== -1) {
          this.tagNameSearchListSelected.splice(index, 1)
        } else {
          this.tagNameSearchListSelected.push(item.descriptionId)
        }
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
            this.$logger.info('tagItem', tagItem)
            this.descriptionTagList.splice(tagIndex, 1, tagItem)
            this.replaceTempTag(tag)

            // // 检查是否已存在相同name的tag没有则创建
            // let existSameNameTag = false
            // let replaceTag = null
            // KnowledgeQueryTagsByKnowledgeId({
            //   knowledgeId: subKnowledgeId
            // }).then((response) => {
            //   this.$logger.info('KnowledgeQueryTagsByKnowledgeId response check', response.result)
            //   const descriptionList = response.result
            //   descriptionList.forEach(item => {
            //     if (item.name === tag.name) {
            //       existSameNameTag = true
            //       replaceTag = item
            //     }
            //   })
            // }).finally(() => {
            //   if (!existSameNameTag) {
            //     KnowledgeAddOrUpdateTag({
            //       subKnowledgeId: tag.subKnowledgeId,
            //       name: tag.name,
            //       description: tag.description
            //     }).then((response) => {
            //       this.$logger.info('KnowledgeAddOrUpdate response', response)
            //
            //       if (response.success) {
            //         KnowledgeQueryTagsByKnowledgeId({
            //           knowledgeId: tag.subKnowledgeId
            //         }).then((response) => {
            //           this.$logger.info('KnowledgeQueryTagsByKnowledgeId sub response check', response.result)
            //           const descriptionList = response.result
            //           descriptionList.forEach(item => {
            //             if (item.name === tag.name) {
            //               existSameNameTag = true
            //               replaceTag = item
            //               this.replaceTempTag(replaceTag)
            //             }
            //           })
            //         })
            //       } else {
            //         this.$logger.error('KnowledgeAddOrUpdate', response)
            //       }
            //     })
            //   } else {
            //     this.replaceTempTag(replaceTag)
            //   }
            // })
          } else {
            this.$logger.info('skip! exist ' + tag.name + ' ' + tag.id)
            this.$message.warn('already exist same name tag')
          }
        } else {
          this.$logger.info('not in edit mode', subKnowledgeId, this.activeSubKnowledgeId)
        }
      },

      replaceTempTag (tag) {
        this.$logger.info('replace tag', tag)
        const tagIndex = this.descriptionTagList.findIndex(tItem => tItem.subKnowledgeId === (tag.subKnowledgeId || tag.id))
        const tagItem = this.descriptionTagList[tagIndex]
        this.$logger.info('replace tag target list', tagItem.tagList)
        tagItem.tagList = tagItem.tagList.filter(item => item.name !== tag.name)
        tagItem.tagList.push({
          ...tag,
          type: TagOriginType.Origin
        })
        if (this.currentMode === mode.knowledge) {
          this.$emit('add-knowledge-tag', {
            questionIndex: this.questionIndex,
            ...tag
          })
        } else {
          this.$emit('add-skill-tag', {
            questionIndex: this.questionIndex,
            ...tag
          })
        }
        this.descriptionTagList.splice(tagIndex, 1, tagItem)
      },
      handleToggleMode (mode) {
        this.$logger.info('handleToggleMode ' + mode)
        this.currentMode = mode
        this.tagListVisible = false
        if (this.inputTag) {
          this.debouncedSearchKnowledge(this.inputTag)
          this.createTagName = this.inputTag
        }
      },

      hide (field) {
        this.$logger.info('hide' + field)
        this.$set(field, false)
      },
      handleClickChange (field, visible) {
        this.$logger.info('handleClickChange' + field + ' ' + visible)
        this.$set(field, visible)
      },
      showLibrary () {
        this.associateLibraryVisible = true
        this.tagNameSearchListDialogueVisible = false
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
        width: calc(100% - 190px);
      }

      .toggle-mode-type-wrapper {
        width: 190px;
        box-sizing: border-box;
        text-align: right;
        cursor: pointer;
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
        color: @black;
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
            cursor: pointer;
            background-color: rgba(239, 78, 78, 1);
            color: #fff;
          }

          .recommend-tag-item {
            cursor: pointer;
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
              cursor: pointer;
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
            cursor: pointer;
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
              cursor: pointer;
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
          cursor: pointer;

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
          max-height: 300px;
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

            .skill-mode {
              .tag-item {
                background-color: rgba(21, 195, 154, 0.1);
                color: rgba(21, 195, 154, 1);
                border: 1px solid rgba(21, 195, 154, 1);
              }
            }

            .general-mode {
              .tag-item {
                background-color: rgba(114, 46, 209, 0.1);
                color: #722ED1;
                border: 1px solid #722ED1;
              }
            }
          }

          .delete-action {
            position: absolute;
            right: -40px;
            top: 45px;

            img {
              width: 40px;
            }
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

  .open-curriculum-wrapper {
    margin-top: 10px;
  }
</style>
