<template>
  <div class='classcipe-drive'>
    <div class='drive-type-switch'>
      <a-radio-group :default-value="currentDriveType" button-style="solid" class='cc-radio-group' v-model='currentDriveType' @change='driveTypeChange' >
        <a-radio-button :value="DriveType.ClasscipeDrive" v-if='filterTabTypeList.indexOf(DriveType.ClasscipeDrive) !== -1'>
          Classcipe Drive
        </a-radio-button>
        <a-radio-button :value="DriveType.Youtube" v-if='filterTabTypeList.indexOf(DriveType.Youtube) !== -1'>
          Youtube
        </a-radio-button>
        <a-radio-button :value="DriveType.GoogleImage" v-if='filterTabTypeList.indexOf(DriveType.GoogleImage) !== -1'>
          Google Image
        </a-radio-button>
        <a-radio-button :value="DriveType.GoogleDrive" v-if='filterTabTypeList.indexOf(DriveType.GoogleDrive) !== -1'>
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
      <div v-show='currentDriveType === DriveType.GoogleDrive'>
        <google-drive v-bind='$attrs' :drive-loading='driveLoading' @show-google-drive='handleShowGoogleDrive'/>
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
import ClasscipeDriveEvent from '@/components/ClasscipeDrive/ClasscipeDriveEvent'
import GooglePicker from '@/components/AddMaterial/Utils/GooglePicker'

export default {
  name: 'ClasscipeDrive',
  components: { GoogleDrive, GoogleImage, Youtube, Drive },
  props: {
    contentId: {
      type: String,
      default: null
    },
    contentType: {
      type: Number,
      default: null
    },
    filterType: {
      type: String,
      default: 'image'
    },
    filterTabTypeList: {
      type: Array,
      default: () => [
        DriveType.ClasscipeDrive,
        DriveType.Youtube,
        DriveType.GoogleImage,
        DriveType.GoogleDrive
      ]
    }
  },
  data() {
    return {
      DriveType: DriveType,
      currentDriveType: DriveType.ClasscipeDrive,
      driveLoading: false
    }
  },

  methods: {
    driveTypeChange() {
      this.$logger.info('driveTypeChange', this.currentDriveType)
      this.handleShowGoogleDrive()
    },

    handleShowGoogleDrive() {
      if (this.currentDriveType === this.DriveType.GoogleDrive) {
        GooglePicker.init(
          driveUpLoadProgress => {
            this.driveLoading = true
          },
          (type, url, mediaType) => {
            console.log('url', url)
            if (url) {
              this.$logger.info('GooglePicker addDrive done', url, mediaType, ClasscipeDriveEvent)
              this.$EventBus.$emit(ClasscipeDriveEvent.INSERT_GOOGLE_DRIVE, {
                url, mediaType
              })
            }
            this.driveLoading = false
          },
          this.$store.getters.userInfo.id,
          this.filterType
        )
      }
    }
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
