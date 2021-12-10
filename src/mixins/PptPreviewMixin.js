import { fileTypeMap } from '@/const/material'
import TextTypeSvg from '@/assets/icons/material/text.svg?inline'
import ImageTypeSvg from '@/assets/icons/material/image.svg?inline'
import VideoTypeSvg from '@/assets/icons/material/video.svg?inline'
import AudioTypeSvg from '@/assets/icons/material/audio.svg?inline'
import YoutubeTypeSvg from '@/assets/icons/material/youtube.svg?inline'
import PdfTypeSvg from '@/assets/icons/material/pdf.svg?inline'
import UrlTypeSvg from '@/assets/icons/material/url.svg?inline'
import { QueryByClassInfoSlideId } from '@/api/classroom'

export const PptPreviewMixin = {
  components: {
    TextTypeSvg,
    ImageTypeSvg,
    VideoTypeSvg,
    AudioTypeSvg,
    YoutubeTypeSvg,
    PdfTypeSvg,
    UrlTypeSvg
  },
  data () {
    return {
      loadingClass: false,
      currentImgIndex: 0,
      elementsList: [],
      itemsList: [],
      showMenuList: [],
      thumbnailList: [],
      fileTypeMap: fileTypeMap,
      materialVisible: false,
      mediaVisible: false,
      mediaList: [],
      filterMaterialType: ''
    }
  },
  created () {

  },
  computed: {
    currentPageElements () {
      const showMenuList = []
      if (this.thumbnailList.length === 0) {
        return showMenuList
      }
      const currentPageId = this.thumbnailList[this.currentImgIndex].id
      this.elementsList.forEach(e => {
        if (currentPageId === e.pageId) {
          const data = JSON.parse(e.data)
          if (data.type === 'iframe') {
            showMenuList.push(fileTypeMap.youtube)
          } else if (data.type === 'image') {
            showMenuList.push(fileTypeMap.img)
          } else if (data.type === 'audio') {
            showMenuList.push(fileTypeMap.audio)
          } else if (data.type === 'text') {
            showMenuList.push(fileTypeMap.txt)
          } else if (data.type === 'video') {
            showMenuList.push(fileTypeMap.video)
          } else if (data.type === 'pdf') {
            showMenuList.push(fileTypeMap.pdf)
          } else if (data.type === 'website') {
            showMenuList.push(fileTypeMap.link)
          }
        }
      })
      console.log(showMenuList)
      return showMenuList
    },
    currentPageElementLists () {
      const pageElementsList = []
      if (this.thumbnailList.length === 0) {
        return pageElementsList
      }
      // const currentPageId = 'g1018d7b0139_0_0'
      const currentPageId = this.thumbnailList[this.currentImgIndex].id
      this.elementsList.forEach(e => {
        if (currentPageId === e.pageId) {
          const data = JSON.parse(e.data)
          pageElementsList.push(data)
        }
      })
      return pageElementsList
    },
    currentPageItem () {
      const pageItemsList = []
      if (this.thumbnailList.length === 0) {
        return ''
      }
      const currentPageId = this.thumbnailList[this.currentImgIndex].id
      this.itemsList.forEach(e => {
        if (currentPageId === e.pageId) {
          const data = JSON.parse(e.data)
          pageItemsList.push(data)
        }
      })
      return pageItemsList.length > 0 ? pageItemsList[0] : ''
    },
    currentPageTips () {
      if (this.thumbnailList.length === 0) {
        return ''
      }
      const tipList = this.currentPageElementLists.filter(item => item.type === 'tip')
      if (tipList) {
        return tipList[0]
      }
      return ''
    },
    currentPageMaterial () {
      const material = {}
      if (this.thumbnailList.length === 0) {
        return material
      }
      const currentPageId = this.thumbnailList[this.currentImgIndex].id
      this.elementsList.forEach(e => {
        if (currentPageId === e.pageId) {
          const data = JSON.parse(e.data)
          // 把tip从material踢出去
          if (data.type !== 'tip') {
            if (!material.hasOwnProperty(data.type)) {
              material[data.type] = []
            }
            material[data.type].push(data)
          }
        }
      })
      return material
    }
  },
  methods: {
    getClassInfo (slideId) {
      this.loadingClass = true
      QueryByClassInfoSlideId({ slideId: slideId }).then(response => {
        // QueryByClassInfoSlideId({ slideId: '1X9fE0m4j4Ey5BvSxof_a0bVxTDNaDfadJTlhkXmyikk' }).then(response => {
        this.$logger.info('QueryByClassInfoSlideId ', response)
        if (response.success) {
          this.elementsList = response.result.relements
          this.itemsList = response.result.items
        }
      }).finally(() => {
        this.loadingClass = false
      })
    },
    showPluginMaterial (type) {
      const data = this.currentPageMaterial[type]
      this.$logger.info('showPluginMaterial ', data)
      if (type === 'text' || type === 'website' || type === 'pdf') {
        if (data.length > 1) {
          this.filterMaterialType = type
          this.materialVisible = true
        } else {
          if (data[0].type !== 'tip') {
            window.open(data[0].url, '_blank')
          }
        }
      } else {
        this.mediaList = data
        this.filterMaterialType = type
        this.mediaVisible = true
      }
    },
    showMaterialSize (type) {
      if (this.currentPageMaterial[type].length > 1) {
        return this.currentPageMaterial[type].length
      } else {
        return 0
      }
    },
    computerSize (type) {
      var size = 0
      const currentPageId = this.thumbnailList[this.currentImgIndex].id
      this.elementsList.forEach(e => {
        if (currentPageId === e.pageId) {
          const data = JSON.parse(e.data)
          if (data.type === type) {
            size++
          }
        }
      })
      return size
    },
    onChangePage (page) {
      this.currentImgIndex = page
    },

    getTargetPageItemData (pageId) {
      let data = null
      this.itemsList.forEach(e => {
        if (pageId === e.pageId) {
          data = JSON.parse(e.data)
        }
      })
      return data
    }
  }

}
