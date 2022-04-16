<template>
  <div class="page">
    <a-col class="drive-title">
      Classcipe Drive
    </a-col>
    <a-col class="tip-row">
      <div class="carousel-page">
        <div class="video-list-wrapper">
          <div class="video-list">
            <div
              class="video-item"
              :class="{ active: chooseVideoId === item.id }"
              v-for="(item, index) in fileList"
              :key="'index' + index"
            >
              <div class="img-box" @click="choiceItem(item)">
                <video height="150" width="260" :src="item.filePath" preload="auto" controls></video>
                <div>{{ showFileName(decodeURIComponent(item.fileName)) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-col>
    <a-col class="col-button">
      <a-button class="btn1" @click="cancel()">
        Cancel
      </a-button>
      <a-button class="btn" @click="confirm()" type="primary">
        Confirm
      </a-button>
    </a-col>
  </div>
</template>
<script>
import { FileRecord } from '@/api/material'
import { videoTypes } from '../Utils/Constants'
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
      videoUrlList: []
    }
  },

  created() {},
  watch: {},
  mounted() {
    this.$logger.info(this.videoId, 'watch videoId')
    this.getFileRecord()
  },
  methods: {
    getFileRecord() {
      FileRecord({ fileType: 'video', pageSize: 20 }).then(response => {
        this.$logger.info('FileRecord ', response.result)
        if (response.result && response.result.records) {
          this.fileList = response.result.records
          this.fileList = this.fileList.filter(item => videoTypes.indexOf(item.suffix) > -1)
          for (let i = 0; i < this.fileList.length; i++) {
            if (this.fileList[i].filePath.indexOf('https://') === -1) {
              this.fileList[i].filePath = this.baseFileUrl + this.fileList[i].filePath
            }
          }
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
        return fileName.substring(0, 17) + '...'
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
.drive-title {
  text-align: center;
  color: #36425a;
  font-weight: bold;
  cursor: pointer;
  font-size: 28px;
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

  .video-list-wrapper {
    width: 100%;
    .video-list {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .video-item {
        height: 200px;
        width: 280px;
        border: 1px solid #fff;
        padding: 10px;
        margin: 15px;
        &.active {
          border: 2px solid @primary-color;
        }
      }
    }
  }
}
.col-button {
  text-align: center;
  margin-top: 10px;
}
.btn1 {
  margin-right: 20px;
}
</style>
