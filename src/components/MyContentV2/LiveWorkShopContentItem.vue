<template>
  <div class='content-item' v-if='content && content.content'>
    <div class='cover' @click.prevent.stop="handleGoWork(content)">
      <div class='cover-block' :style="{'background-image': 'url(' + content.content.image + ')'}">
      </div>
      <div v-if="content.session && content.session.classId" class="cover-btn"><label>Enter workshop</label></div>
    </div>
    <div class='detail' @click.prevent.stop='handlePreviewDetail(content.content)'>
      <div class='detail-content'>
        <div class='base-info'>
          <div class='name'>
            {{ content.content.name }}
          </div>
          <div class='tag-info'></div>
          <div class='owner'>
            {{ content.content.createBy }}
          </div>
        </div>
        <div class='right-info'>
          <div class='update-time'>
            {{ content.content.updateTime | dayjs }}
          </div>
        </div>
      </div>
      <div class="detail-price">
        <price-slider :priceList="content.priceList" :current="content.registeredNum" />
      </div>
      <div class='action'>
        <div class="schedule-time">
          Sched: {{ content.lastRegisteredTime }}
        </div>
        <a-space @click.prevent.stop>
          <div v-if="content.session && content.session.zoomMeeting" class='zoom-icon' @click.prevent.stop="handleToZoom(content)">
            <img src='~@/assets/icons/zoom/img.png' />
          </div>
          <a-tooltip
            v-model="shareVisible"
            trigger="click"
            :getPopupContainer="trigger => trigger.parentElement"
            @visibleChange="vis => visibleChange(vis, content)"
          >
            <template slot="title">
              <div class="detail-share">
                <share-button
                  v-if="shareItem"
                  :link="wrapperLink(content)"
                  :title="content.content.name"
                />
              </div>
            </template>
            <a-button type='primary' shape='round'>Share</a-button>
          </a-tooltip>
          <!-- <template v-if="WORK_SHOPS_TYPE.FEATURE.value === content.workshopsType"> -->
          <a-button type='primary' shape='round' @click='editItem(content)'>Register</a-button>
          <!-- </template> -->
          <template v-if="WORK_SHOPS_TYPE.LUNCHEDBYME.value === content.workshopsType">
            <a-button type='primary' shape='round' @click='editItem(content)'>Edit</a-button>
            <a-button type='primary' shape='round' @click='editItem(content)'>Delete</a-button>
          </template>
          <template v-if="WORK_SHOPS_STATUS.ONGOING.value === content.workshopsStatus || WORK_SHOPS_STATUS.ENDED.value === content.workshopsStatus">
            <a-button type='primary' shape='round' @click='editItem(content)'>Relaunch</a-button>
          </template>
          <template v-if="WORK_SHOPS_TYPE.REGISTERED.value === content.workshopsType">
            <a-button type='primary' shape='round' @click='editItem(content)'>Cancel</a-button>
          </template>

        </a-space>
      </div>
    </div>
    <!-- <a-modal
      v-model='shareVisible'
      :closable='true'
      :footer='null'
      :maskClosable='true'
      destroyOnClose
      width='300px'
      @cancel='handleCloseShare'>
      <share-button
        :link="shareItem.name || 'https://dev.classcipe.com/'"
        :title="shareItem.name || 'test'"
      />
    </a-modal> -->
    <preview-content :preview-current-id='previewCurrentId' :preview-type='previewType' v-if='previewVisible' @close='handlePreviewClose' />
  </div>
</template>

<script>
import { WORK_SHOPS_STATUS, WORK_SHOPS_TYPE } from '@/const/common'
import { lessonHost } from '@/const/googleSlide'
import { typeMap } from '@/const/teacher'
import PriceSlider from '@/components/Slider/PriceSlider'
import ShareButton from '@/components/Share/ShareButton'
import PreviewContent from '@/components/MyContentV2/PreviewContent'

import { ContentItemMixin } from '@/mixins/ContentItemMixin'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import storage from 'store'

