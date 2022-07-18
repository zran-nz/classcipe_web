<template>
  <div class="big-idea">

    <a-row class="row-wrapper">

      <a-col span="12" class="col-wrapper">
        <div>
          <div class="row-filter">
            <div><h3><a-icon type="bulb" />Recommended</h3></div>
            <div class="keyword-search">
              <a-input
                @keyup="handleKeySearch"
                placeholder="Search key word"
                v-model="keywordSearchText"
                class="my-nav-search">
                <sousuo-icon-svg slot="prefix"/>
              </a-input>
            </div>
          </div>

          <a-list bordered :data-source="showQuestionList">
            <a-list-item slot="renderItem" slot-scope="item" class="row" @click="selectItem(item)">
              {{ item }}
            </a-list-item>
          </a-list>
        </div>

      </a-col>

      <a-col span="12" class="col-wrapper" style="margin-left: 10px">
        <div>
          <h3><a-icon type="select" />Selected</h3>
          <a-list bordered :data-source="selectQuestionList">
            <a-list-item slot="renderItem" slot-scope="item,index">
              {{ item }}
              <div slot="extra" class="extra-remove" @click="removeItem(index)">
                <a-icon type="close" />
              </div>
            </a-list-item>
          </a-list>
        </div>
      </a-col>

    </a-row>

    <a-spin v-show="loading" class="loading"/>
  </div>
</template>

<script>

import { FindQuestionsByBigIdea } from '@/api/question'
import * as logger from '@/utils/logger'
import SousuoIconSvg from '@/assets/icons/header/sousuo.svg?inline'

export default {
  name: 'QuestionBrowse',
  components: {
    SousuoIconSvg
  },
  props: {
    questionList: {
      type: Array,
      default: () => []
    },
    bigIdea: {
      type: String,
      default: ''
    },
    rwc: {
      type: String,
      default: ''
    }
  },
  computed: {
    showQuestionList () {
       const result = []
       const lastQuestionList = this.AllQuestionList.filter(item => this.selectQuestionList.indexOf(item) === -1)
       if (this.keywordSearchText) {
         lastQuestionList.forEach(item => {
           if (item.toLowerCase().indexOf(this.keywordSearchText.toLowerCase()) > -1) {
             result.push(item)
           }
         })
         return result
       } else {
         return lastQuestionList
       }
    }
  },
  mounted () {
  },
  destroyed () {

  },
  data () {
    return {
      AllQuestionList: [],
      keywordSearchText: '',
      showList: [],
      selectQuestionList: [],
      loading: false
    }
  },
  created () {
    this.showList = []
    this.questionList.forEach(item => {
      if (item.name) {
        this.selectQuestionList.push(item.name)
      }
    })

    this.loading = true
    FindQuestionsByBigIdea({ bigIdea: this.bigIdea, rwc: this.rwc }).then(response => {
      logger.info('FindQuestionsByBigIdea ', response)
      this.AllQuestionList = []
      if (response.success) {
        response.result.forEach(item => {
          if (this.AllQuestionList.indexOf(item.name) === -1) {
            this.AllQuestionList.push(item.name)
          }
        })
      }
    }).finally(() => {
      this.loading = false
    })
  },
  watch: {

  },
  methods: {
    handleChange (nextTargetKeys, direction, moveKeys) {
      // this.targetKeys = nextTargetKeys
      // console.log('targetKeys: ', nextTargetKeys)
      // console.log('direction: ', direction)
      // console.log('moveKeys: ', moveKeys)
      // this.$emit('select-question', this.targetKeys)
    },
    selectItem (item) {
      this.selectQuestionList.push(item)
      this.$emit('select-question', this.selectQuestionList)
    },

    removeItem (index) {
      this.selectQuestionList.splice(index, 1)
      this.$emit('select-question', this.selectQuestionList)
    },
    handleKeySearch () {

    },
    handleScroll (direction, e) {
      // console.log('direction:', direction)
      // console.log('target:', e.target)

    }
  }

}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";
  .row-wrapper{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 20px;
    .col-wrapper{
      .row-filter{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      //border: 1px solid #e8e8e8;
      //box-sizing: border-box;
      min-height: 500px;
      .content-list{
        max-height: 500px;
        overflow-y: auto;
      }
      .extra-remove{
        cursor: pointer;
        &:hover {
          color: red;
        }
      }
      .row{
        cursor: pointer;
        &:hover {
          color: #15c39a;
          background-color: rgba(21, 195, 154, 0.1);
          border-color: #15c39a;
        }
      }
    }

    *::-webkit-scrollbar {
      width: 3px;
      height: 10px;
    }
    *::-webkit-scrollbar-track {
      border-radius: 1px;
      background: rgba(0,0,0,0.00);
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
    }
    /* 滚动条滑块 */
    *::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background: rgba(0,0,0,0.12);
      -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
    }
  }

.loading {
  position: absolute;
  top: 50%;
  left: 25%;
  margin-top: -20px;
  margin-left: -50px;
  width: 100px;
}
.keyword-search {
  margin-top: -5px;
  margin-right: 5px;
  .my-nav-search {
    svg {
      fill: rgba(188, 188, 188, 1);
    }
    input {

    }
  }
}
/deep/ .ant-list-items{
  max-height: 800px;
  overflow-y: auto;
}
</style>
