<template>
  <div class='my-content'>
    <div class='content-header'>
      <div class='source-type'>
        <a-radio-group default-value="a" button-style="solid" v-model='sourceType'>
          <a-radio-button value="CreatedByMe">
            Created by me
          </a-radio-button>
          <a-radio-button value="SharedByMe">
            Shared by me
          </a-radio-button>
          <a-radio-button value="SharedByOthers">
            Shared by others
          </a-radio-button>
        </a-radio-group>
      </div>
      <div class='create-new'>
        <create-new />
      </div>
    </div>
    <div class='filter-bar'>
      <content-filter @search='handleSearch'/>
    </div>
    <div class='content-wrapper'>
      <a-spin tip='Loading...' :spinning="loading">
        <div class='content-list'>
          <template v-if='pagination.total !== 0 && !loading'>
            <content-item v-for='item in myContentList' :key='item.id' :content='item' @delete='handleDeleteItem' @update-publish='handleShowContentPublish'></content-item>
          </template>
          <template v-if='pagination.total === 0 && !loading'>
            <no-more-resources />
          </template>
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

    <content-publish v-if='contentPublishVisible' :content='currentContent' @publish='handleUpdatePublish' @close='handleCancelPublish' />
  </div>
</template>

<script>
import CreateNew from '@/components/MyContentV2/CreateNew'
import { SourceType } from '@/components/MyContentV2/Constant'
import ContentFilter from '@/components/MyContentV2/ContentFilter'
import { ownerMap } from '@/const/teacher'
import { FindMyContent, UpdateContentStatus } from '@/api/teacher'
import * as logger from '@/utils/logger'
import { SESSION_CURRENT_PAGE } from '@/const/common'
import ContentItem from '@/components/MyContentV2/ContentItem'
import ContentPublish from '@/components/MyContentV2/ContentPublish'
import NoMoreResources from '@/components/Common/NoMoreResources'

export default {
  name: 'CreatedByMeV2',
  components: { NoMoreResources, ContentPublish, ContentItem, ContentFilter, CreateNew },
  data () {
    return {
      sourceType: SourceType.CreatedByMe,
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

      searchText: '',
      filterParams: {},

      contentPublishVisible: false,
      currentContent: null
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
    loadMyContent () {
      this.loading = true
      let params = {
        collabrated: this.sourceType === SourceType.SharedByOthers ? ownerMap['owner-by-others'] : false,
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize,
        searchKey: this.searchText ? this.searchText : '',
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
    },

    handleDeleteItem (data) {
      this.$logger.info('handleDeleteItem', data)
      const index = this.myContentList.findIndex(item => item.id === data.content.id)
      if (index !== -1) {
        this.myContentList.splice(index, 1)
      } else {
        this.$logger.warn(`no found delete item ${data.content.id}`, this.myContentList)
      }
    },

    handleShowContentPublish(data) {
      this.$logger.info('handleShowContentPublish', data)
      this.currentContent = data.content
      if (data.content.status === 1) {
        // 取消发布直接更新
        this.handleUpdatePublish(data)
      } else {
        // 发布显示对于的关联发布内容
        this.contentPublishVisible = true
      }
    },

    handleUpdatePublish (data) {
      this.$logger.info('handleUpdatePublish', data)
      const index = this.myContentList.findIndex(item => item.id === data.content.id)
      if (index !== -1) {
        const targetStatus = data.content.status ? 0 : 1
        UpdateContentStatus({
          id: data.content.id,
          status: targetStatus,
          type: data.content.type
        }).then((res) => {
          this.$logger.info('handlePublishStatus res', res)
          this.myContentList[index].status = targetStatus
          if (targetStatus) {
            this.$message.success('Publish successfully!')
          } else {
            this.$message.success('UnPublish successfully!')
          }
        }).finally(() => {
          this.contentPublishVisible = false
          this.currentContent = null
        })
      } else {
        this.$logger.warn(`no found Update item ${data.content.id}`)
        this.contentPublishVisible = false
        this.currentContent = null
      }
    },

    handleCancelPublish () {
      this.contentPublishVisible = false
      this.currentContent = null
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
    .content-list {
      min-height: 400px;
    }
  }
}

</style>
