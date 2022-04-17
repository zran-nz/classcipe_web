<template>
  <a-card :bordered="false">
    <div class="status-tab">
      <div class="toggle-mode-type-wrapper">
        <div class="toggle-mode-type">
          <div class="toggle-mode">
            <div
              v-for="(item,index) in tabsList"
              :key="'types'+index"
              :class="{'mode-item': true, 'active-mode' : currentTab === item.value}"
              @click="toggleTab(item.value)">
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>
      <a-space class="opt">
        <a-button @click="handleReset">Reset</a-button>
        <a-button type="primary" :loading="saveLoading" @click="handleSave">Save</a-button>
      </a-space>
    </div>
    <circulum-sel
      ref="CurriculumRef"
      v-show="currentTab === 'Curriculum'"
      :gradeOptions="gradeOptions"
      :school="currentSchool"
      @change="changeCurriculum"
      @save-success="() => successCb('pendingCurriculum')"
    />
    <subject-sel
      ref="SubjectRef"
      v-show="currentTab === 'Subject'"
      :gradeOptions="gradeOptions"
      :curriculum="currentCurriculum"
      :school="currentSchool"
      @change="changeSubjects"
      @save-success="() => successCb('pendingSubject')"
    />
    <div class="new-library" id="new-library" v-show="currentTab === 'Teaching'">
      <div class="library-title">Please uploade the achivement objectives for your school.</div>
      <div class="main-tree-content">
        <div class="tree-navigation">
          <new-tree-navigation
            :select-mode="selectMode"
            :question-index="questionIndex"
            :show-menu="showMenu"
            :default-active-menu="defaultActiveMenu"
            :default-curriculum-id="defaultCurriculumId"
            :only-subjects="changedSubjects"
          />
        </div>
        <div class="content-list">
          <new-content-list
            :selected-list="mySelectedList"
            :current-nav-path='currentNavPath'
            ref="contentList"
            @select-big-idea="handleSelectBigIdeaData"
            @select-sync="handleSelectListData"
            @select-curriculum="handleSelectCurriculumListData"
            @select-subject-specific-skill="handleSelectSubjectSpecificSkillListData"
            @select-century-skill="handleSelect21CenturySkillListData"
            @select-all-21-century="handleSelectAll21CenturyListData"
            @select-assessmentType="handleSelectAssessmentType"
            @select-idu="handleSelectIdu"
            @update-selected-list="handleUpdateSelectedList"
          />
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import CirculumSel from './circulum/CirculumSel'
import SubjectSel from './circulum/SubjectSel'
import { NavigationType } from '@/components/NewLibrary/NavigationType'
import NewTreeNavigation from '@/components/NewLibrary/NewTreeNavigation'
import NewContentList from '@/components/NewLibrary/NewContentList'
import { LibraryEvent, LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'
import { GradeGetAllGrades } from '@/api/grade'
import { mapState } from 'vuex'

export default {
  name: 'CirculumList',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    CirculumSel,
    SubjectSel,
    NewTreeNavigation,
    NewContentList
  },
  data() {
    return {
      currentTab: 'Curriculum',
      tabsList: [{
          value: 'Curriculum',
          title: 'Curriculum'
      },
      {
          value: 'Subject',
          title: 'Subject'
      }, {
          value: 'Teaching',
          title: 'Teaching contents'
      }],

      NavigationType: NavigationType,
      selectMode: '',
      questionIndex: '_circulumList_1',
      showMenu: [NavigationType.specificSkills,
                NavigationType.centurySkills,
                NavigationType.learningOutcomes,
                NavigationType.assessmentType,
                NavigationType.idu],
      defaultActiveMenu: NavigationType.learningOutcomes,
      currentNavPath: null,
      mySelectedList: [],
      selectedCurriculumList: [],
      selectedKnowledgeList: [],
      selected21CenturySkillList: [],
      selectedSubjectSpecificSkillList: [],
      selectedAssessmentList: [],
      selectedIduList: [],
      selectedAll21CenturyList: [],
      selectedBigIdeaList: [],
      selectedRecommendList: [],
      selectedRecommendIdList: [],
      currentCurriculum: null,
      defaultCurriculumId: null,
      gradeOptions: [],

      changedSubjects: [],
      pendingCurriculum: false,
      pendingSubject: false,
      saveLoading: false
    }
  },
  created() {
    GradeGetAllGrades().then(res => {
      if (res.success) {
        this.gradeOptions = res.result
      }
    })
    this.currentCurriculum = {
      curriculumId: this.currentSchool.curriculumId || this.bindCurriculum
    }
    this.defaultCurriculumId = this.currentSchool.curriculumId || this.bindCurriculum
  },
  computed: {
    ...mapState({
      bindCurriculum: state => state.user.bindCurriculum,
      currentSchool: state => state.user.currentSchool,
      userMode: state => state.app.userMode
    })
  },
  methods: {
    handleSchoolChange(currentSchool) {
      if (this.$refs['CurriculumRef']) {
        this.$refs['CurriculumRef'].initData()
      }
    },
    toggleTab(status) {
      this.currentTab = status
    },
    changeCurriculum(val) {
      this.currentCurriculum = { ...val }
      if (this.currentCurriculum.id) {
        LibraryEventBus.$emit(LibraryEvent.ChangeCurriculum, this.currentCurriculum.id)
        this.defaultCurriculumId = this.currentCurriculum.id
      }
    },
    changeSubjects(val) {
      console.log(val)
      this.changedSubjects = [...val]
      this.$refs.contentList.handleResetContentList()
    },
    updateSelectedGradeSet() {

    },
    handleReset() {
      this.tabsList.forEach(item => {
        if (this.$refs[item.value + 'Ref']) {
          this.$refs[item.value + 'Ref'].reset()
        }
      })
    },
    handleSave() {
      this.$confirm({
        title: 'Confirm save changes',
        content: 'Are you confirm save changes ?',
        centered: true,
        onOk: () => {
          this.saveLoading = true
          this.pendingCurriculum = true
          this.pendingSubject = true
          this.$refs['CurriculumRef'].handleSave()
          this.$refs['SubjectRef'].handleSave()
        }
      })
    },
    successCb(pending) {
      this[pending] = false
      if (!this.pendingCurriculum && !this.pendingSubject) {
        this.$message.success('Save successfully')
        this.saveLoading = false
      }
    },
    handleSelectBigIdeaData (data) {
      this.$logger.info('NewBrowser handleSelectBigIdeaData', data)
      this.selectedBigIdeaList = data
      this.$emit('select-big-idea', data)

      this.updateSelectedGradeSet()
    },
    handleSelectListData (data) {
      this.$logger.info('NewBrowser handleSelectListData', data)
      this.selectedKnowledgeList = data
      this.$emit('select-sync', data)
    },
    handleSelectCurriculumListData (data) {
      this.$logger.info('NewBrowser handleSelectCurriculumListData', data)
      this.selectedCurriculumList = data
      this.$emit('select-curriculum', data)

      this.updateSelectedGradeSet()
    },
    handleSelectSubjectSpecificSkillListData (data) {
      this.$logger.info('NewBrowser handleSelectSubjectSpecificSkillListData', data)
      this.selectedSubjectSpecificSkillList = data
      this.$emit('select-subject-specific-skill', data)

      this.updateSelectedGradeSet()
    },

    // century-skill
    handleSelect21CenturySkillListData (data) {
      this.$logger.info('NewBrowser handleSelect21CenturySkillListData', data)
      this.selected21CenturySkillList = data
      this.$emit('select-century-skill', data)

      this.updateSelectedGradeSet()
    },

    handleSelectAll21CenturyListData (data) {
      this.$logger.info('NewBrowser handleSelectAll21CenturyListData', data)
      this.selectedAll21CenturyList = data
      this.$emit('select-all-21-century', data)

      this.updateSelectedGradeSet()
    },
    // assessment type
    handleSelectAssessmentType (data) {
      this.$logger.info('NewBrowser handleSelectAssessmentType', data)
      this.selectedAssessmentList = data
      this.$emit('select-assessmentType', data)

      this.updateSelectedGradeSet()
    },

    handleSelectIdu (data) {
      this.$logger.info('NewBrowser handleSelectIdu', data)
      this.selectedIduList = data
      this.$emit('select-idu', data)

      this.updateSelectedGradeSet()
    },

    handleUpdateSelectedList (data) {
      this.$logger.info('NewBrowser handleUpdateSelectedList', data)
      this.mySelectedList = data

      this.updateSelectedGradeSet()
    }

  }
}
</script>
<style lang="less" scoped>
@import "~@/components/index.less";

