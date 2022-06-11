<template>
  <div class="authorize-col">
    <div v-if="currentCurriculum">
      <div class="authorize-result-wrap">
        <div class="subject-circulum">
          <div
            :class="{'circulum-item': true, 'active': item.id === choosed.id}"
            v-for="item in currentCurriculum"
            :key="item.id"
            @click="chooseCurriculum(item)">
            <div class="circulum-item-avatar">
              <a-avatar
                shape="square"
                :size="50"
                :style="{ backgroundColor: '#3377FF', verticalAlign: 'middle' }"
              >
                {{ (item.curriculumName || item.name).substring(0, 2) }}
              </a-avatar>
            </div>
            <div class="circulum-item-detail">
              <div>{{ item.curriculumName || item.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="authrize-form" v-if="totalResult[choosed.id]">
        <a-form-model
          ref="form"
          :model="totalResult[choosed.id]"
          v-bind="formItemLayout"
          :rules="validatorRules">
          <a-form-model-item prop="resources" label="resources">
            <customer-upload-file
              v-if="totalResult[choosed.id].status === '' || totalResult[choosed.id].status === 3"
              accept="image/png, image/jpeg,  application/pdf"
              :showUploadButton="false"
              :url="totalResult[choosed.id].resources"
              type="image/pdf"
              @update="(url) => uploadFile('resources', url)"
            >
              <div slot="fileList">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  Upload image/pdf
                </div>
              </div>
            </customer-upload-file>
            <div class="preview-file" slot="extra" v-if="totalResult[choosed.id].resources">
              <div class="img">
                <div v-if="isPdf(totalResult[choosed.id].resources)">
                  <a-icon type="file-pdf" />
                </div>
                <img v-else :src="totalResult[choosed.id].resources" alt="">
              </div>
              <a :href="totalResult[choosed.id].resources" target="_blank" for="">{{ totalResult[choosed.id].resources }}</a>
            </div>
          </a-form-model-item>
          <a-form-model-item prop="certificate" label="certificate">
            <customer-upload-file
              v-if="totalResult[choosed.id].status === '' || totalResult[choosed.id].status === 3"
              accept="image/png, image/jpeg,  application/pdf"
              :showUploadButton="false"
              type="image/pdf"
              @update="(url) => uploadFile('certificate', url, true)"
            >
              <div slot="fileList">
                <a-icon type="plus" />
                <div class="ant-upload-text">
                  Upload image/pdf
                </div>
              </div>
            </customer-upload-file>
            <div class="file-list" slot="extra" v-if="totalResult[choosed.id].certificate">
              <div class="file-item" v-for="url in totalResult[choosed.id].certificate.split(',')" :key="url">
                <template v-if="url">
                  <div class="preview-file">
                    <div class="img">
                      <div v-if="isPdf(url)">
                        <a-icon type="file-pdf" />
                      </div>
                      <img v-else :src="url" alt="">
                    </div>
                    <a :href="url" target="_blank" for="">{{ url }}</a>
                  </div>
                  <!-- <a :href="url" target="_blank">{{ url }}</a>
                  <a-icon v-if="totalResult[choosed.id].status === '' || totalResult[choosed.id].status === 3" type="close" @click="handleRemove('certificate', url)"></a-icon> -->
                </template>
              </div>
            </div>
          </a-form-model-item>
          <a-form-model-item :wrapperCol="{offset: 4, span: 12}" prop="isAgree" label="">
            <a-checkbox :disabled="totalResult[choosed.id].status === 1 || totalResult[choosed.id].status === 2" style="line-height: 20px;" v-model="totalResult[choosed.id].isAgree">
              School/I has been certified by IB to use its teaching resources for academic purposes, therefore School/I authorize Classcipe to upload necessary data to assist my teaching.
            </a-checkbox>
          </a-form-model-item>
          <a-form-model-item :wrapperCol="{offset: 4, span: 12}" label="">
            <div class="status-text" v-if="totalResult[choosed.id].status === 1">
              <span>It's under review :  In progress</span>
            </div>
            <div class="status-text" v-if="totalResult[choosed.id].status === 2">
              <a-icon type="check-circle" /> <span>Approved</span>
            </div>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
    <div v-show="!currentCurriculum" class="no-subject">
      <img src='~@/assets/newBrowser/no-subject.png'/>
      <p>None Authorization because you dont choose the Circulum</p>
    </div>
  </div>
</template>

<script>
import { listIbAuth, submitIbAuth } from '@/api/academicSettingIbAuth'
import { AllCurriculums } from '@/const/common'
import CustomerUploadFile from '@/components/Common/CustomerUploadFile'
const IBs = [AllCurriculums.IBPYP, AllCurriculums.IBMYP]
export default {
  name: 'AuthorizeSel',
  components: {
    CustomerUploadFile
  },
  props: {
    curriculum: {
      type: Array,
      default: () => []
    },
    school: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    curriculum: {
      handler(val, valPrev) {
        const curriculums = val ? [ ...val ] : []
        this.currentCurriculum = curriculums.filter(item => IBs.includes(item.id))
        this.initData()
      },
      immediate: true,
      deep: true
    },
    school: {
      handler(val, valPrev) {
        this.currentSchool = val ? { ...val } : null
        this.initAuths()
      },
      immediate: true
    }
  },
  data() {
    return {
      loading: false,
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 12 }
      },
      currentCurriculum: [],
      currentSchool: this.school,
      choosed: null,
      totalResult: {},
      authForm: {
        applyType: 1,
        certificate: '',
        curriculumId: '',
        resources: '',
        schoolId: '',
        isAgree: false
      },
      listAuths: [],
      validatorRules: {
        certificate: [
          { required: true, message: 'Please upload certificate!', trigger: 'change' }
        ],
        resources: [
          { required: true, message: 'Please upload resources!', trigger: 'change' }
        ],
        isAgree: [
          { required: true, message: 'Please agree first!', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    initData() {
      console.log(this.currentCurriculum)
      if (this.choosed) {
        const isExist = this.currentCurriculum.find(item => item.id === this.choosed.id)
        if (!isExist) {
          this.choosed = { ...this.currentCurriculum[0] }
        }
      } else {
        this.choosed = { ...this.currentCurriculum[0] }
      }
      if (!this.totalResult) this.totalResult = {}
      if (this.choosed.id && !this.totalResult[this.choosed.id]) {
         this.$set(this.totalResult, this.choosed.id, {
            applyType: 1,
            certificate: '',
            id: '',
            status: '',
            curriculumId: this.choosed.id,
            resources: '',
            isAgree: false,
            schoolId: this.currentSchool.id
          })
      }
      this.setSelected()
    },
    initAuths() {
      if (this.currentSchool && this.currentSchool.id) {
        listIbAuth({
          schoolId: this.currentSchool.id,
          pageNo: 1,
          pageSize: 100,
          queryType: 1
        }).then(res => {
          if (res.success) {
            this.listAuths = res.result.records.filter(item => item.schoolId === this.currentSchool.id)
            this.setSelected()
          }
        })
      }
    },
    chooseCurriculum(item) {
      this.choosed = { ...item }
      this.initData()
    },
    setSelected() {
      // init from db
      console.log(this.listAuths)
      if (this.listAuths && this.listAuths.length > 0) {
        for (const curriculumId in this.totalResult) {
          const selectedFromDb = this.listAuths.find(item => item.curriculumId === curriculumId)
          console.log(selectedFromDb)
          if (selectedFromDb) {
            this.$set(this.totalResult, curriculumId, {
              ...selectedFromDb,
              isAgree: true
            })
          }
        }
      }
      // 提交父级判断是否允许提交
      if (this.totalResult) {
        this.$emit('change', this.totalResult[this.choosed.id])
      }
    },
    uploadFile(key, file, isAdd = false) {
      let currentArr = this.totalResult[this.choosed.id][key].split(',')
      if (isAdd) {
        currentArr.push(file.url)
      } else {
        currentArr = [file.url]
      }
      this.totalResult[this.choosed.id][key] = currentArr.join(',')
    },
    handleRemove(key, url) {
      const currentArr = this.totalResult[this.choosed.id][key].split(',')
      const index = currentArr.findIndex(item => item === url)
      currentArr.splice(index, 1)
      this.totalResult[this.choosed.id][key] = currentArr.join(',')
    },
    isPdf(url) {
      const subfix = url.split('.').pop()
      return subfix === 'pdf'
    },
    doSave() {
      this.loading = true
      const params = { ...this.totalResult[this.choosed.id] }
      params.schoolId = this.currentSchool.id
      submitIbAuth(params).then(res => {
        if (res.success) {
          this.initAuths()
        }
      }).finally(() => {
        this.loading = false
        this.$emit('save-success')
      })
    }
  }
}
</script>

<style scoped lang="less">
@import "~@/components/index.less";
.authorize-col {
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  background: #fff;
  height: 100%;
  overflow: auto;
  .authorize-result-wrap {
    background: rgba(228, 228, 228, 0.2);
    opacity: 1;
    padding: 24px;
  }
  .authrize-form {
    margin-top: 20px;
  }
}
.no-subject {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  width: 400px;
  img {
    width: 400px;
    height: 400px;
  }
  p {
    font-size: 14px;
    font-family: Leelawadee UI;
    font-weight: bold;
    color: #070707;
    opacity: 1;
    text-align: center;
  }
}
.subject-circulum {
  display: flex;
  width: 100%;
  overflow: auto;
  .circulum-item {
    background: #fff;
    display: flex;
    padding: 15px 20px;
    border: 1px solid #eee;
    cursor: pointer;
    &.active {
      border-color: @primary-color;
    }
    & ~ .circulum-item {
      margin-left: 15px;
    }
    .circulum-item-avatar {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
    .circulum-item-detail {
      display: flex;
      flex-direction: column;
      div {
        height: 19px;
        font-size: 14px;
        font-family: Leelawadee UI;
        font-weight: 400;
        color: #070707;
        opacity: 1;
        white-space: nowrap;
        & ~ div {
          margin-top: 5px;
        }
      }
    }
  }
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
.status-text {
  height: 50px;
  background: #E8FADE;
  border-radius: 3px;
  display: flex;
  align-items: center;
  padding: 0 60px;
  label {
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
.preview-file {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #DFE5E9;
  padding: 10px;
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
}
</style>
