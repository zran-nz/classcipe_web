<template>
  <div class="my-full-form-wrapper" @click="handleUpdateHeader">
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
                     'active-table': currentActiveFormId === formItem.formId}"
            v-for="(formItem, idx) in forms"
            :data-form-id="formItem.formId"
            @click="handleActiveForm(idx, formItem)"
            :key="idx">

            <div class="action-icon" v-show="formItem.titleEditing === false">
              <div class="form-title-item">
                <div class="form-title" @dblclick="handleEditFormTitle(formItem)">{{ formItem.title }} </div>
                <div class="form-delete-icon">
                  <a-popconfirm title="Delete this form ?" ok-text="Yes" @confirm="handleDeleteForm(formItem)" cancel-text="No">
                    <a-icon type="delete" />
                  </a-popconfirm>
                </div>
              </div>
            </div>
            <div class="editing-title" v-show="formItem.titleEditing === true">
              <a-input v-model="currentEditingTitle" class="my-title-input" @blur="handleEnsureUpdateFormTitle" @keyup.enter="handleEnsureUpdateFormTitle"/>
            </div>
          </div>
        </div>
        <div class="body">
          <div class="form-table-content">
            <div class="table-content">
              <div class="form-table-item" v-for="(formItem,tIdx) in forms" :key="tIdx">
                <div class="form-table-item-content" v-show="formItem.formId === currentActiveFormId">
                  <div class="comment" v-show="formTableMode === EvaluationTableMode.TeacherEvaluate">
                    <div class="summary-input">
                      <a-textarea v-model="formItem.comment" placeholder="Write a comment" aria-placeholder="Write a comment" class="my-textarea" />
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
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="no-form-tips" v-show="forms.length === 0">
              <no-more-resources tips="The evaluation form has not been created!"/>
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
                <a-input v-model="newTableName" :placeholder="newTableName"/>
              </div>
            </div>
            <div class="rubric-type-name">
              <div class="toggle-mode-type-wrapper">
                <div class="toggle-mode-type">
                  <div class="toggle-mode">
                    <div :class="{'mode-item': true, 'skill-active-mode' : newFormType === EvaluationTableType.Rubric || newFormType === EvaluationTableType.Rubric_2}" @click="handleToggleFormType(EvaluationTableType.Rubric)">
                      Standard rubrics
                    </div>
                    <div :class="{'mode-item': true, 'knowledge-active-mode' : newFormType === EvaluationTableType.CenturySkills}" @click="handleToggleFormType(EvaluationTableType.CenturySkills)">
                      21st century skills rubric
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
                  <a-icon type="check-circle" theme="filled"/>
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
                  <img src="~@/assets/icons/evaluation/rubric2.png" alt="rubric">
                </div>
                <div class="rubric-active-icon">
                  <a-icon type="check-circle" theme="filled"/>
                </div>
              </div>
            </div>
            <div class="select-rubric-action">
              <a-button shape="round" class="my-rubric-btn" style="width: 80px;background-color: #F5F5F5; border-color:#F5F5F5;box-shadow: none; color: #000000 " type="primary" @click="handleCancelSelectRubric">Cancel</a-button>
              <a-button shape="round" class="my-rubric-btn" style="width: 80px;" type="primary" @click="handleEnsureSelectRubric">Insert</a-button>
            </div>
          </div>
        </template>
        <template v-if="rubricType === 'select'">
          <div class="select-rubric-wrapper">
            <div class="evaluation-list">
              <select-evaluation-list @cancel="selectRubricVisible = false" @selected="handleEnsureSelectEvaluation"/>
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
import { EvaluationQueryByIds, EvaluationQueryById, EvaluationAddOrUpdate } from '@/api/evaluation'
import SelectEvaluationList from '@/components/Evaluation/SelectEvaluationList'
import EvaluationTableType from '@/components/Evaluation/EvaluationTableType'
import EvaluationTableMode from '@/components/Evaluation/EvaluationTableMode'
import NoMoreResources from '@/components/Common/NoMoreResources'

