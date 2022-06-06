<template>
  <div class='my-content' :style="{'font-size': fontSize}">
    <div class='content-header'>
      <div class='source-type'>
        <radio-switch v-if="radioSwitchShow" ref="radioSwitch" @select="changeType" :menu-list='WORK_SHOPS_TYPE_VALUES' displayProperty="label"/>
      </div>
      <div style="font-size: 12px;">
        <user-profile-avatar />
      </div>
    </div>
    <div class='filter-bar'>
      <a-space class="status-filter" :style="{visibility: WORK_SHOPS_TYPE.FEATURE.value !== queryParams.workshopsType ? 'visible' : 'hidden'}">
        <label
          :class="{active: queryParams.workshopsStatus === item.value}"
          v-for="item in WORK_SHOPS_STATUS"
          @click="changeStatus(item.value)"
          :key="item.label"><a>{{ item.label }}</a></label>
      </a-space>
      <a-space>
        <div class="content-filter">
          <div class="my-search">
            <a-input-search
              placeholder="Search"
              v-model="queryParams.searchKey"
              @search="handleSearch"
              @pressEnter="handleSearch"
              :allowClear="true"
            >
            </a-input-search>
          </div>
          <div class="more-filter" v-clickOutside="() => this.moreFilterVisible = false">
            <icon-font type="icon-loudou" @click="handleShowFilter"></icon-font>
            <div class="fliter-con" v-show="moreFilterVisible">
              <div class="filter-opt">
                <label @click="clearFilter">Clear all</label>
              </div>
              <div class="filter-item">
                <div class="filter-label">Date</div>
                <div class="filter-options">
                  <a-radio-group
                    @change="updateFilterConfig"
                    v-model="filterParams.dateType"
                    :options="dateTypeOptions"
                  />
                </div>
              </div>
              <div class="filter-item">
                <div class="filter-label">Type</div>
                <div class="filter-options">
                  <a-radio-group
                    @change="updateFilterConfig"
                    v-model="filterParams.paidType"
                    :options="paidTypeOptions"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class='create-new' v-show="WORK_SHOPS_TYPE.LUNCHEDBYME.value === queryParams.workshopsType">
          <a-dropdown :getPopupContainer="trigger => trigger.parentElement">
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleImport(typeMap.task)">
                  Import from task
                </a>
              </a-menu-item>
              <a-menu-item>
                <a @click="handleImport(typeMap.pd)">
                  Import from PD content
                </a>
              </a-menu-item>
            </a-menu>
            <a-button type='primary'>Add New <a-icon type="caret-down" />
            </a-button>
          </a-dropdown>
        </div>
      </a-space>
    </div>
    <div class='content-wrapper'>
      <a-spin tip='Loading...' :spinning="loading">
        <div class='content-list'>
          <template v-if='pagination.total !== 0 && !loading'>
            <content-item @reload="loadMyContent" v-for='item in myContentList' :key='item.id' :content='item'></content-item>
          </template>
          <div class='empty-tips' v-if='pagination.total === 0 && !loading'>
            <no-more-resources />
          </div>
        </div>
      </a-spin>
      <div class='pagination' v-if='pagination.total !== 0 && !loading'>
        <a-pagination
          v-model="pageNo"
          :total="pagination.total"
          :page-size="pagination.pageSize"
          :showTotal='pagination.showTotal'
          @change='pagination.onChange'
          show-less-items />
      </div>
    </div>
    <a-modal
      v-model='importVisible'
      :closable='true'
      :footer='null'
      :maskClosable='true'
      destroyOnClose
      width='1000px'
      @cancel='handleCloseImport'>
      <content-select
        :type="importType"
        :title="importType === typeMap.task ? 'Select Task content' : 'Select PD content'"
        @choose="handleChoose"
        @cancel="handleCloseImport"
      />
    </a-modal>
  </div>
</template>

<script>
import CreateNew from '@/components/MyContentV2/CreateNew'
import ContentFilter from '@/components/MyContentV2/ContentFilter'
import RadioSwitch from '@/components/Common/RadioSwitch'
import UserProfileAvatar from '@/components/User/UserProfileAvatar'
import { FindWorkShops } from '@/api/v2/live'
import * as logger from '@/utils/logger'
import { SESSION_CURRENT_PAGE, WORK_SHOPS_STATUS, WORK_SHOPS_TYPE, USER_MODE } from '@/const/common'
import { typeMap } from '@/const/teacher'
import ContentItem from '@/components/MyContentV2/LiveWorkShopContentItem'
import ContentSelect from '@/components/MyContentV2/ContentSelect'
import NoMoreResources from '@/components/Common/NoMoreResources'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

