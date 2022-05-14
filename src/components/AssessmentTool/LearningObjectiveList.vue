<template>
  <div class='learning-objective-list'>
    <div class='select-switch'>
      <a-radio-group :default-value="selectMode.learningObjective" button-style="solid" class='cc-radio-group' v-model='mode'>
        <a-radio-button :value="selectMode.learningObjective">
          Learning objectives
        </a-radio-button>
        <a-radio-button :value="selectMode.studentPerformance">
          Student performance
        </a-radio-button>
      </a-radio-group>
    </div>
    <div class='select-content'>
      <div class='objectives-wrapper' v-show='mode === selectMode.learningObjective'>
        <custom-form-item label-color='#FF786D'>
          <template slot='label'>
            Achievement objectives
          </template>
          <template v-if='getKnowledgeListType(TagType.skill).length > 0'>
            <div class='objectives-list' v-for='(k,index) in getKnowledgeListType(TagType.skill)' :key='index' @click='handleAddLearningObjective(k)'>
              <div class='item-type-icon'>
                <img src="~@/assets/icons/lesson/selected.png" v-if='selectedLearningObjective.indexOf(k) !== -1' />
                <div class="empty-circle" v-if='selectedLearningObjective.indexOf(k) === -1'></div>
              </div>
              <div class='objectives-list-item objectives-list-item-skill'>
                <div class='skt-description'>
                  <a-tooltip placement='topLeft' :title='k.path'> {{ k.name }}</a-tooltip>
                </div>
              </div>
            </div>
          </template>
          <div class='objectives-list' v-for='(skillInput, sIdx) in skillInputList' :key='sIdx' @click='handleAddLearningObjective(skillInput)'>
            <div class='item-type-icon'>
              <img src="~@/assets/icons/lesson/selected.png" v-if='selectedLearningObjective.indexOf(skillInput) !== -1' />
              <div class="empty-circle" v-if='selectedLearningObjective.indexOf(skillInput) === -1'></div>
            </div>
            <div class='objectives-list-item objectives-list-item-skill'>
              <div class='skt-description'>
                {{ skillInput.name }}
              </div>
            </div>
          </div>
        </custom-form-item>
        <custom-form-item label-color='#47A3E4'>
          <template slot='label'>
            Learning outcomes
          </template>
          <template v-if='getKnowledgeListType(TagType.knowledge).length > 0'>
            <div class='objectives-list' v-for='(k,index) in getKnowledgeListType(TagType.knowledge)' :key='index' @click='handleAddLearningObjective(k)'>
              <div class='item-type-icon'>
                <img src="~@/assets/icons/lesson/selected.png" v-if='selectedLearningObjective.indexOf(k) !== -1' />
                <div class="empty-circle" v-if='selectedLearningObjective.indexOf(k) === -1'></div>
              </div>
              <div class='objectives-list-item objectives-list-item-learn'>
                <div class='skt-description'>
                  <a-tooltip placement='topLeft' :title='k.path'> {{ k.name }}</a-tooltip>
                </div>
              </div>
            </div>
          </template>
          <div class='objectives-list' v-for='(knowledgeInput, sIdx) in knowledgeInputList' :key='sIdx' @click='handleAddLearningObjective(knowledgeInput)'>
            <div class='item-type-icon'>
              <img src="~@/assets/icons/lesson/selected.png" v-if='selectedLearningObjective.indexOf(knowledgeInput) !== -1' />
              <div class="empty-circle" v-if='selectedLearningObjective.indexOf(knowledgeInput) === -1'></div>
            </div>
            <div class='objectives-list-item objectives-list-item-learn'>
              <div class='skt-description'>
                {{ knowledgeInput.name }}
              </div>
            </div>
          </div>
        </custom-form-item>
        <custom-form-item label-color='#FF933C'>
          <template slot='label'>
            {{ $classcipe.get21stCenturyDisplayNameByCurriculum($store.getters.bindCurriculum) }}
          </template>
          <template v-if='getKnowledgeListType(TagType.century).length > 0'>
            <div
              class='category-item'
              v-for='categoryItem in getCenturyCategoryList(TagType.century)'
              :key='categoryItem.categoryName'>
              <div class='category-name'>
                <a-icon type='tag' />
                {{ categoryItem.categoryName }}
              </div>
              <div class='objectives-list' v-for='(k,index) in categoryItem.list' :key='index' @click='handleAddLearningObjective(k)'>
                <div class='item-type-icon'>
                  <img src="~@/assets/icons/lesson/selected.png" v-if='selectedLearningObjective.indexOf(k) !== -1' />
                  <div class="empty-circle" v-if='selectedLearningObjective.indexOf(k) === -1'></div>
                </div>
                <div
                  class='objectives-list-item objectives-list-item-21'
                  @click='handleActiveDescription(TagType.century,k)'>
                  <div class='skt-description skt-description-21'>
                    <a-tooltip placement='topLeft' :title='k.path'> {{ k.name }}</a-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div class='objectives-list' v-for='(centuryInput, sIdx) in centuryInputList' :key='sIdx' @click='handleAddLearningObjective(centuryInput)'>
            <div class='item-type-icon'>
              <img src="~@/assets/icons/lesson/selected.png" v-if='selectedLearningObjective.indexOf(centuryInput) !== -1' />
              <div class="empty-circle" v-if='selectedLearningObjective.indexOf(centuryInput) === -1'></div>
            </div>
            <div class='objectives-list-item objectives-list-item-21'>
              <div class='skt-description'>
                {{ centuryInput.name }}
              </div>
            </div>
          </div>
        </custom-form-item>
      </div>
      <div class='performance' v-show='mode === selectMode.studentPerformance'></div>
    </div>
    <div class='modal-action-right'>
      <a-space>
        <div class='insert-tips' v-if='mode === selectMode.learningObjective'>
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
import * as logger from '@/utils/logger'
import NoMoreResources from '@/components/Common/NoMoreResources'
import LearnOutAddTag from '@/components/UnitPlan/LearnOutAddTag'
import RateLevel from '@/components/RateLevel'
import { TagType, AllCurriculums } from '@/const/common'
import { getAll21Century } from '@/api/knowledge'
import AddGreenIcon from '@/assets/svgIcon/evaluation/form/tianjia_green.svg?inline'
import QuickWordButton from '@/components/Button/QuickWordButton'
import SelfOutsInput from '@/components/UnitPlan/SelfOutsInput'
import { KnowledgeTermTagCustomCreate } from '@/api/knowledgeTermTag'
import CustomFormItem from '@/components/Common/CustomFormItem'
import PlusIcon from '@/components/Common/PlusIcon'
import DeleteIcon from '@/components/Common/DeleteIcon'
import CustomButton from '@/components/Common/CustomButton'
import {
  AssessmentToolsEvent,
  AssessmentToolsEventBus
} from '@/components/AssessmentTool/EventBus/AssessmentToolsEventBus'

