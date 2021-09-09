<template>
  <div class="browser-block">
    <!--      mainSubject list-->
    <div class="browser-block-item" :style="{width: blockWidth + 'px' , minWidth: blockWidth + 'px' }">
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
          <dir-icon dir-type="opened" v-if="currentMainSubjectId !== mainSubjectItem.id"/>
          <dir-icon dir-type="yellow" v-if="currentMainSubjectId === mainSubjectItem.id"/>
          {{ mainSubjectItem.name }}
        </a-tooltip>
        <span class="arrow-item">
          <a-icon type="right" />
        </span>
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
    <div class="browser-block-item" v-if="hasChildSubject" :style="{width: blockWidth + 'px' , minWidth: blockWidth + 'px' }" >
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
          <dir-icon dir-type="opened" v-if="currentSubSubjectId !== subSubjectItem.id"/>
          <dir-icon dir-type="yellow" v-if="currentSubSubjectId === subSubjectItem.id"/>
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
      <div class="browser-block-item" :style="{width: blockWidth + 'px' , minWidth: blockWidth + 'px' }">
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
            <dir-icon dir-type="opened" v-if="currentGradeId !== gradeItem.id"/>
            <dir-icon dir-type="yellow" v-if="currentGradeId === gradeItem.id"/>
            {{ gradeItem.name }}
          </a-tooltip>
          <span class="arrow-item">
            <a-icon type="right" />
          </span>
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
    <div class="browser-block-item" :style="{width: blockWidth + 'px' , minWidth: blockWidth + 'px' }">
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
          <dir-icon dir-type="opened" v-if="currentMainKnowledgeId !== mainKnowledgeItem.id"/>
          <dir-icon dir-type="yellow" v-if="currentMainKnowledgeId === mainKnowledgeItem.id"/>
          {{ mainKnowledgeItem.name }}
        </a-tooltip>
        <span class="arrow-item">
          <a-icon type="right" />
        </span>
      </div>
      <template v-if="!mainKnowledgeList.length && !mainKnowledgeListLoading">
        <div class="no-data">
          <no-more-resources />
        </div>
      </template>
      <template v-if="mainKnowledgeListLoading">
        <div class="loading-wrapper">
          <a-spin />
        </div>
      </template>
    </div>
    <!--      sub knowledge list-->
    <div class="browser-block-item" :style="{width: blockWidth + 'px' , minWidth: blockWidth + 'px' }" >
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
          <dir-icon dir-type="opened" v-if="currentSubKnowledgeId !== subKnowledgeItem.id"/>
          <dir-icon dir-type="yellow" v-if="currentSubKnowledgeId === subKnowledgeItem.id"/>
          {{ subKnowledgeItem.name }}
        </a-tooltip>
        <span class="arrow-item">
          <a-icon type="right" />
        </span>
      </div>
      <template v-if="!subKnowledgeList.length && !subKnowledgeListLoading">
        <div class="no-data">
          <no-more-resources />
        </div>
      </template>
      <template v-if="subKnowledgeListLoading">
        <div class="loading-wrapper">
          <a-spin />
        </div>
      </template>
    </div>
    <div
      class="browser-block-item-wrapper"
      :style="{width: blockWidth + 'px' ,
               minWidth: blockWidth + 'px'}">
      <div
        class="browser-block-item-last"
        :style="{width: blockWidth + 'px' ,
                 minWidth: blockWidth + 'px',
                 'flex-direction': dataListMode === 'list' ? 'column' : 'row'}">
        <!--   data item list-->
        <div class="switch-type-wrapper">
          <div class="switch-type">
            <div class="switch-label">
              <a-dropdown>
                <a-menu slot="overlay">
                  <a-menu-item disabled>
                    <span>{{ $t('teacher.my-content.choose-types-of-content') }}</span>
                  </a-menu-item>
                  <a-menu-item @click="toggleType(0, $t('teacher.my-content.all-type'))">
                    <span>{{ $t('teacher.my-content.all-type') }}</span>
                  </a-menu-item>
                  <a-menu-item @click="toggleType( typeMap['unit-plan'], $t('teacher.my-content.unit-plan-type'))">
                    <span>{{ $t('teacher.my-content.unit-plan-type') }}</span>
                  </a-menu-item>
                  <a-menu-item @click="toggleType(typeMap.topic, $t('teacher.my-content.topics-type'))">
                    <span>{{ $t('teacher.my-content.topics-type') }}</span>
                  </a-menu-item>
                  <a-menu-item @click="toggleType(typeMap.task, $t('teacher.my-content.tasks-type') )">
                    <span>{{ $t('teacher.my-content.tasks-type') }}</span>
                  </a-menu-item>
                  <a-menu-item @click="toggleType(typeMap.lesson, $t('teacher.my-content.lesson-type'))">
                    <span>{{ $t('teacher.my-content.lesson-type') }}</span>
                  </a-menu-item>
                  <a-menu-item @click="toggleType(typeMap.evaluation, $t('teacher.my-content.evaluation-type'))">
                    <span>{{ $t('teacher.my-content.evaluation-type') }}</span>
                  </a-menu-item>
                </a-menu>
                <a-button
                  style="padding: 0 10px;display:flex; align-items:center ;height: 35px;border-radius: 6px;background: rgba(245, 245, 245, 0.5);font-size:13px;border: 1px solid #BCBCBC;font-family: Inter-Bold;color: #182552;">
                  <span v-if="currentTypeLabel">{{ currentTypeLabel }}</span> <span v-else>Choose type(s)of content</span>
                  <a-icon type="caret-down" /> </a-button>
              </a-dropdown>
            </div>
            <div class="switch-icon">
              <div :class="{'icon-item': true, 'active-icon': dataListMode === 'list'}" @click="handleToggleDataListMode('list')">
                <list-mode-icon />
              </div>
              <div :class="{'icon-item': true, 'active-icon': dataListMode === 'card'}" @click="handleToggleDataListMode('card')">
                <pu-bu-icon />
              </div>
            </div>
          </div>
        </div>
        <template v-if="dataListMode === 'list'">
          <div
            :class="{
              'browser-item': true,
              'odd-line': index % 2 === 0,
              'active-line': currentDataId === dataItem.id
            }"
            v-for="(dataItem, index) in dataList"
            @click="handleSelectDataItem(dataItem)"
            v-if="(currentType === 0 || dataItem.type === currentType)"
            :key="index">
            <a-tooltip :mouseEnterDelay="1">
              <template slot="title">
                {{ dataItem.name }}
              </template>
              <dir-icon :content-type="dataItem.type" />
              <span class="data-name">
                {{ dataItem.name }}
              </span>
              <span class="data-time">
                {{ dataItem.createTime | dayjs }}
              </span>
            </a-tooltip>
            <span class="arrow-item">
              <a-icon type="more" />
            </span>
          </div>
        </template>
        <template v-if="dataListMode === 'card'">
          <div class="card-view-mode-wrapper" v-if="dataList.length">
            <div
              class="card-item-wrapper"
              v-for="(dataItem, index) in dataList"
              @click="handleSelectDataItem(dataItem)"
              v-if="(currentType === 0 || dataItem.type === currentType)"
              :key="index">
              <div class="card-item">
                <data-card-view
                  :active-flag="currentDataId === dataItem.id"
                  :cover="dataItem.image"
                  :title="dataItem.name"
                  :created-time="dataItem.createTime"
                />
              </div>
            </div>
          </div>
        </template>
        <template v-if="!dataList.length && !dataListLoading">
          <div class="no-data">
            <no-more-resources />
          </div>
        </template>
        <template>
          <div class="loading-wrapper" v-if="dataListLoading">
            <a-spin />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { KnowledgeGetTree, KnowledgeQueryContentByDescriptionId } from '@/api/knowledge'
