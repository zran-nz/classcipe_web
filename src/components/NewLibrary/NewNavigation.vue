<template>
  <div class='nav-path-wrapper'>
    <div class='nav-path'>
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
  props: {
    currentCurriculum: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      navPath: [],
      curriculumLabel: null
    }
  },
  created() {
    console.info('NewNavigation')
  },
  watch: {
    navPath(newNavPath) {
      console.info('NewNavigation navPath changed', newNavPath)
      let path = this.curriculumLabel + '>'
      newNavPath.forEach((item) => {
        if (item && item.hasOwnProperty('name')) {
          path += item.name + '>'
        }
      })
      if (path.lastIndexOf('>') === path.length - 1) {
        path = path.substring(0, path.length - 1)
      }
      this.$emit('update-path', path)
    }
  },
  mounted() {
    LibraryEventBus.$on(LibraryEvent.ContentListUpdate, this.handleContentListUpdate)
    LibraryEventBus.$on(LibraryEvent.ChangeCurriculum, this.handleChangeCurriculum)

    this.getCurriculums()
  },
  destroyed() {
    LibraryEventBus.$off(LibraryEvent.ContentListUpdate, this.handleContentListUpdate)
    LibraryEventBus.$off(LibraryEvent.ChangeCurriculum, this.handleChangeCurriculum)
  },
  methods: {
    handleContentListUpdate(data) {
      console.info('handleContentListUpdate', data)
      const currentTreeItem = Object.assign({}, data)
      const navPathObjList = [currentTreeItem.parentTreeData, currentTreeItem.currentTreeData]
      let parentItem = currentTreeItem.parentTreeData
      while (parentItem && parentItem.parent) {
        navPathObjList.unshift(Object.assign({}, parentItem.parent))
        parentItem = parentItem.parent
      }
      this.navPath = navPathObjList
    },

    handleChangeCurriculum() {
      console.info('NewNavigation handleChangeCurriculum')
      this.navPath = []
    },

    handleLibraryNavClick(path) {
      console.info('handleLibraryNavClick ', path)
      LibraryEventBus.$emit(LibraryEvent.ContentListItemClick, {
        item: path,
        parent: path.parent
      })
    },

    getCurriculums() {
      getAllCurriculums().then((response) => {
        console.info('getAllCurriculums', response)
        if (response.success) {
          const currentCurriculumId = this.currentCurriculum ? this.currentCurriculum : this.$store.getters.bindCurriculum
          const curriculum = response.result.find(item => parseInt(item.id) === parseInt(currentCurriculumId))
          console.info('bindCurriculum', curriculum)
          if (curriculum) {
            this.curriculumLabel = curriculum.name
          }
        }
      })
    }
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
