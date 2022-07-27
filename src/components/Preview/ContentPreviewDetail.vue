<template>
  <div class='content-preview-detail' ref="container">
    <div class='top-fixed-header' v-if='showTopFixedHeader && content && displayFixedHeader'>
      <div class='header-left'>
        <div class='back vertical-left' @click='handleClose'>
          <a-icon type='left' />
          <div class='back-text'>
            Back
          </div>
        </div>
        <div class='name'>
          {{ content.name || 'Untitled' }}
        </div>
      </div>
      <div class='header-right'>
        <div class='buy-button vertical-right'>
          <a-space>
            <a-space v-if="liveWorkShopCode">
              <a-button
                class='buy-now'
                type="danger"
                shape='round'
                v-if="liveWorkShopSession && WORK_SHOPS_TYPE.REGISTERED.value === liveWorkShopSession.workshopsType"
                @click='handleCancelSession'
                :loading='buyLoading'
              >
                Cancel
              </a-button>
              <a-button
                shape='round'
                type='primary'
                @click='handleRegisterSession'
                :loading='buyLoading'
                v-if='liveWorkShopSession && WORK_SHOPS_TYPE.FEATURE.value === liveWorkShopSession.workshopsType'
              >
                Register now
              </a-button>
            </a-space>
            <a-space v-else>
              <a-button
                class='buy-now'
                type="danger"
                shape='round'
                @click='handleBuyItem'
                v-if='content.createBy !== $store.getters.userInfo.email && showBuyButton && !content.buyed'
                :loading='buyLoading'>
                Buy now
              </a-button>
              <a-button
                class='cc-dark-button'
                shape='round'
                @click='handleEditBuy'
                v-if='content.createBy !== $store.getters.userInfo.email && showBuyButton && content.buyed'>
                Edit
              </a-button>
              <a-button
                shape='round'
                type='primary'
                @click='handleDuplicateItem'
                :loading='copyLoading'
                v-if='content.createBy !== $store.getters.userInfo.email && showCopyButton'
                icon='copy'>
                Copy
              </a-button>
            </a-space>
          </a-space>
        </div>
        <div class='more-action vertical-right'>
          <a-tooltip
            trigger="click"
            :getPopupContainer="trigger => trigger.parentElement"
            placement="bottomRight"
          >
            <template slot="title">
              <div class="detail-share">
                <share-button
                  v-if="content"
                  :link="wrapperLink(content)"
                  :title="content.name"
                />
              </div>
            </template>
            <icon-font type="icon-share" class="detail-font"/>
          </a-tooltip>
        </div>
      </div>
    </div>

    <div class='preview-carousel-wrapper'>
      <preview-carousel :page-object-list='thumbnailList' :video-list='videoList' v-if='!carouselContentLoading' />
      <a-skeleton v-if='carouselContentLoading' />
    </div>

    <div class='preview-main-content' v-if='content'>
      <a-row class='content-info-item'>
        <a-col span='24' class='cc-ellipsis cc-info-left'>
          <h3>{{ content.name || 'Untitled' }}</h3>
        </a-col>
      </a-row>

      <a-row class='content-info-item' v-observe-visibility="visibilityChanged">
        <a-col
          :lg="{ span: 12 }"
          :xs="{ span: 24 }"
          class="cc-ellipsis cc-info-left"
        >
          <div class="author-info">
            <div class="author-avatar">
              <a-avatar size="large" style="backgroundcolor: #517f3f">{{
                (content.owner
                  ? content.owner.firstname + ' ' + content.owner.lastname
                  : content.createBy
                ).toUpperCase()[0]
              }}</a-avatar>
            </div>
            <div class="author-info-detail">
              <div class="author-name">
                {{
                  content.owner
                    ? content.owner.firstname + ' ' + content.owner.lastname
                    : content.createBy
                }}
              </div>
              <div class="rate-star">
                <review-stat :contentId="contentId" @goReviews="goReviews" />
                <div class="star-info">
                  <a-space :size="15">
                    <div class="start-it" @click="handleFavorite">
                      <div class="favorite">
                        <a-icon
                          type="heart"
                          :style="{ color: '#fb0' }"
                          theme="filled"
                          v-if="favoriteFlag"
                        />
                        <a-icon type="heart" v-if="!favoriteFlag" />
                      </div>
                      <div class="favorite-num">
                        {{ (stat && stat.saved) || 0 }}
                      </div>
                    </div>
                    <div class="sales">
                      Sales {{ (stat && stat.sold) || 0 }}
                    </div>
                  </a-space>
                </div>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :lg="{ span: 12 }" :xs="{ span: 24 }" class="cc-info-right">
          <div class="live-price-info" v-if="liveWorkShopCode">
            <div
              class="share-live-price"
              v-if="showPriceInfo && liveWorkShopSession && liveWorkShopSession.priceList && liveWorkShopSession.priceList.length > 0"
            >
              <price-slider
                v-if="liveWorkShopSession"
                :priceList="liveWorkShopSession.priceList"
                :current="liveWorkShopSession.registeredNum"
                :origin="liveWorkShopSession.price"
              />
            </div>
            <div v-else></div>
            <div class='buy-button' v-if="liveWorkShopSession && WORK_SHOPS_TYPE.LUNCHEDBYME.value !== liveWorkShopSession.workshopsType">
              <a-space>
                <a-button
                  class='buy-now'
                  type="danger"
                  shape='round'
                  v-if="liveWorkShopSession && WORK_SHOPS_TYPE.REGISTERED.value === liveWorkShopSession.workshopsType"
                  @click='handleCancelSession'
                  :loading='buyLoading'
                >
                  Cancel
                </a-button>
                <a-button
                  shape='round'
                  type='primary'
                  @click='handleRegisterSession'
                  :loading='buyLoading'
                  v-if='liveWorkShopSession && WORK_SHOPS_TYPE.FEATURE.value === liveWorkShopSession.workshopsType'
                >
                  Register now
                </a-button>
              </a-space>
            </div>
          </div>
          <div class='col-info' v-else>
            <div class='price-info'>
              <a-space :size='5' v-show='showPriceInfo'>
                <div class='discount-price'>
                  ${{ content.price || 0 }}
                </div>
                <div class='pre-price'>
                </div>
              </a-space>
            </div>
            <div class='buy-button'>
              <a-space>
                <a-button
                  class='buy-now'
                  type="danger"
                  shape='round'
                  @click='handleBuyItem'
                  :loading='buyLoading'
                  v-if='content.createBy !== $store.getters.userInfo.email && showBuyButton && !content.buyed'>
                  Buy now
                </a-button>
                <a-button
                  class='cc-dark-button'
                  shape='round'
                  @click='handleEditBuy'
                  v-if='content.createBy !== $store.getters.userInfo.email && showBuyButton && content.buyed'>
                  Edit
                </a-button>
                <a-button
                  shape='round'
                  type='primary'
                  @click='handleDuplicateItem'
                  :loading='copyLoading'
                  v-if='content.createBy !== $store.getters.userInfo.email && showCopyButton'
                  icon='copy'>
                  Copy
                </a-button>
              </a-space>
            </div>
          </div>
        </a-col>
      </a-row>

      <div class='split-line'></div>
      <div class='edit-content' v-if='(!liveWorkShopCode) && (content.createBy === $store.getters.userInfo.email && showEditButton)'>
        <a-button class='cc-dark-button' style='width: 90px' shape='round' @click='handleEdit'>Edit</a-button>
      </div>

      <template v-if="content.customTags && content.customTags.length">
        <div class='content-block'>
          <div class='content-title'>
            Tags
          </div>
          <div class='content-detail'>
            <div class='preview-tag-list'>
              <div class='skt-tag-item' v-for='(tag, index) in content.customTags' :key='index'>
                <a-tag class="tag-item cc-custom-tag-item">{{ tag.name || tag.category }}</a-tag>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-if="content.name && content.name.trim()">
        <div class='content-block'>
          <div class='content-title'>
            <template v-if='content.type === typeMap.task'>Title</template>
            <template v-if='content.type !== typeMap.task'>Name</template>
          </div>
          <div class='content-detail'>
            {{ content.name }}
          </div>
        </div>
      </template>

      <template v-if="content.hasOwnProperty('videoList')">
        <div class='content-block'>
          <div class='content-title'>
            Purpose of video
          </div>
          <div class='content-detail'>
            <template v-if="content.contentType === 0">Student self-learning</template>
            <template v-if="content.contentType === 1">Teacher PD</template>
          </div>
        </div>
      </template>

      <template v-if="content.video">
        <div class='content-block'>
          <div class='content-title'>
            Video
          </div>
          <div class='content-detail video-detail'>
            <video :src="content.video" autoplay controls class="video-item"/>
          </div>
        </div>
      </template>

      <template v-if="content.overview && content.overview.trim()">
        <div class='content-block'>
          <div class='content-title'>
            <template v-if='content.type === typeMap.task'>Task Detail</template>
            <template v-if='content.type !== typeMap.task'>Overview</template>
          </div>
          <div class='content-detail'>
            {{ content.overview }}
          </div>
        </div>
      </template>

      <template v-if="content.inquiry && content.inquiry.trim()">
        <div class='content-block'>
          <div class='content-title'>
            Big Idea/ Statement of Inquiry/ Central Idea
          </div>
          <div class='content-detail'>
            {{ content.inquiry }}
          </div>
        </div>
      </template>

      <template v-if="content.questions && content.questions.length">
        <div class='content-block'>
          <div class='content-title'>
            Key question(s) / Line(s) of inquiry
          </div>
          <div class='content-detail'>
            <div class="content-detail-item" v-for="(question, index) in content.questions" :key="index">
              {{ question.name }}
            </div>
          </div>
        </div>
      </template>

      <template v-if="content.subjectList && content.subjectList.length">
        <div class='content-block'>
          <div class='content-title'>
            Subject
          </div>
          <div class='content-detail'>
            <div class='subject-list vertical-left'>
              <div class='subject-item' v-for='subject in content.subjectList' :key='subject'>
                {{ subject }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <a-row v-if='content.yearList || content.unitType || content.projectBased' class='line-data'>
        <a-col span='8' class='line-data-item'>
          <div class='line-title'>
            Grade Level :
          </div>
          <div class='line-content'>
            <template v-if='content.yearList'>
              {{ content.yearList.join(',') }}
            </template>
          </div>
        </a-col>
        <a-col span='8' class='line-data-item' v-show='content.unitType !== undefined'>
          <div class='line-title'>
            Unit type :
          </div>
          <div class='line-content'>
            <template v-if="content.unitType === 0">Single-subject Unit</template>
            <template v-if="content.unitType === 1">Integrated Unit</template>
          </div>
        </a-col>
        <a-col span='8' class='line-data-item' v-show='content.projectBased !== undefined'>
          <div class='line-title'>
            Project-based Unit :
          </div>
          <div class='line-content'>
            <template v-if="content.projectBased === 0">No</template>
            <template v-if="content.projectBased === 1">Yes</template>
          </div>
        </a-col>
      </a-row>

      <div class='line-split'></div>

      <template v-if="content.learnOuts && content.learnOuts.length">
        <div class='content-block'>
          <div class='content-title'>
            Learning Objectives
          </div>
          <div class='content-detail'>
            <div class="content-detail-item" v-for="(learnOut, i) in content.learnOuts" :key="i">
              <div class='desc-item'>
                {{ learnOut.desc }}
              </div>
              <div class='more-tag vertical-left'>
                <div class="item-bloom-wrapper">
                  <div class="bloom-wrapper">
                    <label>Bloom's Taxonomy:</label>
                    <rate-level :bloom="learnOut.bloomTag || ''"/>
                  </div>
                  <div class="bloom-wrapper">
                    <label>Knowledge Dimensions:</label>
                    <rate-level :knowledge="learnOut.knowledgeDimension || ''" />
                  </div>
                </div>
              </div>
              <div class='more-tag'>
                <div class="item-command-wrapper" v-if="learnOut.commandTerms && learnOut.commandTerms.length > 0">
                  <label>Command Term:</label>
                  <div class="wrapper-list">
                    <div
                      class='wrapper-list-item'
                      v-for='(terms) in learnOut.commandTerms'
                      :key='terms.name'>
                      <a-tag class='command-tag'>
                        <div class='tag-content'>{{ terms.name }}</div>
                      </a-tag>
                    </div>
                  </div>
                </div>
                <div class="item-command-wrapper" v-if="learnOut.knowledgeTags && learnOut.knowledgeTags.length > 0">
                  <label>Knowledge tag:</label>
                  <div class="wrapper-list">
                    <div
                      class='wrapper-list-item'
                      v-for='(terms) in learnOut.knowledgeTags'
                      :key='terms.name'>
                      <a-tag class='command-tag knowledge'>
                        <div class='tag-content'>{{ terms.name }}</div>
                      </a-tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div class='line-split'></div>

      <div class='card-list-wrapper' v-if="content.subTasks && content.subTasks.length">
        <div class='card-list-title'>
          <div class='sub-task-title'>
            Sub tasks ({{ content.subTasks.length }})
          </div>
          <div class='go-to-list'>
            <custom-link-text text='Enter' @click='goToSubTaskList'></custom-link-text>
          </div>
        </div>
        <div class='scroll-left' @click="scrollLeft('subTask')">
          <a-icon type="left-circle" :style="{fontSize: '22px', color: '#dddddd'}" />
        </div>
        <div class='scroll-right' @click="scrollRight('subTask')">
          <a-icon type="right-circle" :style="{fontSize: '22px', color: '#dddddd'}" />
        </div>
        <div class='card-list' id='subTask'>
          <div class="card-item" v-for="(subTask, i) in content.subTasks" :key="i" @click='handlePreviewItem(subTask)'>
            <card-list-item :content="subTask" :width="16" :inner-desc="false" :outer-desc="true" />
          </div>
        </div>
      </div>

      <div class='card-list-wrapper' v-if="realAssociateList.length">
        <div class='card-list-title'>
          <div class='sub-task-title'>
            <template v-if="realAssociateList[0].type === typeMap['unit-plan']">Unit</template>
            <template v-if="realAssociateList[0].type === typeMap.task">Task</template>
            ({{ realAssociateList.length }})
          </div>
          <div class='go-to-list'>
            <custom-link-text text='Enter' @click='goTLinkList'></custom-link-text>
          </div>
        </div>
        <div class='scroll-left' @click="scrollLeft('taskUnit')">
          <a-icon type="left-circle" :style="{fontSize: '22px', color: '#dddddd'}" />
        </div>
        <div class='scroll-right' @click="scrollRight('taskUnit')">
          <a-icon type="right-circle" :style="{fontSize: '22px', color: '#dddddd'}" />
        </div>
        <div class='card-list' id='taskUnit'>
          <div class="card-item" v-for="(associate, i) in realAssociateList" :key="i" @click='handlePreviewItem(associate)'>
            <card-list-item :content="associate" :width="16" :inner-desc="false" :outer-desc="true" />
          </div>
        </div>
      </div>

      <div class='card-list-wrapper' v-if="realRecommendList.length">
        <div class='card-list-title'>
          <div class='sub-task-title'>
            Recommend
          </div>
          <!--          <div class='go-to-list'>-->
          <!--            <custom-link-text text='Enter' @click='goToSubTaskList'></custom-link-text>-->
          <!--          </div>-->
        </div>
        <div class='scroll-left' @click="scrollLeft('associateRecommendList')">
          <a-icon type="left-circle" :style="{fontSize: '22px', color: '#dddddd'}" />
        </div>
        <div class='scroll-right' @click="scrollRight('associateRecommendList')">
          <a-icon type="right-circle" :style="{fontSize: '22px', color: '#dddddd'}" />
        </div>
        <div class='card-list' id='associateRecommendList'>
          <div class="card-item" v-for="(associate, i) in realRecommendList" :key="i" @click='handlePreviewItem(associate)'>
            <card-list-item :content="associate" :width="16" :inner-desc="false" :outer-desc="true" />
          </div>
        </div>
      </div>

    </div>
    <div class='preview-extra-data'>
    </div>
    <div class='preview-review' id="reviews">
      <a-row class="reviews-info">
        <a-col class="slide-reviews" span="24" v-if="currentRole === 'student'">
          <rate-by-percent :rates="reviewsStats"/>
          <reviews-preview
            :id="contentId"
            role="student"
            :list="ReviewsTask.ReviewsTaskList"
            :save="ReviewsTask.ReviewsTaskSave"
            :del="ReviewsTask.ReviewsTaskDelete"
            :myReview="ReviewsTask.ReviewsTaskMyReview"
          />
        </a-col>
        <a-col class="slide-reviews" span="24" v-else>
          <!-- TODO 后续会有课件付费功能，只有付费过的才能评论 -->
          <reviews-preview
            :id="contentId"
            role="teacher"
            :list="ReviewsTeacher.ReviewsTeacherList"
            :save="ReviewsTeacher.ReviewsTeacherSave"
            :del="ReviewsTeacher.ReviewsTeacherDelete"
            :myReview="ReviewsTeacher.ReviewsTeacherMyReview"
            :canEdit="true"
            :canCreate="!!(content && content.createBy !== $store.getters.userInfo.email && (showBuyButton && showCopyButton))"
            @update="loadReviewStats"
          />
        </a-col>
      </a-row>
    </div>
    <div class='preview-recommend'></div>

    <content-preview
      :content-id='previewCurrentId'
      :content-type='previewType'
      :allow-preview-sub-content='false'
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
          <div class='content-tag' @click='toggleSelectContentTag(grade.value)' :class="{'selected-tag': selectedGradeList.indexOf(grade.value) !== -1}" v-for='grade in allAges' :key='grade.value'>
            {{ grade.name }}
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>

import PreviewCarousel from '@/components/Preview/PreviewCarousel'
import { UnitPlanQueryById } from '@/api/unitPlan'
import { PDContentQueryById } from '@/api/pdContent'
import { TaskQueryById } from '@/api/task'
import { VideoQueryById } from '@/api/video'
import { TemplatesGetPublishedPresentation } from '@/api/template'
import { Duplicate, GetAssociate, GetAssociateRecommend } from '@/api/teacher'
import { mapState } from 'vuex'
import * as logger from '@/utils/logger'
import { formatLocalUTC, getCookie } from '@/utils/util'
import { PptPreviewMixin } from '@/mixins/PptPreviewMixin'
import { QueryByClassInfoSlideId } from '@/api/classroom'
import { FavoritesAdd, FavoritesDelete } from '@/api/favorites'
import CardListItem from '@/components/Preview/CardListItem'
import { GoogleAuthCallBackMixin } from '@/mixins/GoogleAuthCallBackMixin'
import ShareIcon from '@/assets/v2/icons/header_share.svg?inline'
import RateByPercent from '@/components/RateByPercent'
import ReviewsPreview from '@/components/Reviews/ReviewsPreview'
import ReviewScore from '@/components/Reviews/ReviewScore'
import ReviewStat from '@/components/Reviews/ReviewStat'
import PriceSlider from '@/components/Slider/PriceSlider'
import { RATE_TOOLTIPS, WORK_SHOPS_TYPE } from '@/const/common'
import * as ReviewsTask from '@/api/reviewsTask'
import * as ReviewsTeacher from '@/api/reviewsTeacher'
import ShareButton from '@/components/Share/ShareButton'
import CustomLinkText from '@/components/Common/CustomLinkText'
import ContentPreview from '@/components/Preview/ContentPreview'
import { ContentItemMixin } from '@/mixins/ContentItemMixin'
import { getStatByContentId } from '@/api/statistics'
import { ContentGradeSave } from '@/api/contentGrade'
import ModalHeader from '@/components/Common/ModalHeader'
import RateLevel from '@/components/RateLevel'
import { ContentBuy } from '@/api/v2/mycontent'
import { DetailBySessionId, SaveRegisteredRecord, CancelRegistered } from '@/api/v2/live'
import { SET_PROMOTE_CODE } from '@/store/mutation-types'

export default {
  name: 'ContentPreviewDetail',
  components: { RateLevel, ModalHeader, ContentPreview, CustomLinkText, ShareButton, CardListItem, PreviewCarousel, ShareIcon, RateByPercent, ReviewsPreview, ReviewScore, ReviewStat, PriceSlider },
  props: {
    contentId: {
      type: String,
      required: true
    },
    contentType: {
      type: Number,
      required: true
    },
    showBuyButton: {
      type: Boolean,
      default: true
    },
    showCopyButton: {
      type: Boolean,
      default: false
    },
    showEditButton: {
      type: Boolean,
      default: true
    },
    displayFixedHeader: {
      type: Boolean,
      default: true
    },
    showPriceInfo: {
      type: Boolean,
      default: true
    },
    allowPreviewSubContent: {
      type: Boolean,
      default: true
    },
    // 传递了code表面展示liveworkshop相关的细节
    liveWorkShopCode: {
      type: String,
      default: ''
    }
  },
  mixins: [PptPreviewMixin, GoogleAuthCallBackMixin, ContentItemMixin],
  data() {
    return {
      contentLoading: true,
      WORK_SHOPS_TYPE: WORK_SHOPS_TYPE,
      content: null,

      carouselContentLoading: true,

      thumbnailList: [],
      pageObjectIds: [],
      videoList: [],

      associateList: [],
      favoriteFlag: false,

      typeMap: this.$classcipe.typeMap,
      buyLoading: false,
      copyLoading: false,

      showTopFixedHeader: false,
      stat: null,

      reviewsStats: {
        avgReviewsScore: 0,
        reviewsScoreStatDetail: [],

        reviewsCount: 0,
        effectiveness: 0,
        overall: 0,
        quality: 0,
        studentsEngagement: 0
      },

      RATE_TOOLTIPS: RATE_TOOLTIPS,
      ReviewsTask: ReviewsTask,
      ReviewsTeacher: ReviewsTeacher,

      contentBuyStatVisible: false,
      selectedGradeList: [],
      associateRecommendList: [],

      liveWorkShopSession: null
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentRole: state => state.user.currentRole
    }),
    allAges() {
      const list = []
      for (let i = 3; i < 19; i++) {
        list.push({
          name: i + ' years',
          value: i + ''
        })
      }
      return list
    },
    lastChangeSavedTime () {
      if (this.content) {
        logger.info('lastChangeSavedTime data', this.content)
        const time = this.content.updateTime || this.content.createTime
        if (time) {
          return formatLocalUTC(time)
        }
      }
      return ''
    },
    inActiveTypes () {
      let activeTypes = []
      if (this.itemsList) {
        activeTypes = this.itemsList.map(item => item.type)
      }
      return Array.from(new Set(activeTypes))
    },
    realRecommendList() {
      const othersContent = this.associateList.filter(item => item.createBy !== this.$store.getters.email)
      return [...this.associateRecommendList, ...othersContent]
    },
    realAssociateList () {
      return this.associateList.filter(item => item.createBy === this.$store.getters.email)
    }
  },
  created() {
    this.loadDetail()
  },
  methods: {

    async loadDetail() {
      try {
        this.contentLoading = true
        const ret = await this.loadDetailByContentIDType(this.contentId, this.contentType)
        console.log('loadDetailByContentIDType', ret)
        if (ret.code === 0) {
          this.content = ret.result
          this.favoriteFlag = this.content.isFavorite
          this.loadExtraData()
        } else {
          this.$message.error(ret.message)
        }
        await this.loadStat()
      } finally {
        this.contentLoading = false
      }
    },

    async loadStat() {
      const statRet = await getStatByContentId({ contentId: this.contentId })
      this.$logger.info('statRet', statRet)
      this.stat = statRet.result
    },

    async loadDetailByContentIDType(contentId, contentType) {
      contentType = parseInt(contentType)
      if (contentType === this.$classcipe.typeMap['unit-plan']) {
        return UnitPlanQueryById({ id: contentId })
      } else if (contentType === this.$classcipe.typeMap.task) {
        return TaskQueryById({ id: contentId })
      } else if (contentType === this.$classcipe.typeMap.video) {
        return VideoQueryById({ id: contentId })
      } else if (contentType === this.$classcipe.typeMap.pd) {
        return PDContentQueryById({ id: contentId })
      }
    },

    loadExtraData() {
      const contentType = parseInt(this.contentType)
      if (contentType === this.$classcipe.typeMap.task || contentType === this.$classcipe.typeMap.pd) {
        this.initVideoList()
        // 加载PPT节目数据
        this.loadSlideData()
      } else {
        this.carouselContentLoading = true
        this.initVideoList()
        this.initImgList()
        this.carouselContentLoading = false
      }
      this.loadAssociateData()
      this.loadAssociateRecommendData()

      if (this.content.presentationId) {
        this.getClassInfo(this.content.presentationId)
      }
      if (this.liveWorkShopCode) {
        this.initLiveDetail()
      }
    },

    initLiveDetail() {
      DetailBySessionId({
        sessionId: this.liveWorkShopCode
      }).then(res => {
        if (res.success) {
          this.liveWorkShopSession = res.result
        }
      })
    },

    loadReviewStats () {
      let promise = null
      if (this.currentRole === 'student') {
        promise = ReviewsTask.ReviewsTaskStats
      } else {
        promise = ReviewsTeacher.ReviewsTeacherStats
      }
      promise && promise({
        taskId: this.contentId, // 学生需要
        purchasesId: this.contentId // 老师需要
      }).then(res => {
        if (res.success) {
          this.reviewsStats = res.result
        }
      })
    },

    initVideoList () {
      this.videoList = []
      if (this.content.video) {
        this.videoList.push({
          url: this.content.video
        })
      }

      if (this.content.coverVideo) {
        this.videoList.push({
          url: this.content.coverVideo
        })
      }
    },

    initImgList() {
      this.thumbnailList = []
      if (this.content.image) {
        this.thumbnailList.push({
          contentUrl: this.content.image
        })
      }

      if (this.thumbnailList.length === 0) {
        this.thumbnailList.push({
          contentUrl: 'http://dcdkqlzgpl5ba.cloudfront.net/file/20210730045859200-education-5923312_640.png'
        })
      }
      this.$logger.info('initImgList', this.thumbnailList)
    },

    async loadSlideData () {
      try {
        this.carouselContentLoading = true
        const slideData = await TemplatesGetPublishedPresentation({ taskId: this.contentId })
        console.log('loadSlideData', slideData)
        this.thumbnailList = slideData.result.pageObjects
        this.pageObjectIds = slideData.result.pageObjectIds
        await this.loadMaterialData()

        if (this.thumbnailList.length === 0) {
          if (this.content.image) {
            this.thumbnailList.push({
              contentUrl: this.content.image
            })
          } else {
            this.thumbnailList.push({
              contentUrl: 'http://dcdkqlzgpl5ba.cloudfront.net/file/20210730045859200-education-5923312_640.png'
            })
          }
        }
      } catch (e) {
        console.error('loadSlideData', e)
      } finally {
        this.carouselContentLoading = false
      }
    },

    async loadAssociateData () {
      try {
        const isLibrary = location.href.indexOf('library') > 0 || location.href.indexOf('my-published') > 0
        const slideData = await GetAssociate({
          id: this.contentId,
          type: this.contentType,
          published: isLibrary ? 1 : 0,
          preview: true // 只预览自己的内容
        })
        console.log('loadAssociateData', slideData)
        const list = slideData.result.owner
        this.associateList = []
        list.forEach(item => {
          item.contents.forEach(content => {
            if (content.type === this.$classcipe.typeMap.task) {
              this.associateList.push(content)
            }

            if (content.type === this.$classcipe.typeMap['unit-plan']) {
              this.associateList.push(content)
            }
          })
        })
        console.log('loadAssociateData', this.associateList)
      } catch (e) {
        console.error('loadSlideData', e)
      }
    },

    async loadAssociateRecommendData () {
      try {
        const recommendData = await GetAssociateRecommend({
          id: this.contentId,
          type: this.contentType
        })
        this.associateRecommendList = recommendData.result
        console.log('loadAssociateData', this.associateRecommendList)
      } catch (e) {
        console.error('recommendData', e)
      }
    },

    async loadMaterialData () {
      try {
        const materialData = await QueryByClassInfoSlideId({ slideId: this.content.presentationId, pageIds: this.pageObjectIds })
        console.log('loadMaterialData', materialData)
        materialData.result.relements.forEach(e => {
          if (typeof e.data === 'string') {
            e.data = JSON.parse(e.data)
          }
        })
        materialData.result.items.forEach(e => {
          if (typeof e.data === 'string') {
            e.data = JSON.parse(e.data)
          }
        })
        this.elementsList = materialData.result.relements
        this.itemsList = materialData.result.items
      } catch (e) {
        console.error('loadMaterialData', e)
      }
    },

    handleFavorite () {
      if (this.favoriteFlag) {
        this.handleRemoveFavorite()
      } else {
        this.handleAddFavorite()
      }
    },
    handleAddFavorite() {
      FavoritesAdd({
        sourceId: this.contentId,
        sourceType: this.contentType
      }).then(response => {
        this.$logger.info('FavoritesAdd ', response)
        this.favoriteFlag = !this.favoriteFlag
      }).finally(async () => {
        await this.loadStat()
      })
    },
    handleRemoveFavorite () {
      FavoritesDelete({
        sourceId: this.contentId,
        sourceType: this.contentType
      }).then(response => {
        this.$logger.info('handleRemoveFavorite ', response)
        this.favoriteFlag = !this.favoriteFlag
      }).finally(async () => {
        await this.loadStat()
      })
    },

    handleEdit () {
      this.$logger.info('handleEdit', this.contentType)
      if (this.content.type === this.typeMap['unit-plan']) {
        window.open('/teacher/unit-plan-redirect/' + this.content.id, '_blank')
      } else if (this.content.type === this.typeMap.task) {
        window.open('/teacher/task-redirect/' + this.content.id, '_blank')
      } else if (this.content.type === this.typeMap.pd) {
        window.open('/teacher/pd-content-redirect/' + this.content.id, '_blank')
      } else if (this.contentType === this.typeMap.video) {
        window.open('/teacher/video-redirect/' + this.content.id, '_blank')
      }
    },

    handleEditBuy () {
      this.$logger.info('handleEdit', this.content.newBuyedId)
      if (this.content.type === this.typeMap['unit-plan']) {
        window.open('/teacher/unit-plan-redirect/' + this.content.newBuyedId, '_blank')
      } else if (this.content.type === this.typeMap.task) {
        window.open('/teacher/task-redirect/' + this.content.newBuyedId, '_blank')
      } else if (this.content.type === this.typeMap.pd) {
        window.open('/teacher/pd-content-redirect/' + this.content.newBuyedId, '_blank')
      } else if (this.contentType === this.typeMap.video) {
        window.open('/teacher/video-redirect/' + this.content.newBuyedId, '_blank')
      }
    },

    handleDuplicateItem () {
      this.$logger.info('handleDuplicateItem', this.content)
      this.$confirm({
        title: 'Confirm to copy',
        content: 'Are you sure to copy ' + this.content.name + ' ?',
        centered: true,
        onOk: () => {
          this.copyLoading = true
          Duplicate({ id: this.content.id, type: this.content.type }).then((response) => {
            if (response.code !== this.ErrorCode.ppt_google_token_expires && response.code !== this.ErrorCode.ppt_forbidden) {
              this.$logger.info('Duplicate response', response)
              this.$message.success('Copy successfully')
              this.$router.push({ path: '/teacher/main/created-by-me' })
            } else {
              this.currentMethodName = 'handleDuplicateItem'
            }
          }).finally(() => {
            this.copyLoading = false
          })
        }
      })
    },

    handleBuyItem () {
      this.$logger.info('handleBuyItem', this.content)
      ContentBuy({ id: this.content.id, type: this.content.type }).then((response) => {
        if (response.code !== this.ErrorCode.ppt_google_token_expires && response.code !== this.ErrorCode.ppt_forbidden) {
          this.$logger.info('Duplicate response', response)
          this.$message.success('Buy successfully')
        } else {
          this.currentMethodName = 'handleBuyItem'
        }
      }).finally(() => {
        this.buyLoading = false
        this.contentBuyStatVisible = true
      })
    },

    handleEnsureBuyStat () {
      ContentGradeSave({
        contentId: this.contentId,
        contentType: this.contentType,
        grades: this.selectedGradeList
      }).finally(() => {
        this.$router.push({ path: '/teacher/main/created-by-me' })
        this.handleCancelBuyStat()
      })
    },
    handleCancelBuyStat () {
      this.contentBuyStatVisible = false
      this.selectedGradeList = []
    },

    toggleSelectContentTag(gradeValue) {
      this.$logger.info('toggleSelectContentTag', gradeValue)
      const index = this.selectedGradeList.indexOf(gradeValue)
      if (index === -1) {
        this.selectedGradeList.push(gradeValue)
      } else {
        this.selectedGradeList.splice(index, 1)
      }
    },

    visibilityChanged (isVisible, entry) {
      this.showTopFixedHeader = !isVisible
    },

    scrollLeft (idName) {
      const dom = document.getElementById(idName)
      dom.scrollBy({
        left: -600,
        behavior: 'smooth'
      })
    },

    scrollRight (idName) {
      const dom = document.getElementById(idName)
      dom.scrollBy({
        left: 600,
        behavior: 'smooth'
      })
    },

    handleClose () {
      this.$emit('close')
    },

    wrapperLink(item) {
      if (item && item.id) {
        return `${process.env.VUE_APP_SHARE_URL}/detail/${item.type}/${item.id}`
      } else {
        return ''
      }
    },

    goToSubTaskList () {
      this.$router.push({
        path: `/teacher/sub-task/${this.content.id}`
      })
    },

    goTLinkList () {
      this.$router.push({
        path: `/teacher/link-content-list/${this.content.type}/${this.content.id}`
      })
    },

    handlePreviewItem (item) {
      this.$logger.info(`handlePreviewItem allowPreviewSubContent ${this.allowPreviewSubContent}`, item)
      if (this.allowPreviewSubContent) {
        this.handlePreviewDetail(item)
      }
    },

    goReviews() {
      document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' })
    },

    handleRegisterSession() {
      if (this.liveWorkShopSession && this.liveWorkShopSession.content && this.liveWorkShopSession.sessionId) {
        this.buyLoading = true
        SaveRegisteredRecord({
          contentId: this.liveWorkShopSession.content.id,
          sessionId: this.liveWorkShopSession.sessionId,
          channelId: getCookie(SET_PROMOTE_CODE)
        }).then(res => {
          if (res.success) {
            this.$message.success('You have successfully registered in')
            this.initLiveDetail()
            this.$emit('reload')
          }
        }).finally(() => {
          this.buyLoading = false
        })
      }
    },
    handleCancelSession() {
      if (this.liveWorkShopSession && this.liveWorkShopSession.content && this.liveWorkShopSession.sessionId) {
        this.buyLoading = true
        CancelRegistered({
          contentId: this.liveWorkShopSession.content.id,
          sessionId: this.liveWorkShopSession.sessionId
        }).then(res => {
          if (res.success) {
            this.$message.success('Cancel successfully')
            this.initLiveDetail()
            this.$emit('reload')
          }
        }).finally(() => {
          this.buyLoading = false
        })
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.content-preview-detail {
  position: relative;

  .top-fixed-header {
    z-index: 9999;
    position: fixed;
    top: 0;
    right: 0;
    width: 50%;
    background: #F7F8F9;
    padding: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border: 2px solid #DDE0E4;
    box-shadow: 0px 1px 12px 1px rgba(0, 0, 0, 0.07);

    .header-left {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      .back {
        cursor: pointer;
        padding-right: 10px;

        .back-text {
          font-size: 15px;
          font-weight: bold;
          padding-left: 10px;
        }
      }

      .name {
        width: 70%;
        padding-left: 10px;
        font-size: 16px;
        font-family: Arial;
        font-weight: 400;
        color: #0C1A3E;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        white-space: nowrap;
      }
    }

    .header-right {
      padding-right: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;

      .buy-button {
        padding-right: 10px;
      }

      .more-action {

      }
    }
  }
}

.preview-carousel-wrapper {
  height: 430px;
  width: 100%;
  padding: 15px 20px;
}

.preview-main-content {
  padding: 15px;
}

.cc-info-left {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.cc-info-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

.start-it {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .favorite-num {
    padding-left: 3px;
    font-weight: 400;
    color: #080B13;
  }
}

.sales {
  font-family: Arial;
  font-weight: 400;
  color: #E12A2A;
}

.content-info-item {
}

.split-line {
  margin: 10px 0;
  border-top: 1px solid #f1f1f1;
}

.author-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .author-avatar {
    height: 55px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .author-info-detail {
    padding-left: 10px;

    .author-name {
      padding-top: 5px;
      font-size: 16px;
      font-weight: 400;
    }
  }
}

.col-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .price-info {
    padding-bottom: 5px;

    .discount-price {
      font-family: Arial;
      font-weight: 400;
      color: #D3271A;
      line-height: 20px;
      font-size: 16px;
    }

    .pre-price {
      font-family: Arial;
      font-weight: 400;
      color: #A9A9A9;
      font-size: 12px;
    }
  }
}

.edit-content {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
}

.content-block {
  .content-title {
    font-size: 20px;
    font-family: Arial;
    font-weight: bold;
    color: #202020;
    line-height: 25px;
  }

  .content-detail {
    padding: 5px 0 15px 0;
    font-size: 13px;
    font-family: Arial;
    font-weight: 400;
    color: #666666;
    line-height: 24px;

    .content-detail-item {
      margin-top: 10px;
      margin-bottom: 20px;
      .desc-item {
        margin-bottom: 5px;
        padding: 5px 10px;
        border-radius: 5px;
        background: #F5F5F5;
      }

      .more-tag {
        padding-left: 10px;
        .item-bloom-wrapper {
          display: flex;
          .bloom-wrapper {
            font-size: 10px;
            font-family: Arial;
            font-weight: bold;
            color: #191A1C;
            margin-right: 50px;
            display: flex;
            align-items: center;
            label {
              margin-right: 5px;
            }
          }
        }

        .item-command-wrapper {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          label {
            font-size: 10px;
            font-family: Arial;
            font-weight: bold;
            color: #191A1C;
            width: 100px;
          }
          .wrapper-list {
            margin-left: 10px;
            display: flex;
            flex-wrap: wrap;
            flex: 1;
          }
        }

        & > label {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .wrapper-list-item {
          margin-bottom: 5px;
          .command-tag {
            line-height: 25px;
          }
        }
      }
    }
  }

  .video-detail {
    video {
      padding: 5px 0 15px 0;
      width: 100%;
    }
  }
}

.line-title {
  font-size: 14px;
  font-family: Arial;
  font-weight: bold;
  color: #202020;
  line-height: 25px;
}

.line-data {
  padding: 10px 0;

  .line-data-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
}

.line-content {
  font-size: 14px;
  font-family: Arial;
  font-weight: normal;
  color: #414141;
  line-height: 25px;
  padding-left: 5px;
}

.card-list-wrapper {
  width: 100%;
  position: relative;
  margin-top: 10px;
  .card-list-title {
    .sub-task-title {
      font-size: 20px;
      font-family: Arial;
      font-weight: bold;
      color: #202020;
      line-height: 25px;
    }
    padding-bottom: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .scroll-left {
    cursor: pointer;
    position: absolute;
    left: -5px;
    top: 45%;
  }

  .scroll-right {
    cursor: pointer;
    position: absolute;
    right: -5px;
    top: 45%;
  }

  .card-list {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    overflow-x: scroll;
    justify-content: flex-start;
    width: 615px;
    padding-bottom: 15px;
    margin: 0 25px;
    position: relative;

    .card-item {
      margin-right: 15px;
    }
  }
}

.rate-star {
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 20px;
  ul {
    margin-bottom: 5px;
  }
}

.star-info {
  margin-left: 15px;
  font-size: 13px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 20px;
}

.cc-preview-menu-icon {
  width: 20px;
  max-height: 25px;
  outline: none;
}

.menu-text {
  padding-left: 5px;
}

.preview-review {
  padding: 15px;
}

.more-action {
  /deep/ .share-button {
    width: auto !important;
    height: auto !important;
    padding: 10px;
    .share-title {
      font-size: 16px;
      font-family: Arial;
      font-weight: 400;
      color: #ECEFF4;
      margin-bottom: 10px;
      line-height: 1;
      white-space: nowrap;
    }
    .share-qrcode {
      width: 90px /* 77/100 */;
      height: 90px /* 77/100 */;
      display: flex;
    }
    .share-divider {
      font-size: 14px /* 14/100 */;
      margin: 10px;
      line-height: 1;
    }
    .share-out {
      height: 30px;
      .ant-space-item {
        height: 30px;
        display: flex;
        align-items: center;
      }
      img {
        width: 23px;
        height: 23px;
      }
      i {
        font-size: 37px;
        margin: 0 5px;
      }
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

.preview-tag-list {
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: flex-start;

  .skt-tag-item {
    margin: 0 10px 10px 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    vertical-align: middle;
    cursor: pointer;

    .tag-item {
      cursor: pointer;
      color: #734110;
      border: 2px solid #ffffff;
      font-size: 13px;
      background: #FFEDAF;
      border-radius: 30px;
      line-height: 30px;
      padding-left: 15px;
      margin-right: 0;
      padding-right: 15px;
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

    .tag-disable {
      color: rgba(0, 0, 0, .25);
      background-color: #f5f5f5;
      border-color: #d9d9d9;
      text-shadow: none;
      box-shadow: none;
      cursor: not-allowed;
    }
  }
}

.subject-list {
  .subject-item {
    color: #15C39A;
    cursor: pointer;
    margin: 0 15px 10px 0;
  }
}

.command-tag {
  max-width: 150px;
  border: none;
  cursor: pointer;
  padding: 0 10px;
  border-radius: 26px;
  line-height: 30px;
  font-family: Arial;
  font-weight: 400;
  background: #06ACD7;
  display: flex;
  align-items: center;
  justify-content: center;
  .tag-content {
    display: inline-block;
    max-width: 120px;
    text-overflow: ellipsis;
    word-break: break-word;
    user-select: none;
    overflow: hidden;
    color: #fff;
  }
  /deep/ i {
    color: #fff
  }
  &.knowledge {
    background: #EABA7F;
  }
}

.live-price-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .share-live-price {
    flex: 1;
  }
  .buy-button {
    width: 80px;
  }
}

</style>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
