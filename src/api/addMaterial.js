import lessonAPIRequest from '@/utils/lessonAPIRequest'

export const addMaterialUrl = {
  'addBatchElements': '/classroom/api/v2/classroom/elements/addBatch'
}

export function addBatchElements (parameter) {
  return lessonAPIRequest({
    url: addMaterialUrl.addBatchElements,
    method: 'post',
    data: parameter
  })
}
