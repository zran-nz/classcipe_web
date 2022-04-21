<template>
  <div class="task-tip">
    <template v-if="currentTemp == tempInfo.main">
      <a-spin :tip="uploadText" :spinning="!canUpload">
        <div class="tip-content">
          <a-textarea
            placeholder="Insert tip for the slide"
            :autoSize="{ minRows: 4, maxRows: 5 }"
            v-model="tip_text"
          />
          <a-col :span="24" class="tip-row">
            <upload-enter-for-tip :uploadProgress="uploadProgress" :choiceFileType="choiceFileType" />
          </a-col>
          <a-col class="tip-row">
            <div class="carousel-page">
              <div class="img-list-wrapper">
                <div class="img-list">
                  <div class="img-item" v-for="(item, index) in videoUrlList" :key="'index' + index">
                    <div class="img-box">
                      <video
                        width="260px"
                        height="150px"
                        :src="item.url"
                        v-if="isVideoType(item, 'video')"
                        preload="auto"
                        controls
                      ></video>
                      <iframe
                        width="260px"
                        height="150px"
                        v-if="isVideoType(item, 'iframe')"
                        id="item_player"
                        :src="item.url"
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                        allowfullscreen
                      ></iframe>
                      <div class="delete_btn" @click="deleteVideo(index)">
                        <delete-btn class="del-icon" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-col>
          <a-col class="tip-button">
            <div class="selected-action">
              <div class="modal-ensure-action-line-center">
                <a-space>
                  <a-button class="action-item action-cancel" shape="round" @click="cancel">Cancel</a-button>
                  <a-button
                    class="action-ensure action-item"
                    type="primary"
                    shape="round"
                    @click="confirm"
                    :disabled="tip_text.length == 0 && videoUrlList.length == 0 && canUpload"
                  >
                    Confirm
                  </a-button>
                </a-space>
              </div>
            </div>
          </a-col>
        </div>
      </a-spin>
    </template>
    <template v-else-if="currentTemp == tempInfo.classcipeDirve">
      <classcipe-drive :insertClasscipeFile="insertClasscipeFile" />
    </template>
    <template v-else-if="currentTemp == tempInfo.youtube">
      <google-youtube-video ref="googleyoutubevideo" :nextYoutube="nextYoutube" />
    </template>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import DeleteBtn from '@/assets/svgIcon/tip/delete_btn.svg?inline'
