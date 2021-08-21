<template>
  <a-card :bordered="false" :loading="contentLoading" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-row class="material-plan-header">
      <a-col span="12">
        <a-space>
          <a-button class="nav-back-btn" type="link" @click="$router.go(-1)">
            <a-icon type="left" />
            {{ $t('teacher.add-unit-plan.back') }}
          </a-button>
          <span class="material-last-change-time">
            <span class="material-nav-title">
              {{ unitPlanData.name }}
            </span>
          </span>
        </a-space>
      </a-col>
      <a-col span="12" class="material-right-action">
        <a-space>
          <a-button @click="handleAddOrUpdateMaterial">
            <a-icon type="save" />
            {{ $t('teacher.add-unit-plan.save') }}
          </a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-row class="material-content">
      <a-col span="3">
        <div class="unit-menu-list">
          <!--          <div class="unit-menu-title">-->
          <!--            {{ $t('teacher.add-unit-plan.unit-plan') }}-->
          <!--          </div>-->
          <div class="already-add-to-list">
            <div class="add-to-type">
              <div class="add-to-type-label">
                <content-type-icon :type="contentType.material" />
                {{ $t('teacher.add-unit-plan.material') }}
                <template v-if="unitPlanData.materials && unitPlanData.materials.length">(
                  {{ unitPlanData.materials.length }} )
                </template>
              </div>
              <div class="add-to-list">
                <span v-for="(materialItem,index) in unitPlanData.materials" :key="index" class="add-to-item">
                  <a>
                    <template v-if="materialItem.id === materialId">
                      <a-icon type="arrow-right" />
                      <strong class="material-name">{{ materialItem.name }}</strong>
                    </template>
                    <template v-else>
                      <a-icon type="link" />
                      <span class="material-name">{{ materialItem.name }}</span>
                    </template>
                  </a>
                </span>
              </div>
            </div>
            <div class="add-to-type">
              <div class="add-to-type-label">
                <content-type-icon :type="contentType.evaluation" />
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
                <content-type-icon :type="contentType.lesson" />
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
          <!--          <a-divider />-->
          <!--          <div class="unit-add-to">-->
          <!--            <a-dropdown>-->
          <!--              <a-button type="primary" block> <a-icon type="plus" /> {{ $t('teacher.add-unit-plan.add-to-this-unit-plan') }} </a-button>-->
          <!--              <a-menu slot="overlay">-->
          <!--                <a-menu-item>-->
          <!--                  <a @click="handleAddUnitPlanMaterial">-->
          <!--                    {{ $t('teacher.add-unit-plan.material') }}-->
          <!--                  </a>-->
          <!--                </a-menu-item>-->
          <!--                <a-menu-item>-->
          <!--                  {{ $t('teacher.add-unit-plan.evaluation') }}-->
          <!--                </a-menu-item>-->
          <!--                <a-menu-item>-->
          <!--                  {{ $t('teacher.add-unit-plan.lesson') }}-->
          <!--                </a-menu-item>-->
          <!--              </a-menu>-->
          <!--            </a-dropdown>-->
          <!--          </div>-->
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
                <template v-if="!uploading">
                  <template v-if="!material.fileUrl">
                    <div class="upload-container">
                      <p class="ant-upload-drag-icon">
                        <a-icon type="picture" />
                      </p>
                      <p class="ant-upload-text">
                        {{ $t('teacher.add-unit-plan.upload-material') }}
                      </p>
                    </div>
                  </template>
                  <template v-if="material.fileUrl">
                    <div class="upload-container">
                      <p class="ant-upload-drag-icon">
                        <video-type-svg v-if="material.fileType === fileType.video" />
                        <audio-type-svg v-if="material.fileType === fileType.audio" />
                        <image-type-svg v-if="material.fileType === fileType.img" />
                        <file-type-svg v-if="material.fileType === fileType.other"/>
                      </p>
                      <a class="ant-upload-text">
                        <a-icon type="link" /> {{ filename }}
                      </a>
                    </div>
                  </template>
                </template>
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
                      <a-input :placeholder="$t('teacher.add-unit-plan.material-name')" v-model="material.name" />
                    </div>
                  </div>
                </a-col>
                <a-col span="12">
                  <div class="info-item">
                    <div class="info-label">
                      {{ $t('teacher.add-unit-plan.material-overview') }}
                    </div>
                    <div class="info-input">
                      <a-textarea
                        rows="4"
                        :placeholder="$t('teacher.add-unit-plan.material-overview')"
                        v-model="material.overview" />
                    </div>
                  </div>
                </a-col>
              </a-row>
            </div>
            <div class="material-tag tag-block">
              <div class="tag-list">
                <div class="tag-label">{{ $t('teacher.add-unit-plan.material-tag') }}:</div>
                <div class="tag-item" v-for="(tag,index) in tagList" :key="index">
                  <a-tag :color="tagColorList[index % tagColorList.length]">
                    <a-tooltip :title="tag">
                      {{ tag }}
                    </a-tooltip>
                  </a-tag>
                </div>
              </div>
            </div>
            <div class="more-tag tag-block">
              <div class="more-tag-block">
                <div class="label-title">
                  <a-icon type="plus" />
                  <strong> {{ $t('teacher.add-unit-plan.more-tag') }}</strong>
                </div>
              </div>
              <div class="more-tag-block">
                <div class="label-title">
                  {{ $t('teacher.add-unit-plan.concepts') }}&nbsp;:
                </div>
                <div class="tag-area">
                  <div class="tag-list">
                    <div class="tag-item" v-for="(concept,index) in unitPlanData.concepts" :key="index">
                      <a-tag
                        :color="material.concepts.indexOf(concept) === -1 ? '' : '#87d068'"
                        @click="handleAddConcept(concept)">
                        {{ concept }}
                      </a-tag>
                    </div>
                  </div>
                </div>
              </div>
              <div class="more-tag-block">
                <div class="label-title">
                  {{ $t('teacher.add-unit-plan.key-question') }}
                </div>
                <div class="tag-area">
                  <div class="question-item" v-for="(question,index) in unitPlanData.questions" :key="index">
                    <div class="question-label">
                      <strong> Question {{ index + 1 }}: {{ question.name }}</strong>
                    </div>
                    <div class="tag-list-line knowledge-tag-list">
                      <div
                        class="tag-item-line"
                        v-for="(knowledgeTag,knowledgeIndex) in question.knowledgeTags"
                        :key="knowledgeIndex"
                        @click="handleSelectKnowledge(question, knowledgeTag)">
                        <div class="tag-name">
                          <a-tag :color="selectedKnowledgeTagIdList.indexOf(knowledgeTag.id) === -1 ? '' : '#87d068'">
                            {{ knowledgeTag.name }}
                          </a-tag>
                        </div>
                        <div class="tag-desc">
                          <a-tag :color="selectedKnowledgeTagIdList.indexOf(knowledgeTag.id) === -1 ? '' : '#87d068'">
                            {{ knowledgeTag.description }}
                          </a-tag>
                        </div>
                      </div>
                    </div>
                    <div class="tag-list-line skill-tag-list">
                      <div
                        class="tag-item-line"
                        v-for="(skillTag, skillIndex) in question.skillTags"
                        :key="skillIndex"
                        @click="handleSelectSkill(question, skillTag)">
                        <div class="tag-name">
                          <a-tag :color="selectedSkillTagIdList.indexOf(skillTag.id) === -1 ? '' : '#87d068'">
                            {{ skillTag.name }}
                          </a-tag>
                        </div>
                        <div class="tag-desc">
                          <a-tag :color="selectedSkillTagIdList.indexOf(skillTag.id) === -1 ? '' : '#87d068'">
                            {{ skillTag.description }}
                          </a-tag>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'
