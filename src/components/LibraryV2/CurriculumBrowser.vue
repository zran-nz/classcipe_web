<template>
  <div class="browser-block" data-type="curriculum">
    <!--      mainSubject list-->
    <div class="browser-block-item" :style="{width: '15vw' , minWidth: '15vw' }">
      <div
        :class="{
          'browser-item': true,
          'odd-line': index % 2 === 0,
          'active-line': currentMainSubjectId === mainSubjectItem.id
        }"
        v-for="(mainSubjectItem, index) in mainSubjectList"
        @click="handleSelectMainSubjectItem(mainSubjectItem)"
        :key="index">
        <a-tooltip :mouseEnterDelay="1">
          <template slot="title">
            {{ mainSubjectItem.name }}
          </template>
          <dir-icon dir-type="blue" v-if="currentMainSubjectId !== mainSubjectItem.id"/>
          <dir-icon dir-type="opened" v-if="currentMainSubjectId === mainSubjectItem.id"/>
          {{ mainSubjectItem.name }}
        </a-tooltip>
        <!--        <span class="arrow-item">-->
        <!--          <a-icon type="right" />-->
        <!--        </span>-->
      </div>
      <template v-if="!mainSubjectList.length && !mainSubjectListLoading">
        <div class="no-data">
          <no-more-resources />
        </div>
      </template>
      <template v-if="mainSubjectListLoading">
        <div class="loading-wrapper">
          <a-spin />
        </div>
      </template>
    </div>
    <!--      subSubject list-->
    <div class="browser-block-item" v-if="hasChildSubject" :style="{width: '15vw' , minWidth: '15vw' }" >
      <div
        :class="{
          'browser-item': true,
          'odd-line': index % 2 === 0,
          'active-line': currentSubSubjectId === subSubjectItem.id
        }"
        v-for="(subSubjectItem, index) in subSubjectList"
        @click="handleSelectSubSubjectItem(subSubjectItem)"
        :key="index">
        <a-tooltip :mouseEnterDelay="1">
          <template slot="title">
            {{ subSubjectItem.name }}
          </template>
          <dir-icon dir-type="blue" v-if="currentSubSubjectId !== subSubjectItem.id"/>
          <dir-icon dir-type="opened" v-if="currentSubSubjectId === subSubjectItem.id"/>
          {{ subSubjectItem.name }}
        </a-tooltip>
        <span class="arrow-item">
          <a-icon type="right" />
        </span>
      </div>
      <template v-if="!subSubjectList.length && !subSubjectListLoading">
        <div class="no-data">
          <no-more-resources />
        </div>
      </template>
      <template v-if="subSubjectListLoading">
        <div class="loading-wrapper">
          <a-spin />
        </div>
      </template>
    </div>
    <!--      main grade list-->
    <div class="browser-block-item-wrapper">
      <div class="browser-block-item" :style="{width: '15vw' , minWidth: '15vw' }">
        <div
          :class="{
            'browser-item': true,
            'odd-line': index % 2 === 0,
            'active-line': currentGradeId === gradeItem.id
          }"
          v-for="(gradeItem, index) in gradeList"
          @click="handleSelectGradeItem(gradeItem)"
          :key="index">
          <a-tooltip :mouseEnterDelay="1">
            <template slot="title">
              {{ gradeItem.name }}
            </template>
            <dir-icon dir-type="blue" v-if="currentGradeId !== gradeItem.id"/>
            <dir-icon dir-type="opened" v-if="currentGradeId === gradeItem.id"/>
            {{ gradeItem.name }}
          </a-tooltip>
          <!--          <span class="arrow-item">-->
          <!--            <a-icon type="right" />-->
          <!--          </span>-->
        </div>
        <template v-if="!gradeList.length && !gradeListLoading">
          <div class="no-data">
            <no-more-resources />
          </div>
        </template>
        <template v-if="gradeListLoading">
          <div class="loading-wrapper">
            <a-spin />
          </div>
        </template>
      </div>
    </div>
    <!--      main knowledge list-->
    <div class="browser-block-item browser-block-item-wrapper" :style="{width: '15vw' , minWidth: '15vw' }" :data-knowledge-len="knowledge.knowledgeList.length" v-for="(knowledge, deepIndex) in knowledges" :key="deepIndex">
      <div
        :class="{
          'browser-item': true,
          'odd-line': index % 2 === 0,
          'active-line': knowledge.currentKnowledgeId === knowledgeItem.id
        }"
        v-for="(knowledgeItem, index) in knowledge.knowledgeList"
        @click="handleSelectKnowledgeItem(knowledgeItem,deepIndex)"
        :key="index">
        <a-tooltip :mouseEnterDelay="1">
          <template slot="title">
            {{ knowledgeItem.name }}
          </template>
          <dir-icon dir-type="blue" v-if="knowledge.currentKnowledgeId !== knowledgeItem.id"/>
          <dir-icon dir-type="opened" v-if="knowledge.currentKnowledgeId === knowledgeItem.id"/>
          {{ knowledgeItem.name }}
        </a-tooltip>
        <span class="arrow-item">
          <a-icon type="right" />
        </span>
      </div>
      <template v-if="!knowledge.knowledgeList.length && !knowledge.knowledgeListLoading">
        <div class="no-data">
          <no-more-resources />
        </div>
      </template>
      <template v-if="knowledge.knowledgeListLoading">
        <div class="loading-wrapper">
          <a-spin />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { KnowledgeGetTree, KnowledgeQueryContentByDescriptionId } from '@/api/knowledge'
