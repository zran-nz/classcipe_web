<template>
  <div class='my-full-form-wrapper' id='formRoot'>
    <fixed-form-header>
      <template v-slot:header>
        <form-header
          title='School Account'
          :show-share='false'
          :show-collaborate='false'
          :is-preview-mode='true'
          @back='goBack'>
          <template v-slot:right>
            <a-button @click="handleAdd" type="primary" icon="plus" >Add Academic Year</a-button>
          </template>
        </form-header>
      </template>
    </fixed-form-header>
    <div class="form-content">
      <!-- <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row type="flex" justify="space-between">
            <a-col :span="8">
              <a-input-search
                placeholder="Search for ID、Name、Email..."
                v-model="queryParams.keywords"
                enter-button
                @search="triggerSearch"/>
            </a-col>
            <a-col>
              <a-button @click="handleAdd" type="primary" icon="plus" >Add academic year</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div> -->

      <div class="list-view" v-if="datas && datas.length > 0">
        <div class="list-view-item" v-for="(item) in datas" :key="'academic_' + item.id">
          <div class="view-item-title">
            <label for="">{{ item.name }}</label>
            <custom-text-button label='Add Term' @click="handleAddTerm(item)">
              <template v-slot:icon>
                <a-icon type='plus-circle' />
              </template>
            </custom-text-button>
          </div>
          <div class="view-item-opt">
            <a-button type="link" @click="handleEdit(item)">Edit</a-button>
            <a-button type="link" :loading="delLoading" @click="handleDelete(item)">Delete</a-button>
          </div>
          <div class="view-item-detail">
            <div class="item-detail-content" v-for="(term, termIndex) in item.terms" :key="'term_' + termIndex">
              <div class="detail-content-title">
                <label>{{ term.name }}</label>
                <a-space size="middle">
                  <a-button style="color: #15c39a" type="link" @click="handleEditTerm(item, term)">Edit</a-button>
                  <a-button style="color: #15c39a" type="link" @click="handleEditBlock(term)">Block setting</a-button>
                  <a-button style="color: #15c39a" type="link" :loading="delLoading" @click="handleDeleteTerm(term)">Delete</a-button>
                </a-space>
              </div>
              <div class="detail-content-time">{{ formatDate(term) }} </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-subject">
        <img src='~@/assets/newBrowser/no-subject.png'/>
        <p>None academic because you dont set the academic</p>
      </div>
    </div>

    <academic-year-add ref="modalForm" @close="handleClose"/>
    <academic-term-add ref="termForm" @close="handleClose"/>
    <academic-block-add ref="blockForm" @close="handleClose"/>
  </div>
</template>

<script>
import { USER_MODE } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import { termList, deleteYear, deleteTerm } from '@/api/academicTermInfo'

import AcademicYearAdd from './academic/AcademicYearAdd.vue'
import AcademicTermAdd from './academic/AcademicTermAdd.vue'
import AcademicBlockAdd from './academic/AcademicBlockAdd.vue'
import FixedFormHeader from '@/components/Common/FixedFormHeader'
import FormHeader from '@/components/FormHeader/FormHeader'
import CustomTextButton from '@/components/Common/CustomTextButton'

import { mapState } from 'vuex'
import moment from 'moment'
const { debounce } = require('lodash-es')

