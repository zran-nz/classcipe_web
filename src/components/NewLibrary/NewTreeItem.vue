<template>
  <div
    class="tree-item"
    v-if="treeItemData"
    :data-deep="defaultDeep"
    :data-current-type="currentItemType"
    :data-root-type="rootType">
    <div
      :class="{'item-wrapper': true , 'odd-line': odd, 'even-line': !odd}"
      :style="{paddingLeft: (defaultDeep * defaultPaddingLeft === 0 ? defaultPaddingLeft / 3 : defaultDeep * defaultPaddingLeft) + 'px'}">
      <div class="subtree-icon-wrapper">
        <div class="subtree-icon-item" v-if="hasSubTree">
          <template v-if="!subTreeExpandStatus">
            <a-icon
              type="right"
              class="subtree-icon"
              @click="handleExpandTreeItem(treeItemData)"
              v-if="!subTreeLoading" />
            <a-spin size="small" v-if="subTreeLoading" />
          </template>
          <template v-if="subTreeExpandStatus">
            <a-icon
              type="down"
              class="subtree-icon"
              @click="handleCollapseTreeItem(treeItemData)"
              v-if="!subTreeLoading" />
            <a-spin size="small" v-if="subTreeLoading" />
          </template>
        </div>
      </div>
      <div class="type-icon-wrapper" @click="handleExpandTreeItem(treeItemData)">
        <a-icon type="folder-open" theme="filled" class="file-dir-icon" v-if="subTreeExpandStatus" />
        <a-icon type="folder" theme="filled" class="file-dir-icon" v-if="!subTreeExpandStatus" />
      </div>
      <div class="display-label-wrapper" @click="handleExpandTreeItem(treeItemData)">
        <span
          :class="{
            'display-label': true,
            'selected-display-label': selected21CenturyItem === treeItemData
          }">{{ treeItemData.name }}</span>
        <img
          src="~@/assets/icons/lesson/selected.png"
          v-if="selected21CenturyItem === treeItemData" />
      </div>
    </div>
    <template v-if="subItemType">

      <!--learningOutcomes 大纲浏览的展示逻辑-->
      <div
        class="sub-tree"
        v-show="subTreeExpandStatus && hasSubTree"
        :data-sub-type="subItemType"
        :data-hasSubTree="hasSubTree">
        <template v-if="subItemType === 'subject'">
          <new-tree-item
            :grade-list="gradeList"
            :tree-current-parent="subTreeParent"
            :tree-item-data="treeItem"
            :default-grade-id="defaultGradeId"
            :current-item-type="subItemType"
            :data-default-grade-id="defaultGradeId"
            :data-item-type="subItemType"
            :select-mode="selectMode"
            :question-index="questionIndex"
            :tree-item-type="treeItemType"
            :root-type="rootType"
            :default-deep="(defaultDeep + 1)"
            :default-expand-status="treeItem.expandStatus"
            v-for="(treeItem, index) in treeItemData.children"
            :odd="odd ? index % 2 === 1 : index % 2 === 0 "
            :key="index" />
        </template>
        <template v-if="subItemType === 'grade'">
          <new-tree-item
            :grade-list="gradeList"
            :tree-current-parent="subTreeParent"
            :tree-item-data="treeItem"
            :current-item-type="subItemType"
            :select-mode="selectMode"
            :question-index="questionIndex"
            :tree-item-type="treeItemType"
            :root-type="rootType"
            :default-deep="(defaultDeep + 1)"
            :default-expand-status="treeItem.expandStatus"
            :default-grade-id="defaultGradeId"
            :data-default-grade-id="defaultGradeId"
            :class="{'auto-selected-grade': defaultGradeId === treeItem.id }"
            v-for="(treeItem, index) in treeItemData.gradeList"
            :odd="odd ? index % 2 === 1 : index % 2 === 0 "
            :key="index" />
        </template>
        <template v-if="subItemType === 'assessmentType'">
          <new-tree-item
            :grade-list="gradeList"
            :tree-current-parent="subTreeParent"
            :tree-item-data="treeItem"
            :current-item-type="subItemType"
            :select-mode="selectMode"
            :question-index="questionIndex"
            :tree-item-type="treeItemType"
            :root-type="rootType"
            :default-deep="(defaultDeep + 1)"
            :default-expand-status="treeItem.expandStatus"
            v-for="(treeItem, index) in treeItemData.children"
            :odd="odd ? index % 2 === 1 : index % 2 === 0 "
            :key="index" />
        </template>
        <!-- knowledge 下级列表不展示最后一级-->
        <template
          v-if="subItemType === 'knowledge' && (treeItemData.children.length !== 0 && treeItemData.children[0] && treeItemData.children[0].children && treeItemData.children[0].children.length)">
          <new-tree-item
            :grade-list="gradeList"
            :tree-current-parent="subTreeParent"
            :tree-item-data="treeItem"
            :current-item-type="subItemType"
            :select-mode="selectMode"
            :question-index="questionIndex"
            :tree-item-type="treeItemType"
            :root-type="rootType"
            :default-deep="(defaultDeep + 1)"
            :default-expand-status="treeItem.expandStatus"
            v-for="(treeItem, index) in treeItemData.children"
            :odd="odd ? index % 2 === 1 : index % 2 === 0 "
            :key="index" />
        </template>
        <!--sdg列表-->
        <template v-if="subItemType === 'sdgList'">
          <new-tree-item
            :grade-list="gradeList"
            :tree-current-parent="subTreeParent"
            :tree-item-data="treeItem"
            :current-item-type="subItemType"
            :select-mode="selectMode"
            :question-index="questionIndex"
            :tree-item-type="treeItemType"
            :root-type="rootType"
            :default-deep="(defaultDeep + 1)"
            :default-expand-status="treeItem.expandStatus"
            v-for="(treeItem, index) in treeItemData.children"
            :odd="odd ? index % 2 === 1 : index % 2 === 0 "
            :key="index" />
        </template>
        <template v-if="subItemType === 'sdgKeyword'">
          <new-tree-item
            :grade-list="gradeList"
            :tree-current-parent="subTreeParent"
            :tree-item-data="treeItem"
            :current-item-type="subItemType"
            :select-mode="selectMode"
            :question-index="questionIndex"
            :tree-item-type="treeItemType"
            :root-type="rootType"
            :default-deep="(defaultDeep + 1)"
            :default-expand-status="treeItem.expandStatus"
            v-for="(treeItem, index) in treeItemData.children"
            :odd="odd ? index % 2 === 1 : index % 2 === 0 "
            :key="index" />
        </template>
        <template v-if="subItemType === 'all21Century'">
          <new-tree-item
            :grade-list="gradeList"
            :tree-current-parent="subTreeParent"
            :tree-item-data="treeItem"
            :current-item-type="subItemType"
            :select-mode="selectMode"
            :question-index="questionIndex"
            :tree-item-type="treeItemType"
            :root-type="rootType"
            :default-deep="(defaultDeep + 1)"
            :default-expand-status="treeItem.expandStatus"
            v-for="(treeItem, index) in treeItemData.children"
            :odd="odd ? index % 2 === 1 : index % 2 === 0 "
            :key="index" />
        </template>
      </div>
    </template>
  </div>
