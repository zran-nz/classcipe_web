import lessonAPIRequest from '@/utils/lessonAPIRequest'

export const lessonAPIUrl = {
  GetMyClasses: '/class/get_my_classes',
  TurnOnStudentPaced: '/class/turn_on_student_paced',
  EndSession: '/class/end_session',
  ReopenSession: '/class/reopen_session',
  NameSession: '/class/name_session',
  StartLesson: '/slide/start_lesson',
  GetStudents: '/class/get_students',
  GetStudentResponse: '/class/get_student_response',
  SlideGetAll: '/slide/get_all'
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

export function StartLesson (parameter) {
  return lessonAPIRequest({
    url: lessonAPIUrl.StartLesson,
    method: 'post',
    data: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function GetStudents (parameter) {
  return lessonAPIRequest({
    url: lessonAPIUrl.GetStudents,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function GetStudentResponse (parameter) {
  return lessonAPIRequest({
    url: lessonAPIUrl.GetStudentResponse,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
