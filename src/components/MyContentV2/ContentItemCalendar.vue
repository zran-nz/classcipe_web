<template>
  <div class='content-item' v-if='data'>
    <div class='cover'>
      <div class='cover-block' v-if="data.content && data.content.image" :style="{'background-image': 'url(' + data.content.image + ')'}">
      </div>
      <div class="cover-block" v-else style='background-image: url("http://dcdkqlzgpl5ba.cloudfront.net/file/20210730045859200-education-5923312_640.png");'>
      </div>
    </div>
    <div class='detail'>
      <div class='detail-content'>
        <div class='base-info'>
          <div class='name-con'>
            <a-tooltip :title="data.sessionInfo.sessionName">
              <div class='name'>{{ data.sessionInfo.sessionName }}</div>
            </a-tooltip>
            <a-tooltip :title="data.sessionInfo.className">
              <div class="class">{{ data.sessionInfo.className }}</div>
            </a-tooltip>
            <div class="unit-con" v-if="data.unitPlanInfo">
              <a-select
                :getPopupContainer="trigger => trigger.parentElement"
                :value='data.unitPlanInfo.id'
                @change='handleChangeUnit'
                class='cc-select-white-no-round'
                placeholder='Select a unit'>
                <a-select-option v-for='(item,index) in unitList' :key='index' :value='item.id'>
                  <div class="unit-item">
                    <span class="tip-dot" :style="{backgroundColor: BG_COLORS[index]}"></span>
                    <span>{{ item.name }}</span>
                  </div>
                </a-select-option>
              </a-select>
            </div>
          </div>
          <div class="detail-con">
            <div class="info-con">
              <div class='subject'>
                <div class="author-name">
                  {{ data.sessionInfo.author }}
                </div>
                <div>
                  <a-tag :color="formatSessionType(data.sessionInfo.sessionType).color">{{ formatSessionType(data.sessionInfo.sessionType).name }}</a-tag>
                </div>
                <div v-if="data.sessionInfo && content.sessionInfo.zoomMeeting" class='zoom-icon' @click.prevent.stop="handleToZoom(content)">
                  <img src='~@/assets/icons/zoom/img.png' />
                </div>
                <div class="session-time">
                  {{ data.sessionInfo.sessionStartTime | dayjs('HH:mm') }} - {{ data.sessionInfo.deadline | dayjs('HH:mm') }}
                </div>
              </div>
              <tags-line v-if="data.content && data.content.customTags && data.content.customTags.length > 0" :tags="data.content.customTags" />
            </div>
            <div class="class-con">
              <div class="session-deadline">
                <div class="session-deadline-tab">
                  <a-radio-group v-model="data.sessionInfo.responseLimitMode" button-style="solid" size="small">
                    <a-radio-button :value="0">
                      Off
                    </a-radio-button>
                    <a-radio-button :value="1">
                      Deadline
                    </a-radio-button>
                    <a-radio-button :value="2">
                      Countdown
                    </a-radio-button>
                  </a-radio-group>
                  <a-button size="small" @click="handleSaveResponseLimit" v-show="isChangedResonseLimit">Save</a-button>
                </div>
                <!-- <div class="deadline-tip">Students must complete their work within the allocated time</div> -->
                <div class="session-deadline-opt">
                  <a-space v-if="data.sessionInfo.responseLimitMode === 2" >
                    <a-input-number suffix="Min(s)" size="small" v-model="responseLimitTimeCountDown"></a-input-number>
                    <span>Min(s)</span>
                    <a-tooltip>
                      <template slot="title">
                        Students must complete their work within the allocated time
                      </template>
                      <a-icon type="question-circle" />
                    </a-tooltip>
                  </a-space>
                  <a-space v-if="data.sessionInfo.responseLimitMode === 1" >
                    <a-date-picker
                      :disabled-date="disabledDate"
                      :allow-clear="false"
                      size="small"
                      show-time
                      placeholder="Select Time"
                      v-model="responseLimitTimeDeadline" />
                    <a-tooltip>
                      <template slot="title">
                        Students must complete their work within the allocated time
                      </template>
                      <a-icon type="question-circle" />
                    </a-tooltip>
                  </a-space>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class='right-info'>
          <div class='update-time'>
          </div>
        </div>
      </div>
      <div class='action'>
        <template>
          <a-space :size='10'>
            <!-- <a-dropdown :trigger="['click']" :getPopupContainer='trigger => trigger.parentElement'>
              <div class='more-action'>
                <more-icon />
              </div>
              <div class='content-item-more-action' slot='overlay'>
                <div class='menu-item'>
                  <a-popconfirm title="确定删除吗?" @confirm="handleDeleteItem">
                    <custom-button label='Delete'>
                      <template v-slot:icon>
                        <delete-icon />
                      </template>
                    </custom-button>
                  </a-popconfirm>
                </div>
              </div>
            </a-dropdown> -->

            <a-popconfirm title="确定删除吗?" @confirm="handleDeleteItem">
              <custom-button label='Delete'>
                <template v-slot:icon>
                  <delete-icon />
                </template>
              </custom-button>
            </a-popconfirm>

            <custom-button
              label='Evalute'
              @click='handleEvalute'>
              <template v-slot:icon>
                <original-tips-icon />
              </template>
            </custom-button>

            <!-- <custom-button label='Edit' @click='editItem'>
              <template v-slot:icon>
                <edit-icon />
              </template>
            </custom-button> -->

            <custom-button label='Preview' @click='handlePreview'>
              <template v-slot:icon>
                <icon-font type="icon-xianshi" class="detail-font"/>
              </template>
            </custom-button>

            <div class="review">
              Student-review <a-switch default-checked @change="handleChangeReview" />
            </div>
          </a-space>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash.clonedeep'
