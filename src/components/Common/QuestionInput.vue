<template>
  <div class='question-input-wrapper' :style="{height: height + 'px'}">
    <div class='question-input'>
      <a-spin :spinning="updating">
        <a-input
          ref="input"
          v-model='keyword'
          @focus='handleFocus'
          @click.native.stop='showFilterList = true'
          :placeholder='placeholder'
          class='cc-form-input'
          :disabled='!canEdit'/>
      </a-spin>
      <div class='filter-list' v-show='showFilterList && filterList.length'>
        <div class='filter-item' v-for='(item, idx) in filterList' :key='idx' @click='handleSelectItem(item)' :data-id='item.id'>
          <div class='item-desc' v-html='item.html'></div>
          <div class='sub-desc' v-if='item.fromText'>{{ item.fromText }}</div>
        </div>
      </div>
      <div class='create-item' v-show='showFilterList && keyword.trim().length && ((!filterList.length && !duplicated) || !listContainedKeyword)'>
        <a-button type='primary' size="small" @click='handleEnsureInput'><a-icon type='plus' /> Create</a-button>
      </div>
    </div>
    <div class='question-selected-list'>
      <div class='cc-lo-list'>
        <div v-for='(item) in selectedList' :key='item.id' class='cc-lo-item'>
          <div class='cc-left-lo'>
            <div class="item-desc-wrapper">
              <div class='item-desc'>
                {{ item.name }}
              </div>

              <div class='delete-wrapper' v-if='canEdit'>
                <a-popconfirm title="Delete?" ok-text="Yes" @confirm="handleDelete(item)" cancel-text="No">
                  <delete-icon color='#F16A39' />
                </a-popconfirm>
              </div>
            </div>
          </div>
          <div class='cc-right-general-capabilities'>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash-es'
import DeleteIcon from '@/components/Common/DeleteIcon'

