<template>
  <div class='my-full-form-wrapper'>
    <div class='form-header'>
      <common-form-header
        ref='commonFormHeader'
        :form='form'
        :is-preview-mode='true'
        :last-change-saved-time='lastChangeSavedTime'
        @back='closeWindow'
      />
    </div>
    <div class='preview-header-mask' @click='handleClickPreviewMask'></div>
    <a-card :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '1200px', 'position': 'relative' }" :bordered='false'>
      <div class='preview-mask' @click='handleClickPreviewMask'></div>
      <a-row v-if='!contentLoading' class='unit-content'>
        <a-col class='main-content' span='24'>
          <a-card
            :body-style="{ padding: '16px', display: 'flex', 'justify-content': 'space-between'}"
            :bordered='false'
            class='card-wrapper'>
            <div
              ref='form'
              :style="{'width':leftWidth + 'px'}"
              class='unit-plan-form-left root-locate-form'
              @click='focusInput($event)'>
              <a-form-model :model='form' class='my-form-wrapper'>
                <a-steps :current='currentActiveStepIndex' direction='vertical'>
                  <a-step :status="currentActiveStepIndex === 0 ? 'process':'wait'" title='Edit Unit plan'>
                    <template slot='description'>
                      <div class='step-detail' v-show='currentActiveStepIndex === 0' >

                        <template v-for='fieldItem in formConfigPreviewData.planCommonList'>
                          <div class='form-block' v-if='fieldItem.visible && fieldItem.fieldName === planField.Name' :key='fieldItem.fieldName'>
                            <a-form-item>
                              <template class='my-label' slot='label'>
                                {{ 'Unit Name' | unitLabelName(planField.Name, formConfigPreviewData) }}
                                <a-tooltip :title="'Unit Name' | unitLabelHint(planField.Name, formConfigPreviewData)" placement='top'>
                                  <a-icon type="info-circle" />
                                </a-tooltip>
                              </template>
                              <a-input v-model='form.name' class='my-form-input' placeholder='Enter Unit Name' />
                            </a-form-item>
                          </div>

                          <div class='form-block form-radio-wrapper' v-if='fieldItem.visible && fieldItem.fieldName === planField.ProjectBased' :key='fieldItem.fieldName'>
                            <a-form-item style='display:flex'>
                              <template class='my-label' slot='label'>
                                {{ 'Project-based Unit' | unitLabelName(planField.ProjectBased, formConfigPreviewData) }}
                                <a-tooltip :title="'Project-based Unit' | unitLabelHint(planField.ProjectBased, formConfigPreviewData)" placement='top'>
                                  <a-icon type="info-circle" />
                                </a-tooltip>
                              </template>

                              <a-radio-group name='radioGroup' v-model='form.projectBased' style='margin-left:20px;'>
                                <a-radio :value='1'>
                                  Yes
                                </a-radio>
                                <a-radio :value='0'>
                                  No
                                </a-radio>
                              </a-radio-group>
                            </a-form-item>
                          </div>

                          <div class='form-block form-radio-wrapper' v-if='fieldItem.visible && fieldItem.fieldName === planField.UnitType' :key='fieldItem.fieldName'>
                            <a-form-item style='display:flex'>
                              <template class='my-label' slot='label'>
                                {{ 'Unit type' | unitLabelName(planField.UnitType, formConfigPreviewData) }}
                                <a-tooltip :title="'Unit type' | unitLabelHint(planField.UnitType, formConfigPreviewData)" placement='top'>
                                  <a-icon type="info-circle" />
                                </a-tooltip>
                              </template>

                              <a-radio-group name='unitType' v-model='form.unitType' style='margin-left:20px;'>
                                <a-radio :value='0'>
                                  Single-subject Unit
                                </a-radio>
                                <a-radio :value='1'>
                                  Integrated Unit
                                </a-radio>
                              </a-radio-group>
                            </a-form-item>
                          </div>

                          <div class='form-block grade-time' v-if="fieldItem.visible && fieldItem.fieldName === planField.GradeId" :key='fieldItem.fieldName'>
                            <a-form-item style='width:26%;margin-bottom: 0;'>
                              <template class='my-label' slot='label'>
                                {{ 'Grade level' | unitLabelName(planField.GradeId, formConfigPreviewData) }}
                                <a-tooltip :title="'Grade level' | unitLabelHint(planField.GradeId, formConfigPreviewData)" placement='top'>
                                  <a-icon type="info-circle" />
                                </a-tooltip>
                              </template>
                              <a-select
                                :getPopupContainer="trigger => trigger.parentElement"
                                v-model='form.gradeId'
                                class='my-big-select'
                                placeholder='Select a grade'
                                size='large'>
                                <a-select-option v-for='(grade,index) in gradeList' :key='index' :value='grade.id'>
                                  {{ grade.name }}
                                </a-select-option>
                              </a-select>
                            </a-form-item>
                            <a-form-item
                              class='range-time'
                              label='Start Date'
                              style='width:70%;margin-bottom: 0px;position:relative'>
                              <div v-if='getWeek' class='week-time'>
                                <a-tag color='cyan' style='border-radius: 10px;font-size: 14px;'>
                                  {{ getWeek }}
                                </a-tag>
                              </div>
                              <a-range-picker
                                v-model='rangeDate'
                                :show-time="{ format: 'HH:mm' }"
                                format='LLL'
                                size='large'
                                style='width:100%'>
                                <a-icon slot='suffixIcon' type='calendar' />
                              </a-range-picker>
                            </a-form-item>
                          </div>

                          <div id='inquiry' class='form-block inquiry-form-block' v-if="fieldItem.visible && fieldItem.fieldName === planField.Inquiry" :key='fieldItem.fieldName'>
                            <a-form-item class='bigIdea'>
                              <template class='my-label' slot='label'>
                                {{ 'Big Idea/ Statement of Inquiry/ Central Idea' | unitLabelName(planField.Inquiry, formConfigPreviewData) }}
                                <a-tooltip :title="'Big Idea/ Statement of Inquiry/ Central Idea' | unitLabelHint(planField.Inquiry, formConfigPreviewData)" placement='top'>
                                  <a-icon type="info-circle" />
                                </a-tooltip>
                              </template>
                              <a-textarea
                                v-model='form.inquiry'
                                :placeholder="$store.getters.currentRole === 'teacher' ? $t('teacher.add-unit-plan.teacher-direction-of-inquiry') : $t('teacher.add-unit-plan.expert-direction-of-inquiry')"
                                auto-size
                                class='my-form-textarea inquiry'
                              />
                            </a-form-item>
                            <a-tooltip title='Browse' @click.stop='selectBigIdeaDataVisible=true'>
                              <span class='browse'>
                                <a-icon theme='twoTone' twoToneColor='rgba(21, 195, 154, 1)' type='appstore' />
                              </span>
                            </a-tooltip>
                          </div>

                          <div class='form-block' v-if="fieldItem.visible && fieldItem.fieldName === planField.Scenarios" :key='fieldItem.fieldName'>
                            <a-divider>Teaching goals</a-divider>
                            <a-row>
                              <a-col span='24'>
                                <div class='form-block-title'>
                                  {{ 'UN Sustainable Development Goal(s)' | unitLabelName(planField.Scenarios, formConfigPreviewData) }}
                                  <a-tooltip :title="'UN Sustainable Development Goal(s)' | unitLabelHint(planField.Scenarios, formConfigPreviewData)" placement='top'>
                                    <a-icon type="info-circle" />
                                  </a-tooltip>
                                </div>
                              </a-col>
                            </a-row>
                            <!--sdg and KeyWords-->
                            <div
                              v-for='(scenario, sdgIndex) in form.scenarios'
                              id='sdg'
                              :key='sdgIndex'
                              class='sdg-content-blocks sdg-form-block'
                            >
                              <!--description-->
                              <div class='scenario-description'>
                                <div
                                  v-show='form.scenarios.length > 1'
                                  class='sdg-delete-wrapper'
                                  @click='handleDeleteSdg(sdgIndex)'>
                                  <a-tooltip placement='top'>
                                    <template slot='title'>
                                      <span>{{ $t('teacher.add-unit-plan.delete-goal') }}</span>
                                    </template>
                                    <div class='sdg-delete'>
                                      <a-icon :style="{ fontSize: '20px' }" type='delete' />
                                    </div>
                                  </a-tooltip>
                                </div>
                                <!--sdg-->
                                <a-form-model-item>
                                  <a-select
                                    :getPopupContainer="trigger => trigger.parentElement"
                                    v-model='scenario.sdgId'
                                    class='my-big-select'
                                    placeholder='Select a goal from UN'
                                    size='large'>
                                    <a-select-option
                                      v-for='(sdg,index) in sdgList'
                                      :key='index'
                                      :disabled='selectedSdg.indexOf(sdg.id) != -1'
                                      :value='sdg.id'>
                                      {{ sdg.name }}
                                    </a-select-option>
                                  </a-select>
                                </a-form-model-item>

                                <a-form-model-item>
                                  <input-search
                                    ref='descriptionInputSearch'
                                    :currend-index='currentIndex'
                                    :default-value='scenario.description'
                                    :key-index='sdgIndex'
                                    :search-list='descriptionSearchList'
                                    label='description'
                                    @reset='descriptionSearchList = []'
                                  />
                                </a-form-model-item>

                              </div>

                            </div>
                            <a-button
                              class='add-button'
                              icon='plus-circle'
                              size='large'
                              style='top:-20px'
                              type='link'
                              @click='handleAddMoreSdg'></a-button>
                          </div>

                          <div class='form-block form-block-rwc' v-if="fieldItem.visible && fieldItem.fieldName === planField.Rwc" :key='fieldItem.fieldName'>
                            <a-form-model-item>
                              <template class='my-label' slot='label'>
                                {{ 'Real World Connection(s)' | unitLabelName(planField.Rwc, formConfigPreviewData) }}
                                <a-tooltip :title="'Real World Connection(s)' | unitLabelHint(planField.Rwc, formConfigPreviewData)" placement='top'>
                                  <a-icon type="info-circle" />
                                </a-tooltip>
                              </template>
                              <a-select
                                :getPopupContainer="trigger => trigger.parentElement"
                                size='large'
                                v-model='form.rwc'
                                placeholder='Choose real world connection'>
                                <a-select-option :value='item.id' v-for='(item, index) in rwcList' :key='index'>
                                  {{ item.name }}
                                </a-select-option>
                              </a-select>
                            </a-form-model-item>
                          </div>

                          <div
                            :class="{'form-block': true, 'form-block-disabled' : $store.getters.userInfo.disableQuestion}"
                            v-if="fieldItem.visible && fieldItem.fieldName === planField.Question"
                            :key='fieldItem.fieldName'>
                            <a-form-item class='unit-question'>
                              <span slot='label'>
                                <a-tooltip :title="'Set key question/Line of inquiry' | unitLabelHint(planField.Question, formConfigPreviewData)">
                                  <a-icon
                                    style='color: #15c39a;cursor: pointer;font-size: 18px'
                                    type='exclamation-circle'
                                    @click='questionSettingVisible=true' />
                                </a-tooltip>
                                {{ 'Key question(s) / Line(s) of inquiry' | unitLabelName(planField.Question, formConfigPreviewData) }}
                              </span>
                              <div v-if='!$store.getters.userInfo.disableQuestion'>
                                <div class='question-more'>
                                  <a-button type='link' @click='questionMoreVisible=true'>more</a-button>
                                </div>
                                <div v-if='showRecommendQuestion' class='recommend-question'>
                                  <a-icon class='close-icon' type='close' @click.stop='hideRecommendQuestion=true' />
                                  <div class='recommend-box'>
                                    <a-tooltip
                                      title='You can add the key questions relevant to the big idea you chose above'>
                                      <span class='title'><a-icon style='width: 25px' type='question-circle' />Recommended:</span>
                                    </a-tooltip>
                                    <ul class='recommend-ul'>
                                      <li
                                        v-for='(item,rqIndex) in recommendQuestionList'
                                        v-if='rqIndex < 3 && selectQuestion.indexOf(item.name) === -1'
                                        :key='rqIndex'>
                                        {{ item.name }}
                                        <a-button class='add-question' type='link' @click.stop='handerInsertQuestion(item)'>
                                          add
                                        </a-button>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                <div v-for='(question, index) in form.questions' :key='index' class='form-input-item'>
                                  <a-textarea
                                    v-model='question.name'
                                    :placeholder="$store.getters.currentRole === 'teacher' ? $t('teacher.add-unit-plan.teacher-nth-key-question') : $t('teacher.add-unit-plan.expert-nth-key-question')"
                                    auto-size
                                    class='my-form-textarea' />
                                  <div
                                    v-if='form.questions.length > 1'
                                    class='delete-icon'
                                    @click='handleRemoveQuestion(index)'>
                                    <a-icon :style="{ fontSize: '20px' }" type='delete' />
                                  </div>
                                </div>
                              </div>
                            </a-form-item>
                            <a-button
                              v-if='!$store.getters.userInfo.disableQuestion'
                              class='add-button'
                              icon='plus-circle'
                              size='large'
                              style='top:-40px;'
                              type='link'
                              @click='handleAddMoreQuestion'></a-button>
                          </div>

                          <div class='form-block' v-if="fieldItem.visible && fieldItem.fieldName === planField.LearnOuts" :key='fieldItem.fieldName'>
                            <a-form-item>
                              <template class='my-label' slot='label'>
                                {{ 'Set learning objectives' | unitLabelName(planField.LearnOuts, formConfigPreviewData) }}
                                <a-tooltip :title="'Set learning objectives' | unitLabelHint(planField.LearnOuts, formConfigPreviewData)" placement='top'>
                                  <a-icon type="info-circle" />
                                </a-tooltip>
                              </template>
                              <a-badge :dot='hasExtraRecommend'>
                                <a-button type='primary' @click='handleSelectDescription()'>
                                  <div class='btn-text' style='line-height: 20px'>
                                    {{ 'leaning objectives' | unitLabelName(planField.LearnOuts, $store.getters.formConfigData) }}
                                  </div>
                                </a-button>
                              </a-badge>

                              <a-button
                                class='assessment-task-button'
                                ghost
                                type='link'
                                @click='handleClickTaskDetail($event)'>
                                Assessment task details
                                <a-icon type='right' />
                              </a-button>

                            </a-form-item>

                            <!--knowledge tag-select -->
                            <ui-learn-out
                              ref='learnOut'
                              :learn-outs='form.learnOuts'
                              :self-outs='form.selfOuts'
                              @remove-learn-outs='handleRemoveLearnOuts' />
                          </div>

                          <div class='form-block' style='clear:both' v-if="fieldItem.visible && fieldItem.fieldName === planField.Prior" :key='fieldItem.fieldName'>
                            <a-form-model-item>
                              <template class='my-label' slot='label'>
                                {{ 'Prior learning experience' | unitLabelName(planField.Prior, formConfigPreviewData) }}
                                <a-tooltip :title="'Prior learning experience' | unitLabelHint(planField.Prior, formConfigPreviewData)" placement='top'>
                                  <a-icon type="info-circle" />
                                </a-tooltip>
                              </template>
                              <a-textarea
                                v-model='form.prior'
                                allow-clear
                                auto-size
                                placeholder='What are the approaches to find out what students already knew?' />
                            </a-form-model-item>
                          </div>
                        </template>

                        <template v-for='custFieldItem in formConfigPreviewData.planCustomList'>
                          <div class='form-block' v-if="custFieldItem.visible && form.customFieldData && form.customFieldData.hasOwnProperty(custFieldItem.id)" :key='custFieldItem.id' :data-field-name='custFieldItem.name' :data-field-id='custFieldItem.id'>
                            <a-form-item>
                              <template class='my-label' slot='label'>
                                {{ custFieldItem.name }}
                                <a-tooltip :title="custFieldItem.hint" placement='top'>
                                  <a-icon type="info-circle" />
                                </a-tooltip>
                              </template>
                              <a-input v-model='form.customFieldData[custFieldItem.id]' class='my-form-input' />
                            </a-form-item>
                          </div>
                        </template>
                      </div>
                    </template>
                  </a-step>
                  <a-step title='Link Plan content'>
                    <template slot='description'>
                      <div class='step-detail' v-show='currentActiveStepIndex === 1'>
                        <div class='form-block'>
                          <a-form-item class='link-plan-title' label='Add task(s)' >
                            <a-space v-show="canEdit">
                              <a-button
                                :style="{'background-color': '#fff', 'color': '#000', 'border': '1px solid #D8D8D8', 'display': 'flex', 'align-items': 'center'}"
                                type='primary'
                                :loading='linkLoading'
                                @click='handleAddTasks'>
                                <div class='btn-text' style='line-height: 20px; padding-left: 5px'>
                                  + Link Task(s)
                                </div>
                              </a-button>
                              <a-button
                                :loading='addCategoryLoading'
                                :style="{'background-color': '#fff', 'color': '#000', 'border': '1px solid #D8D8D8'}"
                                class='addCategory'
                                type='primary'
                                @click='handleAddTerm'>
                                <div class='btn-text' style='line-height: 20px; padding-left: 5px'>
                                  + Add category
                                </div>
                              </a-button>
                            </a-space>
                          </a-form-item>
                          <div class='common-link-wrapper'>
                          </div>
                        </div>
                      </div>
                    </template>
                  </a-step>
                </a-steps>
              </a-form-model>
            </div>

            <div :style="{'width':rightWidth + 'px'}" class='unit-plan-form-right'>
              <!--              优先级 所有comment预览 > 字段comment > tag选择-->
              <template v-if='showRightModule(rightModule.imageUpload)'>
                <div :style="{'width':rightWidth + 'px'}" class='form-block-right'>
                  <!-- image-->
                  <a-form-model-item class='img-wrapper'>
                    <a-upload-dragger
                      :customRequest='handleUploadImage'
                      :showUploadList='false'
                      accept='image/png, image/jpeg'
                      name='file'
                    >
                      <div v-show='form.image' class='delete-img' @click='handleDeleteImage($event)'>
                        <a-icon type='close-circle' />
                      </div>
                      <template v-if='uploading'>
                        <div class='upload-container'>
                          <p class='ant-upload-drag-icon'>
                            <a-icon type='cloud-upload' />
                          </p>
                          <p class='ant-upload-text'>
                            <a-spin />
                            <span class='uploading-tips'>{{ $t('teacher.add-unit-plan.uploading') }}</span>
                          </p>
                        </div>
                      </template>
                      <template v-if='!uploading && form && form.image'>
                        <div class='image-preview'>
                          <img :src='form.image' alt=''>
                        </div>
                      </template>
                      <template v-if='!uploading && form && !form.image'>
                        <div class='upload-container'>
                          <p class='ant-upload-drag-icon'>
                            <img class='upload-icon' src='~@/assets/icons/lesson/upload_icon.png' />
                          </p>
                          <p class='ant-upload-text'>
                            {{ $t('teacher.add-unit-plan.upload-a-picture') }}
                          </p>
                        </div>
                      </template>
                    </a-upload-dragger>
                  </a-form-model-item>
                </div>
              </template>
              <template v-if='showRightModule(rightModule.customTag)'>
                <div
                  v-show='!this.contentLoading'
                  :style="{'width':rightWidth+'px', 'margin-top':customTagTop+'px', 'z-index': 50}">
                  <custom-tag
                    ref='customTag'
                    :scope-tags-list='customTagList'
                    :selected-tags-list='form.customTags'
                    :show-arrow='showCustomTag'
                    :custom-tags='customTags'
                    @reload-user-tags='loadCustomTags'
                    @change-add-keywords='handleChangeAddKeywords'
                    @change-user-tags='handleChangeCustomTags'></custom-tag>
                </div>
              </template>
              <template v-if='showRightModule(rightModule.taskDetails) && currentActiveStepIndex === 0'>
                <div
                  :style="{'width':rightWidth + 'px', 'margin-top':taskDetailsTop+'px', 'z-index': 200}"
                  class='task-details-panel'>
                  <Assessment-Task-Details
                    :associate-task-list='associateTaskList'
                    @hide-assessment-task='resetRightModuleVisible()' />
                </div>
              </template>
            </div>
          </a-card>
        </a-col>
      </a-row>
      <a-modal
        v-model='selectAddContentTypeVisible'
        :footer='null'
        destroyOnClose
        title='Select Content Type'
        @cancel='selectAddContentTypeVisible = false'
        @ok='selectAddContentTypeVisible = false'>
        <div class='add-content-wrapper'>
          <div class='add-content-item' @click='handleAddUnitPlanTask'>
            <a>
              <content-type-icon :type='contentType.task' />
              {{ $t('teacher.add-unit-plan.task') }}
            </a>
          </div>
          <div class='add-content-item' @click='handleAddUnitPlanLesson'>
            <a>
              <content-type-icon :type='contentType.lesson' />
              {{ $t('teacher.add-unit-plan.lesson') }}
            </a>
          </div>
          <div class='add-content-item' @click='handleAddUnitPlanEvaluation'>
            <a>
              <content-type-icon :type='contentType.evaluation' />
              {{ $t('teacher.add-unit-plan.evaluation') }}
            </a>
          </div>
          <div v-if='addLoading' class='add-loading'>
            <a-spin />
          </div>
        </div>
      </a-modal>

      <a-modal
        v-model='showAddAudioVisible'
        :footer='null'
        destroyOnClose
        title='Add Audio'
        @cancel='showAddAudioVisible = false'
        @ok='showAddAudioVisible = false'>

        <div class='audio-material-action'>
          <div v-show='currentUploading' class='uploading-mask'>
            <div class='uploading'>
              <a-spin large />
            </div>
          </div>
          <div class='action-item'>
            <a-upload :customRequest='handleUploadAudio' :showUploadList='false' accept='audio/*' name='file'>
              <a-button icon='upload' type='primary'>{{ $t('teacher.add-unit-plan.upload-audio') }}</a-button>
            </a-upload>
          </div>
          <a-divider>
            {{ $t('teacher.add-unit-plan.or') }}
          </a-divider>
          <div class='action-item-column'>
            <!--            <vue-record-audio mode="press" @result="handleAudioResult" />-->
            <div class='action-tips'>
              {{ $t('teacher.add-unit-plan.record-your-voice') }}
            </div>
          </div>
          <div class='material-action'>
            <a-button key='back' class='action-item' @click='handleCancelAddAudio'>
              Cancel
            </a-button>
            <a-button key='submit' class='action-item' type='primary' @click='handleConfirmAddAudio'>
              Ok
            </a-button>
          </div>
        </div>
      </a-modal>

      <a-modal
        v-model='selectReferMyContentVisible'
        :footer='null'
        destroyOnClose
        title='Refer MyContent'
        width='1150px'
        @cancel='selectReferMyContentVisible = false'
        @ok='selectReferMyContentVisible = false'>
        <div class='link-content-wrapper'>

        </div>
      </a-modal>

      <a-drawer
        :closable='false'
        :mask='false'
        :visible='referDetailVisible'
        destroyOnClose
        placement='right'
        width='700px'
        @close='handleCloseReferDetail'
      >
        <a-row class='preview-wrapper-row'>
          <a-col class='view-back-col' span='2'>
            <div class='view-back' @click='handleCloseReferDetail'>
              <div class='back-icon'>
                <img src='~@/assets/icons/common/back.png' />
              </div>
            </div>
          </a-col>
          <a-col class='preview-wrapper-col' span='24'>
            <div class='detail-wrapper'>
              <div class='refer-detail'>
                <refer-preview
                  :id='referId'
                  :type='referType'
                  @refer='handleReferBlock'
                  @hover-refer-block='handleHoverReferBlock'
                  @refer-associate='handleReferAssociate'
                />
              </div>
            </div>
          </a-col>
        </a-row>
      </a-drawer>

      <a-modal
        v-model='selectLinkContentVisible'
        :dialog-style="{ top: '10px'}"
        :footer='null'
        destroyOnClose
        width='900px'>
        <div slot='title' class='my-modal-title'>
          Link my content
        </div>
        <div class='link-content-wrapper'>
          <new-my-content
            :default-group-name='newTermName'
            :filter-type-list='[contentType.task]'
            :from-type="contentType['unit-plan']"
            :group-name-list='groupNameList'
            :group-name-mode='groupNameMode'
            :mode="'common-link'"
            :selected-list='selectedTaskList'
            @cancel='selectLinkContentVisible = false'
            @ensure='handleEnsureSelectedLink' />
        </div>
      </a-modal>

      <a-modal
        v-model='selectSyncDataVisible'
        :dialog-style="{ top: '20px' }"
        :footer='null'
        :title='null'
        destroyOnClose
        width='1200px'
        @cancel='selectSyncDataVisible = false'
        @ok='selectSyncDataVisible = false'>
        <div class='link-content-wrapper'>
          <!-- 此处的questionIndex用于标识区分是哪个组件调用的，返回的事件数据中会带上，方便业务数据处理，可随意写，可忽略, show-menu中列出的类型才会显示-->
          <new-browser
            ref='newBrowser'
            :default-active-menu='defaultActiveMenu'
            :recommend-data='recommendData'
            :select-mode='selectModel.syncData'
            :selected-id='selectedIdList'
            :selected-list='selectedList'
            :show-menu='showMenuList'
            :sync-data='syncData'
            :default-grade-id='form.gradeId'
            question-index='_questionIndex_1'
            @select-assessmentType='handleSelectAssessmentType'
            @select-sync='handleSelectListData'
            @select-curriculum='handleSelectCurriculum'
            @select-subject-specific-skill='handleSelectSubjectSpecificSkillListData'
            @select-century-skill='handleSelect21CenturySkillListData'
            @select-idu='handleSelectIdu'
            @select-recommend='handleSelectRecommend'
            @cancel-select='handleCancelSelectData'
            @ensure-select='handleEnsureSelectData'
          />
        </div>
      </a-modal>

      <a-modal
        v-model='questionSettingVisible'
        :footer='null'
        destroyOnClose
        title='Set key question(s) / Line(s) of inquiry'
        width='600px'>
        <div class='ensure-setting-modal'>
          <div class='tips'>
            <p>We understand that for some countries, "key questions/line of inquiry" is not required in Unit plan so
              you have the option to turn it off. You won't see that section once it's off.</p>
            <p>
            </p>
            <p style='color: red'>You might turn it on or change in your account setting If you need the section in
              future.</p>
          </div>
          <a-switch v-model='disableQuestion' @change='onChangeSwitch' />
          <span
            style='color: red ;font-family: Inter-Bold;font-size: 15px;'> Key question(s) / Line(s) of inquiry</span>
          <div class='modal-ensure-action-line-center'>
            <a-button class='action-item action-cancel' shape='round' @click='questionSettingVisible=false'>Cancel
            </a-button>
            <a-button
              :loading='confirmLoading'
              class='action-ensure action-item'
              shape='round'
              type='primary'
              @click='handQuestionSetting'>Confirm
            </a-button>
          </div>
        </div>
      </a-modal>

      <a-modal
        v-model='selectBigIdeaDataVisible'
        :footer='null'
        destroyOnClose
        title='Browse big idea'
        width='70%'
        @cancel='selectBigIdeaDataVisible = false'
        @ok='selectBigIdeaDataVisible = false'>
        <div class='link-content-wrapper'>
          <BigIdeaBrowse @handle-select='handleSelectBigIdeaData'>

          </BigIdeaBrowse>

          <div class='modal-ensure-action-line-right'>
            <a-button class='action-item action-cancel' shape='round' @click='selectBigIdeaDataVisible=false'>Cancel
            </a-button>
            <a-button
              class='action-ensure action-item'
              shape='round'
              type='primary'
              @click='handleEnsureSelectBigIdeaData'>Ok
            </a-button>
          </div>
        </div>
      </a-modal>

      <a-modal
        v-model='questionMoreVisible'
        :footer='null'
        destroyOnClose
        title='Browse Key Questions'
        width='900px'
        @cancel='questionMoreVisible = false'
        @ok='questionMoreVisible = false'>
        <div class='link-content-wrapper'>
          <QuestionBrowse
            :big-idea='form.inquiry'
            :question-list='form.questions'
            @select-question='handleSelectQuestion'></QuestionBrowse>

          <div class='modal-ensure-action-line-right' style='justify-content: center'>
            <a-button class='action-item action-cancel' shape='round' @click='questionMoreVisible=false'>Cancel
            </a-button>
            <a-button
              class='action-ensure action-item'
              shape='round'
              type='primary'
              @click='handleEnsureSelectQuestionData'>Ok
            </a-button>
          </div>
        </div>
      </a-modal>

      <a-modal
        v-model='shareVisible'
        :footer='null'
        destroyOnClose
        title='Share'
        width='500px'
        @ok='shareVisible = false'
        @cancel='shareVisible = false'>
        <share-content-setting
          :source-id='form.id'
          :source-type='form.type'
          @update-share-status='handleShareStatus'
        />
      </a-modal>

      <a-modal
        v-model='showUpdateContent'
        :footer='null'
        :title='null'
        destroyOnClose
        width='700px'
        :maskClosable="false"
        :closable='false'>
      </a-modal>

      <a-skeleton :loading='contentLoading' active>
      </a-skeleton>
    </a-card>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { typeMap } from '@/const/teacher'
