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
          <div class="browser-table-wrapper" :style="{left: -browserMarginLeft + 'px'}">
            <div class="browser-table" style="width: 25vw">
              <div class="browser-type-list">
                <div
                  :class="{
                    'browser-type': true,
                    'odd-line': index % 2 === 0,
                    'active-line': currentBrowserType === browserTypeItem.type
                  }"
                  v-for="(browserTypeItem, index) in (parseInt(currentCurriculumId) === parseInt(curriculumType.IBMYP) ? browserTypeListForIbMpy : browserTypeList)"
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
                @blockCollapse="handleBlockCollapse"/>
            </div>
          </div>
        </div>
      </div>
      <div class="library-detail-preview-wrapper" :style="{width: rightBrowserWidth}">
        <div class="expand-icon" @click="handleExpandDetail" :style="{'left': (expandedListFlag ? -20 : -20 )+ 'px'}">
          <template v-if="expandedListFlag">
            <a-icon type="double-left" style="font-size: 20px; color: #07AB84"/>
          </template>
          <template v-if="!expandedListFlag">
            <a-icon type="double-right" style="font-size: 20px; color: #07AB84"/>
          </template>
        </div>
        <div
          class="browser-block-item-wrapper">
          <div
            class="browser-block-item-last"
            :style="{'flex-direction': dataListMode === 'list' ? 'column' : 'row'}">
            <!--   data item list-->
            <div class="switch-type-wrapper" v-if="dataList.length">
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
                      <template v-if="$store.getters.roles.indexOf('teacher') !== -1">
                        <a-menu-item @click="toggleType( typeMap['unit-plan'], $t('teacher.my-content.unit-plan-type'))">
                          <span>{{ $t('teacher.my-content.unit-plan-type') }}</span>
                        </a-menu-item>
                        <a-menu-item @click="toggleType(typeMap.evaluation, $t('teacher.my-content.evaluation-type'))">
                          <span>{{ $t('teacher.my-content.evaluation-type') }}</span>
                        </a-menu-item>
                      </template>
                      <a-menu-item @click="toggleType(typeMap.task, $t('teacher.my-content.tasks-type') )">
                        <span>{{ $t('teacher.my-content.tasks-type') }}</span>
                      </a-menu-item>
                      <!--                  <a-menu-item @click="toggleType(typeMap.lesson, $t('teacher.my-content.lesson-type'))">
                        <span>{{ $t('teacher.my-content.lesson-type') }}</span>
                      </a-menu-item>-->
                      <template v-if="$store.getters.roles.indexOf('expert') !== -1">
                        <a-menu-item @click="toggleType(typeMap.topic, $t('teacher.my-content.topics-type'))">
                          <span>{{ $t('teacher.my-content.topics-type') }}</span>
                        </a-menu-item>
                      </template>
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
                  <content-type-icon :type="dataItem.type" />
                  <span class="data-name">
                    {{ dataItem.name }}
                  </span>
                  <span class="data-time">
                    {{ dataItem.createTime | dayjs }}
                  </span>
                </a-tooltip>
                <!--            <span class="arrow-item">-->
                <!--              <a-icon type="more" />-->
                <!--            </span>-->
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
                      :content-type="dataItem.type"
                    />
                  </div>
                </div>
              </div>
            </template>
            <div class="loading-wrapper" v-if="dataListLoading">
              <a-spin />
            </div>
          </div>
        </div>
        <div
          class="preview-info"
          v-if="previewVisible">
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
import PuBuIcon from '@/assets/icons/library/pubu .svg?inline'
import ListModeIcon from '@/assets/icons/library/liebiao .svg?inline'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import DataCardView from '@/components/Library/DataCardView'
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
    IduBrowser,
    ContentTypeIcon,
    PuBuIcon,
    ListModeIcon,
    DataCardView
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
      leftBrowserWidth: '50vw',
      rightBrowserWidth: '50vw',

      dataList: [],
      dataListLoading: false,
      currentDataId: null,
      dataListMode: 'list',

      currentTypeLabel: 'Choose type（S）of content',
      currentType: 0,
      hasChildSubject: true,

      expandedListFlag: true
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
    this.blockWidth = this.$refs['wrapper'].getBoundingClientRect().width / 4
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
      this.previewVisible = false
      if (this.blockIndex !== data.blockIndex) {
        if (data.blockIndex === 1) {
          this.blockIndex = data.blockIndex
          this.hasLeftBlock = true
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
      this.$logger.info('handleNavPathChange', data)
      this.previewVisible = false
      const blockIndex = data.blockIndex
      if (this.blockIndex < 2) {
        this.hasLeftBlock = false
        this.browserMarginLeft = 0
      } else {
        this.blockIndex = this.blockIndex - 1
        this.hasLeftBlock = true
        this.browserMarginLeft = (this.blockIndex - 1) * this.blockWidth
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
    },

    handleClickBlock (data) {
      this.$logger.info('handleClickBlock', data)
      this.dataList = []
      this.dataListLoading = true
      QueryContents(data).then(response => {
        this.$logger.info('QueryContents response', response)
        // TODO 待删除 测试数据
        // this.dataList = response.result ? response.result : []
        setTimeout(() => {
          this.dataList = [{ 'id': '1466599633981091842', 'name': 'Unnamed Unit Plan', 'image': 'http://dcdkqlzgpl5ba.cloudfront.net/file/20210730045859200-education-5923312_640.png', 'status': 0, 'delFlag': 0, 'createBy': 'yangxunwu@gmail.com', 'createTime': '2021-12-03 02:46:16', 'updateTime': '2021-12-10 09:55:35', 'type': 2, 'presentationId': null, 'revisionId': null, 'copyFromSlide': null, 'pageIds': null, 'references': [], 'similarity': null, 'questions': [], 'learnOuts': [], 'customTags': [], 'taskType': null, 'startDate': null, 'endDate': null, 'isFavorite': false, 'groupName': null, 'pageObjectIds': [], 'overview': null }, { 'id': '1469225299138392066', 'name': '方法', 'image': 'https://dcdkqlzgpl5ba.cloudfront.net/ppt/20211210/tTUvanb0lXeaPNhpl0fuq6fsKcPqdYJkk3IM2ljlsX7bU7GGkPDDStZtlDaTxtPjQS3o4WpCTIXnotcd7Z0LgFBFcVUrGnGbWlmIuvYWCPq6PxOSqFzFZM0njU_ArV5QQdAPQKC8Bw75xUKe_iUk9E1ezgeaKW8L7uAI3K-sroeTVtGs6PlMg31zSjHxArMZ109PbWAjZObgcOdatO07IixvMsxcxPmI0AGch0EJfg=s800', 'status': 0, 'delFlag': 0, 'createBy': 'yangxunwu@gmail.com', 'createTime': '2021-12-10 08:39:43', 'updateTime': '2021-12-10 14:04:12', 'type': 4, 'presentationId': '1r8xes_Hsx_UXC7XsaSK5JZx-F95U2Iys-qDXea9pXL4', 'revisionId': 'qGcrWUpU4NBDFg', 'copyFromSlide': null, 'pageIds': null, 'references': [], 'similarity': null, 'questions': [], 'learnOuts': [], 'customTags': [], 'taskType': 'FA', 'startDate': null, 'endDate': null, 'isFavorite': false, 'groupName': null, 'pageObjectIds': [], 'overview': '111' }, { 'id': '1469325830515142657', 'name': 's', 'image': 'http://dcdkqlzgpl5ba.cloudfront.net/file/20210730045859200-education-5923312_640.png', 'status': 0, 'delFlag': 0, 'createBy': 'yangxunwu@gmail.com', 'createTime': '2021-12-10 15:19:11', 'updateTime': '2021-12-10 15:22:57', 'type': 4, 'presentationId': null, 'revisionId': null, 'copyFromSlide': null, 'pageIds': null, 'references': [], 'similarity': null, 'questions': [], 'learnOuts': [], 'customTags': [], 'taskType': 'FA', 'startDate': null, 'endDate': null, 'isFavorite': false, 'groupName': null, 'pageObjectIds': [], 'overview': 'ss' }, { 'id': '1445205072185192450', 'name': 'Unnamed Unit Plan 123456789', 'image': 'https://dcdkqlzgpl5ba.cloudfront.net/file/202110240412315516-QQ截图20210612213723.png', 'status': 1, 'delFlag': 0, 'createBy': 'nangezgp@gmail.com', 'createTime': '2021-10-05 01:51:54', 'updateTime': '2021-12-15 14:16:16', 'type': 2, 'presentationId': null, 'revisionId': null, 'copyFromSlide': null, 'pageIds': null, 'references': [], 'similarity': null, 'questions': [], 'learnOuts': [], 'customTags': [], 'taskType': null, 'startDate': '2021-12-01 13:12:22', 'endDate': '2022-01-31 13:12:22', 'isFavorite': false, 'groupName': null, 'pageObjectIds': [], 'overview': 'test overs 123456' }, { 'id': '1451114948203196418', 'name': 'test split yes', 'image': 'https://dcdkqlzgpl5ba.cloudfront.net/file/202112170245433700-Image20211209150147.png', 'status': 1, 'delFlag': 0, 'createBy': 'nangezgp@gmail.com', 'createTime': '2021-10-21 09:15:39', 'updateTime': '2021-12-17 05:09:58', 'type': 4, 'presentationId': '18Lc63Ib3gL5Ns5cWO8eQ5cfzX1Q8MX89Aj7sHwG76VY', 'revisionId': 'WrzyjHZdYhw0tg', 'copyFromSlide': null, 'pageIds': null, 'references': [], 'similarity': null, 'questions': [], 'learnOuts': [], 'customTags': [], 'taskType': 'SA', 'startDate': '2021-12-07 12:00:01', 'endDate': '2021-12-31 12:00:01', 'isFavorite': false, 'groupName': null, 'pageObjectIds': [], 'overview': 'test split yesii' }, { 'id': '1423565744526913537', 'name': 'has evaluation session', 'image': 'http://dcdkqlzgpl5ba.cloudfront.net/ppt/20211105/i2D12HP1nJLg6bRdHyxqXJGc57LopI9qAOvQA6SaMUUHbUzYNeXWX6Ln0UIV22b2pMrF0uHKGlLyQLg8w_kicFfpAWDD2el92yun6PT5Fn487_0QpM5V-bI4bpe24He4MPkwNpVTj9z3QNovVZ6Mw04A936nXSMgbDtVvEqMccTQMrmVaKq0ONZmQ46AY5RMw41yB5ypaxtI_qVWLCNJdd_PLScmjcBilCMagnv5=s800', 'status': 1, 'delFlag': 0, 'createBy': 'yangxunwu@gmail.com', 'createTime': '2021-08-06 08:44:57', 'updateTime': '2021-12-17 06:07:21', 'type': 4, 'presentationId': '17kZYJTQTX6rOIhXhisTaE_5ocYILbTJfegW0QUzOnI0', 'revisionId': 'iabWFZtixwA-iQ', 'copyFromSlide': null, 'pageIds': null, 'references': [], 'similarity': null, 'questions': [], 'learnOuts': [], 'customTags': [], 'taskType': 'FA', 'startDate': '2021-12-07 05:41:24', 'endDate': '2022-01-25 05:41:24', 'isFavorite': true, 'groupName': null, 'pageObjectIds': [], 'overview': 'overviewoverviewask details' }]
          this.dataListLoading = false
        }, 1000)
      }).finally(() => {
      })
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
      if (this.expandedListFlag) {
        this.leftBrowserWidth = '0vw'
        this.rightBrowserWidth = '100vw'
        this.expandedListFlag = false
      } else {
        this.leftBrowserWidth = '50vw'
        this.rightBrowserWidth = '50vw'
        this.expandedListFlag = true
      }
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
            width: 25%;
            .browser-type-list {
              display: flex;
              flex-direction: column;
              box-sizing: border-box;
              width: 100%;
              .browser-type {
                padding: 10px 20px 10px 10px;
                font-weight: 500;
                cursor: pointer;
                background: rgba(228, 228, 228, 0.2);
                display: flex;
                align-items: center;
                flex-direction: row;
                position: relative;
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
      width: 50%;
      padding: 10px;
      transition: all 200ms ease-in-out;
      background: #fff;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      border-left: 1px solid #ddd;
      min-height: 600px;
      position: relative;
      flex: 1;
      z-index: 100;

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
  width: 50%;
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

.browser-block-item-last {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  box-sizing: border-box;

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
      width: 170px;
      padding: 10px;
      box-sizing: border-box;
      background: #FFFFFF;
      display: flex;
      flex-direction: row;
      justify-content: center;
      .card-item {
        width: 100%;
        //border: 1px solid #15C39A;
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
    min-height: 400px;
    width: 100%;
    text-align: center;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.no-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60%;
  margin: auto;
}
</style>
