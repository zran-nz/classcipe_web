import moment from 'moment'

export const DATERANGE_FOR_CHARTS = {
  'Today': [moment().startOf('day'), moment().endOf('day')],
  // 'Yesterday': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
  'This week': [moment().startOf('isoWeek').startOf('day'), moment().endOf('day')],
  'This month': [moment().startOf('month').startOf('day'), moment().endOf('day')],
  'This quarter': [moment().startOf('quarter').startOf('day'), moment().endOf('day')],
  'This year': [moment().startOf('year').startOf('day'), moment().endOf('day')],
  'All Time': [moment('2013-01-01').startOf('day'), moment().endOf('day')]
}
