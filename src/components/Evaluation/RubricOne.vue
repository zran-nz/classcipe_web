<template>
  <div class="rubric">
    <table class="rubric-table">
      <thead>
        <draggable v-model="headers" tag="tr" class="table-header" @end="handleDragEnd">
          <th v-for="(header, hIndex) in headers" class="header-item" :key="header.type">
            <div @click="handleEditHeader(header)" class="label-text">
              {{ header.label }}
            </div>
            <template v-if="header.editable && mode !== 'evaluate'">
              <div class="label-input">
                <input v-model="header.label" @blur="handleUpdateHeader(header)"/>
              </div>
            </template>
            <div class="remove-header" v-if="header.type.startsWith('user_ext_') && mode !== 'evaluate'">
              <a-popconfirm :title="'Remove Header ?'" ok-text="Yes" @confirm="handleRemoveHeader(header)" cancel-text="No">
                <a-icon type="delete" />
              </a-popconfirm>
            </div>
            <template v-if="hIndex === headers.length - 1 && mode !== 'evaluate'">
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
          <td v-for="(header, hIndex) in headers" class="body-item" :key="lIndex + '-' + header.type" @dblclick="handleDbClickBodyItem(item, header)">
            <template v-if="item.hasOwnProperty(header.type)">
              <!--              描述内容-->
              <template v-if="header.type === 'description'">
                <template v-if="item[header.type]">
                  <div class="description">
                    {{ item[header.type] }}
                  </div>
                </template>
              </template>
              <!--              标签内容-->
              <template v-else-if="header.type === 'keywords'">
                <div class="tag-list">
                  <div class="tag-item" v-for="(tag, tIndex) in item[header.type]" :key="tIndex">
                    <a-tag :closable="mode !== 'evaluate'" @close="handleCloseTag(item, tag, $event)" :color="tagColorList[tIndex % tagColorList.length]">{{ tag }}</a-tag>
                  </div>
                  <div class="tag-item add-tag" v-if="item['description'] && mode !== 'evaluate'">
                    <span class="add-tag-icon" @click="showAddNewTagInput(item)">
                      <a-icon type="plus-circle"/>
                      <span>Add keywords</span>
                    </span>
                  </div>
                </div>
              </template>
              <!--              标签内容-->
              <template v-else>
                <a-textarea type="text" v-model="item[header.type]" class="ext-input" v-if="mode !== 'evaluate'"/>
                <div class="evaluation-item" v-if="mode === 'evaluate'" @click="toggleCheckedItem(lIndex, header.type)">
                  {{ item[header.type] }}
                  <div class="checked-flag" v-if="activeItemKey.indexOf(lIndex + '-' + header.type)">
                    <a-icon type="check" />
                  </div>
                </div>
              </template>
            </template>

            <template v-if="hIndex === headers.length - 1 && mode !== 'evaluate'">
              <div class="add-more-header">
                <a-popconfirm :title="'Delete this line ?'" ok-text="Yes" @confirm="handleDeleteLine(item)" cancel-text="No">
                  <a-icon type="delete"/>
                </a-popconfirm>
              </div>
            </template>
            <template v-if="hIndex === headers.length - 1 && mode === 'evaluate'">
              <div class="add-evidence">
                <a-popconfirm :title="'Add evidence ?'" ok-text="Yes" @confirm="handleAddEvidenceLine(item)" cancel-text="No">
                  <a-icon type="plus-circle" /> Add Evidence
                </a-popconfirm>
              </div>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="add-new-line" @click="handleAddNewLine" v-if="mode !== 'evaluate'">
      <a-icon type="plus-circle"/> Add new Line
    </div>

    <a-modal v-model="selectCurriculumVisible" @ok="handleEnsureSelect" destroyOnClose width="80%" :dialog-style="{ top: '20px' }">
      <div class="associate-library">
        <new-browser :select-mode="selectModel.knowledgeDescription" question-index="evaluation_"/>
      </div>
    </a-modal>

    <a-modal
      v-model="selectKnowledgeTagVisible"
      :footer="null"
      :maskClosable="false"
      destroyOnClose
      title="Add keywords">
      <div class="add-tag-wrapper">
        <add-keyword-tag :current-tag="addTagItem" @add-tag="handleAddNewTag" @remove-tag="handleRemoveTag"/>
      </div>
      <div class="add-tag-action">
        <a-button type="primary" @click="handleEnsureAddTag">Ok</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>

