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
<!--          <a-icon type="setting" @click='handleSetting' />-->
        </div>
      </div>
      <div class='tag-content-wrapper'>
        <div class='selected-tag'>
          <div class="skt-tag-list">
            <div class="skt-tag-item" :class="{'active-category-tag': activeCategoryTagList.indexOf(tagItem.name) !== -1}" v-for="(tagItem) in selectedTagList" :key="tagItem.name" @click='activeCategory(tagItem)'>
              <a-tag
                :closable="canCloseTag(tagItem)"
                @close="closeTag(tagItem)"
                :color="tagItem.tagColor"
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
      <div class='tag-category-wrapper' v-show='tagSelectContainerVisible'>
        <template v-if='currentActiveTagCategory'>
          <custom-tag-category-bar
            ref='categoryBar'
            :category-list='allTagList'
            :active-tag-category.sync='currentActiveTagCategory'
            :dot-tag-category-name-list='associateTagCategoryNameList'
            @update='updateCurrentCategory'/>
        </template>
      </div>
      <div class='tag-category-content-wrapper' v-show='tagSelectContainerVisible'>
        <div class='category-search'>
          <custom-search-input
            :round='true'
            placeholder='Search your tag'
            @change='switchCategory(currentActiveTagCategory)'
            :value.sync='inputTag'/>
          <div class='create-item' v-show='inputTag.trim() && !isTagExistInCurrentCategory && !waitCreatedTagCategory'>
            <a-button type='primary' shape='round' size="small" @click='createTag'><a-icon type='plus' /> Create</a-button>
          </div>
        </div>
        <div class='category-content'>
          <template v-if="currentActiveTagCategory">
            <div class="search-tag-wrapper tag-wrapper" v-if="filterTagList.length > 0">
              <div class="skt-tag-item" v-for="tagItem in filterTagList" :key="tagItem.tag" >
                <a-tag
                  @click="selectTag(currentActiveTagCategory, tagItem)"
                  :style="{ 'background-color': currentActiveTagCategory.tagColor || '#fff', 'border-color': currentActiveTagCategory.tagColor || '#15c39a'}"
                  :class="{ 'selected-tag-item': selectedTagNameList.indexOf(tagItem.tag) !== -1 }"
                  class="tag-item cc-custom-tag-item">

                  <template v-if='getTagAssociateContentList(tagItem.tag)'>
                    <a-badge dot>
                      <a-tooltip placement="topRight">
                        <template slot="title">
                          <div class='associate-content-item' v-for='(content, idx) in getTagAssociateContentList(tagItem.tag)' :key='idx'>
                            From {{ content.name }} ({{ content.type | type2Name }})
                          </div>
                        </template>
                        {{ tagItem.tag }}
                      </a-tooltip>
                    </a-badge>
                  </template>
                  <template v-else>
                    {{ tagItem.tag }}
                  </template>
                  <span class='delete-tag-icon' v-if='tagItem.isPri' @click.stop='deleteTag(tagItem)'>
                    <a-icon type='close' />
                  </span>
                </a-tag>
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
                    {{ waitCreatedTagCategory.set }}
                  </a>
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class='all-description vertical-right'>
        <custom-link-text text='All' v-if='tagSelectContainerVisible' @click='tagSelectContainerVisible = false' v-show='currentActiveTagCategory && selectedCategoryNameList.indexOf(this.currentActiveTagCategory.set) !== -1'></custom-link-text>
        <custom-link-text text='Hide' v-if='!tagSelectContainerVisible' @click='tagSelectContainerVisible = true'></custom-link-text>
      </div>
      <div class='all-category-description' v-show='!tagSelectContainerVisible'>
        <div class='category-description-item' v-for='categoryDesc in tagCategoryDesc' :key='categoryDesc.category'>
          <div class='category-title'>
            {{ categoryDesc.category }}
          </div>
          <div class='category-description'>
            <a-textarea
              :auto-size="{ minRows: 3, maxRows: 6 }"
              v-model='categoryDesc.description'
              placeholder='Explain why choose the tags'
              class='cc-form-textarea-white-bg'
              allow-clear />
          </div>
        </div>
      </div>
      <div class='tag-category-description' v-show='tagSelectContainerVisible'>
        <a-textarea
          v-if='currentActiveTagCategory && selectedCategoryNameList.indexOf(currentActiveTagCategory.set) !== -1'
          :auto-size="{ minRows: 3, maxRows: 6 }"
          v-model='currentTagCategoryDesc'
          placeholder='Explain why choose the tags'
          class='cc-form-textarea-white-bg'
          @change='asyncUpdateTagCategoryDescFn'
          allow-clear />
      </div>

      <a-modal
        title="My tags"
        v-model="settingVisible"
        :footer="null"
        width='600px'
        destroyOnClose
        :afterClose="initTagData">
        <div>
          <tag-setting />
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import CommonNoData from '@/components/Common/CommonNoData'
import CustomTagCategoryBar from '@/components/CustomTag/CustomTagCategoryBar'
import CustomSearchInput from '@/components/Common/CustomSearchInput'
import { debounce } from 'lodash-es'
import TagSetting from '@/components/UnitPlan/TagSetting'
import { QueryCustomTags } from '@/api/v2/mycontent'
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

