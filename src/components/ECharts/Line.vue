<template>
  <div class="chartGraph" :style="{height: height}">
    <v-chart :option="options" :autoresize="true" />
  </div>
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { ChartToolMixins } from './mixins/ChartToolMixins'

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])
export default {
  name: 'ELine',
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
      immediate: true
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
      const xAxis = []
      const series = []
      const that = this
      for (let index = 0; index < datas.length; index++) {
        const data = datas[index]
        if (index === 0) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].date) {
              xAxis.push(data[i].date)
            }
          }
        }
        const seriesData = []
        for (let i = 0; i < data.length; i++) {
          if (typeof data[i].value !== 'undefined') {
            seriesData.push(data[i].value)
          }
        }
        series.push({
          data: seriesData,
          symbol: 'circle',
          symbolSize: '6',
          showSymbol: false,
          smooth: true,
          type: 'line',
          areaStyle: {
            normal: {
              color: this.color[index]
            }
          }
        })
      }
      this.options = {
        color: this.color,
        grid: {
          left: '0',
          bottom: '0',
          top: '0',
          right: '0'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          show: false,
          data: xAxis
        },
        yAxis: {
          type: 'value',
          show: false
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#f2f2f2',
          borderColor: '#dfdfdf',
          borderWidth: 1,
          textStyle: {
            color: '#333',
            fontFamily: 'Open Sans'
          },
          extraCssText: 'text-align:left;',
          formatter: function(params) {
            if (params.length < 2) {
              return (
                '<p><span style="color:#999;">' +
                params[0].name +
                '</span></p><p><b>' +
                that.formatNum(params[0].value, 0) +
                '</b></p>'
              )
            } else {
              return (
                '<p><span style="color:#999;">' +
                params[0].name +
                '</span></p><p><b>' +
                that.formatNum(params[0].value, 0) +
                '</b> vs <b>' +
                that.formatNum(params[1].value, 0) +
                '</b></p>'
              )
            }
          }
        },
        series: series
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
