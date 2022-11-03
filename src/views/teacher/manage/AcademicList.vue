<template>
  <a-card :bordered="false">

    <div class="table-page-search-wrapper">
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
    </div>

    <div class="list-view" v-if="datas && datas.length > 0">
      <div class="list-view-item" v-for="(item) in datas" :key="'academic_' + item.academicId">
        <div class="view-item-title">
          {{ formatDate(item) }} {{ item.name ? `(${item.name})` : '' }}
        </div>
        <div class="view-item-opt">
          <a-button type="link" @click="handleEdit(item)">Edit</a-button>
          <a-button type="link" :loading="delLoading" @click="handleDelete(item)">Delete</a-button>
        </div>
        <div class="view-item-detail">
          <div class="item-detail-content" v-for="(term, termIndex) in item.terms" :key="'term_' + termIndex">
            <div class="detail-content-title">{{ term.name }}</div>
            <div class="detail-content-time">{{ formatDate(term) }} </div>
            <div class="detail-content-current" v-show="isCurrent(term)">Current</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-subject">
      <img src='~@/assets/newBrowser/no-subject.png'/>
      <p>None academic because you dont set the academic</p>
    </div>

    <academic-add ref="modalForm" @close="handleClose"/>
  </a-card>
</template>

<script>
import { USER_MODE } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import { DeleteAcademicYearById, QueryAcademic } from '@/api/schoolAcademic'

import AcademicAdd from './academic/AcademicAdd.vue'

// import { QueryAcademic } from '@/api/schoolAcademic'
import { mapState } from 'vuex'
import moment from 'moment'
const { debounce } = require('lodash-es')

export default {
  name: 'AcademicList',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    AcademicAdd
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
      QueryAcademic({
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
      this.$refs.modalForm.title = 'Add Academic Year'
      this.$refs.modalForm.mode = 'add'
      this.$refs.modalForm.add({})
    },
    handleEdit(record) {
      this.$refs.modalForm.title = 'Edit Academic Year'
      this.$refs.modalForm.edit({ ...record })
      this.$refs.modalForm.disableSubmit = false
    },
    handleDelete(record, index) {
      console.info('handleDelete ', record)
      this.$confirm({
        title: 'Confirm delete academic',
        content: 'Are you confirm delete academic ' + record.name + ' ?',
        centered: true,
        onOk: () => {
          this.delLoading = true
          DeleteAcademicYearById({
            academicId: record.academicId
          }).then(response => {
            if (response.success) {
              this.datas = this.datas.filter(item => item.academicId !== record.academicId)
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
.operator {
  margin-bottom: 16px;
  button {
    margin-right: 8px;
  }
}
.list-view{
  position: relative;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  .list-view-item {
    // height: 165px;
    background: #FFFFFF;
    border: 1px solid #D8D8D8;
    opacity: 1;
    border-radius: 10px;
    padding: 20px;
    position: relative;
    & ~ .list-view-item {
      margin-top: 20px;
    }
    .view-item-title {
      height: 21px;
      line-height: 1;
      font-size: 16px;
      font-family: Leelawadee UI;
      font-weight: bold;
      color: #070707;
      opacity: 1;
      margin-bottom: 23px;
    }
    .view-item-opt {
      position: absolute;
      top: 20px;
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
      background: #fff;
      justify-content: space-between;
      // height: 81px;
      .item-detail-content {
        height: 100%;
        flex: 1;
        background: #FAFAFA;
        opacity: 1;
        border-radius: 10px;
        padding: 15px;
        position: relative;
        & ~ .item-detail-content {
          margin-left: 20px;
        }
        .detail-content-title {
          height: 20px;
          line-height: 1;
          font-size: 14px;
          font-family: Leelawadee UI;
          font-weight: bold;
          color: #070707;
          opacity: 1;
          margin-bottom: 10px;
        }
        .detail-content-time {
          line-height: 1;
          font-size: 13px;
          opacity: 1;
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