export default {
  name: 'AcademicListV2',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    AcademicYearAdd,
    AcademicTermAdd,
    AcademicBlockAdd,
    FixedFormHeader,
    FormHeader,
    CustomTextButton
  },
  data() {
    return {
      USER_MODE: USER_MODE,
      loading: false,
      queryParams: {
        keywords: ''
      },
      datas: [],
      debounceInit: null,
      delLoading: false
    }
  },
  created() {
    this.initData()
    this.debounceInit = debounce(this.initData, 300)
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      currentSchool: state => state.user.currentSchool
    })
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleSchoolChange(currentSchool) {
      if (this.userMode === USER_MODE.SCHOOL) {
        this.debounceInit()
      }
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      this.debounceInit()
    },
    initData() {
      this.loadData()
    },
    loadData() {
      this.loading = true
      termList({
        ...this.queryParams,
        schoolId: this.currentSchool.id
      }).then(res => {
        if (res.success) {
          this.datas = res.result
        } else {
          this.datas = []
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleAdd: function() {
      this.$refs.modalForm.title = 'Add acadeic year'
      this.$refs.modalForm.mode = 'add'
      this.$refs.modalForm.add({})
    },
    handleAddTerm(item) {
      this.$refs.termForm.title = 'Add acadeic term'
      this.$refs.termForm.mode = 'add'
      // 最后一个term的截止时间
      let minDate = ''
      if (item.terms && item.terms.length > 0) {
        const last = item.terms[item.terms.length - 1]
        minDate = moment.utc(last.endTime).local().format('YYYY-MM-DD HH:mm:ss')
      } else {
        minDate = moment.utc(item.startTime).startOf('day').local().format('YYYY-MM-DD HH:mm:ss')
      }
      this.$refs.termForm.add({
        parentId: item.id,
        minDate: minDate,
        maxDate: moment.utc(item.endTime).endOf('day').local().format('YYYY-MM-DD HH:mm:ss')
      })
    },
    handleEdit(record) {
      this.$refs.modalForm.title = 'Edit acadeic year'
      this.$refs.modalForm.edit({
        ...record,
        startTime: moment.utc(record.startTime).startOf('day').local().format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment.utc(record.endTime).endOf('day').local().format('YYYY-MM-DD HH:mm:ss')
      })
      this.$refs.modalForm.disableSubmit = false
    },
     handleEditTerm(parent, item) {
      this.$refs.termForm.title = 'Add acadeic term'
      this.$refs.termForm.mode = 'add'
      // 最后一个term的截止时间
      let minDate = ''
      if (parent.terms && parent.terms.length > 0) {
        const last = parent.terms[parent.terms.length - 1]
        minDate = moment.utc(last.endTime).local().format('YYYY-MM-DD HH:mm:ss')
      } else {
        minDate = moment.utc(parent.startTime).startOf('day').local().format('YYYY-MM-DD HH:mm:ss')
      }
      this.$refs.termForm.edit({
        parentId: parent.id,
        minDate: minDate,
        maxDate: moment.utc(parent.endTime).endOf('day').local().format('YYYY-MM-DD HH:mm:ss'),
        ...item,
        startTime: moment.utc(item.startTime).local().format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment.utc(item.endTime).local().format('YYYY-MM-DD HH:mm:ss')
      })
    },
    handleEditBlock(item) {
      this.$refs.blockForm.title = 'Block setting'
      this.$refs.blockForm.mode = 'add'
      this.$refs.blockForm.edit({
        ...item.block
      })
    },
    handleDelete(record, index) {
      this.$logger.info('handleDelete ', record)
      this.$confirm({
        title: 'Confirm delete academic',
        content: 'Are you confirm delete academic ' + record.name + ' ?',
        centered: true,
        onOk: () => {
          this.delLoading = true
          deleteYear({
            id: record.id
          }).then(response => {
            if (response.success) {
              this.datas = this.datas.filter(item => item.id !== record.id)
              this.$message.success('Delete successfully')
            }
          }).finally(() => {
            this.delLoading = false
          })
        }
      })
    },
    handleDeleteTerm(record, index) {
      this.$logger.info('handleDeleteTerm ', record)
      this.$confirm({
        title: 'Confirm delete term',
        content: 'Are you confirm delete term ' + record.name + ' ?',
        centered: true,
        onOk: () => {
          this.delLoading = true
          deleteTerm({
            termId: record.id
          }).then(response => {
            if (response.success) {
              this.loadData()
              this.$message.success('Delete successfully')
            }
          }).finally(() => {
            this.delLoading = false
          })
        }
      })
    },
    triggerSearch() {
      this.debounceInit()
    },
    formatDate(item) {
      return `${moment(item.startTime).format('MMMM YYYY')} - ${moment(item.endTime).format('MMMM YYYY')}`
    },
    isCurrent(item) {
      return moment().isBefore(moment(item.endTime)) && moment().isAfter(moment(item.startTime))
    },
    handleClose() {
      this.loadData()
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
  padding: 60px 60px;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.operator {
  margin-bottom: 16px;
  button {
    margin-right: 8px;
  }
}
.list-view{
  position: relative;
  display: flex;
  flex-direction: column;
  .list-view-item {
    // height: 165px;
    opacity: 1;
    position: relative;
    & ~ .list-view-item {
      margin-top: 60px;
    }
    .view-item-title {
      display: flex;
      margin-bottom: 40px;
      align-items: center;
      & > label {
        line-height: 1;
        font-size: 16px;
        font-family: Leelawadee UI;
        font-weight: bold;
        color: #070707;
        opacity: 1;
        margin-right: 20px;
      }
    }
    .view-item-opt {
      position: absolute;
      top: 0px;
      right: 20px;
      line-height: 1;
      font-size: 14px;
      font-family: Arial;
      font-weight: 400;
      color: @primary-color;
      opacity: 1;
      cursor: pointer;
    }
    .view-item-detail {
      display: flex;
      justify-content: space-between;
      // height: 81px;
      .item-detail-content {
        height: 100%;
        flex: 1;
        background: #FFFFFF;
        border: 1px solid #D9DEE6;
        opacity: 1;
        border-radius: 10px;
        padding: 15px 20px;
        position: relative;
        & ~ .item-detail-content {
          margin-left: 20px;
        }
        .detail-content-title {
          display:flex;
          justify-content: space-between;
          align-items: center;
          label {
            font-size: 16px;
            font-family: Arial;
            font-weight: bold;
            color: #16171A;
          }

          /deep/ .ant-btn {
            padding: 0
          }
        }
        .detail-content-time {
          font-size: 14px;
          font-family: Arial;
          font-weight: 400;
          color: #3E4550;
          margin-top: 20px;
        }
        .detail-content-current {
          position: absolute;
          top: 10px;
          right: 10px;
          color: @primary-color;
        }
      }
    }
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
</style>
