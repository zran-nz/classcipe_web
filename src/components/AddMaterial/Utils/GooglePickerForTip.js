import storage from 'store'
import { upAwsS3File } from '@/components/AddMaterial/Utils/AwsS3'

const googleDriveConfig = {
  dev: {
    clientId: '1040108879273-ldfoennnk158t1p400hn2eok3atfll3i.apps.googleusercontent.com',
    appId: '1040108879273',
    developerKey: 'AIzaSyBzfqIuraxxIDUKeE9qx8LzkhfYRstiOO0'
  },
  release: {
    clientId: '337694010706-actv4k6bli7c4iknu6ak50gkqhk318ti.apps.googleusercontent.com',
    appId: '337694010706',
    developerKey: 'AIzaSyAiNrG4HKyIhApkQQDE_uGs-0w-xTHRCTU'
  }
}

class LoadPicker {
  LoadPickerConfig = process.env.NODE_ENV === 'development' ? googleDriveConfig.dev : googleDriveConfig.release
  clientId = this.LoadPickerConfig.clientId
  appId = this.LoadPickerConfig.appId
  scope = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file'
  ]

  developerKey = this.LoadPickerConfig.developerKey
  oauthToken = ''
  pickerApiLoaded = false
  classCallback = null
  onloadingCallBack = null
  uploadDriveInstance = null

  init(onLoadingCallBack, onSuccessCallback) {
    this.loadPicker()
    this.classCallback = onSuccessCallback
    this.onloadingCallBack = onLoadingCallBack
  }

  async checkLogin() {
    // eslint-disable-next-line prefer-promise-reject-errors
    if (!this.oauthToken || this.oauthToken === '') return Promise.reject()
    return new Promise((resolve, reject) => {
      window.gapi.client.init({
        'apiKey': this.developerKey,
        'clientId': this.clientId,
        'scope': this.scope.join(' ')
      }).then(() => {
        const GoogleAuth = window.gapi.auth2.getAuthInstance()

        // Listen for sign-in state changes.
        const status = GoogleAuth.isSignedIn.get()
        if (status) {
          resolve(true)
        } else {
          reject(new Error('GoogleAuth Not login'))
        }
      })
    })
  }

  loadPicker() {
    this.checkLogin()
      .then(() => {
        window.gapi.load('picker', { 'callback': this.onPickerApiLoad })
      }).catch(() => {
      window.gapi.load('client:auth2', { 'callback': this.onAuthApiLoad })
      window.gapi.load('picker', { 'callback': this.onPickerApiLoad })
    })
  }

  onPickerApiLoad = () => {
    this.pickerApiLoaded = true
    this.createPicker()
  }

  onAuthApiLoad = () => {
    window.gapi.auth.authorize(
      {
        'client_id': this.clientId,
        'scope': this.scope,
        'immediate': false
      }, this.handleAuthResult
    )
  }

  handleAuthResult = (authResult) => {
    if (authResult && !authResult.error) {
      this.oauthToken = authResult.access_token
      storage.set('google_picker_auth_token', this.oauthToken)
      this.createPicker()
    }
  }

  createPicker = () => {
    if (this.pickerApiLoaded && this.oauthToken) {
      const picker = new window.google.picker.PickerBuilder()
        .setTitle('My Drive')
        .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
        .setOrigin('https://docs.google.com/')
        .setAppId(this.appId)
        .setOAuthToken(this.oauthToken)
        .addView(window.google.picker.ViewId.DOCS_VIDEOS)
        .setDeveloperKey(this.developerKey)
        .setCallback(this.pickerCallback)
        .build()
      picker.setVisible(true)
    }
  }

  pickerCallback = (data) => {
    console.log(data)
    if (data.action === window.google.picker.Action.PICKED) {
      const { id } = data.docs[0]
      this.getDownloadUrl(id)
    }
  }

  getDownloadUrl = (id) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET',
      `https://www.googleapis.com/drive/v2/files/${id}?supportsTeamDrives=true&access_token=${this.oauthToken}`)
    xhr.setRequestHeader('Authorization', `Bearer ${this.oauthToken}`)
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const data = JSON.parse(xhr.response)
        console.log('getDownloadUrl-----', data)
        this.onloadingCallBack(1)
        const { downloadUrl, mimeType } = data
        this.downloadFile(downloadUrl, mimeType)
      }
    }
    xhr.send()
  }

  getBlob(xhr) {
    const imageType = xhr.getResponseHeader('Content-Type')
    const blob = new Blob([xhr.response], { type: imageType })
    const imageUrl = (window.URL || window.webkitURL).createObjectURL(blob)
    console.log(imageUrl)
    return blob
  }

  downloadFile(downloadUrl, mimeType) {
    if (downloadUrl) {
      // var accessToken = gapi.auth.getToken().access_token;
      const xhr = new XMLHttpRequest()
      xhr.open('GET', downloadUrl)
      xhr.setRequestHeader('Authorization', `Bearer ${this.oauthToken}`)
      xhr.responseType = 'arraybuffer'
      xhr.onload = () => {
        const blob = this.getBlob(xhr)
        const file = new File([blob], `drivefile_${Date.now()}`, {
          type: mimeType
        })
        this.upLoadFile(file, mimeType)
      }
      xhr.send()
    } else {
      console.log(null)
    }
  }

  upLoadFile(file, mimeType) {
    const formData = new FormData()
    formData.append('file', file)
    this.upDriveFire(file, mimeType)
  }

  upDriveFire(file, mimeType) {
    this.uploadDriveInstance = upAwsS3File(file, this.onloadingCallBack, result => {
      console.log(result, mimeType)
      this.classCallback('upload-ended', result, mimeType)
      this.uploadDriveInstance = null
    }, false)
  }

  cancelUpDrive() {
    if (this.uploadDriveInstance) {
      this.uploadDriveInstance.abort()
      this.uploadDriveInstance = null
    }
  }

  // 创建http请求
  // eslint-disable-next-line standard/no-callback-literal
  makeXMLHttpRequest = (url, data) => {
    const request = new XMLHttpRequest()
    const callback = this.classCallback
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        // eslint-disable-next-line standard/no-callback-literal
        callback('upload-ended', request.response)
      }
      if (request.status === 413) {
        // eslint-disable-next-line standard/no-callback-literal
        callback('onerror')
      }
    }

    request.upload.onloadstart = () => {
      // eslint-disable-next-line standard/no-callback-literal
      callback('Upload started...')
    }

    request.upload.onprogress = (event) => {
      // callback('Upload Progress ' + Math.round(event.loaded / event.total * 100) + "%");
    }

    request.upload.onload = () => {
      // eslint-disable-next-line standard/no-callback-literal
      callback('progress-about-to-end')
    }

    request.upload.onload = () => {
      // eslint-disable-next-line standard/no-callback-literal
      callback('progress-ended')
    }

    // eslint-disable-next-line handle-callback-err
    request.upload.onerror = (error) => {
      // eslint-disable-next-line standard/no-callback-literal
      callback('onerror')
      // console.error('XMLHttpRequest failed', error);
    }

    // eslint-disable-next-line handle-callback-err
    request.upload.onabort = (error) => {
      // eslint-disable-next-line standard/no-callback-literal
      callback('Upload aborted.')
      // console.error('XMLHttpRequest aborted', error);
    }

    request.open('POST', url)
    request.send(data)
  }
}

export default new LoadPicker()
