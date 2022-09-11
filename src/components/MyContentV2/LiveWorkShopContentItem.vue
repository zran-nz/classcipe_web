<template>
  <div class='content-item' >
    <div class='cover' @click.prevent.stop="handleGoWork(content)">
      <div class='cover-block' :style="{'background-image': `url('${content.cover || (content.content && content.content.image) || 'http://dcdkqlzgpl5ba.cloudfront.net/1392467808404684802/file/202208140641519097-20220814143449.png'}')`}">
        <div class='bottom-action' v-if="!isSimple">
          <div class='bottom-action-item vertical-left'>
            <!-- <div class='bottom-action-item-icon'><a-icon type="form" /></div>
            <div class='bottom-action-item-label'>Edit</div> -->
          </div>
          <div class='bottom-action-item vertical-right' v-if="content.content" @click.stop="handlePreview(content)">
            <div class='bottom-action-item-icon'><a-icon type="eye" /></div>
            <div class='bottom-action-item-label'>Preview</div>
          </div>
          <!--删除也可以预览-->
          <div class='bottom-action-item vertical-right' v-if="!content.content" @click.stop="handlePreviewDeleteDetail(content.session)">
            <div class='bottom-action-item-icon'><a-icon type="eye" /></div>
            <div class='bottom-action-item-label'>Preview</div>
          </div>
        </div>
      </div>
      <div
        v-if="content.session && content.session.classId && (isCurrentType(WORK_SHOPS_TYPE.REGISTERED.value) || isCurrentType(WORK_SHOPS_TYPE.LUNCHEDBYME.value))"
        class="cover-btn"><label>Enter workshop</label></div>
    </div>
    <div class='detail'>
      <div class='detail-content' @click.prevent.stop>
        <div class='base-info'>
          <div class='type-icon' v-if="content.session">
            <content-type-icon :type="content.session.contentType" />
          </div>
          <div class='name' v-show="!showEditName">
            {{ content.title || (content.content&&content.content.name) || 'Untitle' }}
            <!-- <a-icon v-if="WORK_SHOPS_TYPE.LUNCHEDBYME.value === content.workshopsType" type="edit" @click.prevent.stop="editName(content)"/> -->
          </div>
          <div class="name" v-show="showEditName">
            <a-input :disabled="loading" :value="choose.title" @change="e => changeTitle(e.target.value, content)"></a-input>
            <div class="opt">
              <a-icon type="check" @click.stop.prevent="handleSave(content)" />
              <a-icon type="close" @click.stop.prevent="handleCancelSingle(content)"/>
            </div>
          </div>
          <div class='tag-info'>
            <div class='tag-info-item' v-for='(customTag, idx) in content.customTags' :key='idx'>
              <a-tag color='#FFEDAF' class='tag-item' :title='customTag.category'> {{ customTag.name }} </a-tag>
            </div>
          </div>
        </div>
        <div class='right-info' v-if="content.sessionStartTime && !isSimple">
          <div class="update-time" v-if="content.unitPlanInfo && content.unitPlanInfo.name">Unit: {{ content.unitPlanInfo.name }}</div>
          <div class='update-time' v-show="!showEditSche">
            Scheduled: {{ content.sessionStartTime | dayjs('YYYY-MM-DD HH:mm') }} - {{ content.sessionEndTime | dayjs('YYYY-MM-DD HH:mm') }}
            <!-- <a-icon v-if="WORK_SHOPS_TYPE.LUNCHEDBYME.value === content.workshopsType" type="edit" @click.prevent.stop="editSche(content)"/> -->
          </div>
          <div class="update-time" v-show="showEditSche">
            <a-range-picker
              :disabled="loading"
              :default-value="[moment.utc(content.sessionStartTime).local(), moment.utc(content.sessionEndTime || content.sessionStartTime).local()]"
              @change="handleDateChange"
              :disabled-date="disabledDateRange"
              format='YYYY-MM-DD HH:mm:ss'
              :show-time="{ format: 'HH:mm' }"/>
            <div class="opt">
              <a-icon type="check" @click.stop.prevent="handleSave(content)" />
              <a-icon type="close" @click.stop.prevent="handleCancelSingle(content)"/>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-price" ref="detailPrice">
        <!-- <div class="tag-info" ref="tagInfo" v-show="content.content.customTags && content.content.customTags.length > 0">
          <div class="tag-item" :key="tag.id" v-for="tag in content.content.customTags.slice(0, showTagLen)">
            <a-tooltip :title="tag.name">
              {{ tag.name }}
            </a-tooltip>
          </div>
          <div class="tag-item" v-if="content.content.customTags.length > showTagLen">
            <a-popover :overlayStyle="{ width: '310px' }" overlayClassName="tag-info-tip">
              <template slot="content">
                <a-space class="tag-tip">
                  <a-tag color="#FFDF9B" class="tag-item" :key="tag.id" v-for="tag in content.content.customTags.slice(showTagLen)">
                    <a-tooltip :title="tag.name">
                      {{ tag.name }}
                    </a-tooltip>
                  </a-tag>
                </a-space>
              </template>
              more
            </a-popover>
          </div>
        </div> -->
        <tags-line :tags="content.content ? content.content.customTags : []" />
        <div class="price-con" v-if="content.priceList && content.priceList.length > 0 && !isSimple">
          <price-slider :priceList="content.priceList" :current="content.registeredNum" :origin="content.price" />
          <!-- <template v-if="WORK_SHOPS_TYPE.LUNCHEDBYME.value === content.workshopsType">
            <a-icon class="price-edit" @click="editPrice(content)" type="edit" v-if="content.registeredNum == 0"></a-icon>
            <a-tooltip v-else title="You can not edit the price because it has been already registered by other users.">
              <a-icon class="price-edit" type="edit" style="color: #999"></a-icon>
            </a-tooltip>
          </template> -->
        </div>
      </div>
      <div class='action'>
        <div class="author-wrap">
          <a-avatar v-if="content.userAvatar" :src="content.userAvatar" icon="user" />
          <img
            v-else
            class="ant-avatar"
            src="~@/assets/icons/library/default-avatar.png"
            alt="avatar"
          />
          <div class="author-con">
            <div style="font-weight: bold;" class="author-name" v-if="WORK_SHOPS_TYPE.LUNCHEDBYME.value === content.workshopsType || (content.sessionInfo && $store.getters.email === content.sessionInfo.author)">
              Me
            </div>
            <div class="author-name" v-else>
              {{ content.userRealName || (content.content && content.content.createBy) }}
            </div>
            <div v-if="(isCurrentType(WORK_SHOPS_TYPE.REGISTERED.value) || isCurrentType(WORK_SHOPS_TYPE.LUNCHEDBYME.value))">
              {{ userMode === USER_MODE.SELF ? 'Personal' : currentSchool.schoolName }}
            </div>
          </div>
        </div>
        <a-space @click.prevent.stop v-if="!isSimple">
          <!-- (WORK_SHOPS_TYPE.REGISTERED.value === content.workshopsType || WORK_SHOPS_TYPE.LUNCHEDBYME.value === content.workshopsType) && content.session && content.session.zoomMeeting && WORK_SHOPS_STATUS.ENDED.value !== content.workshopsStatus -->
          <div v-if="content.session && content.session.zoomMeeting" class='zoom-icon' @click.prevent.stop="handleToZoom(content)">
            <img src='~@/assets/icons/zoom/img.png' />
          </div>
          <a-tooltip
            v-model="shareVisible"
            v-if="userMode === USER_MODE.SELF && WORK_SHOPS_STATUS.ENDED.value !== content.workshopsStatus"
            trigger="click"
            :getPopupContainer="trigger => trigger.parentElement"
            @visibleChange="vis => visibleChange(vis, content)"
          >
            <template slot="title">
              <div class="detail-share">
                <share-button
                  v-if="shareItem"
                  :link="wrapperLink(content)"
                  :title="content.title || (content.content && content.content.name) || 'Untitle'"
                />
              </div>
            </template>
            <!-- <a-button type="primary" shape='round'>
              <icon-font type="icon-share" class="detail-font"/>
              Share
            </a-button> -->
            <custom-button label='Share'>
              <template v-slot:icon>
                <icon-font type="icon-share" class="detail-font"/>
              </template>
            </custom-button>
          </a-tooltip>
          <!-- <custom-button label='Preview' @click='handlePreview(content)'>
            <template v-slot:icon>
              <icon-font type="icon-xianshi" class="detail-font"/>
            </template>
          </custom-button> -->
          <template
            v-if="
              WORK_SHOPS_TYPE.FEATURE.value === content.workshopsType
                && WORK_SHOPS_STATUS.ENDED.value !== content.workshopsStatus
                && isCurrentType(WORK_SHOPS_TYPE.FEATURE.value)">
            <!-- <a-button type='primary' shape='round' @click='handleRegister(content)'>
              <icon-font type="icon-register" class="detail-font"/>
              Register</a-button> -->
            <custom-button label='Register' @click='handleRegister(content)'>
              <template v-slot:icon>
                <icon-font type="icon-register" class="detail-font"/>
              </template>
            </custom-button>
          </template>
          <template
            v-if="
              WORK_SHOPS_TYPE.LUNCHEDBYME.value === content.workshopsType
                && isCurrentType(WORK_SHOPS_TYPE.LUNCHEDBYME.value)">
            <!-- <custom-button label='Edit' v-if="WORK_SHOPS_STATUS.SCHEDULE.value === content.workshopsStatus" @click='handleEdit(content)'>
              <template v-slot:icon>
                <icon-font type="icon-edit" class="detail-font"/>
              </template>
            </custom-button> -->
            <custom-button
              label='Relaunch'
              v-if="WORK_SHOPS_STATUS.ENDED.value === content.workshopsStatus"
              @click='handleRelaunch(content)'>
              <template v-slot:icon>
                <icon-font type="icon-tizhibianbie-zhongxinceshi" class="detail-font"/>
              </template>
            </custom-button>
            <a-dropdown
              :trigger="['click']"
              :getPopupContainer='trigger => trigger.parentElement'
            >
              <div class='more-action'>
                <more-icon />
              </div>
              <div class='content-item-more-action' slot='overlay'>
                <div class='menu-item' v-if="0 === content.session.delFlag && (WORK_SHOPS_STATUS.SCHEDULE.value === content.workshopsStatus || WORK_SHOPS_STATUS.ENDED.value === content.workshopsStatus)">
                  <custom-button label='Archive' @click='handleStatus("Archive")'>
                    <!-- <template v-slot:icon>
                      <icon-font type="icon-shanchu" class="detail-font"/>
                    </template> -->
                  </custom-button>
                </div>
                <div class='menu-item' v-if="1 === content.session.delFlag">
                  <custom-button label='Restore' @click='handleStatus("Restore")'>
                    <!-- <template v-slot:icon>
                      <icon-font type="icon-shanchu" class="detail-font"/>
                    </template> -->
                  </custom-button>
                </div>
                <div class='menu-item' v-if="0 === content.session.delFlag && WORK_SHOPS_STATUS.SCHEDULE.value === content.workshopsStatus || 1 === content.session.delFlag">
                  <custom-button label='Delete' @click='handleDel(content)'>
                    <!-- <template v-slot:icon>
                      <icon-font type="icon-shanchu" class="detail-font"/>
                    </template> -->
                  </custom-button>
                </div>
                <div class='menu-item' v-if="0 === content.session.delFlag && WORK_SHOPS_STATUS.ONGOING.value === content.workshopsStatus">
                  <custom-button label='End' @click='handleStatus("End")'>
                  </custom-button>
                </div>
                <div class='menu-item' v-if="0 === content.session.delFlag && WORK_SHOPS_STATUS.ENDED.value === content.workshopsStatus">
                  <custom-button label='Reopen' @click='handleStatus("Reopen")'>
                  </custom-button>
                </div>
              </div>
            </a-dropdown>
          </template>
          <a-dropdown
            :trigger="['click']"
            :getPopupContainer='trigger => trigger.parentElement'
            v-if="WORK_SHOPS_TYPE.REGISTERED.value === content.workshopsType
              && isCurrentType(WORK_SHOPS_TYPE.REGISTERED.value)
              && WORK_SHOPS_STATUS.ENDED.value !== content.workshopsStatus
              && isReadyStart12(content) ">
            <div class='more-action'>
              <more-icon />
            </div>
            <div class='content-item-more-action' slot='overlay'>
              <div class='menu-item'>
                <custom-button label='Cancel' @click='handleCancel(content)'>
                  <template v-slot:icon>
                    <icon-font type="icon-cancel" class="detail-font"/>
                  </template>
                </custom-button>
              </div>
            </div>
          </a-dropdown>
          <div
            class='label-action'
            v-if="WORK_SHOPS_TYPE.REGISTERED.value === content.workshopsType
              && isCurrentType(WORK_SHOPS_TYPE.FEATURE.value)">
            Registered
          </div>
          <!-- <template v-if="WORK_SHOPS_TYPE.REGISTERED.value === content.workshopsType && WORK_SHOPS_STATUS.ENDED.value !== content.workshopsStatus">
            <custom-button label='Cancel' @click='handleCancel(content)'>
              <template v-slot:icon>
                <icon-font type="icon-cancel" class="detail-font"/>
              </template>
            </custom-button>
          </template> -->

        </a-space>
      </div>
    </div>
    <!-- <preview-content :preview-current-id='previewCurrentId' :preview-type='previewType' v-if='previewVisible' @close='handlePreviewClose' /> -->
    <content-preview
      :content-id='previewCurrentId'
      :content-type='previewType'
      :show-edit-button=!!content.content
      :session="content.session"
      v-if='previewVisible'
      :liveWorkShopCode="previewCode"
      @reload="handleRefresh"
      @close='handlePreviewClose' />

    <a-modal
      v-model="showEditPrice"
      destroyOnClose
      width="600px"
      :zIndex="6000"
      :confirmLoading="loading"
      title="Price Set"
      okText="Save"
      @ok="handleSavePrice"
      @cancel="showEditPrice = false">
      <schedule-price-set ref="priceSet" :init-price="choose.price" :init-price-list="choose.priceList" />
    </a-modal>

  </div>
