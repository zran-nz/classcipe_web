import request from '@/utils/request'

export const materialAPIUrl = {
  MaterialAddOrUpdate: '/classcipe/api/material/addOrUpdate',
  MaterialQueryById: '/classcipe/api/material/queryById',
  MaterialDelete: '/classcipe/api/material/delete',
  MaterialDeleteBatch: '/classcipe/api/material/deleteBatch',
  MaterialList: '/classcipe/api/material/list',
  YoutubeQueryByKeywords: '/classcipe/api/youtube/queryByKeywords',
  FileRecord: '/classcipe/api/fileUploadRecord/list'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function MaterialAddOrUpdate(parameter) {
  return request({
    url: materialAPIUrl.MaterialAddOrUpdate,
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
export function MaterialQueryById(parameter) {
  return request({
    url: materialAPIUrl.MaterialQueryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function MaterialDelete(parameter) {
  return request({
    url: materialAPIUrl.MaterialDelete,
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
export function MaterialDeleteBatch(parameter) {
  return request({
    url: materialAPIUrl.MaterialDeleteBatch,
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
export function MaterialList(parameter) {
  return request({
    url: materialAPIUrl.MaterialList,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function YoutubeQueryByKeywords(parameter) {
  return request({
    url: materialAPIUrl.YoutubeQueryByKeywords,
    method: 'get',
    params: parameter
  })
}

export function FileRecord(parameter) {
  return request({
    url: materialAPIUrl.FileRecord,
    method: 'get',
    params: parameter
  })
}
