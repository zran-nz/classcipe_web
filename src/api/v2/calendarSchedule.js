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
export async function QueryForCalendar (parameter) {
  const rs = await request({
    url: calendarScheduleApi.QueryForCalendar,
    method: 'get',
    params: parameter
  })
  // Combine new register data
  if (parameter?.workshopStatus?.includes('4')) { // load register data
    // console.log(parameter, rs.result[0], 111111111)
    const start = new Date(new Date(parameter.startDate).getTime()+86400000).toISOString()
    const end = new Date(new Date(parameter.endDate).getTime()-86400000).toISOString()
    const list = await App.service('session').get('dateList', { query: { zone: new Date().getTimezoneOffset(), start, end, school: parameter.schoolIds.split(',') }})
    for (const v of list) {
      v.sessionId = v.sid
      v.schoolId = v.school || '0'
      v.startTime = v.start
      v.endTime = v.end
      v.userAvatar = v.schoolInfo?.logo || v.owner.avatar
      v.userRealName = v.owner.nickname
      v.workshopsStatus = v.status === 'close' ? 2 : 1
      v.title = v.name
      v.cover = v.image
      v.content = {}
      v.sessionInfo = { _id: v._id, school: v.school, id: v.sid, sessionName: v.name, type: 'workshop', isLib: true }
      v.unitPlanInfo = null
      v.workshopsDetailInfo = {
        sessionId: v.sid, sessionStartTime: v.start, sessionEndTime: v.end,
        userAvatar: v.schoolInfo?.logo || v.owner.avatar, userRealName: v.owner.nickname, title: v.name
      }
    }
    rs.result.push(...list)
  }
  return rs
}
