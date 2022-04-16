<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <div class='form-header'>
      <common-form-header
        ref='commonFormHeader'
        :form='form'
        :share-status='shareStatus'
        :collaborate='collaborate'
        :last-change-saved-time='lastChangeSavedTime'
        @view-collaborate='handleViewCollaborate'
        @back='goBack'
        @save='handleSaveTask(true)'
        @share='handleShareTask'
        @publish='handlePublishTask'
        @collaborate='handleStartCollaborate'
      />
    </div>
    <a-card :bordered='false' :loading='contentLoading' :bodyStyle="{ padding: '10px 20px' }">
      <div class='step-nav'>
        <my-vertical-steps
          :steps='$store.getters.formConfigData.taskSteps'
          :step-index='currentActiveStepIndex'
          @step-change='handleStepChange' />
      </div>
      <div class='step-content'>
        <div class='form-body root-locate-form' id='form-body'>
          <div
            class='form-page-item'
            v-show='currentActiveStepIndex === stepIndex'
            v-for='(step, stepIndex) in $store.getters.formConfigData.taskSteps'
            :key='step.id'>

            <div class='form-field-item' v-for='fieldItem in $store.getters.formConfigData.taskCommonList' :key='fieldItem.id'>
              <template v-if='step.commonFields.indexOf(fieldItem.fieldName) !== -1'>
                <div class='form-block tag-content-block' :data-field-name='taskField.Name' v-if='fieldItem.visible && fieldItem.fieldName === taskField.Name' :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="taskId" :fieldName=taskField.Name />
                  <comment-switch
                    v-show="canEdit"
                    :field-name='taskField.Name'
                    :is-active="currentFieldName === taskField.Name"
                    @switch='handleSwitchComment'
                    :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === taskField.Name}" />
                  <a-form-item>
                    <template class='my-label' slot='label'>
                      {{ 'Task name' | taskLabelName(taskField.Name, $store.getters.formConfigData) }}
                      <template v-if='taskLabelHint(taskField.Name, $store.getters.formConfigData)'>
                        <a-tooltip :title="'Task name' | taskLabelHint(taskField.Name, $store.getters.formConfigData)" placement='top'>
                          <a-icon type="info-circle" />
                        </a-tooltip>
                      </template>
                    </template>
                    <a-input v-model='form.name' placeholder='Enter Task Name' class='my-form-input' @change="handleCollaborateEvent(taskId,'name',form.name)" :disabled="!canEdit" />
                  </a-form-item>
                </div>

                <!--关联班级以及开课时间 -->
                <div class='form-block link-class' v-if='isOwner && fieldItem.visible && fieldItem.fieldName === taskField.TaskClassList' :key='fieldItem.fieldName'>
                  <div class='linked-class-list' v-for='(classItem, cIdx) in form.taskClassList' :key='cIdx'>
                    <div class='class-type-tag' v-if='classItem.classType === 1'>
                      <a-tag color="#F4B183">
                        Classcipe International School
                      </a-tag>
                    </div>
                    <div class='class-type-tag' v-if='classItem.classType === 2'>
                      <a-tag color="#9DC3E6">
                        Personal
                      </a-tag>
                    </div>
                    <a-popconfirm cancel-text="No" ok-text="Yes" title="Delete ?" @confirm="handleDeleteClass(cIdx, classItem)" v-show='form.taskMode !== 2'>
                      <div class='remove-class-icon'>
                        <img class='big-delete-icon' src="~@/assets/icons/tag/delete.png" alt=''/>
                      </div>
                    </a-popconfirm>
                    <a-form-item>
                      <template class='my-label' slot='label'>
                        {{ 'Choose class' | taskLabelName(taskField.TaskClassList, $store.getters.formConfigData) }}
                        <template v-if='taskLabelHint(taskField.TaskClassList, $store.getters.formConfigData)'>
                          <a-tooltip :title="'Choose class' | taskLabelHint(taskField.TaskClassList, $store.getters.formConfigData)" placement='top'>
                            <a-icon type="info-circle" />
                          </a-tooltip>
                        </template>
                      </template>
                      <input-with-create
                        v-if="canEdit"
                        :option-list='classList'
                        :disabled-id-list='form.taskClassList.map(item => item.classId)'
                        :index='cIdx'
                        :default-selected-id='classItem.classId'
                        :default-display-name='classItem.className'
                        :tag-type-config='tagTypeConfig'
                        @selected='handleSelectClass(classItem, $event)'
                        @create-new='handleCreateNewClass'/>
                    </a-form-item>

                    <a-form-item label='Schedule a session for this class'>
                      <div class='class-schedule-detail'>
                        <a-switch size='small' class='my-switch' v-model='classItem.checked' @change="handleChangeClassSessionTime(classItem)" />
                        <div
                          class='range-time'
                          v-show='classItem.checked'>
                          <div class='week-time' v-show='classItem.weeks'>
                            <a-tag color='cyan' style='border-radius: 10px;font-size: 14px;'>
                              {{ classItem.weeks }}
                            </a-tag>
                          </div>
                          <a-range-picker
                            v-model='classItem.momentRangeDate'
                            format='LLL'
                            style='width: 430px'
                            :show-time="{ format: 'HH:mm' }"
                            @openChange='handleUpdateWeeks'>
                            <a-icon slot='suffixIcon' type='calendar' />
                          </a-range-picker>
                        </div>
                      </div>
                    </a-form-item>
                  </div>
                  <div class='add-class' v-show='form.taskMode !== 2'>
                    <a-button type='primary' @click='handleAddLinkClass'> + Add class</a-button>
                  </div>
                </div>

                <div class='form-block over-form-block tag-content-block' :data-field-name='taskField.Overview' id='overview' v-if='fieldItem.visible && fieldItem.fieldName === taskField.Overview' :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="taskId" :fieldName=taskField.Overview />
                  <comment-switch
                    v-show="canEdit"
                    :field-name='taskField.Overview'
                    :is-active="currentFieldName === taskField.Overview"
                    @switch='handleSwitchComment'
                    :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === taskField.Overview}" />
                  <a-form-model-item class='task-audio-line' ref='overview'>
                    <template class='my-label' slot='label'>
                      {{ 'Task details' | taskLabelName(taskField.Overview, $store.getters.formConfigData) }}
                      <template v-if='taskLabelHint(taskField.Overview, $store.getters.formConfigData)'>
                        <a-tooltip :title="'Task details' | taskLabelHint(taskField.Overview, $store.getters.formConfigData)" placement='top'>
                          <a-icon type="info-circle" />
                        </a-tooltip>
                      </template>
                    </template>
                    <a-textarea
                      autoSize
                      v-model='form.overview'
                      placeholder='Details'
                      allow-clear
                      @change="handleCollaborateEvent(taskId,taskField.Overview,form.overview)"
                      :disabled="!canEdit"/>
                  </a-form-model-item>
                </div>

                <div class='form-block taskType tag-content-block' :data-field-name='taskField.TaskType' v-if='fieldItem.visible && fieldItem.fieldName === taskField.TaskType' :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="taskId" :fieldName=taskField.TaskType style="left:20px" />
                  <comment-switch
                    v-show="canEdit"
                    :field-name='taskField.TaskType'
                    :is-active="currentFieldName === taskField.TaskType"
                    @switch='handleSwitchComment'
                    :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === taskField.TaskType}" />
                  <a-form-model-item class='task-audio-line' ref='taskType' :colon='false'>
                    <div slot='label'>
                      {{ 'Choose Task Type' | taskLabelName(taskField.TaskType, $store.getters.formConfigData) }}
                      <template v-if='taskLabelHint(taskField.TaskType, $store.getters.formConfigData)'>
                        <a-tooltip :title="'Choose Task Type' | taskLabelHint(taskField.TaskType, $store.getters.formConfigData)" placement='top'>
                          <a-icon type="info-circle" />
                        </a-tooltip>
                      </template>
                    </div>
                    <div class='self-type-wrapper'>
                      <div class='self-field-label'>
                        <div
                          :class="{'task-type-item': true, 'green-active-task-type': form.taskType === 'FA'}"
                          @click="handleSelectTaskType('FA')">FA
                        </div>
                        <div
                          :class="{'task-type-item': true, 'red-active-task-type': form.taskType === 'SA'}"
                          @click="handleSelectTaskType('SA')">SA
                        </div>
                        <div
                          :class="{'task-type-item': true, 'task-type-activity': true,'blue-active-task-type': form.taskType === 'Activity'}"
                          @click="handleSelectTaskType('Activity')">
                          <a-tooltip title='Teaching/Learning Activity' placement='top'>Activity</a-tooltip>
                        </div>
                      </div>
                    </div>
                  </a-form-model-item>
                </div>

                <div class='form-block form-question tag-content-block' :data-field-name='taskField.Question' v-if='associateQuestionList.length > 0 && fieldItem.visible && fieldItem.fieldName === taskField.Question' :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="taskId" :fieldName=taskField.Question />
                  <comment-switch
                    v-show="canEdit"
                    :field-name='taskField.Question'
                    :is-active="currentFieldName === taskField.Question"
                    @switch='handleSwitchComment'
                    :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === taskField.Question}" />
                  <a-form-model-item>
                    <template class='my-label' slot='label'>
                      {{ 'Choose Key questions' | taskLabelName(taskField.Overview, $store.getters.formConfigData) }}
                      <template v-if='taskLabelHint(taskField.Overview, $store.getters.formConfigData)'>
                        <a-tooltip :title="'Choose Key questions' | taskLabelHint(taskField.Overview, $store.getters.formConfigData)" placement='top'>
                          <a-icon type="info-circle" />
                        </a-tooltip>
                      </template>
                    </template>
                    <a-select
                      :getPopupContainer="trigger => trigger.parentElement"
                      @change="handleCollaborateEvent(taskId,taskField.Question,form.questions)"
                      size='large'
                      class='my-big-select'
                      v-model='form.questionIds'
                      mode='multiple'
                      placeholder='Choose Key questions'
                      option-label-prop='label'
                      :disabled="!canEdit"
                    >
                      <a-select-option
                        v-for='(item,index) in associateQuestionList'
                        :value='item.id'
                        :label='item.name'
                        :key='index'>
                        <span class='question-options'>
                          {{ item.name }}
                        </span>
                        From Unit Plan({{ item.unitName }})
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </div>

                <div class='form-block tag-content-block' :data-field-name='taskField.LearnOuts' v-if='fieldItem.visible && fieldItem.fieldName === taskField.LearnOuts' :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="taskId" :fieldName=taskField.Assessment style="left:100px" />
                  <comment-switch
                    v-show="canEdit"
                    :field-name='taskField.Assessment'
                    :is-active="currentFieldName === taskField.Assessment"
                    @switch='handleSwitchComment'
                    :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === taskField.Assessment}" />
                  <a-form-item>
                    <template class='my-label' slot='label'>
                      {{ 'Set learning objectives' | taskLabelName(taskField.LearnOuts, $store.getters.formConfigData) }}
                      <template v-if='taskLabelHint(taskField.LearnOuts, $store.getters.formConfigData)'>
                        <a-tooltip :title="'Set learning objectives' | taskLabelHint(taskField.LearnOuts, $store.getters.formConfigData)" placement='top'>
                          <a-icon type="info-circle" />
                        </a-tooltip>
                      </template>
                    </template>
                    <a-badge :dot='hasExtraRecommend'>
                      <a-button type='primary' @click='handleSelectDescription' :disabled="!canEdit">
                        <div class='btn-text' style='line-height: 20px'>
                          {{ 'Set learning objectives' | unitLabelName(taskField.LearnOuts, $store.getters.formConfigData) }}
                        </div>
                      </a-button>
                    </a-badge>
                  </a-form-item>

                  <!--knowledge tag-select -->
                  <ui-learn-out
                    ref='learnOut'
                    :learn-outs='form.learnOuts'
                    :self-outs='form.selfOuts'
                    :can-edit="canEdit"
                    :custom-tags='customTags'
                    @addCustomTag="handleAddCustomTagRemote"
                    @remove-learn-outs='handleRemoveLearnOuts' />
                </div>

                <div class='form-block tag-content-block material-list-block' :data-field-name='taskField.MaterialList' style='clear: both' v-if='fieldItem.visible && fieldItem.fieldName === taskField.MaterialList' :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="taskId" :fieldName=taskField.MaterialList />
                  <comment-switch
                    v-show="canEdit"
                    :field-name='taskField.MaterialList'
                    :is-active="currentFieldName === taskField.MaterialList"
                    @switch='handleSwitchComment'
                    :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === taskField.MaterialList}" />
                  <div class='form-block-label'>
                    <a-switch size="small" v-model='materialListFlag' @change='handleMaterialListFlagChange' :disabled="!canEdit"/>
                    <div class='label-text'>{{ 'Resources required for hands-on activities' | taskLabelName(taskField.MaterialList, $store.getters.formConfigData) }}</div>
                    <template v-if='taskLabelHint(taskField.MaterialList, $store.getters.formConfigData)'>
                      <a-tooltip :title="'Resources required for hands-on activities' | taskLabelHint(taskField.MaterialList, $store.getters.formConfigData)" placement='top'>
                        <a-icon type="info-circle" />
                      </a-tooltip>
                    </template>
                  </div>
                  <div class='material-list'>
                    <div
                      class='material-item'
                      v-for='(materialItem, mIndex) in form.materialList'
                      :key='mIndex'>
                      <a-row :gutter='[8, 16]'>
                        <a-col span='6'>
                          <a-input
                            v-model='materialItem.name'
                            aria-placeholder='Enter material name'
                            placeholder='Enter material name'
                            :disabled="!canEdit"
                            @change="handleCollaborateEvent(taskId,taskField.MaterialList,form.materialList)"/>
                        </a-col>
                        <a-col span='16'>
                          <a-tooltip placement='topLeft' :mouseEnterDelay="1">
                            <template slot='title'>
                              The link is provided to help other users or students prepare(purchase) the material
                              for this task
                            </template>
                            <a-input
                              addon-before="https://"
                              v-model='materialItem.link'
                              aria-placeholder='Enter URL'
                              placeholder='Enter URL'
                              :disabled="!canEdit"
                              @change="handleCollaborateEvent(taskId, taskField.MaterialList, form.materialList)" >
                              <a-button
                                @click="handleTestWebsiteLink(materialItem)"
                                slot='suffix'
                                shape='round'
                                type='primary'
                                size="small"
                                :disabled='!materialItem.link'>Test</a-button>
                            </a-input>
                            <span class='url-error-tips' v-show='materialItem.link && !checkUrl(materialItem.link)'>Please enter a valid URL</span>
                          </a-tooltip>
                        </a-col>
                        <a-col span='2'>
                          <div class='material-icon'>
                            <img
                              src='~@/assets/icons/evaluation/delete.png'
                              class='delete-icon'
                              @click='handleRemoveMaterialItem(materialItem, mIndex)' />
                          </div>
                        </a-col>
                      </a-row>
                    </div>
                    <span class='add-material-item' v-show='materialListFlag'>
                      <add-green-icon class='add-input' @click='handleAddMaterial' />
                    </span>
                  </div>
                </div>

                <div class='form-block tag-content-block' :data-field-name='taskField.Slides' v-if='fieldItem.visible && fieldItem.fieldName === taskField.Slides' :key='fieldItem.fieldName'>
                  <div class="edit-in-slide" v-if="!form.fileDeleted">
                    <a-button
                      v-show="canEdit && form.taskMode === 1"
                      class='action-ensure action-item edit-slide'
                      type='primary'
                      shape='round'
                      @click='handleShowSelectMyContent'
                      style='margin-right: 10px'>
                      Select slide(s)
                    </a-button>
                    <a-button
                      class="action-ensure action-item edit-slide"
                      :loading="creating"
                      :disabled="!canEdit"
                      type="primary"
                      shape="round"
                      @click="handleEditGoogleSlide()"
                      v-show='form.taskMode === 1'>
                      Edit google slide(s)
                    </a-button>
                    <a-tooltip
                      placement='top'
                      title='Select slide(s) on/off'
                      v-show='form.taskMode === 1'>
                      <a-switch
                        class='slide-switch'
                        :disabled='selectedTemplateIdList.length === 0 || !canEdit'
                        checked-children='On'
                        un-checked-children='Off'
                        v-model='form.showSelected'
                        @click='changeSelected' />
                    </a-tooltip>
                  </div>
                  <div class='edit-in-slide' v-if='form.taskMode === 2'>
                    <a-button
                      class='action-ensure action-item edit-slide'
                      type='primary'
                      shape='round'
                      @click='handleChooseAntherPrompt'
                      style='margin-right: 10px'>
                      Choose another
                    </a-button>
                  </div>
                  <div class='top-icon-groups' v-if='!form.showSelected'>
                    <a-col class='material-row'>
                      <div class='icon-group'>
                        <a-badge
                          :count="showMaterialSize('text')"
                          v-if="currentPageMaterial.hasOwnProperty('text')">
                          <div class='icon' @click="showPluginMaterial('text')">
                            <text-type-svg />
                            <div class='icon-text'>Text</div>
                          </div>
                        </a-badge>
                        <a-badge
                          :count="showMaterialSize('image')"
                          v-if="currentPageMaterial.hasOwnProperty('image')">
                          <div class='icon' @click="showPluginMaterial('image')">
                            <image-type-svg />
                            <div class='icon-text'>Image</div>
                          </div>
                        </a-badge>
                        <a-badge
                          :count="showMaterialSize('video')"
                          v-if="currentPageMaterial.hasOwnProperty('video')">
                          <div class='icon' @click="showPluginMaterial('video')">
                            <video-type-svg />
                            <div class='icon-text'>Video</div>
                          </div>
                        </a-badge>
                        <a-badge
                          :count="showMaterialSize('audio')"
                          v-if="currentPageMaterial.hasOwnProperty('audio')">
                          <div class='icon' @click="showPluginMaterial('audio')">
                            <audio-type-svg />
                            <div class='icon-text'>Audio</div>
                          </div>
                        </a-badge>
                        <a-badge
                          :count="showMaterialSize('iframe')"
                          v-if="currentPageMaterial.hasOwnProperty('iframe')">
                          <div class='icon' @click="showPluginMaterial('iframe')">
                            <youtube-type-svg />
                            <div class='icon-text'>Youtube</div>
                          </div>
                        </a-badge>
                        <a-badge :count="showMaterialSize('pdf')" v-if="currentPageMaterial.hasOwnProperty('pdf')">
                          <div class='icon' @click="showPluginMaterial('pdf')">
                            <pdf-type-svg />
                            <div class='icon-text'>PDF</div>
                          </div>
                        </a-badge>
                        <a-badge
                          :count="showMaterialSize('website')"
                          v-if="currentPageMaterial.hasOwnProperty('website')">
                          <div class='icon' @click="showPluginMaterial('website')">
                            <url-type-svg />
                            <div class='icon-text'>Website</div>
                          </div>
                        </a-badge>
                        <a-badge>
                          <div class='my-add-material' v-if='form.presentationId && canEdit'>
                            <upload-enter />
                          </div>
                        </a-badge>
                      </div>
                    </a-col>
                  </div>
                  <div class='template-selected' v-if='form.showSelected'>
                    <div class='template-list' v-if='!templateLoading'>
                      <div
                        :class="{'template-item': true }"
                        v-for='(template,index) in selectedTemplateList'
                        :key='index'>
                        <div class='template-hover-action-mask' v-show="canEdit">
                          <div class='template-hover-action'>
                            <div class='modal-ensure-action-line'>
                              <a-button
                                class='action-ensure action-item'
                                shape='round'
                                @click='handlePreviewTemplate(template)'>
                                <a-icon type='eye' theme='filled' />
                                <div class='btn-text'>
                                  Preview
                                </div>
                              </a-button>
                              <a-button
                                class='action-ensure action-item'
                                shape='round'
                                @click='removeSelectTemplate(template)'>
                                <a-icon type='minus-circle' theme='filled' />
                                <div class='btn-text'>
                                  Remove
                                </div>
                              </a-button>
                            </div>
                          </div>
                        </div>
                        <div
                          class='template-cover'
                          :style="{backgroundImage: 'url(' + (template.cover ? template.cover : template.image) + ')'}">
                        </div>
                        <div class='template-info'>
                          <div class='template-name'>{{ template.name }}</div>
                          <div class='template-intro' v-show='template.introduce'>{{ template.introduce }}</div>
                        </div>
                        <div class='template-select-icon'>
                          <img src='~@/assets/icons/task/selected.png' />
                        </div>
                      </div>
                    </div>
                  </div>
                  <a-skeleton :loading='skeletonLoading' active>
                    <div class='slide-select-wrapper' ref='slide' v-if='!form.showSelected'>
                      <div class='slide-select-and-preview' style='width: 100%; height: 100%;'>
                        <div class='slide-select-action' v-show='!form.presentationId'>
                          <img
                            src='https://dcdkqlzgpl5ba.cloudfront.net/file/202111271330492511-Welcome_slide.png' />
                        </div>
                        <div
                          class='slide-preview'
                          style='width: 100%; height: 100%;'
                          v-show='!form.showSelected && form.presentationId && thumbnailList.length'>
                          <a-carousel ref='carousel' arrows :after-change='onChangePage'>
                            <div slot='prevArrow' class='custom-slick-arrow' style='left: -29px;zIndex: 9'>
                              <a-icon type='left-circle' />
                            </div>
                            <div slot='nextArrow' class='custom-slick-arrow' style='right: -25px;zIndex: 9'>
                              <a-icon type='right-circle' />
                            </div>
                            <div v-for='(item,index) in thumbnailList' :key='index'>
                              <img :src='item.contentUrl' />
                            </div>
                          </a-carousel>
                          <div class='plugin-tags' v-if='currentPageItem'>
                            <a-row class='tag-row'>
                              <span class='tag-item' v-if='currentPageItem.data.bloomLevel'>
                                <span class='tag-title'>Bloom's Taxonomy:</span>
                                <span class='tag-value' style='color:#F16A39'>{{ currentPageItem.data.bloomLevel
                                }}</span>
                              </span>
                              <span class='tag-item' v-if='currentPageItem.data.knowledgeLevel'>
                                <span class='tag-title'>Knowledge dimension(s):</span>
                                <span
                                  class='tag-value'
                                  style='color:#F16A39'>{{ currentPageItem.data.knowledgeLevel }}</span>
                              </span>
                            </a-row>
                            <a-row class='tag-row'>
                              <span class='tag-item' v-if='currentPageItem.data.verbs && currentPageItem.data.verbs.length > 0'>
                                <span class='tag-title'>Command terms:</span>
                                <span
                                  class='tag-value'
                                  v-for='(v,index) in currentPageItem.data.verbs'
                                  :key='index'
                                  style='color:#15C39A'>{{ v }}</span>
                              </span>
                              <span class='tag-item' v-if='currentPageTips'>
                                <span class='tag-title'>Tip added:</span>
                                <span class='tag-value' style='color:#0054FF'>{{ currentPageTips.tip }}</span>
                              </span>
                            </a-row>
                            <a-row class='tag-row' v-if="currentPageItem.data.learnOuts && currentPageItem.data.learnOuts.length > 0">
                              <span class='tag-item'>
                                <span class='tag-title'>Assessment objective(s):</span>
                                <span
                                  class='tag-value'
                                  v-for='(learn,index) in currentPageItem.data.learnOuts'
                                  :key='index'
                                  style='color:#00BCF2'>
                                  <a-tooltip
                                    :title='learn.path'
                                    :overlayStyle="{ 'z-index': '3000'}">{{ learn.name }} </a-tooltip>
                                </span>
                              </span>
                            </a-row>
                            <a-row class='tag-row'>
                              <span class='tag-item'>
                                <span class='tag-title'>This is a <span>{{ currentPageItem.type }}</span> slide</span>
                              </span>
                            </a-row>
                          </div>
                          <div class='page-info' v-if='thumbnailList && thumbnailList.length'>
                            {{ currentImgIndex + 1 }} / {{ thumbnailList.length }}
                          </div>
                          <div class='carousel-page'>
                            <div class='img-list-wrapper'>
                              <div class='img-list'>
                                <div
                                  class='img-item'
                                  :class="{'active-img-item': currentImgIndex === index}"
                                  v-for='(item,index) in thumbnailList'
                                  :key="'index' + index"
                                  @click='handleGotoImgIndex(index)'>
                                  <img :src='item.contentUrl' />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a-skeleton>
                </div>

                <div class='form-block tag-content-block' :data-field-name='taskField.Associate' v-if='fieldItem.visible && fieldItem.fieldName === taskField.Associate' :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="taskId" :field-name='taskField.Link' />
                  <comment-switch
                    v-show="canEdit"
                    :is-active="currentFieldName === taskField.Link"
                    @switch='handleSwitchComment'
                    :field-name='taskField.Link'
                    :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === taskField.Link}" />
                  <div class='common-link-wrapper'>
                    <task-link :can-edit="canEdit" ref='commonLink' :from-id='taskId' :from-type='contentType.task' />
                  </div>
                </div>

                <div class='form-block' :data-field-name='taskField.Image' v-if='fieldItem.visible && fieldItem.fieldName === taskField.Image' :key='fieldItem.fieldName'>
                  <!-- image-->
                  <a-form-model-item class='img-wrapper'>
                    <a-upload-dragger
                      name='file'
                      accept='image/png, image/jpeg'
                      :showUploadList='false'
                      :customRequest='handleUploadImage'
                      :disabled="!canEdit"
                    >
                      <div class='delete-img' @click='handleDeleteImage($event)' v-show='form.image' v-if="canEdit">
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
                          <div class='upload-text-mask'>
                            <div class='upload-text'>
                              <a-button shape='round' type='primary'>Upload a cover image</a-button>
                            </div>
                          </div>
                        </div>
                      </template>
                      <template v-if='!uploading && form && !form.image'>
                        <div class='upload-container'>
                          <p class='ant-upload-drag-icon'>
                            <img src='~@/assets/icons/lesson/upload_icon.png' class='upload-icon' />
                          </p>
                          <p class='ant-upload-text'>
                            Upload a cover image
                          </p>
                        </div>
                      </template>
                    </a-upload-dragger>
                  </a-form-model-item>
                </div>
              </template>
            </div>
            <div class='form-field-item custom-field' v-for='custFieldItem in $store.getters.formConfigData.taskCustomList' :key='custFieldItem.id'>
              <template v-if='step.customFields.indexOf(custFieldItem.fieldName) !== -1'>
                <div class='form-block tag-content-block' v-if="custFieldItem.visible && form.customFieldData && form.customFieldData.hasOwnProperty(custFieldItem.id)" :key='custFieldItem.id' :data-field-name="'cust_' + custFieldItem.name" :data-field-id='custFieldItem.id'>
                  <a-form-item>
                    <template class='my-label' slot='label'>
                      {{ custFieldItem.name }}
                      <template v-if='custFieldItem.hint'>
                        <a-tooltip :title="custFieldItem.hint" placement='top'>
                          <a-icon type="info-circle" />
                        </a-tooltip>
                      </template>
                    </template>
                    <a-input v-model='form.customFieldData[custFieldItem.id]' class='my-form-input' :disabled="!canEdit"/>
                  </a-form-item>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class='tag-body'>
          <template v-if='currentRightModule === rightModule.collaborate'>
            <a-skeleton :loading='showHistoryLoading' active>
              <div
                class='collaborate-panel'
                :style="{'width':rightWidth + 'px', 'margin-top': '0px', 'z-index': 100, 'padding': '10px'}">
                <div class='icon'>
                  <comment-icon />
                </div>
                <a-tabs :default-active-key='defaultHistoryKey'>
                  <a-tab-pane key='1' tab='Comment'>
                    <collaborate-comment-view
                      :source-id='taskId'
                      :source-type='contentType.task'
                      :comment-list='collaborateCommentList'
                      :collaborate-user-list="collaborate.users"
                      @update-comment='handleUpdateCommentList' />
                  </a-tab-pane>
                  <a-tab-pane key='2' tab='History' force-render>
                    <collaborate-history :history-list='historyList' @restore='handleRestoreField' />
                  </a-tab-pane>
                </a-tabs>
              </div>
            </a-skeleton>
          </template>
          <template v-if='currentRightModule === rightModule.collaborateComment'>
            <div
              class='collaborate-panel'
              :style="{'width':rightWidth + 'px', 'margin-top':collaborateTop+'px', 'z-index': 100, 'padding': '10px'}">
              <collaborate-comment-panel
                :source-id='taskId'
                :source-type='contentType.task'
                :field-name='currentFieldName'
                :comment-list='currentCollaborateCommentList'
                :collaborate-user-list="collaborate.users"
                @cancel-comment="handleCancelComment"
                @update-comment='handleUpdateCommentList' />
            </div>
          </template>
          <template v-if='currentRightModule === rightModule.recommend'>
            <!--购物车效果截图 -->
            <div class='slide-animate-cover' id='slide-animate' v-show='currentSlideCoverImgSrc'>
              <img
                id='slide-animate-img'
                :src='currentSlideCoverImgSrc'
                class='slide-animate-item' />
            </div>
            <div class='recommend-loading' v-if='recomendListLoading'>
              <a-spin size='large' />
            </div>
            <div class='form-block-right' v-if='!recomendListLoading && canEdit && !form.fileDeleted'>
              <div class='right-title'>Recommended</div>
              <div class='slide-preview-list'>
                <div
                  class='slide-preview-item'
                  v-for='(template, rIndex) in filterRecommendTemplateList'
                  :key='rIndex'>
                  <div class='template-hover-action-mask'>
                    <div class='template-hover-action'>
                      <div class='modal-ensure-action-line'>
                        <a-button
                          class='action-ensure action-item'
                          shape='round'
                          @click='handlePreviewTemplate(template)'
                        >
                          <a-icon type='eye' theme='filled' />
                          <div class='btn-text'>
                            Preview
                          </div>
                        </a-button>
                        <a-button
                          v-if='selectedTemplateIdList.indexOf(template.id) === -1'
                          class='action-ensure action-item'
                          shape='round'
                          @click='selectRecommendTemplate(template, rIndex, $event)'>
                          <a-icon type='plus-circle' theme='filled' />
                          <div class='btn-text'>
                            Add
                          </div>
                        </a-button>
                        <a-button
                          v-else
                          class='action-ensure action-item'
                          shape='round'
                          @click='handleRemoveTemplate(template)'
                        >
                          <a-icon type='minus-circle' theme='filled' />
                          <div class='btn-text'>
                            Remove
                          </div>
                        </a-button>
                      </div>
                    </div>
                  </div>
                  <a-carousel arrows>
                    <div slot='prevArrow' class='custom-slick-arrow' style='left: 10px;zIndex: 100'>
                      <a-icon type='left-circle' />
                    </div>
                    <div slot='nextArrow' class='custom-slick-arrow' style='right: 10px;zIndex: 100'>
                      <a-icon type='right-circle' />
                    </div>
                    <div v-for='(item,index) in template.images' :key='index'>
                      <img :src='item' />
                    </div>
                  </a-carousel>
                  <a-row v-if='template.introduce' class='slide-desc' :title='template.introduce'>
                    {{ template.introduce }}
                  </a-row>
                  <div class='recommend-slide-name'>
                    {{ template.name }}
                  </div>
                </div>
              </div>
            </div>
            <!--quick-task recommend -->
            <div class='form-block-right' v-if='!recomendListLoading && canEdit && form.taskMode === 2'>
              <div class='right-title'>Recommended</div>
              <div class='slide-preview-list'>
                <div
                  class='slide-preview-item'
                  v-for='(template, rIndex) in filterRecommendTemplateList'
                  :key='rIndex'>
                  <div class='template-hover-action-mask'>
                    <div class='template-hover-action'>
                      <div class='modal-ensure-action-line'>
                        <a-button
                          class='action-ensure action-item'
                          shape='round'
                          @click='handlePreviewQuickTaskTemplate(template)'
                        >
                          <a-icon type='eye' theme='filled' />
                          <div class='btn-text'>
                            Preview
                          </div>
                        </a-button>
                      </div>
                    </div>
                  </div>
                  <a-carousel arrows>
                    <div slot='prevArrow' class='custom-slick-arrow' style='left: 10px;zIndex: 100'>
                      <a-icon type='left-circle' />
                    </div>
                    <div slot='nextArrow' class='custom-slick-arrow' style='right: 10px;zIndex: 100'>
                      <a-icon type='right-circle' />
                    </div>
                    <div v-for='(item,index) in template.images' :key='index'>
                      <img :src='item' />
                    </div>
                  </a-carousel>
                  <a-row v-if='template.introduce' class='slide-desc' :title='template.introduce'>
                    {{ template.introduce }}
                  </a-row>
                  <div class='recommend-slide-name'>
                    {{ template.name }}
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-if='currentRightModule === rightModule.customTag'>
            <div v-if='!this.contentLoading' :style="{'width':rightWidth+'px', 'margin-top':customTagTop+'px'}">
              <custom-tag
                ref='customTag'
                :show-arrow='showCustomTag'
                :custom-tags='customTags'
                :scope-tags-list='customTagList'
                :selected-tags-list='form.customTags'
                :current-field-name='currentFocusFieldName'
                @reload-user-tags='loadCustomTags'
                @change-add-keywords='handleChangeAddKeywords'
                @change-user-tags='handleChangeCustomTags'></custom-tag>
            </div>
          </template>
        </div>
      </div>
    </a-card>

    <a-modal
      v-model='showCollaborateModalVisible'
      :footer='null'
      :maskClosable='false'
      :closable='true'
      destroyOnClose
      width='640px'>
      <collaborate-user-list
        :content-id='taskId'
        :main-content='collaborateContent'
        :content-type='contentType.task'
        @confirmSelect='confirmSelectCollaborateUsers'
        v-if='showCollaborateModalVisible' />
    </a-modal>
    <a-modal
      v-model='selectAddContentTypeVisible'
      :footer='null'
      destroyOnClose
      title='Select Content Type'
      @ok='selectAddContentTypeVisible = false'
      @cancel='selectAddContentTypeVisible = false'>
      <div class='add-content-wrapper'>
        <div class='add-content-item' @click='handleAddTaskEvaluation'>
          <a>
            <content-type-icon :type='contentType.evaluation' />
            {{ $t('teacher.add-unit-plan.evaluation') }}
          </a>
        </div>
        <div class='add-loading' v-if='addLoading'>
          <a-spin />
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model='selectLinkUnitPlanContentVisible'
      :footer='null'
      destroyOnClose
      :dialog-style="{ top: '10px'}"
      width='900px'>
      <div class='my-modal-title' slot='title'>
        Link Unit Plan
      </div>
      <div class='link-content-wrapper'>
        <new-my-content
          :from-type='contentType.task'
          :from-id='taskId'
          :filter-type-list="[contentType['unit-plan']]"
          :group-name-list='groupNameList'
          default-group-name='Relevant Unit Plan(s)'
          :show-tabs='false'
          :show-create='false'
          :mode="'common-link'"
          :group-name-mode='groupNameMode'
          @cancel='selectLinkUnitPlanContentVisible = false'
          @ensure='handleEnsureSelectedLink' />
      </div>
    </a-modal>
    <a-modal
      v-model='selectLinkContentVisible'
      :footer='null'
      destroyOnClose
      :dialog-style="{ top: '10px'}"
      width='900px'>
      <div class='my-modal-title' slot='title'>
        Link Assessment rubric(s)
      </div>
      <div class='link-content-wrapper'>
        <new-my-content
          :from-type='contentType.task'
          :from-id='taskId'
          :filter-type-list='[contentType.evaluation]'
          :group-name-list='groupNameList'
          default-group-name='Linked assessment tool(s)'
          :show-tabs='false'
          :mode="'common-link'"
          :group-name-mode='groupNameMode'
          @cancel='selectLinkContentVisible = false'
          @ensure='handleEnsureSelectedLink' />
      </div>
    </a-modal>
    <a-modal
      v-model='viewInGoogleSlideVisible'
      :footer='null'
      destroyOnClose
      title='Created Successfully'
      @ok='viewInGoogleSlideVisible = false'
      @cancel='viewInGoogleSlideVisible = false'>
      <div class='view-in-google-slider'>
        <div class='view-line'>
          <div class='link-url'>
            <a :href='presentationLink' target='_blank'>{{ presentationLink }}</a>
          </div>
          <div class='view-action'>
            <a-button type='primary' :loading='editGoogleSlideLoading' @click='handleEditGoogleSlide()'>Edit in Google Slides</a-button>
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model='selectedMyContentVisible'
      :footer='null'
      :title='null'
      :zIndex='2000'
      :mask='false'
      :maskClosable='false'
      destroyOnClose
      :dialog-style="{ top: '10px','margin-left':selectedTemplateMarginLeft,'transition': '0.8s' }"
      :width='selectedTemplateMadelWidth'
      :closable='!selectedTemplateDrawerVisible'
      @ok='selectedMyContentVisible = false'>
      <a-tabs class='template-tabs'>
        <a-tab-pane key='1' tab='Slide template(s)'>
          <div class='select-template-wrapper'>
            <!--              <div class="template-show-filter">-->
            <!--                <div class="icon" style="height:20px">-->
            <!--                  <a-tooltip title="Expand filter" placement="right">-->
            <!--                    <img-->
            <!--                      v-if="!showTemplateFilter"-->
            <!--                      src="~@/assets/icons/tag/add.png"-->
            <!--                      @click="showTemplateFilter = !showTemplateFilter">-->
            <!--                  </a-tooltip>-->
            <!--                  <a-tooltip title="Collapse filter" placement="right">-->
            <!--                    <img-->
            <!--                      v-if="showTemplateFilter"-->
            <!--                      src="~@/assets/icons/task/toggle.png"-->
            <!--                      @click="showTemplateFilter = !showTemplateFilter">-->
            <!--                  </a-tooltip>-->
            <!--                </div>-->
            <!--              </div>-->
            <div class='template-select-header'>
              <div class='group-filter'>
                <a-radio-group v-model='filterType' button-style='solid' @change='changeFilterType'>
                  <a-radio-button :value='1'>
                    Learning Experience
                  </a-radio-button>
                  <a-radio-button :value='2'>
                    Assessment
                  </a-radio-button>
                  <a-radio-button :value='3'>
                    21st Century Skills
                  </a-radio-button>
                  <a-radio-button :value='4'>
                    5E model
                  </a-radio-button>
                </a-radio-group>
                <a-button
                  v-if='showTemplateFilter'
                  type='link'
                  class='clear-all'
                  @click='clearFilter()'
                  style='float:right;'>
                  Clear all
                </a-button>
              </div>
              <a-row v-if='filterType == 1 && showTemplateFilter'>
                <div class='filter-row'>
                  <div class='row-select'>
                    <div
                      class='sub-select'
                      v-for="(item ,index) in templateFilterCondition(templateType.Learning,'')"
                      :key='index'>
                      <a-row>
                        <h4>{{ item.name }}</h4>
                      </a-row>
                      <div class='sub-items'>
                        <div class='sub-item' v-for='(child,cIndex) in item.children' :key='cIndex'>
                          <a-checkbox
                            :value='child.id'
                            @change='onChangeCheckBox($event,templateType.Learning,item)'
                            :checked='filterLearn.indexOf(child.id) > -1 ? true: false'>
                            {{ child.name }}
                          </a-checkbox>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a-row>
              <a-row v-if='filterType == 2 && showTemplateFilter'>
                <a-tabs
                  class='assessments-tabs'
                  v-model='filterAssessmentsType'
                  :defaultActiveKey='filterAssessmentsType'
                  @change='changeFilterType'
                  :animated="false"
                  :tabBarGutter='3'
                  :tabBarStyle="{margin:'10px 20px'}">
                  <a-tab-pane key='1' tab='Knowledge focus'>
                    <div class='filter-row'>
                      <a-row>
                        <div class='row-select row-select-assessments'>
                          <a-col :span='24'>
                            <!--                          <span class="sub-category">Knowledge focus </span>-->
                            <div
                              class='sub-select'
                              v-for="(item ,index) in templateFilterCondition(templateType.Assessments,'Knowledge focus')"
                              :key='index'>
                              <a-row>
                                <h4>{{ item.name }}</h4>
                              </a-row>
                              <div class='sub-items'>
                                <div class='sub-item' v-for='(child,cIndex) in item.children' :key='cIndex'>
                                  <a-radio
                                    :name='item.name'
                                    :value='child.id'
                                    :checked="filterAssessments.indexOf(child.id) !== -1"
                                    @click='onClickRadio($event,templateType.Assessments,item)'>
                                    {{ child.name }}
                                  </a-radio>
                                </div>
                              </div>
                            </div>
                          </a-col>
                        </div>
                      </a-row>
                    </div>
                  </a-tab-pane>
                  <a-tab-pane key='2' tab='Skill focus' force-render>
                    <div class='filter-row'>
                      <a-row>
                        <div class='row-select row-select-assessments'>
                          <a-col :span='24'>
                            <!--                          <span class="sub-category">Skill focus</span>-->
                            <div
                              class='sub-select'
                              v-for="(item ,index) in templateFilterCondition(templateType.Assessments,'Skill focus')"
                              :key='index'>
                              <a-row>
                                <h4>{{ item.name }}</h4>
                              </a-row>
                              <div class='sub-items'>
                                <div class='sub-item' v-for='(child,cIndex) in item.children' :key='cIndex'>
                                  <a-radio
                                    :name='item.name'
                                    :value='child.id'
                                    :checked="filterAssessments.indexOf(child.id) !== -1"
                                    @click='onClickRadio($event,templateType.Assessments,item)'>
                                    {{ child.name }}
                                  </a-radio>
                                </div>
                              </div>
                            </div>
                          </a-col>
                        </div>
                      </a-row>
                    </div>
                  </a-tab-pane>
                </a-tabs>

              </a-row>
              <a-row v-if='filterType == 3 && showTemplateFilter'>
                <div class='filter-row'>
                  <a-row class='row-select'>
                    <a-row>
                      <a-tabs
                        :activeKey='selectYearTab'
                        @change='handleTabYearChange'
                        tab-position='top'
                        size='small'
                        :tabBarGutter='1'>
                        <a-tab-pane v-for='(tag) in centuryTagMap' :key='tag[0]' :tab='tag[0]' />
                      </a-tabs>
                    </a-row>
                    <a-col :span='12'>
                      <a-col
                        class='sub-select'
                        v-if='index < 2'
                        :span='24'
                        v-for="(item ,index) in templateFilterCondition(templateType.Century,'')"
                        :key='index'>
                        <a-row>
                          <h4>{{ item.name }}</h4>
                        </a-row>
                        <a-row v-for='(child,cIndex) in item.children' :key='cIndex'>
                          <a-col :span='24' class='first-child'>
                            <a-checkbox
                              :value='child.id'
                              @change='onChangeCheckBox($event,templateType.Century,child)'
                              :checked='filterCentury.indexOf(child.id) > -1 ? true: false'>
                              {{ child.name }}
                            </a-checkbox>
                            <div class='sub-child'>
                              <a-row
                                v-if='child.children.length > 0'
                                v-for='(subChild,subIndex) in child.children'
                                :key='subIndex'>
                                <a-col :span='24' class='sub-child-child'>
                                  <a-checkbox
                                    :value='subChild.id'
                                    @change='onChangeCheckBox($event,templateType.Century,child)'
                                    :checked='filterCentury.indexOf(subChild.id) > -1 ? true: false'>
                                    <a-tooltip
                                      placement='right'
                                      :overlayStyle="{ 'z-index': '3000'}"
                                      :title='filterGradeTips(subChild)'> {{ subChild.name }}
                                    </a-tooltip>
                                  </a-checkbox>
                                </a-col>
                              </a-row>
                            </div>
                          </a-col>
                        </a-row>
                      </a-col>
                    </a-col>
                    <a-col :span='12'>
                      <a-col
                        class='sub-select'
                        v-if='index >= 2'
                        :span='24'
                        v-for="(item ,index) in templateFilterCondition(templateType.Century,'')"
                        :key='index'>
                        <a-row>
                          <h4>{{ item.name }}</h4>
                        </a-row>
                        <a-row v-for='(child,cIndex) in item.children' :key='cIndex'>
                          <a-col :span='24' class='first-child'>
                            <a-checkbox
                              :value='child.id'
                              @change='onChangeCheckBox($event,templateType.Century,child)'
                              :checked='filterCentury.indexOf(child.id) > -1 ? true: false'>
                              {{ child.name }}
                            </a-checkbox>
                            <div class='sub-child'>
                              <a-row
                                v-if='child.children.length > 0'
                                v-for='(subChild,subIndex) in child.children'
                                :key='subIndex'>
                                <a-col class='sub-child-child' :span='24'>
                                  <a-checkbox
                                    :value='subChild.id'
                                    @change='onChangeCheckBox($event,templateType.Century,child)'
                                    :checked='filterCentury.indexOf(subChild.id) > -1 ? true: false'>
                                    <a-tooltip placement='top' :title='filterGradeTips(subChild)'> {{ subChild.name
                                    }}
                                    </a-tooltip>
                                  </a-checkbox>
                                </a-col>
                              </a-row>
                            </div>
                          </a-col>
                        </a-row>
                      </a-col>
                    </a-col>
                  </a-row>
                </div>
              </a-row>
              <a-row v-if='filterType == 4 && showTemplateFilter'>
                <div class='filter-row'>
                  <div class='row-select'>
                    <div class='sub-select'>
                      <a-row>
                        <h4></h4>
                      </a-row>
                      <div class='sub-items'>
                        <div class='sub-item' v-for='(item,cIndex) in initPrompts' :key='cIndex' v-if="item.text !== 'General purpose'">
                          <a-checkbox
                            :value='item.value'
                            @change='onChangeCheckBox($event,templateType.Prompt,item)'
                            :checked='filterPruposeList.indexOf(item.value) > -1 ? true: false'>
                            {{ item.text }}
                          </a-checkbox>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </a-row>
              <div class='expand-icon' v-if='showTemplateFilter' @click='toggleUpFilter()'>
                <a-icon type='up-circle' theme='filled' title='Collapse filter' />
                Close
              </div>
            </div>
            <div class='template-list-wrapper'>
              <div class='template-list' v-if='!templateLoading'>
                <!--购物车效果截图 -->
                <!--                  <div class="slide-animate-cover" id="slide-animate-drawer" v-show="currentSlideCoverImgSrc">-->
                <!--                    <img-->
                <!--                      id="slide-animate-img-drawer"-->
                <!--                      :src="currentSlideCoverImgSrc"-->
                <!--                      class="slide-animate-item" />-->
                <!--                  </div>-->
                <div
                  :class="{'template-item': true, 'template-item-active': template.id && drawerSelectedTemplateIds.indexOf(template.id) !== -1 }"
                  v-for='(template,index) in templateList'
                  :key='index'>
                  <div class='template-hover-action-mask'>
                    <div class='template-hover-action'>
                      <div class='modal-ensure-action-line'>
                        <a-button
                          class='action-ensure action-item'
                          shape='round'
                          @click='handlePreviewTemplate(template)'
                        >
                          <a-icon type='eye' theme='filled' />
                          <div class='btn-text'>
                            Preview
                          </div>
                        </a-button>
                        <a-button
                          v-if='drawerSelectedTemplateIds.indexOf(template.id) === -1'
                          class='action-ensure action-item'
                          shape='round'
                          @click='handleSelectTemplateMadelAnimate(template, $event)'>
                          <a-icon type='plus-circle' theme='filled' />
                          <div class='btn-text'>
                            Add
                          </div>
                        </a-button>
                        <a-button
                          v-else
                          class='action-ensure action-item'
                          shape='round'
                          @click='handleSelectTemplateMadel(template)'
                        >
                          <a-icon type='minus-circle' theme='filled' />
                          <div class='btn-text'>
                            Remove
                          </div>
                        </a-button>
                      </div>
                    </div>
                  </div>
                  <div
                    class='template-cover'
                    :style="{backgroundImage: 'url(' + (template.cover ? template.cover : template.image) + ')'}">
                  </div>
                  <div class='template-info'>
                    <div class='template-name'>{{ template.name }}</div>
                    <div class='template-intro'>{{ template.introduce }}</div>
                  </div>
                  <div
                    class='template-select-icon'
                    v-if='template.id && drawerSelectedTemplateIds.indexOf(template.id) !== -1'>
                    <img
                      src='~@/assets/icons/task/selected.png'
                      v-if='template.id && drawerSelectedTemplateIds.indexOf(template.id) !== -1 ' />
                  </div>
                </div>
              </div>
              <div class='no-template' v-if='!templateLoading && templateList.length === 0'>
                <a-empty />
              </div>
              <div class='template-loading' v-if='templateLoading'>
                <a-spin />
              </div>
            </div>
            <!--              <div class="template-action">-->
            <!--                <div class="create-loading" v-if="creating">-->
            <!--                  <a-spin />-->
            <!--                </div>-->
            <!--                <div style="position: absolute;left:20px"><a-radio :checked="onlyShowSelected" @click="onChangeShowSelected">Only selected template</a-radio></div>-->
            <!--                <a-button-->
            <!--                  v-if="!form.presentationId"-->
            <!--                  @click="handleAddTemplate"-->
            <!--                  :style="{'display': 'flex', 'align-items': 'center', 'justify-content': 'center', 'padding': '10px'}"-->
            <!--                  shape="round"-->
            <!--                  type="primary"-->
            <!--                  :loading="creating">-->
            <!--                  <img src="~@/assets/icons/task/path.png" class="btn-icon"/>-->
            <!--                  <div class="btn-text">-->
            <!--                    Create the task in Google Slides-->
            <!--                  </div>-->
            <!--                </a-button>-->
            <!--                <a-button-->
            <!--                  v-if="form.presentationId"-->
            <!--                  @click="handleSelectedTemplate"-->
            <!--                  :style="{'display': 'flex', 'align-items': 'center', 'justify-content': 'center', 'padding': '10px'}"-->
            <!--                  shape="round"-->
            <!--                  type="primary"-->
            <!--                  :loading="creating">-->
            <!--                  <img src="~@/assets/icons/task/path.png" class="btn-icon"/>-->
            <!--                  <div class="btn-text">-->
            <!--                    Save selected templates-->
            <!--                  </div>-->
            <!--                </a-button>-->
            <!--              </div>-->
          </div>
        </a-tab-pane>
        <a-tab-pane key='2' tab='My content'>
          <div class='link-content-wrapper'>
            <my-content-selector
              :current-id='taskId'
              :filter-type-list="['task']"
              :selected-list='drawerSelectedTemplateIds'
              mode='select'
            />
          </div>
          <!--            <div class="action-line">-->
          <!--              &lt;!&ndash;              <a-button @click="handleCancelSelectedMyContent" class="button-item">Cancel</a-button>&ndash;&gt;-->
          <!--              <a-button @click="handleConfirmSelectedMyContent" type="primary" shape="round" class="button-item" :loading="creating"> Save selected contents</a-button>-->
          <!--            </div>-->
        </a-tab-pane>
      </a-tabs>
    </a-modal>
    <a-drawer
      id='drawerTemplateSelected'
      destroyOnClose
      placement='right'
      :closable='true'
      :style="{width: selectedTemplateDrawerVisible ? '20%': '0px'}"
      width='100%'
      :zIndex='selectedTemplateDrawerZindex'
      :mask='false'
      :bodyStyle="{padding:'10px'}"
      :visible='selectedTemplateDrawerVisible'
      :title="'Selected slides (' + drawerSelectedTemplateList.length + ')'"
      @close='handleSelectDrawerClose'
    >
      <div class='drawer-wrapper-row'>

        <div class='drawer-template-selected'>
          <div class='drawer-template-list'>
            <div
              :class="{'template-item': true }"
              v-for='(template,index) in drawerSelectedTemplateList'
              :key='index'>
              <div class='template-hover-action-mask'>
                <span
                  class='delete-action'
                  style='position: absolute;right: 0;'
                  @click='handleSelectTemplateMadel(template)'>
                  <img src='~@/assets/icons/tag/delete.png' width='50'>
                </span>
                <div class='template-hover-action'>
                  <div class='modal-ensure-action-line'>
                    <a-button
                      class='action-ensure action-item'
                      shape='round'
                      @click='handlePreviewTemplate(template)'>
                      <a-icon type='eye' theme='filled' />
                      <div class='btn-text'>
                        Preview
                      </div>
                    </a-button>
                  </div>
                </div>
              </div>
              <div
                class='template-cover'
                :style="{backgroundImage: 'url(' + (template.cover ? template.cover : template.image) + ')'}">
              </div>
              <div class='template-info'>
                <div class='template-name'>{{ template.name }}</div>
                <div class='template-intro' v-show='template.introduce'>{{ template.introduce }}</div>
              </div>
              <div class='template-select-icon'>
                <img src='~@/assets/icons/task/selected.png' />
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class='drawer-action'>
        <a-button type='primary' shape='round' @click='handleSelectDrawerSave()'>
          Save
        </a-button>
      </div>
    </a-drawer>
    <a-modal
      v-model='showAddAudioVisible'
      :footer='null'
      destroyOnClose
      title='Add Audio'
      @ok='showAddAudioVisible = false'
      @cancel='showAddAudioVisible = false'>

      <div class='audio-material-action'>
        <div class='uploading-mask' v-show='currentUploading'>
          <div class='uploading'>
            <a-spin large />
          </div>
        </div>
        <div class='action-item'>
          <a-upload name='file' accept='audio/*' :customRequest='handleUploadAudio' :showUploadList='false'>
            <a-button type='primary' icon='upload'>{{ $t('teacher.add-unit-plan.upload-audio') }}</a-button>
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
          <a-button key='back' @click='handleCancelAddAudio' class='action-item'>
            Cancel
          </a-button>
          <a-button key='submit' type='primary' @click='handleConfirmAddAudio' class='action-item'>
            Ok
          </a-button>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model='showCreateChoice'
      @ok='handleShowCreateChoice'
      @cancel='showCreateChoice = false'
      destroyOnClose>
      <div class='evaluation-modal'>
        <div class='evaluation-header'>
          <div class='my-modal-header'>
            <div class='my-modal-icon'>
              <img src='~@/assets/icons/evaluation/evaluation_icon.png' alt='rubric'>
            </div>
            <div class='my-modal-title'>
              Create Task
            </div>
          </div>
        </div>
        <div class='associate-evaluation'>
          <div class='tips-area'>
            <img src='@/assets/icons/evaluation/Collaboration-Develope-Website@2x.png' alt=''>
          </div>
          <div class='tips'>
            Create task by using my content or template ?
          </div>
        </div>
      </div>
    </a-modal>
    <a-modal
      class='my-slide-pick-modal'
      v-model='selectedSlideVisible'
      :footer='null'
      :title='null'
      destroyOnClose
      width='700px'
      :closable='false'>
      <div class='select-slide-wrapper'>
        <modal-header @close='handleCancelPickTaskSlide' :white='true' />
        <div class='modal-title'>
          Would you like to breakdown your slides into small task
        </div>
        <div class='main-tips'>
          <div class='left-img'>
            <img src='~@/assets/icons/task/woniu.png' />
          </div>
          <div class='right-img-text'>
            <img src='~@/assets/icons/task/quote.png' />
            <div class='img-text'>
              So its easier to be shared with global educators or saved for your future inspiration!
            </div>
          </div>
        </div>
      </div>
      <div class='dont-remind-me'>
        <a-checkbox v-model='dontRemindMe' @change='handleDontRemindMe'>
          Don't remind me again.
        </a-checkbox>
      </div>
      <div class='slide-action row-flex-center'>
        <div class='slide-btn-wrapper'>
          <a-button
            @click='handleCancelPickTaskSlide'
            style='background: #D7D9D9;border: 1px solid #D7D9D9;border-radius: 25px;color: #000;'
            class='slide-btn-item slide-btn-item-no '
            type='primary'>
            Not this time
          </a-button>
          <a-button
            @click='handleAddTaskWithSlide'
            style='background: #15C39A;;border: 1px solid #15C39A;border-radius: 25px;color: #fff;'
            class='slide-btn-item slide-btn-item-yes'
            type='primary'>
            Pick now
          </a-button>
        </div>
      </div>
    </a-modal>
    <a-modal
      class='my-slide-pick-modal'
      v-model='selectedSlideVisibleFromSave'
      :footer='null'
      :title='null'
      destroyOnClose
      width='700px'
      :closable='false'>
      <div class='select-slide-wrapper'>
        <modal-header @close='selectedSlideVisibleFromSave = false' :white='true' />
        <div class='modal-title'>
          Congratulations! You have published your content successfully!
        </div>
        <div class='main-tips'>
          <div class='left-img'>
            <img src='~@/assets/icons/task/woniu.png' />
          </div>
          <div class='right-img-text'>
            <img src='~@/assets/icons/task/quote.png' />
            <div class='img-text'>
              Pick slides to create a brilliant task and use it in your future tasks or share with global educators
            </div>
          </div>
        </div>
      </div>
      <div class='slide-action row-flex-center'>
        <div class='slide-btn-wrapper'>
          <a-button
            @click='goBack'
            style='background: #D7D9D9;border: 1px solid #D7D9D9;border-radius: 25px;color: #000;'
            class='slide-btn-item slide-btn-item-no '
            type='primary'>
            Not this time
          </a-button>
          <a-button
            @click='handleAddTaskWithSlide'
            style='background: #15C39A;;border: 1px solid #15C39A;border-radius: 25px;color: #fff;'
            class='slide-btn-item slide-btn-item-yes'
            type='primary'>
            Pick now
          </a-button>
        </div>
      </div>
    </a-modal>
    <a-modal
      v-model='selectSyncDataVisible'
      :footer='null'
      destroyOnClose
      width='1200px'
      :dialog-style="{ top: '20px' }"
      :title='null'
      @ok='selectSyncDataVisible = false'
      @cancel='selectSyncDataVisible = false'>
      <div class='link-content-wrapper'>
        <!-- 此处的questionIndex用于标识区分是哪个组件调用的，返回的事件数据中会带上，方便业务数据处理，可随意写，可忽略-->
        <new-browser
          ref='newBrowser'
          question-index='_questionIndex_1'
          :show-curriculum='true'
          :show-menu='[NavigationType.specificSkills,
                       NavigationType.centurySkills,
                       NavigationType.learningOutcomes,
                       NavigationType.assessmentType,
                       NavigationType.idu]'
          :default-active-menu='NavigationType.learningOutcomes'
          :recommend-data='recommendData'
          :selected-list='selectedList'
          :selected-id='selectedIdList'
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
      v-model='previewTemplateVisible'
      :footer='null'
      destroyOnClose
      width='1000px'
      :zIndex='4000'
      :title='null'
      @ok='previewTemplateVisible = false'
      @cancel='previewTemplateVisible = false'>
      <div class='link-content-wrapper'>
        <template-preview
          :template='previewTemplate'
          :selected-template-id-list='drawerSelectedTemplateIds'
          @handle-select='handleSelectPreviewTemplate'></template-preview>
      </div>
    </a-modal>
    <a-modal
      v-model='quickTaskPreviewTemplateVisible'
      :footer='null'
      destroyOnClose
      width='1000px'
      :zIndex='4000'
      :title='null'
      @ok='quickTaskPreviewTemplateVisible = false'
      @cancel='quickTaskPreviewTemplateVisible = false'>
      <div class='link-content-wrapper'>
        <quick-task-template-preview
          :show-replace-tips='form.presentationId && form.taskMode === 2'
          :template='quickTaskPreviewTemplate'
          @handle-select='handleSelectQuickTaskPreviewTemplate'></quick-task-template-preview>
      </div>
    </a-modal>
    <a-modal
      v-model='materialVisible'
      :footer='null'
      destroyOnClose
      width='800px'
      :zIndex='3000'
      title='My Materials'
      @ok='materialVisible = false'
      @cancel='materialVisible = false'>
      <task-material-preview
        :current-page-element-lists='currentPageElementLists'
        :filter-type='filterMaterialType'
        :current-page-index='currentImgIndex'></task-material-preview>
    </a-modal>
    <a-modal
      v-model='mediaVisible'
      :footer='null'
      destroyOnClose
      width='900px'
      :zIndex='3000'
      :title='null'
      @ok='mediaVisible = false'
      @cancel='mediaVisible = false'>
      <media-preview :media-list='mediaList' :material-type='filterMaterialType'></media-preview>
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
      <collaborate-update-content
        ref="collaborateUpdate"
        :source-id='taskId'
        :source-type='contentType.task'
        @update-content='handleUpdateContent'
      />
    </a-modal>
    <quick-session
      v-if='chooseAnotherVisible'
      @close='handleCloseQuickSession'
      @select='handleEnsureChooseAnother'
      :selected-class='quickSessionClassItem'
      :visible='chooseAnotherVisible'
      :mode="'choose-another'"
    />
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { typeMap } from '@/const/teacher'
import { Associate, FindSourceOutcomes, GetAssociate, GetMyGrades, GetReferOutcomes } from '@/api/teacher'
import InputSearch from '@/components/UnitPlan/InputSearch'
import SdgTagInput from '@/components/UnitPlan/SdgTagInput'
import SkillTag from '@/components/UnitPlan/SkillTag'
import { FilterTemplates, recommendTemplates, TemplatesGetPresentation } from '@/api/template'
import { MyContentEvent, MyContentEventBus } from '@/components/MyContent/MyContentEventBus'
import { TaskAddOrUpdate, TaskCreateNewTaskPPT, TaskQueryById } from '@/api/task'
import { SelectModel } from '@/components/NewLibrary/SelectModel'
import { formatLocalUTC } from '@/utils/util'
import { commonAPIUrl, GetDictItems } from '@/api/common'
import MyContentSelector from '@/components/MyContent/MyContentSelector'
import RelevantTagSelector from '@/components/UnitPlan/RelevantTagSelector'
import { TemplateTypeMap } from '@/const/template'
import TaskForm from '@/components/Task/TaskForm'
import TaskPreview from '@/components/Task/TaskPreview'
import Collaborate from '@/components/UnitPlan/Collaborate'
import AssociateSidebar from '@/components/Associate/AssociateSidebar'
import CustomTag from '@/components/UnitPlan/CustomTag'
import NewUiClickableKnowledgeTag from '@/components/UnitPlan/NewUiClickableKnowledgeTag'
import CollaborateUserList from '@/components/Collaborate/CollaborateUserList'
import { CustomTagType, DICT_PROMPT_PURPOSE, TaskField, TemplateType } from '@/const/common'
import ModalHeader from '@/components/Common/ModalHeader'
import CommonFormHeader from '@/components/Common/CommonFormHeader'
import { EvaluationAddOrUpdate } from '@/api/evaluation'
import TaskLink from '@/components/Task/TaskLink'
import UiLearnOut from '@/components/UnitPlan/UiLearnOut'
import { LibraryEvent, LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'
import NewBrowser from '@/components/NewLibrary/NewBrowser'
import NewMyContent from '@/components/MyContent/NewMyContent'
import { FindCustomTags, GetTagYearTips, GetTreeByKey } from '@/api/tag'
import { NavigationType } from '@/components/NewLibrary/NavigationType'
import CollaborateCommentPanel from '@/components/Collaborate/CollaborateCommentPanel'
import CommentSwitch from '@/components/Collaborate/CommentSwitch'
import CollaborateCommentView from '@/components/Collaborate/CollaborateCommentView'
import commentIcon from '@/assets/icons/collaborate/comment.svg?inline'
import ExpendSvg from '@/assets/icons/task/expend.svg?inline'
import CollaborateHistory from '@/components/Collaborate/CollaborateHistory'
import NoMoreResources from '@/components/Common/NoMoreResources'
import TemplatePreview from '@/components/Task/TemplatePreview'
import TaskMaterialPreview from '@/components/Task/TaskMaterialPreview'
import TaskPptPreview from '@/components/Task/TaskPptPreview'
import { PptPreviewMixin } from '@/mixins/PptPreviewMixin'
import MediaPreview from '@/components/Task/MediaPreview'
import { UtilMixin } from '@/mixins/UtilMixin'
import moment from 'moment'
import { BaseEventMixin, RightModule } from '@/mixins/BaseEvent'
import { FormConfigMixin } from '@/mixins/FormConfigMixin'
import ShareContentSetting from '@/components/Share/ShareContentSetting'
import { QueryContentShare } from '@/api/share'
import CollaborateTooltip from '@/components/Collaborate/CollaborateTooltip'
import CollaborateUpdateContent from '@/components/Collaborate/CollaborateUpdateContent'
import LocalStore from '@/websocket/localstore'
import { PersonalAddOrUpdateClass, SchoolClassGetMyClasses } from '@/api/schoolClass'
import InputWithCreate from '@/components/Common/InputWithCreate'
import QuickSession from '@/components/QuickSession/QuickSession'
import { chooseAnother } from '@/api/quickTask'
import QuickTaskTemplatePreview from '@/components/Task/QuickTaskTemplatePreview'
import { AddMaterialEventBus, ModalEventsNameEnum } from '@/components/AddMaterial/AddMaterialEventBus'
import UploadEnter from '@/components/AddMaterial/UploadEnter'
import { addBatchElements } from '@/api/addMaterial'
import AddGreenIcon from '@/assets/svgIcon/evaluation/form/tianjia_green.svg?inline'
import { GoogleAuthCallBackMixin } from '@/mixins/GoogleAuthCallBackMixin'
import MyVerticalSteps from '@/components/Steps/MyVerticalSteps'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const { SplitTask } = require('@/api/task')

export default {
  name: 'AddTask',
  components: {
    MyVerticalSteps,
    AddGreenIcon,
    UploadEnter,
    QuickTaskTemplatePreview,
    QuickSession,
    InputWithCreate,
    ShareContentSetting,
    TaskPptPreview,
    TemplatePreview,
    NoMoreResources,
    CollaborateHistory,
    CollaborateCommentView,
    CommentSwitch,
    CollaborateCommentPanel,
    CommonFormHeader,
    NewBrowser,
    NewMyContent,
    UiLearnOut,
    TaskLink,
    ModalHeader,
    TaskPreview,
    TaskForm,
    ContentTypeIcon,
    InputSearch,
    SdgTagInput,
    NewUiClickableKnowledgeTag,
    SkillTag,
    MyContentSelector,
    RelevantTagSelector,
    Collaborate,
    AssociateSidebar,
    CollaborateUserList,
    CustomTag,
    commentIcon,
    TaskMaterialPreview,
    MediaPreview,
    ExpendSvg,
    CollaborateTooltip,
    CollaborateUpdateContent
  },
  mixins: [ PptPreviewMixin, UtilMixin, BaseEventMixin, FormConfigMixin, GoogleAuthCallBackMixin ],
  props: {
    taskId: {
      type: String,
      default: null
    },
    mode: {
      type: String,
      default: 'edit'
    }
  },
  data() {
    return {
      contentLoading: true,
      referenceLoading: false,
      contentType: typeMap,
      templateTypeMap: TemplateTypeMap,
      templateType: TemplateType,
      creating: false,

      leftAddExpandStatus: false,
      selectLinkContentVisible: false,
      selectLinkUnitPlanContentVisible: false,
      viewInGoogleSlideVisible: false,
      selectTemplateVisible: false,
      showAddAudioVisible: false,
      form: {
        id: null,
        image: '',
        copyFromSlide: null,
        presentationId: '',
        pageObjectIds: '',
        name: 'Untitled Task',
        overview: '',
        tasks: [],
        status: 0,
        taskType: '',
        createTime: '',
        createBy: '',
        updateTime: '',
        customTags: [],
        subjectIds: [],
        gradeIds: [],
        bloomCategories: '',
        learnOuts: [],
        selfOuts: [],
        showSelect: false,
        startDate: '',
        endDate: '',
        gradeId: undefined,
        materialList: [],
        taskClassList: [],
        customFieldData: null
      },
      // Grades
      gradeList: [],
      // SubjectTree
      // subjectTree: [],

      currentTemplateType: TemplateTypeMap['visible-thinking-tool'],
      currentBloomCategory: '',
      currentFasa: '',
      templateList: [],
      templateLoading: false,
      selectedTemplateList: [],
      currentUploading: false,
      audioUrl: null,

      selectedTaskIdList: [],
      selectedMyContentVisible: false,
      selectedMyContentKeyList: [],
      selectedMyContentList: [],
      selectedMyContentInfoMap: new Map(),
      showChoseSelectTemplateVisible: false,

      showCreateChoice: false,

      pageObjectIds: [],
      thumbnailList: [],
      selectedPageIdList: [],
      selectedPageImageList: [],
      subTasks: [],

      thumbnailListLoading: false,

      taskIndex: 0,
      taskSaving: false,
      publishing: false,
      initTemplates: [],
      initPrompts: [],
      uploading: false,
      selectedSlideVisible: false,
      taskSelectTagVisible: false,
      sessionTags: [],
      startLoading: false,
      addLoading: false,
      selectAddContentTypeVisible: false,

      groupNameList: [],
      groupNameListOther: [],
      selectSyncDataVisible: false,
      selectedSyncList: [],
      // 已选择的大纲知识点描述数据
      selectedCurriculumList: [],
      // specific skill
      selectedSpecificSkillList: [],
      // century skill
      selectedCenturySkillList: [],
      selectedAssessmentList: [],
      selectModel: SelectModel,

      selectedIduList: [],
      selectedRecommendList: [],

      editPPTMode: false,

      recommendTemplateList: [],
      learnExperienceList: [],
      filterLearn: [],
      assessmentsList: [],
      filterAssessments: [],
      centuryList: [],
      filterCentury: [],
      filterPruposeList: [],
      filterParentMap: new Map(),
      recomendListLoading: false,
      addRecomendLoading: false,
      skeletonLoading: false,
      associateQuestionList: [],
      showCustomTag: false,
      customTagTop: 20,
      customTagList: [],
      customTags: {},
      NavigationType: NavigationType,
      showCollaborateCommentVisible: false,

      // TODO mock数据待更新为接口请求（loadCollaborateData方法中的GetCollaborateComment)
      collaborateTop: 0,
      showAllCollaborateCommentVisible: false,
      // TODO mock数据待更新为接口请求（loadCollaborateData方法中的GetCollaborateModifiedHistory)
      centuryTagMap: new Map(),
      selectYearTab: '',
      showHistoryLoading: false,

      // 复制当前表单数据，给选择slide创建task用‘pick-task-slide’
      currentTaskFormData: null,
      groupNameMode: 'input', // input、select,
      newTermName: 'Untitled category',
      previewTemplate: {},
      previewTemplateVisible: false,
      currentImgIndex: 0,
      showTemplateFilter: false,
      currentSlideCoverImgSrc: null,
      filterType: undefined,
      filterAssessmentsType: '1',
      selectedTemplateMadelWidth: '90%',
      selectedTemplateMarginLeft: '5%',
      selectedTemplateDrawerVisible: false,
      selectedTemplateDrawerZindex: 3000,
      drawerSelectedTemplateList: [],

      selectedSlideVisibleFromSave: false, // 点击保存时，是否显示选择slide的弹窗，此处不去选择slide直接goBack

      recommendData: [],
      recommendDataIdList: [],
      selectedList: [],

      subTaskSaving: false,
      subTaskPublishing: false,

      selectedPageItemData: [],
      pptTitle: '',
      selectedIdList: [], // browser中已经选择的id列表

      associateUnitPlanIdList: [],
      associateTaskIdList: [],
      associateId2Name: new Map(),

      materialListFlag: false,

      showSubTaskDetail: false,

      shareVisible: false,
      shareStatus: 0,
      taskField: TaskField,

      classList: [],

      tagTypeConfig: {
        1: {
          color: '#F4B183',
          label: 'Classcipe International School'
        },
        2: {
          color: '#9DC3E6',
          label: 'Personal'
        }
      },

      linkUnitPlanLoading: false,
      linkRubricLoading: false,

      chooseAnotherVisible: false,

      customizeLearnOut: [],

      quickTaskPreviewTemplateVisible: false,
      quickTaskPreviewTemplate: null,

      quickSessionClassItem: null,

      // sub task 当前激活的字段
      currentSubTaskFocusFieldName: null,

      dontRemindMe: false,

      editGoogleSlideLoading: false,
      currentActiveStepIndex: 0,
      currentStep: {
        id: null,
        commonFields: [],
        customFields: []
      }
    }
  },
  computed: {
    lastChangeSavedTime() {
      const time = this.form.updateTime || this.form.createTime
      if (time) {
        return formatLocalUTC(this.form.updateTime || this.form.createTime)
      } else {
        return ''
      }
    },
    selectedTemplateIdList() {
      const list = []
      this.selectedTemplateList.forEach(item => {
        list.push(item.id)
      })
      return list
    },
    drawerSelectedTemplateIds() {
      const list = []
      this.drawerSelectedTemplateList.forEach(item => {
        list.push(item.id)
      })
      return list
    },
    filterRecommendTemplateList() {
      const list = []
      const selectedIds = this.selectedTemplateList.map(template => {
        return template.id
      })
      this.recommendTemplateList.forEach(item => {
        if (selectedIds.indexOf(item.id) === -1) {
          list.push(item)
        }
      })
      return list
    },
    filterGradeTips() {
      return function(item) {
        if (!this.selectYearTab) {
          return item.name
        }
        const filerList = this.centuryTagMap.get(this.selectYearTab).filter(tag => tag.tagId === item.id)
        return filerList.length > 0 ? filerList[0].tooltip : ''
      }
    },
    presentationLink() {
      return 'https://docs.google.com/presentation/d/' + this.form.presentationId + '/edit'
    },
    isOwner() {
      return this.$store.getters.userInfo.email === this.form.createBy
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
  beforeRouteLeave(to, from, next) {
    this.$logger.info('beforeRouteLeave', to, from, next)
    // owner或者协同着可以save
    const that = this
    if (this.canEdit) {
      if (this.initCompleted && JSON.stringify(this.form) !== JSON.stringify(this.oldForm)) {
        this.$confirm({
          title: 'Alert',
          okText: 'Save',
          cancelText: 'No',
          content: 'Do you want to save the changes?',
          onOk: function() {
            that.handleSaveTask(false)
            next()
          },
          onCancel() {
            next()
          }
        })
      } else {
        next()
      }
    } else {
      next()
    }
  },
  watch: {
    currentStep: {
      handler(val) {
        this.handleDisplayRightModule()
      },
      deep: true
    }
  },
  async created() {
    logger.info('add task created ' + this.taskId + ' ' + this.$route.path + ' mode: ' + this.mode)
    // 初始化关联事件处理
    MyContentEventBus.$on(MyContentEvent.LinkToMyContentItem, this.handleLinkMyContent)
    MyContentEventBus.$on(MyContentEvent.ToggleSelectContentItem, this.handleToggleSelectContentItem)
    LibraryEventBus.$on(LibraryEvent.ContentListSelectClick, this.handleDescriptionSelectClick)

    let token = this.$route.query.token
    if (!token) {
      token = storage.get(ACCESS_TOKEN)
    }
    await this.$store.dispatch('loadFormConfigData', token)
    this.currentActiveStepIndex = this.getSessionStep()
    this.currentStep = this.$store.getters.formConfigData.taskSteps[this.currentActiveStepIndex]
    this.handleDisplayRightModule()
    this.$logger.info('恢复step', this.currentActiveStepIndex, this.currentStep)
    this.initData()
    this.getAssociate()
    this.loadCustomTags()
    this.initTemplateFilter()
    this.GetTagYearTips()
    this.queryContentCollaborates(this.taskId, this.contentType.task)

    // addMaterial事件处理
    AddMaterialEventBus.$on(ModalEventsNameEnum.ADD_NEW_MEDIA, url => {
      this.addMaterialList(url)
    })
    AddMaterialEventBus.$on(ModalEventsNameEnum.DELETE_MEDIA_ELEMENT, data => {
      this.deleteMaterial(data)
    })

    this.dontRemindMe = !!window.localStorage.getItem('dontRemindMe_' + this.$store.getters.email)
  },
  mounted() {
    if (this.recommendTemplateList.length === 0) {
      this.loadRecommendThumbnail()
    }
  },
  beforeDestroy() {
    MyContentEventBus.$off(MyContentEvent.LinkToMyContentItem, this.handleLinkMyContent)
    MyContentEventBus.$off(MyContentEvent.ToggleSelectContentItem, this.handleToggleSelectContentItem)
    LibraryEventBus.$off(LibraryEvent.ContentListSelectClick, this.handleDescriptionSelectClick)
  },
  methods: {
    initData() {
      logger.info('initData doing...')
      Promise.all([
        GetMyGrades(),
        FilterTemplates({}),
        SchoolClassGetMyClasses()
      ]).then((response) => {
        this.$logger.info('add task initData done', response)

        // GetMyGrades
        if (!response[0].code) {
          this.$logger.info('GetMyGrades', response[0].result)
          this.gradeList = response[0].result
        }

        if (!response[1].code) {
          this.$logger.info('template list', response[1].result)
          this.templateList = response[1].result
        }

        if (!response[2].code) {
          this.$logger.info('class list', response[2].result)
          this.classList = response[2].result
        }
      }).then(() => {
        if (this.taskId) {
          this.$logger.info('restore task data ' + this.taskId)
          this.restoreTask(this.taskId, true)
        } else {
          this.contentLoading = false
        }
      }).catch((e) => {
        this.$logger.error(e)
        this.$message.error(this.$t('teacher.add-task.init-data-failed'))
      }).finally(() => {
        this.referenceLoading = false
      })
    },

    initTemplateFilter() {
      GetTreeByKey({ key: 'template' }).then((response) => {
        this.$logger.info('initTemplateFilter response', response.result)
        if (response.success) {
          this.treeItemData = response.result.children
          this.treeItemData.forEach(item => {
            if (item.name === TemplateType.Learning) {
              this.learnExperienceList = item.children
            }
            if (item.name === TemplateType.Assessments) {
              this.assessmentsList = item.children
            }
            if (item.name === TemplateType.Century) {
              this.centuryList = item.children
            }
          })
        } else {
          this.$message.error(response.message)
        }
      })

      GetDictItems(DICT_PROMPT_PURPOSE).then((response) => {
        if (response.success) {
          logger.info('DICT_PROMPT_PURPOSE', response.result)
          this.initPrompts = response.result
        }
      })
    },

    handleDisplayRightModule () {
      if (this.currentStep.commonFields.indexOf(TaskField.Slides) !== -1) {
        this.currentRightModule = RightModule.recommend
      } else {
        this.currentRightModule = RightModule.customTag
      }
    },
    handleAuthCallback() {
      this.$logger.info('handleAuthCallback')
      this.loadThumbnail()
    },

    restoreTask(taskId, isFirstLoad) {
      if (isFirstLoad) {
        this.contentLoading = true
      }
      logger.info('restoreTask ' + taskId)
      TaskQueryById({
        id: taskId
      }).then(response => {
        logger.info('TaskQueryById ' + taskId, response.result)
        const taskData = response.result
        if (!taskData.materialList) {
          taskData.materialList = []
        }

        if (!taskData.taskClassList.length) {
          taskData.taskClassList = [{
            classId: null,
            startDate: null,
            endDate: null,
            checked: false,
            momentRangeDate: [],
            weeks: null
          }]
        } else {
          taskData.taskClassList.forEach(item => {
            item.checked = !!(item.startDate && item.endDate)
            if (item.checked) {
              item.momentRangeDate = [
                moment.utc(item.startDate).local(),
                moment.utc(item.endDate).local()
              ]

              item.weeks = this.getWeekByDate(item.momentRangeDate[0], item.momentRangeDate[1])
            }
          })

          this.quickSessionClassItem = {
            id: taskData.taskClassList[0].classId,
            name: taskData.taskClassList[0].className,
            ...taskData.taskClassList[0]
          }
          this.$logger.info('init quickSessionClassItem', this.quickSessionClassItem)
        }

        this.materialListFlag = taskData.materialList.length > 0
        // 填充自定义字段
        const customFieldData = taskData.customFieldData ? JSON.parse(taskData.customFieldData) : null
        const displayCustomFieldData = {}
        if (customFieldData) {
          // 只显示配置中存在的字段,用id做key，改名后依旧可以使用老数据
          this.$store.getters.formConfigData.taskCustomList.forEach(customField => {
            if (customFieldData.hasOwnProperty(customField.id)) {
              displayCustomFieldData[customField.id] = customFieldData[customField.id]
            } else {
              displayCustomFieldData[customField.id] = ''
            }
          })
        } else {
          this.$store.getters.formConfigData.taskCustomList.forEach(customField => {
            displayCustomFieldData[customField.id] = ''
          })
        }
        this.$logger.info('displayCustomFieldData', displayCustomFieldData)
        taskData.customFieldData = displayCustomFieldData
        this.form = taskData
        this.form.showSelected = taskData.showSelected ? taskData.showSelected : false
        this.form.bloomCategories = this.form.bloomCategories ? this.form.bloomCategories : undefined // 为了展示placeholder
        this.selectedTemplateList = this.form.selectedTemplateList
        if (this.selectedTemplateList.length === 0) {
          this.form.showSelected = false
        }
        if (!taskData.gradeId) {
          this.form.gradeId = undefined
        } else {
          // 年级在本国大纲不存在的情况
          if (this.gradeList.filter(grade => grade.id === taskData.gradeId).length === 0) {
            this.form.gradeId = undefined
          }
        }
      }).finally(() => {
        this.contentLoading = false
        this.loadCollaborateData(this.form.type, this.form.id)
        if (this.form.presentationId) {
          this.loadThumbnail()
          this.loadRecommendThumbnail()
        }
        // copy副本 为了判断数据变更
        this.oldForm = JSON.parse(JSON.stringify(this.form))
        this.initCompleted = true
        this.$logger.info('restoreTask done', this.form)

        this.loadingShareContent()
        // 非owner看到图片
        if (this.$store.getters.userInfo.email !== this.form.createBy) {
          this.form.showSelected = false
        }
      })
    },

    handleLinkMyContent(data) {
      this.$logger.info('handleLinkMyContent ', data)
      this.selectLinkContentVisible = false
      // link到unit plan必须全question
      this.loadRelevantTagInfo(data.item)
    },

    handleToggleSelectContentItem(data, event) {
      this.$logger.info('handleToggleSelectContentItem', data, event)
      this.previewTemplateVisible = false
      if (this.drawerSelectedTemplateIds.indexOf(data.id) === -1) {
        this.handleSelectTemplateMadelAnimate(data, event)
      } else {
        this.handleSelectTemplateMadel(data)
      }
    },

    async handleSaveTask(isBack) {
      logger.info('handleSaveTask', this.form, this.questionDataObj)

      if (this.subTasks.length > 0) {
        this.$confirm({
          title: 'Save sub-task(s)',
          okText: 'Yes',
          content: 'Do you want to save the sub-tasks?',
          onOk: () => {
            this.currentActiveStepIndex = 2
            this.handleSaveSubTaskAndForm(0)
          },
          onCancel: () => {
            // 取消时清空subTasks再进入正常保存逻辑
            this.subTasks = []
            this.handleSaveTask()
          }
        })
      } else {
        this.cleaPageCache()
        const taskData = Object.assign({}, this.form)
        const taskClassList = []
        taskData.taskClassList.forEach(item => {
          if (item.classId) {
            const classScheduleData = {
              classId: item.classId,
              startDate: null,
              endDate: null
            }
            if (item.checked && item.momentRangeDate.length === 2) {
              const startDate = item.momentRangeDate[0].clone()
              const endDate = item.momentRangeDate[1].clone()
              classScheduleData.startDate = startDate.utc().format('YYYY-MM-DD HH:mm:ss')
              classScheduleData.endDate = endDate.utc().format('YYYY-MM-DD HH:mm:ss')
            }
            taskClassList.push(classScheduleData)
          }
        })
        taskData.taskClassList = taskClassList
        if (this.taskId) {
          taskData.id = this.taskId
        }
        taskData.selectedTemplateList = this.selectedTemplateList

        // 更新selfOuts数据
        if (this.$refs.learnOut && this.$refs.learnOut.length > 0) {
          taskData.selfOuts = this.$refs.learnOut[0].getSelfOuts()
        }
        if (taskData.customFieldData) {
          taskData.customFieldData = JSON.stringify(taskData.customFieldData)
        }
        logger.info('basic taskData', taskData)
        const response = await TaskAddOrUpdate(taskData)
        logger.info('TaskAddOrUpdate', response.result)
        if (response.success) {
          // this.restoreTask(response.result.id, false)
          this.oldForm = JSON.parse(JSON.stringify(this.form))
          this.$message.success(this.$t('teacher.add-task.save-success'))
          if (isBack) {
            this.handleBack()
          }
        } else {
          this.$message.error(response.message)
        }
        this.handleSaveContentEvent(this.taskId, this.contentType.task, this.oldForm)
      }
    },
    handlePublishTask(status) {
      logger.info('handlePublishTask', {
        id: this.taskId,
        status: status
      })
      const taskData = Object.assign({}, this.form)
      taskData.status = status
      this.publishing = true
      TaskAddOrUpdate(taskData).then(response => {
        this.$logger.info('UpdateContentStatus response', response)
        // this.$message.success('Publish success')
        this.form.status = status
      }).then(() => {
        if (status === 1) {
          this.selectedSlideVisible = !this.dontRemindMe
          this.$message.success(this.$t('teacher.add-task.publish-success'))
        } else {
          this.$message.success('Unpublish successfully')
        }
        this.form.status = status
        this.$refs.commonFormHeader.publishing = false
        this.oldForm = JSON.parse(JSON.stringify(this.form))
      })
    },

    handleSelectTaskType(type) {
      this.$logger.info('handleSelectTaskType ' + type)
      this.form.taskType = type
      // #协同编辑event事件
      this.handleCollaborateEvent(this.taskId, this.taskField.TaskType, this.form.taskType)
    },

    handleSelectSubTaskType(type) {
      this.$logger.info('handleSelectSubTaskType ' + type)
      this.currentTaskFormData.taskType = type
      this.customTagList = []
      if (type === 'FA') {
        CustomTagType.task.fa.forEach(name => {
          this.customTagList.push(name)
        })
      } else if (type === 'SA') {
        CustomTagType.task.sa.forEach(name => {
          this.customTagList.push(name)
        })
      } else if (type === 'Activity') {
        CustomTagType.task.activity.forEach(name => {
          this.customTagList.push(name)
        })
      }
    },

    goBack() {
      // this.$router.push({ path: '/teacher/main/created-by-me' })
    },

    handleShowSelectMyContent() {
      this.$logger.info('handleShowSelectMyContent')
      this.selectedTaskIdList = []
      this.selectedMyContentList = []
      this.selectedMyContentVisible = true
      this.templateLoading = false
      this.drawerSelectedTemplateList = []
      this.selectedTemplateList.forEach(item => {
        this.drawerSelectedTemplateList.push(item)
      })
    },

    handleChooseAntherPrompt () {
      this.$logger.info('handleChooseAntherPrompt')
      this.chooseAnotherVisible = true
    },

    handleCloseQuickSession () {
      this.$logger.info('handleCloseQuickSession')
      this.chooseAnotherVisible = false
    },

    handleEnsureChooseAnother (data) {
      this.$logger.info('handleEnsureChooseAnother', data)
      chooseAnother({
        presentationId: data.presentationId,
        selectPageObjectIds: data.selectPageObjectIds,
        taskId: this.taskId
      }).then(response => {
        if (response.success) {
          this.form.pageObjectIds = response.result.pageObjectIds
          this.form.presentationId = response.result.presentationId
          this.form.fileDeleted = response.result.fileDeleted
          this.form.copyFromSlide = response.result.copyFromSlide
          this.form.image = response.result.image
          this.$message.success('Choose another successfully')
          this.chooseAnotherVisible = false
          if (data.classItem && this.form.taskMode === 2) {
            this.form.taskClassList = []
            this.$nextTick(() => {
              this.form.taskClassList.push({
                classId: data.classItem.id,
                className: data.classItem.name,
                classType: data.classItem.classType,
                startDate: null,
                endDate: null
              })
              this.$logger.info('handleEnsureChooseAnother update form.taskClassList', this.form.taskClassList)
            })
          }
          this.loadThumbnail()
          this.loadRecommendThumbnail()
        } else {
          this.$message.warn(response.message)
        }
      })
    },

    handleRemoveTemplate(template) {
      this.$logger.info('handleRemoveTemplate ', template)
      const index = this.selectedTemplateList.findIndex(item => item.id === template.id)
      this.form.showSelected = true
      if (index !== -1) {
        this.selectedTemplateList.splice(index, 1)
      }
      this.autoSave()
    },

    handleSelectTemplateMadelAnimate(template, event) {
      this.$logger.info('handleSelectTemplateMadelAnimate ', template)
      this.selectedTemplateMarginLeft = '2%'
      this.selectedTemplateMadelWidth = '80%'
      this.selectedTemplateDrawerVisible = true
      this.selectedTemplateDrawerZindex = 3000
      this.form.showSelected = true
      this.$logger.info('event', event)
      this.form.showSelected = true

      // 计算元素位置，然后添加动画
      this.currentSlideCoverImgSrc = template.cover ? template.cover : template.image
      this.$nextTick(() => {
        const slideAnimateDom = document.getElementById('slide-animate')
        const slideAnimateImgDom = document.getElementById('slide-animate-img')
        const imgDomPos = slideAnimateDom.getBoundingClientRect()
        const containerDomPos = document.getElementById('drawerTemplateSelected').getBoundingClientRect()
        const buttonPos = event.target.getBoundingClientRect()

        console.log(containerDomPos)
        console.log('buttonPos y ' + buttonPos.y + ' containerDomPos y ' + containerDomPos.y + ' containerDomPos h ' + containerDomPos.height + ' img y ' + imgDomPos.y + ' distY ' + (buttonPos.y - containerDomPos.y - containerDomPos.height / 2))
        const offsetX = -(buttonPos.left + buttonPos.width / 2 - (containerDomPos.left + containerDomPos.width / 2))
        const offsetY = -(event.clientY - (containerDomPos.y + containerDomPos.height / 2))
        console.log('offsetX: ' + offsetX + ' offsetY: ' + offsetY)

        // slide截图出现与初始定位
        slideAnimateDom.style.left = buttonPos.left + buttonPos.width / 2 - 200 + 'px'
        slideAnimateDom.style.top = buttonPos.top + buttonPos.height / 2 - 100 + 'px'
        slideAnimateDom.style.display = 'block'

        // 开始动画
        slideAnimateDom.style.transform = 'translateX(' + offsetX + 'px)'
        slideAnimateImgDom.style.transform = 'translateY(' + offsetY + 'px) scale(0.1)'
        setTimeout(() => {
          this.currentSlideCoverImgSrc = null
          slideAnimateDom.style.transform = 'translateX(0px)'
          slideAnimateImgDom.style.transform = 'translateY(0px) scale(1)'

          if (this.drawerSelectedTemplateIds.indexOf(template.id) === -1) {
            this.drawerSelectedTemplateList.unshift(template)
          }
        }, 600)
      })
    },

    handleSelectTemplateMadel(template) {
      this.$logger.info('handleSelectTemplateMadel ', template)
      this.selectedTemplateMarginLeft = '2%'
      this.selectedTemplateMadelWidth = '80%'
      this.selectedTemplateDrawerVisible = true
      this.selectedTemplateDrawerZindex = 3000
      const index = this.drawerSelectedTemplateList.findIndex(item => item.id === template.id)
      this.form.showSelected = true
      if (index !== -1) {
        this.drawerSelectedTemplateList.splice(index, 1)
      } else {
        this.drawerSelectedTemplateList.unshift(template)
      }
    },

    handleAddTemplate() {
      this.$logger.info('handleAddTemplate ', this.selectedTemplateList)
      if (!this.creating) {
        if (this.selectedTemplateList.length) {
          const hideLoading = this.$message.loading('Creating ppt in Google side...', 0)
          this.creating = true
          TaskCreateNewTaskPPT({
            taskId: this.taskId ? this.taskId : '',
            name: this.form.name ? this.form.name : 'Unnamed Task',
            overview: this.form.overview,
            templatePresentationIds: this.selectedTemplateList.map(item => {
              return item.presentationId
            })
          }).then(response => {
            if (!response.success) {
              this.$message.error(response.message)
              return
            }
            this.$logger.info('handleAddTemplate response', response.result)
            this.form.id = response.result.id
            this.form.presentationId = response.result.presentationId
            this.selectTemplateVisible = false
            this.restoreTask(this.form.id, false)
            this.$router.replace({
              path: '/teacher/add-task/' + response.result.id
            })
            this.$message.success('Created Successfully in Google Slides')
          }).finally(() => {
            this.templateLoading = false
            this.creating = false
            this.selectedMyContentVisible = false
            this.addRecomendLoading = false
            hideLoading()
          })
        } else {
          this.$message.warn('Please select template!')
        }
      } else {
        this.$logger.info('creating wait...')
      }
    },

    handleViewDetail(item) {
      this.$logger.info('handleViewDetail ', item)
      if (item.type === this.contentType['unit-plan']) {
        this.$router.push({
          path: '/teacher/unit-plan-redirect/' + item.id
        })
      }
    },

    handleUpdateSelected(data) {
      this.$logger.info('handleUpdateSelected', data)
      this.relevantSelectedQuestionList = data.questionList
    },

    handleCancelSelectedMyContent() {
      this.selectedMyContentVisible = false
      this.selectedTaskIdList = []
      this.selectedMyContentList = []
    },

    handleConfirmSelectedMyContent() {
      this.$logger.info('handleConfirmSelectedMyContent', this.selectedMyContentKeyList)
      if (this.selectedMyContentKeyList.length === 0) {
        this.$message.warn('Please select a content!')
        return
      }
      this.selectedTaskIdList = []
      this.selectedMyContentList = []
      this.selectedMyContentKeyList.forEach(key => {
        if (this.selectedMyContentInfoMap.has(key)) {
          this.selectedMyContentList.push(this.selectedMyContentInfoMap.get(key))
        }

        const keyArr = key.split('-')
        if (parseInt(keyArr[0]) === this.contentType.task) {
          this.selectedTaskIdList.push(keyArr[1])
        }
      })
      this.selectedMyContentList.forEach(item => {
        if (this.selectedTemplateIdList.indexOf(item.id) === -1) {
          // task和template图片字段不一致
          item.cover = item.image
          this.selectedTemplateList.unshift(item)
        }
      })
      this.selectedMyContentVisible = false
      if (this.selectedTemplateIdList.length > 0) {
        this.form.showSelected = true
      } else {
        this.form.showSelected = false
      }
      this.autoSave()
    },

    async handleCreateTask() {
      this.$logger.info('handleCreateTask')
      const hideLoading = this.$message.loading('Creating ppt in Google side...', 0)
      if (!this.creating) {
        this.creating = true
        const response = await TaskCreateNewTaskPPT({
          taskId: this.taskId ? this.taskId : '',
          taskIds: this.selectedTaskIdList,
          name: this.form.name ? this.form.name : 'Unnamed Task',
          overview: this.form.overview
        })

        this.$logger.info('handleCreateTask', response.result)
        this.showChoseSelectTemplateVisible = false
        this.selectedMyContentVisible = false
        this.form.id = response.result.id
        this.form.presentationId = response.result.presentationId
        this.selectTemplateVisible = false
        await this.autoSave()
        this.$message.success('Created Successfully in Google Slides')
        window.open('https://docs.google.com/presentation/d/' + this.form.presentationId, '_blank')
        this.creating = false
        this.selectedMyContentVisible = false
        this.loadThumbnail()
        hideLoading()
      }
    },

    loadThumbnail() {
      this.thumbnailListLoading = true
      this.skeletonLoading = true
      this.$logger.info('loadThumbnail ' + this.form.presentationId)
      TemplatesGetPresentation({
        presentationId: this.form.presentationId
      }).then(response => {
        this.$logger.info('loadThumbnail response', response.result)
        if (response.code === 0) {
          const pageObjects = response.result.pageObjects
          this.pptTitle = response.result.title
          this.thumbnailList = []
          pageObjects.forEach(page => {
            this.thumbnailList.push({ contentUrl: page.contentUrl, id: page.pageObjectId })
          })
          if (!this.form.fileDeleted && response.result.fileDeleted) {
            this.form.fileDeleted = true
          }
        } else if (response.code === 403) {
          this.$router.push({ path: '/teacher/main/created-by-me' })
        } else if (response.code === this.ErrorCode.ppt_google_token_expires) {
          this.$logger.info('等待授权事件通知')
        }
      }).finally(() => {
        this.thumbnailListLoading = false
        this.skeletonLoading = false
        this.getClassInfo(this.form.presentationId)

        if (this.currentActiveStepIndex === 2 && this.thumbnailList.length > 1) {
          if (this.dontRemindMe) {
            this.handleAddTaskWithSlide()
          } else {
            this.selectedSlideVisible = true
            this.currentTaskFormData = JSON.parse(JSON.stringify(this.form))
            // 只展示选中ppt的标签
            this.currentTaskFormData.customTags = []
          }
        } else {
          this.currentTaskFormData = null
        }
      })
    },

    // TODO 修改为加载推荐模板
    loadRecommendThumbnail() {
      this.$logger.info('loadRecommendThumbnail')
      this.recomendListLoading = true
      recommendTemplates({ taskId: this.taskId }).then(response => {
        logger.info('loadRecommendThumbnail res:', response.result)
        if (response.success) {
          this.recommendTemplateList = response.result
          this.recomendListLoading = false
        }
      })
    },

    handleToggleThumbnail(thumbnail) {
      this.$logger.info('handleToggleThumbnail', thumbnail)
      const pageId = thumbnail.id
      const index = this.selectedPageIdList.indexOf(pageId)
      if (index !== -1) {
        this.selectedPageIdList.splice(index, 1)
      } else {
        // 不可用全选所有的ppt
        if (this.selectedPageIdList.length >= this.thumbnailList.length - 1) {
          this.$message.warning('You can only select up to ' + this.thumbnailList.length + ' slides')
          return
        }
        this.selectedPageIdList.push(thumbnail.id)
      }

      const contentUrlIndex = this.selectedPageImageList.indexOf(thumbnail.contentUrl)
      if (contentUrlIndex !== -1) {
        this.selectedPageImageList.splice(contentUrlIndex, 1)
      } else {
        this.selectedPageImageList.push(thumbnail.contentUrl)
      }

      const pageDataIndex = this.selectedPageItemData.findIndex(item => item.pageId === pageId)
      const pageData = this.getTargetPageItemData(pageId)
      this.$logger.info('pageData', pageData)
      if (pageDataIndex !== -1) {
        this.selectedPageItemData.splice(pageDataIndex, 1)
      } else if (pageData) {
        pageData.pageId = pageId
        this.selectedPageItemData.push(pageData)
      }
      this.$logger.info('selectedPageItemData', this.selectedPageItemData)
      this.$logger.info('selectedPageIdList', this.selectedPageIdList)

      // 处理sub task封面
      if (this.selectedPageIdList.length > 0) {
        const pageId = this.thumbnailList.filter(item => this.selectedPageIdList.indexOf(item.id) > -1)[0].id
        const selectPage = this.thumbnailList.filter(item => item.id === pageId)
        this.$logger.info('selectPage', selectPage)
        if (selectPage.length > 0) {
          this.currentTaskFormData.image = selectPage[0].contentUrl
        }
      }

      // 处理选中的ppt封面的标签custom
      this.currentTaskFormData.customTags = []
      this.itemsList.forEach(e => {
        if (this.selectedPageIdList.indexOf(e.pageId) !== -1) {
          const json = typeof (e.data) === 'object' ? e.data : JSON.parse(e.data)
          if (json.data && json.data.bloomLevel) {
            if (this.currentTaskFormData.customTags.findIndex(tag => tag.name === json.data.bloomLevel) === -1) {
              this.currentTaskFormData.customTags.push({
                name: json.data.bloomLevel,
                parentName: 'Bloom\'s Taxonomy'
              })
            }
          }
          if (json.data && json.data.knowledgeLevel) {
            if (this.currentTaskFormData.customTags.findIndex(tag => tag.name === json.data.knowledgeLevel) === -1) {
              this.currentTaskFormData.customTags.push({
                name: json.data.knowledgeLevel,
                parentName: 'Knowledge Dimensions'
              })
            }
          }
        }
      })
    },

    handleContinueSelectTemplate() {
      this.showChoseSelectTemplateVisible = false
      this.selectTemplateVisible = true
    },

    handleShowCreateChoice() {
      this.showCreateChoice = false
      this.selectedMyContentVisible = true
    },

    handleAudioResult(data) {
      logger.info('handleAudioResult', data)
      this.currentUploading = true
      const formData = new FormData()
      formData.append('file', data, 'audio.wav')
      this.$http.post(commonAPIUrl.UploadFile, formData, {
        contentType: false,
        processData: false,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      })
        .then((response) => {
          logger.info('handleAudioResult upload response:', response)
          this.audioUrl = this.$store.getters.downloadUrl + response.result
          logger.info('handleAudioResult audioUrl', this.audioUrl)
        }).catch(err => {
        logger.error('handleAudioResult error', err)
      }).finally(() => {
        this.currentUploading = false
      })
    },

    handleUploadAudio(data) {
      logger.info('handleUploadAudio', data)
      this.currentUploading = true
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
          logger.info('handleUploadAudio upload response:', response)
          this.audioUrl = this.$store.getters.downloadUrl + response.result
        }).catch(err => {
        logger.error('handleUploadImage error', err)
      }).finally(() => {
        this.currentUploading = false
      })
    },

    handleCancelAddAudio() {
      this.audioUrl = null
      this.showAddAudioVisible = false
    },

    handleConfirmAddAudio() {
      if (this.audioUrl) {
        this.form.audioUrl = this.audioUrl
        this.audioUrl = null
      }
      this.showAddAudioVisible = false
    },

    handleAddAudioOverview() {
      this.$logger.info('handleAddAudioOverview')
      this.showAddAudioVisible = true
    },

    handleAddAnotherTask() {
      this.$logger.info('handleAddAnotherTask')
    },

    handleAddSubTask(data) {
      this.$logger.info('handleAddSubTask', data, this.currentTaskFormData)
      if (this.selectedPageIdList.length) {
        const task = Object.assign({
          _uid: '' + Math.random(), // 随机生成一个id方便后面删除
          presentationId: this.form.presentationId,
          selectPageObjectIds: this.selectedPageIdList,
          selectPageImages: this.selectedPageImageList,
          taskId: this.form.id
        }, JSON.parse(JSON.stringify(data)))
        this.$logger.info('add sub task', task)
        this.subTasks.push(task)
        this.selectedPageIdList = []
        this.selectedPageImageList = []
        this.selectedPageItemData = []
        this.taskIndex++
        this.$logger.info('after add tasks ', this.subTasks)
      } else {
        this.$message.warn('Please select at least one slide!')
      }
    },

    handleDeleteSubTask(data) {
      this.$logger.info('handleDeleteSubTask data', data, this.subTasks)
      this.subTasks = this.subTasks.filter(item => item._uid !== data._uid)
      this.$logger.info('after delete tasks ', this.subTasks)
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
          // 设置是否已经人工上传
          if (this.form.presentationId) {
            this.form.hasUploadImage = true
          }
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
      this.form.hasUploadImage = false
    },

    async handleEditGoogleSlide() {
      this.editGoogleSlideLoading = true
      this.$logger.info('handleEditGoogleSlide', this.form.presentationId)
      if (this.form.presentationId) {
        await this.autoSave()
        window.open(this.presentationLink, '_blank')
      } else {
        await this.handleCreateTask()
      }
      this.editGoogleSlideLoading = false
    },

    handleAddTaskWithSlide() {
      this.$logger.info('handleAddTaskWithSlide')
      this.selectedSlideVisible = false
      this.selectedSlideVisibleFromSave = false
      this.currentActiveStepIndex = 2
      this.showSubTaskDetail = true
      this.currentTaskFormData = JSON.parse(JSON.stringify(this.form))
      this.$logger.info('currentTaskFormData', this.currentTaskFormData, 'customTags', this.customTags)
    },

    handleGotoEditMode() {
      this.$logger.info('handleGotoEditMode')
      this.$router.push({
        path: '/teacher/add-task/' + this.taskId + '/edit'
      })
    },

    handleCancelPickTaskSlide() {
      this.$logger.info('handleCancelPickTaskSlide')
      this.selectedSlideVisible = false
      this.currentTaskFormData = null
      this.currentActiveStepIndex = 3
    },
    handleSelectedSessionTags(tags) {
      this.sessionTags = tags
      this.$logger.info('handleSelectedSessionTags', tags)
    },
    handleAddTaskEvaluation() {
      logger.info('handleAddTaskEvaluation ' + this.taskId)
      // 下创建一个空的evaluation，然后关联，然后再跳转过去
      if (!this.addLoading) {
        this.addLoading = true
        EvaluationAddOrUpdate({ name: null }).then((response) => {
          this.$logger.info('EvaluationAddOrUpdate', response.result)
          if (response.success) {
            Associate({
              fromId: this.taskId,
              fromType: this.contentType.task,
              toId: response.result.id,
              toType: this.contentType.evaluation
            }).then(response => {
              this.$logger.info('Associate response ', response)
              // 刷新子组件的关联数据
            })
            this.addLoading = false
            this.$router.push({
              path: '/teacher/evaluation-redirect/' + response.result.id
            })
          } else {
            this.$message.error(response.message)
          }
        }).finally(() => {
          this.addLoading = false
        })
      } else {
        this.$logger.info('add loading')
      }
    },
    handleEnsureSelectedLink(data) {
      this.$logger.info('handleEnsureSelectedLink', data)
      this.selectLinkUnitPlanContentVisible = false
      this.selectLinkContentVisible = false
      this.getAssociate()
      // 刷新组件内的列表
      this.$refs.commonLink.getAssociate()
      // #协同编辑event事件
      this.handleCollaborateEvent(this.taskId, this.taskField.Link, this.associateUnitPlanIdList)
    },

    getAssociate() {
      this.$logger.info('AddTask GetAssociate id[' + this.taskId + '] fromType[' + this.contentType.task + ']')
      this.associateUnitPlanIdList = []
      this.associateTaskIdList = []
      GetAssociate({
        id: this.taskId,
        type: this.contentType.task
      }).then(response => {
        this.$logger.info('AddTask GetAssociate response', response)
        this.groupNameList = []
        this.groupNameListOther = []
        response.result.owner.forEach(item => {
          if (this.groupNameList.indexOf(item.group) === -1) {
            this.groupNameList.push(item.group)
          }

          item.contents.forEach(content => {
            console.log(content)
            if (content.type === this.contentType['unit-plan']) {
              this.associateUnitPlanIdList.push(content.id)
              this.associateId2Name.set(content.id, content.name)
              content.questions.forEach(question => {
                this.associateQuestionList.push({
                  ...question,
                  unitName: content.name
                })
              })
            }

            if (content.type === this.contentType.task) {
              this.associateTaskIdList.push(content.id)
              this.associateId2Name.set(content.id, content.name)
            }
          })
        })
        response.result.others.forEach(item => {
          if (this.groupNameListOther.indexOf(item.group) === -1) {
            this.groupNameListOther.push(item.group)
          }
          item.contents.forEach(content => {
            console.log(content)
            if (content.type === this.contentType['unit-plan']) {
              this.associateUnitPlanIdList.push(content.id)
              this.associateId2Name.set(content.id, content.name)
              content.questions.forEach(question => {
                this.associateQuestionList.push({
                  ...question,
                  unitName: content.name
                })
              })
            }

            if (content.type === this.contentType.task) {
              this.associateTaskIdList.push(content.id)
              this.associateId2Name.set(content.id, content.name)
            }
          })
        })
        this.newTermName = 'Untitled category_' + (this.groupNameList.length)
        this.$logger.info('AddTask GetAssociate formatted groupNameList', this.groupNameList, this.groupNameListOther)
        this.$logger.info('*******************associateUnitPlanIdList', this.associateUnitPlanIdList)
        this.$logger.info('associateTaskIdList', this.associateTaskIdList)
      }).finally(() => {
        this.linkGroupLoading = false

        if (this.associateUnitPlanIdList.length > 0) {
          this.loadRefLearnOuts()
          this.handleSelfOutsData()
        }
      })
    },

    async loadRefLearnOuts() {
      this.recommendData = []
      this.recommendDataIdList = []
      const unitPlanIdSet = new Set(this.associateUnitPlanIdList)
      this.associateUnitPlanIdList = [...unitPlanIdSet]
      const response = await FindSourceOutcomes({
        type: this.contentType['unit-plan'],
        ids: this.associateUnitPlanIdList
      })
      this.$logger.info('FindSourceOutcomes response', response)
      if (response.success) {
        const recommendMap = new Map()
        response.result.forEach(item => {
          if (recommendMap.has(item.fromId)) {
            recommendMap.get(item.fromId).push(item)
          } else {
            recommendMap.set(item.fromId, [item])
          }
          this.recommendDataIdList.push(item.knowledgeId)
        })
        this.recommendData = []
        for (const value of recommendMap.values()) {
          this.recommendData.push({
            fromId: value[0].fromId,
            fromName: value[0].fromName,
            fromTypeName: this.type2Name[value[0].fromType],
            list: value
          })
        }
        this.$logger.info('update recommendData ', this.recommendData)
      }
    },

    // 填充自定义大纲内容
    async handleSelfOutsData() {
      this.$logger.info(' handleSelfOutsData')
      const response = await GetReferOutcomes({
        id: this.taskId,
        type: this.contentType.task
      })
      this.$logger.info('getReferOutcomes response', response)
      if (response.success && response.result.length) {
         const list = response.result
         list.forEach(item => {
           if (item.hasOwnProperty('isSelfCustom') && item.isSelfCustom) {
             item.fromId = item.fromList[0].fromId
             item.fromName = item.fromList[0].fromName
             item.fromTypeName = this.type2Name[item.fromList[0].fromType]

             const targetItem = this.recommendData.find(rItem => rItem.fromId === item.fromId)
             if (targetItem) {
               this.$logger.info('targetItem ' + targetItem.fromName + ' add SelfCustom SelfOut ' + item.name, item)
               targetItem.list.push(item)
             }
           }
         })
      }
    },

    handleSelectAssessmentType(data) {
      this.$logger.info('handleSelectAssessmentType', data)
      this.selectedAssessmentList = data
    },

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

    handleEnsureSelectData() {
      this.$logger.info('handleEnsureSelectData',
        this.selectedCurriculumList,
        this.selectedSpecificSkillList,
        this.selectedCenturySkillList,
        this.selectedAssessmentList,
        this.selectedIduList,
        this.selectedRecommendList,
        this.selectedSyncList)
      this.$logger.info('mySelectedList', this.$refs.newBrowser.mySelectedList)
      this.$logger.info('learnOuts', this.form.learnOuts)
      const filterLearnOuts = this.$refs.newBrowser.mySelectedList.filter(item => (!item.hasOwnProperty('isSelfCustom') || (item.hasOwnProperty('isSelfCustom') && !item.isSelfCustom)))
      this.$logger.info('filterLearnOuts', filterLearnOuts)
      this.form.learnOuts = JSON.parse(JSON.stringify(filterLearnOuts))
      this.$refs.newBrowser.selectedRecommendList.forEach(item => {
        if (item.hasOwnProperty('isSelfCustom') && item.isSelfCustom) {
          // 自定义大纲不用判断重复，直接插入
          const copyItem = JSON.parse(JSON.stringify(item))
          copyItem.key = Math.random() + ''
          this.form.selfOuts.push(copyItem)
        } else {
          const index = this.form.learnOuts.findIndex(dataItem => dataItem.knowledgeId === item.knowledgeId)
          if (index === -1) {
            this.form.learnOuts.push(item)
          }
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

      this.selectedRecommendList.forEach(data => {
        if (!(data.hasOwnProperty('isSelfCustom') && data.isSelfCustom)) {
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
        }
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
          gradeId: data.knowledgeData.selectedGradeId,
          path: data.knowledgeData.path,
          tags: data.tags
        })
      })
      const selectList = this.selectedCurriculumList.concat(this.selectedSpecificSkillList).concat(this.selectedCenturySkillList)
        .concat(this.selectedAssessmentList)
      selectList.forEach(data => {
        const filterLearnOuts = this.form.learnOuts.filter(item => item.knowledgeId === data.knowledgeId)
        if (filterLearnOuts.length > 0) {
          return
        }
        this.form.learnOuts.push({
          knowledgeId: data.knowledgeData.id,
          name: data.knowledgeData.name,
          gradeId: data.knowledgeData.selectedGradeId,
          tagType: data.knowledgeData.tagType,
          path: data.knowledgeData.path
        })
      })
      this.$logger.info('this.form.learnOuts', this.form.learnOuts)
      this.selectSyncDataVisible = false
      this.handleCancelSelectData()
    },
    handleRemoveLearnOuts(data) {
      this.$logger.info('handleRemoveLearnOuts', data)
      var index = this.form.learnOuts.findIndex(item => (item.knowledgeId === data.knowledgeId))
      if (index > -1) {
        this.form.learnOuts.splice(index, 1)
      }

      // #协同编辑event事件
      this.handleCollaborateEvent(this.taskId, this.taskField.Assessment, this.form.assessment)
    },

    handleUpdateSelfOuts (data) {
      this.$logger.info('handleUpdateSelfOuts', data)
      const tagType = data.tagType
      const dataList = data.list
      let selfOuts = this.form.selfOuts
      selfOuts = selfOuts.filter(item => item.tagType !== tagType)
      dataList.forEach(item => {
        if (item.name && item.name.trim() !== '') {
          selfOuts.push(item)
        }
      })
      this.form.selfOutss = selfOuts
      this.$logger.info('selfOuts', selfOuts)
    },
    handleSelectDescription() {
      // 获取当前task关联的unit-plan的描述数据
      this.selectedList = JSON.parse(JSON.stringify(this.form.learnOuts))
      this.form.learnOuts.forEach(item => {
        if (item.knowledgeId) {
          this.selectedIdList.push(item.knowledgeId)
        } else {
          this.$logger.info('parentData selected id not exist ', item)
        }
      })
      this.$logger.info('handleSelectDescription selectedList', this.selectedList, ' recommendData ', this.recommendData)
      this.selectSyncDataVisible = true

      // #协同编辑event事件
      this.handleCollaborateEvent(this.taskId, this.taskField.Assessment, this.form.assessment)
    },

    handleStepChange(data) {
      this.$logger.info('task handleStepChange ', data)
      this.currentStep = data.step
      this.currentActiveStepIndex = data.index
      this.setSessionStep(data.index)
    },
    filterSearch(inputValue, path) {
      return path.some(option => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
    selectFilter(data) {
      this.$logger.info('selectFilter', data)
      this.$logger.info('filterType', this.filterType)
      this.templateLoading = true
      FilterTemplates({
        filterCategoryType: this.filterType,
        filterLearn: this.filterLearn,
        filterAssessments: this.getFilterAssessmentsParams(this.filterAssessments),
        filterCentury: this.getFilterParams(this.filterCentury),
        filterPruposeList: this.filterPruposeList
      }).then(response => {
        this.$logger.info('handleToggleTemplateType ', response)
        this.templateList = response.result
      }).finally(() => {
        this.templateLoading = false
      })
    },
    selectRecommendTemplate(template, rIndex, event) {
      this.$logger.info('selectRecommendTemplate', template)
      this.form.showSelected = true

      // 计算元素位置，然后添加动画
      this.currentSlideCoverImgSrc = template.images[0]
      this.$nextTick(() => {
        const slideAnimateDom = document.getElementById('slide-animate')
        const slideAnimateImgDom = document.getElementById('slide-animate-img')
        const imgDomPos = slideAnimateDom.getBoundingClientRect()
        const containerDomPos = document.getElementById('templateSelected').getBoundingClientRect()
        const buttonPos = event.target.getBoundingClientRect()

        console.log(containerDomPos)
        console.log('buttonPos y ' + buttonPos.y + ' containerDomPos y ' + containerDomPos.y + ' containerDomPos h ' + containerDomPos.height + ' img y ' + imgDomPos.y + ' distY ' + (buttonPos.y - containerDomPos.y - containerDomPos.height / 2))
        const offsetX = -(buttonPos.left + buttonPos.width / 2 - (containerDomPos.left + containerDomPos.width / 2))
        const offsetY = -(event.clientY - (containerDomPos.y + containerDomPos.height / 2))
        console.log('offsetX: ' + offsetX + ' offsetY: ' + offsetY)

        // slide截图出现与初始定位
        slideAnimateDom.style.left = buttonPos.left + buttonPos.width / 2 - 200 + 'px'
        slideAnimateDom.style.top = buttonPos.top + buttonPos.height / 2 - 100 + 'px'
        slideAnimateDom.style.display = 'block'

        // 开始动画
        slideAnimateDom.style.transform = 'translateX(' + offsetX + 'px)'
        slideAnimateImgDom.style.transform = 'translateY(' + offsetY + 'px) scale(0.1)'
        setTimeout(() => {
          this.currentSlideCoverImgSrc = null
          slideAnimateDom.style.transform = 'translateX(0px)'
          slideAnimateImgDom.style.transform = 'translateY(0px) scale(1)'
          if (this.selectedTemplateIdList.indexOf(template.id) === -1) {
            this.selectedTemplateList.unshift(template)
          }
          this.autoSave()
        }, 600)
      })
    },
    loadCustomTags() {
      // this.$refs.customTag.tagLoading = true
      FindCustomTags({}).then((response) => {
        this.$logger.info('FindCustomTags response', response.result)
        if (response.success) {
          this.customTags = response.result
          // 默认展示的tag分类
          CustomTagType.task.default.forEach(name => {
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
      this.currentFocusFieldName = null
      this.customTagList = []
      while (currentDom !== null) {
        formTop += (currentDom ? currentDom.offsetTop : 0)
        currentDom = currentDom ? currentDom.offsetParent : undefined
        if (!currentDom) {
          break
        }

        if (currentDom.classList.contains('tag-content-block') && currentDom.hasAttribute('data-field-name')) {
          const fieldName = currentDom.getAttribute('data-field-name')
          this.$logger.info('current block fieldName', fieldName)
          this.currentFocusFieldName = fieldName
          if (this.$store.getters.formConfigData?.taskFieldTagMap?.[fieldName]) {
             if (fieldName === this.taskField.TaskType) {
               this.customTagList = this.$store.getters.formConfigData.taskFieldTagMap[fieldName].filter(item => item.subFieldName && item.subFieldName.toLowerCase() === this.form.taskType.toLowerCase()).map(item => item.tagName)
               this.$logger.info(fieldName + ' customTagList taskType ' + this.form.taskType, this.customTagList)
             } else {
               this.customTagList = this.$store.getters.formConfigData.taskFieldTagMap[fieldName].map(item => item.tagName)
               this.$logger.info(fieldName + ' customTagList', this.customTagList)
             }
          }
        }
        if (currentDom.classList && currentDom.classList.contains('root-locate-form')) {
          break
        }
      }
      // custom tag 自带了margin-top: 20px,这里减掉不然不对齐。
      if (this.currentFocusFieldName) {
        this.$logger.info('show currentFocusFieldName tag ', this.currentFocusFieldName)
        this.customTagTop = formTop - 20
        this.showCustomTag = true
        this.setRightModuleVisible(this.rightModule.customTag)
      } else {
        this.$logger.info('show global tag')
        CustomTagType.task.default.forEach(name => {
          this.customTagList.push(name)
        })
        // 再拼接自己添加的
        this.customTags.userTags.forEach(tag => {
          if (this.customTagList.indexOf(tag.name === -1)) {
            this.customTagList.push(tag.name)
          }
        })
        this.showCustomTag = false
        this.customTagTop = 20
        this.setRightModuleVisible()
      }
    },
    handleChangeCustomTags(tags) {
      this.form.customTags = tags
    },
    handleChangeSubCustomTags(tags) {
      if (this.currentTaskFormData) {
        this.currentTaskFormData.customTags = tags
      }
    },
    handleChangeAddKeywords(tag) {
      if (tag.isGlobal) {
        this.customTags.userGlobalTags.push(tag)
      } else {
        var index = this.customTags.userTags.findIndex(item => item.name === tag.parentName)
        if (index > -1) {
          this.customTags.userTags[index].keywords.push(tag.name)
        }
      }
    },

    // 切换当前的字段的点评数据，从总的collaborateCommentList筛选初当前字段相关的点评数据
    handleSwitchComment(data) {
      this.$logger.info('handleSwitchComment', data)
      if (!data.activeStatus) {
        this.currentFieldName = ''
        this.handleDisplayRightModule()
        return
      }
      this.currentRightModule = RightModule.collaborate
      this.currentFieldName = data.fieldName
      this.currentCollaborateCommentList = []
      const list = []
      this.collaborateCommentList.forEach(item => {
        if (item.fieldName === data.fieldName) {
          list.push(item)
        }
      })
      this.currentCollaborateCommentList = list
      this.collaborateTop = data.top
      this.$logger.info('currentCollaborateCommentList', list)

      // #协同编辑event事件
      this.handleCollaborateEvent(this.taskId, data.fieldName, data.fieldName)
    },

    // 每次点击都重新加载一下最新数据
    handleViewCollaborate() {
      this.showHistoryLoading = true
      this.$logger.info('handleViewCollaborate')
      if (this.showModuleList.indexOf(this.rightModule.collaborate) !== -1) {
        this.resetRightModuleVisible()
      } else {
        this.setRightModuleVisible(this.rightModule.collaborate)
      }
      this.showHistoryLoading = true
      this.loadCollaborateData(this.form.type, this.form.id)
    },

    // TODO 发布评论后需要更新最新的评论列表,刷新数据
    handleUpdateCommentList() {
      this.$logger.info('handleUpdateCommentList')
      this.GetCollaborateComment(this.form.type, this.form.id)
    },

    // historyData以及在接口请求的相应逻辑中正对数据进行‘格式’，
    // 这样在这里就可以直接this.$set设置字段的数据
    handleRestoreField(data) {
      this.$logger.info('handleRestoreField', data, this.form)
      if (data) {
        // data.historyData.forEach(dataItem => {
        //   this.$logger.info('set ' + dataItem.fieldName, dataItem.data[0])
        //   if (Array.isArray(dataItem.data[0])) {
        //     dataItem.data[0].forEach((item, index) => {
        //       this.$set(this.form[dataItem.fieldName], index, dataItem.data[0][index])
        //     })
        //   } else {
        //     this.$set(this.form, dataItem.fieldName, dataItem.data[0])
        //   }
        // })
        this.form = data
        this.$message.success('restore successfully!')
      }
      this.$logger.info('after handleRestoreField', this.form)
    },
    templateFilterCondition(category1, category2) {
      let list = []
      if (category1 === TemplateType.Learning) {
        list = this.learnExperienceList
      } else if (category1 === TemplateType.Assessments) {
        list = this.assessmentsList
      } else if (category1 === TemplateType.Century) {
        list = this.centuryList
      }
      console.log('list size:' + list.length)
      if (!category2) {
        return list
      }
      const resultList = list.filter(item => item.name === category2)
      logger.info('templateFilterCondition ', resultList)
      return resultList.length > 0 ? resultList[0].children : []
    },
    onClickRadio(e, category, parent) {
      logger.info('onChangeCheckBox ', e, category, parent)
      logger.info('filterLearn ', this.filterLearn)
      const id = e.target.value
      const isAdd = this.filterAssessments.indexOf(id) === -1
      // 单选，去除同parent其他值
      parent.children.forEach(item => {
        if (this.filterAssessments.indexOf(item.id) !== -1) {
          this.filterAssessments.splice(this.filterAssessments.indexOf(item.id), 1)
        }
      })
      if (isAdd) {
        this.filterAssessments.push(id)
      }
      this.selectFilter()
    },
    onChangeCheckBox(e, category, parent) {
      logger.info('onChangeCheckBox ', e, category, parent)
      logger.info('filterLearn ', this.filterLearn)
      const id = e.target.value
      if (category === TemplateType.Learning) {
        if (this.filterLearn.indexOf(id) === -1) {
          this.filterLearn.push(id)
        } else {
          this.filterLearn.splice(this.filterLearn.indexOf(id), 1)
        }
      } else if (category === TemplateType.Assessments) {
        // 单选，去除同parent其他值
        parent.children.forEach(item => {
          if (this.filterAssessments.indexOf(item.id) !== -1) {
            this.filterAssessments.splice(this.filterAssessments.indexOf(item.id), 1)
          }
        })
        this.filterAssessments.push(id)
      } else if (category === TemplateType.Century) {
        if (this.filterCentury.indexOf(id) === -1) {
          this.filterCentury.push(id)
        } else {
          this.filterCentury.splice(this.filterCentury.indexOf(id), 1)
          // 去重父标签
          if (!e.target.checked && parent && parent.id !== id && this.filterCentury.indexOf(parent.id) !== -1) {
            this.filterCentury.splice(this.filterCentury.indexOf(parent.id), 1)
          }
        }
        // child设置
        if (parent.id === id) {
          parent.children.forEach(child => {
            if (e.target.checked) {
              if (this.filterCentury.indexOf(child.id) === -1) {
                this.filterCentury.push(child.id)
              }
            } else {
              this.filterCentury.splice(this.filterCentury.indexOf(child.id), 1)
            }
          })
        }
      } else if (category === TemplateType.Prompt) {
        if (this.filterPruposeList.indexOf(id) === -1) {
          this.filterPruposeList.push(id)
        } else {
          this.filterPruposeList.splice(this.filterPruposeList.indexOf(id), 1)
        }
      }
      // 如果选中的是子类 父id要从筛选条件中去除，记录关系
      if (parent && parent.children && parent.children.length > 0) {
        this.filterParentMap.set(id, parent.id)
      }
      this.selectFilter()
    },
    clearFilter() {
      if (this.filterType === 1) {
        this.filterLearn = []
      } else if (this.filterType === 2) {
        this.filterAssessments = []
        this.assessmentsList.forEach(parent => {
          parent.children.forEach(child => {
            child.tooltip = ''
          })
        })
      } else if (this.filterType === 3) {
        this.filterCentury = []
      } else if (this.filterType === 4) {
        this.filterPruposeList = []
      }
      this.selectFilter()
    },
    getFilterParams(list) {
      logger.info('getFilterParams ', list)
      if (list.length === 0) {
        return []
      }
      var resList = [...list]
      console.log(this.filterParentMap)
      list.forEach(id => {
        if (this.filterParentMap.has(id)) {
          const pId = this.filterParentMap.get(id)
          if (resList.indexOf(pId) > -1) {
            resList.splice(resList.indexOf(pId), 1)
          }
        }
      })
      return resList
    },
    getFilterAssessmentsParams(list) {
      if (list.length === 0) {
        return []
      }
      var resList = []
      if (!this.filterAssessmentsType) {
        return list
      }
      if (this.assessmentsList.length !== 2) {
        return list
      }
      if (this.filterAssessmentsType === '1') {
        this.assessmentsList[0].children.forEach(parent => {
          parent.children.forEach(child => {
            if (list.indexOf(child.id) !== -1) {
              resList.push(child.id)
            }
          })
        })
      } else {
        this.assessmentsList[1].children.forEach(parent => {
          parent.children.forEach(child => {
            if (list.indexOf(child.id) !== -1) {
              resList.push(child.id)
            }
          })
        })
      }
      console.log(resList)
      return resList
    },
    GetTagYearTips() {
      GetTagYearTips().then((response) => {
        this.$logger.info('GetTagYearTips response', response.result)
        if (response.success) {
          const tagYears = response.result
          tagYears.forEach(tag => {
            if (!this.centuryTagMap.has(tag.yearName)) {
              this.centuryTagMap.set(tag.yearName, [])
            }
            this.centuryTagMap.get(tag.yearName).push(tag)
          })
          if (tagYears.length > 0) {
            this.selectYearTab = tagYears[0].yearName
          }
        } else {
          this.$message.error(response.message)
        }
        this.$logger.info('centuryTagMap ', this.centuryTagMap)
      })
    },
    handleTabYearChange(activeKey) {
      this.selectYearTab = activeKey
    },

    setSessionStep(step) {
      this.resetRightModuleVisible()
      this.currentActiveStepIndex = step
      sessionStorage.setItem('task-step-' + this.taskId, step)
    },
    getSessionStep() {
      const oldStep = sessionStorage.getItem('task-step-' + this.taskId)
      if (oldStep !== null) {
        return parseInt(oldStep)
      } else {
        return 0
      }
    },
    handlePreviewTemplate(template) {
      this.$logger.info('handlePreviewTemplate ', template)
      this.previewTemplateVisible = true
      this.previewTemplate = template
    },
    handlePreviewQuickTaskTemplate(template) {
      this.$logger.info('handlePreviewTemplate ', template)
      this.quickTaskPreviewTemplate = template
      this.quickTaskPreviewTemplateVisible = true
    },
    handleSelectPreviewTemplate(template) {
      this.$logger.info('handleSelectPreviewTemplate ', template)
      this.handleSelectTemplateMadel(template)
      this.previewTemplateVisible = false
    },
    handleSelectQuickTaskPreviewTemplate(data) {
      this.$logger.info('handleSelectQuickTaskPreviewTemplate ', data)
      if (data.presentationId && data.selectPageObjectIds && data.selectPageObjectIds.length > 0) {
        this.handleEnsureChooseAnother(data)
      }
      this.quickTaskPreviewTemplateVisible = false
    },
    handleGotoImgIndex(index) {
      this.$logger.info('handleGotoImgIndex ' + index, this.$refs)
      this.currentImgIndex = index
      if (this.$refs.carousel) {
        this.$refs.carousel[0].goTo(index)
      }
    },
    removeSelectTemplate(template) {
      this.$logger.info('removeSelectTemplate ', template)
      var index = this.selectedTemplateList.findIndex(item => item.id === template.id)
      if (index > -1) {
        this.selectedTemplateList.splice(index, 1)
      }
      if (this.selectedTemplateList.length === 0) {
        this.form.showSelected = false
      }
      this.autoSave()
    },
    handleSelectedTemplate() {
      this.$logger.info('handleSelectedTemplate ', this.handleSelectedTemplate)
      this.selectedMyContentVisible = false
    },
    changeSelected(checked) {
      this.$logger.info('changeSelected ', checked)
      this.form.showSelected = checked
    },
    changeFilterType(e) {
      this.showTemplateFilter = true
      this.selectFilter()
    },
    toggleUpFilter() {
      this.showTemplateFilter = false
      // this.clearFilter()
      this.filterType = ''
    },
    handleSelectDrawerClose() {
      this.selectedTemplateMarginLeft = '5%'
      this.selectedTemplateMadelWidth = '90%'
      this.selectedTemplateDrawerVisible = false
      this.selectedTemplateDrawerZindex = 1000
      if (this.selectedTemplateIdList.length === 0) {
        this.form.showSelected = false
      }
    },
    handleSelectDrawerSave() {
      this.selectedTemplateMarginLeft = '5%'
      this.selectedTemplateMadelWidth = '90%'
      this.selectedTemplateDrawerZindex = 1000
      this.selectedTemplateDrawerVisible = false
      this.selectedMyContentVisible = false
      this.selectedTemplateList = this.drawerSelectedTemplateList
      // to do insert
      if (this.selectedTemplateList.length === 0) {
        this.form.showSelected = false
      }
      this.autoSave()
    },

    handleSaveSubTask(status) {
      this.$logger.info('handleSaveSubTask status ' + status, this.subTasks)
      if (status) {
        this.subTaskPublishing = true
      } else {
        this.subTaskSaving = true
      }
      const postData = {
        taskId: this.taskId,
        subTasks: []
      }
      this.subTasks.forEach(taskItem => {
        taskItem.subTask.selectPageObjectIds = taskItem.selectPageObjectIds
        taskItem.subTask.status = status
        postData.subTasks.push(taskItem.subTask)
      })
      this.$logger.info('handleSaveSubTask postData', postData)
      SplitTask(postData).then(response => {
        this.$logger.info('handleSaveSubTask response', response)
        if (response.success) {
          this.$message.success('add successfully')
          this.subTasks = []
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.subTaskPublishing = false
        this.subTaskSaving = false
      })
    },

    handleSaveSubTaskAndForm (status) {
      this.$logger.info('handleSaveSubTaskAndForm status ' + status, this.subTasks)
      if (status) {
        this.subTaskPublishing = true
      } else {
        this.subTaskSaving = true
      }
      const postData = {
        taskId: this.taskId,
        subTasks: []
      }
      this.subTasks.forEach(taskItem => {
        taskItem.subTask.selectPageObjectIds = taskItem.selectPageObjectIds
        taskItem.subTask.status = status
        postData.subTasks.push(taskItem.subTask)
      })
      this.$logger.info('handleSaveSubTask postData', postData)
      SplitTask(postData).then(response => {
        this.$logger.info('handleSaveSubTask response', response)
        if (response.success) {
          this.$message.success('add successfully')
          this.subTasks = []
          this.handleSaveTask(true)
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.subTaskPublishing = false
        this.subTaskSaving = false
      })
    },
    async autoSave() {
      const taskData = Object.assign({}, this.form)
      const taskClassList = []
      taskData.taskClassList.forEach(item => {
        if (item.classId) {
          const classScheduleData = {
            classId: item.classId,
            startDate: null,
            endDate: null
          }
          if (item.checked && item.momentRangeDate.length === 2) {
            const startDate = item.momentRangeDate[0].clone()
            const endDate = item.momentRangeDate[1].clone()
            classScheduleData.startDate = startDate.utc().format('YYYY-MM-DD HH:mm:ss')
            classScheduleData.endDate = endDate.utc().format('YYYY-MM-DD HH:mm:ss')
          }
          taskClassList.push(classScheduleData)
        }
      })
      taskData.taskClassList = taskClassList
      if (this.taskId) {
        taskData.id = this.taskId
      }
      taskData.selectedTemplateList = this.selectedTemplateList
      // 更新selfOuts数据
      if (this.$refs.learnOut && this.$refs.learnOut.length > 0) {
        taskData.selfOuts = this.$refs.learnOut[0].getSelfOuts()
      }
      if (taskData.customFieldData) {
        taskData.customFieldData = JSON.stringify(taskData.customFieldData)
      }
      logger.info('basic taskData', taskData)
      const response = await TaskAddOrUpdate(taskData)
      logger.info('TaskAddOrUpdate', response.result)
    },
    setCustomTagByPPT(nameList, parent) {
      nameList.forEach(name => {
        const res = this.form.customTags.filter(tag => tag.parentName === parent && name === tag.name)
        if (res.length === 0) {
          this.form.customTags.push({
            name: name,
            parentName: parent
          })
        }
      })
      console.log(this.form.customTags)
    },

    handleAddMaterial() {
      this.form.materialList.push({
        name: null,
        link: null,
        error: null
      })
      this.$logger.info('handleAddMaterial', this.form.materialList)
    },

    handleRemoveMaterialItem(item, index) {
      this.form.materialList = this.form.materialList.filter((it, idx) => idx !== index)
      this.$logger.info('handleRemoveMaterialItem ', this.form.materialList)
    },

    handleMaterialListFlagChange(checked) {
      this.$logger.info('handleMaterialListFlagChange ', checked)
      if (checked) {
        if (this.form.materialList.length === 0) {
          this.handleAddMaterial()
        }
      } else {
        this.form.materialList = []
      }
      this.materialListFlag = checked
    },

    handleShareTask() {
      this.$logger.info('handleShareTask')
      this.shareVisible = true
    },

    loadingShareContent() {
      QueryContentShare({
        sourceId: this.form.id,
        sourceType: this.form.type
      }).then(response => {
        this.$logger.info('form QueryContentShare response', response)
        if (response.result) {
          this.shareStatus = response.result.status
        } else {
          this.shareStatus = 0
        }
      })
    },
    handleShareStatus (status) {
      this.$logger.info('handleShareStatus', status)
      this.shareStatus = status
    },
    handleUpdateContent() {
      // const contentMsg = this.$store.state.websocket.saveContentMsg
      // contentMsg.hideUpdate = true
      // this.form = contentMsg.content.details
      // 缓存时间少于最新的内容
      this.form.updateTime = moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss')
      LocalStore.setFormContentLocal(this.form.id, this.form.type, JSON.stringify(this.form))
      this.defaultHistoryKey = '2'
      this.handleViewCollaborate()
      setTimeout(() => {
        this.restoreTask(this.form.id)
      }, 100)
    },

    handleChangeClassSessionTime (classItem) {
      this.$logger.info('handleChangeClassSessionTime', classItem)
      if (!classItem.checked) {
        classItem.momentRangeDate = []
        classItem.startDate = null
        classItem.endDate = null
      }
    },

    handleAddLinkClass () {
      this.form.taskClassList.push({
        classId: null,
        startDate: null,
        endDate: null,
        checked: false,
        momentRangeDate: [],
        weeks: null
      })
    },

    handleDeleteClass (idx, classItem) {
      this.$logger.info('handleDeleteClass', classItem)
      const newTaskClassList = []
      for (let i = 0; i < this.form.taskClassList.length; i++) {
        if (this.form.taskClassList[i].classId === classItem.classId && i === idx) {
        } else {
          newTaskClassList.push(this.form.taskClassList[i])
        }
      }
      this.form.taskClassList = newTaskClassList
    },

    handleCreateNewClass (data) {
      this.$logger.info('handleCreateNewClass', data)
      PersonalAddOrUpdateClass({ name: data.value }).then(response => {
        SchoolClassGetMyClasses().then(response => {
          this.$logger.info('SchoolClassGetMyClasses', response)
          this.classList = response.result
          // 自动选中刚刚新建的班级
          const selectedClassItem = this.classList.find(item => item.name === data.value)
          if (data.index !== -1 && this.form.taskClassList.length > data.index && selectedClassItem) {
            this.$logger.info('handleCreateNewClass selectedClassItem', selectedClassItem)
            this.form.taskClassList[data.index].classId = selectedClassItem.id
          }
        })
      })
    },

    handleSelectClass (classItem, eventData) {
      this.$logger.info('handleSelectClass', classItem, eventData)
      classItem.classId = eventData.id
      classItem.classType = eventData.classType
      classItem.className = eventData.name
      if (this.form.taskMode === 2) {
        eventData.classId = eventData.id
        eventData.className = eventData.name
        this.quickSessionClassItem = eventData
        this.$logger.info('handleSelectClass quickSessionClassItem', this.quickSessionClassItem)
      }
    },

    handleUpdateWeeks (status) {
      this.$logger.info('handleUpdateWeeks', status)
      if (!status) {
        this.form.taskClassList.forEach(item => {
          if (item.checked && item.momentRangeDate.length === 2) {
            item.weeks = this.getWeekByDate(item.momentRangeDate[0], item.momentRangeDate[1])
          }
        })
      }
    },

    addMaterialList({ url, type }) {
      this.$logger.info('addMaterialList', url, type)
      const pageId = this.currentPageId
      const itemData = {
        page_id: pageId,
        url: url,
        type: type,
        position: { x: 0, y: 0, w: 0, h: 0 }
      }
      const elementItem = {
        data: itemData,
        pageId: pageId,
        slideId: this.form.presentationId
      }
      const elementList = [elementItem]
      addBatchElements({
        elementsList: elementList,
        itemsList: []
      }).then(response => {
        this.$logger.info('addBatchElements', response)
        if (response.success) {
          this.$message.success('Upload successfully')
        } else {
          this.$message.error('Upload failed ' + response.message)
        }
        this.getClassInfo(this.form.presentationId)
      })
    },
    deleteMaterial(id) {
      this.$logger.info('addMaterialList', id)
    },
    checkUrl(url) {
      if (url && url.trim()) {
        const list = url.split('.')
        if (list.length <= 1) {
          return false
        }
        for (let i = 0; i < list.length; i++) {
          if (list[i].length < 2) {
            return false
          }
        }
      }
      return true
    },

    handleTestWebsiteLink (materialItem) {
      if (materialItem.link && this.checkUrl(materialItem.link)) {
        window.open('https://' + materialItem.link, '_blank')
      } else {
        this.$message.warn('Please enter a valid URL')
      }
    },

    handleDontRemindMe () {
      this.$logger.info('handleDontRemindMe', this.dontRemindMe)
      if (this.dontRemindMe) {
        window.localStorage.setItem('dontRemindMe_' + this.$store.getters.email, 'true')
      }
    },

    // 选词自动填入标签功能
    handleAddCustomTagRemote(res) {
      if (res.parentId && this.$refs.customTag) {
        this.$refs.customTag.remoteChooseTag(res.parentId, res.tag)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.step-content {
  padding: 25px 0 10px 0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;

  .form-body {
    flex-grow: 1;
    max-width: calc(100% - 650px);
    padding-right: 30px;

    .form-page-item {
      .form-field-item {
        .form-block {
          position: relative;

          &:hover {
            .my-comment-switch {
              display: block;
            }
          }

          /deep/ .ant-form-item label {
            font-weight: 500;
            font-family: Inter-Bold;
          }
        }
      }
    }
  }

  .tag-body {
    width: 650px;
  }
}

.slide-preview-list {
  max-height: 1000px;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  /deep/ .ant-carousel {
    .slick-slide {
      text-align: center;
      height: 200px;
      line-height: 200px;
      background: #364d79;
      overflow: hidden;
    }

    .slick-slide img {
      width: 400px;
    }

    custom-slick-arrow {
      width: 25px;
      height: 25px;
      font-size: 25px;
      color: #fff;
      background-color: rgba(31, 45, 61, 0.11);
      opacity: 0.3;
    }

    .custom-slick-arrow:before {
      display: none;
    }

    .custom-slick-arrow:hover {
      opacity: 0.5;
    }

    .slick-slide h3 {
      color: #fff;
    }

    .anticon {
      color: fade(@black, 45%);
      font-size: 25px;
    }
  }

  .slide-preview-item {
    position: relative;
    margin: 15px;
    width: 400px;

    .template-hover-action-mask {
      display: none;
      z-index: 100;
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);

      .template-hover-action {
        width: 100%;
        top: 30%
      }

      .action-item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px 13px;
        background: rgba(0, 0, 0, 0.45);
        opacity: 1;
        border: 1px solid rgba(188, 188, 188, 1);
      }

      .template-hover-action {
        position: absolute;
      }
    }

    &:hover {
      .template-hover-action-mask {
        display: block;
      }
    }

  }

  .slide-desc {
    width: 70%;
    max-height: 50px;
    margin: 0 auto 10px;
    overflow: hidden;
  }
}

.add-content-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;

  .add-content-item {
    width: 40%;
    margin-right: 10px;
    margin-left: 10px;
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #eee;
    cursor: pointer;

    &:hover {
      background-color: fade(@outline-color, 20%);
      border: 1px solid @primary-color;
    }
  }
}

.select-template-wrapper {
  display: flex;
  cursor: pointer;
  user-select: none;
  flex-direction: column;
  margin-bottom: 40px;

  .template-show-filter {
    position: relative;

    img {
      height: 25px;
      width: 25px;
      position: absolute;
      top: -10px;
      left: 5px;
      cursor: pointer;
    }
  }

  .template-select-header {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid #ddd;
    opacity: 1;
    border-radius: 4px;
    padding: 10px;
    position: relative;

    .expand-icon {
      line-height: 30px;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      i {
        svg {
          font-size: 23px;
        }
      }
    }

    .group-filter {
      margin-left: 15px;
      margin-bottom: 3px;
    }

    .filter-row {
      position: relative;
      margin-left: 10px;
      width: 100%;

      .ant-form-item-label {
        font-weight: bold;
        line-height: 24px;
        color: #11142D;
      }

      .clear-all {
        position: absolute;
        right: 3px;
        top: -3px;
      }

      .row-select {
        .sub-category {
          line-height: 24px;
          color: #D3D3D3;
        }

        .sub-select {
          margin-bottom: 10px;

          .sub-items {
            display: flex;
            flex-wrap: wrap;

            .sub-item {
              margin: 3px 10px;
              width: 250px;
              word-break: break-word;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              white-space: nowrap;
            }
          }
        }

        .first-child {
          margin: 5px;
        }

        .sub-child {
          padding-left: 20px;

          .sub-child-child {
            margin: 3px;
          }
        }

        margin: 5px 5px 10px 10px;
        border: 1px solid #E4E4E4;
        padding: 5px 15px;
        max-height: 250px;
        overflow: auto;
      }

      .row-select-assessments .sub-select {
        width: 100%;

        .sub-items .sub-item {
          width: 180px;
        }
      }
    }

    .header-title {
      padding: 5px 15px 5px 15px;

      .header-title-text {
        font-size: 20px;
        font-family: Inter-Bold;
        line-height: 24px;
        color: #182552;
        opacity: 1;
      }
    }

    .template-type-list {
      display: inline-block;
      flex-direction: row;
      justify-content: flex-start;

      .template-type-item {
        margin-right: 10px;
        margin-bottom: 10px;
        padding: 5px 15px;
        max-height: 50px;
        display: inline-block;
        justify-content: center;
        align-items: center;
        text-align: center;
        font-size: 14px;
        min-width: 70px;
        background: rgba(245, 245, 245, 0.5);
        border: 1px solid #ddd;
        color: #11142D;
        opacity: 1;
        border-radius: 25px;
      }

      .active-template-type {
        background: #15C39A;
        opacity: 1;
        color: #fff;
        position: relative;
        border-radius: 40px;

        img {
          height: 18px;
          position: absolute;
          right: -3px;
          top: -7px;
        }
      }

      .sub-active-template-type {
        background: #FF3355;
        opacity: 1;
        color: #fff;
        position: relative;
        border-radius: 40px;

        img {
          height: 18px;
          position: absolute;
          right: -3px;
          top: -7px;
        }
      }
    }
  }

  .template-list-wrapper {
    margin-top: 20px;
    min-height: 250px;
    max-height: 600px;
    overflow-y: auto;
    background: rgba(228, 228, 228, 0.2);
    border: 1px solid #D8D8D8;
    opacity: 1;
    border-radius: 4px;
    padding: 20px;

    .template-list {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      flex-wrap: wrap;

      .template-item {
        background-size: cover;
        margin-right: 1%;
        margin-left: 1%;
        margin-bottom: 20px;
        box-sizing: border-box;
        width: 23%;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        background: #FFFFFF;
        border: 1px solid #E8E8E8;
        border-radius: 4px;
        position: relative;

        .template-select-icon {
          z-index: 50;
          position: absolute;
          user-select: none;
          right: 5px;
          top: 5px;

          img {
            user-select: none;
            height: 18px;
          }
        }

        .template-cover {
          background-size: 100% 100%;
          height: 150px;
          border-radius: 4px;
          width: 100%;
          background-color: #ddd;
          box-sizing: border-box;
          padding: 0;
        }

        .template-info {
          padding: 10px;
          display: flex;
          position: relative;
          flex-direction: column;
          justify-content: flex-start;

          .template-name {
            font-weight: 500;
            font-size: 14px;
            z-index: 10;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
            padding: 10px 0;
            min-height: 40px;
          }

          .template-intro {
            min-height: 30px;
            z-index: 10;
            padding: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
            color: rgba(0, 0, 0, .45);
            font-size: 12px;
            background: rgba(244, 244, 244, 0.5);
            border-radius: 4px;
            font-family: Inter-Bold;
            color: #000000;
          }
        }

        .template-hover-action-mask {
          display: none;
          z-index: 100;
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);

          .template-hover-action {
            width: 100%;
            top: 30%
          }

          .action-item {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px 13px;
            background: rgba(0, 0, 0, 0.45);
            opacity: 1;
            border: 1px solid rgba(188, 188, 188, 1);
          }

          .template-hover-action {
            position: absolute;
          }
        }

        &:hover {
          .template-hover-action-mask {
            display: block;
          }
        }
      }

      .template-item-active {
        border: 1px solid #15C39A;
        box-shadow: 0px 3px 6px rgba(21, 195, 154, 0.16);
        opacity: 1;
      }
    }
  }

  .template-action {
    padding: 20px 0 0;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: right;

    .create-loading {
      display: inline-block;
      margin-right: 20px;
    }
  }
}

.template-loading {
  margin-top: 20px;
  min-height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.no-template {
  margin-top: 20px;
}

.task-type-line {
  margin-bottom: 20px;

  .task-type {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 5px 20%;

    .task-type-item {
      margin-right: 15px;
      cursor: pointer;
      padding: 5px;
      line-height: 15px;
      width: 25px;
      height: 25px;
      font-size: 14px;
      background-color: fade(@outline-color, 20%);
      color: @primary-color;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }

    .active-task-type {
      background-color: fade(#FF3355, 10%);
      color: #FF3355;
      border-radius: 50%;
      font-weight: 500;
      border-color: #FF3355
    }
  }
}

.view-in-google-slider {
  display: flex;
  min-height: 100px;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .view-line {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: flex-start;

    .link-url {
      width: 100%;
      word-break: break-all;
      overflow: hidden;
    }

    .view-action {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      margin-top: 20px;
      text-align: right;
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
  //margin-top: 20px;
  .button-item {
    margin-left: 10px;
  }
}

*::-webkit-scrollbar {
  width: 5px;
  height: 10px;
}

*::-webkit-scrollbar-track {
  border-radius: 1px;
  background: rgba(0, 0, 0, 0.00);
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.04);
}

/* 滚动条滑块 */
*::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.04);
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.04);
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

.selected-my-content {
  .selected-item {
    padding: 5px 0;
    font-size: 14px;
    margin-bottom: 5px;
  }
}

.more-action {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  .action-item {
    margin: 0 10px;
  }
}

.preview-list {
  margin-bottom: 5px;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  min-height: 120px;
  max-height: 374px;
  background: rgba(228, 228, 228, 0.2);
  //border: 1px solid #D8D8D8;
  opacity: 1;
  border-radius: 2px;
  //padding: 5px;
  padding-right: 3px;

  .preview-item-cover {
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    width: 100%;
    height: 160px;
    border-radius: 4px;
    border: 3px solid #fff;

    .mask {
      display: none;
    }

    .template-select-icon {
      z-index: 50;
      position: absolute;
      user-select: none;
      right: 5px;
      top: 2px;

      img {
        user-select: none;
        height: 18px;
      }
    }
  }

  .preview-item-cover-active {
    border: 3px solid #15C39A;
    border-radius: 4px;

    .mask {
      display: block !important;
      z-index: 30;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background: #000;
      opacity: 0.4;
    }
  }
}

.thumbnail-loading {
  min-height: 200px;
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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

.thumbnail-task-list {
  box-sizing: border-box;
  margin: 5px auto;
  display: flex;
  flex-direction: column;

  .task-preview-list {
    margin-top: 20px;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: nowrap;
    overflow-x: scroll;
    background: #38cfa611;
    padding: 10px 10px 5px 10px;

    &:hover {
      &::-webkit-scrollbar {
        opacity: 1;
      }
    }

    &::-webkit-scrollbar {
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-track {
      border-radius: 3px;
      background: rgba(0,0,0,0.00);
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
    }
    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background: rgba(0,0,0,0.12);
      -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.04);
    }

    .task-preview-wrapper {
      padding: 5px;
    }
  }
}

.evaluation-modal {
  display: flex;
  flex-direction: column;

  .evaluation-header {
    .my-modal-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 40px;

      .my-modal-icon {
        img {
          height: 25px;
        }
      }

      .my-modal-title {
        padding-left: 10px;
        font-family: Inter-Bold;
        color: #000000;
      }
    }
  }

  .associate-evaluation {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #D8D8D8;
    padding: 15px;
    border-radius: 6px;

    .tips-area {
      display: flex;
      justify-content: center;
      padding: 10px;
      box-sizing: border-box;
      margin-bottom: 20px;

      img {
        height: 150px;
      }
    }

    .tips {
      text-align: center;
      font-family: Inter-Bold;
      color: #000;
      margin: auto;
    }
  }

  .associate-my-content-action {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding-right: 10px;
  }
}

.task-action-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .action-item-line {
    margin: 0 25px;
    padding: 15px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 3px;

    .action-img {
      width: 230px;
    }

    .action-label {
      margin-top: 40px;
      text-align: center;

      .action-item {
        border: 1px solid rgba(21, 195, 154, 1);
        background: rgba(21, 195, 154, 0.1);
        color: rgba(21, 195, 154, 1);
        min-width: 120px;
      }
    }
  }
}

.self-field-label {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  line-height: 32px;
  padding-right: 10px;
}

.select-type-wrapper {
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .select-type {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .select-tips {
    font-family: Inter-Bold;
    line-height: 24px;
    color: #000000;
    padding: 0 10px;
  }
}

.select-button {
  padding: 0 5px;

  img {
    height: 12px;
  }

  .button-label {
    padding: 0 5px;
  }
}

.btn-icon {
  height: 18px;
}

.btn-text {
  padding: 0 5px;
}

.header-action {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;

  .header-action-item {
    padding-right: 20px;
  }
}

.self-type-wrapper {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .self-field-label {
    width: 180px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .task-type-item {
      margin-right: 10px;
      width: 33px;
      height: 33px;
      border-radius: 33px;
      border: 2px solid #ddd;
      font-weight: bold;
      display: flex;
      color: #bbb;
      align-items: center;
      justify-content: center;
    }

    .task-type-activity {
      width: 70px;
      border-radius: 50px;
    }

    .green-active-task-type {
      background: rgba(21, 195, 154, 0.1);
      border: 2px solid #15C39A;
      border-radius: 50%;
      font-weight: bold;
      color: #15C39A;
    }

    .red-active-task-type {
      background: rgba(255, 51, 85, 0.1);
      border: 2px solid #FF3355;
      border-radius: 50%;
      opacity: 1;
      font-weight: bold;
      color: #FF3355;
      opacity: 1;
    }

    .blue-active-task-type {
      background: rgb(230, 247, 255);
      border: 2px solid rgb(145, 213, 255);
      border-radius: 50px;
      opacity: 1;
      font-weight: bold;
      color: rgb(24, 144, 255);
    }
  }

  .self-type-filter {
    width: 500px;
  }
}

.subject-grade-wrapper {
  width: 600px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .select-item {
    width: 280px;
  }
}

.form-header {
  z-index: 997;
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
}

.my-full-form-wrapper {
  margin-top: 70px;
}

.my-slide-pick-modal {
  padding: 0;
  box-sizing: border-box;

  .ant-modal-body {
    background: rgba(15, 53, 56, 0.5);
    padding: 0;
    box-sizing: border-box;
  }
}

.select-slide-wrapper {
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(15, 53, 56, 1);

  .modal-title {
    font-size: 20px;
    font-family: FZCuYuan-M03S;
    font-weight: 400;
    line-height: 24px;
    color: #FFFFFF;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  .main-tips {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 500px;
    height: 250px;

    .left-img {
      height: 250px;
      display: flex;
      flex-direction: row;
      align-items: flex-end;
      width: 250px;

      img {
        width: 250px;
      }
    }

    .right-img-text {
      height: 250px;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      width: 250px;
      position: relative;

      img {
        width: 250px;
      }

      .img-text {
        position: absolute;
        font-size: 18px;
        width: 190px;
        height: 150px;
        margin: auto;
        left: 50px;
        top: 40px;
        font-family: FZCuYuan-M03S;
        font-weight: 400;
        line-height: 20px;
        color: #0F3538;
      }
    }
  }
}

.slide-action {
  padding: 25px 0 30px 0;
  background: rgba(15, 53, 56, 1);

  .slide-btn-wrapper {
    display: flex;
    justify-content: center;

    .slide-btn-item {
      margin: 0 10px;
    }

    .slide-btn-item-no {

    }

    .slide-btn-item-yes {

    }
  }
}

.pick-task-slide-wrapper {
  margin: auto;

  .slide-form-block {
  }
}

.template-tabs {
  /deep/ .ant-tabs-nav-scroll {
    margin: 0 auto;
    text-align: center;
  }

  .filter-row /deep/ .ant-tabs-nav-scroll {
    margin: 0 auto;
    text-align: left;
  }
}

.edit-in-slide {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 60px;

  .slide-switch {
    margin-left: 10px;
    height: 30px;
    font-size: 14px;
  }

  /deep/ .ant-switch-loading-icon, .ant-switch::after {
    position: absolute;
    top: 5px;
    left: 4px;
  }

  /deep/ .ant-switch-inner {
    font-size: 14px;
  }

  /deep/ .ant-switch-checked::after {
    margin-left: 40px;
  }

  /deep/ .ant-btn-round {
    height: 30px;
    padding: 0px 10px;
    font-size: 14px;
    border-radius: 32px;
  }
}

.top-icon-groups {
  position: relative;
  color: rgba(0, 0, 0, 0.65);
  background: #fff;
  height: 70px;
  padding-left: 30px;
  margin-top: 5px;

  .icon-group {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    flex-basis: auto;
    justify-content: flex-start;
    align-items: center;

    /deep/ .ant-badge-count {
      top: 10px;
      right: 12px;
    }

    .icon {
      width: 50px;
      height: 50px;
      margin: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: #fafafa;
      display: flex;
      flex-direction: column;
      font-weight: bold;
      padding: 2px;
      cursor: pointer;
      align-items: center;

      .icon-text {
        display: flex;
        font-size: 12px;
      }

      svg {
        display: flex;
        width: 32px;
        height: 32px;
      }
    }
  }

  .title-line {
    padding: 5px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .name {
      width: 70%;
      overflow-x: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      font-family: Inter-Bold;
      font-size: 15px;
      font-weight: bold;
      color: #182552;
      padding-right: 10px;
      box-sizing: border-box;
    }

    .action-item {
      display: flex;
      width: 30%;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;

      .star {
        img {
          width: 22px;
        }
      }

      .edit {
        margin-left: 15px;

        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;

          .edit-icon {
            padding-left: 5px;
            width: 18px;
          }
        }
      }
    }
  }
}

.slide-select-wrapper {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  width: 100%;

  .slide-recommend {
    width: 600px;
    padding: 0 20px;
    box-sizing: border-box;
  }

  /deep/ .ant-carousel .slick-slide img {
    width: 100%;
    border: 2px solid #15C39A;
  }

  /deep/ .ant-carousel {
    .custom-slick-arrow:before {
      display: none;
    }

    .custom-slick-arrow:hover {
      opacity: 0.5;
    }

    .slick-slide h3 {
      color: #fff;
    }

    .anticon {
      color: fade(@black, 45%);
      svg {
        font-size: 25px;
      }
    }
  }
}

.slide-preview-list {
  max-height: 1000px;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  /deep/ .ant-carousel {
    .slick-slide {
      text-align: center;
      height: 200px;
      line-height: 200px;
      background: #364d79;
      overflow: hidden;
    }

    .slick-slide img {
      width: 400px;
    }

    custom-slick-arrow {
      width: 25px;
      height: 25px;
      font-size: 25px;
      color: #fff;
      background-color: rgba(31, 45, 61, 0.11);
      opacity: 0.3;
    }

    .custom-slick-arrow:before {
      display: none;
    }

    .custom-slick-arrow:hover {
      opacity: 0.5;
    }

    .slick-slide h3 {
      color: #fff;
    }

    .anticon {
      color: fade(@black, 45%);
      font-size: 25px;
    }
  }

  .slide-preview-item {
    position: relative;
    margin: 15px;
    width: 400px;

    .template-hover-action-mask {
      display: none;
      z-index: 100;
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);

      .template-hover-action {
        width: 100%;
        top: 30%
      }

      .action-item {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 6px 13px;
        background: rgba(0, 0, 0, 0.45);
        opacity: 1;
        border: 1px solid rgba(188, 188, 188, 1);
      }

      .template-hover-action {
        position: absolute;
      }
    }

    &:hover {
      .template-hover-action-mask {
        display: block;
      }
    }

  }

  .slide-desc {
    width: 70%;
    max-height: 50px;
    margin: 0 auto 10px;
    overflow: hidden;
  }
}

.recommend-loading {
  min-height: 200px;
  margin-top: 200px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.question-options {
  width: 100%;
  display: block;
  font-size: 18px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #11142D;
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

.edit-slide {
  display: flex;
  align-items: center;

  img {
    margin-right: 5px;
  }
}

.no-data-slide-form-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .go-to-create {
    margin-top: 10px;
  }
}

/deep/ .ant-breadcrumb > span:last-child {
  color: rgba(0, 0, 0, 0.45);
}

.page-info {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background: #E4E4E4;
  padding: 1px 10px;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  align-items: center;

  .page-num-tag {
    display: inline;
    background: rgba(228, 228, 228, 0.5);
    padding: 1px 10px;
    border-radius: 16px;
    font-size: 8px;
    font-family: Segoe UI;
    font-weight: 400;
    color: #808191;
  }
}

.carousel-page {
  display: flex;
  height: 110px;
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.00);
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.03);
  }

  /* 滚动条滑块 */

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.06);
    -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.04);
  }

  .img-list-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;

    .img-list {
      margin-right: -10px;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;

      .img-item {
        height: 80px;
        border: 2px solid #fff;
        box-shadow: 0 4px 8px 0 rgba(31, 33, 44, 10%);
        margin-right: 10px;

        img {
          height: 100%;
        }
      }

      .img-item:nth-last-child(1) {
        margin-right: 0;
      }

      .active-img-item {
        border: 2px solid #15C39A;
        box-shadow: 0 0 3px 3px #15C39A1A;
      }
    }
  }
}

.template-selected {
  overflow-y: auto;
  background: rgba(228, 228, 228, 0.2);
  border: 1px solid #D8D8D8;
  opacity: 1;
  border-radius: 4px;
  padding: 20px;
  max-height: 500px;

  .template-list {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;

    .template-item {
      background-size: cover;
      margin-right: 1%;
      margin-left: 1%;
      margin-bottom: 20px;
      box-sizing: border-box;
      width: 45%;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      background: #FFFFFF;
      border: 1px solid #E8E8E8;
      border-radius: 4px;
      position: relative;

      .template-select-icon {
        z-index: 50;
        position: absolute;
        user-select: none;
        right: 5px;
        top: 5px;

        img {
          height: 18px;
          user-select: none;
        }
      }

      .template-cover {
        background-size: 100% 100%;
        height: 150px;
        border-radius: 4px;
        width: 100%;
        background-color: #ddd;
        box-sizing: border-box;
        padding: 0;
      }

      .template-info {
        padding: 10px;
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: flex-start;

        .template-name {
          font-weight: 500;
          font-size: 14px;
          z-index: 10;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          padding: 10px 0;
          min-height: 40px;
        }

        .template-intro {
          min-height: 30px;
          z-index: 10;
          padding: 5px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          color: rgba(0, 0, 0, .45);
          font-size: 12px;
          background: rgba(244, 244, 244, 0.5);
          border-radius: 4px;
          font-family: Inter-Bold;
          color: #000000;
        }
      }

      .template-hover-action-mask {
        display: none;
        z-index: 100;
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);

        .template-hover-action {
          width: 100%;
          top: 30%
        }

        .action-item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px 13px;
          background: rgba(0, 0, 0, 0.45);
          opacity: 1;
          border: 1px solid rgba(188, 188, 188, 1);
        }

        .template-hover-action {
          position: absolute;
        }
      }

      &:hover {
        .template-hover-action-mask {
          display: block;
        }
      }
    }

    .template-item-active {
      border: 1px solid #15C39A;
      box-shadow: 0px 3px 6px rgba(21, 195, 154, 0.16);
      opacity: 1;
    }
  }
}

.recommend-slide-name {
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 40px;
  font-family: Inter-Bold;
  font-weight: 500;
  color: #333;
}

.slide-animate-cover {
  width: 400px;
  height: 200px;
  position: fixed;
  transition: transform .6s;
  transform: translateX(0px);
  z-index: 10000;
}

.slide-animate-cover > img {
  transform: translateY(0px);
  transform: scale(1);
  width: 400px;
  height: 200px;
  transition: transform .6s;
  z-index: 10000;
}

.slide-animate-cover {
  transition-timing-function: linear;
  opacity: 0.8;
  z-index: 10000;
}

.slide-animate-cover > img {
  transition-timing-function: cubic-bezier(.55, 0, .85, .36);
  outline: 1px solid #D8D8D8;
  z-index: 10000;
}

.plugin-tags {
  height: 100px;
  overflow-y: auto;
  background-color: #F7F7F7;
  font-size: 12px;
  padding-left: 15px;
  font-family: Segoe UI;

  .tag-row {
    margin: 5px;

    .tag-item {
      margin-right: 15px;
    }
  }

  .tag-title {
    font-weight: 400;
    line-height: 0px;
    color: #808191;
    opacity: 1;
  }

  .tag-value {
    margin-left: 10px;
    //max-width: 200px;
  }
}

.drawer-wrapper-row {

  .drawer-template-selected {
    overflow-y: auto;
    //background: rgba(228, 228, 228, 0.2);
    border: 1px solid #D8D8D8;
    opacity: 1;
    border-radius: 4px;
    padding: 10px;
    height: auto;

    .drawer-template-list {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      flex-wrap: wrap;

      .template-item {
        background-size: cover;
        margin: 0px 5px;
        margin-bottom: 20px;
        box-sizing: border-box;
        width: 100%;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        background: #FFFFFF;
        border: 1px solid #E8E8E8;
        border-radius: 4px;
        position: relative;

        .template-select-icon {
          z-index: 50;
          position: absolute;
          user-select: none;
          right: 5px;
          bottom: 5px;

          img {
            user-select: none;
            height: 18px;
          }
        }

        .template-cover {
          background-size: 100% 100%;
          height: 150px;
          border-radius: 4px;
          width: 100%;
          background-color: #ddd;
          box-sizing: border-box;
          padding: 0;
        }

        .template-info {
          padding: 10px;
          display: flex;
          position: relative;
          flex-direction: column;
          justify-content: flex-start;

          .template-name {
            font-weight: 500;
            font-size: 14px;
            z-index: 10;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
            padding: 10px 0;
            min-height: 40px;
          }

          .template-intro {
            min-height: 30px;
            z-index: 10;
            padding: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            word-break: break-all;
            color: rgba(0, 0, 0, .45);
            font-size: 12px;
            background: rgba(244, 244, 244, 0.5);
            border-radius: 4px;
            font-family: Inter-Bold;
            color: #000000;
          }
        }

        .template-hover-action-mask {
          display: none;
          z-index: 100;
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);

          .template-hover-action {
            width: 100%;
            top: 30%
          }

          .action-item {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px 13px;
            background: rgba(0, 0, 0, 0.45);
            opacity: 1;
            border: 1px solid rgba(188, 188, 188, 1);
          }

          .template-hover-action {
            position: absolute;
          }
        }

        &:hover {
          .template-hover-action-mask {
            display: block;
          }
        }
      }

      .template-item-active {
        border: 1px solid #15C39A;
        box-shadow: 0px 3px 6px rgba(21, 195, 154, 0.16);
        opacity: 1;
      }
    }
  }

}

