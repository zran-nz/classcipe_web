<template>
  <div class="media-enter">
    <a-space>
      <a-tooltip title="Classcipe drive" placement="top">
        <div class="upload-type-item">
          <div class="remark-button-outer">
            <img @click="openClasscipeDrive" src="~@/assets/icons/addMaterial/video.png" class="remark-button" alt="" />
          </div>
        </div>
      </a-tooltip>
      <a-tooltip title="my computer" placement="top">
        <div class="upload-type-item">
          <open-dir-svg class="opened" />
          <common-upload accept="video/*" :onSuccess="onSuccess" />
        </div>
      </a-tooltip>
      <a-tooltip title="google drive" placement="top">
        <div class="upload-type-item">
          <google-drive-icon @click="addDrive" class="svg-icon" />
        </div>
      </a-tooltip>
      <a-tooltip title="youtube" placement="top">
        <div class="upload-type-item">
          <youtube-icon @click="addYoutube" class="svg-icon" />
        </div>
      </a-tooltip>
    </a-space>

    <a-modal
      :visible.sync="showYoutube"
      @cancel="closeYoutubeDialog"
      :append-to-body="true"
      :destroy-on-close="false"
      :footer="null"
      width="90%"
    >
      <google-youtube-video ref="googleyoutubevideo" :nextYoutube="nextYoutube" />
    </a-modal>
    <a-modal
      :visible.sync="showClasscipeDrive"
      @cancel="closeClasscipeDriveDialog"
      :append-to-body="true"
      :destroy-on-close="false"
      :footer="null"
      width="90%"
    >
      <classcipe-drive :insertClasscipeFile="insertClasscipeFile" />
    </a-modal>
    <div class="material-recorder">
      <common-progress :progress="driveUpLoadProgress" :cancel="cancelUpDrive" />
    </div>
  </div>
