<template>
  <div class='custom-cover-media' :style="{ width: width, height: height }">
    <div class='upload-text'>
      <video :src='url' :controls='videoControls'></video>
      <div class='media-info'>
        <div class='media-title'>
          {{ title }}
        </div>
        <div class='media-size'>
          {{ size | sizeFormat }}
        </div>
      </div>
    </div>
    <div class='upload-tips'>
      <custom-media-cover-button label='Delete' bg-color='#2582B5' font-color='#fff' @click='handleDeleteVideo'>
        <template v-slot:icon>
          <a-icon type='delete' />
        </template>
      </custom-media-cover-button>
    </div>
  </div>
</template>

<script>
import CustomButton from '@/components/Common/CustomButton'
import CustomMediaCoverButton from '@/components/Common/CustomMediaCoverButton'
import CustomLinkText from '@/components/Common/CustomLinkText'
import ClasscipeDriveEvent from '@/components/ClasscipeDrive/ClasscipeDriveEvent'

export default {
  name: 'VideoItem',
  components: { CustomLinkText, CustomMediaCoverButton, CustomButton },
  props: {
    url: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    size: {
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
      default: '200px'
    },
    videoItem: {
      type: Object,
      default: null
    }
  },
  methods: {
    handleDeleteVideo () {
      this.$logger.info('handleDeleteVideo', this.videoItem)
      this.$EventBus.$emit(ClasscipeDriveEvent.DELETE_VIDEO, this.videoItem)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.custom-cover-media {
  border-radius: 4px;
  border: 1px solid #E1E1E1;
  box-shadow: 0 1px 2px 0 rgba(65, 65, 65, 0.07);
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
    z-index: 1000;

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

  .selected-mask {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 500;

    img {
      width: 16px;
      position: absolute;
      right: 10px;
      top: 10px;
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
  height: 100%;

  video {
    width: 100%;
    height: calc(100% - 50px);
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
</style>
