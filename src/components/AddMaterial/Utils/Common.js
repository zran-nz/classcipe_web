import axios from 'axios'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
// import { upAwsS3File } from '@/components/AddMaterial/Utils/AwsS3'
import * as logger from '@/utils/logger'
import { addFileUploadRecord } from '@/api/material'

// 下载服务器图片
export const uploadImageToAwsByUrl = async (userId, url, options) => {
  return new Promise((resolve, reject) => {
    downloadImageBlob(url).then(({ data }) => {
      logger.info('downloadImageBlob', data, 'options', options)
      const {
        result,
        success
      } = data
      if (success && result) {
        if (options?.contentType && options?.contentId) {
          addFileUploadRecord({
            fileLength: 1024,
            fileName: `google_image_${Math.random().toString(36).slice(2)}`,
            filePath: result,
            contentType: options?.contentType,
            contentId: options?.contentId
          }).then(res => {
            logger.info('addFileUploadRecord res', res)
          }).finally(() => {
            resolve(result)
          })
        } else {
          resolve(result)
        }
      } else {
        reject(new Error('error'))
        // tryDownloadByClient(userId, url, resolve, reject, options)
      }
    }).catch(() => {
      reject(new Error('error'))
      // tryDownloadByClient(userId, url, resolve, reject, options)
    })
  })
}

// 上传图片到后台
export const downloadImageBlob = async (imageUrl, contentType, contentId) => {
  return axios.post(process.env.VUE_APP_API_BASE_URL + `/classcipe/common/downloadImage`, `imageUrl=${imageUrl}&returnUrl=true`, {
    headers: {
      'X-Access-Token': storage.get(ACCESS_TOKEN),
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
}

// const tryDownloadByClient = async (userId, url, resolve, reject, options) => {
//   logger.info('tryDownloadByClient', userId, url)
//   if (url.indexOf('https') > -1) {
//     // 本地下载 只处理https
//     const image = new Image()

//     image.crossOrigin = 'Anonymous'
//     image.src = url

//     image.addEventListener('load', () => null)
//     const xhr = new XMLHttpRequest()
//     xhr.open('GET', url)
//     xhr.resolveponseType = 'arraybuffer'
//     xhr.onload = () => {
//       const imageType = xhr.getResponseHeader('Content-Type') || 'image/png'
//       const blob = new Blob([xhr.response], { type: imageType })
//       const file = new File([blob], `drivefile_${Date.now()}`, {
//         type: imageType
//       })
//       const formData = new FormData()
//       formData.append('file', file)
//       upAwsS3File(
//         userId,
//         file,
//         () => null,
//         (result) => {
//           resolve(result)
//         },
//         true,
//         options?.contentType,
//         options?.contentId
//       )
//     }
//     xhr.onerror = () => {
//       logger.info('下载图片失败')
//       reject()
//     }
//     xhr.ontimeout = () => {
//       logger.info('下载图片超时')
//       reject()
//     }
//     xhr.onabort = () => {
//       logger.info('下载图片取消')
//       reject()
//     }
//     xhr.send()
//   } else {
//     reject()
//   }
// }
