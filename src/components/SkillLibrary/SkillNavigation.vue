<template>
  <div class="nav-path-wrapper">
    <div class="nav-path">
      <div class="nav-path-item" v-for="(path,index) in navPath" :key="index" @click="handleSkillLibraryNavClick(path)">
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
import { SkillLibraryEvent, SkillLibraryEventBus } from '@/components/SkillLibrary/SkillLibraryEventBus'
export default {
  name: 'SkillNavigation',
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
    SkillLibraryEventBus.$on(SkillLibraryEvent.SkillContentListUpdate, this.handleSkillContentListUpdate)
  },
  methods: {
    handleSkillContentListUpdate (data) {
      this.$logger.info('handleSkillContentListUpdate', data)
      const currentTreeItem = Object.assign({}, data)
      this.$logger.info('NewNavigation handleSkillContentListUpdate ', currentTreeItem)
      const navPathObjList = [currentTreeItem.parentTreeData, currentTreeItem.currentTreeData]
      let parentItem = currentTreeItem.parentTreeData
      while (parentItem && parentItem.parent) {
        navPathObjList.unshift(Object.assign({}, parentItem.parent))
        parentItem = parentItem.parent
      }
      this.$logger.info('nav path list', navPathObjList)
      this.navPath = navPathObjList
    },

    handleSkillLibraryNavClick (path) {
      this.$logger.info('handleSkillLibraryNavClick ', path)
      SkillLibraryEventBus.$emit(SkillLibraryEvent.SkillContentListItemClick, {
        item: path,
        parent: path.parent
      })
    }
  },
  destroyed () {
    SkillLibraryEventBus.$off(SkillLibraryEvent.SkillContentListUpdate, this.handleSkillContentListUpdate)
    this.$logger.info('off NewNavigation handleSkillContentListUpdate handler')
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
    flex-wrap: wrap;
    flex-direction: row;
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

      &:hover {
        background-color: #eee;
        border-radius: 5px;
      }
    }
  }
}
</style>
