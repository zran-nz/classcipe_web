<template>
  <div class="page">
    <div class="drive-title">
      Classcipe Drive
    </div>
    <div>
      <a-input-search
        placeholder="Search"
        size="large"
        class="search-input"
        v-model="keywords"
        @search="searchVideo"
        @pressEnter="searchVideo"
      >
      </a-input-search>
    </div>
    <a-col class="tip-row">
      <div class="carousel-page">
        <div class="video-list-wrapper">
          <div v-if="fileList.length == 0" class="video-text">
            no data
          </div>
          <div class="video-list" v-else>
            <a-radio-group  class="video-list" v-model:value="chooseVideoId">
              <div
                class="video-item"
                :class="{ active: chooseVideoId === item.id }"
                v-for="(item, index) in fileList"
                :key="'index' + index"
              >
                <div class="img-box" @click="choiceItem(item)">
                  <!-- <video width="340" height="190" :src="item.filePath" preload="auto" controls></video> -->
                  <iframe
                    width="340px"
                    height="190px"
                    id="item_player"
                    :src="item.filePath"
                    :title="item.title"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                    allowfullscreen
                  ></iframe>
                  <a-radio :value="item.id">{{
                    showFileName(decodeURIComponent(item.fileName))
                  }}</a-radio>
                </div>
              </div>
            </a-radio-group>
          </div>
        </div>
      </div>
    </a-col>
    <a-col class="col-button">
      <div class="selected-action">
        <div class="modal-ensure-action-line-center">
          <a-space>
            <a-button class="action-item action-cancel" shape="round" @click="cancel">Cancel</a-button>
            <a-button
              class="action-ensure action-item"
              type="primary"
              shape="round"
              @click="confirm"
              :disabled="chooseVideoId.length == 0"
            >
              Confirm
            </a-button>
          </a-space>
        </div>
      </div>
    </a-col>
  </div>
</template>
<script>
import { FileRecord } from '@/api/material'
export default {
  props: {
    insertClasscipeFile: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      chooseVideoId: '',
      chooseItem: null,
      baseFileUrl: 'https://dcdkqlzgpl5ba.cloudfront.net/',
      fileList: [],
      videoUrlList: [],
      keywords: ''
    }
  },

  created() {},
  watch: {},
  mounted() {
    this.$logger.info(this.videoId, 'watch videoId')
    this.getFileRecord()
  },
  methods: {
    searchVideo() {
      console.log('searchVideo', this.keywords)
      this.getFileRecord(this.keywords)
    },
    getFileRecord(keywords) {
      const param = { uploadType: 2, pageSize: 20 }
      if (keywords) {
        param.keywords = keywords
      }
      FileRecord(param).then(response => {
        this.$logger.info('FileRecord ', response.result)
        if (response.result && response.result.records) {
          this.fileList = response.result.records
          // this.fileList = this.fileList.filter(item => videoTypes.indexOf(item.suffix) > -1)
          // for (let i = 0; i < this.fileList.length; i++) {
          //   if (this.fileList[i].filePath.indexOf('https://') === -1) {
          //     this.fileList[i].filePath = this.baseFileUrl + this.fileList[i].filePath
          //   }
          // }
        }
      })
    },
    choiceItem(item) {
      this.$logger.info(item)
      this.chooseVideoId = item.id
      this.chooseItem = item
    },
    confirm() {
      this.$logger.info('confirm')
      if (this.chooseItem != null) {
        this.insertClasscipeFile(this.chooseItem)
      }
    },
    cancel() {
      this.insertClasscipeFile()
    },
    showFileName(fileName) {
      if (fileName.length > 30) {
        return fileName.substring(0, 27) + '...'
      } else {
        return fileName
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/components/index.less';
.tip-row {
  margin-top: 20px;
}
.page {
  width: 740px;
  margin: auto;
  display: flex;
  justify-content: center;
  flex-flow: column;
}
.drive-title {
  height: 23px;
  font-size: 24px;
  font-family: Arial;
  font-weight: bold;
  color: #000000;
  line-height: 40px;
  margin-bottom: 36px;
  margin-left: 10px;
}
.search-input {
  margin-left: 10px;
  width: 400px;
  flex: 1;
}
.carousel-page {
  height: 360px;
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

  .video-list-wrapper {
    width: 100%;
    .video-text {
      margin-top: 200px;
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ababab;
      line-height: 32px;
      text-align: center;
      align-items: center;
    }
    .video-list {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .video-item {
        height: 230px;
        width: 364px;
        border: 1px solid #fff;
        padding: 12px;
        &.active {
          border: 2px solid @primary-color;
        }
      }
    }
  }
}
.col-button {
  margin-top: 20px;
  text-align: center;
}
</style>
