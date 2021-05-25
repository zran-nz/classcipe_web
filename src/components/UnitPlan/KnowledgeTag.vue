<template>
  <div class="knowledge-tag-wrapper">
    <a-row >
      <a-col span="3">
        <div class="tag-select grade-select border-right">
          <div class="tag-label">
            {{ $t('teacher.add-unit-plan.select-grade') }}
          </div>
          <div class="tag-list-container">
            <div class="tag-list">
              <div :class="{'tag-item': true, 'active-item': gradeId === grade.id}" v-for="(grade,index) in gradeList" :key="index" @click="handleSelectGrade(grade)">{{ grade.name }}</div>
            </div>
          </div>
        </div>
      </a-col>

      <a-col span="9">
        <div class="tag-select grade-select border-right">
          <div class="tag-label">
            {{ $t('teacher.add-unit-plan.select-subject') }}
          </div>
          <div class="subject-tree">
            <div class="main-subject border-right">
              <div class="tag-list-container">
                <div class="tag-list">
                  <div :class="{'tag-item': true, 'active-item': mainSubjectId === subject.id}" v-for="(subject,index) in subjectTree" :key="index" @click="handleSelectMainSubject(subject)">
                    <a-tooltip placement="leftTop">
                      <template slot="title">   {{ subject.name }}</template>
                      {{ subject.name }}
                    </a-tooltip>
                    <a-icon type="right" class="tag-more" v-if="subject.children.length"/>
                  </div>
                </div>
              </div>
            </div>
            <div class="sub-subject">
              <div class="tag-list-container">
                <div class="tag-list">
                  <div :class="{'tag-item': true, 'active-item': subSubjectId === subject.id}" v-for="(subject,index) in subjectTreeChildren" :key="index" @click="handleSelectSubSubject(subject)">
                    <a-tooltip placement="leftTop">
                      <template slot="title">{{ subject.name }}</template>
                      {{ subject.name }}
                    </a-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-col>
      <a-col span="12">
        <div class="tag-select grade-select">
          <div class="tag-label">
            {{ $t('teacher.add-unit-plan.knowledge-tags') }}
          </div>
          <div class="knowledge-tag-tree">
            <div class="main-knowledge border-right">
              <div class="tag-list-container">
                <div class="tag-list" v-show="!knowledgeLoading">
                  <div :class="{'tag-item': true, 'active-item': mainKnowledgeId === knowledgeItem.id}" v-for="(knowledgeItem,index) in knowledgeTree" :key="index" @click="handleSelectMainKnowledgeItem(knowledgeItem)">
                    <a-tooltip placement="leftTop">
                      <template slot="title">  {{ knowledgeItem.name }}</template>
                      {{ knowledgeItem.name }}
                    </a-tooltip>
                    <a-icon type="right" class="tag-more" v-if="knowledgeItem.children.length"/>
                  </div>
                </div>
                <a-spin v-show="knowledgeLoading" class="spin-loading"/>
              </div>
            </div>
            <div class="sub-knowledge border-right">
              <div class="tag-list-container">
                <div class="tag-list">
                  <div :class="{'tag-item': true, 'active-item': subKnowledgeId === subKnowledgeItem.id}" v-for="(subKnowledgeItem,index) in knowledgeTreeChild" :key="index" @click="handleSelectSubKnowledgeItem(subKnowledgeItem)">
                    <a-tooltip placement="leftTop">
                      <template slot="title">{{ subKnowledgeItem.name }}</template>
                      {{ subKnowledgeItem.name }}
                    </a-tooltip>
                    {{ subKnowledgeItem.name }}
                    <a-icon type="right" class="tag-more" v-if="subKnowledgeItem.tags.length"/>
                  </div>
                </div>
              </div>
            </div>
            <div class="knowledge-tag">
              <div class="tag-list-container">
                <div class="tag-list">
                  <div class="tag-item input-tag-item" v-show="showNewTagInput">
                    <a-input :placeholder="$t('teacher.add-unit-plan.input-new-tag')" v-model="newTag" class="new-tag-input" @keyup.enter="handleAddNewTag"/>
                  </div>
                  <div :class="{'tag-item': true, 'active-item': selectedKnowledgeTags.indexOf(knowledgeTag.id) !== -1}" v-for="(knowledgeTag,index) in knowledgeTags" :key="index" @click="handleSelectKnowledgeTag(knowledgeTag)">
                    <a-tooltip placement="leftTop">
                      <template slot="title">{{ knowledgeTag.name }}</template>
                      {{ knowledgeTag.name }}
                    </a-tooltip>
                    <a-icon type="check" class="tag-more" v-if="selectedKnowledgeTags.indexOf(knowledgeTag.id) !== -1"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { KnowledgeAddOrUpdateTag, KnowledgeGetTree } from '@/api/knowledge'

