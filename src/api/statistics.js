import request from '@/utils/request'

const BASE_PATH = 'statistics'

export const statisticsAPIUrl = {
  dashboard: `/classcipe/api/${BASE_PATH}/dashboard`,
  myStatisticsStudent: `/classcipe/api/${BASE_PATH}/myStatistics/student`,
  myStatisticsTeacher: `/classcipe/api/${BASE_PATH}/myStatistics/teacher`
}

export function dashboard (parameter) {
  return request({
    url: statisticsAPIUrl.dashboard,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function myStatisticsStudent (parameter) {
  return request({
    url: statisticsAPIUrl.myStatisticsStudent,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function myStatisticsTeacher (parameter) {
  return request({
    url: statisticsAPIUrl.myStatisticsTeacher,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
