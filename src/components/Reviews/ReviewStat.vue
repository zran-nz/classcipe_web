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
    <a-rate :default-value="5" disabled class='cc-rate'/>
  </a-popover>
</template>

<script>
import { getReviewsStatByContentId } from '@/api/reviewsTask'
import { getStatByContentId } from '@/api/contentGrade'

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
      charts: []
    }
  },
  created() {
    this.initData()
    this.handleInit = debounce(this.initData, 300)
  },
  methods: {
    initData() {
      this.loading = true
      Promise.all([
        getReviewsStatByContentId({
          contentId: this.id
        }),
        getStatByContentId({
          contentId: this.id
        })
      ]).then(([reviewRes, statRes]) => {
        if (reviewRes.code === 0) {
          this.reviews = reviewRes.result
          this.reviews = [
            { 'reviewsScore': 1, 'reviewsScoreCount': 0, 'reviewsScoreRate': 0.0 },
            { 'reviewsScore': 2, 'reviewsScoreCount': 0, 'reviewsScoreRate': 0.0 },
            { 'reviewsScore': 3, 'reviewsScoreCount': 0, 'reviewsScoreRate': 0.0 },
            { 'reviewsScore': 4, 'reviewsScoreCount': 0, 'reviewsScoreRate': 0.0 },
            { 'reviewsScore': 5, 'reviewsScoreCount': 0, 'reviewsScoreRate': 0.0 }
          ]
        }
        if (statRes.code === 0) {
          this.charts = statRes.result
          this.charts = []
        }
      }).finally(() => {
        this.loading = false
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
