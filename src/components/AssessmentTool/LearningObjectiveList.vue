<template>
  <div class='learning-objective-list'>
    <div class='select-switch'>
      <a-select
        :getPopupContainer="trigger => trigger.parentElement"
        placeholder='Curriculum'
        v-model='mode'
        class='cc-select cc-lo-select-mid'>
        <a-select-option :value="selectMode.subjectLearningObjectives">
          Learning objectives
        </a-select-option>
        <a-select-option :value="selectMode.generalCapabilities">
          21st century skills
        </a-select-option>
        <a-select-option :value="selectMode.studentPerformance">
          Student performance
        </a-select-option>
      </a-select>
    </div>
    <div class='select-content'>
      <div class='objectives-wrapper' v-show='mode === selectMode.subjectLearningObjectives'>
        <div class='objectives-list-item' v-for='objectiveItem in learningObjectiveList' :key='objectiveItem.id' :class="{'disabled-item': disabledLearningObjectiveIdList.indexOf(objectiveItem.id) !== -1}">
          <div class='objective-item'>
            <div class='objective-item-title' v-if='objectiveItem && objectiveItem.path && objectiveItem.path.length'>
              <a-icon type="tag" />
              <div class='title-text'>
                {{ objectiveItem.path.slice(-2).join(' > ') }}
              </div>
            </div>
            <div class='objective-item-content' @click='handleAddLearningObjective(objectiveItem)'>
              <div class='item-type-icon'>
                <img src="~@/assets/icons/lesson/selected.png" v-if='selectedLearningObjective.indexOf(objectiveItem) !== -1' />
                <div class="empty-circle" v-if='selectedLearningObjective.indexOf(objectiveItem) === -1'></div>
              </div>
              <div class='objective-item-content-text'>
                {{ objectiveItem.desc }}
              </div>
            </div>
          </div>
          <div class='disable-mask'></div>
        </div>
      </div>
      <div class='objectives-wrapper' v-show='mode === selectMode.generalCapabilities'>
        <div class='objectives-list-item' v-for='objectiveItem in generalCapabilityList' :key='objectiveItem.id' :class="{'disabled-item': disabledGeneralCapabilityIdList.indexOf(objectiveItem.id) !== -1}">
          <div class='objective-item'>
            <div class='objective-item-title' v-if='objectiveItem && objectiveItem.path && objectiveItem.path.length'>
              <a-icon type="tag" />
              <div class='title-text'>
                {{ objectiveItem.path.slice(-2).join(' > ') }}
              </div>
            </div>
            <div class='objective-item-content' @click='handleAddGeneralCapability(objectiveItem)'>
              <div class='item-type-icon'>
                <img src="~@/assets/icons/lesson/selected.png" v-if='selectedGeneralCapabilities.indexOf(objectiveItem) !== -1' />
                <div class="empty-circle" v-if='selectedGeneralCapabilities.indexOf(objectiveItem) === -1'></div>
              </div>
              <div class='objective-item-content-text'>
                {{ objectiveItem.desc }}
              </div>
            </div>
          </div>
          <div class='disable-mask'></div>
        </div>
      </div>
      <div class='performance' v-show='mode === selectMode.studentPerformance'>
        <div class='tag-wrapper'>
          <div class="skt-tag-list">
            <div class="skt-tag-item " v-for="(tag) in performanceList" :key="tag.id" @click="handleAddPerformance(tag)">
              <a-tag
                class='tag-item'
                :closable='false'
                :color="selectedPerformance.indexOf(tag) !== -1 ? '#FFEDAF' : ''">
                {{ tag }}
                <div class='close-icon' v-show='selectedPerformance.indexOf(tag) !== -1' @click.stop='handleAddPerformance(tag)'>
                  <a-icon type='close' />
                </div>
              </a-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class='modal-action-left'>
      <a-space>
        <a-button
          @click='handleInsert'
          class='cc-round-button'
          type='primary'>
          <a-icon type='plus-circle' /> Insert
        </a-button>
        <div class='insert-tips' v-if='mode === selectMode.subjectLearningObjectives || mode === selectMode.generalCapabilities'>
          Please go to step 'Set Learning Objectives', <br/>
          if you wish to add criteria apart from above.
        </div>
      </a-space>
    </div>
  </div>

