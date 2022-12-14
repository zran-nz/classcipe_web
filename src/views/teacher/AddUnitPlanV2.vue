<template>
  <div class='my-full-form-wrapper'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='Create unit'
          :form='form'
          :spin='saving'
          :share-status='shareStatus'
          :collaborate='collaborate'
          :last-change-saved-time='lastChangeSavedTime'
          :needConfirm="true"
          @view-collaborate='handleViewCollaborate'
          @save='save'
          @share='handleShareUnitPlan'
          @publish='handlePublishUnitPlan'
          @collaborate='handleStartCollaborate'>
          <template v-slot:right>
          </template>
        </form-header>
      </template>
      <template v-slot:nav>
        <my-vertical-steps
          ref='steps-nav'
          :steps='formSteps'
          :step-index='currentActiveStepIndex'
          @step-change='handleStepChange' />
      </template>
    </fixed-form-header>
    <div class='form-content'>
      <div class='step-content' v-if='!contentLoading'>
        <div class='form-body root-locate-form' id='form-body' :style="{ width: formBodyWidth }" v-show="formBodyWidth !== '0%'">
          <div
            class='form-page-item'
            v-show='currentActiveStepIndex === stepIndex'
            v-for='(step, stepIndex) in formSteps'
            :key='step.id'>
            <template v-for='fieldItem in $store.getters.formConfigData.planCommonList'>
              <div class='form-field-item' :style="fieldItem.fieldName === planField.LearnOuts?'height:100%;':''" v-if='fieldItem.visible && !["yearList", "subjectList"].includes(fieldItem.fieldName) && step.commonFields.indexOf(fieldItem.fieldName) !== -1' :key='fieldItem.id'>
                <div
                  v-if='fieldItem.visible && fieldItem.fieldName === planField.Name'
                  class='form-block tag-content-block'
                  :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="unitPlanId" :fieldName=planField.Name />
                  <custom-form-item :required='emptyRequiredFields.indexOf(planField.Name) !== -1' :required-field='requiredFields.indexOf(planField.Name) !== -1'>
                    <template slot='label'>
                      {{ 'Unit Name' | unitLabelName(planField.Name, $store.getters.formConfigData) }}
                    </template>
                    <template slot='action'>
                      <a-space>
                        <comment-switch
                          v-show="canEdit"
                          :is-active="currentFieldName === planField.Name"
                          :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === planField.Name}"
                          :field-name='planField.Name'
                          @switch='handleSwitchComment'/>
                      </a-space>
                    </template>
                    <template v-if='unitFieldLabel(planField.Name, $store.getters.formConfigData) && unitFieldLabel(planField.Name, $store.getters.formConfigData) !== unitLabelName(planField.Name, $store.getters.formConfigData)' slot='tips'>
                      <a-tooltip :title="unitFieldLabel(planField.Name, $store.getters.formConfigData)" placement='top'>
                        <a-icon type="info-circle" />
                      </a-tooltip>
                    </template>
                    <a-input v-model='form.name' :placeholder='unitLabelHint(planField.Name, $store.getters.formConfigData)' class='cc-form-input' @change="handleCollaborateEvent(unitPlanId,planField.Name,form.name)" :disabled="!canEdit" />
                  </custom-form-item>
                </div>
                <div
                  v-else-if='(fieldItem.visible || form[fieldItem.fieldName]) && fieldItem.fieldName === planField.Overview'
                  class='form-block tag-content-block'
                  id='overview'
                  :class="{'third-hidden-data': !fieldItem.visible && form[fieldItem.fieldName] && isCopyContent}"
                  :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="unitPlanId" :fieldName=planField.Overview />
                  <custom-form-item ref='overview' :required='emptyRequiredFields.indexOf(planField.Overview) !== -1' :required-field='requiredFields.indexOf(planField.Overview) !== -1'>
                    <template slot='label'>
                      {{ 'Overview' | unitLabelName(planField.Overview, $store.getters.formConfigData) }}
                    </template>
                    <template slot='action'>
                      <a-space>
                        <comment-switch
                          v-show="canEdit"
                          :field-name='planField.Overview'
                          :is-active="currentFieldName === planField.Overview"
                          @switch='handleSwitchComment'
                          :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === planField.Overview}" />
                      </a-space>
                    </template>
                    <template v-if='unitFieldLabel(planField.Overview, $store.getters.formConfigData) && unitFieldLabel(planField.Overview, $store.getters.formConfigData) !== unitLabelName(planField.Overview, $store.getters.formConfigData)' slot='tips'>
                      <a-tooltip :title="unitFieldLabel(planField.Overview, $store.getters.formConfigData)" placement='top'>
                        <a-icon type="info-circle" />
                      </a-tooltip>
                    </template>
                    <a-textarea
                      :auto-size="{ minRows: 2, maxRows: 6 }"
                      v-model='form.overview'
                      :placeholder='unitLabelHint(planField.Overview, $store.getters.formConfigData)'
                      class='cc-form-textarea'
                      allow-clear
                      @change="handleCollaborateEvent(unitPlanId,planField.Overview,form.overview)"
                      :disabled="!canEdit"/>
                  </custom-form-item>
                  <div class='close-hidden-value' v-if='!fieldItem.visible && form[fieldItem.fieldName] && canEdit'>
                    <a-popconfirm title="Delete?" ok-text="Yes" @confirm="form[fieldItem.fieldName] = ''" cancel-text="No">
                      <delete-icon color='#F16A39' />
                    </a-popconfirm>
                  </div>
                </div>

                <div
                  v-else-if='(fieldItem.visible || form[fieldItem.fieldName] !== null) && fieldItem.fieldName === planField.ProjectBased'
                  class='form-block form-radio-wrapper tag-content-block'
                  :class="{'third-hidden-data': !fieldItem.visible && form[fieldItem.fieldName] !== null && isCopyContent}"
                  :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="unitPlanId" :fieldName=planField.ProjectBased style="top:-30px" />
                  <custom-form-item :required='emptyRequiredFields.indexOf(planField.ProjectBased) !== -1' :required-field='requiredFields.indexOf(planField.ProjectBased) !== -1'>
                    <template slot='label'>
                      {{ 'Project-based Unit' | unitLabelName(planField.ProjectBased, $store.getters.formConfigData) }}
                    </template>
                    <template slot='action'>
                      <a-space>
                        <comment-switch
                          v-show="canEdit"
                          :field-name='planField.ProjectBased'
                          :is-active="currentFieldName === planField.ProjectBased"
                          @switch='handleSwitchComment'
                          :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === planField.ProjectBased}"
                        />
                      </a-space>
                    </template>
                    <template v-if='unitFieldLabel(planField.ProjectBased, $store.getters.formConfigData) && unitFieldLabel(planField.ProjectBased, $store.getters.formConfigData) !== unitLabelName(planField.ProjectBased, $store.getters.formConfigData)' slot='tips'>
                      <a-tooltip :title="unitFieldLabel(planField.ProjectBased, $store.getters.formConfigData)" placement='top'>
                        <a-icon type="info-circle" />
                      </a-tooltip>
                    </template>
                    <custom-radio-button-group
                      :list="[ {name: 'Yes', value: 1}, {name: 'No', value: 0}]"
                      :disabled='!canEdit'
                      :value.sync='form.projectBased'
                      @change="handleCollaborateEvent(unitPlanId,planField.ProjectBased,form.projectBased)" >
                    </custom-radio-button-group>
                  </custom-form-item>
                  <div class='close-hidden-value' v-if='!fieldItem.visible && form[fieldItem.fieldName] && canEdit'>
                    <a-popconfirm title="Delete?" ok-text="Yes" @confirm="form[fieldItem.fieldName] = null" cancel-text="No">
                      <delete-icon color='#F16A39' />
                    </a-popconfirm>
                  </div>
                </div>

                <div
                  v-else-if='(fieldItem.visible || form[fieldItem.fieldName] !== null) && fieldItem.fieldName === planField.UnitType'
                  class='form-block form-radio-wrapper tag-content-block'
                  :class="{'third-hidden-data': !fieldItem.visible && form[fieldItem.fieldName] !== null && isCopyContent}"
                  :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="unitPlanId" :fieldName=planField.UnitType style="top:-30px"/>
                  <custom-form-item :required='emptyRequiredFields.indexOf(planField.UnitType) !== -1' :required-field='requiredFields.indexOf(planField.UnitType) !== -1'>
                    <template slot='label'>
                      {{ 'Unit type' | unitLabelName(planField.UnitType, $store.getters.formConfigData) }}
                    </template>
                    <template slot='action'>
                      <a-space>
                        <comment-switch
                          v-show="canEdit"
                          :field-name='planField.UnitType'
                          :is-active="currentFieldName === planField.UnitType"
                          @switch='handleSwitchComment'
                          :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === planField.UnitType}" />
                      </a-space>
                    </template>
                    <template v-if='unitFieldLabel(planField.UnitType, $store.getters.formConfigData) && unitFieldLabel(planField.UnitType, $store.getters.formConfigData) !== unitLabelName(planField.UnitType, $store.getters.formConfigData)' slot='tips'>
                      <a-tooltip :title="unitFieldLabel(planField.UnitType, $store.getters.formConfigData)" placement='top'>
                        <a-icon type="info-circle" />
                      </a-tooltip>
                    </template>
                    <custom-radio-button-group
                      :list="[ {name: 'Single-subject Unit', value: 0}, {name: 'Integrated Unit', value: 1}]"
                      :disabled='!canEdit'
                      :value.sync='form.unitType'
                      @change="handleCollaborateEvent(unitPlanId,planField.UnitType,form.unitType)" >
                    </custom-radio-button-group>
                  </custom-form-item>
                  <div class='close-hidden-value' v-if='!fieldItem.visible && form[fieldItem.fieldName] && canEdit'>
                    <a-popconfirm title="Delete?" ok-text="Yes" @confirm="form[fieldItem.fieldName] = null" cancel-text="No">
                      <delete-icon color='#F16A39' />
                    </a-popconfirm>
                  </div>
                </div>
                <template v-else-if="fieldItem.visible && fieldItem.fieldName === planField.Inquiry">
                  <div
                    id='inquiry'
                    class='form-block tag-content-block'
                    :key='fieldItem.fieldName'>
                    <collaborate-tooltip :form-id="unitPlanId" :field-name='planField.Inquiry'/>
                    <custom-form-item :required='emptyRequiredFields.indexOf(planField.Inquiry) !== -1' :required-field='requiredFields.indexOf(planField.Inquiry) !== -1'>
                      <template slot='label'>
                        {{ 'Big Idea/ Statement of Inquiry/ Central Idea' | unitLabelName(planField.Inquiry, $store.getters.formConfigData) }}
                      </template>
                      <template slot='action'>
                        <a-space>
                          <comment-switch
                            v-show="canEdit"
                            :is-active="currentFieldName === planField.Inquiry"
                            :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === planField.Inquiry}"
                            :field-name='planField.Inquiry'
                            @switch='handleSwitchComment' />
                        </a-space>
                      </template>
                      <template v-if='unitFieldLabel(planField.Inquiry, $store.getters.formConfigData) && unitFieldLabel(planField.Inquiry, $store.getters.formConfigData) !== unitLabelName(planField.Inquiry, $store.getters.formConfigData)' slot='tips'>
                        <a-tooltip :title="unitFieldLabel(planField.Inquiry, $store.getters.formConfigData)" placement='top'>
                          <a-icon type="info-circle" />
                        </a-tooltip>
                      </template>
                      <a-textarea
                        v-model='form.inquiry'
                        :placeholder="unitLabelHint(planField.Inquiry, $store.getters.formConfigData)"
                        :auto-size="{ minRows: 2, maxRows: 6 }"
                        class='cc-form-textarea'
                        v-selectPopover="['ideaKeywords', setIdeaKeywords, 'inquiryKeywords', false]"
                        @change="handleCollaborateEvent(unitPlanId,planField.Inquiry,form.inquiry)"
                        :disabled="!canEdit" />
                    </custom-form-item>
                    <a-tooltip title='Browse' @click.stop='selectBigIdeaDataVisible=true' v-if="canEdit">
                      <span class='browse'>
                        <a-icon theme='twoTone' twoToneColor='rgba(21, 195, 154, 1)' type='appstore' />
                      </span>
                    </a-tooltip>
                  </div>
                  <div
                    id='inquiry-keyword'
                    class='form-block tag-content-block'
                    :key='fieldItem.fieldName + "keyword"'>
                    <custom-form-item :required='false' :required-field='requiredFields.indexOf(planField.InquiryKeywords) !== -1'>
                      <template slot='label'>
                        {{ 'Key words' }}
                      </template>
                      <template slot='action'>
                      </template>
                      <template slot='tips'>
                        <a-tooltip title="Set key words by selecting the words" placement='top'>
                          <a-icon type="info-circle" />
                        </a-tooltip>
                      </template>
                      <div class="inquiry-keyword-con" v-if="form.inquiryKeywords && form.inquiryKeywords.length > 0">
                        <div
                          class="inquiry-keyword-item"
                          v-for="(tag, tagIndex) in form.inquiryKeywords"
                          :key="'inquery_keyword_'+tagIndex"
                        >
                          <a-tag color="#a5a5a5" :closable="canEdit" @close="handleRmInquiryKey(form, 'inquiryKeywords', tagIndex)">{{ tag }}</a-tag>
                        </div>
                      </div>
                      <div v-else style="font-size: 12px;color: #666;">No data</div>
                      <inquiry-input :selected='form.inquiryKeywords' @add='(item) => form.inquiryKeywords.push(item)' :can-edit='canEdit' />
                    </custom-form-item>
                  </div>
                </template>
                <div v-else-if="fieldItem.visible && fieldItem.fieldName === planField.LearnOuts" class='tag-content-block' style="height:100%;margin:0 -30px;" :key='fieldItem.fieldName'>
                  <iframe style="width:100%;height:100%;" :src="`/v2/com/task/outline/${unitPlanId}?header=0&token=${token}`" frameborder="0"></iframe>
                  <!-- <collaborate-tooltip :form-id="unitPlanId" :fieldName=planField.Assessment style="left:100px" />
                  <custom-form-item :required='emptyRequiredFields.indexOf(planField.LearnOuts) !== -1' :required-field='requiredFields.indexOf(planField.LearnOuts) !== -1'>
                    <template slot='label'>
                      {{ 'Learning objectives' | unitLabelName(planField.LearnOuts, $store.getters.formConfigData) }}
                    </template>
                    <learning-objective
                      @change='handleUpdateLearningObjectives'
                      :curriculumId='form.curriculumId'
                      :learning-objectives='form.learnOuts'
                      :subject-list='form.subjectList'
                      :year-list='form.yearList'
                      :can-edit='canEdit'
                      :language-list='form.languageList' />
                  </custom-form-item> -->
                </div>
                <div
                  v-else-if="(fieldItem.visible || (form[fieldItem.fieldName] && form[fieldItem.fieldName].length)) && fieldItem.fieldName === planField.Scenarios"
                  class='form-block tag-content-block'
                  :class="{'third-hidden-data': !fieldItem.visible && form[fieldItem.fieldName] && form[fieldItem.fieldName].length && isCopyContent}"
                  :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="unitPlanId" :fieldName=planField.Sdg />
                  <custom-form-item :required='emptyRequiredFields.indexOf(planField.Sdg) !== -1' :required-field='requiredFields.indexOf(planField.Sdg) !== -1'>
                    <template slot='label'>
                      {{ 'UN Sustainable Development Goal(s)' | unitLabelName(planField.Scenarios, $store.getters.formConfigData) }}
                    </template>
                    <template slot='action'>
                      <a-space>
                        <comment-switch
                          v-show="canEdit"
                          :is-active="currentFieldName === planField.Sdg"
                          :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === planField.Sdg}"
                          :field-name='planField.Sdg'
                          @switch='handleSwitchComment' />
                        <plus-icon @click='handleAddMoreSdg' v-if='canEdit'/>
                      </a-space>
                    </template>
                    <template v-if='unitFieldLabel(planField.Scenarios, $store.getters.formConfigData) && unitFieldLabel(planField.Scenarios, $store.getters.formConfigData) !== unitLabelName(planField.Scenarios, $store.getters.formConfigData)' slot='tips'>
                      <a-tooltip :title="unitFieldLabel(planField.Scenarios, $store.getters.formConfigData)" placement='top'>
                        <a-icon type="info-circle" />
                      </a-tooltip>
                    </template>
                    <div
                      v-for='(scenario, sdgIndex) in form.scenarios'
                      id='sdg'
                      :key='sdgIndex'
                      class='sdg-form-block'
                    >
                      <!--description-->
                      <div class='scenario-description'>
                        <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDeleteSdg(sdgIndex)" cancel-text="No" v-show='form.scenarios.length > 1 && canEdit'>
                          <span class="delete-action" >
                            <a-icon :style="{ fontSize: '14px', color: 'red' }" type='delete' />
                          </span>
                        </a-popconfirm>
                        <!--sdg-->
                        <custom-form-item :show-label='false' :required-field='requiredFields.indexOf(planField.scenarios) !== -1'>
                          <a-select
                            :getPopupContainer="trigger => trigger.parentElement"
                            v-model='scenario.sdgId'
                            @change="handleCollaborateEvent(unitPlanId,planField.Sdg,form.sdg)"
                            class='cc-select'
                            :placeholder='unitLabelHint(planField.Scenarios, $store.getters.formConfigData)'
                            :disabled="!canEdit">
                            <a-select-option
                              v-for='(sdg,index) in sdgList'
                              :key='index'
                              :disabled='selectedSdg.indexOf(sdg.id) != -1'
                              :value='sdg.id'>
                              {{ sdg.name }}
                            </a-select-option>
                          </a-select>
                        </custom-form-item>
                      </div>
                    </div>
                  </custom-form-item>
                  <div class='close-hidden-value' v-if='!fieldItem.visible && form[fieldItem.fieldName] && form[fieldItem.fieldName].length && canEdit'>
                    <a-popconfirm title="Delete?" ok-text="Yes" @confirm="form[fieldItem.fieldName] = []" cancel-text="No">
                      <delete-icon color='#F16A39' />
                    </a-popconfirm>
                  </div>
                </div>
                <div
                  v-else-if="(fieldItem.visible || form[fieldItem.fieldName]) && fieldItem.fieldName === planField.Rwc"
                  class='form-block form-block-rwc tag-content-block'
                  :class="{'third-hidden-data': !fieldItem.visible && form[fieldItem.fieldName] && isCopyContent}"
                  :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="unitPlanId" :fieldName=planField.Rwc />
                  <custom-form-item :required='emptyRequiredFields.indexOf(planField.Rwc) !== -1' :required-field='requiredFields.indexOf(planField.Rwc) !== -1'>
                    <template slot='label'>
                      {{ 'Real World Connection(s)' | unitLabelName(planField.Rwc, $store.getters.formConfigData) }}
                    </template>
                    <template v-if='unitFieldLabel(planField.Rwc, $store.getters.formConfigData) && unitLabelName(planField.Rwc, $store.getters.formConfigData) !== unitFieldLabel(planField.Rwc, $store.getters.formConfigData)' slot='tips'>
                      <a-tooltip :title="unitFieldLabel(planField.Rwc, $store.getters.formConfigData)" placement='top'>
                        <a-icon type="info-circle" />
                      </a-tooltip>
                    </template>
                    <a-select
                      :getPopupContainer="trigger => trigger.parentElement"
                      v-model='form.rwc'
                      class='cc-select'
                      :placeholder='unitLabelHint(planField.Rwc, $store.getters.formConfigData)'
                      @change="handleCollaborateEvent(unitPlanId,planField.Rwc,form.rwc)"
                      :disabled="!canEdit" >
                      <a-select-option :value='item.id' v-for='(item, index) in rwcList' :key='index'>
                        {{ item.name }}
                      </a-select-option>
                    </a-select>
                  </custom-form-item>
                  <div class='close-hidden-value' v-if='!fieldItem.visible && form[fieldItem.fieldName] && canEdit'>
                    <a-popconfirm title="Delete?" ok-text="Yes" @confirm="form[fieldItem.fieldName] = ''" cancel-text="No">
                      <delete-icon color='#F16A39' />
                    </a-popconfirm>
                  </div>
                </div>
                <div
                  v-else-if="fieldItem.visible && fieldItem.fieldName === planField.Question"
                  :class="{'form-block': true, 'form-block-disabled' : $store.getters.userInfo.disableQuestion, 'tag-content-block': true}"
                  :key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="unitPlanId" :fieldName=planField.Question />
                  <custom-form-item class='unit-question' :required='emptyRequiredFields.indexOf(planField.Question) !== -1' :required-field='requiredFields.indexOf(planField.Question) !== -1'>
                    <template slot='label'>
                      {{ 'Key question(s) / Line(s) of inquiry' | unitLabelName(planField.Question, $store.getters.formConfigData) }}
                    </template>
                    <template slot='action'>
                      <a-space>
                        <comment-switch
                          v-show="canEdit"
                          v-if='!$store.getters.userInfo.disableQuestion'
                          :is-active="currentFieldName === planField.Question"
                          :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === planField.Question}"
                          :field-name='planField.Question'
                          @switch='handleSwitchComment' />
                        <custom-link-text text='Recommend' :size='13' @click='questionMoreVisible=true' v-if='canEdit'></custom-link-text>
                      </a-space>
                    </template>
                    <template v-if='unitFieldLabel(planField.Question, $store.getters.formConfigData) && unitLabelName(planField.Question, $store.getters.formConfigData) !== unitFieldLabel(planField.Question, $store.getters.formConfigData)' slot='tips'>
                      <a-tooltip :title="unitFieldLabel(planField.Question, $store.getters.formConfigData)" placement='top'>
                        <a-icon type="info-circle" />
                      </a-tooltip>
                    </template>
                    <div v-if='!$store.getters.userInfo.disableQuestion' style='position: relative'>
                      <question-input
                        :list='recommendQuestionList'
                        :can-edit='canEdit'
                        :selected='form.questions'
                        :height='100'
                        @update='handleUpdateQuestion'
                        :placeholder='taskLabelHint(planField.Question, $store.getters.formConfigData) || "Search key question(s)"'
                      />
                    </div>
                  </custom-form-item>
                </div>
                <div v-else-if="fieldItem.visible && fieldItem.fieldName === planField.Prior" class='form-block tag-content-block' style='clear:both':key='fieldItem.fieldName'>
                  <collaborate-tooltip :form-id="unitPlanId" :fieldName=planField.Prior />
                  <custom-form-item :required='emptyRequiredFields.indexOf(planField.Prior) !== -1' :required-field='requiredFields.indexOf(planField.Prior) !== -1'>
                    <template slot='label'>
                      {{ 'Prior learning experience' | unitLabelName(planField.Prior, $store.getters.formConfigData) }}
                    </template>
                    <template slot='action'>
                      <a-space>
                        <comment-switch
                          v-show="canEdit"
                          :is-active="currentFieldName === planField.Prior"
                          :class="{'my-comment-switch':true,'my-comment-show':currentFieldName === planField.Prior}"
                          :field-name='planField.Prior'
                          @switch='handleSwitchComment' />
                      </a-space>
                    </template>
                    <template v-if='unitFieldLabel(planField.Prior, $store.getters.formConfigData) && unitFieldLabel(planField.Prior, $store.getters.formConfigData) !== unitLabelName(planField.Prior, $store.getters.formConfigData)' slot='tips'>
                      <a-tooltip :title="unitFieldLabel(planField.Prior, $store.getters.formConfigData)" placement='top'>
                        <a-icon type="info-circle" />
                      </a-tooltip>
                    </template>
                    <a-textarea
                      v-model='form.prior'
                      allow-clear
                      auto-size
                      :placeholder='unitLabelHint(planField.Prior, $store.getters.formConfigData)'
                      @change="handleCollaborateEvent(unitPlanId,planField.Prior,form.prior)"
                      :disabled="!canEdit" />
                  </custom-form-item>
                </div>

                <div v-else-if='fieldItem.visible && fieldItem.fieldName === planField.Link' class='form-block tag-content-block' :key='fieldItem.fieldName'>
                  <div class='form-block'>
                    <unit-linked-content :can-edit='canEdit' :from-id='unitPlanId' @update-task-id-list='updateTaskIdList' />
                  </div>
                </div>

                <div v-else-if='fieldItem.visible && fieldItem.fieldName === planField.Image' class='form-block' :key='fieldItem.fieldName'>
                  <!-- image-->
                  <custom-form-item class='img-wrapper' :required='emptyRequiredFields.indexOf(planField.Image) !== -1' :required-field='requiredFields.indexOf(planField.Image) !== -1'>
                    <template slot='label'>
                      {{ 'Cover' | unitLabelName(planField.Image, $store.getters.formConfigData) }}
                    </template>
                    <template v-if='unitFieldLabel(planField.Image, $store.getters.formConfigData) && unitLabelName(planField.Image, $store.getters.formConfigData) !== unitFieldLabel(planField.Image, $store.getters.formConfigData)' slot='tips'>
                      <a-tooltip :title="'Cover' | unitFieldLabel(planField.Image, $store.getters.formConfigData)" placement='top'>
                        <a-icon type="info-circle" />
                      </a-tooltip>
                    </template>
                    <custom-image-uploader
                      :field='planField.Image'
                      :can-edit='canEdit'
                      :content-id='unitPlanId'
                      :content-type='contentType["unit-plan"]'
                      :img-url='form.image'
                      @update='handleUpdateCover' />
                  </custom-form-item>
                </div>
              </div>
            </template>
            <div class='form-field-item custom-field' v-for='custFieldItem in $store.getters.formConfigData.planCustomList' :key='custFieldItem.id'>
              <template v-if='step.customFields.indexOf(custFieldItem.name) !== -1'>
                <div v-if="custFieldItem.visible && form.customFieldData && form.customFieldData.hasOwnProperty(custFieldItem.id)" class='form-block tag-content-block' :key='custFieldItem.id' :data-field-name="'cust_' + custFieldItem.name" :data-field-id='custFieldItem.id'>
                  <custom-form-item>
                    <template slot='label'>
                      {{ custFieldItem.name }}
                    </template>
                    <a-input v-model='form.customFieldData[custFieldItem.id]' :placeholder='custFieldItem.hint' class='cc-form-input' :disabled="!canEdit"/>
                  </custom-form-item>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class='tag-body' :style="{ width: tagBodyWidth }" v-show="tagBodyWidth !== '0%'">
          <template v-if='currentRightModule === rightModule.collaborate'>
            <a-skeleton :loading='showHistoryLoading' active>
              <div class='collaborate-panel'>
                <div class='icon' style="margin-left:10px">
                  <comment-icon />
                </div>
                <div class="panel-close">
                  <a-icon type="close" @click="handleViewCollaborate()" :style="{ color: 'red', fontSize: '18px',cursor:'pointer' }"/>
                </div>
                <a-tabs :default-active-key='defaultHistoryKey'>
                  <a-tab-pane key='1' tab='Comment'>
                    <collaborate-comment-view
                      :comment-list='collaborateCommentList'
                      :source-id='unitPlanId'
                      :source-type="contentType['unit-plan']"
                      :collaborate-user-list="getCollaborateUsers(collaborate)"
                      @update-comment='handleUpdateCommentList' />
                  </a-tab-pane>
                  <a-tab-pane key='2' force-render tab='History'>
                    <collaborate-history :source-type="contentType['unit-plan']" :history-list='historyList' @restore='handleRestoreField' />
                  </a-tab-pane>
                </a-tabs>
              </div>
            </a-skeleton>
          </template>

          <template v-if='currentRightModule === rightModule.collaborateComment'>
            <div class='collaborate-panel'>
              <collaborate-comment-panel
                :comment-list='collaborateCommentList'
                :field-name='currentFieldName'
                :source-id='unitPlanId'
                :source-type="contentType['unit-plan']"
                :collaborate-user-list="getCollaborateUsers(collaborate)"
                @cancel-comment="handleCancelComment"
                @update-comment='handleUpdateCommentList' />
            </div>
          </template>

          <template v-if='currentRightModule === rightModule.customTag'>
            <div v-show='!this.contentLoading' >
              <custom-tag-v3
                :custom-tags.sync='form.customTags'
                :tag-category-desc.sync='form.tagCategoryDesc'
                :associate-id-type-list='associateIdTypeList'
                :priority-tags='priorityTags'
                :disabled='!canEdit'
                :is-load-associate-tags='true' />
            </div>
          </template>

          <template v-if='currentRightModule === rightModule.taskDetails'>
            <div class='task-details-panel'>
              <assessment-task-details
                :disabled='!canEdit'
                :associate-task-list='associateTaskList'
                @hide-assessment-task='resetRightModuleVisible()' />
            </div>
          </template>

          <template v-if='currentRightModule === rightModule.associate'>
            <link-content-list
              :selected-id-list='associateTaskIdList'
              :filter-types="[contentType.task]" />
          </template>
        </div>
      </div>
      <div class='loading-content' v-if='contentLoading'>
        <a-spin />
      </div>
    </div>

    <fixed-form-footer>
      <template v-slot:right>
        <a-button type='primary' @click='handleNextStep' class='cc-round-button'>
          <template v-if='currentActiveStepIndex < formSteps.length - 1'>
            Next
          </template>
          <template v-else>
            Complete
          </template>
        </a-button>
      </template>
    </fixed-form-footer>

    <a-modal
      v-model='showCollaborateModalVisible'
      :closable='true'
      :footer='null'
      :maskClosable='false'
      destroyOnClose
      width='640px'>
      <collaborate-user-list
        v-if='showCollaborateModalVisible'
        :content-id='unitPlanId'
        :content-type="contentType['unit-plan']"
        :main-content='collaborateContent'
        @confirmSelect='confirmSelectCollaborateUsers' />
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
      v-model='questionMoreVisible'
      :footer='null'
      destroyOnClose
      title='Browse Key Questions'
      width='900px'
      @cancel='questionMoreVisible = false'
      @ok='questionMoreVisible = false'>
      <div class='link-content-wrapper'>
        <QuestionBrowse
          :selectedSdg='selectedSdg'
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
      <collaborate-update-content
        ref="collaborateUpdate"
        :source-id='form.id'
        :source-type='form.type'
        @update-content='handleUpdateContent'
      />
    </a-modal>

    <a-modal
      v-model='selectBigIdeaDataVisible'
      :footer='null'
      destroyOnClose
      title='Browse big idea'
      width='700px'
      :dialog-style="{ top: '50px'}"
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

    <div v-clickOutside id="ideaKeywords" ref="quickModal" v-show="false">
      <a-space class="quick-keyword-con">
        <label>Set </label>
        <label>{{ inquiryKeywords }}</label>
        <label> as </label>
        <a-button type="black" @click="handleInquiryKeySet('inquiryKeywords')">keywords</a-button>
      </a-space>
    </div>

    <a-skeleton :loading='contentLoading' active>
    </a-skeleton>

    <edit-price-dialog :content='form' ref='editPrice' @finish='showPublishTips'/>
  </div>
