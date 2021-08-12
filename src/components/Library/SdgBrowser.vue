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
            <dir-icon dir-type="opened" v-if="currentSdgId !== sdgItem.id"/>
            <dir-icon dir-type="yellow" v-if="currentSdgId === sdgItem.id"/>
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
    <div class="browser-block-item" :style="{width: blockWidth + 'px' , minWidth: blockWidth + 'px' }" >
      <!--      sdg keyword name list-->
      <div
        :class="{
          'browser-item': true,
          'odd-line': index % 2 === 0,
          'active-line': currentSdgKeywordName === sdgKeywordNameItem.name
        }"
        v-for="(sdgKeywordNameItem, index) in sdgKeywordNameList"
        @click="handleSelectSdgKeywordNameItem(sdgKeywordNameItem)"
        :key="index">
        <a-tooltip :mouseEnterDelay="1">
          <template slot="title">
            {{ sdgKeywordNameItem.name }}
          </template>
          <dir-icon dir-type="opened" v-if="currentSdgKeywordName !== sdgKeywordNameItem.name"/>
          <dir-icon dir-type="yellow" v-if="currentSdgKeywordName === sdgKeywordNameItem.name"/>
          {{ sdgKeywordNameItem.name }}
        </a-tooltip>
        <span class="arrow-item">
          <a-icon type="right" />
        </span>
      </div>
      <template v-if="!sdgKeywordNameList.length && !sdgKeywordNameListLoading">
        <div class="no-data">
          <no-more-resources />
        </div>
      </template>
      <template v-if="sdgKeywordNameListLoading">
        <div class="loading-wrapper">
          <a-spin />
        </div>
      </template>
    </div>
    <div class="browser-block-item" :style="{width: blockWidth + 'px' , minWidth: blockWidth + 'px' }" >
      <!--      sdg keywords description-->
      <div
        :class="{
          'browser-item': true,
          'odd-line': index % 2 === 0,
          'active-line': currentSdgKeywordScenarioId === sdgKeywordItem.scenarioId
        }"
        v-for="(sdgKeywordItem, index) in sdgKeywordList"
        @click="handleSelectSdgKeywordItem(sdgKeywordItem)"
        :key="index">
        <a-tooltip :mouseEnterDelay="1">
          <template slot="title">
            {{ sdgKeywordItem.description }}
          </template>
          <dir-icon dir-type="opened" v-if="currentSdgKeywordScenarioId !== sdgKeywordItem.scenarioId"/>
          <dir-icon dir-type="yellow" v-if="currentSdgKeywordScenarioId === sdgKeywordItem.scenarioId"/>
          {{ sdgKeywordItem.description }}
        </a-tooltip>
        <span class="arrow-item">
          <a-icon type="right" />
        </span>
      </div>
      <template v-if="!sdgKeywordList.length && !sdgKeywordLoading">
        <div class="no-data">
          <no-more-resources />
        </div>
      </template>
      <template v-if="sdgKeywordLoading">
        <div class="loading-wrapper">
          <a-spin />
        </div>
      </template>
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
              Switch typesetting
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
      sdgList: [],
      sdgListLoading: true,
      currentSdgId: null,

      sdgKeywordNameList: [],
      sdgDescriptionsList: [],
      sdgKeywordNameListLoading: false,
      currentSdgKeywordName: null,

      sdgKeywordList: [],
      sdgKeywordLoading: false,
      currentSdgKeywordScenarioId: null,

      dataList: [],
      dataListLoading: false,
      currentDataId: null,
      dataListMode: 'list'
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
          this.sdgKeywordList = this.sdgKeywordNameList
          this.currentSdgKeywordScenarioId = null
          this.currentDataId = null
          this.dataList = []
        }
      }).finally(() => {
        this.sdgKeywordNameListLoading = false
      })
    },

    handleSelectSdgKeywordNameItem (sdgKeywordNameItem) {
      this.$logger.info('handleSelectSdgKeywordNameItem ', sdgKeywordNameItem)
      this.currentSdgKeywordName = sdgKeywordNameItem.name
      this.sdgKeywordList = sdgKeywordNameItem.sdgKeyWords
      this.currentSdgKeywordScenarioId = null
      this.currentDataId = null
      this.dataList = []
      this.handleClickBlock(2, sdgKeywordNameItem.name)
    },

    handleSelectSdgKeywordItem (sdgKeywordItem) {
      this.$logger.info('handleSelectSdgKeywordItem ', sdgKeywordItem)
      // this.currentSdgKeywordScenarioId = sdgKeywordItem.scenarioId
      this.dataListLoading = true
      this.dataList = []
      this.scenarioQueryContentByScenarioId(sdgKeywordItem.id)
      // this.handleClickBlock(3, sdgKeywordItem.description)
    },

    scenarioQueryContentByScenarioId (keywordsId) {
      this.dataListLoading = true
      this.$logger.info('scenarioQueryContentByScenarioId ' + keywordsId)
      ScenarioQueryContentByScenarioId({ keywordsId: keywordsId }).then(response => {
        this.$logger.info('ScenarioQueryContentByScenarioId response', response.result)
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
        padding: 10px 0 10px 10px;
        font-weight: 500;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        user-select: none;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
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
          word-break: break-all;
          user-select: none;
          overflow: hidden;
          i {
            padding-right: 5px;
          }
        }
      }
      .odd-line {
        background: rgba(228, 228, 228, 0.2);
      }
      .active-line {
        background: rgba(255, 187, 0, 0.1);
        color: rgba(255, 187, 0, 1);
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
        word-break: break-all;
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
          word-break: break-all;
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
        background-color: rgba(255, 187, 0, 0.1);
        color: rgba(255, 187, 0, 1);
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
</style>
