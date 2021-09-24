<template>
  <div class="new-tree-navigation">
    <new-tree-item
      :grade-list="gradeList"
      :tree-item-data="treeItemData"
      :tree-current-parent="null"
      :default-deep="0"
      :current-item-type="treeItemData.type === NavigationType.learningOutcomes ? 'subject' : 'sync'"
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
    },
    syncData: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      loaded: false,
      treeDataList: [],
      NavigationType: NavigationType,

      sdgList: [],
      subjectTree: [],
      gradeList: []
    }
  },
  created () {
    this.$logger.info('NewTreeNavigation selectMode', this.selectMode)
    const skillCategory = this.$store.getters.skillCategory
    this.$logger.info('NewTreeNavigation skillCategory', skillCategory)
    const curriculumData = {
      id: '1',
      expandStatus: true,
      type: NavigationType.learningOutcomes,
      name: skillCategory.length === 3 ? skillCategory[0] : 'Curriculum',
      children: [],
      parent: null
    }
    const syncData = {
      expandStatus: true,
      type: NavigationType.sync,
      name: 'Sync assessment objectives with linked content',
      children: [],
      parent: null
    }
    if (this.syncData && this.syncData.length) {
      syncData.children = this.syncData
      this.treeDataList.push(syncData)
      this.$logger.info('syncData treeDataList', this.treeDataList)
    } else {
      this.$logger.info('no sync data, ignore it')
    }
    Promise.all([
      SubjectTree({ curriculumId: this.$store.getters.bindCurriculum }),
      GetMyGrades()
    ]).then((initDataResponse) => {
      this.$logger.info('initData done', initDataResponse)

      // SubjectTree
      this.$logger.info('SubjectTree Response ', initDataResponse[0])
      if (!initDataResponse[0].code) {
        this.subjectTree = initDataResponse[0].result
        curriculumData.children = initDataResponse[0].result
        // 兼容新的任意层级,任意一个层级下一层都会可能是gradeList
        this.addGradeListProperty(curriculumData.children)
      }

      // GetMyGrades
      this.$logger.info('GetMyGrades Response ', initDataResponse[1])
      if (!initDataResponse[1].code) {
        this.gradeList = initDataResponse[1].result
      }
    }).finally(() => {
      this.treeDataList.push(curriculumData)
      if (skillCategory.length === 3) {
        // subject specific skills 是mainSubject-year-knowledge
        const specificSkillsData = {
          id: '1',
          expandStatus: true,
          type: NavigationType.specificSkills,
          name: skillCategory[1],
          children: [],
          parent: null
        }
        this.subjectTree.forEach(subjectItem => {
          specificSkillsData.children.push(Object.assign({}, subjectItem))
        })
        this.treeDataList.push(specificSkillsData)

        // 21 century skills 是year-knowledge
        const centurySkillsData = {
          id: '1',
          expandStatus: true,
          type: NavigationType.centurySkills,
          name: skillCategory[2],
          children: [],
          parent: null
        }
        this.gradeList.forEach(gradeItem => {
          gradeItem.isGrade = true
          centurySkillsData.children.push(Object.assign({}, gradeItem))
        })
        this.treeDataList.push(centurySkillsData)

        this.$logger.info('after handle treeDataList', this.treeDataList)
      }
      this.loaded = true
    })
  },
  methods: {
    addGradeListProperty (list) {
      list.forEach(item => {
        if (!item.hasOwnProperty('gradeList')) {
          item.gradeList = []
        }
        this.addGradeListProperty(item.children)
      })
    }
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
