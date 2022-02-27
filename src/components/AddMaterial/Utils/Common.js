import axios from 'axios'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { upFireBaseFile } from '@/components/AddMaterial/Utils/FirebaseUploadFile'

// 下载服务器图片
export const uploadImageToFirebaseByUrl = async (url) => {
  return new Promise((resolve, reject) => {
    downloadImageBlob(url).then(({ data }) => {
      console.log('downloadImageBlob', data)
      const {
        result,
        success
      } = data
      if (success && result) {
        resolve(result)
      } else {
        tryDownloadByClient(url, resolve, reject)
      }
    }).catch(() => {
      tryDownloadByClient(url, resolve, reject)
    })
  })
}

// 上传图片到后台
export const downloadImageBlob = async (imageUrl) => {
  return axios.post(process.env.VUE_APP_API_BASE_URL + `/classcipe/common/downloadImage`, `imageUrl=${imageUrl}&returnUrl=true`, {
    headers: {
      'X-Access-Token': storage.get(ACCESS_TOKEN),
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
}

const tryDownloadByClient = async (url, resolve, reject) => {
  console.log('tryDownloadByClient')
  if (url.indexOf('https') > -1) {
    // 本地下载 只处理https
    const image = new Image()

    image.crossOrigin = 'Anonymous'
    image.src = url

    image.addEventListener('load', () => null)
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.resolveponseType = 'arraybuffer'
    xhr.onload = () => {
      const imageType = xhr.getResponseHeader('Content-Type') || 'image/png'
      const blob = new Blob([xhr.response], { type: imageType })
      const file = new File([blob], `drivefile_${Date.now()}`, {
        type: imageType
      })
      const formData = new FormData()
      formData.append('file', file)
      upFireBaseFile(
        file,
        () => null,
        (result) => {
          resolve(result)
        }
      )
    }
    xhr.onerror = () => {
      console.log('下载图片失败')
      reject()
    }
    xhr.ontimeout = () => {
      console.log('下载图片超时')
      reject()
    }
    xhr.onabort = () => {
      console.log('下载图片取消')
      reject()
    }
    xhr.send()
  } else {
    reject()
  }
}
