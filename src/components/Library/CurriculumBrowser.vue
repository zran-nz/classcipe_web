<template>
  <div class="browser-block">
    <!--      mainSubject list-->
    <div class="browser-block-item" :style="{width: blockWidth + 'px' }">
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
          <a-icon type="folder-open" theme="filled" class="file-dir-icon"/>
          {{ mainSubjectItem.name }}
        </a-tooltip>
      </div>
      <template v-if="!mainSubjectList.length && !mainSubjectListLoading">
        <a-empty />
      </template>
      <template v-if="mainSubjectListLoading">
        <div class="loading-wrapper">
          <a-spin />
        </div>
      </template>
    </div>
    <!--      subSubject list-->
    <div class="browser-block-item" :style="{width: blockWidth + 'px' }" >
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
          <a-icon type="folder-open" theme="filled" class="file-dir-icon"/>
          {{ subSubjectItem.name }}
        </a-tooltip>
      </div>
      <template v-if="!subSubjectList.length && !subSubjectListLoading">
        <a-empty />
      </template>
      <template v-if="subSubjectListLoading">
        <div class="loading-wrapper">
          <a-spin />
        </div>
      </template>
    </div>
    <!--      main grade list-->
    <div class="browser-block-item" :style="{width: blockWidth + 'px' }">
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
          <a-icon type="folder-open" theme="filled" class="file-dir-icon"/>{{ gradeItem.name }}
        </a-tooltip>
      </div>
      <template v-if="!gradeList.length && !gradeListLoading">
        <a-empty />
      </template>
      <template v-if="gradeListLoading">
        <div class="loading-wrapper">
          <a-spin />
        </div>
      </template>
    </div>
    <!--      main knowledge list-->
    <div class="browser-block-item" :style="{width: blockWidth + 'px' }">
      <div
        :class="{
          'browser-item': true,
          'odd-line': index % 2 === 0,
          'active-line': currentMainKnowledgeId === mainKnowledgeItem.id
        }"
        v-for="(mainKnowledgeItem, index) in mainKnowledgeList"
        @click="handleSelectMainKnowledgeItem(mainKnowledgeItem)"
        :key="index">
        <a-tooltip :mouseEnterDelay="1">
          <template slot="title">
            {{ mainKnowledgeItem.name }}
          </template>
          <a-icon type="folder-open" theme="filled" class="file-dir-icon"/>
          {{ mainKnowledgeItem.name }}
        </a-tooltip>
      </div>
      <template v-if="!mainKnowledgeList.length && !mainKnowledgeListLoading">
        <a-empty />
      </template>
      <template v-if="mainKnowledgeListLoading">
        <div class="loading-wrapper">
          <a-spin />
        </div>
      </template>
    </div>
    <!--      sub knowledge list-->
    <div class="browser-block-item" :style="{width: blockWidth + 'px' }" >
      <div
        :class="{
          'browser-item': true,
          'odd-line': index % 2 === 0,
          'active-line': currentSubKnowledgeId === subKnowledgeItem.id
        }"
        v-for="(subKnowledgeItem, index) in subKnowledgeList"
        @click="handleSelectSubKnowledgeItem(subKnowledgeItem)"
        :key="index">
        <a-tooltip :mouseEnterDelay="1">
          <template slot="title">
            {{ subKnowledgeItem.name }}
          </template>
          <a-icon type="folder-open" theme="filled" class="file-dir-icon"/>
          {{ subKnowledgeItem.name }}
        </a-tooltip>
      </div>
      <template v-if="!subKnowledgeList.length && !subKnowledgeListLoading">
        <a-empty />
      </template>
      <template v-if="subKnowledgeListLoading">
        <div class="loading-wrapper">
          <a-spin />
        </div>
      </template>
    </div>
    <div class="browser-block-item-last" :style="{width: blockWidth + 'px' }">
      <!--   data item list-->
      <div
        :class="{
          'browser-item': true,
          'odd-line': index % 2 === 0,
          'active-line': currentDataId === dataItem.id
        }"
        v-for="(dataItem, index) in dataList"
        @click="handleSelectDataItem(dataItem)"
        :key="index">
        <a-tooltip :mouseEnterDelay="1">
          <template slot="title">
            {{ dataItem.name }}
          </template>
          <content-type-icon :type="dataItem.type" />
          {{ dataItem.name }}
        </a-tooltip>
      </div>
      <template v-if="!dataList.length && !dataListLoading">
        <a-empty />
      </template>
      <template>
        <div class="loading-wrapper" v-if="dataListLoading">
          <a-spin />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { KnowledgeGetTree, KnowledgeQueryContentByDescriptionId } from '@/api/knowledge'

