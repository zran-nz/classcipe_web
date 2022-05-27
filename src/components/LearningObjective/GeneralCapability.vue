<template>
  <div class='learning-objective'>
    <div class='cc-lo-content'>
      <div class='cc-lo-list'>
        <div class='selected-item' v-for='(item, idx) in selectedList' :key='idx' @click='handleActiveItem(item)'>
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
      <div class='cc-lo-input'>
        <a-input v-model='filterConfig.keyword' @click.native.stop='showFilterList = true' @keyup.native.enter='handleEnsureInput' class='cc-form-input' />
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
  name: 'GeneralCapability',
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
        this.selectedList.push(item)
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
    },

    handleActiveItem (item) {
      this.showFilterList = true
      this.filterConfig.keyword = item.desc
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.learning-objective {
  .cc-lo-content {
    padding-bottom: 20px;

    .cc-lo-list {
      .selected-item {
        position: relative;
        cursor: pointer;
        background: #FAFAFA;
        border: 1px solid #E1E6ED;
        border-radius: 4px;
        padding: 10px;
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
            padding: 5px;
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
        position: absolute;
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

          .item-subject-year {
            padding: 0 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;

            .item-sub-title {
              white-space: nowrap;
              text-overflow: ellipsis;
              word-break: break-all;
              padding: 5px;
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
