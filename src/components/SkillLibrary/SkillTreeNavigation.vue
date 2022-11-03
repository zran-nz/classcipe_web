<template>
  <div class="new-tree-navigation">
    <skill-tree-item
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
import SkillTreeItem from '@/components/SkillLibrary/SkillTreeItem'
const { GetMyGrades } = require('@/api/teacher')

export default {
  name: 'NewTreeNavigation',
  components: {
    SkillTreeItem
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

      gradeList: []
    }
  },
  created () {
    console.info('NewTreeNavigation selectMode', this.selectMode)
    const skillData = {
      id: '1',
      expandStatus: true,
      name: 'Grade',
      children: [],
      parent: null
    }

    GetMyGrades().then(response => {
      const gradeList = response.result
      gradeList.forEach(item => {
        item.children = []
      })
      this.gradeList = gradeList
      skillData.children = gradeList
    }).finally(() => {
      this.treeDataList.push(skillData)
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
