<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper" style="margin: 30px 0px;">
      <a-form layout="inline">
        <a-row type="flex" justify="start">
          <a-col :span="11" style="margin-right: 10%;">
            <a-auto-complete
              v-model="selectStudent"
              class="global-search"
              size="large"
              style="width: 100%;"
              placeholder="Search and add by name/email"
              option-label-prop="title"
              @focus="handleSearch"
              @select="onSelect"
              @search="handleSearch"
            >
              <template slot="dataSource">
                <a-select-option v-for="item in optionsList" :key="item.userInfo.id" :title="item.userInfo.email">
                  <div style="display:flex">
                    <div class="user-avatar">
                      <div class="avatar">
                        <img :src="item.userInfo.avatar" />
                      </div>
                    </div>
                    <div class="user-name-email">
                      <div class="user-name">
                        {{ item.userInfo.nickname }}
                      </div>
                      <div class="email">
                        {{ item.userInfo.email }}
                      </div>
                    </div>
                    <div class="action-wrapper">
                      <a-button type="link" @click="handleAddStudent(item.userInfo)">
                        Add
                      </a-button>
                    </div>
                  </div>
                </a-select-option>
              </template>
              <a-input>
                <a-icon slot="suffix" type="search" class="certain-category-icon" />
              </a-input>
            </a-auto-complete>
          </a-col>
          <a-col :span="4">
            <a-button @click="handleAdd" type="primary" icon="plus">Add Student</a-button>
          </a-col>
          <a-col :span="5">
            <a-upload
              name="file"
              :showUploadList="false"
              :multiple="false"
              :headers="tokenHeader"
              :action="importExcelUrl"
              @change="handleMyImportExcel">
              <a-button :loading="importLoading" type="primary" icon="import">{{ importLoadingText }}</a-button>
            </a-upload>
            <a-dropdown>
              <a-button type="link" shape="circle" icon="download" />
              <a-menu slot="overlay">
                <a-menu-item key="1">
                  <a-button type="link" icon="download" @click="downloadTemplate">Download template</a-button>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->

    <!-- table区域-begin -->
    <div>
      <!--      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
      <!--        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项-->
      <!--        <a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
      <!--      </div>-->

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <template v-if="record.status === 0">
            <a-popconfirm title="Aprove this student ?" ok-text="Yes" @confirm="handleStatus(record,1)" cancel-text="No">
              <a href="#">Aprove</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-popconfirm title="Reject this student ?" ok-text="Yes" @confirm="handleStatus(record,2)" cancel-text="No">
              <a href="#">Reject</a>
            </a-popconfirm>
          </template>
          <template v-else>
            <a-popconfirm title="Remove this student ?" ok-text="Yes" @confirm="handleDeleteRecord(record)" cancel-text="No">
              <a href="#">Remove</a>
            </a-popconfirm>
          </template>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <schoolClassStudent-modal :class-id="classId" ref="modalForm" @ok="modalFormOk"></schoolClassStudent-modal>
  </a-card>
</template>

<script>
import SchoolClassStudentModal from './modules/SchoolClassStudentModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'
import {
  SchoolClassStudentAddOrUpdate,
  schoolClassStudentAPIUrl,
  SchoolClassStudentDelete
} from '@/api/schoolClassStudent'
import moment from 'moment'
import store from '@/store'
import { mapState } from 'vuex'
import { CLASS_TYPE, USER_MODE } from '@/const/common'

