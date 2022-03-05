<template>
  <div class='format-form'>
    <div class='format-form-header'>
      <div class='format-form-title'>
        <span class='title-num'>1</span>
        <span class='title'>{{ title }}</span>
      </div>
      <div class='format-tag-settings'>
      </div>
    </div>
    <div class='common-field-list'>
      <draggable
        class="list-group"
        tag="ul"
        v-model="myCommonList"
        v-bind="commonDragOptions"
        @start="commonDrag = true"
        @end="commonDrag = false"
      >
        <transition-group type="transition" :name="!commonDrag ? 'flip-list' : null">
          <li
            class="list-group-item"
            v-for="fieldItem in myCommonList"
            :data-field-name='fieldItem.fieldName'
            :style="{'filter': fieldItem.visible ? 'none' : 'grayscale(100%)', 'opacity': fieldItem.visible ? '1' : '0.3'}"
            :key="'fieldId' + fieldItem.id"
          >
            <div class='sort-icon'>
              <img src='~@/assets/icons/formConfig/line3_green.png' alt='' class='green'/>
              <img src='~@/assets/icons/formConfig/line3.png' alt='' class='gray'/>
            </div>
            <div class='field-item-config'>
              <div class='field-label'>
                {{ fieldItem.fieldLabel }}
              </div>
              <div class='field-config'>
                <div class='field-config-left'>
                  <div class='field-display-name field-line-item'>
                    <a-input v-model='fieldItem.showName' placeholder='Please enter the display name' class='show-name-input' />
                  </div>
                  <div class='field-display-hint-label'>
                    hint
                  </div>
                  <div class='field-display-hint field-line-item'>
                    <a-input v-model='fieldItem.hint' placeholder='Please enter the hint' class='hint-input'/>
                  </div>
                </div>
                <div class='field-config-right'>
                  <div class='tag-selected'>
                    <div class='tag-selected-list'>
                      <div class='tag-selected-item' v-for='(tag, tIdx) in fieldItem.tags' :key="'tid-' + tIdx" @click='handleSetTag(fieldItem, tag.subFieldName)'>
                        <a-tag class='my-tag-selected' :class="{'my-tag-not-optional': tag.isOptional}">
                          <template v-if='tag.isOptional'>
                            <a-icon type="safety" :style="{ fontSize: '14px', 'margin-right': '3px'}"/>
                          </template>
                          <span class='my-tag-selected-name'>
                            <span class='tag-type' v-if="fieldItem.fieldName === 'taskType' && tag.subFieldName">{{ tag.subFieldName }} - </span>
                            {{ tag.tagName }}
                          </span>
                        </a-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class='tag-setting' @click='handleSetTag(fieldItem)' v-if="fieldItem.fieldName !== 'taskType'">
                <div class='set-tag-label'>
                  Set tag
                </div>
                <a-icon type="setting" :style="{ color: '#999999', fontSize: '12px' }" class='gray' />
                <a-icon type="setting" :style="{ color: '#15C39A', fontSize: '12px' }" class='green'/>
              </div>
              <div class='task-type-tag-setting' v-if="fieldItem.fieldName === 'taskType'">
                <div class='task-type-tag-setting-item' @click="handleSetTag(fieldItem, 'fa')" >
                  <div class='set-tag-label'>
                    Set fa tag
                  </div>
                  <a-icon type="setting" :style="{ color: '#999999', fontSize: '12px' }" class='gray' />
                  <a-icon type="setting" :style="{ color: '#15C39A', fontSize: '12px' }" class='green'/>
                </div>
                <div class='task-type-tag-setting-item' @click="handleSetTag(fieldItem, 'sa')" >
                  <div class='set-tag-label'>
                    Set sa tag
                  </div>
                  <a-icon type="setting" :style="{ color: '#999999', fontSize: '12px' }" class='gray' />
                  <a-icon type="setting" :style="{ color: '#15C39A', fontSize: '12px' }" class='green'/>
                </div>
                <div class='task-type-tag-setting-item' @click="handleSetTag(fieldItem, 'activity')" >
                  <div class='set-tag-label'>
                    Set activity tag
                  </div>
                  <a-icon type="setting" :style="{ color: '#999999', fontSize: '12px' }" class='gray' />
                  <a-icon type="setting" :style="{ color: '#15C39A', fontSize: '12px' }" class='green'/>
                </div>
              </div>
              <div class='visible-toggle'>
                <div class='field-visible'>Show on</div>
                <a-switch size="small" v-model='fieldItem.visible' />
              </div>
            </div>
          </li>
        </transition-group>
      </draggable>
    </div>
    <div class='format-form-header'>
      <div class='format-form-title'>
        <span class='title-num'>2</span>
        <span class='title'> Custom field </span>
      </div>
      <div class='format-tag-settings'>
        <a-button type='primary' @click='handleAddCustomField'><a-icon type="plus" /> Add field </a-button>
      </div>
    </div>
    <div class='custom-field-list'>
      <draggable
        class="list-group"
        tag="ul"
        v-model="myCustomList"
        v-bind="customDragOptions"
        @change='handleCustomChange'
        @start="customDrag = true"
        @end="customDrag = false"
      >
        <transition-group type="transition" :name="!customDrag ? 'flip-list' : null">
          <li
            class="list-group-item"
            v-for="fieldItem in myCustomList"
            :key="'sort-' + fieldItem.sortNo"
            :style="{'filter': fieldItem.visible ? 'none' : 'grayscale(100%)', 'opacity': fieldItem.visible ? '1' : '0.3'}"
            :data-id='fieldItem.id'
          >
            <div class='sort-icon'>
              <img src='~@/assets/icons/formConfig/line3_green.png' alt='' class='green'/>
              <img src='~@/assets/icons/formConfig/line3.png' alt='' class='gray'/>
            </div>
            <div class='field-item-config'>
              <div class='field-label'>
                Field name
              </div>
              <div class='field-config'>
                <div class='field-config-left'>
                  <div class='field-display-name field-line-item'>
                    <a-input v-model='fieldItem.name' placeholder='Please enter the display name' class='show-name-input' />
                  </div>
                  <div class='field-display-hint-label'>
                    hint
                  </div>
                  <div class='field-display-hint field-line-item'>
                    <a-input v-model='fieldItem.hint' placeholder='Please enter the hint' class='hint-input'/>
                  </div>
                </div>
                <div class='field-config-right'>
                  <div class='tag-selected' v-if='fieldItem.tags && fieldItem.tags.length' @click='handleSetTag(fieldItem)'>
                    <div class='tag-selected-list'>
                      <div class='tag-selected-item' v-for='(tag, tIdx) in fieldItem.tags' :key="'tid2-' + tIdx">
                        <a-tag class='my-tag-selected' :class="{'my-tag-not-optional': tag.isOptional}">
                          <template v-if='tag.isOptional'>
                            <a-icon type="safety" :style="{ fontSize: '14px', 'margin-right': '3px'}"/>
                          </template>
                          <span class='my-tag-selected-name'>{{ tag.tagName }}</span>
                        </a-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class='tag-setting' @click='handleSetTag(fieldItem)'>
                <div class='set-tag-label'>
                  Set tag
                </div>
                <a-icon type="setting" :style="{ color: '#999999', fontSize: '12px' }" class='gray' />
                <a-icon type="setting" :style="{ color: '#15C39A', fontSize: '12px' }" class='green'/>
              </div>
              <div class='visible-toggle'>
                <div class='field-visible'>Show on</div>
                <a-switch size="small" v-model='fieldItem.visible' />
              </div>
            </div>
            <div class='delete-row'>
              <a-popconfirm
                title="Delete it?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="handleDeleteCustomField(fieldItem)"
              >
                <a-icon type="delete" />
              </a-popconfirm>
            </div>
          </li>
        </transition-group>
      </draggable>
    </div>

    <a-modal
      v-model="setTagVisible"
      :closable="false"
      :footer="null"
      width='700px'
      destroyOnClose
      :title="null">
      <modal-header :title="'Set tags for ' + (currentFieldName ? currentFieldName : 'field') + (currentSubFieldName ? ' (' + currentSubFieldName + ')' : '')" @close='handleCloseSetTags'/>
      <div class='my-set-tag'>
        <set-tag :selected-tags='currentFieldTags' @update='handleUpdateTags' />
      </div>
    </a-modal>
  </div>
