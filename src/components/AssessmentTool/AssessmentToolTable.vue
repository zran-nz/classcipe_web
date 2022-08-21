<template>
  <div class='assessment-tool-table' ref='table'>
    <div class='extra-criteria-table' v-if='assessment && assessment.extraCriteriaBodyList && assessment.extraCriteriaBodyList.length'>
      <table>
        <thead>
          <tr>
            <th
              v-for='header in assessment.headerList'
              :key='header.type'
              :style="{
                backgroundColor: header.bgColor || '#ffffff',
                maxWidth: header.maxWidth || 'auto',
                padding: header.editing ? '0px' : '10px',
              }">
              <div class='header-title'>
                {{ header.title }}
              </div>
              <div class='header-tips' v-if='header.tips'>
                {{ header.tips }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for='row in assessment.extraCriteriaBodyList' :key='row.key' class='row'>
            <th v-for='header in assessment.headerList' :key='header.type' @dblclick='handleEditExtraRow(row)'>
              <a-textarea
                :auto-size="{ minRows: 2, maxRows: 5 }"
                class='cc-table-textarea'
                :disabled='disabled'
                v-model='row[header.type].display'
                :style="{ backgroundColor: header.bgColor || '#ffffff' }" />
              <div class='origin-data-tips' v-if='header.type === HeaderType.criteria && row[header.type].originDisplay && row[header.type].originDisplay !== row[header.type].display'>
                <a-tooltip :title="row[header.type].originDisplay" placement='top'>
                  <a-icon type="info-circle" />
                </a-tooltip>
              </div>
            </th>
            <div class='delete-icon' v-if='!inSnapshot && !disabled'>
              <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDelExtraRowItem(row)" cancel-text="No">
                <delete-icon color='#F16A39' />
              </a-popconfirm>
            </div>
          </tr>
        </tbody>
      </table>
    </div>
    <table v-if='assessment'>
      <thead>
        <tr>
          <th
            v-for='header in assessment.headerList'
            :key='header.type'
            :style="{
              backgroundColor: header.bgColor || '#ffffff',
              maxWidth: header.maxWidth || 'auto',
              padding: header.editing ? '0px' : '10px',
            }"
            @click='handleEditHeader(header)'>
            <template v-if='!header.editing'>
              <div class='header-title'>
                {{ header.title }}
              </div>
              <div class='header-tips' v-if='header.tips'>
                {{ header.tips }}
              </div>
            </template>
            <template v-if='header.editing'>
              <a-input
                class='cc-table-input'
                :disabled='disabled'
                @focus.native='activeHeader(header)'
                v-model='header.title'
                @click.native.stop=''
                @blur.native='currentEditHeader ? currentEditHeader.editing = false : null'/>
            </template>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class='row' v-for='row in assessment.bodyList' :key="'row_' + row.key">
          <th v-for='header in assessment.headerList' :key="'rc_' + row.key + '_' + header.type" @dblclick='handleEditRow(row)'>
            <a-textarea
              :auto-size="{ minRows: 2, maxRows: 20 }"
              class='cc-table-textarea'
              :disabled='disabled'
              v-model='row[header.type].display'
              :style="{ backgroundColor: header.bgColor || '#ffffff' }" />
            <div class='origin-data-tips' v-if='header.type === HeaderType.criteria && row[header.type].originDisplay && row[header.type].originDisplay !== row[header.type].display'>
              <a-tooltip :title="row[header.type].originDisplay" placement='top'>
                <a-icon type="info-circle" />
              </a-tooltip>
            </div>
          </th>
          <div class='delete-icon' v-if='!inSnapshot && !disabled'>
            <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDelRowItem(row)" cancel-text="No">
              <delete-icon color='#F16A39' />
            </a-popconfirm>
          </div>
        </tr>
      </tbody>
    </table>
    <div class='table-bottom-bar' v-if='!inSnapshot && !disabled'>
      <div class='add-row' v-if='mode === AssessmentMode.edit'>
        <plus-icon color='#a9adb4' @click='handleAddRow' v-show='allowCreate' />
      </div>
      <div class='right-action'>
        <custom-link-text
          text='Save as set of options'
          @click='handleSaveHeaderAsSet'
          :disabled='!assessment.headerList.some(item => item.type.startsWith(HeaderType.custom))'
          v-if='assessment.type === AssessmentToolType.Rubric'>
        </custom-link-text>
      </div>
    </div>

    <a-modal
      v-model='editHeaderModalVisible'
      destroyOnClose
      :title='null'
      :closable='false'
      width='300px'
      :footer='null'>
      <modal-header :title="'Operation for ' + (currentEditHeader ? currentEditHeader.title : '') + ''" @close='editHeaderModalVisible = false'/>
      <div class='edit-header-action'>
        <div class='edit-header-action-item' v-if='currentEditHeader'>
          <custom-text-button label='Add a column' @click='handleAddCol' v-if='currentEditHeader.canAddCustomCol && allowCreate'></custom-text-button>
          <custom-text-button label='Delete current column' @click='handleDelCol' v-if='currentEditHeader.canAddCustomCol'></custom-text-button>
          <custom-text-button label='Edit option' @click='handleEditName'></custom-text-button>
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model='editRowModalVisible'
      destroyOnClose
      :title='null'
      :closable='false'
      width='300px'
      :footer='null'>
      <modal-header title="Edit row" @close='editRowModalVisible = false'/>
      <div class='edit-header-action'>
        <div class='edit-header-action-item' v-if='currentEditRow'>
          <custom-text-button label='Delete current row' @click='handleDelRow'></custom-text-button>
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model='editExtraRowModalVisible'
      destroyOnClose
      :title='null'
      :closable='false'
      width='300px'
      :footer='null'>
      <modal-header title="Edit row" @close='editExtraRowModalVisible = false'/>
      <div class='edit-header-action'>
        <div class='edit-header-action-item' v-if='currentEditExtraRow'>
          <custom-text-button label='Delete current row' @click='handleDelExtraRow'></custom-text-button>
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model='selectHeaderSetModalVisible'
      destroyOnClose
      :title='null'
      :closable='false'
      :footer='null'>
      <modal-header title="Select a set of options" @close='selectHeaderSetModalVisible = false'/>
      <div class='edit-header-action'>
        <div class='edit-header-action-item header-option' v-for='(options, idx) in optionList' :key='idx' @click='selectHeaderSet(options)'>
          <a-tag v-for='(option,oIdx) in options.headerNameList' :key='oIdx'>{{ option }}</a-tag>
          <delete-icon @click.native.stop='handleDeleteHeader(options)' class='delete-item'/>
        </div>
        <div class='no-header' v-if='optionList.length === 0'>
          <common-no-data />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import CommonNoData from '@/components/Common/CommonNoData'