import { fileTypeMap } from '@/const/material'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { UnitPlanQueryById } from '@/api/unitPlan'
import FileTypeSvg from '@/assets/icons/filetype/file_type.svg?inline'
import VideoTypeSvg from '@/assets/icons/filetype/video.svg?inline'
import LinkTypeSvg from '@/assets/icons/filetype/web.svg?inline'
import ImageTypeSvg from '@/assets/icons/filetype/image.svg?inline'
import AudioTypeSvg from '@/assets/icons/filetype/audio.svg?inline'
import { commonAPIUrl } from '@/api/common'
import { getFileType } from '@/utils/util'
import { MaterialAddOrUpdate, MaterialQueryById } from '@/api/material'

export default {
  name: 'AddUnitPlanMaterial',
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
    materialId: null,
    // eslint-disable-next-line vue/require-default-prop
    unitPlanId: null
  },
  data () {
    return {
      contentLoading: true,
      contentType: typeMap,
      fileType: fileTypeMap,
      material: {
        name: '',
        overview: '',
        concepts: [],
        questions: [],
        fileUrl: '',
        planId: null,
        fileType: 0,
        status: 0
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
        materials: [],
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

      tagList: [],
      selectedKnowledgeTagIdList: [],
      selectedSkillTagIdList: []
    }
  },
  computed: {
    filename () {
      if (this.material && this.material.fileUrl) {
        return this.material.fileUrl.substr(this.material.fileUrl.lastIndexOf('/') + 1)
      }
      return ''
    }
  },
  created () {
    logger.info('restoreData ' + this.unitPlanId + ' ' + this.materialId)
    this.restoreData()
  },
  methods: {
    restoreData () {
      logger.info('restoreUnitPlan ' + this.unitPlanId)
      UnitPlanQueryById({
        id: this.unitPlanId
      }).then(response => {
        logger.info('Material UnitPlanQueryById ' + this.unitPlanId, response.result)
        this.unitPlanData = response.result
        this.initTagList()
      }).then(() => {
        logger.info('restoreMaterial ' + this.materialId)
        MaterialQueryById({
          id: this.materialId
        }).then(response => {
          logger.info('Material MaterialQueryById ' + this.materialId, response.result)
          this.material = response.result
          this.unitPlanData.questions.forEach(question => {
            if (!this.material.questions.find(item => item.id === question.id)) {
              this.material.questions.push({
                id: question.id,
                name: question.name,
                knowledgeTags: [],
                skillTags: []
              })
            }
          })
          logger.info('material.questions ', this.material.questions)
        }).finally(() => {
          this.contentLoading = false
        })
      })
    },

    initTagList () {
      logger.info('initTagList', this.unitPlanData.scenario)
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
      const formData = new FormData()
      formData.append('file', data.file, data.file.name)
      this.uploading = true
      const oldFileUrl = this.material.fileUrl
      const oldFileType = this.material.fileType
      this.material.fileUrl = ''
      this.material.fileType = getFileType(data.file.type)
      this.$http.post(commonAPIUrl.UploadFile, formData, {
        contentType: false,
        processData: false,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
        .then((response) => {
          logger.info('material handleUpload upload response:', response)
          this.material.fileUrl = this.$store.getters.downloadUrl + response.result
        }).catch(err => {
        logger.error('material handleUpload error', err)
        this.$message.error(this.$t('teacher.add-unit-plan.uploading-failed'))
      }).catch((err) => {
        logger.error('handleUpload err', err)
        this.material.fileUrl = oldFileUrl
        this.material.fileType = oldFileType
        logger.error('handleUpload err reset fileUrl', this.material.fileUrl)
      }).finally(() => {
        this.uploading = false
      })
    },

    handleAddUnitPlanMaterial () {
      logger.info('handleAddUnitPlanMaterial ' + this.unitPlanId)
      this.$router.push({
        path: '/teacher/unit-plan-material-redirect/' + this.unitPlanId + '/create'
      })
    },

    handleAddOrUpdateMaterial () {
      const materialData = Object.assign(this.material)

      if (this.materialId) {
        materialData.id = this.materialId
      }

      MaterialAddOrUpdate(materialData).then((response) => {
        logger.info('handleAddOrUpdateMaterial response', response)
        if (response.success) {
          this.$message.success(this.$t('teacher.add-unit-plan.save-material-success'))
        } else {
          this.$message.error(response.message)
        }
      })
    },

    handleAddConcept (concept) {
      logger.info('handleAddConcept', concept)
      if (this.material.concepts.indexOf(concept) === -1) {
        this.material.concepts.push(concept)
        this.tagList.push(concept)
      } else {
        this.material.concepts.splice(this.material.concepts.indexOf(concept), 1)
        this.tagList.push(this.tagList.indexOf(concept), 1)
      }
    },

    handleSelectKnowledge (question, knowledgeTag) {
      logger.info('handleSelectKnowledge', question, knowledgeTag)
      const materialQuestion = this.material.questions.find(item => item.id === question.id)
      if (materialQuestion) {
        logger.info('handleSelectKnowledge materialQuestion', materialQuestion)
        const targetKnowledgeTag = materialQuestion.knowledgeTags.find(item => item.name === knowledgeTag.name && item.id === knowledgeTag.id)
        if (targetKnowledgeTag) {
          logger.info('handleSelectKnowledge remove targetKnowledgeTag', targetKnowledgeTag)
          this.selectedKnowledgeTagIdList.splice(this.selectedKnowledgeTagIdList.indexOf(knowledgeTag.id), 1)
          materialQuestion.knowledgeTags = materialQuestion.knowledgeTags.filter(item => !(item.name === knowledgeTag.name && item.id === knowledgeTag.id))
        } else {
          logger.info('handleSelectSkill add knowledgeTag', knowledgeTag)
          this.selectedKnowledgeTagIdList.push(knowledgeTag.id)
          materialQuestion.knowledgeTags.push(knowledgeTag)
        }
      } else {
        logger.warn('material question dont have matched question', this.material, question)
      }
    },
    handleSelectSkill (question, skillTag) {
      logger.info('handleSelectSkill', question, skillTag)
      const materialQuestion = this.material.questions.find(item => item.id === question.id)
      if (materialQuestion) {
        logger.info('handleSelectSkill materialQuestion', materialQuestion)
        const targetSkillTag = materialQuestion.skillTags.find(item => item.name === skillTag.name && item.id === skillTag.id)
        if (targetSkillTag) {
          logger.info('handleSelectSkill remove targetSkillTag', targetSkillTag)
          this.selectedSkillTagIdList.splice(this.selectedSkillTagIdList.indexOf(skillTag.id), 1)
          materialQuestion.skillTags = materialQuestion.skillTags.filter(item => !(item.name === skillTag.name && item.id === skillTag.id))
        } else {
          logger.info('handleSelectSkill add targetSkillTag', skillTag)
          this.selectedSkillTagIdList.push(skillTag.id)
          materialQuestion.skillTags.push(skillTag)
        }
      } else {
        logger.warn('material question dont have matched question', this.material, question)
      }
      logger.info('after handleSelectSkill', this.selectedSkillTagIdList)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.material-plan-header {
  padding-bottom: 16px;
  border-bottom: 1px solid rgb(235, 238, 240);

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

.material-content {

  .upload-content {
    padding: 30px 0;

    .uploader-wrapper {
      margin: auto;
      display: flex;
      justify-content: center;

      .upload-container {
        padding: 80px 0;
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

        .tag-block {
          padding: 20px 16px;
          margin-bottom: 24px;
          border: 1px dashed rgb(217, 217, 217);
          border-radius: 2px;
        }

        .material-tag {
          margin-top: 10px;
          width: 100%;

          .tag-list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            .tag-label {
              font-weight: bold;
              padding-right: 10px;
            }

            .tag-item {
              font-size: 16px;
              margin-right: 10px;
              margin-bottom: 10px;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              white-space: nowrap;
            }
          }
        }

        .more-tag {
          .tag-list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            .tag-label {
              font-weight: bold;
              padding-right: 10px;
            }

            .tag-item {
              font-size: 16px;
              margin-right: 10px;
              margin-bottom: 10px;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              white-space: nowrap;
            }
          }

          .label-title {
            padding: 15px 0 5px 0;

            strong {
              padding-left: 5px;
              font-size: 16px;
            }
          }
        }
      }
    }
  }

  .more-tag-block {
    .tag-area {
      .question-item {
        padding: 5px 0 5px 0;

        .question-label {
          line-height: 40px;
          font-size: 18px;
          cursor: pointer;
        }

        .tag-list-line {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;

          .tag-item-line {
            padding: 5px 0;
            display: flex;
            justify-content: flex-start;
            flex-direction: row;

            .tag-name {
              width: 20%;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              white-space: nowrap;
            }

            .tag-desc {
              width: 80%;
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

  .action-line {
    padding: 24px 0;
    text-align: center;
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
  }

  .ant-upload-drag-icon {
    height: 50px;
    width: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: auto;

    svg {
      height: 50px;
      width: 50px;
    }
  }
}
</style>
