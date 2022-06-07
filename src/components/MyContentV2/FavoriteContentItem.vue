<template>
  <div class='content-item' v-if='content'>
    <div class='cover' @click='handlePreviewDetail(content)'>
      <div class='cover-block' :style="{'background-image': 'url(' + content.image + ')'}">
      </div>
    </div>
    <div class='detail'>
      <div class='detail-content' @click='handlePreviewDetail(content)'>
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
            <div class='tag-info-item'>
            </div>
            <div class='tag-info-item'>
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
        <template v-if='showButton'>
          <a-space>
            <custom-button label='Duplicate' @click='handleDuplicateItem'>
              <template v-slot:icon>
                <duplicate-icon />
              </template>
            </custom-button>

            <custom-button label='Edit' @click='editItem'>
              <template v-slot:icon>
                <edit-icon />
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
import * as logger from '@/utils/logger'
import { ContentItemMixin } from '@/mixins/ContentItemMixin'
import CustomButton from '@/components/Common/CustomButton'
import EditIcon from '@/assets/v2/icons/edit.svg?inline'
import DuplicateIcon from '@/assets/v2/icons/duplicate.svg?inline'
import ContentPreview from '@/components/Preview/ContentPreview'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'

export default {
  name: 'FavoriteContentItem',
  components: {
    ContentTypeIcon,
    ContentPreview,
    CustomButton,
    DuplicateIcon,
    EditIcon
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

    handlePublishStatus() {
      this.$emit('update-publish', {
        content: this.content
      })
    },

    handleDuplicateItem () {
      logger.info('handleDuplicateItem', this.content)
      this.$emit('duplicate', {
        content: this.content
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
          .tag-info-item {
            height: 1rem;
            line-height: 1rem;
            font-size: 0.6rem;
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
</style>
