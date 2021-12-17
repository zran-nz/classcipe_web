<template>
  <div class="library-wrapper" ref="wrapper" data-version="v2" @click="handleSearchInputBlur">
    <div class="nav-header" :style="{height: currentBrowserType === BrowserTypeMap.sdg ? '75px' : '127px'}">
      <div class="header-info">
        <div class="library-nav-bar" :style="{opacity: searchResultVisible ? 0 : 1}">
          <navigation :path="navPath" @pathChange="handleNavPathChange"/>
        </div>
        <div class="filter-line">
          <div class="curriculum-filter-line">
            <div class="curriculum-select">
              <a-select
                v-show="currentBrowserType !== BrowserTypeMap.sdg && curriculumOptions.length"
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
          <div class="search-bar-line">
            <div class="search-input" @click.stop="">
              <a-input
                v-model="searchKeyword"
                placeholder="Input search text"
                @change="handleSearch"
                @keyup.enter="handleSearch"
                @focus="handleSearchFocus"
                class="library-search-input">
                <a-icon slot="prefix" type="search" />
              </a-input>
            </div>
            <div class="search-result-wrapper" v-if="searchResultVisible">
              <div class="searching" v-if="searching">
                <a-spin />
              </div>
              <div class="search-result-list" v-if="!searching">
                <template v-if="searchResultList.length">
                  <div
                    class="search-result-item"
                    @click.stop="handleClickSearchResultItem(item)"
                    v-for="(item, sIndex) in searchResultList"
                    :key="sIndex"
                    :data-from-type="item.fromType">
                    {{ item.name }}
                  </div>
                </template>
                <template v-else-if="searchKeyword">
                  <div class="no-result">
                    No relevant data found!
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="search-bar"></div>
      </div>
    </div>
    <div
      class="library-detail-wrapper"
      :style="{top: currentBrowserType === BrowserTypeMap.sdg ? '74px' : '126px',
               height: currentBrowserType === BrowserTypeMap.sdg ? 'calc(100vh - 138px)': 'calc(100vh - 190px)'}">
      <div class="library-detail-nav-wrapper" :style="{width: leftBrowserWidth}">
        <div class="library-content">
          <div class="browser-action" v-if="hasLeftBlock">
            <div class="action-item" @click="handleViewLeft">
              <back-svg style="width: 70px"/>
            </div>
          </div>
          <div class="browser-table-wrapper" :style="{left: -browserMarginLeft + 'px'}">
            <div class="browser-table">
              <div class="browser-type-list">
                <div
                  :class="{
                    'browser-type': true,
                    'odd-line': index % 2 === 0,
                    'active-line': currentBrowserType === browserTypeItem.type
                  }"
                  v-for="(browserTypeItem, index) in (currentCurriculumId == curriculumType.IBMYP ? browserTypeListForIbMpy : browserTypeList)"
                  :key="index"
                  @click="toggleBrowserType(browserTypeItem)">
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
              <!--大纲游览-->
              <curriculum-browser
                :block-index="blockIndex"
                :curriculum-id="currentCurriculumId"
                :block-width="blockWidth"
                v-if="currentBrowserType === BrowserTypeMap.curriculum"
                @blockCollapse="handleBlockCollapse"
                @previewDetail="handlePreviewDetail"/>
              <assessment-browser
                :curriculum-id="currentCurriculumId"
                :block-width="blockWidth"
                v-if="currentBrowserType === BrowserTypeMap.assessmentType"
                @blockCollapse="handleBlockCollapse"
                @previewDetail="handlePreviewDetail"/>
              <general-capability-browser
                :block-index="blockIndex"
                :curriculum-id="currentCurriculumId"
                :block-width="blockWidth"
                v-if="currentBrowserType === BrowserTypeMap.centurySkills"
                @blockCollapse="handleBlockCollapse"
                @previewDetail="handlePreviewDetail"/>
              <subject-specific-browser
                :block-index="blockIndex"
                :curriculum-id="currentCurriculumId"
                :block-width="blockWidth"
                v-if="currentBrowserType === BrowserTypeMap.specificSkills"
                @blockCollapse="handleBlockCollapse"
                @previewDetail="handlePreviewDetail"/>
              <idu-browser
                :block-index="blockIndex"
                :curriculum-id="currentCurriculumId"
                :block-width="blockWidth"
                v-if="currentBrowserType === BrowserTypeMap.idu"
                @blockCollapse="handleBlockCollapse"
                @previewDetail="handlePreviewDetail"/>
              <!--大纲游览-->
              <sdg-browser
                :block-width="blockWidth"
                v-if="currentBrowserType === BrowserTypeMap.sdg"
                @blockCollapse="handleBlockCollapse"
                @previewDetail="handlePreviewDetail"/>
            </div>
          </div>
        </div>
      </div>
      <div class="library-detail-preview-wrapper" :style="{width: rightBrowserWidth}">
        <div class="preview-info" v-if="previewVisible">
          <div class="preview-wrapper">
            <div class="preview-detail">
              <common-preview :id="previewCurrentId" :type="previewType" :is-library="true"/>
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
import DirIcon from '@/components/LibraryV2/DirIcon'
import NoMoreResources from '@/components/Common/NoMoreResources'
import CommonPreview from '@/components/Common/CommonPreview'
import AssessmentBrowser from './AssessmentBrowser'
import BackSvg from '@/assets/svgIcon/library/back_btn.svg?inline'
import GeneralCapabilityBrowser from '@/components/LibraryV2/GeneralCapabilityBrowser'
import SubjectSpecificBrowser from '@/components/LibraryV2/SubjectSpecificBrowser'
import IduBrowser from '@/components/LibraryV2/IduBrowser'
import { CurriculumType } from '@/const/common'
const { Search, QueryContents } = require('@/api/library')

