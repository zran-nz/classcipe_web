import request from '@/utils/request'

export const favoritesAPIUrl = {
  FavoritesAddOrUpdate: '/classcipe/api/favorites/addOrUpdate',
  FavoritesQueryById: '/classcipe/api/favorites/queryById',
  FavoritesDelete: '/classcipe/api/favorites/delete',
  FavoritesDeleteBatch: '/classcipe/api/favorites/deleteBatch',
  FavoritesList: '/classcipe/api/favorites/list',
  FavoritesGetMyFavorites: '/classcipe/api/favorites/getMyFavorites'
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function FavoritesAddOrUpdate (parameter) {
  return request({
    url: favoritesAPIUrl.FavoritesAddOrUpdate,
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
export function FavoritesQueryById (parameter) {
  return request({
    url: favoritesAPIUrl.FavoritesQueryById,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function FavoritesDelete (parameter) {
  return request({
    url: favoritesAPIUrl.FavoritesDelete,
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
export function FavoritesDeleteBatch (parameter) {
  return request({
    url: favoritesAPIUrl.FavoritesDeleteBatch,
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
export function FavoritesList (parameter) {
  return request({
    url: favoritesAPIUrl.FavoritesList,
    method: 'get',
    params: parameter
  })
}

/**
 * @param parameter
 * @returns {AxiosPromise}
 * @constructor
 */
export function FavoritesGetMyFavorites (parameter) {
  return request({
    url: favoritesAPIUrl.FavoritesGetMyFavorites,
    method: 'get',
    params: parameter
  })
}
