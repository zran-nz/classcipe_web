<template>
  <div class="rubric">
    <table class="rubric-table">
      <thead>
        <draggable v-model="headers" tag="tr" class="table-header" @end="handleDragEnd">
          <th v-for="(header, hIndex) in headers" class="header-item" :key="header.type" v-if="header.type !== 'Evidence'">
            <div class="edit-icon" @click="handleEditHeader(header)" v-if="header.editable && mode !== 'evaluate' && mode !== 'preview'">
              <img src="~@/assets/icons/evaluation/edit.png" class="link-icon"/>
            </div>
            <div @click="handleEditHeader(header)" class="label-text">
              {{ header.label }}
            </div>
            <template v-if="header.editable && mode !== 'evaluate' && mode !== 'preview'">
              <div class="label-input">
                <input v-model="header.label" @blur="handleUpdateHeader(header)" class="header-input-item"/>
              </div>
            </template>
            <div class="remove-header" v-if="header.type.startsWith('user_ext_') && mode !== 'evaluate' && mode !== 'preview'">
              <a-popconfirm :title="'Remove Header ?'" class="rubric-delete-popconfirm" ok-text="Yes" @confirm="handleRemoveHeader(header)" cancel-text="No">
                <template slot="icon">
                  <div class="rubric-big-delete">
                    <img class="big-delete-icon" src="~@/assets/icons/evaluation/big_delete.png" />
                  </div>
                </template>
                <img src="~@/assets/icons/evaluation/delete.png" class="link-icon"/>
              </a-popconfirm>
            </div>
            <template v-if="hIndex === headers.length - 1 && mode !== 'evaluate' && mode !== 'preview' && allowAddColumn">
              <div class="add-more-header">
                <a-tooltip title="Add new column">
                  <a-icon type="plus-circle" @click="handleAddNewHeader"/>
                </a-tooltip>
              </div>
            </template>
          </th>
        </draggable>
      </thead>

      <tbody class="table-body">
        <tr v-for="(item, lIndex) in list" class="body-line" :key="lIndex">
          <td
            v-for="(header, hIndex) in headers"
            class="body-item"
            v-if="header.type !== 'Evidence'"
            :data-type="header.type"
            :key="lIndex + '-' + header.type"
            @dblclick="handleDbClickBodyItem(item, header)">
            <template v-if="item.hasOwnProperty(header.type)">
              <!--              Criteria-->
              <template v-if="header.type === 'criteria'">
                <template v-if="item[header.type]">
                  <div class="level">
                    {{ item[header.type] }}
                  </div>
                </template>
              </template>
              <!--              描述内容-->
              <template v-else-if="header.type === 'description'">
                <template v-if="item[header.type]">
                  <div class="description">
                    {{ item[header.type] }}
                  </div>
                </template>
              </template>
            </template>

            <template v-if="hIndex === headers.length - 1 && mode !== 'evaluate' && mode !== 'preview'">
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

            <template v-if="hIndex === headers.length - 1">
              <div class="add-evidence" @click="handleAddEvidenceLine(lIndex, item)">
                <img src="~@/assets/icons/evaluation/tianjia@2x.png" />
                <div class="add-text">
                  <add-icon />
                </div>
              </div>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="add-new-line" @click="handleAddNewLine" v-if="mode !== 'evaluate' && mode !== 'preview'">
      <div class="add-new-line-item">
        <a-icon type="plus-circle" theme="filled"/>
      </div>
    </div>

    <a-modal v-model="selectCurriculumVisible" @ok="handleEnsureSelect" destroyOnClose width="80%" :dialog-style="{ top: '20px' }">
      <div class="associate-library">
        <new-browser
          :select-mode="selectModel.knowledgeDescription"
          :show-menu="showMenuList"
          :default-active-menu="defaultActiveMenu"
          @select-big-idea="handleSelectBigIdeaData"
          @select-sync="handleSelectListData"
          @select-curriculum="handleSelectCurriculum"
          @select-subject-specific-skill="handleSelectSubjectSpecificSkillListData"
          @select-century-skill="handleSelect21CenturySkillListData"
          question-index="evaluation_"/>
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
import EvaluationFormType from '@/components/Evaluation/EvaluationFormType'
import AddIcon from '@/assets/svgIcon/evaluation/form/tianjia.svg'
const { GetMyGrades } = require('@/api/teacher')

