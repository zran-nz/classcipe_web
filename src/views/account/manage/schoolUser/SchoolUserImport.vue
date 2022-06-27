<template>
  <a-upload
    name="file"
    :showUploadList="false"
    :multiple="false"
    :headers="tokenHeader"
    :action="importExcelUrl"
    :before-upload="beforeUpload"
    @change="handleMyImportExcel">
    <a-button :loading="importLoading" type="black" icon="import">{{ importLoadingText }}</a-button>
  </a-upload>
</template>

<script>
import { ACCESS_TOKEN } from '@/store/mutation-types'
import storage from 'store'
import * as XLSX from 'xlsx'
export default {
  name: 'SchoolUserImport',
  props: {
    action: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      importLoading: false,
      importLoadingText: 'Bulk import',
      file: null
    }
  },
  computed: {
    tokenHeader () {
      const head = { 'X-Access-Token': storage.get(ACCESS_TOKEN) }
      return head
    },
    importExcelUrl() {
      return process.env.VUE_APP_API_BASE_URL + this.action
    }
  },
  methods: {
    handleMyImportExcel(info) {
      if (info.file.status === 'uploading') {
        this.importLoading = true
        this.importLoadingText = 'Uploading...'
      }
      if (info.file.status === 'done') {
        this.importLoading = false
        this.importLoadingText = 'Bulk import'
      }
      // this.handleImportExcel(info)
      this.parseExcel(info.file)
    },
    beforeUpload(file) {
      return false
    },
    handleImportExcel (info) {
      console.log(info.file.status)
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          // this.$message.success(`${info.file.name} 文件上传成功`);
          if (info.file.response.code === 201) {
            const { message, result: { msg, fileUrl, fileName } } = info.file.response
            const href = window._CONFIG['domianURL'] + fileUrl
            this.$warning({
              title: message,
              content: (<div>
                  <span>{msg}</span><br/>
                  <span>Details <a href={href} target="_blank" download={fileName}>Click download</a> </span>
                </div>
              )
            })
          } else {
            this.$message.success(info.file.response.message || `${info.file.name} 文件上传成功`)
            this.$emit('success')
          }
        } else {
          this.$message.error(`${info.file.name} ${info.file.response.message}.`)
        }
      } else if (info.file.status === 'error') {
        if (info.file.response.status === 500) {
          const data = info.file.response
          const token = storage.get(ACCESS_TOKEN)
          if (token && data.message.includes('Token失效')) {
            this.$error({
              title: '登录已过期',
              content: '很抱歉，登录已过期，请重新登录',
              okText: '重新登录',
              mask: false,
              onOk: () => {
                this.$store.dispatch('Logout').then(() => {
                  storage.remove(ACCESS_TOKEN)
                  window.location.reload()
                })
              }
            })
          }
        } else {
          this.$message.error(`文件上传失败: ${info.file.msg} `)
        }
      }
    },
    parseExcel(file) {
      const reader = new FileReader()
      const rABS = typeof FileReader !== 'undefined' && (FileReader.prototype || {}).readAsBinaryString
      if (rABS) {
        reader.readAsBinaryString(file)
      } else {
        reader.readAsArrayBuffer(file)
      }
      reader.onload = e => {
        let data = e.target.result
        if (!rABS) {
          data = new Uint8Array(data)
        }
        const workBook = XLSX.read(data, { type: rABS ? 'binary' : 'array' })
        workBook.SheetNames.forEach(name => {
          const sheet = workBook.Sheets[name]
          const json = XLSX.utils.sheet_to_json(sheet, {
            raw: false,
            header: 1
          })
          console.log(json)
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
