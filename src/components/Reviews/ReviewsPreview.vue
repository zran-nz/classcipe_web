<template>
  <div class="reviews-wrapper">
    <div class="reviews-title">
      <h4>Reviews</h4>
    </div>
    <review-edit
      ref="myReview"
      :role="role"
      v-show="canEdit"
      :myReviews="myReviews"
      @submit="handleSaveMyReview"
    />
    <div class="reviews-search">
      <div class="my-search">
        <a-input-search
          placeholder="Search"
          v-model="reviewsNotes"
          @search="triggerSearch"
          @pressEnter="triggerSearch"
          :allowClear="true"
        >
        </a-input-search>
      </div>
      <a-select :getPopupContainer="trigger => trigger.parentElement" v-model="reviewsScore" @change="triggerChangeRate">
        <a-select-option value="">
          All rating
        </a-select-option>
        <a-select-option :value="item" v-for="item in [ 5,4,3,2,1]" :key="'rate_choose_'+ item">
          {{ item }} rating
        </a-select-option>
      </a-select>
    </div>

    <div class="reviews-content">
      <a-spin :spinning="delLoading">
        <div class="reviews-content-detail reviews-me" v-if="myReviews">
          <div class="content-detail__avatar">
            <img v-if="!myReviews.avatar" src="~@/assets/icons/library/default-avatar.png"/>
            <img v-else :src="myReviews.avatar"/>
          </div>
          <div class="content-detail__rate">
            <review-score :review="myReviews" />
            <div class="content-detail__tag">
              <a-tag color="#f50" v-show="myReviews.learningDistance">
                Distance
              </a-tag>
              <a-tag color="#2db7f5" v-show="myReviews.learningHome">
                At home
              </a-tag>
              <a-tag color="#87d068" v-show="myReviews.learningClass">
                In-class
              </a-tag>
            </div>
          </div>
          <div>
            <div class="content-detail__title">
              <div class="title-info">
                <div class="info-author">
                  {{ myReviews.createBy }}
                </div>
                <div class="info-time">
                  {{ myReviews.createTime }}
                </div>
              </div>
            </div>
            <div class="content-detail__review">
              <label>
                {{ myReviews.reviewsNotes }}
              </label>
            </div>
          </div>
          <a-space class="content-detail__edit" v-show="canEdit">
            <a-button type="link" @click="() => triggerEdit(true)">Edit</a-button>
            <a-button type="link" @click="handleDelMyReview">Delete</a-button>
          </a-space>
        </div>
      </a-spin>
      <a-skeleton :loading="loading" active v-show="!myReviews || reviewsList.length > 0" >
        <a-list item-layout="vertical" :pagination="pagination" :data-source="reviewsList">
          <a-list-item
            slot="renderItem"
            key="item.id"
            slot-scope="item"
          >
            <div class="reviews-content-detail">
              <div class="content-detail__avatar">
                <img v-if="!item.avatar" src="~@/assets/icons/library/default-avatar.png"/>
                <img v-else :src="item.avatar"/>
              </div>
              <div class="content-detail__rate">
                <review-score :review="item" />
                <div class="content-detail__tag">
                  <a-tag color="#f50" v-show="item.learningDistance">
                    Distance
                  </a-tag>
                  <a-tag color="#2db7f5" v-show="item.learningHome">
                    At home
                  </a-tag>
                  <a-tag color="#87d068" v-show="item.learningClass">
                    In-class
                  </a-tag>
                </div>
              </div>
              <div>
                <div class="content-detail__title">
                  <div class="title-info">
                    <div class="info-author">
                      {{ item.createBy }}
                    </div>
                    <div class="info-time">
                      {{ item.createTime }}
                    </div>
                  </div>
                </div>
                <div class="content-detail__review">
                  <label>
                    {{ item.reviewsNotes }}
                  </label>
                </div>
              </div>
            </div>
          </a-list-item>
        </a-list>
      </a-skeleton>
    </div>

  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { RATE_TOOLTIPS } from '@/const/common'
