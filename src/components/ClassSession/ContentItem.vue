<template>
  <div class='content-item' v-if='content' :style="{'border': activeItem ? '1px solid #15c39a' : '1px solid #EEF1F6'}">
    <div class='cover'>
      <div class='cover-block' :style="{'background-image': 'url(' + content.image + ')'}">
        <slot name='cover-action'>
        </slot>
      </div>
    </div>
    <div class='detail'>
      <div class='detail-content'>
        <div class='base-info'>
          <div class='name'>
            <div class='content-type-name' v-if='contentTypeName'>
              {{ contentTypeName }}
            </div>
            <div class='content-name'>
              <template v-if='!editingSessionName'>{{ session.sessionName || 'Untitled' }}</template>
              <template v-if='editingSessionName'>
                <a-input class='cc-form-input' v-model='newSessionName' />
              </template>
            </div>
            <div class='edit-icon' @click='toggleEditSessionName'>
              <edit-blue-icon v-if='!editingSessionName' />
              <a-icon type="check" v-if='editingSessionName' />
            </div>
          </div>
          <div class='sub-row'>
            <div class='sub-left'>
              <div class='owner'>
                <a-avatar :src='session.userAvatar' size="small" />
                <div class='user-name'>
                  {{ session.userRealName }}
                </div>
              </div>
              <div class='teach-way'>
                <a-space>
                  <div class='session-type' v-if='session.session.sessionType === 1'>Assignment</div>
                  <div class='session-type' v-if='session.session.sessionType === 2'>Lesson</div>
                  <div class='session-type' v-if='session.session.sessionType === 3'>Test</div>
                </a-space>
              </div>
              <div class='lesson-zoom' v-show='zoomMeetStartUrl' @click='startZoom'>
                <div class='icon'>
                  <zoom-icon />
                </div>
                Zoom
              </div>
            </div>
            <div class='sub-right'>
              <div class='session-date'>
                <template v-if='!editingSessionTime'>
                  <template v-if='session.session.sessionStartTime || session.session.deadline'>
                    {{ session.session.sessionStartTime | dayjs }}
                    <template v-if='session.session.sessionStartTime && session.session.deadline'> - </template>
                    {{ session.session.deadline | dayjs }}
                  </template>
                  <template v-else>
                    session start time not set
                  </template>
                </template>
                <template v-if='editingSessionTime'>
                  <a-range-picker :default-value="initDate" :disabled-date="disabledDate" @change="handleDateChange" format='YYYY-MM-DD HH:mm:ss' :show-time="{ format: 'HH:mm' }"/>
                </template>
                <div class='edit-icon' @click='toggleEditSessionTime'>
                  <edit-blue-icon v-if='!editingSessionTime' />
                  <a-icon type="check" v-if='editingSessionTime' />
                </div>
              </div>
            </div>
          </div>
          <div class='subject'>
            <div class='subject-item' v-for='(subject, idx) in content.subjectList' :key='idx'>
              {{ subject }}
            </div>
          </div>
          <div class='year'>
            <div class='year-item' v-for='(year, idx) in content.yearList' :key='idx'>
              {{ year }}
            </div>
          </div>
        </div>
        <div class='right-info'>
          <div class='update-time'>
          </div>
        </div>
      </div>
      <div class='action'>
        <template v-if='showButton'>
          <a-space :size='30'>
            <a-dropdown :trigger="['click']" :getPopupContainer='trigger => trigger.parentElement'>
              <div class='more-action'>
                <more-icon />
              </div>
              <div class='content-item-more-action' slot='overlay'>
                <div class='menu-item'>
                  <custom-button label='Takeaways' @click='handleTakeaway'></custom-button>
                  <custom-button label='Ask someone to teach' @click='handleCoteacher'></custom-button>
                  <custom-button label='Previous sessions' @click='handlePreviewSession'></custom-button>
                </div>
              </div>
            </a-dropdown>

            <custom-button label='Sub-task' v-if='content.type === typeMap.task && content.subTasks.length > 0'>
              <template v-slot:icon>
                <sub-task-icon />
              </template>
            </custom-button>

            <custom-button
              :label="'Evaluate 6/19'"
              @click='handleSchedule'>
            </custom-button>

            <custom-button label='Edit' @click='editItem'>
              <template v-slot:icon>
                <edit-icon />
              </template>
            </custom-button>

            <custom-button label='Preview' @click='handlePreviewDetail(content)'>
              <template v-slot:icon>
                <view-icon style='width: 20px' />
              </template>
            </custom-button>
          </a-space>
        </template>
      </div>

      <content-preview
        :content-id='previewCurrentId'
        :content-type='previewType'
        v-if='previewVisible'
        @close='handlePreviewClose' />
    </div>
  </div>
