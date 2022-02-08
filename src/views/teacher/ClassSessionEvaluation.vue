<template>
  <div class="my-full-form-wrapper" @click="handleUpdateHeader">
    <div class="form-header">
      <common-form-header
        ref="commonFormHeader"
        :form="form"
        :show-collaborate="false"
        :last-change-saved-time="lastChangeSavedTime"
        @update-form="handleUpdateForm"
        @back="goBack"
        @save="handleSaveAndBackEvaluation"
        @publish="handlePublishEvaluation"
      />
    </div>
    <a-card
      :bordered="false"
      :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }"
      :loading="loading">
      <div class="class-session-evaluation">
        <div class="header">
          <div class="left-action">
            <div class="add-btn">
              <a-button type="primary" @click="handleAddFormTable" v-show="mode === EvaluationTableMode.Edit">
                <div class="btn-content">
                  <a-icon type="plus-circle" />
                  <span class="btn-text">
                    Add rubric format
                  </span>
                </div>
              </a-button>
            </div>
          </div>
        </div>
        <div class="form-table-tabs" v-show="forms.length > 0">
          <div
            :class="{'form-table-item': true,
                     'active-table': currentActiveFormId === formItem.formId}"
            v-for="(formItem, idx) in forms"
            :data-form-id="formItem.formId"
            :data-form-type="formItem.formType"
            @click="handleActiveForm(idx, formItem)"
            :key="idx">

            <div class="action-icon" v-show="formItem.titleEditing === false">
              <div class="form-title-item">
                <div class="form-title" @dblclick="handleEditFormTitle(formItem)">{{ formItem.title }}</div>
                <div class="form-delete-icon" v-show="mode === EvaluationTableMode.Edit">
                  <a-popconfirm
                    title="Delete this form ?"
                    ok-text="Yes"
                    @confirm="handleDeleteForm(formItem)"
                    cancel-text="No">
                    <a-icon type="delete" />
                  </a-popconfirm>
                </div>
              </div>
            </div>
            <div class="editing-title" v-show="formItem.titleEditing === true">
              <a-input
                v-model="currentEditingTitle"
                class="my-title-input"
                @blur="handleEnsureUpdateFormTitle"
                @keyup.enter="handleEnsureUpdateFormTitle" />
            </div>
          </div>
        </div>
        <div class="body">
          <div class="class-group">
            <div class="class-student-wrapper">
              <div class="group-list-wrapper">
                <div class="no-group-student-list">
                  <div class="student-list">
                    <div
                      :class="{'list-item': true, 'selected-student': currentActiveStudentId === member.userId, 'heartbeat': ((studentEvaluateIdList.length || peerEvaluateIdList.length) && studentEvaluateIdList.indexOf(member.userId) === -1 && peerEvaluateIdList.indexOf(member.userId) === -1)}"
                      v-for="(member, sIndex) in allNoGroupStudentUserList"
                      :key="sIndex"
                      :data-member-id="member.userId"
                      @click="handleClickMember(null, member)">
                      <div class="student-avatar">
                        <img :src="member.studentAvatar" alt="" v-if="member.studentAvatar" />
                        <img
                          slot="prefix"
                          src="~@/assets/icons/evaluation/default_avatar.png"
                          alt=""
                          v-if="!member.studentAvatar" />
                      </div>
                      <div class="student-name" :data-email="member.userId">
                        <a-tooltip placement="top" :mouseEnterDelay="1">
                          <template slot="title">
                            {{ member.realName }}
                          </template>
                          {{ member.realName }}
                        </a-tooltip>
                      </div>
                      <div class="select-status-icon" v-if="selectedMemberIdList.indexOf(member.userId) !== -1">
                        <a-icon type="check-circle" style="{color: #07AB84}" theme="filled" class="my-selected-icon" />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  :class="{'group-item': true, 'selected-group': selectedGroupIdList.indexOf(group.id) !== -1}"
                  v-for="(group, gIdx) in groups"
                  :key="gIdx"
                  :data-group-id="group.id">
                  <div class="group-item-info" @click="handleSelectGroup(group)">
                    <div class="group-left">
                      <div class="group-icon">
                        <group-icon />
                      </div>
                      <div class="group-name">
                        {{ group.name }} ({{ group.members.length }})
                      </div>
                      <div class="group-select-status">
                        <template v-if="selectedGroupIdList.indexOf(group.id) !== -1">
                          <a-icon
                            type="check-circle"
                            style="{color: #07AB84}"
                            theme="filled"
                            class="my-selected-icon" />
                        </template>
                      </div>
                    </div>
                    <div class="group-right" @click="handleToggleGroupExpand(group, $event)">
                      <div class="group-expand-status">
                        <template v-if="group.expand">
                          <arrow-down />
                        </template>
                        <template v-if="!group.expand">
                          <arrow-top />
                        </template>
                      </div>
                    </div>
                  </div>
                  <div class="group-student-list" v-show="group.expand">
                    <div class="student-list">
                      <div
                        :class="{'list-item': true, 'selected-student': currentActiveStudentId === member.userId, 'heartbeat': ((studentEvaluateIdList.length || peerEvaluateIdList.length) && studentEvaluateIdList.indexOf(member.userId) === -1 && peerEvaluateIdList.indexOf(member.userId) === -1)}"
                        v-for="(member, sIndex) in group.members"
                        :key="sIndex"
                        :data-member-id="member.userId"
                        @click="handleClickMember(group, member)">
                        <div class="student-avatar">
                          <img :src="member.studentAvatar" alt="" v-if="member.studentAvatar" />
                          <img
                            slot="prefix"
                            src="~@/assets/icons/evaluation/default_avatar.png"
                            alt=""
                            v-if="!member.studentAvatar" />
                        </div>
                        <div class="student-name" :data-email="member.email">
                          <a-tooltip placement="top" :mouseEnterDelay="1">
                            <template slot="title">
                              {{ member.realName }}
                            </template>
                            {{ member.realName }}
                          </a-tooltip>
                        </div>
                        <div class="select-status-icon" v-if="selectedMemberIdList.indexOf(member.userId) !== -1">
                          <a-icon
                            type="check-circle"
                            style="{color: #07AB84}"
                            theme="filled"
                            class="my-selected-icon" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="no-group-tips">
                  <no-more-resources v-if="allStudentUserList.length === 0 && !loading" tips="No student exist" />
                </div>
              </div>
            </div>
          </div>
          <div class="form-table-content" :data-mode="mode">
            <div
              class="table-content"
              v-show="(currentActiveStudentId || mode === EvaluationTableMode.Edit) && !loading">
              <div class="form-table-item" v-for="(formItem,tIdx) in forms" :key="tIdx">
                <div class="form-table-item-content" v-show="formItem.formId === currentActiveFormId">
                  <div class="form-header-line">
                    <div class="right-icon">
                      <div class="icon-type-item">
                        <div class="icon-item">
                          <teacher-icon />
                        </div>
                        <div class="label">Teacher</div>
                      </div>
                      <div class="icon-type-item">
                        <div class="icon-item">
                          <student-icon />
                        </div>
                        <div class="label">Student</div>
                      </div>
                      <div class="icon-type-item">
                        <div class="icon-item">
                          <peer-icon />
                        </div>
                        <div class="label">Peer</div>
                      </div>
                    </div>
                    <div class="form-action">
                      <a-button
                        v-if="isTeacher && (mode === EvaluationTableMode.Edit || mode === EvaluationTableMode.TeacherEvaluate)"
                        @click="handleToggleMode"
                        class="my-form-header-btn"
                        style="{
                              width: 120px;
                              display: flex;
                              flex-direction: row;
                              align-items: center;
                              justify-content: center;
                              background: rgba(21, 195, 154, 0.08);
                              border: 1px solid #15C39A;
                              border-radius: 20px;
                              padding: 15px 20px;
                            }">
                        <div class="btn-icon">
                          <img src="~@/assets/icons/common/form/baocun@2x.png" />
                        </div>
                        <div class="btn-text">
                          <template v-if="mode=== EvaluationTableMode.Edit">
                            Evaluating
                          </template>
                          <template v-if="mode !== EvaluationTableMode.Edit && mode !== EvaluationTableMode.Preview">
                            Editing
                          </template>
                        </div>
                      </a-button>
                      <a-button
                        v-if='mode === EvaluationTableMode.StudentEvaluate || mode === EvaluationTableMode.TeacherEvaluate'
                        class="my-form-header-btn"
                        style="{
                            width: 120px;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: center;
                             background: rgba(21, 195, 154, 0.08);
                            border: 1px solid #15C39A;
                            border-radius: 20px;
                            padding: 15px 20px;
                          }"
                        @click="handleSaveEvaluation">
                        <div class="btn-icon">
                          <img src="~@/assets/icons/common/form/fabu@2x.png" />
                        </div>
                        <div class="btn-text">
                          Submit
                        </div>
                      </a-button>
                    </div>
                    <div class="form-setting">
                      <a-dropdown
                        placement="bottomRight"
                        v-if="isTeacher && (mode === EvaluationTableMode.Edit || mode === EvaluationTableMode.TeacherEvaluate)">
                        <a-icon type="setting" />
                        <a-menu slot="overlay">
                          <a-menu-item key="0">
                            <div class="menu-icon">
                              <a-switch
                                size="small"
                                v-model="formItem.se"
                                @click="handleToggleStudentEvaluation(formItem)" />
                            </div>
                            Student Eval
                          </a-menu-item>
                          <a-menu-item key="1">
                            <div class="menu-icon">
                              <a-switch
                                size="small"
                                v-model="formItem.pe"
                                @click="handleTogglePeerEvaluation(formItem)" />
                            </div>
                            Peer Eval
                          </a-menu-item>
                        </a-menu>
                      </a-dropdown>
                    </div>
                  </div>
                  <div class="comment" v-show="formTableMode === EvaluationTableMode.TeacherEvaluate">
                    <div class="summary-input" v-if="currentActiveFormId && currentActiveStudentId">
                      <a-textarea
                        v-model="studentEvaluateData[currentActiveStudentId][currentActiveFormId].comment"
                        placeholder="Write a comment"
                        aria-placeholder="Write a comment"
                        @keyup="handleUpdateComment(studentEvaluateData[currentActiveStudentId][currentActiveFormId].comment)"
                        class="my-textarea" />
                    </div>
                  </div>
                  <div class="form-table-detail">
                    <evaluation-table
                      ref="evaluationTable"
                      :form-id="formItem.formId"
                      :init-raw-headers="formItem.initRawHeaders"
                      :init-raw-data="formItem.initRawData"
                      :form-type="formItem.formType"
                      :form-table-mode="formTableMode"
                      :form-body-data="formBodyData"
                      @update-evaluation="handleUpdateEvaluate"
                      @add-evidence="handleAddEvidence"
                    />
                  </div>
                </div>
              </div>
            </div>
            <template v-if="forms.length === 0 && !loading">
              <div class="no-form-tips">
                <no-more-resources tips="The evaluation form has not been created!" />
              </div>
            </template>
            <template
              v-else-if="mode !== EvaluationTableMode.Preview && mode !== EvaluationTableMode.Edit && !currentActiveStudentId && !loading">
              <div class="no-form-tips">
                <no-more-resources tips="Please select a student first!" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </a-card>

    <a-modal
      v-model="selectRubricVisible"
      :footer="null"
      :maskClosable="false"
      :closable="false"
      width="900px"
      destroyOnClose>
      <modal-header @close="selectRubricVisible = false" />
      <div class="rubric">
        <div class="rubric-header">
          <div class="my-modal-header">
            Add form
          </div>
        </div>
        <div class="select-type">
          <a-radio-group name="radioGroup" default-value="create" v-model="rubricType">
            <a-radio value="create">
              Add new rubric
            </a-radio>
            <a-radio value="select">
              Choose from Content by me
            </a-radio>
          </a-radio-group>
        </div>
        <template v-if="rubricType === 'create'">
          <div class="select-rubric-wrapper">
            <div class="table-name">
              <div class="form-name">Rubric title</div>
              <div class="form-input">
                <a-input v-model="newTableName" :placeholder="newTableName" />
              </div>
            </div>
            <div class="rubric-type-name">
              <div class="toggle-mode-type-wrapper">
                <div class="toggle-mode-type">
                  <div class="toggle-mode">
                    <div
                      :class="{'mode-item': true, 'skill-active-mode' : newFormType === EvaluationTableType.Rubric || newFormType === EvaluationTableType.Rubric_2}"
                      @click="handleToggleFormType(EvaluationTableType.Rubric)">
                      Standard rubrics
                    </div>
                    <div
                      :class="{'mode-item': true, 'knowledge-active-mode' : newFormType === EvaluationTableType.CenturySkills}"
                      @click="handleToggleFormType(EvaluationTableType.CenturySkills)">
                      21st Century Skills rubric
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="rubric-content">
              <div
                v-show="newFormType === EvaluationTableType.Rubric || newFormType === EvaluationTableType.Rubric_2"
                :class="{
                  'rubric-item': true,
                  'active-rubric': newFormType === EvaluationTableType.Rubric_2
                }"
                @click="handleSelectRubric(EvaluationTableType.Rubric_2)"
              >
                <div class="rubric-preview">
                  <img src="~@/assets/icons/evaluation/rubric2.png" alt="rubric">
                </div>
                <div class="rubric-label">
                  Used for IB PYP, New Zealand, Australia curriculum
                </div>
                <div class="rubric-active-icon">
                  <a-icon type="check-circle" theme="filled" />
                </div>
              </div>
              <div
                v-show="newFormType === EvaluationTableType.Rubric || newFormType === EvaluationTableType.Rubric_2"
                :class="{
                  'rubric-item': true,
                  'active-rubric': newFormType === EvaluationTableType.Rubric
                }"
                @click="handleSelectRubric(EvaluationTableType.Rubric)"
              >
                <div class="rubric-preview">
                  <img src="~@/assets/icons/evaluation/rubric1.png" alt="rubric">
                </div>
                <div class="rubric-label">
                  Used for IB MYP
                </div>
                <div class="rubric-active-icon">
                  <a-icon type="check-circle" theme="filled" />
                </div>
              </div>

              <div
                v-show="newFormType === EvaluationTableType.CenturySkills"
                :class="{
                  'rubric-item': true,
                  'active-rubric': newFormType === EvaluationTableType.CenturySkills
                }"
                @click="handleSelectRubric(EvaluationTableType.CenturySkills)"
              >
                <div class="rubric-preview">
                  <img src="~@/assets/icons/evaluation/rubric2.png" alt="rubric">
                </div>
                <div class="rubric-active-icon">
                  <a-icon type="check-circle" theme="filled" />
                </div>
              </div>
            </div>
            <div class="select-rubric-action">
              <a-button
                shape="round"
                class="my-rubric-btn"
                style="width: 80px;background-color: #F5F5F5; border-color:#F5F5F5;box-shadow: none; color: #000000 "
                type="primary"
                @click="handleCancelSelectRubric">Cancel
              </a-button>
              <a-button
                shape="round"
                class="my-rubric-btn"
                style="width: 80px;"
                type="primary"
                @click="handleEnsureSelectRubric">Confirm
              </a-button>
            </div>
          </div>
        </template>
        <template v-if="rubricType === 'select'">
          <div class="select-rubric-wrapper">
            <div class="evaluation-list">
              <select-evaluation-list
                :task-id="taskId"
                :class-id="classId"
                @cancel="selectRubricVisible = false"
                @selected="handleEnsureSelectEvaluation" />
            </div>
          </div>
        </template>
      </div>
    </a-modal>

    <a-modal
      :visible="showMultiSelectedConfirm"
      :footer="null"
      :maskClosable="false"
      :closable="false"
      destroyOnClose>
      <modal-header @close="handleCloseMultiConfirm" />
      <div class="multi-selected-tips">
        <div class="selected-tips">
          You have selected
          <div class="selected-user-list">
            <div class="selected-student-name" v-for="(memberName, mIndex) in selectedMemberNameList" :key="mIndex">
              {{ memberName }}
            </div>
          </div>
          The change(s) you make will apply to all of their assessment tool results.
          Please select only one student if you want to evaluate student individually.
        </div>
        <div class="modal-ensure-action-line-right" style="justify-content: center">
          <a-button class="action-ensure action-item" type="primary" shape="round" @click="handleCloseMultiConfirm">Ok
          </a-button>
        </div>
      </div>
    </a-modal>

    <a-modal
      :visible="showEvaluationNoticeVisible"
      :footer="null"
      :maskClosable="false"
      :closable="false"
      destroyOnClose>
      <div class="edit-notice">
        <div class="notice-title">
          <h2>Notice</h2>
        </div>
        <div class="edit-tips">
          <div class="self-evaluation-notice">
            There are {{ allStudentUserIdList.length - studentEvaluateIdList.length }} students who haven't completed
            the self-assessment tool.
          </div>
          <div class="peer-evaluation-notice">
            There are {{ allStudentUserIdList.length - peerEvaluateIdList.length }} students who haven't completed
            peer-assessment tool.
          </div>
        </div>
        <div class="modal-ensure-action-line-right">
          <a-button class="action-item action-cancel" shape="round" @click="handleContinueToEdit">Continue to edit
          </a-button>
          <a-button class="action-ensure action-item" type="primary" shape="round" @click="handleSaveCurrentEvaluation">
            Save
          </a-button>
        </div>
      </div>
    </a-modal>

    <a-drawer
      destroyOnClose
      placement="right"
      width="1020px"
      :visible="evidenceSelectVisible"
      @close="evidenceSelectVisible = false"
    >
      <div class="add-evaluation-evidence-wrapper">
        <div class="slide-preview" v-if="currentEvidenceItem">
          <ppt-slide-view
            :selected-id-list="currentEvidenceItem.evidence.selectedList"
            :selected-id-student-list="currentEvidenceItem.evidence.selectedStudentList"
            :row-id="currentEvidenceItem.rowId"
            :form-id="currentActiveFormId"
            :class-id="classId"
            :slide-id="classInfo.slideId"
            :student-name="selectedMemberIdList.length ? selectedMemberIdList[0] : null"
            :mode="mode"
            @ensure-evidence-finish="handleEnsureEvidenceFinish"
            @add-evidence-finish="handleAddEvidenceFinish" />
          <template v-if="!classInfo || !classInfo.slideId">
            <no-more-resources tips="no slide" />
          </template>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>

