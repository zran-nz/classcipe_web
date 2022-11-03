<template>
  <div class='selfouts-input-with'>
    <a-textarea
      :auto-size="{ minRows: 1, maxRows: 3 }"
      class='cc-form-textarea'
      placeholder='Type in your learning objective'
      :disabled='disabled'
      v-model='displayValue'
      @focus.native='updateOptionsListFunction'
      @click.native='updateOptionsListFunction'
      @input.native='updateOptionsListFunction'
      @change='updateOptionsListFunction'>
    </a-textarea>
    <div class='option-list' v-show='optionList.length' @click.stop=''>
      <div class='option-item' v-for='(option, oIdx) in optionList' :key='oIdx' @click='handleSelectItem(option)'>
        <div class='option-name'>
          <a-tooltip placement='topLeft' :mouseEnterDelay="0.6" :title='option.path'>
            {{ option.name }}
          </a-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { SearchKnowledge } from '@/api/knowledge'
const { debounce } = require('lodash-es')

export default {
  name: 'SelfOutsInput',
  props: {
    filterTypes: {
      type: Array,
      default: () => []
    },
    gradeIds: {
      type: Array,
      default: () => []
    },
    subjectIds: {
      type: Array,
      default: () => []
    },
    defaultDisplayName: {
      type: String,
      default: null
    },
    defaultSelfOutSubject: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    displayValue (newVal) {
      this.$emit('update-value', newVal)
    },
    selfOutSubject (newVal) {
      this.$emit('update-subject', newVal)
    }
  },
  data () {
    return {
      displayValue: '',
      selfOutSubject: null,
      optionList: [],
      creating: false,
      updateOptionsListFunction: null
    }
  },
  created() {
    this.displayOptionList = []
    console.info('myOptionList ', this.myOptionList)

    if (this.defaultDisplayName) {
      this.displayValue = this.defaultDisplayName
    }
    if (this.defaultSelfOutSubject) {
      this.selfOutSubject = this.defaultSelfOutSubject
    }
    this.updateOptionsListFunction = debounce(this.handleUpdateOptionsList, 500)
  },
  mounted () {
    this.globalClick(this.handleClick)
  },
  methods: {

    handleSelectItem (item) {
      this.displayValue = item.name
      this.optionList = []
    },

    handleClick () {
      this.optionList = []
    },

    handleUpdateOptionsList () {
      if (this.displayValue && this.displayValue.trim()) {
        this.SearchKnowledge()
      }
    },

    async SearchKnowledge() {
      const res = await SearchKnowledge({
        filterTypes: this.filterTypes,
        gradeIds: this.gradeIds,
        subjectIds: this.subjectIds,
        key: this.displayValue.trim()
      })
      console.info('SearchKnowledge res', res)
      if (res.success) {
        this.optionList = res.result.filter(item => item.name.toLowerCase() !== this.displayValue.trim().toLowerCase())
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.selfouts-input-with {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.option-list {
  background: #fff;
  z-index: 200;
  position: absolute;
  top: 43px;
  width: 100%;
  max-height: 200px;
  overflow-y: scroll;
  padding: 0;
  box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.1);

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 3px;
    background: rgba(0,0,0,0.00);
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.06);
  }
  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(0,0,0,0.12);
    -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.04);
  }

  .option-item {
    font-size: 14px;
    padding: 0 10px;
    line-height: 40px;
    width: 100%;
    overflow-x: hidden;
    white-space: nowrap;
    cursor: pointer;
    text-overflow: ellipsis;
    word-break: break-all;
    box-sizing: border-box;
    border-bottom: 1px solid #f6f6f6;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .option-name {
      font-size: 14px;
      line-height: 40px;
      width: 100%;
      overflow-x: hidden;
      white-space: nowrap;
      cursor: pointer;
      text-overflow: ellipsis;
      word-break: break-all;
    }

    &:hover {
      background: #f5f5f5;
      color: #38cfa6;
    }
  }
}

</style>
