<template>
  <div class='learning-objective'>
    <div class='half-body-content'>
      <div class='cc-lo-header'>
        <div class='filter-line'>
          <div class='select-item'>
            <div class='required-dot vertical-center'>*</div>
            <a-select
              :getPopupContainer="trigger => trigger.parentElement"
              placeholder='Curriculum'
              @select='handleSelectCurriculum'
              :disabled='!canEdit'
              :value='filterConfig.curriculumId'
              class='cc-select cc-lo-select-mid'>
              <a-select-option :value='item.id' v-for='(item, index) in curriculumOptions' :key='index'>
                {{ item.name }}
              </a-select-option>
            </a-select>
            <div class='selected-label' v-if='selectedCurriculumName'>
              <div class='selected-label-item'>
                <a-tag :closable='canEdit' class='label-curriculum' @close="canEdit ? handleResetCurriculum(selectedCurriculumName) : null">
                  <div class='tag-content'>{{ selectedCurriculumName }}</div>
                </a-tag>
              </div>
            </div>
          </div>
          <div class='select-item'>
            <div class='required-dot vertical-center'>*</div>
            <a-select
              :getPopupContainer="trigger => trigger.parentElement"
              v-model='selectedYear'
              placeholder='Grade'
              :disabled='!canEdit'
              @select='handleSelectYear'
              class='cc-select cc-lo-select-small'>
              <a-select-option :value='year' v-for='year in yearOptions' :key='year'>
                {{ year }}
              </a-select-option>
            </a-select>
            <div class='selected-label' v-if='filterConfig.selectedYearList'>
              <div
                class='selected-label-item'
                v-for='year in filterConfig.selectedYearList'
                :key='year'>
                <a-tag :closable='canEdit' class='label-year' @close="canEdit ? handleRemoveYear(year) : null">
                  <div class='tag-content'>{{ year }}</div>
                </a-tag>
              </div>
            </div>
          </div>
          <div class='select-item'>
            <div class='required-dot vertical-center'>*</div>
            <a-select
              :getPopupContainer="trigger => trigger.parentElement"
              v-model='selectedSubject'
              placeholder='Subject'
              :disabled='!canEdit'
              @select='handleSelectSubject'
              class='cc-select cc-lo-select'>
              <a-select-option :value='subjectName' v-for='subjectName in subjectOptions' :key='subjectName'>
                {{ subjectName }}
              </a-select-option>
            </a-select>
            <div class='selected-label' v-if='filterConfig.selectedSubjectList'>
              <div
                class='selected-label-item'
                v-for='subjectName in filterConfig.selectedSubjectList'
                :key='subjectName'>
                <a-tag :closable='canEdit' class='label-subject' @close="canEdit ? handleRemoveSubject(subjectName) : null">
                  <div class='tag-content'>{{ subjectName }}</div>
                </a-tag>
              </div>
            </div>
          </div>
          <div class='select-item' v-show='selectedSubject && selectedSubject.toLowerCase().trim() === "languages"'>
            <a-select
              :getPopupContainer="trigger => trigger.parentElement"
              v-model='selectedLanguage'
              placeholder='Language'
              :disabled='!canEdit'
              @select='handleSelectLanguage'
              class='cc-select cc-lo-select-small'>
              <a-select-option :value='language' v-for='language in languageOptions' :key='language'>
                {{ language }}
              </a-select-option>
            </a-select>
            <div class='selected-label' v-if='filterConfig.selectedLanguageList'>
              <div
                class='selected-label-item'
                v-for='language in filterConfig.selectedLanguageList'
                :key='language'>
                <a-tag :closable='canEdit' class='label-language' @close="canEdit ? handleRemoveLanguage(language) : null">
                  <div class='tag-content'>{{ language }}</div>
                </a-tag>
              </div>
            </div>
          </div>
        </div>
        <div class='recommend-button'>
          <a-badge dot v-if='recommendDataList.length'>
            <custom-text-button label='Recommend' @click='canEdit ? showRecommend : null'>
              <template v-slot:icon>
                <a-icon type='plus-circle' />
              </template>
            </custom-text-button>
          </a-badge>
        </div>
      </div>
      <div class='cc-lo-content'>
        <div class='cc-lo-title'>
          <span class='required-dot vertical-center'>*</span>
          Subject Learning Objectives
        </div>
        <div class='cc-lo-input'>
          <a-input v-model='filterConfig.keyword' @click.native.stop='showFilterList = true' placeholder='Search learning objectives' class='cc-form-input' :disabled='!canEdit'/>
          <div class='filter-list' v-show='showFilterList && filterList.length' @click.stop=''>
            <div class='filter-item' v-for='(item, idx) in filterList' :key='idx' @click='canEdit ? handleSelectItem(item) : null'>
              <div class='item-desc' v-html='item.html'></div>
              <div class='item-subject-year'>
                <div class='item-sub-title' :title='item.path && item.path[0]'>{{ item.path && item.path[0] }}</div>
                <div class='item-sub-title' :title='item.path && item.path[yearIndex]'>{{ item.path && item.path[yearIndex] }}</div>
              </div>
            </div>
          </div>
          <div class='create-item' v-show='showFilterList && !filterList.length && filterConfig.keyword.trim().length'>
            <a-button type='primary' size="small" @click='canEdit ? handleEnsureInput : null'><a-icon type='plus' /> Create</a-button>
          </div>
        </div>
      </div>
    </div>
    <div class='full-body-content'>
      <div class='cc-lo-list'>
        <div v-for='(item) in selectedList' :key='item.id' class='cc-lo-item'>
          <div class='cc-left-lo'>
            <div class="item-desc-wrapper">
              <div class='item-desc' v-selectPopover="['modal', domFn, item, true]">
                {{ item.desc }}
              </div>
              <div class='item-subject-year'>
                <div class='item-sub-title' :title='item.path && item.path[0]'>{{ item.path && item.path[0] }}</div>
                <div class='item-sub-title' :title='item.path && item.path[yearIndex]'>{{ item.path && item.path[yearIndex] }}</div>
              </div>

              <div class='delete-wrapper' v-if='canEdit'>
                <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDelete(item)" cancel-text="No">
                  <delete-icon color='#F16A39' />
                </a-popconfirm>
              </div>
            </div>
            <div class="item-bloom-wrapper">
              <div class="bloom-wrapper">
                <label for="">Bloom's Taxonomy:</label>
                <rate-level @change="val => handleChangeLevel(val, item)" :bloom="item.bloomTag || ''"/>
              </div>
              <div class="bloom-wrapper">
                <label for="">Knowledge Dimensions:</label>
                <rate-level @change="val => handleChangeLevel(val, item)" :knowledge="item.knowledgeDimension || ''" />
              </div>
            </div>
            <div class="item-command-wrapper" v-if="item.commandTerms && item.commandTerms.length > 0">
              <label for="">Command Term:</label>
              <div class="wrapper-list">
                <div
                  class='wrapper-list-item'
                  v-for='(terms, termIndex) in item.commandTerms'
                  :key='terms.name'>
                  <a-tag :closable='canEdit' class='command-tag' @close="e => handleCloseObjectiveTag(item, 'commandTerms', termIndex)">
                    <div class='tag-content'>{{ terms.name }}</div>
                  </a-tag>
                </div>
              </div>
            </div>
            <div class="item-command-wrapper" v-if="item.knowledgeTags && item.knowledgeTags.length > 0">
              <label for="">Knowledge tag:</label>
              <div class="wrapper-list">
                <div
                  class='wrapper-list-item'
                  v-for='(terms, termIndex) in item.knowledgeTags'
                  :key='terms.name'>
                  <a-tag :closable='canEdit' class='command-tag knowledge' @close="e => handleCloseObjectiveTag(item, 'knowledgeTags', termIndex)" >
                    <div class='tag-content'>{{ terms.name }}</div>
                  </a-tag>
                </div>
              </div>
            </div>
          </div>
          <div class='cc-right-general-capabilities'>
            <!--            <div class='cc-right-general-capabilities-title'>-->
            <!--              <custom-text-button label='Select 21st century skills'>-->
            <!--                <template v-slot:icon>-->
            <!--                  <a-icon type='plus-circle' />-->
            <!--                </template>-->
            <!--                <template v-slot:badge>-->
            <!--                  <a-tooltip-->
            <!--                    title="The 21st century skills you selected will be marked according to the subject strands' grading standards and presented on students' report">-->
            <!--                    <a-icon type="question-circle" theme="filled" :style="{ fontSize: '16px', color: '#EB5062' }"/>-->
            <!--                  </a-tooltip>-->
            <!--                </template>-->
            <!--              </custom-text-button>-->
            <!--              <a-cascader :options="generalCapabilitiesData" @change="handleSelectGeneralCapability(item, arguments)" class='cc-gc-cascader' />-->
            <!--            </div>-->
            <!--            <div class='cc-right-general-capabilities-content'>-->
            <!--              <div class='capability-item' v-for='(capability, sIdx) in item.generalCapabilities' :key='sIdx'>-->
            <!--                <div class='capability-item-tag'>-->
            <!--                  <div class='tag-icon'>-->
            <!--                    <a-icon type="tag" />-->
            <!--                  </div>-->
            <!--                  <div class='item-tag-name' v-for='(path, pIdx) in capability.path' :key='path' :title='path'>-->
            <!--                    <template v-if='pIdx < capability.path.length && pIdx > 0'> / </template>-->
            <!--                    {{ path }}-->
            <!--                  </div>-->
            <!--                </div>-->
            <!--                <div class='capability-item-content'>-->
            <!--                  {{ capability.desc }}-->
            <!--                  <div class='delete-wrapper'>-->
            <!--                    <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteCapability(item, capability)" cancel-text="No">-->
            <!--                      <delete-icon color='#F16A39' />-->
            <!--                    </a-popconfirm>-->
            <!--                  </div>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </div>
      </div>
    </div>

    <recommend-data
      :recommend-data-list='recommendDataList'
      @close='recommendDataVisible = false'
      @confirm='handleConfirmSelectRecommend'
      v-if='recommendDataVisible && recommendDataList.length' />

    <div v-clickOutside id="modal" ref="quickModal" v-show="false">
      <div class="quick-keyword-con" >
        <a-space>
          <label>Set</label>
          <quick-word-button
            type="black"
            text="Command term"
            @sub="res => handleQuickWordSet(res, 'commandTerms')"
            :quickWord="quickWord"
            :loadApi="termsSearch"
            :cacheApi="termsPubList"
            :recommends="termRecommend"
            @close="hideQuickWord"
            cacheKey="TERMS_PUBLIST"
            @changeWord="res => this.commandTermForm.name = res"
          >
            <template v-slot:create>
              <div class="quick-word-sub">
                <template v-if="commandTermForm.name">
                  <a-divider style="margin: 10px 0;"/>
                  <a-space v-show="!showQuickWordCreate" >
                    <label>Create:</label>
                    <a-button size="small" type="primary" v-show="!showQuickWordCreate" @click="createCommandTerm"> {{ commandTermForm.name || 'Command term' }} </a-button>
                  </a-space>
                </template>
                <!-- <a-divider style="margin: 5px 0;font-size: 14px;">Create</a-divider>
                <a-button size="small" type="primary" v-show="!showQuickWordCreate" @click="showQuickWordCreate = true"> Do Create </a-button> -->
                <!-- <command-term-add
                  v-show="showQuickWordCreate"
                  :customTags="{}"
                  :initName="commandTermForm.name"
                  @cancel="showQuickWordCreate = false"
                  @save="handleSaveCommanTerm"
                /> -->
              </div>
            </template>
          </quick-word-button>
          <label> or </label>
          <quick-word-button
            type="black"
            text="Knowledge tag"
            @sub="res => handleQuickWordSet(res, 'knowledgeTags')"
            :quickWord="quickWord"
            :loadApi="dimensionsSearch"
            :cacheApi="dimensionsPubList"
            :recommends="knowledgeRecommend"
            @close="hideQuickWord"
            cacheKey="DIMENSIONS_PUBLIST"
          >
            <template v-slot:create>
              <div class="quick-word-sub">
                <template v-if="commandTermForm.name">
                  <a-divider style="margin: 10px 0;"/>
                  <a-space v-show="!showQuickWordCreate" >
                    <label>Create:</label>
                    <a-button size="small" type="primary" v-show="!showQuickWordCreate" @click="createDimension"> {{ commandTermForm.name || 'Knowledge Tags' }} </a-button>
                  </a-space>
                </template>
              </div>
            </template>
          </quick-word-button>
        </a-space>
        <!-- <div class="recommend-con" v-if="termRecommend.length > 0 || knowledgeRecommend.length > 0">
          <label for="">Recommended</label>
          <div class="recommend-tag">
            <div
              class='wrapper-list-item'
              v-for='(terms, termIndex) in termRecommend'
              :key='termIndex'>
              <a-tag class='command-tag' @click="handleAddRecommend(terms, 'commandTerms')">
                <div class='tag-content'>{{ terms }}</div>
              </a-tag>
            </div>
            <div
              class='wrapper-list-item'
              v-for='(terms, termIndex) in knowledgeRecommend'
              :key='termIndex'>
              <a-tag class='command-tag knowledge' @click="handleAddRecommend(terms, 'knowledgeTags')">
                <div class='tag-content'>{{ terms }}</div>
              </a-tag>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>

