<template>
  <div class="skill-wrapper">
    <div class="tag-list-show">
      <a-row v-for="(skillTag,index) in selectedSkillTags" :key="index" class="tag-line">
        <a-col span="5" class="tag-name-col">
          <span class="tag-name tag-show-item">
            <a-icon type="tag" class="tag-name-icon"/>
            <a-tooltip placement="top">
              <template slot="title">{{ skillTag.name }}</template>
              {{ skillTag.name }}
            </a-tooltip>
          </span>
        </a-col>
        <a-col span="17" class="tag-name-col">
          <span class="tag-description  tag-show-item">
            {{ skillTag.description }}
          </span>
        </a-col>
        <a-col span="2" class="tag-action-col">
          <span class="tag-action">
            <a-icon type="delete" @click="handleDeleteTag(skillTag)"/>
          </span>
        </a-col>
      </a-row>
    </div>
    <div class="skill-tag-wrapper">
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
        <a-col span="21">
          <div class="tag-select grade-select">
            <div class="tag-label">
              {{ $t('teacher.add-unit-plan.skill-tags') }}
            </div>
            <div class="skill-tag-tree">
              <div class="main-skill border-right">
                <div class="tag-list-container">
                  <div class="tag-list" v-show="!skillLoading">
                    <div :class="{'tag-item': true, 'active-item': mainSkillId === skillItem.id}" v-for="(skillItem,index) in skillTree" :key="index" @click="handleSelectMainSkillItem(skillItem)">
                      <a-tooltip placement="leftTop">
                        <template slot="title">  {{ skillItem.name }}</template>
                        {{ skillItem.name }}
                      </a-tooltip>
                      <a-icon type="right" class="tag-more" v-if="skillItem.children.length"/>
                    </div>
                  </div>
                  <a-spin v-show="skillLoading" class="spin-loading"/>
                </div>
              </div>
              <div class="sub-skill border-right">
                <div class="tag-list-container">
                  <div class="tag-list">
                    <div :class="{'tag-item': true, 'active-item': subSkillId === subSkillItem.id}" v-for="(subSkillItem,index) in skillTreeChild" :key="index" @click="handleSelectSubSkillItem(subSkillItem)">
                      <a-tooltip placement="leftTop">
                        <template slot="title">{{ subSkillItem.name }}</template>
                        {{ subSkillItem.name }}
                      </a-tooltip>
                      {{ subSkillItem.name }}
                      <a-icon type="right" class="tag-more" v-if="subSkillItem.children.length"/>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grand-sub-skill border-right">
                <div class="tag-list-container">
                  <div class="tag-list">
                    <div :class="{'tag-item': true, 'active-item': grandSubSkillId === grandSubSkillItem.id}" v-for="(grandSubSkillItem,index) in skillTreeGrandChild" :key="index" @click="handleSelectGrandSubSkillItem(grandSubSkillItem)">
                      <a-tooltip placement="leftTop">
                        <template slot="title">{{ grandSubSkillItem.name }}</template>
                        {{ grandSubSkillItem.name }}
                      </a-tooltip>
                      {{ grandSubSkillItem.name }}
                      <a-icon type="right" class="tag-more" v-if="grandSubSkillItem.tags.length"/>
                    </div>
                  </div>
                </div>
              </div>
              <div class="skill-tag">
                <div class="tag-list-container">
                  <div class="tag-list" v-show="!loadingSkill">
                    <div class="tag-item input-tag-item" v-show="showNewTagInput">
                      <a-input :placeholder="$t('teacher.add-unit-plan.input-new-tag')" v-model="newTag" class="new-tag-input" @keyup.enter="handleAddNewTag"/>
                    </div>
                    <div :class="{'tag-item': true, 'active-item': selectedSkillTagIdList.indexOf(skillTag.id) !== -1}" v-for="(skillTag,index) in skillTags" :key="index" @click="handleSelectSkillTag(skillTag)">
                      <a-tooltip placement="leftTop">
                        <template slot="title">{{ skillTag.name }}</template>
                        {{ skillTag.name }}
                      </a-tooltip>
                      <a-icon type="check" class="tag-more" v-if="selectedSkillTagIdList.indexOf(skillTag.id) !== -1"/>
                    </div>
                  </div>
                  <a-spin v-show="loadingSkill" class="spin-loading"/>
                </div>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { SkillAddOrUpdateTag, SkillGetTreeByGradeId, SkillQueryTagsBySkillId } from '@/api/skill'

