import lessonAPIRequest from '@/utils/lessonAPIRequest'

export const addMaterialUrl = {
  addBatchElements: '/classroom/api/v2/classroom/elements/addBatch',
  queryElementById: 'classroom/api/v2/classroom/elements/queryByPageId',
  updateElement: 'slide/elements/update',
  addElement: 'slide/elements/add'
}

export function addBatchElements(parameter) {
  return lessonAPIRequest({
    url: addMaterialUrl.addBatchElements,
    method: 'post',
    data: parameter
  })
}

export function updateElement(parameter) {
  return lessonAPIRequest({
    url: addMaterialUrl.updateElement,
    method: 'post',
    data: parameter
  })
}

export function queryElementById(parameter) {
  return lessonAPIRequest({
    url: addMaterialUrl.queryElementById,
    method: 'post',
    data: parameter
  })
}

export function addElement(parameter) {
  return lessonAPIRequest({
    url: addMaterialUrl.addElement,
    method: 'post',
    data: parameter
  })
}
