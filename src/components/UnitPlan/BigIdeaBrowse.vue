<template>
  <div class="big-idea">

    <a-row class="row-wrapper">
      <!--      <a-col span="11" class="col-wrapper">-->
      <!--        <div>-->
      <!--          <a-list bordered :data-source="subjectList" style="border: none" >-->
      <!--            <a-list-item slot="renderItem" slot-scope="item" :class="{'list-item-selected':selectSubject === item.name}" @click="handleSelectSubject(item.name)">-->
      <!--              {{ item.name }}-->
      <!--            </a-list-item>-->
      <!--          </a-list>-->
      <!--        </div>-->
      <!--      </a-col>-->

      <a-col span="20" class="col-wrapper">
        <div>
          <div class="col-input-serach">
            <a-input-search
              v-model="inputTag"
              placeholder="Search"
              :allowClear="true"
              class="search-input"
              @search="searchTag">
              <a-icon slot="prefix" type="search" :style="{ fontSize: '16px', color: '#15c39a','margin-right':'5px' }" />
            </a-input-search>
          </div>
          <div class="description-wrapper">
            <div class="description-list">
              <div :class="{'description-item': true, 'kd-active-item': selectedBigIdea === bigIdea}" v-for="(bigIdea,index) in bigIdeaList" :key="index" @click="selectBigIdea(bigIdea)">
                <span class="tag-title">{{ bigIdea.inquiry }}</span>
                <div
                  class="inquiry-keyword-item"
                  v-for="(tag, tagIndex) in bigIdea.inquiryKeywords"
                  :key="'inquery_keyword_'+tagIndex">
                  <a-tag color="green">{{ tag }}</a-tag>
                </div>
              </div>
            </div>
          </div>

        </div>
      </a-col>

      <!--      <a-col span="9" class="col-wrapper">-->
      <!--        <div>-->

      <!--          <div class="select-item">-->
      <!--            <a-select-->
      <!--              :getPopupContainer="trigger => trigger.parentElement"-->
      <!--              @change="QueryBigIdea"-->
      <!--              v-model="selectedConcept"-->
      <!--              mode="multiple"-->
      <!--              class="multiple-select"-->
      <!--              placeholder="Universal Concept"-->
      <!--              :showArrow="true">-->
      <!--              <a-select-option :value="concept" v-for="(concept, gIndex) in conceptList" :key="gIndex">-->
      <!--                {{ concept }}-->
      <!--              </a-select-option>-->
      <!--            </a-select>-->
      <!--          </div>-->

      <!--          &lt;!&ndash;  big idea list &ndash;&gt;-->
      <!--          <div class="description-wrapper">-->
      <!--            <div class="description-list">-->
      <!--              <div :class="{'description-item': true, 'kd-active-item': selectedBigIdea === bigIdea}" v-for="(bigIdea,index) in bigIdeaList" :key="index" @click="selectBigIdea(bigIdea)">-->
      <!--                <span>{{ bigIdea }}</span>-->
      <!--                &lt;!&ndash;                <a-icon type="check-circle" theme="filled" v-if="selectedBigIdea===bigIdea"/>&ndash;&gt;-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </a-col>-->
    </a-row>

    <a-spin v-show="tagLoading" class="keyword-loading"/>
    <a-spin v-show="bigLoading" class="big-loading"/>

  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import TagBrowser from '@/components/UnitPlan/TagBrowser'
import { QueryTagsBySubjectIds } from '@/api/scenario'
import { QueryNewBigIdea } from '@/api/v2/mycontent'

const { debounce } = require('lodash-es')

