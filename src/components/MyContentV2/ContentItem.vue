<template>
  <div class='content-item' v-if='content' :style="{'border': activeItem ? '1px solid #15c39a' : '1px solid #EEF1F6'}">
    <div class='cover'>
      <div class='cover-block' :style="{'background-image': `url('${content.image || 'http://dcdkqlzgpl5ba.cloudfront.net/1392467808404684802/file/202208140641519097-20220814143449.png'}')`}">
        <div class='slide-editing-mask' v-if='(content.type === typeMap.task || content.type === typeMap.pd) && content.slideEditing'>
          <custom-button
            label='Save Slides'
            :loading='updateEditSlideLoading'
            @click='updateEditSlideStatus'>
            <template v-slot:icon>
              <a-icon type="save" />
            </template>
          </custom-button>
        </div>
        <div class='bottom-action' v-if='showCoverBar'>
          <div class='bottom-action-item vertical-left' @click='editItem' v-if="!content.delFlag && showEdit">
            <div class='bottom-action-item-icon'><a-icon type="form" /></div>
            <div class='bottom-action-item-label'>Edit</div>
          </div>
          <div class='bottom-action-item vertical-left' v-else>
          </div>
          <div class='bottom-action-item vertical-right' @click="$store.dispatch('setV2Box', content)" v-show='allowPreview && !((content.type === typeMap.task || content.type === typeMap.pd) && content.slideEditing)'>
            <div class='bottom-action-item-icon'><a-icon type="eye" /></div>
            <div class='bottom-action-item-label'>Preview2</div>
          </div>
        </div>
      </div>
    </div>
    <div class='detail'>
      <div class='detail-content'>
        <div class='base-info'>
          <div class='header-line vertical-between'>
            <div class='left vertical-left'>
              <div class='type-icon vertical-left'>
                <a-space>
                  <content-type-icon :type="content.type" />
                  <collaborate-icon v-if='content.collaborates > 0'/>
                  <a-icon type="shopping" v-if='content.sourceFrom' />
                </a-space>
              </div>
              <div class='name'>
                {{ content.name || 'Untitled ' + contentTypeName }}
              </div>
            </div>
            <div class='right vertical-right'>
              <div class='time-at'>
                {{ (content.updateTime || content.createTime) | datejs }}
              </div>
            </div>
          </div>
          <div class='set-price-line vertical-right' >
            <div class='price-info vertical-left' v-if="showPrice">
              <div class='price'>
                ${{ content.discountPrice || content.price || 0 }}
              </div>
              <div v-if="content.discountPrice > 0 && content.discountPrice !== content.price" class='price_was'>${{ content.price }}</div>
              <div class='edit' v-if='showSetPrice'>
                <a-icon type="edit" @click.native='showEditPrice'/>
              </div>
            </div>
            <div class='publish-status' v-if='showPublishStatus'>
              {{ content.status === 1 ? 'Published' : 'Unpublished' }}
            </div>
          </div>
          <div class='extra-info'>
            <a-space>
              <div class='info-item curriculum-info' v-show='curriculumName && content.type !== typeMap.pd'>
                {{ curriculumName }}
              </div>
              <div class='info-item subject-info'>
                <a-space>
                  <div class='subject-item' v-for='(subject, idx) in content.subjectList.slice(0, 2)' :key="'sub' + idx">{{ subject }}</div>
                </a-space>
                <div class='more-item' v-if='content.subjectList.slice(2).length'>
                  <a-tooltip placement='top' :title='content.subjectList.slice(2).join("、 ")' >more({{ content.subjectList.slice(2).length }})</a-tooltip>
                </div>
              </div>
              <div class='info-item year-info'>
                <a-space>
                  <div class='subject-item' v-for='(year, idx) in content.yearList.slice(0, 4)' :key="'year' + idx">{{ year }}</div>
                </a-space>
                <div class='more-item' v-if='content.yearList.slice(4).length'>
                  <a-tooltip placement='top' :title='content.yearList.slice(4).join("、 ")' >more({{ content.yearList.slice(4).length }})</a-tooltip>
                </div>
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
            <div class='tag-info-item' v-for='(knowledgeTag, cIdx) in knowledgeTagsList' :key="'tag' + cIdx">
              <a-tag color='#EABA7F' class='tag-item knowledge-tag' :title='knowledgeTag'>{{ knowledgeTag }}</a-tag>
            </div>
          </div>
          <div class='tag-info'>
            <template v-if='commandTermsList.length'>
              <div class='tag-info-item' v-for='(command, cIdx) in commandTermsList' :key="'term' + cIdx">
                <a-tag color='#06ACD7' class='tag-item command-tag' :title='command'>{{ command }}</a-tag>
              </div>
            </template>
            <div class='tag-info-item' v-for='(customTag, idx) in content.customTags' :key="'ct' + idx">
              <a-tag color='#FFEDAF' class='tag-item' :title='customTag.category'> {{ customTag.name }} </a-tag>
            </div>
          </div>
        </div>
      </div>
      <div class='footer-line'>
        <div class='avatar-info'>
          <div class='owner'>
            <template v-if='content.owner'>
              <a-avatar v-if='content.owner.avatar' :src='content.owner.avatar' size="small" />
              <img v-else src="~@/assets/icons/library/default-avatar.png"/>
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
        </div>

        <div class='action vertical-right'>
          <template v-if='showButton && !content.delFlag'>
            <custom-button
              label='Schedule'
              :disabled='!content.canPublish || content.slideEditing'
              :disabled-tooltip="content.slideEditing ? 'Please save your slides' : 'Please complete the information'"
              v-if='showSchedule && content.type === typeMap.task'
              @click='handleSchedule'>
              <template v-slot:icon>
                <schedule-icon style='width: 13px; height:14px' />
              </template>
            </custom-button>

            <custom-button
              label='Workshop'
              :disabled='!content.canPublish || content.slideEditing'
              :disabled-tooltip="content.slideEditing ? 'Please save your slides' : 'Please complete the information'"
              v-if='showSchedule && content.type === typeMap.pd'
              @click='handlePublicWorkshopSchedule'>
              <template v-slot:icon>
                <schedule-icon style='width: 13px; height:14px' />
              </template>
            </custom-button>

            <template v-if="canPublishToLibrary(content)">
              <custom-button
                :disabled='!content.canPublish || content.slideEditing'
                :disabled-tooltip="content.slideEditing ? 'Please save your slides' : 'Please complete the information'"
                label="Publish"
                @click='handlePublishStatus'
                v-if='content.status === 0'>
                <template v-slot:icon >
                  <publish-icon style='width: 13px; height:14px'/>
                </template>
              </custom-button>

              <custom-button label="Unpublish" @click='handlePublishStatus' v-if='content.status !== 0 && content.owner.email === $store.getters.email'>
                <template v-slot:icon >
                  <un-publish-icon style='width: 13px; height:14px'/>
                </template>
              </custom-button>
            </template>
            <custom-button label="Review" @click='handlePreviewDetail(content, true)' v-if='content.sourceFrom'>
              <template v-slot:icon >
                <edit-icon style='width: 13px; height:14px'/>
              </template>
            </custom-button>
            <custom-button
              label='Sub-task'
              @click='goToSubTaskList'
              :disabled='!content.canPublish || content.slideEditing'
              :disabled-tooltip="content.slideEditing ? 'Please save your slides' : 'Please complete the information'"
              v-if='showSub && content.type === typeMap.task'>
              <template v-slot:icon>
                <sub-task-icon style='width: 13px; height:14px'/>
              </template>
            </custom-button>
            <a-dropdown :trigger="['click']" :getPopupContainer='trigger => trigger.parentElement' v-if="showCollaborateDelete">
              <div class='more-action'>
                <more-icon />
              </div>
              <div class='content-item-more-action' slot='overlay'>
                <div class='menu-item'>
                  <a-popconfirm placement="topRight" ok-text="Yes" @confirm="handleCollaborateDeleteItem" cancel-text="No">
                    <template v-slot:title>
                      Confirm delete this content?
                    </template>
                    <custom-button label="Delete" >
                      <!-- <template v-slot:icon >
                        <delete-icon style='width: 13px; height:14px'/>
                      </template> -->
                    </custom-button>
                  </a-popconfirm>
                </div>
              </div>
            </a-dropdown>
            <a-dropdown :trigger="['click']" :getPopupContainer='trigger => trigger.parentElement' v-if="(showArchive && content.owner.email === $store.getters.email && content.status !== 1)">
              <div class='more-action'>
                <more-icon />
              </div>
              <div class='content-item-more-action' slot='overlay'>
                <div class='menu-item'>
                  <custom-button label='Archive' @click='handleDeleteItem'>
                    <!-- <template v-slot:icon>
                      <delete-icon style='width: 13px; height:14px'/>
                    </template> -->
                  </custom-button>
                </div>
              </div>
            </a-dropdown>
          </template>

          <template v-if='showButton && content.delFlag && content.owner.email === $store.getters.email && allowPermanentDelete'>
            <a-dropdown :trigger="['click']" :getPopupContainer='trigger => trigger.parentElement'>
              <div class='more-action'>
                <more-icon />
              </div>
              <div class='content-item-more-action' slot='overlay'>
                <div class='menu-item'>
                  <a-popconfirm placement="topRight" :title="'Confirm restore ' +(content.name ? content.name : 'Untitled')+ ' ?'" ok-text="Yes" @confirm="handleRestoreItem(content)" cancel-text="No">
                    <custom-button label='Restore'>
                      <template v-slot:icon>
                        <edit-icon />
                      </template>
                    </custom-button>
                  </a-popconfirm>
                </div>
                <div class='menu-item' v-if="content.sessionCount > 0">
                  <custom-button label='Delete' :disabled="true" disabled-tooltip="There are still sessions existing under this content, it cannot be deleted">
                    <template v-slot:icon>
                      <delete-icon style='width: 13px; height:14px'/>
                    </template>
                  </custom-button>
                </div>
                <div class="menu-item" v-else>
                  <a-popconfirm placement="topRight" ok-text="Yes" @confirm="handlePermanentDeleteItem" cancel-text="No">
                    <template v-slot:title>
                      All the relevant content will be <br/>
                      cleared and you will not be able <br/>
                      to retrieve after deleting it
                    </template>
                    <custom-button label='Delete'>
                      <template v-slot:icon>
                        <delete-icon style='width: 13px; height:14px'/>
                      </template>
                    </custom-button>
                  </a-popconfirm>
                </div>
              </div>
            </a-dropdown>
          </template>
        </div>
      </div>
    </div>

    <discounted-price ref="discountedPrice" @update="updatePrice"/>
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
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import DiscountedPrice from '@/components/MyContentV2/DiscountedPrice'
import * as logger from '@/utils/logger'

