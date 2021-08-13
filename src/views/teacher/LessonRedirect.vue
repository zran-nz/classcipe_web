<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%', minHeight: '500px' }">
    <a-spin class="redirect-spin" tip="Loading..." size="large"/>
  </a-card>
</template>

<script>
import { LessonAddOrUpdate } from '@/api/myLesson'
export default {
  name: 'LessonRedirect',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    lessonId: null
  },
  created () {
    this.$logger.info('Lesson redirecting ' + this.lessonId)
    if (this.lessonId) {
      this.$router.replace('/teacher/add-lesson/' + this.lessonId)
    } else {
      const data = {
        name: null,
        status: 0
      }

      LessonAddOrUpdate(data).then((response) => {
        this.$logger.info('LessonAddOrUpdate response', response.result)
        if (response.success) {
          this.$router.replace('/teacher/add-lesson/' + response.result.id)
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
