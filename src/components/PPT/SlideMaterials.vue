<template>
  <div class='slide-material'>
    <a-space>
      <a-badge
        :count="showMaterialSize('text')"
        v-if="currentPageMaterial.hasOwnProperty('text')">
        <div class='icon' @click="previewAddOnMaterial('text')">
          <text-type-svg />
          <div class='icon-text'>Text</div>
        </div>
      </a-badge>
      <a-badge
        :count="showMaterialSize('image')"
        v-if="currentPageMaterial.hasOwnProperty('image')">
        <div class='icon' @click="previewAddOnMaterial('image')">
          <image-type-svg />
          <div class='icon-text'>Image</div>
        </div>
      </a-badge>
      <a-badge
        :count="showMaterialSize('video')"
        v-if="currentPageMaterial.hasOwnProperty('video')">
        <div class='icon' @click="previewAddOnMaterial('video')">
          <video-type-svg />
          <div class='icon-text'>Video</div>
        </div>
      </a-badge>
      <a-badge
        :count="showMaterialSize('audio')"
        v-if="currentPageMaterial.hasOwnProperty('audio')">
        <div class='icon' @click="previewAddOnMaterial('audio')">
          <audio-type-svg />
          <div class='icon-text'>Audio</div>
        </div>
      </a-badge>
      <a-badge
        :count="showMaterialSize('iframe')"
        v-if="currentPageMaterial.hasOwnProperty('iframe')">
        <div class='icon' @click="previewAddOnMaterial('iframe')">
          <youtube-type-svg />
          <div class='icon-text'>Youtube</div>
        </div>
      </a-badge>
      <a-badge :count="showMaterialSize('pdf')" v-if="currentPageMaterial.hasOwnProperty('pdf')">
        <div class='icon' @click="previewAddOnMaterial('pdf')">
          <pdf-type-svg />
          <div class='icon-text'>PDF</div>
        </div>
      </a-badge>
      <a-badge
        :count="showMaterialSize('website')"
        v-if="currentPageMaterial.hasOwnProperty('website')">
        <div class='icon' @click="previewAddOnMaterial('website')">
          <url-type-svg />
          <div class='icon-text'>Website</div>
        </div>
      </a-badge>
      <a-badge v-if='allowUpload'>
        <div class='my-add-material'>
          <upload-enter />
        </div>
      </a-badge>
    </a-space>
  </div>
</template>

<script>

import TextTypeSvg from '@/assets/icons/material/text.svg?inline'
import ImageTypeSvg from '@/assets/icons/material/image.svg?inline'
import VideoTypeSvg from '@/assets/icons/material/video.svg?inline'
import AudioTypeSvg from '@/assets/icons/material/audio.svg?inline'
import YoutubeTypeSvg from '@/assets/icons/material/youtube.svg?inline'
import PdfTypeSvg from '@/assets/icons/material/pdf.svg?inline'
import UrlTypeSvg from '@/assets/icons/material/url.svg?inline'
import UploadEnter from '@/components/AddMaterial/UploadEnter'

export default {
  name: 'SlideMaterials',
  components: {
    TextTypeSvg,
    ImageTypeSvg,
    VideoTypeSvg,
    AudioTypeSvg,
    YoutubeTypeSvg,
    PdfTypeSvg,
    UrlTypeSvg,
    UploadEnter
  },
  props: {
    currentPageMaterial: {
      type: Object,
      default: () => {}
    },
    allowUpload: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      filterMaterialType: null,
      mediaList: [],
      mediaVisible: false
    }
  },
  created() {
  },
  methods: {
    showMaterialSize (type) {
      if (this.currentPageMaterial[type] && this.currentPageMaterial[type].length > 1) {
        return this.currentPageMaterial[type].length
      } else {
        return 0
      }
    },
    previewAddOnMaterial (type) {
      const data = this.currentPageMaterial[type]
      this.$logger.info('previewAddOnMaterial ', data)
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
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";
.slide-material {

  position: relative;
  color: rgba(0, 0, 0, 0.65);
  background: #fff;
  height: 70px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-basis: auto;
  justify-content: flex-start;
  align-items: center;

  /deep/ .ant-badge-count {
    top: 10px;
    right: 12px;
  }

  .icon {
    width: 50px;
    height: 50px;
    margin: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    font-weight: bold;
    padding: 2px;
    cursor: pointer;
    align-items: center;

    .icon-text {
      display: flex;
      font-size: 12px;
    }

    svg {
      display: flex;
      width: 32px;
      height: 32px;
    }
  }
}

</style>
