<template>
  <div class='content-item' v-if='content'>
    <div class='cover'>
      <div class='cover-block' :style="{'background-image': `url('${content.image}')`}">
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
              <div class='info-item curriculum-info' v-show='curriculumName && content.type !== typeMap.pd'>
                {{ curriculumName }}
              </div>
              <div class='info-item subject-info'>
                <a-space>
                  <div class='subject-item' v-for='(subject, idx) in content.subjectList' :key='subject+ idx'>{{ subject }}</div>
                </a-space>
              </div>
              <div class='info-item year-info'>
                <a-space>
                  <div class='subject-item' v-for='(year, idx) in content.yearList' :key='year + idx'>{{ year }}</div>
                </a-space>
              </div>
              <div class='info-item task-type-info' v-if='content.taskType'>
                <div class='self-type-wrapper'>
                  <div class='self-field-label'>
                    <div
                      class='task-type-item green-active-task-type'
                      v-if="content.taskType === 'FA'">
                      <a-tooltip placement='top' title='Formative Assessment'>FA</a-tooltip>
                    </div>
                    <div
                      class='task-type-item red-active-task-type'
                      v-if="content.taskType === 'SA'">
                      <a-tooltip placement='top' title='Summative Assessment'>SA</a-tooltip>
                    </div>
                    <div
                      class='task-type-item blue-active-task-type task-type-activity'
                      v-if="content.taskType === 'Activity'">
                      <a-tooltip title='Teaching/Learning Activity' placement='top'>Activity</a-tooltip>
                    </div>
                    <div
                      class='task-type-item blue-active-task-type task-type-examine'
                      v-if="content.taskType === 'IA'">
                      <a-tooltip title='Internal Assessment' placement='top'>IA</a-tooltip>
                    </div>
                  </div>
                </div>
              </div>
            </a-space>
          </div>
          <div class='tag-info' v-if='knowledgeTagsList.length'>
            <div class='tag-info-item' v-for='(knowledgeTag, cIdx) in knowledgeTagsList' :key='knowledgeTag + cIdx'>
              <a-tag color='#EABA7F' class='tag-item knowledge-tag' :title='knowledgeTag'>{{ knowledgeTag }}</a-tag>
            </div>
          </div>
          <div class='tag-info'>
            <template v-if='commandTermsList.length'>
              <div class='tag-info-item' v-for='(command, cIdx) in commandTermsList' :key='command + cIdx'>
                <a-tag color='#06ACD7' class='tag-item command-tag' :title='command'>{{ command }}</a-tag>
              </div>
            </template>
            <div class='tag-info-item' v-for='(customTag, idx) in content.customTags' :key='customTag.name + idx'>
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
            <!-- <div class='user-name' v-if="content.owner.email === $store.getters.email">
              Me
            </div> -->
            <div class='user-name'>
              {{ (content.owner ? (content.owner.firstname + ' ' + content.owner.lastname) : content.createBy) | upCaseFirst }}
            </div>
          </div>
          <div class='update-time'>
            {{ (content.updateTime || content.createTime) | dayjs }}
          </div>
        </div>
        <div class='right-info' @click.stop=''>
          <a-space>
            <div class='price-info vertical-left'>
              <div class='price'>
                ${{ content.discountPrice || content.price || 0 }}
              </div>
              <div v-if="content.discountPrice > 0 && content.discountPrice !== content.price" class='price_was'>${{ content.price }}</div>
              <div class='edit'>
                <a-icon type="edit" @click.native='showEditPrice'/>
              </div>
            </div>
            <div class='sale-info vertical-left'>
              <div class='sales'>Sales: {{ content.sales || 0 }}</div>
            </div>
          </a-space>
        </div>
      </div>
      <div class='action'>
        <template v-if='showButton'>
          <a-space :size='30'>
            <custom-button label='Preview' @click='handlePreviewDetail(content)'>
              <template v-slot:icon>
                <preview-gray-icon />
              </template>
            </custom-button>

            <custom-button label="Publish" @click='handlePublishStatus' v-if='content.status === 0'>
              <template v-slot:icon >
                <publish-icon/>
              </template>
            </custom-button>

            <custom-button label="Unpublish" @click='handlePublishStatus' v-if='content.status !== 0'>
              <template v-slot:icon >
                <un-publish-icon />
              </template>
            </custom-button>
          </a-space>
        </template>
      </div>

      <content-preview
        :content-id='previewCurrentId'
        :content-type='previewType'
        :is-library="true"
        v-if='previewVisible'
        @close='handlePreviewClose' />

      <discounted-price ref="discountedPrice" @update="updatePrice"/>

    </div>
  </div>
