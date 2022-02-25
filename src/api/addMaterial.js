import lessonAPIRequest from '@/utils/lessonAPIRequest'

export const lessonAPIUrl = {
  fileUpload: '/file/upload'
}

export function fileUpload (parameter) {
  return lessonAPIRequest({
    url: lessonAPIUrl.fileUpload,
    method: 'post',
    data: parameter
  })
}
