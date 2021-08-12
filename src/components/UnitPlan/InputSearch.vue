<template>
  <div class="input-search">
    <a-input v-model="value" @keyup="handleSearch" @focus="handleSearch" class="input-search-item"/>
    <div class="search-list-wrapper" v-if="showSearchListFlag">
      <ul class="search-list" >
        <li class="search-list-item input-search-item" v-for="(item,key) in searchList" :key="key" @click="handleSelectItem(item)">{{ item[label] }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'

export default {
  name: 'InputSearch',
  props: {
    defaultValue: {
      type: String,
      default: null
    },
    keyIndex: {
      type: Number,
      default: null
    },
    currendIndex: {
      type: Number,
      default: null
    },
    label: {
      type: String,
      default: 'name'
    },
    searchList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    showSearchListFlag () {
      return this.searchList.length > 0 && this.keyIndex === this.currendIndex
    }
  },
  mounted () {
    this.globalClick(this.handleClick)
  },
  data () {
    return {
      value: null
    }
  },
  created () {
    this.value = this.defaultValue
    logger.info('inputSearch value', this.value)
  },
  methods: {
    handleClick (event) {
      if (!event.target.classList.contains('input-search-item')) {
        this.$emit('reset')
      }
    },
    handleSearch () {
      logger.info('handleSearch' + this.value)
      this.$emit('search', this.keyIndex, this.value)
    },
    handleSelectItem (item) {
      logger.info('handleSelectItem', item)
      this.value = item[this.label]
      this.$emit('select-item', this.keyIndex, item)
      this.$emit('reset')
    },
    handleResetSearchList () {
      logger.info('handleResetSearchList')
      this.$emit('reset')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.input-search {
  position: relative;
  .search-list-wrapper {
    position: absolute;
    top: 45px;
    z-index: 1000;
    width: 100%;

    ul {
      box-shadow: @box-shadow-base;
      font-variant: initial;
      background: @input-disabled-bg;
      border-radius: @border-radius-base;
      outline: none;
      margin: 0;
      padding: 0;
      list-style: none;

      li {
        transition: all 0.2s ease-in;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background-color: @select-dropdown-bg;
        font-size: @select-dropdown-font-size;
        line-height: @input-height-base - 8px - 2px;
        padding: @select-dropdown-vertical-padding;

        &:hover,
        &:focus,
        &:active {
          color:  @select-item-selected-color;
          background-color: @select-item-active-bg;
          border-color: @select-border-color;
        }

        &.selected-item {
          color:  @select-item-selected-color;
          font-weight: @select-item-selected-font-weight;
          background-color: @select-item-selected-bg;
        }
      }

    }
  }
}
</style>
