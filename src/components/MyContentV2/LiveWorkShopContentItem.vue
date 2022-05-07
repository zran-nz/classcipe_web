<template>
  <div class='content-item' v-if='content && content.content'>
    <div class='cover' @click.prevent.stop="handleGoWork(content)">
      <div class='cover-block' :style="{'background-image': 'url(' + content.content.image + ')'}">
      </div>
      <div v-if="content.session && content.session.classId && [WORK_SHOPS_TYPE.LUNCHEDBYME.value, WORK_SHOPS_TYPE.REGISTERED.value].includes(content.workshopsType)" class="cover-btn"><label>Enter workshop</label></div>
    </div>
    <div class='detail' @click.prevent.stop='handlePreviewDetail(content.content)'>
      <div class='detail-content'>
        <div class='base-info'>
          <div class='name'>
            {{ content.content.name }}
          </div>
          <div class='tag-info'></div>
          <!-- <div class='owner'>
            {{ content.userRealName || content.content.createBy }}
          </div> -->
        </div>
        <div class='right-info'>
          <div class='update-time'>
            Sched: {{ content.sessionStartTime }}
          </div>
        </div>
      </div>
      <div class="detail-price">
        <div class="tag-info" v-show="content.content.customTags && content.content.customTags.length > 0">
          <div class="tag-item" :key="tag.id" v-for="tag in content.content.customTags.slice(0, 2)">
            <a-tooltip :title="tag.name">
              {{ tag.name }}
            </a-tooltip>
          </div>
          <div class="tag-item" v-if="content.content.customTags.length > 2">
            <a-popover :overlayStyle="{ width: '310px' }" overlayClassName="tag-info-tip">
              <template slot="content">
                <a-space class="tag-info">
                  <a-tag color="#FFDF9B" class="tag-item" :key="tag.id" v-for="tag in content.content.customTags.slice(2)">
                    <a-tooltip :title="tag.name">
                      {{ tag.name }}
                    </a-tooltip>
                  </a-tag>
                </a-space>
              </template>
              more
            </a-popover>
          </div>
        </div>
        <price-slider :priceList="content.priceList" :current="content.registeredNum" />
      </div>
      <div class='action'>
        <div class="author-name">
          <a-avatar v-if="!content.userAvatar" icon="user" />
          <img
            v-else
            class="ant-avatar"
            :src="content.userAvatar"
            alt="avatar"
          />
          <div class="author-name">
            {{ content.userRealName || content.content.createBy }}
          </div>
        </div>
        <a-space @click.prevent.stop>
          <div v-if="content.session && content.session.zoomMeeting" class='zoom-icon' @click.prevent.stop="handleToZoom(content)">
            <img src='~@/assets/icons/zoom/img.png' />
          </div>
          <a-tooltip
            v-model="shareVisible"
            v-if="userMode === USER_MODE.SELF"
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
            <a-button type="primary" shape='round'>
              <!-- <icon-font type="icon-share" class="detail-font"/> -->
              Share
            </a-button>
          </a-tooltip>
          <template v-if="WORK_SHOPS_TYPE.FEATURE.value === content.workshopsType">
            <a-button type='primary' shape='round' @click='handleRegister(content)'>
              <!-- <icon-font type="icon-register" class="detail-font"/> -->
              Register</a-button>
          </template>
          <template v-if="WORK_SHOPS_TYPE.LUNCHEDBYME.value === content.workshopsType">
            <a-button v-if="WORK_SHOPS_STATUS.SCHEDULE.value === content.workshopsStatus" type='primary' shape='round' @click='handleEdit(content)'>
              <!-- <icon-font type="icon-edit" class="detail-font"/> -->
              Edit</a-button>
            <a-button v-else type='primary' shape='round' @click='handleRelaunch(content)'>
              <!-- <icon-font type="icon-tizhibianbie-zhongxinceshi" class="detail-font"/> -->
              Relaunch</a-button>
            <a-button type='primary' shape='round' @click='handleDel(content)'>
              <!-- <icon-font type="icon-shanchu" class="detail-font"/> -->
              Delete</a-button>
          </template>
          <template v-if="WORK_SHOPS_TYPE.REGISTERED.value === content.workshopsType">
            <a-button type='primary' shape='round' @click='handleCancel(content)'>
              <!-- <icon-font type="icon-cancel" class="detail-font"/> -->
              Cancel</a-button>
          </template>

        </a-space>
      </div>
    </div>
    <preview-content :preview-current-id='previewCurrentId' :preview-type='previewType' v-if='previewVisible' @close='handlePreviewClose' />

  </div>