const selectMode = {
  learningObjective: 'learningObjective',
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
    selfOuts: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      knowledgeList: [],
      centuryTagList: [],
      knowledge: {},
      tags: [],
      TagType: TagType,
      centuryList: [],

      skillInputList: [],
      knowledgeInputList: [],
      centuryInputList: [],
      AllCurriculums: AllCurriculums,
      knowledgeTags: [],
      showQuickWordCreate: false,
      currentObjective: null,
      bloomParentId: '',
      bloomOptions: [],
      knowLedgeParentId: '',
      knowLedgeOptions: [],
      selectMode: selectMode,
      mode: selectMode.learningObjective,
      selectedLearningObjective: [],
      selectedPerformance: []
    }
  },
  created() {
    this.knowledgeList = this.learnOuts
    this.initBloomOptions()
    this.get21century()
    this.initSelfOuts()
  },
  watch: {
    learnOuts(val) {
      this.$logger.info('learnOuts change!', val)
      this.knowledgeList = val
    },

    selfOuts(val) {
      this.$logger.info('selfOuts change!', val)
      this.initSelfOuts()
    },
    // 更新centuryList中的数据，禁用已经被选择的选项
    centuryTagList(val) {
      this.$logger.info('centuryTagList change!', val, this.centuryList)

      // 重置所有的centuryList为可选
      this.centuryList.forEach(child => this.removeDisabled(child))
      // 只禁用已选择的
      this.centuryTagList.forEach(tagNameList => {
        let childList = this.centuryList
        for (let i = 0; i < tagNameList.length; i++) {
          const tagName = tagNameList[i]
          const child = childList.find(item => item.name === tagName)
          if (child) {
            if (i === tagNameList.length - 1) {
              child.disabled = true
            }
            childList = child.children
          } else {
            break
          }
        }
      })
    }
  },
  methods: {
    initBloomOptions() {
      if (this.customTags && this.customTags.recommends) {
        const bloom = this.customTags.recommends.find(item => item.name === 'Bloom\'s Taxonomy')
        if (bloom) {
          this.bloomOptions = bloom.keywords
          this.bloomParentId = bloom.id
        } else {
          this.bloomOptions = []
          this.bloomParentId = ''
        }
        const knowLedge = this.customTags.recommends.find(item => item.name === 'Knowledge Dimensions')
        if (knowLedge) {
          this.knowLedgeOptions = knowLedge.keywords
          this.knowLedgeParentId = knowLedge.id
        } else {
          this.knowLedgeOptions = []
          this.knowLedgeParentId = ''
        }
      }
    },
    initSelfOuts() {
      this.$logger.info('initSelfOuts', this.selfOuts)
      const skillInputList = this.selfOuts.filter(item => item.tagType === TagType.skill)
      const knowledgeInputList = this.selfOuts.filter(item => item.tagType === TagType.knowledge)
      const centuryInputList = this.selfOuts.filter(item => item.tagType === TagType.century)

      if (skillInputList.length) {
        this.skillInputList = skillInputList
      } else {
        this.skillInputList = []
      }
      this.$logger.info('skillInputList', this.skillInputList)

      if (knowledgeInputList.length) {
        this.knowledgeInputList = knowledgeInputList
      } else {
        this.knowledgeInputList = []
      }
      this.$logger.info('knowledgeInputList', this.skillInputList)

      if (centuryInputList.length) {
        this.centuryInputList = centuryInputList
      } else {
        this.centuryInputList = []
      }
      this.$logger.info('centuryInputList', this.skillInputList)
    },

    handleActiveDescription(type, k) {
      var index = this.knowledgeList.findIndex(item => item.knowledgeId === k.knowledgeId)
      if (this.knowledgeList[index].tagType !== TagType.knowledge &&
        this.knowledgeList[index].tagType !== TagType.century) {
        return
      }
      if (!this.knowledgeList[index].tagListVisible) {
        this.knowledgeList[index].tagListVisible = true
      } else {
        this.knowledgeList[index].tagListVisible = false
      }
      this.$set(this.knowledgeList, index, this.knowledgeList[index])
      logger.info('tagListVisible ', this.knowledgeList[index].tagListVisible)
    },
    treeForeach(tree, func) {
      tree.forEach(data => {
        data.children && this.treeForeach(data.children, func) // 遍历子树
        func(data)
      })
    },
    get21century() {
      getAll21Century({}).then((response) => {
        this.$logger.info('getAll21Century response', response)
        if (response.success) {
          this.centuryList = response.result
          this.treeForeach(this.centuryList, node => {
            node.disabled = false
            if (node.children.length === 0) {
              node.title = this.$options.filters['gradeFormat'](node.gradeNames)
            }
          })
        }
      }).finally(() => {
        this.subTreeLoading = false
      })
    },
    getKnowledgeListType(type) {
      if (type === TagType.skill) {
        return this.knowledgeList.filter(item => item.tagType === TagType.skill || item.tagType === TagType.ibSkill || item.tagType === TagType.idu)
      } else if (type === TagType.century) {
        return this.knowledgeList.filter(item => item.tagType === TagType.century ||
          item.tagType === TagType.common)
      } else {
        return this.knowledgeList.filter(item => item.tagType === type)
      }
    },

    // 21世纪的数据需要根据学科分类显示
    getCenturyCategoryList(type) {
      const list = this.getKnowledgeListType(type)
      const categoryDataMap = new Map()
      categoryDataMap.set('Others', [])
      list.forEach(item => {
        if (item.path) {
          if (item.path.indexOf('>') !== -1) {
            const pathArray = item.path.split('>')
            const categoryName = pathArray[1]
            // item.displayPath = pathArray.slice(2).join('>')
            if (categoryDataMap.has(categoryName)) {
              categoryDataMap.get(categoryName).push(item)
            } else {
              categoryDataMap.set(categoryName, [item])
            }
          } else {
            const categoryName = item.path
            // item.displayPath = item.path
            if (categoryDataMap.has(categoryName)) {
              categoryDataMap.get(categoryName).push(item)
            } else {
              categoryDataMap.set(categoryName, [item])
            }
          }
        } else {
          categoryDataMap.get('Others').push(item)
        }
      })

      const categoryDataList = []
      for (const [key, value] of categoryDataMap) {
        if (value && value.length > 0 && key !== 'Others') {
          categoryDataList.push({
            categoryName: key,
            list: value
          })
        }
      }

      // others放到最后
      if (categoryDataMap.get('Others').length > 0) {
        categoryDataList.push({
          categoryName: 'Others',
          list: categoryDataMap.get('Others')
        })
      }
      this.$logger.info('getCenturyCategoryList ', categoryDataList)
      return categoryDataList
    },

    removeDisabled(item) {
      if (item.disabled) {
        item.disabled = false
      }
      item.children && item.children.forEach(child => {
        this.removeDisabled(child)
      })
    },
    getSelfOuts() {
      const selfOuts = []
      if (this.skillInputList.length) {
        this.skillInputList.forEach(item => {
          if (item.name && item.name.trim()) {
            selfOuts.push(item)
          }
        })
      }

      if (this.knowledgeInputList.length) {
        this.knowledgeInputList.forEach(item => {
          if (item.name && item.name.trim()) {
            selfOuts.push(item)
          }
        })
      }

      if (this.centuryInputList.length) {
        this.centuryInputList.forEach(item => {
          if (item.name && item.name.trim()) {
            selfOuts.push(item)
          }
        })
      }

      this.$logger.info('getSelfOuts ', selfOuts)
      return selfOuts
    },
    handleCloseObjectiveTag(item, key, tagIndex) {
      item[key].splice(tagIndex, 1)
      console.log(item)
      this.$forceUpdate()
    },
    handleQuickWordSet(res, key) {
      console.log(res)
      setTimeout(() => {
        this.$refs.quickModal.style.display = 'none'
      }, 200)
      this.$emit('addCustomTag', res)
      const find = this.knowledgeList.find(item => item.knowledgeId === this.currentObjective.knowledgeId)
      if (find) {
        if (find[key]) {
          if (!find[key].find(item => item.id === res.id)) {
            find[key].push({
              id: res.id,
              name: res.word,
              bloomTag: res.bloomTag,
              knowledgeDimension: res.knowledgeDimension
            })
          }
        } else {
          this.$set(find, key, [{
            id: res.id,
            name: res.word,
            bloomTag: res.bloomTag,
            knowledgeDimension: res.knowledgeDimension
          }])
        }
      } else {
        let findInput = this.skillInputList.find(item => item.key === this.currentObjective.key)
        if (!findInput) {
          findInput = this.knowledgeInputList.find(item => item.key === this.currentObjective.key)
          if (!findInput) {
            findInput = this.centuryInputList.find(item => item.key === this.currentObjective.key)
          }
        }
        if (findInput && findInput[key]) {
          if (!findInput[key].find(item => item.id === res.id)) {
            findInput[key].push({
              id: res.id,
              name: res.word,
              bloomTag: res.bloomTag,
              knowledgeDimension: res.knowledgeDimension
            })
          }
        } else {
          this.$set(findInput, key, [{
            id: res.id,
            name: res.word,
            bloomTag: res.bloomTag,
            knowledgeDimension: res.knowledgeDimension
          }])
        }
      }
    },
    handleSaveCommanTerm() {
      this.$refs.commandTermFormRef.validate(valid => {
        if (valid) {
          this.saveCommanTermLoading = true
          KnowledgeTermTagCustomCreate({
            name: this.commandTermForm.name,
            bloomTagId: this.bloomParentId,
            bloomTag: this.commandTermForm.bloom,
            knowledgeDimensionId: this.knowLedgeParentId,
            knowledgeDimension: this.commandTermForm.knowledge,
            type: 1,
            isGlobal: 2
          }).then(res => {
            if (res.success) {
              this.handleQuickWordSet({
                word: this.commandTermForm.name,
                parentId: this.bloomParentId,
                tag: this.commandTermForm.bloom,
                bloomTag: this.commandTermForm.bloom,
                knowledgeDimensionId: this.knowLedgeParentId,
                knowledgeDimension: this.commandTermForm.knowledge,
                id: res.result.id
              }, 'commandTerms')
            }
          }).finally(() => {
            this.saveCommanTermLoading = false
          })
        } else {
          return false
        }
      })
    },
    handleChangeLevel(val, tag) {
      if (val) {
        tag[val.type] = val.title
      }
    },

    handleAddLearningObjective (dataItem) {
      const index = this.selectedLearningObjective.findIndex(item => item === dataItem)
      if (index === -1) {
        this.selectedLearningObjective.push(dataItem)
      } else {
        this.selectedLearningObjective.splice(index, 1)
      }
    },

    handleAddPerformance (dataItem) {
      const index = this.selectedPerformance.findIndex(item => item === dataItem)
      if (index === -1) {
        this.selectedPerformance.push(dataItem)
      } else {
        this.selectedPerformance.splice(index, 1)
      }
    },

    handleInsert () {
      if (this.mode === this.selectMode.learningObjective) {
        AssessmentToolsEventBus.$emit(AssessmentToolsEvent.SelectLearningObjective, this.selectedLearningObjective)
        this.selectedLearningObjective = []
      } else if (this.mode === this.selectMode.performance) {
        AssessmentToolsEventBus.$emit(AssessmentToolsEvent.SelectLearningObjective, this.selectedPerformance)
        this.selectedPerformance = []
      }
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
  }
}

