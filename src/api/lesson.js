import lessonAPIRequest from '@/utils/lessonAPIRequest'

export const lessonAPIUrl = {
  GetMyClasses: '/class/get_my_classes',
  TurnOnStudentPaced: '/class/turn_on_student_paced',
  EndSession: '/class/end_session',
  ReopenSession: '/class/reopen_session',
  NameSession: '/class/name_session'
}

export function getMyClasses (parameter) {
  return lessonAPIRequest({
    url: lessonAPIUrl.GetMyClasses,
    method: 'post',
    data: parameter
  })
}

export function turnOnStudentPaced (parameter) {
  return lessonAPIRequest({
    url: lessonAPIUrl.TurnOnStudentPaced,
    method: 'post',
    data: parameter
  })
}

export function endSession (parameter) {
  return lessonAPIRequest({
    url: lessonAPIUrl.EndSession,
    method: 'post',
    data: parameter
  })
}

export function reopenSession (parameter) {
  return lessonAPIRequest({
    url: lessonAPIUrl.ReopenSession,
    method: 'post',
    data: parameter
  })
}

export function nameSession (parameter) {
  return lessonAPIRequest({
    url: lessonAPIUrl.NameSession,
    method: 'post',
    data: parameter
  })
}
