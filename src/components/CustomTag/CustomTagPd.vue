<template>
  <div class='custom-tag-v3'>
    <div class='loading' v-if='loading'>
      <a-skeleton />
    </div>
    <div class='custom-tag-v3-content'>
      <div class='tag-header'>
        <div class='tag-selected-label'>
          Selected tags
        </div>
        <div class='tag-setting'>
        </div>
      </div>
      <div class='tag-content-wrapper'>
        <div class='selected-tag'>
          <div class="skt-tag-list">
            <div class="skt-tag-item" :class="{'active-category-tag': activeCategoryTagList.indexOf(tagItem) !== -1}" v-for="(tagItem, idx) in customTags" :key="idx" @click='activeCategory(tagItem)'>
              <a-tag
                closable
                @close="closeTag(tagItem)"
                :color="tagItem.tagColor"
                class='tag-item'>
                {{ tagItem }}
              </a-tag>
            </div>
          </div>
        </div>
        <div class='no-selected-tag' v-show='customTags.length === 0 && !loading'>
          <common-no-data text='No tag' />
        </div>
      </div>
      <div class='tag-category-wrapper'>
        <template v-if='currentActiveTagCategory'>
          <custom-pd-tag-category-bar
            ref='categoryBar'
            :category-list='allTagList'
            :active-tag-category.sync='currentActiveTagCategory'
            @update='updateCurrentCategory'/>
        </template>
      </div>

      <div class='tag-category-content-wrapper'>
        <div class='category-search'>
          <custom-search-input
            :round='true'
            placeholder='Search your tag'
            @change='switchCategory(currentActiveTagCategory)'
            :value.sync='inputTag'/>
        </div>
        <div class='category-content'>
          <template v-if="currentActiveTagCategory">
            <div class="search-tag-wrapper tag-wrapper" v-if="filterTagList.length > 0">
              <div class="skt-tag-item" v-for="tagItem in filterTagList" :key="tagItem.name" >
                <a-tag
                  @click="selectTag(currentActiveTagCategory, tagItem)"
                  :style="{ 'background-color': currentActiveTagCategory.tagColor || '#fff', 'border-color': currentActiveTagCategory.tagColor || '#15c39a'}"
                  :class="{ 'selected-tag-item': selectedTagNameList.indexOf(tagItem.name) !== -1 }"
                  class="tag-item cc-custom-tag-item">
                  {{ tagItem.name }}
                </a-tag>
                <div class='sub-tag-block' v-if='tagItem.expand' @click.stop=''>
                  <div slot="content" @click.stop=''>
                    <div class="search-tag-wrapper tag-wrapper" v-if="tagItem.children.length > 0">
                      <div class="skt-tag-item" v-for="tag in tagItem.children" :key="tag.name" >
                        <a-tag
                          @click.native.stop="selectTag(currentActiveTagCategory, tag)"
                          :style="{ 'background-color': currentActiveTagCategory.tagColor || '#fff', 'border-color': currentActiveTagCategory.tagColor || '#15c39a'}"
                          :class="{ 'selected-tag-item': selectedTagNameList.indexOf(tag.name) !== -1 }"
                          class="tag-item cc-custom-tag-item">
                          {{ tag.name }}
                        </a-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class='no-tag-content vertical-center' v-if='filterTagList.length === 0'>
              <div class='no-tag-text'>
                <template v-if='!waitCreatedTagCategory'>
                  Tag does not exist.
                </template>
                <template v-if='waitCreatedTagCategory'>
                  Tag may exist in
                  <a @click='switchCategory(waitCreatedTagCategory)' class='target-category'>
                    {{ waitCreatedTagCategory.category }}
                  </a>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import CommonNoData from '@/components/Common/CommonNoData'
import CustomPdTagCategoryBar from '@/components/CustomTag/CustomPdTagCategoryBar'
import CustomSearchInput from '@/components/Common/CustomSearchInput'
import TagSetting from '@/components/UnitPlan/TagSetting'

const setColor = [
  '#FFEDAF',
  '#C8F4FF',
  '#E6E4FF',
  '#ffccb0',
  '#ffa9a2',
  '#a3ecb9',
  '#f7c5f8',
  '#ffbfe2',
  '#d5b9ff',
  '#c4f6b1'
]

