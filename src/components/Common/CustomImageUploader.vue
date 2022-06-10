<template>
  <div class='custom-image-uploader'>
    <div class='image-placeholder'>
      <img :src='imgUrl' v-if='imgUrl' />
      <div class='no-image' v-if='!imgUrl'>
        <common-no-data text='Select image'></common-no-data>
      </div>
      <div class='upload-mask'>
        <div class='upload-btn'>
          <custom-button label='Upload' @click='visible = true'>
            <template v-slot:icon>
              <a-icon type="cloud-upload" />
            </template>
          </custom-button>
          <custom-button v-if="needDel" label='Delete' @click='handleDeleteItem'>
            <template v-slot:icon>
              <a-icon type="delete" />
            </template>
          </custom-button>
        </div>
      </div>
    </div>
    <a-modal
      title="Upload your image"
      :visible="visible"
      :maskClosable="false"
      :confirmLoading="confirmLoading"
      :width="800"
      :footer="null"
      @cancel="cancelHandel">
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
            <img :src="previews.url" :style="previews.img"/>
          </div>
        </a-col>
      </a-row>
      <br>
      <a-row>
        <a-col :lg="2" :md="2">
          <a-upload name="file" :beforeUpload="beforeUpload" :showUploadList="false">
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
    </a-modal>
  </div>
</template>

<script>
import CustomButton from '@/components/Common/CustomButton'
import { upAwsS3File } from '@/components/AddMaterial/Utils/AwsS3'
import CommonNoData from '@/components/Common/CommonNoData'

export default {
  name: 'CustomImageUploader',
  components: { CommonNoData, CustomButton },
  props: {
    imgUrl: {
      type: String,
      default: null
    },
    needDel: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      id: null,
      confirmLoading: false,
      fileList: [],
      uploading: false,
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
    this.options.img = this.imgUrl
  },
  methods: {
    edit (id) {
      this.visible = true
      this.id = id
      /* 获取原始头像 */
    },
    close () {
      this.id = null
      this.visible = false
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
      this.$emit('update', {
        type: 'image',
        url: result
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
    },

    handleDeleteItem () {
      this.$logger.info('handleDeleteItem item:', this.imgUrl)
      this.$emit('update', {
        type: 'image',
        url: ''
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.custom-image-uploader {
  position: relative;
  .image-placeholder {
    position: relative;
    min-height: 180px;
    width: 320px;
    img {
      min-width: 200px;
      max-width: 100%;
      outline: 1px solid #f1f1f1;
    }

    .no-image {
      width: 100%;
      height: 160px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .upload-mask {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.0);
      transition: all 0.3s ease-in-out;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;

      .upload-btn {
        opacity: 0;
        transition: all 0.3s ease-in-out;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        div {
          margin: 8px 0;
        }
      }
    }

    &:hover {
      .upload-mask {
        background-color: rgba(0, 0, 0, 0.7);
      }

      .upload-btn {
        opacity: 1;
      }
    }
  }
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
