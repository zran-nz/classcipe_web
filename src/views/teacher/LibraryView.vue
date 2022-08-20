<template>
  <div class='library-view'>
    <div class='header-title vertical-left'>
      <div class='back-icon' @click='goBack'>
        <a-icon type="left" /> Back
      </div>
    </div>
    <div class='preview-detail-page'>
      <content-preview-detail
        :content-id='contentId'
        :content-type='contentType'
        :display-fixed-header='false'
      />
    </div>
  </div>
</template>

<script>
import ContentPreviewDetail from '@/components/Preview/ContentPreviewDetail'
export default {
  name: 'LibraryView',
  components: { ContentPreviewDetail },
  props: {
    contentId: {
      type: String,
      required: true
    },
    contentType: {
      type: String,
      required: true
    }
  },
  methods: {
    goBack () {
      this.$router.replace({
        path: '/teacher/library'
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";
.library-view {

  .header-title {
    padding: 15px;
    background-color: #fff;
    user-select: none;
    cursor: pointer;
  }
  .preview-detail-page {
    margin: 10px auto;
    max-width: 1000px;
    background-color: #fff;
  }
}
</style>