import { formatLocalUTC } from '@/utils/util'
import EvaluationTable from '@/components/Evaluation/EvaluationTable'
import CommonFormHeader from '@/components/Common/CommonFormHeader'
import GrayIcon from '@/assets/svgIcon/evaluation/GrayIcon.svg?inline'
import PeerIcon from '@/assets/svgIcon/evaluation/PeerIcon.svg?inline'
import StudentIcon from '@/assets/svgIcon/evaluation/StudentIcon.svg?inline'
import TeacherIcon from '@/assets/svgIcon/evaluation/TeacherIcon.svg?inline'
import GroupIcon from '@/assets/svgIcon/evaluation/qunzu.svg?inline'
import ArrowDown from '@/assets/svgIcon/evaluation/arrow_down.svg?inline'
import ArrowTop from '@/assets/svgIcon/evaluation/arrow_top.svg?inline'
import ModalHeader from '@/components/Common/ModalHeader'
import {
  SaveSessionEvaluation,
  EvaluationQueryByIds,
  GetSessionEvaluationByClassId
} from '@/api/evaluation'
import SelectEvaluationList from '@/components/Evaluation/SelectEvaluationList'
import EvaluationTableType from '@/components/Evaluation/EvaluationTableType'
import EvaluationTableMode from '@/components/Evaluation/EvaluationTableMode'
import NoMoreResources from '@/components/Common/NoMoreResources'
import PptSlideView from '@/components/Evaluation/PptSlideView'
import { GetAssociate } from '@/api/teacher'
import { typeMap } from '@/const/teacher'

