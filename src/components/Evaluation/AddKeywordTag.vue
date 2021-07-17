<template>
  <div>
    <div :class="{'tag-input-wrapper': true, 'active': active, 'tag-dom': true}" @click="handleFocusInput">
      <div class="tag-input-list tag-dom">
        <div class="tag-list tag-dom">
          <div class="tag-item tag-dom" v-for="(tag,index) in tagList" :key="index">
            <a-tag :color="tagColorList[index % tagColorList.length]" closable @close="handleCloseTag(tag)" class="tag-dom">
              {{ tag }}
            </a-tag>
          </div>
          <div class="tag-input tag-dom">
            <input
              type="text"
              @keyup.enter="handleAddTag"
              @keyup="handleKeyUpSearch"
              @blur="active = false"
              v-model="inputValue"
              :style="{width: inputWidth}"
              ref="input"
              class="tag-dom"/>
          </div>
        </div>
      </div>
    </div>
    <div class="search-result-list">
      <div class="search-list">
        <div class="list-item" v-for="(name,sIndex) in searchResult" :key="sIndex" @click="handleSearchTag(name)">
          {{ name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
const { debounce } = require('lodash-es')
const { SkillSearch } = require('@/api/skill')
const { KnowledgeSearch } = require('@/api/knowledge')

export default {
  name: 'AddKeywordTag',
  props: {
    currentTag: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      inputValue: '',
      searchType: null,
      tagColorList: [
        'pink',
        'orange',
        'green',
        'cyan',
        'blue',
        'red',
        'purple'
      ],
      active: false,
      tagList: [],
      searchList: []
    }
  },
  computed: {
    inputWidth () {
      const value = this.inputValue || ''
      const length = value.trim().length * 20 + 22
      return (length > 60 ? (length > 400 ? 400 : length) : 60) + 'px'
    },
    searchResult () {
      const list = []
      this.searchList.forEach(item => {
        if (!!item.name && list.indexOf(item.name) === -1) {
          list.push(item.name)
        }
      })
      return list
    }
  },
  created () {
    this.$logger.info('AddKeywordTag created ', this.currentTag)
    this.searchType = this.currentTag.type
    this.tagList = this.currentTag.keywords ? this.currentTag.keywords : []
    this.$logger.info('tagList', this.tagList, ' searchType ', this.searchType)
    this.debouncedSearchKnowledge = debounce(this.searchTag, 500)
  },
  methods: {

    handleKeyUpSearch () {
      this.$logger.info('handleKeyUpSearch ', this.inputValue)
      this.debouncedSearchKnowledge(this.inputValue)
    },
    searchTag (keyword) {
      logger.info('searchTag ' + this.searchType + ', keyword ' + this.inputValue)
      this.searchList = []
      if (typeof keyword === 'string' && keyword.trim().length >= 1) {
        if (this.searchType === 'skill') {
          SkillSearch({
            key: keyword
          }).then((response) => {
            logger.info('skill searchKnowledge response', response)
            this.searchList = response.result
          })
        } else {
          KnowledgeSearch({
            key: keyword
          }).then((response) => {
            logger.info('skill searchKnowledge response', response)
            this.searchList = response.result
          })
        }
      }
      this.$logger.info('searchList', this.searchList)
    },
    handleAddTag () {
      logger.info('handleAddTag ' + this.inputValue)
      if (this.inputValue && this.inputValue.trim().length) {
        const tagName = this.inputValue.trim()
        if (this.tagList.indexOf(tagName) === -1) {
          this.$emit('add-tag', {
            tagName
          })
        } else {
          logger.info('skip! input value ' + tagName + ' exist in', this.tagList)
        }
      } else {
        logger.info('skip! input value empty')
      }
      this.inputValue = ''
    },
    handleCloseTag (tagName) {
      logger.info('handleCloseTag ' + tagName)
      this.$emit('remove-tag', {
        tagName
      })
    },

    handleFocusInput () {
      this.$refs['input'].focus()
      this.active = true
    },

    handleSearchTag (tagName) {
      logger.info('handleSearchTag ' + tagName)
      if (this.currentTag.keywords.indexOf(tagName) === -1) {
        this.currentTag.keywords.push(tagName)
      }
      this.searchList = []
      this.inputValue = ''
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
@import "~ant-design-vue/lib/style/index";

.tag-input-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
  line-height: @input-height-base;
  text-align: start;
  vertical-align: top;
  color: @text-color;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0 5px;
  border: @border-width-base solid #d9d9d9;
  outline: 0;

  &:hover {
  border-color: @input-hover-border-color;
  border-right-width: @border-width-base !important;
}

  .tag-input-list {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    .tag-list {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-items: center;

      .tag-input {
        display: inline-block;
        input {
          border: none;
          outline: none;
          height: @input-height-base;
          border-radius: @border-radius-base;
          position: relative;
          display: inline-block;
          width: 100%;
          padding: @input-padding-vertical-base 0;
          color: @input-color;
          font-size: @font-size-base;
          line-height: @line-height-base;
          background-color: @input-bg;
          background-image: none;
          border: none;
          &:focus,
          &:active {
            border: none;
            outline: none;
          }
        }
      }

      .tag-item {
        max-width: 200px;
        word-break:normal;
        width:auto;
        white-space:pre-wrap;
        word-wrap : break-word;
        margin: 5px 0;

        .tag-dom {
          word-break:normal;
          width:auto;
          display:block;
          white-space:pre-wrap;
        }
      }
    }
  }
}

.active {
  border-right-width: @border-width-base !important;
  outline: 0;
  box-shadow: @input-outline-offset @outline-blur-size @outline-width fade(@outline-color, 20%);
}

.search-result-list {
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  .search-list {
    display: flex;
    flex-direction: column;
    .list-item {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      line-height: 25px;
      padding: 5px 5px;
      border-bottom: 1px solid #eee;
    }

    .list-item:hover {
      background-color: fade(@outline-color, 20%);
      color: @primary-color;
      cursor: pointer;
    }
  }
}

</style>
