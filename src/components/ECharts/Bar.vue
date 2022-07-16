<template>
  <div class="chartGraph" :style="{height: height}">
    <v-chart ref="chart" :option="options" :autoresize="true" />
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
import { ChartToolMixins } from './mixins/ChartToolMixins'

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
  name: 'EBar',
  mixins: [ChartToolMixins],
  props: {
    color: {
      type: Array,
      default: () => [
        '#EF4136',
        '#FFBD00',
        '#4484CF',
        '#946EDB',
        '#8D7B7B',
        '#54C7B0',
        '#F47920',
        '#194283',
        '#59C754'
      ]
    },
    height: {
      type: [String, Number],
      default: '100%'
    },
    // [
    //   {
    //     name: 'series',
    //     type: 'line',
    //     data: []
    //   }
    // ]
    datas: {
      type: Array,
      default: () => []
    }
  },
  components: {
    'v-chart': VChart
  },
  watch: {
    datas: {
      handler(newName, oldName) {
        this.initData(newName.concat())
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    if (this.datas.length > 0) {
      this.initData(this.datas)
    }
  },
  data() {
    return {
      options: null
    }
  },
  methods: {
    initData(datas) {
      const that = this
      this.options = {
        color: this.color,
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 20,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['1', '2', '3', '4', '5', '6', '7'],
          axisLabel: {
            textStyle: {
              color: '#999',
              fontSize: 10
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          boundaryGap: true,
          splitLine: {
            show: false
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          cursor: 'default',
          name: 'Age',
          // barWidth: 40,
          showAllSymbol: true,
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'top',
              color: '#333',
              formatter: function(data) {
                return that.formatNum(data.value, 0)
              }
            }
          },
          data: [79, 52, 200, 334, 390, 330, 220]
        }]
      }
    }
  }
}
</script>

<style scoped>
.chartGraph,
.echarts {
  width: 100%;
  height: 100%;
}
</style>
