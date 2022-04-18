<template>
  <div class="youtube-page">
    <div class="youtube-input-class">
      <img src="~@/assets/icons/material/youtube.png" class="youtube-input-icon" alt="" />

      <a-input-search
        placeholder="Search"
        size="large"
        class="youtube-input"
        v-model="keywords"
        @search="searchVideo"
        @pressEnter="searchVideo"
        :allowClear="true"
      >
      </a-input-search>
    </div>

    <div class="youtube-video-con">
      <a-spin tip="Loading..." :spinning="loading">
        <div v-if="videos.length == 0" class="video-text">
          Search vedio from Youtube
        </div>
        <div
          class="youtube-video-item"
          :class="{ active: chooseVideoId === item.videoId }"
          @click="chooseVideo(item)"
          v-for="(item, index) in videos"
          :key="'video' + index"
          v-else
        >
          <div class="youtube-video-img">
            <template v-if="chooseVideoId === item.videoId">
              <iframe
                :src="item.link"
                frameborder="0"
                allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                class="youtube-video-img"
              />
            </template>
            <template v-else>
              <img class="youtube-video-img" :src="item.thumbnail" />
            </template>
          </div>
          <div class="youtube-video-detail">
            <div class="video-detail-content">
              <div class="video-detail-title">
                {{ item.title }}
              </div>
              <div class="video-detail-desc">
                {{ item.description }}
              </div>
            </div>
            <div class="video-detail-time">
              {{ item.date }}
            </div>
          </div>
        </div>
      </a-spin>
    </div>
    <a-col class="col-button">
      <a-button class="btn1" @click="cancel()">
        Cancel
      </a-button>
      <a-button class="btn" @click="insert" type="primary">
        Confirm
      </a-button>
    </a-col>
  </div>
</template>
<script>
import * as logger from '@/utils/logger'
import { YoutubeQueryByKeywords } from '@/api/material'
export default {
  props: {
    addYoutube: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      keywords: '',
      choose: {},
      chooseVideoId: '',
      videos: [
        // {
        //   link: 'https://www.youtube.com/embed/k5Bgw6-Zj_c?showinfo=0&modestbranding=1&rel=0',
        //   thumbnail: 'https://i.ytimg.com/vi/k5Bgw6-Zj_c/default.jpg',
        //   title: 'ABC',
        //   description:
        //     'Provided to YouTube by Universal Music Group ABC · Lola Indigo Toy Story ℗ 2022 Universal Music Spain, S.L.U. Released on: ...',
        //   date: '2022-04-07 22:01:35',
        //   videoId: 'k5Bgw6-Zj_c'
        // }
      ]
    }
  },

  created() {},
  watch: {
    videoId() {}
  },
  mounted() {
    this.$logger.info(this.videoId, 'watch videoId')
  },
  methods: {
    searchVideo() {
      if (this.keywords.trim().length > 0) {
        this.loading = true
        this.chooseVideoId = ''
        this.videos = []
        YoutubeQueryByKeywords({ keywords: this.keywords }).then(response => {
          logger.info('YoutubeQueryByKeywords ', response)
          this.videos = response.result
          this.loading = false
        })
      } else {
        this.$message.warn('Please enter keyword')
      }
    },
    insert() {
      if (this.chooseVideoId.length === 0) {
        this.$message.warn('Please choose a video')
        return null
      }
      logger.info('insert ')
      this.addYoutube(this.choose)
      this.choose = null
      this.keywords = ''
      this.chooseVideoId = ''
      this.videos = []
    },
    cancel() {
      this.addYoutube()
    },
    chooseVideo(item) {
      logger.info('chooseVideo', item)
      this.chooseVideoId = item.videoId
      this.choose = item
    }
  }
}
</script>

<style scoped lang="less">
.time-number-div .a-input__inner {
  border: 0 solid #15c39a;
  background-color: transparent !important;
}

.time-number-div {
  margin-left: 10px;
  display: flex;
  background-color: #efefef;
  border-radius: 2px;
  min-width: 60px;
  align-items: center;
  height: 35px;
}

.time-btn-div {
  display: flex;
  flex-direction: column;
}

.time--set {
  display: flex;
  height: 40px;
}

.time {
  color: #7e7e7e;
  font-size: 14px;
  font-family: Inter-Bold;
  display: flex;
  align-items: center;
}

.youtube-page {
  width: 90%;
  margin: 20px auto;
  overflow: auto;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  .youtube-input-class {
    display: flex;
    align-items: center;
    width: 100%;
    .youtube-input-icon {
      width: 100px;
      height: 50px;
    }
    .youtube-input {
      margin-left: 10px;
      flex: 1;
    }
  }
  .youtube-video-con {
    width: 100%;
    height: 320px;
    align-items: center;
    overflow-y: auto;
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
    .youtube-video-item {
      display: flex;
      border: 2px solid transparent;
      padding: 5px;
      &.active {
        border: 2px solid @primary-color;
        .youtube-video-img {
          width: 345px;
          height: 180px;
        }
        .youtube-video-detail {
          height: 180px;
        }
      }
      &.youtube-video-item {
        margin-top: 20px;
      }
      .youtube-video-img {
        width: 230px;
        height: 120px;
        transition: 0.2s;
        video {
          width: 100%;
          height: 100%;
        }
      }
      .youtube-video-detail {
        flex: 1;
        margin-left: 15px;
        text-align: left;
        height: 120px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .video-detail-content {
          .video-detail-title {
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: bold;
            color: #282828;
            margin-bottom: 5px;
          }
          .video-detail-desc {
            font-size: 14px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #282828;
          }
        }
        .video-detail-time {
          font-size: 14px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: #939393;
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
</style>
