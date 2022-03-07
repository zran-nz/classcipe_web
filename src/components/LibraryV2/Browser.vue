<template>
  <div class="library-wrapper" ref="wrapper" data-version="v2" @click="handleSearchKeyInputBlur">
    <div class="nav-header" :style="{height: currentBrowserType === BrowserTypeMap.sdg ? '100px' : '100px'}">
      <div class="header-info">
        <div class="library-nav-bar" >
          <navigation :path="navPath" @pathChange="handleNavPathChange" v-show="libraryMode === LibraryMode.browserMode"/>
        </div>
        <div class="filter-line">
          <div class="search-bar-line">
            <a-popover
              trigger="click"
              placement="bottomLeft"
              :overlayStyle="{ 'max-height': filterHeight + 'px', 'position': 'absolute','top':'190px','overflow-y': 'auto',' background-clip':'padding-box',' border-radius':'2px','box-shadow':' 0 2px 8px rgb(0 0 0 / 15%'}">
              <template slot="content">
                <search-filter
                  @filter-config-update="handleUpdateFilterConfig"
                  :filter-config="filterConfig"
                  :age-options="filterAgeOptions"
                  :subject-options="filterSubjectOptions"
                  :type-options="filterTypeOptions"
                  :filter-fa-options="filterFaOptions"
                  :filter-sa-options="filterSaOptions"
                  :filter-activity-options="filterActivityOptions"
                />
              </template>
              <div class="filter-item">
                <filter-icon class="filter-icon" />
                <filter-active-icon class="filter-active-icon"/>
                <div class="filter-label">
                  Filter
                </div>
              </div>
            </a-popover>
            <div class="search-input" @click.stop="">
              <a-input-search
                placeholder="input search text"
                :loading="searching"
                v-model="searchKeyword"
                class="library-search-input"
                @click.native="debouncedSearchKeyFocus"
                @focus.native='debouncedSearchKeyFocus'
                @keyup.native="debouncedSearchKeyFocus"
                enter-button
                @search="handleSearchKeyFocus" />
              <div class="search-result-wrapper" v-if="searchResultVisible && (searching || searchResultList.length)">
                <div class="searching" v-if="searching">
                  <a-spin>
                    <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
                  </a-spin>
                </div>
                <div class="search-result-list" v-if="!searching">
                  <template v-if="searchResultList.length">
                    <div
                      class="search-result-item"
                      @click.stop="handleClickSearchResultItem(item)"
                      v-for="(item, sIndex) in searchResultList"
                      :key="sIndex"
                      :data-from-type="item.fromType">
                      <div v-html="item.tagName"></div>
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
      </div>
    </div>
    <div
      class="library-detail-wrapper"
      :style="{top: currentBrowserType === BrowserTypeMap.sdg ? '100px' : '100px',
               height: currentBrowserType === BrowserTypeMap.sdg ? 'calc(100vh - 164px)': 'calc(100vh - 164px)'}">
      <div class="curriculum-filter-line">
        <div class="curriculum-select" v-excludeRole="['student']">
          <a-select
            :getPopupContainer="trigger => trigger.parentElement"
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
        <div class="curriculum-select" v-hasRole="['student']">
          <a-input disabled value="Cambridge">Cambridge</a-input>
        </div>
      </div>
      <div class="library-detail-nav-wrapper" :style="{width: leftBrowserWidth}" @click="libraryMode = LibraryMode.browserMode">
        <div class="library-content">
          <div class="browser-action" v-if="hasLeftBlock && !expandedListFlag">
            <div class="action-item" @click="handleViewLeft">
              <back-svg style="width: 8vw"/>
            </div>
          </div>
          <div class="browser-table-wrapper" :style="{left: -browserMarginLeft + 'px'}">
            <div class="browser-table" style="width: 15vw">
              <div class="browser-type-list">
                <div
                  :class="{
                    'browser-type': true,
                    'odd-line': index % 2 === 0,
                    'active-line': currentBrowserType === browserTypeItem.type
                  }"
                  v-for="(browserTypeItem, index) in (parseInt(currentCurriculumId) === parseInt(curriculumType.IBMYP) ? browserTypeListForIbMpy : browserTypeList)"
                  v-show='!$store.getters.hiddenIbCurriculumId || (browserTypeItem.tagType !== TagType.idu && browserTypeItem.tagType !== TagType.skill)'
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
                v-if="currentBrowserType === BrowserTypeMap.curriculum"
                @clickBlock="handleClickBlock"
                @blockCollapse="handleBlockCollapse"/>
              <assessment-browser
                :curriculum-id="currentCurriculumId"
                v-if="currentBrowserType === BrowserTypeMap.assessmentType"
                @clickBlock="handleClickBlock"
                @update-data-list="handleUpdateDataList"
                @blockCollapse="handleBlockCollapse"/>
              <general-capability-browser
                :block-index="blockIndex"
                :curriculum-id="currentCurriculumId"
                v-if="currentBrowserType === BrowserTypeMap.centurySkills"
                @clickBlock="handleClickBlock"
                @blockCollapse="handleBlockCollapse"/>
              <subject-specific-browser
                :block-index="blockIndex"
                :curriculum-id="currentCurriculumId"
                v-if="currentBrowserType === BrowserTypeMap.specificSkills"
                @clickBlock="handleClickBlock"
                @blockCollapse="handleBlockCollapse"/>
              <idu-browser
                :block-index="blockIndex"
                :curriculum-id="currentCurriculumId"
                v-if="currentBrowserType === BrowserTypeMap.idu"
                @clickBlock="handleClickBlock"
                @blockCollapse="handleBlockCollapse"/>
              <!--大纲游览-->
              <sdg-browser
                v-if="currentBrowserType === BrowserTypeMap.sdg"
                @clickBlock="handleClickBlock"
                @update-data-list="handleUpdateDataList"
                @blockCollapse="handleBlockCollapse"/>
            </div>
          </div>
        </div>
      </div>
      <div class="library-detail-preview-wrapper" :style="{width: rightBrowserWidth}">
        <div class="expand-icon" @click="handleExpandDetail" :style="{'left': expandedListFlag ? '10px' : '-20px'}">
          <template v-if="expandedListFlag">
            <a-popover placement="right">
              <template slot="content">
                <div class="tips-content">Navigate via curriculums</div>
              </template>
              <a-icon type="double-right" style="font-size: 20px; color: #07AB84"/>
            </a-popover>

          </template>
          <template v-if="!expandedListFlag">
            <a-icon type="double-left" style="font-size: 20px; color: #07AB84"/>
          </template>
        </div>
        <div
          class="browser-block-item-wrapper">
          <a-card v-if="!searching && showRecommend" :bordered="false"></a-card>
          <div
            class="browser-block-item-last"
            :style="{'flex-direction': dataListMode === 'list' ? 'column' : 'row'}">
            <template v-if="dataListMode === 'list' && (!searching && !dataListLoading)">

              <div
                :class="{
                  'data-list-item': true,
                  'browser-item': true,
                  'odd-line': index % 2 === 0,
                  'active-line': currentDataId === dataItem.id
                }"
                v-for="(dataItem, index) in dataList"
                @click="handleSelectDataItem(dataItem)"
                v-if="(currentType === 0 || dataItem.type === currentType)"
                :key="index">
                <a-tooltip :mouseEnterDelay="1" placement="topLeft">
                  <template slot="title">
                    {{ dataItem.name }}
                  </template>
                  <content-type-icon :type="dataItem.type" />
                  <span class="data-name">
                    {{ dataItem.name }}
                  </span>
                  <span class="data-time">
                    {{ dataItem.updateTime | dayjs }}
                  </span>
                </a-tooltip>
              </div>
            </template>
            <template v-if="dataListMode === 'card' && (!searching && !dataListLoading)">
              <div class="card-view-mode-wrapper" v-if="dataList.length">
                <a-row :gutter="[16, 16]">
                  <template v-if="libraryMode === LibraryMode.searchMode || expandedListFlag === true">
                    <a-col
                      class="gutter-row search-mode"
                      :span="10"
                      :xs="24"
                      :sm="12"
                      :md="8"
                      :lg="6"
                      :xl="6"
                      :xxl="4"
                      v-for="(dataItem, index) in dataList"
                      v-if="(currentType === 0 || dataItem.type === currentType)"
                      :key="index">
                      <div
                        class="card-item-wrapper"
                        @click="handleSelectDataItem(dataItem)">
                        <div class="card-item">
                          <data-card-view
                            :active-flag="currentDataId === dataItem.id"
                            :cover="dataItem.image"
                            :title="dataItem.name"
                            :update-time="dataItem.updateTime"
                            :content-type="dataItem.type"
                          />
                        </div>
                      </div>
                    </a-col>
                  </template>
                  <template v-else>
                    <a-col
                      class="gutter-row list-mode"
                      :span="10"
                      :xs="24"
                      :sm="12"
                      :md="8"
                      :lg="6"
                      :xl="6"
                      :xxl="4"
                      v-for="(dataItem, index) in dataList"
                      v-if="(currentType === 0 || dataItem.type === currentType)"
                      :key="index">
                      <div
                        class="card-item-wrapper"
                        @click="handleSelectDataItem(dataItem)">
                        <div class="card-item">
                          <data-card-view
                            :active-flag="currentDataId === dataItem.id"
                            :cover="dataItem.image"
                            :title="dataItem.name"
                            :update-time="dataItem.updateTime"
                            :content-type="dataItem.type"
                          />
                        </div>
                      </div>
                    </a-col>
                  </template>
                </a-row>
              </div>
            </template>
            <div class="loading-wrapper" v-show="searching || dataListLoading">
              <a-spin tip="searching..." />
            </div>
            <div class="loading-wrapper" v-show="!searching && !dataListLoading && dataList.length === 0">
              <no-more-resources tips="The content you are searching for was not found." v-if="searchKeyword"/>
              <no-more-resources tips="" v-else/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <a-drawer
      destroyOnClose
      placement="right"
      :closable="false"
      width="800px"
      :visible="previewVisible"
      @close="handlePreviewClose"
    >
      <a-row class="preview-wrapper-row">
        <a-col span="2">
          <div class="view-back" @click="handlePreviewClose">
            <div class="back-icon">
              <img src="~@/assets/icons/common/back.png" />
            </div>
          </div>
        </a-col>
        <a-col span="22">
          <div class="detail-wrapper" v-if="previewCurrentId && previewType">
            <common-preview :id="previewCurrentId" :type="previewType" :is-library="true"/>
          </div>
        </a-col>
      </a-row>
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
  getAllCurriculums, GetGradesByCurriculumId
} from '@/api/preference'
import DirIcon from '@/components/LibraryV2/DirIcon'
import NoMoreResources from '@/components/Common/NoMoreResources'
import CommonPreview from '@/components/Common/CommonPreview'
import AssessmentBrowser from './AssessmentBrowser'
import BackSvg from '@/assets/svgIcon/library/back_btn.svg?inline'
import GeneralCapabilityBrowser from '@/components/LibraryV2/GeneralCapabilityBrowser'
import SubjectSpecificBrowser from '@/components/LibraryV2/SubjectSpecificBrowser'
import IduBrowser from '@/components/LibraryV2/IduBrowser'
import { CurriculumType, CustomTagType, TagType } from '@/const/common'
import FilterIcon from '@/assets/libraryv2/filter.svg?inline'
import FilterActiveIcon from '@/assets/libraryv2/filter_active.svg?inline'
import PuBuIcon from '@/assets/icons/library/pubu.svg?inline'
import ListModeIcon from '@/assets/icons/library/liebiao .svg?inline'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import DataCardView from '@/components/Library/DataCardView'
import { LibraryMode } from '@/components/LibraryV2/libraryMode'
import SearchFilter from '@/components/LibraryV2/SearchFilter'
import { QueryContentsFilter, QueryRecommendContents } from '@/api/library'
import { SubjectTree } from '@/api/subject'
import { FindCustomTags } from '@/api/tag'
const { Search, QueryContents, QueryKeyContents } = require('@/api/library')
const { debounce } = require('lodash-es')

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
  specificSkills: 'Achievement objectives',
  centurySkills: 'Century Skills',
  idu: 'Integrated Subject Skill'
}

