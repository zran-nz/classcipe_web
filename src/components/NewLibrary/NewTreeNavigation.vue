<template>
  <div class="new-tree-navigation">
    <new-tree-item
      v-show="loaded"
      :grade-list="gradeList"
      :tree-item-data="treeItemData"
      :tree-current-parent="null"
      :default-deep="0"
      :class="{
        'browser-hide-menu': showMenu.indexOf(treeItemData.type) === -1,
        'tree-item-type' : true
      }"
      :style="{
        'background': treeItemData.backgroundColor
      }"
      :current-item-type="treeItemData.type === NavigationType.learningOutcomes ? 'subject' : // 如果当前是大纲，那么第一层数据是不区分层级的subject
        (treeItemData.type === NavigationType.sync ? 'sync' : // 如果是sync第一次是外部的同步数据列表
          ((treeItemData.type === NavigationType.specificSkills || treeItemData.type === NavigationType.assessmentType) ? 'subject' : ( // 如果是specificSkills或assessmentType，那么第一层数据是subject，注意subject只有一层
            ((treeItemData.type === NavigationType.centurySkills || NavigationType.AUGeneralCapabilities || NavigationType.NZKeyCompetencies) ? 'grade' : ( // 如果是centurySkills，那么第一层数据是grade年级列表
              treeItemData.type === NavigationType.sdg ? 'sdg' : ( // 如果是sdg，那么第一层数据是sdg列表, 结构：sdg列表-keywords-big idea
                treeItemData.type === NavigationType.all21Century ? 'all21Century' : (
                  treeItemData.type === NavigationType.idu ? 'grade' : 'none'
                ) // 如果是all21Century，那么直接遍历children
              )
            )
            ))))"
      :select-mode="selectMode"
      :question-index="questionIndex"
      :default-expand-status="treeItemData.expandStatus"
      :tree-item-type="treeItemData.type"
      :data-item-type="treeItemData.type"
      :odd="index % 2 === 1"
      v-for="(treeItemData, index) in treeDataList"
      :key="index"/>
    <div class="loading-spin">
      <a-spin v-show="!loaded" />
    </div>
  </div>
</template>

<script>
import NewTreeItem from '@/components/NewLibrary/NewTreeItem'
import { getAll21Century } from '@/api/knowledge'
import { NavigationType } from '@/components/NewLibrary/NavigationType'