import { CurriculumSearch, GeneralCapabilitiesFormat } from '@/components/LearningObjective/CurriculumDataUtils'
import CustomTextButton from '@/components/Common/CustomTextButton'
import { getAllCurriculums } from '@/api/preference'
import { KnowledgeTermTagQueryByKeywords } from '@/api/knowledgeTermTag'
import { termsSearch, dimensionsSearch, dimensionsPubList, termsPubList, termsCreate, dimensionsCreate } from '@/api/v2/tagsTerm'
import { getRecommend, addToSetTerms, incBloom } from '@/api/v2/statsTarget'
import { GetDictItems } from '@/api/common'
import DeleteIcon from '@/components/Common/DeleteIcon'
import { debounce } from 'lodash-es'
import RecommendData from '@/components/LearningObjective/RecommendData'
import RateLevel from '@/components/RateLevel'
import CommandTermAdd from '@/components/CommandTerm/CommandTermAdd.vue'
import QuickWordButton from '@/components/Button/QuickWordButton'
import { DICT_BLOOM_TAXONOMY, DICT_KNOWLEDGE_DIMENSION, USER_MODE } from '@/const/common'
import { GetAuCurriculum, GetNzCurriculum } from '@/api/v2/curriculumn'
import { mapState } from 'vuex'

