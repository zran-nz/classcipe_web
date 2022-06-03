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
          <tr v-for='row in assessment.extraCriteriaBodyList' :key='row.key'>
            <th v-for='header in assessment.headerList' :key='header.type' @dblclick='handleEditExtraRow(row)'>
              <a-textarea
                :auto-size="{ minRows: 2, maxRows: 5 }"
                class='cc-table-textarea'
                v-model='row[header.type].display'
                :style="{ backgroundColor: header.bgColor || '#ffffff' }" />
            </th>
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
              <a-input class='cc-table-input' v-model='header.title' @click.native.stop='' @blur.native='currentEditHeader.editing = false'/>
            </template>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='row in assessment.bodyList' :key="'row_' + row.key">
          <th v-for='header in assessment.headerList' :key="'rc_' + row.key + '_' + header.type" @dblclick='handleEditRow(row)'>
            <a-textarea
              :auto-size="{ minRows: 2, maxRows: 5 }"
              class='cc-table-textarea'
              v-model='row[header.type].display'
              :style="{ backgroundColor: header.bgColor || '#ffffff' }" />
          </th>
        </tr>
      </tbody>
    </table>
    <div class='table-bottom-bar'>
      <div class='add-row' v-if='mode === AssessmentMode.edit'>
        <plus-icon color='#a9adb4' @click='handleAddRow' />
      </div>
      <div class='right-action'>
        <custom-link-text text='Save as set of options' @click='handleSaveHeaderAsSet'></custom-link-text>
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
          <custom-text-button label='Add a column' @click='handleAddCol' v-if='currentEditHeader.canAddCustomCol'></custom-text-button>
          <custom-text-button label='Delete current column' @click='handleDelCol' v-if='currentEditHeader.canAddCustomCol'></custom-text-button>
          <custom-text-button label='Edit column name' @click='handleEditName'></custom-text-button>
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
          <custom-text-button label='Delete current column' @click='handleDelRow'></custom-text-button>
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
          <custom-text-button label='Delete current column' @click='handleDelExtraRow'></custom-text-button>
        </div>
      </div>
    </a-modal>

    <a-modal
      v-model='selectHeaderSetModalVisible'
      destroyOnClose
      :title='null'
      :closable='false'
      :footer='null'>
      <modal-header title="Select header option" @close='selectHeaderSetModalVisible = false'/>
      <div class='edit-header-action'>
        <div class='edit-header-action-item header-option' v-for='(options, idx) in optionList' :key='idx' @click='selectHeaderSet(options)'>
          <a-tag v-for='(option,oIdx) in options.headerNameList' :key='oIdx'>{{ option }}</a-tag>
          <delete-icon @click.stop='handleDeleteHeader(options)' class='delete-item'/>
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
import { AssessmentMode, AssessmentToolsEvent, HeaderType } from '@/components/AssessmentTool/Constant'
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
import html2canvas from 'html2canvas'

export default {
  name: 'AssessmentToolTable',
  components: { CustomLinkText, ModalHeader, CustomTextButton, DeleteIcon, PlusIcon, CommonNoData },
  inject: [ 'assessment' ],
  props: {
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
    }
  },
  data() {
    return {
      editingData: null,
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
      }
    }
  },
  mounted() {
    this.globalClick(this.handleClick)
  },
  created() {
    this.asyncSaveTableData = debounce(this.autoSaveAssessment, 1500)
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

    handleClick () {
      if (this.currentEditHeader) {
        this.currentEditHeader.editing = false
        // 如果是checkList那么顺便修改对应的列数据
        if (this.currentEditHeader.type === HeaderType.yes || this.currentEditHeader.type === HeaderType.no) {
          this.assessment.bodyList.forEach(row => {
            row[this.currentEditHeader.type].display = this.currentEditHeader.title
          })
        }
      }
    },

    handleEditName () {
      this.currentEditHeader.editing = true
      this.editHeaderModalVisible = false
    },

    handleDelCol () {
      if (this.mode === 'edit') {
        this.assessment.headerList.splice(this.assessment.headerList.indexOf(this.currentEditHeader), 1)
        this.assessment.bodyList.forEach(row => {
          this.$delete(row, this.currentEditHeader.type)
        })
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
    handleAddRow (criteriaDisplay, extraData) {
      const row = {
        key: Math.random()
      }
      this.assessment.headerList.forEach(item => {
        if (item.type === HeaderType.criteria) {
          row[item.type] = {
            display: criteriaDisplay || null,
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
      const headerNameList = this.assessment.headerList.map(item => item.title)
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
      } else {
        this.$message.success('This header has been saved')
      }
    },

    selectHeaderSet (options) {
      let index = 0
      this.assessment.headerList.forEach(header => {
        if (header.type.startsWith(HeaderType.custom)) {
          header.title = options[index % options.length]
          index++
        }
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

        html2canvas(this.$refs.table, {
          allowTaint: true,
          useCORS: true,
          scrollX: window.pageXOffset,
          scrollY: window.pageYOffset,
          x: window.pageXOffset,
          y: window.pageYOffset
        }).then(canvas => {
          canvas.style.opacity = '1'
          canvas.style.zIndex = '99999999'
          canvas.style.transition =
            'transform 0.3s cubic-bezier(0.42, 0, 0.58, 1),opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1),-webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1)'
          data.assessmentToolPreviewImgBase64 = canvas.toDataURL('image/png', 1)
          this.$logger.info('autoSaveAssessment', data)
          AssessmentToolInfoSave(data).then((res) => {
            if (res.code === 0) {
              this.$EventBus.$emit('assessment-saved')
            } else {
              this.$message.error(res.message)
            }
          }).finally(() => {
            this.$emit('update:saving', false)
          })
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
          this.handleAddRow(item.name || item.desc, item)
        })
        data.learningObjectiveList.forEach(item => {
          item.type = this.criteriaExtraDataType.learningObjective
          this.handleAddRow(item.name || item.desc, item)
        })
        data.performanceList.forEach(item => {
          item.type = this.criteriaExtraDataType.performance
          this.handleAddRow(item.name || item.desc, item)
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

    handleDelRow () {
      if (this.mode === 'edit') {
        this.assessment.bodyList.splice(this.assessment.bodyList.indexOf(this.currentEditRow), 1)
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
    width: 100%;
    background: #FFFFFF;
    border-top: 2px dashed #D8DEEA;
    border-left: 2px dashed #D8DEEA;
    thead {
      tr {
        cursor: pointer;
        border-bottom: 2px solid #D8DEEA;
        th {
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
          line-height: 30px;
          padding: 0;
        }
      }

      tr:nth-last-child(1) {
        border-bottom: 2px dashed #D8DEEA;
      }
    }

    th {
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
      border-right: 2px dashed #D8DEEA;
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

.cc-table-input {
  min-height: 40px;
  line-height: 100%;
  border: none;
  box-shadow: none;

  /deep/ input{
    font-weight: bold;
    border: none;
    box-shadow: none;
  }
}

.cc-table-textarea {
  line-height: 20px;
  border: none;
  box-shadow: none;

  /deep/ textarea{
    font-weight: bold;
    border: none;
    box-shadow: none;
  }
}

.no-header {
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 30px;
}

</style>
