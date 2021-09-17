<template>
  <div class="tree-item" v-if="treeItemData" :data-deep="defaultDeep" :data-current-type="currentItemType">
    <div :class="{'item-wrapper': true , 'odd-line': odd, 'even-line': !odd}" :style="{paddingLeft: (defaultDeep * defaultPaddingLeft === 0 ? defaultPaddingLeft / 3 : defaultDeep * defaultPaddingLeft) + 'px'}">
      <div class="subtree-icon-wrapper">
        <div class="subtree-icon-item" v-if="hasSubTree">
          <template v-if="!subTreeExpandStatus">
            <a-icon type="right" class="subtree-icon" @click="handleExpandTreeItem(treeItemData)" v-if="!subTreeLoading"/>
            <a-spin size="small" v-if="subTreeLoading"/>
          </template>
          <template v-if="subTreeExpandStatus">
            <a-icon type="down" class="subtree-icon" @click="handleCollapseTreeItem(treeItemData)" v-if="!subTreeLoading"/>
            <a-spin size="small" v-if="subTreeLoading"/>
          </template>
        </div>
      </div>
      <div class="type-icon-wrapper" @click="handleExpandTreeItem(treeItemData)">
        <a-icon type="folder-open" theme="filled" class="file-dir-icon" v-if="subTreeExpandStatus"/>
        <a-icon type="folder" theme="filled" class="file-dir-icon" v-if="!subTreeExpandStatus" />
      </div>
      <div class="display-label-wrapper" @click="handleExpandTreeItem(treeItemData)">
        <span class="display-label">{{ treeItemData.name }}</span>
      </div>
    </div>
    <template v-if="subItemType">
      <div class="sub-tree" v-show="subTreeExpandStatus && hasSubTree" :data-sub-type="subItemType">
        <template v-if="subItemType !== 'grade'">
          <new-tree-item
            :grade-list="gradeList"
            :tree-current-parent="subTreeParent"
            :tree-item-data="treeItem"
            :current-item-type="subItemType"
            :select-mode="selectMode"
            :question-index="questionIndex"
            :tree-item-type="treeItemType"
            :default-deep="(defaultDeep + 1)"
            :default-expand-status="treeItem.expandStatus"
            v-for="(treeItem, index) in treeItemData.children"
            :odd="odd ? index % 2 === 1 : index % 2 === 0 "
            :key="index"/>
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
            :default-deep="(defaultDeep + 1)"
            :default-expand-status="treeItem.expandStatus"
            v-for="(treeItem, index) in gradeList"
            :odd="odd ? index % 2 === 1 : index % 2 === 0 "
            :key="index"/>
        </template>
      </div>
    </template>
  </div>
</template>

<script>

import { LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'

const { SelectModel } = require('@/components/NewLibrary/SelectModel')

const { LibraryEvent } = require('@/components/NewLibrary/LibraryEventBus')
const { KnowledgeQueryContentByDescriptionId } = require('@/api/knowledge')
const { KnowledgeGetTree } = require('@/api/knowledge')
const { NavigationType } = require('@/components/NewLibrary/NavigationType')
const { ScenarioQueryContentByScenarioId } = require('@/api/scenario')
const { ScenarioGetKeywordScenarios } = require('@/api/scenario')

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
    }
  },
  data () {
    return {
      subTreeExpandStatus: this.defaultDeep < 2 ? ExpandStatus.open : ExpandStatus.collapse,
      hasSubTree: false,
      subTreeParent: null,
      subTreeLoading: false,
      subItemType: null
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
        } else {
          this.hasSubTree = false
        }
      } else {
        this.hasSubTree = false
      }
    }
  },
  created () {
    this.expand = this.expandStatus
    if (this.treeItemData && (this.treeItemData.children || this.treeItemData.gradeList)) {
      this.hasSubTree = true
    }
    const currentTreeWithParent = Object.assign({}, this.treeItemData)
    currentTreeWithParent.parent = this.treeCurrentParent
    this.subTreeParent = currentTreeWithParent
  },
  mounted () {
    this.$logger.info('new tree item mounted! currentItemType: ' + this.currentItemType + ' subItemType:' + this.subItemType)
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
    this.$logger.info('after handle subItemType:' + this.subItemType)
    LibraryEventBus.$on(LibraryEvent.ContentListItemClick, this.handleContentListItemClick)
  },
  destroyed () {
    LibraryEventBus.$off(LibraryEvent.ContentListItemClick, this.handleContentListItemClick)
  },
  methods: {
    handleExpandTreeItem (treeItemData) {
      this.$logger.info('handleExpandTreeItem ' + (!this.subTreeExpandStatus))
      this.$logger.info('handleExpandTreeItem deep: ' + this.defaultDeep + ' type: ' + this.treeItemType + ' treeItemData', treeItemData, ' parent ', this.treeCurrentParent)
      if (this.treeItemType === NavigationType.curriculum) {
        this.handleExpandCurriculumTreeItem(treeItemData)
      } else if (this.treeItemType === NavigationType.sdg) {
        this.handleExpandSdgTreeItem(treeItemData)
      }
    },

    handleCollapseTreeItem (treeItemData) {
      this.$logger.info('handleExpandTreeItem ' + (!this.subTreeExpandStatus))
      this.subTreeExpandStatus = false
    },

    handleExpandSdgTreeItem (treeItemData) {
      this.$logger.info('handleExpandSdgTreeItem data ', treeItemData, ' children ', treeItemData.children, ' deep ' + this.defaultDeep)
      if (this.defaultDeep === 0) {
        this.subTreeExpandStatus = true
        LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
          deep: this.defaultDeep,
          currentTreeData: this.treeItemData,
          parentTreeData: this.treeCurrentParent,
          contentList: treeItemData.children,
          questionIndex: this.questionIndex
        })
      }

      if (this.defaultDeep === 1) {
        if (!treeItemData.children || !treeItemData.children.length) {
          this.subTreeLoading = true
          const sdgId = treeItemData.id
          this.$logger.info('ScenarioGetKeywordScenarios ' + sdgId)
          // sdg keyword name list
          ScenarioGetKeywordScenarios({ sdgId }).then(response => {
            this.$logger.info('ScenarioGetKeywordScenarios response', response.result)
            response.result.forEach(item => { item.children = [] })
            treeItemData.children = response.result

            LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
              deep: this.defaultDeep,
              currentTreeData: this.treeItemData,
              parentTreeData: this.treeCurrentParent,
              contentList: treeItemData.children,
              questionIndex: this.questionIndex
            })
          }).finally(() => {
            this.subTreeLoading = false
            this.subTreeExpandStatus = true
          })
        } else {
          LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
            deep: this.defaultDeep,
            currentTreeData: this.treeItemData,
            parentTreeData: this.treeCurrentParent,
            contentList: treeItemData.children,
            questionIndex: this.questionIndex
          })
          this.subTreeLoading = false
          this.subTreeExpandStatus = true
        }
      }

      if (this.defaultDeep === 2) {
        if (!treeItemData.children || !treeItemData.children.length) {
          const sdgKeyWords = treeItemData.sdgKeyWords
          sdgKeyWords.map(item => { item.children = []; item.name = item.description })
          treeItemData.children = sdgKeyWords
        }
        LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
          deep: this.defaultDeep,
          currentTreeData: this.treeItemData,
          parentTreeData: this.treeCurrentParent,
          contentList: treeItemData.children,
          questionIndex: this.questionIndex
        })
        this.subTreeLoading = false
        this.subTreeExpandStatus = true
      }

      if (this.defaultDeep === 3) {
        // 加载知识点关联数据
        this.$logger.info('ScenarioQueryContentByScenarioId ' + this.treeItemData.scenarioId)
        this.subTreeLoading = true
        ScenarioQueryContentByScenarioId({ scenarioId: this.treeItemData.scenarioId }).then(response => {
          this.$logger.info('ScenarioQueryContentByScenarioId response', response.result)
          LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
            currentTreeData: this.treeItemData,
            parentTreeData: this.treeCurrentParent,
            contentList: response.result,
            questionIndex: this.questionIndex
          })
        }).finally(() => {
          this.subTreeLoading = false
          this.subTreeExpandStatus = true
        })
      }
    },

    handleExpandCurriculumTreeItem (treeItemData) {
      this.$logger.info('handleExpandCurriculumTreeItem[' + this.currentItemType + '] data ', treeItemData, ' children ', treeItemData.children, ' deep ' + this.defaultDeep)

      if (this.defaultDeep === 0) {
        this.subTreeExpandStatus = true
        LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
          deep: this.defaultDeep,
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
            this.gradeList.forEach(item => { item.children = [] })
            treeItemData.gradeList = [...this.gradeList]
            this.$logger.info('add gradeList ', treeItemData)
            LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
              deep: this.defaultDeep,
              currentTreeData: this.treeItemData,
              parentTreeData: this.treeCurrentParent,
              contentList: treeItemData.gradeList,
              questionIndex: this.questionIndex
            })
            // subject的children为空，说明到底了。下一层就是grade
            this.subItemType = 'grade'
          } else {
            LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
              deep: this.defaultDeep,
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
            KnowledgeGetTree({
              gradeId,
              subjectId
            }).then((response) => {
              this.$logger.info('KnowledgeGetTree response', response)
              treeItemData.children = response.result
              LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
                deep: this.defaultDeep,
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

          if (treeItemData.children === undefined || !treeItemData.children.length) {
            this.$logger.info('select reach knowledge bottom')
            if (this.selectMode !== SelectModel.knowledgeDescription) {
              this.subTreeLoading = true
              KnowledgeQueryContentByDescriptionId({ descriptionId: this.treeItemData.id }).then(response => {
                this.$logger.info('KnowledgeQueryContentByDescriptionId response', response.result)
                LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
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
              this.$logger.info('select knowledge description treeItemData', this.treeItemData, this.treeCurrentParent)
              const subKnowledgeObj = this.treeItemData
              const mainKnowledgeObj = this.treeCurrentParent
              const mainSubjectObj = this.treeCurrentParent.parent.parent.parent
              const subSubjectObj = this.treeCurrentParent.parent.parent
              this.$logger.info('mainSubjectObj', mainSubjectObj, 'subSubjectObj', subSubjectObj, 'mainKnowledgeObj', mainKnowledgeObj, 'subKnowledgeObj', subKnowledgeObj)
              LibraryEventBus.$emit(LibraryEvent.ContentListSelectClick, {
                curriculumId: this.$store.getters.bindCurriculum,
                description: this.treeItemData.name,
                gradeId: this.treeItemData.gradeId,
                mainKnowledgeId: mainKnowledgeObj.id,
                mainSubjectId: mainSubjectObj.id,
                mainSubjectName: mainSubjectObj.name,
                subKnowledgeId: subKnowledgeObj.id,
                subSubjectId: subSubjectObj.id,
                subSubjectName: subSubjectObj.name,
                questionIndex: this.questionIndex
              })
            }
          } else {
            // 非最后一层的knowledge 列表
            this.subTreeExpandStatus = true
            LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
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
      }
      this.$logger.info('handleExpandCurriculumTreeItem handle finish!')
    },

    handleContentListItemClick (data) {
      if (
        data.item.id === this.treeItemData.id &&
        data.item.name === this.treeItemData.name &&
        (!data.parent || this.treeCurrentParent && this.treeCurrentParent.name === data.parent.name)) {
        this.$logger.info('handleContentListItemClick start ', data, this.treeItemData, this.treeCurrentParent)
        this.handleExpandTreeItem(this.treeItemData)
      }
    }
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";

.even-line {
  background-color: #ffffff;
}

.odd-line {
  background-color: #F8F8F8;
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
      background-color: fade(@primary-color, 10%);
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
      white-space: nowrap;
      text-overflow: ellipsis;
      .display-label {
        font-weight: 500;
        color: @text-color;
      }
    }
  }
  .sub-tree {

  }
}
</style>
