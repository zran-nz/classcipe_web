import { UnitPlanAddOrUpdate, UnitPlanQueryById } from '@/api/unitPlan'
import { TaskAddOrUpdate, TaskQueryById } from '@/api/task'
import { VideoAddOrUpdate, VideoQueryById } from '@/api/video'
import { PDContentAddOrUpdate, PDContentQueryById } from '@/api/pdContent'

export const ContentItemMixin = {
  data () {
    return {
      allowPreview: true,
      previewCurrentId: null,
      previewType: null,
      previewVisible: false,
      setColor: [
        '#FFEDAF',
        '#C8F4FF',
        '#E6E4FF',
        '#ffccb0',
        '#ffa9a2',
        '#a3ecb9',
        '#f7c5f8',
        '#ffbfe2',
        '#d5b9ff',
        '#c4f6b1'
      ]
    }
  },
  computed: {
    contentType() {
      return this.content.type
    },
    contentId() {
      return this.content.id
    }
  },
  methods: {
    handlePreviewDetail (data) {
      this.$logger.info('handlePreviewDetail', data, 'allowPreview', this.allowPreview)
      if (this.allowPreview) {
        this.previewVisible = false
        this.$nextTick(() => {
          this.previewCurrentId = data.id
          this.previewType = data.type
          this.previewVisible = true
        })
        this.$emit('preview', data)
      }
    },
    handlePreviewClose () {
      this.$logger.info('handlePreviewClose')
      this.previewVisible = false
      this.previewCurrentId = null
      this.previewType = null
    },
    async updateEditSlideStatus() {
      const contentType = parseInt(this.contentType)
      if (contentType === this.$classcipe.typeMap['unit-plan']) {
        await UnitPlanAddOrUpdate({ id: this.contentId, slideEditing: false })
      } else if (contentType === this.$classcipe.typeMap.task) {
        await TaskAddOrUpdate({ id: this.contentId, slideEditing: false })
      } else if (contentType === this.$classcipe.typeMap.video) {
        await VideoAddOrUpdate({ id: this.contentId, slideEditing: false })
      } else if (contentType === this.$classcipe.typeMap.pd) {
        await PDContentAddOrUpdate({ id: this.contentId, slideEditing: false })
      }
      this.content.slideEditing = false
    }
  }
}
