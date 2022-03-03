<template>
  <div class="reviews-wrapper">
    <div class="reviews-title">
      <h2>Reviews</h2>
      <a-space class="reviews-opt" v-if="myReviews">
        <a-button type="link" v-show="!isEdit" @click="() => triggerEdit(true)">Edit Review</a-button>
        <a-button type="link" v-show="isEdit" @click="() => triggerEdit(false)">Cancel</a-button>
        <a-button type="primary" v-show="isEdit" @click="handleSaveMyReview">Send</a-button>
      </a-space>
    </div>
    <a-spin :spinning="subLoading">
      <div class="reviews-edit" v-show="isEdit">
        <div class="reviews-edit__check">
          <div>
            <label>Difficulty Level</label>
            <a-rate
              class="rate-bar-con"
              :count="3"
              :tooltips="reviewsText"
              :allowClear="false"
              v-model="subForm.reviewsLabel"
            >
              <div slot="character">
                <div class="rate-bar"></div>
              </div>
            </a-rate>
          </div>
          <div>
            <label>Overall review</label>
            <a-rate v-model="subForm.reviewsScore" :allowClear="false"/>
          </div>
        </div>
        <div class="reviews-edit__text">
          <a-textarea
            placeholder="Enter your reviews......"
            ref="reviewsNotes"
            v-model="subForm.reviewsNotes"
            :auto-size="{ minRows: 4, maxRows: 6 }"
          />
        </div>
      </div>
    </a-spin>
    <div class="reviews-search">
      <div class="my-search">
        <a-input-search
          placeholder="Search"
          v-model="reviewsNotes"
          @search="triggerSearch"
          @pressEnter="triggerSearch"
          :allowClear="true"
          size="large"
        >
        </a-input-search>
      </div>
      <a-select :getPopupContainer="trigger => trigger.parentElement" size="large" v-model="reviewsScore" @change="triggerChangeRate">
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
            <a-rate :value="myReviews.reviewsScore" allow-half disabled/>
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
          <a-space class="content-detail__edit">
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
                <a-rate :value="item.reviewsScore" allow-half disabled/>
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
const { ReviewsTaskSave, ReviewsTaskList, ReviewsTaskMyReview, ReviewsTaskDelete } = require('@/api/reviewsTask')
export default {
  name: 'ReviewsPreview',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      loading: false,
      delLoading: false,
      subLoading: false,
      isEdit: false,
      myReviews: null,
      reviewsList: [],
      reviewsNotes: '',
      reviewsScore: '',
      reviewsText: ['Easy', 'Intermediate', 'Difficult'],
      subForm: {
        'reviewsLabel': 1,
        'reviewsNotes': '',
        'reviewsScore': 1
      },
      pagination: {
        onChange: page => {
          this.pageNo = page
          this.loadReviewList()
        },
        showTotal: total => `Total ${total} items`,
        total: 0,
        pageSize: 10
      },
      pageNo: 1,
      mockData: {
        reviewsLabel: 1,
        reviewsNotes: '123213123',
        reviewsScore: 1,
        createBy: 'jacob',
        id: 123213213,
        createTime: '123123'
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData() {
      this.loadMyReview()
      this.loadReviewList()
    },

    loadMyReview() {
      ReviewsTaskMyReview({
        taskId: this.id
      }).then(res => {
        if (res.success) {
          this.myReviews = res.result
          // this.myReviews = this.mockData
          if (this.myReviews) {
            this.subForm.reviewsLabel = this.myReviews.reviewsLabel
            this.subForm.reviewsNotes = this.myReviews.reviewsNotes
            this.subForm.reviewsScore = this.myReviews.reviewsScore
          }
        }
      })
    },

    loadReviewList() {
      this.loading = true
      ReviewsTaskList({
        reviewsNotes: this.reviewsNotes,
        reviewsScore: this.reviewsScore,
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize,
        taskId: this.id,
        excludeSelf: 1
      }).then(res => {
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
    },

    handleDelMyReview () {
      if (!this.myReviews) return
      this.$confirm({
        title: 'Confirm delete',
        content: 'Are you sure to delete your review ?',
        centered: true,
        onOk: () => {
          this.delLoading = true
          ReviewsTaskDelete({ id: this.myReviews.id }).then((response) => {
            this.$logger.info('del response', response)
            if (response.success) {
              this.$message.success('Del successfully')
              this.myReviews = null
            }
          }).finally(() => {
            this.delLoading = false
          })
        }
      })
    },

    handleSaveMyReview () {
      if (!this.myReviews) return
      this.subLoading = true
      ReviewsTaskSave({
        taskId: this.id,
        id: this.myReviews.id,
        ...this.subForm
      }).then((res) => {
        if (res.success) {
          this.$message.success('Save successfully')
          this.myReviews = { ...this.myReviews, ...this.subForm }
          this.isEdit = false
          // 当前页如果有自己的评价，需要更新
          let meFromPage = this.reviewsList.find(item => item.id === this.myReviews.id)
          if (meFromPage) {
            meFromPage = { ...meFromPage, ...this.subForm }
          }
        }
      }).finally(() => {
        this.subLoading = false
      })
    },

    triggerEdit(val) {
      this.isEdit = val
      this.$nextTick(() => {
        val && this.$refs.reviewsNotes && this.$refs.reviewsNotes.focus()
      })
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
      /deep/ .ant-input{
        border-radius:6px;
        height: 40px;
      }
    }
    /deep/ .ant-select-dropdown {
      z-index: 1001;
    }
  }
  .reviews-edit {
    position: relative;
    margin-bottom: 20px;
    .reviews-edit__check {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      padding: 10px;
      border: 1px solid #d9d9d9;
      border-bottom: none;
      div {
        label {
          margin-right: 5px;
        }
      }
    }
    // .reviews-edit__text {
    //   textarea {
    //     border: none;
    //   }
    // }
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
        font-size: 18px;
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