import { CustomTagType, PlanField } from '@/const/common'
import { commonAPIUrl } from '@/api/common'
import { GetAllSdgs } from '@/api/scenario'
import { debounce } from 'lodash-es'
import InputSearch from '@/components/UnitPlan/InputSearch'
import SdgTagInput from '@/components/UnitPlan/SdgTagInput'
import {
  GetMyGrades
} from '@/api/teacher'
import { SubjectTree } from '@/api/subject'
import { formatSubjectTree } from '@/utils/bizUtil'
import NewUiClickableKnowledgeTag from '@/components/UnitPlan/NewUiClickableKnowledgeTag'
import NewClickableSkillTag from '@/components/UnitPlan/NewClickableSkillTag'
import SkillTag from '@/components/UnitPlan/SkillTag'
import { formatLocalUTC } from '@/utils/util'
import MyContentSelector from '@/components/MyContent/MyContentSelector'
import AssociateSidebar from '@/components/Associate/AssociateSidebar'
import CustomTag from '@/components/UnitPlan/CustomTag'
import RelevantTagSelector from '@/components/UnitPlan/RelevantTagSelector'
import AddKeywordTag from '@/components/Evaluation/AddKeywordTag'
import CollaborateUserList from '@/components/Collaborate/CollaborateUserList'
import CommonFormHeader from '@/components/Common/CommonFormHeader'
import NewBrowser from '@/components/NewLibrary/NewBrowser'
import { SelectModel } from '@/components/NewLibrary/SelectModel'
import DisplayMode from '@/components/MyContent/DisplayMode'
import ReferPreview from '@/components/UnitPlanRefer/ReferPreview'
import UiLearnOut from '@/components/UnitPlan/UiLearnOut'
import PlanLink from '@/components/Common/PlanLink'
import NewMyContent from '@/components/MyContent/NewMyContent'
import { FindCustomTags, GetTreeByKey } from '@/api/tag'
import { NavigationType } from '@/components/NewLibrary/NavigationType'
import CollaborateCommentPanel from '@/components/Collaborate/CollaborateCommentPanel'
import CommentSwitch from '@/components/Collaborate/CommentSwitch'
import CollaborateCommentView from '@/components/Collaborate/CollaborateCommentView'
import commentIcon from '@/assets/icons/collaborate/comment.svg?inline'
import CollaborateHistory from '@/components/Collaborate/CollaborateHistory'
import BigIdeaBrowse from '@/components/UnitPlan/BigIdeaBrowse'
import { FindQuestionsByBigIdea } from '@/api/question'
import QuestionBrowse from '@/components/UnitPlan/QuestionBrowse'
import { UtilMixin } from '@/mixins/UtilMixin'
import AssessmentTaskDetails from '@/components/UnitPlan/AssessmentTaskDetails'
import { BaseEventMixin } from '@/mixins/BaseEvent'
import { FormConfigMixin } from '@/mixins/FormConfigMixin'
import ShareContentSetting from '@/components/Share/ShareContentSetting'
import storage from 'store'
import { FORM_CONFIG_PREVIEW_DATA } from '@/store/mutation-types'

