<template>
  <div class="upload-file">
    <input class="upload-file" type="file" :accept="accept" ref="uploadFile" @change="onUpload" />
  </div>
</template>
<script>
import { upAwsS3File } from '@/components/AddMaterial/Utils/AwsS3'

export default {
  name: 'CommonUpload',
  data() {
    return {
      progress: 0,
      uploader: null
    }
  },
  props: {
    onSuccess: {
      type: Function,
      default: () => null
    },
    getProgressUpLoad: {
      type: Function,
      default: () => null
    },
    accept: {
      type: String,
      default: '.pdf, application/pdf,audio/*,video/*,image/*'
    },
    onlyGetFile: {
      type: Boolean,
      default: false // 是否只得到本地file，单独做上传处理，默认false
    }
  },
  methods: {
    onUpload(e) {
      const file = e.target.files[0]
      if (this.onlyGetFile) {
        this.onSuccess(file)
        this.end()
        return
      }
      this.uploader = upAwsS3File(this.$store.getters.userInfo.id, file, this.getProgressUpLoad, result => {
        this.onSuccess(file, result)
        setTimeout(() => {
          this.progress = 0
          this.getProgressUpLoad(0)
        }, 50)
      }, true)
    },
    cancel() {
      if (this.uploader) {
        this.uploader.cancel()
      }
      this.end()
    },
    end() {
      this.progress = 0
      this.$refs.uploadFile.value = ''
    }
  }
}
</script>
<style scoped>
.upload-file {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
