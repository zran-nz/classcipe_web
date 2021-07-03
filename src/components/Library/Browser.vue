<template>
  <div class="library-wrapper" ref="wrapper">
    <div class="library-nav-bar">
      <div class="curriculum-select" v-if="currentBrowserType === BrowserTypeMap.curriculum">
        <a-spin v-if="!curriculumOptions.length"/>
        <a-select
          v-if="curriculumOptions.length"
          size="small"
          @change="handleCurriculumChange"
          v-model="currentCurriculumId"
          :default-value="$store.getters.bindCurriculum">
          <a-select-option v-for="(curriculum,index) in curriculumOptions" :value="curriculum.id" :key="index">
            {{ curriculum.name }}
          </a-select-option>
        </a-select>
        <a-tooltip class="select-curriculum-tips">
          <template slot="title">
            Select Curriculum
          </template>
          <a-icon type="info-circle" />
        </a-tooltip>
      </div>
      <navigation :path="navPath" @pathChange="handleNavPathChange"/>
    </div>
    <div class="library-content">
      <div class="browser-action" v-if="hasLeftBlock">
        <div class="action-item" @click="handleViewLeft">
          <a-icon type="left-circle" />
        </div>
      </div>
      <div class="browser-table-wrapper" :style="{marginLeft: -browserMarginLeft + 'px'}">
        <div class="browser-table">
          <div class="browser-type-list">
            <div :class="{'browser-type': true, 'odd-line': index % 2 === 0, 'active-line': currentBrowserType === browserTypeItem.type}" v-for="(browserTypeItem, index) in browserTypeList" :key="index" @click="toggleBrowserType(browserTypeItem)">
              <a-icon type="pushpin" theme="filled" class="pin-icon"/>{{ browserTypeItem.label }}
            </div>
          </div>
        </div>
        <div class="browser-detail">
          <curriculum-browser :curriculum-id="currentCurriculumId" :block-width="blockWidth" v-if="currentBrowserType === BrowserTypeMap.curriculum" @blockCollapse="handleBlockCollapse" @previewDetail="handlePreviewDetail"/>
          <sdg-browser :block-width="blockWidth" v-if="currentBrowserType === BrowserTypeMap.sdg" @blockCollapse="handleBlockCollapse" @previewDetail="handlePreviewDetail"/>
        </div>
      </div>
    </div>

    <a-drawer
      destroyOnClose
      placement="right"
      closable
      width="900px"
      :visible="previewVisible"
      @close="handlePreviewClose"
    >
      <div class="preview-wrapper">
        <div class="preview-detail">
          <unit-plan-preview :unit-plan-id="previewCurrentId" :show-associate="true" v-if="previewType === typeMap['unit-plan']" />
          <material-preview :material-id="previewCurrentId" :show-associate="true" v-if="previewType === typeMap.material" />
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>

import CurriculumBrowser from './CurriculumBrowser'
import SdgBrowser from './SdgBrowser'
import Navigation from './Navigation'
import UnitPlanPreview from '@/components/UnitPlan/UnitPlanPreview'
import MaterialPreview from '@/components/Material/MaterialPreview'
import { typeMap } from '@/const/teacher'
import {
  getAllCurriculums
} from '@/api/preference'

const BrowserTypeMap = {
  curriculum: 'curriculum',
  sdg: 'sdg'
}

const BrowserTypeLabelMap = {
  curriculum: 'Curriculum',
  sdg: 'Sustainable development goal'
}

