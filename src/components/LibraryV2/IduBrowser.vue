<template>
  <div class="browser-block">
    <!--      mainSubject list-->
    <!--    <div class="browser-block-item" :style="{width: blockWidth + 'px' , minWidth: blockWidth + 'px' }">-->
    <!--      <div-->
    <!--        :class="{-->
    <!--          'browser-item': true,-->
    <!--          'odd-line': index % 2 === 0,-->
    <!--          'active-line': currentMainSubjectId === mainSubjectItem.id-->
    <!--        }"-->
    <!--        v-for="(mainSubjectItem, index) in mainSubjectList"-->
    <!--        @click="handleSelectMainSubjectItem(mainSubjectItem)"-->
    <!--        :key="index">-->
    <!--        <a-tooltip :mouseEnterDelay="1">-->
    <!--          <template slot="title">-->
    <!--            {{ mainSubjectItem.name }}-->
    <!--          </template>-->
    <!--          <dir-icon dir-type="blue" v-if="currentMainSubjectId !== mainSubjectItem.id"/>-->
    <!--          <dir-icon dir-type="opened" v-if="currentMainSubjectId === mainSubjectItem.id"/>-->
    <!--          {{ mainSubjectItem.name }}-->
    <!--        </a-tooltip>-->
    <!--        <span class="arrow-item">-->
    <!--          <a-icon type="right" />-->
    <!--        </span>-->
    <!--      </div>-->
    <!--      <template v-if="!mainSubjectList.length && !mainSubjectListLoading">-->
    <!--        <div class="no-data">-->
    <!--          <no-more-resources />-->
    <!--        </div>-->
    <!--      </template>-->
    <!--      <template v-if="mainSubjectListLoading">-->
    <!--        <div class="loading-wrapper">-->
    <!--          <a-spin />-->
    <!--        </div>-->
    <!--      </template>-->
    <!--    </div>-->
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
    <div class="browser-block-item browser-block-item-wrapper" :style="{width: blockWidth + 'px' , minWidth: blockWidth + 'px' }" v-for="(knowledge, deepIndex) in knowledges" :key="deepIndex">
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
                  <template v-if="$store.getters.roles.indexOf('teacher') !== -1">
                    <a-menu-item @click="toggleType( typeMap['unit-plan'], $t('teacher.my-content.unit-plan-type'))">
                      <span>{{ $t('teacher.my-content.unit-plan-type') }}</span>
                    </a-menu-item>
                    <a-menu-item @click="toggleType(typeMap.evaluation, $t('teacher.my-content.evaluation-type'))">
                      <span>{{ $t('teacher.my-content.evaluation-type') }}</span>
                    </a-menu-item>
                  </template>
                  <a-menu-item @click="toggleType(typeMap.task, $t('teacher.my-content.tasks-type') )">
                    <span>{{ $t('teacher.my-content.tasks-type') }}</span>
                  </a-menu-item>
                  <!--                  <a-menu-item @click="toggleType(typeMap.lesson, $t('teacher.my-content.lesson-type'))">
                    <span>{{ $t('teacher.my-content.lesson-type') }}</span>
                  </a-menu-item>-->
                  <template v-if="$store.getters.roles.indexOf('expert') !== -1">
                    <a-menu-item @click="toggleType(typeMap.topic, $t('teacher.my-content.topics-type'))">
                      <span>{{ $t('teacher.my-content.topics-type') }}</span>
                    </a-menu-item>
                  </template>
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
              <content-type-icon :type="dataItem.type" />
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
                  :content-type="dataItem.type"
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
import { GetIBIduList, KnowledgeQueryContentByDescriptionId } from '@/api/knowledge'
import DirIcon from '@/components/LibraryV2/DirIcon'
import NoMoreResources from '@/components/Common/NoMoreResources'
import PuBuIcon from '@/assets/icons/library/pubu .svg?inline'
import ListModeIcon from '@/assets/icons/library/liebiao .svg?inline'
import CardList from '@/views/list/CardList'
import DataCardView from '@/components/LibraryV2/DataCardView'
import { typeMap } from '@/const/teacher'
import { GetGradesByCurriculumId } from '@/api/preference'
// const { SubjectTree } = require('@/api/subject')

