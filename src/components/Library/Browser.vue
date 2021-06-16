<template>
  <div class="library-wrapper" ref="wrapper">
    <div class="library-nav-bar">
      <navigation />
    </div>
    <div class="library-content">
      <div class="browser-action" v-if="hasLeftBlock">
        <div class="action-item">
          <a-icon type="left-circle" />
        </div>
      </div>
      <div class="browser-table-wrapper" :style="{marginLeft: -browserMarginLeft + 'px'}">
        <div class="browser-table">
          <div class="browser-type-list">
            <div :class="{'browser-type': true, 'odd-line': index % 2 === 0, 'active-line': currentBrowserType === browserTypeItem.type}" v-for="(browserTypeItem, index) in browserTypeList" :key="index" @click="toggleBrowserType(browserTypeItem)">
              {{ browserTypeItem.label }}
            </div>
          </div>
        </div>
        <div class="browser-detail">
          <curriculum-browser :block-width="blockWidth" v-if="currentBrowserType === BrowserTypeMap.curriculum" @blockCollapse="handleBlockCollapse" @previewDetail="handlePreviewDetail"/>
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

const BrowserTypeMap = {
  curriculum: 'curriculum',
  sdg: 'sdg'
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
      browserTypeList: [
        { type: 'curriculum', label: 'curriculum' },
        { type: 'sdg', label: 'Sustainable development goal' }
      ],
      currentBrowserType: null,
      BrowserTypeMap: BrowserTypeMap,
      hasLeftBlock: false,
      blockWidth: 200,

      browserMarginLeft: 0,

      previewVisible: false,
      previewCurrentId: '',
      previewType: '',
      typeMap: typeMap
    }
  },
  created () {
    this.currentBrowserType = this.browserType
  },
  mounted () {
    this.blockWidth = (this.$refs['wrapper'].getBoundingClientRect().width - 220) / 2.0
    this.$logger.info('globalWidth ' + this.blockWidth)
  },
  methods: {
    toggleBrowserType (browserTypeItem) {
      this.$logger.info('toggleBrowserType ' + browserTypeItem.type)
      this.currentBrowserType = browserTypeItem.type
    },

    handleBlockCollapse (data) {
      this.$logger.info('handleBlockCollapse ' + data.blockIndex)
      const blockIndex = data.blockIndex
      if (blockIndex === 1) {
        this.hasLeftBlock = false
        this.browserMarginLeft = 0
      } else {
        this.hasLeftBlock = true
        this.browserMarginLeft = (data.blockIndex - 1) * this.blockWidth + 110
      }
      this.$logger.info('browserMarginLeft ' + this.browserMarginLeft + ', hasLeftBlock:' + this.hasLeftBlock)
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
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.library-wrapper {
  display: flex;
  flex-direction: column;
  .library-content {
    min-height: 600px;
    position: relative;
    overflow: hidden;
    .browser-action {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 111px;
      background-color: fade(@text-color-secondary, 50%);
      .action-item {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 50px;
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
      .browser-table {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        .browser-type-list {
          display: flex;
          flex-direction: column;
          width: 220px;
          box-sizing: border-box;
          .browser-type {
            line-height: 40px;
            padding: 0 10px;
            font-weight: 500;
            cursor: pointer;
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