const { GetMyGrades } = require('@/api/teacher')

const { SubjectTree } = require('@/api/subject')

export default {
  name: 'CurriculumBrowser',
  components: {
    ContentTypeIcon
  },
  props: {
    blockWidth: {
      type: Number,
      default: 200
    },
    curriculumId: {
      type: String,
      default: null
    }
  },
  watch: {
    curriculumId (value) {
      this.$logger.info('curriculumId change ' + value)
      this.refreshSubjectTree()
    }
  },
  data () {
    return {
      gradeList: [],
      currentGradeId: null,
      gradeListLoading: false,

      mainSubjectList: [],
      mainSubjectListLoading: true,
      currentMainSubjectId: null,

      subSubjectList: [],
      subSubjectListLoading: true,
      currentSubSubjectId: null,

      mainKnowledgeList: [],
      mainKnowledgeListLoading: false,
      currentMainKnowledgeId: null,

      subKnowledgeList: [],
      subKnowledgeListLoading: false,
      currentSubKnowledgeId: null,

      dataList: [],
      dataListLoading: false,
      currentDataId: null
    }
  },
  created () {
    this.$logger.info('CurriculumBrowser blockWidth:' + this.blockWidth)
    this.getSubjectTree()
    this.getAllGrades()
  },
  methods: {
    getAllGrades () {
      GetMyGrades().then(response => {
        this.$logger.info('GetMyGrades', response.result)
        this.gradeList = response.result
      })
    },
    refreshSubjectTree () {
      this.mainSubjectList = []
      this.subSubjectList = []
      this.mainKnowledgeList = []
      this.subSubjectList = []
      this.subKnowledgeList = []
      this.dataList = []
      this.getSubjectTree()
    },
    getSubjectTree () {
      this.mainSubjectListLoading = true
      SubjectTree({ curriculumId: this.curriculumId }).then(response => {
        this.$logger.info('getSubjectTree response', response.result)
        this.mainSubjectList = response.result
        if (this.mainSubjectList && this.mainSubjectList.length) {
          this.handleSelectMainSubjectItem(this.mainSubjectList[0])
        }
      }).finally(() => {
        this.mainSubjectListLoading = false
      })
    },
    handleSelectMainSubjectItem (mainSubjectItem) {
      this.subSubjectListLoading = true
      this.$logger.info('handleSelectMainSubjectItem ', mainSubjectItem, this.currentMainSubjectId)
      if (mainSubjectItem.id !== this.currentMainSubjectId) {
        this.currentMainSubjectId = mainSubjectItem.id
        this.subSubjectList = mainSubjectItem.children
        this.currentSubKnowledgeId = null
      }
      this.subSubjectListLoading = false
      this.handleClickBlock(1, mainSubjectItem.name)
    },

    handleSelectSubSubjectItem (subSubjectItem) {
      this.$logger.info('handleSelectSubSubjectItem ', subSubjectItem)
      if (subSubjectItem.id !== this.currentSubSubjectId) {
        this.currentSubSubjectId = subSubjectItem.id
        this.currentGradeId = null
      }
      this.handleClickBlock(2, subSubjectItem.name)
    },

    handleSelectGradeItem (gradeItem) {
      this.$logger.info('handleSelectGradeItem ', gradeItem)
      if (gradeItem.id !== this.currentGradeId) {
        this.currentGradeId = gradeItem.id
        this.mainKnowledgeList = []
        this.mainKnowledgeListLoading = true
        this.subKnowledgeList = []
        this.subKnowledgeListLoading = false
        this.getKnowledgeTree()
      }
      this.handleClickBlock(3, gradeItem.name)
    },

    getKnowledgeTree () {
      this.mainKnowledgeListLoading = true
      this.$logger.info('grade:' + this.currentGradeId + ', subjectId:' + this.currentSubSubjectId)
      KnowledgeGetTree({
        gradeId: this.currentGradeId,
        subjectId: this.currentSubSubjectId
      }).then((response) => {
        this.$logger.info('KnowledgeGetTree response', response)
        this.mainKnowledgeList = response.result
        this.$logger.info('mainKnowledgeList', this.knowledgeTree)
      }).finally(() => {
        this.mainKnowledgeListLoading = false
      })
    },

    handleSelectMainKnowledgeItem (knowledgeItem) {
      this.$logger.info('handleSelectMainKnowledgeItem', knowledgeItem)
      if (knowledgeItem.id !== this.currentMainKnowledgeId) {
        this.currentMainKnowledgeId = knowledgeItem.id
        this.subKnowledgeListLoading = true
        this.subKnowledgeList = knowledgeItem.children
      }
      this.subKnowledgeListLoading = false
      this.handleClickBlock(4, knowledgeItem.name)
    },

    handleSelectSubKnowledgeItem (subKnowledgeItem) {
      this.$logger.info('handleSelectSubKnowledgeItem', subKnowledgeItem)
      if (subKnowledgeItem.id !== this.currentSubKnowledgeId) {
        this.currentSubKnowledgeId = subKnowledgeItem.id
        this.dataList = []
        this.knowledgeQueryContentByDescriptionId(this.currentSubKnowledgeId)
      }
      this.handleClickBlock(5, subKnowledgeItem.name)
    },

    knowledgeQueryContentByDescriptionId (descriptionId) {
      this.dataListLoading = true
      this.$logger.info('knowledgeQueryContentByDescriptionId ' + descriptionId)
      KnowledgeQueryContentByDescriptionId({ descriptionId }).then(response => {
        this.$logger.info('KnowledgeQueryContentByDescriptionId response', response.result)
        this.dataList = response.result
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
      this.$emit('blockCollapse', { blockIndex, path })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.browser-block {
  display: flex;
  flex-direction: row;
  height: 100%;
  border-left: 1px solid #ddd;
  min-height: 600px;

  .browser-block-item {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    box-sizing: border-box;
    min-height: 600px;
    border-right: 1px solid #ddd;
    .browser-item {
      line-height: 20px;
      padding: 10px;
      font-weight: 500;
      cursor: pointer;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      user-select: none;

      span {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;

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
      background-color: fade(@text-color-secondary, 3%);
    }
    .active-line {
      background-color: fade(@outline-color, 20%);
      color: @primary-color;
      white-space: normal;
    }
    .loading-wrapper {
      position: absolute;
      width: 50px;
      text-align: center;
      top: 30%;
      left: 50%;
      margin-left: -25px;
    }
  }

  .browser-block-item-last {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    box-sizing: border-box;
    min-height: 600px;
    border-right: 1px solid #ddd;
    .browser-item {
      line-height: 20px;
      padding: 10px;
      font-weight: 500;
      cursor: pointer;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      user-select: none;
      span {
        line-height: 20px;
      }

      .status-icon-item {
        display: inline;
      }
    }
    .odd-line {
      background-color: fade(@text-color-secondary, 3%);
    }
    .active-line {
      background-color: fade(@outline-color, 20%);
      color: @primary-color;
      white-space: normal;
    }
    .loading-wrapper {
      position: absolute;
      width: 50px;
      text-align: center;
      top: 30%;
      left: 50%;
      margin-left: -25px;
    }
  }
}
</style>
