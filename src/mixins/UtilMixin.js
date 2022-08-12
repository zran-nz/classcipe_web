import * as logger from '@/utils/logger'
import { typeMap } from '@/const/teacher'
import moment from 'moment'

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
          str += ((week > 1) ? week + ' weeks ' : week + ' week ')
        }
        if (day > 0) {
          str += ((day > 1) ? day + ' days ' : day + ' day ')
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
    },
    handleOpenItem (item) {
      item.type = this.type
      logger.info('handleEditItem', item)
      if (item.type === typeMap['unit-plan']) {
        window.open('/teacher/unit-plan-redirect/' + item.id
          , '_blank')
      } else if (item.type === typeMap.task) {
        window.open('/teacher/task-redirect/' + item.id
          , '_blank')
      } else if (item.type === typeMap.evaluation) {
        window.open('/teacher/evaluation-redirect/' + item.id
          , '_blank')
      }
    },
    handleLocationItem (item) {
      logger.info('handleEditItem', item)
      if (item.type === typeMap['unit-plan']) {
        window.location.href = '/teacher/unit-plan-redirect/' + item.id
      } else if (item.type === typeMap.task) {
        window.location.href = '/teacher/task-redirect/' + item.id
      } else if (item.type === typeMap.evaluation) {
        window.location.href = '/teacher/evaluation-redirect/' + item.id
      }
    },

    getWeekByDate (startDate, endDate) {
      this.$logger.info('getWeekByDate', startDate, endDate)
      if (startDate && endDate) {
        let str = ''
        const diffDays = moment(endDate).diff(moment(startDate), 'days')
        this.$logger.info('diffDays', diffDays)
        const week = Math.floor(Math.abs(diffDays / 7))
        const day = Math.ceil(Math.abs(diffDays % 7))
        if (week > 0) {
          str += ((week > 1) ? week + ' weeks ' : week + ' week ')
        }
        if (day > 0) {
          str += ((day > 1) ? day + ' days ' : day + ' day ')
        }
        this.$logger.info('getWeekByDate str', str)
        return str
      } else {
        return ''
      }
    }
  }

}
