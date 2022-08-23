<template>
  <div>
    <a-form-model
      layout="horizontal"
      :model="formModel"
      v-bind="formItemLayout"
      :rules="validatorRules"
      ref="form">

      <a-form-model-item label="Are you a current teacher">
        <a-switch v-model="formModel.currentTeacher" :disabled="!canEdit"></a-switch>
      </a-form-model-item>
      <a-form-model-item label="Current School" v-if="formModel.currentTeacher">
        <a-select
          v-model="formModel.schoolId"
          @change="handleSelSchool"
          :getPopupContainer="target => target.parentNode"
          placeholder="Please select school"
          :disabled="!canEdit"
          ref="schoolRefformModel"
          show-search
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          option-label-prop="label"
          @search="handleSearchSchool"
          @focus="handleSearchSchool"
        >
          <div slot="dropdownRender" slot-scope="menu">
            <v-nodes :vnodes="menu" />
            <div v-if="ifShowCreate">
              <a-divider style="margin: 4px 0;" />
              <div
                style="padding: 4px 8px; cursor: pointer;"
                @mousedown="e => e.preventDefault()"
                @click="handleCreateSchool('formModel')"
              >
                Create School: <a-tag color="#15c39a">{{ createSchoolName }}</a-tag>
              </div>
            </div>
          </div>
          <a-select-option
            :value="schoolOption.id"
            :label="schoolOption.name"
            v-for="schoolOption in [...myCreateSchoolOptions,...schoolOptions]"
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
          :disabled="!canEdit"
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

      <a-form-model-item prop="teachingCertificate">
        <span slot="label">
          Teaching certificate&nbsp;
          <a-tooltip title="Certificates that can prove you are entitled to teach, such as Teaching certificate, School staff card, Cambridge/IB Training Certificate and etc.">
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <!-- <customer-upload-file
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
        </customer-upload-file> -->
        <a-upload
          :showUploadList='false'
          v-if="canEdit"
          accept="image/png, image/jpeg,  application/pdf"
          :customRequest="data => handleUploadImage(data, 'teachingCertificate')"
        >
          <a-button :loading="uploading"> <a-icon type="upload" /> Click to Upload image/PDF </a-button>
        </a-upload>
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
                <a-icon v-if="canEdit" class="close" type="close" @click="handleRemove('teachingCertificate', url)"></a-icon>
              </div>
            </template>
          </div>
        </div>
      </a-form-model-item>

      <a-form-model-item :wrapperCol="{offset: 6}">
        <a-space v-if="canEdit">
          <!-- <a-button :loading="loading" @click="handleCancel">Cancel</a-button> -->
          <a-button :loading="loading" @click="handleSave" type="primary">{{ 'Update' }}</a-button>
        </a-space>
        <div class="status-text" v-if="formModel.teacherVerificationStatus === 1">
          <span>It's under review :  In progress</span>
        </div>
        <div class="status-text" v-if="formModel.teacherVerificationStatus === 2">
          <a-icon type="check-circle" /> <span>Approved</span>
        </div>
        <template v-if="formModel.teacherVerificationStatus === 3">
          <div class="status-text deny">
            <a-icon type="close-circle" /> <span>Rejected</span>
          </div>
          <!-- <div class="deny-text">Reason for refusal: {{ totalResult[choosed.id].denyReason }}  </div> -->
        </template>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { getSchools, queryById } from '@/api/school'
import { saveTeacherVerification, detailVerificationByUserId } from '@/api/v2/teacherVerification'

import CustomerUploadFile from '@/components/Common/CustomerUploadFile'
import { upAwsS3File } from '@/components/AddMaterial/Utils/AwsS3'
import { debounce } from 'lodash-es'

