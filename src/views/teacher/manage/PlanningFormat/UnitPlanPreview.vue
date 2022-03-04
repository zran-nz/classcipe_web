<template>
  <div class='unit-plan-preview'>
    {{ $store.getters.formConfigPreviewData }}
  </div>
</template>

<script>
export default {
  name: 'UnitPlanPreview',
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
