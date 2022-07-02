<template>
  <div class="youtube-page">
    <div class="youtube-input-class">
      <a-space>
        <img src="~@/assets/icons/material/youtube.png" class="youtube-input-icon" alt="" />
        <custom-search-input :round='false' :value.sync='keywords' @search='searchVideo' placeholder='Search Youtube'/>
      </a-space>
    </div>

    <div class="youtube-video-con">
      <a-spin tip="Loading..." :spinning="loading">
        <div v-if="videos.length === 0" class="video-text">
          Search video from Youtube
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
              <img class="youtube-video-img" :src="item.thumbnailMedium" />
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
    <div class='youtube-video-action'>
      <a-button
        class="action-ensure action-item"
        type="primary"
        @click="insert"
        :disabled="chooseVideoId.length === 0"
      >
        Insert
      </a-button>
    </div>
  </div>
</template>
<script>

import { YoutubeQueryByKeywords } from '@/api/material'
import ClasscipeDriveEvent from '@/components/ClasscipeDrive/ClasscipeDriveEvent'
import CustomSearchInput from '@/components/Common/CustomSearchInput'

export default {
  name: 'Youtube',
  components: { CustomSearchInput },
  props: {
    field: {
      type: String,
      default: null
    },
    contentId: {
      type: String,
      default: null
    },
    contentType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      keywords: '',
      choose: {},
      chooseVideoId: '',
      videos: []
    }
  },
  created() {
    this.$logger.info(`Youtube field ${this.field}`)
  },
  methods: {
    searchVideo() {
      if (this.keywords.trim().length > 0) {
        this.loading = true
        this.chooseVideoId = ''
        this.videos = []
        YoutubeQueryByKeywords({ keywords: this.keywords }).then(response => {
          this.$logger.info('YoutubeQueryByKeywords ', response)
          this.videos = response.result
          this.loading = false
        })
      } else {
        this.$message.warn('Please enter keyword')
      }
    },
    insert() {
      if (this.chooseVideoId.length === 0) {
        this.$message.warn('Please select a video')
        return null
      }
      this.$EventBus.$emit(ClasscipeDriveEvent.INSERT_YOUTUBE_ITEM, {
        field: this.field,
        data: this.choose
      })
      this.choose = null
      this.keywords = ''
      this.chooseVideoId = ''
      this.videos = []
    },
    chooseVideo(item) {
      this.$logger.info('chooseVideo', item)
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
  margin-top: 15px;
  .youtube-input-class {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    .youtube-input-icon {
      height: 35px;
    }
    .youtube-input {
      margin-left: 10px;
      flex: 1;
    }
  }
  .youtube-video-con {
    width: 100%;
    height: 400px;
    padding: 0 3px;
    align-items: center;
    overflow-y: auto;
    .video-text {
      font-size: 18px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ababab;
      line-height: 32px;
      text-align: center;
      align-items: center;
      height: 400px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .youtube-video-item {
      display: flex;
      border: 2px solid transparent;
      padding: 5px;
      &.active {
        outline: 2px solid @primary-color;
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

.youtube-video-action {
  margint-top: 10px;
  text-align: right;
}
</style>
