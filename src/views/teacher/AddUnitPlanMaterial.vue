<template>
  <a-card :bordered="false" :loading="contentLoading" :bodyStyle="{ padding: '16px 24px 60px 24px', height: '100%', minHeight: '500px' }">
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
      <a-col span="4" class="drag-material">
        <div class="material-drag-wrapper">
          <div class="drag-list-wrapper">
            <draggable :list="dragMaterialList" :group="{ name: 'material', pull: 'clone', put: false }" :clone="handleDragMaterialComponent" class="drag-list" :update="null">
              <a-tooltip placement="right" v-for="item in dragMaterialList" :key="item.name">
                <template slot="title">
                  <span> {{ item.name }}</span>
                </template>
                <div class="drag-item" draggable="true">
                  <div class="icon">
                    <text-type-svg v-if="item.type === 'text'"/>
                    <image-type-svg v-else-if="item.type === 'image'"/>
                    <video-type-svg v-else-if="item.type === 'video'"/>
                    <audio-type-svg v-else-if="item.type === 'audio'"/>
                    <embed-type-svg v-else-if="item.type === 'embed'"/>
                    <upload-svg v-else/>
                  </div>
                  <div class="label">
                    {{ item.name }}
                  </div>
                </div>
              </a-tooltip>
            </draggable>
          </div>
          <div class="drag-tips">
          </div>
        </div>
      </a-col>
      <a-col span="20" class="upload-content">
        <div class="uploader-wrapper">
          <div class="uploader-container">
            <div class="uploader">
              <div class="slider-wrapper">
                <div class="slider-content">
                  <div class="no-material-tips" v-if="!materialList.length">
                    <a-icon type="link" /> {{ $t('teacher.add-unit-plan.drag-component-here-tips') }}
                  </div>
                  <draggable
                    animation="300"
                    v-model="materialList"
                    group="material"
                    @start="drag=true"
                    @end="drag=false"
                    class="slide-draggable"
                    @change="handleSlideChange">
                    <div v-for="(materialItem,index) in materialList" :key="index" class="material-item">
                      {{ materialItem.name }}
                      <div class="move-icon">
                        <a-icon type="form" />
                      </div>
                      <div class="delete-icon" @click="handleDeleteMaterial(materialItem)">
                        <a-icon type="close-square" />
                      </div>
                    </div>
                  </draggable>
                </div>
              </div>
            </div>
            <div class="info block-item">
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
                        :placeholder="$t('teacher.add-unit-plan.overview')"
                        v-model="material.overview" />
                    </div>
                  </div>
                </a-col>
              </a-row>
            </div>
            <div class="material-tag tag-block block-item">
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
            <div class="more-tag tag-block block-item">
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
import TextTypeSvg from '@/assets/icons/material/text.svg?inline'
import ImageTypeSvg from '@/assets/icons/material/image.svg?inline'
import VideoTypeSvg from '@/assets/icons/material/video.svg?inline'
import AudioTypeSvg from '@/assets/icons/material/audio.svg?inline'
import EmbedTypeSvg from '@/assets/icons/material/embed.svg?inline'
import { commonAPIUrl } from '@/api/common'
import { getFileType } from '@/utils/util'
import { MaterialAddOrUpdate, MaterialQueryById } from '@/api/material'

import draggable from 'vuedraggable'

