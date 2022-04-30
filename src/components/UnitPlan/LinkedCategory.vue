<template>
  <a-modal
    v-model='visible'
    :closable='false'
    :footer='null'
    :maskClosable='false'
    destroyOnClose
    width='800px'>
    <modal-header @close='handleClose'/>
    <div class='category-list'>
      <div class='category-block' v-for='(category, cIdx) in categoryList' :key='category.id' :style="{'background-color': color[cIdx]}">
        <div class='category-item' v-for='item in category.list' :key='item' @click='handleAddItem(item)'>
          <div class='selected-icon'>
            <template v-if="selectedList.indexOf(item) !== -1">
              <img src="~@/assets/icons/lesson/selected.png" />
            </template>
            <template v-if="selectedList.indexOf(item) === -1">
              <div class="empty-circle"></div>
            </template>
          </div>
          <div class='item-name'>{{ item }}</div>
        </div>
      </div>
      <div class='category-block self-category' style='background-color: #15c2d811'>
        <div class='category-item' v-for='item in selfCategory' :key='item' @click="handleAddItem(item)">
          <div class='selected-icon'>
            <template v-if="selectedList.indexOf(item) !== -1">
              <img src="~@/assets/icons/lesson/selected.png" />
            </template>
            <template v-if="selectedList.indexOf(item) === -1">
              <div class="empty-circle"></div>
            </template>
          </div>
          <div class='item-name'>{{ item }}</div>
          <div class='self-item-delete' @click='handleDeleteSelfItem(item)'>
            <a-icon type="close" />
          </div>
        </div>
        <div class='category-item self-input' v-if='showNewCategory'>
          <a-input v-model='newCategory' ref='newCategory' class='new-category-input' @keyup.native.enter='handleAddNewSelfCategory'/>
        </div>
        <div class='category-item slef-category slef-category-btn'>
          <a-button type="dashed" shape='round' @click='handleShowNewCategory' style='width: 100%'>Add new</a-button>
        </div>
      </div>
    </div>
    <div class='modal-action-right'>
      <a-space>
        <a-button @click='handleClose'>Discard</a-button>
        <a-button type='primary' @click='handleConfirm'>Confirm</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script>
import ModalHeader from '@/components/Common/ModalHeader'
export default {
  name: 'LinkedCategory',
  components: { ModalHeader },
  props: {
    selected: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: true,
      color: [
        '#fa525211',
        '#12b88611',
        '#fab00511'
      ],
      categoryList: [
        {
          id: 1,
          list: ['science', 'math', 'english', 'social', 'health', 'art', 'music', 'other1']
        },
        {
          id: 2,
          list: ['acknowledge', 'learn', 'apply', 'practice', 'build', 'teach', 'other2']
        },
        {
          id: 3,
          list: ['self-awareness', 'self-expression', 'self-control', 'self-esteem', 'self-confidence', 'other3']
        }
      ],
      selfCategory: [],
      selectedList: [],
      selectedNameList: [],
      showNewCategory: false,
      newCategory: null
    }
  },
  created() {
    this.$logger.info('LinkedCategory')
    this.selectedList = this.selected
  },
  methods: {
    handleClose() {
      this.$logger.info('close', this.selectedList)
      this.$emit('close')
    },
    handleConfirm() {
      this.$logger.info('selectedList', this.selectedList)
      this.$emit('confirm', this.selectedList)
    },
    handleShowNewCategory () {
      this.newCategory = null
      this.showNewCategory = true
      this.$nextTick(() => {
        this.$refs.newCategory.focus()
      })
    },
    handleAddNewSelfCategory () {
      this.$logger.info('handleAddNewSelfCategory', this.newCategory)
      if (this.newCategory) {
        let isDuplicated = false
        for (let i = 0; i < this.selfCategory.length; i++) {
          if (this.selfCategory[i] === this.newCategory) {
            isDuplicated = true
            break
          }
        }

        for (let i = 0; i < this.categoryList.length; i++) {
          for (let j = 0; j < this.categoryList[i].list.length; j++) {
            if (this.categoryList[i].list[j] === this.newCategory) {
              isDuplicated = true
              break
            }
          }
        }

        if (!isDuplicated) {
          this.selfCategory.push(this.newCategory)
          this.showNewCategory = false
        } else {
          this.$message.warn('Duplicated category name')
        }
      }
      this.newCategory = null
    },

    // category下单选,先找出对于的分组，然后把当前分组下的所有数据都删除了，再添加或删除。
    handleAddItem (item) {
      this.$logger.info('handleAddItem', item)
      let groupIndex = -1
      for (let i = 0; i < this.categoryList.length; i++) {
        if (this.categoryList[i].list.indexOf(item) !== -1) {
          groupIndex = i
          break
        }
      }

      if (groupIndex !== -1) {
        this.categoryList[groupIndex].list.forEach(gItem => {
          if (this.selectedList.indexOf(gItem) !== -1) {
            this.selectedList.splice(this.selectedList.indexOf(gItem), 1)
          }
        })
      } else {
        if (this.selfCategory.indexOf(item) !== -1) {
          this.selfCategory.forEach(sItem => {
            if (this.selectedList.indexOf(sItem) !== -1) {
              this.selectedList.splice(this.selectedList.indexOf(sItem), 1)
            }
          })
        }
      }

      this.selectedList.push(item)
    },

    handleDeleteSelfItem (item) {
      this.$logger.info('handleDeleteSelfItem', item)
      if (this.selfCategory.indexOf(item) !== -1) {
        this.selfCategory.splice(this.selfCategory.indexOf(item), 1)
      }

      if (this.selectedList.indexOf(item) !== -1) {
        this.selectedList.splice(this.selectedList.indexOf(item), 1)
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.category-list {
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  height: 300px;

  .category-block {
    width: 23%;
    margin: 0 10px;
    border-radius: 4px;
    padding: 5px 10px 5px 8px;
    height: 100%;
    overflow-y: auto;

    .category-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      color: #333;
      margin: 5px 0;
      user-select: none;
      .selected-icon {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 24px;
        width: 24px;
        .empty-circle {
          margin-top: 3px;
          height: 15px;
          width: 15px;
          border-radius: 50%;
          border: 2px solid #ccc;
        }

        img {
          width: 17px;
          height: 17px;
        }
      }

      &:hover {
        .self-item-delete {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .self-input {
      margin-top: 10px;
    }

    .self-item-delete {
      font-size: 12px;
      padding-left: 4px;
      display: none;
    }

    .slef-category-btn {
      margin-top: 10px;
      width: 100%;
      justify-content: center;
    }

    .new-category-input {
      border-top: none;
      border-left: none;
      border-right: none;
      box-shadow: none;
    }
  }
}

</style>
