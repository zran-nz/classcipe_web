<template>
  <div class='content-item' v-if='content'>
    <div class='cover' @click='handlePreviewDetail(content)'>
      <div class='cover-block' :style="{'background-image': `url('${content.image || '//dcdkqlzgpl5ba.cloudfront.net/1392467808404684802/file/202208140641519097-20220814143449.png'}')`}">
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
              <div class='info-item curriculum-info' v-show='curriculumName && content.type !== typeMap.pd'>
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
                      <a-tooltip placement='top' title='Formative Assessment'>FA</a-tooltip>
                    </div>
                    <div
                      class='task-type-item red-active-task-type'
                      v-if="content.taskType === 'SA'">
                      <a-tooltip title='Summative Assessment' placement='top'>SA</a-tooltip>
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
          <div class='tag-info'>
            <div class='tag-info-item' v-for='(customTag, idx) in content.customTags' :key='idx'>
              <a-tag color='#FFEDAF' class='tag-item' :title='customTag.category'> {{ customTag.name }} </a-tag>
            </div>
          </div>
          <div class='owner'>
            <template v-if="!schoolResource || content.createBy === $store.getters.userInfo.email">
              <template v-if='content.owner'>
                <a-avatar v-if='content.owner.avatar' :src='content.owner.avatar' size="small" />
                <img v-else class="ant-avatar-sm" src="~@/assets/icons/library/default-avatar.png"/>
              </template>
              <template v-else>
                <a-avatar size="small">{{ content.createBy.toUpperCase()[0] }}</a-avatar>
              </template>
              <div class='user-name'>
                {{ (content.owner ? (content.owner.firstname + ' ' + content.owner.lastname) : content.createBy) | upCaseFirst }}
              </div>
            </template>
            <template v-else>
              <template>
                <template>
                  <a-avatar v-if='currentSchool.logo' :src='currentSchool.logo' size="small" />
                  <img v-else src="~@/assets/icons/library/default-avatar.png"/>
                </template>
                <a-tooltip :title="currentSchool.schoolName">
                  <div class='user-name' style="width: 100px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    {{ currentSchool.schoolName }}
                  </div>
                </a-tooltip>
              </template>
            </template>
          </div>
          <div class='update-time' v-if="category == 'released'">
            {{ (content.publishTime) | dayjs }}
          </div>
          <div class='update-time' v-else>
            {{ (content.updateTime || content.createTime) | dayjs }}
          </div>
        </div>
        <div class='right-info'>
          <div class='buy-info' @click.stop=''>
            <a-space>
              <template v-if="(!schoolResource || !(content.buyed && content.myContentId == -1))">
                <div class='price'>${{ content.discountPrice || content.price || 0 }}</div>
                <div v-if="content.discountPrice > 0 && content.discountPrice !== content.price" class='price_was'>${{ content.price }}</div>
              </template>
              <div class='buy'>
                <a-button
                  type="danger"
                  shape='round'
                  @click='handleBuyItem()'
                  :loading='copyLoading'
                  v-if='content.createBy !== $store.getters.userInfo.email && !content.buyed'>
                  Buy now
                </a-button>
                <a-button
                  type="danger"
                  class='cc-dark-button'
                  shape='round'
                  @click='handleEditItem()'
                  :loading='copyLoading'
                  v-if='content.createBy === $store.getters.userInfo.email ||
                    (content.createBy !== $store.getters.userInfo.email && content.buyed && content.myContentId != -1)'>
                  Edit
                </a-button>
                <a-tooltip title="You have already purchased this content, please copy it directly" placement="top" >
                  <a-button
                    type='primary'
                    shape='round'
                    @click='handleBuyItem ("Copy successfully")'
                    :loading='copyLoading'
                    v-if='content.createBy !== $store.getters.userInfo.email && content.buyed && content.myContentId == -1'>
                    Copy
                  </a-button>
                </a-tooltip>
              </div>
            </a-space>
          </div>
        </div>
      </div>
      <div class='action'>
      </div>

      <content-preview
        :content-id='previewCurrentId'
        :content-type='previewType'
        :show-enter-button='false'
        :review-edit='false'
        :review-create='false'
        :school-resource=schoolResource
        :is-library="true"
        v-if='previewVisible'
        @close='handlePreviewClose' />

      <a-modal
        :title="null"
        :closable='false'
        v-model="contentBuyStatVisible"
        :append-to-body="true"
        :destroy-on-close="false"
        @ok='handleEnsureBuyStat'
        @cancel='handleCancelBuyStat'
        width="500px">
        <modal-header @close='handleCancelBuyStat' title='Which age(s) will you use this resource with?' />
        <div class='grade-list'>
          <div class='content-tag-list'>
            <div class='content-tag' @click='toggleSelectContentTag(grade)' :class="{'selected-tag': selectedGradeList.indexOf(grade) !== -1}" v-for='grade in allAges' :key='grade'>
              {{ grade }}
            </div>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>