export default {
  name: 'QuestionInput',
  components: { DeleteIcon },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: 'Search'
    },
    height: {
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      keyword: '',
      updating: false,
      showFilterList: true,
      filterList: [],
      selectedList: [],
      asyncUpdateFilterListFn: null,
      questionList: []
    }
  },
  watch: {
    list(newVal) {
       this.questionList = newVal
    },
    selected(newVal) {
      this.selectedList = newVal.filter(item => !!item.name) || []
    }
  },
  computed: {
    selectedIdList() {
      return this.selectedList.filter(item => item.id).map(item => item.id)
    },
    selectedNameList() {
      return this.selectedList.filter(item => item.id).map(item => item.name)
    },
    inputList() {
      return this.selectedList.filter(item => !item.id).map(item => item.name)
    },
    duplicated() {
      return this.inputList.map(item => item.toLowerCase()).indexOf(this.keyword.trim()) !== -1 || this.selectedNameList.map(item => item.toLowerCase()).indexOf(this.keyword.trim()) !== -1
    },
    listContainedKeyword() {
      return this.filterList.map(item => item.name.toLowerCase()).indexOf(this.keyword.toLowerCase().trim()) !== -1
    }
  },
  created() {
    this.asyncUpdateFilterListFn = debounce(this.updateFilterList, 200)
    console.info('QuestionInput list', this.questionList, 'selected', this.selected)
    this.selectedList = this.selected.filter(item => !!item.name) || []
    this.$watch('keyword', (nv) => {
      console.info('QuestionInput keyword changed ' + nv)
      this.updating = true
      this.asyncUpdateFilterListFn()
      this.updating = false
    })
    this.updateFilterList()
    this.questionList = this.list
  },
  mounted() {
    window.addEventListener('click', this.handleClick)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.handleClick)
  },
  methods: {
    handleClick () {
      console.log('handleClick')
      this.showFilterList = false
    },
    handleFocus() {
      console.log('handleFocus')
      // this.filterList = JSON.parse(JSON.stringify(this.list))
      // this.filterList.forEach(item => {
      //     item.html = item.name
      // })
      // this.filterList = this.filterList.filter(item => this.selectedIdList.indexOf(item.id) === -1).filter(item => this.inputList.indexOf(item.name) === -1)
      this.showFilterList = true
      this.updateFilterList()
    },
    handleEnsureInput () {
      console.log('QuestionInput handleEnsureInput', this.canEdit, this.keyword)
      if (this.keyword && this.canEdit) {
        this.handleSelectItem({
          name: this.keyword,
          id: null
        })
        this.keyword = ''
      }
    },
    handleSelectItem (item) {
      console.info('QuestionInput handleSelectItem', item)
      item.id = null
      if (this.selectedList.indexOf(item) === -1) {
        this.selectedList.unshift(item)
      }
      this.keyword = ''
      this.updateFilterList()
      this.showFilterList = false
      console.info('selectedList', this.selectedList)
      this.$emit('update', this.selectedList)
    },
    updateFilterList () {
      console.info('updateFilterList list init', this.questionList)
      if (this.questionList.length) {
        console.log('QuestionInput selectedIdList', this.selectedIdList, this.selectedList)
        let list = JSON.parse(JSON.stringify(this.questionList))
        console.info('list', list)
        if (this.keyword.trim()) {
          list = this.questionList.slice().filter(item => item.name.toLowerCase().indexOf(this.keyword.toLowerCase()) !== -1)
        }
        console.info('list filter', list)
        list.forEach(item => {
          // 高亮命中单词
          if (item.name && this.keyword.trim() && item.name.toLowerCase().includes(this.keyword.trim().toLowerCase())) {
            const keyword = this.keyword.trim().toLowerCase()
            let html = ''
            const desc = item.name
            const lowCaseDesc = item.name.toLowerCase()
            let lastIndex = 0
            let index = 0
            while ((index = lowCaseDesc.indexOf(keyword, lastIndex)) !== -1) {
              html += desc.slice(lastIndex, index) + '<em>' + desc.substr(index, keyword.length) + '</em>'
              lastIndex = index + keyword.length
            }
            html += desc.slice(lastIndex)
            item.html = html
          } else {
            item.html = item.name
          }
        })
        this.filterList = list.filter(item => this.selectedIdList.indexOf(item.id) === -1).filter(item => this.inputList.indexOf(item.name) === -1)
      }
      console.log('QuestionInput updateFilterList', this.filterList)
    },
    handleDelete (item) {
      console.info('QuestionInput handleDelete', item)
      if (this.selectedList.indexOf(item) !== -1) {
        this.selectedList.splice(this.selectedList.indexOf(item), 1)
      }
      this.$emit('update', this.selectedList)
      this.updateFilterList()
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.question-input {
  margin-top: 5px;
  position: relative;

  .filter-list {
    background-color: #fff;
    position: absolute;
    z-index: 4000;
    left: 0;
    right: 0;
    top: 40px;
    max-height: 300px;
    overflow-y: auto;
    border-radius: 4px;
    box-shadow: 0 0 3px 3px #f1f1f1;

    .filter-item {
      color: rgb(4, 28, 68);
      padding: 10px 10px 10px 20px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      &:hover {
        background-color: #14C39A12;
        color: #15C39A;
      }

      .item-desc {
        padding-right: 10px;
        cursor: pointer;
        font-weight: 500;
        user-select: none;
      }

      .item-subject-year {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;

        .item-sub-title {
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          white-space: nowrap;
          margin-right: 10px;
          font-weight: bold;
          cursor: pointer;
          user-select: none;
        }
      }
    }
  }

  .create-item {
    position: absolute;
    right: 5px;
    top: 4px;
  }
}

.cc-lo-list {
  margin-top: 15px;
  z-index: 1;

  .cc-lo-item {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    align-items: flex-start;
    .cc-left-lo {
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
      .item-desc-wrapper {
        background: #FAFAFA;
        border: 1px solid #E1E6ED;
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        color: #313234;
        font-family: Arial;
        cursor: pointer;
        border-radius: 4px;
        padding: 10px 10px 10px 20px;
        font-weight: 400;
        .item-desc {
          padding-right: 10px;
        }

        .item-subject-year {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;

          .item-sub-title {
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            white-space: nowrap;
            margin-right: 10px;
            font-weight: bold;
            color: #111;
            cursor: pointer;
            user-select: none;
          }
        }
      }

      .item-bloom-wrapper {
        margin-top: 20px;
        display: flex;
        padding-left: 8px;
        .bloom-wrapper {
          font-size: 10px;
          font-family: Arial;
          font-weight: bold;
          color: #191A1C;
          margin-right: 50px;
          display: flex;
          align-items: center;
          label {
            margin-right: 5px;
          }
        }
      }

      .item-command-wrapper {
        display: flex;
        align-items: center;
        padding-left: 8px;
        margin-top: 24px;
        label {
          font-size: 10px;
          font-family: Arial;
          font-weight: bold;
          color: #191A1C;
          width: 100px;
        }
        .wrapper-list {
          margin-left: 10px;
          display: flex;
          flex-wrap: wrap;
          flex: 1;
          .wrapper-list-item {
            margin-bottom: 5px;

          }
        }
      }

      .delete-wrapper {
        position: absolute;
        right: -20px;
        width: 30px;
        top: 50%;
        margin-top: -10px;
        display: none;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
      }

      &:hover {
        .delete-wrapper {
          display: flex;
        }
      }
    }
  }
}

.sub-desc {
  color: #999;
  font-size: 13px;
}
.question-selected-list {
  padding-bottom: 15px;
}
</style>
