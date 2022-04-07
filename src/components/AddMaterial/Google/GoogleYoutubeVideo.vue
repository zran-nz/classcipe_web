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
      <div
        class="youtube-video-item"
        :class="{ active: choose.videoId === item.videoId }"
        @click="chooseVideo(item)"
        v-for="(item, index) in videos"
        :key="'video' + index"
      >
        <div class="youtube-video-img">
          <video
            width="230"
            height="120"
            :src="item.link"
            controlslist="nodownload"
            controls=""
            preload="auto"
            class="video-item"
          ></video>
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
    </div>

    <div class="btn" @click="insert">next</div>
  </div>
</template>
<script>
import * as logger from '@/utils/logger'
import { YoutubeQueryByKeywords } from '@/api/material'
export default {
  data() {
    return {
      keywords: '',
      choose: {},
      videos: [
        {
          link: 'https://www.youtube.com/embed/k5Bgw6-Zj_c?showinfo=0&modestbranding=1&rel=0',
          thumbnail: 'https://i.ytimg.com/vi/k5Bgw6-Zj_c/default.jpg',
          title: 'ABC',
          description:
            'Provided to YouTube by Universal Music Group ABC · Lola Indigo Toy Story ℗ 2022 Universal Music Spain, S.L.U. Released on: ...',
          date: '2022-04-07 22:01:35',
          videoId: 'k5Bgw6-Zj_c'
        }
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
      YoutubeQueryByKeywords({ keywords: this.keywords }).then(response => {
        logger.info('YoutubeQueryByKeywords ', response)
        this.videos = response.result
      })
    },
    insert() {
      logger.info('insert ')
    },
    chooseVideo(item) {
       logger.info(item)
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
  width: 900px;
  margin: 20px auto;
  overflow: auto;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
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
    padding-left: 110px;
    width: 100%;
    height: 400px;
    overflow-y: auto;
    .youtube-video-item {
      display: flex;
      border: 2px solid transparent;
      padding: 5px;
      &.active {
        border: 2px solid @primary-color;
      }
      &:hover {
        border: 2px solid #dfdfdf;
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

iframe {
  border: 1px solid #15c39a;
}

.open_btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  width: 100%;
  color: #15c39a;
  font-size: 18px;
  cursor: pointer;
}

.open-google {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 40px;
  color: white;
  font-size: 14px;
  font-family: Inter-Bold;
  background-color: #15c39a;
  border-radius: 6px;
  cursor: pointer;
  margin-left: 10px;
}

iframe {
  margin-top: 20px;
  margin-bottom: 20px;
}

.btn {
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 40px;
  color: white;
  font-size: 14px;
  font-family: Inter-Bold;
  background-color: #15c39a;
  border-radius: 6px;
  cursor: pointer;
  align-self: flex-end;
}
</style>