import { getLabelNameType, typeMap } from '@/const/teacher'
import { ContentItemMixin } from '@/mixins/ContentItemMixin'
import CustomButton from '@/components/Common/CustomButton'
import EditIcon from '@/assets/v2/icons/edit.svg?inline'
import DuplicateIcon from '@/assets/v2/icons/duplicate.svg?inline'
import ContentPreview from '@/components/Preview/ContentPreview'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { ContentBuy } from '@/api/v2/mycontent'
import { ContentGradeSave } from '@/api/contentGrade'
import ModalHeader from '@/components/Common/ModalHeader'
import { GoogleAuthCallBackMixin } from '@/mixins/GoogleAuthCallBackMixin'
import { mapState } from 'vuex'

export default {
  name: 'LibraryContentItem',
  components: {
    ModalHeader,
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
    },
    category: {
      type: String,
      default: ''
    },
    schoolResource: {
      type: Boolean,
      default: false
    }
  },
  mixins: [ContentItemMixin, GoogleAuthCallBackMixin],
  data() {
    return {
      typeMap: typeMap,
      isSelfLearning: false,
      copyLoading: false,
      contentBuyStatVisible: false,
      selectedGradeList: []
    }
  },
  created() {
    this.allowPreview = this.clickPreview
  },
  computed: {
     ...mapState({
      currentSchool: state => state.user.currentSchool,
      classList: state => state.user.classList,
      info: state => state.user.info
    }),
    status() {
      return this.content.status
    },
    contentTypeName () {
      return this.content ? getLabelNameType(this.content.type) : null
    },
    curriculumName () {
      return this.$store.getters.curriculumId2NameMap.hasOwnProperty(this.content.curriculumId) ? this.$store.getters.curriculumId2NameMap[this.content.curriculumId] : null
    },
    allAges() {
      const list = []
      for (let i = 3; i < 19; i++) {
        list.push(i + ' years')
      }
      return list
    }
  },
  methods: {
    handleBuyItem (msg) {
      console.info('handleBuyItem', this.content)
      ContentBuy({ id: this.content.id, type: this.content.type }).then((response) => {
        if (response.code !== this.ErrorCode.ppt_google_token_expires && response.code !== this.ErrorCode.ppt_forbidden) {
          console.info('Duplicate response', response)
          if (msg) {
            this.$message.success(msg)
          } else {
            this.$message.success('Buy successfully')
          }
        } else {
          this.currentMethodName = 'handleBuyItem'
        }
      }).finally(() => {
        this.buyLoading = false
        this.contentBuyStatVisible = true
      })
    },

    handleEditItem() {
      // 其他人的资源走buy逻辑
      if (this.content.createBy !== this.$store.getters.userInfo.email) {
        return this.handleEditBuy()
      }
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
    handleEnsureBuyStat () {
      ContentGradeSave({
        contentId: this.contentId,
        contentType: this.contentType,
        grades: this.selectedGradeList
      }).finally(() => {
        this.handleCancelBuyStat()
      })
    },
    handleCancelBuyStat () {
      this.contentBuyStatVisible = false
      this.selectedGradeList = []
      this.$router.push({ path: '/teacher/main/created-by-me' })
    },
    toggleSelectContentTag(grade) {
      console.info('toggleSelectContentTag', grade)
      const index = this.selectedGradeList.indexOf(grade)
      if (index === -1) {
        this.selectedGradeList.push(grade)
      } else {
        this.selectedGradeList.splice(index, 1)
      }
    },
    handleEditBuy () {
      console.info('handleEdit', this.content.myContentId)
      if (this.content.type === this.typeMap['unit-plan']) {
        window.open('/teacher/unit-plan-redirect/' + this.content.myContentId, '_blank')
      } else if (this.content.type === this.typeMap.task) {
        window.open('/teacher/task-redirect/' + this.content.myContentId, '_blank')
      } else if (this.content.type === this.typeMap.pd) {
        window.open('/teacher/pd-content-redirect/' + this.content.myContentId, '_blank')
      } else if (this.contentType === this.typeMap.video) {
        window.open('/teacher/video-redirect/' + this.content.myContentId, '_blank')
      }
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

.buy-info {
  padding-right: 40px;

  .price {
    font-size: 18px;
    font-family: Arial;
    font-weight: bold;
    color: #F1565F;
    padding-right: 5px;
    user-select: none;
    cursor: pointer;
    height: 32px;
    line-height: 32px;
    vertical-align: middle;
  }

  .price_was {
    text-decoration:line-through;
    font-size: 14px;
    font-family: Arial;
    margin-left: -5px;
    padding-right: 5px;
    user-select: none;
    cursor: pointer;
    height: 32px;
    line-height: 32px;
    vertical-align: middle;
  }

  .buy {
    font-size: 16px;
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

.grade-list {
  padding: 10px 0;
  .content-tag-list {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
    margin: 0 10px 10px 0;
    vertical-align: middle;
    cursor: pointer;

    .content-tag {
      margin-left: 3px;
      margin-top: 5px;
      cursor: pointer;
      border: 2px solid #ffffff;
      background: #FFEDAF;
      font-size: 13px;
      border-radius: 30px;
      line-height: 30px;
      padding: 0 10px;
      word-break: normal;
      width: auto;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: space-between;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .selected-tag {
      border: 2px solid #15C39A;
    }
  }
}

</style>
