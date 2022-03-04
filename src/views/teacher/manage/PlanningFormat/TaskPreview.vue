<template>
  <div class='task-preview'>
    {{ $store.getters.formConfigPreviewData }}
  </div>
</template>

<script>
export default {
  name: 'TaskPreview',
  data () {
    return {
    }
  },
  created() {
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
