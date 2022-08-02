<template>
  <div class='format-form'>
    <div class='step-item' v-for='(step, sIdx) in steps' :key='step.key'>
      <div class='format-form-header'>
        <div class='format-form-title'>
          <span class='title-num'>{{ sIdx + 1 }}</span>
          <span class='title'>
            <template v-if='!step.nameEditing'>
              {{ step.name }}
              <span class='edit-icon' @click='step.nameEditing = true'><a-icon type="edit" /></span>
            </template>
            <template v-if='step.nameEditing'>
              <a-input v-model='step.name' @keyup.native.enter='step.nameEditing = false'/>
              <span class='edit-icon' @click='step.nameEditing = false'><a-icon type="check" /></span>
            </template>
          </span>
        </div>

        <div class='step-tag-config'>
          <div class='tag-selected' v-if='step.tags && step.tags.length' @click='handleSetTag(step)'>
            <div class='tag-selected-list'>
              <div class='tag-selected-item' v-for='(tag, tIdx) in step.tags' :key="'tid2-' + tIdx">
                <a-tag class='my-tag-selected'>
                  <span class='my-tag-selected-name'>{{ tag }}</span>
                </a-tag>
              </div>
            </div>
          </div>
        </div>

        <div class='format-tag-settings'>

          <div class='tag-setting' @click='handleStepSetTag(step)'>
            <div class='set-tag-label'>
              <a-tooltip title='You can prioritize tag categories to show on the tag box for this step.'>
                Set tag
              </a-tooltip>
            </div>
            <a-icon type="setting" :style="{ color: '#999999', fontSize: '12px' }" class='gray' />
            <a-icon type="setting" :style="{ color: '#15C39A', fontSize: '12px' }" class='green'/>
          </div>
          <div class='step-visible-toggle' v-show='stepEnableConfig(step)'>
            <div class='field-visible'>Enable</div>
            <a-switch size="small" v-model='step.visible' @change='showStepChangeTips'/>
          </div>
        </div>
      </div>
      <div class='common-field-list'>
        <draggable
          class="list-group"
          tag="ul"
          :group="step.id"
          :disabled='sIdx > 1 || !allowDrag'
          v-model="step.commonFieldItems"
          v-bind="commonDragOptions"
          @start="commonDrag = true"
          @end="disableCommonDrag"
        >
          <li
            class="list-group-item"
            v-for="fieldItem in step.commonFieldItems"
            :data-field-name='fieldItem.fieldName'
            :style="{'filter': fieldItem.visible ? 'none' : (fieldItem.tags.some(item => !item.isOptional) ? 'none' : 'grayscale(100%)')}"
            :key="'fieldId' + fieldItem.id"
            :data-id='fieldItem.id'
          >
            <div class='sort-icon vertical-center' @mousedown='allowDrag = true'>
              <img src='~@/assets/icons/formConfig/line3_green.png' alt='' class='green'/>
              <img src='~@/assets/icons/formConfig/line3.png' alt='' class='gray'/>
            </div>
            <div class='field-item-config'>
              <div class='field-label'>
                {{ fieldItem.fieldLabel }}
                <a-tooltip placement="top" title="Required" v-if='requiredFieldList.indexOf(fieldItem.fieldName) !== -1'>
                  <span class='required vertical-center'>*</span>
                </a-tooltip>
              </div>
              <div class='field-config'>
                <div class='field-config-left'>
                  <div class='field-display-name field-line-item'>
                    <a-input v-model='fieldItem.showName' placeholder='Please enter the display name' class='show-name-input' @change='showSectionChangeTips' />
                  </div>
                  <div class='field-display-hint-label'>
                    hint
                  </div>
                  <div class='field-display-hint field-line-item'>
                    <a-input v-model='fieldItem.hint' placeholder='Please enter the hint' class='hint-input'/>
                  </div>
                </div>
              </div>
              <div class='visible-toggle' v-if='requiredFieldList.indexOf(fieldItem.fieldName) === -1'>
                <div class='field-visible'>Enable</div>
                <a-switch size="small" v-model='fieldItem.visible' @change="handleChangeCommonField(sIdx,fieldItem)"/>
              </div>
            </div>
          </li>
        </draggable>
      </div>
      <template v-if='sIdx <= 1'>
        <div class='format-form-header'>
          <div class='format-form-title'>
            <span class='title custom-title'> Customized sections </span>
          </div>
          <div class='format-tag-settings'>
            <a-button type='primary' @click.native='handleAddCustomField(step)'><a-icon type="plus" /> Add section </a-button>
          </div>
        </div>
        <div class='custom-field-list'>
          <draggable
            class="list-group"
            tag="ul"
            :disabled='!allowDrag'
            :group="'cust-' + step.id"
            v-model="step.customFieldItems"
            v-bind="customDragOptions"
            @change='handleCustomChange'
            @start="customDrag = true"
            @end="disableCustomDrag"
          >
            <li
              class="list-group-item"
              v-for="fieldItem in step.customFieldItems"
              :key="'sort-' + fieldItem.id"
              :style="{'filter': fieldItem.visible ? 'none' : (fieldItem.tags.some(item => !item.isOptional) ? 'none' : 'grayscale(100%)')}"
              :data-id='fieldItem.id'
            >
              <div class='sort-icon vertical-center' @mousedown='allowDrag = true'>
                <img src='~@/assets/icons/formConfig/line3_green.png' alt='' class='green'/>
                <img src='~@/assets/icons/formConfig/line3.png' alt='' class='gray'/>
              </div>
              <div class='field-item-config'>
                <div class='field-label'>
                  Section name
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
                  <!--                <div class='field-config-right'>-->
                  <!--                  <div class='tag-selected' v-if='fieldItem.tags && fieldItem.tags.length' @click='handleSetTag(fieldItem)'>-->
                  <!--                    <div class='tag-selected-list'>-->
                  <!--                      <div class='tag-selected-item' v-for='(tag, tIdx) in fieldItem.tags' :key="'tid2-' + tIdx">-->
                  <!--                        <a-tag class='my-tag-selected' :class="{'my-tag-not-optional': tag.isOptional}">-->
                  <!--                          <template v-if='tag.isOptional'>-->
                  <!--                            <a-icon type="safety" :style="{ fontSize: '14px', 'margin-right': '3px'}"/>-->
                  <!--                          </template>-->
                  <!--                          <span class='my-tag-selected-name'>{{ tag.tagName }}</span>-->
                  <!--                        </a-tag>-->
                  <!--                      </div>-->
                  <!--                    </div>-->
                  <!--                  </div>-->
                  <!--                </div>-->
                </div>
                <!--              <div class='tag-setting' @click='handleSetTag(fieldItem)'>-->
                <!--                <div class='set-tag-label'>-->
                <!--                  Set tag-->
                <!--                </div>-->
                <!--                <a-icon type="setting" :style="{ color: '#999999', fontSize: '12px' }" class='gray' />-->
                <!--                <a-icon type="setting" :style="{ color: '#15C39A', fontSize: '12px' }" class='green'/>-->
                <!--              </div>-->
                <div class='visible-toggle'>
                  <div class='field-visible'>Enable</div>
                  <a-switch size="small" v-model='fieldItem.visible' @change="handleChangeCustomField(sIdx,fieldItem)" />
                </div>
              </div>
              <div class='delete-row'>
                <a-popconfirm
                  title="Delete it?"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="handleDeleteCustomField(sIdx,fieldItem)"
                >
                  <a-icon type="delete" />
                </a-popconfirm>
              </div>
            </li>
          </draggable>
        </div>
      </template>
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
        <set-tag :selected-tags='currentFieldTags' @update='handleUpdateStepTags' @go-to-tag-page='handleGotoTagPage' />
      </div>
    </a-modal>
  </div>