</template>

<script>
import { WORK_SHOPS_STATUS, WORK_SHOPS_TYPE, USER_MODE } from '@/const/common'
import { SaveRegisteredRecord, CancelRegistered } from '@/api/v2/live'
import { lessonHost } from '@/const/googleSlide'
import { typeMap } from '@/const/teacher'
import PriceSlider from '@/components/Slider/PriceSlider'
import ShareButton from '@/components/Share/ShareButton'
import PreviewContent from '@/components/MyContentV2/PreviewContent'

import { ContentItemMixin } from '@/mixins/ContentItemMixin'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import storage from 'store'
import { mapState } from 'vuex'

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
      USER_MODE: USER_MODE,
      WORK_SHOPS_STATUS: WORK_SHOPS_STATUS,
      WORK_SHOPS_TYPE: WORK_SHOPS_TYPE,
      shareVisible: false,
      shareItem: {}
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    })
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
    },
    handleRegister(item) {
      if (item && item.content && item.sessionId) {
        SaveRegisteredRecord({
          contentId: item.content.id,
          sessionId: item.sessionId
        }).then(res => {
          if (res.success) {
            this.$message.success('Register successfully')
            this.$emit('reload')
          }
        })
      }
    },
    handleCancel(item) {
      if (item && item.content && item.sessionId) {
        CancelRegistered({
          contentId: item.content.id,
          sessionId: item.sessionId
        }).then(res => {
          if (res.success) {
            this.$message.success('Cancel successfully')
            this.$emit('reload')
          }
        })
      }
    },
    handleRelaunch(item) {
      this.$router.push({
        path: '/teacher/schedule-session/' + item.content.id + '/' + item.content.type
      })
    },
    handleDel(item) {
      this.$message.info('coming soon...')
    },
    handleEdit(item) {
      this.$message.info('coming soon...')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.tag-info-tip {
  .tag-info {
    display: flex;
    flex-wrap: wrap;
    .tag-item {
      color: #D97909;
      margin: 5px 0;
      border-radius: 10px;
    }
  }
}
.content-item {
  padding: 0.16em /* 16/100 */ 0.27em /* 27/100 */;
  border: 1px solid #EEF1F6;
  border-radius: 0.1em /* 10/100 */;
  margin: 0.15em /* 15/100 */ 0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  .detail-font {
    font-size: 0.18em /* 18/100 */;
    color: #fff;
  }
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
      .author-name {
        display: flex;
        align-items: center;
        .author-name {
          font-size: 0.16em /* 13/100 */;
          font-family: Arial;
          font-weight: 400;
          color: #0c0c0c;
          margin-left: 1/0.16*0.1em /* 10/100 */;
        }
        /deep/ .ant-avatar {
          width: 0.35em /* 35/100 */;
          height: 0.35em /* 35/100 */;
          font-size: inherit;
          i {
            font-size: 0.26em /* 26/100 */;
          }
        }
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
    width:  2.5em;
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
      i {
        font-size: 0.37em /* 37/100 */;
      }
    }
  }
}
.detail-price {
  padding: 0 0.1em /* 10/100 */;
  flex-grow: 1;
  display: flex;
  align-items: center;
  .tag-info {
    width: 3em /* 300/100 */;
    display: flex;
    align-items: center;
    height: .3em;
    margin-top: -0.2em;
    .tag-item {
      height: 1/0.15*0.3em /* 30/100 */;
      line-height: 1/0.15*0.3em /* 30/100 */;
      padding: 0 1/0.15*0.1em /* 10/100 */;
      font-size: 0.15em /* 15/100 */;
      background: #FFDF9B;
      color: #D97909;
      margin-right: 1/0.15*0.05em /* 5/100 */;
      border-radius: 1/0.15*0.1rem /* 10/100 */;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 6em;
      text-align: center;
    }
  }
  /deep/ .price-slider {
    margin-top: -0.2em;
    flex: 1;
    .slider-label {
      width: calc(100% - 0.125em /* 12.5/100 */);
      left: 0.0175em /* 1.75/100 */;
      top: 0.1em;
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
