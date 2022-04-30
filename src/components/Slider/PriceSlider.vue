<template>
  <div class="price-slider">
    <a-slider
      :marks="marks"
      :min="min"
      :max="max"
      :default-value="32"
      :disabled="disabled" />
    <div class="slider-label">
      <div class="slider-label-item" :style="{width: item.width}" v-for="(item, index) in lines" :key="'line_' + index"> {{ item.label }} </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PriceSlider',
  props: {

  },
  data() {
    return {
      datas: [{
        value: 1,
        price: 10
      }, {
        value: 10,
        price: 8
      }, {
        value: 50,
        price: 5
      }],
      result: null,
      min: 1,
      disabled: true
    }
  },
  computed: {
    max() {
      const values = this.datas.map(item => item.value)
      const max = Math.max(...values)
      return Math.max(...values) + Math.floor(max / this.datas.length)
    },
    marks() {
      const values = this.datas.map(item => item.value).sort()
      const PREFIX = ' per'
      const result = {}
      values.forEach((val, index) => {
      //  if (index === 0 && val > this.min) {
      //    result[this.min] = this.min + PREFIX
      //  }
      //  if (index === values.length - 1 && val < this.max) {
      //    result[this.max] = this.max + PREFIX
      //  }
       result[val] = val + PREFIX
      })
      return result
    },
    lines() {
      const labels = this.datas.map(item => item.price)
      const prepare = this.datas.concat([{
        value: this.max
      }])
      const result = []
      for (let index = 1; index < prepare.length; index++) {
        const value = prepare[index].value - prepare[index - 1].value
        const width = (value / (this.max - this.min)) * 100 + '%'
        result.push({
          width: width,
          label: '$' + labels[index - 1]
        })
      }
      return result
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
@import '../index.less';
.price-slider {
  width: 100%;
  position: relative;
  .slider-label {
    display: flex;
    width: 100%;
    position: absolute;
    top: 0;
    height: 1px;
    .slider-label-item {
      text-align: center;
      color: #666;
    }
  }
  /deep/ .ant-slider {
    height: 18px;
    .ant-slider-rail {
      height: 12px;
    }
    .ant-slider-dot {
      width: 14px;
      height: 14px;
    }
    .ant-slider-track {
      height: 12px;
    }
    .ant-slider-handle {
      width: 20px;
      height: 20px;
      // display: none;
    }
  }
}
</style>
