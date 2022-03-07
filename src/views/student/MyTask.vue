<template>
  <div class="my-content">
    <div class="filter-line">
      <div class="status-tab">
        <div class="toggle-mode-type-wrapper">
          <div class="toggle-mode-type">
            <div class="toggle-mode">
              <div :class="{'mode-item': true, 'active-mode' : currentStatus === ''}" @click="toggleStatus('')">
                {{ $t('teacher.my-content.all-status') }}
              </div>
              <div
                v-for="(item,index) in statusList"
                :key="'status'+index"
                :class="{'mode-item': true, 'active-mode' : currentStatus === item.value}"
                @click="toggleStatus(item.value)">
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="type-owner">
        <div class="my-search">
          <a-input-search
            placeholder="Search"
            v-model="searchText"
            @search="triggerSearch"
            @pressEnter="triggerSearch"
            :allowClear="true"
            size="large"
          >
          </a-input-search>
        </div>
        <!-- <div class="filter-icon" @click="showFilter = !showFilter">
          <div class="filter-item">
            <filter-icon class="filter-icon" />
            <filter-active-icon class="filter-active-icon"/>
            <div class="filter-label">
              Filter
            </div>
          </div>
        </div> -->
        <div class="filter-option">
          <a-select
            v-model="filterParams.subject"
            mode="multiple"
            class="filter-item"
            allowClear
            size="large"
            @change="handleChangeSubject"
            placeholder="Search by subject"
          >
            <a-select-option :value="item.value" v-for="(item, index) in filterSubjectOptions" :key="'subject_'+index">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <div class="view-mode-toggle">
          <div class="view-mode">
            <div :class="{'view-mode-item': true, 'active-view': viewMode === 'img'}" @click="toggleViewMode('img')">
              <pubu-svg />
            </div>
            <div :class="{'view-mode-item': true, 'active-view': viewMode === 'list'}" @click="toggleViewMode('list')">
              <liebiao-svg />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-if="showFilter">
      <div class="filter-params">
        <filter-content
          @filter-config-update="handleUpdateFilterConfig"
          :filter-config="filterConfig"
          :age-options="filterAgeOptions"
          :period-options="filterPeriodOptions"
          :subject-options="filterSubjectOptions"
          :filter-fa-options="filterFaOptions"
          :filter-sa-options="filterSaOptions"
          :filter-activity-options="filterActivityOptions"
        />
      </div>
      <div class="expand-icon" v-if="showFilter" @click="showFilter = !showFilter">
        <a-icon type="up-circle" theme="filled" title="Collapse filter" /> Close
      </div>
    </div> -->
    <my-task-list
      :loadData="loadData"
      :viewMode="viewMode"
      :status="currentStatus"
      ref="myTaskList"
    >
    </my-task-list>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { CustomTagType, StudentStudyTaskStatus, CurriculumType, SESSION_VIEW_MODE, STUDY_MODE, TASK_STATUS } from '@/const/common'

import MyTaskList from '@/components/Student/MyTaskList'

import LiebiaoSvg from '@/assets/svgIcon/myContent/liebiao.svg?inline'
import PubuSvg from '@/assets/svgIcon/myContent/pubu.svg?inline'
import FilterIcon from '@/assets/libraryv2/filter.svg?inline'
import FilterActiveIcon from '@/assets/libraryv2/filter_active.svg?inline'
import CollaborateSvg from '@/assets/icons/collaborate/collaborate_group.svg?inline'

import { SelfStudyTaskList } from '@/api/selfStudy'
import { FindCustomTags } from '@/api/tag'
import { SubjectTree } from '@/api/subject'
import { GetGradesByCurriculumId } from '@/api/preference'

import { StudyModeMixin } from '@/mixins/StudyModeMixin'

import storage from 'store'
import { mapState } from 'vuex'

