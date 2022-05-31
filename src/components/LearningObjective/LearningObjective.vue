<template>
  <div class='learning-objective'>
    <div class='half-body-content'>
      <div class='cc-lo-header'>
        <div class='filter-line'>
          <div class='select-item'>
            <a-select
              :getPopupContainer="trigger => trigger.parentElement"
              v-model='filterConfig.curriculumId'
              class='cc-select cc-lo-select-mid'>
              <a-select-option :value='item.id' v-for='(item, index) in curriculumOptions' :key='index'>
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
              v-model='selectedSubject'
              @select='handleSelectSubject'
              class='cc-select cc-lo-select'>
              <a-select-option :value='subjectName' v-for='subjectName in subjectOptions' :key='subjectName'>
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
              v-model='selectedYear'
              @select='handleSelectYear'
              class='cc-select cc-lo-select-small'>
              <a-select-option :value='year' v-for='year in yearOptions' :key='year'>
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
          <a-input v-model='filterConfig.keyword' @click.native.stop='showFilterList = true' placeholder='Search learning objectives' class='cc-form-input' />
          <div class='filter-list' v-show='showFilterList && filterList.length' @click.stop=''>
            <div class='filter-item' v-for='(item, idx) in filterList' :key='idx' @click='handleSelectItem(item)'>
              <div class='item-desc'>
                {{ item.desc }}
              </div>
              <div class='item-subject-year'>
                <div class='item-sub-title' :title='item.path && item.path[0]'>{{ item.path && item.path[0] }}</div>
                <div class='item-sub-title' :title='item.path && item.path[yearIndex]'>{{ item.path && item.path[yearIndex] }}</div>
              </div>
            </div>
          </div>
          <div class='create-item' v-show='showFilterList && !filterList.length'>
            <a-button type='primary' size="small" @click='handleEnsureInput'><a-icon type='plus' /> Create</a-button>
          </div>
        </div>
      </div>
    </div>
    <div class='full-body-content'>
      <div class='cc-lo-list'>
        <div v-for='(item, idx) in selectedList' :key='idx' class='cc-lo-item'>
          <div class='cc-left-lo'>
            <div class='item-desc'>
              {{ item.desc }}
            </div>
            <div class='item-subject-year'>
              <div class='item-sub-title' :title='item.path && item.path[0]'>{{ item.path && item.path[0] }}</div>
              <div class='item-sub-title' :title='item.path && item.path[yearIndex]'>{{ item.path && item.path[yearIndex] }}</div>
            </div>
            <div class='delete-wrapper'>
              <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDelete(item)" cancel-text="No">
                <delete-icon color='#F16A39' />
              </a-popconfirm>
            </div>
          </div>
          <div class='cc-right-general-capabilities'>
            <div class='cc-right-general-capabilities-title'>
              <custom-text-button label='Select 21st century skills'>
                <template v-slot:icon>
                  <a-icon type='plus-circle' />
                </template>
                <template v-slot:badge>
                  <a-tooltip
                    title="The 21st century skills you selected will be marked according to the subject strands' grading standards and presented on students' report">
                    <a-icon type="question-circle" theme="filled" :style="{ fontSize: '16px', color: '#EB5062' }"/>
                  </a-tooltip>
                </template>
              </custom-text-button>
              <a-cascader :options="generalCapabilitiesData" @change="handleSelectGeneralCapability(item, arguments)" class='cc-gc-cascader' />
            </div>
            <div class='cc-right-general-capabilities-content'>
              <div class='capability-item' v-for='(capability, sIdx) in item.generalCapabilities' :key='sIdx'>
                <div class='capability-item-tag'>
                  <div class='tag-icon'>
                    <a-icon type="tag" />
                  </div>
                  <div class='item-tag-name' v-for='(path, pIdx) in capability.path' :key='path' :title='path'>
                    <template v-if='pIdx < capability.path.length && pIdx > 0'> / </template>
                    {{ path }}
                  </div>
                </div>
                <div class='capability-item-content'>
                  {{ capability.desc }}
                  <div class='delete-wrapper'>
                    <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteCapability(item, capability)" cancel-text="No">
                      <delete-icon color='#F16A39' />
                    </a-popconfirm>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import data from './data.json'
import { CurriculumSearch, GeneralCapabilitiesFormat } from '@/components/LearningObjective/CurriculumDataUtils'
import CustomTextButton from '@/components/Common/CustomTextButton'
import { getAllCurriculums } from '@/api/preference'
import DeleteIcon from '@/components/Common/DeleteIcon'
import { debounce } from 'lodash-es'