const BrowserTypeMap = {
  curriculum: 'curriculum',
  assessmentType: 'assessmentType',
  // 数据层级结构：mainsubject-year-knowledge
  specificSkills: 'specificSkills',
  // 数据层级结构：year-knowledge
  centurySkills: 'centurySkills',
  // sdg数据结构：sdg列表-keywords-big idea
  sdg: 'sdg',
  idu: 'idu'
}

const BrowserTypeLabelMap = {
  curriculum: 'Learning outcomes',
  assessmentType: 'Assessment type',
  sdg: 'Big idea',
  specificSkills: 'Subject Specific Skills',
  centurySkills: 'Century Skills',
  idu: 'Integrated Subject Skill'
}

export default {
  name: 'Browser',
  components: {
    SubjectSpecificBrowser,
    GeneralCapabilityBrowser,
    AssessmentBrowser,
    CommonPreview,
    NoMoreResources,
    Navigation,
    CurriculumBrowser,
    SdgBrowser,
    UnitPlanPreview,
    MaterialPreview,
    DirIcon,
    BackSvg,
    IduBrowser
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
      browserTypeListForIbMpy: [
        { type: 'curriculum', label: 'Learning outcomes' },
        { type: 'assessmentType', label: 'Assessment type' },
        { type: 'specificSkills', label: 'Subject Specific Skills' },
        { type: 'idu', label: 'Integrated Subject Skill' },
        { type: 'centurySkills', label: '21st Century Skills' },
        { type: 'sdg', label: 'Big idea' }
      ],
      browserTypeList: [
        { type: 'curriculum', label: 'Learning outcomes' },
        { type: 'assessmentType', label: 'Assessment type' },
        { type: 'specificSkills', label: 'Subject Specific Skills' },
        { type: 'centurySkills', label: '21st Century Skills' },
        { type: 'sdg', label: 'Big idea' }
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
      typeMap: typeMap,

      headerTop: '64px',
      libraryDetailTop: '126px',
      curriculumType: CurriculumType,

      searchKeyword: null,
      searchResultList: [],
      searchResultVisible: false,
      searching: false,
      leftBrowserWidth: '60%',
      rightBrowserWidth: '40%'
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
    this.blockWidth = this.$refs['wrapper'].getBoundingClientRect().width * 0.6 - 180
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
        this.blockWidth = this.$refs['wrapper'].getBoundingClientRect().width * 0.6 - 180
      }
    },

    handleBlockCollapse (data) {
      this.$logger.info('handleBlockCollapse ' + data.blockIndex, data)
      this.previewVisible = false
      if (this.blockIndex !== data.blockIndex) {
        if (data.blockIndex === 1) {
          this.rightBrowserWidth = '40%'
          this.leftBrowserWidth = '60%'
          this.blockIndex = data.blockIndex
          this.hasLeftBlock = true
          this.blockWidth = this.$refs['wrapper'].getBoundingClientRect().width * 0.6 - 180
          this.browserMarginLeft = (data.blockIndex - 1) * this.blockWidth + 120
          this.$logger.info('browserMarginLeft ' + this.browserMarginLeft + ', hasLeftBlock:' + this.hasLeftBlock)
        } else {
          this.rightBrowserWidth = '60%'
          this.leftBrowserWidth = '40%'
          this.blockIndex = data.blockIndex
          this.hasLeftBlock = true
          this.blockWidth = this.$refs['wrapper'].getBoundingClientRect().width * 0.4 - 100
          this.browserMarginLeft = (data.blockIndex - 1) * this.blockWidth + 120
          this.$logger.info('browserMarginLeft ' + this.browserMarginLeft + ', hasLeftBlock:' + this.hasLeftBlock)
        }
      } else {
        this.$logger.info('same block collapse')
      }
      this.navPath = this.navPath.filter((item) => item.blockIndex < data.blockIndex)
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
        this.rightBrowserWidth = '40%'
        this.leftBrowserWidth = '60%'
        this.hasLeftBlock = false
        this.blockWidth = this.$refs['wrapper'].getBoundingClientRect().width * 0.6 - 180
        this.browserMarginLeft = 0
      } else {
        this.blockIndex = this.blockIndex - 1
        this.hasLeftBlock = true
        this.blockWidth = this.$refs['wrapper'].getBoundingClientRect().width * 0.4 - 100
        this.browserMarginLeft = (this.blockIndex - 1) * this.blockWidth + 120
      }
      const path = this.navPath.pop()
      this.$logger.info('remove path ' + path)
      this.$logger.info('browserMarginLeft ' + this.browserMarginLeft + ', hasLeftBlock:' + this.hasLeftBlock)
    },

    handleNavPathChange (data) {
      this.$logger.info('handleNavPathChange', data)
      this.previewVisible = false
      const blockIndex = data.blockIndex
      if (this.blockIndex < 2) {
        this.rightBrowserWidth = '40%'
        this.leftBrowserWidth = '60%'
        this.hasLeftBlock = false
        this.blockWidth = this.$refs['wrapper'].getBoundingClientRect().width * 0.6 - 180
        this.browserMarginLeft = 0
      } else {
        this.blockIndex = this.blockIndex - 1
        this.hasLeftBlock = true
        this.blockWidth = this.$refs['wrapper'].getBoundingClientRect().width * 0.4 - 100
        this.browserMarginLeft = (this.blockIndex - 1) * this.blockWidth + 120
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
    },

    handleSearch () {
      this.$logger.info('handleSearch ' + this.searchKeyword)
      if (this.searchKeyword) {
        this.searchByKeyword(this.searchKeyword)
      } else {
        this.searchResultList = []
      }
    },

    searchByKeyword (value) {
      this.$logger.info('searchByKeyword ' + value)
      this.searching = true
      Search({
        curriculumId: this.currentCurriculumId,
        key: value
      }).then(response => {
        this.$logger.info('searchByKeyword ' + value, response)
        this.searchResultList = response.result
      }).finally(() => {
        this.searching = false
      })
    },

    handleSearchFocus () {
      this.$logger.info('handleSearchFocus')
      this.searchResultList = []
      this.searchResultVisible = true
      this.handleSearch()
    },

    handleClickSearchResultItem (item) {
      this.$logger.info('handleClickSearchResultItem ', item)
    },

    handleSearchInputBlur () {
      this.$logger.info('handleSearchInputBlur')
      this.searchResultVisible = false
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
    left: 0;
    top: 64px;
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
    transition: all 200ms ease-in-out;

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
    display: flex;
    flex-direction: row;
    align-items: center;

    .curriculum-filter-line {
      display: flex;
      flex-direction: row;
      width: 200px;
      align-items: center;
      .curriculum-select {
        background: #eaebef;
        display: inline-block;
        position: relative;
        border-radius: 3px;
        /deep/ .ant-select-selection{
          width: 150px;
        }
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

    .search-bar-line {
      width: calc(100% - 200px);
      padding-left: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      position: relative;

      .search-input {
        width: 600px;
      }

      .search-result-wrapper {
        position: absolute;
        top: 40px;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.16);
        width: 600px;
        background-color: #fff;
        max-height: 350px;
        overflow-y: scroll;

        .searching {
          width: 100%;
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .no-result {
          width: 100%;
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: 100px;
          color: #aaa;
        }

        .search-result-item {
          padding: 8px 10px;
          cursor: pointer;
          border-bottom: 1px solid #f6f6f6;
          &:hover {
            color: #15c39a;
            background-color: #f6f6f6;
          }
        }

        &::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        &::-webkit-scrollbar-track {
          border-radius: 3px;
          background: rgba(0,0,0,0.00);
          -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.01);
        }
        /* 滚动条滑块 */
        &::-webkit-scrollbar-thumb {
          border-radius: 5px;
          background: rgba(0,0,0,0.12);
          -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
        }
      }
    }
  }
  .library-detail-wrapper {
    position: absolute;
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    flex: 1;
    .library-detail-nav-wrapper {
      transition: all 200ms ease-in-out;
      overflow: hidden;
      position: relative;
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
          width: 101px;
          box-sizing: border-box;
          background-color: fade(@text-color-secondary, 50%);
          z-index: 110;
          .action-item {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 70px;
            text-align: center;
            margin-top: -40px;
            margin-left: -35px;
            color: #fff;
            font-size: 30px;
            cursor: pointer;
          }
        }
        .browser-table-wrapper {
          height: calc(100vh - 190px);
          display: flex;
          flex-direction: row;
          border: 1px solid #ddd;
          border-bottom: none;
          border-right: none;
          overflow: hidden;
          box-sizing: border-box;
          position: absolute;
          transition: all .2s ease-in;
          z-index: 100;
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
                &:hover {
                  background: #EDF1F5;
                }

              }
              .odd-line {
                background: rgba(255, 255,255);
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
      transition: all 200ms ease-in-out;
      background-color: #bbb;
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
        height: 100%;
        margin: auto;
      }
    }
  }
}

</style>
