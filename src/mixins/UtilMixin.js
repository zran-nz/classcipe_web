export const UtilMixin = {
  data () {
    return {
      type2Name: {
        1: 'Topic',
        2: 'Unit Plan',
        3: 'Material',
        4: 'Task',
        5: 'Lesson',
        6: 'Evaluation'
      },

      browserDataType: {
        'bigIdea': 'bigIdea',
        'sync': 'sync',
        'curriculum': 'curriculum',
        'subjectSpecificSkill': 'subjectSpecificSkill',
        'centurySkill': 'centurySkill',
        'all21Century': 'all21Century',
        'assessmentType': 'assessmentType',
        'idu': 'idu'
      }
    }
  },
  created () {

  },
  computed: {
    getWeek () {
      if (this.rangeDate.length === 2) {
        let str = ''
        const week = Math.abs(parseInt(this.rangeDate[0].diff(this.rangeDate[1], 'days') / 7))
        const day = Math.abs(this.rangeDate[0].diff(this.rangeDate[1], 'days')) % 7
        if (week > 0) {
          str += (week + ' weeks ')
        }
        if (day > 0) {
          str += (day + ' days')
        }
        return str
      } else {
        return ''
      }
    }
  },
  methods: {

    /**
     * 判断标签值是否在列表中，忽律大小写
     */
    tagIsExist (createTagName, tagSearchList) {
      return tagSearchList.filter(item => item.toLowerCase() === createTagName.toLowerCase()).length > 0
    },
    tagNameIsExist (createTagName, showTagList) {
      return showTagList.filter(item => item.name.toLowerCase() === createTagName.toLowerCase()).length > 0
    }
  }

}
