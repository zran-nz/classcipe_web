<template>
  <div class='custom-tag-v3'>
    <div class='loading' v-if='loading'>
      <a-skeleton />
    </div>
    <div class='custom-tag-v3-content'>
      <div class='tag-header'>
        <div class='tag-selected-label'>
          Selected tags
          <template v-if='selectedTagList.length'>({{ selectedTagList.length }})</template>
        </div>
        <div class='tag-setting'>
        </div>
      </div>
      <div class='tag-content-wrapper'>
        <div class='selected-tag'>
          <div class="skt-tag-list">
            <div class="skt-tag-item" v-for="(tagItem) in selectedTagList" :key="tagItem.name">
              <a-tag
                closable
                @close="closeTag(tagItem)"
                :color="categoryColor[tagItem.category]"
                class='tag-item'>
                {{ tagItem.name }}
              </a-tag>
            </div>
          </div>
        </div>
        <div class='no-selected-tag' v-show='selectedTagList.length === 0 && !loading'>
          <common-no-data text='No tag' />
        </div>
      </div>
      <div class='tag-content-wrapper selected-wrapper'>
        <div class='selected-tag'>
          <div class="skt-tag-list">
            <div
              class="skt-tag-item"
              @click='toggleSelectItem(tagItem)'
              :class="{ 'selected-item': selectedTagNameList.indexOf(tagItem.name) !== -1 }"
              v-for="(tagItem) in allTags"
              :key="tagItem.name">
              <a-tag
                :color="categoryColor[tagItem.category]"
                class='tag-item'>
                {{ tagItem.name }}
              </a-tag>
            </div>
          </div>
        </div>
        <div class='no-selected-tag' v-show='allTags.length === 0 && !loading'>
          <common-no-data text='No tag' />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CommonNoData from '@/components/Common/CommonNoData'
import CustomTagCategoryBar from '@/components/CustomTag/CustomTagCategoryBar'
import CustomSearchInput from '@/components/Common/CustomSearchInput'
import TagSetting from '@/components/UnitPlan/TagSetting'
import CustomTextButton from '@/components/Common/CustomTextButton'
import CustomLinkText from '@/components/Common/CustomLinkText'

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

const categoryColorCached = {}

export default {
  name: 'SplitTaskTag',
  components: { CustomLinkText, CustomTextButton, TagSetting, CustomSearchInput, CustomTagCategoryBar, CommonNoData },
  props: {
    customTags: {
      type: Array,
      default: () => []
    },
    allTags: {
      type: Array,
      default: () => []
    },
    associateIdTypeList: {
      type: Array,
      default: () => []
    },
    isLoadAssociateTags: {
      type: Boolean,
      default: false
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

      inputTag: '',
      selectedTagList: [],
      categoryToColor: {},

      currentTagCategoryDesc: '',

      tagSelectContainerVisible: true
    }
  },
  computed: {
    selectedTagNameList () {
      return this.customTags.map(tag => tag.name)
    },
    selectedTagCategoryList () {
      return this.customTags.map(tag => tag.category)
    },
    categoryColor() {
      let index = 0
      return this.selectedTagCategoryList.reduce((map, category) => {
        if (!map.hasOwnProperty(category)) {
          map[category] = setColor[index++]
        }
        return map
      }, categoryColorCached)
    }
  },
  watch: {
    customTags() {
      this.selectedTagList = JSON.parse(JSON.stringify(this.customTags))
      this.$logger.info('update selectedTagList', this.selectedTagList)
    }
  },
  created() {
    this.loading = true
    this.selectedTagList = JSON.parse(JSON.stringify(this.customTags))
    this.loading = false
  },
  methods: {

    closeTag (closeTagItem) {
      this.$logger.info('close tag', closeTagItem, this.selectedTagList)
      const index = this.selectedTagList.findIndex(customTagItem => customTagItem.name === closeTagItem.name && customTagItem.category === closeTagItem.category)
      if (index > -1) {
        this.$logger.info('delete', this.selectedTagList[index])
        this.selectedTagList.splice(index, 1)
      }
      this.$emit('update:customTags', this.selectedTagList)
      this.$logger.info('after delete', this.selectedTagList)
    },

    async createTag () {
      this.$logger.info('create tag', this.inputTag, this.currentActiveTagCategory)
      if (this.inputTag.trim() && this.currentActiveTagCategory) {
        // eslint-disable-next-line no-undef
        const ret = await App.service('tags').patch(this.currentActiveTagCategory._id, { $addToSet: { tags: [this.inputTag.trim()] } })
        this.$logger.info('create tag ret', ret)
        this.initTagData()
        this.inputTag = ''
      }
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
      const index = this.selectedTagList.findIndex(customTagItem => customTagItem.name === selectTagItem.tag && customTagItem.category === selectTagItem.set)
      if (index === -1) {
        this.selectedTagList.push({
          category: category.set,
          name: selectTagItem.tag,
          tagColor: category.tagColor
        })
      }
      this.$emit('update:customTags', this.selectedTagList)
      this.$logger.info('after selectTag customTags', this.selectedTagList)

      // 新增不存在的分类描述
      const list = JSON.parse(JSON.stringify(this.tagCategoryDesc))
      const descIndex = list.findIndex(item => item.category === category.set)
      if (descIndex === -1) {
        list.push({
          category: category.set,
          description: ''
        })
        this.$emit('update:tagCategoryDesc', list)
      }
    },

    toggleSelectItem (tagItem) {
      this.$logger.info('toggleSelectItem', tagItem)
      const index = this.selectedTagList.findIndex(item => item.name === tagItem.name && item.category === tagItem.category)
      if (index === -1) {
        this.selectedTagList.push(tagItem)
      } else {
        this.selectedTagList.splice(index, 1)
      }
      this.$emit('update:customTags', this.selectedTagList)
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
            margin: 0 10px 10px 0;
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
      margin-top: 10px;
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

.all-description {
  margin-top: 10px;
}

.category-description-item {
  margin-top: 10px;
  .category-title {
    font-weight: 500;
    padding-bottom: 3px;
    padding-left: 5px;
  }
}

.selected-item {
  filter: grayscale(1);
}

.selected-wrapper {
  margin-top: 20px;
}

</style>
