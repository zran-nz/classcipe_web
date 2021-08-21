<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-row class="unit-plan-header">
      <a-col span="12">
        <a-space>
          <a-button class="nav-back-btn" type="link" @click="goBack"> <a-icon type="left" /> {{ $t('teacher.add-unit-plan.back') }}</a-button>
          <span class="unit-last-change-time" v-if="lastChangeSavedTime">
            <span class="unit-nav-title">
              {{ form.name }}
            </span>
            <a-divider type="vertical" v-if="!!form.name" />
            {{ $t('teacher.add-unit-plan.last-change-saved-at-time', {time: lastChangeSavedTime}) }}
          </span>
        </a-space>
      </a-col>
      <a-col span="12" class="unit-right-action">
        <a-space>
          <a-button @click="handleSaveUnitPlan"> <a-icon type="save" /> {{ $t('teacher.add-unit-plan.save') }}</a-button>
          <a-button type="primary" @click="handlePublishUnitPlan"> <a-icon type="cloud-upload" /> {{ $t('teacher.add-unit-plan.publish') }}</a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-row class="unit-content" v-if="!contentLoading">
      <a-col span="3">
        <div class="unit-menu-list">
          <div class="unit-menu-title">
            {{ $t('teacher.add-unit-plan.unit-plan') }}
          </div>
          <div class="already-add-to-list">
            <div class="add-to-type">
              <div class="add-to-type-label">
                <content-type-icon :type="contentType.material"/>
                {{ $t('teacher.add-unit-plan.material') }}
                <template v-if="form.materials && form.materials.length">( {{ form.materials.length }} )</template>
              </div>
              <div class="add-to-list">
                <span v-for="(material,index) in form.materials" :key="index" class="add-to-item">
                  <router-link :to="'/teacher/unit-plan-material/' + unitPlanId + '/' + material.id">
                    <a-icon type="link" />
                    <span class="material-name">
                      <a-tooltip placement="top">
                        <template slot="title">
                          {{ material.name }}
                        </template>
                        {{ material.name }}
                      </a-tooltip>
                    </span>
                  </router-link>
                  <a-popconfirm :title="$t('teacher.my-content.action-delete') + '?'" ok-text="Yes" @confirm="handleDeleteMaterial(material)" cancel-text="No">
                    <a-icon type="delete" class="hover-delete" />
                  </a-popconfirm>
                </span>
              </div>
            </div>
            <div class="add-to-type">
              <div class="add-to-type-label">
                <content-type-icon :type="contentType.evaluation"/>
                {{ $t('teacher.add-unit-plan.evaluation') }}
              </div>
              <div class="add-to-list">
                <!--                <span v-for="(material,index) in form.materials" :key="index" class="add-to-item">-->
                <!--                  <router-link to="">-->
                <!--                    <a-icon type="link" />-->
                <!--                    {{ material.name }}-->
                <!--                  </router-link>-->
                <!--                </span>-->
              </div>
            </div>
            <div class="add-to-type">
              <div class="add-to-type-label">
                <content-type-icon :type="contentType.lesson"/>
                {{ $t('teacher.add-unit-plan.lesson') }}
              </div>
              <div class="add-to-list">
                <!--                <span v-for="(material,index) in form.materials" :key="index" class="add-to-item">-->
                <!--                  <router-link to="">-->
                <!--                    <a-icon type="link" />-->
                <!--                    {{ material.name }}-->
                <!--                  </router-link>-->
                <!--                </span>-->
              </div>
            </div>
          </div>
          <a-divider />
          <div class="unit-add-to">
            <a-dropdown>
              <a-button type="primary" block>
                <!--                <a-icon type="plus" />-->
                {{ $t('teacher.add-unit-plan.add-to-this-unit-plan') }} </a-button>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a @click="handleAddUnitPlanMaterial">
                    {{ $t('teacher.add-unit-plan.material') }}
                  </a>
                </a-menu-item>
                <a-menu-item>
                  {{ $t('teacher.add-unit-plan.evaluation') }}
                </a-menu-item>
                <a-menu-item>
                  {{ $t('teacher.add-unit-plan.lesson') }}
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
      </a-col>
      <a-col span="15" class="main-content">
        <a-card :bordered="false" :style="{ borderLeft: '1px solid rgb(235, 238, 240)', borderRight: '1px solid rgb(235, 238, 240)' }" :body-style="{padding: '16px'}">
          <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" >
            <div class="form-block">
              <!--              unit-name-->
              <a-form-model-item :label="$t('teacher.add-unit-plan.unit-name')">
                <a-input v-model="form.name" />
              </a-form-model-item>
              <!--              image-->
              <a-form-model-item :label="$t('teacher.add-unit-plan.image')">
                <a-upload-dragger
                  name="file"
                  accept="image/png, image/jpeg"
                  :showUploadList="false"
                  :customRequest="handleUploadImage"
                >
                  <template v-if="uploading">
                    <div class="upload-container">
                      <p class="ant-upload-drag-icon">
                        <a-icon type="cloud-upload" />
                      </p>
                      <p class="ant-upload-text">
                        <a-spin />
                        <span class="uploading-tips">{{ $t('teacher.add-unit-plan.uploading') }}</span>
                      </p>
                    </div>
                  </template>
                  <template v-if="!uploading && form && form.image">
                    <div class="image-preview">
                      <img :src="form.image" alt="">
                    </div>
                  </template>
                  <template v-if="!uploading && form && !form.image">
                    <div class="upload-container">
                      <p class="ant-upload-drag-icon">
                        <a-icon type="picture" />
                      </p>
                      <p class="ant-upload-text">
                        {{ $t('teacher.add-unit-plan.upload-a-picture') }}
                      </p>
                    </div>
                  </template>
                </a-upload-dragger>
              </a-form-model-item>
            </div>
            <!--            real-life-scenario-->
            <div class="form-block">
              <a-row>
                <a-col offset="2" span="20">
                  <div class="form-block-title">
                    <a-divider orientation="left">
                      {{ $t('teacher.add-unit-plan.real-life-scenario') }}
                    </a-divider>
                  </div>
                </a-col>
              </a-row>
              <!--description-->
              <a-form-model-item :label="$t('teacher.add-unit-plan.description')">
                <input-search
                  :default-value="form.scenario.description"
                  :search-list="descriptionSearchList"
                  label="description"
                  @search="handleDescriptionSearch"
                  @select-item="handleSelectScenario"
                  @reset="descriptionSearchList = []" />
              </a-form-model-item>
              <!--sdg and KeyWords-->
              <div class="content-blocks" v-for="(sdgItem, sdgIndex) in sdgDataObj" :key="sdgIndex" v-if="sdgItem !== null">
                <div class="sdg-delete-wrapper" @click="handleDeleteSdg(sdgItem, sdgIndex)" v-show="sdgTotal > 1">
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>{{ $t('teacher.add-unit-plan.delete-sdg') }}</span>
                    </template>
                    <div class="sdg-delete">
                      <a-icon type="delete" :style="{ fontSize: '20px' }" />
                    </div>
                  </a-tooltip>
                </div>
                <a-row>
                  <a-col offset="4" span="18">
                    <div class="form-block-title">
                      <a-divider dashed>SDG</a-divider>
                    </div>
                  </a-col>
                </a-row>
                <!--sdg-->
                <a-form-model-item :label="$t('teacher.add-unit-plan.sdg')">
                  <a-select v-model="sdgItem.sdgId" placeholder="please select sdg">
                    <a-select-option v-for="(sdg,index) in sdgList" :value="sdg.id" :key="index">
                      {{ sdg.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <!--keywords-->
                <a-form-model-item :label="$t('teacher.add-unit-plan.key-words')">
                  <sdg-tag-input :selected-keywords="sdgItem.selectedKeywords" :sdg-key="sdgIndex" @add-tag="handleAddSdgTag" @remove-tag="handleRemoveSdgTag"/>
                </a-form-model-item>
              </div>
              <!--add-new-sdg-->
              <a-row>
                <a-col offset="2" span="20">
                  <div class="form-block-title form-block-action">
                    <a-button type="link" icon="plus-circle" @click="handleAddMoreSdg">
                      {{ $t('teacher.add-unit-plan.add-new-sdg') }}
                    </a-button>
                  </div>
                </a-col>
              </a-row>
            </div>

            <div class="form-block">
              <a-row>
                <a-col offset="2" span="20">
                  <div class="form-block-title">
                    <a-divider orientation="left">
                      {{ $t('teacher.add-unit-plan.basics') }}
                    </a-divider>
                  </div>
                </a-col>

                <a-form-model-item :label="$t('teacher.add-unit-plan.subject-covered')">
                  <a-select v-model="form.subjects" @select="handleSelectSubject">
                    <a-select-option v-for="(subject,index) in subjectList" :value="subject.name" :key="index">
                      {{ subject.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>

                <a-form-model-item :label="$t('teacher.add-unit-plan.concepts')">
                  <a-select v-model="form.concepts" @select="handleSelectConcept" mode="multiple">
                    <a-select-option v-for="(concept,index) in conceptsList" :value="concept.name" :key="index">
                      {{ concept.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>

                <a-form-model-item :label="$t('teacher.add-unit-plan.direction-of-inquiry')">
                  <a-input v-model="form.inquiry" allow-clear />
                </a-form-model-item>
              </a-row>
            </div>

            <div class="form-block">
              <a-row>
                <a-col offset="2" span="20">
                  <div class="form-block-title">
                    <a-divider orientation="left">
                      {{ $t('teacher.add-unit-plan.questions') }}
                    </a-divider>
                  </div>
                </a-col>
              </a-row>
              <div class="content-blocks question-item" v-for="(questionItem, questionIndex) in questionDataObj" :key="questionIndex" v-if="questionItem !== null">
                <div class="knowledge-delete-wrapper" @click="handleDeleteQuestion(questionItem, questionIndex)" v-show="questionTotal > 1">
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>{{ $t('teacher.add-unit-plan.delete-questions') }}</span>
                    </template>
                    <div class="sdg-delete">
                      <a-icon type="delete" :style="{ fontSize: '20px' }" />
                    </div>
                  </a-tooltip>
                </div>
                <a-row>
                  <a-col offset="4" span="18">
                    <div class="form-block-title">
                      <a-divider dashed>
                        {{ $t('teacher.add-unit-plan.questions') }}
                      </a-divider>
                    </div>
                  </a-col>
                </a-row>
                <a-form-model-item :label="$t('teacher.add-unit-plan.nth-key-question')">
                  <a-input v-model="questionItem.name" allow-clear />
                </a-form-model-item>

                <!--knowledge tag-select -->
                <a-form-model-item :label="$t('teacher.add-unit-plan.knowledge-tags')">
                  <knowledge-tag
                    :question-index="questionIndex"
                    :grade-list="gradeList"
                    :subject-tree="subjectTree"
                    :default-grade-id="questionItem.knowledgeGradeId"
                    :default-main-subject-id="questionItem.knowledgeMainSubjectId"
                    :default-sub-subject-id="questionItem.knowledgeSubSubjectId"
                    :selected-knowledge-tags="questionItem.knowledgeTags"
                    @remove-knowledge-tag="handleRemoveKnowledgeTag"
                    @add-knowledge-tag="handleAddKnowledgeTag"
                  />
                </a-form-model-item>

                <!--skill tag-select-->
                <a-form-model-item :label="$t('teacher.add-unit-plan.skill-tags')">
                  <skill-tag
                    :question-index="questionIndex"
                    :grade-list="gradeList"
                    :default-grade-id="questionItem.skillGradeId"
                    :selected-skill-tags="questionItem.skillTags"
                    @remove-skill-tag="handleRemoveSkillTag"
                    @add-skill-tag="handleAddSkillTag"
                  />
                </a-form-model-item>
              </div>

              <a-row>
                <a-col offset="2" span="20">
                  <div class="form-block-title form-block-action">
                    <a-button type="link" icon="plus-circle" @click="handleAddMoreQuestion">
                      {{ $t('teacher.add-unit-plan.add-more-question') }}
                    </a-button>
                  </div>
                </a-col>
              </a-row>
            </div>

          </a-form-model>
        </a-card>
      </a-col>
      <a-col span="6" class="right-reference-view">
        <a-card :bordered="false" :loading="referenceLoading">
        </a-card>
      </a-col>
    </a-row>
    <a-skeleton :loading="contentLoading" active>
    </a-skeleton>
  </a-card>
</template>

<script>
import * as logger from '@/utils/logger'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { typeMap } from '@/const/teacher'
import { commonAPIUrl } from '@/api/common'
import { GetAllSdgs, ScenarioSearch } from '@/api/scenario'
import { debounce } from 'lodash-es'
import InputSearch from '@/components/UnitPlan/InputSearch'
import SdgTagInput from '@/components/UnitPlan/SdgTagInput'
// import { GetTreeByKey } from '@/api/tag'
import { GetMyGrades } from '@/api/teacher'
import { SubjectTree } from '@/api/subject'
import { formatSubjectTree } from '@/utils/bizUtil'
import KnowledgeTag from '@/components/UnitPlan/KnowledgeTag'
import SkillTag from '@/components/UnitPlan/SkillTag'
import { ChangeStatus, UnitPlanAddOrUpdate, UnitPlanQueryById } from '@/api/unitPlan'
import { formatLocalUTC } from '@/utils/util'
import { MaterialDelete } from '@/api/material'

export default {
  name: 'AddUnitPlan',
  components: {
    ContentTypeIcon,
    InputSearch,
    SdgTagInput,
    KnowledgeTag,
    SkillTag
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    unitPlanId: null
  },
  data () {
    return {
      contentLoading: true,
      referenceLoading: false,
      contentType: typeMap,

      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        concepts: [],
        image: '',
        inquiry: '',
        name: '',
        status: 0,
        subjects: '',
        questions: [
          {
            id: '',
            knowledgeTags: [
              {
                description: '',
                id: '',
                name: ''
              }
            ],
            name: '',
            skillTags: [
              {
                description: '',
                id: '',
                name: ''
              }
            ]
          }
        ],
        scenario: {
          description: '',
          sdgKeyWords: [
            {
              keywords: [
                {
                  id: '',
                  name: ''
                }
              ],
              sdgId: ''
            }
          ]
        },
        createTime: '',
        updateTime: '',
        materials: []
      },

      uploading: false,
      sdgList: [],

      // Subject(s) Covered
      subjectList: [],

      // Concepts
      conceptsList: [],

      // Grades
      gradeList: [],

      // SubjectTree
      subjectTree: [],

      // 根据description搜索的下拉list列表
      descriptionSearchList: [],

      // 将scenario下面的sdg及keywords转成对象
      sdgTotal: 0,
      sdgMaxIndex: 0,
      sdgPrefix: '__sdg_',
      sdgDataObj: {
        __sdg_0: {
          sdgId: null,
          originKeywords: [],
          selectedKeywords: []
        }
      },

      // 将questions转成对象
      questionTotal: 0,
      questionMaxIndex: 0,
      questionPrefix: '__question_',
      questionDataObj: {
        __question_0: {
          questionId: null,
          name: '',
          knowledgeMainSubjectId: '',
          knowledgeSubSubjectId: '',
          knowledgeGradeId: '',
          knowledgeTags: [],
          skillGradeId: '',
          skillTags: []
        }
      }
    }
  },
  watch: {
    'form.subjects': function () {
      const conceptList = this.subjectList.find(subject => subject.name === this.form.subjects)
      if (conceptList && conceptList.children) {
        this.conceptsList = conceptList.children
        logger.info('conceptList', conceptList.children)
      } else {
        this.conceptList = []
      }
    }
  },
  computed: {
    lastChangeSavedTime () {
      const time = this.form.updateTime || this.form.createTime
      if (time) {
        return formatLocalUTC(this.form.updateTime || this.form.createTime)
      } else {
        return ''
      }
    }
  },
  created () {
    logger.info('unitPlanId ' + this.unitPlanId + ' ' + this.$route.path)
    this.initData()
    this.debouncedGetSdgByDescription = debounce(this.searchScenario, 300)
  },
  methods: {
    initData () {
      logger.info('initData doing...')
      Promise.all([
        GetAllSdgs(),
        // GetTreeByKey({ key: 'Related Concepts MYP' }),
        GetMyGrades(),
        SubjectTree({ curriculumId: this.$store.getters.bindCurriculum })
      ]).then((sdgListResponse) => {
        logger.info('initData done', sdgListResponse)

        // GetAllSdgs
        logger.info('GetAllSdgs Response ', sdgListResponse[0])
        if (!sdgListResponse[0].code) {
          this.sdgList = sdgListResponse[0].result
        }

        // GetTreeByKey
        if (!sdgListResponse[1].code) {
          logger.info('GetTreeByKey subjectList', sdgListResponse[1].result.children)
          this.subjectList = sdgListResponse[1].result.children
        }

        // GetMyGrades
        if (!sdgListResponse[2].code) {
          logger.info('GetMyGrades', sdgListResponse[2].result)
          this.gradeList = sdgListResponse[2].result
        }

        // SubjectTree
        if (!sdgListResponse[3].code) {
          logger.info('SubjectTree', sdgListResponse[3].result)
          let subjectTree = sdgListResponse[3].result
          subjectTree = formatSubjectTree(subjectTree)
          this.subjectTree = subjectTree
          logger.info('after format subjectTree', subjectTree)
        }
        logger.info('sdgList', this.sdgList)
      }).then(() => {
        this.restoreUnitPlan(this.unitPlanId, true)
      }).catch(() => {
        this.$message.error(this.$t('teacher.add-unit-plan.init-data-failed'))
      }).finally(() => {
        this.referenceLoading = false
      })
    },

    restoreUnitPlan (unitPlanId, isFirstLoad) {
      if (isFirstLoad) {
        this.contentLoading = true
      }
      logger.info('restoreUnitPlan ' + unitPlanId)
      UnitPlanQueryById({
        id: unitPlanId
      }).then(response => {
        logger.info('UnitPlanQueryById ' + unitPlanId, response.result)
        const unitPlanData = response.result
        if (!unitPlanData.scenario) {
          unitPlanData.scenario = {
            description: '',
            sdgKeyWords: []
          }
        }

        const sdgKeys = Object.keys(this.sdgDataObj)
        sdgKeys.forEach(sdgKey => {
          logger.info('sdgDataObj delete ' + sdgKey)
          this.$delete(this.sdgDataObj, sdgKey)
        })
        if (unitPlanData.scenario && unitPlanData.scenario.sdgKeyWords && unitPlanData.scenario.sdgKeyWords.length) {
            unitPlanData.scenario.sdgKeyWords.forEach((sdgKeyword, index) => {
              const sdg = {
                sdgId: sdgKeyword.sdgId,
                originKeywords: sdgKeyword.keywords || [],
                selectedKeywords: (sdgKeyword.keywords || []).map(item => item.name)
              }
              this.$set(this.sdgDataObj, this.sdgPrefix + this.sdgMaxIndex, sdg)
              logger.info('restore scenarioObj: ' + (this.sdgPrefix + this.sdgMaxIndex), sdg, ' sdgDataObj ', this.sdgDataObj)
              this.sdgMaxIndex = this.sdgMaxIndex + 1
              this.sdgTotal = this.sdgTotal + 1
            })
        } else {
          const sdg = {
            originKeywords: [],
            selectedKeywords: []
          }
          this.$set(this.sdgDataObj, this.sdgPrefix + this.sdgMaxIndex, sdg)
          this.sdgMaxIndex = this.sdgMaxIndex + 1
          this.sdgTotal = this.sdgTotal + 1
        }

        const questionKeys = Object.keys(this.questionDataObj)
        questionKeys.forEach(questionKey => {
          logger.info('questionDataObj delete ' + questionKey)
          this.$delete(this.questionDataObj, questionKey)
        })
        if (unitPlanData.questions && unitPlanData.questions.length) {
          unitPlanData.questions.forEach(questionItem => {
            const question = {
              questionId: questionItem.id,
              name: questionItem.name,
              knowledgeMainSubjectId: '',
              knowledgeSubSubjectId: '',
              knowledgeGradeId: '',
              knowledgeTags: questionItem.knowledgeTags,
              skillGradeId: '',
              skillTags: questionItem.skillTags
            }
            this.$set(this.questionDataObj, this.questionPrefix + this.questionMaxIndex, question)
            logger.info('restore default questionDataObj: ' + (this.questionPrefix + this.questionMaxIndex), question, ' questionDataObj ', this.questionDataObj)
            this.questionMaxIndex = this.questionMaxIndex + 1
            this.questionTotal = this.questionTotal + 1
          })
        } else {
          const question = {
            name: '',
            knowledgeMainSubjectId: '',
            knowledgeSubSubjectId: '',
            knowledgeGradeId: '',
            knowledgeTags: [],
            skillGradeId: '',
            skillTags: []
          }
          this.$set(this.questionDataObj, this.questionPrefix + this.questionMaxIndex, question)
          logger.info('restore default questionDataObj: ' + (this.questionPrefix + this.questionMaxIndex), question, ' questionDataObj ', this.questionDataObj)
          this.questionMaxIndex = this.questionMaxIndex + 1
          this.questionTotal = this.questionTotal + 1
        }

        this.form = unitPlanData
        logger.info('after restoreUnitPlan', this.form, this.sdgDataObj, this.questionDataObj)
      }).finally(() => {
        this.contentLoading = false
      })
    },

    handleUploadImage (data) {
      logger.info('handleUploadImage', data)
      const formData = new FormData()
      formData.append('file', data.file, data.file.name)
      this.uploading = true
      this.$http.post(commonAPIUrl.UploadFile, formData, { contentType: false, processData: false, headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 })
        .then((response) => {
          logger.info('handleUploadImage upload response:', response)
          this.form.image = this.$store.getters.downloadUrl + response.result
        }).catch(err => {
          logger.error('handleUploadImage error', err)
          this.$message.error(this.$t('teacher.add-unit-plan.upload-image-file-failed'))
      }).finally(() => {
        this.uploading = false
      })
    },
    handleDescriptionSearch (description) {
      logger.info('handleDescriptionSearch', description)
      this.form.scenario.description = description
      this.debouncedGetSdgByDescription(description)
    },

    searchScenario (description) {
      logger.info('searchScenario', description)
      if (typeof description === 'string' && description.trim().length >= 3) {
        ScenarioSearch({
          searchKey: this.form.scenario.description
        }).then((response) => {
          logger.info('searchByDescription', response)
          this.descriptionSearchList = response.result
        })
      } else {
        this.descriptionSearchList = []
      }
    },

    // 由于Vue无法响应式处理数据元素，此处通过将数据转为scenarioObj的属性进行处理
    handleSelectScenario (scenario) {
      logger.info('handleSelectScenario', scenario, ' sdgMaxIndex ' + this.sdgMaxIndex, ' sdgTotal ' + this.sdgTotal)
      this.form.scenario.description = scenario.description
      this.form.scenario.id = scenario.id
      if (this.sdgTotal === 1) {
        if (scenario.sdgKeyWords.length) {
          const sdg = scenario.sdgKeyWords[0]
          logger.info('scenario.sdgKeyWords[0]', sdg)
          sdg.selectedKeywords = sdg.keywords.map(keyword => keyword.name)
          sdg.originKeywords = sdg.keywords
          logger.info('sdg', sdg)
          const sdgIndex = Object.keys(this.sdgDataObj)[0]
          logger.info('sdgIndex', sdgIndex)
          this.$set(this.sdgDataObj, sdgIndex, sdg)
        } else {
          const sdg = {
            originKeywords: [],
            selectedKeywords: []
          }
          logger.info('sdg keywords empty')
          const sdgIndex = Object.keys(this.sdgDataObj)[0]
          logger.info('sdgIndex', sdgIndex)
          this.$set(this.sdgDataObj, sdgIndex, sdg)
        }
        logger.info('after select scenarioObj: ', this.sdgDataObj, 'sdgMaxIndex ' + this.sdgMaxIndex, ' sdgTotal ' + this.sdgTotal)
      } else {
        logger.info('not use auto fill, because sdgTotal ' + this.sdgTotal)
      }
    },

    handleAddMoreSdg () {
      const sdg = {
        sdgId: null,
        originKeywords: [],
        selectedKeywords: []
      }
      logger.info('handleAddMoreSdg ', sdg, ' sdgMaxIndex ' + this.sdgMaxIndex, ' sdgTotal ' + this.sdgTotal)
      this.sdgMaxIndex = this.sdgMaxIndex + 1
      this.sdgTotal = this.sdgTotal + 1
      this.$set(this.sdgDataObj, this.sdgPrefix + this.sdgMaxIndex, sdg)
      logger.info('after add scenarioObj: ', this.sdgDataObj, 'sdgMaxIndex ' + this.sdgMaxIndex, ' sdgTotal ' + this.sdgTotal)
    },

    handleDeleteSdg (sdgItem, sdgIndex) {
      logger.info('handleDeleteSdg ', sdgItem, sdgIndex, 'sdgTotal' + this.sdgTotal)
      if (this.sdgTotal > 1) {
        this.$delete(this.sdgDataObj, sdgIndex)
        this.sdgTotal = this.sdgTotal - 1
        logger.info('sdgDataObj ', this.sdgDataObj, 'sdgTotal ' + this.sdgTotal)
      } else {
        this.$message.warn(this.$t('teacher.add-unit-plan.at-least-one-sdg'))
      }
    },

    handleAddSdgTag (data) {
      const tagName = data.tagName
      const sdgKey = data.sdgKey
      logger.info('handleAddSdgTag ', tagName, sdgKey)
      this.sdgDataObj[sdgKey].selectedKeywords.push(tagName)
      logger.info('after handleAddSdgTag ', this.sdgDataObj[sdgKey].selectedKeywords)
    },

    handleRemoveSdgTag (data) {
      const tagName = data.tagName
      const sdgKey = data.sdgKey
      logger.info('handleRemoveSdgTag ', tagName, sdgKey)
      this.sdgDataObj[sdgKey].selectedKeywords.splice(this.sdgDataObj[sdgKey].selectedKeywords.indexOf(tagName), 1)
      logger.info('after handleRemoveSdgTag ', this.sdgDataObj[sdgKey].selectedKeywords)
    },

    handleSelectSubject (subjects) {
      logger.info('handleSelectSubject', subjects)
      this.form.subjects = subjects
      this.form.concepts = []
    },

    handleSelectConcept (concept) {
      logger.info('handleSelectConcept', concept, this.form.concepts)
    },

    handleDeleteQuestion (questionItem, questionIndex) {
      logger.info('handleDeleteQuestion ', questionItem, questionIndex)
      if (this.questionTotal > 1) {
        this.$delete(this.questionDataObj, questionIndex)
        this.questionTotal = this.questionTotal - 1
        logger.info('questionDataObj ', this.questionDataObj)
      } else {
        this.$message.warn(this.$t('teacher.add-unit-plan.at-least-one-question'))
      }
    },

    handleRemoveKnowledgeTag (data) {
      logger.info('Unit Plan handleRemoveKnowledgeTag', data)
      logger.info('target question data', this.questionDataObj[data.questionIndex.knowledgeTags])
      this.questionDataObj[data.questionIndex].knowledgeTags = this.questionDataObj[data.questionIndex].knowledgeTags.filter(item => item.id !== data.id)
      logger.info('Unit Plan after handleRemoveKnowledgeTag ', this.questionDataObj[data.questionIndex].knowledgeTags)
    },

    handleAddKnowledgeTag (data) {
      logger.info('Unit Plan handleAddKnowledgeTag', data)
      logger.info('target question data', this.questionDataObj[data.questionIndex])
      const newTag = {
        description: data.description,
        id: data.id,
        name: data.name
      }
      this.questionDataObj[data.questionIndex].knowledgeTags.push(newTag)
    },

    handleAddMoreQuestion () {
      const question = {
        questionId: null,
        name: '',
        knowledgeMainSubjectId: '',
        knowledgeSubSubjectId: '',
        knowledgeGradeId: '',
        knowledgeTags: [],
        skillGradeId: '',
        skillTags: []
      }
      logger.info('handleAddMoreQuestion ', question)
      this.questionMaxIndex = this.questionMaxIndex + 1
      this.questionTotal = this.questionTotal + 1
      this.$set(this.questionDataObj, this.questionPrefix + this.questionMaxIndex, question)
    },

    handleRemoveSkillTag (data) {
      logger.info('Unit Plan handleRemoveSkillTag', data)
      logger.info('target question data', this.questionDataObj[data.questionIndex])
      this.questionDataObj[data.questionIndex].skillTags = this.questionDataObj[data.questionIndex].skillTags.filter(item => item.id !== data.id)
      logger.info('Unit Plan after handleRemoveSkillTag ', this.questionDataObj[data.questionIndex].skillTags)
    },

    handleAddSkillTag (data) {
      logger.info('Unit Plan handleAddSkillTag', data)
      logger.info('target question data', this.questionDataObj[data.questionIndex])
      const newTag = {
        description: data.description,
        id: data.id,
        name: data.name
      }
      this.questionDataObj[data.questionIndex].skillTags.push(newTag)
    },

    autoSave () {

    },

    handleSaveUnitPlan () {
      logger.info('handleSaveUnitPlan', this.form, this.sdgDataObj, this.questionDataObj)

      const unitPlanData = {
        concepts: this.form.concepts,
        image: this.form.image,
        inquiry: this.form.inquiry,
        name: this.form.name,
        status: this.form.status,
        subjects: this.form.subjects,
        scenario: {
          description: this.form.scenario.description,
          sdgKeyWords: []
        },
        questions: []
      }

      if (this.unitPlanId) {
        unitPlanData.id = this.unitPlanId
      }
      if (this.form.scenario.id) {
        unitPlanData.scenario.id = this.form.scenario.id
      }
      logger.info('basic unitPlanData', unitPlanData)
      for (const sdgIndex in this.sdgDataObj) {
        const sdg = this.sdgDataObj[sdgIndex]
        logger.info('sdg ' + sdgIndex, sdg)
        const keywords = []
        sdg.selectedKeywords.forEach(selectedKeyword => {
          const existOriginKeyword = sdg.originKeywords.find(item => item.name.trim() === selectedKeyword.trim())
          if (existOriginKeyword) {
            logger.info('exist origin keyword [' + selectedKeyword + ']')
            keywords.push(existOriginKeyword)
          } else {
            logger.info('new keyword [' + selectedKeyword + ']')
            keywords.push({
              name: selectedKeyword
            })
          }
        })
        logger.info('sdg scenario keywords', keywords)
        unitPlanData.scenario.sdgKeyWords.push({
          sdgId: sdg.sdgId,
          keywords: keywords
        })
      }
      logger.info('sdg unitPlanData', unitPlanData)
      for (const questionIndex in this.questionDataObj) {
        const question = this.questionDataObj[questionIndex]
        logger.info('question ' + questionIndex, question)
        unitPlanData.questions.push({
          knowledgeTags: question.knowledgeTags,
          skillTags: question.skillTags,
          name: question.name
        })
      }
      logger.info('question unitPlanData', unitPlanData)
      UnitPlanAddOrUpdate(unitPlanData).then((response) => {
        logger.info('UnitPlanAddOrUpdate', response.result)
        if (response.success) {
          this.restoreUnitPlan(response.result.id, false)
          this.$message.success(this.$t('teacher.add-unit-plan.save-success'))
        } else {
          this.$message.error(response.message)
        }
      })
    },
    handlePublishUnitPlan () {
      logger.info('handlePublishUnitPlan', {
        id: this.unitPlanId,
        status: 1
      })
      ChangeStatus({
        id: this.unitPlanId,
        status: 1
      }).then(() => {
        this.$message.success(this.$t('teacher.add-unit-plan.publish-success'))
        this.form.status = 1
      })
    },

    handleAddUnitPlanMaterial () {
      logger.info('handleAddUnitPlanMaterial ' + this.unitPlanId)
      this.$router.push({
        path: '/teacher/unit-plan-material-redirect/' + this.unitPlanId + '/create'
      })
    },

    handleDeleteMaterial (material) {
      MaterialDelete({
        id: material.id
      }).then(response => {
        UnitPlanQueryById({
          id: this.unitPlanId
        }).then(response => {
          logger.info('handleDeleteMaterial UnitPlanQueryById ' + this.unitPlanId, response.result)
          this.form.materials = response.result.materials
        })
      })
    },
    goBack () {
      if (window.history.length <= 1) {
        this.$router.push({ path: '/teacher/main/created-by-me' })
        return false
      } else {
        this.$router.go(-1)
      }

      setTimeout(() => {
        this.$router.push({ path: '/teacher/main/created-by-me' })
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.unit-plan-header {
  padding-bottom: 16px;
  border-bottom: 1px solid  rgb(235, 238, 240);

  .nav-back-btn {
    padding-left: 0;
  }

  .unit-nav-title {
    color: @text-color;
    font-weight: bold;
  }

  .unit-last-change-time {
    line-height: 32px;
    color: @text-color-secondary;
  }

  .unit-right-action {
    display: flex;
    justify-content: flex-end;
  }
}

.unit-content {
  .unit-menu-list {
    padding: 0 24px 16px 0;
    .unit-menu-title {
      font-size: @font-size-lg;
      line-height: 50px;
      text-align: center;
      cursor: pointer;
      color: @primary-color;
    }
    .unit-add-to {

    }

    .already-add-to-list {
      .add-to-type {
        border-right: none;
        color: @text-color;
        .add-to-type-label {
          padding: 15px 0 5px 0;
          cursor: pointer;
        }
        .add-to-list {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          white-space: nowrap;
        }
      }
    }
  }

  .main-content {
    padding: 30px 0;

    .image-preview {
      img {
        max-width: 100%;
      }
    }

    p.ant-upload-text {
      color: @text-color;
    }

    .upload-container {
      padding: 16px 0;
    }

    .uploading-tips {
      padding-left: 10px;
    }

    .form-block-title {
      font-size: @font-size-lg;
      color: #000;
    }

    .form-block-action {
      text-align: center;
    }

    .action-line {
      padding: 50px 0;
      display: flex;
      justify-content: center;
    }

    .question-item {
      padding-bottom: 24px;
    }

    .content-blocks {
      position: relative;
      border: 1px dotted #fff;
      .sdg-delete-wrapper {
        transition: all 0.2s ease-in;
        display: none;
        position: absolute;
        text-align: center;
        right: 15px;
        top: 80px;
        line-height: 50px;
        width: 50px;
        height: 50px;
        cursor: pointer;
        color: @link-hover-color;
        z-index: 1000;
      }

      &:hover {
        border: 1px dotted @link-hover-color;
        box-sizing: border-box;
        .sdg-delete-wrapper {
          display: block;
        }
      }

      .knowledge-delete-wrapper {
        transition: all 0.2s ease-in;
        display: none;
        position: absolute;
        text-align: center;
        right: 15px;
        top: 180px;
        line-height: 50px;
        width: 50px;
        height: 50px;
        cursor: pointer;
        color: @link-hover-color;
        z-index: 1000;
      }

      &:hover {
        border: 1px dotted @link-hover-color;
        cursor: pointer;
        box-sizing: border-box;
        .knowledge-delete-wrapper {
          display: block;
        }
      }

      .tag-select {
        padding-bottom: 24px;

        .tag-label {
          color: @text-color-secondary;
          text-align: center;
          padding-bottom: 5px;
        }
      }
    }
  }

  .add-to-item {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    padding: 0 5px;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      background-color: fade(@outline-color, 20%);
    }

    a {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;

      i {
        padding-right: 5px;
      }
    }

    .material-name {
      max-width: 120px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
    }

    .hover-delete {
      color: @red-4;
      display: none;
      cursor: pointer;
      justify-content: center;
      align-items: center;
      padding-left: 5px;
    }

    &:hover {
      .hover-delete {
        display: flex;
      }
    }
  }

}
</style>
