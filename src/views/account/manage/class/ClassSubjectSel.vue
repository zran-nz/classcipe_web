<template>
  <div>
    <a-modal
      v-model='selVis'
      destroyOnClose
      title='Subject Class Setting'
      width='1000px'
      @cancel='selVis = false'>
      <class-subject-add ref="classSubjectAdd" @save="handleSave" :id="formModel.id" :school="currentSchool"/>
    </a-modal>
  </div>
</template>

<script>

import ClassSubjectAdd from './ClassSubjectAdd'
export default {
  name: 'ClassSubjectSel',
  components: {
    ClassSubjectAdd
  },
  props: {
    school: {
      type: Object,
      default: () => {}
    },
    id: {
      type: String,
      default: ''
    }
  },
  watch: {
    school: {
      handler(val) {
        console.log(val)
        this.currentSchool = { ...val }
      },
      deep: true,
      immediate: true
    },
    id: {
      handler(val) {
        console.log(val)
        this.formModel.id = val
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      currentSchool: this.school,
      formModel: {
        id: ''
      },
      loading: false,
      selVis: false
    }
  },
  methods: {
    doCreate(record) {
      this.$refs.classSubjectAdd.doCreate(record)
    },
    doEdit(record) {
      this.$refs.classSubjectAdd.doEdit(record)
    },
    handleSave(params) {
      this.selVis = false
      this.$emit('save', params)
    }
  }
}
</script>

<style scoped lang="less">
.mb0 {
  margin-bottom: 0;
}
.calendar-con {
  height: 220px;
  /deep/ .schedule-content {
    height: 220px;
  }
  /deep/ .fc-bg-event {
    opacity: 1;
  }
}
.error_field {
  color: #ef4136;
}
</style>
