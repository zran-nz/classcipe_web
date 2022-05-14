<template>
  <div class='custom-cover-media' :style="{width: width, height: height}">
    <a-upload-dragger
      class='cc-upload'
      :showUploadList='false'
      :customRequest='handleUploadImage'
      name="file">
      <div class='uploaded-cover' v-if="mediaType === 'image' && mediaUrl">
        <div class='img-cover' :style="{backgroundImage: 'url(' + mediaUrl + ')' }"></div>
      </div>
      <div class='upload-text' v-if="mediaType === 'video' && mediaUrl">
        <video :src='mediaUrl' :controls='videoControls'></video>
      </div>
      <div class='upload-tips' v-if='!uploading'>
        <custom-uploaded-button label='Set cover image/video' bg-color='#2582B5' font-color='#fff'>
        </custom-uploaded-button>
      </div>
    </a-upload-dragger>
    <div class='uploading-progress' v-show='uploading'>
      <div class='progress'>
        <a-progress :percent="progressPercent" strokeColor='#2582B5' />
        <custom-link-text class='cancel-text' text='Cancel' color='#fff' @click='handleCancel'></custom-link-text>
      </div>
    </div>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { upAwsS3File } from '@/components/AddMaterial/Utils/AwsS3'
import CustomButton from '@/components/Common/CustomButton'
import CustomUploadedButton from '@/components/Common/CustomUploadedButton'
import CustomLinkText from '@/components/Common/CustomLinkText'

export default {
  name: 'CustomCoverMedia',
  components: { CustomLinkText, CustomUploadedButton, CustomButton },
  props: {
    type: {
      type: String,
      default: null
    },
    url: {
      type: String,
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
    }
  },
  data() {
    return {
      uploading: false,
      mediaType: this.type,
      mediaUrl: this.url,
      progressPercent: 0,
      uploader: null
    }
  },
  created() {
  },
  methods: {
    handleUploadImage(data) {
      logger.info('handleUploadImage data', data)
      this.mediaType = data.file.type.indexOf('image') > -1 ? 'image' : (data.file.type.indexOf('video') > -1 ? 'video' : null)
      if (this.mediaType) {
        this.progressPercent = 0
        this.uploading = true
        this.uploader = upAwsS3File(this.$store.getters.userInfo.id, data.file,
          progressSize => {
            this.$logger.info('progressSize', progressSize)
            this.progressPercent = progressSize
        },
          result => {
            this.$logger.info('handleUploadImage result', result)
            this.mediaUrl = result
            this.uploading = false
            this.$emit('update', {
              type: this.mediaType,
              url: this.mediaUrl
            })
        }, true)
      } else {
        this.$message.warn('Only image and video type files are allowed to be uploaded')
      }
    },

    handleCancel () {
      if (this.uploader) {
        this.uploader.abort()
        this.uploading = false
        this.progressPercent = 0
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.custom-cover-media {
  border-radius: 4px;
  position: relative;

  .cc-upload {
    z-index: 100;
    width: 100%;
    height: 100%;

    /deep/ .ant-upload.ant-upload-drag {
      border: none;
      background: #f1f1f1;
    }

    .upload-tips {
      display: none;
      position: absolute;
      top: 40%;
      left: 50%;
      margin-left: -90px;
      width: 180px;
      align-items: center;
      justify-content: center;
      flex-direction: row;
    }

    &:hover {
      .upload-tips {
        display: flex;
      }
    }
  }

  .uploading-progress {
    z-index: 200;
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    .progress {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      position: absolute;
      top: 40%;
      left: 50%;
      margin-left: -90px;
      width: 180px;
      /deep/ .ant-progress-text {
        color: #fff;
      }

      .cancel-text {
        margin-top: 5px;
        color: #fff !important;
      }
    }
  }
}
.uploaded-cover {
  width: 100%;
  height: 100%;
  .img-cover {
    width: 100%;
    height: 100%;
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
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