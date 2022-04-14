import RecordRTC from 'recordrtc'
import { upAwsS3File } from './AwsS3'
import notification from 'ant-design-vue/es/notification'

let microphone = null
let upFileInstance = null

const isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob)

const captureMicrophone = async () => {
  return new Promise((resolve, reject) => {
    if (microphone) {
      resolve(true)
      return
    }

    if (typeof navigator.mediaDevices === 'undefined' || !navigator.mediaDevices.getUserMedia) {
      notification.warn('This browser does not supports WebRTC getUserMedia API.')

      if (navigator.getUserMedia) {
        notification.warn('This browser seems supporting deprecated getUserMedia API.')
      }
      reject(new Error('This browser does not supports WebRTC getUserMedia API.'))
      return
    }

    navigator.mediaDevices.getUserMedia({
      audio: isEdge ? true : {
        echoCancellation: false
      }
    }).then((mic) => {
      microphone = mic
      resolve(true)
    }).catch(
      // eslint-disable-next-line handle-callback-err
      (error) => {
        notification.warn('Unable to capture your microphone. Please check ' + error)
        reject(new Error('Unable to capture your microphone. Please check ' + error))
      })
  })
}

let domAudioElement = null
let recorder = null

export const startRecordAudio = (domAudio, success = () => null, fail = () => null) => {
  domAudioElement = domAudio
  domAudioElement.muted = true

  captureMicrophone()
    .then(() => {
      domAudioElement.srcObject = microphone
      if (recorder) {
        recorder.destroy()
        recorder = null
      }

      const options = {
        type: 'audio',
        numberOfAudioChannels: isEdge ? 1 : 2,
        checkForInactiveTracks: true,
        // bufferSize: 16384,
        sampleRate: 22050
      }
      recorder = RecordRTC(microphone, options)

      recorder.startRecording()
      success && success()
    }).catch(() => {
    notification.warn('Unable to capture your micro. Please check', 'error')
    fail && fail()
  })
}

export const endRecordAudio = () => {
  recorder.stopRecording(() => {
    microphone.stop()
    microphone = null
  })
}

export const cancelUpAudio = () => {
  if (upFileInstance) {
    upFileInstance.abort()
    upFileInstance = null
  }
}

export const saveRecordAudio = async (onProgressUpLoad = () => null) => {
  return new Promise((resolve) => {
    recorder.stopRecording(() => {
      const blobData = recorder.getBlob()
      const now = Date.now()
      const file = new File([blobData], now.toString() + '_' + (Math.random()) + '.mp3', {
        type: 'audio/mp3',
        lastModified: now
      })
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
        true)

      microphone.stop()
      microphone = null
    })
  })
}