</template>

<script>

import draggable from 'vuedraggable'
import SetTag from '@/components/FormConfig/SetTag'
import ModalHeader from '@/components/Common/ModalHeader'
import storage from 'store'
const { debounce } = require('lodash-es')

export default {
  name: 'FormatFormWithStep',
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
    stepList: {
      type: Array,
      required: true
    },
    requiredFieldList: {
      type: Array,
      required: true
    },
    stepType: {
      type: Number,
      required: true
    },
    saving: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      commonDrag: false,
      customDrag: false,
      myCommonList: [],
      myCustomList: [],

      setTagVisible: false,
      currentFieldTags: [],
      currentFieldId: null,
      currentFieldName: null,
      currentSubFieldName: null,

      steps: [],

      showSectionWarning: true,
      showStepWarning: true,
      allowDrag: false,
      autoSaveFn: null
    }
  },
  computed: {
    commonDragOptions() {
      return {
        animation: 200,
        group: 'common',
        disabled: false,
        ghostClass: 'ghost',
        scroll: true
      }
    },
    customDragOptions() {
      return {
        animation: 200,
        group: 'custom',
        disabled: false,
        ghostClass: 'ghost',
        scroll: true
      }
    },
    allowAutoSave() {
      console.log(`saving ${this.saving} loading: ${this.loading}`)
      return !this.saving && !this.loading
    }
  },
  watch: {
    steps: {
      handler() {
        this.autoSaveFn && this.autoSaveFn()
      },
      deep: true,
      immediate: false
    }
  },
  created() {
    this.loading = true
    this.$logger.info('FormatForm start', this.commonList, this.customList, this.stepList)
    const myCommonList = JSON.parse(JSON.stringify(this.commonList))
    const myCustomList = JSON.parse(JSON.stringify(this.customList))
    const steps = JSON.parse(JSON.stringify(this.stepList))
    myCommonList.forEach(item => {
      item.isCustomField = false
    })
    myCustomList.forEach(item => {
      item.isCustomField = true
    })
    let customIndex = 0
    steps.forEach(step => {
      step.nameEditing = false
      step.key = step.id
      step.commonFieldItems = []
      step.commonFields.forEach(commonFieldName => {
        if (commonFieldName && commonFieldName.trim()) {
          const targetItem = myCommonList.find(item => item.fieldName === commonFieldName.trim())
          if (targetItem) {
            step.commonFieldItems.push(JSON.parse(JSON.stringify(targetItem)))
          } else {
            this.$logger.warn('no exist common field ' + commonFieldName)
          }
        }
      })

      step.customFieldItems = []
      step.customFields.forEach(customFieldName => {
        customIndex = customIndex + 1
        if (customFieldName && customFieldName.trim()) {
          const targetItem = myCustomList.find(item => item.name === customFieldName)
          if (targetItem) {
            step.customFieldItems.push(JSON.parse(JSON.stringify(targetItem)))
          } else {
            if (myCustomList.length >= customIndex) {
              const item = myCustomList[customIndex]
              item.name = customFieldName
              step.customFieldItems.push(JSON.parse(JSON.stringify(item)))
            }
            this.$logger.warn('no exist custom field ' + customFieldName)
          }
        }
      })
    })

    this.myCommonList = myCommonList
    this.myCustomList = myCustomList
    // myCustomList异常数据处理

    this.steps = steps
    this.$logger.info('FormatForm created', this.myCommonList, this.myCustomList, this.steps)
    this.checkIsShowFormatSectionWarning()
    this.checkIsShowFormatStepWarning()
  },
  mounted() {
    this.autoSaveFn = debounce(this.emitSave, 1000)
    this.$logger.info('init autoSaveFn', this.autoSaveFn)
    this.loading = false
  },
  methods: {
    emitSave() {
      this.$logger.info('emitSave allowAutoSave', this.allowAutoSave)
      if (this.allowAutoSave) {
        this.$emit('save')
      }
    },
    disableCommonDrag () {
      this.$logger.info('disableDrag')
      this.allowDrag = false
      this.commonDrag = false
    },
    disableCustomDrag() {
      this.$logger.info('disableDrag')
      this.allowDrag = false
      this.customDrag = false
    },
    hiddenFormSectionWarning () {
      storage.set(`hidden-format-section-warning-${this.$store.getters.userInfo.id}`, 'true')
      this.showSectionWarning = false
    },
    checkIsShowFormatSectionWarning() {
      const showWaningKey = `hidden-format-section-warning-${this.$store.getters.userInfo.id}`
      if (storage.get(showWaningKey) === 'true') {
        this.showSectionWarning = false
      } else {
        this.showSectionWarning = true
      }
      this.$logger.info(`checkIsShowFormatSectionWarning ${this.showSectionWarning}`)
    },
    hiddenFormStepWarning () {
      storage.set(`hidden-format-step-warning-${this.$store.getters.userInfo.id}`, 'true')
      this.showStepWarning = false
    },
    checkIsShowFormatStepWarning() {
      const showWaningKey = `hidden-format-step-warning-${this.$store.getters.userInfo.id}`
      if (storage.get(showWaningKey) === 'true') {
        this.showStepWarning = false
      } else {
        this.showStepWarning = true
      }
      this.$logger.info(`checkIsShowFormatStepWarning ${this.showStepWarning}`)
    },
    handleAddStep() {
      this.$logger.info('handleAddStep')
      const newStep = {
        id: null,
        key: Math.random(),
        name: 'Customized step',
        commonFieldItems: [],
        customFieldItems: [],
        commonFields: [],
        customFields: [],
        schoolId: this.$store.getters.school,
        visible: true
      }
      this.steps.push(newStep)
    },
    handleAddCustomField (step) {
      this.$logger.info('handleAddCustomField', step.customFieldItems)
      let count = 1
      let customFieldName = `CustomField${count}`
      while (this.myCustomList.some(item => item.name === customFieldName)) {
        count++
        customFieldName = `CustomField${count}`
      }
      const fieldItem = {
        id: 'ext_' + Math.random(),
        isCustomField: true,
        name: customFieldName,
        hint: '',
        visible: true,
        tags: [],
        sortNo: step.customFieldItems.length + 1
      }
      this.myCustomList.push(JSON.parse(JSON.stringify(fieldItem)))
      step.customFieldItems.push(JSON.parse(JSON.stringify(fieldItem)))
      this.$logger.info('handleAddCustomField finish', step.customFieldItems)
    },

    handleCustomChange (data) {
      this.$logger.info('handleCustomChange', this.myCustomList)
      this.myCustomList.forEach((item, index) => {
        item.sortNo = index
      })
    },
    handleStepSetTag (step) {
      this.$logger.info('handleSetTag', step)
      this.currentFieldId = step.id
      this.currentFieldName = step.name
      this.currentFieldTags = step.tags.slice()
      console.log(this.currentFieldTags)
      this.setTagVisible = true
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

    showSectionChangeTips () {
      this.$logger.info('showSectionChangeTips')
      if (this.showSectionWarning) {
        this.$confirm({
          title: 'Warning',
          content: ` This section is set by system and the data logic is applied to all curriculum and schools.
          Please do not change the data logic while you adjust the name and hint.
          Example: The "Unit name" can be adjusted to "Unit title" or
          "Name your Unit", but not "Unit purpose or Unit goal`,
          centered: true,
          okText: 'Ok',
          cancelText: 'cancel',
          onOk: () => {
            this.hiddenFormSectionWarning()
          }
        })
      }
    },

    showStepChangeTips () {
      this.$logger.info('showStepChangeTips')
      if (this.showStepWarning) {
        this.$confirm({
          title: 'Warning',
          content: ` You can not disable this Step because the section(s) under are required by the system and can not be disabled. You might need to move those compulsory sections to another enabled step if you want to hide this one.`,
          centered: true,
          okText: 'Ok',
          cancelText: 'cancel',
          onOk: () => {
            this.hiddenFormStepWarning()
          }
        })
      }
    },

    handleCloseSetTags () {
      this.setTagVisible = false
      this.currentFieldTags = []
      this.currentFieldId = null
      this.currentFieldName = null
      this.currentSubFieldName = null
    },

    handleUpdateStepTags (data) {
      this.$logger.info('handleUpdateStepTags', data)
      const index = this.steps.findIndex(item => item.id === this.currentFieldId)
      if (index > -1) {
        const step = this.steps[index]
        step.tags = data
        this.$set(this.steps, index, step)
        this.$logger.info('update step tags', step)
      }
      this.setTagVisible = false
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

    handleGotoTagPage () {
      this.setTagVisible = false
      this.$router.push({
        path: '/teacher/managing/tag-settings'
      })
    },

    handleDeleteCustomField (sIdx, fieldItem) {
      this.$logger.info('handleDeleteCustomField', fieldItem)
      const index = this.steps[sIdx].customFieldItems.findIndex(item => item.id === fieldItem.id)
      this.steps[sIdx].customFieldItems.splice(index, 1)
      this.myCustomList = this.myCustomList.filter(item => item.id !== fieldItem.id)
    },

    handleChangeCustomField(sIdx, fieldItem) {
      this.$logger.info('handleChangeCustomField', fieldItem)
      const index = this.myCustomList.findIndex(item => item.id === fieldItem.id)
      this.myCustomList[index] = fieldItem
    },

    handleChangeCommonField(sIdx, fieldItem) {
      this.$logger.info('handleChangeCommonField', fieldItem)
      const index = this.myCommonList.findIndex(item => item.id === fieldItem.id)
      this.myCommonList[index] = fieldItem
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

      // 删除自定义字段
      myCommonList.forEach(item => {
        delete item.isCustomField
      })
      myCustomList.forEach(item => {
        delete item.isCustomField
        if (item.id.indexOf('ext_') !== -1) {
          item.id = null
        }
      })
      this.$logger.info('myCommonList', myCommonList, 'myCustomList', myCustomList)

      const mySteps = JSON.parse(JSON.stringify(this.steps))
      mySteps.forEach((step, index) => {
        delete step.nameEditing
        delete step.key
        step.commonFields = step.commonFieldItems.map(item => item.fieldName)
        step.customFields = step.customFieldItems.map(item => item.name)

        // 设置字段排序
        step.commonFields.forEach((name, index) => {
          const stepFieldItem = step.commonFieldItems.find(field => field.fieldName === name)
          const fieldItem = myCommonList.find(field => field.fieldName === name)
          if (fieldItem && stepFieldItem) {
            fieldItem.name = stepFieldItem.name
            fieldItem.showName = stepFieldItem.showName
            fieldItem.hint = stepFieldItem.hint
            fieldItem.sortNo = index
          }
        })

        let customIndex = 0
        step.customFields.forEach((name, index) => {
          customIndex++
          const stepFieldItem = step.customFieldItems.find(field => field.name === name)
          const fieldItem = myCustomList.find(field => field.name === name)
          if (fieldItem && stepFieldItem) {
            fieldItem.name = stepFieldItem.name
            fieldItem.hint = stepFieldItem.hint
            fieldItem.sort = index
            fieldItem.sortNo = index
          } else {
            if (myCustomList.length >= customIndex) {
              myCustomList[customIndex].name = name
            }
          }
        })
        step.stepNo = index
        step.type = this.stepType

        delete step.commonFieldItems
        delete step.customFieldItems
      })
      this.$logger.info('getFormatConfig ', myCommonList, myCustomList, mySteps)
      return {
        commonList: myCommonList,
        customList: myCustomList,
        steps: mySteps
      }
    },

    stepEnableConfig(step) {
      let enable = true
      step.commonFieldItems.forEach(fieldItem => {
        if (fieldItem?.fieldName && this.requiredFieldList.indexOf(fieldItem.fieldName) !== -1) {
          enable = false
        }
      })
      return enable
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.format-form {
  user-select: none;
  .step-item {
    margin-bottom: 25px;
    padding: 10px;
    border: 1px solid #15c39a;
  }

  .format-form-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    cursor: pointer;
    .format-tag-settings{
      display:flex;
      .tag-setting {
        margin-right: 10px;
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
    }

    .step-tag-config{
      max-width: 65%;
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

    .format-form-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 40px;
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
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        font-size: 16px;
        color: #333;

        .edit-icon {
          padding-left: 10px;
          cursor: pointer;
          color: #aaa;
        }
      }

      .custom-title {
        font-size: 14px;
        font-weight: normal;
        padding-left: 5px;
      }
    }
  }
  .common-field-list, .custom-field-list {
    .list-group {
      padding: 0;
      margin: 0;
      .list-group-item {
        position: relative;
        // min-width: 1100px;
        margin-bottom: 15px;
        background: rgba(21, 195, 154, 0.07);
        padding: 10px 10px 15px 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        cursor: pointer;
        border: 1px solid #f8f8f8;

        .sort-icon {
          height: 50px;
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
            display: flex;
            align-items: center;
            justify-content: flex-start;
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
          background: rgba(21, 195, 154, 0.2);
          color: rgba(0, 0, 0, 0.65);
          border: 1px solid #15C39A;
          .sort-icon {
            height: 50px;
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

.heart-beat-disabled-item {
  animation: breathing 0.8s ease-out infinite normal;
  background-color: #fff1f0 !important;
  border: 1px solid #fff1f0 !important;
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

.step-visible-toggle {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  .field-visible {
    padding: 0 5px;
  }
}

.form-warning {
  margin: 10px 0;
}

.required {
  color: red;
  font-weight: bold;
  font-size: 16px;
  padding: 3px 5px 0 5px;
}
</style>
