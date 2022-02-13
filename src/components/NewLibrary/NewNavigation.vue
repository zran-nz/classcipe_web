<template>
  <div class='nav-path-wrapper'>
    <div class='nav-path'>
      <div class='nav-path-item' v-show='curriculumLabel && navPath.length'>
        {{ curriculumLabel }}
      </div>
      <div v-for='(path,index) in navPath' :key='index' class='nav-path-item' @click='handleLibraryNavClick(path)' v-if='path'>
        <template v-if='path.name && path.name.length > 20'>
          <a-tooltip :mouseEnterDelay='1'>
            <template slot='title'>
              {{ path.name }}
            </template>
            <a-icon type='right' />
            {{ path.name }}
          </a-tooltip>
        </template>
        <template v-else>
          <a-icon type='right' />
          {{ path.name }}
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { LibraryEvent, LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'
import { getAllCurriculums } from '@/api/preference'

export default {
  name: 'NewNavigation',
  components: {},
  data() {
    return {
      navPath: [],
      curriculumLabel: null
    }
  },
  computed: {},
  created() {
    this.$logger.info('NewNavigation')
    this.getCurriculums()
  },
  mounted() {
    LibraryEventBus.$on(LibraryEvent.ContentListUpdate, this.handleContentListUpdate)
  },
  methods: {
    handleContentListUpdate(data) {
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

    handleLibraryNavClick(path) {
      this.$logger.info('handleLibraryNavClick ', path)
      LibraryEventBus.$emit(LibraryEvent.ContentListItemClick, {
        item: path,
        parent: path.parent
      })
    },
    getCurriculums() {
      getAllCurriculums().then((response) => {
        this.$logger.info('getAllCurriculums', response)
        if (response.success) {
          const curriculum = response.result.find(item => parseInt(item.id) === parseInt(this.$store.getters.bindCurriculum))
          this.$logger.info('bindCurriculum', curriculum)
          if (curriculum) {
            this.curriculumLabel = curriculum.name
          }
        }
      })
    }
  },
  destroyed() {
    LibraryEventBus.$off(LibraryEvent.ContentListUpdate, this.handleContentListUpdate)
    this.$logger.info('off NewNavigation ContentListUpdate handler')
  }
}
</script>

<style lang='less' scoped>

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
      margin-right: 3px;
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
