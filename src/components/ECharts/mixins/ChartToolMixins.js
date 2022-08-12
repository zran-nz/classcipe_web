export const ChartToolMixins = {
  methods: {
    formatNum(val, format) {
      return this.$options.filters['percentFormat'](val, format)
    }
  }
}
