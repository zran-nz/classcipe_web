<template>
  <div class='slide-drift'>
    <div class='slide-item' v-for='slide in selectedTemplateList' :key='slide.id'>
      <slide-viewer
        :title='slide.name'
        :show-hover-mask='true'
        :show-title='true'
        :show-arrow='true'
        :slide-item='slide'
        :show-add-button='false'
        :show-remove-button='true'
        @remove='handleRemoveTemplate'
        :default-thumbnail-list='slide.thumbnailList'/>
    </div>
  </div>
</template>

<script>
import SlideViewer from '@/components/PPT/SlideViewer'
export default {
  name: 'SlideDrift',
  components: { SlideViewer },
  props: {
    selectedTemplateList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {
    handleRemoveTemplate (slideItem) {

    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.slide-drift {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 10px;

  .slide-item {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
