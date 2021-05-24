<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-row class="unit-plan-header">
      <a-col span="12">
        <a-space>
          <a-button class="nav-back-btn" type="link" @click="$router.go(-1)"> <a-icon type="left" /> {{ $t('teacher.add-unit-plan.back') }}</a-button>
          <span class="unit-last-change-time" v-if="lastChangeSavedTime">
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
    <a-row class="unit-content">
      <a-col span="3">
        <div class="unit-menu-list">
          <div class="unit-menu-title">
            {{ $t('teacher.add-unit-plan.unit-plan') }}
          </div>
          <div class="already-add-to-list">
            <a-menu mode="inline">
              <a-menu-item key="material">
                <content-type-icon :type="contentType.material"/>
                {{ $t('teacher.add-unit-plan.material') }}
              </a-menu-item>
              <a-menu-item key="assessment">
                <content-type-icon :type="contentType.assessment"/>
                {{ $t('teacher.add-unit-plan.assessment') }}
              </a-menu-item>
              <a-menu-item key="lesson">
                <content-type-icon :type="contentType.lesson"/>
                {{ $t('teacher.add-unit-plan.lesson') }}
              </a-menu-item>
            </a-menu>
          </div>
          <a-divider />
          <div class="unit-add-to">
            <a-dropdown>
              <a-button type="primary" block> <a-icon type="plus" /> {{ $t('teacher.add-unit-plan.add-to-this-topic') }} </a-button>
              <a-menu slot="overlay">
                <a-menu-item>
                  {{ $t('teacher.add-unit-plan.material') }}
                </a-menu-item>
                <a-menu-item>
                  {{ $t('teacher.add-unit-plan.assessment') }}
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
        <a-card :bordered="false" :loading="contentLoading" :style="{ borderLeft: '1px solid rgb(235, 238, 240)', borderRight: '1px solid rgb(235, 238, 240)' }" :body-style="{padding: '16px'}">
          <a-form-model :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
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
            <!--            about-the-scenario-->
            <div class="form-block">
              <a-row class="unit-content">
                <a-col offset="2" span="20">
                  <div class="form-block-title">
                    <a-divider orientation="left">
                      {{ $t('teacher.add-unit-plan.about-the-scenario') }}
                    </a-divider>
                  </div>
                </a-col>
              </a-row>
              <!--description-->
              <a-form-model-item :label="$t('teacher.add-unit-plan.description')">
                <input-search
                  :default-value="form.scenario.description"
                  :search-list.sync="descriptionSearchList"
                  label="description"
                  @search="handleDescriptionSearch"
                  @selectItem="handleSelectScenario"
                  @reset="descriptionSearchList = []" />
              </a-form-model-item>
              <!--sdg and KeyWords-->
              <div class="sdg-blocks" v-for="(sdgItem, sdgIndex) in sdgDataObj" :key="sdgIndex" v-if="sdgItem !== null">
                <div class="sdg-delete-wrapper">
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>{{ $t('teacher.add-unit-plan.delete-sdg') }}</span>
                    </template>
                    <div class="sdg-delete" @click="handleDeleteSdg(sdgItem, sdgIndex)">
                      <a-icon type="delete" :style="{ fontSize: '20px' }" />
                    </div>
                  </a-tooltip>
                </div>
                <a-row class="unit-content">
                  <a-col offset="6" span="14">
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
                  <sdg-tag-input :tag-list.sync="sdgItem.defaultKeywords" :sdg-key.sync="sdgIndex" @add-tag="handleAddSdgTag" @remove-tag="handleRemoveSdgTag"/>
                </a-form-model-item>
              </div>
              <!--add-more-sdg-->
              <a-row class="unit-content">
                <a-col offset="6" span="14">
                  <div class="form-block-title form-block-action">
                    <a-button type="link" icon="plus-circle" @click="handleAddMoreSdg">
                      {{ $t('teacher.add-unit-plan.add-more-sdg') }}
                    </a-button>
                  </div>
                </a-col>
              </a-row>
            </div>

            <div class="form-block">
              <a-row class="unit-content">
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
                  <a-select v-model="form.concepts" @select="handleSelectConcept">
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
              <a-row class="unit-content">
                <a-col offset="2" span="20">
                  <div class="form-block-title">
                    <a-divider orientation="left">
                      {{ $t('teacher.add-unit-plan.questions') }}
                    </a-divider>
                  </div>
                </a-col>
              </a-row>
            </div>
          </a-form-model>
        </a-card>
      </a-col>
      <a-col span="6" class="right-reference-view">
        <a-card :bordered="false" :loading="referenceLoading">
          ss
        </a-card>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import * as logger from '@/utils/logger'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { typeMap } from '@/const/teacher'
import { commonAPIUrl } from '@/api/common'
import { GetAllSdgs, ScenarioSearch } from '@/api/scenario'
import { debounce } from 'lodash-es'
import InputSearch from '@/components/InputSearch/InputSearch'
import SdgTagInput from '@/components/InputSearch/SdgTagInput'
import { GetTreeByKey } from '@/api/tag'