.objectives-wrapper {
  .objectives-list {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 10px;

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

    .delete-action {
      cursor: pointer;
      position: absolute;
      right: -30px;
      width: 30px;
      top: 10px;
      display: none;
      align-items: center;
      justify-content: center;
      flex-direction: row;
    }

    &:hover {
      .delete-action {
        display: flex;
      }
    }

    .skt-description-sub-list {
      max-height: 300px;
      overflow-y: scroll;
      border: 1px solid #f9f9f9;
    }

    .objectives-list-item {
      background: #fff;
      width: 100%;
      opacity: 1;
      //border-radius: 4px;
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      position: relative;
      color: #000000;
      box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.16);

      &:hover {
        color: @primary-color;
      }

      .skt-description {
        cursor: pointer;
        width: 98%;
        padding-right: 10px;
        line-height: 22px;
        position: relative;
        color: #444444;

        .description-txt {
          padding: 10px;
          border: 1px dashed #666;
          line-height: 24px;
          color: #11142D;
          display: inline-block;
          width: 100%;
        }
      }

      .skt-description-21 {
        width: 90%;
      }

      .skt-description-tag-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 5px 10px;

        .tag-list-item {
          margin: 3px 10px 3px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          vertical-align: middle;
          cursor: pointer;

          .tag-item {
            cursor: pointer;
            border-radius: 10px;
            word-break: normal;
            width: auto;
            display: block;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow: hidden;
            padding-bottom: 3px;

            /deep/ .anticon-close {
              color: rgba(239, 78, 78, 1);
            }
          }
        }

        .skill-mode {
          .tag-item {
            //background-color: rgba(21, 195, 154, 0.1);
            color: #000000;
            //border: 1px solid rgba(21, 195, 154, 1);
            background: #FF933C;
            border: 1px solid #92B2D1;
          }
        }

      }

      .actions {
        display: flex;
        align-items: center;

        .add-action {
          display: flex;
          cursor: pointer;
          height: 20px;

          img {
            width: 20px;
          }
        }

        .up-down {
          cursor: pointer;
          display: flex;
          width: 20px;
          margin-left: 8px;
        }
      }
    }

    .objectives-list-item-skill {
      //background: #FEF3E4;
      //border: 1px solid #EED1AA;
      color: #FF786D;
      border-left: 10px solid #FF786D;
      //border-radius: 10px;
    }

    .objectives-list-item-learn {
      //background: #47A3E4;
      //border: 1px solid #B1D1CC;
      color: #47A3E4;
      border-left: 10px solid #47A3E4;
      //opacity: 1;
      //border-radius: 10px;
    }

    .objectives-list-item-21 {
      //background: #FF933C;
      //border: 1px solid #92B2D1;
      //opacity: 1;
      //border-radius: 10px;
      color: #FF933C;
      border-left: 10px solid #FF933C;
    }
  }
}

