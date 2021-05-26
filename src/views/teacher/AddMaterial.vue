<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-row class="material-plan-header">
      <a-col span="12">
        <a-space>
          <a-button class="nav-back-btn" type="link" @click="$router.go(-1)"> <a-icon type="left" /> {{ $t('teacher.add-unit-plan.back') }}</a-button>
          <span class="material-last-change-time">
            <span class="material-nav-title">
              {{ unitPlanData.name }}
            </span>
          </span>
        </a-space>
      </a-col>
      <a-col span="12" class="material-right-action">
        <a-space>
          <a-button @click="handleAddOrUpdateMaterial"> <a-icon type="save" /> {{ $t('teacher.add-unit-plan.save') }}</a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-row class="material-content">
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
              <a-button type="primary" block> <a-icon type="plus" /> {{ $t('teacher.add-unit-plan.add-to-this-unit-plan') }} </a-button>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a @click="handleAddUnitPlanMaterial">
                    {{ $t('teacher.add-unit-plan.material') }}
                  </a>
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
      <a-col span="21" class="upload-content">
        <div class="uploader-wrapper">
          <!--          <div class="file-type">-->
          <!--            <div class="file-type-list">-->
          <!--              <div class="file-type-item">-->
          <!--                <file-type-svg />-->
          <!--              </div>-->
          <!--              <div class="file-type-item">-->
          <!--                <link-type-svg />-->
          <!--              </div>-->
          <!--              <div class="file-type-item">-->
          <!--                <video-type-svg />-->
          <!--              </div>-->
          <!--              <div class="file-type-item">-->
          <!--                <image-type-svg />-->
          <!--              </div>-->
          <!--              <div class="file-type-item">-->
          <!--                <audio-type-svg />-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->
          <div class="uploader-container">
            <div class="uploader">
              <a-upload-dragger
                name="file"
                accept="image/png, image/jpeg"
                :showUploadList="false"
                :customRequest="handleUpload"
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
                <template v-if="!uploading && uploader && uploader.url">
                  <div class="image-preview">
                    <a-result status="success" :title="$t('teacher.add-unit-plan.uploading-success')">
                      <div class="desc">
                        <p class="file-info">
                          <strong>{{ $t('teacher.add-unit-plan.file-name') }}: {{ uploader.file.name }}</strong>
                        </p>
                        <p class="file-info">
                          <strong>{{ $t('teacher.add-unit-plan.file-size') }}: {{ filesize }}</strong>
                        </p>
                        <p class="file-info">
                          <a :href="uploader.url" target="_blank"><a-icon type="download" /> {{ $t('teacher.add-unit-plan.download') }}</a>
                        </p>
                      </div>
                    </a-result>
                  </div>
                </template>
                <template v-if="!uploading && uploader && !uploader.url">
                  <div class="upload-container">
                    <p class="ant-upload-drag-icon">
                      <a-icon type="picture" />
                    </p>
                    <p class="ant-upload-text">
                      {{ $t('teacher.add-unit-plan.upload-material') }}
                    </p>
                  </div>
                </template>
              </a-upload-dragger>
            </div>
            <div class="info">
              <a-row class="info-form" :gutter="50">
                <a-col span="12">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t('teacher.add-unit-plan.material-name') }}
                    </div>
                    <div class="info-input">
                      <a-input allow-clear :placeholder="$t('teacher.add-unit-plan.material-name')" v-model="material.name"/>
                    </div>
                  </div>
                </a-col>
                <a-col span="12">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t('teacher.add-unit-plan.material-overview') }}
                    </div>
                    <div class="info-input">
                      <a-textarea allow-clear rows="4" :placeholder="$t('teacher.add-unit-plan.overview')" v-model="material.overview"/>
                    </div>
                  </div>
                </a-col>
              </a-row>
            </div>
            <a-divider dashed />
            <div class="material-tag">
              <div class="tag-list">
                <div class="tag-label">{{ $t('teacher.add-unit-plan.material-tag') }}: </div>
                <div class="tag-item" v-for="(tag,index) in tagList" :key="index">
                  <a-tag :color="tagColorList[index % tagColorList.length]">
                    <a-tooltip :title="tag">
                      {{ tag }}
                    </a-tooltip>
                  </a-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="info-wrapper"></div>
        <div class="tag-wrapper"></div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { UnitPlanQueryById } from '@/api/unitPlan'
import FileTypeSvg from '@/assets/icons/filetype/file_type.svg?inline'
import VideoTypeSvg from '@/assets/icons/filetype/video.svg?inline'
import LinkTypeSvg from '@/assets/icons/filetype/web.svg?inline'
import ImageTypeSvg from '@/assets/icons/filetype/image.svg?inline'
import AudioTypeSvg from '@/assets/icons/filetype/audio.svg?inline'
import { commonAPIUrl } from '@/api/common'
import { renderSize } from '@/utils/util'
import { MaterialAddOrUpdate } from '@/api/material'