export default {
  name: 'CustomTagPd',
  components: { TagSetting, CustomSearchInput, CustomPdTagCategoryBar, CommonNoData },
  props: {
    customTags: {
      type: Array,
      default: () => []
    },
    fieldName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: true,
      customTagList: [],

      associateCustomTags: [],
      associateTagContents: {},

      settingVisible: false,

      currentActiveTagCategory: null,

      inputTag: ''
    }
  },
  computed: {
    allTagList () {
      const pdTagList = this.$store.getters.pdTagList
      return pdTagList.map((category, index) => {
        return {
          ...category,
          children: category.children.map(subCategory => {
            return {
              ...subCategory,
              children: subCategory.children.map(tag => {
                return {
                  ...tag,
                  tagColor: setColor[index]
                }
              }),
              tagColor: setColor[index]
            }
          }),
          tagColor: setColor[ index % setColor.length ]
        }
      })
    },

    selectedTagNameList () {
      return this.customTags.map(item => item.name)
    },

    filterTagList() {
      if (this.currentActiveTagCategory) {
        if (this.inputTag.length > 0 && this.inputTag.trim()) {
          return this.currentActiveTagCategory.children.filter(subCategory => {
            return subCategory.children.some(tag => {
              return tag.name.toLowerCase().indexOf(this.inputTag.toLowerCase()) !== -1
            }) || subCategory.name.toLowerCase().indexOf(this.inputTag.toLowerCase()) !== -1
          })
        } else {
          return this.currentActiveTagCategory.children
        }
      } else {
        return []
      }
    },

    waitCreatedTagCategory() {
      let category = null
      for (let i = 0; i < this.allTagList.length && !category; i++) {
        this.allTagList[i].children.forEach(subCategory => {
          if (subCategory.name.toLowerCase() === this.inputTag.trim().toLowerCase()) {
            category = this.allTagList[i]
          }
        })
      }

      return category
    },

    activeCategoryTagList() {
      if (this.currentActiveTagCategory) {
        const list = this.currentActiveTagCategory.children.slice()
        this.currentActiveTagCategory.children.forEach(subCategory => {
          subCategory.children.forEach(tag => {
            list.push(tag)
          })
        })
        return list
      } else {
        return []
      }
    }
  },
  created() {
    this.initTagData()
  },
  methods: {

    initTagData () {
      this.$store.dispatch('initTagData', storage.get(ACCESS_TOKEN)).catch((err) => {
        console.log(err)
        this.$message.error('init tag data error. ' + err.message)
      }).then(() => {
        if (!this.currentActiveTagCategory) {
          this.currentActiveTagCategory = this.allTagList.length ? this.allTagList[0] : null
        } else {
          const index = this.allTagList.findIndex(item => item.set === this.currentActiveTagCategory.set)
          if (index === -1) {
            this.currentActiveTagCategory = this.allTagList.length ? this.allTagList[0] : null
          } else {
            this.currentActiveTagCategory = this.allTagList[index]
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },
    closeTag (closeTagItem) {
      this.$logger.info('close tag', closeTagItem)

      const index = this.customTags.findIndex(customTagItem => customTagItem.name === closeTagItem.name &&
        closeTagItem.isSubCategory === customTagItem.isSubCategory &&
        closeTagItem.isTag === customTagItem.isTag)
      this.$logger.info('close tag fieldItem isSubCategory', index)
      if (index > -1) {
        this.$emit('update:customTag', this.customTags.slice(0).splice(index, 1))
      }
      this.$logger.info('after close tag customTags', this.customTags)
    },

    async deleteTag (deleteTagItem) {
      this.$logger.info('delete tag', deleteTagItem)
      if (deleteTagItem && deleteTagItem.isPri && this.currentActiveTagCategory) {
        // eslint-disable-next-line no-undef
        const ret = await App.service('tags').patch(this.currentActiveTagCategory._id, { $pull: { tags: [deleteTagItem.tag] } })
        this.$logger.info('deleteTag tag ret', ret)
        const index = this.currentActiveTagCategory.tags.findIndex(tagItem => tagItem.tag === deleteTagItem.tag)
        if (index > -1) {
          this.currentActiveTagCategory.tags.splice(index, 1)
        }
      }
    },

    selectTag (category, selectTagItem) {
      this.$logger.info('select tag', category, selectTagItem)
      const targetTagItem = this.customTags.find(customTagItem => customTagItem.fieldName === this.fieldName)
      this.$logger.info('select targetTagItem', targetTagItem)
      if (targetTagItem && targetTagItem.isSubCategory) {
        const tagItem = targetTagItem.tags.find(tagItem => tagItem.category === category.category && tagItem.name === selectTagItem.name)
        if (!tagItem) {
          targetTagItem.tags.push(tagItem)
        }
      } else if (targetTagItem && targetTagItem.isTag) {
        this.customTags.push({
          fieldName: this.fieldName,
          tags: [selectTagItem]
        })
      }
      this.currentActiveTagCategory.children.forEach(item => { item.expand = false })
      if (selectTagItem.hasOwnProperty('expand')) {
        selectTagItem.expand = !selectTagItem.expand
      }
      this.$emit('update:customTag', this.customTags)
      this.$logger.info('after selectTag customTags', this.customTags)
    },

    switchCategory (category) {
      this.$refs.categoryBar.categoryScrollIntoView(category)
      if (category !== this.currentActiveTagCategory) {
        this.currentActiveTagCategory = category
      }
    },

    updateCurrentCategory () {
      this.$logger.info('updateCurrentCategory')
      this.inputTag = ''
    },

    activeCategory (tagItem) {
      this.$logger.info('activeCategory', tagItem)
      const category = this.allTagList.find(category => category.category === tagItem.category)
      if (category) {
        this.switchCategory(category)
      }
    },

    getTagAssociateContentList (tag) {
      if (this.associateTagContents[tag]) {
        return this.associateTagContents[tag]
      } else {
        return null
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.custom-tag-v3 {
  position: relative;

  .custom-tag-v3-content {
    position: relative;

    .tag-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .tag-selected-label {
        font-size: 16px;
        font-family: Arial;
        font-weight: bold;
        color: #191919;
        line-height: 40px;
      }
    }

    .tag-content-wrapper {
      min-height: 110px;
      background: #FFFFFF;
      border: 1px solid #f2f3f5;
      border-radius: 4px;
      width: 100%;
      padding: 10px 15px;

      .no-selected-tag {
        height: 110px;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        cursor: pointer;
        color: #bbb;
      }

      .selected-tag {
        position: relative;
        .skt-tag-list {
          max-height: 300px;
          overflow-y: auto;
          padding: 3px 0;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          position: relative;

          .skt-tag-item {
            margin: 10px 10px 10px 0;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            vertical-align: middle;
            cursor: pointer;

            .tag-item {
              opacity: 0.8;
              margin-left: 3px;
              cursor: pointer;
              color: #734110;
              border: 2px solid #ffffff;
              font-size: 13px;
              border-radius: 30px;
              line-height: 30px;
              padding-left: 15px;
              word-break: normal;
              width: auto;
              display: flex;
              align-items: center;
              justify-content: space-between;
              white-space: pre-wrap;
              word-wrap: break-word;
              overflow: hidden;
              transition: all 0.3s ease;

              /deep/ .anticon-close {
                opacity: 0;
                color: #f26c59;
              }

              &:hover {
                /deep/ .anticon-close {
                  opacity: 1;
                }
              }
            }

            .tag-disable {
              color: rgba(0, 0, 0, .25);
              background-color: #f5f5f5;
              border-color: #d9d9d9;
              text-shadow: none;
              box-shadow: none;
              cursor: not-allowed;
            }
          }

        }

      }
    }

    .tag-category-wrapper {
      margin-top: 30px;
    }

    .tag-category-content-wrapper {
      margin-top: 10px;
      background: #FFFFFF;
      border: 1px solid #f2f3f5;
      border-radius: 4px;
      width: 100%;
      padding: 15px;

      .category-search {
        position: relative;
        .create-item {
          position: absolute;
          right: 5px;
          top: 4px;
        }
      }
    }

    .tag-category-description {
      margin-top: 20px;
    }

    .cc-custom-tag-item {
      border-radius: 36px;
      font-family: Arial;
      padding: 0 10px;
      font-weight: 400;
      color: #734110;
      line-height: 36px;
      border: 2px solid #ffffff;
    }

    .category-content {
      padding-top: 15px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;

      .no-tag-content {
        height: 50px;
        width: 100%;
        .no-tag-text {
          cursor: pointer;
          user-select: none;
          font-size: 13px;
          color: #aaa;

          .target-category {
            text-decoration: underline;
            color: #15c39a;
            font-weight: bold;
          }
        }
      }
    }

    .search-tag-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;

      .skt-tag-item {
        margin: 0 10px 10px 0;
        cursor: pointer;
        .ant-tag {
          cursor: pointer;
        }
      }
    }
  }
}

.active-category-tag {
  .tag-item {
    opacity: 1 !important;
    border: 2px solid #15c39a !important;
  }
}

.selected-tag-item {
  border: 2px dashed #15c39a !important;
  filter: opacity(0.3);
}

.search-tag-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;

  .skt-tag-item {
    margin: 0 10px 10px 0;
    cursor: pointer;
    .ant-tag {
      cursor: pointer;
    }
  }
}

.sub-tag-block {
  display: block;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  background: #f1f1f1;
}

</style>
