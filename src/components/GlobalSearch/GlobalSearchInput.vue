<template>
  <div class='global-search-input'>
    <div class='search-icon'>
      <a-icon type='search' @click.native='activeSearchInput' />
    </div>
    <div class='global-search' v-show='showSearchWrapper'>
      <div class='search-input-line'>
        <div class='search-back'>
          <a-icon type='arrow-left' @click='handleBack' :style="{color: '#999', fontSize: '16px'}" />
        </div>
        <div class='search-input'>
          <input v-model='searchKeyword' id='search-input' @keyup='handleSearch' @keyup.enter='emitSearchEvent(searchKeyword)' placeholder='Search...' />
        </div>
        <div class='search-clear' @click='handleSearchClear' v-show='searchKeyword.length > 0' >
          <a-icon type='close' />
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
          <div class='list-item' v-for='(name) in historyList' :key='name' @click='emitSearchEvent(name)'>
            <div class='icon'>
              <a-icon type="clock-circle" theme="filled" :style="{color: '#999', fontSize: '16px'}" />
            </div>
            <div class='search-content'>
              {{ name }}
            </div>
          </div>
        </div>
        <div class='recommend-list' v-show='showSearchRecommend'>
          <div class='list-item' v-for='(item,idx) in similarList' :key='idx' @click='emitSearchEvent(item.name)'>
            <div class='icon similar-icon'>
              #
            </div>
            <div class='search-content'>
              <div class='content-name'>
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class='list-item' v-for='item in pdList' :key='item.id' @click='viewItem(item)'>
            <div class='icon'>
              <div class='tag-icon'>PD</div>
            </div>
            <div class='search-content'>
              <div class='content-name'>
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class='list-item' v-for='item in planList' :key='item.id' @click='viewItem(item)'>
            <div class='icon'>
              <div class='tag-icon'>Unit</div>
            </div>
            <div class='search-content'>
              <div class='content-name'>
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class='list-item' v-for='item in taskList' :key='item.id' @click='viewItem(item)'>
            <div class='icon'>
              <div class='tag-icon'>Task</div>
            </div>
            <div class='search-content'>
              <div class='content-name'>
                {{ item.name }}
              </div>
            </div>
          </div>
        </div>
        <div class='searching' v-if='searching'>
          <a-spin>
            <a-icon slot="indicator" type="loading" style="font-size: 24px" spin tip='searching...' />
          </a-spin>
        </div>
      </div>
      <div class='bg-mask' @click='handleBack'></div>
    </div>

    <content-preview
      :content-id='previewCurrentId'
      :content-type='previewType'
      v-if='previewVisible'
      @close='handlePreviewClose' />
  </div>
</template>

<script>
import SearchIcon from '@/assets/v2/icons/search.svg?inline'
import { debounce } from 'lodash-es'
import { librarySearch } from '@/api/v2/library'
import ContentPreview from '@/components/Preview/ContentPreview'
import { ContentItemMixin } from '@/mixins/ContentItemMixin'

export default {
  name: 'GlobalSearchInput',
  components: { ContentPreview, SearchIcon },
  mixins: [ContentItemMixin],
  data() {
    return {
      data: null,
      searchKeyword: '',
      showSearchWrapper: false,

      searching: false,
      handleSearch: null,

      pdList: [],
      planList: [],
      similarList: [],
      taskList: [],

      historyList: []
    }
  },
  props: {
    schoolId: {
      type: String,
      default: '0'
    }
  },
  computed: {
    showSearchHistory () {
      return this.searchKeyword === null || this.searchKeyword.trim() === ''
    },
    showSearchRecommend () {
      return this.searchKeyword
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
      this.searchKeyword = ''
      this.recommendList = []
    },

    handleBack () {
      this.$logger.info('handleBack')
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
      librarySearch({
        key: value,
        schoolId: this.schoolId // library resource内容不一样
      }).then(response => {
        this.$logger.info('searchByKeyword ' + value, response)
        const list = []
        // 添加高亮标签
        const similarList = response.result.similarList
        this.pdList = response.result.pdList
        this.planList = response.result.planList
        this.taskList = response.result.taskList

        similarList.forEach(item => {
          if (item.name) {
            if (!list.some(i => i.name === item.name)) {
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
                tagName: tagName,
                id: item.id
              }
              list.push(tagItem)
            }
          }
        })
        this.similarList = similarList
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
      this.handleBack()
    },

    viewItem(item) {
      this.$logger.info('viewItem', item)
      const dataItem = {
        ...item,
        type: parseInt(item.fromType)
      }
      this.$logger.info('dataItem', item)
      this.showSearchWrapper = false
      this.$router.push({
        path: '/teacher/library-view/' + dataItem.type + '/' + dataItem.id
      })
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
    width: 35px;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-end;
    padding-right: 10px;
    cursor: pointer;
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

    .do-search, .list-item, .recommend-item {
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: flex-start;
      &:hover {
        background-color: #f8f8f8;
      }
      .icon {
        width: 80px;
        height: 50px;
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: center;

        .tag-icon {
          background: #f0f0f0;
          color: #aaa;
          border-radius: 5px;
          padding: 3px 6px;

        }
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

.searching {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding: 10px 0;
}
</style>
