import request from '@/utils/request'

const API_PREFIX = 'calendarSchedule'

export const calendarScheduleApi = {
  QueryForCalendar: `/classcipe/api2/${API_PREFIX}/queryForCalendar`
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function QueryForCalendar (parameter) {
  return request({
    url: calendarScheduleApi.QueryForCalendar,
    method: 'get',
    params: parameter
  })
}