.drawer-action {
  position: absolute;
  z-index: 9999;
  bottom: 0px;
  width: 100%;
  border-top: 1px solid rgb(232, 232, 232);
  padding: 10px 16px;
  text-align: left;
  left: 0px;
  background: rgb(255, 255, 255);
  border-radius: 0px 0px 4px 4px;
}

.sub-task-save {
  padding-top: 15px;
  padding-right: 15px;
  text-align: right;
  background: #38cfa611;

  .sub-task-save-action {
    height: 50px;
  }
}

.btn-icon {
  height: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  img {
    height: 15px;
    width: 15px;
  }
}

.assessments-tabs {
  /deep/ .ant-tabs-nav-scroll {
    text-align: left;
  }
}

.form-block-label {
  font-family: Inter-Bold;
  line-height: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .label-text {
    padding: 0 5px;
  }
}

.material-list {
  margin-top: 10px;
}

.material-icon {
  height: 35px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.delete-icon {
  width: 35px;
}

.my-steps-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 8px;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  line-height: 32px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 32px;
  transition: background-color 0.3s, border-color 0.3s;
  color: rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

.my-active-steps-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 8px;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  line-height: 32px;
  text-align: center;
  border: 1px solid #15c39a;
  border-radius: 32px;
  transition: background-color 0.3s, border-color 0.3s;
  color: #fff;
  background: #15c39a;
  cursor: pointer;
}

