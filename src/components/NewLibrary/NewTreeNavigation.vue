<template>
  <div class="new-tree-navigation">
    <new-tree-item
      :grade-list="gradeList"
      :tree-item-data="treeItemData"
      :tree-current-parent="null"
      :default-deep="0"
      :current-item-type="treeItemData.type === NavigationType.learningOutcomes ? 'subject' : // 如果当前是大纲，那么第一层数据是不区分层级的subject
        (treeItemData.type === NavigationType.sync ? 'sync' : // 如果是sync第一次是外部的同步数据列表
          (treeItemData.type === NavigationType.specificSkills ? 'subject' : ( // 如果是specificSkills，那么第一层数据是subject，注意subject只有一层
            (treeItemData.type === NavigationType.centurySkills ? 'grade' : 'none' // 如果是centurySkills，那么第一层数据是grade年级列表
            ))))"
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

      // GetMyGrades
      this.$logger.info('GetMyGrades Response ', initDataResponse[1])
      if (!initDataResponse[1].code) {
        this.gradeList = initDataResponse[1].result
      }

      // SubjectTree
      this.$logger.info('SubjectTree Response ', initDataResponse[0])
      if (!initDataResponse[0].code) {
        this.subjectTree = initDataResponse[0].result
        curriculumData.children = initDataResponse[0].result
        // 兼容新的任意层级,任意一个层级下一层都会可能是gradeList
        this.addGradeListProperty(curriculumData.children)
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
        // 从大纲数据中复制一份数据，只用mainSubject既第一层
        curriculumData.children.forEach(subjectItem => {
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
          gradeList: [],
          parent: null
        }
        this.gradeList.forEach(gradeItem => {
          gradeItem.isGrade = true
          gradeItem.children = []
          centurySkillsData.gradeList.push(Object.assign({}, gradeItem))
          centurySkillsData.children.push(Object.assign({}, gradeItem))
        })
        this.treeDataList.push(centurySkillsData)

        this.$logger.info('after handle treeDataList', this.treeDataList)
      }
      this.loaded = true
    })
  },
  methods: {
    // 给任意层级的数据先增加gradeList属性，然后直接给vue进行监测数据更新。避免数据操作过程中加数据，太麻烦
    addGradeListProperty (list) {
      list.forEach(item => {
        if (!item.hasOwnProperty('gradeList')) {
          item.gradeList = []
          this.gradeList.forEach(gradeItem => {
            gradeItem.children = []
            gradeItem.isGrade = true
            item.gradeList.push(Object.assign({}, gradeItem))
          })
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
