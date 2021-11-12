<template>
  <div class="rubric">
    <table class="rubric-table">
      <thead>

        <!--编辑允许修改变动-->
        <draggable v-model="headers" tag="tr" class="table-header" @end="handleDragEnd" v-if="mode === this.tableMode.Edit">
          <th v-for="(header, hIndex) in headers" class="header-item" :key="header.type">
            <!-- 编辑图标-->
            <div class="edit-icon" @click="handleEditHeader(header)" v-if="header.editable">
              <img src="~@/assets/icons/evaluation/edit.png" class="link-icon"/>
            </div>
            <!-- 表头文本-->
            <div @click="handleEditHeader(header)" class="label-text">

              <span class="header-label">{{ header.label }}</span>
              <template v-if="header.type === headerType.Novice">
                <a-tooltip placement="top">
                  <template slot="title">
                    Students are introduced to the skills, and can watch others performing it(observation)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

              <template v-if="header.type === headerType.Learner">
                <a-tooltip placement="top">
                  <template slot="title">
                    Students copy others who use the skill and use the skill with scaffolding and guidance(emulation)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

              <template v-if="header.type === headerType.Practitoner">
                <a-tooltip placement="top">
                  <template slot="title">
                    Students employ the skill confidently and effectively(demonstration)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

              <template v-if="header.type === headerType.Expert">
                <a-tooltip placement="top">
                  <template slot="title">
                    Students can show others how to use the skill and accurately assess how effectively the skill is used(self-regulation)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

            </div>
            <!-- 编辑状态下的输入框-->
            <template v-if="header.editing">
              <div class="label-input">
                <input v-model="header.label" @blur="handleUpdateHeader(header)" @keyup.enter="handleUpdateHeader(header)" class="header-input-item"/>
              </div>
            </template>
            <!-- 表头删除图标-->
            <div class="remove-header" v-if="header.type.startsWith(headerType.UserDefine)">
              <a-popconfirm :title="'Remove Header ?'" class="rubric-delete-popconfirm" ok-text="Yes" @confirm="handleRemoveHeader(header)" cancel-text="No">
                <template slot="icon">
                  <div class="rubric-big-delete">
                    <img class="big-delete-icon" src="~@/assets/icons/evaluation/big_delete.png" />
                  </div>
                </template>
                <img src="~@/assets/icons/evaluation/delete.png" class="link-icon"/>
              </a-popconfirm>
            </div>
            <!-- 最后一列后显示添加列的图标, 21世纪不允许修改表头-->
            <template v-if="hIndex === headers.length - 1 && formType !== tableType.CenturySkills">
              <div class="add-more-header">
                <a-tooltip title="Add new column">
                  <a-icon type="plus-circle" @click="handleAddNewHeader"/>
                </a-tooltip>
              </div>
            </template>
          </th>
        </draggable>

        <!--预览和评估模式下不允许修改变动-->
        <tr class="table-header" v-if="mode !== this.tableMode.Edit">
          <th v-for="(header) in headers" class="header-item" :key="header.type">
            <!-- 表头文本-->
            <div class="label-text">

              <span class="header-label">{{ header.label }}</span>
              <template v-if="header.type === headerType.Novice">
                <a-tooltip placement="top">
                  <template slot="title">
                    Students are introduced to the skills, and can watch others performing it(observation)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

              <template v-if="header.type === headerType.Learner">
                <a-tooltip placement="top">
                  <template slot="title">
                    Students copy others who use the skill and use the skill with scaffolding and guidance(emulation)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

              <template v-if="header.type === headerType.Practitoner">
                <a-tooltip placement="top">
                  <template slot="title">
                    Students employ the skill confidently and effectively(demonstration)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

              <template v-if="header.type === headerType.Expert">
                <a-tooltip placement="top">
                  <template slot="title">
                    Students can show others how to use the skill and accurately assess how effectively the skill is used(self-regulation)
                  </template>
                  <question-icon />
                </a-tooltip>
              </template>

            </div>
          </th>
        </tr>
      </thead>

      <tbody class="table-body">
        <tr v-for="(item, lIndex) in list" class="body-line" :key="lIndex">
          <td
            v-for="(header, hIndex) in headers"
            class="body-item"
            :data-type="header.type"
            :key="lIndex + '-' + header.type"
            @click="handleClickBodyItem(item, header)">
            <template v-if="item.hasOwnProperty(header.type)">

              <!-- 21 Century Criteria-->
              <template v-if="header.type === headerType.Criteria">
                <template v-if="formType === tableType.CenturySkills">
                  <template v-if="!item[headerType.Criteria] || !item[headerType.Criteria].name">
                    <div class="data-item add-criteria" @click="handleAddCriteria(header, item, $event)" v-show="mode === tableMode.Edit">
                      <add-opacity-icon />
                      <div class="add-text">Click to choose the objectives</div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="data-item criteria-data">
                      <div class="criteria-name" @dblclick="handleAddCriteria(header, item, $event)">
                        {{ item[headerType.Criteria].name }}
                      </div>
                      <div class="criteria-list">
                        <div class="criteria-parent" v-for="(criteriaParentItem, cIdx) in item[headerType.Criteria].criteriaList" :key="cIdx">
                          <div class="criteria-parent-item">
                            {{ criteriaParentItem }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </template>
                <template v-if="formType === tableType.Rubric">
                  <template v-if="!item[headerType.Criteria] || !item[headerType.Criteria].name">
                    <div class="data-item add-criteria" @click="handleAddDescription(header, item, $event)" v-show="mode === tableMode.Edit">
                      <add-opacity-icon />
                      <div class="add-text">Click to choose the objectives</div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="data-item criteria-data" @dblclick="handleAddDescription(header, item, $event)">
                      <div class="criteria-name">
                        {{ item[headerType.Criteria].name }}
                      </div>
                    </div>
                  </template>
                </template>
                <template v-if="formType === tableType.Rubric_2">
                  <div class="data-item criteria-data">
                    <div class="criteria-name">
                      {{ item[headerType.Criteria].name }}
                    </div>
                  </div>
                </template>
              </template>

              <!-- Description rubric_2的description支持选择-->
              <template v-if="header.type === headerType.Description">
                <template v-if="formType === tableType.Rubric_2">
                  <template v-if="!item[headerType.Description] || !item[headerType.Description].name">
                    <div class="data-item add-criteria" @click="handleAddDescription(header, item, $event)" v-show="mode === tableMode.Edit">
                      <add-opacity-icon />
                      <div class="add-text">Click to choose the objectives</div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="data-item criteria-data" @dblclick="handleAddDescription(header, item, $event)">
                      <div class="criteria-name">
                        {{ item[headerType.Description].name }}
                      </div>
                    </div>
                  </template>
                </template>
                <template v-if="formType === tableType.CenturySkills">
                  <div class="data-item">
                    <div class="description-data">
                      <template v-if="item[headerType.Description].userInputText">
                        {{ item[headerType.Description].userInputText }}
                      </template>
                      <template v-else>
                        {{ item[headerType.Description].name }}
                      </template>
                    </div>
                    <div class="sub-user-input" @click="handleClickEnterDescription(header, item)" v-show="mode === tableMode.Edit">
                      Enter comment
                    </div>
                  </div>
                </template>
              </template>
            </template>

            <template v-if="mode === tableMode.Edit">
              <!-- Indicators-->
              <template v-if="header.type === headerType.Indicators">
                <div class="indicator-input">
                  <a-textarea style="height: 100%" placeholder="Enter task specific indicators" class="my-text-input" v-model="item[headerType.Indicators].name" @blur="handleUpdateField(header, item)"/>
                </div>
              </template>
              <template v-if="header.type === headerType.Novice">
                <div class="indicator-input">
                  <a-textarea style="height: 100%" placeholder="Enter" class="my-text-input" v-model="item[headerType.Novice].name" @blur="handleUpdateField(header, item)"/>
                </div>
              </template>
              <template v-if="header.type === headerType.Learner">
                <div class="indicator-input">
                  <a-textarea style="height: 100%" placeholder="Enter" class="my-text-input" v-model="item[headerType.Learner].name" @blur="handleUpdateField(header, item)"/>
                </div>
              </template>
              <template v-if="header.type === headerType.Practitoner">
                <div class="indicator-input">
                  <a-textarea style="height: 100%" placeholder="Enter" class="my-text-input" v-model="item[headerType.Practitoner].name" @blur="handleUpdateField(header, item)"/>
                </div>
              </template>
              <template v-if="header.type === headerType.Expert">
                <div class="indicator-input">
                  <a-textarea style="height: 100%" placeholder="Enter" class="my-text-input" v-model="item[headerType.Expert].name" @blur="handleUpdateField(header, item)"/>
                </div>
              </template>

              <!-- UserDefine-->
              <template v-if="header.type.startsWith(headerType.UserDefine)">
                <div class="indicator-input">
                  <a-textarea style="height: 100%" placeholder="Enter" class="my-text-input" v-model="item[header.type].name" @blur="handleUpdateField(header, item)"/>
                </div>
              </template>
            </template>

            <template v-if="mode !== tableMode.Edit">
              <!-- Indicators-->
              <template v-if="header.type === headerType.Indicators">
                <div class="indicator-data">
                  {{ item[headerType.Indicators].name }}
                </div>
              </template>
              <template v-if="header.type === headerType.Novice">
                <div class="indicator-data">
                  {{ item[headerType.Novice].name }}
                </div>
              </template>
              <template v-if="header.type === headerType.Learner">
                <div class="indicator-data">
                  {{ item[headerType.Learner].name }}
                </div>
              </template>
              <template v-if="header.type === headerType.Practitoner">
                <div class="indicator-data">
                  {{ item[headerType.Practitoner].name }}
                </div>
              </template>
              <template v-if="header.type === headerType.Expert">
                <div class="indicator-data">
                  {{ item[headerType.Expert].name }}
                </div>
              </template>

              <!-- UserDefine-->
              <template v-if="header.type.startsWith(headerType.UserDefine)">
                <div class="indicator-data">
                  {{ item[header.type].name }}
                </div>
              </template>
            </template>

            <!-- Evidence-->
            <template v-if="header.type === headerType.Evidence">
              <div class="evidence-data">
                <div :class="{'evidence-info': true, 'exist-evidence': item[headerType.Evidence].num}" @click="handleAddEvidenceLine(lIndex, item)" v-show="mode === tableMode.TeacherEvaluate">
                  <add-icon v-show="!item[headerType.Evidence].num"/>
                  <add-small-green-icon v-show="item[headerType.Evidence].num"/>
                  <div class="evidence-num">( {{ item[headerType.Evidence].num ? item[headerType.Evidence].num : 0 }} )</div>
                </div>
              </div>
            </template>

            <template v-if="hIndex === headers.length - 1 && mode === tableMode.Edit">
              <div class="add-more-header">
                <a-popconfirm :title="'Delete this line ?'" class="rubric-delete-popconfirm" ok-text="Yes" @confirm="handleDeleteLine(item)" cancel-text="No">
                  <template slot="icon">
                    <div class="rubric-big-delete">
                      <img class="big-delete-icon" src="~@/assets/icons/evaluation/big_delete.png" />
                    </div>
                  </template>
                  <img src="~@/assets/icons/evaluation/delete.png" class="delete-row"/>
                </a-popconfirm>
              </div>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="add-new-line" @click="handleAddNewLine" v-if="mode === tableMode.Edit">
      <div class="add-new-line-item">
        <add-green-icon />
      </div>
    </div>

    <a-modal v-model="selectCurriculumVisible" @ok="handleEnsureSelectCriteria" destroyOnClose width="80%" :dialog-style="{ top: '20px' }">
      <div class="associate-library">
        <new-browser
          :select-mode="selectModel.knowledgeDescription"
          :show-menu="showMenuList"
          :default-active-menu="defaultActiveMenu"
          @select-all-21-century="handleSelectAll21CenturyListData"
          @select-curriculum="handleSelectDescriptionListData"
          question-index="evaluation_"/>
      </div>
    </a-modal>

    <a-modal
      v-model="inputDescriptionVisible"
      :footer="null"
      :maskClosable="false"
      :closable="false"
      width="700px"
      destroyOnClose>
      <modal-header @close="inputDescriptionVisible = false"/>
      <div class="rubric-modal">
        <div class="rubric-header">
          <div class="my-modal-header">
            Enter comment
          </div>
        </div>
        <div class="description-text">
          <div class="old-description" v-if="currentEnterDescriptionLine">
            {{ currentEnterDescriptionLine[headerType.Description].name }}
          </div>
        </div>
        <div class="description-input">
          <a-textarea
            placeholder="Enter Comment or Description"
            :autosize="{ minRows: 3, maxRows: 6 }"
            v-model="inputDescription"
            @blur="handleUpdateDescription"/>
        </div>
        <div class="select-rubric-action">
          <a-button shape="round" class="my-rubric-btn" style="width: 80px;background-color: #F5F5F5; border-color:#F5F5F5;box-shadow: none; color: #000000 " type="primary" @click="handleCancelDescription">Cancel</a-button>
          <a-button shape="round" class="my-rubric-btn" style="width: 80px;" type="primary" @click="handleEnsureDescription">Confirm</a-button>
        </div>
      </div>
    </a-modal>

  </div>
</template>

<script>

import { LibraryEvent, LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'
import { SelectModel } from '@/components/NewLibrary/SelectModel'
import draggable from 'vuedraggable'
import NewBrowser from '@/components/NewLibrary/NewBrowser'
import { NavigationType } from '@/components/NewLibrary/NavigationType'
import EvaluationTableType from '@/components/Evaluation/EvaluationTableType'
import EvaluationTableMode from '@/components/Evaluation/EvaluationTableMode'
import EvaluationTableHeader from '@/components/Evaluation/EvaluationTableHeader'
import AddIcon from '@/assets/svgIcon/evaluation/form/tianjia.svg?inline'
import AddSmallGreenIcon from '@/assets/svgIcon/evaluation/form/tianjia_small_green.svg?inline'
import AddGreenIcon from '@/assets/svgIcon/evaluation/form/tianjia_green.svg?inline'
import AddOpacityIcon from '@/assets/svgIcon/evaluation/form/tianjia_opacity.svg?inline'
import QuestionIcon from '@/assets/svgIcon/evaluation/form/question.svg?inline'
import ModalHeader from '@/components/Common/ModalHeader'

export default {
  name: 'EvaluationTable',
  components: {
    AddIcon,
    AddSmallGreenIcon,
    AddOpacityIcon,
    AddGreenIcon,
    QuestionIcon,
    ModalHeader,
    draggable,
    NewBrowser
  },
  props: {
    initRawData: {
      type: Array,
      default: () => []
    },
    initRawHeaders: {
      type: Array,
      default: () => []
    },
    formId: {
      type: String,
      required: true
    },
    formTableMode: {
      type: String,
      default: EvaluationTableMode.Edit
    },
    formType: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      selectModel: SelectModel,
      selfHeaderAddIndex: 1,
      headers: [], // 表头
      list: [], // 表结构数据
      defaultActiveMenu: NavigationType.learningOutcomes,
      showMenuList: [ NavigationType.all21Century ],
      mode: null,

      selectCurriculumVisible: false,
      selectKnowledgeTagVisible: false,
      selectedKnowledgeTag: [],
      tagColorList: [
        'pink',
        'orange',
        'green',
        'cyan',
        'blue',
        'red',
        'purple'
      ],

      currentSelectHeader: null,
      currentSelectLine: null,

      tableType: EvaluationTableType,
      tableMode: EvaluationTableMode,
      headerType: EvaluationTableHeader,

      selectedCriteriaDescriptionList: [],
      selectedRubricDescriptionList: [],

      inputDescriptionVisible: false,
      inputDescription: null,
      currentEnterDescriptionLine: null
    }
  },
  created () {
    this.$logger.info('[' + this.formTableMode + '] EvaluationTable created ' + this.formTableMode + ' formType ' + this.formType, 'initRawHeaders', this.initRawHeaders, 'initRawData', this.initRawData)
    this.mode = this.formTableMode
    if (this.initRawHeaders.length) {
      this.headers = this.initRawHeaders
    } else {
      if (this.formType === EvaluationTableType.Rubric) {
        this.headers = [
          { label: 'Criteria', previewLabel: 'Criteria', type: EvaluationTableHeader.Criteria, editable: false, editing: false, required: true },
          { label: 'Unnamed Level 1', previewLabel: 'Unnamed Level 1', type: EvaluationTableHeader.UserDefine + 1, editable: true, editing: false, required: false },
          { label: 'Unnamed Level 2', previewLabel: 'Unnamed Level 2', type: EvaluationTableHeader.UserDefine + 2, editable: true, editing: false, required: false },
          { label: 'Evidence', previewLabel: 'Evidence', type: EvaluationTableHeader.Evidence, editable: false, editing: false, required: true }
        ]
      } else if (this.formType === EvaluationTableType.Rubric_2) {
        this.headers = [
          { label: 'Criteria', previewLabel: 'Criteria', type: EvaluationTableHeader.Criteria, editable: false, editing: false, required: true },
          { label: 'Description', previewLabel: 'Description', type: EvaluationTableHeader.Description, editable: false, editing: false, required: true },
          { label: 'Task specific indicators', previewLabel: 'Task specific indicators', type: EvaluationTableHeader.Indicators, editable: false, editing: false, required: true },
          { label: 'Evidence', previewLabel: 'Evidence', type: EvaluationTableHeader.Evidence, editable: false, editing: false, required: true }
        ]
      } else if (this.formType === EvaluationTableType.CenturySkills) {
        this.headers = [
          { label: 'Criteria', previewLabel: 'Criteria', type: EvaluationTableHeader.Criteria, editable: false, editing: false, required: true },
          { label: 'Description', previewLabel: 'Description', type: EvaluationTableHeader.Description, editable: false, editing: false, required: true },
          { label: 'Novice', previewLabel: 'Novice', type: EvaluationTableHeader.Novice, editable: false, editing: false, required: true },
          { label: 'Learner', previewLabel: 'Learner', type: EvaluationTableHeader.Learner, editable: false, editing: false, required: true },
          { label: 'Practitoner', previewLabel: 'Practitoner', type: EvaluationTableHeader.Practitoner, editable: false, editing: false, required: true },
          { label: 'Expert', previewLabel: 'Expert', type: EvaluationTableHeader.Expert, editable: false, editing: false, required: true },
          { label: 'Evidence', previewLabel: 'Evidence', type: EvaluationTableHeader.Evidence, editable: false, editing: false, required: true }
        ]
      }
    }
    this.$logger.info('[' + this.mode + '] form headers ', this.headers)

    if (this.initRawData.length) {
      this.list = this.initRawData
    } else {
      this.handleAddNewLine()
    }
    LibraryEventBus.$on(LibraryEvent.ContentListSelectClick, this.handleContentListSelectClick)
  },
  destroyed () {
    LibraryEventBus.$off(LibraryEvent.ContentListSelectClick, this.handleContentListSelectClick)
    this.$logger.info('[' + this.mode + '] off NewClickableKnowledgeTag ContentListSelectClick handler')
  },
  methods: {

    handleContentListSelectClick (data) {
      if (data.questionIndex === 'evaluation_') {
        this.$logger.info('[' + this.mode + '] evaluation handleContentListSelectClick hit', data)
        LibraryEventBus.$emit(LibraryEvent.ContentListSelectedListUpdate, { id: data.subKnowledgeId })
      }
    },

    handleEditHeader (header) {
      this.$logger.info('[' + this.mode + '] handleEditHeader', header)
      if (header.editable) {
        this.headers.forEach(item => {
          if (item.label.length === 0) {
            item.label = item.previewLabel
          }
        })

        // 选中表头改为编辑状态
        this.headers.forEach(item => {
          if (item === header) {
            item.editing = true
            item.previewLabel = item.label
          } else {
            item.editing = false
          }
        })
      } else {
        this.$logger.info('[' + this.mode + '] current header not editable', header)
      }
    },

    handleUpdateHeader (header) {
      this.$logger.info('[' + this.mode + '] handleUpdateHeader', header)

      // 如果没输入表头，重置为默认表头
      this.headers.forEach(item => {
        if (item.label.length === 0) {
          item.label = item.previewLabel
        }
      })

      // 取消编辑状态
      this.headers.forEach(item => {
        item.editing = false
      })
    },

    handleAddNewHeader () {
      this.$logger.info('[' + this.mode + '] handleAddNewHeader this.selfHeaderTypeIndex ' + this.selfHeaderAddIndex)

      // 重新生成一个唯一的表头类型，示例：user_define__1、user_define__2
      let userDefineHeaderType = this.headerType.UserDefine + this.selfHeaderAddIndex
      const allHeaderType = []
      this.headers.forEach(item => allHeaderType.push(item.type))
      while (allHeaderType.indexOf(userDefineHeaderType) !== -1) {
        this.selfHeaderAddIndex++
        userDefineHeaderType = this.headerType.UserDefine + this.selfHeaderAddIndex
      }

      // 新增表头
      const headerItem = {
        label: 'Unnamed Level ' + this.selfHeaderAddIndex,
        previewLabel: 'Unnamed Level ' + this.selfHeaderAddIndex,
        type: userDefineHeaderType,
        editable: true,
        editing: false
      }

      // 默认倒数第二列新增，最后一列为evidence
      this.headers.splice(this.headers.length - 1, 0, headerItem)

      // 初始化对应列的数据
      const oldList = JSON.parse(JSON.stringify(this.list))
      console.log(oldList)
      oldList.forEach(item => {
        item[headerItem.type] = { name: null }
      })
      this.list = oldList
      this.$logger.info('[' + this.mode + '] after update list', this.list)
      this.selfHeaderAddIndex++
    },

    handleRemoveHeader (header) {
      this.$logger.info('[' + this.mode + '] handleRemoveHeader ', header)
      const index = this.headers.findIndex(item => item.type === header.type)
      if (index !== -1) {
        this.headers.splice(index, 1)
      }
      const oldList = JSON.parse(JSON.stringify(this.list))
      oldList.forEach(item => {
        delete item[header.type]
      })
      this.list = oldList
      this.$logger.info('[' + this.mode + '] after delete column update list', this.list)
    },

    handleAddNewLine () {
      this.$logger.info('[' + this.mode + '] handleAddNewLine ')
      const newLineItem = {}
      this.headers.forEach(header => {
        newLineItem[header.type] = {
          name: null
        }
      })

      if (this.formType === this.tableType.CenturySkills) {
        newLineItem[this.headerType.Criteria] = {
          name: null,
          criteriaList: []
        }

        newLineItem[this.headerType.Evidence] = {
          num: 0,
          selectedList: []
        }
        newLineItem[this.headerType.Evidence] = {
          num: 0,
          selectedList: []
        }
      } else if (this.formType === this.tableType.Rubric || this.formType === this.tableType.Rubric_2) {
        newLineItem[this.headerType.Evidence] = {
          num: 0,
          selectedList: []
        }
      }
      this.$logger.info('[' + this.mode + '] init new line ', newLineItem)
      this.list.push(newLineItem)
    },

    handleDragEnd () {
      this.$logger.info('[' + this.mode + '] handleDragEnd', this.headers)
    },

    handleDeleteLine (deleteLine) {
      this.$logger.info('[' + this.mode + '] handleDeleteLine', deleteLine)
      if (this.mode === EvaluationTableMode.Edit) {
        this.list = this.list.filter(item => item !== deleteLine)
      }
    },

    handleClickBodyItem (item, header) {
      this.$logger.info('[' + this.mode + '] handleClickBodyItem', item, header)
    },

    handleAddCriteria  (header, item, event) {
      event.preventDefault()
      event.stopPropagation()
      this.$logger.info('[' + this.mode + '] handleAddCriteria', header, item)
      if (this.mode === EvaluationTableMode.Edit) {
        this.showMenuList = [NavigationType.all21Century]
        this.selectCurriculumVisible = true
        this.currentSelectHeader = header
        this.currentSelectLine = item
      }
    },

    handleAddDescription (header, item, event) {
      event.preventDefault()
      event.stopPropagation()
      if (this.mode === EvaluationTableMode.Edit) {
        this.$logger.info('[' + this.mode + '] handleAddDescription', header, item)
        this.showMenuList = [NavigationType.learningOutcomes]
        this.selectCurriculumVisible = true
        this.currentSelectHeader = header
        this.currentSelectLine = item
      }
    },

    handleEnsureSelectCriteria () {
      this.$logger.info('[' + this.mode + '] handleEnsureSelectCriteria')
      this.selectCurriculumVisible = false
      if (this.formType === this.tableType.CenturySkills) {
        if (this.selectedCriteriaDescriptionList.length >= 1) {
          // 如果只选择了一个，使用第一个填充当前行数据
          this.headers.forEach(header => {
            if (this.currentSelectLine[header.type] || !this.currentSelectLine[header.type]) {
              this.currentSelectLine[header.type].name = null
            }
          })
          this.currentSelectLine[this.headerType.Criteria] = {
            name: this.selectedCriteriaDescriptionList[0].criteriaList[0],
            criteriaList: this.selectedCriteriaDescriptionList[0].criteriaList.slice(1)
          }
          this.currentSelectLine[this.headerType.Description] = {
            name: this.selectedCriteriaDescriptionList[0].descriptionName
          }

          this.$logger.info('[' + this.mode + '] update currentSelectLine with criteria data ', this.currentSelectLine)

          // 如果多选，从第二个元素开始新建行填充数据
          if (this.selectedCriteriaDescriptionList.length > 1) {
            this.selectedCriteriaDescriptionList.forEach((item, index) => {
              if (index > 0) {
                const newLineItem = {}
                this.headers.forEach(header => {
                  newLineItem[header.type] = {
                    name: null
                  }
                })
                newLineItem[this.headerType.Criteria] = {
                  name: item.criteriaList[0],
                  criteriaList: item.criteriaList.slice(1)
                }

                newLineItem[this.headerType.Description] = {
                  name: item.descriptionName,
                  userInputText: null
                }

                newLineItem[this.headerType.Evidence] = {
                  num: 0,
                  selectedList: []
                }

                this.$logger.info('[' + this.mode + '] CenturySkills add new line with criteria data ', newLineItem)
                this.list.push(newLineItem)
              }
            })
          }
        }
      } else if (this.formType === this.tableType.Rubric) {
        if (this.selectedRubricDescriptionList.length >= 1) {
          // 如果只选择了一个，使用第一个填充当前行数据
          this.headers.forEach(header => {
            if (this.currentSelectLine[header.type] || !this.currentSelectLine[header.type]) {
              this.currentSelectLine[header.type].name = null
            }
          })
          this.currentSelectLine[this.headerType.Criteria] = {
            name: this.selectedRubricDescriptionList[0].name
          }

          this.$logger.info('[' + this.mode + '] update currentSelectLine with criteria data ', this.currentSelectLine)

          // 如果多选，从第二个元素开始新建行填充数据
          if (this.selectedRubricDescriptionList.length > 1) {
            this.selectedRubricDescriptionList.forEach((descriptionItem, index) => {
              if (index > 0) {
                const newLineItem = {}
                this.headers.forEach(header => {
                  newLineItem[header.type] = {
                    name: null
                  }
                })
                newLineItem[this.headerType.Criteria] = {
                  name: descriptionItem.name
                }

                newLineItem[this.headerType.Evidence] = {
                  num: 0,
                  selectedList: []
                }

                this.$logger.info('[' + this.mode + '] Rubric add new line with criteria data ', newLineItem)
                this.list.push(newLineItem)
              }
            })
          }
        }
      } else if (this.formType === this.tableType.Rubric_2) {
        this.$logger.info('[' + this.mode + '] tableType.Rubric', this.selectedRubricDescriptionList)
        if (this.selectedRubricDescriptionList.length >= 1) {
          // 如果只选择了一个，使用第一个填充当前行数据
          this.headers.forEach(header => {
            if (this.currentSelectLine[header.type] || !this.currentSelectLine[header.type]) {
              this.currentSelectLine[header.type].name = null
            }
          })
          this.currentSelectLine[this.headerType.Description] = {
            name: this.selectedRubricDescriptionList[0].name
          }
          this.currentSelectLine[this.headerType.Criteria] = {
            name: this.selectedRubricDescriptionList[0].grade
          }

          this.$logger.info('[' + this.mode + '] update currentSelectLine description with criteria data ', this.currentSelectLine)

          // 如果多选，从第二个元素开始新建行填充数据
          if (this.selectedRubricDescriptionList.length > 1) {
            this.selectedRubricDescriptionList.forEach((descriptionItem, index) => {
              if (index > 0) {
                const newLineItem = {}
                this.headers.forEach(header => {
                  newLineItem[header.type] = {
                    name: null
                  }
                })
                newLineItem[this.headerType.Description] = {
                  name: descriptionItem.name
                }
                newLineItem[this.headerType.Criteria] = {
                  name: descriptionItem.grade
                }

                newLineItem[this.headerType.Evidence] = {
                  num: 0,
                  selectedList: []
                }

                this.$logger.info('[' + this.mode + '] Rubric description add new line with criteria data ', newLineItem)
                this.list.push(newLineItem)
              }
            })
          }
        }
      } else {
        this.$logger.info('[' + this.mode + '] rubric form no allow select')
      }
    },

    handleUpdateDescription (header, item) {
      this.$logger.info('[' + this.mode + '] handleUpdateDescription', header, item)
    },

    handleUpdateField (header, item) {
      this.$logger.info('[' + this.mode + '] handleUpdateField', header, item)
    },

    handleClickEnterDescription (header, item) {
      this.$logger.info('[' + this.mode + '] handleClickEnterDescription', header, item)
      if (this.mode === EvaluationTableMode.Edit) {
        this.inputDescription = item[this.headerType.Description].userInputText
        this.currentEnterDescriptionLine = item
        this.inputDescriptionVisible = true
      }
    },

    handleEnsureDescription () {
      this.$logger.info('[' + this.mode + '] handleEnsureDescription ' + this.inputDescription)
      this.currentEnterDescriptionLine[this.headerType.Description].userInputText = this.inputDescription
      if (this.mode === EvaluationTableMode.Edit) {
        this.inputDescriptionVisible = false
        this.currentEnterDescriptionLine = null
        this.inputDescription = null
      }
    },

    handleCancelDescription () {
      this.$logger.info('[' + this.mode + '] handleEnsureDescription ' + this.inputDescription)
      this.currentEnterDescriptionLine = null
      this.inputDescription = null
      this.inputDescriptionVisible = false
    },

    handleAddEvidenceLine (lIndex, item) {
      this.$logger.info('[' + this.mode + '] handleAddEvidenceLine', lIndex, item)
      this.$emit('add-evidence', {
        index: lIndex, data: item
      })
    },
    handleSelectAll21CenturyListData (data) {
      this.$logger.info('[' + this.mode + '] EvaluationTable handleSelectAll21CenturyListData', data)
      const descriptionList = []
      data.forEach(dataItem => {
        const item = dataItem.item
        const descriptionItem = {
          criteriaList: [],
          descriptionName: item.name
        }

        let p = item
        while (p.hasOwnProperty('parentObj') && p.parentObj) {
          p = p.parentObj
          descriptionItem.criteriaList.push(p.name)
        }
        descriptionList.push(descriptionItem)
      })
      this.selectedCriteriaDescriptionList = descriptionList
      this.$logger.info('[' + this.mode + '] selectedCriteriaDescriptionList ', descriptionList)
    },

    handleSelectDescriptionListData  (data) {
      this.$logger.info('[' + this.mode + '] EvaluationTable handleSelectDescriptionListData', data)
      const descriptionList = []
      data.forEach(dataItem => {
        const descriptionItem = {
          name: dataItem.knowledgeData.name,
          grade: dataItem.knowledgeData.gradeId
        }

        descriptionList.push(descriptionItem)
      })
      this.selectedRubricDescriptionList = descriptionList
      this.$logger.info('[' + this.mode + '] handleSelectDescriptionListData ', descriptionList)
    },

    handleCancelSelectData () {
    },

    getTableStructData () {
      this.$logger.info('getTableStructData', this.headers, this.list)
      return {
        headers: this.headers,
        list: this.list,
        formId: this.formId
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
  .rubric {
    .rubric-table {
      margin-bottom: 10px;
      table-layout: fixed;

      .table-header {
        border-top: 1px solid #15C39A;
        border-left: 1px solid #15C39A;
        background: #15C39A;

        .header-item:hover {
          //background: #07AB84;
          .edit-icon {
            display: flex;
          }
        }
        .header-item {
          position: relative;
          box-sizing: border-box;
          border-right: 1px solid #999;
          border-bottom: 1px solid #999;
          padding: 0;
          min-width: 200px;
          max-width: 400px;
          overflow: hidden;

          .edit-icon {
            position: absolute;
            right: 10px;
            top: 10px;
            display: none;
            cursor: pointer;

            img {
              height: 15px;
            }
          }
          .label-text {
            padding: 5px 10px;
            font-weight: 300;
            color: #fff;
            display: flex;
            align-items: center;
            line-height: 25px;
            vertical-align: middle;
            cursor: pointer;
            z-index: 50;
            font-family: Inter-Bold;

            .header-label {
              padding: 0 5px;
              font-weight: 300;
              color: #fff;
              display: flex;
              align-items: center;
              line-height: 25px;
              vertical-align: middle;
              cursor: pointer;
            }
          }

          .label-input {
            z-index: 100;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            background-color: #fff;

            input {
              font-family: Inter-Bold;
              outline: none;
              vertical-align: middle;
              padding: 5px 10px;
              line-height: 25px;
              width: 100%;
              border: none;
              background-color: #fff;
            }
          }

          .remove-header {
            position: absolute;
            right: 27px;
            top: 50%;
            margin-top: -13px;
            color: red;
            display: none;
            img {
              height: 30px;
            }
          }
        }

        .header-item:last-child {
          overflow: visible;
        }

        .header-item:hover {
          .remove-header {
            display: block;
            cursor: pointer;
          }
        }

        .add-more-header {
          cursor: pointer;
          position: absolute;
          right: -30px;
          font-size: 20px;
          color: @primary-color;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          top: 5px;
        }
      }

      .table-body {
        border-left: 1px solid rgba(216, 216, 216, 1);
        .body-line {
          .body-item {
            position: relative;
            max-width: 400px;
            min-width: 140px;
            height: 35px;
            font-size: 12px;
            font-family: Inter-Bold;
            line-height: 16px;
            color: #11142D;
            line-height: 25px;
            box-sizing: border-box;
            border-right: 1px solid rgba(216, 216, 216, 1);
            border-bottom: 1px solid rgba(216, 216, 216, 1);

            .data-item {
              padding: 10px;
              cursor: pointer;
              min-height: 50px;
            }

            .indicator-input {
              height: 100%;
            }
            .add-criteria {
              cursor: pointer;
              user-select: none;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;

              svg {
                width: 18px;
                height: 18px;
              }

              .add-text {
                padding: 15px 10px;
                font-size: 13px;
                font-family: Inter-Bold;
                line-height: 24px;
                color: #888996;
              }
            }

            .criteria-data {
              .criteria-parent {
                display: block;
                .criteria-parent-item {
                  display: inline-block;
                  background: #15C39A;
                  opacity: 1;
                  border-radius: 4px;
                  padding: 0 10px;
                  color: #fff;
                  margin-bottom: 5px;
                  margin-top: 5px;
                }
              }
            }

            .description-input {
              margin-top: 10px;
            }

            .sub-user-input {
              display: inline-block;
              cursor: pointer;
              background: #E7E7E7;
              opacity: 1;
              padding: 3px 10px;
              border-radius: 4px;
              margin-bottom: 5px;
              margin-top: 5px;
              font-size: 12px;
              font-family: Inter-Bold;
              line-height: 20px;
              color: #989898;
            }

            .evidence-data {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              .evidence-info {
                cursor: pointer;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;

                .evidence-num {
                  padding: 0 5px;
                  font-size: 12px;
                  font-family: Inter-Bold;
                  line-height: 24px;
                  color: #11142D;
                }
              }

              .exist-evidence {

                .evidence-num {
                  padding: 0 5px;
                  font-size: 12px;
                  font-family: Inter-Bold;
                  line-height: 24px;
                  color: #15C39A;
                }

                svg {
                  font-size: 12px;
                  font-family: Inter-Bold;
                  line-height: 24px;
                  color: #15C39A;
                }
              }

              .exist-evidence {
                color: #15C39A;
              }
            }
          }

          .body-item:last-child {
            overflow: visible;
          }

          .add-more-header {
            cursor: pointer;
            position: absolute;
            right: -30px;
            font-size: 16px;
            color: #ccc;
            width: 25px;
            height: 25px;
            align-items: center;
            justify-content: center;
            top: 50%;
            margin-top: -15px;
            img.delete-row {
              display: none;
              width: 30px;
            }
          }

          .add-evidence {
            cursor: pointer;
            position: absolute;
            right: -150px;
            font-size: 14px;
            top: 50%;
            margin-top: -20px;
            display: flex;
            align-items: center;
            padding: 6px 10px;
            border: 1px solid #15c39a;
            background: rgba(21, 195, 154, 0.1);
            border-radius: 3px;

            img {
              height: 15px;
            }

            .add-text {
              padding: 0 5px;
              color: rgba(21, 195, 154, 1);
            }
          }
        }

        .body-line:hover {
          img.delete-row {
            display: block;
          }
        }
      }
    }
  }

.add-new-line {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  .add-new-line-item {
    padding: 10px 0;
    cursor: pointer;
    color: #888996;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  .add-new-line-item:hover {
    color: #15C39A;
  }
}

.add-tag-action {
  margin-top: 20px;
  text-align: right;
}

.add-tag-icon {
  color: #888996;
  align-items: center;
  display: flex;
  justify-content: center;
  cursor: pointer;
  i {
    height: 100%;
  }
  span {
    padding-left: 5px;
    font-size: 12px;
  }
}

.ext-input {
  width: 100%;
  height: 100%;
  border: none;
  box-shadow: none;
}

.evaluation-item {
  background: fade(@primary-color, 10%);
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .checked-flag {
    position: absolute;
    bottom: 10px;
    right: 10px;
    height: 20px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -25px;
    margin-top: -25px;

    i {
      font-size: 20px;
      color: @primary-color;
    }
  }
}

.rubric-modal {
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

  .description-text {
    padding-top: 20px;
    padding-bottom: 30px;
    .old-description {
      font-size: 14px;
      font-family: Inter-Bold;
      line-height: 30px;
      color: #11142D;
    }
  }
}

.select-rubric-action {
  padding: 40px 0 20px 0;
  text-align: center;
  margin: auto;

  .my-rubric-btn {
    margin: 0 10px;
  }
}

.my-text-input {
  border: none;
}

</style>
