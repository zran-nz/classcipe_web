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
        <a-icon type="folder-open" theme="filled" class="file-dir-icon" v-if="subTreeExpandStatus"/>
        <a-icon type="folder" theme="filled" class="file-dir-icon" v-if="!subTreeExpandStatus" />
      </div>
      <div class="display-label-wrapper" @click="handleExpandTreeItem(treeItemData)">
        <span class="display-label">{{ treeItemData.name }}</span>
      </div>
    </div>
    <div class="sub-tree" v-show="subTreeExpandStatus && hasSubTree" >
      <skill-tree-item
        :grade-list="gradeList"
        :tree-current-parent="subTreeParent"
        :tree-item-data="treeItem"
        :select-mode="selectMode"
        :question-index="questionIndex"
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

import { SkillLibraryEventBus, SkillLibraryEvent } from '@/components/SkillLibrary/SkillLibraryEventBus'

const { SkillGetTreeByGradeId } = require('@/api/skill')

const { SkillSelectModel } = require('@/components/SkillLibrary/SkillSelectModel')

const { SkillQueryTagsBySkillId } = require('@/api/skill')

const ExpandStatus = {
  collapse: false,
  open: true
}
export default {
  name: 'SkillTreeItem',
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
    SkillLibraryEventBus.$on(SkillLibraryEvent.SkillContentListItemClick, this.handleSkillContentListItemClick)
  },
  destroyed () {
    SkillLibraryEventBus.$off(SkillLibraryEvent.SkillContentListItemClick, this.handleSkillContentListItemClick)
  },
  methods: {
    handleExpandTreeItem (treeItemData) {
      this.$logger.info('handleExpandTreeItem ' + (!this.subTreeExpandStatus))
      this.$logger.info('handleExpandTreeItem deep: ' + this.defaultDeep + ' type: ' + this.treeItemType + ' treeItemData', treeItemData, ' parent ', this.treeCurrentParent)
      this.handleExpandSkillTreeItem(treeItemData)
    },

    handleCollapseTreeItem (treeItemData) {
      this.$logger.info('handleExpandTreeItem ' + (!this.subTreeExpandStatus))
      this.subTreeExpandStatus = false
    },

    handleExpandSkillTreeItem (treeItemData) {
      this.$logger.info('handleExpandSkillTreeItem data ', treeItemData, ' children ', treeItemData.children, ' deep ' + this.defaultDeep)

      if (this.defaultDeep === 0 || this.defaultDeep === 2 || this.defaultDeep === 3) {
        this.subTreeExpandStatus = true
        SkillLibraryEventBus.$emit(SkillLibraryEvent.SkillContentListUpdate, {
          deep: this.defaultDeep,
          currentTreeData: this.treeItemData,
          parentTreeData: this.treeCurrentParent,
          contentList: treeItemData.children,
          questionIndex: this.questionIndex
        })
      } else {
        // 加载等级对应的技能点关联数据
        if (this.defaultDeep === 1) {
          this.$logger.info('try SkillGetTreeByGradeId ' + treeItemData.id + ' ' + treeItemData.name, treeItemData)
          this.subTreeLoading = true
          SkillGetTreeByGradeId({
            gradeId: treeItemData.id
          }).then(response => {
            this.$logger.info('SkillQueryTagsBySkillId response', response.result)
            treeItemData.children = [...response.result]
            SkillLibraryEventBus.$emit(SkillLibraryEvent.SkillContentListUpdate, {
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

        // 加载对应的技能点描述
        if (this.defaultDeep === 4) {
          this.$logger.info('selectMode', this.selectMode)

          if (this.selectMode !== SkillSelectModel.skillDescription) {
            this.subTreeLoading = true
            SkillQueryTagsBySkillId({ skillId: this.treeItemData.id }).then(response => {
              this.$logger.info('SkillQueryTagsBySkillId response', response.result)
              SkillLibraryEventBus.$emit(SkillLibraryEvent.SkillContentListUpdate, {
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
            const gradeObj = this.treeCurrentParent.parent.parent
            const mainSkillObj = this.treeCurrentParent.parent
            const subSkillObj = this.treeCurrentParent
            const descriptionObj = this.treeItemData
            this.$logger.info('mainSkillObj', mainSkillObj, 'subSkillObj', subSkillObj, 'descriptionObj', descriptionObj)
            SkillLibraryEventBus.$emit(SkillLibraryEvent.SkillContentListSelectClick, {
              curriculumId: this.$store.getters.bindCurriculum,
              description: descriptionObj.name,
              descriptionId: descriptionObj.id,
              gradeId: gradeObj.id,
              mainSkillId: mainSkillObj.id,
              mainSkillName: mainSkillObj.name,
              subSkillId: subSkillObj.id,
              subSkillName: subSkillObj.name,
              questionIndex: this.questionIndex
            })
          }
        }
      }
    },

    handleSkillContentListItemClick (data) {
      if (
        data.item.id === this.treeItemData.id &&
        data.item.name === this.treeItemData.name &&
        (data.item.name)) {
        this.$logger.info('handleSkillContentListItemClick start ', data, this.treeItemData, this.treeCurrentParent)
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