.ant-steps-item-wait {
  &:hover {
    .my-steps-item-icon {
      border-color: #15c39a;
      color: #15c39a;
    }
  }
}

.sub-task-tag-wrapper {
  padding-top: 550px;
}

.thumbnail-task-item {
  padding: 5px 10px;
  background: #38cfa611;
}

.linked-class-list {
  padding: 10px 10px 0 10px;
  cursor: pointer;
  border: 1px dashed #15c39a;
  margin-bottom: 15px;
  position: relative;

  .mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    background: rgba(0,0,0, 0.07);
  }

  .remove-class-icon {
    position: absolute;
    right: -25px;
    top: 0;
    width: 25px;
    height: 100%;
    display: none;
    text-align: center;
    img {
      width: 30px;
    }
  }

  .class-type-tag {
    position: absolute;
    right: 10px;
    top: 44px;
    text-align: center;
    z-index: 150;
  }

  &:hover {
    .remove-class-icon {
      display: block;
    }
  }
}

.class-schedule-detail {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  line-height: 40px;
  height: 40px;
}

.my-switch {
  line-height: 32px;
}

.range-time {
  margin-left: 10px;
  min-width: 450px;
  position: relative;

  .week-time {
    position: absolute;
    top: -35px;
    right: 90px;
  }
}

