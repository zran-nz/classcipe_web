<template>
  <div class='split-task'>
    SplitTask {{ taskId }}
  </div>
</template>

<script>
export default {
  name: 'SplitTask',
  props: {
    taskId: {
      type: String,
      default: null
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
