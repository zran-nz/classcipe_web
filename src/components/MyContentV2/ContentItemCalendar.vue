<template>
  <div class='content-item' v-if='data'>
    <div class='cover'>
      <div class='cover-block' :style="{'background-image': 'url(' + data.unitPlanInfo.image + ')'}">
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
            <div class="unit-con">
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
              {{ data.startTime | dayjs('HH:mm') }} - {{ data.endTime | dayjs('HH:mm') }}
            </div>
            <div class="session-deadline">
              <a-radio-group default-value="a" button-style="solid" size="small">
                <a-radio-button value="a">
                  Off
                </a-radio-button>
                <a-radio-button value="b">
                  Deadline
                </a-radio-button>
                <a-radio-button value="c">
                  Countdown
                </a-radio-button>
              </a-radio-group>
            </div>
          </div>
          <div class='tag-info'>
            <div class='tag-info-item'>
              Knowledge tag
            </div>
            <div class='tag-info-item'>
              Commen term
            </div>
          </div>
          <div class='owner'>
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
            <a-dropdown :trigger="['click']" :getPopupContainer='trigger => trigger.parentElement'>
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
            </a-dropdown>

            <custom-button
              label='Evalute'
              @click='handleEvalute'>
              <template v-slot:icon>
                <original-tips-icon />
              </template>
            </custom-button>

            <custom-button label='Edit' @click='editItem'>
              <template v-slot:icon>
                <edit-icon />
              </template>
            </custom-button>

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
    <content-preview
      :content-id='previewCurrentId'
      :content-type='previewType'
      v-if='previewVisible'
      @close='handlePreviewClose' />
  </div>
</template>

<script>
import cloneDeep from 'lodash.clonedeep'
import { typeMap } from '@/const/teacher'
import { BG_COLORS } from '@/const/common'

import { ContentItemMixin } from '@/mixins/ContentItemMixin'
import ContentPreview from '@/components/Preview/ContentPreview'
import CustomButton from '@/components/Common/CustomButton'
import EditIcon from '@/assets/v2/icons/edit.svg?inline'
import PublishIcon from '@/assets/v2/icons/publish_new.svg?inline'
import ScheduleIcon from '@/assets/v2/icons/schedule.svg?inline'
import DeleteIcon from '@/assets/v2/icons/delete.svg?inline'
import OriginalTipsIcon from '@/assets/v2/icons/original_tips.svg?inline'

import MoreIcon from '@/assets/v2/icons/more.svg?inline'

export default {
  name: 'ContentItemCalendar',
  components: {
    ContentPreview,
    CustomButton,
    EditIcon,
    PublishIcon,
    ScheduleIcon,
    DeleteIcon,
    OriginalTipsIcon,
    MoreIcon
  },
  mixins: [ContentItemMixin],
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
      unitList: this.units,
      loading: false
    }
  },
  methods: {
    initData() {

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
    handlePreview() {
      this.$emit('close')
      this.handlePreviewDetail({ id: this.data.sessionInfo.contentId, type: typeMap.task })
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
        }

        .subject {
          display: flex;
          align-items: center;
          font-size: 14px;
          & > div {
            margin-right: 10px;
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

        .tag-info {
          display: flex;
          align-items: center;
          .tag-info-item {
            line-height: 30px;
            font-size: 12px;
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
