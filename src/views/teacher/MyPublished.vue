<template>
  <div class='my-content'>
    <div class='filter-bar'>
      <content-filter @search='handleSearch'/>
      <div class='discount-setting'>
        <a-button class='cc-round-button' @click='handleShowDiscountSetting'>Discount setting</a-button>
      </div>
    </div>
    <div class='content-wrapper'>
      <a-spin tip='Loading...' :spinning="loading">
        <div class='content-list'>
          <template v-if='pagination.total !== 0 && !loading'>
            <published-content-item v-for='item in myContentList' :key='item.id' :content='item' @delete='handleDeleteItem' @update-publish='handleShowContentPublish'></published-content-item>
          </template>
          <template v-if='pagination.total === 0 && !loading'>
            <div class='empty-tips'>
              <no-more-resources />
            </div>
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

    <discount-setting v-if='discountSettingVisible' @close='discountSettingVisible = false' @confirm='discountSettingVisible = false'/>
  </div>
</template>

<script>
import CreateNew from '@/components/MyContentV2/CreateNew'
import { SourceType } from '@/components/MyContentV2/Constant'
import ContentFilter from '@/components/MyContentV2/ContentFilter'
import { FindMyContent, UpdateContentStatus } from '@/api/teacher'
import * as logger from '@/utils/logger'
import { SESSION_CURRENT_PAGE, USER_MODE } from '@/const/common'
import ContentItem from '@/components/MyContentV2/ContentItem'
import ContentPublish from '@/components/MyContentV2/ContentPublish'
import NoMoreResources from '@/components/Common/NoMoreResources'
import PublishedContentItem from '@/components/MyContentV2/PublishedContentItem'
import DiscountSetting from '@/components/MyContentV2/DiscountSetting'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import { mapState } from 'vuex'
import CustomButton from '@/components/Common/CustomButton'

export default {
  name: 'MyPublished',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: { CustomButton, DiscountSetting, PublishedContentItem, NoMoreResources, ContentPublish, ContentItem, ContentFilter, CreateNew },
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
      currentContent: null,

      discountSettingVisible: false
    }
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      currentSchool: state => state.user.currentSchool
    })
  },
  created() {
    this.loadMyContent()
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
        collabrated: false,
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize,
        searchKey: this.searchText ? this.searchText : '',
        types: [],
        status: 1,
        createBy: this.$store.getters.email,
        delFlag: 0,
        schoolId: this.currentSchool?.id
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
            this.$message.success('Unpublish successfully!')
          }
        }).finally(() => {
          this.contentPublishVisible = false
          this.currentContent = null
          this.loadMyContent()
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
    },

    handleShowDiscountSetting () {
      this.$logger.info('handleShowDiscountSetting', this.discountSettingVisible)
      this.discountSettingVisible = true
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

  .filter-bar {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    position: relative;

    .discount-setting {
      position: absolute;
      right: 0;
      top: 0;
    }
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
}

</style>
