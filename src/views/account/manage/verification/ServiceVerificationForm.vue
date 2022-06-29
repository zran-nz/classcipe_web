<template>
  <div>
    <a-form-model
      layout="horizontal"
      :model="formModel"
      v-bind="formItemLayout"
      :rules="validatorRules"
      ref="form">

      <a-form-model-item label="Are you a current teacher">
        <a-switch v-model="formModel.isTeacher"></a-switch>
      </a-form-model-item>
      <a-form-model-item label="Areas of teaching" prop="schoolId">
        <a-select
          optionFilterProp="children"
          :getPopupContainer="trigger => trigger.parentElement"
          v-model='formModel.schoolId'
          option-label-prop="label"
          placeholder='Please select school'>
          <a-select-option
            :value="schoolOption.id"
            :label="schoolOption.name"
            v-for="schoolOption in schoolList"
            :key="schoolOption.id"
          >
            <label style="display:flex;justify-content:space-between;">
              <span>{{ schoolOption.name }}</span>
              <a-tag type="primary" v-show="schoolOption.country">{{ schoolOption.country }}</a-tag>
            </label>
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="Ages of students" class="mb0">
        <div style="display:flex;">
          <a-form-model-item style="flex:1;">
            <a-select
              optionFilterProp="children"
              :getPopupContainer="trigger => trigger.parentElement"
              v-model='formModel.year'
              option-label-prop="label"
              placeholder='Please select school'>
              <a-select-option
                :value="option.value"
                :label="option.label"
                v-for="option in yearsList"
                :key="option.value"
              >
                <span>{{ option.label }}</span>
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <span style="width: 50px;text-align: center;"> to </span>
          <a-form-model-item style="flex:1">
            <a-select
              optionFilterProp="children"
              :getPopupContainer="trigger => trigger.parentElement"
              v-model='formModel.year'
              option-label-prop="label"
              placeholder='Please select school'>
              <a-select-option
                :value="option.value"
                :label="option.label"
                v-for="option in yearsList"
                :key="option.value"
              >
                <span>{{ option.label }}</span>
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </div>
      </a-form-model-item>

      <a-form-model-item label="Available time per day" prop="year">
        <a-input-number v-model="formModel.time"></a-input-number> hours
      </a-form-model-item>

      <a-form-model-item :wrapperCol="{span: 18}" label="Official ID" prop="certificate">
        <a-row>
          <a-col :span="12">
            <a-form-model-item style="margin-top: 40px">
              <customer-upload-file
                accept="image/png, image/jpeg,  application/pdf"
                :showUploadButton="false"
                type="image/pdf"
                @update="(url) => uploadFile('certificate', url, true)"
              >
                <div slot="fileList">
                  <template v-if="!formModel.certificate">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">
                      Upload image/pdf
                    </div>
                  </template>
                  <template v-else>
                    <div class="uploaded-cover">
                      <div class="img-cover">
                        <div v-if="isPdf(formModel.certificate)">
                          <a-icon type="file-pdf" />
                        </div>
                        <img v-else :src="formModel.certificate" alt="">
                      </div>
                    </div>
                  </template>
                </div>
              </customer-upload-file>
              <!-- <div class="file-list" slot="extra" v-if="formModel.certificate">
                <div class="file-item" v-for="url in formModel.certificate.split(',')" :key="url">
                  <template v-if="url">
                    <div class="preview-file">
                      <div class="img">
                        <div v-if="isPdf(url)">
                          <a-icon type="file-pdf" />
                        </div>
                        <img v-else :src="url" alt="">
                      </div>
                      <a :href="url" target="_blank" for="">{{ urlName(url) }}</a>
                      <a-icon class="close" type="close" @click="handleRemove('certificate', url)"></a-icon>
                    </div>
                  </template>
                </div>
              </div> -->
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <div style="font-weight: bold;">Photo of yourself holding your ID &nbsp;
              <a-tooltip>
                <div slot="title" class="photo-tip">
                  <p>How to take a photo of yourself holding your ID</p>
                  <ul>
                    <li>Take the photo in a room with enough light</li>
                    <li>Select the highest photo quality on the device you use to take the photo</li>
                    <li>Hold up the document next to your face, like in the image below</li>
                    <li>Make sure both your face and ID are clear on the photo —— nothing on the ID can be covered or censored</li>
                  </ul>
                </div>
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </div>
            <div>
              <img style="width: 320px; height: 180px;" src="~@/assets/icons/account/certificate.png" alt="">
            </div>
          </a-col>
        </a-row>
      </a-form-model-item>

      <a-form-model-item :wrapperCol="{offset: 6}">
        <a-space>
          <a-button :loading="loading" @click="handleCancel">Cancel</a-button>
          <a-button :loading="loading" @click="handleSave" type="primary">{{ teacherId ? 'Update': 'Create' }}</a-button>
        </a-space>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { getSchools } from '@/api/school'