export default {
  name: 'TeacherVerificationForm',
  components: {
    CustomerUploadFile,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
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
      schoolOptions: [],
      myCreateSchoolOptions: [],
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
        teachingCertificate: '',
        teacherVerificationStatus: ''
      },
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 }
      },
      loading: false,
      uploading: false,
      createSchoolName: ''
    }
  },
  created() {
    this.debouncedSearchSchool = debounce(this.searchSchool, 500)
    this.initDict()
  },
  computed: {
    validatorRules: function () {
      return {
        teachingCertificate: [{ required: true, message: 'Please Upload Certificate!', trigger: 'change' }],
        teachingYear: [{ required: true, message: 'Please Select year!' }]
      }
    },
    ifShowCreate() {
      // const list = [...this.myCreateSchoolOptions, ...this.schoolOptions]
      // const findOne = list.find(item => item.name === this.createSchoolName)
      // return this.createSchoolName && !findOne
      return false
    },
    canEdit() {
      return !this.formModel.teacherVerificationStatus || this.formModel.teacherVerificationStatus === 3
    }
  },
  methods: {
    initDict() {
      // this.loading = true
      // getSchools({
      // }).then(res => {
      //   if (res.success) {
      //     this.schoolList = res.result || []
      //   } else {
      //     this.schoolList = []
      //   }
      // }).finally(() => {
      //   this.loading = false
      // })
    },
    filterOptions(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    initData() {
      // this.formModel.schoolId = (this.currentSchool.id && this.currentSchool.id !== '0') ? this.currentSchool.id : undefined
    },
    initForm() {
      this.loading = true
      detailVerificationByUserId({
        userId: this.id
      }).then(res => {
        if (res.code === 0) {
          this.formModel.currentTeacher = Boolean(res.result.currentTeacher)
          this.formModel.schoolId = res.result.schoolId
          this.formModel.teachingYear = res.result.teachingYear
          this.formModel.teachingCertificate = res.result.teachingCertificate
          this.formModel.teacherVerificationStatus = res.result.teacherVerificationStatus
          if (this.formModel.schoolId) {
            queryById({
              id: this.formModel.schoolId
            }).then(res => {
              if (res.code === 0) {
                this.schoolOptions = [{ ...res.result }]
                const isFind = this.schoolOptions.find(item => item.id === this.formModel.schoolId)
                if (!isFind) {
                  this.formModel.schoolId = undefined
                }
              }
            })
          }
          this.$emit('changeSchool', this.formModel.schoolId)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleSelSchool(schoolId) {
      const list = [...this.myCreateSchoolOptions, ...this.schoolOptions]
      const findOne = list.find(item => item.id === schoolId)
      if (findOne) {
        if (findOne.country) {
          this.formModel.country = findOne.country
          this.changeCountry(findOne.country)
        }
        this.formModel.schoolName = findOne.name
      }
      this.$emit('changeSchool', schoolId)
    },
    changeCountry(country) {

    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.formModel }
          params.currentTeacher = Number(params.currentTeacher)
          this.loading = true
          saveTeacherVerification(params).then(res => {
            if (res.code === 0) {
              this.formModel.teacherVerificationStatus = 1
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
      let currentArr = (this.formModel[key] || '').split(',').filter(i => !!i)
      if (isAdd) {
        currentArr.push(file.url)
      } else {
        currentArr = [file.url]
      }
      this.formModel[key] = currentArr.join(',')
      this.$refs.form.validateField([key])
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
    },
    handleUploadImage(data, key) {
      const mediaType = data.file.type.indexOf('image') > -1 ? 'image' : (data.file.type.indexOf('video') > -1 ? 'video' : data.file.type)
      this.uploading = true
      this.uploader = upAwsS3File(this.$store.getters.userInfo.id, data.file,
        progressSize => {
          console.log(progressSize)
      },
        result => {
          this.uploading = false
          this.uploadFile(key, {
            type: mediaType,
            url: result
          }, true)
      }, true)
    },
    handleSearchSchool(value) {
      this.createSchoolName = value
      this.debouncedSearchSchool(value)
    },
    searchSchool(value) {
      if (!value) return
      getSchools({
        // curriculumId: this.userInfo.curriculumId,
        name: value
      }).then(res => {
        if (res.success) {
          this.schoolOptions = res.result || []
        } else {
          this.schoolOptions = []
        }
      })
    },
    handleCreateSchool(formName) {
      // 保存的时候在真正创建学校
      const res = {
        id: new Date().getTime(),
        name: this.createSchoolName
      }
      this.myCreateSchoolOptions.push(res)
      this[formName].schoolId = res.id
      this.$refs['schoolRef' + formName].$el.click()
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
  width: 320px;
  margin-top: 10px;
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
.status-text {
  height: 50px;
  background: #E8FADE;
  border-radius: 3px;
  display: flex;
  align-items: center;
  padding: 0 60px;
  margin-top: 20px;
  &.deny {
    background: #E8FADE;
    span {
      color: #FA5555;
    }
    i {
      color: #FA5555;
    }
  }
  span {
    font-size: 24px;
    font-family: Arial;
    font-weight: bold;
    color: #67C23A;
    margin-left: 10px;
  }
  i {
    font-size: 16px;
    color: #67C23A;
  }
}
.deny-text {
  margin-top: 10px;
  font-size: 14px;
}
</style>
