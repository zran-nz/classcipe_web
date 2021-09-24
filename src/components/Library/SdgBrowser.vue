<template>
  <div class="browser-block">
    <div class="browser-block-item-wrapper">
      <div class="browser-block-item" :style="{width: blockWidth + 'px' , minWidth: blockWidth + 'px' }">
        <!--      sdg list-->
        <div
          :class="{
            'browser-item': true,
            'odd-line': index % 2 === 0,
            'active-line': currentSdgId === sdgItem.id
          }"
          v-for="(sdgItem, index) in sdgList"
          @click="handleSelectSdgItem(sdgItem)"
          :key="index">
          <a-tooltip :mouseEnterDelay="1">
            <template slot="title">
              {{ sdgItem.name }}
            </template>
            <dir-icon dir-type="blue" v-if="currentSdgId !== sdgItem.id"/>
            <dir-icon dir-type="opened" v-if="currentSdgId === sdgItem.id"/>
            {{ sdgItem.name }}
          </a-tooltip>
          <span class="arrow-item">
            <a-icon type="right" />
          </span>
        </div>
        <template v-if="!sdgList.length && !sdgListLoading">
          <div class="no-data">
            <no-more-resources />
          </div>
        </template>
        <template v-if="sdgListLoading">
          <div class="loading-wrapper">
            <a-spin />
          </div>
        </template>
      </div>
    </div>
    <div class="browser-block-item-wrapper" :style="{width: blockWidth + 'px' , minWidth: blockWidth + 'px' }" >
      <!--     new sdg keywords description-->
      <div class="keyword-wrapper">
        <div class="keyword-list">
          <div :class="{'keyword-item': true, 'kd-active-item': currentSdgKeywordScenario === 'keyword' && currentSdgKeywordScenarioId === keywordItem.id}" v-for="(keywordItem, kIndex) in sdgKeywordNameList" @click="scenarioQueryContentByKeywordId(keywordItem)" :key="kIndex">
            <!--            <img src="~@/assets/icons/library/tuijian@2x.png" class="keyword-icon"/>-->
            <span class="keyword-name">
              {{ keywordItem.name }}
            </span>
            <a-icon
              type="check-circle"
              theme="filled"
              v-if="currentSdgKeywordScenario === 'keyword' && currentSdgKeywordScenarioId === keywordItem.id" />
          </div>
        </div>
      </div>
      <div class="description-wrapper">
        <div class="description-list">
          <div :class="{'description-item': true, 'kd-active-item': currentSdgKeywordScenario === 'description' && currentSdgKeywordScenarioId === descriptionItem.id}" v-for="(descriptionItem, dIndex) in sdgDescriptionsList" @click="scenarioQueryContentByDescriptionId(descriptionItem)" :key="dIndex">
            {{ descriptionItem.name }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="browser-block-item-wrapper"
      :style="{width: blockWidth + 'px' ,
               minWidth: blockWidth + 'px'}">
      <div
        class="browser-block-item-last"
        :style="{width: blockWidth + 'px' ,
                 minWidth: blockWidth + 'px',
                 'flex-direction': dataListMode === 'list' ? 'column' : 'row'}">
        <!--   data item list-->
        <div class="switch-type-wrapper">
          <div class="switch-type">
            <div class="switch-label">
              <a-dropdown>
                <a-menu slot="overlay">
                  <a-menu-item disabled>
                    <span>{{ $t('teacher.my-content.choose-types-of-content') }}</span>
                  </a-menu-item>
                  <a-menu-item @click="toggleType(0, $t('teacher.my-content.all-type'))">
                    <span>{{ $t('teacher.my-content.all-type') }}</span>
                  </a-menu-item>
                  <a-menu-item @click="toggleType( typeMap['unit-plan'], $t('teacher.my-content.unit-plan-type'))">
                    <span>{{ $t('teacher.my-content.unit-plan-type') }}</span>
                  </a-menu-item>
                  <a-menu-item @click="toggleType(typeMap.topic, $t('teacher.my-content.topics-type'))">
                    <span>{{ $t('teacher.my-content.topics-type') }}</span>
                  </a-menu-item>
                  <a-menu-item @click="toggleType(typeMap.task, $t('teacher.my-content.tasks-type') )">
                    <span>{{ $t('teacher.my-content.tasks-type') }}</span>
                  </a-menu-item>
                  <a-menu-item @click="toggleType(typeMap.lesson, $t('teacher.my-content.lesson-type'))">
                    <span>{{ $t('teacher.my-content.lesson-type') }}</span>
                  </a-menu-item>
                  <a-menu-item @click="toggleType(typeMap.evaluation, $t('teacher.my-content.evaluation-type'))">
                    <span>{{ $t('teacher.my-content.evaluation-type') }}</span>
                  </a-menu-item>
                </a-menu>
                <a-button
                  style="padding: 0 10px;display:flex; align-items:center ;height: 35px;border-radius: 6px;background: rgba(245, 245, 245, 0.5);font-size:13px;border: 1px solid #BCBCBC;font-family: Inter-Bold;color: #182552;">
                  <span v-if="currentTypeLabel">{{ currentTypeLabel }}</span> <span v-else>Choose type(s)of content</span>
                  <a-icon type="caret-down" /> </a-button>
              </a-dropdown>
            </div>
            <div class="switch-icon">
              <div :class="{'icon-item': true, 'active-icon': dataListMode === 'list'}" @click="handleToggleDataListMode('list')">
                <list-mode-icon />
              </div>
              <div :class="{'icon-item': true, 'active-icon': dataListMode === 'card'}" @click="handleToggleDataListMode('card')">
                <pu-bu-icon />
              </div>
            </div>
          </div>
        </div>
        <template v-if="dataListMode === 'list'">
          <div
            :class="{
              'browser-item': true,
              'odd-line': index % 2 === 0,
              'active-line': currentDataId === dataItem.id
            }"
            v-for="(dataItem, index) in dataList"
            @click="handleSelectDataItem(dataItem)"
            v-if="(currentType === 0 || dataItem.type === currentType)"
            :key="index">
            <a-tooltip :mouseEnterDelay="1">
              <template slot="title">
                {{ dataItem.name }}
              </template>
              <dir-icon :content-type="dataItem.type" />
              <span class="data-name">
                {{ dataItem.name }}
              </span>
              <span class="data-time">
                {{ dataItem.createTime | dayjs }}
              </span>
            </a-tooltip>
            <span class="arrow-item">
              <a-icon type="more" />
            </span>
          </div>
        </template>
        <template v-if="dataListMode === 'card'">
          <div class="card-view-mode-wrapper" v-if="dataList.length">
            <div
              class="card-item-wrapper"
              v-for="(dataItem, index) in dataList"
              @click="handleSelectDataItem(dataItem)"
              v-if="(currentType === 0 || dataItem.type === currentType)"
              :key="index">
              <div class="card-item">
                <data-card-view
                  :active-flag="currentDataId === dataItem.id"
                  :cover="dataItem.image"
                  :title="dataItem.name"
                  :created-time="dataItem.createTime"
                />
              </div>
            </div>
          </div>
        </template>
        <template v-if="!dataList.length && !dataListLoading">
          <div class="no-data">
            <no-more-resources />
          </div>
        </template>
        <template>
          <div class="loading-wrapper" v-if="dataListLoading">
            <a-spin />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from './Navigation'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import DirIcon from '@/components/Library/DirIcon'