import CustomerUploadFile from '@/components/Common/CustomerUploadFile'

export default {
  name: 'ServiceVerificationForm',
  components: {
    CustomerUploadFile
  },
  props: {
    school: {
      type: Object,
      default: () => {}
    },
    id: {
      type: String,
      default: null
    }
  },
  watch: {
    school: {
      handler(val) {
        console.log(val)
        this.currentSchool = { ...val }
        this.initData()
      },
      deep: true,
      immediate: true
    },
    id: {
      handler(val) {
        this.teacherId = val
        this.initForm()
      },
      immediate: true
    }
  },
  data() {
    return {
      currentSchool: this.school,
      teacherId: this.id,
      schoolList: [],
      yearsList: [
        {
          label: '< 1 year',
          value: 1
        },
        {
          label: '1 year - 3 years',
          value: 2
        },
        {
          label: '> 3 years',
          value: 3
        }
      ],
      formModel: {
        year: '',
        schoolId: '',
        certificate: '',
        time: 1,
        isTeacher: false
      },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 }
      },
      loading: false
    }
  },
  created() {
    this.initDict()
  },
  computed: {
    validatorRules: function () {
      return {
        certificate: [{ required: true, message: 'Please Upload Certificate!' }],
        year: [{ required: true, message: 'Please Select year!' }]
      }
    }
  },
  methods: {
    initDict() {
      this.loading = true
      getSchools({
      }).then(res => {
        if (res.success) {
          this.schoolList = res.result || []
        } else {
          this.schoolList = []
        }
      }).finally(() => {
        this.loading = false
      })
    },
    initData() {
      this.formModel.schoolId = this.currentSchool.id
    },
    initForm() {

    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
        }
      })
    },
    handleCancel() {
      this.$emit('cancel')
    },
    uploadFile(key, file, isAdd = false) {
      let currentArr = this.formModel[key].split(',').filter(i => !!i)
      if (isAdd) {
        currentArr.push(file.url)
      } else {
        currentArr = [file.url]
      }
      this.formModel[key] = currentArr.join(',')
      console.log(this.formModel)
    },
    handleRemove(key, url) {
      const currentArr = this.formModel[key].split(',').filter(i => !!i)
      const index = currentArr.findIndex(item => item === url)
      currentArr.splice(index, 1)
      this.formModel[key] = currentArr.join(',')
    },
    urlName(url) {
      const name = url.split('_').pop()
      return decodeURIComponent(name)
    },
    isPdf(url) {
      const subfix = url.split('.').pop()
      return subfix === 'pdf'
    }
  }
}
</script>

<style scoped lang="less">
.mb0 {
  margin-bottom: 0;
}
.file-list {
  display: flex;
  flex-direction: column;
  .file-item {
    line-height: 30px;
    font-size: 12px;;
    width: 100%;
    display: flex;
    align-items: center;
    a {
      font-size: 12px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #333;
    }
    i {
      cursor: pointer;
    }
    & ~ .file-item {
      margin-top: 10px;
    }
  }
}
.preview-file {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #DFE5E9;
  padding: 10px;
  position: relative;
  width: 100%;
  .img {
    width: 80px;
    height: 80px;
    margin-right: 20px;
    img {
      object-fit: contain;
      width :100%;
      height: 100%;
    }
    i {
      font-size: 80px;
      color: #ef4136;
    }
  }
  a {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #333;
  }
  .close {
    position: absolute;
    cursor: pointer;
    top: 10px;
    right: 10px;
  }
}
/deep/ .custom-cover-media {
  .ant-upload {
    background: #fff;
  }
}
.photo-tip {
  p {
    font-weight: bold;
    margin-bottom: 5px;
  }
  ul {
    list-style: circle;
  }
}
</style>