import ModalHeader from '@/components/Common/ModalHeader'
import CollaborateIcon from '@/assets/v2/icons/collaborate.svg?inline'
import { CollaboratesDeleteByOthers } from '@/api/collaborate'

export default {
  name: 'ContentItem',
  components: {
    ModalHeader,
    ContentTypeIcon,
    CustomButton,
    SubTaskIcon,
    PreviewGrayIcon,
    EditIcon,
    PublishIcon,
    UnPublishIcon,
    ScheduleIcon,
    OriginalTipsIcon,
    CollaborateIcon,
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
    },
    showSetPrice: {
      type: Boolean,
      default: false
    },
    showPrice: {
      type: Boolean,
      default: true
    },
    showCoverBar: {
      type: Boolean,
      default: true
    },
    allowPermanentDelete: {
      type: Boolean,
      default: true
    },
    showArchive: {
      type: Boolean,
      default: true
    },
    showRestore: {
      type: Boolean,
      default: false
    },
    showPublishStatus: {
      type: Boolean,
      default: false
    },
    showSub: {
      type: Boolean,
      default: true
    },
    showCollaborateDelete: {
      type: Boolean,
      default: false
    }
  },
  mixins: [ContentItemMixin],
  data() {
    return {
      typeMap: typeMap,
      isSelfLearning: false,

      enableDiscount: false,
      visible: false
    }
  },
  created() {
    this.allowPreview = this.clickPreview
    this.isSelfLearning = this.content.contentType === 1
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
    },
    canPublishToLibrary() {
      return function (content) {
       const boolStatus = this.showPublish && !content.sourceFrom && content.owner.email === this.$store.getters.email
        // if (content.type === typeMap.task) {
        //   return boolStatus && content.presentationId &&
        //     !content.fileDeleted && !content.presentationId.startsWith('fake_')
        // }
        if (content.type === typeMap.pd) {
          return false
        }

       return boolStatus
      }
    }
  },
  methods: {
    editItem() {
      const item = this.content
      if (!item.canPublish) {
        this.$classcipe.setRequiredCheck(item.id)
      }
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

    setCheckRequired() {
      this.$classcipe.setRequiredCheck(this.contentId)
    },

    handleSchedule() {
      this.$router.push({
        path: '/teacher/schedule-session/' + this.content.id + '/' + this.content.type
      })
    },

    handlePublicWorkshopSchedule () {
      this.$logger.info('handlePublicWorkshopSchedule', this.content)
      // if (this.content.pageObjects.length && this.content.presentationId && !this.content.presentationId.startsWith('fake_buy_')) {
        this.$router.push({
          path: '/teacher/schedule-workshop/' + this.content.id + '/' + this.content.type
        })
      // } else {
      //   this.$confirm({
      //     title: 'Warning',
      //     content: 'This task/PD content can not be scheduled without interactive slides, please edit google slides first before scheduling.'
      //   })
      // }
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
    },

    handleCollaborateDeleteItem () {
      logger.info('handleCollaborateDeleteItem', this.content)
      CollaboratesDeleteByOthers({ id: this.content.id, type: this.content.type }).then(res => {
        logger.info('handleCollaborateDeleteItem', res)
      }).then(() => {
        this.$emit('update-list')
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
    },

     goToSubTaskList () {
      this.$router.push({
        path: `/teacher/sub-task/${this.content.id}`
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
  position: relative;

  .slide-editing-mask {
    z-index: 800;
    background-color: rgba(0, 0, 0, 0.6);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 8px;
    justify-content: center;
  }

  .cover {
    position: relative;
    .cover-block {
      border-radius: 8px;
      height: 9rem;
      width: 16rem;
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;

      &:hover {
        .slide-editing-mask {
          display: flex !important;
        }
      }

      .bottom-action {
        z-index: 1000;
        padding: 0 5px 0 10px;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        line-height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        background-color: rgba(0, 0, 0, 0.7);
        font-size: 14px;
        user-select: none;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        .bottom-action-item {
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          .bottom-action-item-label {
            padding: 0 5px;
          }

          &:hover {
            color: #15C39A;
          }
        }
      }
    }
  }

  .detail {
    width: calc(100% - 310px);
    padding-left: 1rem;
    min-height: 9rem;

    .detail-content {
      position: relative;
      min-height: 7rem;
      .base-info {
        .header-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-direction: row;

          .left {
            width: calc(100% - 150px);
            .type-icon {
              min-width: 40px;
              white-space: nowrap;
              .ant-space-item {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
              }
              svg {
                width: 25px;
                height: 25px;
              }
            }
            .name {
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
          }

          .right {
            width: 150px;
            font-size: 14px;
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

    .footer-line {
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .avatar-info {
        width: 200px;
        img {
          width: 24px;
          height: 24px;
          border-radius: 24px;
        }
      }
      .action {
        width: calc(100% - 300px);
        > div {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-left: 10px;
        }
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
  padding: 5px 0;
  justify-content: flex-start;

  .info-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    align-items: center;

    .more-item {
      padding-left: 8px;
      color: #aaa;
      cursor: pointer;
    }
  }

  .curriculum-info {
    font-size: 0.6rem;
    background: #E6E4FF;
    padding: 5px 10px;
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
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
  }

  .year-info {
    font-size: 0.6rem;
    font-family: Arial;
    font-weight: 400;
    color: #FFA63D;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
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
  align-items: flex-end;
  font-size: 13px;
  button{
    margin-left: 4px;
  }
  min-width: 110px;
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

.set-price-line {
  line-height: 15px;
  position: relative;
  .price-info {
    position: relative;
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
      cursor: none;
      font-size: 14px;
      vertical-align: middle;
    }

    .edit {
      padding-left: 5px;
      visibility: visible;
      font-size: 14px;
      cursor: pointer;
    }
  }
}

.publish-status {
  position: absolute;
  bottom: -35px;
  font-size: 12px;
  color: #999;
  cursor: pointer;
  user-select: none;
}
</style>