export default {
  name: 'Browser',
  components: {
    Navigation,
    CurriculumBrowser,
    SdgBrowser,
    UnitPlanPreview,
    MaterialPreview
  },
  props: {
    browserType: {
      default: 'curriculum',
      type: String
    }
  },
  data () {
    return {
      currentCurriculumId: this.$store.getters.bindCurriculum,
      curriculumOptions: [],
      navPath: [],
      browserTypeList: [
        { type: 'curriculum', label: 'Curriculum' },
        { type: 'sdg', label: 'Sustainable development goal' }
      ],
      currentBrowserType: null,
      BrowserTypeMap: BrowserTypeMap,
      browserTypeLabelMap: BrowserTypeLabelMap,
      hasLeftBlock: false,
      blockWidth: 200,

      browserMarginLeft: 0,

      previewVisible: false,
      previewCurrentId: '',
      previewType: '',
      blockIndex: 0,
      typeMap: typeMap
    }
  },
  created () {
    this.currentBrowserType = this.browserType
    this.navPath.push({
      path: this.browserTypeLabelMap[this.currentBrowserType],
      blockIndex: 0
    })

    getAllCurriculums().then((response) => {
      this.$logger.info('getAllCurriculums', response)
      this.curriculumOptions = response.result
      this.$logger.info('getAllCurriculums', this.curriculumOptions)
    })
  },
  mounted () {
    this.blockWidth = (this.$refs['wrapper'].getBoundingClientRect().width - 100) / 2.0
    this.$logger.info('globalWidth ' + this.blockWidth)
  },
  methods: {
    toggleBrowserType (browserTypeItem) {
      this.$logger.info('toggleBrowserType ' + browserTypeItem.type)
      if (browserTypeItem.type !== this.currentBrowserType) {
        this.currentBrowserType = browserTypeItem.type
        this.navPath = []
        this.navPath.push({ blockIndex: 0, path: browserTypeItem.label })
        this.$logger.info('reset and add path ' + browserTypeItem.label)
      }
    },

    handleBlockCollapse (data) {
      this.$logger.info('handleBlockCollapse ' + data.blockIndex, data)
      if (this.blockIndex !== data.blockIndex) {
        this.blockIndex = data.blockIndex
        if (this.blockIndex === 1) {
          this.hasLeftBlock = false
          this.browserMarginLeft = 0
        } else {
          this.hasLeftBlock = true
          this.browserMarginLeft = (data.blockIndex - 1) * this.blockWidth + 50
        }
        this.$logger.info('browserMarginLeft ' + this.browserMarginLeft + ', hasLeftBlock:' + this.hasLeftBlock)
      } else {
        this.$logger.info('same block collapse')
      }
      this.navPath = this.navPath.filter((item) => item.blockIndex !== data.blockIndex)
      this.navPath.push({ blockIndex: data.blockIndex, path: data.path })
      this.$logger.info('add path ' + data.path)
    },

    handlePreviewDetail (data) {
      this.$logger.info('handlePreviewDetail', data)
      this.previewCurrentId = data.id
      this.previewType = data.type
      this.previewVisible = true
    },

    handlePreviewClose () {
      this.$logger.info('handlePreviewClose')
      this.previewCurrentId = ''
      this.previewType = ''
      this.previewVisible = false
    },

    handleViewLeft () {
      this.$logger.info('handleViewLeft ' + (this.blockIndex))
      if (this.blockIndex <= 2) {
        this.hasLeftBlock = false
        this.browserMarginLeft = 0
      } else {
        this.blockIndex = this.blockIndex - 1
        this.hasLeftBlock = true
        this.browserMarginLeft = (this.blockIndex - 1) * this.blockWidth + 50
      }
      const path = this.navPath.pop()
      this.$logger.info('remove path ' + path)
      this.$logger.info('browserMarginLeft ' + this.browserMarginLeft + ', hasLeftBlock:' + this.hasLeftBlock)
    },

    handleNavPathChange (data) {
      this.$logger.info('handleNavPathChange', data)
      const blockIndex = data.blockIndex
      if (blockIndex <= 2) {
        this.hasLeftBlock = false
        this.browserMarginLeft = 0
      } else {
        this.blockIndex = blockIndex - 1
        this.hasLeftBlock = true
        this.browserMarginLeft = (this.blockIndex - 1) * this.blockWidth + 50
      }
      this.navPath = this.navPath.filter(item => item.blockIndex <= blockIndex)
      this.$logger.info('browserMarginLeft ' + this.browserMarginLeft + ', hasLeftBlock:' + this.hasLeftBlock)
    },

    handleCurriculumChange (value) {
      this.$logger.info('handleCurriculumChange ' + value)
      this.currentCurriculumId = value
      this.hasLeftBlock = false
      this.blockIndex = 0
      this.browserMarginLeft = 0
      this.navPath = [{
        path: this.browserTypeLabelMap[this.currentBrowserType],
        blockIndex: 0
      }]
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.library-wrapper {
  z-index: 0;
  display: flex;
  flex-direction: column;

  .library-nav-bar {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    .curriculum-select {
      display: flex;
      flex-direction: row;
      align-items: center;
      .select-curriculum-tips{
        color: #aaa;
        padding: 0 5px;
      }
    }
  }

  .library-content {
    min-height: 600px;
    position: relative;
    overflow: hidden;
    .browser-action {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 101px;
      box-sizing: border-box;
      background-color: fade(@text-color-secondary, 50%);
      z-index: 110;
      .action-item {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 50px;
        text-align: center;
        margin-top: -40px;
        margin-left: -25px;
        color: #fff;
        font-size: 30px;
        cursor: pointer;
      }
    }
    .browser-table-wrapper {
      min-height: 600px;
      display: flex;
      flex-direction: row;
      border: 1px solid #ddd;
      overflow: hidden;
      box-sizing: border-box;
      position: relative;
      transition: all .3s ease-in;
      z-index: 100;
      .browser-table {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        .browser-type-list {
          display: flex;
          flex-direction: column;
          width: 150px;
          box-sizing: border-box;
          .browser-type {
            padding: 10px;
            font-weight: 500;
            cursor: pointer;
            .pin-icon {
              font-size: 14px;
              padding-right: 5px;
            }
          }
          .odd-line {
            background-color: fade(@text-color-secondary, 3%);
          }
          .active-line {
            background-color: fade(@outline-color, 20%);
            color: @primary-color;
          }
        }
      }
    }
  }
}

</style>
