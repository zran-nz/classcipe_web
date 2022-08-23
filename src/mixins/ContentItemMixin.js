import { TemplatesGetPresentation } from '@/api/template'
import { uniqBy } from 'lodash-es'

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
  computed: {
    commandTermsList () {
      return uniqBy((this.content.learnOuts.map(item => item.commandTerms)).flat(2), 'name').map(item => item.name)
    },
    knowledgeTagsList () {
      return uniqBy((this.content.learnOuts.map(item => item.knowledgeTags)).flat(2), 'name').map(item => item.name)
    }
  },
  methods: {
    handlePreviewDetail (data, isOrigin = false) {
      this.$logger.info('handlePreviewDetail', data, 'allowPreview', this.allowPreview)
      if (this.allowPreview) {
        this.previewVisible = false
        this.$nextTick(() => {
          this.previewCurrentId = isOrigin ? (data.sourceFrom || data.id) : data.id
          this.previewType = data.type
          this.previewCode = data.sessionId
          // 原件显示创建编辑评论不显示评论列表，自己copy的西餐时评论列表不显示创建编辑
          this.reviewList = !isOrigin
          this.reviewCreate = !!isOrigin
          this.reviewEdit = !!isOrigin
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
    }
  }
}
