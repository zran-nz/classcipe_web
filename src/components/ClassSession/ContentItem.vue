<template>
  <div class='content-item' :style="{'border': activeItem ? '1px solid #15c39a' : '1px solid #EEF1F6'}">
    <div class='cover'>
      <div class='cover-block' :style="{'background-image': 'url(' + session.session.image + ')'}">
        <slot name='cover-action'>
        </slot>
      </div>
    </div>
    <div class='detail'>
      <div class='detail-content'>
        <div class='base-info'>
          <div class='name'>
            <div class='content-type-name' v-if='contentTypeName && showTypeName'>
              {{ contentTypeName }}
            </div>
            <div class='content-name'>
              <template v-if='!editingSessionName'>{{ session.session.sessionName || 'Untitled' }}</template>
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
                  <img src='~@/assets/icons/zoom/img.png' />
                </div>
              </div>
            </div>
          </div>
          <div class='subject subject-info' v-if="content" >
            <a-space>
              <div class='subject-item' v-for='(subject, idx) in content.subjectList' :key='idx'>{{ subject }}</div>
            </a-space>
          </div>
          <div class='year year-info' v-if="content">
            <a-space>
              <div class='subject-item' v-for='(year, idx) in content.yearList' :key='idx'>{{ year }}</div>
            </a-space>
          </div>
          <div class='tag-info' v-if='content'>
            <div class='tag-info-item' v-for='(customTag, idx) in content.customTags' :key='idx'>
              <a-tag color='#FFEDAF' class='tag-item' :title='customTag.category'> {{ customTag.name }} </a-tag>
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
                  <custom-button label='Delete' @click='handleDeleteSession'></custom-button>
                </div>
              </div>
            </a-dropdown>

            <custom-button label='Sub-task' v-if='content && content.type === typeMap.task && content.subTasks.length > 0'>
              <template v-slot:icon>
                <sub-task-icon />
              </template>
            </custom-button>
            <custom-button v-if="session.allowEdit" label='Edit' @click='editItem'>
              <template v-slot:icon>
                <edit-icon />
              </template>
            </custom-button>

            <custom-button v-if="content" label='Preview' @click='handlePreviewDetail(content)'>
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
import { DeleteClassV2 } from '@/api/v2/classes'

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
    },
    showTypeName: {
      type: Boolean,
      default: true
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

      initDate: [moment(new Date()), null],
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
      this.$logger.info('edit session content', this.session)
      if (this.content.presentationId) {
        this.$router.push({
          path: '/teacher/schedule-session/' + this.content.id + '/' + this.content.type
        })
      } else {
        this.$message.warn('This task/PD content can not be scheduled without interactive slides, please edit google slides first before scheduling.')
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

    handleDeleteSession() {
      this.$logger.info('handleDeleteSession', this.content)
      if (this.content?.sessionId) {
        DeleteClassV2({
          sessionId: this.content.sessionId
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('Remove successfully')
            this.$emit('reFetch')
          }
        }).finally(() => {
          this.loading = false
        })
      }
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
      this.$logger.info('toggleEditSessionName', this.session)
      if (this.editingSessionName) {
        if (this.newSessionName.trim().length) {
          this.session.session.sessionName = this.newSessionName.trim()
          this.editingSessionName = false
          this.updateSession()
        }
      } else {
        this.newSessionName = this.session.session.sessionName || 'Untitled'
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
      AddOrUpdateClass(this.session.session).then(response => {
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
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            margin-left: 5px;
            svg {
              width: 14px;
              height: 14px;
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
              height: 20px;
              .icon img{
                height: 20px;
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
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
              margin-left: 5px;
              svg {
                width: 14px;
                height: 14px;
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

        .subject-info {
          font-size: 0.6rem;
          font-family: Arial;
          font-weight: 400;
          color: #3D94FF;
        }

        .year-info {
          font-size: 0.6rem;
          font-family: Arial;
          font-weight: 400;
          color: #FFA63D;
        }

        .tag-info {
          display: flex;
          flex-direction: row;
          max-height: 30px;
          overflow: hidden;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
          margin-top: 7px;
          margin-bottom: 7px;
          .tag-info-item {
            margin-right: 5px;
            margin-bottom: 5px;
          }
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

</style>
