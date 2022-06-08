<template>
  <div class='content-preview-detail' ref="container">
    <div class='preview-carousel-wrapper'>
      <preview-carousel :page-object-list='thumbnailList' :video-list='videoList' v-if='!carouselContentLoading' />
      <a-skeleton v-if='carouselContentLoading' />
    </div>
    <div class='preview-main-content' v-if='content'>
      <a-row class='content-info-item'>
        <a-col span='18' class='cc-ellipsis cc-info-left'>
          <h3>{{ content.name || 'Untitled' }}</h3>
        </a-col>
        <a-col span='6' class='cc-info-right'>
          <a-space :size='20'>
            <div class='start-it' @click='handleFavorite'>
              <div class='favorite'>
                <a-icon type="heart" :style="{ color: '#fb0' }" theme="filled" v-if='favoriteFlag' />
                <a-icon type="heart" v-if='!favoriteFlag' />
              </div>
              <div class='favorite-num'>
                {{ content.favoriteCount || 15 }}
              </div>
            </div>
            <div class='sales'>
              Sales {{ content.sales || 16 }}
            </div>
          </a-space>
        </a-col>
      </a-row>

      <a-row class='content-info-item'>
        <a-col span='18' class='cc-ellipsis cc-info-left'>
          <div class='author-info'>
            <div class='author-avatar'>
              <a-avatar size='large' style="backgroundColor:#517F3F">{{ content.createBy.toUpperCase()[0] }}</a-avatar>
            </div>
            <div class='author-info-detail'>
              <div class='author-name'>
                {{ content.createBy }}
              </div>
              <div class='rate-star'>
                <a-tooltip placement="right">
                  <template slot="title">
                    10 people gave a score of 5 stars
                  </template>
                  <a-rate :default-value="5" disabled class='cc-rate'/>
                </a-tooltip>
              </div>
            </div>
          </div>
        </a-col>
        <a-col span='6' class='cc-info-right'>
          <div class='col-info'>
            <div class='price-info'>
              <a-space :size='5'>
                <div class='discount-price'>
                  ${{ content.price || 0 }}
                </div>
                <div class='pre-price'>
                  <del>$ {{ content.oldPrice || 0 }}</del>
                </div>
              </a-space>
            </div>
            <div class='buy-button'>
              <a-button class='buy-now' type="danger" shape='round' @click='handleDuplicateItem' :loading='copyLoading'>
                Buy now
              </a-button>
            </div>
          </div>
        </a-col>
      </a-row>

      <div class='split-line'></div>
      <div class='edit-content' v-if='content.createBy === $store.getters.userInfo.email'>
        <a-button class='cc-dark-button' style='width: 90px' shape='round' @click='handleEdit'>Edit</a-button>
      </div>
      <template v-if="content.name && content.name.trim()">
        <div class='content-block'>
          <div class='content-title'>
            Name
          </div>
          <div class='content-detail'>
            {{ content.name }}
          </div>
        </div>
      </template>

      <template v-if="content.contentType">
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
            Overview
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
              {{ learnOut.desc }}
            </div>
          </div>
        </div>
      </template>

      <div class='line-split'></div>

      <div class='card-list-wrapper' v-if="content.subTasks && content.subTasks.length">
        <div class='card-list-title'>
          Sub tasks ({{ content.subTasks.length }})
        </div>
        <div class='card-list'>
          <div class="card-item" v-for="(subTask, i) in content.subTasks" :key="i">
            <card-list-item :content="subTask" :width="16" :inner-desc="false" :outer-desc="true" />
          </div>
        </div>
      </div>

      <div class='card-list-wrapper' v-if="associateList.length">
        <div class='card-list-title'>
          <template v-if="associateList[0].type === typeMap['unit-plan']">Unit</template>
          <template v-if="associateList[0].type === typeMap.task">Task</template>
          ({{ associateList.length }})
        </div>
        <div class='card-list'>
          <div class="card-item" v-for="(associate, i) in associateList" :key="i">
            <card-list-item :content="associate" :width="16" :inner-desc="false" :outer-desc="true" />
          </div>
        </div>
      </div>
    </div>
    <div class='preview-extra-data'>
    </div>
    <div class='preview-review'></div>
    <div class='preview-recommend'></div>
  </div>
</template>

<script>

