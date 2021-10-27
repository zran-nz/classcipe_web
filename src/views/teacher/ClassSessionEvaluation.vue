<template>
  <div class="my-full-form-wrapper">
    <div class="form-header">
      <common-form-header
        ref="commonFormHeader"
        :form="form"
        :showCollaborate="false"
        :last-change-saved-time="lastChangeSavedTime"
        @update-form="handleUpdateForm"
        @back="goBack"
        @save="handleSaveEvaluation"
        @publish="handlePublishEvaluation"
      />
    </div>
    <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }" :loading="loading" >
      {{ form }}
    </a-card>
  </div>
</template>

<script>

import { formatLocalUTC } from '@/utils/util'
import RubricOne from '@/components/Evaluation/RubricOne'
import CommonFormHeader from '@/components/Common/CommonFormHeader'

export default {
  name: 'ClassSessionEvaluation',
  components: {
    RubricOne,
    CommonFormHeader
  },
  props: {
    taskId: {
      type: String,
      required: true
    },
    classId: {
      type: String,
      required: true
    }
  },
  computed: {
    lastChangeSavedTime () {
      const time = this.form.updateTime || this.form.createTime
      if (time) {
        return formatLocalUTC(this.form.updateTime || this.form.createTime)
      } else {
        return ''
      }
    }
  },
  data () {
    return {
      loading: true,
      isExistFormTable: false, // 是否已经添加过表格

      form: { // 基础表单数据
        name: 'Untitled Evaluation',
        updateTime: '2021-10-28 12:43:12',
        className: 'class6',
        createBy: 'yangxunwu@gmail.com'
      },
      formTableData: [], // 评估表格数据
      classGroup: [
        {
          groupId: 1,
          groupName: '小组1',
          selectedStatus: false,
          groupStudents: [
            {
              studentName: 'xunwu',
              studentAvatar: '',
              alreadyEvaluatedFormTable: [] // 已经评估过了的表格的
            }
          ]
        }
      ] // 班级分组信息
    }
  },
  created () {
    this.$logger.info('created ClassSessionEvaluation classId' + this.classId + ' taskId ' + this.taskId)
    this.loadEvaluationData()
  },
  methods: {
    loadEvaluationData () {
      this.$logger.info('loadEvaluationData')
      // TODO Evaluation 根据当前的taskId、班级classId查询对应的评估数据：班级分组、评估表单数据、自评他评数据
      this.loading = false
    },
    goBack () {
      if (window.history.length <= 1) {
        this.$router.push({ path: '/teacher/main/created-by-me' })
        return false
      } else {
        this.$router.go(-1)
      }

      setTimeout(() => {
        this.$router.push({ path: '/teacher/main/created-by-me' })
      }, 500)
    },
    handleSaveEvaluation () {},
    handlePublishEvaluation () {},

    // 修改表头数据处理
    handleUpdateForm (data) {
      this.$logger.info('handleUpdateForm', data)
      this.form.name = data.name
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

</style>