.form-item {
  padding-left: 10px;
}

.add-class {
  margin-bottom: 15px;
}

.link-class-tips {
  color: #999;
  font-size: 12px;
  line-height: 30px;
}

.add-material {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  position: relative;
}

.my-add-material {
  height: 44px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.step-1 {
  position: relative;

  .mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.07);
  }
}

.common-link-wrapper {
  padding-top: 40px;
}

.url-error-tips {
  color: #ff4d4f;
  font-size: 13px;
}

.add-material-item {
  height: 30px;
  line-height: 30px;
  svg {
    cursor: pointer;
    width: 20px;
  }
}

.dont-remind-me {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: #fff;
  line-height: 30px;
}

/deep/ .ant-steps-item-content {
  overflow: visible;
  margin-left: 50px;
}

.material-list-block {
  margin-top: 20px;
}

.image-preview {
  position: relative;

  img {
    width: 100%;
    height: auto;
  }

  .upload-text-mask {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);

    .upload-text {
      width: 200px;
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -100px;
      margin-top: -20px;
    }
  }

  &:hover {
    .upload-text-mask {
      display: block;
    }
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

  .task-select-template {
    margin-left: 10px;
    margin-right: 10px;
  }
}

.form-block-title {
  font-size: @font-size-lg;
  color: #000;
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

.img-wrapper {
  position: relative;
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

.slide-select-and-preview {
  display: flex;
  width: 100%;

  .slide-select-action {
    height: 400px;
    width: 600px;

    img {
      width: 100%
    }
  }

  .slide-preview {
    position: relative;
    padding: 0 35px;

    .slide-hover-action-mask {
      display: none;
      z-index: 100;
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);

      .slide-hover-action {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 500px;
        margin-top: -30px;
        margin-left: -250px;

        .update-select-slide {

        }
      }
    }

    &:hover {
      .slide-hover-action-mask {
        display: block;
      }
    }
  }
}
</style>
