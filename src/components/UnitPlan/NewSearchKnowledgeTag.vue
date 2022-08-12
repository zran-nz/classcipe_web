<template>
  <div class="knowledge-wrapper">
    <div class="tag-list-show new-knowledge-tag-wrapper" :data-qidx="questionIndex">
      <a-row>
        <a-col offset="4" span="18">
          <a-row v-for="(knowledgeTag,index) in selectedKnowledgeTags" :key="index" class="tag-line" >
            <a-col span="5" class="tag-name-col" @click.native="handleActiveSelectedTag(knowledgeTag)">
              <span class="tag-name tag-show-item">
                <a-icon type="tag" class="tag-name-icon"/>
                <a-tooltip placement="top">
                  <template slot="title">{{ knowledgeTag.name }}</template>
                  {{ knowledgeTag.name }}
                </a-tooltip>
              </span>
            </a-col>
            <a-col span="17" class="tag-name-col" @click.native="handleActiveSelectedTag(knowledgeTag)">
              <span class="tag-description  tag-show-item">
                {{ knowledgeTag.description }}
              </span>
            </a-col>
            <a-col span="2" class="tag-action-col">
              <span class="tag-action">
                <a-icon type="sync" @click.native="handleChangeTag(knowledgeTag)"/>
              </span>
              <span class="tag-action">
                <a-icon type="delete" @click.native="handleDeleteTag(knowledgeTag)"/>
              </span>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
    <a-form-model-item :label="$t('teacher.add-unit-plan.knowledge-tags')" class="new-knowledge-tag-wrapper" :data-qidx="questionIndex">
      <div class="knowledge-tag-search-input">
        <input v-model="inputTag" @keyup="handleKeyup" :placeholder="$t('teacher.add-unit-plan.please-enter-knowledge-tag')"/>
      </div>
      <div class="ready-created-tag-wrapper" v-if="mode === modeType.associate && createdKnowledgeTag !== null">
        <div class="associate-tips">
          {{ $t('teacher.add-unit-plan.knowledge-match-tips') }}
          <div class="clear-associate-icon">
            <a-popconfirm
              :title="$t('teacher.add-unit-plan.knowledge-delete-tags-confirm')"
              ok-text="Yes"
              cancel-text="No"
              @confirm="handleResetCreatedTag"
            >
              <a-icon type="delete" />
            </a-popconfirm>
          </div>
        </div>
        <div class="ready-created-tag-list">
          <div class="ready-created-tag">
            <div class="ready-created-tag-item">
              <a-tag color="#87d068">
                {{ createdKnowledgeTag }}
              </a-tag>
            </div>
          </div>
        </div>
      </div>
      <div class="knowledge-tag-wrapper" :data-visible="visible" :data-mode="mode" :data-show="visible && (mode === modeType.select || mode === modeType.associate)" v-if="visible && (mode === modeType.select || mode === modeType.associate)">
        <a-row >
          <a-col span="3">
            <div class="tag-select grade-select border-right">
              <!--              <div class="tag-label">-->
              <!--                {{ $t('teacher.add-unit-plan.select-grade') }}-->
              <!--              </div>-->
              <div class="tag-list-container">
                <div class="tag-list">
                  <div :class="{'tag-item': true, 'active-item': gradeId === grade.id}" v-for="(grade,index) in gradeList" :key="index" @click="handleSelectGrade(grade)" :id="'grade-id-' + grade.id">{{ grade.name }}</div>
                </div>
              </div>
            </div>
          </a-col>

          <a-col span="9">
            <div class="tag-select grade-select border-right">
              <!--              <div class="tag-label">-->
              <!--                {{ $t('teacher.add-unit-plan.select-subject') }}-->
              <!--              </div>-->
              <div class="subject-tree">
                <div class="main-subject border-right">
                  <div class="tag-list-container">
                    <div class="tag-list">
                      <div :class="{'tag-item': true, 'active-item': mainSubjectId === subject.id}" v-for="(subject,index) in subjectTree" :key="index" @click="handleSelectMainSubject(subject)" :id="'main-subject-id-' + subject.id">
                        <a-tooltip placement="leftTop">
                          <template slot="title">   {{ subject.name }}</template>
                          {{ subject.name }}
                        </a-tooltip>
                        <a-icon type="right" class="tag-more" v-if="subject.children.length"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="sub-subject">
                  <div class="tag-list-container">
                    <div class="tag-list">
                      <div :class="{'tag-item': true, 'active-item': subSubjectId === subject.id}" v-for="(subject,index) in subjectTreeChildren" :key="index" @click="handleSelectSubSubject(subject)" :id="'sub-subject-id-' + subject.id">
                        <a-tooltip placement="leftTop">
                          <template slot="title">{{ subject.name }}</template>
                          {{ subject.name }}
                        </a-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-col>
          <a-col span="12">
            <div class="tag-select grade-select">
              <!--              <div class="tag-label">-->
              <!--                {{ $t('teacher.add-unit-plan.knowledge-tags') }}-->
              <!--              </div>-->
              <div class="knowledge-tag-tree">
                <div class="main-knowledge border-right">
                  <div class="tag-list-container">
                    <div class="tag-list" v-show="!knowledgeLoading">
                      <div :class="{'tag-item': true, 'active-item': mainKnowledgeId === knowledgeItem.id}" v-for="(knowledgeItem,index) in knowledgeTree" :key="index" @click="handleSelectMainKnowledgeItem(knowledgeItem)" :id="'main-knowledge-id-' + knowledgeItem.id">
                        <a-tooltip placement="leftTop">
                          <template slot="title">  {{ knowledgeItem.name }}</template>
                          {{ knowledgeItem.name }}
                        </a-tooltip>
                        <a-icon type="right" class="tag-more" v-if="knowledgeItem.children.length"/>
                      </div>
                    </div>
                    <a-spin v-show="knowledgeLoading" class="spin-loading"/>
                  </div>
                </div>
                <div class="sub-knowledge border-right">
                  <div class="tag-list-container">
                    <div class="tag-list">
                      <div :class="{'tag-item': true, 'active-item': subKnowledgeId === subKnowledgeItem.id}" v-for="(subKnowledgeItem,index) in knowledgeTreeChild" :key="index" @click="handleSelectSubKnowledgeItem(subKnowledgeItem)" :id="'sub-knowledge-id-' + subKnowledgeItem.id">
                        <a-tooltip placement="leftTop">
                          <template slot="title">{{ subKnowledgeItem.name }}</template>
                          {{ subKnowledgeItem.name }}
                        </a-tooltip>
                        {{ subKnowledgeItem.name }}
                        <a-icon type="right" class="tag-more" v-if="subKnowledgeItem.tags.length"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="knowledge-tag">
                  <div class="tag-list-container">
                    <div class="tag-list" v-show="!loadingKnowledge">
                      <!--                      <div class="tag-item input-tag-item" v-show="showNewTagInput">-->
                      <!--                        <a-input :placeholder="$t('teacher.add-unit-plan.input-new-tag')" v-model="newTag" class="new-tag-input" @keyup.enter="handleAddNewTag"/>-->
                      <!--                      </div>-->
                      <div class="tag-item add-tag-item-icon" v-show="mode === modeType.associate && subKnowledgeId">
                        <a-popconfirm
                          :title="$t('teacher.add-unit-plan.knowledge-add-tags-confirm', {tagName: this.createdKnowledgeTag})"
                          ok-text="Yes"
                          cancel-text="No"
                          @confirm="handleAssociate"
                        >
                          Add <a-icon type="plus-circle" />
                        </a-popconfirm>
                      </div>
                      <div :class="{'tag-item': true, 'active-item': selectedKnowledgeTagIdList.indexOf(knowledgeTag.id) !== -1}" v-for="(knowledgeTag,index) in knowledgeTags" :key="index" @click="handleSelectKnowledgeTag(knowledgeTag)" :id="'knowledge-tag-id-' + knowledgeTag.id">
                        <a-tooltip placement="leftTop">
                          <template slot="title">{{ knowledgeTag.name }}</template>
                          {{ knowledgeTag.name }}
                        </a-tooltip>
                        <a-icon type="check" class="tag-more" v-if="selectedKnowledgeTagIdList.indexOf(knowledgeTag.id) !== -1"/>
                      </div>
                    </div>
                    <a-spin v-show="loadingKnowledge" class="spin-loading"/>
                  </div>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="search-knowledge-tag-wrapper" :data-visible="visible" :data-mode="mode" :data-show="visible && mode === modeType.search" v-if="visible && mode === modeType.search">
        <a-row >
          <a-col span="24">
            <div class="tag-select">
              <!--              <div class="tag-label">-->
              <!--                {{ $t('teacher.add-unit-plan.select-grade') }}-->
              <!--              </div>-->
              <div class="tag-list-container">
                <div class="tag-list" v-if="searchList.length">
                  <div :class="{'tag-item': true, 'search-item': true}" v-for="(item,index) in searchList" :key="index" @click="handleSelectSearchItem(item)">
                    <div class="search-item-icon">
                      <a-icon type="tag" />
                    </div>
                    <div class="search-item-value">
                      {{ item.name }}
                    </div>
                  </div>
                </div>
                <div class="add-tag-item" v-if="searchList.length">
                  <div class="add-tag-info" @click="handleCreateKnowledgeTag">
                    <span class="result-tips">
                      {{ $t('teacher.add-unit-plan.knowledge-create-tags', {searchItem: inputTag}) }}
                      <a-icon type="plus" />
                    </span>
                  </div>
                </div>
                <div class="no-knowledge-tips" v-if="!searchList.length">
                  <div class="no-search-result">
                    <div class="result-info">
                      {{ $t('teacher.add-unit-plan.knowledge-tags-no-found') }}
                    </div>
                    <div class="add-tag-info" @click="handleCreateKnowledgeTag">
                      <span class="result-tips">
                        {{ $t('teacher.add-unit-plan.knowledge-create-tags', {searchItem: inputTag}) }}
                        <a-icon type="plus" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </a-form-model-item>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { KnowledgeAddOrUpdateTag, KnowledgeGetTree, KnowledgeQueryTagsByKnowledgeId, KnowledgeSearch } from '@/api/knowledge'

