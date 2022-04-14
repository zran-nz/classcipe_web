import AWS from 'aws-sdk'
import * as logger from '@/utils/logger'
import { addFileUploadRecord } from '@/api/material'
import { replaceToClasscipeCDN } from '@/utils/classcipe'
const AwsConfig = {
  accessKeyId: 'AKIASDU2BIWHCVQB6Z7S',
  secretAccessKey: 'JyUaM5+Me09ngpc/X0qNsdQBh9HwaPiYakZiLgi0'
}
AWS.config.update(AwsConfig)
AWS.config.region = 'ap-southeast-2'
const s3 = new AWS.S3()
export const upAwsS3File = (userId, file, onProgress, onSuccess, isAutoAddFileUploadRecord) => {
  console.log('upAwsS3File', file)
  const now = Date.now()
  const params = {
    Bucket: 'classcipe-resource',
    Key: userId + '/' + now.toString() + '_' + Math.random() + '_' + file.name,
    Body: file,
    ACL: 'public-read'
  }
  logger.info('starting uploader')
  const uploader = s3.upload(params, {}, function(err, data) {
    if (err) {
      logger.info('error: ' + err.message)
    } else {
      logger.info('upload done , location is ' + data['Location'])
      logger.info('File available at', data)
      logger.info(Date.now() - now, '计时 上传成功')
      onSuccess(data['Location'])
      onProgress(100)
      if (isAutoAddFileUploadRecord) {
        addFileUploadRecord({
          fileLength: file.size,
          filePath: replaceToClasscipeCDN(data['Location'])
        }).then((res) => {
          logger.info('addFileUploadRecord res', res)
        })
      }
    }
  })
  uploader.on('httpUploadProgress', function(evt) {
    logger.info('uploaded ' + evt.loaded + '/' + evt.total)
    const progress = Math.floor((evt.loaded / evt.total) * 100)
    onProgress && onProgress(Math.min(progress, 99))
  })

  return uploader
}
