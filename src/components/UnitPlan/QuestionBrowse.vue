<template>
  <div class="big-idea">

    <a-row class="row-wrapper">

      <a-transfer
        :data-source="showList"
        :titles="['Key question', 'Selected question']"
        :target-keys="targetKeys"
        :selected-keys="selectedKeys"
        :render="item => item.title"
        :operations="['Add', 'Remove']"
        @change="handleChange"
        @selectChange="handleSelectChange"
        @scroll="handleScroll"
        :list-style="{
          width: '350px',
          height: '400px',
        }"
      />

    </a-row>

    <a-spin v-show="loading" class="loading"/>
  </div>
</template>

<script>

import { FindQuestionsByBigIdea } from '@/api/question'
import * as logger from '@/utils/logger'

export default {
  name: 'QuestionBrowse',
  components: {
  },
  props: {
    questionList: {
      type: Array,
      default: () => []
    },
    bigIdea: {
      type: String,
      default: ''
    }
  },
  mounted () {
  },
  destroyed () {

  },
  data () {
    return {
      AllQuestionList: [],
      showList: [],
      targetKeys: [],
      selectedKeys: [],
      loading: false
    }
  },
  created () {
    this.showList = []
    this.loading = true
    FindQuestionsByBigIdea({ bigIdea: this.bigIdea }).then(response => {
      logger.info('FindQuestionsByBigIdea ', response)
      this.AllQuestionList = []
      if (response.success) {
        this.AllQuestionList = response.result
        this.AllQuestionList.forEach(q => {
          this.showList.push({
            key: q.name,
            title: q.name,
            description: q.name,
            disabled: false
          })
        })
      }
    }).finally(() => {
      this.questionList.forEach(item => {
        this.targetKeys.push(item.name)
      })
      this.loading = false
    })
  },
  watch: {

  },
  methods: {
    handleChange (nextTargetKeys, direction, moveKeys) {
      this.targetKeys = nextTargetKeys
      console.log('targetKeys: ', nextTargetKeys)
      console.log('direction: ', direction)
      console.log('moveKeys: ', moveKeys)
      this.$emit('select-question', this.targetKeys)
    },
    handleSelectChange (sourceSelectedKeys, targetSelectedKeys) {
      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys]
      console.log('sourceSelectedKeys: ', sourceSelectedKeys)
      console.log('targetSelectedKeys: ', targetSelectedKeys)
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
      border: 1px solid #e8e8e8;
      box-sizing: border-box;
      min-height: 500px;
      .content-list{
        max-height: 500px;
        overflow-y: auto;
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
</style>
