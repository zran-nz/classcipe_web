<template>
  <div class='learning-objective-list'>
    <div class='select-switch'>
      <a-radio-group :default-value="selectMode.subjectLearningObjectives" button-style="solid" class='cc-radio-group' v-model='mode'>
        <a-radio-button :value="selectMode.subjectLearningObjectives">
          Subject learning objectives
        </a-radio-button>
        <a-radio-button :value="selectMode.generalCapabilities">
          21st century skills
        </a-radio-button>
        <a-radio-button :value="selectMode.studentPerformance">
          Student performance
        </a-radio-button>
      </a-radio-group>
    </div>
    <div class='select-content'>
      <div class='objectives-wrapper' v-show='mode === selectMode.subjectLearningObjectives'>
        <div class='objectives-list-item' v-for='objectiveItem in learningObjectiveList' :key='objectiveItem.id'>
          <div class='item-type-icon'>
            <img src="~@/assets/icons/lesson/selected.png" v-if='selectedLearningObjective.indexOf(centuryInput) !== -1' />
            <div class="empty-circle" v-if='selectedLearningObjective.indexOf(centuryInput) === -1'></div>
          </div>
          <div class='objective-item'>
            <div class='objective-item-title'>
              {{ objectiveItem.path.slice(-2).join(' > ') }}
            </div>
            <div class='objective-item-content'>
              {{ objectiveItem.desc }}
            </div>
          </div>
        </div>
      </div>
      <div class='performance' v-show='mode === selectMode.studentPerformance'></div>
    </div>
    <div class='modal-action-right'>
      <a-space>
        <div class='insert-tips' v-if='mode === selectMode.subjectLearningObjectives || mode === selectMode.generalCapabilities'>
          Please go to step 'Set Learning Objectives', <br/>
          if you wish to add criteria apart from above.
        </div>
        <a-button
          @click='handleInsert'
          type='primary'>
          <a-icon type='plus-circle' /> Insert
        </a-button>
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
  watch: {
    learnOuts: {
      deep: true,
      immediate: false,
      handler (val) {
        this.initData(val)
      }
    }
  },
  created() {
    this.initData(this.learnOuts)
  },
  methods: {

    initData (learnOuts) {
      const dataList = JSON.parse(JSON.stringify(learnOuts))
      if (Array.isArray(dataList) && dataList.length > 0) {
        dataList.forEach(item => {
          this.learningObjectiveList.push(item)
          item.generalCapabilities.forEach(capability => {
            this.generalCapabilityList.push(capability)
          })
        })
      } else {
        this.learningObjectiveList = []
        this.generalCapabilityList = []
        this.performanceList = []
      }
    },

    handleAddLearningObjective (dataItem) {

    },

    handleAddGeneralCapabilities (dataItem) {

    },

    handleAddPerformance (dataItem) {

    },

    handleInsert () {
      this.$EventBus.$emit(AssessmentToolsEvent.InsertCriteria)
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
    height: calc(100vh - 300px);

    .objectives-wrapper {
      .objectives-list-item {
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;

        .item-type-icon {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          width: 25px;
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

        }
      }
    }
  }
}

.insert-tips {
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  color: #aaa;
  max-width: 300px;
  padding-right: 10px;
}
</style>
