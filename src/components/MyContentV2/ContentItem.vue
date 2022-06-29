<template>
  <div class='content-item' v-if='content' :style="{'border': activeItem ? '1px solid #15c39a' : '1px solid #EEF1F6'}">
    <div class='cover'>
      <div class='cover-block' :style="{'background-image': 'url(' + content.image + ')'}">
      </div>
    </div>
    <div class='detail'>
      <div class='detail-content'>
        <div class='base-info'>
          <div class='name-type'>
            <div class='type-icon'>
              <content-type-icon :type="content.type" />
            </div>
            <div class='name'>
              {{ content.name || 'Untitled ' + contentTypeName }}
            </div>
          </div>
          <div class='extra-info'>
            <a-space>
              <div class='info-item curriculum-info'>
                {{ curriculumName }}
              </div>
              <div class='info-item subject-info'>
                <a-space>
                  <div class='subject-item' v-for='(subject, idx) in content.subjectList' :key='idx'>{{ subject }}</div>
                </a-space>
              </div>
              <div class='info-item year-info'>
                <a-space>
                  <div class='subject-item' v-for='(year, idx) in content.yearList' :key='idx'>{{ year }}</div>
                </a-space>
              </div>
              <div class='info-item task-type-info' v-if='content.taskType'>
                <div class='self-type-wrapper'>
                  <div class='self-field-label'>
                    <div
                      class='task-type-item green-active-task-type'
                      v-if="content.taskType === 'FA'">
                      FA
                    </div>
                    <div
                      class='task-type-item red-active-task-type'
                      v-if="content.taskType === 'SA'">
                      SA
                    </div>
                    <div
                      class='task-type-item blue-active-task-type task-type-activity'
                      v-if="content.taskType === 'Activity'">
                      <a-tooltip title='Teaching/Learning Activity' placement='top'>Activity</a-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </a-space>
          </div>
          <div class='tag-info'>
            <div class='tag-info-item' v-for='(customTag, idx) in content.customTags' :key='idx'>
              <a-tag color='#FFEDAF' class='tag-item' :title='customTag.category'> {{ customTag.name }} </a-tag>
            </div>
          </div>
          <div class='owner'>
            <template v-if='content.owner'>
              <a-avatar :src='content.owner.avatar' size="small" />
            </template>
            <template v-else>
              <a-avatar size="small">{{ content.createBy.toUpperCase()[0] }}</a-avatar>
            </template>
            <div class='user-name'>
              {{ content.owner ? content.owner.nickname : content.createBy }}
            </div>
          </div>
          <div class='update-time'>
            {{ (content.updateTime || content.createTime) | dayjs }}
          </div>
        </div>
        <div class='right-info'>
          <div class='update-time'>
          </div>
        </div>
      </div>
      <div class='action'>
        <template v-if='showButton && !content.delFlag'>
          <a-space :size='30'>
            <a-dropdown :trigger="['click']" :getPopupContainer='trigger => trigger.parentElement' v-if='showDelete'>
              <div class='more-action'>
                <more-icon />
              </div>
              <div class='content-item-more-action' slot='overlay'>
                <div class='menu-item'>
                  <custom-button label='Archive' @click='handleDeleteItem'>
                    <template v-slot:icon>
                      <delete-icon />
                    </template>
                  </custom-button>
                </div>
                <div class='menu-item'>
                  <a-popconfirm :title="'Confirm permanent delete ' +(content.name ? content.name : 'Untitled')+ ' ?'" ok-text="Yes" @confirm="handlePermanentDeleteItem" cancel-text="No">
                    <custom-button label='Delete'>
                      <template v-slot:icon>
                        <delete-icon />
                      </template>
                    </custom-button>
                  </a-popconfirm>
                </div>
              </div>
            </a-dropdown>

            <div class='self-learning' v-if='content.type === typeMap.task'>
              Self learning
              <a-switch size='small' @change='handleSelfLearning' />
            </div>

            <custom-button label='Preview' @click='handlePreviewDetail(content)'>
              <template v-slot:icon>
                <preview-gray-icon />
              </template>
            </custom-button>

            <custom-button
              label='Schedule'
              :title="content.presentationId ? '' : 'This task/PD content can not be scheduled without interactive slides, please edit google slides first before scheduling'"
              v-if='showSchedule && (content.type === typeMap.task || content.type === typeMap.pd) && !content.slideEditing'
              @click='handleSchedule'>
              <template v-slot:icon>
                <schedule-icon />
              </template>
            </custom-button>

            <custom-button
              label='Save changes'
              :loading='updateEditSlideLoading'
              v-if='showSchedule && (content.type === typeMap.task || content.type === typeMap.pd) && content.slideEditing'
              @click='updateEditSlideStatus'>
              <template v-slot:icon>
                <schedule-icon />
              </template>
            </custom-button>

            <custom-button label='Edit' @click='editItem' v-if='showEdit'>
              <template v-slot:icon>
                <edit-icon />
              </template>
            </custom-button>

            <template v-if="showPublish">
              <custom-button label="Publish" @click='handlePublishStatus' v-if='content.status === 0'>
                <template v-slot:icon >
                  <publish-icon/>
                </template>
              </custom-button>

              <custom-button label="Unpublish" @click='handlePublishStatus' v-if='showPublish && content.status !== 0'>
                <template v-slot:icon >
                  <un-publish-icon />
                </template>
              </custom-button>
            </template>

          </a-space>
        </template>
        <template v-if='showButton && content.delFlag'>
          <a-space :size='30'>

            <a-popconfirm :title="'Confirm permanent delete ' +(content.name ? content.name : 'Untitled')+ ' ?'" ok-text="Yes" @confirm="handlePermanentDeleteItem" cancel-text="No">
              <custom-button label='Delete'>
                <template v-slot:icon>
                  <delete-icon />
                </template>
              </custom-button>
            </a-popconfirm>

            <a-popconfirm :title="'Confirm restore ' +(content.name ? content.name : 'Untitled')+ ' ?'" ok-text="Yes" @confirm="handleRestoreItem(content)" cancel-text="No">
              <custom-button label='Restore'>
                <template v-slot:icon>
                  <edit-icon />
                </template>
              </custom-button>
            </a-popconfirm>

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
import { ContentRestore, DeleteMyContentByType, PermanentDeleteMyContent } from '@/api/teacher'
import { ContentItemMixin } from '@/mixins/ContentItemMixin'
import CustomButton from '@/components/Common/CustomButton'
import SubTaskIcon from '@/assets/v2/icons/sub-task.svg?inline'
import PreviewGrayIcon from '@/assets/v2/icons/preview_gray.svg?inline'
import EditIcon from '@/assets/v2/icons/edit.svg?inline'
import PublishIcon from '@/assets/v2/icons/publish_new.svg?inline'
import UnPublishIcon from '@/assets/v2/icons/unpublish.svg?inline'
import ScheduleIcon from '@/assets/v2/icons/schedule.svg?inline'
import OriginalTipsIcon from '@/assets/v2/icons/original_tips.svg?inline'
import DeleteIcon from '@/assets/v2/icons/delete.svg?inline'
import MoreIcon from '@/assets/v2/icons/more.svg?inline'
import ContentPreview from '@/components/Preview/ContentPreview'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import * as logger from '@/utils/logger'