export default {
  name: 'LiveWorkShopContentItem',
  components: {
    PriceSlider,
    ShareButton,
    PreviewContent
  },
  mixins: [ ContentItemMixin ],
  props: {
    content: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      typeMap: typeMap,
      WORK_SHOPS_STATUS: WORK_SHOPS_STATUS,
      WORK_SHOPS_TYPE: WORK_SHOPS_TYPE,
      shareVisible: false,
      shareItem: {}
    }
  },
  methods: {
    editItem (item) {
      if (item.type === typeMap['unit-plan']) {
        this.$router.push({
          path: '/teacher/unit-plan-redirect/' + item.id
        })
      } else if (item.type === typeMap.task) {
        this.$router.push({
          path: '/teacher/task-redirect/' + item.id
        })
      } else if (item.type === typeMap.video) {
        this.$router.push({
          path: '/teacher/video-redirect/' + item.id
        })
      } else if (item.type === typeMap.pd) {
        this.$router.push({
          path: '/teacher/pd-content-redirect/' + item.id
        })
      }
    },
    visibleChange(visible, content) {
      if (visible && content.name) {
        this.shareVisible = false
        this.shareItem = { ...content }
        this.shareVisible = true
      }
    },
    wrapperLink(item) {
      if (item && item.sessionId) {
        return `${process.env.VUE_APP_SHARE_URL}/h5/live/${item.sessionId}`
      } else {
        return ''
      }
    },
    handleToZoom(item) {
      if (item && item.session && item.session.zoomMeeting) {
        try {
          const zoomMeetingConfig = JSON.parse(item.session.zoomMeeting)
          window.open(zoomMeetingConfig.start_url, '_blank')
        } catch (error) {
          this.$message.error('parse json error')
        }
      }
    },
    handleCloseShare () {
      this.shareVisible = false
    },
    handleGoWork(item) {
      if (item && item.session && item.session.classId) {
        const targetUrl = lessonHost + 's/' + item.session.classId + '?token=' + storage.get(ACCESS_TOKEN)
        window.location.href = targetUrl
      }
    },
    handleShare(item) {
      this.shareVisible = true
      this.shareLink = { ...item }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.content-item {
  padding: 0.16em /* 16/100 */ 0.27em /* 27/100 */;
  border: 1px solid #EEF1F6;
  border-radius: 0.1em /* 10/100 */;
  margin: 0.15em /* 15/100 */ 0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  .cover {
    position: relative;
    display:flex;
    justify-content: center;
    cursor: pointer;
    .cover-block {
      height: 1.82em /* 182/100 */;
      width: 3.29em /* 329/100 */;
      border: 1px solid #EEF1F6;
      border-radius: 0.07em /* 7/100 */;
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .cover-btn {
      position: absolute;
      height: 0.46em /* 46/100 */;
      top: calc(50% - 0.23em /* 23/100 */);
      border-radius: 0.23em /* 23/100 */;
      padding: 0 0.23em /* 23/100 */;
      background: #2582B5;
      text-align: center;
      display: flex;
      align-items: center;
      label {
        font-size: 0.14em /* 14/100 */;
        font-family: Arial;
        font-weight: 400;
        color: #FFFFFF;
        cursor: pointer;
      }
    }
  }

  .detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: 0.35em /* 35/100 */;
    height: 1.82em /* 182/100 */;

    .detail-content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .base-info {
        .name {
          font-size: 0.22em /* 22/100 */;
          font-family: Arial;
          font-weight: bold;
          color: #17181A;
        }
        .owner {
          font-size: 0.18em /* 18/100 */;
          font-family: Arial;
          font-weight: 400;
          color: #757578;
        }
      }
      .right-info {
        .update-time {
          font-size: 0.18em /* 18/100 */;
          font-family: Arial;
          font-weight: 400;
          color: #4B4B4B;
        }
      }
    }

    .action {
      flex-shrink: 0;
      height: 0.4em /* 40/100 */;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .schedule-time {
        font-size: 0.18em /* 18/100 */;
        font-family: Arial;
        font-weight: 400;
        color: #4B4B4B;
      }
      .zoom-icon {
        height: 0.4em /* 40/100 */;
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
          // width: 0.4em /* 40/100 */;
          height: 0.3em /* 40/100 */;
        }
      }
      /deep/ .ant-tooltip {
        font-size: inherit;
      }
      /deep/ .ant-space-item {
        margin-right: 0.18em /* 18/100 */;
      }
      /deep/ button {
        height: 0.4em /* 40/100 */;
        border-radius: 0.25em /* 25/100 */;
        display: flex;
        align-items: center;
        span {
          font-family: Arial;
          font-weight: 400;
          font-size: 0.16em /* 16/100 */;
        }
      }
    }
  }
}
.detail-share {
  /deep/ .share-button {
    width:  2em;
    height: 2em;
    padding: .1em;
    .share-title {
      font-size: 0.16em /* 16/100 */;
      font-family: Arial;
      font-weight: 400;
      color: #ECEFF4;
      margin-bottom: 1/0.16*0.12em /* 12/100 */;
      line-height: 1;
      white-space: nowrap;
    }
    .share-qrcode {
      width: 0.77em /* 77/100 */;
      height: 0.77em /* 77/100 */;
      display: flex;
    }
    .share-divider {
      font-size: 0.14em /* 14/100 */;
      margin: 1/0.14*0.12em /* 12/100 */ 0;
      line-height: 1;
    }
    .share-out {
      height: .3em;
      .ant-space-item {
        height: 0.3em;
        display: flex;
        align-items: center;
      }
      img {
        width: 0.23em /* 23/100 */;
        height: 0.23em /* 23/100 */;
      }
    }
  }
}
.detail-price {
  padding: 0 0.1em /* 10/100 */;
  flex-grow: 1;
  /deep/ .price-slider {
    .slider-label {
      width: calc(100% - 0.125em /* 12.5/100 */);
      left: 0.0175em /* 1.75/100 */;
      top: 0em;
      .slider-label-item {
        font-size: 0.16em /* 16/100 */;
        width:2.25em /* 100/16*.36 */;
        height:2.25em /* 100/16*.36 */;
        line-height:2.25em /* 100/16*.36 */;
      }
    }
    .ant-slider {
      height: 0.3em /* 30/100 */;
      margin: 0.1em /* 10/100 */ 0.06em /* 6/100 */ 0.1em /* 10/100 */;
      padding: 0.09em /* 9/100 */ 0;
      font-size: inherit;
      .ant-slider-rail {
        height: 0.14em /* 14/100 */;
      }
      .ant-slider-dot {
        width:0.37em /* 37/100 */;
        height:0.37em /* 37/100 */;
      }
      .ant-slider-track {
        height: 0.14em /* 14/100 */;;
      }
      .ant-slider-mark {
        top:2em;
        font-size: 0.16em /* 14/100 */;
      }
    }
  }
}
</style>
