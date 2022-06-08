export const ReSetFontMixin = {
  data() {
    return {
      fontSize: '16px',
      fixHtmlWidth: 0,
      radioSwitchShow: false
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeFn, false)
    this.resizeFn()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFn)
  },
  methods: {
    resizeFn () {
      this.radioSwitchShow = false
      var docElem = document.documentElement
      var htmlWidth = docElem.getBoundingClientRect().width
      // if (htmlWidth > 1024) htmlWidth = 480
      console.log(this.fixHtmlWidth)
      if (this.fixHtmlWidth > 0) {
        htmlWidth = this.fixHtmlWidth
      }
      const em = htmlWidth / 16
      this.fontSize = em + 'px'
      this.radioSwitchShow = true
    }
  }
}