export default {
  name: 'LearningObjective',
  components: {
    RecommendData,
    DeleteIcon,
    CustomTextButton,
    RateLevel,
    CommandTermAdd,
    QuickWordButton
  },
  props: {
    curriculumId: {
      type: String,
      default: null
    },
    subjectList: {
      type: Array,
      default: () => []
    },
    yearList: {
      type: Array,
      default: () => []
    },
    learningObjectives: {
      type: Array,
      default: () => []
    },
    languageList: {
      type: Array,
      default: () => []
    },
    recommendDataList: {
      type: Array,
      default: () => []
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      data: null,
      yearIndex: null,
      curriculumOptions: [],
      subjectOptions: [],
      yearOptions: [],

      languageOptions: [
        'Arabic', 'Auslan', 'Chinese', 'French', 'German', 'Hindi', 'Indonesian', 'Italian', 'Japanese', 'Korean', 'Modern Greek', 'Spanish', 'Turkish', 'Vietnamese', 'English as second language', 'Urdu', 'Malay', 'Maori'
      ],

      selectedSubject: null,
      selectedYear: null,
      selectedLanguage: null,

      filterConfig: {
        curriculumId: null,
        selectedSubjectList: [],
        selectedYearList: [],
        selectedLanguageList: [],
        keyword: ''
      },

      showFilterList: false,
      filterList: [],

      selectedList: [],
      asyncUpdateFilterListFn: null,
      asyncEmitUpdateEventFn: null,
      recommendDataVisible: false,

      KnowledgeTermTagQueryByKeywords: KnowledgeTermTagQueryByKeywords,
      termsSearch: termsSearch,
      dimensionsSearch: dimensionsSearch,
      dimensionsPubList: dimensionsPubList,
      termsPubList: termsPubList,
      quickWord: '',
      commandTerms: [],
      knowledgeTags: [],
      showQuickWordCreate: false,
      loading: true,
      currentObjective: null,
      commandTermForm: {
        name: ''
      },
      termRecommend: [],
      knowledgeRecommend: [],
      bloomTagLevel: [],
      knowledgeDimensionLevel: [],

      cachedCurriculum: {}
    }
  },
  watch: {
    'filterConfig.curriculumId': {
      immediate: true,
      async handler(curriculumId) {
        console.log('filterConfig.curriculumId changed', this.loading)
        if (!this.loading) {
          if (curriculumId) {
            const id = parseInt(curriculumId)
            if (id === 1) {
              if (!this.cachedCurriculum['au']) {
                this.$set(this.cachedCurriculum, 'au', await GetAuCurriculum())
              }
              this.data = this.cachedCurriculum['au']
              this.subjectOptions = this.data['__subject']
              this.yearOptions = this.data['__years']
              this.yearIndex = this.data['__year']
            } else if (id === 2) {
              if (!this.cachedCurriculum['nz']) {
                this.$set(this.cachedCurriculum, 'nz', await GetNzCurriculum())
              }
              this.data = this.cachedCurriculum['nz']
              this.subjectOptions = this.data['__subject']
              this.yearOptions = this.data['__years']
              this.yearIndex = this.data['Learning outcomes']['__year']
            } else {
              this.$logger.warn('No curriculum data.')
            }

            this.$logger.info('update data', this.data)
          } else {
            this.data = null
            this.yearOptions = []
            this.subjectOptions = []
            this.yearIndex = null
            this.$logger.info('reset data', this.data)
          }
          this.$logger.info('reset filterConfig data', this.data)
          this.filterConfig.selectedSubjectList = []
          this.filterConfig.selectedYearList = []
          this.filterConfig.selectedLanguageList = []
          this.filterConfig.keyword = ''
        }
      }
    },
    filterConfig: {
      deep: true,
      immediate: false,
      handler(nv, ov) {
        if (!this.loading) {
          console.log('filterConfig changed loading', this.loading, nv, ov)
          this.asyncUpdateFilterListFn()
        }
      }
    },
    selectedList: {
      deep: true,
      immediate: false,
      handler() {
        console.log('selectedList changed loading', this.loading)
        if (!this.loading) {
          this.asyncEmitUpdateEventFn()
        }
      }
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode
    }),
    selectedCurriculumName () {
      return this.curriculumOptions.find(item => item.id === this.filterConfig.curriculumId)?.name
    },
    generalCapabilitiesData () {
      if (this.data) {
        return GeneralCapabilitiesFormat(this.data['General capabilities'])
      }
      return []
    }
  },
  created() {
    this.loading = true
    this.$logger.info('LearningObjective subjectList', this.subjectList, 'yearList', this.yearList, 'languageList', this.languageList, 'learningObjectives', this.learningObjectives)
    this.asyncEmitUpdateEventFn = debounce(this.emitUpdateEvent, 1000)
    this.asyncUpdateFilterListFn = debounce(this.updateFilterList, 1000)
    if (this.curriculumId) {
      this.filterConfig.curriculumId = this.curriculumId
    }

    if (Array.isArray(this.subjectList) && this.subjectList.length > 0) {
      this.filterConfig.selectedSubjectList = this.subjectList
      this.selectedSubject = this.filterConfig.selectedSubjectList[0]
    }

    if (Array.isArray(this.yearList) && this.yearList.length > 0) {
      this.filterConfig.selectedYearList = this.yearList
      this.selectedYear = this.filterConfig.selectedYearList[0]
    }

    if (Array.isArray(this.languageList) && this.languageList.length > 0) {
      this.filterConfig.selectedLanguageList = this.languageList
      this.selectedLanguage = this.filterConfig.selectedLanguageList[0]
    }

    if (Array.isArray(this.learningObjectives) && this.learningObjectives.length > 0) {
      this.selectedList = this.learningObjectives
    }

    this.initData()
    this.initDict()
  },
  mounted() {
    this.globalClick(this.handleClick)
  },
  methods: {
    initData() {
      getAllCurriculums().then((response) => {
        this.$logger.info('getAllCurriculums', response)
        let list = response.result
        if (this.userMode === USER_MODE.SCHOOL) {
          list = this.$store.getters.bindCurriculum ? list.filter(item => item.id === this.$store.getters.bindCurriculum) : []
        }
        this.$logger.info('filter ib ibAuth', this.$store.state.classcipeConfig.ibAuth)
        if (!this.$store.state.classcipeConfig.ibAuth) {
          this.$logger.info('bf filter ib', list)
          list = list.filter(item => item.name.indexOf('IB') === -1)
          this.$logger.info('filter ib', list)
        }
        this.curriculumOptions = list
        this.filterConfig.curriculumId = this.curriculumOptions[0].id
        this.$logger.info('getAllCurriculums', this.curriculumOptions, list)
      }).finally(() => {
        this.$logger.info('LearningObjective init done', this.filterConfig)
        this.loading = false
      })
    },

    handleResetCurriculum () {
      this.filterConfig.curriculumId = null
    },

    handleSelectCurriculum (id) {
      this.$logger.info('handleSelectCurriculum id', id)
      this.filterConfig.curriculumId = id
      const curriculum = this.curriculumOptions.find(item => item.id === id)
      this.$logger.info('handleSelectCurriculum curriculum', curriculum)
    },

    handleRemoveSubject (subject) {
      this.filterConfig.selectedSubjectList.splice(this.filterConfig.selectedSubjectList.indexOf(subject), 1)
      if (this.filterConfig.selectedSubjectList.indexOf('Languages') !== -1) {
        this.selectedSubject = 'Languages'
      } else {
        this.selectedSubject = this.filterConfig.selectedSubjectList.length ? this.filterConfig.selectedSubjectList[0] : ''
      }
    },

    handleRemoveYear (year) {
      this.filterConfig.selectedYearList.splice(this.filterConfig.selectedYearList.indexOf(year), 1)
    },

    showRecommend () {
      this.$logger.info('showRecommend', this.recommendDataList)
      this.recommendDataVisible = true
    },

    handleSelectSubject (subject) {
      this.$logger.info('handleSelectSubject', subject)
      if (this.filterConfig.selectedSubjectList.indexOf(subject) === -1) {
        this.filterConfig.selectedSubjectList.unshift(subject)
      }
    },

    handleSelectYear (year) {
      this.$logger.info('handleSelectYear', year)
      if (this.filterConfig.selectedYearList.indexOf(year) === -1) {
        this.filterConfig.selectedYearList.unshift(year)
      }
      this.selectedYear = null
    },

    handleSelectLanguage (language) {
      this.$logger.info('handleSelectLanguage', language)
      this.filterConfig.selectedLanguageList = [ language ]
      this.selectedLanguage = null
    },

    handleRemoveLanguage (language) {
      this.filterConfig.selectedLanguageList.splice(this.filterConfig.selectedLanguageList.indexOf(language), 1)
    },

    handleSelectItem (item) {
      this.$logger.info('handleSelectItem', item)
      if (this.selectedList.indexOf(item) === -1) {
        this.$set(item, 'generalCapabilities', [])
        this.$set(item, 'bloomTag', '')
        this.$set(item, 'knowledgeDimension', '')
        this.selectedList.unshift(item)
      }
      this.filterConfig.keyword = ''
      this.showFilterList = false
    },

    handleDelete (item) {
      this.$logger.info('handleDelete', item)
      if (this.selectedList.indexOf(item) !== -1) {
        this.selectedList.splice(this.selectedList.indexOf(item), 1)
      }
    },

    handleClick () {
      this.showFilterList = false
    },

    handleEnsureInput () {
      if (this.filterConfig.keyword) {
        this.handleSelectItem({
          desc: this.filterConfig.keyword
        })
        this.filterConfig.keyword = ''
      }
    },

    handleSelectGeneralCapability (item) {
      this.$logger.info('handleSelectGeneralCapability', arguments[1])
      const generalCapabilityList = JSON.parse(JSON.stringify(arguments[1][0]))
      const lastIndex = generalCapabilityList.length - 1
      const generalCapability = {
        desc: generalCapabilityList[lastIndex],
        path: generalCapabilityList.slice(-3, -1),
        id: arguments[1][1][lastIndex].id
      }
      item.generalCapabilities.push(generalCapability)
      this.$logger.info('current lo item', item)
    },

    handleDeleteCapability (item, capability) {
      this.$logger.info('handleDeleteCapability', capability)
      const index = item.generalCapabilities.indexOf(capability)
      if (index !== -1) {
        item.generalCapabilities.splice(index, 1)
      }
    },

    emitUpdateEvent () {
      const eventData = {
        ...this.filterConfig,
        learnOuts: this.selectedList
      }
      this.$logger.info(`emitUpdateEvent eventData loading: ${this.loading}`, eventData)
      this.$emit('change', eventData)
    },

    updateFilterList () {
      console.log('updateFilterList', this.data)
      if (this.data) {
        console.log('updateFilterList', this.data, 'filterConfig.curriculumId', this.filterConfig.curriculumId)
        const list = this.data['Learning outcomes'] ? this.data['Learning outcomes'] : this.data
        const filterList = CurriculumSearch(list, this.filterConfig.selectedSubjectList, this.filterConfig.selectedYearList, this.filterConfig.keyword)
        filterList.forEach(item => {
          // 高亮命中单词
          if (item.desc && this.filterConfig.keyword.trim() && item.desc.toLowerCase().includes(this.filterConfig.keyword.trim().toLowerCase())) {
            const keyword = this.filterConfig.keyword.trim().toLowerCase()
            let html = ''
            const desc = item.desc
            const lowCaseDesc = item.desc.toLowerCase()
            let lastIndex = 0
            let index = 0
            while ((index = lowCaseDesc.indexOf(keyword, lastIndex)) !== -1) {
              html += desc.slice(lastIndex, index) + '<em>' + desc.substr(index, keyword.length) + '</em>'
              lastIndex = index + keyword.length
            }
            html += desc.slice(lastIndex)
            item.html = html
          } else {
            item.html = item.desc
          }
        })
        this.filterList = filterList
      }
    },

    handleConfirmSelectRecommend (dataList) {
      this.$logger.info('handleConfirmSelectRecommend', dataList)
      if (dataList && dataList.length) {
        dataList.forEach(item => {
          this.selectedList.unshift(JSON.parse(JSON.stringify(item)))
        })
      }
      this.recommendDataVisible = false
    },

    initDict() {
      Promise.all([
        GetDictItems(DICT_BLOOM_TAXONOMY),
        GetDictItems(DICT_KNOWLEDGE_DIMENSION)
      ]).then(([bloomRes, knowledgeRes]) => {
        if (bloomRes.success) {
          this.bloomTagLevel = bloomRes.result
        }
        if (knowledgeRes.success) {
          this.knowledgeDimensionLevel = knowledgeRes.result
        }
      })
    },

    handleChangeLevel(val, tag) {
      console.log(val, tag)
      if (this.canEdit) {
        if (val) {
          const origin = tag[val.type]
          const originLevel = this.getLevel(val.type, origin)
          tag[val.type] = val.title
          this.$set(tag, val.type, val.title)
          this.$forceUpdate()
          // 上报
          if (tag.id) {
            const currentLevel = this.getLevel(val.type, val.title)
            const params = {
              [`bloom.${currentLevel - 1}`]: 1
            }
            if (originLevel > 0) {
              params[`bloom.${originLevel - 1}`] = -1
            }
            console.log(params)
            incBloom(tag.id, params)
          }
        }
      }
    },

    getLevel(type, title) {
      const levelObj = this[type + 'Level'].find(bloom => bloom.text === title)
      return levelObj ? parseInt(levelObj.value) : 0
    },

    domFn(key, currentChoose) {
      console.log(currentChoose)
      this.currentObjective = { ...currentChoose }
      console.log(this.currentObjective)
      this.quickWord = key ? key.split(' ')[0] : ''
      this.commandTermForm.name = this.quickWord
      this.showQuickWordCreate = false
      // 获取联想
      if (currentChoose.id) {
        getRecommend(currentChoose.id).then(res => {
          this.termRecommend = res.terms
          this.knowledgeRecommend = res.tags
        })
      }
      // KnowledgeTermTagQueryByKeywords({
      //   keywords: this.quickWord
      // }).then(res => {
      //   if (res.success) {
      //     this.commandTerms = res.result.filter(item => item.type === 1)
      //     this.knowledgeTags = res.result.filter(item => item.type === 2)
      //   }
      // })
    },

    handleCloseObjectiveTag(item, key, tagIndex) {
      if (this.canEdit) {
        item[key].splice(tagIndex, 1)
        console.log(item)
        this.$forceUpdate()
      }
    },

    hideQuickWord() {
      this.$refs.quickModal.style.display = 'none'
    },

    handleQuickWordSet(res, key) {
      console.log(res)
      console.log(this.currentObjective)
      setTimeout(() => {
        this.$refs.quickModal.style.display = 'none'
      }, 200)
      const find = this.selectedList.find(item => {
        if (this.currentObjective.id) {
          return item.id === this.currentObjective.id
        } else {
          return item.desc === this.currentObjective.desc
        }
      })
      if (find) {
        if (find[key]) {
          if (!find[key].find(item => item.name === res.word)) {
            find[key].push({
              id: res.id,
              name: res.word
            })
          }
        } else {
          this.$set(find, key, [{
            id: res.id,
            name: res.word
          }])
          // 上报
          if (this.currentObjective.id) {
            const params = {}
            if (key === 'commandTerms') {
              params.terms = res.word
            }
            if (key === 'knowledgeTags') {
              params.tags = res.word
            }
            addToSetTerms(this.currentObjective.id, params)
          }
        }
      }
      this.quickWord = ''
      this.commandTermForm.name = ''
    },
    handleSaveCommanTerm(res, key = 'commandTerms') {
      console.log(res)
      this.handleQuickWordSet(res, key)
      this.showQuickWordCreate = false
    },
    handleAddRecommend(res, key = 'commandTerms') {
      this.handleSaveCommanTerm({
        word: res,
        id: res
      }, key)
    },
    createCommandTerm() {
      termsCreate({
        tag: this.commandTermForm.name || 'Command term'
      }).then(res => {
        this.handleSaveCommanTerm({
          word: res.tag,
          id: res._id
        })
      })
    },
    createDimension() {
      dimensionsCreate({
        tag: this.commandTermForm.name || 'Knowledge Tags'
      }).then(res => {
        this.handleSaveCommanTerm({
          word: res.tag,
          id: res._id
        }, 'knowledgeTags')
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.learning-objective {

  .half-body-content {
    width: 60%;
    min-width: 710px;
    .cc-lo-header {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;

      .filter-line {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
        .select-item {
          margin-right: 15px;

          .selected-label {
            margin-top: 15px;
            .selected-label-item {

              .tag-content {
                display: inline-block;
                max-width: 120px;
                text-overflow: ellipsis;
                word-break: break-word;
                user-select: none;
                overflow: hidden;
              }

              .ant-tag {
                margin-bottom: 15px;
              }

              .label-curriculum, .label-subject, .label-year, .label-language{
                max-width: 150px;
                border: none;
                cursor: pointer;
                padding: 0 10px;
                border-radius: 26px;
                line-height: 30px;
                font-family: Arial;
                font-weight: 400;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .label-curriculum {
                background: #C8F3FF;
                color: #255E77;
              }

              .label-subject {
                background: #E6E4FF;
                color: #4F58BD;
              }

              .label-year {
                background: #FFEDAF;
                color: #734110;
              }

              .label-language {
                background: #15C3A4;
                color: #ffffff;
              }
            }
          }
        }
      }

      .cc-lo-select {
        width: 100px;
      }

      .cc-lo-select-mid {
        width: 80px;
      }

      .cc-lo-select-small {
        width: 60px;
      }
    }

    .cc-lo-content {

      .cc-lo-title {
        font-size: 16px;
        font-family: Arial;
        font-weight: bold;
        color: #FF786D;
        line-height: 25px;
      }

      .cc-lo-input {
        margin-top: 5px;
        position: relative;

        .filter-list {
          background-color: #fff;
          position: absolute;
          z-index: 4000;
          left: 0;
          right: 0;
          top: 40px;
          max-height: 300px;
          overflow-y: auto;
          border-radius: 4px;
          box-shadow: 0 0 3px 3px #f1f1f1;

          .filter-item {
            color: rgb(4, 28, 68);
            padding: 10px 10px 10px 20px;
            cursor: pointer;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            &:hover {
              background-color: #14C39A12;
              color: #15C39A;
            }

            .item-desc {
              padding-right: 10px;
              cursor: pointer;
              user-select: none;
            }

            .item-subject-year {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-end;

              .item-sub-title {
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                white-space: nowrap;
                margin-right: 10px;
                font-weight: bold;
                cursor: pointer;
                user-select: none;
              }
            }
          }
        }

        .create-item {
          position: absolute;
          right: 5px;
          top: 4px;
        }
      }
    }
  }

  .full-body-content {
    .cc-lo-list {
      margin-top: 15px;
      z-index: 1;

      .cc-lo-item {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        align-items: flex-start;
        margin-bottom: 10px;
        .cc-left-lo {
          width: 75%;
          min-width: 710px;
          position: relative;
          display: flex;
          flex-direction: column;
          margin-bottom: 10px;
          .item-desc-wrapper {
            background: #FAFAFA;
            border: 1px solid #E1E6ED;
            position: relative;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            color: #313234;
            font-family: Arial;
            cursor: pointer;
            border-radius: 4px;
            padding: 10px 10px 10px 20px;
            font-weight: 400;
            .item-desc {
              padding-right: 10px;
            }

            .item-subject-year {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-end;

              .item-sub-title {
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-all;
                white-space: nowrap;
                margin-right: 10px;
                font-weight: bold;
                color: #111;
                cursor: pointer;
                user-select: none;
              }
            }
          }

          .item-bloom-wrapper {
            margin-top: 20px;
            display: flex;
            padding-left: 8px;
            .bloom-wrapper {
              font-size: 10px;
              font-family: Arial;
              font-weight: bold;
              color: #191A1C;
              margin-right: 50px;
              display: flex;
              align-items: center;
              label {
                margin-right: 5px;
              }
            }
          }

          .item-command-wrapper {
            display: flex;
            align-items: center;
            padding-left: 8px;
            margin-top: 24px;
            label {
              font-size: 10px;
              font-family: Arial;
              font-weight: bold;
              color: #191A1C;
              width: 100px;
            }
            .wrapper-list {
              margin-left: 10px;
              display: flex;
              flex-wrap: wrap;
              flex: 1;
              .wrapper-list-item {
                margin-bottom: 5px;

              }
            }
          }

          .delete-wrapper {
            position: absolute;
            right: -20px;
            width: 30px;
            top: 50%;
            margin-top: -10px;
            display: none;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
          }

          &:hover {
            .delete-wrapper {
              display: flex;
            }
          }
        }

        .cc-right-general-capabilities {
          width: 50%;
          padding-left: 30px;

          .cc-right-general-capabilities-title {
            width: 200px;
            position: relative;

            .cc-gc-cascader {
              position: absolute;
              left: 15px;
              top: 0;
              width: 170px;
              opacity: 0;
            }
          }

          .cc-right-general-capabilities-content {
            margin-top: 15px;
            .capability-item {
              margin-bottom: 15px;

              .capability-item-tag {
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                justify-content: flex-start;
                line-height: 25px;
                padding-bottom: 5px;
                cursor: pointer;
                font-weight: bold;
                color: #999;

                .item-tag-name {
                  padding: 0 5px;
                  overflow-x: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  word-break: break-all;
                }
              }

              .capability-item-content {
                background: #fff;
                position: relative;
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                flex-direction: row;
                align-items: center;
                justify-content: flex-start;
                padding: 10px 30px 10px 10px;
                position: relative;
                color: #000000;
                border: 1px solid #f1f1f1;
                box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.05);

                .delete-wrapper {
                  background-color: #fff;
                  position: absolute;
                  right: 0;
                  width: 30px;
                  top: 50%;
                  margin-top: -10px;
                  display: none;
                  flex-direction: row;
                  justify-content: center;
                  align-items: center;
                }

                &:hover {
                  .delete-wrapper {
                    display: flex;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.quick-keyword-con {
  border: 1px solid #dfdfdf;
  background: #fff;
  padding: 5px 10px;
  // width: 330px;
}
.recommend-con {
  position: relative;
  margin-top: 10px;
  & > label {
    font-weight: bold;
    margin-bottom: 5px;
  }
  .recommend-tag {
    display: flex;
    width: 300px;
    flex-wrap: wrap;
    .wrapper-list-item {
      margin-bottom: 5px;
      .command-tag {
        line-height: 25px;
      }
    }
  }

}

.command-tag {
  max-width: 150px;
  border: none;
  cursor: pointer;
  padding: 0 10px;
  border-radius: 26px;
  line-height: 30px;
  font-family: Arial;
  font-weight: 400;
  background: #06ACD7;
  display: flex;
  align-items: center;
  justify-content: center;
  .tag-content {
    display: inline-block;
    max-width: 120px;
    text-overflow: ellipsis;
    word-break: break-word;
    user-select: none;
    overflow: hidden;
    color: #fff;
  }
  /deep/ i {
    color: #fff
  }
  &.knowledge {
    background: #EABA7F;
  }
}

.required-dot {
  padding-right: 3px;
  font-weight: bold;
  font-size: 18px;
  color: #f5222d;
  vertical-align: middle;
  display: inline-flex;
}
</style>
