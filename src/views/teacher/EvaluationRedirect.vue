<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-spin class="redirect-spin" tip="Loading..." size="large"/>
  </a-card>
</template>

<script>

import { EvaluationAddOrUpdate } from '@/api/evaluation'

export default {
  name: 'EvaluationRedirect',
  props: {
    evaluationId: {
      type: String,
      default: null
    }
  },
  created () {
    this.$logger.info('Evaluation Redirect ' + this.evaluationId)
    if (this.evaluationId) {
      this.$router.replace('/teacher/add-evaluation/' + this.evaluationId)
    } else {
      const data = {
        name: 'Unnamed evaluation',
        selfType: 0,
        status: 0,
        tableMode: 0
      }

     EvaluationAddOrUpdate(data).then((response) => {
        this.$logger.info('EvaluationAddOrUpdate response', response.result)
        if (response.success) {
          this.$router.replace('/teacher/add-evaluation/' + response.result.id + '/create')
        } else {
          this.$message.error(response.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.redirect-spin {
  position: absolute;
  top: 40%;
  left: 50%;
  margin-left: -20px;
}
</style>
