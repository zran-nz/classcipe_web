<template>
  <div class='classcipe-drive'>
    <div class='drive-type-switch'>
      <a-radio-group :default-value="currentDriveType" button-style="solid" class='cc-radio-group' v-model='currentDriveType' >
        <a-radio-button :value="DriveType.ClasscipeDrive">
          Classcipe Drive
        </a-radio-button>
        <a-radio-button :value="DriveType.Youtube">
          Youtube
        </a-radio-button>
        <a-radio-button :value="DriveType.GoogleImage">
          Google Image
        </a-radio-button>
        <a-radio-button :value="DriveType.Upload">
          Upload
        </a-radio-button>
        <a-radio-button :value="DriveType.GoogleDrive">
          Google Drive
        </a-radio-button>
      </a-radio-group>
    </div>
    <div class='drive-content'>
      <div v-show='currentDriveType === DriveType.ClasscipeDrive'>
        <drive v-bind='$attrs' />
      </div>
      <div v-show='currentDriveType === DriveType.Youtube'>
        <youtube v-bind='$attrs' />
      </div>
      <div v-show='currentDriveType === DriveType.GoogleImage'>
        <google-image v-bind='$attrs' />
      </div>
      <div v-show='currentDriveType === DriveType.Upload'>
        <upload v-bind='$attrs' />
      </div>
      <div v-show='currentDriveType === DriveType.GoogleDrive'>
        <google-drive v-bind='$attrs' />
      </div>
    </div>
  </div>
</template>

<script>

import DriveType from '@/components/ClasscipeDrive/Content/DriveType'
import Drive from '@/components/ClasscipeDrive/Content/Drive'
import Youtube from '@/components/ClasscipeDrive/Content/Youtube'
import GoogleImage from '@/components/ClasscipeDrive/Content/GoogleImage'
import GoogleDrive from '@/components/ClasscipeDrive/Content/GoogleDrive'
import Upload from '@/components/ClasscipeDrive/Content/Upload'

export default {
  name: 'ClasscipeDrive',
  components: { GoogleDrive, GoogleImage, Youtube, Drive, Upload },
  props: {
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
      DriveType: DriveType,
      currentDriveType: DriveType.ClasscipeDrive
    }
  },
  created() {
  },
  methods: {

  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";
.classcipe-drive {
  .drive-content {
    min-height: 400px;
  }
}
</style>
