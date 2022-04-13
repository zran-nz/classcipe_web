import AWS from 'aws-sdk'

const AwsConfig = {
  accessKeyId: 'AKIASDU2BIWHCVQB6Z7S',
  secretAccessKey: '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'
}
AWS.config.update(AwsConfig)
AWS.config.region = 'ap-southeast-2'
const s3 = new AWS.S3()
export const upAwsS3File = (file, onProgress, onSuccess) => {
  const now = Date.now()
  const params = {
    Bucket: 'classcipe-resource',
    Key: file.name,
    Body: file,
    ACL: 'public-read'
  }
  console.log('starting uploader')
  var uploader = s3.upload(params, {}, function(err, data) {
    if (err) {
      console.log('error: ' + err.message)
    } else {
      console.log('upload done , location is ' + data['Location'])
      console.log('File available at', data)
      console.log(Date.now() - now, '计时 上传成功')
      onSuccess(data['Location'])
      onProgress(100)
    }
  })
  uploader.on('httpUploadProgress', function(evt) {
    console.log('uploaded ' + evt.loaded + '/' + evt.total)
    const progress = Math.floor((evt.loaded / evt.total) * 100)
    onProgress && onProgress(Math.min(progress, 99))
  })
}
