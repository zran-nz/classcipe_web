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
              <!--              description-->
              <a-form-model-item :label="$t('teacher.add-unit-plan.description')">
                <a-select
                  show-search
                  :value="form.description"
                  :placeholder="$t('teacher.add-unit-plan.description')"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  @search="handleDescriptionSearch"
                >
                  <a-select-option v-for="(scenario,index) in scenarioList" :key="index" @click.native="handleSelectScenario(scenario)">
                    {{ scenario.description }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
              <!--              sdg and KeyWords-->
              <div class="sdg-blocks" v-for="(sdg,index) in form.scenario.sdgKeyWords" :key="index">
                <a-form-model-item :label="$t('teacher.add-unit-plan.sdg')">
                  <a-select v-model="form.scenario.sdgKeyWords[index].sdgId" placeholder="please select sdg">
                    <a-select-option :value="sdg.id" v-for="(sdg,id) in sdgList" :key="id">
                      {{ sdg.name }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
                <a-form-model-item :label="$t('teacher.add-unit-plan.key-words')">
                  <a-select mode="tags" style="width: 100%" :placeholder="$t('teacher.add-unit-plan.key-words')" >
                    <a-select-option v-for="(keyword,index) in form.scenario.sdgKeyWords[index].keywords" :key="index">
                      {{ keyword }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </div>
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
import _ from 'lodash'

export default {
  name: 'AddUnitPlan',
  components: {
    ContentTypeIcon
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
      scenarioList: []
    }
  },
  computed: {
    lastChangeSavedTime () {
      return '12:32 Today'
    }
  },
  created () {
    this.initData()
  },
  mounted () {
  },
  methods: {
    initData () {
      logger.info('initData doing...')
      Promise.all([GetAllSdgs()]).then((sdgListResponse) => {
        logger.info('initData done')
        logger.info('GetAllSdgs Response ', sdgListResponse[0])
        if (!sdgListResponse[0].code) {
          this.sdgList = sdgListResponse[0].result
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

    searchScenario () {
      ScenarioSearch({
        searchKey: this.form.scenario.description
      }).then((response) => {
        logger.info('searchByDescription', response)
        this.scenarioList = response.result
      })
    },
    handleDescriptionSearch (description) {
      logger.info('handleDescriptionSearch', description)
      this.form.scenario.description = description
      if (description && description.trim()) {
        _.debounce(this.searchScenario, 500)
      } else {
        this.scenarioList = []
      }
    },
    handleSelectScenario (scenario) {
      logger.info('handleSelectScenario', scenario)
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
  }
}
</style>