export default {
  name: 'KnowledgeTag',
  props: {
    gradeList: {
      type: Array,
      default: () => []
    },
    subjectTree: {
      type: Array,
      default: () => []
    },
    defaultGradeId: {
      type: String,
      default: ''
    },
    defaultMainSubjectId: {
      type: String,
      default: ''
    },
    defaultSubSubjectId: {
      type: String,
      default: ''
    },
    defaultKnowledgeTags: {
      type: Array,
      default: () => []
    }
  },
  mounted () {
  },
  data () {
    return {
      knowledgeTagList: [],

      gradeId: '',

      mainSubjectId: '',
      subSubjectId: '',
      subjectTreeChildren: [],

      mainKnowledgeId: '',
      subKnowledgeId: '',
      knowledgeTree: [],
      knowledgeTreeChild: [],
      knowledgeTags: [],
      selectedKnowledgeTags: [],
      knowledgeLoading: false,

      newTag: '',
      showNewTagInput: false
    }
  },
  created () {
    this.gradeId = this.defaultGradeId
    this.mainSubjectId = this.defaultMainSubjectId
    this.subSubjectId = this.defaultSubSubjectId
    this.selectedKnowledgeTags = this.defaultKnowledgeTags
  },
  methods: {
    handleSelectGrade (grade) {
      logger.info('handleSelectGrade', grade)
      this.gradeId = grade.id
    },

    checkSelectGrade () {
      if (!this.gradeId) {
        this.$message.warn(this.$t('teacher.add-unit-plan.select-grade-first'))
      }
      return !!this.gradeId
    },

    handleSelectMainSubject (mainSubject) {
      logger.info('handleSelectMainSubject', mainSubject)
      if (!this.checkSelectGrade()) {
        return
      }
      if (mainSubject.id !== this.mainSubjectId) {
        this.resetSubSubject()
        this.resetKnowledge()
        this.mainSubjectId = mainSubject.id
        this.subjectTreeChildren = mainSubject.children
      }
    },

    resetSubSubject () {
      this.subSubjectId = ''
      this.subjectTreeChildren = []
    },

    handleSelectSubSubject (subSubject) {
      logger.info('handleSelectSubSubject', subSubject)
      if (subSubject.id !== this.subSubjectId) {
        this.subSubjectId = subSubject.id
        this.resetKnowledge()
        this.getKnowledgeTree()
      }
    },

    resetKnowledge () {
      this.mainKnowledgeId = ''
      this.subKnowledgeId = ''
      this.knowledgeTree = []
      this.knowledgeTreeChild = []
      this.knowledgeTags = []
      this.selectedKnowledgeTags = []
      this.showNewTagInput = false
    },

    getKnowledgeTree () {
      this.knowledgeLoading = true
      logger.info('grade:' + this.gradeId + ', subjectId:' + this.subSubjectId)
      KnowledgeGetTree({
        gradeId: this.gradeId,
        subjectId: this.subSubjectId
      }).then((response) => {
        logger.info('KnowledgeGetTree response', response)
        this.knowledgeTree = response.result
        logger.info('knowledgeTree', this.knowledgeTree)
      }).finally(() => {
        this.knowledgeLoading = false
      })
    },

    handleSelectMainKnowledgeItem (knowledgeItem) {
      logger.info('handleSelectMainKnowledgeItem', knowledgeItem)
      if (knowledgeItem.id !== this.mainKnowledgeId) {
        this.mainKnowledgeId = knowledgeItem.id
        this.resetSubKnowledgeTags()
        this.knowledgeTreeChild = knowledgeItem.children
      }
    },

    resetSubKnowledgeTags () {
      this.knowledgeTreeChild = []
      this.showNewTagInput = false
      this.resetKnowledgeTags()
    },

    handleSelectSubKnowledgeItem (subKnowledgeItem) {
      logger.info('handleSelectSubKnowledgeItem', subKnowledgeItem)
      if (subKnowledgeItem.id !== this.subKnowledgeId) {
        this.subKnowledgeId = subKnowledgeItem.id
        this.resetKnowledgeTags()
        this.knowledgeTags = subKnowledgeItem.tags
        this.showNewTagInput = true
      }
    },

    resetKnowledgeTags () {
      this.knowledgeTags = []
    },

    handleSelectKnowledgeTag (knowledgeTag) {
      logger.info('handleSelectKnowledgeTag', knowledgeTag)
      if (this.selectedKnowledgeTags.indexOf(knowledgeTag.id) === -1) {
        this.selectedKnowledgeTags.push(knowledgeTag.id)
      } else {
        logger.info('before remove knowledgeTags', this.selectedKnowledgeTags, this.selectedKnowledgeTags.indexOf(knowledgeTag.id))
        this.selectedKnowledgeTags.splice(this.selectedKnowledgeTags.indexOf(knowledgeTag.id), 1)
        logger.info('after remove knowledgeTags', this.selectedKnowledgeTags)
      }
    },

    handleAddNewTag () {
      logger.info('handleAddNewTag', this.newTag)
      KnowledgeAddOrUpdateTag({
        knowledgeId: this.subKnowledgeId,
        name: this.newTag
      }).then(response => {
        logger.info('KnowledgeAddOrUpdateTag', response)
        this.getKnowledgeTree()
        this.newTag = ''
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.knowledge-tag-wrapper {
  border: @border-width-base solid #d9d9d9;
  box-sizing: border-box;
  overflow: hidden;
  height: 200px;
  width: 100%;

  .border-right {
    border-right: @border-width-base solid #d9d9d9;
    box-sizing: border-box;
  }

  .tag-select {
    height: 200px;
    .tag-label {
      height: 40px;
      line-height: 30px;
      background-color: #fafafa;
      color: rgba(0,0,0,.85);
      font-weight: 500;
      border-bottom: 1px solid #e8e8e8;
      padding: 5px 15px;
      overflow-wrap: break-word;
      text-align: center;
      box-sizing: border-box;
      border-bottom: @border-width-base solid #d9d9d9;
    }
    .tag-list-container {
      position: relative;
      height: 160px;
      overflow: scroll;
      text-align: center;
      .spin-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -20px;
        margin-left: -50px;
        width: 100px;
      }
      .tag-list {
        .tag-item {
          user-select: none;
          position: relative;
          transition: all 0.2s ease-in;
          line-height: 25px;
          color: @text-color;
          padding: 5px 15px;
          border-bottom: @border-width-base solid #eee;
          cursor: pointer;
          &:hover {
            background-color: fade(@outline-color, 10%);
          }

          .tag-more {
            position: absolute;
            right: 5px;
            top: 13px;
            font-size: 10px;
          }
        }
        .input-tag-item {
          padding: 0;
          margin: 0;
        }

        .active-item {
          background-color: fade(@outline-color, 20%);

          &:hover {
            background-color: fade(@outline-color, 20%);
          }
        }
      }

      .active {
        background-color: fade(@outline-color, 10%);
      }
    }
  }

  .subject-tree {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .main-subject, .sub-subject {
      width: 50%;
      .tag-item {
        user-select: none;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
      }
    }
  }

  .knowledge-tag-tree {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .main-knowledge, .sub-knowledge, .knowledge-tag {
      width: 33.333%;
      .tag-item {
        user-select: none;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
      }
      .input-tag-item {
        padding: 0;
        margin: 0;
      }
      .new-tag-input {
        outline: none;
        border: none;
      }
    }
  }
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
}
::-webkit-scrollbar-track {
  border-radius: 3px;
  background: rgba(0,0,0,0.06);
  -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgba(0,0,0,0.12);
  -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
}
</style>