export default {
  name: 'CustomTagV3',
  components: { CustomLinkText, CustomTextButton, TagSetting, CustomSearchInput, CustomTagCategoryBar, CommonNoData },
  props: {
    customTags: {
      type: Array,
      default: () => []
    },
    tagCategoryDesc: {
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
      asyncUpdateTagCategoryDescFn: null, // 异步更新标签分类TagCategoryDesc函数

      tagSelectContainerVisible: true
    }
  },
  watch: {
    associateIdTypeList: {
      immediate: true,
      handler(newValue) {
        this.loadAssociateCustomTags(newValue)
      }
    },
    customTags: {
      deep: true,
      immediate: true,
      handler(newValue) {
        const list = JSON.parse(JSON.stringify(newValue))
        list.forEach((item) => {
          const category = this.allTagList.find(categoryItem => categoryItem.set === item.category)
          item.tagColor = category?.tagColor || '#f1f1f1'
        })
        this.selectedTagList = list
      }
    },
    tagCategoryDesc: {
      deep: true,
      immediate: true,
      handler(newValue) {
        const list = JSON.parse(JSON.stringify(newValue))
        if (this.currentActiveTagCategory) {
          const current = list.find(item => item.category === this.currentActiveTagCategory.set)
          if (current) {
            this.currentTagCategoryDesc = current.description
          } else {
            this.currentTagCategoryDesc = ''
          }
        }
      }
    },
    currentActiveTagCategory: {
      deep: true,
      immediate: true,
      handler(newValue) {
        if (newValue) {
          const current = this.tagCategoryDesc.find(item => item.category === newValue.set)
          if (current) {
            this.currentTagCategoryDesc = current.description
          } else {
            this.currentTagCategoryDesc = ''
          }
        }
      }
    }
  },
  computed: {
    allTagList () {
      const pubTagList = this.$store.getters.pubTagList
      const priTagList = this.$store.getters.priTagList
      const tagList = [...pubTagList, ...priTagList]
      return tagList.map((tag, index) => {
        return {
          ...tag,
          tagColor: setColor[ index % setColor.length ]
        }
      })
    },

    pubTagNameList () {
      const tagSet = new Set()
      this.$store.getters.pubTagList.forEach(item => {
        item.tags.forEach(tag => {
          tagSet.add(tag.tag)
        })
      })
      return Array.from(tagSet)
    },

    priTagNameList () {
      const tagSet = new Set()
      this.$store.getters.priTagList.forEach(item => {
        item.tags.forEach(tag => {
          tagSet.add(tag.tag)
        })
      })
      return Array.from(tagSet)
    },

    selectedTagNameList () {
      return this.selectedTagList.map(tag => tag.name)
    },

    filterTagList() {
      if (this.currentActiveTagCategory) {
        if (this.inputTag.length > 0 && this.inputTag.trim()) {
          return this.currentActiveTagCategory.tags.filter(tag => tag.tag.toLowerCase().indexOf(this.inputTag.trim().toLowerCase()) > -1)
        } else {
          return this.currentActiveTagCategory.tags
        }
      } else {
        return []
      }
    },

    waitCreatedTagCategory() {
      let category = null
      for (let i = 0; i < this.allTagList.length && !category; i++) {
        this.allTagList[i].tags.forEach(tag => {
          if (tag.tag.toLowerCase() === this.inputTag.trim().toLowerCase()) {
            category = this.allTagList[i]
          }
        })
      }

      return category
    },

    isTagExistInCurrentCategory () {
      let exist = false
      if (this.currentActiveTagCategory) {
        exist = this.currentActiveTagCategory.tags.some(tag => tag.tag.toLowerCase().trim() === this.inputTag.trim().toLowerCase())
      }
      return exist
    },

    activeCategoryTagList () {
      if (this.currentActiveTagCategory) {
        return this.currentActiveTagCategory.tags.map(item => item.tag)
      } else {
        return []
      }
    },

    associateTagCategoryNameList () {
      const categorySet = new Set()
      this.associateCustomTags.forEach(item => {
        const customTags = item.customTags
        customTags.forEach(customTag => {
          categorySet.add(customTag.category)
        })
      })
      return Array.from(categorySet)
    },

    selectedCategoryNameList () {
      const categorySet = new Set()
      this.selectedTagList.forEach(item => {
        categorySet.add(item.category)
      })
      return Array.from(categorySet)
    }
  },
  created() {
    this.initTagData()
    this.asyncUpdateTagCategoryDescFn = debounce(this.updateTagCategoryTagCategoryDesc, 1000)
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

        // 根据已选customTag，同步补全tagCategoryDesc
        this.customTags.forEach(customTag => {
          if (!this.tagCategoryDesc.some(categoryDesc => categoryDesc.category === customTag.category)) {
            this.tagCategoryDesc.push({
              category: customTag.category,
              description: ''
            })
          }
        })
      }).finally(() => {
        this.loading = false
      })
    },

    handleSetting () {
      this.settingVisible = true
    },

    canCloseTag(tag) {
      return true
    },

    closeTag (closeTagItem) {
      this.$logger.info('close tag', closeTagItem)

      const index = this.selectedTagList.findIndex(customTagItem => customTagItem.name === closeTagItem.name && customTagItem.category === closeTagItem.category)
      if (index > -1) {
        this.selectedTagList.splice(index, 1)
      }
      this.$emit('update:customTags', this.selectedTagList)

      // 删除对应的分类描述
      if (!this.selectedTagList.some(item => item.category === closeTagItem.category)) {
        const list = JSON.parse(JSON.stringify(this.tagCategoryDesc))
        const descIndex = list.findIndex(item => item.category === closeTagItem.category)
        if (descIndex !== -1) {
          list.splice(descIndex, 1)
          this.$emit('update:tagCategoryDesc', list)
        }
      }
      this.$logger.info('after close tag customTags', this.selectedTagList)
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

    updateTagCategoryTagCategoryDesc () {
      this.$logger.info('updateTagCategoryTagCategoryDesc', this.currentActiveTagCategory, this.currentTagCategoryDesc)
      const categorySet = new Set()
      const list = []

      // 更新已有
      this.tagCategoryDesc.forEach(item => {
        if (!categorySet.has(item.category) && item.category) {
          categorySet.add(item.category)
          if (item.category === this.currentActiveTagCategory.set) {
            list.push({ category: item.category, description: this.currentTagCategoryDesc })
          } else {
            list.push({ ...item })
          }
        }
      })

      // 新增描述
      if (!this.tagCategoryDesc.some(item => item.category === this.currentActiveTagCategory.set)) {
        list.push({ category: this.currentActiveTagCategory.set, description: this.currentTagCategoryDesc })
      }
      this.$logger.info('update tagCategoryDesc', list)
      this.$emit('update:tagCategoryDesc', list)
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
      const category = this.allTagList.find(category => category.set === tagItem.category)
      if (category) {
        this.switchCategory(category)
      }
    },

    loadAssociateCustomTags (idTypeList) {
      this.$logger.info('loadAssociateCustomTags', idTypeList)
      if (idTypeList.length) {
        const idTypeSet = new Set()
        const idTypeListSet = []
        idTypeList.forEach(item => {
          const key = `${item.id}_${item.type}`
          if (!idTypeSet.has(key)) {
            idTypeSet.add(key)
            idTypeListSet.push(item)
          }
        })
        QueryCustomTags(Array.from(idTypeListSet)).then(response => {
          this.$logger.info('loadAssociateCustomTags customTags', response)
          this.associateCustomTags = response.result

          const associateTagContents = {}
          this.associateCustomTags.forEach(item => {
            const content = item.vo
            item.customTags.forEach(customTag => {
              if (!associateTagContents[customTag.name]) {
                associateTagContents[customTag.name] = [content]
              } else {
                associateTagContents[customTag.name].push(content)
              }
            })
          })
          this.associateTagContents = associateTagContents
        }).catch(err => {
          this.$logger.error('loadAssociateCustomTags error', err)
        })
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
</style>
