<template>
  <div class='slide-select-list'>
    <div class='slide-source-switch'>
      <a-radio-group default-value="My content" button-style="solid" class='cc-radio-group' v-model='filterSourceType' @change='handleSearchByFilter'>
        <a-radio-button :value="sourceType.MyContent">
          My content
        </a-radio-button>
        <a-radio-button :value="sourceType.SlideTemplate">
          Slide template
        </a-radio-button>
        <a-radio-button :value="sourceType.Library">
          Library
        </a-radio-button>
        <a-radio-button :value="sourceType.Resource" v-if='userMode === USER_MODE.SCHOOL'>
          Resource center
        </a-radio-button>
      </a-radio-group>

      <!--      <a-select-->
      <!--        :getPopupContainer="trigger => trigger.parentElement"-->
      <!--        placeholder='Curriculum'-->
      <!--        v-model='filterSourceType'-->
      <!--        @change='handleSearchByFilter'-->
      <!--        class='cc-select cc-lo-select-mid'>-->
      <!--        <a-select-option :value="sourceType.Recommend">-->
      <!--          Recommend-->
      <!--        </a-select-option>-->
      <!--        <a-select-option :value="sourceType.SlideTemplate">-->
      <!--          Slide template-->
      <!--        </a-select-option>-->
      <!--        <a-select-option :value="sourceType.MyContent">-->
      <!--          My content-->
      <!--        </a-select-option>-->
      <!--      </a-select>-->
    </div>
    <div class='search-bar'>
      <template-filter v-if="filterSourceType === sourceType.SlideTemplate" @search='handleSearchByInputFilter'/>

      <content-filter v-else @search='handleSearchByInputFilter'/>
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

    <content-preview
      :content-id='previewCurrentId'
      :content-type='previewType'
      v-if='previewVisible'
      @close='handlePreviewClose' />

    <a-modal
      v-model='previewPptVisible'
      :maskClosable='false'
      :keyboard='false'
      :footer='null'
      width='700px'
      @close='handlePreviewClose'
      destroyOnClose>
      <div class='content-preview-detail' ref="container">
        <div class='preview-carousel-wrapper'>
          <preview-carousel :page-object-list='pptThumbnailList' v-if='previewPptVisible' />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>

import PreviewCarousel from '@/components/Preview/PreviewCarousel'
import { FilterTemplates, recommendTemplates } from '@/api/template'
import CustomSearchInput from '@/components/Common/CustomSearchInput'
import ContentFilter from '@/components/MyContentV2/ContentFilter'
import CommonNoData from '@/components/Common/CommonNoData'
import SlideViewer from '@/components/PPT/SlideViewer'
import { FindMyContent } from '@/api/teacher'
import { mapState } from 'vuex'
import ContentPreview from '@/components/Preview/ContentPreview'
import * as logger from '@/utils/logger'
import SlideEvent from '@/components/PPT/SlideEvent'
import TemplateFilter from '@/components/MyContentV2/TemplateFilter'
import { USER_MODE } from '@/const/common'
import { queryLibraryResource } from '@/api/v2/library'

const sourceType = {
  Recommend: 1,
  SlideTemplate: 2,
  MyContent: 3,
  Library: 4,
  Resource: 5
}

export default {
  name: 'SlideSelectList',
  components: { ContentPreview, SlideViewer, CommonNoData, ContentFilter, CustomSearchInput, PreviewCarousel, TemplateFilter },
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
      school: state => state.user.school,
      userMode: state => state.app.userMode
    })
  },
  data() {
    return {
      filterSourceType: sourceType.MyContent,
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
        pageSize: 1000
      },

      previewCurrentId: null,
      previewType: null,
      previewVisible: false,

      previewPptVisible: false,
      pptThumbnailList: [],
      USER_MODE: USER_MODE
    }
  },
  created() {
    this.handleSearchSlide()
    this.$EventBus.$on(SlideEvent.PREVIEW_TEMPLATE, this.handlePreviewDetail)
  },
  beforeDestroy() {
    this.$EventBus.$off(SlideEvent.PREVIEW_TEMPLATE, this.handlePreviewDetail)
  },
  methods: {
    handleSearchByFilter (data) {
      this.filterParams = null
      this.handleSearchSlide()
    },

    handlePreviewDetail (data) {
      this.$logger.info('handlePreviewDetail', data)
      if (data.type) {
        this.previewCurrentId = data.id
        this.previewType = data.type
        this.previewVisible = true
      } else {
        this.$logger.info('previewPpt')
        this.pptThumbnailList = data.thumbnailList
        this.previewPptVisible = true
      }
    },

    handlePreviewClose () {
      logger.info('handlePreviewClose')
      this.previewCurrentId = ''
      this.previewType = ''
      this.previewVisible = false

      this.previewPptVisible = false
      this.pptThumbnailList = []
    },

    handleSearchByInputFilter (data) {
      this.$logger.info('handleSearchByInputFilter', data)
      this.filterParams = data
      this.handleSearchSlide()
    },

    handleSearchSlide (data) {
      this.$logger.info('handleSearchSlide', this.filterSourceType, data)
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
        case sourceType.Library:
          this.loadLibrary(0)
          break
        case sourceType.Resource:
          this.loadLibrary(this.school)
          break
        default:
          break
      }
    },

    getRecommendSlide () {
      this.searching = true
      const params = Object.assign({ taskId: this.sourceId }, this.filterParams)
      recommendTemplates(params).then(res => {
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
      this.$logger.info('this.filterParams', this.filterParams)
      if (!this.filterParams) {
        // 未筛选 默认推荐模板
        return this.getRecommendSlide()
      }
      FilterTemplates(Object.assign({}, this.filterParams)).then(res => {
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
        types: [ this.$classcipe.typeMap.task, this.$classcipe.typeMap.pd ],
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
          this.slideList = this.slideList.filter(item => item.id !== this.sourceId)
          this.$logger.info('slideList', this.slideList)
        }
      }).finally(() => {
        this.searching = false
      })
    },
    loadLibrary (schoolId) {
      this.searching = true
      let params = {
        searchKey: this.filterParams ? this.filterParams.searchKey : null,
        types: [ this.$classcipe.typeMap.task, this.$classcipe.typeMap.pd ],
        schoolId: schoolId || 0,
        currentId: this.sourceId
      }
      if (this.filterParams) {
        params = Object.assign(this.filterParams, params)
      }
      this.$logger.info('params', params)
      queryLibraryResource(params).then(res => {
        if (res && res.result) {
          res.result.forEach(item => {
            item.thumbnailList = []
            for (let i = 0; i < item.pageObjects.length; i++) {
              item.thumbnailList[i] = {
                contentUrl: item.pageObjects[i].contentUrl,
                id: item.pageObjectIds[i]
              }
            }
          })
          this.slideList = res.result
          this.$logger.info('loadLibrary res', this.slideList)
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

//.slide-source-switch {
//  width: 180px;
//}

</style>