</template>

<script>

import { getLabelNameType, typeMap } from '@/const/teacher'
import { ContentItemMixin } from '@/mixins/ContentItemMixin'
import CustomButton from '@/components/Common/CustomButton'
import SubTaskIcon from '@/assets/v2/icons/sub-task.svg?inline'
import EditIcon from '@/assets/v2/icons/edit.svg?inline'
import PublishIcon from '@/assets/v2/icons/publish_new.svg?inline'
import ViewIcon from '@/assets/v2/icons/view.svg?inline'
import EditBlueIcon from '@/assets/v2/icons/edit_blue.svg?inline'
import ScheduleIcon from '@/assets/v2/icons/schedule.svg?inline'
import OriginalTipsIcon from '@/assets/v2/icons/original_tips.svg?inline'
import DeleteIcon from '@/assets/v2/icons/delete.svg?inline'
import MoreIcon from '@/assets/v2/icons/more.svg?inline'
import ContentPreview from '@/components/Preview/ContentPreview'
import ZoomIcon from '@/assets/icons/zoom/zoomus-icon.svg?inline'
import moment from 'moment'
import { AddOrUpdateClass } from '@/api/classroom'

export default {
  name: 'ContentItem',
  components: {
    ContentPreview,
    CustomButton,
    EditBlueIcon,
    SubTaskIcon,
    ViewIcon,
    EditIcon,
    PublishIcon,
    ScheduleIcon,
    OriginalTipsIcon,
    DeleteIcon,
    ZoomIcon,
    MoreIcon
  },
  props: {
    content: {
      type: Object,
      default: null
    },
    session: {
      type: Object,
      default: null
    },
    showButton: {
      type: Boolean,
      default: true
    },
    clickPreview: {
      type: Boolean,
      default: true
    },
    activeItem: {
      type: Boolean,
      default: false
    }
  },
  mixins: [ ContentItemMixin ],
  data() {
    return {
      typeMap: typeMap,
      isSelfLearning: false,
      editingSessionName: false,
      editingSessionTime: false,
      newSessionName: '',

      initDate: null,
      newSessionStartTime: '',
      newDeadline: ''
    }
  },
  created() {
    this.allowPreview = this.clickPreview
  },
  computed: {
    status() {
      return this.content.status
    },
    contentTypeName () {
      return this.content ? getLabelNameType(this.content.type) : null
    },
    zoomMeetStartUrl () {
      if (this.session && this.session.session.zoomMeeting) {
        const zoomMeeting = JSON.parse(this.session.session.zoomMeeting)
        return zoomMeeting.start_url
      } else {
        return null
      }
    }
  },
  methods: {
    editItem() {
      const item = this.content
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

    handleSchedule() {
      this.$router.push({
        path: '/teacher/schedule-session/' + this.content.id + '/' + this.content.type
      })
    },

    handlePreviewSession() {
      this.$logger.info('handlePreviewSession', this.content)
    },

    handleCoteacher() {
      this.$logger.info('handleCoteacher', this.content)
    },

    handleTakeaway() {
      this.$logger.info('handleTakeaway', this.content)
    },

    startZoom () {
      if (this.zoomMeetStartUrl) {
        window.open(this.zoomMeetStartUrl)
      } else {
        this.$message.warn('Zoom meeting info not found!')
      }
    },

    toggleEditSessionName () {
      this.$logger.info('toggleEditSessionName')
      if (this.editingSessionName) {
        if (this.newSessionName.trim().length) {
          this.session.sessionName = this.newSessionName.trim()
          this.editingSessionName = false
          this.updateSession()
        }
      } else {
        this.newSessionName = this.session.sessionName || 'Untitled'
        this.editingSessionName = true
      }
    },
    toggleEditSessionTime () {
      if (this.editingSessionTime) {
        this.$emit('update-time')
        this.editingSessionTime = false
      } else {
        this.initDate = [moment(this.session.sessionStartTime), moment(this.session.deadline)]
        this.editingSessionTime = true
      }
    },

    updateSession() {
      this.$logger.info('update session', this.session)
      AddOrUpdateClass(this.session).then(response => {
        this.$logger.info('response item', response)
      })
    },

    disabledDate(current) {
      return current && current < moment().subtract(1, 'days').endOf('day')
    },

    handleDateChange (date, dateString) {
      this.$logger.info('handleDateChange', date, dateString)
      this.session.sessionStartTime = moment(date[0].toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
      this.session.deadline = moment(date[1].toDate()).utc().format('YYYY-MM-DD HH:mm:ss')
      this.updateSession()
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.content-item {
  padding: 1rem;
  width: 100%;
  margin: 1rem 0;
  font-size: 1rem;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  overflow: hidden;
  border-radius: 7px;

  .cover {
    .cover-block {
      position: relative;
      border-radius: 8px;
      height: 9rem;
      width: 16rem;
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
    }
  }

  .detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: 1rem;
    min-height: 9rem;

    .detail-content {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-grow: 1;

      .base-info {
        width: 100%;
        cursor: pointer;
        .name {
          line-height: 2rem;
          font-size: 1rem;
          font-family: Arial;
          font-weight: bold;
          color: #17181A;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;

          .content-type-name {
            margin-right: 5px;
            color: #0C90E3;
          }

          .edit-icon {
            display: none;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            margin-left: 5px;
            svg {
              width: 14px;
              height: 14px;
            }
          }

          &:hover {
            .edit-icon {
              display: flex;
            }
          }
        }

        .sub-row {
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 5px;
          .sub-left {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-direction: row;
            .owner {
              margin-right: 10px;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              flex-direction: row;

              .user-name {
                margin-left: 5px;
                line-height: 24px;
                font-size: 14px;
              }
            }

            .teach-way {
              font-size: 13px;
              color: #4a8cff;
              line-height: 24px;
              font-weight: bold;
              padding: 0 10px;
            }

            .lesson-zoom {
              margin-right: 10px;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              flex-direction: row;
              font-size: 13px;
              color: #4a8cff;
              .icon {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                flex-direction: row;
                padding: 0 4px;
                svg {
                  width: 20px;
                  height: 20px;
                }
              }
            }
          }

          .sub-right {
            .session-date {
              font-size: 13px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-end;
            }
            .edit-icon {
              visibility: hidden;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
              margin-left: 5px;
              svg {
                width: 14px;
                height: 14px;
              }
            }

            &:hover {
              .edit-icon {
                visibility: visible;
              }
            }
          }
        }

        .subject, .year {
          cursor: pointer;
          font-family: Arial;
          font-weight: 400;
          color: #757578;
          height: 1rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-direction: row;
          flex-wrap: nowrap;
        }
      }
    }

    .action {
      flex-shrink: 0;
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
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

.cover-action {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.0);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  transition: all 0.3s ease-in-out;

  .action-btn {
    display: flex;
    flex-direction: column;
    opacity: 0;
    transition: all 0.3s ease-in-out;
    div {
      margin: 8px 0;
    }
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.4);
    .action-btn {
      opacity: 1;
    }
  }
}

.menu-item {
  div {
    margin: 8px 0;
  }
}

</style>
