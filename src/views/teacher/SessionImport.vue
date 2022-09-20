<template>
  <div class="task-content-select">
    <session-import-for-calendar
      :type="type"
      :startDate="startDate"
      :endDate="endDate"
      :classId="classId"
      :searchType="searchType"
      :source="source"
      @cancel='handleCancel'
      @ok="handleChoose"/>
  </div>
</template>

<script>
import SessionImportForCalendar from '@/components/MyContentV2/SessionImportForCalendar'
export default {
  name: 'SessionImport',
  components: {
    SessionImportForCalendar
  },
  props: {
    type: {
      type: Number,
      required: true
    },
    startDate: {
      type: String,
      default: ''
    },
    endDate: {
      type: String,
      default: ''
    },
    classId: {
      type: String,
      default: ''
    },
    searchType: {
      type: String,
      default: null
    },
    source: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  methods: {
    handleCancel() {
      if (window.history.length <= 1) {
        this.$router.push({ path: '/teacher/main/calendar' })
        return false
      } else {
        this.$router.go(-1)
      }
    },
    handleChoose() {

    }
  }
}
</script>

<style scoped lang="less">
.task-content-select {
  padding: 20px;
  height: 100vh;
  overflow: hidden;
  background: #fff;
  /deep/ .content-select {
    .content-select-title {
      font-size: 18px;
      height: 40px;
      line-height: 40px;
    }
    .content-select-wrap {
      height: calc(100vh - 110px);
      overflow: auto;
      padding: 10px 0;
      margin: 0;
      .content-select-left {
        padding: 20px;
      }
      .content-select-right {
        height: auto;
      }
    }
    .content-select-action {
      height: 30px;
    }
  }
}
</style>
