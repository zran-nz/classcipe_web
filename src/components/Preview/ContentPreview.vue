<template>
  <div class='content-preview'>
    {{ content }}
  </div>
</template>

<script>
export default {
  name: 'ContentPreview',
  props: {
    content: {
      type: Object,
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
