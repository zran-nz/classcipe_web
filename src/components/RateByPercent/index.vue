<template>
  <div class="rate-percent-con" ref="ratePercentCon">
    <div class="rate-percent-wrap">
      <div class="rate-percent__sum" ref="ratePercentSum">
        <div class="sum-title">4.0</div>
        <div class="sum-desc">
          <a-rate :defaultValue="4"></a-rate>
        </div>
      </div>
      <div class="rate-percent__detail" direction="vertical">
        <a-space align="center" class="detail-bar" v-for="(item, index) in percents" :key="'percent_'+index">
          <a-progress :style="{width: progressWidth}" strokeLinecap="square" strokeColor="#FFBB00" :percent="item.value" :showInfo="false"/>
          <a-rate :defaultValue="5-index" disabled></a-rate>
          <span>{{ item.value }}%</span>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script>
  import './index.less'
  export default {
    name: 'RateByPercent',
    data() {
      return {
        percents: [{
            value: 50
          }, {
            value: 40
          }, {
            value: 30
          }, {
            value: 20
          }, {
            value: 10
        }],
        progressWidth: '135px'
      }
    },
    mounted() {
      const conWidth = this.$refs.ratePercentCon.getBoundingClientRect().width
      const sumWidth = this.$refs.ratePercentSum.getBoundingClientRect().width
      this.progressWidth = (conWidth - 40 - sumWidth - 45 - 200) + 'px'
    }
  }
</script>
