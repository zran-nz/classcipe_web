import * as logger from './logger'

export const screenCapture = async (endCallBack = (data) => null) => {
  const chunks = []

  // 获取音频流
  const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true })

  // 获取录屏视频流
  const localScreenShareStream = await navigator.mediaDevices.getDisplayMedia()

  // 合并音频流音轨和录屏视频流
  localScreenShareStream.addTrack(tempStream.getAudioTracks()[0])

  // 添加录屏结束事件
  const screenShareTrack = localScreenShareStream.getVideoTracks()[0]
  if (screenShareTrack) {
    screenShareTrack.onended = () => {
      logger.info('screenShareTrack.onended', chunks)
      endCallBack(chunks)
    }
  }

  const recorder = new MediaRecorder(localScreenShareStream)
  recorder.onstop = () => {
    logger.info('screenShareTrack.onstop', chunks)
    endCallBack(chunks)
  }
  recorder.ondataavailable = (event) => {
    logger.info('screenShareTrack.ondataavailable', chunks, event.data)
    chunks.push(event.data)
  }
}
