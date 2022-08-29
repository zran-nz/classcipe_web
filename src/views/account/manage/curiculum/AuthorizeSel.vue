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
          <a-form-model-item :required="true">
            <span slot="label">
              Resources&nbsp;
              <a-tooltip title="Please make sure upload all necessary resource for teaching plan including subject guides, ATL and etc.">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <!-- <customer-upload-file
              v-if="totalResult[choosed.id].status === '' || totalResult[choosed.id].status === 3"
              accept="image/png, image/jpeg,  application/pdf"
              :showUploadButton="false"
              :url="totalResult[choosed.id].resources"
              type="image/pdf"
              @update="(url) => uploadFile('resources', url, true)"
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
              v-if="totalResult[choosed.id].status === '' || totalResult[choosed.id].status === 3"
              accept="image/png, image/jpeg,  application/pdf"
              :customRequest="data => handleUploadImage(data, 'resources')"
            >
              <a-button :loading="uploading"> <a-icon type="upload" /> Click to Upload image/PDF </a-button>
            </a-upload>
            <!-- <div class="preview-file" slot="extra" v-if="totalResult[choosed.id].resources">
              <div class="img">
                <div v-if="isPdf(totalResult[choosed.id].resources)">
                  <a-icon type="file-pdf" />
                </div>
                <img v-else :src="totalResult[choosed.id].resources" alt="">
              </div>
              <a :href="totalResult[choosed.id].resources" target="_blank" for="">{{ urlName(totalResult[choosed.id].resources) }}</a>
              <a-icon v-if="totalResult[choosed.id].status === '' || totalResult[choosed.id].status === 3" class="close" type="close" @click="handleRemove('resources', totalResult[choosed.id].resources)"></a-icon>
            </div> -->
            <div class="file-list" slot="extra" v-if="totalResult[choosed.id].resources">
              <div class="file-item" v-for="url in totalResult[choosed.id].resources.split(',')" :key="url">
                <template v-if="url">
                  <div class="preview-file">
                    <div class="img">
                      <div v-if="isPdf(url)">
                        <a-icon type="file-pdf" />
                      </div>
                      <img v-else :src="url" alt="">
                    </div>
                    <a :href="url" target="_blank" for="">{{ urlName(url) }}</a>
                    <a-icon v-if="totalResult[choosed.id].status === '' || totalResult[choosed.id].status === 3" class="close" type="close" @click="handleRemove('resources', url)"></a-icon>
                  </div>
                  <!-- <a :href="url" target="_blank">{{ url }}</a>
                  <a-icon v-if="totalResult[choosed.id].status === '' || totalResult[choosed.id].status === 3" type="close" @click="handleRemove('certificate', url)"></a-icon> -->
                </template>
              </div>
            </div>
          </a-form-model-item>
          <a-form-model-item :required="true" >
            <span slot="label">
              Certificate&nbsp;
              <a-tooltip title="Please upload relevant certificates to prove that you are entitled to use the resources above">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <!-- <customer-upload-file
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
            </customer-upload-file> -->
            <a-upload
              :showUploadList='false'
              v-if="totalResult[choosed.id].status === '' || totalResult[choosed.id].status === 3"
              accept="image/png, image/jpeg,  application/pdf"
              :customRequest="data => handleUploadImage(data, 'certificate')"
            >
              <a-button :loading="uploading"> <a-icon type="upload" /> Click to Upload image/PDF </a-button>
            </a-upload>
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
                    <a :href="url" target="_blank" for="">{{ urlName(url) }}</a>
                    <a-icon v-if="totalResult[choosed.id].status === '' || totalResult[choosed.id].status === 3" class="close" type="close" @click="handleRemove('certificate', url)"></a-icon>
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
              <span>Authorization status:  In progress</span>
            </div>
            <div class="status-text" v-if="totalResult[choosed.id].status === 2">
              <a-icon type="check-circle" /> <span>Approved</span>
            </div>
            <template v-if="totalResult[choosed.id].status === 3">
              <div class="status-text deny">
                <a-icon type="close-circle" /> <span>Application denied</span>
              </div>
              <div class="deny-text">Reason for refusal: {{ totalResult[choosed.id].denyReason }}  </div>
            </template>
          </a-form-model-item>
          <a-form-model-item v-if="canEdit" :wrapperCol="{offset: 4, span: 12}" label="">
            <a-button :disabled="!totalResult[choosed.id].isAgree" style="line-height: 1;" @click="doSave" :loading="loading" type="primary">{{ totalResult[choosed.id].status === 3 ? 'Submit again' : 'Submit' }}</a-button>
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
import { AllCurriculums, USER_MODE } from '@/const/common'
import CustomerUploadFile from '@/components/Common/CustomerUploadFile'
import { upAwsS3File } from '@/components/AddMaterial/Utils/AwsS3'
import { mapState } from 'vuex'
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
      },
      uploading: false
    }
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      userMode: state => state.app.userMode
    }),
    canEdit() {
      return !(this.totalResult[this.choosed.id].status === 1 || this.totalResult[this.choosed.id].status === 2)
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
          pageSize: 1000,
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
      const applyType = this.userMode === USER_MODE.SELF ? 2 : 1
      if (this.listAuths && this.listAuths.length > 0) {
        for (const curriculumId in this.totalResult) {
          const selectedFromDb = this.listAuths.find(item => {
            let isSelf = true
            if (this.userMode === USER_MODE.SELF) {
              isSelf = item.applyUserId === this.info.id && item.applyType === applyType
            }
            return item.curriculumId === curriculumId && isSelf && item.schoolId === this.currentSchool.id
          })
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
        this.$emit('change', this.totalResult)
      }
    },
    uploadFile(key, file, isAdd = false) {
      let currentArr = this.totalResult[this.choosed.id][key].split(',').filter(i => !!i)
      if (isAdd) {
        currentArr.push(file.url)
      } else {
        currentArr = [file.url]
      }
      this.totalResult[this.choosed.id][key] = currentArr.join(',')
    },
    handleRemove(key, url) {
      const currentArr = this.totalResult[this.choosed.id][key].split(',').filter(i => !!i)
      const index = currentArr.findIndex(item => item === url)
      currentArr.splice(index, 1)
      this.totalResult[this.choosed.id][key] = currentArr.join(',')
    },
    urlName(url) {
      const name = url.split('_').pop()
      return decodeURIComponent(name)
    },
    isPdf(url) {
      const subfix = url.split('.').pop()
      return subfix === 'pdf'
    },
    doSave() {
      const params = { ...this.totalResult[this.choosed.id] }
      params.schoolId = this.currentSchool.id
      if (!params.resources) {
        this.$message.error('Please upload resources')
        return
      }
      if (!params.certificate) {
        this.$message.error('Please upload certificate')
        return
      }
      if (this.userMode === USER_MODE.SELF) {
        params.applyType = 2
      } else {
        params.applyType = 1
      }
      this.loading = true
      submitIbAuth(params).then(res => {
        if (res.success) {
          this.$message.success('Application received, we will process it as soon as possible')
          this.initAuths()
        }
      }).finally(() => {
        this.loading = false
        // this.$emit('save-success')
      })
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
.preview-file {
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid #DFE5E9;
  padding: 10px;
  position: relative;
  width: 100%;
  .img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    img {
      object-fit: contain;
      width :100%;
      height: 100%;
    }
    i {
      font-size: 40px;
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
</style>