export default {
  name: 'BigIdeaBrowse',
  components: {
    TagBrowser
  },
  props: {

  },
  mounted () {
  },
  destroyed () {

  },
  computed: {
    showHotList: function () {
      if (!this.subjectId) {
        return this.keywordHotList
      } else {
        return this.keywordHotList.filter(item => this.keywordList.indexOf(item) !== -1)
      }
    }
  },
  data () {
    return {
      keywordList: [],
      keywordLetterList: [],
      keywordHotList: [],
      bigIdeaList: [],
      selectedKeywords: '',
      selectedBigIdea: '',
      tagLoading: false,
      bigLoading: false,
      visible: true,
      inputTag: '',
      tagName: '',
      subjectTree: [],
      subjectList: [],
      subjectNames: [],
      selectSubject: '',
      conceptList: [],
      selectedConcept: [],
      alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
        'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    }
  },
  created () {
    this.debouncedSearchKnowledge = debounce(this.searchTag, 500)
    // this.QuerySourceTagByCategory()
    this.QueryBigIdea()
    // SubjectTree({ curriculumId: this.$store.getters.bindCurriculum }).then(res => {
    //   this.$logger.info('SubjectTree response', res.result)
    //   if (res.success) {
    //     this.subjectList = [{ name: 'All Subject', id: '' }]
    //     this.subjectTree = res.result
    //     this.subjectTree.forEach(item => {
    //       this.subjectList.push(item)
    //       // if (item.children.length > 0) {
    //       //   item.children.forEach(child => {
    //       //     this.subjectList.push(child)
    //       //   })
    //       // }
    //     })
    //   }
    // }).finally(() => {
    // })
  },
  watch: {
  },
  methods: {
    queryBigIdeaKeywords (keyword) {
      this.selectedKeywords = keyword
      this.QueryBigIdea()
    },
    // QuerySourceTagByCategory () {
    //   this.tagLoading = true
    //   if (this.subjectIds.length === 1 && !this.subjectIds[0]) {
    //     this.subjectIds = []
    //   }
    //   QuerySourceTagByCategory({ category: TAG_CATGORY_KEYWORDS, searchKey: this.inputTag }).then(response => {
    //     this.$logger.info('QuerySourceTagByCategory response', response.result)
    //     if (response.success) {
    //       this.keywordList = response.result.tags
    //       this.keywordHotList = response.result.hots
    //     }
    //   }).finally(() => {
    //     this.tagLoading = false
    //     this.getLettersList()
    //   })
    // },
    getLettersList () {
      this.keywordLetterList = []
      this.alphabet.forEach((letter) => {
        const arr = {}
        arr.letter = letter
        arr.content = this.keywordList.filter((item) => {
          return item[0].toUpperCase() === letter
        })
        if (arr.content.length !== 0) {
          this.keywordLetterList.push(arr)
        }
      })
      console.info('keywordLetterList ', this.keywordLetterList)
    },
    QueryBigIdea () {
      this.bigLoading = true
      // this.bigIdeaList = []
      // if (this.subjectNames.length === 1 && this.subjectNames[0] === 'All Subject') {
      //   this.subjectNames = []
      // }
      const params = {}
      if (this.inputTag) {
        params.keywords = this.inputTag
      }
      QueryNewBigIdea(params).then(response => {
        this.$logger.info('QueryNewBigIdea response', response.result)
        if (response.success) {
          this.bigIdeaList = response.result
          // if (this.inputTag) {
          //   this.bigIdeaList = this.bigIdeaList.filter(item => item.toLowerCase().indexOf(this.inputTag.toLowerCase()) > -1)
          // }
        }
      }).finally(() => {
        this.bigLoading = false
         //  QueryTagsBySubjectIds({ 'mainSubjectId': this.subjectId, keywords: this.selectedKeywords }).then(response => {
         //    this.$logger.info('queryTagsByMainSubjectId response', response.result)
         //    if (response.success) {
         //      this.conceptList = response.result['Universal Concept']
         //    }
         // })
    })
    },
    queryTagsBySubjectIds () {
      this.$logger.info('queryTagsBySubjectIds')
      QueryTagsBySubjectIds({ 'mainSubjectId': this.subjectId }).then(response => {
        this.$logger.info('queryTagsByMainSubjectId response', response.result)
        if (response.success) {
          this.conceptList = response.result['Universal Concept']
          this.keywordList = response.result['Key words']
        }
      }).finally(() => {
        this.getLettersList()
      })
    },
    selectBigIdea (bigIdea) {
      this.selectedBigIdea = bigIdea
      this.$emit('handle-select', bigIdea)
    },
    handleAddUserTag (tags, isAdd) {
      // this.handleUserTagsMap()
    },
    searchTag () {
      console.info('tag searchTag', this.inputTag)
      // this.QuerySourceTagByCategory()
      this.QueryBigIdea()
    },
    handleSelectSubject (subject) {
      this.selectSubject = subject
      this.subjectNames = [subject]
      // this.queryTagsBySubjectIds()
      this.QueryBigIdea()
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
      min-height: 350px;
      .content-list{
        max-height: 350px;
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
.col-input-serach{
  padding: 10px;
  padding-bottom: 0px;
  text-align: center;
  .search-input{
   width: 80%;
  }
}

.keyword-wrapper {
  padding: 15px 15px 0 15px;
  box-sizing: border-box;
  .title{
    margin: 5px;
  }
  .keyword-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .keyword-item {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      border-radius: 15px;
      padding: 3px 15px;
      margin: 0 10px 10px 0;
      border: 1px solid rgba(21, 195, 154, 1);
      background: rgba(21, 195, 154, 0.1);
      font-family: Inter-Bold;
      color: #15C39A;
      .keyword-name {
        padding-right: 10px;
      }

      .keyword-icon {
        height: 18px;
      }
    }
  }
}

.description-wrapper {
  padding: 15px;
  box-sizing: border-box;
  max-height: 350px;
  overflow-y: auto;
  .description-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .description-item {
      cursor: pointer;
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 15px;
      font-size: 14px;
      font-family: Inter-Bold;
      line-height: 24px;
      color: #000000;
      background: #FFFFFF;
      border: 1px solid #D8D8D8;
      opacity: 1;
      border-radius: 4px;
      padding: 8px 15px;
      width: 100%;

      &:hover {
        color: #15c39a;
        background-color: rgba(21, 195, 154, 0.1);
        border-color: #15c39a;
        box-shadow: 2px 4px 6px rgba(21, 195, 154, 0.2);
      }
    }

    .kd-active-item {
      color: #15c39a;
      background-color: rgba(21, 195, 154, 0.1);
      border-color: #15c39a;
      box-shadow: 2px 4px 6px rgba(21, 195, 154, 0.2);
    }
  }
}
.keyword-loading {
  position: absolute;
  top: 50%;
  left: 25%;
  margin-top: -20px;
  margin-left: -50px;
  width: 100px;
}
.big-loading {
  position: absolute;
  top: 50%;
  right: 25%;
  margin-top: -20px;
  margin-left: -50px;
  width: 100px;
}
.select-item{
  padding: 10px;
  padding-bottom: 0px;
  .multiple-select{
    width: 50%;
  }
}
/deep/ .ant-list-bordered{
  .ant-list-item{
    border-bottom: 1px solid #e8e8e8;
    &:hover {
      cursor: pointer;
      color: #15c39a;
      background-color: rgba(21, 195, 154, 0.1);
      border-color: #15c39a;
      box-shadow: 2px 4px 6px rgba(21, 195, 154, 0.2);
    }
  }
  .ant-list-header{
    &:hover {
      cursor: pointer;
      color: #15c39a;
      background-color: rgba(21, 195, 154, 0.1);
      border-color: #15c39a;
      box-shadow: 2px 4px 6px rgba(21, 195, 154, 0.2);
    }
  }
  .list-item-selected{
    color: #15c39a;
    background-color: rgba(21, 195, 154, 0.1);
  }
}
.tag-title{
  width: 100%;
  display: block;
}
.inquiry-keyword-item {
  margin: 3px;
  display: flex;
  align-items: center;
}
</style>