export default {
  name: 'AddUnitPlan',
  components: {
    ShareContentSetting,
    AssessmentTaskDetails,
    QuestionBrowse,
    CollaborateHistory,
    CollaborateCommentView,
    CommentSwitch,
    CollaborateCommentPanel,
    NewMyContent,
    PlanLink,
    ReferPreview,
    CollaborateUserList,
    CommonFormHeader,
    ContentTypeIcon,
    InputSearch,
    SdgTagInput,
    NewUiClickableKnowledgeTag,
    NewClickableSkillTag,
    SkillTag,
    MyContentSelector,
    AssociateSidebar,
    CustomTag,
    RelevantTagSelector,
    AddKeywordTag,
    NewBrowser,
    commentIcon,
    UiLearnOut,
    BigIdeaBrowse
  },
  mixins: [UtilMixin, BaseEventMixin, FormConfigMixin],
  data() {
    return {
      showCollaborateVisible: false,
      contentLoading: true,
      referenceLoading: false,
      contentType: typeMap,
      DisplayMode: DisplayMode,

      selectAddContentTypeVisible: false,
      selectLinkContentVisible: false,

      showAddAudioVisible: false,
      currentUploading: false,
      audioUrl: null,

      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        id: null,
        image: '',
        inquiry: '',
        name: 'Untitled UnitPlan',
        status: 0,
        subjects: '',
        learnOuts: [],
        selfOuts: [],
        questions: [
          {
            id: '',
            name: ''
          }
        ],
        scenarios: [],
        createTime: '',
        updateTime: '',
        materials: [],
        customTags: [],
        overview: '',
        subjectIds: [],
        gradeIds: [],
        summarize: '',
        startDate: '',
        endDate: '',
        gradeId: undefined,
        prior: '',
        customFieldData: null
      },
      rangeDate: [],
      uploading: false,
      sdgList: [],

      // Subject(s) Covered
      subjectList: [],

      // Grades
      gradeList: [],

      // SubjectTree
      subjectTree: [],

      // 根据description搜索的下拉list列表
      descriptionSearchList: [],
      addLoading: false,
      currentIndex: 0,
      saving: false,
      publishing: false,
      selectModel: SelectModel,
      selectDescriptionIndex: '',

      selectReferMyContentVisible: false,
      referDetailVisible: false,
      referId: null,
      referType: null,
      activeReferBlock: '',
      showSidebar: true,

      // 当前激活的step
      currentActiveStepIndex: 0,

      groupNameList: [],
      groupNameListOther: [],
      syncData: [],
      selectSyncDataVisible: false,
      selectedSyncList: [],

      // 已选择的大纲知识点描述数据
      selectedCurriculumList: [],

      // specific skill
      selectedSpecificSkillList: [],
      // century skill
      selectedCenturySkillList: [],
      // idu
      selectedIduList: [],
      selectedRecommendList: [],

      // BigIdeaList
      selectedBigIdeaList: [],

      selectedAssessmentList: [],

      selectIdea: false,
      showCustomTag: false,
      customTagTop: 0,
      customTagList: [],
      customTags: {},
      NavigationType: NavigationType,
      defaultActiveMenu: NavigationType.learningOutcomes,
      showMenuList: [NavigationType.specificSkills, NavigationType.centurySkills, NavigationType.learningOutcomes, NavigationType.assessmentType, NavigationType.idu],

      collaborateTop: 0,
      questionSettingVisible: false,
      disableQuestion: false,
      confirmLoading: false,
      selectBigIdeaDataVisible: false,
      selectNewBigIdea: '',
      recommendQuestionList: [],
      showHistoryLoading: false,
      hideRecommendQuestion: false,
      questionMoreVisible: false,
      selectedQuestionList: [],

      groupNameMode: 'input', // input、select,
      newTermName: 'Untitled category',
      associateTaskList: [],
      tagColorList: [
        'pink',
        'orange',
        'green',
        'cyan',
        'blue',
        'red',
        'purple'
      ],

      recommendData: [],
      recommendDataIdList: [],
      selectedIdList: [],
      selectedList: [],
      selectedTaskList: [],
      taskDetailsTop: 0,
      associateUnitPlanIdList: [],
      associateTaskIdList: [],
      associateId2Name: new Map(),
      defaultGroupName: 'Untitled category',
      addCategoryLoading: false,
      rwcList: [],

      shareVisible: false,
      shareStatus: 0,
      planField: PlanField,

      linkLoading: false
    }
  },
  computed: {
    lastChangeSavedTime() {
      return formatLocalUTC(new Date())
    },
    selectedSdg() {
      const sdgList = []
      this.$logger.info('selectedSdg is ', this.form.scenarios)
      if (this.form.scenarios && this.form.scenarios.length > 0) {
        this.form.scenarios.forEach(item => sdgList.push(item.sdgId))
      }
      return sdgList
    },
    showRecommendQuestion() {
      if (this.hideRecommendQuestion) {
        return false
      }
      if (!this.form.inquiry) {
        return false
      }
      if (this.recommendQuestionList.length === 0) {
        return false
      }
      return true
    },
    selectQuestion() {
      return this.form.questions.map(item => {
        return item.name
      })
    },
    getTaskTags() {
      return this.form.questions.map(item => {
        return item.name
      })
    },
    hasExtraRecommend() {
      this.$logger.info('-------------', this.form.learnOuts, this.recommendDataIdList)
      let ret = false
      this.form.learnOuts.forEach(item => {
        if (this.recommendDataIdList.indexOf(item.knowledgeId) === -1) {
          ret = true
          this.$logger.info('------------learnOuts', item, ' not exist in ', this.recommendDataIdList)
        }
      })

      return ret
    }
  },
  created() {
    // 初始化关联事件处理
    this.formConfigPreviewData = storage.get(FORM_CONFIG_PREVIEW_DATA)
    this.$logger.info('unit-preview created', this.formConfigPreviewData)
    this.initData()
  },
  methods: {
    initData() {
      logger.info('initData doing...')
      Promise.all([
        GetAllSdgs(),
        // GetTreeByKey({ key: 'Related Concepts MYP' }),
        GetMyGrades(),
        SubjectTree({ curriculumId: this.$store.getters.bindCurriculum }),
        GetTreeByKey({ key: 'Real world connections' })
      ]).then((sdgListResponse) => {
        logger.info('initData done', sdgListResponse)

        // GetAllSdgs
        logger.info('GetAllSdgs Response ', sdgListResponse[0])
        if (!sdgListResponse[0].code) {
          this.sdgList = sdgListResponse[0].result
        }

        // GetMyGrades
        if (!sdgListResponse[1].code) {
          logger.info('GetMyGrades', sdgListResponse[1].result)
          this.gradeList = sdgListResponse[1].result
        }

        // SubjectTree
        if (!sdgListResponse[2].code) {
          logger.info('SubjectTree', sdgListResponse[2].result)
          let subjectTree = sdgListResponse[2].result
          subjectTree = formatSubjectTree(subjectTree)
          this.subjectTree = subjectTree
          logger.info('after format subjectTree', subjectTree)
        }
        // rwc list
        if (!sdgListResponse[3].code) {
          logger.info('rwc', sdgListResponse[3].result)
          this.rwcList = sdgListResponse[3].result.children ? sdgListResponse[3].result.children : []
        }
        logger.info('sdgList', this.sdgList)
      }).catch((e) => {
        this.$message.error(this.$t('teacher.add-unit-plan.init-data-failed'))
      }).finally(() => {
        // 填充自定义字段
        const displayCustomFieldData = {}

        if (this.formConfigPreviewData && this.formConfigPreviewData.planCustomList) {
          this.formConfigPreviewData.planCustomList.forEach(customField => {
            displayCustomFieldData[customField.id] = ''
          })
        } else {
          this.$confirm({
            title: 'Alert',
            okText: 'Ok',
            content: 'Failed to get the preview data!'
          })
        }
        this.$logger.info('displayCustomFieldData', displayCustomFieldData)
        this.form.customFieldData = displayCustomFieldData

        this.referenceLoading = false
        this.contentLoading = false
      })
    },

    handleSyncData() {
    },

    handleUploadImage(data) {
      logger.info('handleUploadImage', data)
      const formData = new FormData()
      formData.append('file', data.file, data.file.name)
      this.uploading = true
      this.$http.post(commonAPIUrl.UploadFile, formData, {
        contentType: false,
        processData: false,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      })
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

    handleDeleteImage(e) {
      logger.info('handleDeleteImage ', e)
      e.stopPropagation()
      e.preventDefault()
      this.form.image = null
    },

    handleAddMoreSdg() {
      const sdg = {
        description: '',
        sdgId: undefined,
        sdgKeyWords: []
      }
      this.form.scenarios.push(sdg)
      // this.$set(this.sdgDataObj, this.sdgPrefix + this.sdgMaxIndex, sdg)
      // logger.info('after add scenarioObj: ', this.sdgDataObj, 'sdgMaxIndex ' + this.sdgMaxIndex, ' sdgTotal ' + this.sdgTotal)
    },

    handleDeleteSdg(sdgIndex) {
      if (this.form.scenarios.length > 1) {
        this.form.scenarios.splice(sdgIndex, 1)
        logger.info('scenarios ', this.form.scenarios, 'sdgTotal ' + this.form.scenarios.length)
      } else {
        this.$message.warn(this.$t('teacher.add-unit-plan.at-least-one-sdg'))
      }
    },

    handleSelectSubject(subjects) {
      logger.info('handleSelectSubject', subjects)
      this.form.subjects = subjects
    },

    handleAddMoreQuestion() {
      const question = {
        id: null,
        name: ''
      }
      logger.info('handleAddMoreQuestion ', question)
      this.form.questions.push(question)
    },
    handleRemoveQuestion(index) {
      logger.info('handleRemoveQuestion ', index)
      if (this.form.questions.length === 1) {
        this.form.questions[index].name = ''
      } else {
        this.form.questions.splice(index, 1)
      }
    },

    handleRemoveSkillTag(data) {
      logger.info('Unit Plan handleRemoveSkillTag', data)
      logger.info('target question data', this.questionDataObj[data.questionIndex])
      this.questionDataObj[data.questionIndex].skillTags = this.questionDataObj[data.questionIndex].skillTags.filter(item => item.id !== data.id)
      logger.info('Unit Plan after handleRemoveSkillTag ', this.questionDataObj[data.questionIndex].skillTags)
    },

    handleAddSkillTag(data) {
      logger.info('Unit Plan handleAddSkillTag', data)
      logger.info('target question data', this.questionDataObj[data.questionIndex])
      this.questionDataObj[data.questionIndex].skillTags.push(Object.assign({}, data))
      this.$logger.info('after handleAddSkillTag questionDataObj ' + data.questionIndex, this.questionDataObj[data.questionIndex])
    },

    handleSaveUnitPlan() {
    },
    handlePublishUnitPlan(status) {
    },

    handleAddUnitPlanMaterial() {
    },

    handleAddUnitPlanTask() {
    },

    handleAddUnitPlanLesson() {
    },

    handleAddUnitPlanEvaluation() {
    },

    closeWindow() {
      window.close()
    },

    handleClickPreviewMask () {
      this.$confirm({
        title: 'Alert',
        okText: 'Exit',
        cancelText: 'Cancel',
        content: 'Currently in preview mode, whether to exit',
        onOk: () => {
          this.closeWindow()
        }
      })
    },
    handleChangeCustomTags(tags) {
    },
    handleChangeAddKeywords(tag) {

    },
    handleAudioResult(data) {

    },

    handleUploadAudio(data) {
    },

    handleCancelAddAudio() {
    },

    handleConfirmAddAudio() {

    },

    handleAddAudioOverview() {

    },
    handleUpdateSelfOuts (data) {

    },
    handleSelectDescription() {

    },
    handleConfirmAssociate() {

    },

    handleStartRefer() {

    },

    handleDescriptionSelectClick(data) {

    },

    handleReferItem(data) {

    },

    handleCloseReferDetail() {

    },

    handleHoverReferBlock(data) {

    },

    handleReferBlock(data) {

    },

    handleReferAssociate(data) {

    },
    showSelectLinkContentVisible() {

    },
    showSelectAddContentTypeVisible() {

    },

    handleAddTasks() {

    },

    handleAddTerm() {

    },

    handleEnsureSelectedLink(data) {

    },

    getAssociate() {
    },

    loadRefLearnOuts() {

    },
    loadBigIdeaLearnOuts() {

    },

    handleUpdateGroupNameList() {

    },

    handleSelectBigIdeaData(data) {
    },
    // TODO 选择的assessment数据
    handleSelectAssessmentType(data) {
      this.$logger.info('handleSelectAssessmentType', data)
      this.selectedAssessmentList = data
    },

    // TODO 自动更新选择的sync 的数据knowledgeId和name列表
    handleSelectListData(data) {
      this.$logger.info('handleSelectListData', data)
      this.selectedSyncList = data
    },

    handleSelectCurriculum(data) {
      this.$logger.info('handleSelectCurriculum', data)
      this.selectedCurriculumList = data
    },

    handleSelectSubjectSpecificSkillListData(data) {
      this.selectedSpecificSkillList = data
      this.$logger.info('handleSelectSubjectSpecificSkillListData', data)
    },

    handleSelect21CenturySkillListData(data) {
      this.$logger.info('handleSelect21CenturySkillListData', data)
      this.selectedCenturySkillList = data
    },

    handleSelectIdu(data) {
      this.$logger.info('handleSelectIdu', data)
      this.selectedIduList = data
    },

    handleSelectRecommend(data) {
      this.$logger.info('handleSelectRecommend', data)
      this.selectedRecommendList = data
    },

    // TODO 自动更新选择的sync 的数据knowledgeId和name列表
    handleCancelSelectData() {
      this.selectedSyncList = []
      this.selectedCurriculumList = []
      this.selectedSpecificSkillList = []
      this.selectedCenturySkillList = []
      this.selectedAssessmentList = []
      this.selectedIduList = []
      this.selectedRecommendList = []
      this.selectSyncDataVisible = false
    },

    // TODO 自动更新选择的sync 的数据knowledgeId和name列表
    handleEnsureSelectData() {
      this.$logger.info('handleEnsureSelectData',
        this.selectedCurriculumList,
        this.selectedSpecificSkillList,
        this.selectedCenturySkillList,
        this.selectedBigIdeaList,
        this.selectedAssessmentList,
        this.selectedIduList,
        this.selectedSyncList)
      this.$logger.info('mySelectedList', this.$refs.newBrowser.mySelectedList)
      this.$logger.info('learnOuts', this.form.learnOuts)
      this.form.learnOuts = this.$refs.newBrowser.mySelectedList
      this.$refs.newBrowser.selectedRecommendList.forEach(item => {
        const index = this.form.learnOuts.findIndex(dataItem => dataItem.knowledgeId === item.knowledgeId)
        if (index === -1) {
          this.form.learnOuts.push(item)
        }
      })
      this.selectedSyncList.forEach(data => {
        const filterLearnOuts = this.form.learnOuts.filter(item => item.knowledgeId === data.knowledgeId)
        if (filterLearnOuts.length > 0) {
          return
        }
        this.form.learnOuts.push({
          knowledgeId: data.knowledgeId,
          name: data.name,
          tags: data.tags,
          tagType: data.tagType,
          path: data.path
        })
      })

      this.selectedIduList.forEach(data => {
        const filterLearnOuts = this.form.learnOuts.filter(item => item.knowledgeId === data.id)
        if (filterLearnOuts.length > 0) {
          return
        }
        this.form.learnOuts.push({
          knowledgeId: data.knowledgeData.id,
          name: data.knowledgeData.name,
          tagType: data.knowledgeData.tagType,
          path: data.knowledgeData.path,
          tags: data.tags
        })
      })
      const selectList = this.selectedCurriculumList.concat(this.selectedSpecificSkillList).concat(this.selectedCenturySkillList)
        .concat(this.selectedAssessmentList)
      if (this.selectIdea) {
        if (this.selectedBigIdeaList.length > 0) {
          this.form.inquiry = this.selectedBigIdeaList[0].bigIdea
        }
        this.selectSyncDataVisible = false
        return
      }
      selectList.forEach(data => {
        const filterLearnOuts = this.form.learnOuts.filter(item => item.knowledgeId === data.knowledgeId)
        if (filterLearnOuts.length > 0) {
          return
        }
        this.form.learnOuts.push({
          knowledgeId: data.knowledgeData.id,
          name: data.knowledgeData.name,
          tagType: data.knowledgeData.tagType,
          path: data.knowledgeData.path
        })
      })
      this.$logger.info('this.form.learnOuts', this.form.learnOuts)
      this.selectSyncDataVisible = false
      this.handleCancelSelectData()
    },
    handleRemoveLearnOuts(data) {
    },
    loadCustomTags() {
      // this.$refs.customTag.tagLoading = true
      FindCustomTags({}).then((response) => {
        this.$logger.info('FindCustomTags response', response.result)
        if (response.success) {
          this.customTags = response.result
          // 默认展示的tag分类
          CustomTagType.plan.default.forEach(name => {
            this.customTagList.push(name)
          })
          // // 再拼接自己添加的
          this.customTags.userTags.forEach(tag => {
            if (this.customTagList.indexOf(tag.name) === -1) {
              this.customTagList.push(tag.name)
            }
          })
        } else {
          this.$message.error(response.message)
        }
        // this.$refs.customTag.tagLoading = false
      })
    },
    focusInput(event) {
      this.$logger.info('focusInput ', event.target)
      // 设置一个父级定位专用的dom，设置class名称【root-locate-form】，
      // 然后通过事件获取到当前元素，依次往上层查询父元素，累加偏离值，直到定位元素。
      const eventDom = event.target
      let formTop = eventDom.offsetTop ? eventDom.offsetTop : 0
      let currentDom = eventDom.offsetParent
      let currentFocus = ''
      this.customTagList = []
      console.log(currentDom)
      while (currentDom !== null) {
        formTop += (currentDom ? currentDom.offsetTop : 0)
        currentDom = currentDom ? currentDom.offsetParent : undefined
        if (!currentDom) {
          break
        }
        if (currentDom.classList.contains('sdg-content-blocks')) {
          currentFocus = 'sdg'
          CustomTagType.plan.sdg.forEach(name => {
            this.customTagList.push(name)
          })
        } else if (currentDom && currentDom.classList.contains('form-block-rwc')) {
          currentFocus = 'rwc'
          CustomTagType.plan.rwc.forEach(name => {
            this.customTagList.push(name)
          })
        } else if (currentDom && currentDom.classList.contains('bigIdea')) {
          currentFocus = 'inquiry'
          CustomTagType.plan.bigIdea.forEach(name => {
            this.customTagList.push(name)
          })
        } else if (currentDom && currentDom.classList.contains('unit-question')) {
          currentFocus = 'question'
          CustomTagType.plan.question.forEach(name => {
            this.customTagList.push(name)
          })
        }
        if (currentDom && currentDom.classList.contains('root-locate-form')) {
          console.log(currentDom.classList)
          break
        }
      }
      console.log(currentFocus)
      // custom tag 自带了margin-top: 20px,这里减掉不然不对齐。
      if (currentFocus) {
        this.customTagTop = formTop - 20
        this.showCustomTag = true
        this.setRightModuleVisible(this.rightModule.customTag)
      } else {
        CustomTagType.plan.default.forEach(name => {
          this.customTagList.push(name)
        })
        // // 再拼接自己添加的
        this.customTags.userTags.forEach(tag => {
          if (this.customTagList.indexOf(tag.name === -1)) {
            this.customTagList.push(tag.name)
          }
        })
        this.showCustomTag = false
        this.customTagTop = 0
        // this.showModuleList.push(RightModule.imageUpload)
        this.setRightModuleVisible()
      }
    },

    // 切换当前的字段的点评数据，从总的collaborateCommentList筛选初当前字段相关的点评数据
    handleSwitchComment(data) {

    },

    // 每次点击都重新加载一下最新数据
    handleViewCollaborate() {

    },

    // TODO 发布评论后需要更新最新的评论列表,刷新数据
    handleUpdateCommentList() {

    },

    // historyData以及在接口请求的相应逻辑中正对数据进行‘格式’，
    // 这样在这里就可以直接this.$set设置字段的数据
    handleRestoreField(data) {

    },
    handQuestionSetting() {

    },
    onChangeSwitch(checked) {
      this.disableQuestion = checked
    },
    handleEnsureSelectBigIdeaData() {
      if (!this.selectNewBigIdea) {
        this.$message.error('Please select a big idea')
        return
      }
      this.form.inquiry = this.selectNewBigIdea
      this.selectBigIdeaDataVisible = false
    },
    findQuestionsByBigIdea(bigIdea) {
      if (!bigIdea) {
        return
      }
      FindQuestionsByBigIdea({ bigIdea: bigIdea }).then(response => {
        logger.info('FindQuestionsByBigIdea ', response)
        this.recommendQuestionList = []
        if (response.success) {
          const formQuestion = this.form.questions.map(item => {
            return item.name
          })
          response.result.forEach(item => {
            if (formQuestion.indexOf(item.name) === -1) {
              if (this.recommendQuestionList.filter(q => q.name === item.name).length === 0) {
                this.recommendQuestionList.push(item)
              }
            }
          })
        }
      }).finally({})
    },
    handerInsertQuestion(question) {
      const formQuestion = this.form.questions.map(item => {
        return item.name
      })
      if (formQuestion.indexOf(question.name) > -1) {
        this.$message.warning('Question is existed')
        return
      }
      if (this.form.questions.length === 1 && !this.form.questions[0].name) {
        this.form.questions = []
      }
      this.form.questions.push(question)
    },
    handleSelectQuestion(questions) {
      logger.info('handleSelectQuestion ', questions)
      this.selectedQuestionList = questions
    },
    handleEnsureSelectQuestionData() {
      logger.info('handleEnsureSelectQuestionData ', this.selectedQuestionList)
      const formQuestion = this.form.questions.map(item => {
        return item.name
      })
      this.selectedQuestionList.forEach(q => {
        if (formQuestion.indexOf(q) === -1) {
          this.form.questions.push({ 'name': q })
        }
      })
      this.questionMoreVisible = false
    },
    setSessionStep(step) {
    },
    getSessionStep() {
    },
    handleEditTask(item) {
    },
    handleClickTaskDetail(e) {
      this.$logger.info('handleClickTaskDetail', this.showTaskDetails)
      this.setRightModuleVisible(this.rightModule.taskDetails)
      // this.showTaskDetails = !this.showTaskDetails
      const eventDom = e.target
      let formTop = eventDom.offsetTop
      let currentDom = eventDom.offsetParent
      while (currentDom !== null) {
        formTop += currentDom.offsetTop
        currentDom = currentDom.offsetParent
        if (currentDom.classList && currentDom.classList.contains('root-locate-form')) {
          console.log(currentDom.classList)
          break
        }
      }
      this.taskDetailsTop = formTop
      console.log(this.taskDetailsTop)
      e.preventDefault()
      e.stopPropagation()
    },

    handleGradeUpdate(data) {
      this.$logger.info('handleGradeUpdate', data)
      this.form.gradeId = data.data.id
    },

    handleShareUnitPlan() {
      this.$logger.info('handleShareUnitPlan')
      this.shareVisible = true
    },
    loadingShareContent() {
    },
    handleShareStatus (status) {
      this.$logger.info('handleShareStatus', status)
      this.shareStatus = status
    },
    handleUpdateContent() {
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.unit-plan-header {
  padding-bottom: 16px;
  border-bottom: 1px solid rgb(235, 238, 240);

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
    margin-top: 10px;
    padding: 0 0 16px 0;

    .menu-category-item {
      user-select: none;
      cursor: pointer;

      .menu-category-item-label {
        font-weight: 600;
        padding: 10px 0;
      }

      .menu-category-list {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .include-item {
          color: @primary-color;
          padding: 5px 0;
          max-width: 100%;
          text-decoration: underline;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .menu-sub-add-action {
        cursor: pointer;

        .action-item {
          color: @primary-color;
          padding: 5px 0;
          text-decoration: underline;
        }
      }
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
    .image-preview {
      img {
        width: 100%;
        height: auto;
      }
    }

    p.ant-upload-text {
      color: #000;
      font-family: Inter-Bold;
    }

    .upload-container {
      padding: 16px 0;
    }

    .uploading-tips {
      padding-left: 10px;
    }

    .upload-icon {
      height: 70px;
    }

    .select-template {
      text-align: center;

      .lesson-select-template {
        margin-left: 10px;
        margin-right: 10px;
      }
    }

    .form-block-title {
      /*font-family: PingFang SC;*/
      font-weight: 500;
      line-height: 24px;
      color: #000000;
      margin-bottom: 10px;
    }

    .form-block-action {
      padding: 10px 0 0 0;
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

    .sdg-content-blocks {
      //width: 700px;
      position: relative;
      border: 1px solid #fff;
      box-sizing: border-box;
      //padding: 5px 50px 5px 50px;
      border-radius: 3px;
      margin-bottom: 5px;

      .scenario-description {
        margin-top: 10px;
        position: relative;

        .sdg-delete-wrapper {
          transition: all 0.2s ease-in;
          display: block;
          position: absolute;
          text-align: center;
          right: -40px;
          top: 0;
          line-height: 40px;
          width: 40px;
          height: 40px;
          cursor: pointer;
          color: @link-hover-color;
          z-index: 100;
        }

        .browse {
          padding: 10px 5px;
          position: absolute;
          right: -100px;
          top: 70px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          border-radius: 6px;
        }

        .btn-icon {
          height: 18px;
          width: 18px;
        }

        .btn-text {
          padding: 0 5px;
        }

        .my-big-select {
          //width: 600px;
        }
      }

      &:hover {
        //border: 1px solid #15C39A;
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
        top: 80px;
        line-height: 50px;
        width: 50px;
        height: 50px;
        cursor: pointer;
        color: @link-hover-color;
        z-index: 1000;
        display: block;
      }

      &:hover {
        //border: 1px dotted @link-hover-color;
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

    .content-blocks {
      //width: 600px;
      position: relative;
      border: 1px dotted #fff;

      .scenario-description {
        margin-top: 10px;
        position: relative;

        .browse {
          padding: 10px 5px;
          position: absolute;
          right: -100px;
          top: 70px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          border-radius: 6px;
        }

        .btn-icon {
          height: 18px;
          width: 18px;
        }

        .btn-text {
          padding: 0 5px;
        }
      }

      .sdg-delete-wrapper {
        transition: all 0.2s ease-in;
        display: block;
        position: absolute;
        text-align: center;
        right: -60px;
        top: 5px;
        line-height: 50px;
        width: 50px;
        height: 50px;
        cursor: pointer;
        color: @link-hover-color;
        z-index: 1000;
      }

      &:hover {
        //border: 1px dotted @link-hover-color;
        //box-sizing: border-box;
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
        display: block;
      }

      &:hover {
        //border: 1px dotted @link-hover-color;
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

  .long-form-item-label {
    padding: 10px;
  }
}

.add-content-wrapper {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  position: relative;

  .add-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -20px;
    margin-top: -20px;
  }

  .add-content-item {
    width: 80%;
    margin-bottom: 20px;
    text-align: center;
    padding: 20px;
    border: 1px solid #eee;
    cursor: pointer;

    &:hover {
      background-color: fade(@outline-color, 20%);
      border: 1px solid @primary-color;
    }
  }
}

.select-relevant-tag {
  max-height: 60vh;
  overflow-y: scroll;
}

.action-line {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;

  .button-item {
    margin-left: 10px;
  }
}

.task-audio-line {
  position: relative;
  //width: 600px;
  .task-audio {
    position: absolute;
    right: -55px;
    top: -30px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    img {
      height: 40px;
    }
  }

  &.ant-form-item {
    margin-bottom: 0px;
  }
}

.audio-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 30px;

  audio {
    height: 30px;
    border: none;
    outline: none;
  }

  span {
    padding: 0 10px;
    color: red;
    cursor: pointer;
  }
}

.audio-material-action {
  position: relative;
  display: flex;
  flex-direction: column;

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

  .action-item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
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

.material-action {
  padding: 10px 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .action-item {
    margin-left: 20px;
  }
}

.ant-select-dropdown-menu-item {
  overflow: auto;
  white-space: normal;
}

.self-field-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  line-height: 32px;
  padding-right: 10px;
}

//.form-block {
//position: relative;
//box-sizing: border-box;
//margin-bottom: 10px;
//border: 1px solid #fff;
//padding: 10px 150px 10px 10px;
//border-radius: 3px;
//}

.subject-grade-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .select-item {
    width: 280px;
  }
}

.form-block {
  margin-bottom: 10px;
  position: relative;
  .cb-tooltip{

  }

  &:hover {
    .my-comment-switch {
      display: block;
    }
  }

  .refer-action {
    .refer-text {
      font-family: Inter-Bold;
      line-height: 24px;
      color: #000000;
      margin-right: 10px;
    }

    .refer-btn {
      .refer {
        padding: 10px 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        border-radius: 6px;
      }

      .btn-icon {
        height: 12px;
        width: 12px;
      }

      .btn-text {
        padding-left: 8px;
      }
    }
  }

  /deep/ .ant-form-item label {
    font-size: 16px;
    font-weight: 500;
    font-family: Inter-Bold;
  }
}

.add-sdg-btn {
  padding: 15px 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 5px;
  height: 45px;

  .btn-icon {
    height: 25px;
    width: 25px;
  }

  .btn-text {
    padding-left: 10px;
  }
}

.card-wrapper {
  .unit-plan-form-left {
    position: relative;

    /deep/ .ant-steps-item-content {
      padding-right: 30px;
    }

    .form-radio-wrapper {
      /deep/ .ant-radio-wrapper {
        width: 180px;
      }

      /deep/ .ant-form-item-label {
        width: 170px;
        text-align: left;
      }
    }

  }

  .unit-plan-form-right {
    position: relative;

    .form-block-right {
      .img-wrapper {
        position: relative;
        width: 100%;
      }

      .delete-img {
        position: absolute;
        top: -10px;
        right: -10px;
        background-color: #fafafa;
        border-radius: 50%;
        height: 30px;
        width: 30px;
        text-align: center;
        vertical-align: middle;
        color: @red-5;
        z-index: 100;
        font-size: 20px;
      }
    }
  }
}

.form-input-item {
  margin-bottom: 20px;
  position: relative;
}

.my-form-textarea {
  height: 40px;
  margin-bottom: 10px;
}

.preview-wrapper-row {
  .preview-wrapper-col {
    margin: 15px;
  }

  .view-back-col {
    position: absolute;
    left: -20px;
    top: -20px;

    .view-back {
      .back-icon {
        text-align: left;

        img {
          width: 90%;
          cursor: pointer;
        }
      }
    }
  }
}

.detail-wrapper {
  background: #FFFFFF;
  border: 1px solid #D8D8D8;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 10px;
}

.overview {
  .over-form-block {
    border: 1px solid #15C39A !important;
  }

  .overview-toggle {
    color: #15c39a;
    float: right;
    margin: 5px 0px;
    line-height: 20px;
    border-radius: 5px;

    &:hover {
      background-color: fade(@outline-color, 20%);
      color: @primary-color;
    }
  }

  .overview-task-details {
    //border: 1px solid #15C39A !important;
    margin: 10px 0px;
    margin-bottom: 30px;

    .task-item {
      line-height: 25px;
      //border: 1px solid #e8e8e8;
      border: 1px solid #15c39a;
      padding: 10px;;
      margin-top: 5px;
      border-radius: 5px;

      .task-action-edit {
        height: 20px;
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: right;
      }

      /deep/ .ant-tag {
        border-radius: 5px;
      }
    }
  }
}

.sdg {
  .sdg-form-block {
    border: 1px solid #15C39A !important;

    .my-big-select {
      //width: 600px;
    }
  }

}

.inquiry {
  .inquiry-form-block {
    border: 1px solid #15C39A !important;
  }
}

.form-block-rwc {
  margin-top: -25px;

  /deep/ .ant-form-item-label label {
    font-weight: 500;
    font-family: inherit;
    font-size: 14px;
    line-height: 20px;
    color: #000000;
  }
}

.question {
  .question-form-blocks {
    border: 1px solid #15C39A !important;
  }
}

#inquiry {
  //margin-top: -10px;
  position: relative;
}

.delete-icon {
  transition: all 0.2s ease-in;
  position: absolute;
  right: -50px;
  top: -2px;
  line-height: 40px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  color: #38cfa6;
  z-index: 100;
}

.link-plan-title {
  font-weight: bold;
  margin-bottom: 15px;
}

.browse {
  font-size: 20px;
  padding: 0px 5px;
  position: absolute;
  right: -30px;
  top: 50px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 6px;
}

/deep/ .ant-steps-item-title {
  font-size: 18px
}

.root-locate-form {
  position: relative;
}

.my-comment-switch {
  display: none;
  position: absolute;
  right: -10px;
  top: -5px;
  z-index: 200;
}
.my-comment-show {
  display: block;
}

.collaborate-panel {
  background-color: #fff;
  //box-shadow: 0px 6px 10px rgba(159, 159, 159, 0.16);

  .icon {
    padding: 10px 5px 0 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    svg {
      width: 30px;
    }
  }
}

.ensure-setting-modal {
  padding: 20px;

  .tips {
    margin-bottom: 20px;
    font-family: Inter-Bold;
    font-size: 15px;
    color: #474747;
  }

  .modal-ensure-action-line-center {
    width: 40%;
    display: flex;
    justify-content: space-between;
    margin: 0px auto;
    margin-top: 40px;
  }
}

.recommend-question {
  background: rgba(245, 245, 245, 0.5);
  margin-bottom: 6px;
  position: relative;

  .close-icon {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }

  .recommend-box {
    padding: 10px;

    .title {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .recommend-ul li {
    line-height: 25px;
    cursor: pointer;
    list-style-type: circle;

    .add-question {
      //float: right;
    }

    &:hover {
      color: #15c39a;
    }
  }
}

.question-more {
  top: -40px;
  left: 500px;
  position: absolute;
  cursor: pointer;
}

/deep/ .ant-breadcrumb > span:last-child {
  color: rgba(0, 0, 0, 0.45);
}

.form-block-disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

/deep/ textarea {
  border-radius: 5px;
}

code {
  margin: 0 1px;
  background: #f2f4f5;
  padding: .2em .4em;
  border-radius: 3px;
  font-size: .9em;
  border: 1px solid #eee;
  color: rgba(0, 0, 0, 0.85);
}

.grade-time {
  display: flex;
  justify-content: space-between;

  .range-time {
    /deep/ .ant-input {
      border-radius: 4px;
      font-size: 13px;
      width: 100%;
      padding: 6px 7px;
    }

    .week-time {
      position: absolute;
      /* width: 300px; */
      top: -50px;
      right: 30px
    }
  }

}

.assessment-task-button {
  border: none;
  font-size: 18px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #15C39A;
  opacity: 1;
  float: right;
  margin-top: 5px;
}

.addCategory /deep/ .anticon {
  position: absolute;
  left: 20px;
}

.preview-header-mask {
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  height: 200px;
  right: 0;
  background: transparent;
  opacity: 0;
}

.preview-mask {
  z-index: 999;
  position: absolute;
  background: transparent;
  opacity: 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
}
</style>
