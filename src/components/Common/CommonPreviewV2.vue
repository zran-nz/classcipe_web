<template>
  <div class="my-common-preview">
    <template v-if="loading">
      <a-skeleton active />
    </template>
    <template v-else>
      <div class='main-content-preview' :class="{'has-extra-info': [typeMap.task, typeMap['unit-plan']].indexOf(type) !== -1}">
        <div class='top-header'>
          <div class="title-line">
            <div class="name">
              {{ data.name }}
            </div>
            <div class="action-item">
              <div class="star">
                <template v-if="data.createBy !== $store.getters.userInfo.email">
                  <img src="~@/assets/icons/common/preview/star_gray.png" @click="handleFavorite(data)" v-if="!data.isFavorite"/>
                  <img src="~@/assets/icons/common/preview/star_yellow.png" @click="handleFavorite(data)" v-if="data.isFavorite"/>
                </template>
              </div>
              <div class="edit" v-if="this.isOwner || this.isCollaborater">
                <a-button type="primary" shape="round" @click="handleEditItem(data)">
                  <div class="button-content" >
                    Edit <img class="edit-icon" src="~@/assets/icons/common/preview/edit_white.png" />
                  </div>
                </a-button>
              </div>
              <!-- TODO 后续会有课件付费功能，只有付费过的才能COPY -->
              <div class="edit" v-else>
                <a-button
                  v-excludeRole="['student']"
                  v-if="!myContentId"
                  :loading="copyLoading"
                  class="copy-button"
                  type="primary"
                  shape="round"
                  @click="handleDuplicateItem"
                >
                  <div class="button-content">
                    Copy <a-icon type="copy" style="margin-left: 6px;"/>
                  </div>
                </a-button>
                <a-button
                  v-excludeRole="['student']"
                  v-else
                  :loading="copyLoading"
                  class="copy-button"
                  type="primary"
                  shape="round"
                  @click="handleEditItem({id: myContentId})"
                >
                  <div class="button-content">
                    Edit in my content <a-icon type="edit" style="margin-left: 6px;"/>
                  </div>
                </a-button>
                <a-button
                  v-hasRole="['student']"
                  v-if="data.type === typeMap.task"
                  :loading="copyLoading"
                  class="copy-button"
                  type="primary"
                  shape="round"
                  @click="handleStartTask"
                >
                  <div class="button-content" >
                    Start {{ data.buyed ? 'Session' : '' }}<a-icon type="play-circle" style="margin-left: 6px;"/>
                  </div>
                </a-button>
              </div>
            </div>
          </div>
        </div>
        <a-row class="author-info" v-excludeRole="['student']">
          <a-col span="3" class="avatar-icon">
            <!-- <img src="~@/assets/icons/library/default-avatar.png" /> -->
            <img :src="collaborate.owner && collaborate.owner.avatar" />
          </a-col>
          <a-col span="21">
            <div class="sub-info">
              <div class="created-by">
                {{ data.createBy }}
              </div>
              <div class="created-time">
                <template v-if="lastChangeSavedTime">
                  {{ lastChangeSavedTime }}
                </template>
              </div>
            </div>
            <div class="star-info">
              <review-score :review="reviewsStats" placement="bottom"/>
              <a-button type='link'>{{ reviewsStats.overall | percentFormat }} ({{ reviewsStats.reviewsCount }} reviews)</a-button>
            </div>
          </a-col>
        </a-row>
        <a-space class="author-info" v-hasRole="['student']">
          <div class="avatar-icon">
            <img :src="collaborate.owner && collaborate.owner.avatar" />
          </div>
          <div>
            <div class="sub-info">
              <div class="created-by">
                {{ collaborate.owner && collaborate.owner.nickname }}
              </div>
              <div class="created-time">
                <template v-if="lastChangeSavedTime">
                  {{ lastChangeSavedTime }}
                </template>
              </div>
            </div>
            <div class="star-info" @click="() => this.viewMode = 'Reviews'">
              <a-tooltip placement="right">
                <template slot="title">
                  {{ reviewsStats.reviewsScoreStatDetail && reviewsStats.reviewsScoreStatDetail[4] && reviewsStats.reviewsScoreStatDetail[4].reviewsScoreCount }}
                  people gave a score of 5 stars
                </template>
                <a-rate :value="reviewsStats.avgReviewsScore" allow-half disabled/>
              </a-tooltip>
            </div>
          </div>
        </a-space>
        <a-row class="data-info">
          <a-col class="right-detail" span="24" >
            <div class="sub-detail">
              <div class="detail-block">
                <div class="block-main-label">
                  <template v-if="data.type === typeMap.task">Task details</template>
                  <template v-else>Overview</template>
                </div>
                <div class="overview-block">
                  <div class="view-text">
                    {{ data.overview }}
                  </div>
                </div>
                <template v-if="data.type === typeMap.task && data.questionNames.length > 0">
                  <div class="block-main-label">
                    Key question(s)/Line(s) of Inquiry
                  </div>
                  <div class="detail-block" style="margin:10px;">
                    <div class="keyword-block-content">
                      <div class="content-list">
                        <div class="content-item" v-for="(question,qIndex) in data.questionNames" :key="qIndex">
                          <div class="question" v-if="question">
                            {{ question }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <div class="block-main-label">
                  Customized tags
                </div>
                <div class="overview-block">
                  <div class="custom-tags">
                    <div class="tag-item" v-for="(tag,tagIndex) in data.customTags" :key="'tagIndex' + tagIndex">
                      <a-tooltip :title="tag.parentName">
                        <a-tag class="tag">
                          {{ tag.name }}
                        </a-tag>
                      </a-tooltip>
                    </div>
                  </div>
                </div>
                <div class="block-main-label" v-hasRole="['student']">
                  This task contains interactive questions of
                </div>
                <div class="overview-block" v-hasRole="['student']">
                  <div class="custom-tags">
                    <div class="tag-item" v-for="(tag,tagIndex) in inActiveTypes" :key="'interActiveIndex' + tagIndex">
                      <a-tooltip :title="tag">
                        <a-tag class="tag" :color="tagColorList[tagIndex]">
                          {{ tag }}
                        </a-tag>
                      </a-tooltip>
                    </div>
                  </div>
                </div>
                <div class="block-main-label">
                  Learning Objectives
                </div>
                <div class="overview-block">
                  <div class="learn-question-tag">
                    <div class="learn-out" style="margin: 10px;">
                      <ui-learn-out-sub :learn-outs="data.learnOuts" :self-outs='data.selfOuts' :class-info-list="itemsList" />
                    </div>
                  </div>
                </div>
                <template v-if="data.inquiry">
                  <div class="block-main-label">
                    Big idea
                  </div>
                  <div class="inquiry-block-content">
                    <div class="inquiry">
                      {{ data.inquiry }}
                    </div>
                  </div>
                </template>
                <template v-if="data.materialList && data.materialList.length">
                  <div class="block-main-label">
                    Material list
                  </div>
                  <div class="overview-block">
                    <div class="material-list">
                      <div class="material-item" v-for="(material, mIndex) in data.materialList" :key="mIndex">
                        <div class="material-name">
                          {{ material.name }}
                        </div>
                        <div class="material-link" @click="handleOpenLink(material.link)">
                          {{ material.link }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-if='data.rwc'>
                  <div class="block-main-label">
                    Real World Connection(s)
                  </div>
                  <div class="overview-block">
                    <div class="view-text">
                      {{ data.rwc }}
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </a-col>
        </a-row>
        <a-row class="preview-data-info">
          <a-col class="slide-preview" span="24">
            <div class="data-detail-wrapper" v-if="data.scenarios || data.inquiry || (data.questions && data.questions.length)">

              <template v-if="data.scenarios">
                <div class="block-main-label">
                  Sustainable development goal
                </div>
                <div class="detail-block">
                  <div
                    class="scenario-item ref-block"
                    v-for="(scenario,sIndex) in data.scenarios"
                    :key="sIndex">
                    <div class="scenario-block-content">
                      <div class="content-list">
                        <div class="content-item">
                          <div class="question">
                            <template v-if='scenario.description'>
                              <a-tooltip :title="scenario.description" placement='top'>
                                {{ scenario.sdgName }}
                              </a-tooltip>
                            </template>
                            <template v-else> {{ scenario.sdgName }}</template>
                          </div>
                          <div class="tags">
                            <div class="tag-item" v-for="(keyword,tagIndex) in scenario.sdgKeyWords" :key="'tagIndex' + tagIndex">
                              <a-tag class="tag">
                                {{ keyword.name }}
                              </a-tag>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <template v-if="data && data.inquiry">
                <div class="detail-block">
                  <div class="block-main-label">
                    Big idea
                    <!--                  / Staement of inquiry / Centeral idea / Enduring understanding-->
                  </div>
                  <div class="inquiry-block-content">
                    <div class="inquiry">
                      {{ data.inquiry }}
                    </div>
                  </div>
                </div>
              </template>

              <template v-if="data && data.questions && data.questions.length">
                <div class="block-main-label">
                  Key question(s)/Line(s) of Inquiry
                </div>
                <div class="detail-block">
                  <div class="keyword-block-content">
                    <div class="content-list" v-if="data.questions && data.questions.length">
                      <div class="content-item" v-for="(question,qIndex) in data.questions" :key="'qIndex' + qIndex">
                        <div class="question" v-if="question && question.name">
                          {{ question.name }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- evaluation-->
            <template v-if="type === typeMap.evaluation">
              <evaluation-table-preview :evaluation-id="data.id" />
            </template>
          </a-col>
        </a-row>
        <div class="associate-info" v-excludeRole="['student']">
          <template v-if='type === typeMap.task'>
            <task-link
              :show-drag-tips='false'
              :isLibrary="isLibrary"
              :hidden-empty-group='true'
              :can-edit="false"
              ref="commonLink"
              :from-id="id"
              :from-type="type"/>
          </template>
          <template v-if='type === typeMap["unit-plan"]'>
            <plan-link
              :isLibrary="isLibrary"
              :hidden-empty-group='true'
              :can-edit="false"
              ref="commonLink"
              :from-id="id"
              :from-type="type" />
          </template>
        </div>
        <a-row class="reviews-info">
          <a-col class="slide-reviews" span="24" v-if="currentRole === 'student'">
            <rate-by-percent :rates="reviewsStats"/>
            <reviews-preview
              :id="id"
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
              :id="id"
              role="teacher"
              :list="ReviewsTeacher.ReviewsTeacherList"
              :save="ReviewsTeacher.ReviewsTeacherSave"
              :del="ReviewsTeacher.ReviewsTeacherDelete"
              :myReview="ReviewsTeacher.ReviewsTeacherMyReview"
              :canEdit="true"
              @update="loadReviewStats"
            />
          </a-col>
        </a-row>
      </div>
      <div class='extra-content-preview' v-if='[typeMap.task, typeMap["unit-plan"]].indexOf(type) !== -1'>
        <template v-if="type === typeMap.task && data.presentationId && imgList.length > 0">
          <div class="top-icon-groups">
            <a-col class="material-row" >
              <div class="icon-group" v-if="Object.keys(currentPageMaterial).length > 0">
                <a-badge :count="showMaterialSize('text')" v-if="currentPageMaterial.hasOwnProperty('text')">
                  <div class="icon" @click="showPluginMaterial('text')">
                    <text-type-svg />
                    <div class="icon-text">Text</div>
                  </div>
                </a-badge>
                <a-badge :count="showMaterialSize('image')" v-if="currentPageMaterial.hasOwnProperty('image')">
                  <div class="icon" @click="showPluginMaterial('image')">
                    <image-type-svg />
                    <div class="icon-text">Image</div>
                  </div>
                </a-badge>
                <a-badge :count="showMaterialSize('video')" v-if="currentPageMaterial.hasOwnProperty('video')">
                  <div class="icon" @click="showPluginMaterial('video')">
                    <video-type-svg />
                    <div class="icon-text">Video</div>
                  </div>
                </a-badge>
                <a-badge :count="showMaterialSize('audio')" v-if="currentPageMaterial.hasOwnProperty('audio')">
                  <div class="icon" @click="showPluginMaterial('audio')">
                    <audio-type-svg />
                    <div class="icon-text">Audio</div>
                  </div>
                </a-badge>
                <a-badge :count="showMaterialSize('iframe')" v-if="currentPageMaterial.hasOwnProperty('iframe')">
                  <div class="icon" @click="showPluginMaterial('iframe')">
                    <youtube-type-svg />
                    <div class="icon-text">Youtube</div>
                  </div>
                </a-badge>
                <a-badge :count="showMaterialSize('pdf')" v-if="currentPageMaterial.hasOwnProperty('pdf')" >
                  <div class="icon" @click="showPluginMaterial('pdf')">
                    <pdf-type-svg />
                    <div class="icon-text">PDF</div>
                  </div>
                </a-badge>
                <a-badge :count="showMaterialSize('website')" v-if="currentPageMaterial.hasOwnProperty('website')">
                  <div class="icon" @click="showPluginMaterial('website')">
                    <url-type-svg />
                    <div class="icon-text">Website</div>
                  </div>
                </a-badge>
              </div>
            </a-col>
          </div>

          <a-skeleton :loading="slideLoading" active >
            <div class="slide-select-wrapper" ref="slide" >
              <div class="slide-select">
                <div class="slide-select-and-preview">
                  <div class="slide-preview" :style="{'width':'310px'}">
                    <a-carousel ref="carousel" arrows :after-change="onChangePage">
                      <div slot="prevArrow" class="custom-slick-arrow" style="left: -23px;z-index: 9" >
                        <a-icon type="left-circle" :style="{'font-size': '20px', 'color': '#aaa', 'opacity': 0.6}"/>
                      </div>
                      <div slot="nextArrow" class="custom-slick-arrow" style="right: -23px;z-index: 9" >
                        <a-icon type="right-circle" :style="{'font-size': '20px', 'color': '#aaa', 'opacity': 0.6}"/>
                      </div>
                      <div v-for="(item,index) in imgList" :key="index" class='slide-item'>
                        <img :src="item" />
                      </div>
                    </a-carousel>
                    <div class="plugin-tags" v-if="currentPageItem">
                      <a-row class="tag-row">
                        <span class="tag-item" v-if="currentPageItem.data.bloomLevel">
                          <span class="tag-title">Bloom's Taxonomy:</span>
                          <span class="tag-value" style="color:#F16A39">{{ currentPageItem.data.bloomLevel }}</span>
                        </span>
                        <span class="tag-item" v-if="currentPageItem.data.knowledgeLevel">
                          <span class="tag-title">Knowledge dimension(s):</span>
                          <span class="tag-value" style="color:#F16A39">{{ currentPageItem.data.knowledgeLevel }}</span>
                        </span>
                      </a-row>
                      <a-row class="tag-row">
                        <span class='tag-item' v-if='currentPageItem.data.verbs && currentPageItem.data.verbs.length > 0'>
                          <span class="tag-title">Command terms:</span>
                          <span class="tag-value" v-for="(v,index) in currentPageItem.data.verbs" :key="index" style="color:#15C39A">{{ v }}</span>
                        </span>
                        <span class="tag-item" v-if="currentPageTips">
                          <span class="tag-title">Tip added:</span>
                          <span class="tag-value" style="color:#0054FF">{{ currentPageTips.tip }}</span>
                        </span>
                      </a-row>
                      <a-row class='tag-row' v-if="currentPageItem.data.learnOuts && currentPageItem.data.learnOuts.length > 0">
                        <span class="tag-item">
                          <span class="tag-title">Learning Objectives:</span>
                          <span class="tag-value" v-for="(learn,index) in currentPageItem.data.learnOuts" :key="index" style="color:#00BCF2">
                            <a-tooltip :title="learn.path" :overlayStyle="{ 'z-index': '3000'}">{{ learn.name }} </a-tooltip>
                          </span>
                        </span>
                      </a-row>
                      <a-row class="tag-row">
                        <span class="tag-item">
                          <span class="tag-title">This is a <span>{{ currentPageItem.type }}</span> slide</span>
                        </span>
                      </a-row>
                    </div>
                    <div class="page-info" v-if="imgList && imgList.length">
                      {{ currentImgIndex + 1 }} / {{ imgList.length }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-skeleton>
        </template>
        <template v-if='type === typeMap["unit-plan"]'>
          <div class='unit-cover' :style="{'background-image': 'url(' + (data.image ? data.image : 'http://dcdkqlzgpl5ba.cloudfront.net/file/20210730045859200-education-5923312_640.png') + ')'}">
          </div>
        </template>
        <div class='recommend' v-if="type === typeMap.task">
          <div class='recommend-title'>
            <a-divider>Recommend</a-divider>
          </div>
          <div class='recommend-list'>
            <div
              class='slide-preview-item'
              :style="{'width':'310px'}"
              v-for='(template, rIndex) in recommendTemplateList'
              :key='rIndex'>
              <a-carousel ref="carousel" arrows>
                <div slot="prevArrow" class="custom-slick-arrow" style="left: -23px;z-index: 9" >
                  <a-icon type="left-circle" :style="{'font-size': '20px', 'color': '#aaa', 'opacity': 0.6}"/>
                </div>
                <div slot="nextArrow" class="custom-slick-arrow" style="right: -23px;z-index: 9" >
                  <a-icon type="right-circle" :style="{'font-size': '20px', 'color': '#aaa', 'opacity': 0.6}"/>
                </div>
                <div v-for="(item,index) in template.images" :key="index" class='slide-item'>
                  <img :src="item" />
                </div>
              </a-carousel>
              <a-row v-if='template.introduce' class='slide-desc' :title='template.introduce'>
                {{ template.introduce }}
              </a-row>
              <div class='recommend-slide-name'>
                {{ template.name }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <a-modal
      v-model="materialVisible"
      :footer="null"
      destroyOnClose
      width="800px"
      :zIndex="6000"
      title="My Materials"
      @ok="materialVisible = false"
      @cancel="materialVisible = false">
      <task-material-preview :current-page-element-lists="currentPageElementLists" :filter-type="filterMaterialType" :current-page-index="currentImgIndex"></task-material-preview>
    </a-modal>

    <a-modal
      v-model="mediaVisible"
      :footer="null"
      destroyOnClose
      width="900px"
      :zIndex="5000"
      :title="null"
      @ok="mediaVisible = false"
      @cancel="mediaVisible = false">
      <media-preview :media-list="mediaList" :material-type="filterMaterialType"></media-preview>
    </a-modal>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'
import NoMoreResources from '@/components/Common/NoMoreResources'
import CommonAssociatePreview from '@/components/Common/CommonAssociatePreview'
import { recommendTemplates, TemplatesGetPublishedPresentation } from '@/api/template'
import EvaluationTablePreview from '@/components/Evaluation/EvaluationTablePreview'
import TaskLink from '@/components/Task/TaskLink'
import { PptPreviewMixin } from '@/mixins/PptPreviewMixin'
import MediaPreview from '@/components/Task/MediaPreview'
import TaskMaterialPreview from '@/components/Task/TaskMaterialPreview'
import UiLearnOutSub from '@/components/UnitPlan/UiLearnOutSub'
import RateByPercent from '@/components/RateByPercent'
import ReviewsPreview from '@/components/Reviews/ReviewsPreview'
import ReviewScore from '@/components/Reviews/ReviewScore'
import { BaseEventMixin } from '@/mixins/BaseEvent'
import { Duplicate } from '@/api/teacher'
import { DICT_PROMPT_TYPE, USER_MODE, RATE_TOOLTIPS } from '@/const/common'
import { GetDictItems } from '@/api/common'
import { lessonHost } from '@/const/googleSlide'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import storage from 'store'

import { mapState } from 'vuex'
import * as ReviewsTask from '@/api/reviewsTask'
import * as ReviewsTeacher from '@/api/reviewsTeacher'
import PlanLink from '@/components/Common/PlanLink'
import { GoogleAuthCallBackMixin } from '@/mixins/GoogleAuthCallBackMixin'
const { formatLocalUTC } = require('@/utils/util')
const { UnitPlanQueryById } = require('@/api/unitPlan')
const { TaskQueryById } = require('@/api/task')
const { EvaluationQueryById } = require('@/api/evaluation')
const { FavoritesAdd } = require('@/api/favorites')
const { SelfStudyTaskBye, SelfStudyTaskStart } = require('@/api/selfStudy')

export default {
  name: 'CommonPreviewV2',
  components: {
    PlanLink,
    UiLearnOutSub,
    EvaluationTablePreview,
    CommonAssociatePreview,
    NoMoreResources,
    TaskLink,
    MediaPreview,
    TaskMaterialPreview,
    RateByPercent,
    ReviewsPreview,
    ReviewScore
  },
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: Number,
      required: true
    },
    isLibrary: {
      type: Boolean,
      default: false
    },
    // copy 过的id，如果曾今copy过，前myContentId不为空，则copy变成edit
    myContentId: {
      type: String,
      default: null
    }
  },
  mixins: [ PptPreviewMixin, BaseEventMixin, GoogleAuthCallBackMixin ],
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentRole: state => state.user.currentRole
    }),
    lastChangeSavedTime () {
      if (this.data) {
        logger.info('lastChangeSavedTime data', this.data)
        const time = this.data.updateTime || this.data.createTime
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
    }
  },
  data () {
    return {
      loading: true,
      slideLoading: false,
      copyLoading: false,
      data: null,
      imgList: [],
      viewMode: 'Detail',
      RATE_TOOLTIPS: RATE_TOOLTIPS,
      ReviewsTask: ReviewsTask,
      ReviewsTeacher: ReviewsTeacher,

      tagColorList: [
        'pink',
        'orange',
        'green',
        'cyan',
        'blue',
        'red',
        'purple'
      ],
      activeContentType: -1,
      typeMap: typeMap,

      subPreviewVisible: false,
      currentImgIndex: 0,
      initPrompts: [],
      reviewsStats: {
        avgReviewsScore: 0,
        reviewsScoreStatDetail: [],

        reviewsCount: 0,
        effectiveness: 0,
        overall: 0,
        quality: 0,
        studentsEngagement: 0
      },

      recommendTemplateList: []
    }
  },
  created () {
    logger.info('CommonPreviewV2 id ' + this.id + ' type ' + this.type)
    this.loadData()
  },
  methods: {
    loadData () {
      logger.info('loadData ' + this.id + ' type ' + this.type)
      this.loading = true
      if (this.type === this.typeMap['unit-plan']) {
        UnitPlanQueryById({
          id: this.id
        }).then(response => {
          logger.info('UnitPlanQueryById ' + this.id, response.result)
          this.data = response.result
          this.oldForm = this.data
          if (this.data && this.data.image) {
            this.imgList = [this.data.image]
          }
        }).finally(() => {
          this.loading = false
          this.queryContentCollaborates(this.id, this.type)
        })
      } else if (this.type === this.typeMap.task) {
        TaskQueryById({
          id: this.id
        }).then(response => {
          logger.info('TaskQueryById ' + this.id, response.result)
          this.data = response.result
          this.loading = false
          this.oldForm = this.data
          this.queryContentCollaborates(this.id, this.type)
          this.loadThumbnail()
          if (this.data.presentationId) {
            this.getClassInfo(this.data.presentationId)
          }
        })

        this.$logger.info('loadRecommendThumbnail')
        recommendTemplates({ taskId: this.id }).then(response => {
          logger.info('loadRecommendThumbnail res:', response.result)
          if (response.success) {
            this.recommendTemplateList = response.result
          }
        })
      } else if (this.type === this.typeMap.evaluation) {
        EvaluationQueryById({
          id: this.id
        }).then(response => {
          logger.info('EvaluationQueryById ' + this.id, response.result)
          this.data = response.result
          this.oldForm = this.data
          if (this.data && this.data.image) {
            this.imgList = [this.data.image]
          }
        }).finally(() => {
          this.loading = false
          this.queryContentCollaborates(this.id, this.type)
        })
      }
      GetDictItems(DICT_PROMPT_TYPE).then(response => {
        if (response.success) {
          logger.info('DICT_PROMPT_TYPE', response.result)
          this.initPrompts = response.result
        }
      })
      // if (['student', 'teacher'].includes(this.currentRole)) {
        this.loadReviewStats()
      // }
    },

    handleAuthCallback () {
      this.$logger.info('Preview handleAuthCallback')
      if (this.currentMethodName === 'loadThumbnail') {
        this.loadThumbnail()
      } else if (this.currentMethodName === 'handleDuplicateItem') {
        this.handleDuplicateItem()
      }
    },

    loadThumbnail () {
      this.$logger.info('Preview loadThumbnail ', this.data)
      if (this.data.presentationId) {
        if (this.isLibrary) {
          TemplatesGetPublishedPresentation({
            presentationId: this.data.presentationId
          }).then(response => {
            if (response.code !== this.ErrorCode.ppt_google_token_expires && response.code !== this.ErrorCode.ppt_forbidden) {
              const pageObjects = response.result.pageObjects
              this.thumbnailList = []
              if (pageObjects.length) {
                pageObjects.forEach(page => {
                  this.imgList.push(page.contentUrl)
                  this.thumbnailList.push({ contentUrl: page.contentUrl, id: page.pageObjectId })
                  this.slideLoading = false
                  this.$logger.info('current imgList ', this.imgList)
                })
              } else {
                this.imgList = []
                this.slideLoading = false
              }
            } else {
              this.$logger.info('等待授权事件通知')
              this.currentMethodName = 'loadThumbnail'
            }
          })
        } else {
          TemplatesGetPublishedPresentation({
            presentationId: this.data.presentationId
          }).then(response => {
            if (response.code !== this.ErrorCode.ppt_google_token_expires && response.code !== this.ErrorCode.ppt_forbidden) {
              const pageObjects = response.result.pageObjects
              this.thumbnailList = []
              if (pageObjects.length) {
                pageObjects.forEach(page => {
                  this.imgList.push(page.contentUrl)
                  this.thumbnailList.push({ contentUrl: page.contentUrl, id: page.pageObjectId })
                  this.slideLoading = false
                  this.$logger.info('current imgList ', this.imgList)
                })
              } else {
                this.imgList = []
                this.slideLoading = false
              }
            } else {
              this.$logger.info('等待授权事件通知')
              this.currentMethodName = 'loadThumbnail'
            }
          })
        }
      } else {
        this.slideLoading = false
      }
    },

    loadReviewStats () {
      let promise = null
      if (this.currentRole === 'student') {
        promise = ReviewsTask.ReviewsTaskStats
      } else {
        promise = ReviewsTeacher.ReviewsTeacherStats
      }
      promise && promise({
        taskId: this.id, // 学生需要
        purchasesId: this.id // 老师需要
      }).then(res => {
        if (res.success) {
          this.reviewsStats = res.result
        }
      })
    },

    handleSelectContentType (contentType) {
      logger.info('handleSelectContentType ' + contentType)
      this.activeContentType = contentType
    },

    handleSubPreviewClose () {
      logger.info('handleSubPreviewClose')
      this.subPreviewVisible = false
    },

    handleViewModeChange () {
      this.$logger.info('handleViewModeChange ' + this.viewMode)
    },
    handleFavorite (item) {
      logger.info('handleFavorite', item)
      FavoritesAdd({
        sourceId: item.id,
        sourceType: item.type
      }).then(response => {
        logger.info('FavoritesAdd ', response)
        item.isFavorite = !item.isFavorite
        this.data.isFavorite = item.isFavorite
        this.$emit('favoritiesAdd', { ...this.data })
      })
    },
    handleGotoImgIndex (index) {
      this.$logger.info('handleGotoImgIndex ' + index)
      this.currentImgIndex = index
      this.$refs.carousel.goTo(index)
    },
    handleEditItem (item) {
      item.type = this.type
      logger.info('handleEditItem', item)
      if (item.type === typeMap['unit-plan']) {
        window.open('/teacher/unit-plan-redirect/' + item.id
          , '_blank')
      } else if (item.type === typeMap.task) {
        window.open('/teacher/task-redirect/' + item.id
          , '_blank')
      } else if (item.type === typeMap.evaluation) {
        window.open('/teacher/evaluation-redirect/' + item.id
          , '_blank')
      }
    },
    handleDuplicateItem () {
      this.$logger.info('handleDuplicateItem', this.data)
      this.$confirm({
        title: 'Confirm to copy',
        content: 'Are you sure to copy ' + this.data.name + ' ?',
        centered: true,
        onOk: () => {
          this.copyLoading = true
            Duplicate({ id: this.data.id, type: this.data.type }).then((response) => {
              if (response.code !== this.ErrorCode.ppt_google_token_expires && response.code !== this.ErrorCode.ppt_forbidden) {
                this.$logger.info('Duplicate response', response)
                this.$message.success('Copy successfully')
                this.$router.push({ path: '/teacher/main/created-by-me' })
              } else {
                this.currentMethodName = 'handleDuplicateItem'
              }
          }).finally(() => {
            this.copyLoading = false
            // this.$router.push({ path: '/teacher/main/created-by-me' })
          })
        }
      })
    },

    handleStartTask () {
      this.$confirm({
        title: 'Confirm to start',
        content: 'Are you sure to start ' + this.data.name + ' ?',
        centered: true,
        onOk: () => {
          this.copyLoading = true
          if (this.data.buyed || USER_MODE.SCHOOL === this.userMode) {
            this.handleStartSession(this.data.id)
          } else {
            SelfStudyTaskBye({ taskId: this.data.id }).then((response) => {
              if (response.success) {
                // this.$logger.info('SelfStudyTaskBye response', response)
                // this.$message.success('Start successfully')
                // this.$router.push({ path: '/student/main/my-task' })
                this.handleStartSession(this.data.id)
              }
            }).finally(() => {
              this.copyLoading = false
            })
          }
        }
      })
    },

    handleOpenLink (url) {
      window.open(url, '_blank')
    },
    handleStartSession(taskId) {
      this.copyLoading = true
      SelfStudyTaskStart({ taskId: taskId }).then(res => {
        this.$logger.info('StartOpenSession res', res)
        if (res.success) {
          this.copyLoading = false
          const targetUrl = lessonHost + 's/' + res.result.classId + '?token=' + storage.get(ACCESS_TOKEN)
          this.$logger.info('try open ' + targetUrl)
          // window.open(targetUrl, '_blank')
          window.location.href = targetUrl
        } else {
          this.$message.warn('StartLesson Failed! ' + res.message)
        }
      }).finally(() => {
        this.copyLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.my-common-preview {
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  .main-content-preview {
    flex-grow: 1;
  }

  .top-header {
    position: relative;
    color: rgba(0, 0, 0, 0.65);
    background: #fff;

    .title-line {
      padding: 5px 0;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .name {
        width: 70%;
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
        font-family: Inter-Bold;
        font-size: 15px;
        font-weight: bold;
        color: #182552;
        padding-right: 10px;
        box-sizing: border-box;
      }

      .action-item {
        display: flex;
        width: 30%;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;

        .star {
          img {
            width: 22px;
          }
        }

        .edit {
          margin-left: 15px;
          .button-content {
            display: flex;
            align-items: center;
            justify-content: center;
            .edit-icon {
              padding-left: 5px;
              width: 18px;
            }
          }
          .copy-button{
            display: flex;
            flex-direction: row;
            align-items: center;
          }
        }
      }
    }

    .last-change-time {
      font-size: 12px;
      color: @text-color-secondary;
    }

    .price-line {
      position: absolute;
      right: 0;
      top: -27px;
      label {
        height: 27px;
        font-size: 20px;
        font-family: Segoe UI;
        font-weight: bold;
        line-height: 24px;
        font-style: italic;
        color: #182552;
        opacity: 1;
      }
    }
  }

  .author-info {
    margin-top: 10px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    .avatar-icon {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      img {
        width: 64px;
        height: 64px;
        border-radius: 100%;
      }
      &.avatar-small {
        img {
          width: 32px;
          height: 32px;
        }
      }
    }
    .sub-info {
      padding-left: 5px;
    }
    .sub-info {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      .created-by {
        padding-right: 10px;
        font-size: 13px;
        font-weight: 500;
        font-family: Inter-Bold;
        color: #182552;
      }

      .created-time {
        font-family: Inter-Bold;
        font-size: 10px;
        color: #000000;
        opacity: 0.5;
      }
    }
    .star-info {
      display: flex;
      ul {
        margin-bottom: 0;
      }
    }
  }

  .data-info {
    min-height: 100px;
    padding: 0 5px;
    opacity: 1;
    border-radius: 5px;

    .right-detail {

      .tag-detail-block {

        .info-tag {
          padding-left: 75px;
          margin-bottom: 5px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .info-tag-item {
            cursor: pointer;
            padding: 5px 15px;
            background: #fafafa;
            margin-bottom: 8px;
            border: 1px solid rgba(188, 188, 188, 0.5);
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
            opacity: 1;
            border-radius: 33px;
            font-family: Inter-Bold;
            color: #182552;
          }
        }
      }

      .sub-detail {
        min-height: 100px;
        padding: 10px 0;
        background: rgba(253, 238, 218, 0.5);
        border: 1px solid #DCDCDC;
        border-radius: 5px;

        .block-title {
          font-weight: 500;
          font-size: 16px;
          padding: 5px 15px;
          font-family: Inter-Bold;
          color: #000000;
        }

        .scenario-block-content {
          padding: 5px 10px;
          .content-list {
            display: flex;
            flex-direction: column;

            .content-item {
              margin-bottom: 10px;
              background: #fff;
              padding: 10px;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-around;
              .question {
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                padding-right: 15px;
              }
              .tags {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;

                .tag-label {
                  font-weight: bold;
                  padding-right: 10px;
                }

                .tag-item {
                  font-size: 16px;
                  margin-right: 5px;
                  margin-bottom: 5px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-break: break-all;
                  white-space: nowrap;
                  .tag {
                    background: rgba(255, 187, 0, 0.1);
                    border: 1px solid #FFBB00;
                    border-radius: 20px;
                    font-family: Inter-Bold;
                    color: #FFBB00;
                  }
                }
              }

              .content-sub-list {
                padding: 5px 0;
                background-color: #f9f9f9;
                .subject-name {
                  cursor: pointer;
                  color: @primary-color;
                  padding: 0 10px;
                  line-height: 30px;
                  border-radius: 30px;
                  margin: 0 10px;
                  background-color: fade(@outline-color, 20%);
                }
              }
            }
          }
        }

        .keyword-block-content {
          .content-list {
            display: flex;
            flex-direction: column;

            .content-item {
              margin-bottom: 10px;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: space-around;
              .question {
                width: 100%;
                font-size: 14px;
                font-weight: 500;
                padding: 10px 10px;
                background: rgba(255, 187, 0, 0.1);
                color: rgba(255, 187, 0, 1);
                margin-bottom: 10px;
              }
              .tags {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;

                .tag-label {
                  font-weight: bold;
                  padding-right: 10px;
                }

                .tag-item {
                  font-size: 16px;
                  margin-right: 5px;
                  margin-bottom: 5px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-break: break-all;
                  white-space: nowrap;
                  .tag {
                    background: rgba(255, 187, 0, 0.1);
                    border: 1px solid #FFBB00;
                    border-radius: 20px;
                    font-family: Inter-Bold;
                    color: #FFBB00;
                  }
                }
              }

              .content-sub-list {
                padding: 5px 0;
                width: 100%;
                .content-sub-item {
                  background: #fff;
                  margin-bottom: 10px;
                  .sub-title {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px;
                    .sub-title-name {
                      padding-right: 15px;
                      font-weight: 500;
                      display: inline-block;
                      .subject-name {
                        display: inline-block;
                        cursor: pointer;
                        color: @primary-color;
                        padding: 0 8px;
                        line-height: 20px;
                        border-radius: 20px;
                        margin: 0 5px;
                        background-color: fade(@outline-color, 20%);
                      }
                    }
                  }
                }

                .tag {
                  background: rgba(255, 187, 0, 0.1);
                  border: 1px solid #FFBB00;
                  border-radius: 20px;
                  font-family: Inter-Bold;
                  color: #FFBB00;
                }
              }
            }
          }
        }

        .inquiry-block-content {
          width: 100%;
          padding: 5px 10px;
          .inquiry {
            margin-bottom: 10px;
            background: #fff;
            padding: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
          }
        }

        .overview-block {
          padding: 10px;
          margin-bottom: 10px;
          .view-text {
            padding: 10px;
            background: #fff;
            color: #000;
            font-family: Inter-Bold;
            font-weight: 500;
          }
        }
      }
    }
  }

  .preview-data-info {
    margin-top: 10px;
    padding: 5px;
    opacity: 1;
  }

  .reviews-info {
    .slide-reviews {
      padding: 0px 0;
      .reviews-wrapper {
        margin-top: 20px;
      }
    }
  }

  .left-preview {
    margin-top: 10px;
    height: 100%;

    .edit-action {
      margin-top: 20px;
    }
  }

  .bottom-relative {

    .type-button {
      width: 100px;
    }

    /deep/ .left-button {
      border-radius: 16px 0 0 16px;
    }

    /deep/ .right-button {
      border-radius: 0 ;
      &:last-child {
        border-radius: 0 16px 16px 0;
      }
    }
  }
}

/deep/ .left-button {
  border-radius: 16px 0 0 16px;
  font-family: Inter-Bold;
  color: #11142D;
}

/deep/ .right-button {
  border-radius: 0 ;
  font-size: 14px;
  font-family: Inter-Bold;
  // background: rgba(247, 248, 255, 1);
  color: #11142D;
  opacity: 1;
  border-right-width: 0;
  &:last-child {
    border-radius: 0 16px 16px 0;
    border-right-width: 1px;
  }
}

.action-header {
  padding: 10px 0;
  .action-header-toggle {
    position: relative;
    .edit-item {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}

.edit-action {
  text-align: right;
}

.my-carousel {
  width: 100%;
  box-shadow: 0px 10px 12px rgba(126, 126, 126, 0.16);
  div {
    img {
      height: 350px;
      width: 100%;
    }
  }
}

.carousel-page {
  display: flex;
  height: 110px;
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 3px;
    background: rgba(0,0,0,0.00);
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
  }
  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(0,0,0,0.12);
    -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
  }
  .img-list-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    .img-list {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;
      .img-item {
        height: 80px;
        border: 1px solid #ddd;
        box-shadow: 0 4px 8px 0 rgba(31, 33, 44, 10%);
        margin: 0 10px;
        img {
          height: 100%;
        }
      }
    }
  }
}

.data-info {
  .block-main-label {
    color: rgba(0, 0, 0, 1);
    font-size: 18px;
    font-weight: bold;
    font-family: Inter-Bold;
    padding: 5px 15px;
  }
}

.custom-tags {
  background: #fff;
  padding: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;

  .tag-item {
    font-size: 16px;
    margin-right: 5px;
    margin-bottom: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
    .tag {
      background: rgba(255, 187, 0, 0.1);
      border: 1px solid #FFBB00;
      border-radius: 20px;
      font-family: Inter-Bold;
      color: #FFBB00;
      padding: 3px 10px;
    }
  }
}

.learn-question-tag {
  width: 100%;
}

.data-detail-wrapper {
  background: rgba(253, 238, 218, 0.5);
  border: 1px solid rgba(220, 220, 220, 1);
  padding: 10px;
  .detail-block {
    .block-title {
      font-weight: 500;
      font-size: 16px;
      font-family: Inter-Bold;
      color: #000000;
      width: 100%;
    }

    .scenario-block-content {
      padding: 5px 0;
      .content-list {
        display: flex;
        flex-direction: column;

        .content-item {
          background: #fff;
          padding: 5px 10px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .question {
            font-size: 14px;
            font-weight: 500;
            padding-right: 15px;
          }
          .tags {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            width: 250px;
            justify-content: flex-end;

            .tag-label {
              font-weight: bold;
              padding-right: 10px;
            }

            .tag-item {
              font-size: 16px;
              margin-right: 5px;
              margin-bottom: 5px;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              white-space: nowrap;
              .tag {
                background: rgba(255, 187, 0, 0.1);
                border: 1px solid #FFBB00;
                border-radius: 20px;
                font-family: Inter-Bold;
                color: #FFBB00;
              }
            }
          }

          .content-sub-list {
            padding: 5px 0;
            background-color: #f9f9f9;
            .subject-name {
              cursor: pointer;
              color: @primary-color;
              padding: 0 10px;
              line-height: 30px;
              border-radius: 30px;
              margin: 0 10px;
              background-color: fade(@outline-color, 20%);
            }
          }
        }
      }
    }

    .keyword-block-content {
      padding: 5px 0;
      .content-list {
        display: flex;
        flex-direction: column;

        .content-item {
          margin-bottom: 10px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-around;
          .question {
            width: 100%;
            font-size: 14px;
            font-weight: 500;
            padding: 5px 0;
          }
          .tags {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            .tag-label {
              font-weight: bold;
              padding-right: 10px;
            }

            .tag-item {
              font-size: 16px;
              margin-right: 5px;
              margin-bottom: 5px;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              white-space: nowrap;
              .tag {
                background: rgba(255, 187, 0, 0.1);
                border: 1px solid #FFBB00;
                border-radius: 20px;
                font-family: Inter-Bold;
                color: #FFBB00;
              }
            }
          }

          .content-sub-list {
            padding: 5px 0;
            width: 100%;
            .content-sub-item {
              background: rgba(255, 187, 0, 0.1);
              color: rgba(255, 187, 0, 1);
              margin-bottom: 10px;
              .sub-title {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 10px;
                .sub-title-name {
                  padding-right: 15px;
                  font-weight: 500;
                  display: inline-block;
                  .subject-name {
                    display: inline-block;
                    cursor: pointer;
                    color: @primary-color;
                    padding: 0 8px;
                    line-height: 20px;
                    border-radius: 20px;
                    margin: 0 5px;
                    background-color: fade(@outline-color, 20%);
                  }
                }
              }
            }

            .tag {
              background: rgba(255, 187, 0, 0.1);
              border: 1px solid #FFBB00;
              border-radius: 20px;
              font-family: Inter-Bold;
              color: #FFBB00;
            }
          }
        }
      }
    }

    .inquiry-block-content {
      width: 100%;
      background: rgba(21, 195, 154, 0.1);
      border: 1px dashed rgba(216, 216, 216, 1);
      .inquiry {
        padding: 5px 10px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        color: rgba(21, 195, 154, 1);
      }
    }

    .overview-block {
      padding: 10px;
      margin-bottom: 10px;
      .view-text {
        padding: 10px;
        background: #fff;
        color: #000;
        font-family: Inter-Bold;
        font-weight: 500;
      }
    }
  }
}

.preview-data-info {
  .block-main-label {
    color: rgba(0, 0, 0, 1);
    font-size: 18px;
    font-weight: bold;
    font-family: Inter-Bold;
    padding: 5px 0;
  }

  .content-item {
  }
}

.page-info {
  position: absolute;
  right: 8px;
  top: 145px;
  background: #E4E4E4;
  padding: 1px 10px;
  border-radius: 20px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  align-items: center;
  font-size: 12px;
}

.slide-select-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;
}

/deep/ .ant-carousel .slick-slide img{
  width:100%;
}
/deep/ .ant-carousel{
  .custom-slick-arrow:before {
    display: none;
  }
  .custom-slick-arrow:hover {
    opacity: 1;
  }
  .slick-slide h3 {
    color: #fff;
  }
  .anticon{
    color: fade(@black, 45%);
    font-size: 30px;
  }
}
.slide-select {
  background: #fff;
  position: relative;
  .slide-select-and-preview {
    width:100%;
    //min-height: 400px;

    .reset-edit-basic-info {
      z-index: 100;
      position: absolute;
      top: 10px;
      left: 3px;
      background: rgba(0,0,0, 0.8);
      opacity: 0.7;
      padding: 5px 10px;
      font-size: 12px;
      border-radius: 20px;
      cursor: pointer;
      color: #fff;
    }

    .slide-select-action {
      height: 400px;
      width: 600px;
      img {
        width:100%
      }
    }

  }
}
.slide-recommend {
  width: 600px;
  padding: 0 20px;
  box-sizing: border-box;
}

.plugin-tags{
  overflow-y:auto;
  background-color:#fafafa;
  font-size: 12px;
  padding: 3px;
  font-family: Segoe UI;
  .tag-row{
    margin: 5px;
  }
  .tag-item{
    margin-right: 15px;
  }
  .tag-title{
    font-weight: 400;
    line-height: 0px;
    color: #333334;
    opacity: 1;
  }
  .tag-value{
    margin-left: 10px;
  }
}

.associate-info{
  padding: 10px 5px 10px 5px;
}
.top-icon-groups {
  position: relative;
  color: rgba(0, 0, 0, 0.65);
  background: #fff;
  height:70px;
  .icon-group{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    flex-basis: auto;
    justify-content: flex-start;
    align-items: center;
    /deep/ .ant-badge-count{
      top:10px;
      right:12px;
    }
    .icon {
      width: 50px;
      height: 50px;
      margin: 10px 10px 10px 0;
      border: 1px solid #ddd;
      border-radius: 6px;
      background: #fafafa;
      display: flex;
      flex-direction: column;
      font-weight: bold;
      padding:2px;
      cursor: pointer;
      align-items: center;
      .icon-text {
        display: flex;
        font-size: 12px;
      }
      svg {
        display: flex;
        width: 32px;
        height: 32px;
      }
    }
  }

  .title-line {
    padding: 5px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .name {
      width: 70%;
      overflow-x: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      font-family: Inter-Bold;
      font-size: 15px;
      font-weight: bold;
      color: #182552;
      padding-right: 10px;
      box-sizing: border-box;
    }

    .action-item {
      display: flex;
      width: 30%;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;

      .star {
        img {
          width: 22px;
        }
      }

      .edit {
        margin-left: 15px;
        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          .edit-icon {
            padding-left: 5px;
            width: 18px;
          }
        }
      }
    }
  }
}

.material-row {
  height: 70px;
  display: flex;
  align-items: center;
}

.material-list {
  background: #fff;
  padding: 5px 15px;
}
.material-item {
  margin: 10px 0;
  .material-name {
    font-family: Inter-Bold;
    font-size: 14px;
    font-weight: bold;
    color: #182552;
    padding-right: 10px;
    box-sizing: border-box;
  }

  .material-link {
    cursor: pointer;
    font-family: Inter-Regular;
    font-size: 13px;
    color: #2DC9A4;
    text-decoration: underline;
  }
}

.has-extra-info {
  padding-right: 25px;
}

.extra-content-preview {
  overflow: visible;
  width: 500px;
  height: 100%;
  padding-top: 10px;
  box-sizing: border-box;
}

.slide-item {
  border: 1px solid #15C39A;
  min-height: 173px;
}

.unit-cover {
  min-height: 200px;
  width: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  margin-bottom: 10px;
}

.slide-desc {
  width: 70%;
  max-height: 50px;
  margin: 0 auto 10px;
  overflow: hidden;
}

.recommend-slide-name {
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 40px;
  font-family: Inter-Bold;
  font-weight: 500;
  color: #333;
}

.slide-preview-item {
  margin-left: auto;
  margin-right: auto;
}

</style>
