<template>
  <div class="nav-path-wrapper">
    <div class="nav-path">
      <div class="nav-path-item" v-for="(path,index) in navPath" :key="index" @click="handleLibraryNavClick(path)">
        <template v-if="path">
          <template v-if="path.name && path.name.length > 20">
            <a-tooltip :mouseEnterDelay="1">
              <template slot="title">
                {{ path.name }}
              </template>
              <a-icon type="right" /> {{ path.name }}
            </a-tooltip>
          </template>
          <template v-else>
            <a-icon type="right" />  {{ path.name }}
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { LibraryEvent, LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'
export default {
  name: 'NewNavigation',
  components: {
  },
  data () {
    return {
      navPath: []
    }
  },
  computed: {
  },
  created () {
    this.$logger.info('NewNavigation')
  },
  mounted () {
    LibraryEventBus.$on(LibraryEvent.ContentListUpdate, this.handleContentListUpdate)
  },
  methods: {
    handleContentListUpdate (data) {
      this.$logger.info('handleContentListUpdate', data)
      const currentTreeItem = Object.assign({}, data)
      const navPathObjList = [currentTreeItem.parentTreeData, currentTreeItem.currentTreeData]
      let parentItem = currentTreeItem.parentTreeData
      while (parentItem && parentItem.parent) {
        navPathObjList.unshift(Object.assign({}, parentItem.parent))
        parentItem = parentItem.parent
      }
      this.navPath = navPathObjList
    },

    handleLibraryNavClick (path) {
      this.$logger.info('handleLibraryNavClick ', path)
      LibraryEventBus.$emit(LibraryEvent.ContentListItemClick, {
        item: path,
        parent: path.parent
      })
    }
  },
  destroyed () {
    LibraryEventBus.$off(LibraryEvent.ContentListUpdate, this.handleContentListUpdate)
    this.$logger.info('off NewNavigation ContentListUpdate handler')
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";

.nav-path-wrapper {
  display: flex;
  min-height: 25px;
  margin-bottom: 5px;
  .nav-path {
    line-height: 25px;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
    justify-content: flex-start;
    .nav-path-item {
      line-height: 25px;
      :nth-child(0) {
        padding: 0 3px 0 0;
      }
      padding: 0 3px 0 3px;
      color: @primary-color;
      font-weight: 600;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
      cursor: pointer;

      //&:hover {
      //  background-color: #eee;
      //  border-radius: 5px;
      //}
    }
  }
}
</style>
