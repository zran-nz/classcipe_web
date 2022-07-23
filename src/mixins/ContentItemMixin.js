import { TemplatesGetPresentation } from '@/api/template'

export const ContentItemMixin = {
  data () {
    return {
      allowPreview: true,
      previewCurrentId: null,
      previewType: null,
      previewCode: null, // live workshop sessionId
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
      ],
      savingSlides: false
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
          this.previewCode = data.sessionId
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
      this.previewCode = null
    },
    async updateEditSlideStatus() {
      if (!this.updateEditSlideLoading) {
        try {
          this.updateEditSlideLoading = true
          const contentType = parseInt(this.content.type)
          // 只有task 和 pd需要save changes
          if (contentType === this.$classcipe.typeMap.task) {
            // await TaskAddOrUpdate({ id: this.content.id, slideEditing: false })
            await TemplatesGetPresentation({
              taskId: this.content.id,
              needRefresh: true
            })
          } else if (contentType === this.$classcipe.typeMap.pd) {
            await TemplatesGetPresentation({
              taskId: this.content.id,
              needRefresh: true
            })
          }
          this.content.slideEditing = false
        } catch (e) {
          console.log('updateEditSlideStatus', e)
        } finally {
          this.updateEditSlideLoading = false
        }
      }
    },
    async handleSaveSlides() {
      if (this.savingSlides) {
        return
      }

      try {
        this.savingSlides = true
        await TemplatesGetPresentation({
          taskId: this.content.id,
          needRefresh: true
        })
      } catch (e) {
        console.error('', e)
      } finally {
        this.savingSlides = false
      }
    }
  }
}
