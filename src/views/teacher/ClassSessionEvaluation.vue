<template>
  <div class="my-full-form-wrapper">
    <div class="form-header">
      <common-form-header
        ref="commonFormHeader"
        :form="form"
        :showCollaborate="false"
        :last-change-saved-time="lastChangeSavedTime"
        @update-form="handleUpdateForm"
        @back="goBack"
        @save="handleSaveEvaluation"
        @publish="handlePublishEvaluation"
      />
    </div>
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }" :loading="loading" >
      <div class="class-session-evaluation">
        <div class="header">
          <div class="left-action">
            <div class="add-btn">
              <a-button type="primary" @click="handleAddFormTable">
                <div class="btn-content">
                  <a-icon type="plus-circle" />
                  <span class="btn-text">
                    Add rubric format
                  </span>
                </div>
              </a-button>
            </div>
          </div>
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
        </div>
        <div class="form-table-tabs" v-show="forms.length > 0">
          <div
            :class="{'form-table-item': true,
                     'active-table': currentActiveFormId === formItem.id}"
            v-for="(formItem, idx) in forms"
            @click="handleActiveForm(idx, formItem)"
            :key="idx">

            <div class="action-icon" v-show="formItem.titleEditing === false">
              <a-dropdown :trigger="['click']">
                <div class="form-title-item">
                  <div class="form-title" @dblclick="handleEditFormTitle(formItem)">{{ formItem.title }} </div>
                  <a-icon type="down" />
                </div>
                <a-menu slot="overlay">
                  <a-menu-item key="0">
                    <a href="#">Student Eval</a>
                  </a-menu-item>
                  <a-menu-item key="1">
                    <a href="#">Peer Eval</a>
                  </a-menu-item>
                  <a-menu-item key="2">
                    <a href="#" @click="handleDeleteForm(formItem)"><a-icon type="delete" /> Delete</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </div>
            <div class="editing-title" v-show="formItem.titleEditing === true">
              <a-input v-model="currentEditingTitle" class="my-title-input" @blur="handleEnsureUpdateFormTitle" @keyup.enter="handleEnsureUpdateFormTitle"/>
            </div>
          </div>
        </div>
        <div class="body">
          <div class="class-group">
            <div class="class-student-wrapper">
              <div class="info-bar">
                <div class="info-bar-item">
                  {{ groupNum }} groups {{ memberNum }} students
                </div>
              </div>
              <div class="group-list-wrapper">
                <div :class="{'group-item': true, 'selected-group': selectedGroupIdList.indexOf(group.id) !== -1}" v-for="(group, gIdx) in groups" :key="gIdx">
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
                          <a-icon type="check-circle" style="{color: #07AB84}" theme="filled" class="my-selected-icon"/>
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
                      <div :class="{'list-item': true, 'selected-student': selectedMemberIdList.indexOf(member.userId) !== -1}" v-for="(member, sIndex) in group.members" :key="sIndex" @click="handleClickMember(member)">
                        <div class="student-avatar">
                          <img :src="member.avatar" alt="" v-if="member.avatar" />
                          <img slot="prefix" src="~@/assets/icons/evaluation/default_avatar.png" alt="" v-if="!member.avatar" />
                        </div>
                        <div class="student-name" :data-email="member.userId">
                          {{ member.userId }}
                        </div>
                        <div class="select-status-icon" v-if="(selectedMemberIdList.indexOf(member.userId) !== -1) || selectedGroupIdList.indexOf(group.id) !== -1">
                          <a-icon type="check-circle" style="{color: #07AB84}" theme="filled" class="my-selected-icon"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-table-content">
            <div class="table-content">
              <div class="form-table-item" v-for="(formItem,tIdx) in forms" :key="tIdx">
                <div class="form-table-item-content" v-show="formItem.id === currentActiveFormId">
                  <div class="comment">
                    <div class="summary-input">
                      <a-textarea v-model="formItem.comment" placeholder="Write a comment" aria-placeholder="Write a comment" class="my-textarea" />
                    </div>
                  </div>
                  <div class="form-table-detail">
                    <evaluation-table
                      :init-raw-headers="formItem.initRawHeaders"
                      :init-raw-data="formItem.initRawData"
                      :form-type="formItem.formType"
                      :mode="EvaluationTableMode.Edit"
                    />
                  </div>
                </div>
              </div>
            </div>
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
      <modal-header @close="selectRubricVisible = false"/>
      <div class="rubric">
        <div class="rubric-header">
          <div class="my-modal-header">
            Add form
          </div>
        </div>
        <div class="select-type">
          <a-radio-group name="radioGroup" default-value="create" v-model="rubricType">
            <a-radio value="create">
              Add new form
            </a-radio>
            <a-radio value="select">
              Choose from Content by me
            </a-radio>
          </a-radio-group>
        </div>
        <template v-if="rubricType === 'create'">
          <div class="select-rubric-wrapper">
            <div class="table-name">
              <div class="form-name">Form title</div>
              <div class="form-input">
                <a-input v-model="newTableName" aria-placeholder="Form 1"/>
              </div>
            </div>
            <div class="rubric-type-name">
              <span :class="{'active-rubric': newFormType === EvaluationTableType.Rubric || newFormType === EvaluationTableType.Rubric_2}" @click="newFormType = EvaluationTableType.Rubric">* Rubric format</span>
              <span :class="{'active-rubric': newFormType === EvaluationTableType.CenturySkills}" @click="newFormType= EvaluationTableType.CenturySkills">* 21 Century skills</span>
            </div>
            <div class="rubric-content">
              <div
                v-show="newFormType === EvaluationTableType.Rubric || newFormType === EvaluationTableType.Rubric_2"
                :class="{
                  'rubric-item': true,
                  'active-rubric': newFormType === EvaluationTableType.Rubric
                }"
                @click="handleSelectRubric(EvaluationTableType.Rubric)"
              >
                <div class="rubric-preview">
                  <img src="~@/assets/icons/evaluation/rubric2.png" alt="rubric">
                </div>
                <div class="rubric-active-icon">
                  <a-icon type="check-circle" theme="filled"/>
                </div>
              </div>
              <div
                v-show="newFormType === EvaluationTableType.Rubric || newFormType === EvaluationTableType.Rubric_2"
                :class="{
                  'rubric-item': true,
                  'active-rubric': newFormType === EvaluationTableType.Rubric_2
                }"
                @click="handleSelectRubric(EvaluationTableType.Rubric_2)"
              >
                <div class="rubric-preview">
                  <img src="~@/assets/icons/evaluation/rubric1.png" alt="rubric">
                </div>
                <div class="rubric-active-icon">
                  <a-icon type="check-circle" theme="filled"/>
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
                  <img src="~@/assets/icons/evaluation/rubric1.png" alt="rubric">
                </div>
                <div class="rubric-active-icon">
                  <a-icon type="check-circle" theme="filled"/>
                </div>
              </div>
            </div>
            <div class="select-rubric-action">
              <a-button shape="round" class="my-rubric-btn" style="width: 80px;background-color: #F5F5F5; border-color:#F5F5F5;box-shadow: none; color: #000000 " type="primary" @click="handleCancelSelectRubric">Cancel</a-button>
              <a-button shape="round" class="my-rubric-btn" style="width: 80px;" type="primary" @click="handleEnsureSelectRubric">Confirm</a-button>
            </div>
          </div>
        </template>
        <template v-if="rubricType === 'select'">
          <div class="select-rubric-wrapper">
            <div class="evaluation-list">
              <select-evaluation-list :task-id="taskId" :class-id="classId" @cancel="selectRubricVisible = false" @selected="handleEnsureSelectEvaluation"/>
            </div>
          </div>
        </template>
      </div>
    </a-modal>
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
import { GetSessionEvaluationByClassId, EvaluationQueryByIds } from '@/api/evaluation'
import SelectEvaluationList from '@/components/Evaluation/SelectEvaluationList'
import EvaluationTableType from '@/components/Evaluation/EvaluationTableType'
import EvaluationTableMode from '@/components/Evaluation/EvaluationTableMode'