export default {
  name: 'AddUnitPlan',
  components: {
    ContentTypeIcon,
    InputSearch,
    SdgTagInput
  },
  data () {
    return {
      contentLoading: true,
      referenceLoading: false,
      contentType: typeMap,

      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      form: {
        concepts: '',
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
        }
      },

      uploading: false,
      sdgList: [],

      // Subject(s) Covered
      subjectList: [],

      // Concepts
      conceptsList: [],

      // 根据description搜索的下拉list列表
      descriptionSearchList: [],

      // 将scenario下面的sdg及keywords转成对象
      sdgTotal: 1,
      sdgMaxIndex: 1,
      sdgPrefix: '__sdg_',
      sdgDataObj: {
        __sdg_1: {
          sdgId: null,
          keywords: [],
          defaultKeywords: []
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
      return '12:32 Today'
    }
  },
  created () {
    this.initData()
    this.debouncedGetSdgByDescription = debounce(this.searchScenario, 300)
  },
  mounted () {
  },
  methods: {
    initData () {
      logger.info('initData doing...')
      Promise.all([
        GetAllSdgs(),
        GetTreeByKey({ key: 'Related Concepts MYP' })
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

        this.contentLoading = false
        this.referenceLoading = false
        logger.info('sdgList', this.sdgList)
      }).catch(() => {
        this.$message.error(this.$t('teacher.add-unit-plan.init-data-failed'))
      })
    },
    handleSaveUnitPlan () {
      logger.info('handleSaveUnitPlan')
    },
    handlePublishUnitPlan () {
      logger.info('handlePublishUnitPlan')
    },
    handleUploadImage (data) {
      logger.info('handleUploadImage', data)
      const formData = new FormData()
      formData.append('file', data.file, data.file.name)
      this.uploading = true
      this.$http.post(commonAPIUrl.UploadFile, formData, { contentType: false, processData: false, headers: { 'Content-Type': 'multipart/form-data' } })
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
      logger.info('handleSelectScenario', scenario, this.sdgMaxIndex)
      if (this.sdgTotal === 1) {
        const sdg = scenario.sdgKeyWords[0]
        sdg.defaultKeywords = sdg.keywords.map(keyword => keyword.name)
        logger.info('sdg', sdg)
        this.$set(this.sdgDataObj, this.sdgPrefix + this.sdgMaxIndex, sdg)
        this.sdgMaxIndex++
        this.sdgTotal++
        logger.info('after select scenarioObj: ', this.sdgDataObj, this.sdgMaxIndex)
      } else {
        logger.info('not use auto fill, becasue scenarioMaxIndex ' + this.sdgTotal)
      }
    },

    handleAddMoreSdg () {
      const sdg = {
        sdgId: null,
        keywords: [],
        defaultKeywords: []
      }
      logger.info('handleAddMoreSdg ', sdg)
      this.sdgMaxIndex++
      this.sdgTotal++
      this.$set(this.sdgDataObj, this.sdgPrefix + this.sdgMaxIndex, sdg)
    },

    handleDeleteSdg (sdgItem, sdgIndex) {
      logger.info('handleDeleteSdg ', sdgItem, sdgIndex)
      this.$set(this.sdgDataObj, sdgIndex, null)
      this.sdgTotal--
      logger.info('sdgDataObj ', this.sdgDataObj)
    },

    handleAddSdgTag (data) {
      const tag = data.tag
      const sdgKey = data.sdgKey
      logger.info('handleAddSdgTag ', tag, sdgKey)
      this.sdgDataObj[sdgKey].defaultKeywords.push(tag)
      logger.info('after handleAddSdgTag ', this.sdgDataObj[sdgKey].defaultKeywords)
    },

    handleRemoveSdgTag (data) {
      const tag = data.tag
      const sdgKey = data.sdgKey
      logger.info('handleRemoveSdgTag ', tag, sdgKey)
      this.sdgDataObj[sdgKey].defaultKeywords.splice(this.sdgDataObj[sdgKey].defaultKeywords.indexOf(tag), 1)
      logger.info('after handleRemoveSdgTag ', this.sdgDataObj[sdgKey].defaultKeywords)
    },

    handleSelectSubject (subjects) {
      logger.info('handleSelectSubject', subjects)
      this.form.subjects = subjects
      this.form.concepts = ''
    },

    handleSelectConcept (concept) {
      logger.info('handleSelectConcept', concept)
      this.form.concepts = concept
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

  .unit-last-change-time {
    line-height: 32px;
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
      .ant-menu-inline {
        border-right: none;
        color: @text-color;
      }

      .ant-menu-inline .ant-menu-item::after {
        border-right: none;
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
      padding-top: 20px;
      text-align: center;
    }

    .sdg-blocks {
      position: relative;
      border: 1px dotted #fff;
      .sdg-delete-wrapper {
        transition: all 0.2s ease-in;
        display: none;
        position: absolute;
        right: 40px;
        top: 80px;
        cursor: pointer;
        color: @link-hover-color;
      }

      &:hover {
        border: 1px dotted @link-hover-color;
        box-sizing: border-box;
        .sdg-delete-wrapper {
          display: block;
        }
      }
    }
  }
}
</style>