import DirIcon from '@/components/Library/DirIcon'
import NoMoreResources from '@/components/Common/NoMoreResources'
import PuBuIcon from '@/assets/icons/library/pubu .svg?inline'
import ListModeIcon from '@/assets/icons/library/liebiao .svg?inline'
import CardList from '@/views/list/CardList'
import DataCardView from '@/components/Library/DataCardView'
import { typeMap } from '@/const/teacher'
import { GetGradesByCurriculumId } from '@/api/preference'
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
      this.getGradesByCurriculumId(value)
    }
  },
  data () {
    return {
      typeMap: typeMap,
      gradeList: [],
      currentGradeId: null,
      gradeListLoading: false,

      mainSubjectList: [],
      mainSubjectListLoading: true,
      currentMainSubjectId: null,

      subSubjectList: [],
      subSubjectListLoading: true,
      currentSubSubjectId: null,

      knowledgeDeep: 1,

      mainKnowledgeList: [],
      mainKnowledgeListLoading: false,
      currentMainKnowledgeId: null,

      subKnowledgeList: [],
      subKnowledgeListLoading: false,
      currentSubKnowledgeId: null,

      dataList: [],
      dataListLoading: false,
      currentDataId: null,
      dataListMode: 'list',

      currentTypeLabel: 'Choose type（S）of content',
      currentType: 0,
      hasChildSubject: true
    }
  },
  created () {
    this.$logger.info('CurriculumBrowser blockWidth:' + this.blockWidth)
    this.getSubjectTree()
    this.getGradesByCurriculumId(this.curriculumId)
  },
  methods: {

    getGradesByCurriculumId (curriculumId) {
      GetGradesByCurriculumId({ curriculumId: curriculumId }).then(response => {
        this.$logger.info('GetGradesByCurriculumId', response.result)
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
      this.hasChildSubject = true
      this.$logger.info('handleSelectMainSubjectItem ', mainSubjectItem, this.currentMainSubjectId)
      if (mainSubjectItem.hasChild === '0') {
        this.hasChildSubject = false
        this.currentMainSubjectId = mainSubjectItem.id
        this.subSubjectList = []
        this.currentSubKnowledgeId = null
        return
      }
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

    getKnowledgeDeep (mainKnowLedge) {
      let deep = 1
      while (mainKnowLedge.children.length > 0 && mainKnowLedge.hasChild === '1') {
        deep++
        mainKnowLedge = mainKnowLedge.children[0]
      }
      return deep
    },

    getKnowledgeTree () {
      this.mainKnowledgeListLoading = true
      this.$logger.info('grade:' + this.currentGradeId + ', subjectId:' + this.currentSubSubjectId)
      KnowledgeGetTree({
        gradeId: this.currentGradeId,
        subjectId: this.hasChildSubject ? this.currentSubSubjectId : this.currentMainSubjectId
      }).then((response) => {
        this.$logger.info('KnowledgeGetTree response', response)
        this.mainKnowledgeList = response.result
        // if (this.mainKnowledgeList.length > 0) {
        //   this.knowledgeDeep = this.getKnowledgeDeep(this.mainKnowledgeList[0])
        // }
        // this.$logger.info('knowledgeDeep', this.knowledgeDeep)
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
      padding: 10px 0 10px 10px;
      font-weight: 500;
      cursor: pointer;
      overflow: hidden;
      //white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      user-select: none;
      background: rgba(228, 228, 228, 0.2);
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      box-sizing: border-box;
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
        word-break: break-all;
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
      background: rgba(228, 228, 228, 0.2);
    }
    .active-line {
      background: rgba(255, 187, 0, 0.1);
      color: rgba(255, 187, 0, 1);
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
      word-break: break-all;
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
        word-break: break-all;
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
      padding: 10px;
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
          border: 1px solid #15C39A;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          opacity: 1;
          border-radius: 6px;
        }
      }
    }

    .odd-line {
      background: rgba(228, 228, 228, 0.2);
    }
    .active-line {
      background-color: rgba(255, 187, 0, 0.1);
      color: rgba(255, 187, 0, 1);
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

.no-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60%;
  margin: auto;
}
</style>
