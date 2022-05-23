<template>
  <div class='custom-cover-media' :style="{width: width, height: height}">
    <div class='uploaded-cover' v-if="mediaType === 'image' && mediaUrl">
      <div class='img-cover' :style="{backgroundImage: 'url(' + mediaUrl + ')' }"></div>
      <div class='media-info'>
        <div class='media-title'>
          {{ mediaTitle }}
        </div>
        <div class='media-size'>
          {{ mediaSize | sizeFormat }}
        </div>
      </div>
    </div>
    <div class='upload-text' v-if="mediaType === 'video' && mediaUrl">
      <video :src='mediaUrl' :controls='videoControls'></video>
    </div>
    <div class='upload-tips'>
      <custom-media-cover-button label='Select' bg-color='#2582B5' font-color='#fff'>
        <template v-slot:icon>
          <a-icon type='plus-circle' />
        </template>
      </custom-media-cover-button>
    </div>
  </div>
</template>

<script>
import CustomButton from '@/components/Common/CustomButton'
import CustomMediaCoverButton from '@/components/Common/CustomMediaCoverButton'
import CustomLinkText from '@/components/Common/CustomLinkText'

export default {
  name: 'CustomMediaItem',
  components: { CustomLinkText, CustomMediaCoverButton, CustomButton },
  props: {
    mediaType: {
      type: String,
      default: null
    },
    mediaUrl: {
      type: String,
      default: null
    },
    mediaTitle: {
      type: String,
      default: null
    },
    mediaSize: {
      type: Number,
      default: null
    },
    videoControls: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: '280px'
    },
    height: {
      type: String,
      default: '160px'
    },
    mediaItem: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.custom-cover-media {
  border-radius: 4px;
  border: 1px solid #E1E1E1;
  box-shadow: 0px 1px 2px 0px rgba(65, 65, 65, 0.07);
  position: relative;

  .upload-tips {
    display: none;
    position: absolute;
    top: 30%;
    left: 50%;
    margin-left: -90px;
    width: 180px;
    align-items: center;
    justify-content: center;
    flex-direction: row;

    .cc-custom-button {
      min-width: 120px;
      margin: 5px 0;
    }
  }

  &:hover {
    .upload-tips {
      display: flex;
      flex-direction: column;
    }
  }
}
.uploaded-cover {
  width: 100%;
  height: 100%;
  .img-cover {
    width: 100%;
    height: calc(100% - 50px);
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .media-info {
    height: 50px;
    background-color: rgba(255, 255, 255, 0.5);
    padding: 0 5px;
    .media-title {
      font-family: Arial;
      color: #282828;
      height: 30px;
      line-height: 30px;
      text-overflow: ellipsis;
      word-break: break-word;
      user-select: none;
      overflow: hidden;
    }

    .media-size {
      font-family: Arial;
      height: 20px;
      line-height: 15px;
      font-size: 12px;
      text-overflow: ellipsis;
      word-break: break-word;
      user-select: none;
      overflow: hidden;
    }
  }
}

.upload-text {
  width: 100%;
  height: 100%;

  video {
    width: 100%;
    height: 100%;
  }
}
</style>
