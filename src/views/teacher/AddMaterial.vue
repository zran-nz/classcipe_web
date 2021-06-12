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
              <template v-show="material">
                {{ material.name }}
              </template>
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
            <draggable
              :list="dragMaterialList"
              :group="{ name: 'material', pull: 'clone', put: false }"
              :clone="handleDragMaterialComponent"
              class="drag-list"
              :update="null">
              <a-tooltip placement="right" v-for="item in dragMaterialList" :key="item.name">
                <template slot="title">
                  <span> {{ item.name }}</span>
                </template>
                <div class="drag-item">
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
                    @add="handleDragMaterialAdd"
                    @change="handleSlideChange">
                    <div v-for="(materialItem,index) in materialList" :key="index" class="material-item" @dblclick="handleDbClickMaterialItem(materialItem)">
                      <div class="move-icon" @click="handleDbClickMaterialItem(materialItem)">
                        <a-icon type="form" />
                      </div>
                      <div class="delete-icon" @click="handleDeleteMaterial(materialItem)">
                        <a-icon type="close-square" />
                      </div>
                      <div class="material-item-content-wrapper">
                        <div class="material-item-content">
                          <template v-if="materialItem.type === 'text'">
                            <div class="material-text-content" v-html="materialItem.description"></div>
                          </template>
                          <template v-if="materialItem.type === 'image'">
                            <div class="material-image-content">
                              <img :src="materialItem.fileUrl" alt="" v-if="materialItem && materialItem.fileUrl">
                            </div>
                          </template>
                          <template v-if="materialItem.type === 'audio'">
                            <div class="material-audio-content" :data-url="materialItem.fileUrl">
                              <audio :src="materialItem.fileUrl" v-show="materialItem && materialItem.fileUrl" controls />
                            </div>
                          </template>
                          <template v-if="materialItem.type === 'video'">
                            <div class="material-video-content" :data-url="materialItem.fileUrl">
                              <video :src="materialItem.fileUrl" v-show="materialItem && materialItem.fileUrl" controls />
                            </div>
                          </template>
                          <template v-if="materialItem.type === 'embed'">
                            <div class="material-embed-content" :data-url="materialItem.fileUrl">
                              <span class="iframe-url">
                                {{ materialItem.fileUrl }}
                              </span>
                            </div>
                          </template>
                        </div>
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
                        :placeholder="$t('teacher.add-unit-plan.material-overview')"
                        v-model="material.overview" />
                    </div>
                  </div>
                </a-col>
              </a-row>
            </div>
            <!--            <div class="material-tag tag-block block-item">-->
            <!--              <div class="tag-list">-->
            <!--                <div class="tag-label">{{ $t('teacher.add-unit-plan.material-tag') }}:</div>-->
            <!--                <div class="tag-item" v-for="(tag,index) in tagList" :key="index">-->
            <!--                  <a-tag :color="tagColorList[index % tagColorList.length]">-->
            <!--                    <a-tooltip :title="tag">-->
            <!--                      {{ tag }}-->
            <!--                    </a-tooltip>-->
            <!--                  </a-tag>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </div>-->
            <!--            <div class="more-tag tag-block block-item">-->
            <!--              <div class="more-tag-block">-->
            <!--                <div class="label-title">-->
            <!--                  <a-icon type="plus" />-->
            <!--                  <strong> {{ $t('teacher.add-unit-plan.more-tag') }}</strong>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--              <div class="more-tag-block">-->
            <!--                <div class="label-title">-->
            <!--                  {{ $t('teacher.add-unit-plan.concepts') }}&nbsp;:-->
            <!--                </div>-->
            <!--                <div class="tag-area">-->
            <!--                  <div class="tag-list">-->

            <!--                  </div>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--              <div class="more-tag-block">-->
            <!--                <div class="label-title">-->
            <!--                  {{ $t('teacher.add-unit-plan.key-question') }}-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>
        </div>

        <a-modal
          :maskClosable="false"
          :destroyOnClose="true"
          v-model="materialModalVisible"
          :title="currentMaterialTitle"
          @afterClose="handleCancelMaterial"
          :footer="null"
          :closable="false"
          width="800px">
          <div class="material-modal-wrapper">
            <div class="material-content" v-if="currentMaterial">
              <div class="uploading-mask" v-show="currentMaterialUploading">
                <div class="uploading">
                  <a-spin large />
                </div>
              </div>
              <template v-if="currentMaterial.type === 'text'">
                <text-editor :value="currentMaterial.description" ref="editor" @change="handleTextEditContentChange"></text-editor>
              </template>
              <template v-if="currentMaterial.type === 'image'">
                <image-material-select @ok="handleSelectMaterialImage" @cancel="handleCancelMaterial"/>
              </template>
              <template v-if="currentMaterial.type === 'audio'">
                <div class="audio-material-content">
                  <div class="link-url" v-show="currentMaterial.fileUrl">
                    <a-icon type="link" />
                    <span class="link-url-txt" @click="handleOpenUrl(currentMaterial.fileUrl)">{{ currentMaterial.fileUrl }}</span>
                  </div>
                  <div class="audio" v-show="currentMaterial.fileUrl">
                    <audio :src="currentMaterial.fileUrl" controls />
                  </div>
                </div>
                <div class="audio-material-action">
                  <div class="action-item">
                    <a-upload name="file" accept="audio/*" :customRequest="handleUploadAudio" :showUploadList="false">
                      <a-button type="primary" icon="upload">{{ $t('teacher.add-unit-plan.upload-audio') }}</a-button>
                    </a-upload>
                  </div>
                  <a-divider>
                    {{ $t('teacher.add-unit-plan.or') }}
                  </a-divider>
                  <div class="action-item-column">
                    <vue-record-audio mode="press" @result="handleAudioResult" />
                    <div class="action-tips">
                      {{ $t('teacher.add-unit-plan.record-your-voice') }}
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="currentMaterial.type === 'video'">
                <div class="video-material-content">
                  <div class="link-url" v-show="currentMaterial.fileUrl">
                    <a-icon type="link" />
                    <span class="link-url-txt" @click="handleOpenUrl(currentMaterial.fileUrl)">{{ currentMaterial.fileUrl }}</span>
                  </div>
                  <div class="video" v-show="currentMaterial.fileUrl">
                    <video :src="currentMaterial.fileUrl" controls />
                  </div>
                </div>
                <div class="video-material-action">
                  <div class="action-item">
                    <a-upload name="file" accept="video/*" :customRequest="handleUploadAudio" :showUploadList="false">
                      <a-button type="primary" icon="upload">{{ $t('teacher.add-unit-plan.upload-video') }}</a-button>
                    </a-upload>
                  </div>
                </div>
              </template>
              <template v-if="currentMaterial.type === 'embed'">
                <div class="embed-material-action">
                  <div class="label">
                    {{ $t('teacher.add-unit-plan.paste-link') }}
                  </div>
                  <div class="action-item">
                    <a-input :placeholder="$t('teacher.add-unit-plan.paste-link-placeholder')" v-model="currentMaterial.fileUrl"/>
                    <a-button class="preview-action" @click="iframeUrl = currentMaterial.fileUrl">{{ $t('teacher.add-unit-plan.paste-link-preview') }}</a-button>
                  </div>
                </div>
                <div class="embed-material-content">
                  <iframe v-if="iframeUrl" :src="iframeUrl"></iframe>
                </div>
              </template>
            </div>
            <div class="material-action" v-show="currentMaterial && ['text', 'audio', 'video', 'embed'].indexOf(currentMaterial.type) !== -1 ">
              <a-button key="back" @click="handleCancelMaterial" class="action-item">
                Cancel
              </a-button>
              <a-button key="submit" type="primary" @click="handleConfirmMaterial" class="action-item">
                Ok
              </a-button>
            </div>
          </div>
        </a-modal>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'
