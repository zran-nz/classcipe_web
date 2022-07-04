<template>
  <div>
    <a-form-model
      layout="horizontal"
      :model="formModel"
      v-bind="formItemLayout"
      :rules="validatorRules"
      ref="form">

      <a-form-model-item label="Are you a current teacher">
        <a-switch v-model="formModel.currentTeacher"></a-switch>
      </a-form-model-item>
      <a-form-model-item label="Current School" prop="schoolId">
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
      <a-form-model-item label="Year of teaching" prop="teachingYear">
        <a-select
          optionFilterProp="children"
          :getPopupContainer="trigger => trigger.parentElement"
          v-model='formModel.teachingYear'
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

      <a-form-model-item label="Teaching certificate" prop="teachingCertificate">
        <customer-upload-file
          accept="image/png, image/jpeg,  application/pdf"
          :showUploadButton="false"
          type="image/pdf"
          @update="(url) => uploadFile('teachingCertificate', url, true)"
        >
          <div slot="fileList">
            <a-icon type="plus" />
            <div class="ant-upload-text">
              Upload image/pdf
            </div>
          </div>
        </customer-upload-file>
        <div class="file-list" slot="extra" v-if="formModel.teachingCertificate">
          <div class="file-item" v-for="url in formModel.teachingCertificate.split(',')" :key="url">
            <template v-if="url">
              <div class="preview-file">
                <div class="img">
                  <div v-if="isPdf(url)">
                    <a-icon type="file-pdf" />
                  </div>
                  <img v-else :src="url" alt="">
                </div>
                <a :href="url" target="_blank" for="">{{ urlName(url) }}</a>
                <a-icon class="close" type="close" @click="handleRemove('teachingCertificate', url)"></a-icon>
              </div>
            </template>
          </div>
        </div>
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
import { saveTeacherVerification } from '@/api/v2/teacherVerification'

import CustomerUploadFile from '@/components/Common/CustomerUploadFile'

export default {
  name: 'TeacherVerificationForm',
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
        currentTeacher: false,
        schoolId: '',
        teachingYear: '',
        teachingCertificate: ''
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
        teachingCertificate: [{ required: true, message: 'Please Upload Certificate!' }],
        teachingYear: [{ required: true, message: 'Please Select year!' }]
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
          const params = { ...this.formModel }
          params.currentTeacher = Number(params.currentTeacher)
          this.loading = true
          saveTeacherVerification(params).then(res => {
            if (res.code === '0') {
              this.$message.success('Submit successfully')
            }
          }).finally(() => {
            this.loading = false
          })
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
</style>
