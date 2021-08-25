<template>
  <div class="new-tree-navigation">
    <new-tree-item
      :grade-list="gradeList"
      :tree-item-data="treeItemData"
      :tree-current-parent="null"
      :default-deep="0"
      :select-mode="selectMode"
      :question-index="questionIndex"
      :default-expand-status="treeItemData.expandStatus"
      :tree-item-type="treeItemData.type"
      :odd="index % 2 === 1"
      v-for="(treeItemData, index) in treeDataList"
      :key="index"/>
  </div>
</template>

<script>
import NewTreeItem from '@/components/NewLibrary/NewTreeItem'
import { NavigationType } from '@/components/NewLibrary/NavigationType'
// const { GetAllSdgs } = require('@/api/scenario')
const { GetMyGrades } = require('@/api/teacher')
const { SubjectTree } = require('@/api/subject')

export default {
  name: 'NewTreeNavigation',
  components: {
    NewTreeItem
  },
  props: {
    selectMode: {
      type: String,
      default: null
    },
    questionIndex: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      loaded: false,
      treeDataList: [],

      sdgList: [],
      subjectTree: [],
      gradeList: []
    }
  },
  created () {
    this.$logger.info('NewTreeNavigation selectMode', this.selectMode)
    const curriculumData = {
      id: '1',
      expandStatus: true,
      type: NavigationType.curriculum,
      name: 'Curriculum',
      children: [],
      parent: null
    }
    // const sdgData = {
    //   expandStatus: true,
    //   type: NavigationType.sdg,
    //   name: 'Sustainable development goal',
    //   children: [],
    //   parent: null
    // }
    Promise.all([
      SubjectTree({ curriculumId: this.$store.getters.bindCurriculum }),
      // GetAllSdgs(),
      GetMyGrades()
    ]).then((initDataResponse) => {
      this.$logger.info('initData done', initDataResponse)

      // SubjectTree
      this.$logger.info('SubjectTree Response ', initDataResponse[0])
      if (!initDataResponse[0].code) {
        this.subjectTree = initDataResponse[0].result
        curriculumData.children = initDataResponse[0].result
      }

      // // GetAllSdgs
      // this.$logger.info('GetAllSdgs Response ', initDataResponse[1])
      // if (!initDataResponse[1].code) {
      //   this.sdgList = initDataResponse[1].result
      //   this.sdgList.forEach(item => { item.children = [] })
      //   sdgData.children = this.sdgList
      // }

      // GetMyGrades
      this.$logger.info('GetMyGrades Response ', initDataResponse[1])
      if (!initDataResponse[1].code) {
        this.gradeList = initDataResponse[1].result
      }
    }).finally(() => {
      this.treeDataList.push(curriculumData)
      // this.treeDataList.push(sdgData)
      this.loaded = true
    })
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";

.new-tree-navigation {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #fff;
  overflow: scroll;
}
</style>
