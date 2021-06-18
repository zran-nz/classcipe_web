<template>
  <div class="tree-item" v-if="treeItemData" :data-deep="defaultDeep">
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
        <a-icon type="folder-open" theme="filled" class="file-dir-icon"/>
      </div>
      <div class="display-label-wrapper" @click="handleExpandTreeItem(treeItemData)">
        <span class="display-label">{{ treeItemData.name }}</span>
      </div>
    </div>
    <div class="sub-tree" v-show="subTreeExpandStatus && hasSubTree" >
      <new-tree-item
        :grade-list="gradeList"
        :tree-current-parent="subTreeParent"
        :tree-item-data="treeItem"
        :tree-item-type="treeItemType"
        :default-deep="(defaultDeep + 1)"
        :default-expand-status="treeItem.expandStatus"
        v-for="(treeItem, index) in treeItemData.children"
        :odd="odd ? index % 2 === 1 : index % 2 === 0 "
        :key="index"/>
    </div>
  </div>
</template>

<script>

import { LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'

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
    }
  },
  components: {
  },
  data () {
    return {
      subTreeExpandStatus: ExpandStatus.collapse,
      hasSubTree: false,
      subTreeParent: null,
      subTreeLoading: false
    }
  },
  watch: {
    hasSubTreeWatch () {
      if (this.treeItemData && this.treeItemData.children) {
       this.hasSubTree = true
      }
      this.hasSubTree = false
    }
  },
  created () {
    this.expand = this.expandStatus
    if (this.treeItemData && this.treeItemData.children) {
      this.hasSubTree = true
    }
    const currentTreeWithParent = Object.assign({}, this.treeItemData)
    currentTreeWithParent.parent = this.treeCurrentParent
    this.subTreeParent = currentTreeWithParent
  },
  mounted () {
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
          contentList: treeItemData.children
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
              contentList: treeItemData.children
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
            contentList: treeItemData.children
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
          contentList: treeItemData.children
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
            contentList: response.result
          })
        }).finally(() => {
          this.subTreeLoading = false
          this.subTreeExpandStatus = true
        })
      }
    },

    handleExpandCurriculumTreeItem (treeItemData) {
      this.$logger.info('handleExpandCurriculumTreeItem data ', treeItemData, ' children ', treeItemData.children, ' deep ' + this.defaultDeep)

      if (this.defaultDeep === 0 || this.defaultDeep === 1 || this.defaultDeep === 4) {
        this.subTreeExpandStatus = true
        LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
          deep: this.defaultDeep,
          currentTreeData: this.treeItemData,
          parentTreeData: this.treeCurrentParent,
          contentList: treeItemData.children
        })
      } else {
        // 选择大纲判断是否已经有年级列表了
        if (this.defaultDeep === 2) {
          if (treeItemData.children === undefined || !treeItemData.children.length) {
            this.subTreeLoading = true
            this.gradeList.forEach(item => { item.children = [] })
            treeItemData.children = this.gradeList
            this.$logger.info('add gradeList ', treeItemData)
          }
          LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
            deep: this.defaultDeep,
            currentTreeData: this.treeItemData,
            parentTreeData: this.treeCurrentParent,
            contentList: treeItemData.children
          })
          this.subTreeLoading = false
          this.subTreeExpandStatus = true
          this.$logger.info('gradeList already add', treeItemData)
        }

        // 选择年级判断是否已经有知识点了
        if (this.defaultDeep === 3) {
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
                contentList: treeItemData.children
              })
              this.$logger.info('mainKnowledgeList', treeItemData.children)
            }).finally(() => {
              this.subTreeLoading = false
              this.subTreeExpandStatus = true
            })
          } else {
            LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
              deep: this.defaultDeep,
              currentTreeData: this.treeItemData,
              parentTreeData: this.treeCurrentParent,
              contentList: treeItemData.children
            })
            this.subTreeLoading = false
            this.subTreeExpandStatus = true
          }
        }

        // 加载知识点关联数据
        if (this.defaultDeep === 5) {
          this.subTreeLoading = true
          KnowledgeQueryContentByDescriptionId({ descriptionId: this.treeItemData.id }).then(response => {
            this.$logger.info('KnowledgeQueryContentByDescriptionId response', response.result)
            LibraryEventBus.$emit(LibraryEvent.ContentListUpdate, {
              currentTreeData: this.treeItemData,
              parentTreeData: this.treeCurrentParent,
              contentList: response.result
            })
          }).finally(() => {
            this.subTreeLoading = false
            this.subTreeExpandStatus = true
          })
        }
      }
    },

    handleContentListItemClick (data) {
      if (
        data.item.id === this.treeItemData.id &&
        (data.item.name === this.treeItemData.name || data.item.name === this.treeItemData.description) &&
        (this.treeCurrentParent && (this.treeCurrentParent.name === data.parent.name || this.treeCurrentParent.description === data.parent.name))) {
        this.$logger.info('handleContentListItemClick start ', data, this.treeItemData)
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
