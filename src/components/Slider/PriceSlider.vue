<template>
  <div class="price-slider">
    <a-slider
      :marks="marks"
      :min="min"
      :max="max"
      :default-value="current"
      :disabled="disabled" />
    <div class="slider-label">
      <div class="slider-label-item" :style="{left: item.left, width: item.width}" v-for="(item, index) in lines" :key="'line_' + index">{{ item.label }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PriceSlider',
  props: {
    current: {
      type: [Number],
      default: 32
    },
    priceList: {
      type: Array,
      default: () => [{
        value: 1,
        price: 10
      }, {
        value: 10,
        price: 8
      }, {
        value: 50,
        price: 5
      }]
    }
  },
  data() {
    return {
      PREFIX: ' per',
      datas: this.priceList.map(item => {
        return {
          value: item.value || item.registeredNum,
          price: item.price
        }
      }),
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
      const result = {}
      values.forEach((val, index) => {
      //  if (index === 0 && val > this.min) {
      //    result[this.min] = this.min + PREFIX
      //  }
      //  if (index === values.length - 1 && val < this.max) {
      //    result[this.max] = this.max + PREFIX
      //  }
       result[val] = val + this.PREFIX
      })
      return result
    },
    lines() {
      const labels = this.datas.map(item => item.price)
      const prepare = this.datas.concat([{
        value: this.max
      }])
      const result = []
      let needCurrent = true
      for (let index = 1; index < prepare.length; index++) {
        // const value = prepare[index].value - prepare[index - 1].value
        // const width = (value / (this.max - this.min)) * 100 + '%'
        const left = ((prepare[index - 1].value - this.min) / (this.max - this.min)) * 100 + '%'
        result.push({
          width: '25px',
          left: left,
          label: '$' + labels[index - 1]
        })
        if (this.current === prepare[index].value || this.current === prepare[index - 1].value) {
          needCurrent = false
        }
      }
      if (this.current && this.current > 0 && needCurrent) {
        const left = ((this.current - this.min) / (this.max - this.min)) * 100 + '%'
        result.push({
          left: `calc(${left} - 25px)`,
          width: 'auto',
          label: this.current + this.PREFIX
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
    width: calc(100% - 12.5px);
    position: absolute;
    top: 0;
    left: 1.75px;
    height: 1px;
    .slider-label-item {
      // text-align: center;
      color: #005B94;
      font-weight: bold;
      font-size: 11px;
      font-style: italic;
      width: 25px;
      text-align: center;
      position: absolute;
    }
  }
  /deep/ .ant-slider {
    height: 18px;
    .ant-slider-rail {
      height: 12px;
      background-color: #E9ECEE!important;
    }
    .ant-slider-dot {
      width: 25px;
      height: 25px;
      background-color: #E9ECEE!important;
      border-color: transparent!important;
    }
    .ant-slider-dot-active {
      background-color: #8FCBF6!important;
    }
    .ant-slider-track {
      height: 12px;
    }
    .ant-slider-step {
      top: 0
    }
    .ant-slider-mark {
      top: 18px;
    }
    .ant-slider-handle {
      width: 20px;
      height: 20px;
      display: none;
    }
    // .ant-slider-disabled {
       .ant-slider-track {
         background-color: #8FCBF6!important;
       }
    // }
  }
}
</style>