export default {
  name: 'ClassSessionEvaluation',
  components: {
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
    }
  },
  data () {
    return {
      loading: true,
      isExistFormTable: false, // 是否已经添加过表格
      currentActiveFormId: null,
      form: { // 基础表单数据
        classId: '',
        name: '',
        evaluation: null,
        className: '',
        forms: [],
        groups: []
      },
      forms: [], // 评估表格数据
      groups: [], // 班级分组信息

      selectedGroupIdList: [],
      studentList: [],
      selectedMemberIdList: [],
      selectedStudentNameList: [],
      EvaluationTableType: EvaluationTableType,
      EvaluationTableMode: EvaluationTableMode,

      groupNum: 0,
      memberNum: 0,

      selectRubricVisible: false,
      newFormType: EvaluationTableType.CenturySkills,
      rubricType: 'create',
      newTableName: '',

      currentEditingTitle: null,
      currentFormItem: null
    }
  },
  created () {
    this.$logger.info('created ClassSessionEvaluation classId' + this.classId + ' taskId ' + this.taskId)
    this.loadEvaluationData()
  },
  methods: {
    loadEvaluationData () {
      this.$logger.info('loadEvaluationData')
      this.loading = false
      GetSessionEvaluationByClassId({ classId: this.classId }).then(response => {
        this.$logger.info('GetSessionEvaluationByClassId response', response.result)
        this.groups = [
          {
            'classId': '1',
            'id': 1,
            'members': [
              {
                'groupId': 1,
                'id': 1,
                'userId': 'xunwu'
              }
            ],
            'name': 'Group'
          }
        ]
        // this.form = response.evaluation
        // this.forms = response.evaluation.forms
        // this.groups = response.evaluation.groups
        this.groupNum = this.groups.length
        this.memberNum = 0
        this.groups.forEach(group => {
          this.memberNum = this.memberNum + group.members.length
        })
      }).finally(() => {
        if (!this.forms || this.forms.length === 0) {
          this.selectRubricVisible = true
        }
        this.loading = false
      })
    },

    handleActiveForm (idx, formItem) {
      this.$logger.info('handleActiveForm ' + idx, formItem)
      if (this.currentActiveFormId !== formItem.id) {
        this.currentActiveFormId = formItem.id
      }
    },
    handleClickMember (member) {
      this.$logger.info('handleClickMember', member)
      const index = this.selectedMemberIdList.indexOf(member.userId)
      if (index === -1) {
        this.selectedMemberIdList.push(member.userId)
      } else {
        this.selectedMemberIdList.splice(index, 1)
      }
    },

    handleSelectGroup (group) {
      this.$logger.info('handleSelectGroup', group)
      const index = this.selectedGroupIdList.indexOf(group.groupName)
      if (index === -1) {
        this.selectedGroupIdList.push(group.groupName)
      } else {
        this.selectedGroupIdList.splice(index, 1)
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
      this.newTableName = 'Form ' + count
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
          existFormIdList.push(item.id)
        })

        // 给还未保存的表格生成一个唯一的名称和自定义id，自定义id在提交时需要删掉
        let count = this.forms.length + 1
        let selfTitle = this.newTableName ? this.newTableName : 'Form ' + count
        let selfId = 'ext_' + Math.random(1000000000, 9999999999)
        while (existFormTitleList.indexOf(selfTitle) !== -1) {
          count++
          selfTitle = 'Form ' + count
        }

        while (existFormIdList.indexOf(selfId) !== -1) {
          count++
          selfId = 'ext_' + Math.random(1000000000, 9999999999)
        }

        const newFormTable = {
          title: selfTitle,
          titleEditing: false,
          formType: this.newFormType,
          comment: null,
          id: selfId,
          tableData: {
            evaluationTableList: [],
            initRawHeaders: [],
            initRawData: []
          }
        }
        this.$logger.info('newFormTable', newFormTable)
        this.forms.push(newFormTable)
        this.currentActiveFormId = newFormTable.id
      } else {
        this.$message.warn('Choose rubric format!')
      }
    },

    handleEditFormTitle (formItem) {
      this.$logger.info('handleEditFormTitle', formItem)
      if (this.currentFormItem) {
        this.currentFormItem.titleEditing = false
        this.currentFormItem = null
      }
      this.currentEditingTitle = formItem.title
      formItem.titleEditing = true
      this.currentFormItem = formItem
    },

    handleEnsureUpdateFormTitle () {
      this.$logger.info('handleEnsureUpdateFormTitle', this.currentEditingTitle)
      this.currentFormItem.title = this.currentEditingTitle
      this.currentFormItem.titleEditing = false
    },

    handleEnsureSelectEvaluation (data) {
      this.$logger.info('handleEnsureSelectEvaluation', data)
      const evaluationIdList = data.evaluationIdList
      EvaluationQueryByIds({ ids: evaluationIdList }).then((response) => {
        this.$logger.info('EvaluationQueryByIds', response)
        // TODO evaluation 处理合并evaluation
      })
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
    handleSaveEvaluation () {
      this.$logger.info('handleSaveEvaluation', this.forms)
      this.$refs.commonFormHeader.saving = false
    },
    handlePublishEvaluation () {},

    // 修改表头数据处理
    handleUpdateForm (data) {
      this.$logger.info('handleUpdateForm', data)
      this.form.name = data.name
    },

    handleSelectRubric (newFormType) {
      this.$logger.info('handleSelectRubric newFormType ' + newFormType)
      this.newFormType = newFormType
      if (newFormType === EvaluationTableType.Rubric) {
        this.newTableName = 'Rubric one ' + (this.forms.length + 1)
      } else if (newFormType === EvaluationTableType.Rubric_2) {
        this.newTableName = 'Rubric two ' + (this.forms.length + 1)
      } else if (newFormType === EvaluationTableType.CenturySkills) {
        this.newTableName = 'CenturySkills ' + (this.forms.length + 1)
      }
    },

    handleDeleteForm (formItem) {
      this.$logger.info('handleDeleteForm', formItem)
      const forms = []
      this.forms.forEach(form => {
        if (form.id !== formItem.id) {
          forms.push(form)
        }
      })
      this.forms = forms
    }
  }
}
</script>

