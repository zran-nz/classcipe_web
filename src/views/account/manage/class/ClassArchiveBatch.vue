<template>
  <a-modal
    v-model='selVis'
    destroyOnClose
    title='Class change confirm'
    :footer="null"
    width='500px'
    :confirmLoading="loading"
    @cancel='handleCancel'>
    <div>
      <label for="">
        All the classes under this curriculum will be cleared if you disable it, would you like to archive all the classes before you make the changes?
      </label>
      <a-divider style="width: auto;margin:24px -24px;"></a-divider>
      <a-space>
        <a-button @click="handleCancel">Cancel</a-button>
        <a-button type="primary" @click="handleArchive">Archive all classes</a-button>
        <a-button type="primary" @click="handleDelete">Disable and Clear data</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'ClassArchiveBatch',
  props: {
    school: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    school: {
      handler(val) {
        this.currentSchool = { ...val }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      currentSchool: this.school,
      model: {
        curriculumIds: [],
        gradeIds: [],
        subjectIds: [],
        curriculums: []
      },
      loading: false,
      selVis: false
    }
  },
  methods: {
    doCreate(cls) {
      this.loading = false
      this.model = { ...cls }
      this.selVis = true
    },
    handleCancel() {
      this.$emit('finish', null)
      this.selVis = false
    },
    handleArchive() {
      this.$emit('finish', this.model.curriculums)
      this.selVis = false
    },
    handleDelete() {
      this.$emit('finish', this.model.curriculums)
      this.selVis = false
    }
  }
}
</script>

<style scoped lang="less">

</style>