export default {
  name: 'SkillTag',
  props: {
    questionIndex: {
      type: String,
      default: ''
    },
    gradeList: {
      type: Array,
      default: () => []
    },
    defaultGradeId: {
      type: String,
      default: ''
    },
    selectedSkillTags: {
      type: Array,
      default: () => []
    }
  },
  mounted () {
  },
  data () {
    return {
      gradeId: '',

      mainSkillId: '',
      subSkillId: '',
      grandSubSkillId: '',
      skillTree: [],
      skillTreeChild: [],
      skillTreeGrandChild: [],
      skillTags: [],
      selectedSkillTagIdList: [],
      skillLoading: false,

      newTag: '',
      showNewTagInput: false,
      loadingSkill: false,
      tagObjData: {},
      currentGrandSubSkill: { }
    }
  },
  created () {
    this.gradeId = this.defaultGradeId
    this.selectedSkillTagIdList = this.selectedSkillTags.map(skillTag => skillTag.id)
  },
  methods: {
    handleSelectGrade (grade) {
      logger.info('handleSelectGrade', grade)
      this.gradeId = grade.id
      this.resetSkill()
      this.getSkillTree()
    },

    checkSelectGrade () {
      if (!this.gradeId) {
        this.$message.warn(this.$t('teacher.add-unit-plan.select-grade-first'))
      }
      return !!this.gradeId
    },

    resetSkill () {
      this.mainSkillId = ''
      this.subSkillId = ''
      this.grandSubSkillId = ''
      this.skillTree = []
      this.skillTreeChild = []
      this.skillTreeGrandChild = []
      this.skillTags = []
      this.showNewTagInput = false
    },

    getSkillTree () {
      this.skillLoading = true
      logger.info('grade:' + this.gradeId)
      SkillGetTreeByGradeId({
        gradeId: this.gradeId
      }).then((response) => {
        logger.info('getSkillTree response', response)
        this.skillTree = response.result
        logger.info('skillTree', this.skillTree)
      }).finally(() => {
        this.skillLoading = false
      })
    },

    handleSelectMainSkillItem (skillItem) {
      logger.info('handleSelectMainSkillItem', skillItem)
      if (skillItem.id !== this.mainSkillId) {
        this.resetSubSkillTags()
        this.mainSkillId = skillItem.id
        this.skillTreeChild = skillItem.children
      }
    },

    resetSubSkillTags () {
      this.subSkillId = ''
      this.grandSubSkillId = ''
      this.skillTreeChild = []
      this.skillTreeGrandChild = []
      this.skillTags = []
      this.showNewTagInput = false
    },

    handleSelectSubSkillItem (subSkillItem) {
      logger.info('handleSelectSubSkillItem', subSkillItem)
      if (subSkillItem.id !== this.subSkillId) {
        this.resetGrandSubSkillTags()
        this.subSkillId = subSkillItem.id
        this.skillTreeGrandChild = subSkillItem.children
        this.showNewTagInput = false
      }
    },

    resetGrandSubSkillTags () {
      this.grandSubSkillId = ''
      this.skillTreeGrandChild = []
      this.skillTags = []
      this.showNewTagInput = false
    },

    handleSelectGrandSubSkillItem (grandSubSkillItem) {
      logger.info('handleSelectGrandSubSkillItem', grandSubSkillItem)
      if (grandSubSkillItem.id !== this.mainSkillId) {
        this.resetSkillTags()
        this.grandSubSkillId = grandSubSkillItem.id
        this.skillTags = []
        this.currentGrandSubSkill = grandSubSkillItem
        this.refreshSkillTags()
      }
    },

    resetSkillTags () {
      this.skillTags = []
      this.showNewTagInput = true
    },

    handleSelectSkillTag (skillTag) {
      logger.info('handleSelectSkillTag', skillTag)
      if (this.selectedSkillTagIdList.indexOf(skillTag.id) === -1) {
        this.$set(this.tagObjData, skillTag.id, Object.assign({}, this.currentGrandSubSkill))
        this.selectedSkillTagIdList.push(skillTag.id)
        this.$emit('add-skill-tag', {
          questionIndex: this.questionIndex,
          id: skillTag.id,
          name: skillTag.name,
          description: this.currentGrandSubSkill.name
        })
        logger.info('tagObjData', this.tagObjData)
      } else {
        logger.info('before remove skillTags', this.selectedSkillTagIdList, this.selectedSkillTagIdList.indexOf(skillTag.id))
        this.selectedSkillTagIdList.splice(this.selectedSkillTagIdList.indexOf(skillTag.id), 1)
        this.$delete(this.tagObjData, skillTag.id)
        this.$emit('remove-skill-tag', {
          questionIndex: this.questionIndex,
          id: skillTag.id
        })
        logger.info('tagObjData', this.tagObjData)
        logger.info('after delete skillTags', this.selectedSkillTagIdList)
      }
    },

    handleAddNewTag () {
      logger.info('handleAddNewTag', this.newTag)
      SkillAddOrUpdateTag({
        skillId: this.currentGrandSubSkill.id,
        name: this.newTag
      }).then(response => {
        logger.info('SkillAddOrUpdateTag', response)
        this.newTag = ''
        this.refreshSkillTags()
      })
    },

    refreshSkillTags () {
      this.loadingSkill = true
      logger.info('refreshSkillTags')
      SkillQueryTagsBySkillId({
        skillId: this.currentGrandSubSkill.id
      }).then(response => {
        logger.info('SkillQueryTagsBySkillId', response)
        this.skillTags = response.result
      }).finally(() => {
        this.loadingSkill = false
      })
    },

    handleDeleteTag (skillTag) {
      logger.info('handleDeleteTag', skillTag)
      if (this.selectedSkillTagIdList.indexOf(skillTag.id) !== -1) {
        logger.info('before delete skillTags', this.selectedSkillTagIdList, this.selectedSkillTagIdList.indexOf(skillTag.id))
        this.selectedSkillTagIdList.splice(this.selectedSkillTagIdList.indexOf(skillTag.id), 1)
        this.$delete(this.tagObjData, skillTag.id)
        this.$emit('remove-skill-tag', {
          questionIndex: this.questionIndex,
          id: skillTag.id
        })
        logger.info('tagObjData', this.tagObjData)
        logger.info('after delete skillTags', this.selectedSkillTagIdList)
      } else {
        logger.info('no found target delete skillTag', skillTag)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.skill-tag-wrapper {
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
            background-color: fade(@outline-color, 20%);
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
          background-color: fade(@outline-color, 10%);

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

  .skill-tag-tree {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .main-skill, .sub-skill, .grand-sub-skill, .skill-tag {
      width: 25%;
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

.tag-list-show {
  padding-bottom: 15px;
  .tag-line {
    transition: all 200ms ease-in;
    cursor: pointer;
    padding: 3px;
    line-height: 25px;
    color: @primary-color;
    text-decoration: underline;
    font-size: 14px;
    display: flex;
    align-items: center;

    &:hover {
      color:  @select-item-selected-color;
      background-color: fade(@outline-color, 15%);
    }

    .tag-show-item {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      font-size: 16px;
    }

    .tag-name-col {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
    }

    .tag-name-icon {
      padding-right: 5px;
    }

    .tag-action-col {
      text-align: right;
      position: relative;

      .tag-action {
        padding-right: 10px;
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