export default {
  name: 'AddUnitPlan',
  components: {
    ContentTypeIcon,
    FileTypeSvg,
    VideoTypeSvg,
    LinkTypeSvg,
    ImageTypeSvg,
    AudioTypeSvg
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    unitPlanId: null
  },
  data () {
    return {
      contentType: typeMap,
      material: {
        name: 'Unnamed',
        overview: ''
      },

      uploader: {
        url: '',
        file: {
          name: '',
          size: 0,
          type: ''
        }
      },

      unitPlanData: {
        concepts: '',
        image: '',
        inquiry: '',
        name: '',
        status: 0,
        subjects: '',
        createTime: '',
        updateTime: '',
        questions: [],
        scenario: {}
      },
      uploading: false,

      tagColorList: [
        'pink',
        'orange',
        'green',
        'cyan',
        'blue',
        'red',
        'purple'
      ],

      tagList: []
    }
  },
  computed: {
    filesize () {
      if (this.uploader && this.uploader.file && this.uploader.file.size) {
        return renderSize(this.uploader.file.size)
      } else {
        return renderSize('')
      }
    }
  },
  created () {
    logger.info('unitPlanId ' + this.unitPlanId + ' ' + this.$route.path)
    this.restoreUnitPlan(this.unitPlanId)
  },
  methods: {
    restoreUnitPlan (unitPlanId) {
      logger.info('restoreUnitPlan ' + unitPlanId)
      UnitPlanQueryById({
        id: unitPlanId
      }).then(response => {
        logger.info('Material UnitPlanQueryById ' + unitPlanId, response.result)
        this.unitPlanData = response.result
        this.initTagList()
      })
    },

    initTagList () {
      const list = []
      if (this.unitPlanData.scenario) {
        if (this.unitPlanData.scenario.sdgKeyWords && this.unitPlanData.scenario.sdgKeyWords.length) {
          this.unitPlanData.scenario.sdgKeyWords.forEach(sdgKeyWord => {
            if (sdgKeyWord.keywords) {
              logger.info('initTagList sdgKeyWords ', sdgKeyWord.keywords.map(item => list.push(item.name)))
            }
          })
        }

        if (this.unitPlanData.scenario.description) {
          list.push(this.unitPlanData.scenario.description)
        }
      }

      if (this.unitPlanData.inquiry) {
        list.push(this.unitPlanData.inquiry)
      }
      this.tagList = list
    },
    handleUpload (data) {
      logger.info('handleUpload', data)
      this.uploader.file = data.file
      const formData = new FormData()
      formData.append('file', data.file, data.file.name)
      this.uploading = true
      this.$http.post(commonAPIUrl.UploadFile, formData, { contentType: false, processData: false, headers: { 'Content-Type': 'multipart/form-data' } })
        .then((response) => {
          logger.info('material handleUpload upload response:', response)
          this.uploader.url = this.$store.getters.downloadUrl + response.result
        }).catch(err => {
        logger.error('material handleUpload error', err)
        this.$message.error(this.$t('teacher.add-unit-plan.uploading-failed'))
      }).finally(() => {
        this.uploading = false
      })
    },

    handleAddUnitPlanMaterial () {
      logger.info('handleAddUnitPlanMaterial ' + this.unitPlanId)
      this.$router.push({
        path: '/teacher/add-unit-plan-material/' + this.unitPlanId
      })
    },

    handleAddOrUpdateMaterial () {
      const materialData = {
        name: this.material.name,
        overview: this.material.overview,
        planId: this.unitPlanId,
        fileUrl: this.uploader.url
      }

      MaterialAddOrUpdate(materialData).then((response) => {
        logger.info('handleAddOrUpdateMaterial response', response)
        this.$message.success(this.$t('teacher.add-unit-plan.add-material-success'))
        this.$router.replace('/teacher/unit-plan/' + this.unitPlanId)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.material-plan-header {
  padding-bottom: 16px;
  border-bottom: 1px solid  rgb(235, 238, 240);

  .nav-back-btn {
    padding-left: 0;
  }

  .material-nav-title {
    color: @text-color;
    font-weight: bold;
  }

  .material-last-change-time {
    line-height: 32px;
    color: @text-color-secondary;
  }

  .material-right-action {
    display: flex;
    justify-content: flex-end;
  }
}

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

.material-content {

  .upload-content {
    padding: 30px 0;
    .uploader-wrapper {
      margin: auto;
      display: flex;
      justify-content: center;
      width: 70%;

      .upload-container {
        padding: 50px 0;
      }

      .file-type {
        width: 50px;
        .file-type-list {
          display: flex;
          flex-direction: column;
          .file-type-item {
            height: 30px;
            width: 30px;
            svg {
              height: 30px;
              width: 30px;
            }
          }
        }
      }

      .uploading-tips {
        padding-left: 10px;
      }

      .uploader-container {
        display: block;
        width: 100%;
        .info {
          .info-form {
            padding: 16px 0;
            .info-item {
              display: flex;
              flex-direction: column;
              .info-label {
                color: @text-color;
                font-size: 16px;
                padding: 10px 0 5px 0;
              }
            }
          }
        }

        .desc {
          .file-info {
            font-size: 16px;
          }
        }

        .material-tag {
          width: 100%;
          .tag-list {
            display: flex;
            flex-direction: row;
            .tag-label {
              font-weight: bold;
              padding-right: 10px;
            }
            .tag-item {
              font-size: 16px;
              margin-right: 10px;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
}
</style>