</template>

<script>

import draggable from 'vuedraggable'
import SetTag from '@/components/FormConfig/SetTag'
import ModalHeader from '@/components/Common/ModalHeader'

export default {
  name: 'FormatForm',
  components: {
    ModalHeader,
    SetTag,
    draggable
  },
  props: {
    commonList: {
      type: Array,
      required: true
    },
    customList: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      commonDrag: false,
      customDrag: false,
      myCommonList: [],
      myCustomList: [],

      setTagVisible: false,
      currentFieldTags: [],
      currentFieldId: null,
      currentFieldName: null,
      currentSubFieldName: null
    }
  },
  computed: {
    commonDragOptions() {
      return {
        animation: 200,
        group: 'common',
        disabled: false,
        ghostClass: 'ghost'
      }
    },
    customDragOptions() {
      return {
        animation: 200,
        group: 'custom',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  created() {
    this.myCommonList = this.commonList.slice()
    this.myCustomList = this.customList.slice()
    this.$logger.info('FormatForm created', this.myCommonList, this.myCustomList)
  },
  methods: {
    handleAddCustomField () {
      let count = 1
      let customFieldName = `CustomField${count}`
      while (this.myCustomList.some(item => item.name === customFieldName)) {
        count++
        customFieldName = `CustomField${count}`
      }
      this.myCustomList.push({
        id: 'ext_' + Math.random(),
        name: customFieldName,
        hint: '',
        visible: true,
        sortNo: this.myCustomList.length + 1
      })
    },

    handleCustomChange (data) {
      this.$logger.info('handleCustomChange', this.myCustomList)
      this.myCustomList.forEach((item, index) => {
        item.sortNo = index
      })
    },

    handleSetTag (fieldItem, subFieldName) {
      this.$logger.info('handleSetTag', fieldItem)
      this.currentFieldId = fieldItem.id
      this.currentFieldName = fieldItem.name
      this.currentSubFieldName = subFieldName
      if (subFieldName) {
        this.currentFieldTags = fieldItem.tags.filter(item => item.subFieldName === subFieldName)
      } else {
        this.currentFieldTags = fieldItem.tags.slice()
      }
      this.setTagVisible = true
    },

    handleCloseSetTags () {
      this.setTagVisible = false
      this.currentFieldTags = []
      this.currentFieldId = null
      this.currentFieldName = null
      this.currentSubFieldName = null
    },

    handleUpdateTags (data) {
      this.$logger.info('handleUpdateTags', data)
      let fieldItem = this.myCommonList.find(item => item.id === this.currentFieldId && item.name === this.currentFieldName)
      if (!fieldItem) {
        fieldItem = this.myCustomList.find(item => item.id === this.currentFieldId && item.name === this.currentFieldName)
      }
      if (fieldItem) {
        if (this.currentSubFieldName) {
          const tags = fieldItem.tags.filter(item => item.subFieldName !== this.currentSubFieldName)
          data.forEach(item => {
            item.subFieldName = this.currentSubFieldName
          })
          fieldItem.tags = tags.concat(data)
        } else {
          fieldItem.tags = data
        }
        this.$logger.info('update field tags', fieldItem)
      } else {
        this.$logger.info('no field found')
      }
      this.setTagVisible = false
    },

    handleDeleteCustomField (fieldItem) {
      this.$logger.info('handleDeleteCustomField', fieldItem)
      this.myCustomList = this.myCustomList.filter(item => item.id !== fieldItem.id)
    },

    getFormatConfig () {
      // 校验custom字段不允许重复名称
      this.myCustomList = this.myCustomList.filter(item => item.name && item.name.trim())
      const customNameList = this.myCustomList.map(item => item.name)
      const filterCustomNameList = Array.from(new Set(customNameList))

      if (filterCustomNameList.length !== customNameList.length) {
        this.$message.warn('[' + this.title + '] Custom field name cannot be repeated')
        this.$logger.info('repeated', customNameList, filterCustomNameList)
        return false
      }

      const myCommonList = JSON.parse(JSON.stringify(this.myCommonList))
      const myCustomList = JSON.parse(JSON.stringify(this.myCustomList))
      myCommonList.forEach((item, index) => {
        item.sortNo = index + 1
      })
      myCustomList.forEach((item, index) => {
        item.sortNo = index + 1
        if (item.id.indexOf('ext_') !== -1) {
          item.id = null
        }
      })
      this.$logger.info('getFormatConfig ' + this.title, myCommonList, myCustomList)
      return {
        commonList: myCommonList,
        customList: myCustomList
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.format-form {

  .format-form-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    cursor: pointer;

    .format-form-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      .title-num {
        font-size: 18px;
        line-height: 25px;
        height: 25px;
        width: 25px;
        text-align: center;
        border-radius: 25px;
        background: #15C39A;
        color: #fff;
        margin-right: 8px;
      }

      .title {
        font-size: 16px;
        color: #333;
      }
    }
  }
  .common-field-list, .custom-field-list {
    .list-group {
      padding: 0;
      margin: 0;
      .list-group-item {
        position: relative;
        min-width: 1100px;
        margin-bottom: 15px;
        margin-right: 10px;
        background: #f8f8f8;
        padding: 10px 10px 15px 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        cursor: pointer;
        border: 1px solid #f8f8f8;

        .sort-icon {
          margin-right: 10px;
          cursor: pointer;
          img {
            height: 15px;
          }

          .green {
            display: none;
          }

          .gray {
            display: block;
          }
        }

        .field-item-config {
          display: flex;
          width: 100%;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          position: relative;

          .field-label {
            font-size: 12px;
            font-weight: 600;
            font-family: Inter-Bold;
            padding-bottom: 8px;
            color: #474747;
            padding-left: 3px;
          }
          .field-config {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .field-config-left {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
              .field-line-item {
                margin-right: 30px;

                .show-name-input {
                  width: 300px;
                }

                .hint-input {
                  width: 300px;
                }
              }
              .field-display-hint-label {
                padding-right: 10px;
                color: #999;
              }
            }

            .field-config-right {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-end;

              .tag-selected {
                .tag-selected-list {
                  margin-right: -19px;
                  padding: 5px 8px;
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: flex-start;
                  flex-wrap: wrap;

                  .tag-selected-item {
                    margin: 3px 3px 3px 0;
                    .my-tag-selected {
                      background-color: rgba(21, 195, 154, 0.1);
                      color: #15c39a;
                      border: 1px solid #15c39a;
                      border-radius: 22px;
                      padding: 0 12px;
                      display: flex;
                      align-items: center;
                      justify-content: space-between;

                      .tag-type {
                      }
                    }

                    .my-tag-not-optional {
                      background-color: #15C39A;
                      color: #fff;
                    }
                  }
                }
              }
            }
          }

          .tag-setting {
            position: absolute;
            right: 90px;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;

            .gray {
              height: 18px;
              padding-top: 3px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
            }
            .green {
              height: 18px;
              padding-top: 3px;
              display: none;
            }
            .set-tag-label {
              padding-right: 3px;
              font-size: 12px;
              color: #999999;
            }

            &:hover {
              .gray {
                display: none;
              }
              .green {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
              }
              .set-tag-label {
                color: #15C39A;
              }
            }
          }

          .task-type-tag-setting {
            position: absolute;
            right: 90px;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;

            .task-type-tag-setting-item {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-left: 12px;

              .gray {
                height: 18px;
                padding-top: 3px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
              }
              .green {
                height: 18px;
                padding-top: 3px;
                display: none;
              }
              .set-tag-label {
                padding-right: 3px;
                font-size: 12px;
                color: #999999;
              }

              &:hover {
                .gray {
                  display: none;
                }
                .green {
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: center;
                }
                .set-tag-label {
                  color: #15C39A;
                }
              }
            }
          }

          .visible-toggle {
            position: absolute;
            right: 0;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;

            .field-visible {
              font-size: 12px;
              color: #999;
              padding-right: 5px;
            }
            &:hover {
              .field-visible {
                color: #15C39A;
              }
            }
          }
        }

        .delete-row {
          position: absolute;
          right: -10px;
          top: -10px;
          color: red;
          display: none;
          width: 20px;
          height: 20px;
          background: #fbe0e0eb;
          border-radius: 20px;
          text-align: center;
        }

        &:hover {
          background: rgba(21, 195, 154, 0.1);
          color: rgba(0, 0, 0, 0.65);
          border: 1px solid #15C39A;
          .sort-icon {
            .green {
              display: block;
            }
            .gray {
              display: none;
            }
          }

          .delete-row {
            display: block;
          }
        }
      }
    }
  }
}

.my-set-tag {
  min-height: 350px;
}
</style>
