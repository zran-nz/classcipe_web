export const TableWidthMixin = {
  data() {
    return {
      tableRefs: [],
      leftWidth: 0,
      firstColumnWid: 0
    }
  },
  mounted() {
    this.firstColumnWid = this.columns[0].width
    this.resetTableWidth(200)
    window.addEventListener('resize', this.resetTableWidth, true)
  },
  destroyed() {
    window.removeEventListener('resize', this.resetTableWidth)
  },
  methods: {
    resetTableWidth(init) {
      if (this.tableRefs && this.tableRefs.length > 0) {
        this.tableRefs.forEach(tableRef => {
          if (this.$refs[tableRef] && this.columns) {
            const totalWidth = this.columns.map(item => {
              if (item.width && item.width !== 'auto') {
                return parseInt(item.width)
              } else {
                return parseInt(this.firstColumnWid)
              }
            }).reduce((prev, current) => {
              return prev + current
            }, 0)

            const conWidth = (this.$refs[tableRef].$el || this.$refs[tableRef]).getBoundingClientRect().width
            console.log(conWidth, totalWidth, this.leftWidth)
            if (conWidth > totalWidth + this.leftWidth + init) {
              this.columns[0].width = 'auto'
              this.scroll = {
                x: conWidth
              }
            } else {
              this.columns[0].width = this.firstColumnWid
              this.scroll = {
                x: totalWidth
              }
              this.columns[this.columns.length - 1].fixed = 'right'
            }
          }
        })
        this.$forceUpdate()
      }
    }
  }
}