export default {
  name: 'AddEvaluation',
  components: {
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
    evaluationId: {
      type: String,
      default: null
    },
    mode: {
      type: String,
      default: EvaluationTableMode.Edit
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
        name: '',
        forms: [],
        status: 0
      },
      forms: [], // 评估表格数据

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
      currentFormItem: null,
      formTableMode: null,

      saving: false,
      publishing: false
    }
  },
  created () {
    this.$logger.info('[' + this.formTableMode + '] created Evaluation evaluationId' + this.evaluationId)
    this.formTableMode = EvaluationTableMode.Edit
    this.initData()
  },
  methods: {
    initData () {
      this.$logger.info('initData')
      this.loading = false
      EvaluationQueryById({ id: this.evaluationId }).then(response => {
        this.$logger.info('init data response', response)
        // 加载班级信息数据
        this.$logger.info('EvaluationQueryById response', response.result)
        const data = response.result
        this.form = data
        data.forms.forEach(formItem => {
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
      }).finally(() => {
        if ((this.forms.length === 0) && this.mode === EvaluationTableMode.Edit) {
          this.selectRubricVisible = true
        } else {
          this.currentActiveFormId = this.forms[0].formId
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
      this.newTableName = 'Rubric one ' + count
      this.newFormType = EvaluationTableType.Rubric
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
                  formItem.name = evaluationItem.name
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
            formItem.title = 'evaluation of ' + (formItem.name ? formItem.name : 'Untitled')
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
    handleSaveEvaluation () {
      this.$logger.info('handleSaveEvaluation', this.forms)
      this.$refs.commonFormHeader.saving = true

      // 获取所有的表格结构（表头+表内容）
      const formDataList = []
      this.$refs.evaluationTable.forEach(tableItem => {
        const tableData = tableItem.getTableStructData()
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
      this.$logger.info('formDataList', formDataList)
      this.form.forms = formDataList
      if (formDataList.length === 0) {
        this.$message.error('Please add at least one form!')
        this.$refs.commonFormHeader.saving = false
        return false
      } else {
        EvaluationAddOrUpdate(this.form).then((response) => {
          this.$logger.info('EvaluationAddOrUpdate', response)
          this.$refs.commonFormHeader.saving = false
          if (response.success) {
            this.$message.success('Save successfully!')
            this.goBack()
          } else {
            this.$message.error(response.message)
          }
        })
      }
    },
    handlePublishEvaluation (status) {
      this.$logger.info('handleSaveEvaluation status ' + status, this.forms)
      this.$refs.commonFormHeader.publishing = true

      // 获取所有的表格结构（表头+表内容）
      const formDataList = []
      this.$refs.evaluationTable.forEach(tableItem => {
        const tableData = tableItem.getTableStructData()
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
      this.$logger.info('formDataList', formDataList)
      this.form.forms = formDataList
      this.form.status = status
      if (formDataList.length === 0) {
        this.$message.error('Please add at least one form!')
        this.$refs.commonFormHeader.publishing = false
        return false
      } else {
        EvaluationAddOrUpdate(this.form).then((response) => {
          this.$logger.info('EvaluationAddOrUpdate', response)
          if (status === 1) {
            this.$message.success(this.$t('teacher.add-unit-plan.publish-success'))
          } else {
            this.$message.success('Unpublish successfully')
          }
          this.$refs.commonFormHeader.publishing = false
        })
      }
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
      formItem.menuVisible = !formItem.menuVisible
    },
    handleToggleFormType (formType) {
      this.newFormType = formType
    },
    handleUpdateHeader (header) {
      this.$logger.info('AddEvaluation handleUpdateHeader')
      this.$refs.evaluationTable.forEach(tableItem => { tableItem.handleUpdateHeader() })
      this.$refs.commonFormHeader.handleEnsureNewFormName()
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
      width: 280px;
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
            background: rgba(0,0,0,0.01);
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
                    width: 190px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    word-break: break-all;
                    white-space: nowrap;
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
      width: 100%;
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
</style>
