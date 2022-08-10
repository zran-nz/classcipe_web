<template>
  <div class='content-grade-stat vertical-between'>
    <div class='stat-item'>
      <div class='state-title'>
        Ratings
      </div>
      <div class='stat-card'>
        <v-chart ref="chart" :option="option" :autoresize="true" />
      </div>
    </div>
    <div class='stat-item'>
      <div class='state-title'>
        Grades used with
      </div>
      <div class='stat-card'>

      </div>
    </div>
  </div>
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  ToolboxComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { ChartToolMixins } from '@/components/ECharts/mixins/ChartToolMixins'

use([
  CanvasRenderer,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GridComponent,
  ToolboxComponent
])
export default {
  name: 'ContentGradeStat',
  mixins: [ChartToolMixins],
  components: {
    'v-chart': VChart
  },
  data () {
    return {
      option: {
        title: {
          text: 'Rating'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['1 star', '2 star', '3 star', '4 star', '5 star']
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            data: [855, 23489, 29034, 104970, 131744, 630230]
          }
        ]
      }
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
.content-grade-stat {

}
</style>