export default {
  name: 'RubricOne',
  components: {
    AddIcon,
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
    mode: {
      type: String,
      default: null
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
      headers: [],
      list: [],
      defaultActiveMenu: NavigationType.learningOutcomes,
      showMenuList: [ NavigationType.sdg, NavigationType.specificSkills, NavigationType.centurySkills, NavigationType.learningOutcomes ],

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

      currentSelectLine: null,
      addTagItem: null,
      activeItemKey: [],
      gradeIdMapName: new Map(),

      // 已选择的大纲知识点描述数据
      selectedDescriptionList: []
    }
  },
  created () {
    this.$logger.info('RubricOne created ' + this.mode + ' allowAddColumn ', this.initRawHeaders, this.initRawData)
    if (this.initRawHeaders.length) {
      this.headers = this.initRawHeaders
    } else {
      if (this.formType === EvaluationFormType.Rubric) {
        this.headers = [
          { label: 'Criteria', previewLabel: 'Criteria', type: 'criteria', editable: false, required: true },
          { label: '1-2', previewLabel: '1-2', type: 'indicator', editable: true, required: false },
          { label: '3-4', previewLabel: '3-4', type: 'indicator', editable: true, required: false },
          { label: 'Evidence', previewLabel: 'Evidence', type: 'evidence', editable: false, required: true }
        ]
      } else if (this.formType === EvaluationFormType.CenturySkills) {
        this.headers = [
          { label: 'Criteria', previewLabel: 'Criteria', type: 'criteria', editable: false, required: true },
          { label: 'Description', previewLabel: 'Description', type: 'description', editable: false, required: true },
          { label: 'Task specific indicators', previewLabel: 'Task specific indicators', type: 'indicator', editable: false, required: true },
          { label: 'Evidence', previewLabel: 'Evidence', type: 'evidence', editable: false, required: true }
        ]
      }
    }

    GetMyGrades().then((response) => {
      this.$logger.info('GetMyGrades', response.result)
      this.gradeList = response.result
      this.gradeList.forEach(item => {
        this.gradeIdMapName.set(item.id, item.name)
      })
    }).catch((e) => {
      this.$logger.error(e)
    })

    if (this.initRawData.length) {
      this.list = this.initRawData
    }
    LibraryEventBus.$on(LibraryEvent.ContentListSelectClick, this.handleContentListSelectClick)
  },
  destroyed () {
    LibraryEventBus.$off(LibraryEvent.ContentListSelectClick, this.handleContentListSelectClick)
    this.$logger.info('off NewClickableKnowledgeTag ContentListSelectClick handler')
  },
  methods: {
    handleContentListSelectClick (data) {
      if (data.questionIndex === 'evaluation_') {
        this.$logger.info('evaluation handleContentListSelectClick hit', data)
        LibraryEventBus.$emit(LibraryEvent.ContentListSelectedListUpdate, { id: data.subKnowledgeId })
      }
    },
    handleEditHeader (header) {
      this.$logger.info('handleEditHeader', header)
      this.headers.forEach(item => {
        if (item.label.length === 0) {
          item.label = item.previewLabel
        }
      })

      this.headers.forEach(item => {
        if (item === header) {
          item.editable = true
          item.previewLabel = item.label
        } else {
          item.editable = false
        }
      })
    },

    handleUpdateHeader (header) {
      this.$logger.info('handleUpdateHeader', header)
      this.headers.forEach(item => {
        if (item.label.length === 0) {
          item.label = item.previewLabel
        }
      })

      this.headers.forEach(item => {
        if (item.type === header.type && header.name === item.name) {
          item.editable = false
        }
      })
    },

    handleAddNewHeader () {
      this.$logger.info('handleAddNewHeader this.selfHeaderTypeIndex ' + this.selfHeaderAddIndex)
      const headerItem = {
        label: 'Unnamed',
        previewLabel: 'Unnamed',
        type: 'user_ext_' + this.selfHeaderAddIndex,
        editable: false
      }
      this.headers.push(headerItem)
      // 未原始的数据添加列
      const oldList = JSON.parse(JSON.stringify(this.list))
      oldList.forEach(item => {
        item[headerItem.type] = null
      })
      this.list = oldList
      this.$logger.info('after update list', this.list)
      this.selfHeaderAddIndex++
    },

    handleRemoveHeader (header) {
      this.$logger.info('handleRemoveHeader ', header)
      const index = this.headers.findIndex(item => item.type === header.type)
      if (index !== -1) {
        this.headers.splice(index, 1)
      }
      const oldList = JSON.parse(JSON.stringify(this.list))
      oldList.forEach(item => {
        delete item[header.type]
      })
      this.list = oldList
      this.$logger.info('after delete column update list', this.list)
    },

    handleAddNewLine () {
      this.$logger.info('handleAddNewLine ')
      const newLineItem = {}
      this.headers.forEach(item => {
        newLineItem[item.label] = null
      })
      newLineItem.keywords = []
      this.$logger.info('init new line ', newLineItem)
      this.list.push(newLineItem)
    },

    handleDragEnd () {
      this.$logger.info('handleDragEnd', this.headers)
    },

    handleCloseTag (item, tag, event) {
      event.preventDefault()
      this.$logger.info('handleCloseTag ', item.keywords)
      item.keywords = item.keywords.filter(name => name !== tag)
      this.$logger.info('after handleCloseTag', item.keywords)
    },

    handleDeleteLine (deleteLine) {
      this.$logger.info('handleDeleteLine', deleteLine)
      this.list = this.list.filter(item => item !== deleteLine)
    },

    handleDbClickBodyItem (item, header) {
      this.$logger.info('handleDbClickBodyItem', item, header)
      if ((header.type === 'description' || header.type === 'level') && this.mode !== 'evaluate' && this.mode !== 'preview') {
        this.selectCurriculumVisible = true
        this.currentSelectLine = item
      }
    },

    handleEnsureSelect () {
      this.$logger.info('handleEnsureSelect')
      this.selectCurriculumVisible = false
    },

    toggleCheckedItem (lIndex, type) {
      const key = lIndex + '-' + type
      const index = this.activeItemKey.indexOf(key)
      if (index !== -1) {
        this.activeItemKey.splice(index, 1)
      } else {
        this.activeItemKey.push(key)
      }
    },

    handleAddEvidenceLine (lIndex, item) {
      this.$logger.info('handleAddEvidenceLine', lIndex, item)
      this.$emit('add-evidence', {
        index: lIndex, data: item
      })
    },

    handleSelectBigIdeaData (data) {
      if (typeof data === 'string') {
        this.selectNewBigIdea = data
        return
      }
      this.$logger.info('handleSelectBigIdeaData', data)
      this.selectedBigIdeaList = data
    },

    // TODO 自动更新选择的sync 的数据knowledgeId和name列表
    handleSelectListData (data) {
      this.$logger.info('handleSelectListData', data)
      this.selectedSyncList = data
    },

    handleSelectCurriculum (data) {
      this.$logger.info('handleSelectCurriculum', data)
      this.selectedCurriculumList = data
    },

    handleSelectSubjectSpecificSkillListData (data) {
      this.selectedSpecificSkillList = data
      this.$logger.info('handleSelectSubjectSpecificSkillListData', data)
    },

    handleSelect21CenturySkillListData (data) {
      this.$logger.info('handleSelect21CenturySkillListData', data)
      this.selectedCenturySkillList = data
    },

    // TODO 自动更新选择的sync 的数据knowledgeId和name列表
    handleCancelSelectData () {
      this.selectedSyncList = []
      this.selectedCurriculumList = []
      this.selectedSpecificSkillList = []
      this.selectedCenturySkillList = []
      this.selectSyncDataVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
  .rubric {
    .rubric-table {
      table-layout: fixed;

      .table-header {
        border-top: 1px solid #15C39A;
        border-left: 1px solid #15C39A;
        background: #15C39A;

        .header-item:hover {
          background: #07AB84;
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
            line-height: 25px;
            vertical-align: middle;
            cursor: pointer;
            z-index: 50;
            font-family: Inter-Bold;
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
            line-height: 25px;
            box-sizing: border-box;
            border-right: 1px solid rgba(216, 216, 216, 1);
            border-bottom: 1px solid rgba(216, 216, 216, 1);

            .description {
              padding: 10px;
              background: rgba(228, 228, 228, 0.2);
              outline: none;
              font-family: Inter-Bold;
              line-height: 16px;
              color: #11142D;
            }

            .level, .main_subject, .sub_subject, .tag-list {
              padding: 10px;
            }

            .tag-list {
              padding: 5px 10px;
              display: flex;
              flex-direction: column;
              .tag-item {
                margin-bottom: 3px;
                span {
                  max-width: 150px;
                  word-break:normal;
                  width:auto;
                  white-space:pre-wrap;
                  word-wrap : break-word;
                }
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
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  .add-new-line-item {
    cursor: pointer;
    color: #888996;
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

</style>
