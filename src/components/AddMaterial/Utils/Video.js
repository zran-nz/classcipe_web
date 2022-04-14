import RecordRTC from 'recordrtc'
import { upAwsS3File } from './AwsS3'
import notification from 'ant-design-vue/es/notification'
import * as logger from '@/utils/logger'

function onMediaError(e) {
  if (e.toString().indexOf('Permission')) {
    notification.warn('Unable to capture your camera. Please check', 'error')
  }
}

const mediaConstraints = {
  audio: true,
  video: true
}
let mediaRecorder = null
let domVideoElement = null
let upFileInstance = null
let videoRecordStatus = 0 // 0 未启动，1 启动中 2 已启动 3取消了
let retryTimes = 0

const closePictureInPicture = () => {
  const doc = document
  if (doc.pictureInPictureElement && doc.exitPictureInPicture) {
    try {
      doc.exitPictureInPicture()
    } catch (e) {
    }
  }
}

export const startRecordVideo = (domVideo, callback = () => null, fail = () => null) => {
  videoRecordStatus = 1
  domVideoElement = domVideo
  domVideoElement.muted = true
  domVideoElement.volume = 0
  const requestPicture = () => {
    try {
      domVideo.requestPictureInPicture()
    } catch (e) {
    }
    domVideoElement.removeEventListener('loadeddata', requestPicture)
  }
  domVideoElement.addEventListener('loadeddata', requestPicture)
  navigator.mediaDevices.getUserMedia(mediaConstraints).then((camera) => {
    domVideoElement.srcObject = camera
    domVideoElement.play()
    mediaRecorder = RecordRTC(camera, {
      type: 'video',
      sampleRate: 22050,
      mimeType: 'video/webm'
    })
    mediaRecorder.camera = camera
    setTimeout(() => {
      mediaRecorder.startRecording()
      videoRecordStatus = 2
      callback && callback()
    }, 1000)
  }).catch((e) => {
    onMediaError(e)
    fail && fail()
  })
}

export const pauseRecordVideo = () => {
  mediaRecorder.pauseRecording()
  domVideoElement.pause()
}

export const resumeRecordVideo = () => {
  mediaRecorder.resumeRecording()
  domVideoElement.play()
}

export const endRecord = () => {
  if (videoRecordStatus === 1 && retryTimes <= 5) {
    retryTimes++
    setTimeout(() => {
      endRecord()
    }, 1000)
    return
  }
  videoRecordStatus = 0
  retryTimes = 0
  try {
    closePictureInPicture()
  } catch (e) {
  }
  domVideoElement.pause()
  mediaRecorder.stopRecording(() => {
    domVideoElement.src = domVideoElement.srcObject = null
    mediaRecorder.camera.stop()
    mediaRecorder.destroy()
    mediaRecorder = null
  })
}

export const cancelUpVideo = () => {
  if (upFileInstance) {
    upFileInstance.abort()
    upFileInstance = null
  }
}

export const saveRecordVideo = async(onProgressUpLoad = () => null) => {
  return new Promise((resolve, reject) => {
    try {
      closePictureInPicture()
    } catch (e) {
      reject(e)
    }
    domVideoElement.pause()
    mediaRecorder.stopRecording(() => {
      domVideoElement.src = domVideoElement.srcObject = null
      const blobData = mediaRecorder.getBlob()
      domVideoElement.src = URL.createObjectURL(blobData)
      domVideoElement.play()
      const now = Date.now()
      const file = new window.File([blobData], `${now.toString()}.webm`, { type: 'video/webm', lastModified: Date.now() })
      logger.info('saveRecordVideo', file)

      upFileInstance = upAwsS3File(
        file,
        onProgressUpLoad,
        (result) => {
          resolve(result)
          setTimeout(() => {
            onProgressUpLoad(0)
            upFileInstance = null
          }, 50)
        },
        true
      )

      mediaRecorder.camera.stop()
      mediaRecorder.destroy()
      mediaRecorder = null
    })
  })
}