export default {
  // 数据层级结构：mainsubject-year-knowledge
  name: 'IduBrowser',
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

      mainKnowledgeList: [],
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
    // this.getSubjectTree()
    this.getGradesByCurriculumId(this.curriculumId)
  },
  methods: {

    getGradesByCurriculumId (curriculumId) {
      GetGradesByCurriculumId({ curriculumId: curriculumId }).then(response => {
        this.$logger.info('GetGradesByCurriculumId', response.result)
        this.gradeList = response.result
        if (this.gradeList && this.gradeList.length) {
          this.handleSelectGradeItem(this.gradeList[0])
        }
      })
    },

    refreshSubjectTree () {
      this.mainSubjectList = []
      this.knowledges = []
      this.dataList = []
      // this.getSubjectTree()
    },
    // getSubjectTree () {
    //   this.mainSubjectListLoading = true
    //   SubjectTree({ curriculumId: this.curriculumId }).then(response => {
    //     this.$logger.info('getSubjectTree response', response.result)
    //     this.mainSubjectList = response.result.filter(item => item.subjectType === SubjectType.Skill || item.subjectType === SubjectType.LearnAndSkill)
    //     if (this.mainSubjectList && this.mainSubjectList.length) {
    //       this.handleSelectMainSubjectItem(this.mainSubjectList[0])
    //     }
    //   }).finally(() => {
    //     this.mainSubjectListLoading = false
    //   })
    // },
    handleSelectMainSubjectItem (mainSubjectItem) {
      this.hasChildSubject = true
      this.subjectDeep = 2
      this.$logger.info('handleSelectMainSubjectItem ', mainSubjectItem, this.currentMainSubjectId)
      if (mainSubjectItem.id !== this.currentMainSubjectId) {
        this.currentMainSubjectId = mainSubjectItem.id
        this.knowledges = []
        this.currentGradeId = null
      }
      this.handleClickBlock(1, mainSubjectItem.name)
    },

    handleSelectGradeItem (gradeItem) {
      this.$logger.info('handleSelectGradeItem ', gradeItem)
      if (gradeItem.id !== this.currentGradeId) {
        this.currentGradeId = gradeItem.id
        this.handleClickBlock(this.blockIndex, gradeItem.name)
        this.getKnowledgeTree()
      }
      // this.handleClickBlock(3, gradeItem.name)
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
      this.$logger.info('grade:' + this.currentGradeId + ', currentMainSubjectId:' + this.currentMainSubjectId)
      GetIBIduList({
        gradeId: this.currentGradeId
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
      this.$logger.info('handleSelectKnowledgeItem', knowledgeItem)
      this.knowledgeDeep = this.getKnowledgeDeep(knowledgeItem, deepIndex + 1)
      if (deepIndex + 1 === this.knowledgeDeep) {
        this.$logger.info('knowledgeQueryContentByDescriptionId', knowledgeItem)
        if (knowledgeItem.id !== this.knowledges[deepIndex].currentKnowledgeId) {
          this.knowledges[deepIndex].currentKnowledgeId = knowledgeItem.id
          this.dataList = []
          this.knowledgeQueryContentByDescriptionId(knowledgeItem.id)
        }
        this.handleClickBlock(1 + this.knowledgeDeep, knowledgeItem.name)
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
      this.handleClickBlock(1 + deepIndex, knowledgeItem.name)
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
      padding: 10px 15px 10px 20px;
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
          //border: 1px solid #15C39A;
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
      background-color: rgba(21, 195, 154, 0.1);
      color: #15c39a;
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