import NoMoreResources from '@/components/Common/NoMoreResources'
import PuBuIcon from '@/assets/icons/library/pubu .svg?inline'
import ListModeIcon from '@/assets/icons/library/liebiao .svg?inline'
import DataCardView from '@/components/Library/DataCardView'
import { typeMap } from '@/const/teacher'
const { ScenarioQueryContentByScenarioId } = require('@/api/scenario')
const { ScenarioGetKeywordScenarios } = require('@/api/scenario')
const { GetAllSdgs } = require('@/api/scenario')

export default {
  name: 'SdgBrowser',
  components: {
    Navigation,
    ContentTypeIcon,
    NoMoreResources,
    DirIcon,
    PuBuIcon,
    ListModeIcon,
    DataCardView
  },
  props: {
    blockWidth: {
      type: Number,
      default: 200
    }
  },
  data () {
    return {
      typeMap: typeMap,
      sdgList: [],
      sdgListLoading: true,
      currentSdgId: null,

      sdgKeywordNameList: [],
      sdgDescriptionsList: [],
      sdgKeywordNameListLoading: false,
      currentSdgKeywordName: null,

      sdgDescriptionList: [],
      sdgKeywordLoading: false,
      currentSdgKeywordScenario: null,
      currentSdgKeywordScenarioId: null,

      dataList: [],
      dataListLoading: false,
      currentDataId: null,
      dataListMode: 'list',

      currentTypeLabel: 'Choose type（S）of content',
      currentType: 0
    }
  },
  created () {
    this.$logger.info('SdgBrowser blockWidth:' + this.blockWidth)
    this.getAllSdgs()
  },
  methods: {
    getAllSdgs () {
      this.sdgListLoading = true
      GetAllSdgs().then(response => {
          this.$logger.info('GetAllSdgs response', response.result)
          this.sdgList = response.result
          if (this.sdgList) {
            this.handleSelectSdgItem(this.sdgList[0])
          }
      }).finally(() => {
        this.sdgListLoading = false
      })
    },
    handleSelectSdgItem (sdgItem) {
      this.$logger.info('handleSelectSdgItem ', sdgItem, this.currentSdgId)
      if (sdgItem.id !== this.currentSdgId) {
        this.currentSdgId = sdgItem.id
        this.sdgKeywordNameList = []
        this.currentSdgKeywordName = null
        this.scenarioGetKeywordScenarios(sdgItem.id)
        this.handleClickBlock(1, sdgItem.name)
      }
    },
    scenarioGetKeywordScenarios (sdgId) {
      this.sdgKeywordNameListLoading = true
      ScenarioGetKeywordScenarios({ sdgId }).then(response => {
        this.$logger.info('ScenarioGetKeywordScenarios response', response.result)
        this.sdgKeywordNameList = response.result.sdgKeyWords
        this.sdgDescriptionsList = response.result.descriptions // Descriptions内容
        if (this.sdgKeywordNameList.length) {
          this.currentSdgKeywordName = this.sdgKeywordNameList[0].name
          this.currentSdgKeywordScenarioId = null
          this.currentDataId = null
          this.dataList = []
        }
      }).finally(() => {
        this.sdgKeywordNameListLoading = false
      })
    },

    scenarioQueryContentByDescriptionId (descriptionItem) {
      this.dataListLoading = true
      this.$logger.info('scenarioQueryContentByDescriptionId ' + descriptionItem.id)
      this.handleClickBlock(2, descriptionItem.name)
      this.currentSdgKeywordScenarioId = descriptionItem.id
      this.currentSdgKeywordScenario = 'description'
      ScenarioQueryContentByScenarioId({ descriptionId: descriptionItem.id }).then(response => {
        this.$logger.info('scenarioQueryContentByDescriptionId response', response.result)
        this.dataList = response.result
      }).finally(() => {
        this.dataListLoading = false
      })
    },

    scenarioQueryContentByKeywordId (keywordsItem) {
      this.dataListLoading = true
      this.$logger.info('scenarioQueryContentByKeywordId ' + keywordsItem.id)
      this.handleClickBlock(2, keywordsItem.name)
      this.currentSdgKeywordScenarioId = keywordsItem.id
      this.currentSdgKeywordScenario = 'keyword'
      ScenarioQueryContentByScenarioId({ keywordsId: keywordsItem.id }).then(response => {
        this.$logger.info('scenarioQueryContentByKeywordId response', response.result)
        this.dataList = response.result
      }).finally(() => {
        this.dataListLoading = false
      })
    },

    handleSelectDataItem (dataItem) {
      this.$logger.info('handleSelectDataItem ', dataItem)
      this.currentDataId = dataItem.id
      this.$emit('previewDetail', dataItem)
    },

    handleClickBlock (blockIndex, path) {
      this.$logger.info('handleClickBlock ' + blockIndex)
      this.$emit('blockCollapse', { blockIndex, path })
    },

    handleToggleDataListMode (mode) {
      this.$logger.info('handleToggleDataListMode' + mode)
      this.dataListMode = mode
    },

    toggleType (type, label) {
      this.$logger.info('toggleType ' + type + ' label ' + label)
      this.currentType = type
      this.currentTypeLabel = label
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
  .browser-block {
    display: flex;
    flex-direction: row;
    border-left: 1px solid #ddd;
    min-height: 600px;

    .browser-block-item-wrapper {
      overflow-y: scroll;
      height: calc(100vh - 190px);
      box-sizing: border-box;

      &::-webkit-scrollbar {
        width: 4px;
        height: 2px;
      }
      &::-webkit-scrollbar-track {
        border-radius: 3px;
        background: rgba(0,0,0,0.01);
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.01);
      }
      /* 滚动条滑块 */
      &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background: rgba(0,0,0,0.1);
        -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
      }
    }

    .browser-block-item {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      box-sizing: border-box;
      border-right: 1px solid #ddd;
      .browser-item {
        line-height: 20px;
        padding: 10px 15px 10px 20px;
        font-weight: 500;
        cursor: pointer;
        overflow: hidden;
        //white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-word;
        user-select: none;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;

        &:hover {
          background: #EDF1F5;
        }
        .arrow-item {
          padding: 0 10px;
          width: 20px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
        .file-dir-icon {
          color: #82c0d8;
          font-size: 18px;
        }

        span {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
          text-align: left;
          width: calc(100% - 25px);

          text-overflow: ellipsis;
          word-break: break-word;
          user-select: none;
          overflow: hidden;
          i {
            padding-right: 5px;
          }
        }
      }
      .odd-line {
        background: rgba(255, 255,255);
      }
      .active-line {
        background-color: rgba(21, 195, 154, 0.1);
        color: #15c39a;
      }
      .loading-wrapper {
        position: absolute;
        width: 50px;
        text-align: center;
        top: 30%;
        left: 50%;
        margin-left: -25px;
      }
    }

    .browser-block-item-last {
      position: relative;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: flex-start;
      box-sizing: border-box;
      border-right: 1px solid #ddd;

      .switch-type-wrapper {
        padding: 20px;
        text-align: center;
        width: 100%;

        .switch-type {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #F7F8FF;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          opacity: 1;
          border-radius: 6px;

          padding: 12px 12px;
          width: 100%;

          .switch-label {
            font-size: 14px;
            font-family: Inter-Bold;
            line-height: 20px;
            color: rgba(24, 37, 82, 1);
          }

          .switch-icon {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;

            .icon-item {
              margin-left: 10px;
              display: flex;
              flex-direction: row;
              align-items: center;
              svg {
                width: 22px;
                color: rgba(24, 37, 82, 1);
              }
            }

            .active-icon {
              svg {
                color: rgba(21, 195, 154, 1);
              }
            }
          }
        }
      }
      .browser-item {
        line-height: 20px;
        padding: 10px 0 10px 10px;
        font-weight: 500;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-word;
        user-select: none;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background: rgba(228, 228, 228, 0.2);
        width: 100%;
        .arrow-item {
          padding: 0 15px;
          font-weight: bold;
          width: 20px;
          font-size: 20px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
        span {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          width: calc(100% - 25px);
          text-overflow: ellipsis;
          word-break: break-word;
          user-select: none;
          overflow: hidden;

          i {
            padding-right: 5px;
          }
        }

        .data-time {
          text-align: right;
          justify-content: flex-end;
          padding-right: 10px;
          font-size: 12px;
        }

        .status-icon-item {
          display: inline;
        }
      }

      .card-view-mode-wrapper {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding: 10px;
        .card-item-wrapper {
          cursor: pointer;
          width: 50%;
          padding: 10px;
          box-sizing: border-box;
          background: #FFFFFF;
          display: flex;
          flex-direction: row;
          justify-content: center;
          .card-item {
            width: 100%;
            border: 1px solid #15C39A;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
            opacity: 1;
            border-radius: 6px;
          }
        }
      }

      .odd-line {
        background: rgba(228, 228, 228, 0.2);
      }
      .active-line {
        background-color: rgba(21, 195, 154, 0.1);
        color: #15c39a;
      }
      .loading-wrapper {
        position: absolute;
        width: 50px;
        text-align: center;
        top: 30%;
        left: 50%;
        margin-left: -25px;
      }
    }
  }

.no-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60%;
}

.keyword-wrapper {
  padding: 15px 15px 0 15px;
  box-sizing: border-box;
  .keyword-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .keyword-item {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      border-radius: 15px;
      padding: 3px 15px;
      margin: 0 10px 10px 0;
      border: 1px solid rgba(21, 195, 154, 1);
      background: rgba(21, 195, 154, 0.1);
      font-family: Inter-Bold;
      color: #15C39A;
      .keyword-name {
        padding-right: 10px;
      }

      .keyword-icon {
        height: 18px;
      }
    }
  }
}

.description-wrapper {
  padding: 15px;
  box-sizing: border-box;
  .description-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .description-item {
      cursor: pointer;
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 15px;
      font-size: 14px;
      font-family: Inter-Bold;
      line-height: 24px;
      color: #000000;
      background: #FFFFFF;
      border: 1px solid #D8D8D8;
      opacity: 1;
      border-radius: 4px;
      padding: 8px 15px;
      width: 100%;

      &:hover {
        color: #15c39a;
        background-color: rgba(21, 195, 154, 0.1);
        border-color: #15c39a;
        box-shadow: 2px 4px 6px rgba(21, 195, 154, 0.2);
      }
    }

    .kd-active-item {
      color: #15c39a;
      background-color: rgba(21, 195, 154, 0.1);
      border-color: #15c39a;
      box-shadow: 2px 4px 6px rgba(21, 195, 154, 0.2);
    }
  }
}
</style>