import UploadEnterForTip from '@/components/AddMaterial/UploadEnterForTip'
import { AddMaterialEventBus, ModalEventsNameEnum } from '@/components/AddMaterial/AddMaterialEventBus'
import { addElement, queryElementById, updateElement } from '@/api/addMaterial'
import ClasscipeDrive from '@/components/AddMaterial/ClasscipeDrive/ClasscipeDrive'
import GoogleYoutubeVideo from '@/components/AddMaterial/Google/GoogleYoutubeVideo'
export default {
  name: 'Tip',
  components: {
    UploadEnterForTip,
    DeleteBtn,
    ClasscipeDrive,
    GoogleYoutubeVideo
  },
  props: {
    slideId: {
      type: String,
      required: true
    },
    pageId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      currentTemp: 0,
      tempInfo: {
        main: 0,
        classcipeDirve: 1,
        youtube: 2
      },
      taskLoading: false,
      tip_text: '',
      uploadText: 'Uploading...',
      fileProgress: 0,
      tip_id: 0,
      param: {
        slide_id: '1yDugYGGpnYpnirssemu-dUdYsx87Dt-QHHV9hRB5IWU',
        page_id: 'g1122e959211_0_0',
        data: {
          type: 'tip',
          urls: '',
          tip: '',
          source: 'add-on',
          totalTime: 0
        }
      },
      videoUrlList: [],
      canUpload: true
    }
  },
  watch: {
    fileProgress() {
      this.uploadText = 'Uploading...' + Math.floor(this.fileProgress)
    }
  },
  created() {
    logger.info('created ', this.pageId, this.slideId)
    this.param.slide_id = this.slideId
    this.param.page_id = this.pageId
    // addMaterial事件处理
    AddMaterialEventBus.$on(ModalEventsNameEnum.ADD_MEDIA_FOR_TIP, url => {
      this.addMaterialList(url)
    })
    AddMaterialEventBus.$on(ModalEventsNameEnum.IS_UPLOAD, flag => {
      console.log('ModalEventsNameEnum.IS_UPLOAD', flag)
      this.canUpload = flag
    })
    window.addEventListener(
      'message',
      function(e) {
        console.log('window.addEventListener', e)
        console.log('e.data.scrollTop', e.data.scrollTop)
        console.log('e.data.windowHeight', e.data.windowHeight)
      },
      false
    )
  },
  mounted() {
    this.getTipInfo()
    if (window.parent) {
      window.parent.postMessage(
        JSON.stringify({
          from: 'addon',
          event: 'tip-loaded',
          data: null
        }),
        '*'
      )
    }
  },
  methods: {
    uploadProgress(fileProgress) {
      console.log('uploadProgress', fileProgress)
      this.fileProgress = fileProgress
    },
    choiceFileType(type) {
      if (type === 1) {
        this.currentTemp = this.tempInfo.classcipeDirve
      } else if (type === 2) {
        this.currentTemp = this.tempInfo.youtube
      }
    },
    insertClasscipeFile(fileItem) {
      if (fileItem) {
        this.addMaterialList({
          type: 'video',
          url: fileItem.filePath
        })
      }
      this.currentTemp = this.tempInfo.main
    },
    nextYoutube(videoItem) {
      if (videoItem) {
        this.addMaterialList({
          type: 'iframe',
          url: videoItem.link
        })
      }
      this.currentTemp = this.tempInfo.main
    },
    getTipInfo() {
      var param = {}
      param.pageId = this.pageId
      param.slideId = this.slideId
      queryElementById(param)
        .then(response => {
          logger.info('queryElementById ', response.result)
          const eles = response.result
          for (let j = 0; j < eles.length; j++) {
            logger.info('eles ', eles[j])
            if (eles[j].data.type === 'tip') {
              this.tip_id = eles[j].id
              this.tip_text = eles[j].data.tip
              this.param.data = eles[j].data
              if (eles[j].data.urls) {
                this.videoUrlList = eles[j].data.urls
              }
              break
            }
          }
        })
        .finally(() => {})
    },
    isVideoType(item, type) {
      console.log('item', item, type)
      if (item.type === type || item.tpye === type) {
        return true
      }
      return false
    },
    deleteVideo(index) {
      this.videoUrlList.splice(index, 1)
    },
    addMaterialList({ url, type }) {
      this.$logger.info('addMaterialList', url, type)
      if (this.videoUrlList === null) {
        this.videoUrlList = []
      }
      this.videoUrlList.push({ type: type, url: url })
    },
    cancel() {
      this.closeAddonWindow()
    },
    confirm() {
      if (this.tip_text.length < 1 && this.videoUrlList.length < 1) {
        this.$message.warn('Insert tip for the slide!')
        return
      }
      this.param.data.tip = this.tip_text
      this.param.data.urls = this.videoUrlList
      console.log('param', this.param, this.tip_id)
      if (this.tip_id > 0) {
        this.param.id = this.tip_id
        updateElement(this.param).then(response => {
          logger.info('updateElement ', response)
          this.closeAddonWindow()
        })
      } else {
        addElement(this.param).then(response => {
          logger.info('addElement ', response)
          this.closeAddonWindow()
        })
      }
    },
    closeAddonWindow() {
      // 通知Google addon 关闭页面
      if (window.parent) {
        window.parent.postMessage(
          JSON.stringify({
            from: 'addon',
            event: 'close',
            data: null
          }),
          '*'
        )
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/components/index.less';
.task-tip {
  width: 100%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  .loading-task {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      height: 200px;
    }
  }
  .tip-content {
    width: 920px;
    display: flex;
    flex-direction: column;
    padding: 50px;
    justify-content: center;
    .tip-row {
      margin-top: 20px;
    }
    .tip-img-item {
      margin-right: 10px;
      margin-top: 20px;
    }
    .tip-button {
      text-align: center;
      margin: 20px;
      .btn1 {
        margin-right: 20px;
      }
      .btn {
        background: #15c39a;
        border-color: #15c39a;
        font-family: Arial;
        font-weight: bold;
        color: #ffffff;
        &:disabled {
          background: #aaaaaa;
          border-color: #aaaaaa;
        }
      }
    }
  }
  .remark-button {
    width: 32px;
    height: 32px;
  }
  .del-icon {
    width: 32px;
    height: 32px;
    padding-top: 4px;
    padding-left: 4px;
    color: rgb(24, 37, 82);
    &:hover {
      color: red;
    }
  }
}

.carousel-page {
  height: 200px;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 3px;
    background: rgba(0, 0, 0, 0);
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.03);
  }

  /* 滚动条滑块 */

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.06);
    -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.04);
  }

  .img-list-wrapper {
    width: 100%;
    .img-list {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;

      .img-item {
        position: relative;
        height: 150px;
        width: 270px;
        border: 1px solid #fff;
        padding: 10px;
        margin-bottom: 20px;
        .img-box {
          position: absolute;
          img {
            height: 100%;
            width: 100%;
          }
          .delete_btn {
            position: absolute;
            width: 31px;
            height: 31px;
            background: #ffffff;
            box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.21);
            border-radius: 50%;
            z-index: 1;
            top: 4px;
            right: 12px;
            padding: 3px;
            .shanchu-icon {
              width: 24px;
              height: 21px;
            }
          }
        }
      }

      .active-img-item {
        border: 1px solid #15c39a;
      }
    }
  }
}
</style>
