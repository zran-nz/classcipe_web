<template>
  <a-modal
    v-model='visible'
    :closable='false'
    :footer='null'
    :maskClosable='false'
    destroyOnClose
    width='760px'>
    <modal-header @close='handleClose' title='Create new category or choose from system tag(s) to set as category' :white='true'/>
    <div class='category-list'>
      <a-skeleton :loading='loading' />
      <template v-if='!loading'>
        <div class='category-block' v-for='(category, cIdx) in categoryList' :key='category.key' :style="{'background-color': color[cIdx]}">
          <div class='category-item' :class="{'selected-item': selectedList.indexOf(item) !== -1}" v-for='item in category.children' :key='item.key' @click='handleAddItem(item)'>
            <div class='selected-icon'>
              <div class='checked-icon'>
                <template v-if='cIdx % 3 === 0'>
                  <checked-green-icon />
                </template>
                <template v-if='cIdx % 3 === 1'>
                  <checked-yellow-icon />
                </template>
                <template v-if='cIdx % 3 === 2'>
                  <checked-blur-icon />
                </template>
              </div>
              <div class="empty-circle"></div>
            </div>
            <div class='item-name'>{{ item.title }}</div>
          </div>
        </div>
        <div class='category-block self-category' style='background-color: #F4F4F4'>
          <div class='category-item' :class="{'selected-item': selectedList.indexOf(item) !== -1}" v-for='item in selfCategory' :key='item.key' @click="handleAddItem(item)">
            <div class='selected-icon'>
              <div class='checked-icon'>
                <checked-green-icon />
              </div>
              <div class="empty-circle"></div>
            </div>
            <div class='item-name'>{{ item.title }}</div>
            <div class='self-item-delete' @click='handleDeleteSelfItem(item)'>
              <a-icon type="close" />
            </div>
          </div>
          <div class='category-item self-input' v-if='showNewCategory'>
            <a-input v-model='newCategory' ref='newCategory' class='new-category-input' @keyup.native.enter='handleAddNewSelfCategory'/>
          </div>
          <div class='category-item slef-category slef-category-btn'>
            <custom-text-button @click='handleShowNewCategory' label='Add new' :size='12'>
              <template v-slot:icon>
                <a-icon type="plus-circle" :style="{fontSize: '12px'}"/>
              </template>
            </custom-text-button>
          </div>
          <div class='no-self-category' v-if='selfCategory.length === 0'>
            <common-no-data />
          </div>
        </div>
      </template>
    </div>
    <div class='modal-action-center'>
      <a-space :size='30'>
        <a-button class='cc-round-button' @click='handleClose'>Discard</a-button>
        <a-button class='cc-round-button' type='primary' @click='handleConfirm'>Confirm</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script>
import ModalHeader from '@/components/Common/ModalHeader'
import CustomTextButton from '@/components/Common/CustomTextButton'
import CheckedGreenIcon from '@/assets/v2/icons/checked_green.svg?inline'
import CheckedBlurIcon from '@/assets/v2/icons/checked_blue.svg?inline'
import CheckedYellowIcon from '@/assets/v2/icons/checked_yellow.svg?inline'
import CommonNoData from '@/components/Common/CommonNoData'
import { AddOrUpdateLinkCategory, DeleteLinkCategory, GetLinkCategory } from '@/api/v2/mycontent'
import * as logger from '@/utils/logger'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'LinkedCategory',
  components: { CommonNoData, CustomTextButton, ModalHeader, CheckedGreenIcon, CheckedBlurIcon, CheckedYellowIcon },
  data() {
    return {
      visible: true,
      loading: true,
      color: [
        '#DEF1EE',
        '#FAE7D1',
        '#DEEFF1',
        '#F4F4F4'
      ],
      categoryList: [],
      selfCategory: [],
      selectedList: [],
      selectedNameList: [],
      showNewCategory: false,
      newCategory: null
    }
  },
  created() {
    this.$logger.info('LinkedCategory', this.selected)
    this.loadLinkCategoryData()
  },
  methods: {
    async loadLinkCategoryData () {
      this.$logger.info('loadLinkCategoryData')
      this.loading = true
      try {
        const result = await AppLogin(storage.get(ACCESS_TOKEN))
        this.$logger.info('loadLinkCategoryData initTagData AppLogin', result)
        const unitSet = await App.service('conf-user').get('unitSet')
        this.$logger.info('unitSet', unitSet)
      } catch (e) {
        console.log(e)
        this.$logger.error('loadLinkCategoryData', e)
      } finally {
        this.loading = false
      }
    },
    handleClose() {
      this.$logger.info('close', this.selectedList)
      this.$emit('close')
    },
    handleConfirm() {
      this.$logger.info('selectedList', this.selectedList)
      this.$emit('confirm', this.selectedList.map(item => item.title))
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
          if (this.selfCategory[i].title === this.newCategory) {
            isDuplicated = true
            break
          }
        }

        for (let i = 0; i < this.categoryList.length; i++) {
          for (let j = 0; j < this.categoryList[i].children.length; j++) {
            if (this.categoryList[i].children[j] === this.newCategory) {
              isDuplicated = true
              break
            }
          }
        }

        if (!isDuplicated) {
          AddOrUpdateLinkCategory({
            name: this.newCategory
          }).then((res) => {
            if (res.success && res.code === 0) {
              this.selfCategory.push({
                key: res.result.id,
                title: res.result.name
              })
              this.$logger.info('add new self category success')
              this.showNewCategory = false
            } else {
              this.$message.warn('add new category failed. ' + res.message)
            }
          })
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
        if (this.categoryList[i].children.indexOf(item) !== -1) {
          groupIndex = i
          break
        }
      }

      if (groupIndex !== -1) {
        this.categoryList[groupIndex].children.forEach(gItem => {
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
        const data = new FormData()
        data.append('id', item.key)
        DeleteLinkCategory(data).then(res => {
          if (res.success && res.code === 0) {
            this.selfCategory.splice(this.selfCategory.indexOf(item), 1)
          } else {
            this.$message.warn('Delete category failed. ' + res.message)
          }
        })
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
  padding: 10px 20px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  height: 270px;

  .category-block {
    width: 23%;
    margin: 0 10px;
    border-radius: 6px;
    padding: 5px 10px 5px 8px;
    height: 100%;
    overflow-y: auto;

    .category-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      color: #4A4B50;
      margin: 5px 0;
      height: 24px;
      line-height: 24px;
      user-select: none;
      .selected-icon {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 24px;
        width: 24px;
        padding-top: 3px;

        .checked-icon {
          display: none;
        }

        .empty-circle {
          height: 11px;
          width: 11px;
          border-radius: 50%;
          border: 2px solid #64716F;
          display: block;
        }

        svg {
          width: 13px;
          height: 13px;
        }
      }

      .item-name {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding-left: 2px;
      }

      &:hover {
        .self-item-delete {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .selected-item {
      .selected-icon {
        .checked-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: row;
        }
        .empty-circle {
          display: none;
        }
      }
      .item-name {
        font-weight: bold;
        color: #181A1F;
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
      margin-top: 15px;
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

.no-self-category {
  height: 150px;
}

</style>