</template>

<script>
import NoMoreResources from '@/components/Common/NoMoreResources'
import LearnOutAddTag from '@/components/UnitPlan/LearnOutAddTag'
import RateLevel from '@/components/RateLevel'
import { TagType } from '@/const/common'
import AddGreenIcon from '@/assets/svgIcon/evaluation/form/tianjia_green.svg?inline'
import QuickWordButton from '@/components/Button/QuickWordButton'
import SelfOutsInput from '@/components/UnitPlan/SelfOutsInput'
import CustomFormItem from '@/components/Common/CustomFormItem'
import PlusIcon from '@/components/Common/PlusIcon'
import DeleteIcon from '@/components/Common/DeleteIcon'
import CustomButton from '@/components/Common/CustomButton'
import { AssessmentToolsEvent } from '@/components/AssessmentTool/Constant'

const selectMode = {
  subjectLearningObjectives: 'subjectLearningObjectives',
  generalCapabilities: 'generalCapabilities',
  studentPerformance: 'studentPerformance'
}

export default {
  name: 'LearningObjectiveList',
  components: {
    CustomButton,
    DeleteIcon,
    PlusIcon,
    CustomFormItem,
    SelfOutsInput,
    LearnOutAddTag,
    NoMoreResources,
    AddGreenIcon,
    QuickWordButton,
    RateLevel
  },
  props: {
    learnOuts: {
      type: Array,
      default: () => []
    },
    selectedTagList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      TagType: TagType,
      selectMode: selectMode,
      mode: selectMode.subjectLearningObjectives,

      learningObjectiveList: [],
      generalCapabilityList: [],
      performanceList: [],

      selectedLearningObjective: [],
      selectedGeneralCapabilities: [],
      selectedPerformance: []
    }
  },
  computed: {
    disabledLearningObjectiveIdList() {
      // 计算已选择的通用能力对应的学习目标id
      const list = []
      this.selectedGeneralCapabilities.forEach(item => {
        list.push(item.learningObjectiveId)
      })
      return list
    },
    disabledGeneralCapabilityIdList() {
      // 计算已选择的学习目标对应的通用能力id
      const list = []
      this.selectedLearningObjective.forEach(learningObjective => {
        learningObjective.generalCapabilities.forEach(generalCapability => {
          list.push(generalCapability.id)
        })
      })
      return list
    }
  },
  watch: {
    learnOuts: {
      deep: true,
      immediate: false,
      handler (val) {
        this.initData(val)
      }
    },
    selectedTagList: {
      deep: true,
      immediate: false,
      handler (val) {
        this.initTagData(val)
      }
    }
  },
  created() {
    this.initData(this.learnOuts)
    this.initTagData(this.selectedTagList)
  },
  methods: {

    initData (learnOuts) {
      const dataList = JSON.parse(JSON.stringify(learnOuts))
      if (Array.isArray(dataList) && dataList.length > 0) {
        dataList.forEach(item => {
          this.learningObjectiveList.push(item)
          item.generalCapabilities.forEach(capability => {
            capability.learningObjectiveId = item.id
            this.generalCapabilityList.push(capability)
          })
        })
      } else {
        this.learningObjectiveList = []
        this.generalCapabilityList = []
      }
    },

    initTagData (tagList) {
      this.$logger.info('lo initTagData', tagList)
      const dataList = JSON.parse(JSON.stringify(tagList))
      if (Array.isArray(dataList) && dataList.length > 0) {
        const tagSet = new Set()
        dataList.forEach(item => {
          item.tags.forEach(tag => {
            tagSet.add(tag.tag)
          })
        })
        this.performanceList = Array.from(tagSet)
      } else {
        this.performanceList = []
      }
    },

    handleAddLearningObjective (dataItem) {
      this.$logger.info('handleAddLearningObjective', dataItem)
      const index = this.selectedLearningObjective.findIndex(item => item === dataItem)
      if (index === -1) {
        this.selectedLearningObjective.push(dataItem)
      } else {
        this.selectedLearningObjective.splice(index, 1)
      }
    },

    handleAddGeneralCapability (dataItem) {
      this.$logger.info('handleAddGeneralCapability', dataItem)
      const index = this.selectedGeneralCapabilities.findIndex(item => item === dataItem)
      if (index === -1) {
        this.selectedGeneralCapabilities.push(dataItem)
      } else {
        this.selectedGeneralCapabilities.splice(index, 1)
      }
      this.$logger.info('handleAddGeneralCapability selectedGeneralCapabilities', this.selectedGeneralCapabilities)
    },

    handleAddPerformance (dataItem) {
      this.$logger.info('handleAddPerformance', dataItem)
      const index = this.selectedPerformance.findIndex(item => item === dataItem)
      if (index === -1) {
        this.selectedPerformance.push(dataItem)
      } else {
        this.selectedPerformance.splice(index, 1)
      }
    },

    handleInsert () {
      this.$EventBus.$emit(AssessmentToolsEvent.InsertCriteria, JSON.parse(JSON.stringify(
        {
          learningObjectiveList: this.selectedLearningObjective,
          generalCapabilityList: this.selectedGeneralCapabilities,
          performanceList: this.selectedPerformance
        }
      )))
      this.selectedLearningObjective = []
      this.selectedGeneralCapabilities = []
      this.selectedPerformance = []
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.learning-objective-list {
  .select-content {
    margin-top: 20px;
    padding-right: 10px;
    overflow-y: auto;
    height: calc(100vh - 340px);

    .objectives-wrapper {
      .objectives-list-item {
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
        position: relative;

        .disable-mask {
          display: none;
        }

        .item-type-icon {
          display: block;
          width: 25px;
          height: 25px;
          .empty-circle {
            height: 18px;
            width: 18px;
            border-radius: 50%;
            border: 2px solid #ccc;
          }

          img {
            width: 20px;
            height: 20px;
          }
        }

        .objective-item {
          overflow: hidden;
          width: 100%;
          .objective-item-title {
            user-select: none;
            cursor: pointer;
            padding: 10px 0 5px 0;
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            .title-text {
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              word-break: break-all;
              display: inline-block;
              margin-left: 5px;
              padding: 0 10px;
              font-size: 13px;
              cursor: pointer;
              font-weight: bold;
              color: #999;
            }
          }
          .objective-item-content {
            user-select: none;
            cursor: pointer;
            padding: 5px 0;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            .objective-item-content-text {
              margin-left: 10px;
              padding: 5px 10px;
              background-color: #fff;
              box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.03);
              opacity: 1;
              border-radius: 4px;
              width: calc(100% - 10px);
            }
          }
        }
      }

      .disabled-item {
        .disable-mask {
          cursor: not-allowed;
          display: block !important;
          background: rgba(255, 255, 255, .6);
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
      }
    }

    .performance {
      .tag-wrapper {
        background-color: #fff;
        height:  calc(100vh - 340px);
        overflow-y: auto;
        padding: 10px;
        .skt-tag-list {
          padding: 3px 0;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          position: relative;

          .skt-tag-item {
            margin: 0 10px 10px 0;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            vertical-align: middle;
            cursor: pointer;

            .tag-item {
              cursor: pointer;
              color: #333;
              font-size: 13px;
              border-radius: 30px;
              line-height: 30px;
              padding-left: 15px;
              word-break: normal;
              width: auto;
              display: flex;
              align-items: center;
              justify-content: space-between;
              white-space: pre-wrap;
              word-wrap: break-word;
              overflow: hidden;
              opacity: 1;

              /deep/ .anticon-close {
                opacity: 0;
                color: #f26c59;
              }

              &:hover {
                /deep/ .anticon-close {
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
  }
}

.insert-tips {
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  color: #333;
  max-width: 300px;
  font-weight: 400;
  padding-right: 10px;
}

.disabled-item {
  position: relative;
  .disable-mask {
    //display: block !important;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 4px;
    filter: grayscale(0.5);
  }
}

.select-switch {
  width: 180px;
}

div.modal-action-left {
  justify-content: flex-start;
}
</style>
