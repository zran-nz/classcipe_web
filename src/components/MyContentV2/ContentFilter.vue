<template>
  <div class='content-filter'>
    <div class='filter-line'>
      <a-space>
        <div class="my-search">
          <custom-search-input
            @search='triggerSearch'
            :value.sync='searchKey'
            placeholder="Search" />
        </div>
        <div class="filter-icon" @click.stop="showFilter = !showFilter">
          <div class="filter-item">
            <filter-icon class="filter-icon" />
            <filter-active-icon class="filter-active-icon"/>
          </div>
        </div>
      </a-space>
    </div>
    <div v-if="showFilter" @click.stop='' class='filter-wrapper'>
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
    </div>
  </div>
</template>

<script>

import FilterIcon from '@/assets/libraryv2/filter.svg?inline'
import FilterActiveIcon from '@/assets/libraryv2/filter_active.svg?inline'
import { SubjectTree } from '@/api/subject'
import { GetGradesByCurriculumId } from '@/api/preference'
import { FindCustomTags } from '@/api/tag'
import { CustomTagType } from '@/const/common'
import FilterContent from '@/components/UnitPlan/FilterContent'
import CustomSearchInput from '@/components/Common/CustomSearchInput'

export default {
  name: 'ContentFilter',
  components: {
    CustomSearchInput,
    FilterIcon,
    FilterActiveIcon,
    FilterContent
  },
  data () {
    return {
      searchKey: null,
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
      filterParams: {}
    }
  },
  created() {
    this.initFilterOption()
  },
  mounted() {
    this.globalClick(this.handleClick)
  },
  methods: {
    handleUpdateFilterConfig (filter) {
      this.$logger.info('handleUpdateFilterConfig', filter)
      this.filterParams = filter
      this.triggerSearch()
    },
    triggerSearch() {
      this.$logger.info('triggerSearch', this.searchKey)
      const filterConfig = Object.assign({}, { searchKey: this.searchKey, ...this.filterParams })
      this.$emit('search', filterConfig)
    },
    initFilterOption() {
      SubjectTree({ curriculumId: this.$store.getters.bindCurriculum }).then(response => {
        this.$logger.info('getSubjectTree response', response.result)
        this.filterSubjectOptions = []
        response.result.forEach(subject => {
          this.filterSubjectOptions.push({ label: subject.name, value: subject.id })
        })
      })
      GetGradesByCurriculumId({ curriculumId: this.$store.getters.bindCurriculum }).then(response => {
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

    handleClick () {
      this.showFilter = false
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.content-filter {
  position: relative;
  z-index: 500;
  .filter-line {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .filter-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      .filter-item {
        color: #333;
        cursor: pointer;
        background: #FFFFFF;
        opacity: 1;
        padding: 5px 10px 0 10px;
        white-space:nowrap;

        svg {
          height: 15px;
        }
        .filter-active-icon {
          display: none;
        }
        .filter-icon {
          display: inline;
        }

        &:hover {
          color: #38cfa6;
          .filter-active-icon {
            display: inline;
          }

          .filter-icon {
            display: none;
          }
        }
      }
    }
  }

  .filter-wrapper {
    position: absolute;
    right: 0;
    top: 40px;
    max-height: 290px;
    width: 450px;
    overflow-y: scroll;
    background-color: #fdfdfd;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #E4E4E4;
    padding: 5px 25px;
    border-radius: 5px;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-track {
      border-radius: 3px;
      background: rgba(0,0,0,0.00);
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.01);
    }
    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background: rgba(0,0,0,0.12);
      -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.01);
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

</style>