</template>
<script>
import { ModalEventsNameEnum, ModalEventsTypeEnum, AddMaterialEventBus } from './AddMaterialEventBus'
import GoogleDriveIcon from '@/assets/svgIcon/addMaterial/google_drive.svg?inline'
import YoutubeIcon from '@/assets/svgIcon/addMaterial/youtube.svg?inline'
import OpenDirSvg from '@/assets/svgIcon/library/open_dir.svg?inline'
import GooglePicker from './Utils/GooglePicker'
import { uploadImageToFirebaseByUrl } from './Utils/Common'
// import GoogleYoutubeVedio from './googleYoutubeVedio.vue'
import { videoTypes, audioTypes } from './Utils/Constants'
// import MetarialWebSite from './metarialWebSite.vue'
import CommonUpload from './Common/CommonUpload'
import CommonProgress from './Common/CommonProgress'
import ClasscipeDrive from '@/components/AddMaterial/ClasscipeDrive/ClasscipeDrive'
import GoogleYoutubeVideo from '@/components/AddMaterial/Google/GoogleYoutubeVideo'
export default {
  components: {
    GoogleYoutubeVideo,
    GoogleDriveIcon,
    YoutubeIcon,
    OpenDirSvg,
    // GoogleYoutubeVedio,
    ClasscipeDrive,
    CommonUpload,
    CommonProgress
  },
  data() {
    return {
      fileList: [],
      showYoutube: false,
      showClasscipeDrive: false,
      youtubeUrl: '',
      withKeyUrl: '',
      showIframe: false,
      showImageSearch: false,
      imagesList: [],
      imageName: '',
      imageSelectedIndex: -1,
      destroyOnClose: true,
      recordType: null,
      ModalEventsTypeEnum,
      ModalEventsNameEnum,
      driveUpLoadProgress: 0
    }
  },
  mounted() {},
  methods: {
    onSuccess(file, result) {
      console.log(file.name)
      const nameList = file.type.split('/')
      const fileNameList = file.name.split('.')
      let name = ''
      try {
        name = fileNameList[fileNameList.length - 1] || nameList[1]
      } catch (e) {}
      name = name.toLocaleLowerCase()
      let type = 'image'
      if (videoTypes.indexOf(name) > -1) {
        type = 'video'
      } else if (audioTypes.indexOf(name) > -1) {
        type = 'audio'
      }
      AddMaterialEventBus.$emit(ModalEventsNameEnum.ADD_MEDIA_FOR_TIP, {
        type,
        url: result
      })
    },
    addYoutube() {
      this.showYoutube = true
    },
    nextYoutube(videoItem) {
      if (videoItem) {
        AddMaterialEventBus.$emit(ModalEventsNameEnum.ADD_MEDIA_FOR_TIP, {
          type: 'iframe',
          url: videoItem.link
        })
        this.showYoutube = false
      }
    },
    insertClasscipeFile(fileItem) {
      if (fileItem) {
        AddMaterialEventBus.$emit(ModalEventsNameEnum.ADD_MEDIA_FOR_TIP, {
          type: 'video',
          url: fileItem.baseFileUrl + fileItem.filePath
        })
      }
      this.showClasscipeDrive = false
    },
    openClasscipeDrive() {
      this.showClasscipeDrive = true
    },
    closeClasscipeDriveDialog() {
      this.showClasscipeDrive = false
    },
    closeYoutubeDialog() {
      this.youtubeUrl = null
      this.withKeyUrl = null
      this.showIframe = false
      this.showYoutube = false
    },
    addDrive() {
      GooglePicker.init(
        driveUpLoadProgress => {
          this.driveUpLoadProgress = driveUpLoadProgress
        },
        (type, url, mediaType) => {
          if (url) {
            this.$logger.info('addDrive done', url, mediaType)
            AddMaterialEventBus.$emit(ModalEventsNameEnum.ADD_NEW_MEDIA, {
              type: mediaType.indexOf('image') > -1 ? 'image' : 'video',
              url: url
            })
          }
          this.$nextTick(() => {
            this.driveUpLoadProgress = 0
          })
        }
      )
    },
    cancelUpDrive() {},
    searchImage() {
      if (this.imageName) {
        this.load()
      }
    },
    load() {
      fetch(
        `https://www.googleapis.com/customsearch/v1?key=AIzaSyBwZ7igOKSCZ8nitWRvR_oZIO198pBs7jQ&cx=f0726c917433f216e&q=${this.imageName}&fileType=png,jpg&searchType=image&alt=json`,
        {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8'
          }
        }
      )
        .then(response => {
          // // console.log(d)
          return response.json()
        })
        .then(d => {
          // console.log(d.items)
          if (d.items.length > 0) {
            this.imagesList = d.items
          }
        })
        .catch(() => {})
    },
    selectImage(index) {
      this.imageSelectedIndex = index
    },
    doneSelect(imageUrl) {
      uploadImageToFirebaseByUrl(imageUrl)
        .then(url => {
          this.$logger.info('uploadImageToFirebaseByUrl', url)
          AddMaterialEventBus.$emit(ModalEventsNameEnum.ADD_NEW_MEDIA, {
            type: 'image',
            url
          })
          this.closeImageSearch()
        })
        .catch(e => {
          console.log(e)
          this.$logger.warn('uploadImageToFirebaseByUrl', e)
          this.closeImageSearch()
          this.$message.error('The image you selected is not available')
        })
    },
    closeImageSearch() {
      this.imageSelectedIndex = -1
      this.showImageSearch = false
      this.imagesList = []
      this.imageName = ''
    },
    addGoogleImage() {
      this.showImageSearch = true
    },
    video() {
      this.recordType = ModalEventsTypeEnum.VIDEO
    }
  }
}
</script>
<style scoped>
.media-enter {
  color: #36425a;
  font-weight: bold;
  cursor: pointer;
  font-size: 14px;
  position: relative;
}
.add-material-label {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.add-material-icon {
  width: 25px;
}
.remark-button {
  width: 32px;
  height: 32px;
}
.svg-icon {
  width: 32px;
  height: 32px;
  color: #15c39a;
}
.remark-button-outer {
  width: 32px;
}
.upload-type-item {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 32px;
}
.material-recorder {
  position: absolute;
  right: -250px;
  top: 0;
}
</style>