import { fileTypeMap } from '@/const/material'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import TextTypeSvg from '@/assets/icons/material/text.svg?inline'
import ImageTypeSvg from '@/assets/icons/material/image.svg?inline'
import VideoTypeSvg from '@/assets/icons/material/video.svg?inline'
import AudioTypeSvg from '@/assets/icons/material/audio.svg?inline'
import EmbedTypeSvg from '@/assets/icons/material/embed.svg?inline'
import { commonAPIUrl } from '@/api/common'
import { getFileType } from '@/utils/util'
import { MaterialAddOrUpdate, MaterialQueryById } from '@/api/material'

import draggable from 'vuedraggable'
import TextEditor from '@/components/Editor/WangEditor'
import ImageMaterialSelect from '@/components/UnitPlan/ImageMaterialSelect'

const { getFileTypeByName, getTypeNameByType } = require('@/const/material')

export default {
  name: 'AddMaterial',
  components: {
    draggable,
    TextEditor,
    ContentTypeIcon,
    ImageMaterialSelect,
    TextTypeSvg,
    ImageTypeSvg,
    VideoTypeSvg,
    AudioTypeSvg,
    EmbedTypeSvg
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    materialId: null
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
      selectedSkillTagIdList: [],
      materialModalVisible: false,
      currentMaterial: null,
      currentMaterialDescription: null,
      currentMaterialTitle: '',
      currentMaterialUploading: false,
      iframeUrl: ''
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
    logger.info('restoreData ' + this.materialId)
    if (this.materialId === 'create') {
      this.initMaterial()
    } else {
      this.restoreData()
    }
  },
  methods: {
    initMaterial () {
      const materialData = {
        name: 'Unnamed Material',
        overview: '',
        fileUrl: '',
        concepts: [],
        fileType: 0,
        questions: [],
        status: 0
      }

      MaterialAddOrUpdate(materialData).then((response) => {
        logger.info('MaterialAddOrUpdate response', response.result)
        if (response.success) {
          this.$router.replace({
            path: '/teacher/add-material/' + response.result.id
          })
        } else {
          this.$message.error(response.message)
        }
      })
    },
    restoreData () {
      logger.info('restoreMaterial ' + this.materialId)
      MaterialQueryById({
        id: this.materialId
      }).then(response => {
        logger.info('Material MaterialQueryById ' + this.materialId, response.result)
        this.material = response.result
        this.material.files.forEach(item => {
          const fileItem = Object.assign({}, item)
          fileItem.type = getTypeNameByType(item.fileType)
          this.materialList.push(fileItem)
        })
        logger.info('material.questions ', this.material.questions)
      }).finally(() => {
        this.contentLoading = false
      })
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

    handleAddOrUpdateMaterial () {
      const materialData = Object.assign(this.material)
      if (this.materialId) {
        materialData.id = this.materialId
      }
      logger.info('handleAddOrUpdateMaterial materialData', materialData)
      logger.info('materialList ', this.materialList)
      const files = []
      this.materialList.forEach(item => {
        if (item.id && item.id.indexOf('new_') !== -1) {
          files.push({
            description: item.description,
            fileType: getFileTypeByName(item.type),
            fileUrl: item.fileUrl
          })
        } else {
          files.push({
            description: item.description,
            fileType: getFileTypeByName(item.type),
            fileUrl: item.fileUrl,
            id: item.id
          })
        }
      })
      materialData.files = files
      logger.info('after format materialData', materialData)
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
      let id = 'new_' + (Math.random())
      while (this.materialList.find(item => item.id === id)) {
        id = 'new_' + (Math.random())
      }
      const item = Object.assign({
        id,
        fileUrl: null,
        fileType: -1,
        description: null
      }, data)
      logger.info('handleDragMaterialComponent item', item)
      this.currentMaterialId = id
      this.currentMaterialTitle = item.name
      this.currentMaterial = item
      return item
    },

    handleDragMaterialAdd (event) {
      logger.info('handleDragMaterialAdd', event, this.currentMaterial)
      this.materialModalVisible = true
    },

    handleDeleteMaterial (materialItem) {
      logger.info('handleDeleteMaterial', materialItem)
      this.materialList = this.materialList.filter(item => item.id !== materialItem.id)
    },

    handleDbClickMaterialItem (materialItem) {
      logger.info('handleDbClickMaterialItem ', materialItem)
      this.currentMaterial = Object.assign({}, materialItem)
      this.currentMaterialTitle = materialItem.name
      this.materialModalVisible = true
    },

    handleConfirmMaterial () {
      this.currentMaterialUploading = true
      logger.info('handleConfirmMaterial ', this.currentMaterial, this.materialList)
      if (this.currentMaterial.type === 'text') {
        this.currentMaterial.description = this.currentMaterialDescription
        logger.info('update text desc ' + this.currentMaterial.description)
      }
      let targetIndex = -1
      for (let index = 0; index < this.materialList.length; index++) {
        if (this.materialList[index] && this.materialList[index].id === this.currentMaterial.id) {
          targetIndex = index
          logger.info('find targetIndex ' + targetIndex)
          break
        }
      }

      if (targetIndex !== -1) {
        this.materialList.splice(targetIndex, 1, Object.assign({}, this.currentMaterial))
        logger.info('handleConfirmMaterial after update ', this.materialList[targetIndex])
      } else {
        logger.warn('not found target material')
      }
      this.currentMaterialUploading = false
      this.materialModalVisible = false
    },

    handleCancelMaterial () {
      logger.info('handleCancelMaterial')
      this.currentMaterialUploading = false
      this.materialModalVisible = false
      this.currentMaterial = null
      this.currentMaterialTitle = ''
    },

    handleTextEditContentChange (data) {
      logger.info('handleTextEditContentChange', data)
      this.currentMaterialDescription = data
    },

    handleSelectMaterialImage (data) {
      logger.info('handleSelectMaterialImage ', data)
      this.currentMaterial.description = data
      this.currentMaterial.fileUrl = data
      this.handleConfirmMaterial()
    },

    handleAudioResult (data) {
      logger.info('handleAudioResult', data)
      this.currentMaterialUploading = true
      this.currentMaterial.data = window.URL.createObjectURL(data)
      const formData = new FormData()
      formData.append('file', data, 'audio.wav')
      this.$http.post(commonAPIUrl.UploadFile, formData, { contentType: false, processData: false, headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 })
        .then((response) => {
          logger.info('handleAudioResult upload response:', response)
          this.currentMaterial.fileUrl = this.$store.getters.downloadUrl + response.result
          logger.info('handleAudioResult currentMaterial', this.currentMaterial)
        }).catch(err => {
        logger.error('handleAudioResult error', err)
      }).finally(() => {
        this.currentMaterialUploading = false
      })
    },

    handleOpenUrl (url) {
      window.open(url)
    },

    handleUploadAudio (data) {
      logger.info('handleUploadAudio', data)
      this.currentMaterialUploading = true
      const formData = new FormData()
      formData.append('file', data.file, data.file.name)
      this.uploading = true
      this.$http.post(commonAPIUrl.UploadFile, formData, { contentType: false, processData: false, headers: { 'Content-Type': 'multipart/form-data' }, timeout: 60000 })
        .then((response) => {
          logger.info('handleUploadAudio upload response:', response)
          this.currentMaterial.fileUrl = this.$store.getters.downloadUrl + response.result
        }).catch(err => {
        logger.error('handleUploadImage error', err)
      }).finally(() => {
        this.currentMaterialUploading = false
      })
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

                .material-item-content-wrapper {
                  padding: 0;
                  margin: 0;
                  width: 100%;
                  text-align: center;
                  .material-audio-content {
                    display: block;
                    audio {
                      margin: auto;
                      display: block;
                      height: 40px;
                    }
                  }

                  .material-video-content {
                    display: block;
                    video {
                      margin: auto;
                      display: block;
                    }
                  }

                  .material-embed-content {
                    .iframe-url {
                      color: @primary-color;
                      &:hover {
                        text-decoration: underline;
                      }
                    }
                  }
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

  .audio-material-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .link-url {
      text-align: center;
      height: 20px;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      margin-bottom: 10px;
      line-height: 20px;
      color: @text-color;
      cursor: pointer;

      i {
        padding-top: 3px;
        line-height: 20px;
        height: 20px;
      }

      .link-url-txt {
        padding-left: 5px;
      }

      &:hover {
        color: @primary-color;
      }
    }

    .audio {
      padding: 10px 0;
    }
  }

  .video-material-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .link-url {
      text-align: center;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      margin-bottom: 10px;
      line-height: 20px;
      color: @text-color;
      cursor: pointer;
      padding: 10px 0;

      i {
        padding-top: 3px;
        line-height: 20px;
        height: 20px;
      }

      .link-url-txt {
        padding-left: 5px;
      }

      &:hover {
        color: @primary-color;
      }
    }

    .video {
      padding: 10px 0;
    }
  }

  .audio-material-action, .video-material-action, .embed-material-action {
    display: flex;
    flex-direction: column;
    .action-item {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 15px 0;
    }

    .action-item-column {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 15px 0;
      .action-tips {
        line-height: 32px;
        cursor: pointer;
        user-select: none;
      }
    }
  }

  .embed-material-content {
    iframe {
      margin-top: 20px;
      border: 1px solid #aaa;
      width: 100%;
      min-height: 300px;
      box-shadow: @box-shadow-base;
    }
  }

  .embed-material-action {
    .label {
      display: block;
    }
  }

  .preview-action {
    margin-left: 20px;
  }
}

.material-action {
  padding: 10px 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .action-item {
    margin-left: 20px;
  }
}

.material-modal-wrapper {
  position: relative;
  .material-content {
    position: relative;
    .uploading-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: fade(#eee, 80%);
      z-index: 100;
      .uploading {
        z-index: 110;
        position: absolute;
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100px;
        left: 50%;
        top: 45%;
        margin-left: -50px;
      }
    }
  }
}
</style>
