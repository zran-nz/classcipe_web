<template>
  <div class='slide-material-and-tips'>
    <div class='material-wrapper'>
      <div class='material-list'>
        <a-space>
          <a-badge
            :count="showMaterialSize('text')"
            v-if="currentPageMaterial.hasOwnProperty('text')">
            <div class='icon' @click="previewAddOnMaterial('text')">
              <text-type-svg style="width: 30px;height: 30px;"/>
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
        </a-space>
      </div>
      <div class='material-upload'>
        <upload-enter />
      </div>
    </div>
    <div class='tips-wrapper'>
      <div class='tips-list'></div>
      <div class='tips-upload'>
        <custom-text-button label='Add tips'>
          <template v-slot:icon>
            <a-icon type='circle-plus' />
          </template>
        </custom-text-button>
      </div>
    </div>
  </div>
</template>

<script>

import TextTypeSvg from '@/assets/v2/icons/text.svg?inline'
import ImageTypeSvg from '@/assets/v2/icons/image.svg?inline'
import VideoTypeSvg from '@/assets/v2/icons/video.svg?inline'
import AudioTypeSvg from '@/assets/v2/icons/audio.svg?inline'
import YoutubeTypeSvg from '@/assets/v2/icons/youtube.svg?inline'
import UploadEnter from '@/components/AddMaterial/UploadEnter'
import CustomTextButton from '@/components/Common/CustomTextButton'

export default {
  name: 'SlideMaterialsAndTips',
  components: {
    CustomTextButton,
    TextTypeSvg,
    ImageTypeSvg,
    VideoTypeSvg,
    AudioTypeSvg,
    YoutubeTypeSvg,
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
    console.info('SlideMaterialsAndTips created ', this.currentPageMaterial)
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
      console.info('previewAddOnMaterial ', data)
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
.slide-material-and-tips {
  position: relative;
  color: rgba(0, 0, 0, 0.65);
  background: #fff;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-basis: auto;
  justify-content: space-between;
  align-items: center;

  .material-upload, .tips-upload {
    margin-top: 10px;
  }

  /deep/ .ant-badge-count {
    top: 8px;
    right: 5px;
  }

  .icon {
    height: 50px;
    width: 50px;
    padding: 5px;
    display: flex;
    flex-direction: column;
    font-weight: bold;
    cursor: pointer;
    align-items: center;
    text-align: center;
    justify-content: center;

    .icon-text {
      display: flex;
      font-size: 12px;
    }

    svg {
      margin: 0;
      padding: 3px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }
}

</style>
