import request from '@/utils/request'

const BASE_PATH = 'statistics'

export const statisticsAPIUrl = {
  dashboard: `/classcipe/api/${BASE_PATH}/dashboard`
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