const { debounce } = require('lodash-es')

const { scrollIntoViewById } = require('@/utils/domUtil')

export default {
  name: 'NewSearchKnowledgeTag',
  props: {
    questionIndex: {
      type: String,
      default: ''
    },
    gradeList: {
      type: Array,
      default: () => []
    },
    subjectTree: {
      type: Array,
      default: () => []
    },
    defaultGradeId: {
      type: String,
      default: ''
    },
    defaultMainSubjectId: {
      type: String,
      default: ''
    },
    defaultSubSubjectId: {
      type: String,
      default: ''
    },
    selectedKnowledgeTags: {
      type: Array,
      default: () => []
    }
  },
  mounted () {
    logger.info('add mounted click handler')
    this.globalClick(this.handleClick, this.$route.name, true)
  },
  beforeDestroy () {

  },
  data () {
    return {
      visible: false,
      inputTag: '',

      gradeId: '',

      mainSubjectId: '',
      subSubjectId: '',
      subjectTreeChildren: [],

      mainKnowledgeId: '',
      subKnowledgeId: '',
      knowledgeTree: [],
      knowledgeTreeChild: [],
      knowledgeTags: [],
      selectedKnowledgeTagIdList: [],
      knowledgeLoading: false,

      newTag: '',
      showNewTagInput: false,
      loadingKnowledge: false,
      tagObjData: {},
      currentSubKnowledge: { },

      modeType: {
        select: 'select',
        search: 'search',
        associate: 'associate'
      },
      mode: 'select',
      searchList: [],

      createdKnowledgeTag: null,
      selectedCreatedKnowledgeTagList: [],
      needEnsureTag: {
        id: '',
        name: '',
        description: ''
      }
    }
  },
  watch: {
    inputTag () {
      logger.info('watch inputTag mode ' + this.inputTag + ', current mode ' + this.mode)
      if (this.inputTag && this.inputTag.trim()) {
        this.mode = 'search'
      } else {
        this.mode = 'select'
      }
      logger.info('toggle mode ' + this.mode)
    }
  },
  created () {
    this.gradeId = this.defaultGradeId
    this.mainSubjectId = this.defaultMainSubjectId
    this.subSubjectId = this.defaultSubSubjectId
    this.selectedKnowledgeTagIdList = this.selectedKnowledgeTags.map(knowledgeTag => knowledgeTag.id)

    this.debouncedSearchKnowledge = debounce(this.searchKnowledge, 300)
  },
  methods: {
    handleClick (event) {
      console.log('event.path', event.path)
      const targetDom = event.path.find(path => {
        if (path.className && path.className.indexOf && path.className.indexOf('new-knowledge-tag-wrapper') !== -1) {
          if (path.dataset && path.dataset.qidx === this.questionIndex) {
            return true
          }
        }
        return false
      })
      if (targetDom) {
        logger.info('targetDom find ', targetDom)
        this.visible = true
      } else {
        logger.info('targetDom not find', targetDom)
        this.visible = false
      }
      logger.info('visible ' + this.visible + ' mode: ' + this.mode)
    },

    handleSelectGrade (grade) {
      logger.info('handleSelectGrade', grade)
      this.gradeId = grade.id
    },

    checkSelectGrade () {
      if (!this.gradeId) {
        this.$message.warn(this.$t('teacher.add-unit-plan.select-grade-first'))
      }
      return !!this.gradeId
    },

    handleSelectMainSubject (mainSubject) {
      logger.info('handleSelectMainSubject', mainSubject)
      if (!this.checkSelectGrade()) {
        return
      }
      if (mainSubject.id !== this.mainSubjectId) {
        this.resetSubSubject()
        this.resetKnowledge()
        this.mainSubjectId = mainSubject.id
        this.subjectTreeChildren = mainSubject.children
      }
    },

    resetSubSubject () {
      this.subSubjectId = ''
      this.subjectTreeChildren = []
    },

    handleSelectSubSubject (subSubject) {
      logger.info('handleSelectSubSubject', subSubject)
      if (subSubject.id !== this.subSubjectId) {
        this.subSubjectId = subSubject.id
        this.resetKnowledge()
        this.getKnowledgeTree()
      }
    },

    resetKnowledge () {
      this.mainKnowledgeId = ''
      this.subKnowledgeId = ''
      this.knowledgeTree = []
      this.knowledgeTreeChild = []
      this.knowledgeTags = []
      this.showNewTagInput = false
    },

    getKnowledgeTree () {
      this.knowledgeLoading = true
      logger.info('grade:' + this.gradeId + ', subjectId:' + this.subSubjectId)
      KnowledgeGetTree({
        gradeId: this.gradeId,
        subjectId: this.subSubjectId
      }).then((response) => {
        logger.info('KnowledgeGetTree response', response)
        this.knowledgeTree = response.result
        logger.info('knowledgeTree', this.knowledgeTree)
      }).finally(() => {
        this.knowledgeLoading = false
      })
    },

    handleSelectMainKnowledgeItem (knowledgeItem) {
      logger.info('handleSelectMainKnowledgeItem', knowledgeItem)
      if (knowledgeItem.id !== this.mainKnowledgeId) {
        this.mainKnowledgeId = knowledgeItem.id
        this.resetSubKnowledgeTags()
        this.knowledgeTreeChild = knowledgeItem.children
      }
    },

    resetSubKnowledgeTags () {
      this.knowledgeTreeChild = []
      this.showNewTagInput = false
    },

    handleSelectSubKnowledgeItem (subKnowledgeItem) {
      logger.info('handleSelectSubKnowledgeItem', subKnowledgeItem)
      if (subKnowledgeItem.id !== this.subKnowledgeId) {
        this.subKnowledgeId = subKnowledgeItem.id
        this.knowledgeTags = subKnowledgeItem.tags
        this.currentSubKnowledge = subKnowledgeItem
        this.showNewTagInput = true
      }
    },

    handleSelectKnowledgeTag (knowledgeTag) {
      logger.info('handleSelectKnowledgeTag(' + (this.selectedKnowledgeTagIdList.indexOf(knowledgeTag.id)) + ')', knowledgeTag)
      if (this.selectedKnowledgeTagIdList.indexOf(knowledgeTag.id) === -1) {
        this.$set(this.tagObjData, knowledgeTag.id, Object.assign({}, this.currentSubKnowledge))
        this.selectedKnowledgeTagIdList.push(knowledgeTag.id)
        const tagData = {
          questionIndex: this.questionIndex,
          id: knowledgeTag.id,
          name: knowledgeTag.name,
          gradeId: this.gradeId,
          description: this.currentSubKnowledge.name,
          mainSubjectId: this.mainSubjectId,
          subSubjectId: this.subSubjectId,
          mainKnowledgeId: this.mainKnowledgeId,
          subKnowledgeId: this.subKnowledgeId
        }
        this.$emit('add-knowledge-tag', tagData)
        logger.info('add knowledge tag data ', tagData)
        logger.info('tagObjData', this.tagObjData)
      } else {
        logger.info('before remove knowledgeTags', this.selectedKnowledgeTagIdList, this.selectedKnowledgeTagIdList.indexOf(knowledgeTag.id))
        this.selectedKnowledgeTagIdList.splice(this.selectedKnowledgeTagIdList.indexOf(knowledgeTag.id), 1)
        this.$delete(this.tagObjData, knowledgeTag.id)
        this.$emit('remove-knowledge-tag', {
          questionIndex: this.questionIndex,
          id: knowledgeTag.id
        })
        logger.info('tagObjData', this.tagObjData)
        logger.info('after delete knowledgeTags', this.selectedKnowledgeTagIdList)
      }
    },

    handleAddNewTag () {
      logger.info('handleAddNewTag', this.newTag)
      KnowledgeAddOrUpdateTag({
        knowledgeId: this.subKnowledgeId,
        name: this.newTag
      }).then(response => {
        logger.info('KnowledgeAddOrUpdateTag', response)
        this.newTag = ''
        this.refreshKnowledgeTags()
      })
    },

    refreshKnowledgeTags (tagDomId) {
      this.loadingKnowledge = true
      logger.info('refreshKnowledgeTags')
      KnowledgeQueryTagsByKnowledgeId({
        knowledgeId: this.subKnowledgeId
      }).then(response => {
        logger.info('KnowledgeQueryTagsByKnowledgeId', response)
        this.knowledgeTags = response.result
        const treeChildItem = this.knowledgeTreeChild.find(item => item.id === this.subKnowledgeId)
        logger.info('refreshKnowledgeTags find tree child item ', treeChildItem)
        if (treeChildItem) {
          treeChildItem.tags = response.result
        }
      }).finally(() => {
        this.loadingKnowledge = false
        if (tagDomId) {
          this.$nextTick(() => {
            logger.info('refreshKnowledgeTags tagDomId ' + tagDomId)
            scrollIntoViewById('knowledge-tag-id-' + tagDomId)
          })
        }
      })
    },

    handleChangeTag (knowledgeTag) {
      logger.info('handleChangeTag', knowledgeTag)
      this.createdKnowledgeTag = knowledgeTag.name
      this.mode = this.modeType.associate
      this.handleActiveSelectedTag(knowledgeTag)
    },

    handleDeleteTag (knowledgeTag) {
      logger.info('handleDeleteTag', knowledgeTag)
      if (this.selectedKnowledgeTagIdList.indexOf(knowledgeTag.id) !== -1) {
        logger.info('before delete knowledgeTags', this.selectedKnowledgeTagIdList, this.selectedKnowledgeTagIdList.indexOf(knowledgeTag.id))
        this.selectedKnowledgeTagIdList.splice(this.selectedKnowledgeTagIdList.indexOf(knowledgeTag.id), 1)
        this.$delete(this.tagObjData, knowledgeTag.id)
        this.$emit('remove-knowledge-tag', {
          questionIndex: this.questionIndex,
          id: knowledgeTag.id
        })
        logger.info('tagObjData', this.tagObjData)
        logger.info('after delete knowledgeTags', this.selectedKnowledgeTagIdList)
      } else {
        logger.info('no found target delete knowledgeTag', knowledgeTag)
      }
    },

    handleSelectSearchItem (item) {
      logger.info('handleSelectSearchItem item', item)
      this.mode = this.modeType.select
      this.createdKnowledgeTag = item.name
      this.handleActiveSelectedTag(item)
    },

    handleKeyup () {
      logger.info('handleKeyup ', this.inputTag)
      if (this.inputTag && this.inputTag.trim()) {
        this.mode = this.modeType.search
      } else {
        this.mode = this.modeType.select
      }
      this.debouncedSearchKnowledge(this.inputTag)
      logger.info('handleKeyup toggle mode ' + this.mode)
      logger.info('searchList ', this.searchList)
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

    handleCreateKnowledgeTag () {
      logger.info('handleCreateKnowledgeTag ' + this.inputTag)
      this.createdKnowledgeTag = this.inputTag
      this.mode = this.modeType.associate
    },

    handleRemoveCreatedTag (tagName) {
      logger.info('handleRemoveCreatedTag ' + tagName)
      this.createdKnowledgeTag = null
      logger.info('after handleRemoveCreatedTag ', this.createdKnowledgeTag)
    },

    handleClickCreatedTag (tagName) {
      const tagIndex = this.selectedCreatedKnowledgeTagList.indexOf(tagName)
      if (tagIndex !== -1) {
        this.selectedCreatedKnowledgeTagList = this.selectedCreatedKnowledgeTagList.splice(tagIndex, 1)
      } else {
        this.selectedCreatedKnowledgeTagList.push(tagName)
      }
    },

    handleResetCreatedTag () {
      logger.info('handleResetCreatedTag ', this.createdKnowledgeTag)
      this.createdKnowledgeTag = null
      this.mode = this.modeType.select
    },

    handleActiveSelectedTag (tagData) {
      logger.info('handleActiveSelectedTag', tagData)
      this.gradeId = tagData.gradeId
      if (this.mainSubjectId !== tagData.mainSubjectId) {
        this.mainSubjectId = tagData.mainSubjectId
      }
      scrollIntoViewById('main-subject-id-' + tagData.mainSubjectId)

      // select subject
      const mainSubject = this.subjectTree.find(item => item.id === tagData.mainSubjectId)
      logger.info('mainSubject ', mainSubject)
      if (mainSubject) {
        this.subjectTreeChildren = mainSubject.children
      } else {
        logger.warn('no found mainSubject of ' + tagData.mainSubjectId)
      }
      if (this.subSubjectId !== tagData.subSubjectId) {
        this.subSubjectId = tagData.subSubjectId
      }
      scrollIntoViewById('sub-subject-id-' + tagData.subSubjectId)

      // select knowledge
      const mainKnowledge = this.knowledgeTree.find(item => item.id === tagData.mainKnowledgeId)
      logger.info('mainKnowledge ', mainKnowledge)
      if (mainKnowledge) {
        this.mainKnowledgeId = tagData.mainKnowledgeId
        this.knowledgeTreeChild = mainKnowledge.children
        this.subKnowledgeId = tagData.subKnowledgeId
        const subKnowledge = this.knowledgeTreeChild.find(item => item.id === this.subKnowledgeId)
        this.currentSubKnowledge = subKnowledge
        this.knowledgeTags = subKnowledge.tags
      } else {
        // 重新加载knowledge tree
        logger.info('get select Knowledge grade:' + this.gradeId + ', subjectId:' + this.subSubjectId)
        KnowledgeGetTree({
          gradeId: this.gradeId,
          subjectId: this.subSubjectId
        }).then((response) => {
          logger.info('KnowledgeGetTree response', response)
          this.knowledgeTree = response.result
          logger.info('query api get knowledgeTree', this.knowledgeTree)
          const mainKnowledge = this.knowledgeTree.find(item => item.id === tagData.mainKnowledgeId)
          logger.info('query api get mainKnowledge ', mainKnowledge)
          if (mainKnowledge) {
            this.mainKnowledgeId = tagData.mainKnowledgeId
            this.knowledgeTreeChild = mainKnowledge.children
            this.subKnowledgeId = tagData.subKnowledgeId
            const subKnowledge = this.knowledgeTreeChild.find(item => item.id === this.subKnowledgeId)
            this.currentSubKnowledge = subKnowledge
            this.knowledgeTags = subKnowledge.tags
          } else {
            logger.warn('not get knowledge tree by gradeId: ' + this.gradeId + ' subjectId:' + this.subSubjectId)
          }
        }).finally(() => {
          this.knowledgeLoading = false
        })
      }
    },

    handleAssociate () {
      logger.info('handleAssociate ', this.createdKnowledgeTag)
      KnowledgeAddOrUpdateTag({
        knowledgeId: this.subKnowledgeId,
        name: this.createdKnowledgeTag
      }).then(response => {
        logger.info('handleAssociate KnowledgeAddOrUpdateTag', response)
        this.$message.success('add successfully')
        this.refreshKnowledgeTags(response.result.id)
        this.mode = this.modeType.select
        this.inputTag = ''
        this.createdKnowledgeTag = null
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.knowledge-tag-search-input {
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

.knowledge-wrapper {
  position: relative;
}

.knowledge-tag-wrapper {
  border: @border-width-base solid #d9d9d9;
  border-top: none;
  box-sizing: border-box;
  overflow: hidden;
  height: 200px;
  width: 100%;
  box-shadow: 0 4px 4px 2px #f9f9f9;

  .border-right {
    border-right: @border-width-base solid #d9d9d9;
    box-sizing: border-box;
  }

  .tag-select {
    height: 200px;
    .tag-label {
      height: 40px;
      line-height: 30px;
      background-color: #fafafa;
      color: rgba(0,0,0,.85);
      font-weight: 500;
      border-bottom: 1px solid #e8e8e8;
      padding: 5px 15px;
      overflow-wrap: break-word;
      text-align: center;
      box-sizing: border-box;
      border-bottom: @border-width-base solid #d9d9d9;
    }
    .tag-list-container {
      -moz-overflow-y: auto;
      overflow-y: overlay;
      position: relative;
      height: 200px;
      overflow: scroll;
      text-align: center;
      .spin-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -20px;
        margin-left: -50px;
        width: 100px;
      }
      .tag-list {

        .tag-item {
          user-select: none;
          position: relative;
          transition: all 0.2s ease-in;
          line-height: 25px;
          color: @text-color;
          padding: 5px 15px;
          border-bottom: @border-width-base solid #eee;
          cursor: pointer;
          &:hover {
            background-color: fade(@outline-color, 20%);
          }

          .tag-more {
            position: absolute;
            right: 5px;
            top: 13px;
            font-size: 10px;
          }
        }

        .add-tag-item-icon {
          color: @primary-color;
          font-weight: 500;
        }
        .input-tag-item {
          padding: 0;
          margin: 0;
        }

        .active-item {
          background-color: fade(@outline-color, 10%);

          &:hover {
            background-color: fade(@outline-color, 20%);
          }
        }
      }

      .active {
        background-color: fade(@outline-color, 10%);
      }
    }
  }

  .subject-tree {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .main-subject, .sub-subject {
      width: 50%;
      .tag-item {
        user-select: none;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
      }
    }
  }

  .knowledge-tag-tree {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .main-knowledge, .sub-knowledge, .knowledge-tag {
      width: 33.333%;
      .tag-item {
        user-select: none;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
      }
      .input-tag-item {
        padding: 0;
        margin: 0;
      }
      .new-tag-input {
        outline: none;
        border: none;
      }
    }
  }
}

.search-knowledge-tag-wrapper {
  border: @border-width-base solid #d9d9d9;
  border-top: none;
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  box-shadow: 0 4px 4px 2px #f9f9f9;

  .tag-list-container {
    max-height: 200px;
    overflow-x: scroll;
    -moz-overflow-y: auto;
    overflow-y: overlay;
    .tag-list {
      position: relative;
      padding-bottom: 35px;
      .tag-item {
        padding: 0 10px;
        color: #333;
        font-size: 14px;
        font-weight: 500;
      }
      .search-item {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;

        .search-item-icon {
          padding: 0 10px 0 0;
        }
        &:hover {
          color:  @select-item-selected-color;
          background-color: fade(@outline-color, 15%);
        }
      }
    }

    .add-tag-item {
      background-color: #fff;
      border-top: 1px solid #fafafa;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 35px;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;

      .add-tag-info {
        font-size: 13px;
        color: #aaa;

        .result-tips {
          color: @primary-color;
        }
      }
    }

    .no-knowledge-tips {
      .no-search-result {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 150px;

        .result-info {
          font-size: 13px;
          color: #aaa;
        }

        .add-tag-info {
          font-size: 13px;
          color: #aaa;

          .result-tips {
            color: @primary-color;
          }
        }
      }
    }
  }
}

.ready-created-tag-wrapper {
  border-right: 1px solid #d9d9d9;
  border-left: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  padding: 5px 10px 0 10px;
  .associate-tips {
    font-size: 13px;
    color: #aaa;
    line-height: 20px;
    position: relative;

    .clear-associate-icon {
      position: absolute;
      right: 5px;
      top: 5px;
    }
  }

  .ready-created-tag-list {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
}

.tag-list-show {
  padding-bottom: 15px;
  .tag-line {
    transition: all 200ms ease-in;
    cursor: pointer;
    padding: 3px;
    color: @primary-color;
    text-decoration: underline;
    font-size: 14px;
    display: flex;
    align-items: center;

    &:hover {
      color:  @select-item-selected-color;
      background-color: fade(@outline-color, 15%);
    }

    .tag-show-item {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      font-size: 16px;
    }

    .tag-name-col {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
    }

    .tag-name-icon {
      padding-right: 5px;
    }

    .tag-action-col {
      text-align: right;
      position: relative;

      .tag-action {
        padding-right: 10px;
      }
    }
  }
}

::-webkit-scrollbar {
  width: 2px;
  height: 0;
}
::-webkit-scrollbar-track {
  border-radius: 2px;
  background: rgba(0,0,0,0.00);
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.00);
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: rgba(0,0,0,0.06);
  -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.06);
}
</style>
