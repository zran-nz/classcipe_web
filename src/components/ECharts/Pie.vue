<template>
  <div class="chartGraph" :style="{height: height}">
    <v-chart :option="options" :autoresize="true" />
  </div>
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { ChartToolMixins } from './mixins/ChartToolMixins'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

export default {
  name: 'EPie',
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
    title: {
      type: Object,
      default: () => {
        return {
          show: false
        }
      }
    },
    datas: {
      type: Array,
      default: () => []
    },
    radius: {
      type: Array,
      default: () => ['0%', '100%']
    },
    labelSeries: {
      type: Object,
      default: () => {
        return {
          show: false
        }
      }
    }
  },
  watch: {
    datas: {
      handler(newName, oldName) {
        this.initData(newName)
      },
      immediate: true
    },
    '$i18n.locale'() {
      this.initData(this.datas)
    }
  },
  components: {
    'v-chart': VChart
  },
  mounted() {
    if (this.datas && this.datas.length > 0) {
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
      const that = this
      this.options = {
        title: that.title,
        color: this.color,
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return (
              '<p><b>' +
              params.name +
              '</b></p><p>' +
              // params.data.percent.toFixed(2) +
              that.formatNum(params.data.value, 0) +
              '</p>'
            )
          },
          backgroundColor: '#f2f2f2',
          borderColor: '#dfdfdf',
          borderWidth: 1,
          textStyle: {
            fontSize: 10,
            color: '#333'
          },
          extraCssText: 'text-align:left;'
        },
        legend: {
          show: false
        },
        series: [
          {
            name: 'PieChart',
            type: 'pie',
            cursor: 'default',
            radius: that.radius,
            hoverAnimation: false,
            avoidLabelOverlap: false,
            selectedOffset: 5,
            label: that.labelSeries,
            data: seriesData
          }
        ]
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