export default {
  name: 'LearningObjective',
  components: { DeleteIcon, CustomTextButton },
  props: {
    curriculumId: {
      type: String,
      default: null
    },
    subjectList: {
      type: Array,
      default: () => []
    },
    yearList: {
      type: Array,
      default: () => []
    },
    learningObjectives: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      data: data,
      yearIndex: data['Learning outcomes']?.__year,
      curriculumOptions: [],
      subjectOptions: [
        'Science',
        'The Arts',
        'Humanities and Social Sciences',
        'Health and Physical Education',
        'Mathematics'
      ],
      yearOptions: [
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

      selectedSubject: null,
      selectedYear: null,

      filterConfig: {
        curriculumId: null,
        selectedSubjectList: [],
        selectedYearList: [],
        keyword: null
      },

      showFilterList: false,
      filterList: [],

      selectedList: [],

      generalCapabilitiesData: [],
      asyncEmitUpdateEventFn: null
    }
  },
  watch: {
    filterConfig: {
      deep: true,
      immediate: false,
      handler() {
        this.filterList = CurriculumSearch(this.data['Learning outcomes'], this.filterConfig.selectedSubjectList, this.filterConfig.selectedYearList, this.filterConfig.keyword)
        this.asyncEmitUpdateEventFn()
      }
    },
    selectedList: {
      deep: true,
      immediate: false,
      handler() {
        this.asyncEmitUpdateEventFn()
      }
    }
  },
  computed: {
    selectedCurriculumName () {
      return this.curriculumOptions.find(item => item.id === this.filterConfig.curriculumId)?.name
    }
  },
  created() {
    this.asyncEmitUpdateEventFn = debounce(this.emitUpdateEvent, 1000)
    if (this.curriculumId) {
      this.filterConfig.curriculumId = this.curriculumId
    }

    if (Array.isArray(this.subjectList) && this.subjectList.length > 0) {
      this.filterConfig.selectedSubjectList = this.subjectList
      this.selectedSubject = this.filterConfig.selectedSubjectList[0]
    }

    if (Array.isArray(this.yearList) && this.yearList.length > 0) {
      this.filterConfig.selectedYearList = this.yearList
      this.selectedYear = this.filterConfig.selectedYearList[0]
    }

    if (Array.isArray(this.learningObjectives) && this.learningObjectives.length > 0) {
      this.selectedList = this.learningObjectives
    }

    this.initData()
  },
  mounted() {
    this.globalClick(this.handleClick)
  },
  methods: {
    initData() {
      getAllCurriculums().then((response) => {
        this.$logger.info('getAllCurriculums', response)
        this.curriculumOptions = response.result
        this.filterConfig.curriculumId = this.curriculumOptions[0].id
        this.$logger.info('getAllCurriculums', this.curriculumOptions)
      })

      this.generalCapabilitiesData = GeneralCapabilitiesFormat(this.data['General capabilities'])
    },

    handleResetCurriculum () {
      this.filterConfig.curriculumId = null
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
        this.$set(item, 'generalCapabilities', [])
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
    },

    handleSelectGeneralCapability (item) {
      this.$logger.info('handleSelectGeneralCapability', arguments[1])
      const generalCapabilityList = JSON.parse(JSON.stringify(arguments[1][0]))
      const lastIndex = generalCapabilityList.length - 1
      const generalCapability = {
        desc: generalCapabilityList[lastIndex],
        path: generalCapabilityList.slice(-3, -1),
        id: arguments[1][1][lastIndex].id
      }
      item.generalCapabilities.push(generalCapability)
      this.$logger.info('current lo item', item)
    },

    handleDeleteCapability (item, capability) {
      this.$logger.info('handleDeleteCapability', capability)
      const index = item.generalCapabilities.indexOf(capability)
      if (index !== -1) {
        item.generalCapabilities.splice(index, 1)
      }
    },

    emitUpdateEvent () {
      const eventData = {
        ...this.filterConfig,
        learnOuts: this.selectedList
      }
      this.$logger.info('emitUpdateEvent eventData', eventData)
      this.$emit('change', eventData)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.learning-objective {

  .half-body-content {
    width: 55%;
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
            padding: 10px 10px 10px 20px;
            cursor: pointer;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            &:hover {
              background-color: #14C39A12;
              color: #15C39A;
            }

            .item-desc {
              padding-right: 10px;
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
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                white-space: nowrap;
                margin-right: 10px;
                font-weight: bold;
                cursor: pointer;
                user-select: none;
              }
            }
          }
        }

        .create-item {
          position: absolute;
          right: 5px;
          top: 4px;
        }
      }
    }
  }

  .full-body-content {
    .cc-lo-list {
      margin-top: 15px;
      z-index: 1;

      .cc-lo-item {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        align-items: flex-start;
        margin-bottom: 10px;
        .cc-left-lo {
          width: 55%;
          position: relative;
          cursor: pointer;
          background: #FAFAFA;
          border: 1px solid #E1E6ED;
          border-radius: 4px;
          padding: 10px 10px 10px 20px;
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
              max-width: 100px;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              white-space: nowrap;
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

        .cc-right-general-capabilities {
          width: 45%;
          padding-left: 30px;

          .cc-right-general-capabilities-title {
            width: 200px;
            position: relative;

            .cc-gc-cascader {
              position: absolute;
              left: 15px;
              top: 0;
              width: 170px;
              opacity: 0;
            }
          }

          .cc-right-general-capabilities-content {
            margin-top: 15px;
            .capability-item {
              margin-bottom: 15px;

              .capability-item-tag {
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                justify-content: flex-start;
                line-height: 25px;
                padding-bottom: 5px;
                cursor: pointer;
                font-weight: bold;
                color: #999;

                .item-tag-name {
                  padding: 0 5px;
                  overflow-x: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  word-break: break-all;
                }
              }

              .capability-item-content {
                background: #fff;
                position: relative;
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
                padding: 10px 30px 10px 10px;
                position: relative;
                color: #000000;
                border: 1px solid #f1f1f1;
                box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.05);

                .delete-wrapper {
                  background-color: #fff;
                  position: absolute;
                  right: 0;
                  width: 30px;
                  top: 50%;
                  margin-top: -10px;
                  display: none;
                  flex-direction: row;
                  justify-content: center;
                  align-items: center;
                }

                &:hover {
                  .delete-wrapper {
                    display: flex;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
