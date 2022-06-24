
export const CommonFilterMixin = {
  data () {
    return {
      queryParams: {
        activityTags: [],
        age: [],
        category: this.category,
        faSaActivityType: null,
        projectBased: null,
        faTags: [],
        saTags: [],
        subject: [],
        types: [],
        schoolId: this.currentSchool?.id,
        searchKey: ''
      }
    }
  },
  methods: {
    handleUpdateFilter(filter) {
      this.$logger.info('handleUpdateFilter', filter)
      Object.keys(filter).forEach(key => {
        this.queryParams[key] = filter[key]
      })
      if (this.loadMyContent) {
        this.loadMyContent()
      } else {
        this.$logger.warn('loadMyContent not found for filter', this)
      }
    }
  }
}
