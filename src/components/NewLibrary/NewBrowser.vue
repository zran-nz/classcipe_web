<template>
  <div class="new-library" id="new-library">
    <div class="navigation">
      <new-navigation />
    </div>
    <div class="main">
      <div class="tree-navigation">
        <new-tree-navigation
          :select-mode="selectMode"
          :question-index="questionIndex"
          :sync-data="syncData"
        />
      </div>
      <div class="content-list">
        <new-content-list @select-sync="handleSelectListData"/>
      </div>
    </div>
  </div>
</template>

<script>

import NewNavigation from '@/components/NewLibrary/NewNavigation'
import NewContentList from '@/components/NewLibrary/NewContentList'
import NewTreeNavigation from '@/components/NewLibrary/NewTreeNavigation'

export default {
  name: 'NewBrowser',
  components: {
    NewNavigation,
    NewContentList,
    NewTreeNavigation
  },
  props: {
    selectMode: {
      type: String,
      default: null
    },
    questionIndex: {
      type: String,
      default: null
    },
    syncData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    }
  },
  created () {
    this.$logger.info('NewBrowser selectMode', this.selectMode)
  },
  mounted () {
  },
  methods: {
    handleSelectListData (data) {
      this.$logger.info('NewBrowser handleSelectListData', data)
      this.$emit('select-sync', data)
    }
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";

.new-library {
  .navigation {}
  .main {
    border: 1px solid #e9e9e9;
    overflow-y: hidden;
    height: calc(100vh - 200px);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    .tree-navigation {
      width: 400px;
      flex-shrink: 0;
      height: 100%;
      overflow-y: scroll;
    }
    .content-list {
      height: 100%;
      overflow: hidden;
      flex: 1;
    }
  }

  *::-webkit-scrollbar {
    width: 3px;
    height: 0;
  }
  *::-webkit-scrollbar-track {
    border-radius: 1px;
    background: rgba(0,0,0,0.00);
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
  }
  /* 滚动条滑块 */
  *::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: rgba(0,0,0,0.12);
    -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
  }
}
</style>