export default {
  name: 'ContentItem',
  components: {
    ContentTypeIcon,
    ContentPreview,
    CustomButton,
    SubTaskIcon,
    PreviewGrayIcon,
    EditIcon,
    PublishIcon,
    UnPublishIcon,
    ScheduleIcon,
    OriginalTipsIcon,
    DeleteIcon,
    MoreIcon
  },
  props: {
    content: {
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
    showPublish: {
      type: Boolean,
      default: false
    },
    showEdit: {
      type: Boolean,
      default: true
    },
    showSchedule: {
      type: Boolean,
      default: true
    },
    showSubTask: {
      type: Boolean,
      default: true
    },
    showDelete: {
      type: Boolean,
      default: true
    }
  },
  mixins: [ContentItemMixin],
  data() {
    return {
      typeMap: typeMap,
      isSelfLearning: false
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
    curriculumName () {
      return this.$store.getters.curriculumId2NameMap.hasOwnProperty(this.content.curriculumId) ? this.$store.getters.curriculumId2NameMap[this.content.curriculumId] : null
    },
    isOwner () {
      return this.$store.getters.userInfo.email === this.content.createBy
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
      if (this.content.presentationId) {
        this.$router.push({
          path: '/teacher/schedule-session/' + this.content.id + '/' + this.content.type
        })
      } else {
        this.$message.warn('This task/PD content can not be scheduled without interactive slides, please edit google slides first before scheduling.')
      }
    },

    handleSelfLearning(isSelfLearning) {
      this.$logger.info('handleSelfLearning', isSelfLearning)
      this.isSelfLearning = isSelfLearning
    },

    handlePublishStatus() {
      this.$emit('update-publish', {
        content: this.content
      })
    },

    handleDeleteItem() {
      this.$logger.info('handleDeleteItem', this.content)
      DeleteMyContentByType(this.content).then(res => {
        this.$logger.info('DeleteMyContentByType', res)
        this.$emit('delete', {
          content: this.content
        })
      })
    },

    handlePermanentDeleteItem () {
      logger.info('handlePermanentDeleteItem', this.content)
      PermanentDeleteMyContent({ sourceId: this.content.id, sourceType: this.content.type }).then(res => {
        logger.info('handlePermanentDeleteItem', res)
      }).then(() => {
        this.$emit('delete', {
          content: this.content
        })
      })
    },

    handleRestoreItem () {
      logger.info('handleRestoreItem', this.content)
      ContentRestore({ id: this.content.id, type: this.content.type }).then(response => {
        this.$logger.info('handleRestoreItem response', response)
      }).finally(() => {
        this.$emit('delete', {
          content: this.content
        })
      })
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
        .name-type {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-direction: row;

          .name {
            margin-left: 10px;
            line-height: 2rem;
            font-size: 1rem;
            font-family: Arial;
            font-weight: bold;
            color: #17181A;
            cursor: pointer;
          }

        }

        .subject {
          cursor: pointer;
          font-family: Arial;
          font-weight: 400;
          color: #757578;
          line-height: 1rem;
          font-size: 0.7rem;
        }

        .tag-info {
          display: flex;
          flex-direction: row;
          max-height: 60px;
          overflow: hidden;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
          margin-top: 5px;
          margin-bottom: 5px;
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

.owner {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;

  .user-name {
    margin-left: 5px;
    line-height: 24px;
    font-size: 0.7rem;
  }
}

.update-time {
  padding-left: 25px;
  line-height: 24px;
  color: #aaa;
  font-size: 0.6rem;
}

.self-type-wrapper {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .self-field-label {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;

    .task-type-item {
      margin-right: 10px;
      width: 25px;
      height: 25px;
      border-radius: 25px;
      border: 2px solid #ddd;
      font-weight: bold;
      display: flex;
      color: #bbb;
      align-items: center;
      justify-content: center;
    }

    .task-type-activity {
      width: 70px;
      border-radius: 50px;
    }

    .green-active-task-type {
      background: rgba(21, 195, 154, 0.1);
      border: 2px solid #15C39A;
      border-radius: 50%;
      font-weight: bold;
      color: #15C39A;
    }

    .red-active-task-type {
      background: rgba(255, 51, 85, 0.1);
      border: 2px solid #FF3355;
      border-radius: 50%;
      opacity: 1;
      font-weight: bold;
      color: #FF3355;
      opacity: 1;
    }

    .blue-active-task-type {
      background: rgb(230, 247, 255);
      border: 2px solid rgb(145, 213, 255);
      border-radius: 50px;
      opacity: 1;
      font-weight: bold;
      color: rgb(24, 144, 255);
    }
  }

  .self-type-filter {
    width: 500px;
  }
}

.extra-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .curriculum-info {
    font-size: 0.6rem;
    background: #E6E4FF;
    padding: 3px 10px;
    border-radius: 20px;
    font-family: Arial;
    font-weight: bold;
    color: #464ABB;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
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
}

.owner {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .user-name {
    padding-left: 5px;
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

.self-learning {
  font-size: 13px;
}
</style>