import PreviewCarousel from '@/components/Preview/PreviewCarousel'
import { UnitPlanQueryById } from '@/api/unitPlan'
import { PDContentQueryById } from '@/api/pdContent'
import { TaskQueryById } from '@/api/task'
import { VideoQueryById } from '@/api/video'
import { TemplatesGetPublishedPresentation } from '@/api/template'
import { Duplicate, GetAssociate } from '@/api/teacher'
import { mapState } from 'vuex'
import * as logger from '@/utils/logger'
import { formatLocalUTC } from '@/utils/util'
import { PptPreviewMixin } from '@/mixins/PptPreviewMixin'
import { QueryByClassInfoSlideId } from '@/api/classroom'
import { FavoritesAdd } from '@/api/favorites'
import CardListItem from '@/components/Preview/CardListItem'
import { GoogleAuthCallBackMixin } from '@/mixins/GoogleAuthCallBackMixin'
import { debounce } from 'lodash-es'
import { ContentItemMixin } from '@/mixins/ContentItemMixin'

export default {
  name: 'ContentPreviewDetail',
  components: { CardListItem, PreviewCarousel },
  props: {
    contentId: {
      type: String,
      required: true
    },
    contentType: {
      type: Number,
      required: true
    }
  },
  mixins: [PptPreviewMixin, GoogleAuthCallBackMixin],
  data() {
    return {
      contentLoading: true,
      content: null,

      carouselContentLoading: true,

      thumbnailList: [],
      pageObjectIds: [],
      videoList: [],

      associateList: [],
      favoriteFlag: false,

      typeMap: this.$classcipe.typeMap,
      copyLoading: false,
      handleScrollFn: null,
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentRole: state => state.user.currentRole
    }),
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
    }
  },
  created() {
    this.loadDetail()
    this.handleScrollFn = debounce(this.handleScroll, 200)
  },
  mounted() {
    this.$refs.container.addEventListener('scroll', this.handleScrollFn)
  },
  beforeDestroy() {
    this.$refs.container.removeEventListener('scroll', this.handleScrollFn)
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
      } finally {
        this.contentLoading = false
      }
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

      if (this.content.presentationId) {
        this.getClassInfo(this.content.presentationId)
      }
    },

    handleScroll (e) {
      this.$logger.info('handleScroll', e)
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
    },

    async loadSlideData () {
      try {
        this.carouselContentLoading = true
        const slideData = await TemplatesGetPublishedPresentation({ taskId: this.contentId })
        console.log('loadSlideData', slideData)
        this.thumbnailList = slideData.result.pageObjects
        this.pageObjectIds = slideData.result.pageObjectIds
        await this.loadMaterialData()
      } catch (e) {
        console.error('loadSlideData', e)
      } finally {
        this.carouselContentLoading = false
      }
    },

    async loadAssociateData () {
      try {
        const slideData = await GetAssociate({
          id: this.contentId,
          type: this.contentType,
          published: 0
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
      FavoritesAdd({
        sourceId: this.contentId,
        sourceType: this.contentType
      }).then(response => {
        this.$logger.info('FavoritesAdd ', response)
        this.favoriteFlag = !this.favoriteFlag
      })
    },

    handleEdit () {
      if (this.content.type === this.typeMap['unit-plan']) {
        window.open('/teacher/unit-plan-redirect/' + this.content.id, '_blank')
      } else if (this.content.type === this.typeMap.task) {
        window.open('/teacher/task-redirect/' + this.content.id, '_blank')
      } else if (this.content.type === this.typeMap.pd) {
        window.open('/teacher/pd-content-redirect/' + this.content.id, '_blank')
      } else if (this.content.type === this.typeMap.video) {
        window.open('/teacher/video-redirect/' + this.content.id, '_blank')
      }
    },

    handleDuplicateItem () {
      this.$logger.info('handleDuplicateItem', this.content)
      this.$confirm({
        title: 'Confirm to buy',
        content: 'Are you sure to buy ' + this.content.name + ' ?',
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
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.preview-carousel-wrapper {
  height: 400px;
  width: 100%;
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
    padding-left: 5px;
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
    height: 55px;
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
      margin-bottom: 10px;
      padding: 5px 10px;
      border-radius: 5px;
      background: #F5F5F5;
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
  .card-list-title {
    font-size: 20px;
    font-family: Arial;
    font-weight: bold;
    color: #202020;
    line-height: 25px;
    padding-bottom: 10px;
  }

  .card-list {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    overflow-x: scroll;
    width: 100%;
    padding-bottom: 15px;

    .card-item {
      margin-right: 10px;
    }
  }
}
</style>
