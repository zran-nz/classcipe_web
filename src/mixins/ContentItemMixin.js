import { VideoAddOrUpdate } from '@/api/video'
import { PDContentAddOrUpdate } from '@/api/pdContent'
import { TemplatesGetPresentation } from '@/api/template'

export const ContentItemMixin = {
  data () {
    return {
      allowPreview: true,
      previewCurrentId: null,
      previewType: null,
      previewVisible: false,
      updateEditSlideLoading: false,
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
      if (!this.updateEditSlideLoading) {
        try {
          this.updateEditSlideLoading = true
          const contentType = parseInt(this.content.type)
          if (contentType === this.$classcipe.typeMap['unit-plan']) {
            // await UnitPlanAddOrUpdate({ id: this.content.id, slideEditing: false })
            await TemplatesGetPresentation({
              taskId: this.content.id,
              needRefresh: true
            })
          } else if (contentType === this.$classcipe.typeMap.task) {
            // await TaskAddOrUpdate({ id: this.content.id, slideEditing: false })
            await TemplatesGetPresentation({
              taskId: this.content.id,
              needRefresh: true
            })
          } else if (contentType === this.$classcipe.typeMap.video) {
            await VideoAddOrUpdate({ id: this.content.id, slideEditing: false })
          } else if (contentType === this.$classcipe.typeMap.pd) {
            await PDContentAddOrUpdate({ id: this.content.id, slideEditing: false })
          }
          this.content.slideEditing = false
        } catch (e) {
          console.log('updateEditSlideStatus', e)
        } finally {
          this.updateEditSlideLoading = false
        }
      }
    }
  }
}