import { LibraryEvent, LibraryEventBus } from '@/components/NewLibrary/LibraryEventBus'
import { SelectModel } from '@/components/NewLibrary/SelectModel'
import draggable from 'vuedraggable'
import NewBrowser from '@/components/NewLibrary/NewBrowser'
import AddKeywordTag from '@/components/Evaluation/AddKeywordTag'

export default {
  name: 'RubricOne',
  components: {
    AddKeywordTag,
    draggable,
    NewBrowser
  },
  props: {
    descriptionList: {
      type: Array,
      default: () => []
    },
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
    }
  },
  data () {
    return {
      selectModel: SelectModel,
      selfHeaderAddIndex: 1,
      headers: [
        { label: 'Criteria', previewLabel: 'Criteria', type: 'description', editable: false, required: true },
        { label: 'Key words', previewLabel: 'Key words', type: 'keywords', editable: false, required: true },
        { label: 'Specific Indicator', previewLabel: 'Specific Indicator', type: 'user_ext_0', editable: false, required: false }
      ],
      list: [],

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

      descriptionTagList: [],
      subKnowledgeId2InfoMap: new Map(),
      currentSelectLine: null,
      addTagItem: null,
      activeItemKey: []
    }
  },
  created () {
    this.$logger.info('RubricOne created ' + this.mode, this.descriptionList, this.initRawHeaders)
    if (this.initRawHeaders.length) {
      this.headers = this.initRawHeaders
    }

    if (this.initRawData.length) {
      this.list = this.initRawData
    }
    LibraryEventBus.$on(LibraryEvent.ContentListSelectClick, this.handleContentListSelectClick)
  },
  destroyed () {
    LibraryEventBus.$off(LibraryEvent.ContentListSelectClick, this.handleContentListSelectClick)
    this.$logger.info('off NewClickableKnowledgeTag ContentListSelectClick handler')
  },
  watch: {
    descriptionList (newDescriptionList) {
      this.$logger.info('descriptionList change', newDescriptionList)
      newDescriptionList.forEach(item => {
        const existObject = this.list.find(lineItem => lineItem.description === item.description)
        if (existObject) {
          if (existObject.keywords && existObject.keywords.length) {
            item.tagList.forEach(keyword => {
              if (existObject.keywords.indexOf(keyword) === -1) {
                existObject.keywords.push(keyword)
              }
            })
          }
        } else {
          const newItem = {
            description: item.description,
            keywords: item.tagList,
            type: item.type
          }
          this.headers.forEach(header => {
            if (!header.required) {
              newItem[header.type] = null
            }
          })
          this.$logger.info('add list new description', newItem)
          this.list.push(newItem)
        }
      })
      this.$logger.info('after update list', this.list)
    },
    initRawHeaders (newList) {
      this.$logger.info('initRawHeaders change', newList)
      if (newList.length) {
        this.headers = newList
      }
    },
    initRawData (newList) {
      this.$logger.info('initRawData change', newList)
      if (newList.length) {
        this.$logger.info('after initRawData', newList)
        this.list = newList
      }
    }
  },
  methods: {
    handleContentListSelectClick (data) {
      if (data.questionIndex === 'evaluation_') {
        this.$logger.info('evaluation handleContentListSelectClick hit', data)
        const tagIndex = this.descriptionTagList.findIndex(tItem => tItem.subKnowledgeId === data.subKnowledgeId)
        if (tagIndex === -1) {
          this.subKnowledgeId2InfoMap.set(data.subKnowledgeId, {
            ...data
          })
          this.descriptionTagList.push({
            subKnowledgeId: data.subKnowledgeId,
            tagList: [],
            _updateTimestamp: 0
          })
        } else {
          this.descriptionTagList.splice(tagIndex, 1)
          this.$logger.info('remove evaluation', this.descriptionList)
        }
        LibraryEventBus.$emit(LibraryEvent.ContentListSelectedListUpdate, { id: data.subKnowledgeId })
        this.$logger.info('evaluation subKnowledgeId2InfoMap[' + data.subKnowledgeId + ']', this.subKnowledgeId2InfoMap.get(data.subKnowledgeId))
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
      if (header.type === 'description' && this.mode !== 'evaluate') {
        this.selectCurriculumVisible = true
        this.currentSelectLine = item
      }
    },

    handleEnsureSelect () {
      this.$logger.info('handleEnsureSelect', this.descriptionTagList)
      this.selectCurriculumVisible = false
      this.descriptionTagList.forEach(item => {
        const data = this.subKnowledgeId2InfoMap.get(item.subKnowledgeId)
        this.$logger.info('subKnowledgeId ' + item.subKnowledgeId, data)
        const existObject = this.list.find(item => item.description === data.description)
        if (existObject) {
          if (existObject.keywords && existObject.keywords.length) {
            item.tagList.forEach(keyword => {
              if (existObject.keywords.indexOf(keyword) === -1) {
                existObject.keywords.push(keyword)
              }
            })
          }
        } else {
          const newItem = {
            type: 'knowledge',
            description: data.description,
            keywords: data.tagList ? data.tagList : []
          }
          this.headers.forEach(header => {
            if (!header.required) {
              newItem[header.type] = null
            }
          })
          this.$logger.info('add list new description', newItem)
          this.list.push(newItem)
        }
      })
      this.list = this.list.filter(item => item !== this.currentSelectLine)
    },

    handleAddNewTag (item) {
      this.$logger.info('handleAddNewTag', item)
      this.addTagItem.keywords.push(item.tagName)
    },

    handleRemoveTag (item) {
      this.$logger.info('handleRemoveTag', item)
      this.addTagItem.keywords.splice(this.addTagItem.keywords.indexOf(item))
    },

    showAddNewTagInput (item) {
      this.$logger.info('showAddNewTagInput', item)
      this.selectKnowledgeTagVisible = true
      this.addTagItem = item
    },

    handleEnsureAddTag () {
      this.$logger.info('handleEnsureAddTag')
      this.selectKnowledgeTagVisible = false
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

    handleAddEvidenceLine (item) {
      this.$logger.info('handleAddEvidenceLine', item)
      this.$message.warn('coming soon!')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
  .rubric {
    .rubric-table {
      table-layout: fixed;
      margin: auto;

      .table-header {

        border-top: 1px solid #999;
        border-left: 1px solid #999;
        background-color: @outline-color;

        .header-item {
          position: relative;
          box-sizing: border-box;
          border-right: 1px solid #999;
          border-bottom: 1px solid #999;
          padding: 0;
          min-width: 140px;
          max-width: 400px;

          .label-text {
            padding: 5px 10px;
            line-height: 25px;
            vertical-align: middle;
            cursor: pointer;
            z-index: 50;
            font-weight: bold;
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
              font-weight: bold;
              outline: none;
              vertical-align: middle;
              text-decoration: underline;
              padding: 5px 10px;
              line-height: 25px;
              width: 100%;
              border: none;
              background-color: #fff;
            }
          }

          .remove-header {
            position: absolute;
            right: 5px;
            top: 50%;
            margin-top: -13px;
            background: @primary-color;
            padding: 3px;
            color: red;
            display: none;
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
        border-left: 1px solid @outline-color;

        .body-line {

          .body-item {
            position: relative;
            max-width: 400px;
            min-width: 140px;
            height: 35px;
            line-height: 25px;
            box-sizing: border-box;
            border-right: 1px solid #999;
            border-bottom: 1px solid #999;

            .description {
              padding: 5px 10px;
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
                  margin-top: 3px;
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
            width: 20px;
            height: 20px;
            align-items: center;
            justify-content: center;
            top: 50%;
            margin-top: -10px;
          }

          .add-evidence {
            cursor: pointer;
            position: absolute;
            right: -110px;
            font-size: 14px;
            color: @primary-color;
            top: 50%;
            margin-top: -12px;
          }
        }
      }
    }
  }

.add-new-line {
  margin: auto;
  margin-top: 10px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  user-select: none;
}

.add-tag-action {
  margin-top: 20px;
  text-align: right;
}

.add-tag-icon {
  color: #bbb;
  align-items: center;
  display: flex;
  justify-content: flex-start;
  cursor: pointer;
  i {
    height: 100%;
  }
  span {
    padding: 5px;
    font-size: 12px;
  }
}

.ext-input {
  width: 100%;
  height: 100%;
  border: none;
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