<!--  <div class="content-item" v-else>-->
<!--    <a-empty style="margin: auto;">Related Content is Empty</a-empty>-->
<!--    <custom-button label='Delete' @click='handleDel(content)'>-->
<!--      <template v-slot:icon>-->
<!--        <icon-font type="icon-shanchu" class="detail-font"/>-->
<!--      </template>-->
<!--    </custom-button>-->
<!--  </div>-->
</template>

<script>
import { WORK_SHOPS_STATUS, WORK_SHOPS_TYPE, USER_MODE } from '@/const/common'
import { SaveRegisteredRecord, CancelRegistered } from '@/api/v2/live'
import {
  DeleteClassV2,
  EditSessionScheduleV2,
  EndSession,
  ReopenSession,
  ArchiveSession,
  RestoreSession,
  ClassStatusUpdate
} from '@/api/v2/classes'
import { lessonHost } from '@/const/googleSlide'
import { typeMap } from '@/const/teacher'
import PriceSlider from '@/components/Slider/PriceSlider'
import ShareButton from '@/components/Share/ShareButton'
import CustomButton from '@/components/Common/CustomButton'
import PreviewContent from '@/components/MyContentV2/PreviewContent'
import ContentPreview from '@/components/Preview/ContentPreview'
import TagsLine from '@/components/TagsLine'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import SchedulePriceSet from '@/components/Schedule/SchedulePriceSet'
import MoreIcon from '@/assets/v2/icons/more.svg?inline'

