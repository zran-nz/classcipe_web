<template>
  <div class="browser-block" data-type="sdg">
    <div class="browser-block-item-wrapper">
      <div class="browser-block-item" :style="{width: '15vw' , minWidth: '15vw' }">

        <div class="filter-block" >
          <div class="filter-block-content">
            <div class="filter-icon">
              <filter-icon />
            </div>
            <div class="switch-type-wrapper library-select">
              <a-select
                :getPopupContainer="trigger => trigger.parentElement"
                @change="changeSubject"
                v-model="selectedSubect"
                class="filter-select library-filter-select"
                placeholder="Select Subject"
                :showArrow="true"
                mode="multiple">
                <a-select-option :value="item.id" v-for="(item, index) in subjectList" :key="index" >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </div>
          </div>
        </div>
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
    <div class="browser-block-item-wrapper browser-block-item" :style="{width: '15vw' , minWidth: '15vw' }" >
      <div class="filter-block">
        <div class="filter-block-content">
          <div class="filter-icon">
            <filter-icon />
          </div>
          <div class="filter-list">
            <a-select :getPopupContainer="trigger => trigger.parentElement" v-model="selectedConcept" class="filter-select  library-filter-select" placeholder="Universal Concept" :allowClear="true" >
              <a-select-option :value="name" v-for="(name, index) in conceptList" :key="index" >
                {{ name }}
              </a-select-option>
            </a-select>
            <div class="keyword-search search-box">
              <a-input
                placeholder="Search key word"
                v-model="keywordSearchText"
                class="my-nav-search">
                <sousuo-icon-svg slot="prefix"/>
              </a-input>
            </div>
          </div>
        </div>
      </div>
      <!--     new sdg keywords description-->
      <!--      <div class="keyword-wrapper">-->
      <!--        <div class="keyword-list">-->
      <!--          <div :class="{'keyword-item': true, 'kd-active-item': currentSdgKeywordScenario === 'keyword' && currentSdgKeywordScenarioId === keywordItem.id}" v-for="(keywordItem, kIndex) in sdgKeywordNameList" @click="queryBigIdeaKeywords(keywordItem)" :key="kIndex">-->
      <!--            &lt;!&ndash;            <img src="~@/assets/icons/library/tuijian@2x.png" class="keyword-icon"/>&ndash;&gt;-->
      <!--            <span class="keyword-name">-->
      <!--              {{ keywordItem.name }}-->
      <!--            </span>-->
      <!--            <a-icon-->
      <!--              type="check-circle"-->
      <!--              theme="filled"-->
      <!--              v-if="currentSdgKeywordScenario === 'keyword' && currentSdgKeywordScenarioId === keywordItem.id" />-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div class="description-wrapper">
        <div class="description-list">
          <div :class="{'description-item': true, 'kd-active-item': currentSdgKeywordScenario === 'description' && currentSdgKeywordScenarioId === descriptionItem.id}" v-for="(descriptionItem, dIndex) in sdgDescriptionsList" @click="queryBigIdeaDescription(descriptionItem)" :key="dIndex">
            {{ descriptionItem.name }}
          </div>
        </div>
      </div>-->
      <div class="description-wrapper">
        <div class="description-list">
          <div :class="{'description-item': true, 'kd-active-item': currentBigIdea === bigIdeaItem.name}" v-for="(bigIdeaItem, bIndex) in bigIdeaList" @click="handleSelectBigIdeaItem(bigIdeaItem)" :key="bIndex" v-if="keywordSearchText ? bigIdeaItem.name && bigIdeaItem.name.indexOf(keywordSearchText) !== -1 : true">
            {{ bigIdeaItem.name }}
          </div>
        </div>
      </div>

      <template v-if="!bigIdeaList.length && !bigIdeaLoading">
        <div class="no-data">
          <no-more-resources />
        </div>
      </template>
      <template v-if="bigIdeaLoading">
        <div class="loading-wrapper">
          <a-spin />
        </div>
      </template>

    </div>
    <!--    <div class="browser-block-item-wrapper" :style="{width: '15vw' , minWidth: '15vw' }" >-->
    <!--      &lt;!&ndash;  big idea list &ndash;&gt;-->
    <!--      <div class="description-wrapper">-->
    <!--        <div class="description-list">-->
    <!--          <div :class="{'description-item': true, 'kd-active-item': currentBigIdea === bigIdeaItem.name}" v-for="(bigIdeaItem, bIndex) in bigIdeaList" @click="handleSelectBigIdeaItem(bigIdeaItem)" :key="bIndex">-->
    <!--            {{ bigIdeaItem.name }}-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->

    <div
      class="browser-block-item-wrapper"
      :style="{width: '15vw' ,
               minWidth: '15vw'}">
      <div
        class="browser-block-item-last"
        :style="{width: '15vw' ,
                 minWidth: '15vw',
                 'flex-direction': dataListMode === 'list' ? 'column' : 'row'}">
        <!--   data item list-->
        <div class="switch-type-wrapper">
          <div class="switch-type">
            <div class="switch-label">
              <div class="filter-icon">
                <filter-icon />
              </div>
              <div class="content-filter-list">
                <a-dropdown class="filter-dropdown-item">
                  <a-menu slot="overlay">
                    <a-menu-item disabled>
                      <span>Choose type(s)of content</span>
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
                    style="padding: 0 10px;
                  display:flex; align-items:center ;
                  border-color: #F3F3F3;
                  box-shadow: none;
                  height: 35px;border-radius: 2px;background: #F3F3F3;font-size:13px;
                  font-family: Inter-Bold;color: #182552;">
                    <span v-if="currentTypeLabel">{{ currentTypeLabel }}</span> <span v-else>Choose type(s)of content</span>
                    <a-icon type="caret-down" /> </a-button>
                </a-dropdown>
                <a-dropdown class="filter-dropdown-item">
                  <a-menu slot="overlay">
                    <a-menu-item disabled>
                      <span>Universal Concept</span>
                    </a-menu-item>
                    <a-menu-item @click="toggleConceptType(name)" v-for="(name,index) in conceptList" :key="index">
                      <span>{{ name }}</span>
                    </a-menu-item>
                  </a-menu>
                  <a-button
                    style="padding: 0 10px;
                  display:flex; align-items:center ;
                  border-color: #f3f3f3;
                  box-shadow: none;
                  height: 35px;border-radius: 2px;background: #f3f3f3;font-size:13px;
                  font-family: Inter-Bold;color: #182552;">
                    <span v-if="currentConceptTypeLabel">{{ currentConceptTypeLabel }}</span> <span v-else>Universal Concept</span>
                    <a-icon type="caret-down" /> </a-button>
                </a-dropdown>

                <a-dropdown class="filter-dropdown-item">
                  <a-menu slot="overlay">
                    <a-menu-item @click="toggleSAType(1, 'SA')">
                      <span>SA</span>
                    </a-menu-item>
                    <a-menu-item @click="toggleSAType(2, 'FA')">
                      <span>FA</span>
                    </a-menu-item>
                  </a-menu>
                  <a-button
                    style="padding: 0 10px;
                  display:flex; align-items:center ;
                  border-color: #f3f3f3;
                  box-shadow: none;
                  height: 35px;border-radius: 2px;background: #f3f3f3;font-size:13px;
                  font-family: Inter-Bold;color: #182552;">
                    <span>{{ currentSaFaLabel }}</span>
                    <a-icon type="caret-down" /> </a-button>
                </a-dropdown>
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
import DirIcon from '@/components/LibraryV2/DirIcon'
import NoMoreResources from '@/components/Common/NoMoreResources'
import PuBuIcon from '@/assets/icons/library/pubu.svg?inline'
import ListModeIcon from '@/assets/icons/library/liebiao .svg?inline'
import FilterIcon from '@/assets/svgIcon/library/shaixuan.svg?inline'
import SearchIcon from '@/assets/svgIcon/library/sousuo.svg?inline'
import DataCardView from '@/components/LibraryV2/DataCardView'
import { typeMap } from '@/const/teacher'
import { QueryBigIdea, QueryTagsBySubjectIds } from '@/api/scenario'
import { SubjectTree } from '@/api/subject'
import SousuoIconSvg from '@/assets/icons/header/sousuo.svg?inline'
import { TagType } from '@/const/common'
const { ScenarioGetKeywordScenarios, QueryContentByBigIdea } = require('@/api/scenario')
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
    FilterIcon,
    SearchIcon,
    DataCardView,
    SousuoIconSvg
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
      sdgListLoading: false,
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
      dataListMode: 'card',

      bigIdeaList: [],
      currentBigIdea: null,
      bigIdeaLoading: false,

      currentTypeLabel: 'Choose type(s)of content',
      currentType: 0,
      selectedSubect: [],
      subjectList: [],

      keywordSearchText: '',
      currentConceptTypeLabel: 'Universal Concept',
      currentConceptType: 0,
      conceptList: [],
      selectedConcept: undefined,

      currentSaFaLabel: 'SA|FA',
      currentSaFaType: 0
    }
  },
  created () {
    // sdg数据结构：sdg列表-keywords-big idea
    this.$logger.info('SdgBrowser blockWidth:' + this.blockWidth)
    this.getAllSdgs()
    this.getSubjectTree()
  },
  methods: {
    getAllSdgs () {
      this.sdgListLoading = true
      GetAllSdgs().then(response => {
          this.$logger.info('GetAllSdgs response', response.result)
          this.sdgList = response.result
      }).finally(() => {
        this.sdgListLoading = false
      })
    },
    getSubjectTree () {
      SubjectTree({ curriculumId: this.$store.getters.bindCurriculum }).then(response => {
        this.$logger.info('getSubjectTree response', response.result)
        this.subjectTree = response.result
        this.subjectTree.forEach(item => {
          this.subjectList.push(item)
        })
      }).finally(() => {
      })
    },
    handleSelectSdgItem (sdgItem) {
      this.$logger.info('handleSelectSdgItem ', sdgItem, this.currentSdgId)
      if (sdgItem.id !== this.currentSdgId) {
        this.currentSdgId = sdgItem.id
        this.sdgKeywordNameList = []
        this.currentSdgKeywordName = null
        this.queryBigIdea()
        this.queryTagsBySubjectIds()
        this.handleClickBlock(2, sdgItem.name)
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

    queryBigIdeaDescription (descriptionItem) {
      this.$logger.info('queryBigIdeaDescription', descriptionItem)
      this.dataListLoading = true
      this.handleClickBlock(3, descriptionItem.name)
      this.currentSdgKeywordScenarioId = descriptionItem.id
      this.currentSdgKeywordScenario = 'description'
      QueryBigIdea({ description: descriptionItem.name }).then(response => {
        this.$logger.info('queryBigIdeaDescription response', response.result)
        const list = []
        response.result.forEach(bigIdea => {
          list.push({
            id: bigIdea,
            name: bigIdea
          })
        })
        this.bigIdeaList = list
      }).finally(() => {
        this.dataListLoading = false
      })
    },

    queryBigIdea () {
      this.bigIdeaLoading = true
      this.$logger.info('queryBigIdeaKeyword')
      QueryBigIdea({ keywords: this.currentSdgKeywordName, 'sdgId': this.currentSdgId, 'subjectIds': this.selectedSubect }).then(response => {
        this.$logger.info('queryBigIdeaKeyword response', response.result)
        const list = []
        response.result.forEach(bigIdea => {
          list.push({
            id: bigIdea,
            name: bigIdea
          })
        })
        this.bigIdeaList = list
      }).finally(() => {
        this.bigIdeaLoading = false
      })
    },
    queryTagsBySubjectIds () {
      this.$logger.info('queryTagsBySubjectIds')
      QueryTagsBySubjectIds({ 'subjectIds': this.selectedSubect }).then(response => {
        this.$logger.info('queryTagsBySubjectIds response', response.result)
        if (response.success) {
          this.conceptList = response.result['Universal Concept']
          this.sdgKeywordNameList = response.result['Key words']
        }
      }).finally(() => {
      })
    },
    queryBigIdeaKeywords (keywordsItem) {
      this.$logger.info('queryBigIdeaKeyword', keywordsItem)
      this.dataListLoading = true
      this.handleClickBlock(3, keywordsItem.name)
      this.currentSdgKeywordScenarioId = keywordsItem.id
      this.currentSdgKeywordScenario = 'keyword'
      QueryBigIdea({ keywords: keywordsItem.name }).then(response => {
        this.$logger.info('queryBigIdeaKeyword response', response.result)
        const list = []
        response.result.forEach(bigIdea => {
          list.push({
            id: bigIdea,
            name: bigIdea
          })
        })
        this.bigIdeaList = list
      }).finally(() => {
        this.dataListLoading = false
      })
    },

    handleSelectBigIdeaItem (bigIdeaItem) {
      this.$logger.info('handleSelectBigIdeaItem', bigIdeaItem)
      this.currentBigIdea = bigIdeaItem.name
      QueryContentByBigIdea({
        bigIdea: bigIdeaItem.name
      }).then((response) => {
        this.$logger.info('QueryContentByBigIdea', response)
        if (response.result) {
          this.dataList = response.result
          this.$emit('update-data-list', this.dataList)
        } else {
          this.$logger.info('no big idea content')
        }
      })
      this.handleClickBlock(2, bigIdeaItem.name)
    },

    handleSelectDataItem (dataItem) {
      this.$logger.info('handleSelectDataItem ', dataItem)
      this.currentDataId = dataItem.id
      this.$emit('previewDetail', dataItem)
    },

    handleClickBlock (blockIndex, path) {
      this.$logger.info('handleClickBlock ' + blockIndex)
      this.$emit('clickBlock', {
        curriculumId: this.curriculumId,
        gradeId: null,
        subjectId: null,
        knowledgeId: null,
        bigIdea: this.currentBigIdea,
        tagType: TagType.bigIdea
      })
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
    },

    toggleConceptType (label) {
      this.$logger.info('toggleConceptType ', label)
      this.currentConceptType = label
      this.currentConceptTypeLabel = label
    },

    toggleSAType (type, label) {
      this.$logger.info('toggleSAType ' + type + ' label ' + label)
      this.currentSaFaType = type
      this.currentSaFaLabel = label
    },
    changeSubject () {
      this.queryTagsBySubjectIds()
      this.queryBigIdea()
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
        padding: 10px 15px 10px 10px;
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
        min-height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
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
      background: rgba(228, 228, 228, 0.2);

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
            display: flex;
            align-items: center;
            flex-direction: row;
            .filter-icon {
              margin-right: 10px;
              svg {
                height: 20px;
              }
            }

            .content-filter-list {
              display: flex;
              align-items: center;
              flex-direction: row;
              flex-wrap: wrap;
              .filter-dropdown-item {
                margin-right: 10px;
                margin-bottom: 5px;
              }
            }
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

      .library-select {

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
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
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
      .loading-wrapper {
        min-height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
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

.filter-block{
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 15px 15px 15px;

  .filter-block-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid #ddd;
    opacity: 1;
    border-radius: 4px;
    width: 100%;
    padding: 5px 10px;
    .filter-icon {
      margin-right: 5px;
      svg {
        height: 20px;
      }
    }
    .filter-list {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
      justify-content: space-between;
    }
    .filter-select{
      cursor: pointer;
      margin: 5px;
      min-width: 180px;
      /deep/ .ant-select-selection--multiple{
        cursor: pointer;
      }
    }
  }
}

.library-filter-select {
  background: #F3F3F3;
}

.keyword-search {
  margin: 5px;
  .my-nav-search {

    svg {
      fill: rgba(188, 188, 188, 1);
    }
    input {

    }
  }
}

.sa-fa {
  cursor: pointer;
  padding: 3px 15px;
  background: #F5F5F5;
  border: 1px solid #BCBCBC;
  opacity: 1;
  font-size: 13px;
  font-family: Inter-Bold;
  color: #182552;
  margin-left: 10px;
  border-radius: 3px;
}

.sa-active {
  color: #fff;
  background-color: #07AB84;
}
</style>
