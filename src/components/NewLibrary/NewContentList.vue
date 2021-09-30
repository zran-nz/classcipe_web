<template>
  <div class="content-list-wrapper">
    <div class="content-header">
      <div class="name" :style="{width: nameWidth + 'px'}">
        Name
      </div>
    </div>
    <div class="content-list">
      <template v-if="contentDataList && contentDataList.length">
        <div
          :class="{'content-item': true,
                   'odd-line': index % 2 === 0,'even-line': index % 2 === 1,
                   'active-line': currentId === item.id,
                   'selected-line': currentDataType === NavigationType.sync ? (selectedKnowledgeIdList.indexOf(item.knowledgeId) !== -1) : (
                     currentDataType === NavigationType.learningOutcomes ? (selectedCurriculumIdList.indexOf(item.id) !== -1) : (
                       currentDataType === NavigationType.specificSkills ? (selectedSubjectSpecificSkillIdList.indexOf(item.id) !== -1) : (
                         currentDataType === NavigationType.centurySkills ? (selected21CenturySkillIdList.indexOf(item.id) !== -1) : false)
                     ))}"
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
            <div class="action-icon" v-if="item.hasOwnProperty('froms') ? selectedKnowledgeIdList.indexOf(item.knowledgeId) !== -1 : selectedCurriculumIdList.indexOf(item.id) !== -1">
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
      currentDataType: 'none'
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    LibraryEventBus.$on(LibraryEvent.ContentListUpdate, this.handleContentListUpdate)
    LibraryEventBus.$on(LibraryEvent.ContentListSelectedListUpdate, this.handleContentSelectedListUpdate)
    this.nameWidth = document.getElementById('new-library').getBoundingClientRect().width - 400
    this.$logger.info('nameWidth ' + this.nameWidth)
  },
  methods: {
    handleContentListUpdate (data) {
      this.$logger.info('handleContentListUpdate ', data)
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
        // subject specific skills 是mainSubject-year-knowledge
        if (item.children.length || (item.gradeList && item.gradeList.length)) {
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
      } else if (this.currentDataType === NavigationType.centurySkills) {
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
      background-color: #F8F8F8;
    }

    .selected-line {
      background-color: fade(@outline-color, 10%);
      color: @text-color;
      border: 1px solid #15C39A !important;
      box-sizing: border-box;
      position: relative;

      .action-icon {
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
