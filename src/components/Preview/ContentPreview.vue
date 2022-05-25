<template>
  <div class='content-preview'>
    <preview-slide-carousel v-bind='$attrs' />
    <preview-content-header v-bind='$attrs' />
    <preview-content-body v-bind='$attrs' />
    <preview-learning-objectives v-bind='$attrs' />
    <preview-sub-tasks v-bind='$attrs' />
    <preview-original-tips v-bind='$attrs' />
    <preview-linked-content v-bind='$attrs' />
    <review-star v-bind='$attrs' />
    <review-comment-list v-bind='$attrs' />
    <preview-recommend v-bind='$attrs' />
  </div>
</template>

<script>

import PreviewSlideCarousel from '@/components/Preview/PreviewSlideCarousel'
import PreviewContentHeader from '@/components/Preview/PreviewContentHeader'
import PreviewContentBody from '@/components/Preview/PreviewContentBody'
import PreviewLearningObjectives from '@/components/Preview/PreviewLearningObjectives'
import PreviewSubTasks from '@/components/Preview/PreviewSubTasks'
import PreviewOriginalTips from '@/components/Preview/PreviewOriginalTips'
import PreviewLinkedContent from '@/components/Preview/PreviewLinkedContent'
import ReviewStar from '@/components/Preview/ReviewStar'
import ReviewCommentList from '@/components/Preview/ReviewCommentList'
import PreviewRecommend from '@/components/Preview/PreviewRecommend'
export default {
  name: 'ContentPreview',
  components: { PreviewRecommend, ReviewCommentList, ReviewStar, PreviewLinkedContent, PreviewOriginalTips, PreviewSubTasks, PreviewLearningObjectives, PreviewContentBody, PreviewContentHeader, PreviewSlideCarousel },
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