import { typeMap } from '@/const/teacher'
import { BG_COLORS } from '@/const/common'

import CustomButton from '@/components/Common/CustomButton'
import EditIcon from '@/assets/v2/icons/edit.svg?inline'
import PublishIcon from '@/assets/v2/icons/publish_new.svg?inline'
import ScheduleIcon from '@/assets/v2/icons/schedule.svg?inline'
import DeleteIcon from '@/assets/v2/icons/delete.svg?inline'
import OriginalTipsIcon from '@/assets/v2/icons/original_tips.svg?inline'
import TagsLine from '@/components/TagsLine'

import MoreIcon from '@/assets/v2/icons/more.svg?inline'
import moment from 'moment'

export default {
  name: 'ContentItemCalendar',
  components: {
    CustomButton,
    EditIcon,
    PublishIcon,
    ScheduleIcon,
    DeleteIcon,
    OriginalTipsIcon,
    MoreIcon,
    TagsLine
  },
  props: {
    content: {
      type: Object,
      default: () => {}
    },
    units: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    content: {
      handler(val) {
        console.log(val)
        this.data = cloneDeep(val)
        this.origin = cloneDeep(val)
        const responseLimitTime = this.data.sessionInfo.responseLimitTime
        if (this.data.sessionInfo.responseLimitMode === 1) {
          this.responseLimitTimeDeadline = moment(new Date(responseLimitTime * 1000))
        } else if (this.data.sessionInfo.responseLimitMode === 2) {
          // this.responseLimitTimeCountDown = Math.ceil((responseLimitTime * 1000 - new Date().getTime()) / 60000)
          this.responseLimitTimeCountDown = this.data.sessionInfo.timeDown || 0
          if (this.responseLimitTimeCountDown < 0) {
            this.responseLimitTimeCountDown = 0
          }
        }
      },
      deep: true,
      immediate: true
    },
    units: {
      handler(val) {
        console.log(val)
        this.unitList = cloneDeep(val)
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      typeMap: typeMap,
      BG_COLORS: BG_COLORS,
      sessionTypeList: [
        {
          id: 1,
          name: 'Assignment',
          allowZoom: false,
          enableZoom: false,
          color: '#333333',
          type: this.$classcipe.ScheduleSessionType.assignment
        },
        {
          id: 2,
          name: 'Lesson',
          allowZoom: true,
          enableZoom: false,
          color: '#15c39a',
          type: this.$classcipe.ScheduleSessionType.lesson
        },
        {
          id: 3,
          name: 'Test',
          allowZoom: true,
          enableZoom: false,
          color: '#c92a2a',
          type: this.$classcipe.ScheduleSessionType.test
        }
      ],
      data: this.content,
      origin: this.content,
      unitList: this.units,
      loading: false,
      responseLimitTimeDeadline: null,
      responseLimitTimeCountDown: 0
    }
  },
  computed: {
    responseLimitTime() {
      let responseLimitTime = 0
      if (this.data.sessionInfo.responseLimitMode === 1 && this.responseLimitTimeDeadline) {
        responseLimitTime = this.responseLimitTimeDeadline.valueOf() - this.data.sessionInfo.date
      } else if (this.data.sessionInfo.responseLimitMode === 2) {
        responseLimitTime = new Date().getTime() + this.responseLimitTimeCountDown * 60 * 1000
      }
      return responseLimitTime / 1000
    },
    isChangedResonseLimit() {
      if (this.origin.sessionInfo.responseLimitMode !== this.data.sessionInfo.responseLimitMode) {
        return true
      } else if (this.origin.sessionInfo.responseLimitTime !== this.responseLimitTime) {
        return true
      }
      return false
    }
  },
  methods: {
    initData() {
      this.data = cloneDeep(this.content)
      this.unitList = cloneDeep(this.units)
    },
    editItem() {
      const item = this.data.sessionInfo
      if (item.sessionType === typeMap['unit-plan']) {
        this.$router.push({
          path: '/teacher/unit-plan-redirect/' + item.planId
        })
      } else if (item.sessionType === typeMap.task) {
        this.$router.push({
          path: '/teacher/task-redirect/' + item.contentId
        })
      } else if (item.sessionType === typeMap.video) {
        this.$router.push({
          path: '/teacher/video-redirect/' + item.contentId
        })
      } else if (item.sessionType === typeMap.pd) {
        this.$router.push({
          path: '/teacher/pd-content-redirect/' + item.contentId
        })
      }
    },
    disabledDate(current) {
      // Can not select days before today and today
      if (this.data && this.data.sessionInfo && this.data.sessionInfo.sessionStartTime) {
        return current && current < moment(this.data.sessionInfo.sessionStartTime)
      } else {
        return false
      }
    },
    formatSessionType(type) {
      const find = this.sessionTypeList.find(item => item.type === type)
      return find || { name: ' - ' }
    },
    handleChangeUnit(id) {
      this.$emit('change-unit', {
        planId: id,
        id: this.data.sessionInfo.id
      })
    },
    handleDeleteItem() {
      this.$emit('delete', this.data)
    },
    handleEvalute() {

    },
    handleToZoom(item) {
      if (item && item.sessionInfo && item.sessionInfo.zoomMeeting) {
        try {
          const zoomMeetingConfig = JSON.parse(item.sessionInfo.zoomMeeting)
          window.open(zoomMeetingConfig.start_url, '_blank')
        } catch (error) {
          this.$message.error('parse json error')
        }
      }
    },
    handleSaveResponseLimit() {
      // let date = 0
      // if (this.data.sessionInfo.responseLimitMode === 2) {
      //   date = 0
      // }
      const params = {
        responseLimitMode: this.data.sessionInfo.responseLimitMode,
        responseLimitTime: this.responseLimitTime,
        timeType: this.data.sessionInfo.responseLimitMode,
        timeDown: this.data.sessionInfo.responseLimitMode === 2 ? this.responseLimitTimeCountDown : 0,
        // deadline: this.data.sessionInfo.responseLimitMode === 1 ? this.responseLimitTimeDeadline.utc().format('YYYY-MM-DD HH:mm:ss') : 0,
        allocatedTimeFlag: this.data.sessionInfo.responseLimitMode !== 0 ? 1 : 0,
        id: this.data.sessionInfo.id
      }
      this.$emit('save-response-limit', params)
    },
    handlePreview() {
      this.$emit('close', { id: this.data.sessionInfo.contentId, type: typeMap.task })
      // this.handlePreviewDetail({ id: this.data.sessionInfo.contentId, type: typeMap.task })
    },
    handleChangeReview(checked) {}
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.content-item {
  padding: 0px;
  width: 100%;
  margin: 0;
  font-size: 12px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  overflow: hidden;
  border-radius: 7px;

  .cover {
    .cover-block {
      border-radius: 8px;
      height: 180*4/5px;
      width: 320*4/5px;
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
    }
  }

  .detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    height: 180*4/5px;

    .detail-content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-grow: 1;

      .base-info {
        // width: 550px;
        .name-con {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          & > div {
            margin-right: 10px;
          }
          .name {
            line-height: 30px;
            font-size: 16px;
            font-family: Arial;
            font-weight: bold;
            color: #17181A;
            cursor: pointer;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
          }
          .class {
            font-size: 14px;
          }
          .unit-con {
            margin-right: 0;
          }
        }
        .detail-con {
          display: flex;
          .info-con {
            flex: 1;
            .subject {
              display: flex;
              align-items: center;
              // font-size: 14px;
              & > div {
                margin-right: 10px;
                white-space: nowrap;
              }
              .author-name {
                cursor: pointer;
                font-family: Arial;
                font-weight: 400;
                color: #757578;
                line-height: 30px;
                font-size: 14px;
              }
            }

            /deep/ .tag-info {
              display: flex;
              align-items: center;
              margin-top: 0;
              .tag-item {
                line-height: 25px;
                height: 25px;
                font-size: 12px;
              }
            }
          }
          .class-con {
            width: 250px;
            .session-deadline {
              display: flex;
              flex-direction: column;
              .deadline-tip {
                background: #14C39A;
                height: 30px;
                line-height: 30px;
                margin-top: 5px;
              }
              .session-deadline-tab {
                display: flex;
                justify-content: space-between;
              }
              .session-deadline-opt {
                display: flex;
                margin-top: 10px;
                align-items: center;
              }
            }
          }
        }
      }
    }

    .zoom-icon {
      height: 20px;
      display: flex;
      align-items: center;
      cursor: pointer;
      img {
        // width: 0.4em /* 40/100 */;
        height: 20px;
      }
    }

    .action {
      flex-shrink: 0;
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      .review {
        font-size: 13px;
      }
    }
  }
}

.more-action {
  cursor: pointer;
  svg {
    width: 40px;
    height: 36px;
    fill: #494B52 !important;
  }

  &:hover {
    svg {
      fill: #14C39A !important;
    }
  }
}
.unit-item {
  display: flex;
  align-items: center;
  .tip-dot {
    margin-right: 5px;
    width: 15px;
    height: 15px;
    border-radius: 15px;
    & ~ span {
      flex: 1;
    }
  }
}
</style>
