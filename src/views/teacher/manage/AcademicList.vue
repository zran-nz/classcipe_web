<template>
  <a-card :bordered="false">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row type="flex" justify="space-between">
          <a-col :span="8">
            <a-input-search
              placeholder="Search for ID、Name、Email..."
              v-model="queryParams.searchKey"
              enter-button
              @search="triggerSearch"/>
          </a-col>
          <a-col>
            <a-button @click="handleAdd" type="primary" icon="plus" >Add acadeic year</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="list-view">
      <div class="list-view-item">
        <div class="view-item-title">July 2021 -May 2022 （Current)</div>
        <div class="view-item-opt">Edit</div>
        <div class="view-item-detail">
          <div class="item-detail-content">
            <div class="detail-content-title">First term</div>
            <div class="detail-content-time">July 7- Dec 10 ,2021 </div>
          </div>
          <div class="item-detail-content">
            <div class="detail-content-title">First term</div>
            <div class="detail-content-time">July 7- Dec 10 ,2021 </div>
          </div>
        </div>
      </div>
    </div>
    <academic-add ref="modalForm"/>
  </a-card>
</template>

<script>
import { USER_MODE } from '@/const/common'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import AcademicAdd from './academic/AcademicAdd.vue'
import { mapState } from 'vuex'
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
        searchKey: ''
      },
      datas: [],
      debounceInit: null
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
      this.resetTableWidth()
    },
    initData() {
      this.loadData()
    },
    loadData() {
      this.loading = true
      Promise.resolve().then(res => {
        this.datas = [
          {

          }
        ]
      }).finally(() => {
        this.loading = false
      })
    },
    handleAdd: function() {
      this.$refs.modalForm.title = 'Add acadeic year'
      this.$refs.modalForm.mode = 'add'
      this.$refs.modalForm.add({})
    },
    handleEdit(record) {
      this.$refs.modalForm.title = 'Edit acadeic year'
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.disableSubmit = false
    },
    handleDelete(record) {
      this.$logger.info('handleDelete ', record)
    },
    triggerSearch() {
      this.debounceInit()
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
    height: 165px;
    background: #FFFFFF;
    border: 1px solid #D8D8D8;
    opacity: 1;
    border-radius: 10px;
    padding: 20px;
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
      height: 16px;
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
      height: 81px;
      .item-detail-content {
        height: 100%;
        flex: 1;
        background: #FAFAFA;
        opacity: 1;
        border-radius: 10px;
        padding: 15px;
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
          .detail-content-time {
            height: 20px;
            line-height: 1;
            font-size: 16px;
            font-family: Inter-Bold;
            line-height: 24px;
            color: #000000;
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>
