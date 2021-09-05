<template>
  <div class="relevant-tag-selector-wrapper">
    <div class="question-list">
      <!--      <div class="question-item" v-for="(question,index) in relevantQuestionList" :key="index" v-if="question.knowledgeTagList.length || question.skillTagList.tagList">-->
      <div class="question-item" v-for="(question,index) in relevantQuestionList" :key="index" >
        <div v-if="question.questionId" @click="handleSelectQuestion(question)" :class="{'question': true, 'checked-item': selectedQuestionIdList.indexOf(question.questionId) !== -1}">
          <div class="content-text">
            {{ question.questionName ? question.questionName : 'Unnamed question' }}
          </div>
          <div class="selected-icon">
            <a-icon type="check-circle" theme="filled" v-if="selectedQuestionIdList.indexOf(question.questionId) !== -1" />
          </div>
        </div>
        <div class="item-list">
          <div :class="{'item-item': true, 'checked-item': selectedKnowledgeTagIdList.indexOf(knowledgeItem.id) !== -1}" @click="handleSelectKnowledge(knowledgeItem)" v-for="(knowledgeItem,ki) in question.knowledgeTagList" :key="ki">
            <div class="item-name">
              <div class="content-text">
                {{ knowledgeItem.info.description ? knowledgeItem.info.description : 'Unnamed description' }}
              </div>
              <div class="selected-icon">
                <a-icon type="check-circle" theme="filled" v-if="selectedKnowledgeTagIdList.indexOf(knowledgeItem.id) !== -1" />
              </div>
            </div>
          </div>
        </div>
        <div class="item-list">
          <div :class="{'item-item': true, 'checked-item': selectedSkillTagIdList.indexOf(skillItem.id) !== -1}" @click="handleSelectSkill(skillItem)" v-for="(skillItem, si) in question.skillTagList" :key="si">
            <div class="item-name">
              <div class="content-text">
                {{ skillItem.info.description ? skillItem.info.description : 'Unnamed description' }}
              </div>
              <div class="selected-icon">
                <a-icon type="check-circle" theme="filled" v-if="selectedSkillTagIdList.indexOf(skillItem.id) !== -1" />
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

        questionList.push(qData)
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
        margin-bottom: 20px;
        .question {
          margin-bottom: 15px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          font-weight: 500;
          font-size: 15px;
          padding: 5px;
          background: #fff;
          border: 1px solid #fff;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          border-radius: 5px;

          align-items: center;
          .content-text {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            padding: 10px;
          }

          .selected-icon {
            width: 40px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
          }
        }

        .checked-item {
          color: #15C39A;
          background: rgba(21, 195, 154, 0.1);
          border: 1px solid #15C39A;
          font-family: Inter-Bold;
          color: #15C39A;
        }

        .item-list {
          padding-left: 30px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          .item-item {
            margin-bottom: 15px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            font-weight: 500;
            font-size: 15px;
            padding: 5px;
            background: #fff;
            border: 1px solid #fff;
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
            border-radius: 5px;

            align-items: center;

            .item-name {
              user-select: none;
              font-family: Inter-Bold;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            }

            .content-text {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
              padding: 10px;
            }

            .selected-icon {
              width: 40px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              color: #15C39A;
            }
          }

          .checked-item {
            color: #15C39A;
            background: rgba(21, 195, 154, 0.1);
            border: 1px solid #15C39A;
            font-family: Inter-Bold;
            color: #15C39A;
          }
        }
      }
    }
  }
</style>
