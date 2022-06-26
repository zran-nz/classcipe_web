<template>
  <div class='drive-image-uploader'>
    <a-row>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <vue-cropper
          v-if='options.img'
          ref="cropper"
          :img="options.img"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          @realTime="realTime"
        >
        </vue-cropper>
      </a-col>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img" crossorigin='anonymous'/>
        </div>
      </a-col>
    </a-row>
    <br>
    <a-row>
      <a-col :lg="2" :md="2">
        <a-upload name="file" :beforeUpload="beforeUpload" :showUploadList="false" accept='image/*'>
          <a-button icon="upload">Select Image</a-button>
        </a-upload>
      </a-col>
      <a-col :lg="{span: 1, offset: 2}" :md="2">
        <a-button icon="plus" @click="changeScale(1)"/>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button icon="minus" @click="changeScale(-1)"/>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button icon="undo" @click="rotateLeft"/>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button icon="redo" @click="rotateRight"/>
      </a-col>
      <a-col :lg="{span: 2, offset: 6}" :md="2">
        <a-button type="primary" @click="uploadImage" :disabled='confirmLoading' :loading='confirmLoading'>
          <a-icon type="cloud-upload" />
          Upload image
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { upAwsS3File } from '@/components/AddMaterial/Utils/AwsS3'
import ClasscipeDriveEvent from '@/components/ClasscipeDrive/ClasscipeDriveEvent'

export default {
  name: 'DriveImageUploader',
  props: {
    field: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      editVisible: false,
      confirmLoading: false,
      options: {
        img: '',
        autoCrop: true,
        autoCropWidth: 320,
        autoCropHeight: 180,
        fixedBox: true
      },
      previews: {}
    }
  },
  created() {
  },
  methods: {
    edit (id) {
      this.editVisible = true
      this.id = id
      /* 获取原始头像 */
    },
    close () {
      this.id = null
      this.editVisible = false
    },
    cancelHandel () {
      this.close()
    },
    changeScale (num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
    },
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    beforeUpload (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.options.img = reader.result
      }
      return false
    },

    // 上传图片（点击上传按钮）
    uploadImage () {
      // 输出
      this.$refs.cropper.getCropData((data) => {
        const arr = data.split(',')
        const mime = arr[0].match(/:(.*?);/)[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)

        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        this.model = true
        this.modelSrc = data
        const suffix = mime.split('/')[1]
        const file = new File([u8arr], `custom_image_${Date.now()}_${Math.random().toString(36).slice(2)}.${suffix}`, { type: mime })
        this.$logger.info('upload file', file)
        this.confirmLoading = true
        upAwsS3File(this.$store.getters.userInfo.id, file, this.getProgressUpLoad, result => {
          this.onSuccess(file, result)
        }, true)
      })
    },

    getProgressUpLoad (progress) {
      this.$logger.info('getProgressUpLoad', progress)
      this.confirmLoading = true
    },
    onSuccess (file, result) {
      this.$logger.info('upload success', file, result)
      this.$EventBus.$emit(ClasscipeDriveEvent.INSERT_UPLOADED_IMAGE, {
        field: this.field,
        data: result
      })
      this.confirmLoading = false
      this.okHandel()
    },
    okHandel () {
      const vm = this

      vm.confirmLoading = true
      setTimeout(() => {
        vm.confirmLoading = false
        vm.close()
        vm.$message.success('Upload successfully!')
      }, 2000)
    },

    realTime (data) {
      this.previews = data
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";
.drive-image-uploader {
  margin-top: 20px;
}

.avatar-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(13%, -50%);
  width: 320px;
  height: 180px;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
