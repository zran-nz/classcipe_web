<template>
  <v-chart
    :forceFit="true"
    :height="height"
    :data="data"
    padding="auto"
    :scale="scale"
    :onClick="handleClick">
    <v-tooltip :showTitle="false" dataKey="item*percent"/>
    <v-axis/>
    <v-legend dataKey="item"/>
    <v-pie position="percent" :color="['item', color]" :v-style="pieStyle" :label="labelConfig"/>
    <v-coord type="theta" :radius="radius.radius" :innerRadius="radius.innerRadius"/>
    <template v-if="guideData && guideData.length > 0">
      <v-guide
        v-for="(row, index) in guideData"
        :key="index"
        type="text"
        :top="true"
        :position="row.position"
        :content="row.content"
        :v-style="row.style"
      />
    </template>
  </v-chart>
</template>

<script>
  import { ChartEventMixins } from './mixins/ChartMixins'
  const DataSet = require('@antv/data-set')

  export default {
    name: 'Pie',
    mixins: [ChartEventMixins],
    props: {
      title: {
        type: String,
        default: ''
      },
      height: {
        type: Number,
        default: 254
      },
      dataSource: {
        type: Array,
        default: () => [
          { item: '示例一', count: 40 },
          { item: '示例二', count: 21 },
          { item: '示例三', count: 17 },
          { item: '示例四', count: 13 },
          { item: '示例五', count: 9 }
        ]
      },
      labelConfig: {
        type: Array,
        default: () => ['percent', {
          formatter: (val, item) => {
            return item.point.item + ': ' + val
          }
        }]
      },
      radius: {
        type: Object,
        default: () => {
          return {
            radius: 1,
            innerRadius: 0
          }
        }
      },
      guideData: {
        type: Array,
        default: () => []
      },
      color: {
        type: Array,
        default: () => ['#f03132', '#0072bb', '#91191a', '#4d91f9', '#002056', '#f68e54', '#329933', '#3333cc']
      }
    },
    data() {
      return {
        scale: [{
          dataKey: 'percent',
          min: 0,
          formatter: '.0%'
        }],
        pieStyle: {
          stroke: '#fff',
          lineWidth: 1
        }
      }
    },
    computed: {
      data() {
        const dv = new DataSet.View().source(this.dataSource)
        // 计算数据百分比
        dv.transform({
          type: 'percent',
          field: 'count',
          dimension: 'item',
          as: 'percent'
        })
        return dv.rows
      }
    }
  }
</script>
