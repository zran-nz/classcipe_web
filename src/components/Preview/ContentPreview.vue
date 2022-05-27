<template>
  <div class='content-preview'>
    <iframe :src="iframeSrc" class='preview-iframe'></iframe>
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
    return {
      iframeSrc: null
    }
  },
  created() {
  },
  methods: {}
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.content-preview {
  .preview-iframe {
  }
}
</style>
