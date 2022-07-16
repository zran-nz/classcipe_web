<template>
  <a-drawer
    class='cc-content-preview-drawer'
    :visible='true'
    :closable='false'
    :title='null'
    width='50%'
    :bodyStyle="{ height: '100%' }"
    @close='handleClose'
  >
    <div class='content-preview'>
      <content-preview-detail v-bind='$attrs' @close='handleClose'/>
    </div>
  </a-drawer>
</template>

<script>

export default {
  name: 'ContentPreview',
  components: {
    ContentPreviewDetail: () => import('@/components/Preview/ContentPreviewDetail')
   },
  data() {
    return {
    }
  },
  methods: {
    handleClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.content-preview {
  height: 100vh;
  width: 100%;
  .preview-iframe {
    height: 100vh;
    width: 100%;
    border: none;
    outline: none;
  }
}
</style>
