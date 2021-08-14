import request from '@/utils/request'

export const noticeAPIUrl = {
  listCementByUser: '/classcipe/sys/annountCement/listByUser',
  editCementSend: '/classcipe/sys/sysAnnouncementSend/editByAnntIdAndUserId',
  NoticeQueryById: '/classcipe/sys/annountCement/queryById'
}

export function EditCementSend (parameter) {
  return request({
    url: noticeAPIUrl.editCementSend,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function ListCementByUser (parameter) {
  return request({
    url: noticeAPIUrl.listCementByUser,
    method: 'get',
    params: parameter
  })
}

export function NoticeQueryById (parameter) {
  return request({
    url: noticeAPIUrl.queryById,
    method: 'get',
    params: parameter
  })
}