export default {
  name: 'LiveWorkShops',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    ContentItem,
    ContentFilter,
    CreateNew,
    RadioSwitch,
    NoMoreResources,
    ContentSelect,
    UserProfileAvatar
  },
  data () {
    return {
      typeMap: typeMap,
      WORK_SHOPS_STATUS: WORK_SHOPS_STATUS,
      WORK_SHOPS_TYPE: WORK_SHOPS_TYPE,
      WORK_SHOPS_TYPE_VALUES: Object.values(WORK_SHOPS_TYPE),
      dateTypeOptions: [{
        label: 'Weekdays only',
        value: 1
      }, {
        label: 'Weekends only',
        value: 2
      }],
      paidTypeOptions: [{
        label: 'Free workshops',
        value: 0
      }, {
        label: 'Paid workshops',
        value: 1
      }],

      queryParams: {
        workshopsType: WORK_SHOPS_TYPE.FEATURE.value,
        workshopsStatus: '',
        searchKey: ''
      },
      loading: true,
      myContentList: [],

      pagination: {
        onChange: page => {
          logger.info('pagination onChange', page)
          this.pageNo = page
          sessionStorage.setItem(SESSION_CURRENT_PAGE, page)
          this.loadMyContent()
        },
        showTotal: total => `Total ${total} items`,
        current: 1,
        total: 0,
        pageSize: 16
      },
      pageNo: sessionStorage.getItem(SESSION_CURRENT_PAGE) ? parseInt(sessionStorage.getItem(SESSION_CURRENT_PAGE)) : 1,

      filterParams: {
        dateType: null,
        paidType: null
      },
      moreFilterVisible: false,
      fontSize: '16px',
      radioSwitchShow: false,

      importVisible: false,
      importType: typeMap.task
    }
  },
  created() {
    this.loadMyContent()
  },
  mounted() {
    window.addEventListener('resize', this.resizeFn, false)
    this.resizeFn()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFn)
  },
  methods: {
    handleSchoolChange(currentSchool) {
      this.pageNo = 1
      this.loadMyContent()
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      if (userMode === USER_MODE.SELF) {
        this.pageNo = 1
        this.loadMyContent()
      }
    },
    resizeFn () {
      this.radioSwitchShow = false
      var docElem = document.documentElement
      var htmlWidth = docElem.getBoundingClientRect().width
      // if (htmlWidth > 1024) htmlWidth = 480
      const rem = htmlWidth / 16
      this.fontSize = rem + 'px'
      this.radioSwitchShow = true
    },
    handleSearch () {
      this.pageNo = 1
      this.loadMyContent()
    },
    changeStatus(value) {
      this.queryParams.workshopsStatus = value
      this.loadMyContent()
    },
    handleImport(type) {
      this.importType = type
      this.importVisible = true
    },
    handleCloseImport() {
      this.importVisible = false
    },
    handleShowFilter() {
      console.log(123)
      this.moreFilterVisible = true
      console.log(this.moreFilterVisible)
    },
    clearFilter() {
      this.filterParams = {
        dateType: null,
        paidType: null
      }
      this.loadMyContent()
    },
    updateFilterConfig() {
      this.loadMyContent()
    },
    changeType(item) {
      this.queryParams.workshopsType = item.value
      if (item.value === this.WORK_SHOPS_TYPE.FEATURE.value) {
        // TODO
        this.queryParams.workshopsStatus = '' // this.WORK_SHOPS_STATUS.SCHEDULE.value
      } else {
        this.queryParams.workshopsStatus = this.WORK_SHOPS_STATUS.SCHEDULE.value
      }
      this.loadMyContent()
    },
    loadMyContent () {
      this.loading = true
      let params = {
        ...this.queryParams,
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize,
        types: [],
        delFlag: 0
      }
      if (this.filterParams) {
        params = Object.assign(this.filterParams, params)
      }
      FindWorkShops(params).then(res => {
        logger.info('getMyContent', res)
        if (res.success && res.code === 0) {
          res.result.records.forEach((record, index) => {
            record.key = index
          })
          this.myContentList = res.result.records
          this.pagination.total = res.result.total
          this.pagination.current = res.result.current
          if (res.result.records.length === 0 && this.pagination.total > 0) {
            this.pageNo = res.result.pages
            this.loadMyContent()
          }
        } else {
          this.myContentList = []
          this.pagination.total = 0
        }
        logger.info('myContentList', this.myContentList)
      }).finally(() => {
        this.loading = false
      })
    },
    handleChoose(item) {
      console.log(item)
      this.importVisible = false
      this.$router.push({
        path: '/teacher/live-workshop/' + item.id + '/' + item.type
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.source-type {
  /deep/ span {
    font-size: 0.14em /* 14/100 */;
  }
  /deep/ .cc-radio-switch {
    padding: 0.02em /* 2/100 */;
    border-radius: 0.2em /* 45/100 */;
    .radio-item {
      font-size: 0.16em /* 15/100 */;
      padding: 0 1/0.15*0.2em /* 20/100 */;
      line-height: 1/0.15*0.45em /* 50/100 */;
    }
    .bg-block {
      height: 0.45em /* 50/100 */;
    }
  }
}
.my-content {
  padding: 15px;
  background: #fff;
  height: 100%;

  .content-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
  }

  .create-new {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    /deep/ button {
      display: flex;
      align-items: center;
      height: 0.37em /* 37/100 */;
      padding: 0 0.15em /* 15/100 */;
      span {
        font-size: .16em;
      }
      i {
        font-size: .16em;
      }
    }
    /deep/ .ant-dropdown {
      font-size: inherit;
      ul {
        margin-bottom: 0;
        li {
          font-size: inherit;
          height: 0.37em /* 37/100 */;
          display: flex;
          align-items: center;
          padding: .05em .12em;
          a {
            padding: 1/0.16*0.05em /* 5/100 */ 1/0.16*0.12em /* 12/100 */;
            margin: -1/0.16*0.05em /* 5/100 */ -1/0.16*0.12em /* 12/100 */;
          }
        }
      }
      a {
        font-size: .16em;
      }
    }
  }

  .content-wrapper {
    min-height: calc(100vh - 160px);
    .content-list {
      min-height: calc(100vh - 200px);
      /deep/ a {
        font-size: 0.18em /* 20/100 */;
      }

      .empty-tips {
        padding-top: 1em;
        display: flex;
        justify-content: center;
        align-items: center;
        .icon {
          img {
            width: 1.5rem /* 150/100 */
          }
        }
        .tips {
          line-height: 0.24em /* 24/100 */;
        }
      }
    }
  }

  .filter-bar {
    position: relative;
    margin: 0.1em /* 10/100 */ 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .status-filter {
      label {
        margin-right: 0.2em /* 20/100 */;
        border-radius: 3px;
        padding: 0.05em /* 5/100 */;
        height: 0.3em /* 30/100 */;
        display: flex;
        a {
          color: #464749;
          font-size: 0.16em /* 16/100 */;
        }
        &.active {
          background: #F8FAFB;
          a {
            font-weight: bold;
            color: #1574B7;
          }
        }
      }
    }
    .content-filter {
      height: .37em;
      display: flex;
      align-items: center;
      .my-search {
        display: flex;
        width: 2.5em;
      }
      .more-filter {
        position: relative;
        display: flex;
        margin-left: 0.2em;
        i {
          font-size: 0.18em /* 18/100 */;
        }
        .fliter-con {
          position: absolute;
          top: 0.37em;
          right: 0;
          width: 4em /* 400/100 */;
          height: 3.19em /* 319/100 */;
          overflow: auto;
          z-index: 99;
          background: #FAFAFA;
          border: 1px solid #D9DEE5;
          box-shadow: 0px 2px 5px 1px rgba(37, 37, 37, 0.06);
          border-radius: 2px;
          padding: 0.2em /* 20/100 */;
          .filter-opt {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            label {
              color: @primary-color;
              cursor: pointer;
              font-size: 0.16em /* 16/100 */;
            }
          }
          .filter-item {
            margin-bottom: 0.2em /* 20/100 */;
            .filter-label {
              font-size: 0.18em /* 18/100 */;
              font-family: Arial;
              font-weight: bold;
              color: #27282A;
            }
            .filter-options {
              margin-top: 0.15em /* 15/100 */;
              display: flex;
              align-items: center;
            }
          }
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
