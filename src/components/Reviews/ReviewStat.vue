<template>
  <a-popover placement="bottom">
    <template slot="content">
      <div class="review-stat">
        <!-- <div class="review-stat-title">
          Ratings
        </div> -->
        <div class="review-stat-content">
          <div class="review-stat-overall">
            <div class="content-title">
              Ratings
            </div>
            <!-- <div> -->
            <a-space align="center" class="detail-bar" v-for="(item, index) in reviews" :key="'percent_'+index">
              <span>{{ item.reviewsScore }} star(s)</span>
              <a-progress :style="{width: progressWidth}" strokeLinecap="square" strokeColor="#FFBB00" :percent="item.reviewsScoreRate" :showInfo="false"/>
              <span>{{ item.reviewsScoreCount | NumberFormat }}</span>
            </a-space>
            <!-- </div> -->
          </div>
          <div class="review-stat-chart">
            <div class="content-title">
              Ages used with
            </div>
            <e-bar :datas="charts"/>
          </div>
        </div>
        <div class="divider"></div>
        <div class="review-stat-opt">
          <a-button @click="goAll" type="link">See all 5 reviews</a-button>
        </div>
      </div>
    </template>
    <!-- TODO 学生老师 -->
    <a-rate :value="reviewsStats.overall" allow-half disabled/>
  </a-popover>
</template>

<script>
import { byOverall, ReviewsTeacherStats } from '@/api/reviewsTeacher'
import { getStatByContentId } from '@/api/contentGrade'
import * as ReviewsTask from '@/api/reviewsTask'

import EBar from '@/components/ECharts/Bar'

import { debounce } from 'lodash-es'
export default {
  name: 'ReviewStat',
  components: {
    EBar
  },
  props: {
    contentId: {
      type: [String, Number],
      required: true
    }
  },
  watch: {
    contentId(val) {
      this.id = val
      this.handleInit()
    }
  },
  data() {
    return {
      loading: false,
      id: this.contentId,
      progressWidth: '80px',
      reviews: [],
      charts: [],
      reviewsStats: {
        avgReviewsScore: 0,
        reviewsScoreStatDetail: [],

        reviewsCount: 0,
        effectiveness: 0,
        overall: 0,
        quality: 0,
        studentsEngagement: 0
      }
    }
  },
  created() {
    this.initData()
    this.loadReviewStats()
    this.handleInit = debounce(this.initData, 300)
  },
  methods: {
    initData() {
      this.loading = true
      Promise.all([
        byOverall({
          purchasesId: this.id
        }),
        getStatByContentId({
          contentId: this.id
        })
      ]).then(([reviewRes, statRes]) => {
        if (reviewRes.code === 0 && reviewRes.result) {
          const stars = [5, 4, 3, 2, 1]
          const total = Object.values(reviewRes.result).reduce((prev, next) => {
            return prev + next ? next : 0
          }, 0)
          this.reviews = stars.map(item => {
            return {
              reviewsScore: item,
              reviewsScoreCount: reviewRes.result[item] || 0,
              reviewsScoreRate: total ? (reviewRes.result[item] || 0) / total * 100 : 0
            }
          })
        }
        if (statRes.code === 0 && statRes.result) {
          const charts = []
          for (let i = 3; i < 19; i++) {
            charts.push({
              label: i,
              value: statRes.result[i] || 0
            })
          }
          this.charts = {
            title: 'Age',
            data: charts
          }
        }
      }).finally(() => {
        this.loading = false
      })
    },
    loadReviewStats () {
      let promise = null
      if (this.currentRole === 'student') {
        promise = ReviewsTask.ReviewsTaskStats
      } else {
        promise = ReviewsTeacherStats
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
    goAll() {
      document.querySelector('.ant-popover').style.display = 'none'
      this.$emit('goReviews')
    }
  }
}
</script>

<style scoped lang="less">
.review-stat {
  width: 600px;
  padding: 10px;
  .review-stat-title {
    font-size: 16px;
    font-weight: bold;
  }
  .review-stat-content {
    display: flex;
    justify-content: space-between;
    .content-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .review-stat-overall {
      display: flex;
      flex-direction: column;
      margin-right: 10px;
      min-width: 200px;
      .detail-bar {
        line-height: 25px;
      }
      span {
        font-size: 14px;
        line-height: 1;
      }
    }
    .review-stat-chart {
      flex: 1;
    }
  }
  .divider {
    height: 1px;
    background: #dfdfdf;
    margin: 15px -20px;
  }
  .review-stat-opt {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
