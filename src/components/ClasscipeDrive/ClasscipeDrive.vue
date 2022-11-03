<template>
  <div class='classcipe-drive'>
    <div class='drive-type-switch'>
      <a-radio-group :default-value="currentDriveType" button-style="solid" class='cc-radio-group' v-model='currentDriveType' @change='driveTypeChange' >
        <!--        <a-radio-button :value="DriveType.ClasscipeDrive" v-if='filterTabTypeList.indexOf(DriveType.ClasscipeDrive) !== -1'>-->
        <!--          Classcipe Drive-->
        <!--        </a-radio-button>-->
        <a-radio-button :value="DriveType.Youtube" v-if='filterTabTypeList.indexOf(DriveType.Youtube) !== -1'>
          Youtube
        </a-radio-button>
        <a-radio-button :value="DriveType.GoogleImage" v-if='filterTabTypeList.indexOf(DriveType.GoogleImage) !== -1'>
          Google Image
        </a-radio-button>
        <a-radio-button :value="DriveType.GoogleDrive" v-if='filterTabTypeList.indexOf(DriveType.GoogleDrive) !== -1'>
          Google Drive
        </a-radio-button>
        <a-radio-button :value="DriveType.UploadVideo" v-if='filterTabTypeList.indexOf(DriveType.UploadVideo) !== -1'>
          Upload Video
        </a-radio-button>
        <a-radio-button :value="DriveType.UploadImage" v-if='filterTabTypeList.indexOf(DriveType.UploadImage) !== -1'>
          Upload Image
        </a-radio-button>
      </a-radio-group>
    </div>
    <div class='drive-content'>
      <div v-show='currentDriveType === DriveType.ClasscipeDrive'>
        <drive v-bind='$attrs' :field='field' :filter-type='filterType'/>
      </div>
      <div v-show='currentDriveType === DriveType.Youtube'>
        <youtube
          v-bind='$attrs'
          :content-id='contentId'
          :content-type='contentType'
          :field='field' />
      </div>
      <div v-show='currentDriveType === DriveType.GoogleImage'>
        <google-image
          v-bind='$attrs'
          :content-id='contentId'
          :content-type='contentType'
          :field='field' />
      </div>
      <div v-show='currentDriveType === DriveType.GoogleDrive'>
        <google-drive
          v-bind='$attrs'
          :field='field'
          :drive-process='driveProcess'
          @show-google-drive='handleShowGoogleDrive' />
      </div>
      <div v-show='currentDriveType === DriveType.UploadVideo'>
        <drive-video-uploader
          v-bind='$attrs'
          :content-id='contentId'
          :content-type='contentType'
          :field='field' />
      </div>
      <div v-show='currentDriveType === DriveType.UploadImage'>
        <drive-image-uploader
          v-bind='$attrs'
          :content-id='contentId'
          :content-type='contentType'
          :field='field' />
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
import DriveVideoUploader from '@/components/Common/DriveVideoUploader'
import DriveImageUploader from '@/components/Common/DriveImageUploader'

export default {
  name: 'ClasscipeDrive',
  components: { DriveImageUploader, DriveVideoUploader, GoogleDrive, GoogleImage, Youtube, Drive },
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
    field: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      DriveType: DriveType,
      currentDriveType: this.filterType === 'image' ? DriveType.UploadImage : DriveType.UploadVideo,
      driveProcess: 0,
      filterTabTypeList: this.filterType === 'image' ? [
        DriveType.ClasscipeDrive,
        DriveType.GoogleImage,
        DriveType.GoogleDrive,
        DriveType.UploadImage
      ] : [
        DriveType.ClasscipeDrive,
        DriveType.Youtube,
        DriveType.GoogleDrive,
        DriveType.UploadVideo
      ]
    }
  },
  created() {
    console.info(`ClasscipeDrive field ${this.field} filter type ${this.filterType} contentId ${this.contentId}`)
  },
  methods: {
    driveTypeChange() {
      console.info('driveTypeChange', this.currentDriveType)
      this.handleShowGoogleDrive()
    },

    handleShowGoogleDrive() {
      console.info(`handleShowGoogleDrive filterType ${this.filterType}`)
      if (this.currentDriveType === this.DriveType.GoogleDrive) {
        GooglePicker.init(
          (progress) => {
            this.driveProcess = progress
          },
          (type, url, mediaType, name, size) => {
            console.log('GooglePicker success url', url)
            if (url) {
              console.info('GooglePicker addDrive done', url, mediaType, ClasscipeDriveEvent)
              this.$EventBus.$emit(ClasscipeDriveEvent.INSERT_GOOGLE_DRIVE, {
                data: url,
                mediaType,
                field: this.field,
                name: name,
                size: size
              })
            }
            this.driveProcess = 0
          },
          this.$store.getters.userInfo.id,
          this.filterType,
          this.contentType,
          this.contentId
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
