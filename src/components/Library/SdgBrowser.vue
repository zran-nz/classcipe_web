<template>
  <div class="browser-block">
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
    <div class="browser-block-item-last" :style="{width: blockWidth + (111) + 'px' }">
      <!--   data item list-->
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
          {{ dataItem.name }}
        </a-tooltip>
        <span class="arrow-item">
          <a-icon type="right" />
        </span>
      </div>
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
</template>

<script>
import Navigation from './Navigation'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import DirIcon from '@/components/Library/DirIcon'
import NoMoreResources from '@/components/Common/NoMoreResources'
const { ScenarioQueryContentByScenarioId } = require('@/api/scenario')
const { ScenarioGetKeywordScenarios } = require('@/api/scenario')
const { GetAllSdgs } = require('@/api/scenario')

export default {
  name: 'SdgBrowser',
  components: {
    Navigation,
    ContentTypeIcon,
    NoMoreResources,
    DirIcon
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
      sdgKeywordNameListLoading: false,
      currentSdgKeywordName: null,

      sdgKeywordList: [],
      sdgKeywordLoading: false,
      currentSdgKeywordScenarioId: null,

      dataList: [],
      dataListLoading: false,
      currentDataId: null
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
        this.sdgKeywordNameList = response.result
        if (this.sdgKeywordNameList.length) {
          this.currentSdgKeywordName = this.sdgKeywordNameList[0].name
          this.sdgKeywordList = this.sdgKeywordNameList[0].sdgKeyWords
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
      this.currentSdgKeywordScenarioId = sdgKeywordItem.scenarioId
      this.dataListLoading = true
      this.dataList = []
      this.scenarioQueryContentByScenarioId(this.currentSdgKeywordScenarioId)
      this.handleClickBlock(3, sdgKeywordItem.description)
    },

    scenarioQueryContentByScenarioId (scenarioId) {
      this.dataListLoading = true
      this.$logger.info('scenarioQueryContentByScenarioId ' + scenarioId)
      ScenarioQueryContentByScenarioId({ scenarioId }).then(response => {
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
        white-space: normal;
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
      justify-content: flex-start;
      box-sizing: border-box;
      border-right: 1px solid #ddd;
      width: 100%;
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
        .arrow-item {
          padding: 0 10px;
          width: 20px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
        span {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: flex-start;
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
        white-space: normal;
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