export default {
  name: 'AddUnitPlanMaterial',
  components: {
    draggable,
    ContentTypeIcon,
    TextTypeSvg,
    ImageTypeSvg,
    VideoTypeSvg,
    AudioTypeSvg,
    EmbedTypeSvg
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
      dragMaterialList: [
        {
          name: this.$t('teacher.add-unit-plan.add-material-text-type'),
          type: 'text'
        },
        {
          name: this.$t('teacher.add-unit-plan.add-material-image-type'),
          type: 'image'
        },
        {
          name: this.$t('teacher.add-unit-plan.add-material-video-type'),
          type: 'video'
        },
        {
          name: this.$t('teacher.add-unit-plan.add-material-audio-type'),
          type: 'audio'
        },
        {
          name: this.$t('teacher.add-unit-plan.add-material-embed-type'),
          type: 'embed'
        }
      ],
      materialList: [],
      currentMaterialId: null,
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
    },

    handleSlideChange (event) {
      logger.info('handleSlideChange', event)
    },

    handleDragMaterialComponent (data) {
      logger.info('handleDragMaterialComponent', data)
      let id = Math.random() + ''
      while (this.materialList.find(item => item.id === id)) {
        id = Math.random()
      }
      const item = Object.assign({
        id: Math.random() + '',
        extra: {
          url: null,
          preview: null,
          data: null
        }
      }, data)
      logger.info('handleDragMaterialComponent item', item)
      this.currentMaterialId = id
      return item
    },

    handleDeleteMaterial (materialItem) {
      logger.info('handleDeleteMaterial', materialItem)
      this.materialList = this.materialList.filter(item => item.id !== materialItem.id)
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

  .drag-material {
    height: 100%;
    .material-drag-wrapper {
      padding-top: 20px;
      padding-right: 24px;
      .drag-list-wrapper {
        .drag-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-gap: 8px;

          .drag-item {
            cursor: pointer;
            user-select: none;
            padding: 10px 0;
            border-radius: 4px;
            background-color: white;
            border: 1px solid #E5E5E5;
            box-sizing: border-box;
            box-shadow: @box-shadow-base;
            z-index: 10;
            outline: none;
            display: flex;
            flex-direction: column;
            flex-wrap: nowrap;
            flex-basis: auto;
            justify-content: center;
            align-items: center;
            transition: all 0.2s ease-in;

            &:hover {
              background-color: rgba(200, 200, 200, 0.2);
            }

            .icon {
              width: 32px;
              height: 32px;

              svg {
                width: 32px;
                height: 32px;
              }
            }

            .label {
              font-size: 10px;
              text-align: center;
              color: @text-color;
            }
          }
        }
      }

      .drag-tips {
        font-size: 13px;
        text-align: center;
        padding: 30px 0 20px 0;
        color: @text-color-secondary;
      }
    }
  }

  .upload-content {
    padding: 20px 50px;
    background-color: #edf1f5;

    .uploader-wrapper {
      margin: auto;
      display: flex;
      justify-content: center;

      .upload-container {
        padding: 80px 0;
      }
      .uploading-tips {
        padding-left: 10px;
      }

      .uploader-container {
        display: block;
        width: 100%;

        .slider-wrapper {
          background-color: #fff;
          border-radius: 3px;
          margin-bottom: 15px;
          box-shadow: 0 4px 8px 0 rgba(31, 33, 44, 10%);
          padding: 20px;
          position: relative;

          .slider-content {
            box-sizing: border-box;
            height: 100%;
            min-height: 480px;

            .no-material-tips {
              position: absolute;
              left: 50%;
              width: 200px;
              text-align: center;
              margin-left: -100px;
              top: 50%;
              margin-top: -20px;
              cursor: pointer;
              user-select: none;
              z-index: 1;
            }

            .slide-draggable {
              min-height: 480px;
              z-index: 10;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;

              .material-item {
                box-sizing: border-box;
                border: 2px solid #fff;
                width: 100%;
                padding: 20px 10px;
                display: flex;
                justify-content: center;
                flex-direction: row;
                position: relative;
                cursor: auto;
                &:hover {
                  border: 2px solid #aaa;
                  .move-icon {
                    display: block;
                   &:hover {
                     color: #3378ED;
                   }
                  }
                  .delete-icon {
                    display: block;
                    &:hover {
                      color: #D01919;
                    }
                  }
                }

                .move-icon {
                  display: none;
                  position: absolute;
                  left: -8px;
                  top: -12px;
                  line-height: 20px;
                  cursor: pointer;
                  background-color: #fff;
                  font-size: 20px;
                  padding: 2px;
                }

                .delete-icon {
                  display: none;
                  position: absolute;
                  right: -12px;
                  top: -15px;
                  line-height: 20px;
                  cursor: pointer;
                  padding: 2px;
                  background-color: #fff;
                  font-size: 20px;
                }
              }
            }
          }
        }

        .block-item {
          background-color: #fff;
          padding: 10px 20px;
          box-shadow: 0 4px 8px 0 rgba(31, 33, 44, 10%);
        }

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
          margin-bottom: 15px;
          border-radius: 2px;
        }

        .material-tag {
          margin-top: 15px;
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
