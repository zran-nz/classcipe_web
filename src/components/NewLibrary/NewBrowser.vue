<template>
  <div class="new-library" id="new-library">
    <div class="navigation">
      <div class="select-curriculum">
        <div class="my-curriculum-select">
          <a-select
            v-if="curriculumOptions.length"
            @change="handleCurriculumChange"
            v-model="currentCurriculumId"
            :default-value="$store.getters.bindCurriculum"
            class="select-curriculum">
            <a-select-option v-for="(curriculum,index) in curriculumOptions" :value="curriculum.id" :key="index">
              {{ curriculum.name }}
            </a-select-option>
            <div class="arrow-self" slot="suffixIcon">
              <img src="~@/assets/icons/library/arrow.png" />
            </div>
          </a-select>
        </div>
      </div>
      <div class="navigation-item" :style="{'left': (expandedListFlag ? 785 : 125) + 'px', 'width': (expandedListFlag ? 380 : 1000) + 'px',}">
        <new-navigation />
      </div>
    </div>
    <div class="main">
      <div class="selected-content">
        <div class="recommend-description" v-if="!isEmptyRecommend" >
          <div class="recommend-title">
            <h3>Recommended assessment objectives</h3>
          </div>
          <div class="recommend-detail">
            <div class="recommend-list" v-for="(recommendDataItem, rIndex) in recommendData" :key="rIndex">
              <div class="recommend-from">
                <h4>From : {{ recommendDataItem.fromTypeName }} / {{ recommendDataItem.fromName }}</h4>
              </div>
              <div
                :class="{'recommend-item': true, 'my-selected-item': selectedRecommendIdList.indexOf(recommendItem.knowledgeId) !== -1,
                         'disabled-select-item': mySelectedIdList.indexOf(recommendItem.knowledgeId) !== -1}"
                v-for="(recommendItem, rI) in recommendDataItem.list"
                :key="'ri-' + rI"
                @click="handleAddRecommend(recommendItem)"
                :data-knowledge-id="recommendItem.knowledgeId"
                :data-selected-id-list="mySelectedIdList">
                <a-tooltip class="my-tooltip">
                  <template slot="title">
                    {{ recommendItem.path }}
                  </template>
                  <div class="select-block">
                    <a-icon
                      class="select-block-icon"
                      type="border"
                      v-if="selectedRecommendIdList.indexOf(recommendItem.knowledgeId) === -1"/>
                    <div class="selected-icon" v-if="selectedRecommendIdList.indexOf(recommendItem.knowledgeId) !== -1">
                      <img src="~@/assets/icons/lesson/selected.png"/>
                    </div>
                  </div>

                  <div class="right-name">
                    {{ recommendItem.name }}
                  </div>
                </a-tooltip>
              </div>
            </div>
          </div>
        </div>
        <div class="selected-list">
          <div class="content-list">
            <div
              :class="{'content-item': true, 'selected-line': true}"
              v-for="(item, mIndex) in mySelectedList"
              :key="'my-' + mIndex">
              <div class="name">
                <div class="name-text">
                  {{ item.name }}
                </div>
                <div class="action-icon">
                  <img src="~@/assets/icons/lesson/selected.png"/>
                </div>
                <div class="action-icon-right" @click="handleRemoveMySelected(item)">
                  <img src="~@/assets/icons/evaluation/delete.png"/>
                </div>
              </div>
            </div>
            <div
              :class="{'content-item': true, 'selected-line': true}"
              v-for="(item, kIndex) in selectedCurriculumList"
              :key="'curr-' + kIndex">
              <div class="name">
                <div class="name-text">
                  {{ item.knowledgeData.name }}
                </div>
                <div class="action-icon">
                  <img src="~@/assets/icons/lesson/selected.png"/>
                </div>
                <div class="action-icon-right" @click="handleRemoveSelected(item)">
                  <img src="~@/assets/icons/evaluation/delete.png"/>
                </div>
              </div>
            </div>
            <div
              :class="{'content-item': true, 'selected-line': true}"
              v-for="(item, sIndex) in selectedSubjectSpecificSkillList"
              :key="'sub-' + sIndex">
              <div class="name">
                <div class="name-text">
                  {{ item.knowledgeData.name }}
                </div>
                <div class="action-icon">
                  <img src="~@/assets/icons/lesson/selected.png"/>
                </div>
                <div class="action-icon-right" @click="handleRemoveSelected(item)">
                  <img src="~@/assets/icons/evaluation/delete.png"/>
                </div>
              </div>
            </div>

            <div
              :class="{'content-item': true, 'selected-line': true}"
              v-for="(item, aIndex) in selectedAssessmentList"
              :key="'assessment-' + aIndex">
              <div class="name">
                <div class="name-text">
                  {{ item.knowledgeData.name }}
                </div>
                <div class="action-icon">
                  <img src="~@/assets/icons/lesson/selected.png"/>
                </div>
                <div class="action-icon-right" @click="handleRemoveSelected(item)">
                  <img src="~@/assets/icons/evaluation/delete.png"/>
                </div>
              </div>
            </div>

            <div
              :class="{'content-item': true, 'selected-line': true}"
              v-for="(item, aIndex) in selected21CenturySkillList"
              :key="'21-' + aIndex">
              <div class="name">
                <div class="name-text">
                  {{ item.knowledgeData.name }}
                </div>
                <div class="action-icon">
                  <img src="~@/assets/icons/lesson/selected.png"/>
                </div>
                <div class="action-icon-right" @click="handleRemoveSelected(item)">
                  <img src="~@/assets/icons/evaluation/delete.png"/>
                </div>
              </div>
            </div>

            <div
              :class="{'content-item': true, 'selected-line': true, 'my-selected-item': mySelectedIdList.indexOf(item.bigIdea) !== -1}"
              v-for="(item, aIndex) in selectedBigIdeaList"
              :key="'big-' + aIndex">
              <div class="name">
                <div class="name-text">
                  {{ item.bigIdea }}
                </div>
                <div class="action-icon">
                  <img src="~@/assets/icons/lesson/selected.png"/>
                </div>
                <div class="action-icon-right" @click="handleRemoveSelected(item)">
                  <img src="~@/assets/icons/evaluation/delete.png"/>
                </div>
              </div>
            </div>

            <div
              :class="{'content-item': true, 'selected-line': true}"
              v-for="(item, aIndex) in selectedAll21CenturyList"
              :key="'all-21-' + aIndex">
              <div class="name">
                <div class="name-text">
                  {{ item.item.name }}
                </div>
                <div class="action-icon">
                  <img src="~@/assets/icons/lesson/selected.png"/>
                </div>
                <div class="action-icon-right" @click="handleRemoveSelected(item)">
                  <img src="~@/assets/icons/evaluation/delete.png"/>
                </div>
              </div>
            </div>

            <div
              :class="{'content-item': true, 'selected-line': true}"
              v-for="(item, aIndex) in selectedKnowledgeList"
              :key="'sync-' + aIndex">
              <div class="name">
                <div class="name-text">
                  {{ item.name }}
                </div>
                <div class="action-icon">
                  <img src="~@/assets/icons/lesson/selected.png"/>
                </div>
                <div class="action-icon-right" @click="handleRemoveSelected(item)">
                  <img src="~@/assets/icons/evaluation/delete.png"/>
                </div>
              </div>
            </div>

            <div
              :class="{'content-item': true, 'selected-line': true}"
              v-for="(item, aIndex) in selectedIduList"
              :key="'idu-' + aIndex">
              <div class="name">
                <div class="name-text">
                  {{ item.knowledgeData.name }}
                </div>
                <div class="action-icon" >
                  <img src="~@/assets/icons/lesson/selected.png"/>
                </div>
                <div class="action-icon-right" @click="handleRemoveSelected(item)">
                  <img src="~@/assets/icons/evaluation/delete.png"/>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div class="selected-toggle-mask" v-show="!expandedListFlag" @click="expandedListFlag = !expandedListFlag"></div>
        <div class="expand-icon" @click="expandedListFlag = !expandedListFlag" :style="{'left': (!expandedListFlag ? 30 : 695) + 'px'}">
          <template v-if="expandedListFlag">
            <a-icon type="double-left" style="font-size: 20px; color: #07AB84"/>
          </template>
          <template v-if="!expandedListFlag">
            <a-icon type="double-right" style="font-size: 20px; color: #07AB84"/>
          </template>
        </div>
        <div class="modal-ensure-action-line-center" v-show="hasSelectedContent">
          <a-space>
            <a-button class="action-item action-cancel" shape="round" @click="handleCancelSelectData">Cancel</a-button>
            <a-button class="action-ensure action-item" type="primary" shape="round" @click="handleEnsureSelectData">Ok</a-button>
          </a-space>
        </div>
      </div>
      <div class="main-tree-content" :style="{'left': (expandedListFlag ? 765 : 100) + 'px'}">
        <div class="selected-toggle-mask" @click="expandedListFlag = !expandedListFlag" v-show="expandedListFlag"></div>
        <div class="tree-navigation">
          <new-tree-navigation
            :select-mode="selectMode"
            :question-index="questionIndex"
            :sync-data="syncData"
            :show-menu="showMenu"
            :default-active-menu="defaultActiveMenu"
            :default-curriculum-id="defaultCurriculumId"
          />
        </div>
        <div class="content-list" v-show="!expandedListFlag">
          <new-content-list
            :selected-list="mySelectedList"
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
  </div>
