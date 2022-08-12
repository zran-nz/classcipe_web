<template>
  <div class="rate-percent-con" ref="ratePercentCon">
    <div class="rate-percent-wrap">
      <div class="rate-percent__sum" ref="ratePercentSum">
        <div class="sum-title">{{ percents.avgReviewsScore | percentFormat }}</div>
        <div class="sum-desc">
          <a-rate :defaultValue="percents.avgReviewsScore" allow-half disabled></a-rate>
        </div>
      </div>
      <div class="rate-percent__detail" direction="vertical">
        <a-space align="center" class="detail-bar" v-for="(item, index) in percents.reviewsScoreStatDetail.concat().reverse()" :key="'percent_'+index">
          <a-progress :style="{width: progressWidth}" strokeLinecap="square" strokeColor="#FFBB00" :percent="item.reviewsScoreRate" :showInfo="false"/>
          <a-rate :defaultValue="item.reviewsScore" disabled></a-rate>
          <span>{{ item.reviewsScoreRate }}%</span>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script>
  import './index.less'
  export default {
    name: 'RateByPercent',
    props: {
      rates: {
        type: Object,
        default: () => {
          return {
            avgReviewsScore: 0,
            reviewsScoreStatDetail: [
              { 'reviewsScore': 1, 'reviewsScoreCount': 0, 'reviewsScoreRate': 0.0 },
              { 'reviewsScore': 2, 'reviewsScoreCount': 0, 'reviewsScoreRate': 0.0 },
              { 'reviewsScore': 3, 'reviewsScoreCount': 0, 'reviewsScoreRate': 0.0 },
              { 'reviewsScore': 4, 'reviewsScoreCount': 0, 'reviewsScoreRate': 0.0 },
              { 'reviewsScore': 5, 'reviewsScoreCount': 0, 'reviewsScoreRate': 0.0 }
            ]
          }
        }
      }
    },
    watch: {
      rates(val) {
        this.percents = { ...val }
      }
    },
    data() {
      return {
        percents: this.rates,
        progressWidth: '135px'
      }
    },
    mounted() {
      if (this.$refs.ratePercentCon && this.$refs.ratePercentSum) {
        const conWidth = this.$refs.ratePercentCon.getBoundingClientRect().width
        const sumWidth = this.$refs.ratePercentSum.getBoundingClientRect().width
        this.progressWidth = (conWidth - 40 - sumWidth - 45 - 200) + 'px'
      }
    }
  }
</script>