export default {
  name: 'MyTask',
  mixins: [StudyModeMixin],
  components: {
    FilterIcon,
    FilterActiveIcon,
    LiebiaoSvg,
    PubuSvg,
    CollaborateSvg,
    MyTaskList
  },
  data() {
    return {
      loading: true,
      startLoading: false,
      currentStatus: '',
      STUDY_MODE: STUDY_MODE,
      TASK_STATUS: TASK_STATUS,
      // 当前选中的配置项
      filterConfig: {
        age: [],
        subject: [],
        period: '',
        faSaActivityType: '',
        unitType: '',
        projectBased: '',
        faTags: [],
        saTags: [],
        activityTags: []
      },
      filterSubjectOptions: [],
      filterAgeOptions: [],
      filterPeriodOptions: [],
      filterSaOptions: [],
      filterFaOptions: [],
      filterActivityOptions: [],
      showFilter: false,
      filterParams: {
        subject: []
      },
      lastedRevisionId: '',
      searchText: '',
      viewMode: storage.get(SESSION_VIEW_MODE) ? storage.get(SESSION_VIEW_MODE) : 'img',

      loadData: (pageParams) => {
        let params = {
          status: this.currentStatus,
          searchKey: this.searchText ? this.searchText : '',
          ...pageParams
        }
        if (this.filterParams) {
          params = Object.assign(this.filterParams, params)
        }
        return SelfStudyTaskList(params)
      }
    }
  },
  computed: {
    ...mapState({
      studyMode: state => state.app.studyMode
    }),
    statusList() {
      return StudentStudyTaskStatus.filter(item => {
        // scheduled 只有学校模式有
        if (this.studyMode === STUDY_MODE.SELF && item.value === TASK_STATUS.SCHEDULED) return false
        return true
      })
    }
  },
  created () {
    logger.info('student my content')
    this.initFilterOption()
  },
  methods: {
    handleModeChange(studyMode) {
      if (studyMode === STUDY_MODE.SELF && this.currentStatus === TASK_STATUS.SCHEDULED) {
        this.currentStatus = ''
      }
    },
    initFilterOption() {
      SubjectTree({ curriculumId: CurriculumType.Cambridge }).then(response => {
        this.$logger.info('getSubjectTree response', response.result)
        this.filterSubjectOptions = []
        response.result.forEach(subject => {
          this.filterSubjectOptions.push({ label: subject.name, value: subject.id })
        })
      })
      GetGradesByCurriculumId({ curriculumId: CurriculumType.Cambridge }).then(response => {
        this.$logger.info('GetGradesByCurriculumId', response.result)
        this.filterAgeOptions = []
        response.result.forEach(grade => {
          this.filterAgeOptions.push({ label: grade.name, value: grade.id })
        })
      })
      this.loadUserTags()
      this.filterPeriodOptions = [
        { label: 'This month', value: 'month' },
        { label: 'Last 7 days', value: '7' }
      ]
    },
    loadUserTags () {
      // this.$refs.customTag.tagLoading = true
      FindCustomTags({}).then((response) => {
        this.$logger.info('FindCustomTags response', response.result)
        if (response.success) {
          this.filterSaOptions = []
          this.filterFaOptions = []
          this.filterActivityOptions = []
          const recommends = response.result.recommends
          // 默认展示的tag分类
          CustomTagType.task.sa.forEach(name => {
            recommends.forEach(parent => {
              if (parent.name === name) {
                this.filterSaOptions.push(parent)
              }
            })
          })
          CustomTagType.task.fa.forEach(name => {
            recommends.forEach(parent => {
              if (parent.name === name) {
                this.filterFaOptions.push(parent)
              }
            })
          })
          CustomTagType.task.activity.forEach(name => {
            recommends.forEach(parent => {
              if (parent.name === name) {
                this.filterActivityOptions.push(parent)
              }
            })
          })
        }
      })
    },
    toggleStatus (status) {
      this.currentStatus = status
    },
    toggleViewMode (viewMode) {
      storage.set(SESSION_VIEW_MODE, viewMode)
      this.viewMode = viewMode
    },
    handleChangeSubject (subjects) {
      console.log(this.filterParams)
      this.$refs.myTaskList.loadMyContent()
    },
    handleUpdateFilterConfig (filter) {
      // TODO 根据配置更新请求参数
      this.$logger.info('handleUpdateFilterConfig', filter)
      this.filterParams = filter
      this.$refs.myTaskList.loadMyContent()
    },
    triggerSearch() {
      this.$refs.myTaskList.loadMyContent()
    }
  }
}
</script>