// const { ReviewsTaskStats, ReviewsTaskSave, ReviewsTaskList, ReviewsTaskMyReview, ReviewsTaskDelete } = require('@/api/reviewsTask')
import ReviewEdit from '@/components/Reviews/ReviewEdit'
import ReviewScore from '@/components/Reviews/ReviewScore'
export default {
  name: 'ReviewsPreview',
  components: {
    ReviewEdit,
    ReviewScore
  },
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    role: {
      type: String,
      default: 'student'
    },
    save: {
      type: Function,
      default: () => {}
    },
    list: {
      type: Function,
      required: true
    },
    del: {
      type: Function,
      default: () => {}
    },
    myReview: {
      type: Function,
      default: () => {}
    },
    canEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      delLoading: false,
      subLoading: false,
      RATE_TOOLTIPS: RATE_TOOLTIPS,
      isEdit: false,
      myReviews: null,
      reviewsList: [],
      reviewsNotes: '',
      reviewsScore: '',
      pagination: {
        onChange: page => {
          this.pageNo = page
          this.loadReviewList()
        },
        showTotal: total => `Total ${total} items`,
        total: 0,
        pageSize: 10,
        size: 'small'
      },
      pageNo: 1,
      mockData: {
        reviewsLabel: 1,
        reviewsNotes: '123213123',
        reviewsScore: 1,
        overall: 1,
        effectiveness: 5,
        quality: 4,
        studentsEngagement: 1,
        createBy: 'jacob',
        id: 123213213,
        createTime: '123123'
      }
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    justifyPromise(promise) {
      return (typeof promise === 'object' || typeof promise === 'function') && typeof promise.then === 'function'
    },
    loadData() {
      this.loadMyReview()
      this.loadReviewList()
    },

    loadMyReview() {
      const promise = this.myReview({ taskId: this.id, purchasesId: this.id })
      if (this.justifyPromise(promise)) {
        this.$refs.myReview && this.$refs.myReview.triggerLoading(true)
        promise.then(res => {
          if (res.success) {
            this.myReviews = {
              ...res.result,
              learningClass: Boolean(res.result.learningClass),
              learningDistance: Boolean(res.result.learningDistance),
              learningHome: Boolean(res.result.learningHome),
              updatedMsg: Boolean(res.result.updatedMsg)
            }
            // this.myReviews = this.mockData
          }
        }).finally(() => {
          this.$refs.myReview && this.$refs.myReview.triggerLoading(false)
        })
      }
    },

    loadReviewList() {
      const promise = this.list({
        // student
        reviewsNotes: this.reviewsNotes,
        reviewsScore: this.reviewsScore,
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize,
        taskId: this.id,
        excludeSelf: 1,
        // teacher
        overall: this.reviewsScore,
        searchKey: this.reviewsNotes,
        purchasesId: this.id
      })
      if (this.justifyPromise(promise)) {
        this.loading = true
        promise.then(res => {
          logger.info('loadReviewList', res)
          if (res.result && res.result.records && res.result.records.length) {
            this.reviewsList = res.result.records
            this.pagination.total = res.result.total
          } else {
            this.reviewsList = []
            this.pagination.total = 0
          }
          logger.info('reviewsList', this.reviewsList)
        }).finally(() => {
          this.loading = false
        })
      }
    },

    handleDelMyReview () {
      if (!this.myReviews) return
      this.$confirm({
        title: 'Confirm delete',
        content: 'Are you sure to delete your review ?',
        centered: true,
        onOk: () => {
          const promise = this.del({ id: this.myReviews.id })
          if (this.justifyPromise(promise)) {
            this.delLoading = true
            promise.then((response) => {
              this.$logger.info('del response', response)
              if (response.success) {
                this.$message.success('Del successfully')
                this.myReviews = null
                this.$emit('update')
              }
            }).finally(() => {
              this.delLoading = false
            })
          }
        }
      })
    },

    handleSaveMyReview (subForm) {
      if (this.role === 'student' && !this.myReviews) return
      const promise = this.save({
        taskId: this.id, // student
        purchasesId: this.id, // teacher
        id: this.myReviews ? this.myReviews.id ? this.myReviews.id : null : null,
        ...subForm
      })
      if (this.justifyPromise(promise)) {
        this.$refs.myReview && this.$refs.myReview.triggerLoading(true)
        promise.then((res) => {
          if (res.success) {
            this.$message.success('Save successfully')
            this.myReviews = {
              ...this.myReviews,
              ...res.result,
              learningClass: Boolean(res.result.learningClass),
              learningDistance: Boolean(res.result.learningDistance),
              learningHome: Boolean(res.result.learningHome),
              updatedMsg: Boolean(res.result.updatedMsg)
            }
            // 当前页如果有自己的评价，需要更新
            if (this.myReviews && this.myReviews.id) {
              let meFromPage = this.reviewsList.find(item => item.id === this.myReviews.id)
              if (meFromPage) {
                meFromPage = { ...meFromPage, ...res.result }
              }
            }
            this.$refs.myReview && this.$refs.myReview.triggerIsEdit(false)
            this.$emit('update')
          }
        }).finally(() => {
          this.$refs.myReview && this.$refs.myReview.triggerLoading(false)
        })
      }
    },

    triggerEdit(val) {
      this.$refs.myReview && this.$refs.myReview.triggerEdit(val)
    },

    triggerSearch() {
      this.loadReviewList()
    },

    triggerChangeRate(value) {
      this.loadReviewList()
    }
  }
}
</script>

<style scoped lang="less">
.reviews-wrapper {
  position: relative;
  .reviews-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .reviews-search {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .my-search{
      margin-right: 10px;
      border-radius:6px;
      flex: 1;
      // /deep/ .ant-input{
      //   border-radius:6px;
      //   height: 40px;
      // }
    }
    /deep/ .ant-select-dropdown {
      z-index: 1001;
    }
  }
  .reviews-content {
    margin-top: 20px;
    .reviews-content-detail {
      position: relative;
      padding: 20px;
      background: #F7F8FF;
      display: flex;
      & ~ .reviews-content-detail {
        margin-top: 20px;
      }
      &.reviews-me {
        border: 1px solid #aaa;
      }
      .content-detail__avatar {
        margin-right: 10px;
        img {
          width: 30px;
          height: 30px;
          border-radius: 30px;
        }
      }
      .content-detail__rate {
        position: absolute;
        top: 10px;
        right: 20px;
        text-align: right;
      }
      .content-detail__tag {
        margin-top: 5px;
      }
      .content-detail__title {
        display: flex;
        align-items: flex-start;
        .title-info {
          display: flex;
          flex-direction: column;
          .info-author{
            height: 19px;
            font-size: 14px;
            font-family: Segoe UI;
            font-weight: bold;
            line-height: 24px;
            color: #182552;
            opacity: 1;
          }
          .info-time {
            height: 24px;
            font-size: 14px;
            font-family: Inter-Bold;
            line-height: 24px;
            color: #929292;
            opacity: 1;
            margin-top: 5px;
          }
        }
      }
      .content-detail__review {
        min-height: 48px;
        font-size: 16px;
        font-family: Inter-Bold;
        line-height: 24px;
        color: #000000;
        opacity: 1;
        margin-top: 10px;
      }
      .content-detail__edit {
        position: absolute;
        bottom: 0;
        right: 10px;
      }
    }
  }
}
</style>
