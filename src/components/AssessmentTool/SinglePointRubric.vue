<template>
  <div class='single-point-rubric'></div>
</template>

<script>
export default {
  name: 'SinglePointRubric',
  props: {
    assessment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {}
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
