<template>
  <div></div>

</template>

<script>

export default {
  name: 'TagSetting',
  components: {
  },
  props: {
    treeItemData: {
      type: Object,
      default: null
    }
  },
  data () {
    return {

    }
  },
  computed: {
  },
  created () {
    this.loadingTree = true
    // TagTree().then((response) => {
    //   this.$logger.info('TagTree response', response.result)
    //   if (response.success) {
    //     this.treeItemData = response.result
    //   } else {
    //     this.$message.error(response.message)
    //   }
    //   this.loadingTree = false
    // })
  },
  mounted () {
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";

</style>
