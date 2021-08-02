<template>
  <div class="relevant-tag-selector-wrapper">
    <div class="question-list">
      <!--      <div class="question-item" v-for="(question,index) in relevantQuestionList" :key="index" v-if="question.knowledgeTagList.length || question.skillTagList.tagList">-->
      <div class="question-item" v-for="(question,index) in relevantQuestionList" :key="index" >
        <div class="question">
          <a-checkbox @click="handleSelectQuestion(question)" :checked="selectedQuestionIdList.indexOf(question.questionId) !== -1">
            {{ question.questionName }}
          </a-checkbox>
        </div>
        <div class="item-list">
          <div class="item-item" v-for="(knowledgeItem,ki) in question.knowledgeTagList" :key="ki">
            <div class="item-name">
              <template v-if="selectedQuestionIdList.indexOf(question.questionId) !== -1">
                <a-checkbox @click="handleSelectKnowledge(knowledgeItem)" :checked="selectedKnowledgeTagIdList.indexOf(knowledgeItem.id) !== -1" class="relevant-checkbox">
                  {{ knowledgeItem.info.description }}
                </a-checkbox>
              </template>
              <template v-else>
                <span class="pure-name">
                  {{ knowledgeItem.info.description }}
                </span>
              </template>
            </div>
            <div class="item-tag-list">
              <div class="item-tag" v-for="(tag,ti) in knowledgeItem.tagList" :key="ti">
                <a-tag color="green" class="tag-item">{{ tag.name }}</a-tag>
              </div>
            </div>
          </div>
        </div>
        <div class="item-list">
          <div class="item-item" v-for="(skillItem, si) in question.skillTagList" :key="si">
            <div class="item-name">
              <template v-if="selectedQuestionIdList.indexOf(question.questionId) !== -1">
                <a-checkbox @click="handleSelectSkill(skillItem)" :checked="selectedSkillTagIdList.indexOf(skillItem.id) !== -1" class="relevant-checkbox">
                  {{ skillItem.info.description }}
                </a-checkbox>
              </template>
              <template v-else>
                <span class="pure-name">
                  {{ skillItem.info.description }}
                </span>
              </template>
            </div>
            <div class="item-tag-list">
              <div class="item-tag" v-for="(tag,ti) in skillItem.tagList" :key="ti">
                <a-tag color="green" class="tag-item">{{ tag.name }}</a-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RelevantTagSelector',
  props: {
    relevantQuestionList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selectedQuestionIdList: [],
      selectedQuestionList: [],
      selectedKnowledgeTagList: [],
      selectedKnowledgeTagIdList: [],
      selectedSkillTagList: [],
      selectedSkillTagIdList: []
    }
  },
  created () {
    this.$logger.info('RelevantTagSelector relevantQuestionList', this.relevantQuestionList)
  },
  methods: {
    handleSelectQuestion (item) {
      this.$logger.info('handleSelectQuestion', item)
      const index = this.selectedQuestionIdList.indexOf(item.questionId)
      const qIndex = this.selectedQuestionList.findIndex(q => q.questionId === item.questionId)
      if (index !== -1 && qIndex !== -1) {
        this.selectedQuestionIdList.splice(index, 1)
        this.selectedQuestionList.splice(qIndex, 1)

        // 批量删除选中的下级id
        item.knowledgeTagList.forEach(data => {
          const idIndex = this.selectedKnowledgeTagIdList.findIndex(item => item === data.id)
          const tagIndex = this.selectedKnowledgeTagList.findIndex(item => item.info.id === data.id)

          if (idIndex !== -1 && tagIndex !== -1) {
            this.selectedKnowledgeTagIdList.splice(idIndex, 1)
            this.selectedKnowledgeTagList.splice(tagIndex, 1)
          }
        })

        item.skillTagList.forEach(data => {
          const idIndex = this.selectedSkillTagIdList.findIndex(item => item === data.id)
          const tagIndex = this.selectedSkillTagList.findIndex(item => item.info.id === data.id)
          if (idIndex !== -1 && tagIndex !== -1) {
            this.selectedSkillTagIdList.splice(idIndex, 1)
            this.selectedSkillTagList.splice(tagIndex, 1)
          }
        })
      } else {
        this.selectedQuestionIdList.push(item.questionId)
        this.selectedQuestionList.push(item)
      }

      this.updateSelected()
    },

    handleSelectKnowledge (data) {
      this.$logger.info('handleSelectKnowledge', data)
      const idIndex = this.selectedKnowledgeTagIdList.findIndex(item => item === data.id)
      const tagIndex = this.selectedKnowledgeTagList.findIndex(item => item.info.id === data.id)
      if (idIndex !== -1 && tagIndex !== -1) {
        this.selectedKnowledgeTagIdList.splice(idIndex, 1)
        this.selectedKnowledgeTagList.splice(tagIndex, 1)
      } else {
        this.selectedKnowledgeTagIdList.push(data.id)
        this.selectedKnowledgeTagList.push(data)
      }
      this.updateSelected()
    },

    handleSelectSkill (data) {
      this.$logger.info('handleSelectSkill', data)
      const idIndex = this.selectedSkillTagIdList.findIndex(item => item === data.id)
      const tagIndex = this.selectedSkillTagList.findIndex(item => item.id === data.id)
      if (idIndex !== -1 && tagIndex !== -1) {
        this.selectedSkillTagIdList.splice(idIndex, 1)
        this.selectedSkillTagList.splice(tagIndex, 1)
      } else {
        this.selectedSkillTagIdList.push(data.id)
        this.selectedSkillTagList.push(data)
      }
      this.updateSelected()
    },

    updateSelected () {
      this.$logger.info('updateSelected', this.selectedQuestionList, this.selectedKnowledgeTagIdList, this.selectedSkillTagIdList)
      const questionList = []
      this.selectedQuestionList.forEach(item => {
        const qData = {
          id: item.questionId,
          name: item.questionName,
          knowledgeTags: [],
          skillTags: []
        }

        item.knowledgeTagList.forEach(kTag => {
          if (this.selectedKnowledgeTagIdList.indexOf(kTag.info.id) !== -1) {
            qData.knowledgeTags = qData.knowledgeTags.concat(kTag.tagList)
          }
        })

        item.skillTagList.forEach(sTag => {
          if (this.selectedSkillTagIdList.indexOf(sTag.info.id) !== -1) {
            qData.skillTags = qData.skillTags.concat(sTag.tagList)
          }
        })

        if (qData.knowledgeTags.length || qData.skillTags.length) {
          questionList.push(qData)
        }
      })
      this.$logger.info('updateSelected data', questionList)
      this.$emit('update-selected', { questionList: questionList })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
  .relevant-tag-selector-wrapper {
    display: flex;
    flex-direction: row;
    .question-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      .question-item {
        width: 100%;
        display: flex;
        flex-direction: column;
        border: 1px solid #eee;
        padding: 10px;
        margin-bottom: 5px;
        .question {
          display: flex;
          flex-direction: row;
          font-weight: 500;
          font-size: 15px;
          padding: 5px;
        }
        .item-list {
          display: flex;
          flex-direction: column;
          .item-item {
            user-select: none;
            display: flex;
            flex-direction: row;
            margin-bottom: 8px;
            padding-left: 5px;
            &:hover {
              background-color: fade(@outline-color, 10%);

              .item-tag-list {
                background: none;
              }
            }

            .item-name {
              width: 50%;
              display: flex;
              align-items: center;

              .pure-name {
                padding-left: 24px;
                padding-right: 8px;
              }

              .relevant-checkbox {
                display: flex;
                flex-direction: row;
                align-items: center;
              }
            }

            .item-tag-list {
              width: 50%;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              background-color: #f9f9f9;
              padding: 6px;

              .tag-item {
                width: auto;
                display: block;
                white-space: pre-wrap;
                word-wrap: break-word;
                overflow: hidden;
                border-radius: 10px;
                word-break: normal;
              }
            }
          }
        }
      }
    }
  }
</style>
