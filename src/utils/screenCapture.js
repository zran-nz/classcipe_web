
export const screenCapture = async (onDataAvailable = () => null, endCallBack = () => null) => {

  // 获取音频流
  const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true })

  // 获取录屏视频流
  const localScreenShareStream = await navigator.mediaDevices.getDisplayMedia()

  // 合并音频流音轨和录屏视频流
  localScreenShareStream.addTrack(tempStream.getAudioTracks()[0])

  // 添加录屏结束事件
  const screenShareTrack = localScreenShareStream.getVideoTracks()[0]
  if (screenShareTrack) {
    screenShareTrack.onended = endCallBack
  }

  const recorder = new MediaRecorder(localScreenShareStream)
  recorder.onstop = endCallBack
  recorder.ondataavailable = onDataAvailable
  return {
    stream: localScreenShareStream,
    recorder: recorder
  }
}
