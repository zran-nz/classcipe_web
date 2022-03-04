<template>
  <a-card :loading='loading'>
    <div class='set-tag'>

    </div>
  </a-card>
</template>

<script>
export default {
  name: 'SetTag',
  props: {
    selectedTags: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      loading: true
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
