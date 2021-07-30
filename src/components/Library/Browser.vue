<template>
  <div class="library-wrapper" ref="wrapper">
    <div class="nav-header">
      <div class="header-info">
        <div class="library-nav-bar">
          <navigation :path="navPath" @pathChange="handleNavPathChange"/>
        </div>
        <div class="filter-line" >
          <div class="curriculum-select" v-if="currentBrowserType === BrowserTypeMap.curriculum">
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
      </div>
    </div>
    <div class="library-detail-wrapper">
      <div class="library-detail-nav-wrapper">
        <div class="library-content">
          <div class="browser-action" v-if="hasLeftBlock">
            <div class="action-item" @click="handleViewLeft">
              <a-icon type="left-circle" />
            </div>
          </div>
          <div class="browser-table-wrapper" :style="{left: -browserMarginLeft + 'px'}">
            <div class="browser-table">
              <div class="browser-type-list">
                <div :class="{'browser-type': true, 'odd-line': index % 2 === 0, 'active-line': currentBrowserType === browserTypeItem.type}" v-for="(browserTypeItem, index) in browserTypeList" :key="index" @click="toggleBrowserType(browserTypeItem)">
                  <dir-icon dir-type="blue" v-if="currentBrowserType !== browserTypeItem.type"/>
                  <dir-icon dir-type="opened" v-if="currentBrowserType === browserTypeItem.type"/>
                  {{ browserTypeItem.label }}
                  <span class="arrow-item">
                    <a-icon type="right" />
                  </span>
                </div>
              </div>
            </div>
            <div class="browser-detail">
              <curriculum-browser :curriculum-id="currentCurriculumId" :block-width="blockWidth" v-if="currentBrowserType === BrowserTypeMap.curriculum" @blockCollapse="handleBlockCollapse" @previewDetail="handlePreviewDetail"/>
              <sdg-browser :block-width="blockWidth" v-if="currentBrowserType === BrowserTypeMap.sdg" @blockCollapse="handleBlockCollapse" @previewDetail="handlePreviewDetail"/>
            </div>
          </div>
        </div>
      </div>
      <div class="library-detail-preview-wrapper">
        <div class="preview-info" v-if="previewVisible">
          <div class="preview-wrapper">
            <div class="preview-detail">
              <common-preview :id="previewCurrentId" :type="previewType"/>
            </div>
          </div>
        </div>
        <div class="wait-data" v-if="!previewVisible">
          <no-more-resources tips="" />
        </div>
      </div>
    </div>
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
import DirIcon from '@/components/Library/DirIcon'
import NoMoreResources from '@/components/Common/NoMoreResources'
import CommonPreview from '@/components/Common/CommonPreview'

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
    CommonPreview,
    NoMoreResources,
    Navigation,
    CurriculumBrowser,
    SdgBrowser,
    UnitPlanPreview,
    MaterialPreview,
    DirIcon
  },
  props: {
    browserType: {
      default: 'curriculum',
      type: String
    }
  },
  data () {
    return {
      currentCurriculumId: this.$store.getters.bindCurriculum ? this.$store.getters.bindCurriculum : '1',
      curriculumOptions: [],
      navPath: [],
      browserTypeList: [
        { type: 'curriculum', label: 'Curriculum' },
        { type: 'sdg', label: 'Sustainable development goal' }
      ],
      currentBrowserType: 'curriculum',
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
    this.blockWidth = (this.$refs['wrapper'].getBoundingClientRect().width - 781) / 2.0
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
          this.blockWidth = (this.$refs['wrapper'].getBoundingClientRect().width - 781) / 2.0
        } else {
          this.hasLeftBlock = true
          this.blockWidth = (this.$refs['wrapper'].getBoundingClientRect().width - 681) / 2.0
          this.browserMarginLeft = (data.blockIndex - 1) * this.blockWidth + 100
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
      this.previewVisible = false
      this.$nextTick(() => {
        this.previewCurrentId = data.id
        this.previewType = data.type
        this.previewVisible = true
      })
    },

    handlePreviewClose () {
      this.$logger.info('handlePreviewClose')
      this.previewCurrentId = ''
      this.previewType = ''
      this.previewVisible = false
    },

    handleViewLeft () {
      this.previewVisible = false
      this.$logger.info('handleViewLeft ' + (this.blockIndex))
      if (this.blockIndex < 2) {
        this.hasLeftBlock = false
        this.browserMarginLeft = 0
        this.blockWidth = (this.$refs['wrapper'].getBoundingClientRect().width - 781) / 2.0
      } else {
        this.blockIndex = this.blockIndex - 1
        this.hasLeftBlock = true
        this.blockWidth = (this.$refs['wrapper'].getBoundingClientRect().width - 681) / 2.0
        this.browserMarginLeft = (this.blockIndex - 1) * this.blockWidth + 100
      }
      const path = this.navPath.pop()
      this.$logger.info('remove path ' + path)
      this.$logger.info('browserMarginLeft ' + this.browserMarginLeft + ', hasLeftBlock:' + this.hasLeftBlock)
    },

    handleNavPathChange (data) {
      this.$logger.info('handleNavPathChange', data)
      this.previewVisible = false
      const blockIndex = data.blockIndex
      if (blockIndex <= 2) {
        this.hasLeftBlock = false
        this.browserMarginLeft = 0
        this.blockWidth = (this.$refs['wrapper'].getBoundingClientRect().width - 781) / 2.0
      } else {
        this.blockIndex = blockIndex - 1
        this.hasLeftBlock = true
        this.blockWidth = (this.$refs['wrapper'].getBoundingClientRect().width - 681) / 2.0
        this.browserMarginLeft = (this.blockIndex - 1) * this.blockWidth + 100
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
  position: relative;
  background: rgba(247, 248, 255, 1);
  .nav-header {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    box-sizing: border-box;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    background: #FFFFFF;
    z-index: 200;
    .header-info {
      margin: auto;
      padding-left: 10px;
      padding-right: 10px;
    }
  }

  .library-nav-bar {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 15px 0 10px 0;

    .curriculum-select {
      display: flex;
      flex-direction: row;
      align-items: center;
      .select-curriculum-tips{
        color: #aaa;
      }
    }
  }

  .filter-line {
    padding: 0 0 20px;
    height: 52px;
    .curriculum-select {
      background: rgba(24, 37, 82, 0.1);
      display: inline-block;
      position: relative;
      border-radius: 3px;
      .select-curriculum {
        position: relative;
        font-size: 14px;
        font-family: Inter-Bold;
        line-height: 24px;
        opacity: 1;
        border-radius: 3px;
      }
    }
  }
  .library-detail-wrapper {
    position: absolute;
    width: 100%;
    top: 126px;
    height: calc(100vh - 190px);
    overflow: hidden;
    display: flex;
    flex-direction: row;
    .library-detail-nav-wrapper {
      overflow: hidden;
      position: relative;
      width: calc(100% - 500px);
      .library-content {
        z-index: 250;
        overflow: hidden;
        background: #fff;
        width: 100%;
        height: 100%;
        .browser-action {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 181px;
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
          height: calc(100vh - 200px);
          display: flex;
          flex-direction: row;
          border: 1px solid #ddd;
          border-bottom: none;
          border-right: none;
          overflow: hidden;
          box-sizing: border-box;
          position: absolute;
          transition: all .3s ease-in;
          z-index: 100;
          .browser-table {
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            .browser-type-list {
              display: flex;
              flex-direction: column;
              width: 280px;
              box-sizing: border-box;
              .browser-type {
                padding: 10px;
                font-weight: 500;
                cursor: pointer;
                background: rgba(228, 228, 228, 0.2);
                display: flex;
                align-items: center;
                flex-direction: row;
                position: relative;
                padding-right: 20px;
                .arrow-item {
                  position: absolute;
                  right: 10px;
                }
              }
              .odd-line {
                background: rgba(228, 228, 228, 0.2);
              }
              .active-line {
                background-color: rgba(21, 195, 154, 0.1);
                color: rgba(21, 195, 154, 1);
              }
            }
          }

          .browser-detail {
            overflow-y: hidden;
          }
        }
      }
    }
    .library-detail-preview-wrapper {
      width: 500px;
      box-sizing: border-box;
      padding: 16px;
      overflow-y: scroll;

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

      .preview-info {
        background: #FFFFFF;
        border: 1px solid #D8D8D8;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        opacity: 1;
        border-radius: 10px;
      }

      .wait-data {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 60%;
        margin: auto;
      }
    }
  }
}

</style>
