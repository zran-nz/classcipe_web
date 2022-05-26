<template>
  <div class='learning-objective'>
    <div class='cc-lo-header'>
      <div class='filter-line'>
        <div class='select-item'>
          <a-select
            :getPopupContainer="trigger => trigger.parentElement"
            v-model='filterConfig.curriculum'
            class='cc-select cc-lo-select-mid'>
            <a-select-option :value='item.id' v-for='(item, index) in curriculumList' :key='index'>
              {{ item.name }}
            </a-select-option>
          </a-select>
          <div class='selected-label' v-if='selectedCurriculumName'>
            <div class='selected-label-item'>
              <a-tag closable class='label-curriculum' @close="handleResetCurriculum(selectedCurriculumName)">
                <div class='tag-content'>{{ selectedCurriculumName }}</div>
              </a-tag>
            </div>
          </div>
        </div>
        <div class='select-item'>
          <a-select
            :getPopupContainer="trigger => trigger.parentElement"
            @select='handleSelectSubject'
            class='cc-select cc-lo-select'>
            <a-select-option :value='subjectName' v-for='subjectName in subjectList' :key='subjectName'>
              {{ subjectName }}
            </a-select-option>
          </a-select>
          <div class='selected-label' v-if='filterConfig.selectedSubjectList'>
            <div
              class='selected-label-item'
              v-for='subjectName in filterConfig.selectedSubjectList'
              :key='subjectName'>
              <a-tag closable class='label-subject' @close="handleRemoveSubject(subjectName)">
                <div class='tag-content'>{{ subjectName }}</div>
              </a-tag>
            </div>
          </div>
        </div>
        <div class='select-item'>
          <a-select
            :getPopupContainer="trigger => trigger.parentElement"
            @select='handleSelectYear'
            class='cc-select cc-lo-select-small'>
            <a-select-option :value='year' v-for='year in yearList' :key='year'>
              {{ year }}
            </a-select-option>
          </a-select>
          <div class='selected-label' v-if='filterConfig.selectedYearList'>
            <div
              class='selected-label-item'
              v-for='year in filterConfig.selectedYearList'
              :key='year'>
              <a-tag closable class='label-year' @close="handleRemoveYear(year)">
                <div class='tag-content'>{{ year }}</div>
              </a-tag>
            </div>
          </div>
        </div>
      </div>
      <div class='recommend-button'>
        <a-badge dot>
          <custom-text-button label='Recommend'>
            <template v-slot:icon>
              <a-icon type='plus-circle' />
            </template>
          </custom-text-button>
        </a-badge>
      </div>
    </div>
    <div class='cc-lo-content'>
    </div>
  </div>
</template>

<script>

import data from './data.json'
import { CurriculumSearch } from '@/components/LearningObjective/CurriculumDataUtils'
import CustomTextButton from '@/components/Common/CustomTextButton'
import { getAllCurriculums } from '@/api/preference'

export default {
  name: 'LearningObjective',
  components: { CustomTextButton },
  data() {
    return {
      data: Object.freeze(data),
      curriculumList: [],
      subjectList: [
        'Science',
        'The Arts',
        'Humanities and Social Sciences',
        'Health and Physical Education',
        'Mathematics'
      ],
      yearList: [
        'Year 1',
        'Year 2',
        'Year 3',
        'Year 4',
        'Year 5',
        'Year 6',
        'Year 7',
        'Year 8',
        'Year 9',
        'Year 10'
      ],

      filterConfig: {
        curriculum: null,
        selectedSubjectList: [],
        selectedYearList: []
      }
    }
  },
  watch: {
    filterConfig() {
      CurriculumSearch(this.data['Subject specific skills'], null, null, 'Sequence')
    }
  },
  computed: {
    selectedCurriculumName () {
      return this.curriculumList.find(item => item.id === this.filterConfig.curriculum)?.name
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      getAllCurriculums().then((response) => {
        this.$logger.info('getAllCurriculums', response)
        this.curriculumList = response.result
        this.filterConfig.curriculum = this.curriculumList[0].id
        this.$logger.info('getAllCurriculums', this.curriculumList)
      })
    },

    handleResetCurriculum (curriculum) {
      this.filterConfig.curriculum = null
    },

    handleRemoveSubject (subject) {
      this.filterConfig.selectedSubjectList.splice(this.filterConfig.selectedSubjectList.indexOf(subject), 1)
    },

    handleRemoveYear (year) {
      this.filterConfig.selectedYearList.splice(this.filterConfig.selectedYearList.indexOf(year), 1)
    },

    handleSelectSubject (subject) {
      if (this.filterConfig.selectedSubjectList.indexOf(subject) === -1) {
        this.filterConfig.selectedSubjectList.unshift(subject)
      }
    },

    handleSelectYear (year) {
      if (this.filterConfig.selectedYearList.indexOf(year) === -1) {
        this.filterConfig.selectedYearList.unshift(year)
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.learning-objective {
  .cc-lo-header {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;

    .filter-line {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      .select-item {
        margin-right: 15px;

        .selected-label {
          margin-top: 15px;
          .selected-label-item {

            .tag-content {
              display: inline-block;
              max-width: 120px;
              text-overflow: ellipsis;
              word-break: break-word;
              user-select: none;
              overflow: hidden;
            }

            .ant-tag {
              margin-bottom: 15px;
            }

            .label-curriculum, .label-subject, .label-year {
              max-width: 150px;
              border: none;
              cursor: pointer;
              padding: 0 10px;
              border-radius: 26px;
              line-height: 30px;
              font-family: Arial;
              font-weight: 400;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .label-curriculum {
              background: #C8F3FF;
              color: #255E77;
            }

            .label-subject {
              background: #E6E4FF;
              color: #4F58BD;
            }

            .label-year {
              background: #FFEDAF;
              color: #734110;
            }
          }
        }
      }
    }

    .cc-lo-select {
      width: 100px;
    }

    .cc-lo-select-mid {
      width: 80px;
    }

    .cc-lo-select-small {
      width: 60px;
    }
  }
}
</style>
