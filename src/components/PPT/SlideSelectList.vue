<template>
  <div class='slide-select-list'>
    <div class='slide-source-switch'>
      <a-radio-group default-value="Recommend" button-style="solid" class='cc-radio-group' v-model='filterSourceType' @change='handleSearchByFilter'>
        <a-radio-button :value="sourceType.Recommend">
          Recommend
        </a-radio-button>
        <a-radio-button :value="sourceType.SlideTemplate">
          Slide template
        </a-radio-button>
        <a-radio-button :value="sourceType.MyContent">
          My content
        </a-radio-button>
      </a-radio-group>
    </div>
    <div class='search-bar'>
      <content-filter @search='handleSearchByInputFilter'/>
    </div>
    <div class='slide-list'>
      <template v-if='searching'>
        <a-skeleton />
      </template>
      <template v-else>
        <template v-if='slideList.length'>
          <div class='slide-item' v-for='slide in slideList' :key='slide.id'>
            <slide-viewer
              :title='slide.name'
              :show-hover-mask='true'
              :show-title='true'
              :img-list='slide.images'
              :width="'300px'"
              :height="'180px'"/>
          </div>
        </template>
        <template v-if='slideList.length === 0'>
          <common-no-data />
        </template>
      </template>
    </div>
  </div>
</template>

<script>

import { FilterTemplates, recommendTemplates } from '@/api/template'
import CustomSearchInput from '@/components/Common/CustomSearchInput'
import ContentFilter from '@/components/MyContentV2/ContentFilter'
import CommonNoData from '@/components/Common/CommonNoData'
import SlideViewer from '@/components/PPT/SlideViewer'

const sourceType = {
  Recommend: 1,
  SlideTemplate: 2,
  MyContent: 3
}

export default {
  name: 'SlideSelectList',
  components: { SlideViewer, CommonNoData, ContentFilter, CustomSearchInput },
  props: {
    sourceId: {
      type: String,
      default: '1522782224384061441' // TODO 删除mock id
    }
  },
  data() {
    return {
      filterSourceType: sourceType.Recommend,
      sourceType: sourceType,
      slideList: [],
      searching: true
    }
  },
  created() {
    this.handleSearchSlide()
  },
  methods: {
    handleSearchByFilter (data) {
      this.handleSearchSlide()
    },

    handleSearchByInputFilter (data) {
      this.handleSearchSlide()
    },

    handleSearchSlide () {
      switch (this.filterSourceType) {
        case sourceType.Recommend:
          this.getRecommendSlide()
          break
        case sourceType.SlideTemplate:
          this.getTemplateSlide()
          break
        case sourceType.MyContent:
          this.getMyContentSlide()
          break
        default:
          break
      }
    },

    getRecommendSlide () {
      this.searching = true
      recommendTemplates({
        taskId: this.sourceId
      }).then(res => {
        this.$logger.info('recommendTemplates res', res)
        if (res && res.result) {
          this.slideList = res.result
        }
      }).finally(() => {
        this.searching = false
      })
    },
    getTemplateSlide () {
      this.searching = true
      FilterTemplates({}).then(res => {
        this.$logger.info('getTemplateSlide res', res)
        if (res && res.result) {
          this.slideList = res.result
        }
      }).finally(() => {
        this.searching = false
      })
    },
    getMyContentSlide () {

    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.search-bar {
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

.slide-list {
  height: calc(100vh - 280px);
  overflow-y: auto;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;

  .slide-item {
    margin: 0 20px 20px 0;
    border: 1px solid #E1E1E1;
    box-shadow: 0 1px 2px 0 rgba(65, 65, 65, 0.07);
  }
}

</style>