import DirIcon from '@/components/LibraryV2/DirIcon'
import NoMoreResources from '@/components/Common/NoMoreResources'
import PuBuIcon from '@/assets/icons/library/pubu.svg?inline'
import ListModeIcon from '@/assets/icons/library/liebiao .svg?inline'
import CardList from '@/views/list/CardList'
import DataCardView from '@/components/LibraryV2/DataCardView'
import { typeMap } from '@/const/teacher'
import { GetGradesByCurriculumId, GetLibraryGrades } from '@/api/preference'
import { SubjectType, TagType } from '@/const/common'
const { SubjectTree } = require('@/api/subject')

export default {
  name: 'CurriculumBrowser',
  components: {
    CardList,
    ContentTypeIcon,
    NoMoreResources,
    DirIcon,
    PuBuIcon,
    ListModeIcon,
    DataCardView
  },
  props: {
    curriculumId: {
      type: String,
      default: null
    },
    blockIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    curriculumId (value) {
      this.$logger.info('curriculumId change ' + value)
      this.refreshSubjectTree()
      this.getGradesByCurriculumId(value)
    },
    blockIndex (value) {
      this.$logger.info('block index change ' + value)
      // if (value === 0) {
      //   this.currentMainSubjectId = null
      //   this.currentSubSubjectId = null
      //   this.currentGradeId = null
      // } else if (value === 1) {
      //   this.currentSubSubjectId = null
      //   this.currentGradeId = null
      // } else if (value === 2) {
      //   this.currentGradeId = null
      // }
    }
  },
  data () {
    return {
      typeMap: typeMap,
      gradeList: [],
      currentGradeId: null,
      gradeListLoading: false,
      knowledges: [],
      knowledgeDeep: 1,
      subjectDeep: 2,
      mainSubjectList: [],
      mainSubjectListLoading: true,
      currentMainSubjectId: null,

      subSubjectList: [],
      subSubjectListLoading: true,
      currentSubSubjectId: null,

      mainKnowledgeList: [],
      dataList: [],
      dataListLoading: false,
      currentDataId: null,
      dataListMode: 'card',

      currentTypeLabel: 'Choose type（S）of content',
      currentType: 0,
      hasChildSubject: true
    }
  },
  created () {
    this.getSubjectTree()
    // this.getGradesByCurriculumId(this.curriculumId)
  },
  methods: {

    getGradesByCurriculumId (curriculumId) {
      GetGradesByCurriculumId({ curriculumId: curriculumId }).then(response => {
        this.$logger.info('GetGradesByCurriculumId', response.result)
        this.gradeList = response.result
      })
    },
    GetLibraryGrades (curriculumId, subjectId, type) {
      this.gradeListLoading = true
      this.gradeList = []
      GetLibraryGrades({ curriculumId: curriculumId, subjectId: subjectId, type: type }).then(response => {
        this.$logger.info('GetLibraryGrades', response.result)
        this.gradeList = response.result
      }).finally(() => {
        this.gradeListLoading = false
      })
    },

    refreshSubjectTree () {
      this.mainSubjectList = []
      this.subSubjectList = []
      this.knowledges = []
      this.dataList = []
      this.getSubjectTree()
    },
    getSubjectTree () {
      this.mainSubjectListLoading = true
      SubjectTree({ curriculumId: this.curriculumId }).then(response => {
        this.$logger.info('getSubjectTree response', response.result)
        this.mainSubjectList = response.result.filter(item => item.subjectType === SubjectType.Learn || item.subjectType === SubjectType.LearnAndSkill)
      }).finally(() => {
        this.mainSubjectListLoading = false
      })
    },
    handleSelectMainSubjectItem (mainSubjectItem) {
      this.subSubjectListLoading = true
      this.hasChildSubject = true
      this.subjectDeep = 2
      this.$logger.info('handleSelectMainSubjectItem ', mainSubjectItem, this.currentMainSubjectId)
      if (mainSubjectItem.children.length === 0) {
        this.hasChildSubject = false
        this.currentMainSubjectId = mainSubjectItem.id
        this.currentGradeId = null
        this.currentSubSubjectId = null
        this.knowledges = []
        this.subjectDeep = 1
        this.handleClickBlock(2, mainSubjectItem.name)
        return
      }
      if (mainSubjectItem.id !== this.currentMainSubjectId) {
        this.currentMainSubjectId = mainSubjectItem.id
        this.subSubjectList = mainSubjectItem.children
        this.knowledges = []
        this.currentGradeId = null
        this.currentSubSubjectId = null
      }
      this.subSubjectListLoading = false
      this.handleClickBlock(2, mainSubjectItem.name)
    },

    handleSelectSubSubjectItem (subSubjectItem) {
      this.$logger.info('handleSelectSubSubjectItem ', subSubjectItem)
      if (subSubjectItem.id !== this.currentSubSubjectId) {
        this.currentSubSubjectId = subSubjectItem.id
        this.currentGradeId = null
        this.knowledges = []
        // 过滤年级
        this.GetLibraryGrades(this.curriculumId, this.currentSubSubjectId, TagType.knowledge)
      }
      this.handleClickBlock(3, subSubjectItem.name)
    },

    handleSelectGradeItem (gradeItem) {
      this.$logger.info('handleSelectGradeItem ', gradeItem)
      if (gradeItem.id !== this.currentGradeId) {
        this.currentGradeId = gradeItem.id
        this.getKnowledgeTree()
      }
      this.handleClickBlock(this.subjectDeep + 2, gradeItem.name)
    },

    getKnowledgeDeep (obj, k) {
        this.knowledgeDeep = 0
        this.knowledgeDeep = Math.max(this.knowledgeDeep, k)
        if (obj.children) {
          obj.children.forEach((v) => {
            this.getKnowledgeDeep(v, k + 1)
          })
        }
      return this.knowledgeDeep
    },

    getKnowledgeTree () {
      this.knowledges = []
      const knowledgeItem = {
        knowledgeList: [],
        knowledgeListLoading: true,
        currentKnowledgeId: null
      }
      this.knowledges.push(knowledgeItem)
      this.$logger.info('grade:' + this.currentGradeId + ', subjectId:' + this.currentSubSubjectId)
      KnowledgeGetTree({
        gradeId: this.currentGradeId,
        subjectId: this.hasChildSubject ? this.currentSubSubjectId : this.currentMainSubjectId,
        tagType: TagType.knowledge
      }).then((response) => {
        this.$logger.info('KnowledgeGetTree response', response)
        this.mainKnowledgeList = response.result
        this.knowledgeDeep = 1
        if (this.mainKnowledgeList.length > 0) {
          this.knowledges[0].knowledgeList = this.mainKnowledgeList
          this.$logger.info('knowledges', this.knowledges)
        }
        this.$logger.info('mainKnowledgeList', this.knowledgeTree)
      }).finally(() => {
          if (this.knowledges.length > 0) {
            this.knowledges[0].knowledgeListLoading = false
          }
      })
    },

    handleSelectKnowledgeItem (knowledgeItem, deepIndex) {
      this.$logger.info('handleSelectKnowledgeItem', knowledgeItem, deepIndex)
      this.currentKnowledgeId = knowledgeItem.id
      this.knowledgeDeep = this.getKnowledgeDeep(knowledgeItem, deepIndex + 1)
      if (deepIndex + 1 === this.knowledgeDeep) {
        this.$logger.info('handleSelectSubKnowledgeItem', knowledgeItem)
        if (knowledgeItem.id !== this.knowledges[deepIndex].currentKnowledgeId) {
          this.$logger.info('hit knowledgeQueryContentByDescriptionId', knowledgeItem.id, this.knowledges[deepIndex].currentKnowledgeId)
          this.knowledges[deepIndex].currentKnowledgeId = knowledgeItem.id
        } else {
          this.$logger.info('skip knowledgeQueryContentByDescriptionId', knowledgeItem.id, this.knowledges[deepIndex].currentKnowledgeId)
        }
        this.handleClickBlock(this.subjectDeep + 1 + this.knowledgeDeep, knowledgeItem.name)
        return
      }
      // 删除当前点击knowledges对应下标之后的所有后续元素（既下级列表），重新填充当前点击的元素的下级列表
      this.knowledges.splice(deepIndex + 1)
      this.knowledges.push({
        knowledgeList: [],
        knowledgeListLoading: false,
        currentKnowledgeId: null
      })
      const nextIndex = deepIndex + 1
      this.knowledges[deepIndex].currentKnowledgeId = knowledgeItem.id
      this.knowledges[nextIndex].knowledgeListLoading = true
      this.knowledges[nextIndex].knowledgeList = knowledgeItem.children
      this.knowledges[nextIndex].knowledgeListLoading = false

      this.$logger.info('knowledges', this.knowledges)
      this.handleClickBlock(this.subjectDeep + 3 + deepIndex, knowledgeItem.name)
    },

    knowledgeQueryContentByDescriptionId (descriptionId) {
      this.dataListLoading = true
      this.$logger.info('knowledgeQueryContentByDescriptionId ' + descriptionId)
      KnowledgeQueryContentByDescriptionId({ descriptionId }).then(response => {
        this.$logger.info('KnowledgeQueryContentByDescriptionId response', response.result)
        this.dataList = response.result
        this.$logger.info('dataList', response.result, this.dataList)
      }).finally(() => {
        this.dataListLoading = false
      })
    },

    handleSelectDataItem (dataItem) {
      this.$logger.info('handleSelectDataItem ', dataItem)
      this.currentDataId = dataItem.id
      this.$emit('previewDetail', dataItem)
    },

    handleClickBlock (blockIndex, path) {
      this.$logger.info('handleClickBlock ' + blockIndex)
      this.$emit('clickBlock', {
        curriculumId: this.curriculumId,
        gradeId: this.currentGradeId,
        subjectId: this.currentSubSubjectId ? this.currentSubSubjectId : this.currentMainSubjectId,
        knowledgeId: this.currentKnowledgeId,
        tagType: TagType.knowledge
      })
      this.$emit('blockCollapse', { blockIndex, path })
    },

    handleToggleDataListMode (mode) {
      this.$logger.info('handleToggleDataListMode' + mode)
      this.dataListMode = mode
    },

    toggleType (type, label) {
      this.$logger.info('toggleType ' + type + ' label ' + label)
      this.currentType = type
      this.currentTypeLabel = label
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.browser-block {
  display: flex;
  flex-direction: row;
  border-left: 1px solid #ddd;
  min-height: 600px;

  .browser-block-item-wrapper {
    overflow-y: scroll;
    height: calc(100vh - 190px);
    box-sizing: border-box;

    &::-webkit-scrollbar {
      width: 4px;
      height: 2px;
    }
    &::-webkit-scrollbar-track {
      border-radius: 3px;
      background: rgba(0,0,0,0.01);
      -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.01);
    }
    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background: rgba(0,0,0,0.1);
      -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
    }
  }
  .browser-block-item {
    position: relative;
    box-sizing: border-box;
    border-right: 1px solid #ddd;
    .browser-item {
      line-height: 20px;
      padding: 10px 15px 10px 0px;
      font-weight: 500;
      cursor: pointer;
      overflow: hidden;
      //white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-word;
      user-select: none;
      background: rgba(228, 228, 228, 0.2);
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      box-sizing: border-box;
      &:hover {
        background: #EDF1F5;
      }
      .arrow-item {
        padding: 0 10px;
        width: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }

      span {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        width: calc(100% - 25px);

        text-overflow: ellipsis;
        word-break: break-word;
        user-select: none;
        overflow: hidden;

        i {
          padding-right: 5px;
        }
      }

      .file-dir-icon {
        color: #82c0d8;
        font-size: 18px;
      }
    }
    .odd-line {
      background: rgba(255, 255,255);
    }
    .active-line {
      background-color: rgba(21, 195, 154, 0.1);
      color: #15c39a;
    }
    .loading-wrapper {
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

    .browser-block-item-last {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
      box-sizing: border-box;
    border-right: 1px solid #ddd;

    .switch-type-wrapper {
      padding: 20px;
      text-align: center;
      width: 100%;

      .switch-type {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        border: 1px solid #F7F8FF;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        opacity: 1;
        border-radius: 6px;

        padding: 12px 12px;
        width: 100%;

        .switch-label {
          font-size: 14px;
          font-family: Inter-Bold;
          line-height: 20px;
          color: rgba(24, 37, 82, 1);
        }

        .switch-icon {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;

          .icon-item {
            margin-left: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            svg {
              width: 22px;
              color: rgba(24, 37, 82, 1);
            }
          }

          .active-icon {
            svg {
              color: rgba(21, 195, 154, 1);
            }
          }
        }
      }
    }
    .browser-item {
      line-height: 20px;
      padding: 10px 0 10px 10px;
      font-weight: 500;
      cursor: pointer;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-word;
      user-select: none;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      background: rgba(228, 228, 228, 0.2);
      width: 100%;
      .arrow-item {
        padding: 0 15px;
        font-weight: bold;
        width: 20px;
        font-size: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
      span {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: calc(100% - 25px);
        text-overflow: ellipsis;
        word-break: break-word;
        user-select: none;
        overflow: hidden;

        i {
          padding-right: 5px;
        }
      }

      .data-time {
        text-align: right;
        justify-content: flex-end;
        padding-right: 10px;
        font-size: 12px;
      }

      .status-icon-item {
        display: inline;
      }
    }

    .card-view-mode-wrapper {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .card-item-wrapper {
        cursor: pointer;
        width: 50%;
        padding: 10px;
        box-sizing: border-box;
        background: #FFFFFF;
        display: flex;
        flex-direction: row;
        justify-content: center;
        .card-item {
          width: 100%;
          opacity: 1;
          border-radius: 6px;
          background: #fff;
          &:hover {
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          }
        }
      }
    }

    .odd-line {
      background: rgba(228, 228, 228, 0.2);
    }
    .active-line {
      background-color: rgba(21, 195, 154, 0.1);
      color: #15c39a;
    }
    .loading-wrapper {
      min-height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.no-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60%;
  margin: auto;
}
</style>