.search-tag-list {
  height: 300px;
  overflow-y: scroll;

  .search-description-item {
    margin-bottom: 10px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    border: 1px solid rgba(216, 216, 216, 1);
    opacity: 1;
    border-radius: 4px;

    .description-info {
      padding: 10px;

      .info-detail {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        .info-checked {
          color: #15C39A;
        }
      }
    }
  }

  .selected-item {
    background: rgba(21, 195, 154, 0.1);
    border: 1px solid #15C39A;
    opacity: 1;
    border-radius: 4px;
  }
}

.ensure-setting-modal {
  margin-bottom: 30px;

  .tips {
    text-align: center;
    margin-bottom: 20px;
    font-family: Inter-Bold;
    font-size: 15px;
    color: #474747;
  }

  .modal-ensure-action-line-center {
    width: 40%;
    display: flex;
    justify-content: space-between;
    margin: 0px auto;
    margin-top: 40px;
  }
}

.customize-objectives-list {
  .objectives-input-item {
    position: relative;
    margin-bottom: 10px;

    .skill-input, .knowledge-input, .century-input {
      width: 100%;
    }

    .self-out-delete-icon {
      cursor: pointer;
      position: absolute;
      right: -30px;
      width: 30px;
      top: 10px;
      display: none;
      align-items: center;
      justify-content: center;
      flex-direction: row;
    }

    &:hover {
      .self-out-delete-icon {
        display: flex;
      }
    }
  }
}

.category-name {
  line-height: 25px;
  padding-bottom: 5px;
  cursor: pointer;
  font-weight: bold;
  color: #999;
}

.quick-keyword-con {
  border: 1px solid #dfdfdf;
  background: #fff;
  padding: 5px 10px;
  // width: 330px;
}

.objectives-tag {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 10px;

  .objectives-tag-type {
    .objectives-tag-title {
      width: 110px;
      color: #333;
    }

    .objectives-tag-content {
      display: flex;
      flex-wrap: wrap;

      .objectives-tag-item {
        margin: 3px;
        display: flex;
        align-items: center;
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