</template>

<script>

import NewNavigation from '@/components/NewLibrary/NewNavigation'
import NewContentList from '@/components/NewLibrary/NewContentList'
import NewTreeNavigation from '@/components/NewLibrary/NewTreeNavigation'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { UtilMixin } from '@/mixins/UtilMixin'
import {
  getAllCurriculums
} from '@/api/preference'

export default {
  name: 'NewBrowser',
  components: {
    NewNavigation,
    NewContentList,
    NewTreeNavigation,
    ContentTypeIcon
  },
  props: {
    selectMode: {
      type: String,
      default: null
    },
    questionIndex: {
      type: String,
      default: null
    },
    syncData: {
      type: Array,
      default: () => []
    },
    showMenu: {
      type: Array,
      default: () => []
    },
    defaultActiveMenu: {
      type: String,
      default: null
    },
    recommendData: {
      type: Array,
      default: () => []
    },
    selectedIdList: {
      type: Array,
      default: () => []
    },
    selectedList: {
      type: Array,
      default: () => []
    }
  },
  mixins: [UtilMixin],
  data () {
    return {
      expandedListFlag: false,
      mainTreeContentLeft: 200,
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

      currentCurriculumId: this.$store.getters.bindCurriculum ? this.$store.getters.bindCurriculum : '1',
      defaultCurriculumId: this.$store.getters.bindCurriculum ? this.$store.getters.bindCurriculum : '1',
      curriculumOptions: [],
      mySelectedIdList: [], // 所有已选择的id和类型
      mySelectedList: [],

      isEmptyRecommend: true
    }
  },
  computed: {
    hasSelectedContent () {
      return this.mySelectedList.length ||
        this.selectedCurriculumList.length ||
        this.selectedKnowledgeList.length ||
        this.selected21CenturySkillList.length ||
        this.selectedSubjectSpecificSkillList.length ||
        this.selectedAssessmentList.length ||
        this.selectedIduList.length ||
        this.selectedAll21CenturyList.length ||
        this.selectedBigIdeaList.length ||
        this.selectedRecommendList.length
    }
  },
  watch: {
    currentCurriculumId (val) {
      this.$logger.info('NewBrowser change currentCurriculumId to ' + val)
      this.defaultCurriculumId = val
    }
  },
  created () {
    this.$logger.info('NewBrowser selectMode', this.selectMode)
    this.$logger.info('NewBrowser showMenu', this.showMenu)
    this.$logger.info('recommendData', this.recommendData)
    this.$logger.info('selectedIdList', this.selectedIdList)
    this.$logger.info('selectedList', this.selectedList)
    this.mySelectedIdList = this.selectedIdList

    getAllCurriculums().then((response) => {
      this.$logger.info('getAllCurriculums', response)
      this.curriculumOptions = response.result
      this.$logger.info('getAllCurriculums', this.curriculumOptions)
    })

    const recommendIdList = []
    this.recommendData.forEach((item) => {
      item.list.forEach(dataItem => {
        recommendIdList.push(dataItem.knowledgeId)
      })
      if (item.list.length > 0) {
        this.isEmptyRecommend = false
      }
    })

    this.mySelectedList = []
    this.selectedList.forEach(item => {
      if (recommendIdList.indexOf(item.knowledgeId) === -1) {
        this.mySelectedList.push(item)
      } else {
        this.selectedRecommendIdList.push(item.knowledgeId)
        this.selectedRecommendList.push(item)
      }
    })
    this.$logger.info('mySelectedList', this.mySelectedList)
    this.$logger.info('selectedRecommendList', this.selectedRecommendList)
    this.$logger.info('selectedRecommendIdList', this.selectedRecommendIdList)
  },
  methods: {

    handleCurriculumChange (value) {
      this.$logger.info('handleCurriculumChange ' + value)
      this.currentCurriculumId = value
    },

    handleSelectListData (data) {
      this.$logger.info('NewBrowser handleSelectListData', data)
      this.selectedKnowledgeList = data
      this.$emit('select-sync', data)
    },
    // curriculum
    handleSelectCurriculumListData (data) {
      this.$logger.info('NewBrowser handleSelectCurriculumListData', data)
      this.selectedCurriculumList = data
      this.$emit('select-curriculum', data)
    },

    // subject-specific-skill
    handleSelectSubjectSpecificSkillListData (data) {
      this.$logger.info('NewBrowser handleSelectSubjectSpecificSkillListData', data)
      this.selectedSubjectSpecificSkillList = data
      this.$emit('select-subject-specific-skill', data)
    },

    // century-skill
    handleSelect21CenturySkillListData (data) {
      this.$logger.info('NewBrowser handleSelect21CenturySkillListData', data)
      this.selected21CenturySkillList = data
      this.$emit('select-century-skill', data)
    },

    handleSelectAll21CenturyListData (data) {
      this.$logger.info('NewBrowser handleSelectAll21CenturyListData', data)
      this.selectedAll21CenturyList = data
      this.$emit('select-all-21-century', data)
    },
    // assessment type
    handleSelectAssessmentType (data) {
      this.$logger.info('NewBrowser handleSelectAssessmentType', data)
      this.selectedAssessmentList = data
      this.$emit('select-assessmentType', data)
},

    handleSelectIdu (data) {
      this.$logger.info('NewBrowser handleSelectIdu', data)
      this.selectedIduList = data
      this.$emit('select-idu', data)
    },

    handleSelectBigIdeaData (data) {
      this.$logger.info('NewBrowser handleSelectBigIdeaData', data)
      this.selectedBigIdeaList = data
      this.$emit('select-big-idea', data)
    },

    handleRemoveSelected (item) {
      this.$logger.info('NewBrowser handleRemoveSelected', item)
      this.$refs['contentList'].handleRemoveSelected(item)
    },

    handleUpdateSelectedList (data) {
      this.$logger.info('NewBrowser handleUpdateSelectedList', data)
      this.mySelectedList = data
    },
    handleAddRecommend (recommendItem) {
      this.$logger.info('NewBrowser handleAddRecommend', recommendItem, 'this.mySelectedIdList.indexOf(recommendItem.knowledgeId)', this.mySelectedIdList.indexOf(recommendItem.knowledgeId))
      if (this.mySelectedIdList.indexOf(recommendItem.knowledgeId) === -1) {
        const existIndex = this.selectedRecommendList.findIndex(item => item.knowledgeId === recommendItem.knowledgeId)
        const existIdIndex = this.selectedRecommendIdList.findIndex(item => item === recommendItem.knowledgeId)
        if (existIndex !== -1) {
          this.selectedRecommendList.splice(existIndex, 1)
          this.selectedRecommendIdList.splice(existIdIndex, 1)
        } else {
          this.selectedRecommendList.push(recommendItem)
          this.selectedRecommendIdList.push(recommendItem.knowledgeId)
        }
        this.$emit('select-recommend', this.selectedRecommendList)
        this.$logger.info('after NewBrowser handleAddRecommend', this.selectedRecommendList, this.selectedRecommendIdList)
      }
    },

    handleRemoveMySelected (data) {
      this.$logger.info('NewBrowser handleRemoveMySelected', data)
      const index = this.mySelectedList.findIndex(item => (data.knowledgeId === item.knowledgeId))
      if (index > -1) {
        this.mySelectedList.splice(index, 1)
      }
    },

    handleCancelSelectData () {
      this.$logger.info('NewBrowser handleCancelSelectData')
      this.$emit('cancel-select')
    },

    handleEnsureSelectData () {
      this.$logger.info('NewBrowser handleEnsureSelectData')
      this.$emit('ensure-select')
    }
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";

.new-library {
  .navigation {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding-bottom: 10px;

    .navigation-item {
      top: 18px;
      position: absolute;
      transition: all 200ms ease-in;
    }
  }

  .main {
    border: 1px solid #e9e9e9;
    overflow-y: hidden;
    height: calc(100vh - 200px);
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    position: relative;
    .selected-content {
      z-index: 100;
      padding-bottom: 50px;
      position: relative;
      width: 770px;
      flex-shrink: 0;
      height: 100%;
      overflow-y: scroll;
      background-color: #fff;

      .selected-list {
        padding: 10px 5px;
        z-index: 100;
        overflow: scroll;
        .content-list {
          flex: 1;
          overflow-y: scroll;
          overflow-x: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          height: calc(100%- 40);

          .content-empty {
            margin-top: 150px;
          }

          .even-line {
            background-color: #ffffff;
          }

          .odd-line {
            background-color: #F8F8F8;
          }

          .selected-line {
            position: relative;

            .action-icon {
              position: absolute;
              left: 10px;
              top: 50%;
              margin-top: -10px;
              display: flex;
              align-items: center;
              justify-content: center;

              img {
                width: 20px;
                height: 20px;
              }
            }

            .action-icon-right {
              position: absolute;
              right: 5px;
              top: 50%;
              margin-top: -20px;
              display: flex;
              align-items: center;
              justify-content: center;

              img {
                width: 40px;
              }
            }
          }

          .active-line {
            background-color: #EBEEFD;
            color: @primary-color;
          }

          .content-item {
            border: 1px solid #fff;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            padding: 10px;
            margin: 3px;
            position: relative;
            border: 1px solid @primary-color;
            background-color: #5fc9b04a !important;

            .name {
              cursor: pointer;
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              word-break: break-all;
              padding-left: 25px;
              padding-right: 25px;
              width: 100%;
              .icon {
                .file-dir-icon {
                  padding: 3px 0;
                  box-sizing: border-box;
                  color: #82c0d8;
                  font-size: 18px;
                }
              }

              .name-text {
                padding: 0 5px;
                box-sizing: border-box;
                word-break: break-word;
                white-space:normal;
              }
              .collapse-item{
                display: flex;
                padding: 10px;
                .collapse-icon{
                  right: 10px;
                  position: absolute;
                }
                .tag-item{
                  color: rgb(21, 195, 154);
                  border: 1px solid rgb(21, 195, 154);
                  cursor: pointer;
                  border-radius: 10px;
                  word-break: normal;
                  width: auto;
                  display: block;
                  white-space: pre-wrap;
                  overflow-wrap: break-word;
                }
              }
            }

            .owner {
              width: 170px;
              padding: 0 10px;
              text-align: left;
            }

            .date-modified {
              width: 170px;
              padding: 0 10px;
              text-align: left;
            }
          }
        }
      }

      .expand-icon {
        background-color: #fff;
        box-shadow: 0 0 3px 3px rgba(159, 159, 159, 0.26);
        border-radius: 40px;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: absolute;
        top: 50%;
        margin-top: -10px;
        z-index: 200;
        transition: none;
      }

      .modal-ensure-action-line-center {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
      }
    }

    .main-tree-content {
      width: 1048px;
      z-index: 150;
      position: absolute;
      transition: all 200ms ease-in;
      box-shadow: -3px 0 5px 0 rgba(31, 33, 44, 10%);
      overflow-y: hidden;
      height: 100%;
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

  *::-webkit-scrollbar {
    width: 3px;
    height: 0;
  }
  *::-webkit-scrollbar-track {
    border-radius: 1px;
    background: rgba(0,0,0,0.00);
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
  }
  /* 滚动条滑块 */
  *::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: rgba(0,0,0,0.12);
    -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
  }
}

.selected-toggle-mask {
  z-index: 250;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
}

.recommend-description {
  background-color: rgba(253, 238, 218, 0.5);

  .recommend-title {
    padding: 5px 10px;
    h3 {
      color: #000000;
      font-weight: bold;
      font-family: Inter-Bold;
    }
  }

  .recommend-detail {
    padding: 0 10px 10px 10px;
    .recommend-list {
      .recommend-from {
        font-size: 14px;
        cursor: pointer;

        h4 {
          color: #000000;
          font-weight: bold;
          display: inline-block;
        }
      }

      .recommend-item {
        background-color: rgba(255, 187, 0, 0.1);
        margin-bottom: 10px;
        box-sizing: content-box;
        border: 1px solid rgba(255, 187, 0, 0.1);
        span {
          font-size: 13px;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
          line-height: 40px;

          .left-icon {
            width: 40px;
            min-width: 40px;
            height: 35px;
            text-align: center;
            display: none;
          }

          .active-left-icon {
            display: none;
          }

          .right-name {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items: flex-start;
          }
        }
      }
    }
  }
}

.my-selected-item {
  border: 1px solid @primary-color;
  background-color: #5fc9b04a !important;
}

.my-curriculum-select {
  min-width: 100px;
  display: flex;
  flex-direction: row;
  align-items: center;
  .select-curriculum-tips{
    color: #aaa;
  }
}

.select-block {
  cursor: pointer;
  display: flex;
  height: 40px;
  width: 40px;
  min-width: 40px;
  justify-content: center;
  align-items: center;

  .select-block-icon {
    color: #ccc;
    font-size: 20px;
    cursor: pointer;
  }

  .selected-icon {
    img {
      width: 20px;
    }
  }
}

.disabled-select-item {
  color: #D8D8D8;
}
</style>
