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
        :is-library="isLibrary"
        :school-resource="schoolResource"
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
  computed: {
    isLibrary() {
      if (location.href.indexOf('library-view') > 0) {
        return true
      }
      return false
    },
    // feature分类下他人发布的，register他人在个人身份下发布，复用library 下的preview页面；他人在学校身份下发布，复用school resource下的preview页面
    schoolResource() {
      if (location.href.indexOf('resource-view') > 0) {
        return true
      }
      return false
    }
  },
  methods: {
    goBack() {
      if (window.history.length <= 1) {
        this.$router.replace({
          path: '/teacher/library'
        })
        return false
      } else {
        this.$router.go(-1)
      }
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
