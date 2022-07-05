<template>
  <a-spin :spinning="loading">
    <a-form-model
      layout="horizontal"
      :model="formModel"
      v-bind="formItemLayout"
      :rules="validatorRules"
      ref="form">
      <a-form-model-item label="Areas of teaching" prop="teachingAreas">
        <a-select
          optionFilterProp="children"
          :getPopupContainer="trigger => trigger.parentElement"
          v-model='formModel.teachingAreas'
          mode="multiple"
          option-label-prop="label"
          placeholder='Please select areas'>
          <a-select-option
            :value="option.subjectName"
            :label="option.subjectName"
            v-for="option in subjectOptions"
            :key="option.subjectName"
          >
            {{ option.subjectName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="Ages of students" prop="studentAges">
        <a-select
          optionFilterProp="children"
          :getPopupContainer="trigger => trigger.parentElement"
          v-model='formModel.studentAges'
          option-label-prop="label"
          mode="multiple"
          placeholder='Please select ages'>
          <a-select-option
            :value="option"
            :label="option"
            v-for="option in ageList"
            :key="option"
          >
            {{ option }}
          </a-select-option>
        </a-select>
        <!-- <div style="display:flex;">
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
        </div> -->
      </a-form-model-item>

      <a-form-model-item label="Available time per day" prop="availableTime">
        <a-input-number v-model="formModel.availableTime"></a-input-number> hours
      </a-form-model-item>

      <a-form-model-item :wrapperCol="{span: 18}" label="Official ID">
        <a-row>
          <a-col :span="12">
            <a-form-model-item style="margin-top: 40px" prop="officialId">
              <customer-upload-file
                accept="image/png, image/jpeg,  application/pdf"
                :showUploadButton="false"
                type="image/pdf"
                @update="(url) => uploadFile('officialId', url, true)"
              >
                <div slot="fileList">
                  <template v-if="!formModel.officialId">
                    <a-icon type="plus" />
                    <div class="ant-upload-text">
                      Upload image/pdf
                    </div>
                  </template>
                  <template v-else>
                    <div class="img-file">
                      <div class="img">
                        <div v-if="isPdf(formModel.officialId)">
                          <a-icon type="file-pdf" />
                        </div>
                        <img v-else :src="formModel.officialId" alt="">
                      </div>
                    </div>
                  </template>
                </div>
              </customer-upload-file>
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
              <a-form-model-item prop="holdingPhone">
                <customer-upload-file
                  accept="image/png, image/jpeg,  application/pdf"
                  :showUploadButton="false"
                  type="image/pdf"
                  @update="(url) => uploadFile('holdingPhone', url, true)"
                >
                  <div slot="fileList">
                    <template v-if="!formModel.holdingPhone">
                      <!-- <a-icon type="plus" />
                      <div class="ant-upload-text">
                        Upload image/pdf
                      </div> -->
                      <div class="img-file">
                        <div class="img">
                          <img src="~@/assets/icons/account/certificate.png" alt="">
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="img-file">
                        <div class="img">
                          <div v-if="isPdf(formModel.holdingPhone)">
                            <a-icon type="file-pdf" />
                          </div>
                          <img v-else :src="formModel.holdingPhone" alt="">
                        </div>
                      </div>
                    </template>
                  </div>
                </customer-upload-file>
              </a-form-model-item>
              <!-- <img style="width: 320px; height: 180px;" src="~@/assets/icons/account/certificate.png" alt=""> -->
            </div>
          </a-col>
        </a-row>
      </a-form-model-item>

      <a-form-model-item :wrapperCol="{offset: 6}">
        <a-space v-if="formModel.serviceVerificationStatus === 1">
          <a-button :loading="loading" @click="handleCancel">Cancel</a-button>
          <a-button :loading="loading" @click="handleSave" type="primary">{{ teacherId ? 'Update': 'Create' }}</a-button>
        </a-space>
        <div class="status-text" v-if="formModel.serviceVerificationStatus === 2">
          <a-icon type="check-circle" /> <span>Approved</span>
        </div>
        <template v-if="formModel.serviceVerificationStatus === 3">
          <div class="status-text deny">
            <a-icon type="close-circle" /> <span>Rejected</span>
          </div>
          <!-- <div class="deny-text">Reason for refusal: {{ totalResult[choosed.id].denyReason }}  </div> -->
        </template>
      </a-form-model-item>
    </a-form-model>
  </a-spin>
</template>

<script>
import { getSchools } from '@/api/school'
import { getSubjectBySchoolId } from '@/api/academicSettingSubject'
import { saveServiceVerification, detailVerificationByUserId } from '@/api/v2/teacherVerification'

import CustomerUploadFile from '@/components/Common/CustomerUploadFile'

export default {
  name: 'ServiceVerificationForm',
  components: {
    CustomerUploadFile
  },
  props: {
    school: {
      type: String,
      default: '0'
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
        this.currentSchool = val
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
      subjectOptions: [],
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
      ageList: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      formModel: {
        teachingAreas: [],
        studentAges: [],
        schoolId: '',
        officialId: '',
        holdingPhone: '',
        availableTime: 1,
        serviceVerificationStatus: 1
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
        officialId: [{ required: true, message: 'Please Upload officialId!' }],
        holdingPhone: [{ required: true, message: 'Please Upload holdingPhone!' }],
        teachingAreas: [{ required: true, message: 'Please Select areas!' }],
        studentAges: [{ required: true, message: 'Please Select ages!' }],
        availableTime: [{ required: true, message: 'Please Input time!' }]
      }
    }
  },
  methods: {
    initDict() {
      this.loading = true
      Promise.all([
        getSubjectBySchoolId({
          schoolId: this.currentSchool || '0'
        }),
        getSchools({
        })
      ])
      .then(([subjectRes, schoolRes]) => {
        if (schoolRes.success) {
          this.schoolList = schoolRes.result || []
        } else {
          this.schoolList = []
        }
        if (subjectRes.success) {
          let subjects = []
          subjectRes.result.forEach(item => {
            if (item.subjectList && item.subjectList.length > 0) {
              subjects = subjects.concat(item.subjectList)
            }
          })
          this.subjectOptions = subjects
        } else {
          this.subjectOptions = []
        }
      }).finally(() => {
        this.loading = false
      })
    },
    initData() {
      this.formModel.schoolId = this.currentSchool
      if (this.formModel.schoolId && this.formModel.schoolId !== '0') {
        this.initDict()
      }
    },
    initForm() {
      this.loading = true
      detailVerificationByUserId({
        userId: this.id
      }).then(res => {
        if (res.code === 0) {
          this.formModel.teachingAreas = res.result.teachingAreas?.split(',') || []
          this.formModel.studentAges = res.result.studentAges?.split(',') || []
          this.formModel.schoolId = res.result.schoolId
          this.formModel.officialId = res.result.officialId || ''
          this.formModel.holdingPhone = res.result.holdingPhone || ''
          this.formModel.availableTime = res.result.availableTime
          this.formModel.serviceVerificationStatus = res.result.serviceVerificationStatus
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = { ...this.formModel }
          params.teachingAreas = params.teachingAreas.join(',')
          params.studentAges = params.studentAges.join(',')
          console.log(params)
          this.loading = true
          saveServiceVerification(params).then(res => {
            if (res.code === 0) {
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
    padding: 0;
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
.img-file {
  display: flex;
  align-items: center;
  background: #fff;
  position: relative;
  width: 100%;
  height: 180px;
  .img {
    width: 100%;
    height: 100%;
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
.status-text {
  height: 50px;
  background: #E8FADE;
  border-radius: 3px;
  display: flex;
  align-items: center;
  padding: 0 60px;
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
