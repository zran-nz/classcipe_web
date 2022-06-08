<template>
  <a-drawer
    class='cc-content-preview-drawer'
    :visible='true'
    :title='null'
    width='700px'
    :bodyStyle="{ padding: 0, height: '100%' }"
    @close='handleClose'
  >
    <div class='content-preview'>
      <content-preview-detail
        :content-type='contentType'
        :content-id='contentId' />
    </div>
  </a-drawer>
</template>

<script>

import ContentPreviewDetail from '@/components/Preview/ContentPreviewDetail'

export default {
  name: 'ContentPreview',
  components: { ContentPreviewDetail },
  props: {
   contentId: {
     type: String,
     required: true
   },
   contentType: {
     type: Number,
     required: true
   }
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