import PlusIcon from '@/components/Common/PlusIcon'
import {
  AssessmentMode,
  AssessmentToolsEvent,
  AssessmentToolType,
  HeaderType
} from '@/components/AssessmentTool/Constant'
import DeleteIcon from '@/components/Common/DeleteIcon'
import CustomTextButton from '@/components/Common/CustomTextButton'
import ModalHeader from '@/components/Common/ModalHeader'
import CustomLinkText from '@/components/Common/CustomLinkText'
import { debounce } from 'lodash-es'
import {
  AssessmentToolHeaderNamesDelete,
  AssessmentToolHeaderNamesSave,
  AssessmentToolInfoSave
} from '@/api/v2/assessment'
import { toPng } from 'html-to-image'

export default {
  name: 'AssessmentToolTable',
  components: { CustomLinkText, ModalHeader, CustomTextButton, DeleteIcon, PlusIcon, CommonNoData },
  props: {
    assessment: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      default: 'edit' // edit、view、evaluate
    },
    isActiveTable: {
      type: Boolean,
      required: true
    },
    saving: {
      type: Boolean,
      default: false
    },
    allowCreate: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editingData: null,
      AssessmentToolType: AssessmentToolType,
      AssessmentMode: AssessmentMode,

      editHeaderModalVisible: false,
      currentEditHeader: null,

      currentEditRow: null,
      editRowModalVisible: false,

      currentEditExtraRow: null,
      editExtraRowModalVisible: false,

      selectHeaderSetModalVisible: false,
      optionList: [],
      optionStrSet: new Set(),

      // 异步延迟保存表格数据
      asyncSaveTableData: null,
      lastSaveTableDataJson: null,

      // 评估项附带数据类型
      criteriaExtraDataType: {
        generalCapability: 'generalCapability',
        learningObjective: 'learningObjective',
        performance: 'performance'
      },

      HeaderType: HeaderType,
      inSnapshot: false
    }
  },
  mounted() {
    this.globalClick(this.handleClick)
  },
  created() {
    this.asyncSaveTableData = debounce(this.autoSaveAssessment, 1000)
    this.$EventBus.$on(AssessmentToolsEvent.InsertCriteria, this.handleInsertCriteria)
  },
  beforeDestroy() {
    this.$EventBus.$off(AssessmentToolsEvent.InsertCriteria, this.handleInsertCriteria)
  },
  watch: {
    assessment: {
      handler() {
        this.asyncSaveTableData()
      },
      deep: true
    }
  },
  computed: {
    headerTypeList () {
      return this.assessment ? this.assessment.headerList.map(header => header.type) : []
    }
  },
  methods: {
    handleEditHeader (header) {
      if (this.mode === AssessmentMode.edit) {
        if (this.currentEditHeader) {
          this.currentEditHeader.editing = false
        }
        this.currentEditHeader = header
        this.editHeaderModalVisible = true
      }
    },

    activeHeader (header) {
      this.currentEditHeader = header
    },

    handleClick () {
      if (this.currentEditHeader && this.assessment.type === AssessmentToolType.Checklist) {
        this.currentEditHeader.editing = false
        // 如果是checkList那么顺便修改对应的列数据
        this.assessment.bodyList.forEach(row => {
          row[this.currentEditHeader.type].display = this.currentEditHeader.title
        })
      }
    },

    handleEditName () {
      this.currentEditHeader.editing = true
      this.editHeaderModalVisible = false
    },

    handleDelCol () {
      if (this.mode === 'edit') {
        if (this.assessment.headerList.filter(item => item.type.startsWith(HeaderType.custom)).length > 1) {
          this.assessment.headerList.splice(this.assessment.headerList.indexOf(this.currentEditHeader), 1)
          this.assessment.bodyList.forEach(row => {
            this.$delete(row, this.currentEditHeader.type)
          })
        } else {
          this.$message.warn('At least one option exists for the assessment tool')
        }
      }
      this.editHeaderModalVisible = false
      this.currentEditHeader = null
    },

    handleAddCol () {
      this.$logger.info('handleAddCol currentEditHeader', this.currentEditHeader, 'headerList', this.assessment.headerList)
      if (this.mode === 'edit' && this.assessment && this.assessment.canAddCustomCol) {
        const index = this.assessment.headerList.findIndex(item => item.type === this.currentEditHeader.type)
        let idx = this.headerTypeList.length + 1
        while (this.headerTypeList.indexOf(`${HeaderType.custom}_${idx}`) !== -1) {
          idx++
        }
        const newHeaderType = `${HeaderType.custom}_${idx}`
        const newHeader = {
          type: newHeaderType,
          title: 'Option',
          canAddCustomCol: true
        }
        this.assessment.headerList.splice(index + 1, 0, newHeader)

        this.assessment.bodyList.forEach(row => {
          row[newHeaderType] = {
            display: null,
            type: newHeaderType
          }
        })

        this.assessment.extraCriteriaBodyList.forEach(row => {
          row[newHeaderType] = {
            display: null,
            type: newHeaderType
          }
        })
      }

      this.editHeaderModalVisible = false
      this.currentEditHeader = null
    },
    handleAddRow (criteriaDisplay, extraData, origin = false) {
      const row = {
        key: Math.random()
      }
      this.assessment.headerList.forEach(item => {
        this.$logger.info('add row with criteria', origin, criteriaDisplay)
        if (item.type === HeaderType.criteria) {
          row[item.type] = {
            display: criteriaDisplay || null,
            originDisplay: origin ? criteriaDisplay : null,
            type: item.type,
            extraDataJson: JSON.stringify(extraData) || null
          }
        } else {
          row[item.type] = {
            display: item.type === HeaderType.yes ? 'YES' : (item.type === HeaderType.no ? 'NO' : null),
            type: item.type
          }
        }
      })
      this.assessment.bodyList.push(row)

      // 检查extraData
      if (extraData) {
        this.$logger.info(extraData.type, 'extraData', extraData)
        if (extraData.type === this.criteriaExtraDataType.learningObjective || extraData.type === this.criteriaExtraDataType.generalCapability) {
          if (extraData.path && extraData.path.length) {
            const criteriaCategoryName = extraData.path.slice(-1)[0]
            const extraRow = {
              key: 'extra_' + Math.random()
            }
            this.assessment.headerList.forEach(item => {
              if (item.type === HeaderType.criteria) {
                extraRow[item.type] = {
                  display: criteriaCategoryName || null,
                  originDisplay: origin ? (criteriaCategoryName || null) : null,
                  type: item.type,
                  tooltip: extraData.path.join('/')
                }
              } else {
                extraRow[item.type] = {
                  display: item.type === HeaderType.yes ? 'YES' : (item.type === HeaderType.no ? 'NO' : null),
                  type: item.type
                }
              }
            })
            this.assessment.extraCriteriaBodyList.push(extraRow)
          }
        }
      }
    },

    handleSaveHeaderAsSet () {
      this.$logger.info('handleSaveHeaderAsSet', this.assessment.headerList)
      const headerNameList = this.assessment.headerList.filter(item => item.type !== HeaderType.criteria).map(item => item.title)
      if (headerNameList.length) {
        this.$logger.info('save header str', headerNameList)
        const headerStr = JSON.stringify(headerNameList)
        if (!this.optionStrSet.has(headerStr)) {
          AssessmentToolHeaderNamesSave({
            headerNameList: JSON.stringify(headerNameList)
          }).then((res) => {
            if (res.code === 0) {
              this.optionStrSet.add(headerStr)
              this.$message.success('Save successfully')
            } else {
              this.$message.error(res.message)
            }
          })
        }
      } else {
        this.$logger.info('empty header')
      }
    },

    selectHeaderSet (optionItem) {
      const options = optionItem.headerNameList
      this.$logger.info('selectHeaderSet', options)
      this.$EventBus.$emit('assessment-update-header', {
        key: this.assessment.key,
        headerNameList: options
      })
      this.selectHeaderSetModalVisible = false
    },

    autoSaveAssessment() {
      this.$logger.info('autoSaveAssessment ', this.assessment.key)
      this.$emit('update:saving', true)
      try {
        const data = JSON.parse(JSON.stringify(this.assessment))
        if (data === this.lastSaveTableDataJson) {
          return
        }
        this.lastSaveTableDataJson = data
        data.headerListJson = JSON.stringify(data.headerList)
        data.bodyListJson = JSON.stringify(data.bodyList)
        data.extraCriteriaBodyListJson = JSON.stringify(data.extraCriteriaBodyList)

        this.inSnapshot = true
        this.$nextTick(() => {
          try {
            toPng(this.$refs.table).then(base64 => {
              data.assessmentToolPreviewImgBase64 = base64
              this.$logger.info('autoSaveAssessment', data)
              AssessmentToolInfoSave(data).then((res) => {
                if (res.code === 0) {
                  this.$EventBus.$emit('assessment-saved', {
                    key: res.result.key,
                    id: res.result.id
                  })
                } else {
                  this.$message.error(res.message)
                }
              }).finally(() => {
                this.$emit('update:saving', false)
              })
            })
          } finally {
            this.inSnapshot = false
          }
        })
      } catch (e) {
        this.$logger.error('autoSaveAssessment', e)
        this.$emit('update:saving', false)
      }
    },

    handleInsertCriteria (data) {
      if (this.isActiveTable) {
        this.$logger.info('handleInsertCriteria', this.assessment.title, data)
        data.generalCapabilityList.forEach(item => {
          item.type = this.criteriaExtraDataType.generalCapability
          this.handleAddRow(item.name || item.desc, item, true)
        })
        data.learningObjectiveList.forEach(item => {
          item.type = this.criteriaExtraDataType.learningObjective
          this.handleAddRow(item.name || item.desc, item, true)
        })
        data.performanceList.forEach(item => {
          this.handleAddRow(item, data, true)
        })
        this.deleteEmptyRow()
      }
    },

    deleteEmptyRow () {
      if (this.mode === 'edit') {
        const waitDeleteRowList = []
        for (let i = 0; i < this.assessment.bodyList.length; i++) {
          let empty = true
          Object.keys(this.assessment.bodyList[i]).forEach(key => {
            if (this.assessment.bodyList[i][key]['display'] && this.assessment.bodyList[i][key]['display'].toString().trim()) {
              empty = false
            }
          })

          if (empty) {
            waitDeleteRowList.push(this.assessment.bodyList[i])
          }
        }
        waitDeleteRowList.forEach(item => {
          this.assessment.bodyList.splice(this.assessment.bodyList.indexOf(item), 1)
        })
      }
    },

    handleEditRow (row) {
      this.$logger.info('handleEditRow', row)
      this.currentEditRow = row
      this.editRowModalVisible = true
    },

    handleEditExtraRow (row) {
      this.$logger.info('handleEditExtraRow', row)
      this.currentEditExtraRow = row
      this.editExtraRowModalVisible = true
    },

    handleDelExtraRowItem (row) {
      if (this.mode === 'edit') {
        this.assessment.extraCriteriaBodyList.splice(this.assessment.extraCriteriaBodyList.indexOf(this.row), 1)
      }
      this.editRowModalVisible = false
    },

    handleDelRow () {
      if (this.mode === 'edit') {
        this.assessment.bodyList.splice(this.assessment.bodyList.indexOf(this.currentEditRow), 1)
      }
      this.editRowModalVisible = false
    },

    handleDelRowItem(item) {
      if (this.mode === 'edit') {
        this.assessment.bodyList.splice(this.assessment.bodyList.indexOf(item), 1)
      }
      this.editRowModalVisible = false
    },

    handleDelExtraRow () {
      if (this.mode === 'edit') {
        this.assessment.extraCriteriaBodyList.splice(this.assessment.extraCriteriaBodyList.indexOf(this.currentEditExtraRow), 1)
      }
      this.editExtraRowModalVisible = false
    },

    handleDeleteHeader (option) {
      this.$logger.info('handleDeleteHeader', option)
      AssessmentToolHeaderNamesDelete({
        id: option.id
      }).then(res => {
        if (res.code === 0) {
          this.optionList.splice(this.optionList.indexOf(option), 1)
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";
.assessment-tool-table {
  overflow-y: hidden;
  overflow-x: auto;
  position: relative;

  .extra-criteria-table {
    margin-bottom: 15px;
  }

  table {
    width: calc(100% - 30px);
    background: #FFFFFF;
    border-top: 2px dashed #D8DEEA;
    border-left: 2px dashed #D8DEEA;
    thead {
      tr {
        cursor: pointer;
        border-bottom: 2px solid #D8DEEA;
        th {
          position: relative;
          padding: 0;
          user-select: none;
          min-width: 100px;

          .header-action {
            position: absolute;
            right: 0;
            top: 7.5px;
            display: none;
            background-color: #fff;
            padding: 5px;
          }

          &:hover {
            .header-action {
              display: block;
            }
          }

          .header-title {
          }

          .header-tips {
            line-height: 14px;
            font-size: 12px;
            color: #888;
            font-weight: normal;
            max-width: 150px;
          }
        }
      }
    }

    tbody {
      border-bottom: 2px dashed #D8DEEA;
      tr {
        border-bottom: 2px solid #D8DEEA;
        th {
          position: relative;
          line-height: 30px;
          padding: 0;
        }
      }

      tr:nth-last-child(1) {
        border-bottom: 2px dashed #D8DEEA;
      }
    }

    th {
      position: relative;
      border-right: 2px dashed #D8DEEA;
      min-height: 40px;
      padding: 0 20px;
      font-size: 14px;
      font-family: Arial;
      font-weight: bold;
      color: #222328;
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
      box-sizing: border-box;
    }

    tr:nth-last-child(1) {
      //border-right: 2px dashed #D8DEEA;
    }
  }

  .table-bottom-bar {
    height: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .add-row {
      display: block;
      cursor: pointer;
    }
  }
}

.edit-header-action {
  padding: 0 20px 0 20px;
  .edit-header-action-item {
    min-height: 30px;
    .cc-custom-text-button {
      margin: 15px auto;
    }
  }

  .header-option {
    padding: 10px 30px 10px 10px;
    border-radius: 5px;
    background-color: #f9f9f9;
    margin: 10px auto;
    cursor: pointer;
    position: relative;

    &:hover {
      background-color: #f1f1f1;
    }

    .delete-item {
      position: absolute;
      right: 5px;
      top: 13px;
    }
  }
}

.cc-table-textarea {
  line-height: 20px;
  border: none;
  box-shadow: none;
  word-break: break-word;

  /deep/ textarea{
    font-weight: bold;
    border: none;
    box-shadow: none;
    word-break: break-word;
    white-space: pre-wrap;
  }
}

.no-header {
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 30px;
}

.row {
  position: relative;
  padding-right: 15px;
  .delete-icon {
    cursor: pointer;
    position: absolute;
    right: -15px;
    top: 50%;
    margin-top: -7px;
  }
}

.origin-data-tips {
  display: flex;
  position: absolute;
  right: 3px;
  top: 2px;
  background-color: rgb(230, 248, 243);
}
</style>
