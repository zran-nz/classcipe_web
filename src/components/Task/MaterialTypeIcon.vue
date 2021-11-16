<template>
  <div class="status-icon-item">
    <image-type-svg :style="{height: size}" v-if="type === 'image'"/>
    <video-type-svg :style="{height: size}" v-else-if="type === 'video'"/>
    <audio-type-svg :style="{height: size}" v-else-if="type === 'audio'"/>
    <youtube-type-svg :style="{height: size}" v-else-if="type === 'iframe'"/>
    <url-type-svg :style="{height: size}" v-else-if="type === 'website'"/>
    <pdf-type-svg :style="{height: size}" v-else-if="type === 'pdf'"/>
    <text-type-svg :style="{height: size}" v-else-if="type === 'text'"/>
    <text-type-svg :style="{height: size}" v-else/>
  </div>
</template>

<script>
/**
 'topic': 1,
 'unit-plan': 2,
 'material': 3,
 'task': 4,
 'lesson': 5,
 'evaluation': 6
 */
import TextTypeSvg from '@/assets/icons/material/text.svg?inline'
import ImageTypeSvg from '@/assets/icons/material/image.svg?inline'
import VideoTypeSvg from '@/assets/icons/material/video.svg?inline'
import AudioTypeSvg from '@/assets/icons/material/audio.svg?inline'
import YoutubeTypeSvg from '@/assets/icons/material/youtube.svg?inline'
import PdfTypeSvg from '@/assets/icons/material/pdf.svg?inline'
import UrlTypeSvg from '@/assets/icons/material/url.svg?inline'

export default {
  name: 'MaterialTypeIcon',
  components: {
    TextTypeSvg,
    ImageTypeSvg,
    VideoTypeSvg,
    AudioTypeSvg,
    YoutubeTypeSvg,
    PdfTypeSvg,
    UrlTypeSvg
  },
  props: {
    type: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: '30px'
    }
  },
  data: function () {
    return {
    }
  }
}
</script>

<style lang='less' scoped>
.status-icon-item {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ant-menu-item .anticon, .ant-menu-submenu-title .anticon {
  margin-right: 0;
}
</style>