.new-library {
  height: 600px;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  background: #fff;
  padding: 15px 20px;
  .library-title {
    line-height: 30px;
    color: #666;
    margin-bottom: 5px;
  }
  .main-tree-content {
    width: calc(100% - 90px);
    z-index: 150;
    position: absolute;
    transition: all 200ms ease-in;
    box-shadow: -3px 0 5px 0 rgba(31, 33, 44, 10%);
    overflow-y: hidden;
    height: 530px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .tree-navigation {
    z-index: 150;
    width: 400px;
    flex-shrink: 0;
    height: 100%;
    overflow-y: scroll;
    background-color: #fff;
  }

  .content-list {
    height: 100%;
    overflow: hidden;
    flex: 1;
  }
}
.status-tab {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  .toggle-mode-type-wrapper {
    width: 280px;
    box-sizing: border-box;
    .toggle-mode-type {
      height: 40px;
      display: inline-block;
      border-radius: 40px;
      background: rgba(228, 228, 228, 0.3);

      .toggle-mode {
        border-radius: 40px;
        height: 40px;
        display: flex;
        flex-direction: row;
        font-size: 14px;

        .mode-item {
          padding: 0 20px;
          font-size: 12px;
          height: 40px;
          color: rgba(17, 20, 45, 1);
          border-radius: 40px;
          font-family: Inter-Bold;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
        }

        .active-mode {
          color: #fff;
          background: rgba(21, 195, 154, 1);
        }
      }
    }
  }
}
</style>