export default {
  name: 'ClassStudentList',
  mixins: [JeecgListMixin],
  components: {
    SchoolClassStudentModal
  },
  props: {
    classId: {
      type: String,
      default: ''
    },
    studentList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      description: 'School Class Student',
      // 表头
      columns: [
        {
          title: 'No',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function (t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: 'Student name',
          align: 'center',
          dataIndex: 'studentName'
        },
        {
          title: 'email',
          align: 'center',
          dataIndex: 'email'
        },
        {
          title: 'Join at',
          align: 'center',
          dataIndex: 'joinTime',
          customRender: function (t, r, index) {
            return moment.utc(t).local().format('yyyy-MM-DD HH:mm')
          },
          sorter: true
        },
        {
          title: 'Action',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: schoolClassStudentAPIUrl.SchoolClassStudentList,
        delete: schoolClassStudentAPIUrl.SchoolClassStudentDelete,
        importExcelUrl: schoolClassStudentAPIUrl.SchoolClassStudentImportExcel
      },
      searchKey: '',
      importLoadingText: 'Bulk import',
      selectStudent: '',
      optionsList: []
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    }),
    importExcelUrl: function () {
      return process.env.VUE_APP_API_BASE_URL + this.url.importExcelUrl + '?classId=' + this.classId
    },
    selectedEmails() {
      return this.dataSource.map(item => {
        return item.email
      })
    }
  },
  created() {
    this.optionsList = this.studentList.filter(student => this.selectedEmails.indexOf(student.userInfo.email) === -1)
  },
  methods: {
    loadData (arg) {
      if (arg === 1) {
        this.ipagination.current = 1
      }
      this.loading = true
      const params = this.getQueryParams()
      params.hasQuery = 'true'
      params.classId = this.classId
      params.column = 'joinTime'
      params.order = 'desc'
      params.searchKey = this.searchKey
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records || res.result
          if (res.result.total) {
            this.ipagination.total = res.result.total
          } else {
            this.ipagination.total = 0
          }
        }
        this.loading = false
      }).finally(() => {
        this.$emit('reloadClass')
      })
    },
    handleStatus(record, status) {
      const model = Object.assign({}, record)
      model.status = status
      if (status === 1) {
        SchoolClassStudentAddOrUpdate(model).then(response => {
          if (response.success) {
            this.$message.success((status === 1 ? 'Aprove' : 'Reject') + ' successfully')
          }
        }).finally(() => {
          this.loadData()
        })
      } else {
        SchoolClassStudentDelete(record).then((response) => {
          if (response.success) {
            this.$message.success((status === 1 ? 'Aprove' : 'Reject') + ' successfully')
          }
        }).finally(() => {
          this.loadData()
        })
      }
    },
    handleDeleteRecord: function (record) {
      SchoolClassStudentDelete(record).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    handleMyImportExcel(info) {
      if (info.file.status === 'uploading') {
        this.importLoading = true
        this.importLoadingText = 'Uploading...'
      }
      if (info.file.status === 'done') {
        this.importLoading = false
        this.importLoadingText = 'Bulk import'
      }
      this.handleImportExcel(info)
    },
    downloadTemplate () {
      const link = document.createElement('a')
      link.style.display = 'none'
      const url = 'https://dev.classcipe.com/classcipe/excel/student.xlsx'
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
      window.URL.revokeObjectURL(url) // 释放掉blob对象
    },
    onSelect(value) {
      console.log('onSelect', value)
    },
    handleAddStudent(user) {
      console.log(user)
      if (this.dataSource.findIndex(student => student.email === user.email) > -1) {
        this.$message.error('This teacher has been added')
      }
      const params = {
        schoolId: store.getters.school,
        classFlag: this.userMode === USER_MODE.SELF ? CLASS_TYPE.self : CLASS_TYPE.school,
        classId: this.classId,
        email: user.email,
        studentName: user.nickname,
        status: 1,
        joinTime: moment.utc(new Date()).format('YYYY-MM-DD HH:mm:ss')
        // roles: 'teacher'
      }
      this.selectTeacher = ''
      this.loading = true
      SchoolClassStudentAddOrUpdate(params).then(response => {
        if (response.success) {
          this.loadData()
        } else {
          this.$message.error(response.message)
          this.loading = false
        }
      }).finally(() => {
        this.$emit('reloadClass')
      })
    },
    handleSearch(value) {
      if (!value) {
        this.optionsList = this.studentList.filter(student => this.selectedEmails.indexOf(student.userInfo.email) === -1)
      } else {
        this.optionsList = value ? this.searchResult(value) : []
      }
    },
    searchResult(value) {
      return this.studentList.filter(teacher => this.selectedEmails.indexOf(value) === -1 &&
        teacher.userInfo.email.indexOf(value) > -1)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.user-avatar {
  width: 50px;
  .avatar {
    img {
      height: 40px;
      border-radius: 40px;
    }
  }
}
.user-name-email {
  display: flex;
  flex-direction:column;
  width: 250px;
  line-height: 24px;
  font-family: Inter-Bold;
  color: #000000;
  display: flex;
  align-items: flex-start;
  .email {
    padding-left: 10px;
  }
  .user-name {
    text-align: center;
    font-family: Inter-Bold;
    line-height: 24px;
    padding-left: 15px;
    color: #000000;
  }
}
.action-wrapper{
  width:20%;
  float: right
}
</style>
