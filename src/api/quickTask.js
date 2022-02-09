import request from '@/utils/request'

export const quickTaskAPIUrl = {
  filterNewPromptTemplates: '/classcipe/api/quickTask/filterNewPromptTemplates',
  chooseAnother: '/classcipe/api/quickTask/chooseAnother',
  quickStartSession: '/classcipe/api/quickTask/quickStartSession'
}

export function filterNewPromptTemplates (parameter) {
  return request({
    url: quickTaskAPIUrl.filterNewPromptTemplates,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function chooseAnother (parameter) {
  return request({
    url: quickTaskAPIUrl.chooseAnother,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function quickStartSession (parameter) {
  return request({
    url: quickTaskAPIUrl.quickStartSession,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