</template>

<script>

import { LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'
import { NavigationType } from '@/components/NewLibrary/NavigationType'
import { QueryBigIdea, ScenarioGetKeywordScenarios } from '@/api/scenario'
import {
  GetAssessmentTypeList,
  QueryKnowledgesByAssessmentTypeId,
  KnowledgeQueryContentByDescriptionId,
  GetIBIduList
} from '@/api/knowledge'
import { SelectModel } from '@/components/NewLibrary/SelectModel'

const { LibraryEvent } = require('@/components/NewLibrary/LibraryEventBus')
const { KnowledgeGetTree, Get21Century } = require('@/api/knowledge')

const ExpandStatus = {
  collapse: false,
  open: true
}
export default {
  name: 'NewTreeItem',
  props: {
    defaultDeep: {
      type: Number,
      default: 0
    },
    defaultExpandStatus: {
      type: Boolean
    },
    // eslint-disable-next-line vue/require-default-prop
    gradeList: {
      type: Array
    },
    treeItemData: {
      type: Object,
      default: null
    },
    treeItemType: {
      type: String,
      default: null
    },
    rootType: {
      type: String,
      default: null
    },
    treeCurrentParent: {
      type: Object,
      default: null
    },
    odd: {
      type: Boolean,
      default: false
    },
    defaultPaddingLeft: {
      type: Number,
      default: 25
    },
    selectMode: {
      type: String,
      default: null
    },
    questionIndex: {
      type: String,
      default: null
    },
    // 当前节点类型，用来判断下一级的节点类型，大纲节点-subject > 年级节点-grade > 知识点节点-knowledge
    currentItemType: {
      type: String,
      required: true
    },
    defaultGradeId: { // learning outcomes 专用默认的年级id
      type: String,
      default: null
    }
  },
  data () {
    return {
      subTreeExpandStatus: ExpandStatus.collapse,
      hasSubTree: false,
      subTreeParent: null,
      subTreeLoading: false,
      subItemType: null,
      NavigationType: NavigationType,

      SelectModel: SelectModel,
      selected21CenturyItem: null // 当前选中的21世纪层级项
    }
  },
  watch: {
    hasSubTreeWatch () {
      if (this.treeItemData) {
        if (this.currentItemType === 'subject' && this.treeItemData.children) {
          this.hasSubTree = true
        } else if (this.currentItemType === 'knowledge' && this.treeItemData.children) {
          this.hasSubTree = true
        } else if (this.currentItemType === 'grade') {
          this.hasSubTree = true
        } else if (this.currentItemType === 'sdg') {
          this.hasSubTree = true
        } else if (this.currentItemType === 'sdgKnowledge') {
          this.hasSubTree = true
        } else if (this.currentItemType === 'all21Century' && (this.treeItemData.children.length && this.treeItemData.children[0].children.length)) { // evaluation选择用
          this.hasSubTree = true
        } else {
          this.hasSubTree = false
        }
      } else {
        this.hasSubTree = false
      }
    }
  },
  created () {
    this.subTreeExpandStatus = this.treeItemData.expandStatus
    if (this.treeItemData && this.treeItemData.children) {
      this.hasSubTree = true
    }

    // grade 默认有下一级 knowledge
    if (this.currentItemType === 'grade') {
      this.hasSubTree = true
    }
    const currentTreeWithParent = Object.assign({}, this.treeItemData)
    currentTreeWithParent.parent = this.treeCurrentParent
    this.subTreeParent = currentTreeWithParent
  },
  mounted () {
    // 根据不同的列表类型判断下一层对应的数据类型（注意sync是同步数据只有一级，故没有下级。直接列表展示，所以这里忽略sync的处理）
    if (this.treeItemType === NavigationType.learningOutcomes) {
      if (this.currentItemType === 'subject') {
        if (this.treeItemData.children.length) {
          this.subItemType = 'subject'
        } else {
          this.subItemType = 'grade'
        }
      } else if (this.currentItemType === 'grade') {
        this.subItemType = 'knowledge'
      } else if (this.currentItemType === 'knowledge') {
        if (this.treeItemData.children.length) {
          this.subItemType = 'knowledge'
        }
      }
    } else if (this.treeItemType === NavigationType.specificSkills) {
      // Achievement objectives 是mainSubject-year-knowledge
      if (this.currentItemType === 'subject') {
        this.subItemType = 'grade'
      } else if (this.currentItemType === 'grade') {
        this.subItemType = 'knowledge'
      } else if (this.currentItemType === 'knowledge') {
        if (this.treeItemData.children.length) {
          this.subItemType = 'knowledge'
        }
      }
    } else if (this.treeItemType === NavigationType.centurySkills || this.treeItemType === NavigationType.NZKeyCompetencies || this.treeItemType === NavigationType.AUGeneralCapabilities) {
      // 21 century skills 是year-knowledge
      if (this.currentItemType === 'grade') {
        this.subItemType = 'knowledge'
      } else if (this.currentItemType === 'knowledge') {
        if (this.treeItemData.children.length) {
          this.subItemType = 'knowledge'
        }
      }
    } else if (this.treeItemType === NavigationType.sdg) {
      // sdg时 sdg列表-keywords-big idea
      if (this.currentItemType === 'sdg') {
        this.subItemType = 'sdgList'
      } else if (this.currentItemType === 'sdgList') {
        this.subItemType = 'sdgKeyword'
      } else if (this.currentItemType === 'sdgKeyword') {
        this.subItemType = 'sdgIdea'
      } else if (this.currentItemType === 'sdgIdea') {
        this.subItemType = 'sdgIdeaItem'
      }
    } else if (this.treeItemType === NavigationType.assessmentType) {
      // assessmentType 是mainSubject-year-assessmentLabel-knowledge
      if (this.currentItemType === 'subject') {
        this.subItemType = 'grade'
      } else if (this.currentItemType === 'grade') {
        this.subItemType = 'assessmentType'
      } else if (this.currentItemType === 'assessmentType') {
        if (this.treeItemData.children.length) {
          this.subItemType = 'knowledge'
        }
      }
    } else if (this.treeItemType === NavigationType.assessmentType) {
      if (this.treeItemData.children.length) {
        this.subItemType = 'all21Century'
      } else {
        this.subItemType = 'all21CenturyDescription'
      }
    } else if (this.treeItemType === NavigationType.idu) {
      if (this.currentItemType === 'grade') {
        this.subItemType = 'knowledge'
      }
    }
    LibraryEventBus.$on(LibraryEvent.ContentListItemClick, this.handleContentListItemClick)
    LibraryEventBus.$on(LibraryEvent.CenturySkillsSelect, this.handleCenturySkillsSelect)
    LibraryEventBus.$on(LibraryEvent.CancelCenturySkillsSelect, this.handleCancelCenturySkillsSelect)

    // 添加learning outcome自动选中grade
    if (this.currentItemType === 'grade') {
      if (this.defaultGradeId === this.treeItemData.id) {
        this.$logger.info('current', this.treeItemData, 'should be default grade')
        this.handleExpandTreeItem(this.treeItemData)
      }
    }
  },
  destroyed () {
    LibraryEventBus.$off(LibraryEvent.ContentListItemClick, this.handleContentListItemClick)
    LibraryEventBus.$off(LibraryEvent.CenturySkillsSelect, this.handleCenturySkillsSelect)
    LibraryEventBus.$off(LibraryEvent.CancelCenturySkillsSelect, this.handleCancelCenturySkillsSelect)
  },
  methods: {
    // 点击左侧菜单栏，同步右侧的列表以及展开当前下一级菜单。
    handleExpandTreeItem (treeItemData) {
      this.$logger.info('handleExpandTreeItem ' + (!this.subTreeExpandStatus))
      this.$logger.info('handleExpandTreeItem deep: ' + this.defaultDeep + ' treeItemType: ' + this.treeItemType + ' currentItemType ' + this.currentItemType + ' treeItemData', treeItemData, ' parent ', this.treeCurrentParent)
      if (this.treeItemType === NavigationType.learningOutcomes) {
        this.handleExpandCurriculumTreeItem(treeItemData)
      } else if (this.treeItemType === NavigationType.sync) {
        this.handleExpandSyncDataList(treeItemData)
      } else if (this.treeItemType === NavigationType.specificSkills) {
        this.handleExpandSpecificSkillTreeItem(treeItemData)
      } else if (this.treeItemType === NavigationType.centurySkills || this.treeItemType === NavigationType.NZKeyCompetencies || this.treeItemType === NavigationType.AUGeneralCapabilities) {
        this.handleExpandCenturySkillTreeItem(treeItemData)
      } else if (this.treeItemType === NavigationType.sdg) {
        this.handleExpandSdgTreeItem(treeItemData)
      } else if (this.treeItemType === NavigationType.assessmentType) {
        this.handleExpandAssessmentTypeTreeItem(treeItemData)
      } else if (this.treeItemType === NavigationType.all21Century) {
        this.handleExpandAll21CenturyTypeTreeItem(treeItemData)
      } else if (this.treeItemType === NavigationType.idu) {
        this.handleExpandIduTypeTreeItem(treeItemData)
      }

      // 针对任意层级的21centurySkill点击选择处理
      if ((this.currentItemType === 'knowledge' &&
          this.selectMode === SelectModel.evaluationMode) &&
        (this.rootType === NavigationType.centurySkills ||
          this.rootType === NavigationType.NZKeyCompetencies ||
          this.rootType === NavigationType.AUGeneralCapabilities)) {
        this.handle21CenturyClick(treeItemData)
      } else {
        this.handleCancel21CenturyClick()
      }
    },

    handleExpandSyncDataList (data) {
      this.$logger.info('handleExpandSyncDataList', data)
      LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
        deep: 0,
        dataType: this.treeItemType,
        currentTreeData: this.treeItemData,
        parentTreeData: this.treeCurrentParent,
        contentList: data.children,
        questionIndex: this.questionIndex
      })
      this.subTreeLoading = false
    },

    handleCollapseTreeItem (treeItemData) {
      this.$logger.info('handleExpandTreeItem ' + (!this.subTreeExpandStatus))
      this.subTreeExpandStatus = false
    },

    handleExpandCurriculumTreeItem (treeItemData) {
      this.$logger.info('handleExpandCurriculumTreeItem[' + this.currentItemType + '] data ', treeItemData, ' children ', treeItemData.children, ' deep ' + this.defaultDeep)

      if (this.defaultDeep === 0) {
        this.subTreeExpandStatus = true
        LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
          deep: this.defaultDeep,
          dataType: this.treeItemType,
          currentTreeData: this.treeItemData,
          parentTreeData: this.treeCurrentParent,
          contentList: treeItemData.children,
          questionIndex: this.questionIndex
        })
      } else {
        // 选择大纲判断是否已经到底了
        if (this.currentItemType === 'subject') {
          if (treeItemData.children === undefined || !treeItemData.children.length) {
            this.subTreeLoading = true
            if (!treeItemData.gradeList.length) {
              treeItemData.gradeList = []
              this.gradeList.forEach(item => {
                item.children = []
                item.isGrade = true
                treeItemData.gradeList.push(Object.assign({}, item))
                treeItemData.children.push(Object.assign({}, item))
              })
              this.$logger.info('add gradeList ', treeItemData)
            } else {
              this.$logger.info('use old gradeList ', treeItemData)
            }

            // 查看是否表单已经设置默认选中年级
            this.$logger.info('check default grade ', this.defaultGradeId)
            const gradeItem = this.gradeList.find(item => item.id === this.defaultGradeId)
            this.$logger.info('auto select learning outcomes grade', gradeItem)

            LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
              deep: this.defaultDeep,
              dataType: this.treeItemType,
              currentTreeData: this.treeItemData,
              parentTreeData: this.treeCurrentParent,
              contentList: treeItemData.gradeList,
              gradeList: treeItemData.gradeList,
              questionIndex: this.questionIndex,
              autoSelectGrade: gradeItem // 自动选择的年级
            })
            // subject的children为空，说明到底了。下一层就是grade
            this.subItemType = 'grade'
          } else {
            LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
              deep: this.defaultDeep,
              dataType: this.treeItemType,
              currentTreeData: this.treeItemData,
              parentTreeData: this.treeCurrentParent,
              contentList: treeItemData.children,
              questionIndex: this.questionIndex
            })
            this.subItemType = 'subject'
          }
          this.subTreeLoading = false
          this.subTreeExpandStatus = true
          this.$logger.info('gradeList already add', treeItemData)
        }

        // 判断年级判断是否已经有知识点了
        if (this.currentItemType === 'grade') {
          if (!treeItemData.children.length) {
            this.subTreeLoading = true
            const gradeId = treeItemData.id
            const subjectId = this.treeCurrentParent.id
            this.$logger.info('knowledgeTree gradeId ' + gradeId + ' subjectId ' + subjectId)
            // 通知外部表单更新gradeId
            LibraryEventBus.$emit(LibraryEvent.GradeUpdate, JSON.parse(JSON.stringify(this.treeItemData)))

            KnowledgeGetTree({
              gradeId,
              subjectId
            }).then((response) => {
              this.$logger.info('KnowledgeGetTree response', response)
              response.result.forEach(rItem => {
                rItem.gradeId = this.treeItemData.name
              }) // 把年级带上，evaluation 选择description时用到)
              treeItemData.children = response.result
              LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
                deep: this.defaultDeep,
                dataType: this.treeItemType,
                currentTreeData: this.treeItemData,
                parentTreeData: this.treeCurrentParent,
                contentList: treeItemData.children,
                questionIndex: this.questionIndex
              })
              this.$logger.info('mainKnowledgeList', treeItemData.children)
            }).finally(() => {
              this.subTreeLoading = false
              this.subTreeExpandStatus = true
            })
            // grade下一层knowledge
            this.subItemType = 'knowledge'
          } else {
            LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
              deep: this.defaultDeep,
              dataType: this.treeItemType,
              currentTreeData: this.treeItemData,
              parentTreeData: this.treeCurrentParent,
              contentList: treeItemData.children,
              questionIndex: this.questionIndex
            })
            this.subTreeLoading = false
            this.subTreeExpandStatus = true
          }
        }

        // 加载知识点关联数据
        if (this.currentItemType === 'knowledge') {
          this.$logger.info('selectMode', this.selectMode)

          // knowledge导航栏不展示description，右侧列表展示，故下下级为空到底
          if (treeItemData.children.length && treeItemData.children[0].children.length) {
            this.$logger.info('select reach knowledge bottom')
            this.subTreeLoading = true
            KnowledgeQueryContentByDescriptionId({ descriptionId: this.treeItemData.id }).then(response => {
              this.$logger.info('KnowledgeQueryContentByDescriptionId response', response.result)
              LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
                currentTreeData: this.treeItemData,
                dataType: this.treeItemType,
                parentTreeData: this.treeCurrentParent,
                contentList: response.result,
                questionIndex: this.questionIndex
              })
            }).finally(() => {
              this.subTreeLoading = false
              this.subTreeExpandStatus = true
            })
          } else {
            if (treeItemData.gradeId) {
              treeItemData.children.forEach(rItem => {
                rItem.gradeId = treeItemData.gradeId
              })
            }
            LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
              deep: this.defaultDeep,
              dataType: this.treeItemType,
              currentTreeData: this.treeItemData,
              parentTreeData: this.treeCurrentParent,
              contentList: treeItemData.children,
              questionIndex: this.questionIndex
            })
            // 非最后一层的knowledge 列表
            this.subTreeExpandStatus = true

            // knowledge 最后一级别，所有的下面都是knowledge
            this.subItemType = 'knowledge'
          }
        }
      }
      this.$logger.info('handleExpandCurriculumTreeItem handle finish!')
    },

    // Achievement objectives 是mainSubject-year-knowledge
    handleExpandSpecificSkillTreeItem (treeItemData) {
      this.$logger.info('handleExpandSpecificSkillTreeItem data ', treeItemData, ' children ', treeItemData.children, ' deep ' + this.defaultDeep)
      if (this.defaultDeep === 0) {
        // 直接展开第一层mainSubject
        this.subTreeExpandStatus = true
        LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
          deep: this.defaultDeep,
          dataType: this.treeItemType,
          currentTreeData: this.treeItemData,
          parentTreeData: this.treeCurrentParent,
          contentList: treeItemData.children,
          questionIndex: this.questionIndex
        })
        this.subItemType = 'subject'
        this.subTreeLoading = false
        this.hasSubTree = true
      } else {
        if (this.currentItemType === 'subject') {
          this.subTreeLoading = true
          this.subTreeExpandStatus = true
          if (!treeItemData.gradeList.length) {
            treeItemData.gradeList = []
            this.gradeList.forEach(item => {
              item.children = []
              item.isGrade = true
              treeItemData.children.push(Object.assign({}, item))
              treeItemData.gradeList.push(Object.assign({}, item))
            })
            this.$logger.info('add gradeList ', treeItemData)
          } else {
            this.$logger.info('use old gradeList ', treeItemData)
          }
          LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
            deep: this.defaultDeep,
            dataType: this.treeItemType,
            currentTreeData: this.treeItemData,
            parentTreeData: this.treeCurrentParent,
            gradeList: treeItemData.contentList,
            contentList: treeItemData.gradeList,
            questionIndex: this.questionIndex
          })
          this.subItemType = 'grade'
          this.hasSubTree = true
        }

        // 判断年级判断是否已经有知识点了
        if (this.currentItemType === 'grade') {
          if (!treeItemData.children.length) {
            this.subTreeLoading = true
            const gradeId = treeItemData.id
            const subjectId = this.treeCurrentParent.id
            console.log(treeItemData)
            this.$logger.info('knowledgeTree gradeId ' + gradeId + ' subjectId ' + subjectId)
            KnowledgeGetTree({
              gradeId,
              subjectId
            }).then((response) => {
              this.$logger.info('KnowledgeGetTree response', response)
              treeItemData.children = response.result
              LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
                deep: this.defaultDeep,
                dataType: this.treeItemType,
                currentTreeData: this.treeItemData,
                parentTreeData: this.treeCurrentParent,
                contentList: treeItemData.children,
                questionIndex: this.questionIndex
              })
              this.$logger.info('mainKnowledgeList', treeItemData.children)
            }).finally(() => {
              this.subTreeLoading = false
              this.subTreeExpandStatus = true
            })
            // grade下一层knowledge
            this.subItemType = 'knowledge'
          } else {
            LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
              deep: this.defaultDeep,
              dataType: this.treeItemType,
              currentTreeData: this.treeItemData,
              parentTreeData: this.treeCurrentParent,
              contentList: treeItemData.children,
              questionIndex: this.questionIndex
            })
            this.subTreeLoading = false
            this.subTreeExpandStatus = true
          }
        }

        // 加载知识点关联数据
        if (this.currentItemType === 'knowledge') {
          this.$logger.info('selectMode', this.selectMode)

          // knowledge导航栏不展示description，右侧列表展示，故下下级为空到底
          if (treeItemData.children === undefined || !treeItemData.children.length) {
            this.$logger.info('select reach knowledge bottom')
            this.subTreeLoading = true
            KnowledgeQueryContentByDescriptionId({ descriptionId: this.treeItemData.id }).then(response => {
              this.$logger.info('KnowledgeQueryContentByDescriptionId response', response.result)
              LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
                dataType: this.treeItemType,
                currentTreeData: this.treeItemData,
                parentTreeData: this.treeCurrentParent,
                contentList: response.result,
                questionIndex: this.questionIndex
              })
            }).finally(() => {
              this.subTreeLoading = false
              this.subTreeExpandStatus = true
            })
          } else {
            // 非最后一层的knowledge 列表
            this.subTreeExpandStatus = true
            LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
              deep: this.defaultDeep,
              dataType: this.treeItemType,
              currentTreeData: this.treeItemData,
              parentTreeData: this.treeCurrentParent,
              contentList: treeItemData.children,
              questionIndex: this.questionIndex
            })

            // knowledge 最后一级别，所有的下面都是knowledge
            this.subItemType = 'knowledge'
          }
        }

        this.subTreeLoading = false
      }
      this.$logger.info('handleExpandCurriculumTreeItem handle finish!')
    },
    // Achievement objectives 是mainSubject-year-assessmentType-knowledge
    handleExpandAssessmentTypeTreeItem (treeItemData) {
      this.$logger.info('handleExpandAssessmentTypeTreeItem data ', treeItemData, ' children ', treeItemData.children, ' deep ' + this.defaultDeep)
      if (this.defaultDeep === 0) {
        // 直接展开第一层mainSubject
        this.subTreeExpandStatus = true
        LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
          deep: this.defaultDeep,
          dataType: this.treeItemType,
          currentTreeData: this.treeItemData,
          parentTreeData: this.treeCurrentParent,
          contentList: treeItemData.children,
          questionIndex: this.questionIndex
        })
        this.subItemType = 'subject'
        this.subTreeLoading = false
        this.hasSubTree = true
      } else {
        if (this.currentItemType === 'subject') {
          this.subTreeLoading = true
          this.subTreeExpandStatus = true
          if (!treeItemData.gradeList.length) {
            treeItemData.gradeList = []
            this.gradeList.forEach(item => {
              item.children = []
              item.isGrade = true
              treeItemData.children.push(Object.assign({}, item))
              treeItemData.gradeList.push(Object.assign({}, item))
            })
            this.$logger.info('add gradeList ', treeItemData)
          } else {
            this.$logger.info('use old gradeList ', treeItemData)
          }
          LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
            deep: this.defaultDeep,
            dataType: this.treeItemType,
            currentTreeData: this.treeItemData,
            parentTreeData: this.treeCurrentParent,
            gradeList: treeItemData.contentList,
            contentList: treeItemData.gradeList,
            questionIndex: this.questionIndex
          })
          this.subItemType = 'grade'
          this.hasSubTree = true
        }

        // 判断年级判断是否已经有assessmentType了
        if (this.currentItemType === 'grade') {
          this.$logger.info('assessmentType grade')
          if (!treeItemData.children.length) {
            this.subTreeLoading = true
            const gradeId = treeItemData.id
            const subjectId = this.treeCurrentParent.id
            this.$logger.info('assessmentType gradeId ' + gradeId + ' subjectId ' + subjectId)
            GetAssessmentTypeList({
              gradeId,
              subjectId
            }).then((response) => {
              this.$logger.info('assessmentType response', response)
              response.result.forEach(item => {
                item.children = []
                item.isAssessmentType = true
              })
              this.$logger.info('assessmentType response.result', response.result)
              treeItemData.children = response.result
              LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
                deep: this.defaultDeep,
                dataType: this.treeItemType,
                currentTreeData: this.treeItemData,
                parentTreeData: this.treeCurrentParent,
                contentList: treeItemData.children,
                questionIndex: this.questionIndex
              })
              this.$logger.info('assessmentType children', treeItemData.children)
            }).finally(() => {
              this.subTreeLoading = false
              this.subTreeExpandStatus = true
            })
          } else {
            LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
              deep: this.defaultDeep,
              dataType: this.treeItemType,
              currentTreeData: this.treeItemData,
              parentTreeData: this.treeCurrentParent,
              contentList: treeItemData.children,
              questionIndex: this.questionIndex
            })
            this.subTreeLoading = false
            this.subTreeExpandStatus = true
          }
          // grade下一层assessmentType
          this.subItemType = 'assessmentType'
        }

        // 加载assessmentType的列表
        if (this.currentItemType === 'assessmentType') {
          this.$logger.info('assessmentType QueryKnowledgesByAssessmentTypeId', this.selectMode)

          if (treeItemData.children === undefined || !treeItemData.children.length) {
            this.$logger.info('assessmentType knowledge bottom')
            this.subTreeLoading = true
            const gradeId = this.treeCurrentParent.id
            QueryKnowledgesByAssessmentTypeId({
              assessmentTypeId: this.treeItemData.id,
              gradeId: gradeId
            }).then(response => {
              this.$logger.info('QueryKnowledgesByAssessmentTypeId response', response.result)
              response.result.forEach(item => {
                item.children = []
                item.isKnowledge = true
              })
              LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
                dataType: this.treeItemType,
                currentTreeData: this.treeItemData,
                parentTreeData: this.treeCurrentParent,
                contentList: response.result,
                questionIndex: this.questionIndex
              })
            }).finally(() => {
              this.subTreeLoading = false
              this.subTreeExpandStatus = true
            })
          } else {
            this.subTreeExpandStatus = true
            LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
              deep: this.defaultDeep,
              dataType: this.treeItemType,
              currentTreeData: this.treeItemData,
              parentTreeData: this.treeCurrentParent,
              contentList: treeItemData.children,
              questionIndex: this.questionIndex
            })
          }
          // assessmentType下面都是knowledge
          this.subItemType = 'knowledge'
        }

        if (this.currentItemType === 'knowledge') {
          this.$logger.info('assessmentType currentItemType knowledge', treeItemData)
        }

        this.subTreeLoading = false
      }
      this.$logger.info('handleExpandCurriculumTreeItem handle finish!')
    },

    // All21Century直接遍历children
    handleExpandAll21CenturyTypeTreeItem (treeItemData) {
      if (this.defaultDeep === 0) {
        // 直接展开第一层
        this.subTreeExpandStatus = true
        LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
          deep: this.defaultDeep,
          dataType: this.treeItemType,
          currentTreeData: this.treeItemData,
          parentTreeData: this.treeCurrentParent,
          contentList: treeItemData.children,
          questionIndex: this.questionIndex
        })
        this.subItemType = 'all21Century'
        this.subTreeLoading = false
        this.hasSubTree = true
      } else {
        this.subTreeLoading = true
        this.subTreeExpandStatus = true

        if (this.treeItemData.children.length && this.treeItemData.children[0].children.length) {
          this.subItemType = 'all21Century'
          this.hasSubTree = true
          LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
            deep: this.defaultDeep,
            dataType: this.treeItemType,
            currentTreeData: this.treeItemData,
            parentTreeData: this.treeCurrentParent,
            contentList: treeItemData.children,
            questionIndex: this.questionIndex
          })
        } else {
          this.subItemType = 'all21CenturyDescription'
          this.hasSubTree = true
          LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
            deep: this.defaultDeep,
            dataType: this.treeItemType,
            currentTreeData: this.treeItemData,
            parentTreeData: this.treeCurrentParent,
            contentList: treeItemData.children,
            questionIndex: this.questionIndex
          })
          this.$logger.info('reach description', treeItemData)
        }
        this.subTreeLoading = false
      }
    },

    // All21Century直接遍历children
    handleExpandIduTypeTreeItem (treeItemData) {
      this.$logger.info('handleExpandIduTypeTreeItem defaultDeep = ' + this.defaultDeep, treeItemData)
      if (this.defaultDeep === 0) {
        // 直接展开第一层
        this.subTreeExpandStatus = true
        LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
          deep: this.defaultDeep,
          dataType: this.treeItemType,
          currentTreeData: this.treeItemData,
          parentTreeData: this.treeCurrentParent,
          contentList: treeItemData.children,
          questionIndex: this.questionIndex
        })
        this.subItemType = 'grade'
        this.subTreeLoading = false
        this.hasSubTree = true
      } else {
        this.subTreeLoading = true
        this.subTreeExpandStatus = true

        if (this.treeItemData.children.length) {
          this.subItemType = 'iduList'
          this.hasSubTree = true
          LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
            deep: this.defaultDeep,
            dataType: this.treeItemType,
            currentTreeData: this.treeItemData,
            parentTreeData: this.treeCurrentParent,
            contentList: treeItemData.children,
            questionIndex: this.questionIndex
          })
        } else {
          if (treeItemData.children.length) {
            this.subItemType = 'iduList'
            this.hasSubTree = true
            LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
              deep: this.defaultDeep,
              dataType: this.treeItemType,
              currentTreeData: this.treeItemData,
              parentTreeData: this.treeCurrentParent,
              contentList: treeItemData.children,
              questionIndex: this.questionIndex
            })
          } else {
            const gradeId = treeItemData.id
            GetIBIduList({
              gradeId
            }).then(response => {
              this.$logger.info('GetIBIduList response', response)
              if (response.result) {
                treeItemData.children = response.result
                LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
                  deep: this.defaultDeep,
                  dataType: this.treeItemType,
                  currentTreeData: this.treeItemData,
                  parentTreeData: this.treeCurrentParent,
                  contentList: treeItemData.children,
                  questionIndex: this.questionIndex
                })
                this.$logger.info('GetIBIduList', treeItemData.children)
                this.subTreeExpandStatus = true
              } else {
                this.subTreeExpandStatus = false
              }
            }).finally(() => {
              this.subTreeLoading = false
              this.subItemType = 'iduList'
            })
          }
        }
        this.subTreeLoading = false
      }
    },

    // 21 century skills 是year-knowledge
    handleExpandCenturySkillTreeItem (treeItemData) {
      this.subItemType = 'knowledge'
      this.$logger.info('handleExpandCenturySkillTreeItem data ', treeItemData, ' children ', treeItemData.children, ' deep ' + this.defaultDeep)
      if (this.defaultDeep === 0) {
        // 直接展开第一层gradeList
        this.subTreeExpandStatus = true
        LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
          deep: this.defaultDeep,
          dataType: this.treeItemType,
          currentTreeData: this.treeItemData,
          parentTreeData: this.treeCurrentParent,
          gradeList: treeItemData.gradeList,
          contentList: treeItemData.gradeList,
          questionIndex: this.questionIndex
        })
        this.subItemType = 'grade'
        this.subTreeLoading = false
        this.hasSubTree = true
      } else {
        // 判断年级判断是否已经有知识点了
        if (this.currentItemType === 'grade') {
          if (!treeItemData.children.length) {
            this.subTreeLoading = true
            const gradeId = treeItemData.id
            const subjectId = this.treeCurrentParent.id
            this.$logger.info('knowledgeTree gradeId ' + gradeId + ' subjectId ' + subjectId)

            Get21Century({
              gradeId,
              curriculumId: this.$store.getters.bindCurriculum
            }).then((response) => {
              this.$logger.info('Get21Century response', response)
              if (response.result) {
                treeItemData.children = response.result
                LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
                  deep: this.defaultDeep,
                  dataType: this.treeItemType,
                  currentTreeData: this.treeItemData,
                  parentTreeData: this.treeCurrentParent,
                  contentList: treeItemData.children,
                  questionIndex: this.questionIndex
                })
                this.$logger.info('mainKnowledgeList', treeItemData.children)
                this.subTreeExpandStatus = true
              } else {
                this.subTreeExpandStatus = false
              }
            }).finally(() => {
              this.subTreeLoading = false
            })
            // grade下一层knowledge
            this.subItemType = 'knowledge'
          } else {
            LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
              deep: this.defaultDeep,
              dataType: this.treeItemType,
              currentTreeData: this.treeItemData,
              parentTreeData: this.treeCurrentParent,
              contentList: treeItemData.children,
              questionIndex: this.questionIndex
            })
            this.subTreeLoading = false
            this.subTreeExpandStatus = true
          }
        }

        // 加载知识点关联数据
        if (this.currentItemType === 'knowledge') {
          this.$logger.info('selectMode', this.selectMode)

          // knowledge导航栏不展示description，右侧列表展示，故下下级为空到底
          if (treeItemData.children === undefined || !treeItemData.children.length) {
            this.$logger.info('select reach knowledge bottom')
            this.subTreeLoading = true
            KnowledgeQueryContentByDescriptionId({ descriptionId: this.treeItemData.id }).then(response => {
              this.$logger.info('KnowledgeQueryContentByDescriptionId response', response.result)
              LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
                dataType: this.treeItemType,
                currentTreeData: this.treeItemData,
                parentTreeData: this.treeCurrentParent,
                contentList: response.result,
                questionIndex: this.questionIndex
              })
            }).finally(() => {
              this.subTreeLoading = false
              this.subTreeExpandStatus = true
            })
          } else {
            // 非最后一层的knowledge 列表
            this.subTreeExpandStatus = true
            LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
              dataType: this.treeItemType,
              deep: this.defaultDeep,
              currentTreeData: this.treeItemData,
              parentTreeData: this.treeCurrentParent,
              contentList: treeItemData.children,
              questionIndex: this.questionIndex
            })

            // knowledge 最后一级别，所有的下面都是knowledge
            this.subItemType = 'knowledge'
          }
        }

        this.subTreeLoading = false
      }
      this.$logger.info('handleExpandCurriculumTreeItem handle finish!')
    },

    handleExpandSdgTreeItem (treeItemData) {
      this.$logger.info('handleExpandSdgTreeItem data ', treeItemData, ' currentItemType ', this.currentItemType, ' children ', treeItemData.children, ' deep ' + this.defaultDeep)
      if (this.defaultDeep === 0) {
        LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
          deep: this.defaultDeep,
          dataType: this.treeItemType,
          currentTreeData: this.treeItemData,
          parentTreeData: this.treeCurrentParent,
          contentList: treeItemData.children,
          questionIndex: this.questionIndex
        })
        this.subTreeExpandStatus = true
      }

      if (this.currentItemType === 'sdgList') {
        this.$logger.info('init sdg keywords big idea list', treeItemData)
        if (!treeItemData.children.length) {
          this.subTreeLoading = true
          ScenarioGetKeywordScenarios({ sdgId: treeItemData.id }).then(response => {
            this.$logger.info('init sdg keywords ScenarioGetKeywordScenarios response', response.result)
            if (response.result) {
              const children = []
              response.result.sdgKeyWords.forEach(sdgKeyword => {
                children.push({
                  id: sdgKeyword.id,
                  name: sdgKeyword.name,
                  children: []
                })
              })
              treeItemData.children = children
              this.$logger.info('init sdg keywords list', treeItemData.children)
              LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
                deep: this.defaultDeep,
                dataType: this.treeItemType,
                currentTreeData: this.treeItemData,
                parentTreeData: this.treeCurrentParent,
                contentList: treeItemData.children,
                questionIndex: this.questionIndex
              })
              this.subTreeExpandStatus = true
            } else {
              this.subTreeExpandStatus = false
            }
          }).finally(() => {
            this.subTreeLoading = false
          })
        } else {
          LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
            deep: this.defaultDeep,
            dataType: this.treeItemType,
            currentTreeData: this.treeItemData,
            parentTreeData: this.treeCurrentParent,
            contentList: treeItemData.children,
            questionIndex: this.questionIndex
          })
          this.subTreeLoading = false
          this.subTreeExpandStatus = true
        }
      }

      if (this.currentItemType === 'sdgKeyword') {
        this.$logger.info('init sdg big idea treeItemData', treeItemData)
        if (!treeItemData.children.length) {
          this.$logger.info('init sdg big idea list', treeItemData)
          this.subTreeLoading = true
          // sdg keyword name list
          QueryBigIdea({ keywords: treeItemData.name }).then(response => {
            this.$logger.info('QueryBigIdea response', response.result)
            const children = []
            response.result.forEach(bigIdea => {
              children.push({
                id: bigIdea,
                name: bigIdea,
                isBigIdea: true, // 标识是否是bigIdea
                children: []
              })
            })
            treeItemData.children = children
            this.$logger.info('sdg bigIdea list', treeItemData.children)
            LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
              deep: this.defaultDeep,
              dataType: this.treeItemType,
              currentTreeData: this.treeItemData,
              parentTreeData: this.treeCurrentParent,
              contentList: treeItemData.children,
              questionIndex: this.questionIndex
            })

            // big idea由于是异步加载的
          }).finally(() => {
            this.subTreeLoading = false
            this.subTreeExpandStatus = true
          })
        } else {
          this.$logger.info('sdg children has data', treeItemData)
          LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
            deep: this.defaultDeep,
            dataType: this.treeItemType,
            currentTreeData: this.treeItemData,
            parentTreeData: this.treeCurrentParent,
            contentList: treeItemData.children,
            questionIndex: this.questionIndex
          })
          this.subTreeLoading = false
          this.subTreeExpandStatus = true
        }
      } else {
        LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
          deep: this.defaultDeep,
          dataType: this.treeItemType,
          currentTreeData: this.treeItemData,
          parentTreeData: this.treeCurrentParent,
          contentList: treeItemData.children,
          questionIndex: this.questionIndex
        })
        this.subTreeExpandStatus = true
      }
    },

    handleContentListItemClick (data) {
      if (
        data.dataType === this.treeItemType &&
        data.eventType === 'syncDir' &&
        data.item.id === this.treeItemData.id &&
        data.item.name === this.treeItemData.name &&
        // 通过id和name无法唯一定位到指定的条目，因为多个subject下面的grade的id和name都相同，所以加一层父级的条目的名称一致性判断
        (!data.parent || this.treeCurrentParent && this.treeCurrentParent.name === data.parent.name)) {
        // 同步导航栏和内容列表
        this.$logger.info('handleContentListItemClick start ', data, this.treeItemData, this.treeCurrentParent)
        this.handleExpandTreeItem(this.treeItemData)
      }
    },

    handleCenturySkillsSelect (data) {
      this.$logger.info('handleCenturySkillsSelect', data)
      this.selected21CenturyItem = data
    },

