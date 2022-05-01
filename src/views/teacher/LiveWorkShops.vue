<template>
  <div class='my-content'>
    <div class='content-header'>
      <div class='source-type'>
        <a-radio-group button-style="solid" v-model='queryParams.workshopsType'>
          <a-radio-button :value="item.value" v-for="item in WORK_SHOPS_TYPE" :key="item.label">
            {{ item.label }}
          </a-radio-button>
        </a-radio-group>
      </div>
      <div class='create-new'>
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
    </div>
    <div class='filter-bar'>
      <a-space class="status-filter">
        <label
          :class="{active: queryParams.workshopsStatus === item.value}"
          v-for="item in WORK_SHOPS_STATUS"
          @click="changeStatus(item.value)"
          :key="item.label"><a>{{ item.label }}</a></label>
      </a-space>
      <div class="pd-filter">
        <a-checkbox>PD Content only</a-checkbox>
      </div>
    </div>
    <div class='content-wrapper'>
      <a-spin tip='Loading...' :spinning="loading">
        <div class='content-list'>
          <content-item v-for='item in myContentList' :key='item.id' :content='item'></content-item>
        </div>
      </a-spin>
      <div class='pagination'>
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
import { FindMyContent } from '@/api/teacher'
import * as logger from '@/utils/logger'
import { SESSION_CURRENT_PAGE, WORK_SHOPS_STATUS, WORK_SHOPS_TYPE } from '@/const/common'
import ContentItem from '@/components/MyContentV2/LiveWorkShopContentItem'

export default {
  name: 'LiveWorkShops',
  components: { ContentItem, ContentFilter, CreateNew },
  data () {
    return {
      WORK_SHOPS_STATUS: WORK_SHOPS_STATUS,
      WORK_SHOPS_TYPE: WORK_SHOPS_TYPE,

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
      FindMyContent(params).then(res => {
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
  }

  .filter-bar {
    position: relative;
    margin: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .status-filter {
      label {
        line-height: 30px;
        margin-right: 10px;
        a {
          color: #333;
        }
        &.active {
          a {
            color: @primary-color;
          }
        }
      }
    }
  }
}

</style>