<style lang="less" scoped>
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
      width: 250px;
      .class-student-wrapper {
        height: 539px;
        background: #FFFFFF;
        border: 1px solid #dadada;
        opacity: 1;
        border-radius: 0px 0px 4px 4px;
        .info-bar {
          margin-bottom: 3px;
          .info-bar-item {
            padding: 10px 0 10px 0;
            cursor: pointer;
            font-family: Inter-Bold;
            font-size: 12px;
            color: #999;
            text-align: center;
          }
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
        }

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
            background: rgba(0,0,0,0.00);
            -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.01);
          }
          /* 滚动条滑块 */
          &::-webkit-scrollbar-thumb {
            border-radius: 5px;
            background: rgba(0,0,0,0.12);
            -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.01);
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
              padding: 13px 15px;
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
                  padding: 0 5px;
                }

                .group-select-status {
                  margin-left: 5px;
                  width: 30px;
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
                  padding: 13px 30px 13px 15px;
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
                  }
                  .select-status-icon {
                    position: absolute;
                    right: 15px;
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
      width: calc(100% - 250px);
      padding: 0 20px;

      .table-content {
        .comment {
          margin-bottom: 20px;
        }

        .form-table-detail {
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
  padding: 0 10px;
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
      span  {
        margin-right: 15px;
        height: 21px;
        font-family: Inter-Bold;
        line-height: 24px;
        color: #070707;
        &.active-rubric {
          height: 21px;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #FF3355;
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
  .form-title {
    user-select: none;
    margin-right: 8px;
  }
}

.my-title-input {

}
</style>