</template>

<script>

import PreviewGrayIcon from '@/assets/v2/icons/preview_gray.svg?inline'
import { getLabelNameType, typeMap } from '@/const/teacher'
import * as logger from '@/utils/logger'
import { DeleteMyContentByType } from '@/api/teacher'
import { ContentItemMixin } from '@/mixins/ContentItemMixin'
import CustomButton from '@/components/Common/CustomButton'
import SubTaskIcon from '@/assets/v2/icons/sub-task.svg?inline'
import EditIcon from '@/assets/v2/icons/edit.svg?inline'
import PublishIcon from '@/assets/v2/icons/publish_new.svg?inline'
import UnPublishIcon from '@/assets/v2/icons/unpublish.svg?inline'
import ScheduleIcon from '@/assets/v2/icons/schedule.svg?inline'
import OriginalTipsIcon from '@/assets/v2/icons/original_tips.svg?inline'
import DeleteIcon from '@/assets/v2/icons/delete.svg?inline'
import MoreIcon from '@/assets/v2/icons/more.svg?inline'

import ContentPreview from '@/components/Preview/ContentPreview'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import ModalHeader from '@/components/Common/ModalHeader'
import DiscountedPrice from '@/components/MyContentV2/DiscountedPrice'

export default {
  name: 'ContentItem',
  components: {
    ModalHeader,
    ContentTypeIcon,
    ContentPreview,
    CustomButton,
    SubTaskIcon,
    EditIcon,
    PreviewGrayIcon,
    PublishIcon,
    UnPublishIcon,
    ScheduleIcon,
    OriginalTipsIcon,
    DeleteIcon,
    MoreIcon,
    DiscountedPrice
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
      visible: false,
      enableDiscount: false,
      discount: 0,
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

    handleSchedule() {
      this.$router.push({
        path: '/teacher/schedule-session/' + this.content.id + '/' + this.content.type
      })
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
      logger.info('handleDeleteItem', this.content)
      DeleteMyContentByType(this.content).then(res => {
        logger.info('DeleteMyContentByType', res)
        this.$emit('delete', {
          content: this.content
        })
      })
    },

    showEditPrice() {
      this.visible = true
      this.$refs.discountedPrice.showEditPrice(this.content.id, this.content.type)
    },

    updatePrice (obj) {
      this.$logger.info('update price')
      this.content.price = obj.price
      this.content.discountPrice = obj.discountPrice
      this.visible = false
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
      background-size: contain;
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
      justify-content: flex-start;
      flex-grow: 1;
      .base-info {
        // min-width: 500px;
        width: 100%;
        // @media screen and (max-width: 1300px) {
        //   .base-info{
        //     min-width: 400px;
        //   }
        // }
        .type-icon {
          white-space: nowrap;
        }
        .name-type {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-direction: row;
          text-overflow: ellipsis;
          word-break: break-word;
          user-select: none;
          overflow: hidden;
          .name {
            width: 90%;
            margin-left: 10px;
            line-height: 2rem;
            font-size: 1rem;
            font-family: Arial;
            font-weight: bold;
            color: #17181A;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            white-space: nowrap;
          }

          // @media screen and (max-width: 1300px) {
          //   .name {
          //     width: 400px;
          //   }
          // }

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
    padding: 5px 10px;
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

.right-info {
  display: flex;
  padding-right: 20px;

  .price-info {
    padding-right: 10px;
    .price {
      cursor: pointer;
      color: #e4393c;
      font-size: 30px;
      font-weight: 400;
      font-family: Verdana;
    }

    .price_was {
      text-decoration:line-through;
      font-family: Verdana;
      margin-left: 5px;
      user-select: none;
      font-size: 15px;
      padding-top: 5px;
      vertical-align: middle;
    }

    .edit {
      padding-left: 5px;
      visibility: visible;
      font-size: 14px;
      cursor: pointer;
    }
  }

  .sale-info {
    width: 60px;
    font-size: 14px;
    margin-left: 20px;
  }
}

.cc-small-input {
  width: 100px;
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

.edit-price {
  width: 100%;
  > div {
    margin: 10px 0;
  }

  .label-name {
    text-align: right;
    color: #222;
  }
}

.knowledge-tag, .command-tag {
  color: #fff;
}
</style>
