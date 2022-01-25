<template>
  <div class="content-list-wrapper">
    <div class="content-header">
      <div class="name" :style="{width: nameWidth + 'px'}">
        Name
      </div>
    </div>
    <div class="content-list" >
      <template v-if="contentDataList && contentDataList.length">
        <div
          :data-item-id="item.id"
          :class="{'content-item': true,
                   'odd-line': index % 2 === 0,'even-line': index % 2 === 1,
                   'active-line': currentId === item.id,
                   'selected-line': selectedIdList.indexOf(item.id) !== -1 ? true : (currentDataType === NavigationType.sync ? (selectedKnowledgeIdList.indexOf(item.knowledgeId) !== -1) : (
                     currentDataType === NavigationType.learningOutcomes ? (selectedCurriculumIdList.indexOf(item.id) !== -1) : (
                       currentDataType === NavigationType.specificSkills ? (selectedSubjectSpecificSkillIdList.indexOf(item.id) !== -1) : (
                         (currentDataType === NavigationType.centurySkills ||
                           currentDataType === NavigationType.AUGeneralCapabilities ||
                           currentDataType === NavigationType.NZKeyCompetencies) ? (selected21CenturySkillIdList.indexOf(item.id) !== -1) : (
                           currentDataType === NavigationType.sdg ? (selectedBigIdeaList.indexOf(item.id) !== -1) : (
                             currentDataType === NavigationType.assessmentType ? (selectedAssessmentIdList.indexOf(item.id) !== -1) : (
                               currentDataType === NavigationType.all21Century ? (selectedAll21CenturyIdList.indexOf(item.id) !== -1) : (
                                 currentDataType === NavigationType.idu ? (selectedIDUIdList.indexOf(item.id) !== -1) : false
                               )
                             )
                           )
                         )))))}"
          v-for="(item,index) in contentDataList"
          :key="index">
          <div class="name" :style="{width: nameWidth + 'px'}" @click="handleContentListItemClick(item)">
            <div class="icon">
              <template v-if="item.type">
                <content-type-icon :type="item.type" />
              </template>
              <template v-else>
                <a-icon type="folder" theme="filled" class="file-dir-icon"/>
              </template>
            </div>
            <a-tooltip placement="top" >
              <template slot="title" v-if="item.hasOwnProperty('froms')">{{ item.froms }}</template>
              <template slot="title" v-if="item.gradeNames && item.gradeNames.length > 0">{{ item.gradeNames | gradeFormat }}</template>
              <div class="name-text">
                {{ item.name || item.description }}
              </div>
              <div class="collapse-item" v-if="item.hasOwnProperty('froms')">
                <a-tag class="tag-item" v-for="(tag,tIndex) in item.tags" :key="tIndex">
                  {{ tag }}
                </a-tag>
                <a-icon class="collapse-icon" type="down" />
              </div>
            </a-tooltip>
            <div class="action-icon">
              <img src="~@/assets/icons/lesson/selected.png"/>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="content-empty" v-if="!firstLoad">
          <a-empty />
        </div>
      </template>
    </div>

    <a-drawer
      destroyOnClose
      placement="right"
      closable
      width="800px"
      :visible="previewVisible"
      @close="handlePreviewClose"
    >
      <div class="preview-wrapper">
        <div class="preview-detail">
          <unit-plan-preview :unit-plan-id="previewCurrentId" :show-associate="true" v-if="previewType === typeMap['unit-plan']" />
          <material-preview :material-id="previewCurrentId" :show-associate="true" v-if="previewType === typeMap.material" />
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { LibraryEvent, LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import UnitPlanPreview from '@/components/UnitPlan/UnitPlanPreview'
import MaterialPreview from '@/components/Material/MaterialPreview'
import { typeMap } from '@/const/teacher'
import { NavigationType } from '@/components/NewLibrary/NavigationType'

export default {
  name: 'NewContentList',
  components: {
    ContentTypeIcon,
    UnitPlanPreview,
    MaterialPreview
  },
  props: {
    selectedList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      currentId: null,
      nameWidth: 500,
      contentDataList: [],
      parent: null,

      previewVisible: false,
      previewCurrentId: '',
      previewType: '',
      blockIndex: 0,
      typeMap: typeMap,
      firstLoad: true,
      NavigationType: NavigationType,

      selectedCurriculumIdList: [],
      selectedCurriculumMap: new Map(),

      selectedKnowledgeIdList: [],
      selectedKnowledgeIdNameMap: new Map(),

      selected21CenturySkillIdList: [],
      selected21CenturySkillIdMap: new Map(),

      selectedSubjectSpecificSkillIdList: [],
      selectedSubjectSpecificSkillIdMap: new Map(),

      selectedAssessmentIdList: [],
      selectedAssessmentMap: new Map(),

      selectedAll21CenturyIdList: [],
      selectedAll21CenturyMap: new Map(),

      selectedIDUIdList: [],
      selectedIDUMap: new Map(),

      selectedIdList: [],
      selectedMap: new Map(),

      // big idea为纯文字
      selectedBigIdeaList: [],
      currentDataType: 'none',

      mySelectedList: [],
      backgroundColor: '#ffffff'
    }
  },
  watch: {
    selectedList (val) {
      this.$logger.info('NewContentList selectedList change', val)
      this.mySelectedList = val
      this.selectedIdList = []
      this.selectedMap.clear()
      this.mySelectedList.forEach(item => {
        this.selectedIdList.push(item.knowledgeId)
        this.selectedMap.set(item.knowledgeId, item)
      })
    }
  },
  mounted () {
    LibraryEventBus.$on(LibraryEvent.ContentListUpdate, this.handleContentListUpdate)
    LibraryEventBus.$on(LibraryEvent.ContentListSelectedListUpdate, this.handleContentSelectedListUpdate)
    this.nameWidth = document.getElementById('new-library').getBoundingClientRect().width - 400
    this.$logger.info('nameWidth ' + this.nameWidth)
    this.$logger.info('NewContentList selectedList', this.selectedList)
    this.mySelectedList = this.selectedList
    this.assignSelectedList()
  },
  methods: {
    assignSelectedList () {
      this.$logger.info('assignSelectedList', this.selectedList)
      this.selectedIdList = []
      this.selectedMap.clear()
      this.selectedList.forEach(item => {
        this.selectedIdList.push(item.knowledgeId)
        this.selectedMap.set(item.knowledgeId, item)
      })
      this.$logger.info('assignSelectedList selectedIdList', this.selectedIdList)
    },

    handleContentListUpdate (data) {
      this.$logger.info('NewContentList handleContentListUpdate ', data)
      this.backgroundColor = data.backgroundColor
      this.contentDataList = data.contentList
      this.parent = data.currentTreeData
      this.currentDataType = data.dataType
      this.firstLoad = false
    },

    handleContentSelectedListUpdate (data) {
      this.$logger.info('handleContentSelectedListUpdate ', data)
      if (this.selectedCurriculumIdList.indexOf(data.id) === -1) {
        this.selectedCurriculumIdList.push(data.id)
        this.selectedCurriculumMap.set(data.id, data)
      } else {
        this.selectedCurriculumIdList.splice(this.selectedCurriculumIdList.indexOf(data.id), 1)
        this.selectedCurriculumMap.delete(data.id)
      }
      this.$logger.info('after handleContentSelectedListUpdate ', this.selectedCurriculumIdList, this.selectedCurriculumMap)
    },
    handleContentListItemClick (item) {
      this.$logger.info(this.currentDataType + ': handleContentListItemClick current item: ', item, ' parent:', this.parent)
      item.originParent = this.parent

      const index = this.selectedIdList.indexOf(item.id)
      if (index !== -1) {
        this.selectedIdList.splice(index, 1)
        this.selectedMap.delete(item.id)
        this.$logger.info('delete from selectedIdList', this.selectedIdList)
        const mIndex = this.mySelectedList.findIndex(data => data.knowledgeId === item.id)
        this.mySelectedList.splice(mIndex, 1)
        this.$emit('update-selected-list', this.mySelectedList)
        return
      }

      if (this.currentDataType === NavigationType.sync) {
        // 同步更新点击sync data数据，通过当前字段是否包含froms来区分sync和大纲描述
        this.$logger.info('handle sync handleContentListItemClick', item)
        const index = this.selectedKnowledgeIdList.indexOf(item.knowledgeId)
        if (index !== -1) {
          this.selectedKnowledgeIdList.splice(index, 1)
          this.selectedKnowledgeIdNameMap.delete(item.knowledgeId)
        } else {
          this.selectedKnowledgeIdList.push(item.knowledgeId)
          this.selectedKnowledgeIdNameMap.set(item.knowledgeId, item.name, item.tagType, item.tags)
        }
        const selectedList = []
        this.selectedKnowledgeIdList.forEach(knowledgeId => {
          selectedList.push({
            dataType: this.currentDataType,
            knowledgeId: knowledgeId,
            name: this.selectedKnowledgeIdNameMap.get(knowledgeId),
            tagType: item.tagType,
            tags: item.tags
          })
        })
        this.$emit('select-sync', selectedList)
        this.$logger.info('selectedKnowledgeIdNameMap', this.selectedKnowledgeIdNameMap)
      } else if (this.currentDataType === NavigationType.learningOutcomes) {
        // 同步更新点击大纲描述数据
        if (item.children.length || (item.gradeList && item.gradeList.length) || item.hasOwnProperty('gradeList')) {
          // 如果有子列表，表示还未到最后一层description，通知左侧导航栏更新同步层级
          LibraryEventBus.$emit(LibraryEvent.ContentListItemClick, {
            item,
            dataType: this.currentDataType,
            parent: this.parent,
            eventType: 'syncDir'
          })
          this.$logger.info('$emit sync', item, this.currentDataType, this.parent)
        } else {
          // 有的时候grade下面没数据，需要排除一下grade
          if (!item.hasOwnProperty('isGrade')) {
            // 最后一列，字列表无需让导航栏更新，导航栏不显示最后一层description。通过事件类型区分。 ContentListItemClick
            const index = this.selectedCurriculumIdList.indexOf(item.id)
            if (index !== -1) {
              this.selectedCurriculumIdList.splice(index, 1)
              this.selectedCurriculumMap.delete(item.id)
            } else {
              this.selectedCurriculumIdList.push(item.id)
              this.selectedCurriculumMap.set(item.id, item)
            }
            const selectedList = []
            this.selectedCurriculumIdList.forEach(knowledgeId => {
              selectedList.push({
                dataType: this.currentDataType,
                knowledgeId: knowledgeId,
                knowledgeData: this.selectedCurriculumMap.get(knowledgeId)
              })
            })
            this.$emit('select-curriculum', selectedList)
            this.$logger.info('selectedCurriculumMap', this.selectedCurriculumMap)
          } else {
            // grade下层为空
            const eventData = {
              item,
              dataType: this.currentDataType,
              parent: this.parent,
              eventType: 'syncDir'
            }
            LibraryEventBus.$emit(LibraryEvent.ContentListItemClick, eventData)
            this.$logger.info('current is grade, skip empty children item!', eventData)
          }
        }
      } else if (this.currentDataType === NavigationType.specificSkills) {
        // Achievement objectives 是mainSubject-year-knowledge
        if (item.children.length || (item.gradeList && item.gradeList.length)) {
          // 如果有子列表，表示还未到最后一层knowledge，通知左侧导航栏更新同步层级
          LibraryEventBus.$emit(LibraryEvent.ContentListItemClick, {
            item,
            dataType: this.currentDataType,
            parent: this.parent,
            eventType: 'syncDir'
          })
          this.$logger.info('$emit sync specificSkills', item, this.currentDataType, this.parent)
        } else {
          // 有的时候grade下面没数据，需要排除一下grade
          if (!item.hasOwnProperty('isGrade')) {
            // 最后一列，字列表无需让导航栏更新，导航栏不显示最后一层description。通过事件类型区分。 ContentListItemClick
            const index = this.selectedSubjectSpecificSkillIdList.indexOf(item.id)
            if (index !== -1) {
              this.selectedSubjectSpecificSkillIdList.splice(index, 1)
              this.selectedSubjectSpecificSkillIdMap.delete(item.id)
            } else {
              this.selectedSubjectSpecificSkillIdList.push(item.id)
              this.selectedSubjectSpecificSkillIdMap.set(item.id, item)
            }
            const selectedList = []
            this.selectedSubjectSpecificSkillIdList.forEach(knowledgeId => {
              selectedList.push({
                dataType: this.currentDataType,
                knowledgeId: knowledgeId,
                knowledgeData: this.selectedSubjectSpecificSkillIdMap.get(knowledgeId)
              })
            })
            this.$emit('select-subject-specific-skill', selectedList)
            this.$logger.info('selectedSubjectSpecificSkillIdMap', this.selectedSubjectSpecificSkillIdMap)
          } else {
            // grade下层为空
            const eventData = {
              item,
              dataType: this.currentDataType,
              parent: this.parent,
              eventType: 'syncDir'
            }
            LibraryEventBus.$emit(LibraryEvent.ContentListItemClick, eventData)
            this.$logger.info('current is grade, skip empty children item!', eventData)
          }
        }
      } else if (this.currentDataType === NavigationType.centurySkills || this.currentDataType === NavigationType.AUGeneralCapabilities || this.currentDataType === NavigationType.NZKeyCompetencies) {
        // 21 century skills 是year-knowledge
        if (item.children.length || (item.gradeList && item.gradeList.length)) {
          // 如果有子列表，表示还未到最后一层description，通知左侧导航栏更新同步层级
          LibraryEventBus.$emit(LibraryEvent.ContentListItemClick, {
            item,
            dataType: this.currentDataType,
            parent: this.parent,
            eventType: 'syncDir'
          })
          this.$logger.info('$emit sync')
        } else {
          // 有的时候grade下面没数据，需要排除一下grade
          if (!item.hasOwnProperty('isGrade')) {
            // 最后一列，字列表无需让导航栏更新，导航栏不显示最后一层description。通过事件类型区分。 ContentListItemClick
            const index = this.selected21CenturySkillIdList.indexOf(item.id)
            if (index !== -1) {
              this.selected21CenturySkillIdList.splice(index, 1)
              this.selected21CenturySkillIdMap.delete(item.id)
            } else {
              this.selected21CenturySkillIdList.push(item.id)
              this.selected21CenturySkillIdMap.set(item.id, item)
            }
            const selectedList = []
            this.selected21CenturySkillIdList.forEach(knowledgeId => {
              selectedList.push({
                dataType: this.currentDataType,
                knowledgeId: knowledgeId,
                knowledgeData: this.selected21CenturySkillIdMap.get(knowledgeId)
              })
            })
            this.$emit('select-century-skill', selectedList)
            this.$logger.info('selected21CenturySkillIdMap', this.selected21CenturySkillIdMap)
          } else {
            // grade下层为空
            const eventData = {
              item,
              dataType: this.currentDataType,
              parent: this.parent,
              eventType: 'syncDir'
            }
            LibraryEventBus.$emit(LibraryEvent.ContentListItemClick, eventData)
            this.$logger.info('current is grade, skip empty children item!', eventData)
          }
        }
      } else if (this.currentDataType === NavigationType.sdg) {
        // sdg数据结构：sdg列表-keywords-big idea
        if (!item.hasOwnProperty('isBigIdea')) {
          // 如果有子列表，表示还未到最后一层description，通知左侧导航栏更新同步层级
          const eventData = {
            item,
            dataType: this.currentDataType,
            parent: this.parent,
            eventType: 'syncDir'
          }
          LibraryEventBus.$emit(LibraryEvent.ContentListItemClick, eventData)
          this.$logger.info('BigIdea $emit sync eventData', eventData)
        } else {
          const index = this.selectedBigIdeaList.indexOf(item.id)
          if (index !== -1) {
            this.selectedBigIdeaList.splice(index, 1)
          } else {
            this.selectedBigIdeaList.push(item.id)
          }
          const selectedList = []
          this.selectedBigIdeaList.forEach(bigIdea => {
            selectedList.push({
              dataType: this.currentDataType,
              bigIdea
            })
          })
          this.$emit('select-big-idea', selectedList)
          this.$logger.info('select-big-idea', this.selectedBigIdeaList)
        }
      } else if (this.currentDataType === NavigationType.assessmentType) {
        // assessmentType 是mainSubject-year-assessmentType-knowledge
        // asseeement的grade下面有两层，所以根据数据字段中特定的标识字段判断是否为knowledge(QueryKnowledgesByAssessmentTypeId、GetAssessmentTypeList的时候标识的
        if (!item.hasOwnProperty('isKnowledge') || (item.gradeList && item.gradeList.length)) {
          // 如果有子列表，表示还未到最后一层knowledge，通知左侧导航栏更新同步层级
          LibraryEventBus.$emit(LibraryEvent.ContentListItemClick, {
            item,
            dataType: this.currentDataType,
            parent: this.parent,
            eventType: 'syncDir'
          })
          this.$logger.info('$emit sync')
        } else {
          // 有的时候grade下面没数据，需要排除一下grade
          if (!item.hasOwnProperty('isGrade')) {
            // 最后一列，字列表无需让导航栏更新，导航栏不显示最后一层description。通过事件类型区分。 ContentListItemClick
            const index = this.selectedAssessmentIdList.indexOf(item.id)
            if (index !== -1) {
              this.selectedAssessmentIdList.splice(index, 1)
              this.selectedAssessmentMap.delete(item.id)
            } else {
              this.selectedAssessmentIdList.push(item.id)
              this.selectedAssessmentMap.set(item.id, item)
            }
            const selectedList = []
            this.selectedAssessmentIdList.forEach(assessmentId => {
              selectedList.push({
                dataType: this.currentDataType,
                knowledgeId: assessmentId,
                knowledgeData: this.selectedAssessmentMap.get(assessmentId)
              })
            })
            this.$emit('select-assessmentType', selectedList)
            this.$logger.info('selectedAssessmentMap', this.selectedAssessmentMap)
          } else {
            // grade下层为空
            const eventData = {
              item,
              dataType: this.currentDataType,
              parent: this.parent,
              eventType: 'syncDir'
            }
            LibraryEventBus.$emit(LibraryEvent.ContentListItemClick, eventData)
            this.$logger.info('current is grade, skip empty children item!', eventData)
          }
        }
      } else if (this.currentDataType === NavigationType.all21Century) {
        // all 21 century skills 直接遍历children
        if (item.children.length) {
          // 如果有子列表，表示还未到最后一层description，通知左侧导航栏更新同步层级
          LibraryEventBus.$emit(LibraryEvent.ContentListItemClick, {
            item,
            dataType: this.currentDataType,
            parent: this.parent,
            eventType: 'syncDir'
          })
          this.$logger.info('$emit sync')
        } else {
          const index = this.selectedAll21CenturyIdList.indexOf(item.id)
          if (index !== -1) {
            this.selectedAll21CenturyIdList.splice(index, 1)
            this.selectedAll21CenturyMap.delete(item.id)
          } else {
            this.selectedAll21CenturyIdList.push(item.id)
            this.selectedAll21CenturyMap.set(item.id, item)
          }
          const selectedList = []
          this.selectedAll21CenturyIdList.forEach(all21Century => {
            selectedList.push({
              dataType: this.currentDataType,
              all21Century,
              item: this.selectedAll21CenturyMap.get(all21Century)
            })
          })
          this.$emit('select-all-21-century', selectedList)
          this.$logger.info('select-all-21-century', selectedList)
        }
      } else if (this.currentDataType === NavigationType.idu) {
        if (!item.hasOwnProperty('isGrade')) {
          const index = this.selectedIDUIdList.indexOf(item.id)
          if (index !== -1) {
            this.selectedIDUIdList.splice(index, 1)
            this.selectedIDUMap.delete(item.id)
          } else {
            this.selectedIDUIdList.push(item.id)
            this.selectedIDUMap.set(item.id, item)
          }
          const selectedList = []
          this.selectedIDUIdList.forEach(iduId => {
            selectedList.push({
              dataType: this.currentDataType,
              knowledgeId: iduId,
              knowledgeData: this.selectedIDUMap.get(iduId)
            })
          })
          this.$emit('select-idu', selectedList)
          this.$logger.info('selectedIDUMap', this.selectedIDUMap)
        } else {
          // grade下层为空
          const eventData = {
            item,
            dataType: this.currentDataType,
            parent: this.parent,
            eventType: 'syncDir'
          }
          LibraryEventBus.$emit(LibraryEvent.ContentListItemClick, eventData)
          this.$logger.info('current is grade, skip empty children item!', eventData)
        }
      }
    },
    handlePreviewClose () {
      this.$logger.info('handlePreviewClose')
      this.previewCurrentId = ''
      this.previewType = ''
      this.previewVisible = false
    },
    handlePreviewDetail (data) {
      this.$logger.info('handlePreviewDetail', data)
      this.previewCurrentId = data.id
      this.previewType = data.type
      this.previewVisible = true
    },
    handleRemoveSelected (item) {
      this.$logger.info('Content List handleRemoveSelected ' + item.dataType, item)

      if (item.dataType === NavigationType.sync) {
        const index = this.selectedKnowledgeIdList.indexOf(item.knowledgeId)
        if (index !== -1) {
          this.selectedKnowledgeIdList.splice(index, 1)
          this.selectedKnowledgeIdNameMap.delete(item.knowledgeId)
        }
        const selectedList = []
        this.selectedKnowledgeIdList.forEach(knowledgeId => {
          selectedList.push({
            dataType: item.dataType,
            knowledgeId: knowledgeId,
            name: this.selectedKnowledgeIdNameMap.get(knowledgeId),
            tagType: item.tagType,
            tags: item.tags
          })
        })
        this.$emit('select-sync', selectedList)
      } else if (item.dataType === NavigationType.learningOutcomes) {
        const index = this.selectedCurriculumIdList.indexOf(item.knowledgeData.id)
        if (index !== -1) {
          this.selectedCurriculumIdList.splice(index, 1)
          this.selectedCurriculumMap.delete(item.knowledgeData.id)
        }
        const selectedList = []
        this.selectedCurriculumIdList.forEach(knowledgeId => {
          selectedList.push({
            dataType: item.dataType,
            knowledgeId: knowledgeId,
            knowledgeData: this.selectedCurriculumMap.get(knowledgeId)
          })
        })
        this.$emit('select-curriculum', selectedList)
      } else if (item.dataType === NavigationType.specificSkills) {
        const index = this.selectedSubjectSpecificSkillIdList.indexOf(item.knowledgeData.id)
        if (index !== -1) {
          this.selectedSubjectSpecificSkillIdList.splice(index, 1)
          this.selectedSubjectSpecificSkillIdMap.delete(item.knowledgeData.id)
        }
        const selectedList = []
        this.selectedSubjectSpecificSkillIdList.forEach(knowledgeId => {
          selectedList.push({
            dataType: item.dataType,
            knowledgeId: knowledgeId,
            knowledgeData: this.selectedSubjectSpecificSkillIdMap.get(knowledgeId)
          })
        })
        this.$emit('select-subject-specific-skill', selectedList)
      } else if (item.dataType === NavigationType.centurySkills || item.dataType === NavigationType.AUGeneralCapabilities || item.dataType === NavigationType.NZKeyCompetencies) {
        const index = this.selected21CenturySkillIdList.indexOf(item.knowledgeData.id)
        if (index !== -1) {
          this.selected21CenturySkillIdList.splice(index, 1)
          this.selected21CenturySkillIdMap.delete(item.knowledgeData.id)
        }
        const selectedList = []
        this.selected21CenturySkillIdList.forEach(knowledgeId => {
          selectedList.push({
            dataType: item.dataType,
            knowledgeId: knowledgeId,
            knowledgeData: this.selected21CenturySkillIdMap.get(knowledgeId)
          })
        })
        this.$emit('select-century-skill', selectedList)
      } else if (item.dataType === NavigationType.sdg) {
        const index = this.selectedBigIdeaList.indexOf(item.bigIdea)
        if (index !== -1) {
          this.selectedBigIdeaList.splice(index, 1)
        }
        const selectedList = []
        this.selectedBigIdeaList.forEach(bigIdea => {
          selectedList.push({
            dataType: item.dataType,
            bigIdea
          })
        })
        this.$emit('select-big-idea', selectedList)
      } else if (item.dataType === NavigationType.assessmentType) {
        const index = this.selectedAssessmentIdList.indexOf(item.knowledgeData.id)
        if (index !== -1) {
          this.selectedAssessmentIdList.splice(index, 1)
          this.selectedAssessmentMap.delete(item.knowledgeData.id)
        }
        const selectedList = []
        this.selectedAssessmentIdList.forEach(assessmentId => {
          selectedList.push({
            dataType: this.currentDataType,
            knowledgeId: assessmentId,
            knowledgeData: this.selectedAssessmentMap.get(assessmentId)
          })
        })
        this.$emit('select-assessmentType', selectedList)
      } else if (item.dataType === NavigationType.all21Century) {
        const index = this.selectedAll21CenturyIdList.indexOf(item.item.id)
        if (index !== -1) {
          this.selectedAll21CenturyIdList.splice(index, 1)
          this.selectedAll21CenturyMap.delete(item.item.id)
        }
        const selectedList = []
        this.selectedAll21CenturyIdList.forEach(all21Century => {
          selectedList.push({
            dataType: item.dataType,
            all21Century,
            item: this.selectedAll21CenturyMap.get(all21Century)
          })
        })
        this.$emit('select-all-21-century', selectedList)
      } else if (item.dataType === NavigationType.idu) {
        const index = this.selectedIDUIdList.indexOf(item.id)
        if (index !== -1) {
          this.selectedIDUIdList.splice(index, 1)
          this.selectedIDUMap.delete(item.id)
        } else {
          this.selectedIDUIdList.push(item.id)
          this.selectedIDUMap.set(item.id, item)
        }
        const selectedList = []
        this.selectedIDUIdList.forEach(iduId => {
          selectedList.push({
            dataType: this.currentDataType,
            knowledgeId: iduId,
            knowledgeData: this.selectedIDUMap.get(iduId)
          })
        })
        this.$emit('select-idu', selectedList)
        this.$logger.info('selectedIDUMap', this.selectedIDUMap)
      }
    }
  },
  destroyed () {
    LibraryEventBus.$off(LibraryEvent.ContentListUpdate, this.handleContentListUpdate)
    this.$logger.info('off NewContentList ContentListUpdate handler')
    LibraryEventBus.$off(LibraryEvent.ContentListSelectedListUpdate, this.handleContentSelectedListUpdate)
    this.$logger.info('off NewContentList ContentListSelectedListUpdate handler')
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";

.content-list-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  .content-header {
    font-weight: 600;
    background-color: #eee;
    line-height: 30px;
    cursor: pointer;
    user-select: none;
    display: flex;
    overflow: hidden;
    padding: 5px 10px;
    .name {
      padding: 0 10px;
      cursor: pointer;
      user-select: none;
    }
    .owner {
      width: 170px;
      padding: 0 10px;
      text-align: left;
    }

    .date-modified {
      width: 170px;
      padding: 0 10px;
      text-align: left;
    }
  }
  .content-list {
    background-color: #fff;
    flex: 1;
    overflow-y: scroll;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
    height: calc(100%- 40);

    .content-empty {
      margin-top: 150px;
    }

    .even-line {
      background-color: #ffffff;
    }

    .odd-line {
      background-color: rgba(228, 228, 228, 0.2);
    }

    .action-icon {
      display: none;
    }

    .selected-line {
      background-color: fade(@outline-color, 10%) !important;
      color: @text-color;
      border: 1px solid #15C39A !important;
      box-sizing: border-box;
      position: relative;

      .action-icon {
        display: block;
        position: absolute;
        right: 5px;
        top: 50%;
        margin-top: -10px;
        img {
          height: 18px;
        }
      }
    }

    .active-line {
      background-color: #EBEEFD;
      color: @primary-color;
    }

    .content-item {
      border: 1px solid #fff;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      padding: 10px;
      margin: 3px;
      position: relative;

      &:hover {
        background-color: #EDF1F5;
      }

      .name {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        word-break: break-all;
        padding: 0 10px;
        width: 100%;
        .icon {
          .file-dir-icon {
            padding: 3px 0;
            box-sizing: border-box;
            color: #82c0d8;
            font-size: 18px;
          }
        }

        .name-text {
          padding: 0 5px;
          box-sizing: border-box;
          word-break: break-word;
          white-space:normal;
        }
        .collapse-item{
          display: flex;
          padding: 10px;
          .collapse-icon{
            right: 10px;
            position: absolute;
          }
          .tag-item{
            color: rgb(21, 195, 154);
            border: 1px solid rgb(21, 195, 154);
            cursor: pointer;
            border-radius: 10px;
            word-break: normal;
            width: auto;
            display: block;
            white-space: pre-wrap;
            overflow-wrap: break-word;
          }
        }
      }

      .owner {
        width: 170px;
        padding: 0 10px;
        text-align: left;
      }

      .date-modified {
        width: 170px;
        padding: 0 10px;
        text-align: left;
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
}
</style>