import { SubjectType } from '@/const/common'
import storage from 'store'
import { GRADE_COMMON } from '@/store/mutation-types'
import { GetGradesByCurriculumId } from '@/api/preference'
const { GetAllSdgs } = require('@/api/scenario')
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
    },
    showMenu: {
      type: Array,
      default: () => []
    },
    defaultActiveMenu: {
      type: String,
      default: null
    },
    defaultCurriculumId: {
      type: String,
      default: null
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
  watch: {
    defaultCurriculumId (val) {
      this.$logger.info('defaultCurriculumId change ' + val)
      this.loaded = false
      this.treeDataList = []
      this.sdgList = []
      this.subjectTree = []
      this.gradeList = []
      this.initData()
    }
  },
  created () {
    this.$logger.info('NewTreeNavigation selectMode', this.selectMode)
    this.initData()
  },
  methods: {
    initData () {
      const skillCategory = this.$store.getters.skillCategory
      this.$logger.info('NewTreeNavigation skillCategory ', skillCategory)
      this.$logger.info('NewTreeNavigation defaultActiveMenu ' + this.defaultActiveMenu)
      const curriculumData = {
        id: '1',
        expandStatus:false,
        type: NavigationType.learningOutcomes,
        name: skillCategory.length === 3 ? skillCategory[0] : 'Curriculum',
        children: [],
        parent: null,
        sort: 2,
        backgroundColor: '#B1D1CC'
      }
      const sdgData = {
        expandStatus:false,
        type: NavigationType.sdg,
        name: 'Big ideas',
        children: [],
        parent: null,
        sort: 2,
        backgroundColor: 'fade(@primary-color, 10%)'
      }
      const syncData = {
        expandStatus:false,
        type: NavigationType.sync,
        name: 'Sync assessment objectives with linked content',
        children: [],
        parent: null,
        sort: 2,
        backgroundColor: 'rgba(19, 194, 194, 0.2)'
      }
      const all21CenturyData = {
        id: '1',
        expandStatus:false,
        type: NavigationType.all21Century,
        name: 'all21Century',
        children: [],
        parent: null,
        sort: 2,
        backgroundColor: '#D7E0E9'
      }
      if (this.syncData && this.syncData.length) {
        syncData.children = this.syncData
        this.treeDataList.push(syncData)
        this.$logger.info('syncData treeDataList', this.treeDataList)
      } else {
        this.$logger.info('no sync data, ignore it')
      }
      Promise.all([
        SubjectTree({ curriculumId: this.defaultCurriculumId ? this.defaultCurriculumId : this.$store.getters.bindCurriculum }),
        GetGradesByCurriculumId({ curriculumId: this.defaultCurriculumId ? this.defaultCurriculumId : this.$store.getters.bindCurriculum }),
        GetAllSdgs(),
        getAll21Century()
      ]).then((initDataResponse) => {
        this.$logger.info('initData done', initDataResponse)

        // GetMyGrades
        this.$logger.info('GetMyGrades Response ', initDataResponse[1])
        if (!initDataResponse[1].code) {
          this.gradeList = initDataResponse[1].result
          // 将grade名称和21century grade名称对应起来
          const gradeJson = {}
          this.gradeList.forEach(grade => {
            if (!gradeJson[grade.centuryName]) gradeJson[grade.centuryName] = []
            gradeJson[grade.centuryName].push(grade.name)
          })
          storage.set(GRADE_COMMON, gradeJson)
        }

        // SubjectTree
        this.$logger.info('SubjectTree Response ', initDataResponse[0])
        if (!initDataResponse[0].code) {
          this.subjectTree = initDataResponse[0].result
          // subjectType=1 大纲subject
          curriculumData.children = initDataResponse[0].result.filter(sub => sub.subjectType === SubjectType.Learn || sub.subjectType === SubjectType.LearnAndSkill)
          // 兼容新的任意层级,任意一个层级下一层都会可能是gradeList
          this.addGradeListProperty(this.subjectTree)
        }

        // GetAllSdgs
        this.$logger.info('GetAllSdgs Response ', initDataResponse[2])
        if (!initDataResponse[2].code) {
          this.sdgList = initDataResponse[2].result
          this.sdgList.forEach(item => { item.children = [] })
          sdgData.children = this.sdgList
        }

        // getAll21Century
        this.$logger.info('getAll21Century Response ', initDataResponse[3])
        if (!initDataResponse[3].code) {
          const list = initDataResponse[3].result
          this.addParentObjListProperty(list, null)
          all21CenturyData.children = list
          this.$logger.info('all21CenturyData addParentObjListProperty', all21CenturyData)
        }
      }).finally(() => {
        this.treeDataList.push(curriculumData)
        this.treeDataList.push(sdgData)

        if (skillCategory.length === 3) {
          // Achievement objectives 是mainSubject-year-knowledge
          const specificSkillsData = {
            id: '3',
            expandStatus:false,
            type: NavigationType.specificSkills,
            name: skillCategory[1],
            children: [],
            parent: null,
            sort: 0,
            backgroundColor: '#ffecd2'
          }
          // 从大纲数据中复制一份数据，只用mainSubject既第一层 且subjectType=2
          this.subjectTree.forEach(subjectItem => {
            if (subjectItem.subjectType === SubjectType.Skill || subjectItem.subjectType === SubjectType.LearnAndSkill) {
              specificSkillsData.children.push(JSON.parse(JSON.stringify(subjectItem)))
            }
          })
          // skill放第一位
          this.treeDataList.unshift(specificSkillsData)

          // IB大纲4、5
          if (parseInt(this.defaultCurriculumId) === 4 || parseInt(this.defaultCurriculumId) === 5) {
            // iduData 是year-idu list
            const iduData = {
              id: '6',
              expandStatus:false,
              type: NavigationType.idu,
              name: 'Integrated Subject Skill',
              children: [],
              gradeList: [],
              parent: null,
              sort: 1,
              backgroundColor: 'rgba(253, 238, 218, 0.2)'
            }
            this.gradeList.forEach(gradeItem => {
              gradeItem.isGrade = true
              gradeItem.children = []
              iduData.gradeList.push(JSON.parse(JSON.stringify(gradeItem)))
              iduData.children.push(JSON.parse(JSON.stringify(gradeItem)))
            })
            this.treeDataList.push(iduData)
          }

          // 隐藏assessmentType
          // assessmentTypeData 是mainSubject-year-knowledge
          // const assessmentTypeData = {
          //   id: '4',
          //   expandStatus: NavigationType.assessmentType === this.defaultActiveMenu,
          //   type: NavigationType.assessmentType,
          //   name: 'Assessment type',
          //   children: [],
          //   parent: null
          // }
          // 从大纲数据中复制一份数据，assessmentTypeData也只用mainSubject既第一层
          // this.subjectTree.forEach(subjectItem => {
          //   if (subjectItem.subjectType === SubjectType.Skill || subjectItem.subjectType === SubjectType.LearnAndSkill) {
          //     assessmentTypeData.children.push(JSON.parse(JSON.stringify(subjectItem)))
          //   }
          // })
          // this.treeDataList.push(assessmentTypeData)

          // 21 century skills 是year-knowledge
          const centurySkillsData = {
            id: '5',
            expandStatus:false,
            type: NavigationType.centurySkills,
            name: skillCategory[2],
            children: [],
            gradeList: [],
            parent: null,
            sort: 2,
            backgroundColor: '#D7E0E9'
          }
          this.gradeList.forEach(gradeItem => {
            gradeItem.isGrade = true
            gradeItem.children = []
            centurySkillsData.gradeList.push(Object.assign({}, gradeItem))
            centurySkillsData.children.push(Object.assign({}, gradeItem))
          })
          this.treeDataList.push(centurySkillsData)

          /**
           *  NZ和AU对21 century叫法不同NZ-Key competencies、AU-General capabilities，内容逻辑一样
           *  NZKeyCompetencies: 'NZ-Key competencies',
           *   AUGeneralCapabilities: 'AU-General capabilities',
           */
          if (parseInt(this.defaultCurriculumId) === 2) {
            const nZKeyCompetenciesData = {
              id: '51',
              expandStatus:false,
              type: NavigationType.NZKeyCompetencies,
              name: 'NZ-Key competencies',
              children: [],
              gradeList: [],
              parent: null,
              backgroundColor: 'rgba(83, 196, 28, 0.2)'
            }
            this.gradeList.forEach(gradeItem => {
              gradeItem.isGrade = true
              gradeItem.children = []
              nZKeyCompetenciesData.gradeList.push(JSON.parse(JSON.stringify(gradeItem)))
              nZKeyCompetenciesData.children.push(JSON.parse(JSON.stringify(gradeItem)))
            })
            this.treeDataList.push(nZKeyCompetenciesData)
          }

          if (parseInt(this.defaultCurriculumId) === 1) {
            const aUGeneralCapabilities = {
              id: '52',
              expandStatus:false,
              type: NavigationType.AUGeneralCapabilities,
              name: 'AU-General capabilities',
              children: [],
              gradeList: [],
              parent: null,
              sort: 2,
              backgroundColor: 'rgba(83, 196, 28, 0.2)'
            }
            this.gradeList.forEach(gradeItem => {
              gradeItem.isGrade = true
              gradeItem.children = []
              aUGeneralCapabilities.gradeList.push(JSON.parse(JSON.stringify(gradeItem)))
              aUGeneralCapabilities.children.push(JSON.parse(JSON.stringify(gradeItem)))
            })
            this.treeDataList.push(aUGeneralCapabilities)
          }

          // evaluation 表格选择用
          this.treeDataList.push(all21CenturyData)

          this.$logger.info('after handle treeDataList', this.treeDataList)
        }

        this.treeDataList = this.treeDataList.sort((a, b) => a.sort - b.sort)
        this.$logger.info('sort treeDataList', this.treeDataList)
        this.loaded = true
      })
    },
    // 给任意层级的数据先增加gradeList属性，然后直接给vue进行监测数据更新。避免数据操作过程中加数据，太麻烦
    addGradeListProperty (list) {
      list.forEach(item => {
        if (!item.hasOwnProperty('gradeList')) {
          item.gradeList = []
          item.gradeList.forEach(gradeItem => {
            gradeItem.children = []
            gradeItem.isGrade = true
            item.gradeList.push(Object.assign({}, gradeItem))
          })
        }
        this.addGradeListProperty(item.children)
      })
    },

    // 给任意层级的数据先增加parentObj属性，方便evaluation的表格选择criteria时获取上级的内容
    addParentObjListProperty (list, parent) {
      list.forEach(item => {
        if (!item.hasOwnProperty('parentObj')) {
          item.parentObj = parent
          item.children.forEach(subItem => {
            subItem.parentObj = item
          })
        }
        this.addParentObjListProperty(item.children, item)
      })
    }
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";

.new-tree-navigation {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #fff;
  overflow: scroll;
  position: relative;
  min-height: 400px;
}

.loading-spin {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -20px;
  height: 40px;
  width: 40px;
}

.browser-hide-menu {
  display: none;
}

</style>
