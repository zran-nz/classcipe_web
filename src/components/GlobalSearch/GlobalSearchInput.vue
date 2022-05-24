<template>
  <div class='global-search-input'>
    <a-input
      @click.native.stop='showSearchWrapper = true'
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
          <input v-model='searchKeyword' @keyup.native='handleSearch' placeholder='Search...' />
        </div>
        <div class='search-clear'>
          <a-icon type='close' @click='handleSearchClear' />
        </div>
      </div>
      <div class='search-recommend-list'>
        <div class='do-search' v-show='searchKeyword'>
          <div class='icon'>
            <a-icon type="search" :style="{color: '#999', fontSize: '16px'}" />
          </div>
          <div class='search-content'>
            Search "<span class='bold'>{{ searchKeyword }}</span>"
          </div>
        </div>
        <div class='search-history' v-show='showSearchHistory'>
          <div class='history-item' v-for='historyItem in historyList' :key='historyItem.name'>
            <div class='icon'>
              <a-icon type="clock-circle" theme="filled" :style="{color: '#999', fontSize: '16px'}" />
            </div>
            <div class='search-content'>
              {{ historyItem.name }}
            </div>
          </div>
        </div>
        <div class='recommend-list' v-show='showSearchRecommend'>
          <div class='history-item' v-for='recommendItem in recommendList' :key='recommendItem.name'>
            <div class='icon'>
              <a-icon type="star" theme="filled" :style="{color: '#999', fontSize: '16px'}" />
            </div>
            <div class='search-content'>
              {{ recommendItem.name }}
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

export default {
  name: 'GlobalSearchInput',
  components: { SearchIcon },
  data() {
    return {
      data: null,
      searchKeyword: null,
      showSearchWrapper: false,

      searching: false,
      handleSearch: null,

      showSearchHistory: true,
      showSearchRecommend: false,

      historyList: [
        {
          name: 'Search history1'
        },
        {
          name: 'Search history2'
        }
      ],
      recommendList: [
        {
          name: 'Search recommend1'
        },
        {
          name: 'Search recommend2'
        }
      ]
    }
  },
  created() {
    this.handleSearch = debounce(this.searchByInput, 1000)
  },
  methods: {
    searchByInput () {
      this.$emit('search', {
        keyword: this.searchKeyword
      })
    },
    handleSearchClear () {
    },

    handleBack () {
      this.showSearchWrapper = false
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
      .search-content {
        color: #999;
        padding-right: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: nowrap;
      }
    }
  }

  .bg-mask {
    background: rgba(0,0,0,.3);
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
