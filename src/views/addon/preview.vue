<template>

  <div>
    <div class="preview-wrapper">
      <div class="preview-detail">
        <main-task-preview :task-id="taskId" :can-edit="false" />
      </div>
    </div>
  </div>

</template>

<script>

import MainTaskPreview from '../../components/Task/MainTaskPreview'

export default {
  name: 'TaskPreview',
  components: {
    MainTaskPreview
  },
  props: {
    taskId: {
      type: String,
      default: null
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
  .preview-detail{
    width: 800px;
    /*margin: 0 auto;*/
  }
</style>
