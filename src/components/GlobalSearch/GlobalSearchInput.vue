<template>
  <div class='global-search-input'>
    <a-input
      @click.native.stop='activeSearchInput'
      v-model='data'
      placeholder='Search here...'/>
    <div class='search-icon'>
      <search-icon />
    </div>
    <div class='global-search' v-show='showSearchWrapper'>
      <div class='search-input-line'>
        <div class='search-back'>
          <a-icon type='arrow-left' @click='handleBack' :style="{color: '#999', fontSize: '16px'}" />
        </div>
        <div class='search-input'>
          <input v-model='searchKeyword' id='search-input' @keyup='handleSearch' @keyup.enter='emitSearchEvent(searchKeyword)' placeholder='Search...' />
        </div>
        <div class='search-clear'>
          <a-icon type='close' @click='handleSearchClear' />
        </div>
      </div>
      <div class='search-recommend-list'>
        <div class='do-search' v-show='searchKeyword' @click='emitSearchEvent(searchKeyword)'>
          <div class='icon'>
            <a-icon type="search" :style="{color: '#999', fontSize: '16px'}" />
          </div>
          <div class='search-content-left'>
            Search "<span class='bold'>{{ searchKeyword }}</span>"
          </div>
        </div>
        <div class='search-history' v-show='showSearchHistory'>
          <div class='history-item' v-for='(name, idx) in historyList' :key='idx' @click='emitSearchEvent(name)'>
            <div class='icon'>
              <a-icon type="clock-circle" theme="filled" :style="{color: '#999', fontSize: '16px'}" />
            </div>
            <div class='search-content'>
              {{ name }}
            </div>
          </div>
        </div>
        <div class='recommend-list' v-show='showSearchRecommend'>
          <div class='history-item' v-for='(recommendItem, idx) in recommendList' :key='idx' @click='emitSearchEvent(recommendItem.name)'>
            <div class='icon'>
              <a-icon type="star" theme="filled" :style="{color: '#999', fontSize: '16px'}" />
            </div>
            <div class='search-content'>
              <div class='content-name' v-html='recommendItem.tagName'></div>
              <div class='content-tagName'> {{ recommendItem.fromType }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class='bg-mask' @click='handleBack'></div>
    </div>
  </div>
</template>

<script>
import SearchIcon from '@/assets/v2/icons/search.svg?inline'
import { debounce } from 'lodash-es'
import { Search } from '@/api/library'

export default {
  name: 'GlobalSearchInput',
  components: { SearchIcon },
  data() {
    return {
      data: null,
      searchKeyword: '',
      showSearchWrapper: false,

      searching: false,
      handleSearch: null,

      historyList: [],
      recommendList: []
    }
  },
  computed: {
    showSearchHistory () {
      return this.searchKeyword === null || this.searchKeyword.trim() === ''
    },
    showSearchRecommend () {
      return this.searchKeyword && this.historyList.length > 0
    }
  },
  created() {
    this.handleSearch = debounce(this.doSearch, 1000)
    this.restoreSearchKey()
  },
  methods: {

    storeSearchKey() {
      const userId = this.$store.getters.userInfo.id
      window.sessionStorage.setItem(`${userId}_search_key_list`, JSON.stringify(this.historyList))
    },

    restoreSearchKey() {
      const userId = this.$store.getters.userInfo.id
      const searchKeyList = window.sessionStorage.getItem(`${userId}_search_key_list`)
      if (searchKeyList) {
        this.historyList = JSON.parse(searchKeyList)
      } else {
        this.historyList = []
      }
    },
    handleSearchClear () {
      this.searchKeyword = null
      this.recommendList = []
    },

    handleBack () {
      this.showSearchWrapper = false
    },

    doSearch () {
      const key = this.searchKeyword.trim()
      if (key) {
        const index = this.historyList.indexOf(key)
        if (index !== -1) {
          this.historyList.splice(index, 1)
        }
        this.historyList.unshift(key)
        if (this.historyList.length > 5) {
          this.historyList = this.historyList.slice(0, 5)
        }
        this.storeSearchKey()
        this.search(key)
      }
    },

    search(value) {
      this.$logger.info('search', value)
      this.searching = true
      this.recommendList = []
      Search({
        curriculumId: this.$store.getters.bindCurriculum,
        key: value
      }).then(response => {
        this.$logger.info('searchByKeyword ' + value, response)
        const list = []
        // 添加高亮标签
        response.result.forEach(item => {
          if (item.name) {
            let lastIndex = 0
            let index = item.name.toLowerCase().indexOf(value)
            let tagName = ''
            while (index !== -1 && index + value.length <= item.name.length) {
              tagName += item.name.substring(lastIndex, index) + '<span class="search-keyword-item">' + item.name.substring(index, index + value.length) + '</span>'
              lastIndex = index + value.length
              index = item.name.toLowerCase().indexOf(value, index + value.length)
            }
            tagName += item.name.substring(lastIndex)
            const tagItem = {
              fromType: item.fromType,
              name: item.name,
              tagName: tagName
            }
            list.push(tagItem)
          }
        })
        this.recommendList = list
      }).finally(() => {
        this.searching = false
      })
    },

    activeSearchInput () {
      this.showSearchWrapper = true
      this.$nextTick(() => {
        document.getElementById('search-input').focus()
      })
    },

    emitSearchEvent (key) {
      this.$logger.info('emitSearchEvent', key)
      this.$emit('search', key)
      this.$message.success('search ' + key)
      this.handleBack()
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.global-search-input {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: row;
  cursor: pointer;

  .search-icon {
    position: absolute;
    width: 35px;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-end;
    padding-right: 10px;
    cursor: pointer;

    svg {
      width: 13px;
      height: 13px;
    }
  }

  /deep/ input {
    padding-left: 30px;
    border-color: #EEF1F6;
    border-width: 2px !important;
    border-radius: 6px;
    transition: all 0.3s ease-in-out;

    &:focus {
      box-shadow: none;
      border-color: #d4d9e0;
    }

    &::placeholder {
      font-family: Arial;
      font-weight: 400;
      color: #44464F;
      font-size: 13px;
    }
  }
}

.global-search {
  transform: translateZ(0);
  will-change: transform;
  background-color: #fff;
  height: 56px;
  left: 0;
  position: fixed;
  top: 0;
  -webkit-transition: transform 300ms cubic-bezier(0.24,1,0.32,1),background-color 400ms cubic-bezier(0.39,0.575,0.565,1);
  transition: transform 300ms cubic-bezier(0.24,1,0.32,1),background-color 400ms cubic-bezier(0.39,0.575,0.565,1);
  width: 100%;
  z-index: 5000;

  .search-input-line {
    background: #fff;
    height: 56px;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 6000;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .search-back, .search-clear {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      width: 56px;
      height: 56px;
      z-index: 6100;
      transition: all 0.3s ease-in-out;

      &:hover {
        background-color: #F5F5F5;
      }
    }

    .search-input {
      input {
        background-color: #fff;
        border: none;
        border-radius: 0;
        height: 56px;
        left: 0;
        padding: 0 56px;
        position: absolute;
        outline: none;
        top: 0;
        width: 100%;

        &::placeholder {
          font-size: 14px;
          color: #aaa;
        }
      }
    }
  }

  .search-recommend-list {
    box-shadow: 0 2px 3px rgb(0 0 0 / 10%);
    max-height: -webkit-calc(100vh - 56px);
    max-height: calc(100vh - 56px);
    overflow-y: auto;
    position: relative;
    top: 100%;
    width: 100%;
    z-index: 6000;
    background-color: #fff;

    .do-search, .history-item, .recommend-item {
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: flex-start;
      &:hover {
        background-color: #f8f8f8;
      }
      .icon {
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: center;
      }

      .search-content-left {
        color: #999;
        padding-right: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: nowrap;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        flex-direction: row;
      }

      .search-content {
        color: #999;
        padding-right: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: nowrap;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        flex-direction: row;

        .content-tagName {
          margin-right: 10px;
          cursor: pointer;
          background: #f6f6f6;
          color: #aaa;
          font-size: 14px;
          line-height: 20px;
          padding: 0 5px;
          border-radius: 3px;
        }
      }
    }
  }

  .bg-mask {
    background: rgba(0,0,0,.6);
    height: 100vh;
    position: absolute;
    width: 100%;
    z-index: 3000;
  }
}

.bold {
  font-weight: bold;
}
</style>