export default {
  name: 'ClassSessionEvaluation',
  components: {
    PptSlideView,
    NoMoreResources,
    SelectEvaluationList,
    EvaluationTable,
    CommonFormHeader,
    GrayIcon,
    PeerIcon,
    StudentIcon,
    TeacherIcon,
    GroupIcon,
    ArrowDown,
    ArrowTop,
    ModalHeader
  },
  props: {
    taskId: {
      type: String,
      required: true
    },
    classId: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      default: EvaluationTableMode.TeacherEvaluate
    }
  },
  computed: {
    lastChangeSavedTime () {
      const time = (this.form && this.form.evaluation && (this.form.evaluation.updateTime || this.form.evaluation.createTime))
      if (time) {
        return formatLocalUTC(this.form.evaluation.updateTime || this.form.evaluation.createTime)
      } else {
        return ''
      }
    },

    formBodyData () {
      if (this.currentActiveStudentId && this.currentActiveFormId && this.studentEvaluateData) {
        return this.studentEvaluateData[this.currentActiveStudentId][this.currentActiveFormId]
      } else {
        this.$logger.info('no formBodyData currentActiveFormId ' + this.currentActiveFormId + ' currentActiveStudentId ' + this.currentActiveStudentId, ' studentEvaluateData ', this.studentEvaluateData)
        return null
      }
    },

    isTeacher () {
      return this.$store.getters && this.$store.getters.roles && this.$store.getters.roles.includes('teacher')
    }
  },
  watch: {
    currentActiveFormId (formId) {
      this.$logger.info('update currentActiveFormId ' + formId)
      // 判断当前的formId是否是允许他评
      if (this.mode === EvaluationTableMode.PeerEvaluate && formId && this.studentEvaluateData) {
        this.allowPeerEvaluate = true
        this.allStudentUserIdList.forEach(studentId => {
          const currentFormData = this.studentEvaluateData[studentId][formId]
          const rowIdList = Object.keys(currentFormData)
          rowIdList.forEach(rowId => {
            const rowData = currentFormData[rowId]
            if (rowData && rowData.peerEmail && this.currentUserGroupUserIdList.indexOf(rowData.peerEmail) !== -1) {
              this.$logger.info('student ' + studentId + ' row ' + rowId + ' has peerEvaluation')
              this.allowPeerEvaluate = false
            }
          })
        })
      }
    }
  },
  data () {
    return {
      loading: true,
      isExistFormTable: false, // 是否已经添加过表格
      currentActiveFormId: null,
      form: { // 基础表单数据
        id: null,
        classId: '',
        name: '',
        className: '',
        forms: [],
        groups: [],
        updateTime: null,
        createTime: null,
        createBy: null,
        type: typeMap.classSessionEvaluation
      },

      // 班级信息
      classInfo: {
        classId: null,
        author: null, // 'yangxunwu@gmail.com',
        date: null, // 1636085002,
        status: null, // 'close',
        className: null, // '测试 课堂',
        type: null, // 'slide',
        fileName: null, // 'Untitled task',
        slideId: null, // '17kZYJTQTX6rOIhXhisTaE_5ocYILbTJfegW0QUzOnI0',
        lockPage: null, // null,
        responseLimitMode: null, // 1,
        responseLimitTime: null, // 1638201600,
        copyFrom: null // null
      },
      id: null,
      forms: [], // 评估表格数据
      oldFormsJson: null, // 保存旧的评估表格数据
      oldStudentEvaluationJson: null, // 保存旧的评估数据
      groups: [], // 班级分组信息

      selectedGroupIdList: [],
      studentList: [],
      selectedMemberIdList: [],
      selectedMemberNameList: [],
      selectedStudentNameList: [],
      EvaluationTableType: EvaluationTableType,
      EvaluationTableMode: EvaluationTableMode,

      groupNum: 0,
      memberNum: 0,

      selectRubricVisible: false,
      newFormType: EvaluationTableType.CenturySkills,
      rubricType: 'create',
      newTableName: '21st Century Skills',

      currentEditingTitle: null,
      currentFormItem: null,
      formTableMode: null,

      studentEvaluateData: {}, // 所有学生的评价数据对象，通过vue.$set设置属性，方便遍历对应的学生及表单数据
      currentActiveStudentId: null,

      allStudentUserIdList: [],
      evidenceSelectVisible: false,

      currentEvidenceItem: null,

      // 当前正在操作的小组id
      currentActiveGroupId: null,

      // 多选模式提示
      showMultiSelectedConfirm: false,

      formSaving: false,

      showEvaluationNoticeVisible: false,
      studentEvaluateIdList: [],
      peerEvaluateIdList: [],

      // 当前用户所在组，他评用
      currentUserGroupId: null,
      currentUserGroupUserIdList: [],
      allowPeerEvaluate: false,

      typeMap: typeMap,
      taskForms: [],

      evaluateStudentId: null, // 当前正在评估的学生id
      evaluateStudentName: null, // 当前正在评估的学生姓名

      isEmptyStudentEvaluateData: false,

      allStudentUserList: [],
      allNoGroupStudentUserIdList: [], // 所有未分组的学生邮箱列表
      allNoGroupStudentUserList: [], // 所有未分组的学生列表
      initCompleted: false
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$logger.info('beforeRouteLeave', to, from, next)
    this.$logger.info('forms', this.forms, 'oldFormsJson', this.oldFormsJson)
    this.$logger.info('studentEvaluateData', this.studentEvaluateData, 'oldStudentEvaluationJson', this.oldStudentEvaluationJson)
    if (this.initCompleted && (JSON.stringify(this.forms) !== this.oldFormsJson || JSON.stringify(this.studentEvaluateData) !== this.oldStudentEvaluationJson)) {
      this.$confirm({
        title: 'Alert',
        okText: 'Save',
        cancelText: 'No',
        content: 'Do you want to save the changes?',
        onOk: () => {
          this.handleSaveEvaluation()
          setTimeout(() => {
            next()
          }, 500)
        },
        onCancel() {
          next()
        }
      })
    } else {
      next()
    }
  },
  created () {
    this.$logger.info('[' + this.formTableMode + '] created ClassSessionEvaluation classId' + this.classId + ' taskId ' + this.taskId)
    this.formTableMode = this.mode

    const params = new URLSearchParams(document.location.search)
    this.evaluateStudentId = params.get('student-id')
    this.evaluateStudentName = params.get('student-name')
    this.$logger.info('evaluateStudentId ' + this.evaluateStudentId + ' evaluateStudentName ' + this.evaluateStudentName)

    this.initData()
    // 每次打开第一次提示多选模式
    window.sessionStorage.removeItem('multiConfirmVisible')
  },
  methods: {
    initData () {
      this.$logger.info('initData')
      this.loading = true

      // 加载task关联的evaluation表单数据
      this.$logger.info('ClassSessionEvaluation GetAssociate taskId ' + this.taskId)
      const associateEvaluationIdList = []
      GetAssociate({
        id: this.taskId,
        type: this.typeMap.task
      }).then(response => {
        this.$logger.info('ClassSessionEvaluation GetAssociate response', response)
        response.result.owner.forEach(item => {
          item.contents.forEach(content => {
            if (content.type === typeMap.evaluation) {
              associateEvaluationIdList.push(content.id)
            }
          })
        })

        response.result.others.forEach(item => {
          item.contents.forEach(content => {
            if (content.type === typeMap.evaluation) {
              associateEvaluationIdList.push(content.id)
            }
          })
        })
      }).finally(() => {
        this.$logger.info('associateEvaluationIdList ', associateEvaluationIdList)

        if (associateEvaluationIdList.length) {
          const forms = []
          EvaluationQueryByIds({ ids: associateEvaluationIdList }).then((response) => {
            this.$logger.info('associateEvaluationIdList EvaluationQueryByIds ', response)
            response.result.forEach(evaluationItem => {
              evaluationItem.forms.forEach(formItem => {
                forms.push({
                  title: formItem.title,
                  titleEditing: false,
                  comment: null,
                  formType: formItem.formType,
                  se: formItem.se,
                  pe: formItem.pe,
                  menuVisible: false,
                  id: null,
                  formId: formItem.formId,
                  initRawHeaders: JSON.parse(formItem.initRawHeaders),
                  initRawData: JSON.parse(formItem.initRawData)
                })
              })
            })
          }).then(() => {
            this.taskForms = forms
            this.$logger.info('taskForms', this.taskForms)
            this.loadClassSessionEvaluationData()
          })
        } else {
          this.loadClassSessionEvaluationData()
        }

        this.initCompleted = true
      })
    },

    loadClassSessionEvaluationData () {
      GetSessionEvaluationByClassId({ classId: this.classId }).then(response => {
        this.$logger.info('init data response', response)
        // 加载班级信息数据
        this.$logger.info('GetSessionEvaluationByClassId response', response.result)
        // 所有的学生id用于遍历构造学生评价数据 "对象"
        if (response.result && response.result.evaluation && response.result.evaluation.id) {
          this.id = response.result.evaluation.id
        }
        const allGroupStudentUserIdList = []

        const data = response.result
        this.classInfo = data.classInfo
        data.groups.forEach(group => {
          group.expand = true // 默认分组展开显示
          group.members.forEach(member => {
            allGroupStudentUserIdList.push(member.userId)
            if (member.userId === this.evaluateStudentId) {
              this.currentUserGroupId = group.id
              this.currentUserGroupUserIdList = group.members.map(member => member.userId)
              this.$logger.info('currentUserGroupId' + this.currentUserGroupId, 'currentUserGroupUserIdList', this.currentUserGroupUserIdList)
            }
          })
        })

        // 遍历所有学生，找出不存在分组中的
        this.allNoGroupStudentUserIdList = []
        this.allNoGroupStudentUserList = []
        if (data.classMembersVos && data.classMembersVos.length) {
          data.classMembersVos.forEach(item => {
            item.userId = item.email
          })
          this.$logger.info('formatted classMembersVos', data.classMembersVos)
          data.classMembersVos.forEach(studentItem => {
            if (allGroupStudentUserIdList.indexOf(studentItem.userId) === -1) {
              this.allNoGroupStudentUserIdList.push(studentItem.userId)
              this.allNoGroupStudentUserList.push(studentItem)
            }
          })
          this.allStudentUserList = data.classMembersVos
          this.allStudentUserList.forEach(studentItem => {
            this.allStudentUserIdList.push(studentItem.userId)
          })
        }
        this.$logger.info('allNoGroupStudentUserIdList', this.allNoGroupStudentUserIdList)

        // 使用班级信息填充表单基础信息，保持header显示的按钮标题兼容显示
        if (data.classInfo && !data.evaluation) {
          this.form.name = data.classInfo.fileName
          this.form.className = data.classInfo.className
          this.form.createBy = data.classInfo.author
          this.form.createTime = new Date(data.classInfo.date * 1000)
          this.form.type = typeMap.classSessionEvaluation
          this.$logger.info('init form data', this.form)
        }

        const allStudentUserIdList = this.allStudentUserIdList
        this.groups = data.groups
        if (data.evaluation) {
          this.form = Object.assign(this.form, data.evaluation)

          data.evaluation.forms.forEach(formItem => {
            this.forms.push({
              title: formItem.title,
              titleEditing: false,
              formType: formItem.formType,
              se: formItem.se,
              pe: formItem.pe,
              menuVisible: false,
              id: formItem.id,
              formId: formItem.formId,
              initRawHeaders: JSON.parse(formItem.initRawHeaders),
              initRawData: JSON.parse(formItem.initRawData)
            })
          })

          this.$logger.info('forms', this.forms)
          this.oldFormsJson = JSON.stringify(this.forms)

          // forms为空那么数据已经失效
          if (!this.forms.length) {
            data.evaluation.studentEvaluateData = null
          }
        }

        if (!this.forms || this.forms.length === 0) {
          this.forms = this.taskForms
          this.$logger.info('forms empty, use task forms as forms', this.forms)
        }

        if (this.forms.length) {
          this.currentActiveFormId = this.forms[0].formId
        }

        this.$logger.info('allStudentUserIdList', this.allStudentUserIdList)

        // 初始化评估数据，构造遍历所有学生的评价数据对象，更具对象索引到具体表单的某一行的点评数据
        let isEmptyStudentEvaluateData = false
        if (data.evaluation && data.evaluation.studentEvaluateData) {
          const evaluateDataObj = JSON.parse(data.evaluation.studentEvaluateData)
          const userIds = Object.keys(evaluateDataObj)
          if (userIds.length === 0) {
            isEmptyStudentEvaluateData = true
          } else {
            userIds.forEach(userId => {
              if (evaluateDataObj.hasOwnProperty(userId) && Object.keys(evaluateDataObj[userId]).length === 0) {
                isEmptyStudentEvaluateData = true
              }
            })
          }
        } else {
          isEmptyStudentEvaluateData = true
        }

        this.isEmptyStudentEvaluateData = isEmptyStudentEvaluateData
        this.$logger.info('isEmptyStudentEvaluateData ' + isEmptyStudentEvaluateData, data.evaluation)
        if (!isEmptyStudentEvaluateData) {
          this.studentEvaluateData = JSON.parse(data.evaluation.studentEvaluateData)
          this.oldStudentEvaluationJson = data.evaluation.studentEvaluateData
          if (allStudentUserIdList.length && this.mode !== EvaluationTableMode.Edit && this.formTableMode !== EvaluationTableMode.Preview) {
            this.currentActiveStudentId = allStudentUserIdList[0]
            this.selectedMemberIdList.push(this.currentActiveStudentId)
          }
          this.$logger.info('restore studentEvaluateData', this.studentEvaluateData)
        } else if (allStudentUserIdList.length && this.forms.length) {
          // 初始化学生表格数据, studentEvaluateData[学生Id][表单Id][列Id] = 列数据
          const studentEvaluateData = {}
          allStudentUserIdList.forEach(studentId => {
            studentEvaluateData[studentId] = {}
            this.forms.forEach(formItem => {
              studentEvaluateData[studentId][formItem.formId] = {
                comment: null
              }
              formItem.initRawData.forEach(rowItem => {
                studentEvaluateData[studentId][formItem.formId][rowItem.rowId] = {
                  teacherEvaluation: null, // 老师评价
                  teacherName: null, // 老师评价
                  teacherEmail: null, // 老师评价

                  peerEvaluation: null, // 他人评价
                  peerName: null, // 他人评价
                  peerEmail: null, // 他人评价

                  studentEvaluation: null, // 学生自评
                  studentName: null, // 学生自评
                  studentEmail: null, // 学生自评

                  data: null, // subLevel数据

                  evidenceIdList: [], // ppt证据pageId列表
                  evidenceIdStudentList: [] // ppt证据pageId列表-学生选择
                }
              })
            })
          })

          this.$logger.info('studentEvaluateData init finished ', studentEvaluateData)
          this.studentEvaluateData = studentEvaluateData
          this.oldStudentEvaluationJson = JSON.stringify(studentEvaluateData)

          if (this.mode !== EvaluationTableMode.Edit && this.formTableMode === EvaluationTableMode.Preview) {
            // 默认选中第一个学生的第一个评估表格
            this.currentActiveStudentId = allGroupStudentUserIdList[0]
            this.selectedMemberIdList.push(this.currentActiveStudentId)
            this.$logger.info('currentActiveFormId ' + this.currentActiveFormId + ' currentActiveStudentId ' + this.currentActiveStudentId)
          }

          // 老师评估模式默认选中第一个学生
          if (this.mode === EvaluationTableMode.TeacherEvaluate) {
            this.currentActiveStudentId = allStudentUserIdList[0]
            this.selectedMemberIdList.push(this.currentActiveStudentId)
          }
        }

        // 表单数据赋值
        this.form.className = this.classInfo.className
        this.form.type = typeMap.classSessionEvaluation
      }).finally(() => {
        if ((!this.forms || this.forms.length === 0) && this.mode === EvaluationTableMode.Edit) {
          this.selectRubricVisible = true
        }

        if (this.mode === EvaluationTableMode.StudentEvaluate) {
          this.$logger.info('StudentEvaluate try fix currentActiveStudentId ' + this.evaluateStudentId, 'allGroupStudentUserIdList', this.allGroupStudentUserIdList)
          if (this.allStudentUserIdList.indexOf(this.evaluateStudentId) === -1) {
            this.$logger.info('current use email ' + (this.evaluateStudentId) + ' not exist in ', this.allStudentUserIdList, ' cannot student evaluate')
            this.$confirm({
              content: 'You are not in the student list of the current class and cannot evaluate !'
            })
          } else {
            this.currentActiveStudentId = this.evaluateStudentId
            this.selectedMemberIdList = [this.evaluateStudentId]
          }

          this.currentActiveStudentId = this.evaluateStudentId
          this.selectedMemberIdList = [this.evaluateStudentId]
        }

        // 检查是否以及评估过了，有过评估数据不允许再评估。查找PeerEmail字段中是否有在currentUserGroupUserIdList中存在，有代表有过评估
        if (this.mode === EvaluationTableMode.PeerEvaluate) {
          this.allowPeerEvaluate = true
          this.allStudentUserIdList.forEach(studentId => {
            const currentFormData = this.studentEvaluateData[studentId][this.currentActiveFormId]
            const rowIdList = Object.keys(currentFormData)
            rowIdList.forEach(rowId => {
              const rowData = currentFormData[rowId]
              this.$logger.info('currentFormData', currentFormData, 'rowId', rowData)
              if (rowData && rowData.peerEmail && this.currentUserGroupUserIdList.indexOf(rowData.peerEmail) !== -1) {
                this.$logger.info('student ' + studentId + ' row ' + rowId + ' has peerEvaluation')
                this.allowPeerEvaluate = false
              }
            })
          })
        }
        this.loading = false
      })
    },

    handleActiveForm (idx, formItem) {
      this.$logger.info('handleActiveForm ' + idx, formItem)
      if (this.currentActiveFormId !== formItem.formId) {
        this.currentActiveFormId = formItem.formId
      }
    },
    handleClickMember (group, member) {
      this.$logger.info('handleClickMember', 'group', group, 'member', member, 'selectedMemberIdList', this.selectedMemberIdList)
      // 只允许老师和他评选择其他人
      if (this.mode === EvaluationTableMode.TeacherEvaluate) {
        const index = this.selectedMemberIdList.indexOf(member.userId)
        this.$logger.info('handleClickMember index ' + index)
        if (index === -1) {
          if (group) {
            // 添加操作，只保留当前组内的选中人员，筛选掉其他小组人员
            const memberIdList = [member.userId]
            group.members.forEach(member => {
              if (this.selectedMemberIdList.indexOf(member.userId) !== -1 && memberIdList.indexOf(member.userId) === -1) {
                memberIdList.push(member.userId)
              }
            })
            this.selectedMemberIdList = memberIdList
            this.currentActiveStudentId = member.userId

            // 如果当前操作的组与选中的组不是一个组，取消选中的组
            if (this.selectedGroupIdList.indexOf(group.id) === -1) {
              this.selectedGroupIdList = []
            }
            this.currentActiveGroupId = group.id
          } else {
            this.selectedMemberIdList = [member.userId]
            this.currentActiveStudentId = member.userId
            this.selectedGroupIdList = []
          }

          // 当从单选到多选，提示老师当前正在对多个学生进行评估数据会覆盖
          if (this.selectedMemberIdList.length === 2) {
            const memberNameList = []
            group.members.forEach(member => {
              if (this.selectedMemberIdList.indexOf(member.userId) !== -1) {
                memberNameList.push(member.realName)
              }
            })
            this.selectedMemberNameList = memberNameList
            const confirmVisible = window.sessionStorage.getItem('multiConfirmVisible')
            this.$logger.info('confirmVisible ' + confirmVisible)
            if (!confirmVisible) {
              this.showMultiSelectedConfirm = true
            }
          }
        } else {
          // 取消操作
          const newSelectedMemberIdList = []
          this.selectedMemberIdList.forEach(memberId => {
            if (memberId !== member.userId) {
              newSelectedMemberIdList.push(memberId)
            }
          })
          this.selectedMemberIdList = newSelectedMemberIdList
          if (this.selectedMemberIdList.length) {
            this.currentActiveStudentId = this.selectedMemberIdList[0]
          } else {
            this.currentActiveStudentId = null
          }
        }
        this.$logger.info('currentActiveGroupId ' + this.currentActiveFormId + ' selectedMemberIdList ', this.selectedMemberIdList)
      } else if (this.mode === EvaluationTableMode.PeerEvaluate) {
        if (!this.allowPeerEvaluate) {
          this.$message.warn('You have evaluated!')
          this.currentActiveStudentId = member.userId
        } else if (!group || this.currentUserGroupUserIdList.indexOf(member.userId) !== -1) {
          this.$message.warn('Not allowed to evaluate for this student!')
        }
      }
    },

    // 只允许选择一个小组
    handleSelectGroup (group) {
      this.$logger.info('handleSelectGroup', group)

      // 只允许老师和他评选择小组
      if (this.mode === EvaluationTableMode.TeacherEvaluate || this.mode === EvaluationTableMode.PeerEvaluate) {
        if (this.mode === EvaluationTableMode.PeerEvaluate && group.id === this.currentUserGroupId) {
          this.$message.warn('You are not allowed to evaluate your group!')
        } else if (this.mode === EvaluationTableMode.PeerEvaluate && !this.allowPeerEvaluate) {
          this.$message.warn('You have evaluated!')
        } else {
          const index = this.selectedGroupIdList.indexOf(group.id)
          if (index === -1) {
            this.selectedGroupIdList = [group.id]

            // 添加操作，只保留当前组内的选中人员，筛选掉其他小组人员
            const memberIdList = []
            const memberNameList = []
            group.members.forEach(member => {
              memberIdList.push(member.userId)
              memberNameList.push(member.realName)
            })

            this.selectedMemberNameList = memberNameList
            this.selectedMemberIdList = memberIdList

            if (this.selectedMemberNameList.length > 1) {
              const confirmVisible = window.sessionStorage.getItem('multiConfirmVisible')
              this.$logger.info('confirmVisible ' + confirmVisible)
              if (!confirmVisible) {
                this.showMultiSelectedConfirm = true
              }
            }
            this.currentActiveStudentId = this.selectedMemberNameList[0]
            this.currentActiveGroupId = group.id
          } else {
            // 取消小组选择时，把已选择人员清空
            this.selectedMemberIdList = []
            this.selectedGroupIdList = []
            this.currentActiveStudentId = null
            this.currentActiveGroupId = null
          }
          this.$logger.info('handleSelectGroup selectedMemberIdList', this.selectedMemberIdList)
        }
      } else {
        this.$logger.info('current mode ' + this.mode + ' ignore it!')
      }
    },

    handleToggleGroupExpand (group, event) {
      event.stopPropagation()
      event.preventDefault()
      this.$logger.info('handleToggleGroupExpand', group)
      group.expand = !group.expand
    },

    handleAddFormTable () {
      this.$logger.info('handleAddFormTable')
      const count = this.forms.length + 1
      this.newTableName = 'Rubric ' + count
      this.newFormType = EvaluationTableType.Rubric_2
      this.selectRubricVisible = true
    },

    handleCancelSelectRubric () {
      this.$logger.info('handleCancelSelectRubric ' + this.newFormType)
      this.selectRubricVisible = false
    },

    handleEnsureSelectRubric () {
      this.$logger.info('handleEnsureSelectRubric ' + this.newFormType)
      if (this.newFormType) {
        this.selectRubricVisible = false
        const existFormTitleList = []
        const existFormIdList = []
        this.forms.forEach(item => {
          existFormTitleList.push(item.title)
          existFormIdList.push(item.formId)
        })

        // 给还未保存的表格生成一个唯一的名称和自定义id，自定义id在提交时需要删掉
        let count = this.forms.length + 1
        let selfTitle = this.newTableName ? this.newTableName : 'Rubric ' + count
        let selfId = 'ext_' + Math.random(1000000000, 9999999999)
        while (existFormTitleList.indexOf(selfTitle) !== -1) {
          count++
          selfTitle = 'Rubric ' + count
        }

        while (existFormIdList.indexOf(selfId) !== -1) {
          count++
          selfId = 'ext_' + Math.random(1000000000, 9999999999)
        }

        const newFormTable = {
          title: selfTitle,
          titleEditing: false,
          formType: this.newFormType,
          se: 0,
          pe: 0,
          menuVisible: false,
          comment: null,
          id: null,
          formId: selfId,
          tableData: {
            initRawHeaders: [],
            initRawData: []
          }
        }
        this.$logger.info('newFormTable', newFormTable)
        this.forms.push(newFormTable)
        this.currentActiveFormId = newFormTable.formId
      } else {
        this.$message.warn('Choose rubric format!')
      }
    },

    handleEditFormTitle (formItem) {
      this.$logger.info('handleEditFormTitle', formItem)
      if (this.mode === EvaluationTableMode.Edit) {
        if (this.currentFormItem) {
          this.currentFormItem.titleEditing = false
          this.currentFormItem = null
        }
        this.currentEditingTitle = formItem.title
        formItem.titleEditing = true
        this.currentFormItem = formItem
      }
    },

    handleEnsureUpdateFormTitle () {
      this.$logger.info('handleEnsureUpdateFormTitle', this.currentEditingTitle)
      this.currentFormItem.title = this.currentEditingTitle
      this.currentFormItem.titleEditing = false
    },

    handleEnsureSelectEvaluation (data) {
      this.$logger.info('handleEnsureSelectEvaluation', data)
      const evaluationIdList = data.evaluationIdList
      const refFormList = data.selectedFormList

      if (evaluationIdList && evaluationIdList.length) {
        EvaluationQueryByIds({ ids: evaluationIdList }).then((response) => {
          this.$logger.info('EvaluationQueryByIds', response)
          const evaluationList = response.result
          evaluationList.forEach(evaluationItem => {
            evaluationItem.forms.forEach(formItem => {
              const index = refFormList.findIndex(item => item.formId === formItem.formId)
              if (index === -1) {
                if (formItem.initRawHeaders && typeof formItem.initRawHeaders === 'string') {
                  formItem.initRawHeaders = JSON.parse(formItem.initRawHeaders)
                  formItem.initRawData = JSON.parse(formItem.initRawData)
                }
                refFormList.push(formItem)
              }
            })
          })

          const existFormIdList = []
          this.forms.forEach(item => {
            existFormIdList.push(item.formId)
          })

          // 重新生成formId，删除表格的Id字段
          let count = this.forms.length + 1
          let selfId = 'ext_' + Math.random(1000000000, 9999999999)

          refFormList.forEach(formItem => {
            while (existFormIdList.indexOf(selfId) !== -1) {
              count++
              selfId = 'ext_' + Math.random(1000000000, 9999999999)
            }
            existFormIdList.push(selfId)
            formItem.id = null
            formItem.formId = selfId
            formItem.title = 'evaluation of task/session ' + count
          })

          // 处理新增表单
          this.allStudentUserIdList.forEach(studentId => {
            refFormList.forEach(formItem => {
              let formData = {}
              formData = {
                comment: null
              }
              formItem.initRawData.forEach(rowItem => {
                formData[rowItem.rowId] = {
                  teacherEvaluation: null, // 老师评价
                  teacherName: null, // 老师评价
                  teacherEmail: null, // 老师评价

                  peerEvaluation: null, // 他人评价
                  peerName: null, // 他人评价
                  peerEmail: null, // 他人评价

                  studentEvaluation: null, // 学生自评
                  studentName: null, // 学生自评
                  studentEmail: null, // 学生自评

                  data: null,

                  evidenceIdList: [], // ppt证据pageId列表
                  evidenceIdStudentList: [] // ppt证据pageId列表-学生选择
                }
              })
              this.$set(this.studentEvaluateData[studentId], formItem.formId, formData)
              this.$logger.info('formId ' + formItem.formId, this.studentEvaluateData[studentId])
            })
          })

          refFormList.forEach(formItem => {
            this.forms.push(formItem)
            this.$logger.info('forms add ' + formItem.formId, formItem)
          })
          this.$logger.info('forms', this.forms)
        })
      } else if (refFormList.length) {
        const existFormIdList = []
        this.forms.forEach(item => {
          existFormIdList.push(item.formId)
        })

        // 重新生成formId，删除表格的Id字段
        let count = this.forms.length + 1
        let selfId = 'ext_' + Math.random(1000000000, 9999999999)

        refFormList.forEach(formItem => {
          while (existFormIdList.indexOf(selfId) !== -1) {
            count++
            selfId = 'ext_' + Math.random(1000000000, 9999999999)
          }
          existFormIdList.push(selfId)
          formItem.id = null
          formItem.formId = selfId
          formItem.title = 'evaluation of task/session ' + count
        })

        // 处理新增表单
        this.allStudentUserIdList.forEach(studentId => {
          refFormList.forEach(formItem => {
            let formData = {}
            formData = {
              comment: null
            }
            formItem.initRawData.forEach(rowItem => {
              formData[rowItem.rowId] = {
                teacherEvaluation: null, // 老师评价
                teacherName: null, // 老师评价
                teacherEmail: null, // 老师评价

                peerEvaluation: null, // 他人评价
                peerName: null, // 他人评价
                peerEmail: null, // 他人评价

                studentEvaluation: null, // 学生自评
                studentName: null, // 学生自评
                studentEmail: null, // 学生自评

                data: null,

                evidenceIdList: [], // ppt证据pageId列表
                evidenceIdStudentList: [] // ppt证据pageId列表-学生选择
              }
            })
            this.$set(this.studentEvaluateData[studentId], formItem.formId, formData)
            this.$logger.info('formId ' + formItem.formId, this.studentEvaluateData[studentId])
          })
        })

        refFormList.forEach(formItem => {
          this.forms.push(formItem)
          this.$logger.info('forms add ' + formItem.formId, formItem)
        })
        this.$logger.info('forms', this.forms)
      }
      this.selectRubricVisible = false
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
    },
    // switchEvaluate标识是否跳转到评估页面，true为跳转，false为不跳转
    handleSaveEvaluation (switchEvaluate) {
      this.$logger.info('handleSaveEvaluation', this.forms)

      if (!this.isEmptyStudentEvaluateData && this.mode === EvaluationTableMode.Edit) {
        this.$info({
          title: 'Notice',
          content: 'After modifying the form, all student evaluation data will be cleared',
          onOk: () => {
            this.formSaving = true
            this.showEvaluationNoticeVisible = false

            // 获取所有的表格结构（表头+表内容）
            const formDataList = []
            this.$refs.evaluationTable.forEach(tableItem => {
              const tableData = tableItem.getTableStructData()
              this.$logger.info('getTableStructData ', tableData, 'header', tableData.headers, 'row list', tableData.list)
              this.forms.forEach(formItem => {
                if (formItem.formId === tableData.formId) {
                  const formData = {
                    id: formItem.id,
                    formId: formItem.formId,
                    formType: formItem.formType,
                    title: formItem.title,
                    initRawHeaders: JSON.stringify(tableData.headers),
                    initRawData: JSON.stringify(tableData.list),
                    pe: formItem.pe,
                    se: formItem.se
                  }
                  formDataList.push(formData)
                }
              })
            })
            this.$logger.info('formDataList', formDataList, 'this.form', this.form, 'this.classId', this.classId)
            this.form.classId = this.classId
            this.form.forms = formDataList
            // 获取评估数据
            this.$logger.info('!!!!!!!!!!!!!!!!!! studentEvaluateData !!!!!!!!!!!', this.studentEvaluateData)
            this.form.studentEvaluateData = '{}'

            if (formDataList.length === 0) {
              this.$message.error('Please add at least one form!')
              this.formSaving = false
              if (switchEvaluate) {
                this.goEvaluatePage()
              }
              return false
            } else {
              if (this.id) {
                this.form.id = this.id
              }
              SaveSessionEvaluation(this.form).then((response) => {
                this.$logger.info('SaveSessionEvaluation', response)
                if (response.result && response.result.id) {
                  this.id = response.result.id
                }
                this.$message.success('Save successfully!')
                this.formSaving = false
              }).then(() => {
                let currentForm = this.forms.filter(item => item.formId === this.currentActiveFormId)
                this.$logger.info('currentForm', currentForm)
                if (currentForm.length) {
                  currentForm = currentForm[0]
                } else {
                  currentForm = null
                }
                if (this.mode === EvaluationTableMode.TeacherEvaluate && currentForm && (currentForm.pe || currentForm.se)) {
                  GetSessionEvaluationByClassId({ classId: this.classId }).then(response => {
                    this.$logger.info('after SaveSessionEvaluation GetSessionEvaluationByClassId', response)
                    if (response.result && response.result.evaluation && response.result.evaluation.id) {
                      this.id = response.result.evaluation.id
                    }

                    const data = response.result
                    if (data.evaluation && data.evaluation.studentEvaluateData) {
                      const evaluateDataObj = JSON.parse(data.evaluation.studentEvaluateData)
                      const userIds = Object.keys(evaluateDataObj)

                      this.studentEvaluateIdList = []
                      this.peerEvaluateIdList = []
                      const studentEvaluateIdList = []
                      const peerEvaluateIdList = []

                      userIds.forEach(userId => {
                        this.$logger.info('userId ' + userId, evaluateDataObj[userId])
                        const studentData = evaluateDataObj[userId]
                        const formData = studentData[this.currentActiveFormId]
                        this.$logger.info('user form data', formData)

                        // 统计是否自评
                        const rowKeys = Object.keys(formData)
                        rowKeys.forEach(rowId => {
                          if (rowId.startsWith('row_')) {
                            // 如果学生有过自评
                            if (studentEvaluateIdList.indexOf(userId) === -1 && !!formData[rowId].studentEvaluation) {
                              studentEvaluateIdList.push(userId)
                            }
                            // 如果学生有被他评，记录下他评的邮箱
                            if (peerEvaluateIdList.indexOf(userId) === -1 && !!formData[rowId].peerEvaluation) {
                              peerEvaluateIdList.push(formData[rowId].peerEmail)
                            }
                          }
                        })
                      })

                      this.$logger.info('studentEvaluateIdList', studentEvaluateIdList, 'peerEvaluateIdList', peerEvaluateIdList)
                      this.studentEvaluateIdList = studentEvaluateIdList
                      this.peerEvaluateIdList = peerEvaluateIdList
                      this.showEvaluationNoticeVisible = true
                    }
                  })
                }
              }).finally(() => {
                if (switchEvaluate) {
                  this.goEvaluatePage()
                }
              })
            }
          }
        })
      } else {
        this.formSaving = true
        this.showEvaluationNoticeVisible = false

        // 获取所有的表格结构（表头+表内容）
        const formDataList = []
        this.$refs.evaluationTable.forEach(tableItem => {
          const tableData = tableItem.getTableStructData()
          this.$logger.info('getTableStructData ', tableData, 'header', tableData.headers, 'row list', tableData.list)
          this.forms.forEach(formItem => {
            if (formItem.formId === tableData.formId) {
              const formData = {
                id: formItem.id,
                formId: formItem.formId,
                formType: formItem.formType,
                title: formItem.title,
                initRawHeaders: JSON.stringify(tableData.headers),
                initRawData: JSON.stringify(tableData.list),
                pe: formItem.pe,
                se: formItem.se
              }
              formDataList.push(formData)
            }
          })
        })
        this.$logger.info('formDataList', formDataList, 'this.form', this.form, 'this.classId', this.classId)
        this.form.classId = this.classId
        this.form.forms = formDataList
        // 获取评估数据
        this.$logger.info('!!!!!!!!!!!!!!!!!! studentEvaluateData !!!!!!!!!!!', this.studentEvaluateData)
        this.form.studentEvaluateData = JSON.stringify(this.studentEvaluateData)

        if (formDataList.length === 0) {
          this.$message.error('Please add at least one form!')
          this.formSaving = false
          if (switchEvaluate) {
            this.goEvaluatePage()
          }
          return false
        } else {
          if (this.id) {
            this.form.id = this.id
          }
          SaveSessionEvaluation(this.form).then((response) => {
            this.$logger.info('SaveSessionEvaluation', response)
            if (response.result && response.result.id) {
              this.id = response.result.id
            }
            this.$message.success('Save successfully!')
            this.formSaving = false
          }).then(() => {
            let currentForm = this.forms.filter(item => item.formId === this.currentActiveFormId)
            this.$logger.info('currentForm', currentForm)
            if (currentForm.length) {
              currentForm = currentForm[0]
            } else {
              currentForm = null
            }
            if (this.mode === EvaluationTableMode.TeacherEvaluate && currentForm && (currentForm.pe || currentForm.se)) {
              GetSessionEvaluationByClassId({ classId: this.classId }).then(response => {
                this.$logger.info('after SaveSessionEvaluation GetSessionEvaluationByClassId', response)
                if (response.result && response.result.evaluation && response.result.evaluation.id) {
                  this.id = response.result.evaluation.id
                }

                const data = response.result
                if (data.evaluation && data.evaluation.studentEvaluateData) {
                  const evaluateDataObj = JSON.parse(data.evaluation.studentEvaluateData)
                  const userIds = Object.keys(evaluateDataObj)

                  this.studentEvaluateIdList = []
                  this.peerEvaluateIdList = []
                  const studentEvaluateIdList = []
                  const peerEvaluateIdList = []

                  userIds.forEach(userId => {
                    this.$logger.info('userId ' + userId, evaluateDataObj[userId])
                    const studentData = evaluateDataObj[userId]
                    const formData = studentData[this.currentActiveFormId]
                    this.$logger.info('user form data', formData)

                    // 统计是否自评
                    const rowKeys = Object.keys(formData)
                    rowKeys.forEach(rowId => {
                      if (rowId.startsWith('row_')) {
                        // 如果学生有过自评
                        if (studentEvaluateIdList.indexOf(userId) === -1 && !!formData[rowId].studentEvaluation) {
                          studentEvaluateIdList.push(userId)
                        }
                        // 如果学生有被他评，记录下他评的邮箱
                        if (peerEvaluateIdList.indexOf(userId) === -1 && !!formData[rowId].peerEvaluation) {
                          peerEvaluateIdList.push(formData[rowId].peerEmail)
                        }
                      }
                    })
                  })

                  this.$logger.info('studentEvaluateIdList', studentEvaluateIdList, 'peerEvaluateIdList', peerEvaluateIdList)
                  this.studentEvaluateIdList = studentEvaluateIdList
                  this.peerEvaluateIdList = peerEvaluateIdList
                  this.showEvaluationNoticeVisible = true
                }
              })
            }
          }).finally(() => {
            if (switchEvaluate) {
              this.goEvaluatePage()
            }
          })
        }
      }
    },

    goEvaluatePage () {
      // window.location.pathname = '/teacher/class-evaluation/' + this.taskId + '/' + this.classId + '/teacher-evaluate'
    },
    handleSaveAndBackEvaluation () {
      this.$logger.info('handleSaveAndBackEvaluation', this.forms)

      if (!this.isEmptyStudentEvaluateData && this.mode === EvaluationTableMode.Edit) {
        this.$info({
          title: 'Notice',
          content: 'After modifying the form, all student evaluation data will be cleared',
          onOk: () => {
            this.$logger.info('handleSaveAndBackEvaluation onOk')
            this.formSaving = true
            this.showEvaluationNoticeVisible = false

            // 获取所有的表格结构（表头+表内容）
            const formDataList = []
            this.$refs.evaluationTable.forEach(tableItem => {
              const tableData = tableItem.getTableStructData()
              this.$logger.info('getTableStructData ', tableData, 'header', tableData.headers, 'row list', tableData.list)
              this.forms.forEach(formItem => {
                if (formItem.formId === tableData.formId) {
                  const formData = {
                    id: formItem.id,
                    formId: formItem.formId,
                    formType: formItem.formType,
                    title: formItem.title,
                    initRawHeaders: JSON.stringify(tableData.headers),
                    initRawData: JSON.stringify(tableData.list),
                    pe: formItem.pe,
                    se: formItem.se
                  }
                  formDataList.push(formData)
                }
              })
            })
            this.$logger.info('formDataList', formDataList, 'this.form', this.form, 'this.classId', this.classId)
            this.form.classId = this.classId
            this.form.forms = formDataList
            // 获取评估数据
            this.$logger.info('!!!!!!!!!!!!!!!!!! studentEvaluateData !!!!!!!!!!!', this.studentEvaluateData)
            this.form.studentEvaluateData = '{}'

            if (formDataList.length === 0) {
              this.$message.error('Please add at least one form!')
              this.formSaving = false
              return false
            } else {
              if (this.id) {
                this.form.id = this.id
              }
              SaveSessionEvaluation(this.form).then((response) => {
                this.$logger.info('SaveSessionEvaluation', response)
                if (response.result && response.result.id) {
                  this.id = response.result.id
                }
                if (response.success) {
                  this.$message.success('Save successfully!')
                  this.formSaving = false
                  this.$router.push({ path: '/teacher/main/created-by-me' })
                } else {
                  this.$message.error(response.message)
                }
              })
            }
          }
        })
      } else {
        this.formSaving = true
        this.showEvaluationNoticeVisible = false

        // 获取所有的表格结构（表头+表内容）
        const formDataList = []
        this.$refs.evaluationTable.forEach(tableItem => {
          const tableData = tableItem.getTableStructData()
          this.$logger.info('getTableStructData ', tableData, 'header', tableData.headers, 'row list', tableData.list)
          this.forms.forEach(formItem => {
            if (formItem.formId === tableData.formId) {
              const formData = {
                id: formItem.id,
                formId: formItem.formId,
                formType: formItem.formType,
                title: formItem.title,
                initRawHeaders: JSON.stringify(tableData.headers),
                initRawData: JSON.stringify(tableData.list),
                pe: formItem.pe,
                se: formItem.se
              }
              formDataList.push(formData)
            }
          })
        })
        this.$logger.info('formDataList', formDataList, 'this.form', this.form, 'this.classId', this.classId)
        this.form.classId = this.classId
        this.form.forms = formDataList
        // 获取评估数据
        this.$logger.info('!!!!!!!!!!!!!!!!!! studentEvaluateData !!!!!!!!!!!', this.studentEvaluateData)
        this.form.studentEvaluateData = JSON.stringify(this.studentEvaluateData)

        if (formDataList.length === 0) {
          this.$message.error('Please add at least one form!')
          this.formSaving = false
          return false
        } else {
          if (this.id) {
            this.form.id = this.id
          }
          SaveSessionEvaluation(this.form).then((response) => {
            this.$logger.info('SaveSessionEvaluation', response)
            if (response.result && response.result.id) {
              this.id = response.result.id
            }
            if (response.success) {
              this.$message.success('Save successfully!')
              this.formSaving = false
              this.$router.push({ path: '/teacher/main/created-by-me' })
            } else {
              this.$message.error(response.message)
            }
          })
        }
      }
    },

    handleSaveCurrentEvaluation () {
      this.$logger.info('handleSaveCurrentEvaluation')
      this.showEvaluationNoticeVisible = false
      setTimeout(() => {
        this.studentEvaluateIdList = []
        this.peerEvaluateIdList = []
        this.$logger.info('studentEvaluateIdList', this.studentEvaluateIdList, 'peerEvaluateIdList', this.peerEvaluateIdList)
      }, 5000)
    },

    handleContinueToEdit () {
      this.$logger.info('handleContinueToEdit')
      this.showEvaluationNoticeVisible = false
      this.handleToggleMode()

      setTimeout(() => {
        this.studentEvaluateIdList = []
        this.peerEvaluateIdList = []
        this.$logger.info('studentEvaluateIdList', this.studentEvaluateIdList, 'peerEvaluateIdList', this.peerEvaluateIdList)
      }, 5000)
    },

    handlePublishEvaluation () {
    },

    // 修改表头数据处理
    handleUpdateForm (data) {
      this.$logger.info('handleUpdateForm', data)
      this.form.name = data.name
    },

    handleSelectRubric (newFormType) {
      this.$logger.info('handleSelectRubric newFormType ' + newFormType)
      this.newFormType = newFormType
      if (newFormType === EvaluationTableType.Rubric) {
        this.newTableName = 'Rubric ' + (this.forms.length + 1)
      } else if (newFormType === EvaluationTableType.Rubric_2) {
        this.newTableName = 'Rubric ' + (this.forms.length + 1)
      } else if (newFormType === EvaluationTableType.CenturySkills) {
        this.newTableName = '21st Century Skills ' + (this.forms.length + 1)
      }
      this.$logger.info('newTableName', this.newTableName)
    },

    handleDeleteForm (formItem) {
      this.$logger.info('handleDeleteForm', formItem)
      const forms = []
      this.forms.forEach(form => {
        if (form.formId !== formItem.formId) {
          forms.push(form)
        }
      })
      this.forms = forms
      if (this.forms.length) {
        this.currentActiveFormId = this.forms[this.forms.length - 1].formId
      }

      this.allStudentUserIdList.forEach(studentId => {
        this.$delete(this.studentEvaluateData[studentId], formItem.formId)
      })

      this.$logger.info('after delete ' + formItem.formId, this.studentEvaluateData)
      this.$logger.info('after delete forms' + formItem.formId, this.forms)
    },

    handleToggleStudentEvaluation (formItem) {
      this.$logger.info('handleToggleStudentEvaluation', formItem)
      formItem.menuVisible = !formItem.menuVisible
    },

    handleTogglePeerEvaluation (formItem) {
      this.$logger.info('handleTogglePeerEvaluation', formItem)
      formItem.menuVisible = !formItem.menuVisible
    },

    handleToggleMenuVisible (formItem) {
      this.$logger.info('handleToggleMenuVisible', formItem)
      if (this.mode === EvaluationTableMode.Edit) {
        formItem.menuVisible = !formItem.menuVisible
      }
    },

    handleUpdateEvaluate (data) {
      this.$logger.info('handleUpdateEvaluate', data)
      this.$logger.info('before update studentEvaluateData', this.studentEvaluateData)
      if (this.mode === EvaluationTableMode.TeacherEvaluate ||
        this.mode === EvaluationTableMode.StudentEvaluate ||
        this.mode === EvaluationTableMode.PeerEvaluate) {
        // 更新当前选中的所有学生的对应的form的rowId的数据为对应列
        const allSelectedStudentUserId = []
        this.selectedMemberIdList.forEach(userId => {
          if (allSelectedStudentUserId.indexOf(userId) === -1) {
            allSelectedStudentUserId.push(userId)
          }
        })

        this.groups.forEach(group => {
          if (this.selectedGroupIdList.indexOf(group.id) !== -1) {
            group.members.forEach(member => {
              if (allSelectedStudentUserId.indexOf(member.userId) === -1) {
                allSelectedStudentUserId.push(member.userId)
              }
            })
          }
        })
        this.$logger.info('all selected member userId ', allSelectedStudentUserId)
        // 遍历所有当前选中的用户，设置对应的选中的用-对应的表单-对应的行-对应的列-对应的评估数据
        allSelectedStudentUserId.forEach(userId => {
          this.$logger.info(data.evaluationMode + ' studentEvaluateData userId ' + userId, this.studentEvaluateData[userId])
          this.$logger.info(data.evaluationMode + ' studentEvaluateData formId ' + data.formId, this.studentEvaluateData[userId][data.formId])
          this.$logger.info(data.evaluationMode + ' studentEvaluateData rowId ' + data.rowId, this.studentEvaluateData[userId][data.formId][data.rowId])
          if (data.evaluationMode === EvaluationTableMode.TeacherEvaluate) {
            this.studentEvaluateData[userId][data.formId][data.rowId].teacherEmail = data.evaluateUserEmail
            this.studentEvaluateData[userId][data.formId][data.rowId].teacherName = data.evaluateUserName
            this.studentEvaluateData[userId][data.formId][data.rowId].data = data.data
            // 点击选中，再点一次取消选中
            if (this.studentEvaluateData[userId][data.formId][data.rowId].teacherEvaluation === data.value) {
              this.studentEvaluateData[userId][data.formId][data.rowId].teacherEvaluation = ''
            } else {
              this.studentEvaluateData[userId][data.formId][data.rowId].teacherEvaluation = data.value
            }
          } else if (data.evaluationMode === EvaluationTableMode.StudentEvaluate) {
            this.studentEvaluateData[userId][data.formId][data.rowId].studentEmail = data.evaluateUserEmail
            this.studentEvaluateData[userId][data.formId][data.rowId].studentName = data.evaluateUserName
            this.studentEvaluateData[userId][data.formId][data.rowId].data = data.data

            if (this.studentEvaluateData[userId][data.formId][data.rowId].studentEvaluation === data.value) {
              this.studentEvaluateData[userId][data.formId][data.rowId].studentEvaluation = ''
            } else {
              this.studentEvaluateData[userId][data.formId][data.rowId].studentEvaluation = data.value
            }
          } else if (data.evaluationMode === EvaluationTableMode.PeerEvaluate) {
            this.studentEvaluateData[userId][data.formId][data.rowId].peerEmail = data.evaluateUserEmail
            this.studentEvaluateData[userId][data.formId][data.rowId].peerName = data.evaluateUserName
            this.studentEvaluateData[userId][data.formId][data.rowId].data = data.data

            if (this.studentEvaluateData[userId][data.formId][data.rowId].peerEvaluation === data.value) {
              this.studentEvaluateData[userId][data.formId][data.rowId].peerEvaluation = ''
            } else {
              this.studentEvaluateData[userId][data.formId][data.rowId].peerEvaluation = data.value
            }
          }
          this.$logger.info('set ' + userId + ' formId ' + data.formId + ' row ' + data.rowId, this.studentEvaluateData[userId][data.formId][data.rowId], 'data', data)
        })
      }

      this.$logger.info('after update studentEvaluateData', this.studentEvaluateData)
    },

    handleAddEvidence (data) {
      this.$logger.info('handleAddEvidence', data, this.selectedMemberIdList)
      if (this.selectedMemberIdList.length === 1) {
        this.evidenceSelectVisible = true
        this.currentEvidenceItem = data.data
      } else {
        this.$message.warn('You can only add evidence for one student at a time, and now you\'ve selected ' + this.selectedMemberIdList.length + ' students')
      }
    },

    handleAddEvidenceFinish (data) {
      this.$logger.info('handleAddEvidenceFinish', data)
      this.evidenceSelectVisible = false
    },

    handleEnsureEvidenceFinish (data) {
      this.$logger.info('handleEnsureEvidenceFinish', data)
      // 给当前所有被选中的学生的对应rowId的evidence都加数据
      const rowId = this.currentEvidenceItem.rowId
      // 更新当前选中的所有学生的对应的form的rowId的数据为对应列
      const allSelectedStudentUserId = []
      this.selectedMemberIdList.forEach(userId => {
        if (allSelectedStudentUserId.indexOf(userId) === -1) {
          allSelectedStudentUserId.push(userId)
        }
      })

      this.groups.forEach(group => {
        if (this.selectedGroupIdList.indexOf(group.id) !== -1) {
          group.members.forEach(member => {
            if (allSelectedStudentUserId.indexOf(member.userId) === -1) {
              allSelectedStudentUserId.push(member.userId)
            }
          })
        }
      })
      this.$logger.info('all selected member userId ', allSelectedStudentUserId)
      // 遍历所有当前选中的用户，设置对应的选中的用-对应的表单-对应的行-对应的列-对应的evidence数据
      allSelectedStudentUserId.forEach(userId => {
        this.$logger.info('evidence row', this.studentEvaluateData[userId][this.currentActiveFormId][rowId])
        if (this.mode === EvaluationTableMode.StudentEvaluate) {
          this.studentEvaluateData[userId][this.currentActiveFormId][rowId].evidenceIdStudentList = data.data
        } else if (this.mode === EvaluationTableMode.TeacherEvaluate) {
          this.studentEvaluateData[userId][this.currentActiveFormId][rowId].evidenceIdList = data.data
        }
        this.$logger.info('evidence update user id ' + userId + ' row ' + rowId + ' data', this.studentEvaluateData[userId][this.currentActiveFormId][rowId])
      })
      this.evidenceSelectVisible = false
    },

    handleCloseMultiConfirm () {
      this.$logger.info('handleCloseMultiConfirm')
      this.showMultiSelectedConfirm = false
      window.sessionStorage.setItem('multiConfirmVisible', 'hidden')
    },

    handleToggleMode () {
      this.$logger.info('handleToggleMode')
      if (this.$store.getters.roles.indexOf('teacher') !== -1) {
        if (this.mode !== EvaluationTableMode.Preview) {
          if (this.mode !== EvaluationTableMode.Edit) {
            this.$confirm({
              content: 'Are you sure to switch to edit mode ?',
              onOk: () => {
                window.location.pathname = '/teacher/class-evaluation/' + this.taskId + '/' + this.classId + '/edit'
              }
            })
          } else {
            this.$confirm({
              content: 'Are you sure to switch to evaluate mode ?',
              onOk: () => {
                this.handleSaveEvaluation(true)
              }
            })
          }
        }
      } else {
        this.$logger.info('role no permission', this.$store.getters.roles)
      }
    },

    handleUpdateComment (comment) {
      this.$logger.info('handleUpdateComment')
      if (this.mode === EvaluationTableMode.TeacherEvaluate) {
        // 更新当前选中的所有学生的对应的form的comment的数据为对应列
        const allSelectedStudentUserId = []
        this.selectedMemberIdList.forEach(userId => {
          if (allSelectedStudentUserId.indexOf(userId) === -1) {
            allSelectedStudentUserId.push(userId)
          }
        })

        this.groups.forEach(group => {
          if (this.selectedGroupIdList.indexOf(group.id) !== -1) {
            group.members.forEach(member => {
              if (allSelectedStudentUserId.indexOf(member.userId) === -1) {
                allSelectedStudentUserId.push(member.userId)
              }
            })
          }
        })
        this.$logger.info('all selected member userId ', allSelectedStudentUserId)
        // 遍历所有当前选中的用户，设置对应的选中的用-对应的表单-对应的行-对应的列-对应的评估数据
        allSelectedStudentUserId.forEach(userId => {
          if (userId !== this.currentActiveStudentId) {
            this.studentEvaluateData[userId][this.currentActiveFormId].comment = comment
            this.$logger.info('update ' + userId + ' form ' + this.currentActiveFormId + ' comment' + comment, this.studentEvaluateData[userId][this.currentActiveFormId])
          }
        })
      }
    },
    handleToggleFormType (formType) {
      this.newFormType = formType
      if (formType === EvaluationTableType.Rubric) {
        this.newTableName = 'Rubric ' + (this.forms.length + 1)
      } else if (formType === EvaluationTableType.Rubric_2) {
        this.newTableName = 'Rubric ' + (this.forms.length + 1)
      } else if (formType === EvaluationTableType.CenturySkills) {
        this.newTableName = '21st Century Skills ' + (this.forms.length + 1)
      }
      this.$logger.info('newTableName', this.newTableName)
    },

    handleUpdateHeader (header) {
      this.$logger.info('ClassSessionEvaluation handleUpdateHeader')
      if (this.$refs.evaluationTable && this.$refs.evaluationTable.length > 0) {
        this.$refs.evaluationTable.forEach(tableItem => {
          tableItem.handleUpdateHeader()
        })
      }
      if (this.$refs.commonFormHeader) {
        this.$refs.commonFormHeader.handleEnsureNewFormName()
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.class-session-evaluation {
  .header {
    display: flex;
    justify-content: space-between;

    .right-icon {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .icon-type-item {
        user-select: none;
        display: flex;
        align-items: center;
        flex-direction: row;
        margin-left: 20px;

        .label {
          padding: 0 5px;
          font-size: 14px;
          font-family: Arial;
          font-weight: 400;
          line-height: 0px;
          color: #070707;
        }
      }
    }
  }

  .form-table-tabs {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    border-bottom: 1px solid #E7E7E7;
    margin-top: 10px;
    min-height: 33px;

    .form-table-item {
      padding: 5px 15px;
      cursor: pointer;
      font-family: Arial;
      font-weight: 400;
      line-height: 20px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      color: #070707;
      border-bottom: 3px solid #fff;

      .action-icon {
        margin-left: 8px;
      }
    }

    .active-table {
      border-bottom: 3px solid #07AB84 !important;
    }
  }

  .body {
    padding-top: 20px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    .class-group {
      width: 200px;

      .class-student-wrapper {
        height: 539px;
        background: #FFFFFF;
        border: 1px solid #dadada;
        opacity: 1;
        border-radius: 0px 0px 4px 4px;

        .group-list-wrapper {
          height: 503px;
          display: flex;
          flex-direction: column;
          max-height: 500px;
          overflow-y: scroll;

          &::-webkit-scrollbar {
            width: 5px;
            height: 5px;
          }

          &::-webkit-scrollbar-track {
            border-radius: 3px;
            background: rgba(0, 0, 0, 0.01);
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.01);
          }

          /* 滚动条滑块 */

          &::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background: rgba(0, 0, 0, 0.12);
            -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.01);
          }

          .group-item {
            display: flex;
            flex-direction: column;

            .group-item-info {
              line-height: 30px;
              display: flex;
              user-select: none;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              padding: 10px;
              cursor: pointer;

              &:hover {
                background-color: #F7F8FF;
              }

              .group-left {
                display: flex;
                flex-direction: row;
                align-items: center;
                position: relative;

                .group-icon {
                  display: flex;
                  flex-direction: row;
                  align-items: center;

                  svg {
                    height: 20px;
                  }
                }

                .group-name {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-break: break-all;
                  white-space: nowrap;
                  padding: 0 5px;
                }

                .group-select-status {
                  margin-left: 5px;
                  width: 10px;
                  user-select: none;

                  svg {
                    fill: #07AB84;
                    color: #07AB84;
                  }
                }
              }

              .group-right {
              }
            }

            .group-student-list {
              .student-list {
                display: flex;
                flex-direction: column;

                .list-item {
                  cursor: pointer;
                  padding: 10px;
                  user-select: none;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: flex-start;
                  position: relative;

                  &:hover {
                    background-color: #F7F8FF;
                  }

                  .student-avatar {
                    img {
                      width: 30px;
                    }
                  }

                  .student-name {
                    padding: 0 5px;
                    font-family: Inter-Bold;
                    line-height: 24px;
                    color: #11142D;
                    width: 180px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-all;
                    white-space: nowrap;
                  }

                  .select-status-icon {
                    position: absolute;
                    right: 5px;
                    top: 50%;
                    margin-top: -7.5px;

                    img {
                      height: 15px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    .form-table-content {
      width: calc(100% - 220px);
      padding: 0 0 0 20px;

      .table-content {
        .comment {
          margin-bottom: 20px;
        }

        .form-table-detail {
          margin-right: -30px;
          overflow-x: scroll;
        }
      }
    }
  }
}

.my-selected-icon {
  fill: #07AB84;
  color: #07AB84;
}

.selected-student {
  background-color: rgba(21, 195, 154, 0.15);

  &:hover {
    background-color: rgba(21, 195, 154, 0.15) !important;
  }
}

.rubric {
  display: flex;
  flex-direction: column;

  .rubric-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .my-modal-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-family: Inter-Bold;
      height: 37px;
      font-size: 26px;
      font-family: Arial;
      font-weight: 900;
      line-height: 0px;
      color: #070707;
      opacity: 1;
    }

    margin-bottom: 15px;
  }

  .select-rubric-wrapper {
    margin-top: 20px;
    padding-bottom: 15px;
    display: flex;
    min-height: 200px;
    flex-direction: column;

    .table-name {
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;

      .form-name {
        padding: 5px 0;
        font-family: Arial;
        font-weight: 500;
        line-height: 16px;
        color: #070707;
      }
    }

    .rubric-type-name {
      margin-top: 10px;
      padding: 5px 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      user-select: none;

      span {
        margin-right: 15px;
        height: 21px;
        font-family: Inter-Bold;
        line-height: 24px;
        color: #070707;

        .active-icon {
          opacity: 0;
        }

        &.active-rubric {
          height: 21px;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #FF3355;

          .active-icon {
            opacity: 1;
            font-size: 20px;
            color: #07AB84;
          }
        }
      }
    }

    .rubric-content {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;
      margin-top: 10px;
      min-height: 210px;

      .rubric-item {
        border: 1px solid #fff;
        display: flex;
        width: 48%;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: #FFFFFF;
        border-radius: 6px;
        position: relative;

        .rubric-preview {
          border-radius: 6px;
          padding: 35px 10px 20px 10px;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          opacity: 1;
          border-radius: 6px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;

          img {
            width: 80%;
            margin: 0;
            outline: none;
          }
        }

        .rubric-active-icon {
          position: absolute;
          top: 8px;
          left: 20px;
          opacity: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .active-rubric {
        font-size: 20px;
        font-weight: bold;
        color: @primary-color;
        border: 1px solid #15C39A;

        .rubric-active-icon {
          opacity: 1;
        }
      }
    }
  }
}

.select-rubric-action {
  display: flex;
  flex-direction: row;
  justify-content: center;

  .my-rubric-btn {
    margin: 0 20px;
  }
}

.rubric-wrapper {
  box-sizing: border-box;
  max-width: 100%;
  overflow-x: auto;
  padding: 0 40px 20px 20px;

  .rubric-name {
    width: 300px;
    margin-bottom: 15px;

    input {
      border-radius: 3px;
    }
  }
}

.form-title-item {
  line-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  .form-title {
    user-select: none;
    margin-right: 8px;
  }

  .form-delete-icon {
    opacity: 0;
  }

  &:hover {
    .form-delete-icon {
      opacity: 1;
    }
  }
}

.my-title-input {

}

.ant-dropdown-menu-item {
  display: flex;
  flex-direction: row;
}

.menu-icon {
  width: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-form-tips {
  padding: 100px 0;
}

.rubric-label {
  font-size: 14px;
  line-height: 50px;
  font-weight: bold;
}

.multi-selected-tips {
  padding: 30px 20px 0 20px;

  .selected-user-list {
    padding: 5px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;

    .selected-student-name {
      word-break: keep-all;
      margin-right: 5px;
      margin-bottom: 5px;
      font-weight: bold;
      text-overflow: ellipsis;
      font-family: Inter-Bold;
      background-color: #ddd;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 13px;
      color: #000000;
    }
  }
}

.form-header-line {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 20px;

  .right-icon {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .icon-type-item {
      user-select: none;
      display: flex;
      align-items: center;
      flex-direction: row;
      margin-left: 20px;

      .icon-item {
        svg {
          width: 25px;
        }
      }

      .label {
        padding: 0 5px;
        font-size: 13px;
        font-family: Arial;
        font-weight: 400;
        line-height: 0px;
        color: #070707;
      }
    }
  }

  .form-action {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: row;

    .my-form-header-btn {
      margin: 0 5px;
    }
  }
}

.btn-icon {
  height: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  img {
    margin-right: 10px;
    height: 15px;
    width: 15px;
  }
}

.notice-title {
  padding: 30px 0 10px 0;
  text-align: center;
}

.edit-tips {
  .self-evaluation-notice, .peer-evaluation-notice {
    line-height: 30px;
    font-family: Inter-Bold;
  }
}

.heartbeat {
  animation: breathing 0.8s ease-out infinite normal;
  background: rgba(21, 195, 154, 0.3);
}

@keyframes breathing {
  0% {

    opacity: 1;
  }

  25% {

    opacity: 0.8;
  }

  50% {

    opacity: 0.5;
  }

  75% {
    opacity: 0.8;
  }

  100% {
    opacity: 1;
  }
}

.toggle-mode-type-wrapper {
  box-sizing: border-box;

  .toggle-mode-type {
    height: 40px;
    display: inline-block;
    border-radius: 40px;
    background: rgba(228, 228, 228, 0.5);

    .toggle-mode {
      border-radius: 40px;
      height: 40px;
      display: flex;
      flex-direction: row;
      font-size: 14px;

      .mode-item {
        padding: 0 15px;
        font-size: 12px;
        height: 40px;
        color: rgba(17, 20, 45, 1);
        border-radius: 40px;
        font-family: Inter-Bold;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .skill-active-mode {
        color: #fff;
        background: rgba(21, 195, 154, 1);
      }

      .knowledge-active-mode {
        color: #fff;
        background: rgba(21, 195, 154, 1);
      }

      .general-active-mode {
        color: #fff;
        background: rgba(21, 195, 154, 1);
      }
    }
  }
}

.no-group-tips {
  margin-top: 100px;
}

.no-group-student-list {
  .student-list {
    display: flex;
    flex-direction: column;

    .list-item {
      cursor: pointer;
      padding: 10px;
      user-select: none;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      position: relative;

      &:hover {
        background-color: #F7F8FF;
      }

      .student-avatar {
        img {
          width: 30px;
        }
      }

      .student-name {
        padding: 0 5px;
        font-family: Inter-Bold;
        line-height: 24px;
        color: #11142D;
        width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: nowrap;
      }

      .select-status-icon {
        position: absolute;
        right: 5px;
        top: 50%;
        margin-top: -7.5px;

        img {
          height: 15px;
        }
      }
    }
  }
}

</style>
