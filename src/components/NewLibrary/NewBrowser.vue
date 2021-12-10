<template>
  <div class="new-library" id="new-library">
    <div class="navigation">
      <new-navigation />
    </div>
    <div class="main">
      <div class="selected-content">
        <div class="recommend-description" v-if="recommendData.length">
          <div class="recommend-title">
            <h3>Recommended assessment objectives</h3>
          </div>
          <div class="recommend-detail">
            <div class="recommend-list" v-for="(recommendDataItem, rIndex) in recommendData" :key="rIndex">
              <div class="recommend-from">
                <h4>From : {{ recommendDataItem.fromName }}</h4>
              </div>
              <div
                class="recommend-item"
                v-for="(recommendItem, rI) in recommendDataItem.list"
                :key="'ri-' + rI"
                @click="handleAddRecommend(recommendItem)"
                :data-id="recommendItem.id">
                <a-tooltip class="my-tooltip">
                  <template slot="title">
                    {{ recommendItem.path }}
                  </template>
                  <div :class="{'left-icon': true, 'active-left-icon': selectedRecommendIdList.indexOf(recommendItem.knowledgeId) !== -1}">
                    <a-icon type="check-circle" style="color: #07AB84; font-size: 16px;" class="recommend-selected" />
                  </div>
                  <div class="right-name">
                    {{ recommendItem.name }}
                  </div>
                </a-tooltip>
              </div>
            </div>
          </div>
        </div>
        <a-divider v-if="recommendData.length"/>
        <div class="selected-list">
          <div class="content-list">
            <div
              class="content-item selected-line"
              v-for="(item, kIndex) in selectedCurriculumList"
              :key="'curr-' + kIndex">
              <div class="name">
                <div class="name-text">
                  {{ item.knowledgeData.name }}
                </div>
                <div class="action-icon" @click="handleRemoveSelected(item)">
                  <a-icon type="close-circle" style="color: #07AB84; font-size: 16px;" />
                </div>
              </div>
            </div>
            <div
              class="content-item selected-line"
              v-for="(item, sIndex) in selectedSubjectSpecificSkillList"
              :key="'sub-' + sIndex">
              <div class="name">
                <div class="name-text">
                  {{ item.knowledgeData.name }}
                </div>
                <div class="action-icon" @click="handleRemoveSelected(item)">
                  <a-icon type="close-circle" style="color: #07AB84; font-size: 16px;" />
                </div>
              </div>
            </div>

            <div
              class="content-item selected-line"
              v-for="(item, aIndex) in selectedAssessmentList"
              :key="'assessment-' + aIndex">
              <div class="name">
                <div class="name-text">
                  {{ item.knowledgeData.name }}
                </div>
                <div class="action-icon" @click="handleRemoveSelected(item)">
                  <a-icon type="close-circle" style="color: #07AB84; font-size: 16px;" />
                </div>
              </div>
            </div>

            <div
              class="content-item selected-line"
              v-for="(item, aIndex) in selected21CenturySkillList"
              :key="'21-' + aIndex">
              <div class="name">
                <div class="name-text">
                  {{ item.knowledgeData.name }}
                </div>
                <div class="action-icon" @click="handleRemoveSelected(item)">
                  <a-icon type="close-circle" style="color: #07AB84; font-size: 16px;" />
                </div>
              </div>
            </div>

            <div
              class="content-item selected-line"
              v-for="(item, aIndex) in selectedBigIdeaList"
              :key="'big-' + aIndex">
              <div class="name">
                <div class="name-text">
                  {{ item.bigIdea }}
                </div>
                <div class="action-icon" @click="handleRemoveSelected(item)">
                  <a-icon type="close-circle" style="color: #07AB84; font-size: 16px;" />
                </div>
              </div>
            </div>

            <div
              class="content-item selected-line"
              v-for="(item, aIndex) in selectedAll21CenturyList"
              :key="'all-21-' + aIndex">
              <div class="name">
                <div class="name-text">
                  {{ item.item.name }}
                </div>
                <div class="action-icon" @click="handleRemoveSelected(item)">
                  <a-icon type="close-circle" style="color: #07AB84; font-size: 16px;" />
                </div>
              </div>
            </div>

            <div
              class="content-item selected-line"
              v-for="(item, aIndex) in selectedKnowledgeList"
              :key="'sync-' + aIndex">
              <div class="name">
                <div class="name-text">
                  {{ item.name }}
                </div>
                <div class="action-icon" @click="handleRemoveSelected(item)">
                  <a-icon type="close-circle" style="color: #07AB84; font-size: 16px;" />
                </div>
              </div>
            </div>

            <div
              class="content-item selected-line"
              v-for="(item, aIndex) in selectedRecommendList"
              :key="'rec-' + aIndex">
              <div class="name">
                <div class="name-text">
                  {{ item.name }}
                </div>
                <div class="action-icon" @click="handleRemoveSelectedRecommend(item)">
                  <a-icon type="close-circle" style="color: #07AB84; font-size: 16px;" />
                </div>
              </div>
            </div>

            <div
              class="content-item selected-line"
              v-for="(item, aIndex) in selectedIduList"
              :key="'idu-' + aIndex">
              <div class="name">
                <div class="name-text">
                  {{ item.knowledgeData.name }}
                </div>
                <div class="action-icon" @click="handleRemoveSelected(item)">
                  <a-icon type="close-circle" style="color: #07AB84; font-size: 16px;" />
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
          />
        </div>
        <div class="content-list" v-show="!expandedListFlag">
          <new-content-list
            ref="contentList"
            @select-big-idea="handleSelectBigIdeaData"
            @select-sync="handleSelectListData"
            @select-curriculum="handleSelectCurriculumListData"
            @select-subject-specific-skill="handleSelectSubjectSpecificSkillListData"
            @select-century-skill="handleSelect21CenturySkillListData"
            @select-all-21-century="handleSelectAll21CenturyListData"
            @select-assessmentType="handleSelectAssessmentType"
            @select-idu="handleSelectIdu"
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
    }
  },
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
      selectedRecommendIdList: []
    }
  },
  created () {
    this.$logger.info('NewBrowser selectMode', this.selectMode)
    this.$logger.info('NewBrowser showMenu', this.showMenu)
    this.$logger.info('recommendData', this.recommendData)
  },
  mounted () {
  },
  methods: {
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

    handleRemoveSelectedRecommend (recommendItem) {
      this.$logger.info('NewBrowser handleRemoveSelected recommendItem', recommendItem)
      this.handleAddRecommend(recommendItem)
    },

    handleAddRecommend (recommendItem) {
      this.$logger.info('NewBrowser handleAddRecommend', recommendItem)
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
  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";

.new-library {
  .navigation {}
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
      position: relative;
      width: 770px;
      flex-shrink: 0;
      height: 100%;
      overflow-y: scroll;
      background-color: #fff;

      .selected-list {
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
              display: block;
              position: absolute;
              right: 5px;
              top: 50%;
              margin-top: -10px;
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
            background-color: #F8F8F8;

            .name {
              cursor: pointer;
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              word-break: break-all;
              padding: 0 10px;
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
        span {
          font-size: 13px;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
          line-height: 35px;

          .left-icon {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 35px;
            text-align: center;
            opacity: 0;
          }

          .active-left-icon {
            opacity: 1;
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
</style>
