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
      <div class='cc-lo-title'>
        Subject Learning Objectives
      </div>
      <div class='cc-lo-input'>
        <a-input v-model='filterConfig.keyword' @click.native.stop='showFilterList = true' placeholder='Search learning objectives' @keyup.native.enter='handleEnsureInput' class='cc-form-input' />
        <div class='filter-list' v-show='showFilterList && filterList.length' @click.stop=''>
          <div class='filter-item' v-for='(item, idx) in filterList' :key='idx' @click='handleSelectItem(item)'>
            <div class='item-desc'>
              {{ item.desc }}
            </div>
            <div class='item-subject-year'>
              <div class='item-sub-title'>{{ item.path[0] }}</div>
              <div class='item-sub-title'>{{ item.path[yearIndex] }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class='cc-lo-list'>
        <div class='selected-item' v-for='(item, idx) in selectedList' :key='idx'>
          <div class='item-desc'>
            {{ item.desc }}
          </div>
          <div class='item-subject-year'>
            <div class='item-sub-title'>{{ item.path && item.path[0] }}</div>
            <div class='item-sub-title'>{{ item.path && item.path[yearIndex] }}</div>
          </div>
          <div class='delete-wrapper'>
            <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDelete(item)" cancel-text="No">
              <delete-icon color='#F16A39' />
            </a-popconfirm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import data from './data.json'
import { CurriculumSearch } from '@/components/LearningObjective/CurriculumDataUtils'
import CustomTextButton from '@/components/Common/CustomTextButton'
import { getAllCurriculums } from '@/api/preference'
import DeleteIcon from '@/components/Common/DeleteIcon'

export default {
  name: 'LearningObjective',
  components: { DeleteIcon, CustomTextButton },
  data() {
    return {
      data: data,
      yearIndex: data['Learning outcomes']?.__year,
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
        selectedYearList: [],
        keyword: null
      },

      showFilterList: false,
      filterList: [],

      selectedList: []
    }
  },
  watch: {
    filterConfig: {
      deep: true,
      immediate: false,
      handler() {
        const filterList = CurriculumSearch(this.data['Learning outcomes'], this.filterConfig.selectedSubjectList, this.filterConfig.selectedYearList, this.filterConfig.keyword)
        this.filterList = filterList
      }
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
  mounted() {
    this.globalClick(this.handleClick)
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
    },

    handleSelectItem (item) {
      this.$logger.info('handleSelectItem', item)
      if (this.selectedList.indexOf(item) === -1) {
        this.selectedList.unshift(item)
      }
      this.showFilterList = false
    },

    handleDelete (item) {
      this.$logger.info('handleDelete', item)
      if (this.selectedList.indexOf(item) !== -1) {
        this.selectedList.splice(this.selectedList.indexOf(item), 1)
      }
    },

    handleClick () {
      this.showFilterList = false
    },

    handleEnsureInput () {
      if (this.filterConfig.keyword) {
        this.handleSelectItem({
          desc: this.filterConfig.keyword
        })
        this.filterConfig.keyword = null
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

  .cc-lo-content {

    .cc-lo-title {
      font-size: 16px;
      font-family: Arial;
      font-weight: bold;
      color: #FF786D;
      line-height: 25px;
    }

    .cc-lo-list {
      margin-top: 15px;
      z-index: 1;
      .selected-item {
        position: relative;
        cursor: pointer;
        background: #FAFAFA;
        border: 1px solid #E1E6ED;
        border-radius: 4px;
        padding: 10px 0 10px 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        font-weight: 400;
        color: #313234;
        font-family: Arial;
        margin-bottom: 10px;

        .item-desc {
          padding-right: 10px;
        }

        .item-subject-year {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;

          .item-sub-title {
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
            margin-right: 10px;
            font-weight: bold;
            color: #111;
            cursor: pointer;
            user-select: none;
          }
        }

        .delete-wrapper {
          position: absolute;
          right: -20px;
          width: 30px;
          top: 50%;
          margin-top: -10px;
          display: none;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;
        }

        &:hover {
          .delete-wrapper {
            display: flex;
          }
        }
      }
    }

    .cc-lo-input {
      margin-top: 5px;
      position: relative;

      .filter-list {
        background-color: #fff;
        position: absolute;
        z-index: 4000;
        left: 0;
        right: 0;
        top: 40px;
        max-height: 300px;
        overflow-y: auto;
        border-radius: 4px;
        box-shadow: 0 0 3px 3px #f1f1f1;

        .filter-item {
          color: rgb(4, 28, 68);
          padding: 10px 0 10px 10px;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          justify-content: space-between;

          &:hover {
            background-color: #14C39A12;
            color: #15C39A;
          }

          .item-desc {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            cursor: pointer;
            user-select: none;
          }

          .item-subject-year {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;

            .item-sub-title {
              white-space: nowrap;
              text-overflow: ellipsis;
              word-break: break-all;
              margin-right: 10px;
              font-weight: bold;
              cursor: pointer;
              user-select: none;
            }
          }
        }
      }
    }
  }
}
</style>
