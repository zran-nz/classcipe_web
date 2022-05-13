<template>
  <div class='check-list'></div>
</template>

<script>
export default {
  name: 'CheckList',
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