import { ContentItemMixin } from '@/mixins/ContentItemMixin'
import { ACCESS_TOKEN, SET_PROMOTE_CODE } from '@/store/mutation-types'
import storage from 'store'
import moment from 'moment'
import { mapState } from 'vuex'
import { getCookie } from '@/utils/util'

export default {
  name: 'LiveWorkShopContentItem',
  components: {
    PriceSlider,
    ShareButton,
    CustomButton,
    PreviewContent,
    ContentPreview,
    TagsLine,
    ContentTypeIcon,
    SchedulePriceSet,
    MoreIcon
  },
  mixins: [ ContentItemMixin ],
  props: {
    content: {
      type: Object,
      default: null
    },
    isSimple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      typeMap: typeMap,
      USER_MODE: USER_MODE,
      WORK_SHOPS_STATUS: WORK_SHOPS_STATUS,
      WORK_SHOPS_TYPE: WORK_SHOPS_TYPE,
      WORK_SHOPS_TYPE_VALUES: Object.values(WORK_SHOPS_TYPE),
      moment: moment,
      shareVisible: false,
      shareItem: {},
      showTagLen: 2,
      showEditName: false,
      showEditSche: false,
      showEditPrice: false,
      needReload: false,
      choose: {
        id: null,
        title: '',
        price: 0,
        priceList: [],
        sessionStartTime: null,
        deadline: null
      },
      loading: false
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    isCurrentType() {
      return (workshopsType) => {
        if (this.$route.query && this.$route.query.workshopsType) {
          return this.$route.query.workshopsType === workshopsType + ''
        }
        return workshopsType + '' === WORK_SHOPS_TYPE.FEATURE.value + ''
      }
    }
  },
  mounted() {
    const total = (this.content.content && this.content.content.customTags) ? this.content.content.customTags.length : 0
      // const tagInfoEl = this.$refs.tagInfo
      // const items = this.$refs.tagInfo.getElementsByClassName('tag-item')
      // if (!this.content.priceList || this.content.priceList.length === 0) {
      //   tagInfoEl.style.width = this.$refs.detailPrice.getBoundingClientRect().width + 'px'
      // }
      // if (items.length > 0) {
      //   const itemWidth = items[0].getBoundingClientRect().width + 5
      //   const showTagLen = parseInt(tagInfoEl.getBoundingClientRect().width / itemWidth) - 1
      //   if (total - showTagLen > 1) {
      //     this.showTagLen = showTagLen
      //   } else {
      //     this.showTagLen = total
      //   }
      // }
    // 有没有标签都固定右边。。。
    if (this.$refs.detailPrice && this.$refs.detailPrice.getElementsByClassName('price-slider')[0]) {
      if (total === 0) {
        this.$refs.detailPrice.style.justifyContent = 'flex-end'
      } else {
        this.$refs.detailPrice.style.justifyContent = 'space-between'
      }
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
    editName(item) {
      this.showEditName = true
      this.choose = { ...item }
      this.choose.sessionStartTime = item.sessionStartTime
      this.choose.deadline = item.sessionEndTime || item.sessionStartTime
      if (!this.choose.title) {
        this.choose.title = item.content.name
      }
    },
    editSche(item) {
      this.showEditSche = true
      this.choose = { ...item }
      this.choose.sessionStartTime = item.sessionStartTime
      this.choose.deadline = item.sessionEndTime || item.sessionStartTime
      console.log(this.choose)
    },
    editPrice(item) {
      this.showEditPrice = true
      this.choose = { ...item }
      this.choose.sessionStartTime = item.sessionStartTime
      this.choose.deadline = item.sessionEndTime || item.sessionStartTime
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
      // if (item && item.session && item.session.zoomMeeting) {
      //   try {
      //     const zoomMeetingConfig = JSON.parse(item.session.zoomMeeting)
      //     window.open(zoomMeetingConfig.start_url, '_blank')
      //   } catch (error) {
      //     this.$message.error('parse json error')
      //   }
      // }
    },
    handleCloseShare () {
      this.shareVisible = false
    },
    changeTitle(value, item) {
      this.choose.title = value
    },
    isReadyStart12(item) {
      if (!item.sessionStartTime) return false
      const start = moment(item.sessionStartTime).utc().subtract(12, 'hours')
      return moment().isBefore(start)
    },
    handleCancelSingle(item) {
      this.showEditName = false
      this.showEditSche = false
    },
    disabledDateRange(current) {
      return current && current < moment().subtract(1, 'minutes') // .endOf('day')
    },
    handleDateChange (date, dateString) {
      if (date.length > 0) {
        this.choose.sessionStartTime = moment(date[0].toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
        this.choose.deadline = moment(date[1].toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
      } else {
        this.choose.sessionStartTime = null
        this.choose.deadline = null
      }
    },
    handleSavePrice() {
      const params = this.$refs.priceSet.getPriceSet()
      this.handleSave({
        ...params,
        id: this.choose.id
      }, true)
    },
    handleSave(item, needReload = false) {
      const params = {
        sessionStartTime: this.choose.sessionStartTime,
        deadline: this.choose.deadline,
        register: {
          title: this.choose.title
        },
        id: item.id
      }
      if (item.discountInfo) {
        params.register.discountInfo = [ ...item.discountInfo ]
        params.register.price = item.price
      }
      this.loading = true
      EditSessionScheduleV2(params).then(res => {
        if (res.success) {
          this.$message.success('Opt Successfully')
          item.title = this.choose.title
          item.sessionStartTime = this.choose.sessionStartTime
          item.sessionEndTime = this.choose.deadline
          this.showEditName = false
          this.showEditSche = false
          this.showEditPrice = false
          if (needReload) {
            this.$emit('reload')
          }
        }
      }).finally(res => {
        this.loading = false
      })
    },
    handleGoWork(item) {
      if (item && item.session && item.session.classId && [WORK_SHOPS_TYPE.LUNCHEDBYME.value, WORK_SHOPS_TYPE.REGISTERED.value].includes(item.workshopsType)) {
        const prefix = this.isCurrentType(WORK_SHOPS_TYPE.LUNCHEDBYME.value) ? 't/' : 's/'
        const targetUrl = lessonHost + prefix + item.session.classId + '?token=' + storage.get(ACCESS_TOKEN)
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
          sessionId: item.sessionId,
          channelId: getCookie(SET_PROMOTE_CODE)
        }).then(res => {
          if (res.success) {
            this.$message.success('You have successfully registered in')
            setTimeout(() => {
              this.$emit('reload')
            }, 300)
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
        path: '/teacher/live-workshop/' + item.content.id + '/' + item.content.type + '?relaunch=' + item.sessionId
      })
    },
    handleDel(item) {
      console.log(item)
      // if (WORK_SHOPS_STATUS.ARCHIVED.value === item.workshopsStatus) {
        this.$confirm({
          title: 'Confirm remove live workshop',
          content: 'All the relevant content will be cleared and you will not be able to retrieve after deleting it.',
          centered: true,
          onOk: () => {
            DeleteClassV2({
              sessionId: item.sessionId
            }).then(res => {
              this.$message.success('Remove successfully')
              this.$emit('reload')
            })
          }
        })
      // } else {
      //   DeleteClassV2({
      //     sessionId: item.sessionId
      //   }).then(res => {
      //     this.$message.success('Remove successfully')
      //     this.$emit('reload')
      //   })
      // }
    },
    handleEnd(item) {
      EndSession(item.id).then(res => {
        this.$message.success('End successfully')
        this.$emit('reload')
      })
    },
    handleReopen(item) {
      ReopenSession(item.id).then(res => {
        this.$message.success('Reopen successfully')
        this.$emit('reload')
      })
    },
    handleStatus(statusStr) {
      ClassStatusUpdate({
        sessionId: this.content.sessionId,
        statusStr: statusStr
      }).then(res => {
        this.$message.success(statusStr + ' successfully')
        this.$emit('reload')
      })
    },
    handleArchive(item) {
      if (WORK_SHOPS_STATUS.ENDED.value === item.workshopsStatus) {
        this.$confirm({
          title: 'Confirm archive class session',
          content: `Do you confirm to archive class session? `,
          centered: true,
          onOk: () => {
            ArchiveSession(item.id).then(res => {
              this.$message.success('Archive successfully')
              this.$emit('reload')
            })
          }
        })
      } else {
        ArchiveSession(item.id).then(res => {
          this.$message.success('Archive successfully')
          this.$emit('reload')
        })
      }
    },

    handleRestore(item) {
      RestoreSession(item.id).then(res => {
        this.$message.success('Restore successfully')
        this.$emit('reFetch')
      })
    },

    handleEdit(item) {
      this.$message.info('coming soon...')
    },
    handlePreview(data) {
      this.$emit('close')
      console.log(data)
      this.handlePreviewDetail({
        ...data.content,
        sessionId: data.sessionId
      })
    },
    handlePreviewClose () {
      this.$logger.info('handlePreviewClose')
      this.previewVisible = false
      this.previewCurrentId = null
      this.previewType = null
      this.previewCode = null
      this.needReload && this.$emit('reload')
    },
    handleRefresh() {
      this.needReload = true
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.tag-info-tip {
  .tag-tip {
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
      background-size: contain;
      background-repeat: no-repeat;
      .bottom-action {
        z-index: 1000;
        padding: 0 1/0.14*0.05em /* 5/100 */ 0 1/0.14*0.1em /* 10/100 */;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        line-height: 1/0.14*0.3em /* 30/100 */;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        background-color: rgba(0, 0, 0, 0.7);
        font-size: 0.14em /* 14/100 */;
        user-select: none;
        border-bottom-left-radius: 1/0.14*0.08em /* 8/100 */;
        border-bottom-right-radius: 1/0.14*0.08em /* 8/100 */;
        .bottom-action-item {
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          .bottom-action-item-label {
            padding: 0 0.05em /* 5/100 */;
          }

          &:hover {
            color: #15C39A;
          }
        }
      }
    }
    &:hover {
      .cover-btn {
        display:flex;
      }
    }
    .cover-btn {
      position: absolute;
      height: 0.46em /* 46/100 */;
      top: calc(50% - 0.23em /* 23/100 */);
      border-radius: 0.23em /* 23/100 */;
      padding: 0 0.23em /* 23/100 */;
      background: #2582B5;
      text-align: center;
      display: none;
      align-items: center;
      transition: all 0.1s;
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
      align-items: center;

      .base-info {
        flex: 1;
        display: flex;
        align-items: center;
        .type-icon {
          margin-right: 0.1em;
        }
        .name {
          font-size: 0.22em /* 22/100 */;
          font-family: Arial;
          font-weight: bold;
          color: #17181A;
          width: calc(100% - 3em);
          word-break: break-all;
          text-overflow: ellipsis;
          display: -webkit-box;
          /* autoprefixer: off */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
          -webkit-line-clamp: 2;
          overflow: hidden;
          position: relative;
          .opt {
            position: absolute;
            right: 0;
            top: 0;
            i {
              color: @primary-color;
              margin-right: 5px;
              font-size: 14px;
            }
          }
        }
        .owner {
          font-size: 0.18em /* 18/100 */;
          font-family: Arial;
          font-weight: 400;
          color: #757578;
        }
      }
      .right-info {
        width: 4em;
        text-align: right;
        .update-time {
          font-size: 0.16em /* 16/100 */;
          font-family: Arial;
          font-weight: 400;
          color: #4B4B4B;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          /deep/ .ant-calendar-picker {
            padding-right: 20px;
          }
          .opt {
            position: absolute;
            right: 0;
            i {
              color: @primary-color;
              margin-right: 5px;
              font-size: 14px;
            }
          }
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
      .author-wrap {
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
        .author-con {
          display: flex;
          flex-direction: column;
          .author-name {
            & ~ div {
              margin-top: -1/0.16*0.05em;
              font-size: 0.16em /* 13/100 */;
              font-family: Arial;
              font-weight: 400;
              margin-left: 1/0.16*0.1em /* 10/100 */;
            }
          }
        }
      }
      .zoom-icon {
        height: 0.4em /* 40/100 */;
        display: flex;
        align-items: center;
        // cursor: pointer;
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
      .cc-custom-button {
        padding: 0.1em /* 10/100 */ 0.18em /* 18/100 */;
        border-radius: 0.4em /* 40/100 */;
        label {
          font-size: 0.13em /* 13/100 */;
          padding: 0 1/0.13*0.06em /* 6/100 */;
          line-height: 1/0.13*0.16em /* 16/100 */;
        }
      }
    }
  }
}
.detail-share {
  /deep/ .share-button {
    width:  2.1em;
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
  // padding: 0 0.1em /* 10/100 */;
  flex-grow: 1;
  display: flex;
  align-items: center;
  /deep/ .tag-info {
    // width: 3em /* 300/100 */;
    flex: 1;
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
      margin-bottom: 1/0.15*0.05em;
      border-radius: 1/0.15*0.1rem /* 10/100 */;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 6em;
      text-align: center;
    }
  }
  .price-con {
    margin-top: -0.2em;
    display: flex;
    align-items: center;
    .price-edit {
      font-size: 0.16em /* 16/100 */;
      cursor: pointer;
    }
    /deep/ .price-slider {
      // flex: 1;
      width: 5em;
      .slider-label {
        width: calc(100% - 0.125em /* 12.5/100 */);
        left: 0.0175em /* 1.75/100 */;
        top: -0.15em;
        .slider-label-item {
          font-size: 0.16em /* 16/100 */;
          width:2.25em /* 100/16*.36 */;
          height:2.25em /* 100/16*.36 */;
          line-height:2.25em /* 100/16*.36 */;
          &.current {
            top: 1.3em;
            color: #fff;
          }
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
          width:0.16em /* 16/100 */;
          height:0.16em /* 16/100 */;
        }
        .ant-slider-track {
          height: 0.14em /* 14/100 */;;
        }
        .ant-slider-mark {
          top:2em;
          font-size: 0.15em /* 14/100 */;
        }
      }
    }
  }
}

.tag-item {
  opacity: 0.8;
  cursor: pointer;
  color: #734110;
  font-size: 12px;
  border-radius: 30px;
  line-height: 25px;
  word-break: normal;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
  transition: all 0.3s ease;

  /deep/ .anticon-close {
    opacity: 0;
    color: #f26c59;
  }

  &:hover {
    /deep/ .anticon-close {
      opacity: 1;
    }
  }
}

.more-action {
  cursor: pointer;
  height: .4em;
  display: flex;
  align-items: center;
  svg {
    width: 0.4em /* 40/100 */;
    height: 0.36em /* 36/100 */;
    fill: #494B52 !important;
  }

  &:hover {
    svg {
      fill: #14C39A !important;
    }
  }
}

.content-item-more-action {
  .cc-custom-button {
    padding: 10px 18px!important;
    border-radius: 40px!important;
  }
  .detail-font {
    font-size: 18px;
  }
}

.label-action {
  font-size: 16px;
  color: @primary-color;
}

</style>
