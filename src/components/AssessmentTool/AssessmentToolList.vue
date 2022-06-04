<template>
  <div class='assessment-tool-list-wrapper'>
    <div class='assessment-tool-list'>
      <div class='assessment-preview-item' v-for='(assessment, idx) in assessmentList' :key='idx' @click='selectAssessment(assessment)' v-show='assessment.assessmentToolPreviewImgBase64'>
        <div class='item-type-icon'>
          <img src="~@/assets/icons/lesson/selected.png" v-if='selectedAssessmentList.indexOf(assessment) !== -1' />
          <div class="empty-circle" v-if='selectedAssessmentList.indexOf(assessment) === -1'></div>
        </div>
        <div class='assessment-preview-img'>
          <div class='title'>{{ assessment.title || 'Untitled' }}</div>
          <img :src='assessment.assessmentToolPreviewImgBase64' alt='assessment-tool' />
        </div>
      </div>
      <div class='no-data' v-if='assessmentList.length === 0'>
        <common-no-data v-if='!loading'/>
        <a-skeleton v-if='loading' />
      </div>
    </div>
    <div class='assessment-tool-action'>
      <div class='action-item'>
        <a-space>
          <a-button @click='handleCancelSelect'>
            Cancel
          </a-button>
          <a-button type='primary' @click='handleConfirmSelect' :disabled='assessmentList.length === 0 || selectedAssessmentList.length === 0 || inserting' :loading='inserting'>
            <a-icon type='plus-circle' />
            Confirm
          </a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script>
import { AssessmentToolInfoList } from '@/api/v2/assessment'
import CommonNoData from '@/components/Common/CommonNoData'

export default {
  name: 'AssessmentToolList',
  components: { CommonNoData },
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      inserting: false,
      loading: true,
      assessmentList: [],
      selectedAssessmentList: []
    }
  },
  created() {
    this.loadAssessmentToolList()
  },
  methods: {
    loadAssessmentToolList () {
      this.loading = true
      this.assessmentList = []
      AssessmentToolInfoList({
        pageNo: 1,
        pageSize: 100
      }).then(res => {
        if (res.code === 0) {
          this.assessmentList = res.result.records
        }
      }).finally(() => {
        this.loading = false
      })
    },

    selectAssessment (assessment) {
      if (this.selectedAssessmentList.indexOf(assessment) === -1) {
        this.selectedAssessmentList.push(assessment)
      } else {
        this.selectedAssessmentList.splice(this.selectedAssessmentList.indexOf(assessment), 1)
      }
    },

    handleCancelSelect () {
      this.selectedAssessmentList = []
      this.$emit('cancel-select')
    },

    handleConfirmSelect () {
      this.$logger.info('handleConfirmSelect', this.selectedAssessmentList)
      this.inserting = true
      this.$emit('confirm-select', this.selectedAssessmentList)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.assessment-tool-list-wrapper {
  position: relative;
  .assessment-tool-list {
    min-height: 300px;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 10px;
    .assessment-preview-item {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      position: relative;
      margin-bottom: 10px;

      .item-type-icon {
        padding-top: 5px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        width: 30px;
        .empty-circle {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          border: 2px solid #ccc;
        }

        img {
          width: 20px;
          height: 20px;
        }
      }

      .assessment-preview-img {
        width: 100%;
        font-weight: bold;
        line-height: 30px;
        color: #15C39A;
        img {
          width: 100%;
        }
      }
    }

    .no-data {
      min-height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
    }
  }
  .assessment-tool-action {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
