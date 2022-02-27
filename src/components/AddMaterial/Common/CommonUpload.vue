<template>
  <div class="upload-file" >
    <input
      class="upload-file"
      type="file"
      :accept="accept"
      ref="uploadFile"
      @change="onUpload"/>
  </div>
</template>
<script>

import { upFireBaseFile } from '@/components/AddMaterial/Utils/FirebaseUploadFile'
import CommonProgress from './CommonProgress'

export default {
  name: 'CommonUpload',
  components: { CommonProgress },
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
      this.uploader = upFireBaseFile(
        file,
        this.onProgressUpLoad,
        (result) => {
          this.onSuccess(file, result)
          setTimeout(() => {
            this.progress = 0
          }, 50)
        }
      )
    },
    onProgressUpLoad(progress) {
      console.log(progress)
      this.progress = progress
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
.upload-file{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
