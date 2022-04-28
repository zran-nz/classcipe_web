<template>
  <div class="task-tip">
    <template v-if="currentTemp == tempInfo.main">
      <a-spin :tip="uploadText" :spinning="!canUpload">
        <div class="tip-content">
          <a-row class="tip-context">
            <a-col :span="choiceItem?12:24">
              <div>
                <span class="span">Text Tip</span>
                <a-textarea
                  placeholder="Insert tip for the slide"
                  :autoSize="{ minRows: 4, maxRows: 5 }"
                  v-model="tip_text"
                  @change="updateTip"
                />
              </div>

              <div class="upvideo-row">
                <span class="span">Vedio Tip</span>
                <upload-enter-for-tip
                  :uploadProgress="uploadProgress"
                  :choiceFileType="choiceFileType"
                  :googleOriginUrl="googleOriginUrl"
                />
              </div>
              <div :span="12" class="tip-row">
                <div class="carousel-page">
                  <div class="img-list-wrapper">
                    <div class="img-list">
                      <div class="img-item" v-for="(item, index) in videoUrlList" :key="'index' + index">
                        <div class="img-box">
                          <video
                            width="340px"
                            height="190px"
                            :src="item.url"
                            v-if="isVideoType(item, 'video')"
                            preload="auto"
                            controls
                          ></video>
                          <iframe
                            width="340px"
                            height="190px"
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
              </div>
            </a-col>
            <a-col :span="12" v-if="choiceItem">
              <div class="right-answer-content" >
                <span class="span">Correct Answer</span>
                <div v-for="(item, index) in choiceItem.data.data.options" :key="index" class="checktext checkitem">
                  <input
                    type="checkbox"
                    v-model="rightAnswers"
                    @change="handleCheckedChange"
                    :value="item.id"
                    class="tipscheck"
                  />
                  <p class="checktextbox" :title="item.text">
                    {{ item.text }}
                  </p>
                </div>
              </div>
            </a-col>
          </a-row>
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
  data() {
    return {
      rightAnswers: [],
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
        data: {
          type: 'tip',
          urls: '',
          tip: '',
          source: 'add-on'
        }
      },
      videoUrlList: [],
      canUpload: true,
      tipData: {},
      choiceItem: {},
      googleOriginUrl: 'https://dev.frontend.classcipe.com/'
    }
  },
  watch: {
    fileProgress() {
      this.uploadText = 'Uploading...' + Math.floor(this.fileProgress)
    }
  },
  created() {
    // addMaterial事件处理
    AddMaterialEventBus.$on(ModalEventsNameEnum.ADD_MEDIA_FOR_TIP, url => {
      this.addMaterialList(url)
    })
    AddMaterialEventBus.$on(ModalEventsNameEnum.IS_UPLOAD, flag => {
      console.log('ModalEventsNameEnum.IS_UPLOAD', flag)
      this.canUpload = flag
      this.sendMsgToParent(flag, 'canUpload')
    })
    const _this = this
    window.addEventListener(
      'message',
      function(e) {
        // console.log('tip window.addEventListener', e.data, e)
        try {
          const data = JSON.parse(e.data)
          _this.initTipData(data)
        } catch (error) {
          console.log(error)
        }
      },
      false
    )
  },
  mounted() {
    if (window.parent) {
      console.log('window.parent', window.parent)
      window.parent.postMessage(
        JSON.stringify({
          from: 'form',
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
    initTipData(data) {
      console.log('initTipData', data)
      if (data.from === 'classroom' && data.event === 'sendtipData') {
        if (data.data) {
          const { elements, items } = data.data
          const tipItemIndex = elements.findIndex(ele => ele.data.type === 'tip')
          if (tipItemIndex > -1) {
            this.tipData = elements[tipItemIndex].data
            this.tip_text = this.tipData.tip ? this.tipData.tip : ''
            this.videoUrlList = this.tipData.urls ? this.tipData.urls : []
          } else {
            this.tip_text = ''
            this.videoUrlList = []
            this.tipData = {}
          }
          this.currentTemp = this.tempInfo.main

          const itemIndex = items.findIndex(item => item.type === 'choice')
          this.choiceItem = items[itemIndex] ? items[itemIndex] : null
          if (this.choiceItem) {
            this.setRightAnswers()
          }

          console.log('this.choiceItem', itemIndex, this.choiceItem)
        }
      }
    },
    setRightAnswers() {
      const currentItem = this.choiceItem.data
      console.log('currentItem', currentItem)
      if (currentItem) {
        const { type } = currentItem
        if (type === 'choice') {
          const options = currentItem.data.options
          this.rightAnswers = options.filter(item => item.isAnswer).map(item => item.id)
          console.log(this.rightAnswers)
        }
      }
    },
    handleCheckedChange() {
      // 单选题
      if (!this.choiceItem.data.data.isMulti) {
        this.rightAnswers = [this.rightAnswers[this.rightAnswers.length - 1]]
      }
      logger.info('this.rightAnswers ', this.rightAnswers)
      this.sendMsgToParent(this.rightAnswers, 'changeAnswer')
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
    isVideoType(item, type) {
      console.log('item', item, type)
      if (item.type === type || item.tpye === type) {
        return true
      }
      return false
    },
    deleteVideo(index) {
      this.videoUrlList.splice(index, 1)
      this.updateTip()
    },
    addMaterialList({ url, type }) {
      this.$logger.info('addMaterialList', url, type)
      if (this.videoUrlList === null) {
        this.videoUrlList = []
      }
      this.videoUrlList.push({ type: type, url: url })
      this.updateTip()
    },
    updateTip() {
      this.tipData.tip = this.tip_text
      this.tipData.urls = this.videoUrlList
      console.log('updateTip', this.tipData)
      this.sendMsgToParent(this.tipData, 'updateTip')
    },
    sendMsgToParent(data, event) {
      // 通知课堂更新tip内容
      if (window.parent) {
        window.parent.postMessage(
          JSON.stringify({
            from: 'form',
            event: event,
            data: data
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
.span {
  font-size: 18px;
  font-family: Arial;
  font-weight: bold;
  color: #000000;
  line-height: 40px;
  margin-right: 20px;
}
.task-tip {
  width: 760px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  .loading-task {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tip-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 760px;
    padding: 10px;
    justify-content: center;
    .upvideo-row {
      margin-top: 20px;
      display: flex;
      flex-direction: row;
    }
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
.radioStyle {
  display: 'flex';
  height: '30px';
  line-height: '30px';
}

.carousel-page {
  height: 300px;
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
        height: 190px;
        width: 360px;
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

.right-answer-content{
  margin-left: 20px;
}
.checktext {
  font-size: 14px;
  font-family: Inter-Bold;
  color: #11142d;
}
.tipscheck {
  width: 14px;
  height: 14px;
  position: relative;
}
.tipscheck::before {
  position: absolute;
  top: 0;
  background-color: #fff;
  color: #fff;
  width: 14px;
  height: 14px;
  display: inline-block;
  visibility: visible;
  padding-left: 0px;
  text-align: center;
  content: ' ';
  border-radius: 1px;
  border: 1px solid rgba(112, 112, 112, 0.2);
}

.tipscheck:checked::before {
  background-color: rgba(21, 195, 154, 1);
  border: 1px solid rgba(21, 195, 154, 1);
}
.tipscheck:checked::after {
  content: '';
  position: absolute;
  top: 1px;
  left: 5px;
  width: 3px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
.ppt-tips-item-checklist {
  padding: 12px 0 0 12px;
  flex: 1;
}
.checkitem {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}
.checktextbox {
  width: 100%;
  // height: 20px;
  background-color: rgba(245, 245, 245, 0.5);
  margin-left: 7px;
  box-sizing: border-box;
  text-align: left;
  padding-left: 7px;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
}
</style>
