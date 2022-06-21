<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          :title='title'
          :show-share='false'
          :show-collaborate='false'
          :is-preview-mode='true'
          @back='goBack'>
          <template v-slot:right>
          </template>
        </form-header>
      </template>
    </fixed-form-header>
    <div class="form-content">
      <div class="filter-tab">
        <div></div>
        <a-space class="filter-opt">
          <a-button type="primary" @click="downloadTemplate">Download template</a-button>
          <school-user-import :action="importExcelUrl" @success="handleImportGet"/>
        </a-space>
      </div>
      <div class="form-tab">
        <school-user-upload
          ref="schoolUserUpload"
          :columns="columns"
          :datas="datas"
          @save="handleSave">

        </school-user-upload>
      </div>
    </div>
    <fixed-form-footer>
      <template v-slot:right>
        <custom-text-button label='Add selected students' @click="handleAddUser">

        </custom-text-button>
      </template>
    </fixed-form-footer>
  </div>
</template>

<script>
import { USER_MODE, SCHOOL_USER_STATUS } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import FixedFormFooter from '@/components/Common/FixedFormFooter'
import CustomTextButton from '@/components/Common/CustomTextButton'
import SchoolUserUpload from './schoolUser/SchoolUserUpload'
import SchoolUserImport from './schoolUser/SchoolUserImport'

import { mapState } from 'vuex'
const { debounce } = require('lodash-es')

export default {
  name: 'SchoolStudentUpload',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    FixedFormHeader,
    FixedFormFooter,
    FormHeader,
    CustomTextButton,
    SchoolUserUpload,
    SchoolUserImport
  },
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      SCHOOL_USER_STATUS: SCHOOL_USER_STATUS,
      importExcelUrl: '',
      datas: [{
        firstName: 'Jacob',
        lastName: 'Sun',
        key: 1,
        parentEmail: '1@1.com',
        status: 1
      }, {
        firstName: 'Jacob',
        lastName: 'Sun',
        key: 2,
        parentEmail: '1@1.com',
        status: 2
      }],
      columns: [
        {
          title: 'First Name',
          align: 'center',
          dataIndex: 'firstName',
          width: 150,
          scopedSlots: { customRender: 'firstName' }
        },
        {
          title: 'Last Name',
          align: 'center',
          dataIndex: 'lastName',
          width: 150,
          scopedSlots: { customRender: 'lastName' }
        },
        {
          title: 'ParentEmail',
          align: 'center',
          dataIndex: 'parentEmail',
          width: 200,
          scopedSlots: { customRender: 'parentEmail' }
        },
        {
          title: 'Action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loading: false
    }
  },
  created() {
    this.debounceLoad = debounce(this.loadData, 300)
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    title() {
      return 'School Student > Upload'
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleSchoolChange(currentSchool) {
      if (this.userMode === USER_MODE.SCHOOL) {
        this.queryParam.schoolId = currentSchool.id
        this.debounceInit()
      }
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      this.debounceInit()
    },
    loadData() {

    },
    handleImportGet(res) {

    },
    downloadTemplate () {
      const link = document.createElement('a')
      link.style.display = 'none'
      const url = this.baseUrl + '/classcipe/excel/student.xlsx'
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
      window.URL.revokeObjectURL(url) // 释放掉blob对象
    },
    handleSave(data) {

    },
    handleAddUser() {

    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.cc-fixed-form-header {
  height: 60px;
}
.form-content {
  margin-top: 60px;
  height: calc(100vh - 60px);
  padding: 30px 60px;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.filter-tab {
  height: 40px;
  padding: 0 40px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.form-tab {
  height: calc(100% - 80px);
  padding: 0 20px;
  overflow: auto;
}
/deep/ .cc-fixed-form-footer {
  background: #fff;
}
</style>
