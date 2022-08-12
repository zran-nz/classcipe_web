<template>
  <div class='drive-video-uploader'>
    <a-upload-dragger
      class='cc-upload'
      :showUploadList='false'
      accept="video/mp4"
      :customRequest='handleUploadVideo'
      name="file">
      <div class='upload-text' v-if="url">
        <video :src='url' :controls='videoControls'></video>
      </div>
      <div class='upload-tips' v-if='!uploading'>
        <custom-media-cover-button label='Select video' bg-color='#2582B5' font-color='#fff' ></custom-media-cover-button>
      </div>
    </a-upload-dragger>
    <div class='uploading-progress' v-show='uploading'>
      <div class='progress'>
        <a-progress :percent="progressPercent" strokeColor='#2582B5' />
        <custom-link-text class='cancel-text' text='Cancel' color='#fff' @click='handleCancel'></custom-link-text>
      </div>
    </div>
    <div class='drive-action' v-if='url && !uploading'>
      <a-button type='primary' @click='handleSelected'>Confirm</a-button>
    </div>
  </div>
</template>

<script>
import { upAwsS3File } from '@/components/AddMaterial/Utils/AwsS3'
import CustomButton from '@/components/Common/CustomButton'
import CustomMediaCoverButton from '@/components/Common/CustomMediaCoverButton'
import CustomLinkText from '@/components/Common/CustomLinkText'
import CommonNoData from '@/components/Common/CommonNoData'
import ClasscipeDriveEvent from '@/components/ClasscipeDrive/ClasscipeDriveEvent'

export default {
  name: 'DriveVideoUploader',
  components: { CommonNoData, CustomLinkText, CustomMediaCoverButton, CustomButton },
  props: {
    videoControls: {
      type: Boolean,
      default: true
    },
    field: {
      type: String,
      default: null
    },
    contentId: {
      type: String,
      default: null
    },
    contentType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      uploading: false,
      url: null,
      name: '',
      size: 0,
      progressPercent: 0,
      uploader: null
    }
  },
  methods: {
    handleUploadVideo(data) {
      this.$logger.info('handleUploadVideo data', data)
      this.progressPercent = 0
      this.uploading = true
      this.uploader = upAwsS3File(this.$store.getters.userInfo.id, data.file,
        progressSize => {
          this.$logger.info('progressSize', progressSize)
          this.progressPercent = progressSize
        },
        (url, name, size) => {
          this.$logger.info('handleUploadVideo result', url)
          this.uploading = false
          this.url = url
          this.name = name
          this.size = size
          this.$emit('update', {
            type: 'video',
            url: this.url,
            name,
            size
          })
        }, true, this.contentType, this.contentId)
    },

    handleCancel () {
      if (this.uploader) {
        this.uploader.abort()
        this.uploading = false
        this.progressPercent = 0
      }
    },

    handleSelected () {
      this.$logger.info('handle select', this.url, ` field ${this.field}`)
      if (this.url) {
        this.$EventBus.$emit(ClasscipeDriveEvent.INSERT_UPLOADED_VIDEO, {
          field: this.field,
          data: this.url,
          name: this.name,
          size: this.size
        })
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.drive-video-uploader {
  margin-top: 20px;
  border-radius: 4px;
  position: relative;
  width: 100%;
  min-height: 350px;

  .cc-upload {
    z-index: 100;
    min-height: 350px;
    max-height: 400px;
    width: 352px;
    overflow: hidden;

    /deep/ .ant-upload.ant-upload-drag {
      border: none;
      background: #f1f1f1;
    }

    .upload-tips {
      display: flex;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      min-height: 150px;
      width: 100%;
      align-items: center;
      justify-content: center;
      flex-direction: row;

      .cc-custom-button {
        min-width: 120px;
        margin: 5px 0;
      }
    }

    video {
      max-height: 300px;
    }
    &:hover {
      .upload-tips {
        display: flex;
        flex-direction: column;
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

.drive-action {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
