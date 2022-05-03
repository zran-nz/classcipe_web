<template>
  <div class='my-content'>
    <div class='content-header'>
      <div class='source-type'>
        <radio-switch @select="changeType" :menu-list='WORK_SHOPS_TYPE_VALUES' displayProperty="label"/>
        <!-- <a-radio-group size="large" button-style="solid" v-model='queryParams.workshopsType'>
          <a-radio-button :value="item.value" v-for="item in WORK_SHOPS_TYPE" :key="item.label">
            {{ item.label }}
          </a-radio-button>
        </a-radio-group> -->
      </div>
    </div>
    <div class='filter-bar'>
      <a-space class="status-filter" v-show="WORK_SHOPS_TYPE.FEATURE.value !== queryParams.workshopsType">
        <label
          :class="{active: queryParams.workshopsStatus === item.value}"
          v-for="item in WORK_SHOPS_STATUS"
          @click="changeStatus(item.value)"
          :key="item.label"><a>{{ item.label }}</a></label>
      </a-space>
      <div class='create-new' v-show="WORK_SHOPS_TYPE.LUNCHEDBYME.value === queryParams.workshopsType">
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item>
              <router-link to='/teacher/unit-plan-redirect/create'>
                Import from task
              </router-link>
            </a-menu-item>
            <a-menu-item>
              <router-link to='/teacher/pd-content-redirect/create'>
                Import from PD content
              </router-link>
            </a-menu-item>
          </a-menu>
          <a-button type='primary'>Add New <a-icon type="caret-down" />
          </a-button>
        </a-dropdown>
      </div>
      <!-- <div class="pd-filter">
        <a-checkbox>PD Content only</a-checkbox>
      </div> -->
    </div>
    <div class='content-wrapper'>
      <a-spin tip='Loading...' :spinning="loading">
        <div class='content-list'>
          <template v-if='pagination.total !== 0 && !loading'>
            <content-item v-for='item in myContentList' :key='item.id' :content='item'></content-item>
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
  </div>
</template>

<script>
import CreateNew from '@/components/MyContentV2/CreateNew'
import ContentFilter from '@/components/MyContentV2/ContentFilter'
import RadioSwitch from '@/components/Common/RadioSwitch'
import { FindWorkShops } from '@/api/v2/live'
import * as logger from '@/utils/logger'
import { SESSION_CURRENT_PAGE, WORK_SHOPS_STATUS, WORK_SHOPS_TYPE } from '@/const/common'
import ContentItem from '@/components/MyContentV2/LiveWorkShopContentItem'
import NoMoreResources from '@/components/Common/NoMoreResources'

export default {
  name: 'LiveWorkShops',
  components: { ContentItem, ContentFilter, CreateNew, RadioSwitch, NoMoreResources },
  data () {
    return {
      WORK_SHOPS_STATUS: WORK_SHOPS_STATUS,
      WORK_SHOPS_TYPE: WORK_SHOPS_TYPE,
      WORK_SHOPS_TYPE_VALUES: Object.values(WORK_SHOPS_TYPE),

      queryParams: {
        workshopsType: WORK_SHOPS_TYPE.FEATURE.value,
        workshopsStatus: WORK_SHOPS_STATUS.ONGOING.value,
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

      filterParams: {}
    }
  },
  created() {
    this.loadMyContent()
  },
  methods: {
    handleSearch (data) {
      this.$logger.info('handleSearch', data)
      this.searchText = data.searchKey
      this.filterParams = data
      this.pageNo = 1
      this.loadMyContent()
    },
    changeStatus(value) {
      this.queryParams.workshopsStatus = value
      this.loadMyContent()
    },
    changeType(item) {
      this.queryParams.workshopsType = item.value
      if (item.value === this.WORK_SHOPS_TYPE.FEATURE.value) {
        // TODO
        this.queryParams.workshopsStatus = '' // this.WORK_SHOPS_STATUS.SCHEDULE.value
      } else {
        this.queryParams.workshopsStatus = this.WORK_SHOPS_STATUS.ONGOING.value
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
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.source-type {
  /deep/ span {
    font-size: 14px;
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
  }

  .content-wrapper {
    min-height: calc(100vh - 160px);
    .content-list {
      min-height: calc(100vh - 200px);

      .empty-tips {
        height: calc(100vh - 300px);
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .filter-bar {
    position: relative;
    margin: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .status-filter {
      label {
        margin-right: 20px;
        border-radius: 3px;
        padding: 5px;
        height: 30px;
        display: block;
        a {
          color: #464749;
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