<style scoped lang="less">
@import "~@/components/index.less";
.ant-list-item {
  padding: 8px 0;
  position: relative;
}

.active-item {
  background-color: fade(@outline-color, 20%);
  color: @primary-color;
}

.my-list-item {
  min-width: 800px;
  opacity: 1;
  width: 100%;
  border-radius: 4px;
  background: #FFFFFF;
  padding: 15px 10px;
  margin-bottom: 15px;
  cursor: pointer;
  .collaborate-icon-item{
    width:30px;
    height: 30px;
    margin-left: 10px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.my-content {
  padding: 0 15px 25px 15px;
  .filter-line {
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    .status-tab {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
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

            //.mode-item:first-child {
            //  border-bottom-left-radius: 35px;
            //  border-top-left-radius: 35px;
            //}
            //
            //.mode-item:last-child {
            //  border-bottom-right-radius: 35px;
            //  border-top-right-radius: 35px;
            //}

            .mode-item {
              padding: 0 8px;
              font-size: 12px;
              height: 40px;
              color: rgba(17, 20, 45, 1);
              border-radius: 40px;
              font-family: Inter-Bold;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 90px;
            }

            .active-mode {
              color: #fff;
              background: rgba(21, 195, 154, 1);
            }
          }
        }
      }
    }

    .type-owner {
      min-height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .my-search{
      margin-right: 10px;
      border-radius:6px;
      width: 200px;
      /deep/ .ant-input{
        border-radius:6px;
        height: 40px;
      }
    }

    .filter-icon {
      .filter-item {
        color: #333;
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background: #FFFFFF;
        border: 1px solid #D3D3D3;
        opacity: 1;
        border-radius: 6px;
        padding: 9px 15px;
        white-space:nowrap;
        margin-right: 20px;

        svg {
          height: 20px;
        }
        .filter-active-icon {
          display: none;
        }
        .filter-icon {
          display: inline;
        }

        &:hover {
          color: #38cfa6;
          border: 1px solid #38cfa6;
          .filter-active-icon {
            display: inline;
          }

          .filter-icon {
            display: none;
          }
        }

        .filter-label {
          font-family: Inter-Bold;
          line-height: 20px;
          padding-left: 8px;
        }
      }
    }

    .filter-option {
      width: 220px;
      .filter-item {
        width: 100%;
        line-height: 40px;
        font-size: 14px;
      }
    }

  }
  .filter-params{
    margin-bottom: 5px;
    border: 1px solid #E4E4E4;
    padding: 5px 15px;
    border-radius: 5px;
    max-height: 290px;
    overflow: auto;
    background: rgba(228, 228, 228, 0.2);

    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-track {
      border-radius: 3px;
      background: rgba(0,0,0,0.00);
      box-shadow: inset 0 0 5px rgba(0,0,0,0.01);
    }
    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background: rgba(0,0,0,0.12);
      box-shadow: inset 0 0 10px rgba(0,0,0,0.01);
    }
  }
  .expand-icon {
    margin-bottom: 10px;
    cursor: pointer;
    line-height: 30px;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      padding: 0 5px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        font-size: 23px;
      }
    }
  }

}
a.delete-action {
  color: @red-4;
}

.view-mode-toggle {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-right: 10px;
  background: #FFFFFF;
  border: 1px solid #D8D8D8;
  opacity: 1;
  border-radius: 6px;
  height: 40px;
  padding: 0px 15px;
  margin-left: 20px;

  &:hover {
    border: 1px solid #15c39a;
  }
  .view-mode {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    color: @text-color-secondary;

    .view-mode-item {
      font-size: 20px;
      padding-left: 5px;
      margin: 0 3px;
      display: flex;
      flex-direction: row;
      align-items: center;

      svg {
        height: 22px;
      }
    }

    .active-view {
      svg {
        fill: @primary-color;
      }
    }
  }
}
</style>