export default {
  name: 'Browser',
  components: {
    SearchFilter,
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
    IduBrowser,
    ContentTypeIcon,
    PuBuIcon,
    FilterIcon,
    FilterActiveIcon,
    ListModeIcon,
    DataCardView
  },
  data () {
    return {
      currentCurriculumId: this.$store.getters.bindCurriculum ? this.$store.getters.bindCurriculum : '1',
      curriculumOptions: [],
      navPath: [],
      browserTypeListForIbMpy: [
        { type: 'specificSkills', label: 'Achievement objectives', tagType: TagType.skill },
        { type: 'curriculum', label: 'Learning outcomes', tagType: TagType.knowledge },
        { type: 'assessmentType', label: 'Assessment type', tagType: TagType.assessment },
        { type: 'idu', label: 'Integrated Subject Skill', tagType: TagType.idu },
        { type: 'centurySkills', label: '21st Century Skills', tagType: TagType.century },
        { type: 'sdg', label: 'Big idea', tagType: TagType.bigIdea }
      ],
      browserTypeList: [
        { type: 'specificSkills', label: 'Achievement objectives', tagType: TagType.skill },
        { type: 'curriculum', label: 'Learning outcomes', tagType: TagType.knowledge },
        { type: 'assessmentType', label: 'Assessment type', tagType: TagType.assessment },
        { type: 'centurySkills', label: '21st Century Skills', tagType: TagType.century },
        { type: 'sdg', label: 'Big idea', tagType: TagType.bigIdea }
      ],
      TagType: TagType,
      currentBrowserType: null,
      BrowserTypeMap: BrowserTypeMap,
      browserTypeLabelMap: BrowserTypeLabelMap,
      hasLeftBlock: false,
      blockWidth: 200,

      browserMarginLeft: 0,

      previewVisible: false,
      previewCurrentId: '',
      previewType: '',
      blockIndex: 1,
      typeMap: typeMap,

      headerTop: '64px',
      libraryDetailTop: '126px',
      curriculumType: CurriculumType,

      searchKeyword: null,
      searching: false,

      dataList: [],
      dataListLoading: false,
      currentDataId: null,
      dataListMode: 'card',
      dataRecommendList: [],

      currentTypeLabel: 'Choose type（S）of content',
      currentType: 0,
      hasChildSubject: true,

      expandedListFlag: false,

      searchResultList: [],
      libraryMode: LibraryMode.browserMode,
      LibraryMode: LibraryMode,
      currentFromItemName: null,

      // 当前选中的配置项
      filterConfig: {
        age: null,
        subject: [],
        type: [],
        faSaActivityType: null,

        teachingStrategy: [],
        differenceInstructions: [],
        assessmentCategory: [],
        assessmentType: []
      },

      // TODO 选项列表数据，用API返回数据填充
      filterSubjectOptions: [
        { label: 'Math1', value: 'Math1' },
        { label: 'Science', value: 'Science2' },
        { label: 'Math3', value: 'Math3' },
        { label: 'Art', value: 'Art4' },
        { label: 'Science1', value: 'Science1' }
      ],
      filterAgeOptions: [
        { label: 'All' },
        { label: '5' },
        { label: '6' },
        { label: '7' },
        { label: '8' }
      ],
      filterTypeOptions: [
        { label: 'Unit Plan', value: typeMap['unit-plan'] },
        { label: 'Task', value: typeMap.task },
        { label: 'Assessment Tool', value: typeMap.evaluation }
      ],
      filterSaOptions: [],
      filterFaOptions: [],
      filterActivityOptions: [],
      filterHeight: 500,

      searchResultVisible: false,
      firstLoad: true,
      showRecommend: true,

      debouncedSearchKeyFocus: null
    }
  },
  computed: {
    leftBrowserWidth () {
      let width = '30vw'
       if (this.expandedListFlag) {
        width = '0vw'
      } else if (this.showRecommend) {
         width = '15vw'
       }
      return width
    },
    rightBrowserWidth () {
      let width = '85vw'
      if (this.expandedListFlag) {
        width = '100vw'
      } else if (this.showRecommend) {
        width = '70vw'
      }
      return width
    }
  },
  created () {
    if (this.$store.getters.currentRole === 'student') {
      this.currentCurriculumId = CurriculumType.Cambridge + ''
    }
    this.currentBrowserType = null
    this.getRecommended()

    getAllCurriculums().then((response) => {
      this.$logger.info('getAllCurriculums', response)
      this.curriculumOptions = response.result
      this.$logger.info('getAllCurriculums', this.curriculumOptions)
    }).finally(() => {
      this.getfilterOptions()
    })

    this.debouncedSearchKeyFocus = debounce(this.handleSearchKeyFocus, 600)
  },
  mounted () {
    this.blockWidth = this.$refs['wrapper'].getBoundingClientRect().width * 0.15
    this.filterHeight = document.documentElement.clientHeight - 200
    this.$logger.info('globalWidth ' + this.blockWidth)
  },
  methods: {
    getRecommended () {
      this.dataListLoading = true
      QueryRecommendContents({ curriculumId: this.currentCurriculumId ? this.currentCurriculumId : this.$store.getters.bindCurriculum }).then(response => {
        this.$logger.info('QueryRecommendContents response', response)
        this.dataList = response.result ? response.result : []
        this.dataRecommendList = this.dataList
      }).finally(() => {
        this.dataListLoading = false
        this.showRecommend = true
      })
    },
    toggleBrowserType (browserTypeItem) {
      this.$logger.info('toggleBrowserType ' + browserTypeItem.type + ' tagType:' + browserTypeItem.tagType)
      this.showRecommend = false
      if (browserTypeItem.type !== this.currentBrowserType) {
        this.currentBrowserType = browserTypeItem.type
        this.navPath = []
        this.navPath.push({ blockIndex: 1, path: browserTypeItem.label })
        this.$logger.info('reset and add path ' + browserTypeItem.label)
      }
      this.dataList = []

      const postData = {
        curriculumId: this.$store.getters.bindCurriculum,
        tagType: browserTypeItem.tagType
      }
      if (typeof postData.tagType === 'number') {
        QueryContents(postData).then(response => {
          this.$logger.info('toggleBrowserType QueryContents response', response)
          this.dataList = response.result ? response.result : []
        }).finally(() => {
          this.dataListLoading = false
          this.previewVisible = false
        })
      } else {
        this.$logger.info('toggleBrowserType skip handleClickBlock', postData)
        this.dataListLoading = false
        this.previewVisible = false
      }
    },
    handleBlockCollapse (data) {
      this.$logger.info('handleBlockCollapse data.blockIndex(' + data.blockIndex + ') this.blockIndex(' + this.blockIndex + ')', data)
      this.previewVisible = false
      if (this.blockIndex !== data.blockIndex) {
        if (data.blockIndex === 1) {
          this.blockIndex = data.blockIndex
          this.hasLeftBlock = false
          this.browserMarginLeft = (data.blockIndex - 1) * this.blockWidth
          this.$logger.info('browserMarginLeft ' + this.browserMarginLeft + ', hasLeftBlock:' + this.hasLeftBlock)
        } else {
          this.blockIndex = data.blockIndex
          this.hasLeftBlock = true
          this.browserMarginLeft = (data.blockIndex - 1) * this.blockWidth
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
        this.hasLeftBlock = false
        this.blockIndex = 1
        this.browserMarginLeft = 0
      } else {
        this.blockIndex = this.blockIndex - 1
        this.hasLeftBlock = true
        this.browserMarginLeft = (this.blockIndex - 1) * this.blockWidth
      }
      const path = this.navPath.pop()
      this.$logger.info('remove path ' + path)
      this.$logger.info('browserMarginLeft ' + this.browserMarginLeft + ', hasLeftBlock:' + this.hasLeftBlock)
    },

    handleNavPathChange (data) {
      this.$logger.info('handleNavPathChange data.blockIndex(' + data.blockIndex + ') this.blockIndex(' + this.blockIndex + ')', data)
      this.previewVisible = false
      const blockIndex = data.blockIndex
      if (blockIndex === this.blockIndex) {
        return
      }
      this.dataList = []
      if (data.blockIndex < 2) {
        this.hasLeftBlock = false
        this.browserMarginLeft = 0
      } else {
        this.blockIndex = this.blockIndex - 1
        this.hasLeftBlock = true
        this.browserMarginLeft = (data.blockIndex - 1) * this.blockWidth
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
      this.currentBrowserType = null

      if (this.libraryMode === LibraryMode.searchMode) {
        this.handleSearchKey()
      }
      this.getRecommended()
    },

    handleSearchKey () {
      this.$logger.info('handleSearchKey ' + this.searchKeyword)
      this.expandedListFlag = true
      if (this.searchKeyword && this.searchKeyword.trim().length > 0) {
        this.searchByKeyword(this.searchKeyword)
      } else {
        this.searching = false
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
        const list = []
        // 添加高亮标签
        response.result.forEach(item => {
          if (item.name) {
            let lastIndex = 0
            let index = item.name.toLowerCase().indexOf(value)
            let tagName = ''
            while (index !== -1 && index + value.length <= item.name.length) {
              tagName += item.name.substring(lastIndex, index) + '<span class="search-keyword-item">' + item.name.substring(index, index + value.length) + '</span>'
              lastIndex = index + value.length
              index = item.name.toLowerCase().indexOf(value, index + value.length)
            }
            const tagItem = {
              fromType: item.fromType,
              name: item.name,
              tagName: tagName
            }
            list.push(tagItem)
          }
        })
        this.searchResultList = list
        this.$logger.info('tag list item', this.searchResultList)
      }).finally(() => {
        this.searching = false
      })
    },

    searchContentByKeyword (value) {
      if (value) {
        this.$logger.info('searchContentByKeyword ' + value)
        this.searchByFilter({ searchKey: value.trim() })
      } else {
        this.showRecommend = true
        this.dataList = this.dataRecommendList
      }
    },

    handleSearchKeyFocus () {
      this.$logger.info('handleSearchKeyFocus')
      this.searchResultVisible = true
      this.searchResultList = []
      this.libraryMode = LibraryMode.searchMode
      this.searchContentByKeyword(this.searchKeyword)
      this.handleSearchKey()
    },
    handleSearchKeyInputBlur () {
      this.searchResultVisible = false
    },

    handleClickSearchResultItem (item) {
      this.$logger.info('handleClickSearchResultItem', item)
      this.handleActiveFilterItem(item)
      this.searchResultVisible = false
    },

    handleClickBlock (data) {
      this.$logger.info('handleClickBlock', data)
      this.showRecommend = false
      this.dataList = []
      this.dataListLoading = true
      this.previewVisible = false
      if (typeof data.tagType === 'number') {
        QueryContents(data).then(response => {
          this.$logger.info('QueryContents response', response)
          this.dataList = response.result ? response.result : []
        }).finally(() => {
          this.dataListLoading = false
        })
      } else {
        this.$logger.info('skip handleClickBlock', data)
      }
    },

    handleUpdateDataList (data) {
      this.$logger.info('handleUpdateDataList', data)
      this.dataList = data
      this.dataListLoading = false
    },

    toggleType (type, label) {
      this.$logger.info('toggleType ' + type + ' label ' + label)
      this.currentType = type
      this.currentTypeLabel = label
    },

    handleToggleDataListMode (mode) {
      this.$logger.info('handleToggleDataListMode' + mode)
      this.dataListMode = mode
    },

    handleSelectDataItem (dataItem) {
      this.$logger.info('handleSelectDataItem ', dataItem)
      this.currentDataId = dataItem.id
      this.handlePreviewDetail(dataItem)
    },

    handleExpandDetail () {
      this.$logger.info('handleExpandDetail ' + this.blockIndex + ' ' + this.expandedListFlag)
      if (this.expandedListFlag) {
        this.expandedListFlag = false
      } else {
        this.expandedListFlag = true
      }

      this.$nextTick(() => {
        this.$logger.info('handleExpandDetail nextTick ' + this.blockIndex + ' ' + this.expandedListFlag + ' left block ' + (this.blockIndex - 1))
        if (this.blockIndex !== 0) {
          if (this.expandedListFlag) {
            this.browserMarginLeft = (this.blockIndex) * this.blockWidth
          } else {
            this.browserMarginLeft = (this.blockIndex - 1) * this.blockWidth
          }
        }
        this.$logger.info('this.browserMarginLeft', this.browserMarginLeft)
      })
    },

    handleActiveFilterItem (item) {
      this.$logger.info('handleActiveFilterItem ', item)
      this.searching = true
      this.searchKeyword = item.name
      this.currentFromItemName = item.name
      this.libraryMode = LibraryMode.searchMode
      this.handleSearchByFromType(item)
    },

    handleSearchByFromType (item) {
      this.$logger.info('handleSearchByFromType ', item)
      this.searching = true
      this.showRecommend = false
      QueryKeyContents(item).then(response => {
        this.$logger.info('QueryContents response', response)
        const list = response.result ? response.result : []
        list.sort(it => {
          if (it.name.toLowerCase().indexOf(item.name) !== -1) {
            return -1
          } else {
            return 1
          }
        })
        this.dataList = list
      }).finally(() => {
        this.searching = false
      })
    },

    searchByFilter (filter) {
      this.$logger.info('searchByFilter ', filter)
      const filterData = Object.assign({}, filter)
      delete filterData.curriculumId
      this.showRecommend = false
      this.searching = true
      QueryContentsFilter(filterData).then(response => {
        this.$logger.info('QueryContentsFilter result : ', response)
        this.dataList = response.result ? response.result : []
      }).finally(() => {
        this.searching = false
      })
    },
    handleUpdateFilterConfig (filter) {
      // TODO 根据配置更新请求参数
      this.$logger.info('handleUpdateFilterConfig', filter)
      this.libraryMode = LibraryMode.searchMode
      // 学生只显示task
      if (this.$store.getters.currentRole === 'student') {
        filter.type = [typeMap.task]
      }
      this.searchByFilter(filter)
    },
    getfilterOptions () {
      SubjectTree({ curriculumId: this.currentCurriculumId }).then(response => {
        this.$logger.info('getSubjectTree response', response.result)
        this.filterSubjectOptions = []
        response.result.forEach(subject => {
          this.filterSubjectOptions.push({ label: subject.name, value: subject.id })
        })
      })
      GetGradesByCurriculumId({ curriculumId: this.currentCurriculumId }).then(response => {
        this.$logger.info('GetGradesByCurriculumId', response.result)
        this.filterAgeOptions = [{ label: 'All' }]
        response.result.forEach(grade => {
          this.filterAgeOptions.push({ label: grade.age })
        })
      })
      FindCustomTags({}).then((response) => {
        this.$logger.info('FindCustomTags response', response.result)
        if (response.success) {
          this.filterSaOptions = []
          this.filterFaOptions = []
          this.filterActivityOptions = []
          const recommends = response.result.recommends
          // 默认展示的tag分类
          CustomTagType.task.sa.forEach(name => {
            recommends.forEach(parent => {
              if (parent.name === name) {
                this.filterSaOptions.push(parent)
              }
            })
          })
          CustomTagType.task.fa.forEach(name => {
            recommends.forEach(parent => {
              if (parent.name === name) {
                this.filterFaOptions.push(parent)
              }
            })
          })
          CustomTagType.task.activity.forEach(name => {
            recommends.forEach(parent => {
              if (parent.name === name) {
                this.filterActivityOptions.push(parent)
              }
            })
          })
        }
      })
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
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.06);
    background: #FFFFFF;
    z-index: 250;

    @media only screen and (max-width: 1600px) {
      .header-info {
        padding-left: 24px;
        padding-right: 24px;
      }
    }
    .header-info {
      margin: auto;
      max-width: 1600px;
    }
  }

  .library-nav-bar {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    transition: all 200ms ease-in-out;
    line-height: 30px;
    height: 42px;

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
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;

    .search-bar-line {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      position: relative;

      .search-input {
        width: 100%;
        position: relative;
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
      padding-top: 40px;
      transition: all 200ms ease-in-out;
      overflow: hidden;
      position: relative;
      z-index: 100;
      width: 50%;
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
          width: 15vw;
          box-sizing: border-box;
          background-color: fade(@text-color-secondary, 40%);
          z-index: 110;
          .action-item {
            position: absolute;
            top: 50%;
            left: 0;
            width: 15vw;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
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
          border-top: none;
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
            width: 15vw;
            .browser-type-list {
              display: flex;
              flex-direction: column;
              box-sizing: border-box;
              width: 100%;
              .browser-type {
                padding: 10px 15px 10px 0;
                font-weight: 500;
                cursor: pointer;
                background: rgba(228, 228, 228, 0.2);
                display: flex;
                align-items: center;
                flex-direction: row;
                position: relative;
                .arrow-item {
                  position: absolute;
                  right: 2px;
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
      padding: 10px;
      transition: all 200ms ease-in-out;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      min-height: 600px;
      position: relative;
      flex: 1;
      z-index: 150;
      background: #fafafa;

      .expand-icon {
        display: flex;
        background-color: #fff;
        box-shadow: 0 0 3px 3px rgba(159, 159, 159, 0.26);
        border-radius: 40px;
        padding: 10px;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: absolute;
        top: 50%;
        left: 0;
        margin-top: -10px;
        z-index: 200;
        transition: none;
      }

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
        background: rgba(0,0,0,0.01);
        -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.01);
      }

      .preview-info {
        height: 100%;
        overflow-y: scroll;
        width: 50%;
        background: #FFFFFF;
        border: 1px solid #D8D8D8;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.01);
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

.browser-block-item-wrapper {
  overflow-y: scroll;
  height: calc(100vh - 190px);
  width: 100%;
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
    background: rgba(0,0,0,0.05);
    -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
  }
}

.switch-icon {
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .icon-item {
    cursor: pointer;
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

.browser-block-item-last {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  box-sizing: border-box;

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
    padding: 10px 10px 25px 10px;
    .card-item-wrapper {
      cursor: pointer;
      box-sizing: border-box;
      background: #FFFFFF;
      display: flex;
      flex-direction: row;
      justify-content: center;
      .card-item {
        width: 100%;
        opacity: 1;
        border-radius: 6px;
        background: #fff;
        &:hover {
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        }
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
}

.loading-wrapper {
  min-height: 400px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60%;
  margin: auto;
}

.filter-bar {
  padding-top: 8px;
  height: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.filter-item {
  color: #333;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-color: #eff3f6;
  box-shadow: none;
  background: #eff3f6;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  padding: 0 0 0 10px;
  height: 46px;
  line-height: 46px;
  white-space:nowrap;

  svg {
    height: 15px;
  }
  .filter-active-icon {
    display: none;
  }
  .filter-icon {
    display: inline;
  }

  &:hover {
    color: #38cfa6;
    .filter-active-icon {
      display: inline;
    }

    .filter-icon {
      display: none;
    }
  }

  .filter-label {
    font-family: Inter-Bold;
    line-height: 20px;
    padding-right: 10px;
    border-right: 1px solid #ccc;
  }
}

.filter-list {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 33px;
  overflow: hidden;
  flex-wrap: wrap;

  .filter-list-item {
    color: #333;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: #FFFFFF;
    border: 1px solid #D3D3D3;
    opacity: 1;
    border-radius: 6px;
    padding: 5px 15px;
    position: relative;
    margin-right: 15px;

    .filter-keyword{
      white-space:nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }
    .filter-close {
      display: none;
      position: absolute;
      right: -5px;
      top: -5px;
    }

    &:hover {
      color: #FFF;
      border: 1px solid #38cfa6;
      background-color: #15C39A;

      .filter-close {
        z-index:2000;
        display: block;
        background-color: #fff;
        border: 1px solid #fff;
        border-radius: 50%;
        position: absolute;
        right: -5px;
        top: -5px;
        color: red;
      }
    }
  }

  .active-filter-list-item {
    color: #FFF;
    border: 1px solid #38cfa6;
    background-color: #15C39A;
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
  -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.01);
}

.search-info {
  position: absolute;
  z-index: 200;
  padding: 10px;
  box-sizing: border-box;
  background-color: #fff;
  width: 100vw;
}

.search-result-wrapper {
  position: absolute;
  top: 50px;
  z-index: 150;
  padding: 10px 0;
  border-radius: 3px;
  box-shadow: 0 5px 10px rgba(29, 38, 45, 0.2);
  color: #1d262d;
  width: calc(100% - 46px);
  background-color: #fff;
  max-height: 450px;
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
    padding: 0 20px;
    cursor: pointer;
    height: 34px;
    line-height: 34px;
    color: #5f7d95;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
      background-color: #e3e9ed;
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

.data-list-item {
  &:hover {
    .data-name {
      text-decoration: underline;
    }
  }
}

.curriculum-filter-line {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: row;
  z-index: 110;
  height: 40px;
  background: #fff;
  padding: 6px 5px 5px 5px;
  width: 30vw;
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

</style>
