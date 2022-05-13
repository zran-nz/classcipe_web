<template>
  <div class='rubric'>
    {{assessment}}
  </div>
</template>

<script>
export default {
  name: 'Rubric',
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
