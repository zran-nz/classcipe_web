<template>
  <div :class="{'tree-item': true , 'odd-line': odd, 'even-line': !odd}" v-if="treeItemData">
    <div class="item-wrapper" @dblclick="toggleExpandStatus">
      <div class="subtree-icon-wrapper">
        <div class="subtree-icon-item" v-if="hasSubTree" @click="toggleExpandStatus">
          <template v-if="!subTreeExpandStatus">
            <a-icon type="right" class="subtree-icon"/>
          </template>
          <template v-if="subTreeExpandStatus">
            <a-icon type="down" class="subtree-icon"/>
          </template>
        </div>
      </div>
      <div class="type-icon-wrapper">
        <a-icon type="folder-open" theme="filled" class="file-dir-icon"/>
      </div>
      <div class="display-label-wrapper">
        <span class="display-label">{{ treeItemData.name }}</span>
      </div>
    </div>
    <div class="sub-tree" v-show="subTreeExpandStatus && hasSubTree">
      <new-tree-item
        :tree-item-data="treeItem"
        :default-deep="treeItem.deep"
        :default-expand-status="treeItem.expandStatus"
        v-for="(treeItem, index) in treeItemData.subTreeDataList"
        :odd="odd ? index % 2 === 1 : index % 2 === 0 "
        :key="index"/>
    </div>
  </div>
</template>

<script>

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
    treeItemData: {
      type: Object,
      default: null
    },
    odd: {
      type: Boolean,
      default: false
    }
  },
  components: {
  },
  data () {
    return {
      subTreeExpandStatus: ExpandStatus.collapse,
      hasSubTree: false
    }
  },
  watch: {
    hasSubTreeWatch () {
      if (this.treeItemData && this.treeItemData.subTreeDataList) {
       this.hasSubTree = true
      }
      this.hasSubTree = false
    }
  },
  created () {
    this.expand = this.expandStatus
    if (this.treeItemData && this.treeItemData.subTreeDataList) {
      this.hasSubTree = true
    }
  },
  mounted () {
  },
  methods: {
    toggleExpandStatus () {
      this.$logger.info('toggleExpandStatus ' + (!this.subTreeExpandStatus))
      this.subTreeExpandStatus = !this.subTreeExpandStatus
    }
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";

.even-line {
  background-color: #fafafa;
}

.odd-line {
  background-color: #fafafa;
}

.tree-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  user-select: none;
  .item-wrapper {
    height: 35px;
    display: flex;
    flex-direction: row;
    align-items: center;
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
