<template>
  <div class='slide-drift'>
    <div class='slide-item' v-for='slide in displaySelectedTemplateList' :key='slide.id'>
      <slide-viewer
        :title='slide.name'
        :show-hover-mask='true'
        :show-title='true'
        :show-arrow='true'
        :slide-item='slide'
        :show-add-button='false'
        :show-remove-button='true'
        :default-thumbnail-list='slide.thumbnailList'/>
    </div>
  </div>
</template>

<script>
import SlideViewer from '@/components/PPT/SlideViewer'
export default {
  name: 'SlideTemplate',
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
    this.$logger.info('SlideTemplate created ', this.displaySelectedTemplateList)
  },
  computed: {
    displaySelectedTemplateList () {
      const list = []
      this.selectedTemplateList.forEach(item => {
        item.thumbnailList = []
        for (let i = 0; i < item.images.length; i++) {
          item.thumbnailList.push({
            contentUrl: item.images[i],
            id: item.pageObjectIds[i]
          })
        }
        list.push(item)
      })

      return list
    }
  },
  methods: {
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
  width: 100%;

  .slide-item {
    width: 30%;
    margin-right: 3%;
    margin-bottom: 10px;
  }
}
</style>