<<<<<<< HEAD
    handleCancelCenturySkillsSelect() {
      this.selected21CenturyItem = null
    },

    handle21CenturyClick(data) {
=======
    handle21CenturyClick (data) {
>>>>>>> 3263ace3b8375f2a98fa234c0c6158d616360647
      this.$logger.info('handle21CenturyClick start ', data)
      if (this.selected21CenturyItem === data) {
        LibraryEventBus.$emit(LibraryEvent.CancelCenturySkillsSelect) // 再次点击取消选中
      } else {
        this.$logger.info('emit ' + LibraryEvent.CenturySkillsSelect, data)
        LibraryEventBus.$emit(LibraryEvent.CenturySkillsSelect, data)
      }
    },

    handleCancel21CenturyClick() {
      this.$logger.info('handleCancel21CenturyClick')
      LibraryEventBus.$emit(LibraryEvent.CancelCenturySkillsSelect)
    }
  }
}
</script>

<style lang='less' scoped>

@import "~@/components/index.less";

.even-line {
  //background-color: #ffffff;
}

.odd-line {
  //background-color: #F8F8F8;
}

.active-line {
  background-color: #EBEEFD;
  color: @primary-color;
}

.tree-item {
  display: block;
  text-align: left;
  cursor: pointer;
  user-select: none;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  .item-wrapper {
    height: 35px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;

    &:hover {
      //background-color: fade(@primary-color, 10%);
    }

    .subtree-icon-wrapper {
      .subtree-icon-item {
        display: flex;
        flex-direction: row;
        align-items: center;

        .subtree-icon {
          color: #82c0d8;
          font-size: 15px;
          font-weight: 600;
        }
      }
    }

    .type-icon-wrapper {
      padding: 0 10px 0 5px;
      display: flex;
      flex-direction: row;
      align-items: center;

      .file-dir-icon {
        color: #82c0d8;
        font-size: 18px;
      }
    }

    .display-label-wrapper {
      flex: 1;
      overflow: hidden;
      padding-left: 2px;
      align-items: center;
      height: 25px;
      line-height: 25px;
      white-space: nowrap;
      text-overflow: ellipsis;
      position: relative;

      .display-label {
        font-weight: 500;
        line-height: 18px;
        padding-right: 40px;
        padding-left: 3px;
      }

      img {
        width: 17px;
        position: absolute;
        right: 5px;
        top: 4px;
      }
    }
  }
}

.selected-display-label {
  border: 1px solid #07AB84;
  border-radius: 2px;
  background: #e9f9f5;
  box-shadow: 0 0 0 2px rgba(21, 195, 154, .5);
}
</style>
