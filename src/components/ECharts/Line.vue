<template>
  <div class="chartGraph" :style="{height: height}">
    <v-chart ref="chart" :option="options" :autoresize="true" />
  </div>
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
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
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  GridComponent,
  ToolboxComponent
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
      const seriesData = datas
      if (!seriesData[0] || !seriesData[0].data) {
        return
      }
      const xAxis = seriesData[0].data.map(item => item.date)
      const that = this
      const toolbox = {
        feature: {
          saveAsImage: {}
        }
      }
      let dataZoom = null
      let bottom = '20'
      if (xAxis.length > 30) {
        toolbox.feature = {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
        dataZoom = [
          // {
          //   type: 'inside',
          //   start: 0,
          //   end: 10
          // },
          {
            start: 0,
            end: 10
          }
        ]
        bottom = '100'
      }
      this.options = {
        color: this.color,
        grid: {
          left: '50',
          bottom: bottom,
          top: '20',
          right: '50'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%']
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
        series: seriesData
      }
      this.options.toolbox = toolbox
      if (dataZoom) {
        this.options.dataZoom = dataZoom
      }
      // toolbox datazoom变了在触发 TODO
      this.$nextTick(() => {
        this.$refs.chart && this.$refs.chart.dispatchAction({
            type: 'restore'
        })
      })
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
