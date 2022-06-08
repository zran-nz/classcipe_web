<template>
  <div class='content-preview-detail'>
    <div class='preview-carousel-wrapper'>
      <preview-carousel :page-object-list='thumbnailList' :video-list='videoList' v-if='!carouselContentLoading' />
      <a-skeleton v-if='carouselContentLoading' />
    </div>
    <div class='preview-main-content'></div>
    <div class='preview-extra-data'></div>
    <div class='preview-review'></div>
    <div class='preview-recommend'></div>
  </div>
</template>

<script>

import PreviewCarousel from '@/components/Preview/PreviewCarousel'
import { UnitPlanQueryById } from '@/api/unitPlan'
import { PDContentQueryById } from '@/api/pdContent'
import { TaskQueryById } from '@/api/task'
import { VideoQueryById } from '@/api/video'
import { TemplatesGetPublishedPresentation } from '@/api/template'
import { GetAssociate } from '@/api/teacher'
import { mapState } from 'vuex'
import * as logger from '@/utils/logger'
import { formatLocalUTC } from '@/utils/util'
import { PptPreviewMixin } from '@/mixins/PptPreviewMixin'
import { QueryByClassInfoSlideId } from '@/api/classroom'

export default {
  name: 'ContentPreviewDetail',
  components: { PreviewCarousel },
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
  mixins: [ PptPreviewMixin ],
  data() {
    return {
      contentLoading: true,
      content: null,

      carouselContentLoading: true,

      thumbnailList: [],
      pageObjectIds: [],
      videoList: [],

      associateList: []
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentRole: state => state.user.currentRole
    }),
    lastChangeSavedTime () {
      if (this.content) {
        logger.info('lastChangeSavedTime data', this.content)
        const time = this.content.updateTime || this.content.createTime
        if (time) {
          return formatLocalUTC(time)
        }
      }
      return ''
    },
    inActiveTypes () {
      let activeTypes = []
      if (this.itemsList) {
        activeTypes = this.itemsList.map(item => item.type)
      }
      return Array.from(new Set(activeTypes))
    }
  },
  created() {
    this.loadDetail()
  },
  methods: {

    async loadDetail() {
      try {
        this.contentLoading = true
        const ret = await this.loadDetailByContentIDType(this.contentId, this.contentType)
        console.log('loadDetailByContentIDType', ret)
        if (ret.code === 0) {
          this.content = ret.result
          this.loadExtraData()
        } else {
          this.$message.error(ret.message)
        }
      } finally {
        this.contentLoading = false
      }
    },

    async loadDetailByContentIDType(contentId, contentType) {
      contentType = parseInt(contentType)
      if (contentType === this.$classcipe.typeMap['unit-plan']) {
        return UnitPlanQueryById({ id: contentId })
      } else if (contentType === this.$classcipe.typeMap.task) {
        return TaskQueryById({ id: contentId })
      } else if (contentType === this.$classcipe.typeMap.video) {
        return VideoQueryById({ id: contentId })
      } else if (contentType === this.$classcipe.typeMap.pd) {
        return PDContentQueryById({ id: contentId })
      }
    },

    loadExtraData() {
      const contentType = parseInt(this.contentType)
      if (contentType === this.$classcipe.typeMap.task || contentType === this.$classcipe.typeMap.pd) {
        this.initVideoList()
        // 加载PPT节目数据
        this.loadSlideData()
      } else {
        this.carouselContentLoading = true
        this.initVideoList()
        this.initImgList()
        this.carouselContentLoading = false
      }
      this.loadAssociateData()

      if (this.content.presentationId) {
        this.getClassInfo(this.content.presentationId)
      }
    },

    initVideoList () {
      this.videoList = []
      if (this.content.video) {
        this.videoList.push({
          url: this.content.video
        })
      }

      if (this.content.coverVideo) {
        this.videoList.push({
          url: this.content.coverVideo
        })
      }
    },

    initImgList() {
      this.thumbnailList = []
      if (this.content.image) {
        this.thumbnailList.push({
          contentUrl: this.content.image
        })
      }

      if (this.thumbnailList.length === 0) {
        this.thumbnailList.push({
          contentUrl: 'http://dcdkqlzgpl5ba.cloudfront.net/file/20210730045859200-education-5923312_640.png'
        })
      }
    },

    async loadSlideData () {
      try {
        this.carouselContentLoading = true
        const slideData = await TemplatesGetPublishedPresentation({ taskId: this.contentId })
        console.log('loadSlideData', slideData)
        this.thumbnailList = slideData.result.pageObjects
        this.pageObjectIds = slideData.result.pageObjectIds
        await this.loadMaterialData()
      } catch (e) {
        console.error('loadSlideData', e)
      } finally {
        this.carouselContentLoading = false
      }
    },

    async loadAssociateData () {
      try {
        const slideData = await GetAssociate({
          id: this.contentId,
          type: this.contentType,
          published: 0
        })
        console.log('loadAssociateData', slideData)
        const list = slideData.result.owner
        this.associateList = []
        list.forEach(item => {
          item.contents.forEach(content => {
            if (content.type === this.$classcipe.typeMap.task) {
              this.associateList.push(content)
            }

            if (content.type === this.$classcipe.typeMap['unit-plan']) {
              this.associateList.push(content)
            }
          })
        })
        console.log('loadAssociateData', this.associateList)
      } catch (e) {
        console.error('loadSlideData', e)
      }
    },

    async loadMaterialData () {
      try {
        const materialData = await QueryByClassInfoSlideId({ slideId: this.content.presentationId, pageIds: this.pageObjectIds })
        console.log('loadMaterialData', materialData)
        materialData.result.relements.forEach(e => {
          if (typeof e.data === 'string') {
            e.data = JSON.parse(e.data)
          }
        })
        materialData.result.items.forEach(e => {
          if (typeof e.data === 'string') {
            e.data = JSON.parse(e.data)
          }
        })
        this.elementsList = materialData.result.relements
        this.itemsList = materialData.result.items
      } catch (e) {
        console.error('loadMaterialData', e)
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
