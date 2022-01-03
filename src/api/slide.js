import lessonAPIRequest from '@/utils/lessonAPIRequest'

export const lessonAPIUrl = {
  SlideGetAll: '/slide/get_all',
  GetPresentationComments: '/slide/get_presentation_comments',
  GetComments: '/slide/get_comments',
  GetStudentResponse: '/slide/get_student_response'
}

export function SlideGetAll (parameter) {
  return lessonAPIRequest({
    url: lessonAPIUrl.SlideGetAll,
    method: 'post',
    data: parameter
  })
}

export function GetPresentationComments (parameter) {
  return lessonAPIRequest({
    url: lessonAPIUrl.GetPresentationComments,
    method: 'post',
    data: parameter
  })
}

export function GetComments (parameter) {
  return lessonAPIRequest({
    url: lessonAPIUrl.GetComments,
    method: 'post',
    data: parameter
  })
}

export function GetStudentResponse (parameter) {
  return lessonAPIRequest({
    url: lessonAPIUrl.GetStudentResponse,
    method: 'post',
    data: parameter
  })
}
