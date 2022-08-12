<template>
  <a-card :bordered="false">
    <div class="operator">
      <a-button @click="handleAdd" type="primary" icon="plus">Add Academic Year</a-button>
      <!-- <a-button type="primary" icon="download" @click="downloadTemplate">Download template</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false">
        <a-button type="primary" icon="import">Upload</a-button>
      </a-upload> -->
    </div>
    <TermAdd ref="modalForm" @ok="loadData" />
  </a-card>
</template>

<script>
import TermAdd from './TermAdd.vue'

export default {
  name: 'Term',
  mixins: [],
  components: {
    TermAdd
  },
  data() {
    return {}
  },
  created() {
    this.loadData()
  },
  computed: {},
  methods: {
    async loadData() {
      this.loading = true
      this.loading = false
    },
    handleAdd: function() {
      this.$refs.modalForm.show()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
