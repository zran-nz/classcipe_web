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
          :autosize="{ minRows: 4, maxRows: 8 }"
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
                <div class="img-item" v-for="(item, index) in thumbnailList" :key="'index' + index">
                  <img :src="item.contentUrl" />
                </div>
              </div>
            </div>
          </div>
        </a-col>

        <a-button class="btn" type="primary">
          Confirm
        </a-button>
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
      thumbnailList: [
        { contentUrl: 'https://i.ytimg.com/vi/gya34uYDKXM/mqdefault.jpg' },
        // { contentUrl: 'https://i.ytimg.com/vi/o3LLz5sg4oI/mqdefault.jpg' },
        // { contentUrl: 'https://i.ytimg.com/vi/gya34uYDKXM/mqdefault.jpg' },
        // { contentUrl: 'https://i.ytimg.com/vi/o3LLz5sg4oI/mqdefault.jpg' },
        // { contentUrl: 'https://i.ytimg.com/vi/gya34uYDKXM/mqdefault.jpg' },
        // { contentUrl: 'https://i.ytimg.com/vi/o3LLz5sg4oI/mqdefault.jpg' },
        { contentUrl: 'https://i.ytimg.com/vi/o3LLz5sg4oI/mqdefault.jpg' }
      ]
    }
  },
  created() {
    logger.info('created ', this.taskId)
  },
  methods: {}
}
</script>

<style lang="less" scoped>
@import '~@/components/index.less';
.task-tip {
  height: 100%;
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
    }
    .btn {
      margin-top: 50px;
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
  display: flex;
  height: 144px;
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

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
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;

    .img-list {
      margin-right: -10px;
      cursor: pointer;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;

      .img-item {
        height: 120px;
        border: 2px solid #fff;
        box-shadow: 0 4px 8px 0 rgba(31, 33, 44, 10%);
        margin-right: 10px;

        img {
          height: 100%;
        }
      }

      .img-item:nth-last-child(1) {
        margin-right: 0;
      }

      .active-img-item {
        border: 2px solid #15c39a;
        box-shadow: 0 0 3px 3px #15c39a1a;
      }
    }
  }
}
</style>
