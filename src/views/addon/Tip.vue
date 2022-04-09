<template>
  <div class="task-tip">
    <template v-if="taskLoading">
      <div class="loading-task">
        <img src="~@/assets/newBrowser/loading.gif" />
      </div>
    </template>
    <template v-if="!taskLoading">
      <div class="tip-content">
        <a-textarea
          placeholder="Insert tip for the slide"
          :autosize="{ minRows: 4, maxRows: 5 }"
          allow-clear
          v-model="tip_text"
        />
        <a-col class="tip-row">
          <upload-enter-for-tip />
        </a-col>
        <a-col class="tip-row">
          <div class="carousel-page">
            <div class="img-list-wrapper">
              <div class="img-list">
                <div class="img-item" v-for="(item, index) in videoUrlList" :key="'index' + index">
                  <div class="img-box">
                    <video
                      class="img-item"
                      :src="item.contentUrl"
                      v-if="'video'.includes(item.type) > -1"
                      muted
                      controls
                    ></video>
                    <iframe
                      v-if="'iframe'.includes(item.type) > -1"
                      id="item_player"
                      width="260px"
                      height="150px"
                      :src="item.url"
                      title="YouTube video player"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                      allowfullscreen
                    ></iframe>
                    <div class="delete_btn">
                      <img
                        src="~@/assets/icons/addMaterial/morshanchu.png"
                        class="shanchu-icon"
                        alt=""
                        @click="deleteVideo(index)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-col>
        <a-col class="tip-button">
          <a-button class="btn" @click="confirm()" type="primary">
            Confirm to add
          </a-button>
        </a-col>
      </div>
    </template>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import OpenDirSvg from '@/assets/svgIcon/library/open_dir.svg?inline'
import GoogleDriveIcon from '@/assets/svgIcon/addMaterial/google_drive.svg?inline'
import YoutubeIcon from '@/assets/svgIcon/addMaterial/youtube.svg?inline'
import UploadEnterForTip from '@/components/AddMaterial/UploadEnterForTip'
import { AddMaterialEventBus, ModalEventsNameEnum } from '@/components/AddMaterial/AddMaterialEventBus'
import { addElement, queryElementById, updateElement } from '@/api/addMaterial'
export default {
  name: 'Tip',
  components: {
    UploadEnterForTip,
    GoogleDriveIcon,
    OpenDirSvg,
    YoutubeIcon
  },
  props: {
    taskId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      taskLoading: false,
      tip_text: '',
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
      videoUrlList: [
        { type: 'iframe', url: 'https://www.youtube.com/embed/fdqNKul2hAA?showinfo=0&modestbranding=1&rel=0' },
        { type: 'iframe', url: 'https://www.youtube.com/embed/eEsVfVay64M?start=100&end=652' }
        // { contentUrl: 'https://i.ytimg.com/vi/gya34uYDKXM/mqdefault.jpg' },
        // { contentUrl: 'https://i.ytimg.com/vi/o3LLz5sg4oI/mqdefault.jpg' },
        // { contentUrl: 'https://i.ytimg.com/vi/gya34uYDKXM/mqdefault.jpg' },
        // { contentUrl: 'https://i.ytimg.com/vi/o3LLz5sg4oI/mqdefault.jpg' },
        // { contentUrl: 'https://i.ytimg.com/vi/o3LLz5sg4oI/mqdefault.jpg' }
      ]
    }
  },
  created() {
    logger.info('created ', this.taskId)
    // addMaterial事件处理
    AddMaterialEventBus.$on(ModalEventsNameEnum.ADD_MEDIA_FOR_TIP, url => {
      this.addMaterialList(url)
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
      window.parent.postMessage(JSON.stringify({
        from: 'addon',
        event: 'tip-loaded',
        data: null
      }), '*')
    }
  },
  methods: {
    getTipInfo() {
      var param = {}
      param.pageId = 'g1122e959211_0_0'
      param.slideId = '1yDugYGGpnYpnirssemu-dUdYsx87Dt-QHHV9hRB5IWU'
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
              this.videoUrlList = eles[j].data.urls
              break
            }
          }
        })
        .finally(() => {})
    },
    deleteVideo(index) {
      this.videoUrlList.splice(index, 1)
    },
    addMaterialList({ url, type }) {
      this.$logger.info('addMaterialList', url, type)
      this.videoUrlList.push({ tpye: type, url: url })
    },
    confirm() {
      if (this.tip_text.length < 1) {
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
        })
      } else {
        addElement(this.param)
          .then(response => {
            logger.info('addElement ', response)
          })
          .finally(() => {})
      }
      // 通知Google addon 关闭页面,如果有变更提示附带最新的task数据
      if (window.parent) {
        const formJson = JSON.stringify(this.form)
        window.parent.postMessage(JSON.stringify({
          from: 'addon',
          event: 'close',
          data: formJson === this.oldFormData ? null : formJson
        }), '*')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/components/index.less';
.task-tip {
  height: 100%;
  width: 920px;
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
    height: 100%;
    width: 100%;
    padding: 50px;
    justify-content: center;
    align-items: center;

    .tip-row {
      margin-top: 20px;
    }
    .tip-img-item {
      margin-right: 10px;
      margin-top: 20px;
    }
    .tip-button {
      text-align: center;
      .btn {
        margin: 50px auto;
        background: #15c39a;
        border-radius: 28px;
      }
    }
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
            border-radius: 15px;
            width: 30px;
            height: 30px;
            background: #fff;
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
