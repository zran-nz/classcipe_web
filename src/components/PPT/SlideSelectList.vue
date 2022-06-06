<template>
  <div class='slide-select-list'>
    <div class='slide-source-switch'>
      <a-select
        :getPopupContainer="trigger => trigger.parentElement"
        placeholder='Curriculum'
        v-model='filterSourceType'
        @change='handleSearchByFilter'
        class='cc-select cc-lo-select-mid'>
        <a-select-option :value="sourceType.Recommend">
          Recommend
        </a-select-option>
        <a-select-option :value="sourceType.SlideTemplate">
          Slide template
        </a-select-option>
        <a-select-option :value="sourceType.MyContent">
          My content
        </a-select-option>
      </a-select>
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
          <div class='slide-item' :class="{'selected-template': selectedPresentationIdList.indexOf(slide.presentationId) !== -1}" v-for='slide in slideList' :key='slide.id'>
            <slide-viewer
              :title='slide.name'
              :show-hover-mask='true'
              :show-title='true'
              :show-arrow='true'
              :slide-item='slide'
              :show-remove-button='selectedPresentationIdList.indexOf(slide.presentationId) !== -1'
              :show-add-button='selectedPresentationIdList.indexOf(slide.presentationId) === -1'
              :default-thumbnail-list='slide.thumbnailList'/>
            <img src="~@/assets/icons/lesson/selected.png" class='selected-icon'/>
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
import { FindMyContent } from '@/api/teacher'
import { mapState } from 'vuex'

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
      required: true
    },
    selectedTemplateList: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    selectedPresentationIdList () {
      return this.selectedTemplateList.map(item => item.presentationId)
    },
    ...mapState({
      school: state => state.user.school
    })
  },
  data() {
    return {
      filterSourceType: sourceType.Recommend,
      sourceType: sourceType,
      slideList: [],
      searching: true,

      filterParams: null,
      filterType: null,

      pageNo: 1,
      pagination: {
        onChange: page => {
          this.pageNo = page
          this.getMyContentSlide()
        },
        showTotal: total => `Total ${total} items`,
        total: 0,
        pageSize: 16
      }
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
      this.$logger.info('handleSearchByInputFilter', data)
      this.filterParams = data
      this.handleSearchSlide()
    },

    handleSearchSlide () {
      this.$logger.info('handleSearchSlide', this.filterSourceType)
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
          res.result.forEach(item => {
            item.thumbnailList = []
            for (let i = 0; i < item.images.length; i++) {
              item.thumbnailList[i] = {
                contentUrl: item.images[i].replace('http://', 'https://'),
                id: item.pageObjectIds[i]
              }
            }
          })
          this.slideList = res.result
          this.$logger.info('recommendTemplates slideList', this.slideList)
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
          res.result.forEach(item => {
            item.thumbnailList = []
            for (let i = 0; i < item.images.length; i++) {
              item.thumbnailList[i] = {
                contentUrl: item.images[i].replace('http://', 'https://'),
                id: item.pageObjectIds[i]
              }
            }
          })
          this.slideList = res.result
        }
      }).finally(() => {
        this.searching = false
      })
    },
    getMyContentSlide () {
      this.searching = true
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize,
        searchKey: this.filterParams ? this.filterParams.searchKey : null,
        types: [ this.$classcipe.typeMap.task ],
        delFlag: 0,
        schoolId: this.school
      }
      if (this.filterParams) {
        params = Object.assign(this.filterParams, params)
      }
      FindMyContent(params).then((res) => {
        this.$logger.info('getMyContentSlide res', res)
        if (res && res.result) {
          res.result.records.forEach(item => {
            item.thumbnailList = []
            for (let i = 0; i < item.pageObjects.length; i++) {
              item.thumbnailList[i] = {
                contentUrl: item.pageObjects[i].contentUrl,
                id: item.pageObjectIds[i]
              }
            }
          })
          this.slideList = res.result.records
          this.$logger.info('slideList', this.slideList)
        }
      }).finally(() => {
        this.searching = false
      })
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
    position: relative;
    margin: 0 20px 20px 0;
    width: calc(50% - 20px);

    .selected-icon {
      position: absolute;
      z-index: 200;
      top: 5px;
      right: 5px;
      width: 20px;
      height: 20px;
      background-color: #fff;
      border-radius: 50%;
      border: 1px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
      opacity: 0;
    }
  }

  .selected-template {
    .selected-icon {
      opacity: 1;
    }
  }
}

.slide-source-switch {
  width: 180px;
}

</style>