</template>

<script>
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { typeMap } from '@/const/teacher'
import { PlanField } from '@/const/common'
import { GetAllSdgs, ScenarioSearch } from '@/api/scenario'
import { debounce } from 'lodash-es'
import InputSearch from '@/components/UnitPlan/InputSearch'
import SdgTagInput from '@/components/UnitPlan/SdgTagInput'
import {
  Associate,
  FindBigIdeaSourceOutcomes,
  FindSourceOutcomes,
  GetAssociate,
  GetMyGrades,
  GetReferOutcomes, UpdateContentStatus
} from '@/api/teacher'
import { SubjectTree } from '@/api/subject'
import { formatSubjectTree } from '@/utils/bizUtil'
import NewUiClickableKnowledgeTag from '@/components/UnitPlan/NewUiClickableKnowledgeTag'
import NewClickableSkillTag from '@/components/UnitPlan/NewClickableSkillTag'
import SkillTag from '@/components/UnitPlan/SkillTag'
import { UnitPlanAddOrUpdate, UnitPlanQueryById } from '@/api/unitPlan'
import MyContentSelector from '@/components/MyContent/MyContentSelector'
import { TaskAddOrUpdate } from '@/api/task'
import CustomTagV3 from '@/components/CustomTag/CustomTagV3'
import RelevantTagSelector from '@/components/UnitPlan/RelevantTagSelector'
import AddKeywordTag from '@/components/Evaluation/AddKeywordTag'
import CollaborateUserList from '@/components/Collaborate/CollaborateUserList'
import CommonFormHeader from '@/components/Common/CommonFormHeader'
import NewBrowser from '@/components/NewLibrary/NewBrowser'
import { SelectModel } from '@/components/NewLibrary/SelectModel'
import DisplayMode from '@/components/MyContent/DisplayMode'
import { LibraryEvent, LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'
import ReferPreview from '@/components/UnitPlanRefer/ReferPreview'
import UiLearnOut from '@/components/UnitPlan/UiLearnOut'
import NewMyContent from '@/components/MyContent/NewMyContent'
import { NavigationType } from '@/components/NewLibrary/NavigationType'
import CollaborateCommentPanel from '@/components/Collaborate/CollaborateCommentPanel'
import CommentSwitch from '@/components/Collaborate/CommentSwitch'
import CollaborateCommentView from '@/components/Collaborate/CollaborateCommentView'
import commentIcon from '@/assets/icons/collaborate/comment.svg?inline'
import CollaborateHistory from '@/components/Collaborate/CollaborateHistory'
import { UserSetting } from '@/api/user'
import BigIdeaBrowse from '@/components/UnitPlan/BigIdeaBrowse'
import { FindQuestionsByBigIdea } from '@/api/question'
import QuestionBrowse from '@/components/UnitPlan/QuestionBrowse'
import Collapse from '@/utils/collapse.js'
import { UtilMixin } from '@/mixins/UtilMixin'
import moment from 'moment'
import AssessmentTaskDetails from '@/components/UnitPlan/AssessmentTaskDetails'
import { BaseEventMixin, RightModule } from '@/mixins/BaseEvent'
import { FormConfigMixin } from '@/mixins/FormConfigMixin'
import ShareContentSetting from '@/components/Share/ShareContentSetting'
import { QueryContentShare } from '@/api/share'
import CollaborateTooltip from '@/components/Collaborate/CollaborateTooltip'
import LocalStore from '@/websocket/localstore'
import CollaborateUpdateContent from '@/components/Collaborate/CollaborateUpdateContent'
import PublishList from '@/components/UnitPlan/PublishList'
import AddGreenIcon from '@/assets/svgIcon/evaluation/form/tianjia_green.svg?inline'
import MyVerticalSteps from '@/components/Steps/MyVerticalSteps'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import LinkContentList from '@/components/UnitPlan/LinkContentList'
import UnitLinkedContent from '@/components/UnitPlan/UnitLinkedContent'
import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import FixedFormFooter from '@/components/Common/FixedFormFooter'
import CustomFormItem from '@/components/Common/CustomFormItem'
import CustomRadioButtonGroup from '@/components/Common/CustomRadioButtonGroup'
import DeleteIcon from '@/components/Common/DeleteIcon'
import PlusIcon from '@/components/Common/PlusIcon'
import CustomLinkText from '@/components/Common/CustomLinkText'
import CustomTextButton from '@/components/Common/CustomTextButton'
import { PublishMixin } from '@/mixins/PublishMixin'
import CustomCoverMedia from '@/components/Common/CustomCoverMedia'
import LearningObjective from '@/components/LearningObjective/LearningObjective'
import { AutoSaveMixin } from '@/mixins/AutoSaveMixin'
import CustomImageUploader from '@/components/Common/CustomImageUploader'
import { GetTreeByKey } from '@/api/tag'
import { deepEqual } from '@/utils/util'
import { QueryTagsByIds } from '@/api/v2/mycontent'
import EditPriceDialog from '@/components/MyContentV2/EditPriceDialog'
import QuestionInput from '@/components/Common/QuestionInput'
import InquiryInput from '@/components/Common/InquiryInput'

export default {
  name: 'AddUnitPlan',
  components: {
    InquiryInput,
    QuestionInput,
    EditPriceDialog,
    CustomTagV3,
    CustomImageUploader,
    CustomCoverMedia,
    CustomTextButton,
    CustomLinkText,
    PlusIcon,
    DeleteIcon,
    CustomRadioButtonGroup,
    CustomFormItem,
    FixedFormFooter,
    FormHeader,
    FixedFormHeader,
    UnitLinkedContent,
    LinkContentList,
    MyVerticalSteps,
    PublishList,
    ShareContentSetting,
    AssessmentTaskDetails,
    QuestionBrowse,
    CollaborateHistory,
    CollaborateCommentView,
    CommentSwitch,
    CollaborateCommentPanel,
    NewMyContent,
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
    RelevantTagSelector,
    AddKeywordTag,
    NewBrowser,
    commentIcon,
    UiLearnOut,
    BigIdeaBrowse,
    Collapse,
    CollaborateTooltip,
    CollaborateUpdateContent,
    AddGreenIcon,
    LearningObjective
  },
  props: {
    unitPlanId: {
      type: String,
      default: null
    }
  },
  mixins: [ UtilMixin, BaseEventMixin, FormConfigMixin, PublishMixin, AutoSaveMixin ],
  data() {
    return {
      token: '',
      showCollaborateVisible: false,
      contentLoading: true,
      contentType: typeMap,
      DisplayMode: DisplayMode,

      oldForm: null,
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
      form: {
        id: null,
        image: '',
        coverVideo: null,
        projectBased: null,
        unitType: null,
        inquiry: '',
        name: 'Untitled UnitPlan',
        status: 0,
        subjects: '',
        curriculumId: null,
        learnOuts: [],
        yearList: [],
        languageList: [],
        subjectList: [],
        selfOuts: [],
        questions: [
          {
            id: '',
            name: ''
          }
        ],
        scenarios: {
          description: '',
          sdgId: undefined,
          sdgKeyWords: [
            {
              id: '',
              name: ''
            }
          ]
        },
        createTime: '',
        updateTime: '',
        materials: [],
        customTags: [],
        tagCategoryDesc: [],
        overview: '',
        subjectIds: [],
        gradeIds: [],
        summarize: '',
        startDate: '',
        endDate: '',
        gradeId: undefined,
        prior: '',
        createBy: null,
        customFieldData: null,
        inquiryKeywords: []
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
      publishing: false,
      selectModel: SelectModel,
      selectDescriptionIndex: '',

      showSidebar: true,

      groupNameList: [],
      groupNameListOther: [],

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
      NavigationType: NavigationType,
      defaultActiveMenu: NavigationType.learningOutcomes,
      showMenuList: [NavigationType.specificSkills, NavigationType.centurySkills, NavigationType.learningOutcomes, NavigationType.assessmentType, NavigationType.idu],

      questionSettingVisible: false,
      disableQuestion: false,
      confirmLoading: false,
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
      rwcList: [],

      planField: PlanField,

      linkLoading: false,

      publishListVisible: false,

      currentActiveStepIndex: this.getSessionStep(),
      currentStep: {
        id: null,
        commonFields: [],
        customFields: []
      },

      formBodyWidth: '50%',
      tagBodyWidth: '50%',
      fullBodyFields: ['learnOuts'],
      selectBigIdeaDataVisible: false,
      priorityTags: [],
      readonlyTagCategoryDescList: [],
      inquiryKeywords: []
    }
  },
  watch: {
    referDetailVisible(value) {
      console.info('watch referDetailVisible ' + value)
      console.info('screen width: ', document.body.clientWidth)
      if (value && document.body.clientWidth < 1700) {
        this.showSidebar = false
      } else {
        this.showSidebar = true
      }
    },
    'form.inquiry': function(value, newValue) {
      console.info('watch form.inquiry change ' + value, newValue)
      if (this.hideRecommendQuestion) {
        return
      }
      console.info('get recommend question ' + value)
      this.findQuestionsByBigIdea(value)
      // 重新load recommend
      this.loadBigIdeaLearnOuts()
      // this.form.inquiryKeywords = []
    },
    currentStep: {
      handler(val) {
        this.handleDisplayRightModule()
      },
      deep: true
    }
  },
  computed: {
    selectedSdg() {
      const sdgList = []
      if (this.form.scenarios && this.form.scenarios.length) {
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
      console.info('-------------', this.form.learnOuts, this.recommendDataIdList)
      let ret = false
      this.form.learnOuts.forEach(item => {
        if (this.recommendDataIdList.indexOf(item.knowledgeId) === -1) {
          ret = true
          console.info('------------learnOuts', item, ' not exist in ', this.recommendDataIdList)
        }
      })

      return ret
    },
    isCopyContent() {
      return !!this.form?.originalOwner
    },
    existEmptyQuestion() {
      return this.form.questions.some(item => !item.name || !item.name.trim())
    }
  },
  async created() {
    window.TaskFieldCheck = this.calculateCanPublish
    window.TaskFieldSave = this.autoSaveData
    console.info('unitPlanId ' + this.unitPlanId + ' ' + this.$route.path)
    LibraryEventBus.$on(LibraryEvent.ContentListSelectClick, this.handleDescriptionSelectClick)

    let token = this.$route.query.token
    if (!token) {
      token = storage.get(ACCESS_TOKEN)
    }
    this.token = token
    await this.$store.dispatch('loadFormConfigData', token).then(() => {
      this.formSteps = this.$store.getters.formConfigData.planSteps || []
      // 增加inquiryKeywords
      const Inquiry = this.formSteps.find(item => item.name === 'Inquiry')
      Inquiry && Inquiry.commonFields.push(this.planField.InquiryKeywords)
      console.info('formSteps', this.formSteps)
      this.requiredFields = this.$classcipe.planRequiredFields
      console.info('requiredFields', this.requiredFields)
      // this.requiredFields = list
      // if (this.form.inquiryKeywords.length === 0) {
      //   const list = this.requiredFields.slice()
      //   list.splice(list.indexOf(this.PlanField.Inquiry), 1)
      //   this.requiredFields = list
      //   console.info('associateQuestionList empty remove Inquiry from requiredFields')
      // }
      if (this.currentActiveStepIndex < 0 || this.currentActiveStepIndex > this.formSteps.length - 1) {
        this.currentActiveStepIndex = 0
      }
      this.currentStep = this.formSteps[this.currentActiveStepIndex]
      this.priorityTags = this.currentStep.tags
      this.handleDisplayRightModule()
      this.checkIsFullBodyStep()
    })

    this.initData()
    this.getAssociate()
    this.debouncedGetSdgByDescription = debounce(this.searchScenario, 300)
    this.findQuestionsByBigIdea = debounce(this.findQuestionsByBigIdea, 800)
    this.queryContentCollaborates(this.unitPlanId, this.contentType['unit-plan'])
  },
  beforeDestroy() {
    LibraryEventBus.$off(LibraryEvent.ContentListSelectClick, this.handleDescriptionSelectClick)
  },
  methods: {
    initData() {
      console.info('initData doing...')
      Promise.all([
        GetAllSdgs(),
        GetMyGrades(),
        SubjectTree({ curriculumId: this.$store.getters.bindCurriculum }),
        GetTreeByKey({ key: 'Real world connections' })
      ]).then((sdgListResponse) => {
        console.info('initData done', sdgListResponse)

        // GetAllSdgs
        console.info('GetAllSdgs Response ', sdgListResponse[0])
        if (!sdgListResponse[0].code) {
          this.sdgList = sdgListResponse[0].result
        }

        // GetMyGrades
        if (!sdgListResponse[1].code) {
          console.info('GetMyGrades', sdgListResponse[1].result)
          this.gradeList = sdgListResponse[1].result
        }

        // SubjectTree
        if (!sdgListResponse[2].code) {
          console.info('SubjectTree', sdgListResponse[2].result)
          let subjectTree = sdgListResponse[2].result
          subjectTree = formatSubjectTree(subjectTree)
          this.subjectTree = subjectTree
          console.info('after format subjectTree', subjectTree)
        }
        // rwc list
        if (!sdgListResponse[3].code) {
          console.info('rwc', sdgListResponse[3].result)
          this.rwcList = sdgListResponse[3].result.children ? sdgListResponse[3].result.children : []
        }
        console.info('sdgList', this.sdgList)
      }).then(() => {
        this.restoreUnitPlan(this.unitPlanId, true)
      }).catch((e) => {
        this.$message.error('Init Unit Plan Data Failed, Please Retry! ' + e)
      })
    },

    handleDisplayRightModule () {
      if (this.currentStep.commonFields.indexOf(PlanField.LearnOuts) !== -1) {
        this.currentRightModule = null
      } else if (this.currentStep.commonFields.indexOf(PlanField.Link) !== -1) {
        this.currentRightModule = RightModule.associate
      } else {
        this.currentRightModule = RightModule.customTag
      }
    },

    handleNextStep () {
      if (this.currentActiveStepIndex === this.formSteps.length - 1) {
        history.back()
      } else {
        this.$refs['steps-nav'].nextStep()
      }
    },

    // 填充自定义大纲内容
    async handleSelfOutsData() {
      console.info(' handleSelfOutsData')
      const response = await GetReferOutcomes({
        id: this.unitPlanId,
        type: this.contentType['unit-plan']
      })
      console.info('getReferOutcomes response', response)
      if (response.success && response.result.length) {
        const list = response.result
        list.forEach(item => {
          if (item.hasOwnProperty('isSelfCustom') && item.isSelfCustom) {
            item.fromId = item.fromList[0].fromId
            item.fromName = item.fromList[0].fromName
            item.fromTypeName = this.type2Name[item.fromList[0].fromType]

            const targetItem = this.recommendData.find(rItem => rItem.fromId === item.fromId)
            if (targetItem) {
              console.info('targetItem ' + targetItem.fromName + ' add SelfCustom SelfOut ' + item.name, item)
              targetItem.list.push(item)
            }
          }
        })
      }
    },

    restoreUnitPlan(unitPlanId, isFirstLoad) {
      if (isFirstLoad) {
        this.contentLoading = true
      }
      console.info('restoreUnitPlan ' + unitPlanId)
      UnitPlanQueryById({
        id: unitPlanId
      }).then(response => {
        console.info('UnitPlanQueryById ' + unitPlanId, response.result)
        if (response.code === 0 && response.success) {
          const unitPlanData = response.result
          if (unitPlanData.scenarios.length === 0) {
            unitPlanData.scenarios.push({
              description: '',
              sdgId: undefined,
              sdgKeyWords: []
            })
          } else {
            unitPlanData.scenarios.forEach(item => {
              if (!item.sdgId) {
                item.sdgId = undefined
              }
            })
          }
          if (!unitPlanData.gradeId) {
            unitPlanData.gradeId = undefined
          } else {
            // 年级在本国大纲不存在的情况
            if (this.gradeList.filter(grade => grade.id === unitPlanData.gradeId).length === 0) {
              this.form.gradeId = undefined
            }
          }
          if (!unitPlanData.rwc) {
            unitPlanData.rwc = undefined
          }
          // 填充自定义字段
          const customFieldData = unitPlanData.customFieldData ? JSON.parse(unitPlanData.customFieldData) : null
          const displayCustomFieldData = {}
          if (customFieldData) {
            // 只显示配置中存在的字段,用id做key，改名后依旧可以使用老数据
            this.$store.getters.formConfigData.planCustomList.forEach(customField => {
              if (customFieldData.hasOwnProperty(customField.id)) {
                displayCustomFieldData[customField.id] = customFieldData[customField.id]
              } else {
                displayCustomFieldData[customField.id] = ''
              }
            })
          } else {
            this.$store.getters.formConfigData.planCustomList.forEach(customField => {
              displayCustomFieldData[customField.id] = ''
            })
          }
          console.info('displayCustomFieldData', displayCustomFieldData)
          unitPlanData.customFieldData = displayCustomFieldData

          this.saving = true
          this.form = unitPlanData
          if (unitPlanData.questions.length === 0) {
            // this.form.questions.push({ name: '' })
          }
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.contentLoading = false
        this.saving = false
        this.loadCollaborateData(this.form.type, this.form.id)
        this.oldForm = Object.assign({}, this.form)
        this.loadingShareContent()
        this.tryAutoCheckRequiredField()
      })
    },

    handleDescriptionSearch(index, description) {
      console.info('handleDescriptionSearch:', index, description)
      this.form.scenarios[index].description = description
      this.debouncedGetSdgByDescription(index, description)
    },

    searchScenario(index, description) {
      console.info('searchScenario', description)
      this.currentIndex = index
      if (typeof description === 'string' && description.trim().length >= 3) {
        // this.$refs.descriptionInputSearch.fetching = true
        ScenarioSearch({
          searchKey: this.form.scenarios[index].description
        }).then((response) => {
          console.info('searchByDescription', response)
          this.descriptionSearchList = response.result
        })
      } else {
        this.descriptionSearchList = []
      }
    },

    handleSelectScenario(index, scenario) {
      console.log(scenario)
      if (this.form.scenarios.hasOwnProperty(index) && scenario && scenario.sdgKeyWords && scenario.description) {
        this.form.scenarios[index].description = scenario.description
        if (scenario.sdgKeyWords.length) {
          const keyWords = scenario.sdgKeyWords
          console.info('scenario[' + index + '].sdgKeyWords', keyWords)
          this.form.scenarios[index].sdgKeyWords = keyWords
        }
      }
    },

    handleAddMoreSdg() {
      const sdg = {
        description: '',
        sdgId: undefined,
        sdgKeyWords: []
      }
      this.form.scenarios.push(sdg)
    },

    handleDeleteSdg(sdgIndex) {
      if (this.form.scenarios.length > 1) {
        this.form.scenarios.splice(sdgIndex, 1)
        console.info('scenarios ', this.form.scenarios, 'sdgTotal ' + this.form.scenarios.length)
      } else {
        this.$message.warn(this.$t('teacher.add-unit-plan.at-least-one-sdg'))
      }
    },
    handleRemoveQuestion(index) {
      console.info('handleRemoveQuestion ', index)
      if (this.form.questions.length === 1) {
        this.form.questions[index].name = ''
      } else {
        this.form.questions.splice(index, 1)
      }
    },

    async save() {
      console.info('save', this.form)
      this.saving = true
      this.cleaPageCache()
      const unitPlanData = JSON.parse(JSON.stringify(this.form))
      if (this.unitPlanId) {
        unitPlanData.id = this.unitPlanId
      }
      if (unitPlanData.customFieldData) {
        unitPlanData.customFieldData = JSON.stringify(unitPlanData.customFieldData)
      }
      console.info('UnitPlanAddOrUpdate unitPlanData', unitPlanData)
      try {
        const response = await UnitPlanAddOrUpdate(unitPlanData)
        console.info('UnitPlanAddOrUpdate res', response.result)
        if (!response.success) {
          this.oldForm = Object.assign({}, this.form)
          this.$message.error(response.message)
        }
        // 内容更新发送协同通知
        if (!deepEqual(this.form, this.oldForm)) {
          this.handleSaveContentEvent(this.unitPlanId, this.contentType['unit-plan'], this.oldForm)
        }
      } finally {
        this.saving = false
      }
    },
    handlePublishUnitPlan() {
      console.info('handlePublishUnitPlan', {
        id: this.unitPlanId,
        status: 1
      })

      this.checkRequiredFields()
      console.info('this.emptyRequiredFields', this.emptyRequiredFields)
      if (this.emptyRequiredFields.length === 0) {
        this.form.status = 1
        this.handlePublishFormItem(1)
        this.showEditPriceDialog()
      } else {
        let requiredStepIndex = -1
        for (let i = 0; i < this.formSteps.length; i++) {
          if (this.formSteps[i].showRequiredTips) {
            requiredStepIndex = i
            break
          }
        }

        if (requiredStepIndex !== -1) {
          this.currentActiveStepIndex = requiredStepIndex
        }
      }
    },

    handlePublishFormItem (status) {
      const data = {
        id: this.unitPlanId,
        status: status,
        type: this.contentType['unit-plan']
      }
      UpdateContentStatus(data)
    },

    handleAddUnitPlanTask() {
      console.info('handleAddUnitPlanTask ' + this.unitPlanId)
      // 下创建一个空的task，然后关联，然后再跳转过去
      if (!this.addLoading) {
        this.addLoading = true
        TaskAddOrUpdate({
          name: 'Unnamed Task',
          associateId: this.form.id,
          associateType: this.form.type
        }).then((response) => {
          console.info('TaskAddOrUpdate', response.result)
          if (response.success) {
            Associate({
              fromId: this.unitPlanId,
              fromType: this.contentType['unit-plan'],
              toId: response.result.id,
              toType: this.contentType.task
            }).then(response => {
              console.info('Associate response ', response)
            })
            this.addLoading = false
            this.$router.push({
              path: '/teacher/task-redirect/' + response.result.id
            })
          } else {
            this.$message.error(response.message)
          }
        }).finally(() => {
          this.addLoading = false
        })
      } else {
        console.info('add loading')
      }
    },

    handleConfirmAssociate() {
      console.info('handleConfirmAssociate')
      this.associateLibraryVisible = false
    },

    getAssociate() {
      console.info('AddUnitPlan GetAssociate id[' + this.unitPlanId + '] fromType[' + this.contentType['unit-plan'] + ']')
      this.associateUnitPlanIdList = []
      this.associateTaskIdList = []
      this.associateTaskList = []
      GetAssociate({
        id: this.unitPlanId,
        type: this.contentType['unit-plan']
      }).then(response => {
        console.info('AddUnitPlan GetAssociate response', response)
        this.groupNameList = response.result.groups
        this.groupNameListOther = []
        this.selectedTaskList = [] // 只添加空group name分组数据
        response.result.owner.forEach(item => {
          item.contents.forEach(content => {
            this.selectedTaskList.push(content.type + '-' + content.id)
            if (content.type === this.contentType['unit-plan']) {
              this.associateUnitPlanIdList.push(content.id)
              this.associateId2Name.set(content.id, content.name)
            }

            if (content.type === this.contentType.task) {
              this.associateTaskIdList.push(content.id)
              this.associateId2Name.set(content.id, content.name)
              this.associateTaskList.push(content)
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
            }

            if (content.type === this.contentType.task) {
              this.associateTaskIdList.push(content.id)
              this.associateId2Name.set(content.id, content.name)
            }
          })
        })
        this.newTermName = 'Untitled category_' + (this.groupNameList.length)
        console.info('AddTask GetAssociate formatted groupNameList', this.groupNameList, this.groupNameListOther)
        console.info('*******************associateUnitPlanIdList', this.associateUnitPlanIdList)
        console.info('*******************associateTaskIdList', this.associateTaskIdList)
        console.info('associateTaskIdList', this.associateTaskIdList)
      }).finally(() => {
        this.linkGroupLoading = false

        if (this.associateUnitPlanIdList.length > 0 || this.associateTaskIdList.length > 0) {
          this.loadRefLearnOuts()
          this.handleSelfOutsData()
        }

        if (this.associateTaskList.length) {
          this.loadTaskCategoryDesc()
        }
      })
    },

    loadTaskCategoryDesc() {
      const associateTaskIdList = (new Set(this.associateTaskIdList))
      console.info('loadTaskCategoryDesc', associateTaskIdList)
      QueryTagsByIds({
        ids: Array.from(associateTaskIdList)
      }).then(res => {
        console.info('loadTaskCategoryDesc res', res.result)
        this.readonlyTagCategoryDescList = res.result
      })
    },

    async loadRefLearnOuts() {
      this.recommendData = []
      this.recommendDataIdList = []
      let response
      if (this.associateUnitPlanIdList.length) {
         response = await FindSourceOutcomes({
          type: this.contentType['unit-plan'],
          ids: this.associateUnitPlanIdList
        })

        console.info('FindSourceOutcomes unit-plan response', response)
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

          for (const value of recommendMap.values()) {
            this.recommendData.push({
              fromId: value[0].fromId,
              fromName: value[0].fromName,
              fromTypeName: this.type2Name[value[0].fromType],
              list: value
            })
          }
        }
        console.info('update unit-plan recommendData ', this.recommendData)
        console.info('************************update unit-plan recommendDataIdList ', this.recommendDataIdList)
      }

      if (this.associateTaskIdList.length) {
        response = await FindSourceOutcomes({
          type: this.contentType.task,
          ids: this.associateTaskIdList
        })
        if (response.success) {
          console.info('FindSourceOutcomes task response', response)
          const recommendMap = new Map()
          response.result.forEach(item => {
            if (recommendMap.has(item.fromId)) {
              recommendMap.get(item.fromId).push(item)
            } else {
              recommendMap.set(item.fromId, [item])
            }
            this.recommendDataIdList.push(item.knowledgeId)
          })

          for (const value of recommendMap.values()) {
            this.recommendData.push({
              fromId: value[0].fromId,
              fromName: value[0].fromName,
              fromTypeName: this.type2Name[value[0].fromType],
              list: value
            })
          }
          console.info('update task recommendData ', this.recommendData)
          console.info('************************update unit-plan recommendDataIdList ', this.recommendDataIdList)
        }
      }
    },
    loadBigIdeaLearnOuts() {
      // bigidea query learnout
      if (this.form.inquiry) {
        FindBigIdeaSourceOutcomes({
          bigIdea: this.form.inquiry,
          id: this.unitPlanId
        }).then(response => {
          console.info('FindBigIdeaSourceOutcomes response', response)
          const recommendMap = new Map()
          response.result.forEach(item => {
            if (recommendMap.has(item.fromId)) {
              recommendMap.get(item.fromId).push(item)
            } else {
              recommendMap.set(item.fromId, [item])
            }
            this.recommendDataIdList.push(item.knowledgeId)
          })

          for (const value of recommendMap.values()) {
            this.recommendData.push({
              fromId: value[0].fromId,
              fromName: this.form.inquiry,
              fromTypeName: 'Big Idea',
              list: value
            })
          }
          console.info('update unit-plan recommendData ', this.recommendData)
          console.info('************************update unit-plan recommendDataIdList ', this.recommendDataIdList)
        })
      }
    },

    handleStepChange(data) {
      console.info('task handleStepChange ', data)
      this.currentStep = data.step
      this.priorityTags = data.step.tags
      console.info('priorityTags', this.priorityTags)
      this.currentActiveStepIndex = data.index
      this.resetRightModuleVisible()
      sessionStorage.setItem('unit-plan-step-' + this.unitPlanId, data.index)
      this.checkIsFullBodyStep()
    },
    checkIsFullBodyStep() {
      let isFullBody = false
      this.fullBodyFields.forEach(field => {
        if (this.currentStep.commonFields.some(item => item === field)) {
          isFullBody = true
        }
      })

      if (isFullBody) {
        this.formBodyWidth = '100%'
        this.tagBodyWidth = '0%'
      } else {
        this.formBodyWidth = '50%'
        this.tagBodyWidth = '50%'
      }
    },

    handleSwitchComment(data) {
      console.info('handleSwitchComment', data)
      if (!data.activeStatus) {
        this.currentFieldName = ''
        this.handleDisplayRightModule()
        return
      }
      this.currentRightModule = RightModule.collaborateComment
      this.currentFieldName = data.fieldName
      this.currentCollaborateCommentList = []
      const list = []
      this.collaborateCommentList.forEach(item => {
        list.push(item)
      })
      this.collaborateCommentList = list
    },

    // 每次点击都重新加载一下最新数据
    handleViewCollaborate() {
      console.info('handleViewCollaborate')
      if (this.currentRightModule === this.rightModule.collaborate) {
        this.handleDisplayRightModule()
      } else {
        this.currentRightModule = this.rightModule.collaborate
      }
      this.showHistoryLoading = true
      this.loadCollaborateData(this.form.type, this.form.id)
    },

    handleUpdateCommentList() {
      console.info('handleUpdateCommentList')
      this.GetCollaborateComment(this.form.type, this.form.id)
    },

    handleRestoreField(data) {
      console.info('handleRestoreField', data, this.form)
      if (data) {
        this.form = data
        this.$message.success('restore successfully!')
      }
      console.info('after handleRestoreField', this.form)
    },
    handQuestionSetting() {
      this.confirmLoading = true
      UserSetting({
        disableQuestion: !this.disableQuestion
      }).then((response) => {
        console.info('UserSetting', response.result)
        if (response.success) {
          this.$store.dispatch('GetInfo')
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.questionSettingVisible = false
        this.confirmLoading = false
      })
    },
    onChangeSwitch(checked) {
      this.disableQuestion = checked
    },
    findQuestionsByBigIdea(bigIdea) {
      if (!bigIdea) {
        return
      }
      FindQuestionsByBigIdea({ bigIdea: bigIdea, limit: 5 }).then(response => {
        console.info('FindQuestionsByBigIdea ', response)
        this.recommendQuestionList = []
        if (response.success) {
          const formQuestion = this.form.questions.map(item => {
            return item.name
          })
          response.result.forEach(item => {
            if (item.name && formQuestion.indexOf(item.name) === -1) {
              if (this.recommendQuestionList.filter(q => q.name === item.name).length === 0) {
                this.recommendQuestionList.push(item)
              }
            }
          })
        }
      }).finally({})
    },
    handleInsertQuestion(question) {
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
      console.info('handleSelectQuestion ', questions)
      this.selectedQuestionList = questions
    },
    handleEnsureSelectQuestionData() {
      console.info('handleEnsureSelectQuestionData ', this.selectedQuestionList)
      const formQuestion = this.form.questions.map(item => {
        return item.name
      })
      this.selectedQuestionList.forEach(q => {
        if (formQuestion.indexOf(q) === -1) {
          this.form.questions.push({ name: q })
        }
      })
      this.form.questions = this.form.questions.filter(item => this.selectedQuestionList.indexOf(item.name) > -1)
      this.questionMoreVisible = false
    },
    getSessionStep() {
      const oldStep = sessionStorage.getItem('unit-plan-step-' + this.unitPlanId)
      if (oldStep !== null) {
        return parseInt(oldStep)
      } else {
        return 0
      }
    },
    handleEditTask(item) {
      window.open('/teacher/task-redirect/' + item.id
        , '_blank')
    },
    handleClickTaskDetail(e) {
      this.currentRightModule = this.rightModule.taskDetails
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

    handleShareUnitPlan() {
      console.info('handleShareUnitPlan')
      this.shareVisible = true
    },
    loadingShareContent() {
      QueryContentShare({
        sourceId: this.form.id,
        sourceType: this.form.type
      }).then(response => {
        console.info('form QueryContentShare response', response)
        if (response.result) {
          this.shareStatus = response.result.status
        } else {
          this.shareStatus = 0
        }
      })
    },
    handleUpdateContent() {
      // 缓存时间少于最新的内容
      this.form.updateTime = moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss')
      LocalStore.setFormContentLocal(this.form.id, this.form.type, JSON.stringify(this.form))
      this.defaultHistoryKey = '2'
      this.handleViewCollaborate()
      setTimeout(() => {
        this.restoreUnitPlan(this.form.id)
      }, 100)
    },
    handleUpdateCover (coverData) {
      console.info('handleUpdateCover', coverData)
      if (coverData.type === 'video') {
        this.form.coverVideo = coverData.url
      } else {
        this.form.image = coverData.url
      }
    },

    updateTaskIdList (idList) {
      console.info('updateTaskIdList', idList)
      this.associateTaskIdList = idList
      this.asyncSaveDataFn()
    },

    handleUpdateLearningObjectives (data) {
      console.info('handleUpdateLearningObjectives', data)
      this.form.learnOuts = data.learnOuts
      this.form.curriculumId = data.curriculumId
      this.form.subjectList = data.selectedSubjectList
      this.form.yearList = data.selectedYearList
      this.form.languageList = data.selectedLanguageList
    },
    handleEnsureSelectBigIdeaData() {
      if (!this.selectNewBigIdea) {
        this.$message.error('Please select a big idea')
        return
      }
      this.form.inquiry = this.selectNewBigIdea.inquiry
      this.form.inquiryKeywords = this.selectNewBigIdea.inquiryKeywords
      this.selectBigIdeaDataVisible = false
    },
    handleSelectBigIdeaData(data) {
      this.selectNewBigIdea = data
    },
    setIdeaKeywords(currentChoose, key) {
      // const keywords = (this.form[key] || '').split(',')
      // keywords.push(currentChoose)
      // this[key] = Array.from(new Set(keywords)).join(',')
      this[key] = currentChoose
    },
    handleInquiryKeySet(key) {
      setTimeout(() => {
        this.$refs.quickModal.style.display = 'none'
        this[key] = ''
      }, 200)
      const keywords = this.form[key] ? this.form[key] : []
      keywords.push(this[key])
      this.$set(this.form, key, Array.from(new Set(keywords)))
    },
    handleRmInquiryKey(item, key, tagIndex) {
      if (this.canEdit) {
        const keywords = item[key] ? item[key] : []
        keywords.splice(tagIndex, 1)
        this.$set(item, key, keywords)
        console.info('handleRmInquiryKey', item, key, tagIndex, 'keywords', keywords)
        this.asyncSaveDataFn()
      }
    },
    handleUpdateQuestion(data) {
      console.info('handleUpdateQuestion', data)
      this.form.questions = data.map(item => ({ id: item.id, name: item.name }))
      console.info('handleUpdateQuestion questions', this.form.questions)
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
      font-family: Inter-Bold;
      line-height: 24px;
      color: #666666;
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
      position: relative;
      padding-bottom: 24px;
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

/deep/ .ant-steps-item-content {
  padding-right: 30px;
}

.form-radio-wrapper {
  /deep/ .ant-radio-wrapper {
    width: 180px;
    display: inline-block;
  }

  /deep/ .ant-form-item-label {
    width: 170px;
    text-align: left;
  }
}

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

.form-input-item {
  margin-bottom: 20px;
  position: relative;
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
  }
}

.question {
  .question-form-blocks {
    border: 1px solid #15C39A !important;
  }
}

.delete-icon-wrapper {
  transition: all 0.2s ease-in;
  position: absolute;
  right: -20px;
  top: 50%;
  margin-top: -7px;
  cursor: pointer;
  z-index: 100;
  width: 30px;
  height: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  display: none;

  .delete-icon {
    width: 15px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
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
  top: 75px;
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

.my-comment-show {
  display: block;
}

.collaborate-panel {
  background-color: #fff;
  position: relative;
  //box-shadow: 0px 6px 10px rgba(159, 159, 159, 0.16);
  .panel-close {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .icon {
/*    padding: 10px 5px 0 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;*/

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
    &:hover {
      color: #15c39a;
    }
  }
}

/deep/ .ant-breadcrumb > span:last-child {
  color: rgba(0, 0, 0, 0.45);
}

.form-block-disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
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

.scenario-description {
  position: relative;
  .delete-action {
    position: absolute;
    text-align: center;
    top: 5px;
    right: -25px;
    width: 30px;
    display: none;
    cursor: pointer;
    height: 35px;
  }

  &:hover {
    .delete-action {
      display: block;
    }
  }
}

/deep/ .ant-steps-item-content {
  overflow: visible;
  margin-left: 50px;
}

.step-nav {
  background: #fff;
  position: fixed;
  right: 0;
  top: 74px;
  z-index: 999;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
}

.form-content {
  margin-top: 110px;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}

.loading-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.step-content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .form-body {
    height: 100%;
    -moz-overflow-y: auto;
    overflow-y: overlay;
    background-color: #fff;
  }
  .form-body>div {
    padding: 0px 30px 0 30px;
    height: 100%;
  }
  .form-page-item .form-field-item:first-child > .form-block:first-child{padding-top: 20px;}

  .tag-body {
    padding: 20px 30px;
    height: 100%;
    overflow-y: scroll;
  }
}

.question-item {
  position: relative;
  margin-bottom: 10px;
  &:hover {
    .delete-icon-wrapper {
      display: flex;
    }
  }
}

.learn-out-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.third-hidden-data {
  background-color: #eee;
  border: 2px dashed #aaa;
  position: relative;
  padding: 15px 10px 10px 10px;
  .close-hidden-value {
    position: absolute;
    right: 10px;
    top: 5px;
    cursor: pointer;
  }
}
.quick-keyword-con {
  border: 1px solid #dfdfdf;
  background: #fff;
  padding: 5px 10px;
  // width: 330px;
}
.inquiry-keyword-con {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .inquiry-keyword-item {
    margin: 3px;
    display: flex;
    align-items: center;
  }
}
</style>
