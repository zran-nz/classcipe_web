<template>
  <div class='my-content'>
    <div class='content-header'>
      <div class='source-type'>
        <radio-switch @select="handleSelectShareType" :menu-list='menuList' />
      </div>
      <div class='create-new'>
        <a-space>
          <content-type-filter @change='handleUpdateFilterType'/>
          <create-new />
          <custom-search-input :round='false' :value.sync='searchText' @search='handleSearch' placeholder='Search your content'/>
          <user-profile-avatar />
        </a-space>
      </div>
    </div>
    <div class='content-wrapper'>
      <a-spin tip='Loading...' :spinning="loading">
        <div class='content-list'>
          <template v-if='pagination.total !== 0 && !loading'>
            <content-item
              v-for='item in myContentList'
              :key='item.id'
              :content='item'
              @delete='handleDeleteItem'
              @update-publish='handleShowContentPublish'
              :show-publish="userMode === 'self'"></content-item>
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
  </div>
</template>

<script>
import CreateNew from '@/components/MyContentV2/CreateNew'
import { SourceType } from '@/components/MyContentV2/Constant'
import ContentFilter from '@/components/MyContentV2/ContentFilter'
import { FindMyContent, UpdateContentStatus } from '@/api/teacher'
import * as logger from '@/utils/logger'
import { SESSION_CURRENT_PAGE } from '@/const/common'
import ContentItem from '@/components/MyContentV2/ContentItem'
import ContentPublish from '@/components/MyContentV2/ContentPublish'
import NoMoreResources from '@/components/Common/NoMoreResources'
import RadioSwitch from '@/components/Common/RadioSwitch'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import GlobalSearchInput from '@/components/GlobalSearch/GlobalSearchInput'
import UserProfileAvatar from '@/components/User/UserProfileAvatar'
import ContentTypeFilter from '@/components/MyContentV2/ContentTypeFilter'
import { mapState } from 'vuex'
import { MyContentEvent } from '@/components/MyContent/MyContentEventBus'
import EventBus from '@/utils/eventBus'
import CustomSearchInput from '@/components/Common/CustomSearchInput'

export default {
  name: 'CreatedByMeV2',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: { CustomSearchInput, ContentTypeFilter, UserProfileAvatar, GlobalSearchInput, RadioSwitch, NoMoreResources, ContentPublish, ContentItem, ContentFilter, CreateNew },
  data () {
    return {
      menuList: [
        {
          name: 'Created by me',
          type: SourceType.CreatedByMe
        },
        {
          name: 'Shared by me',
          type: SourceType.SharedByMe
        },
        {
          name: 'Shared by others',
          type: SourceType.SharedByOthers
        },
        {
          name: 'Archived',
          type: SourceType.Archived
        }
      ],
      sourceType: SourceType,
      shareType: SourceType.CreatedByMe,
      loading: true,
      myContentList: [],
      filterType: null,
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
  computed: {
    ...mapState({
      info: state => state.user.info,
      school: state => state.user.school,
      userMode: state => state.app.userMode
    })
  },
  created() {
    if (this.$route.query.shareType) {
      this.shareType = parseInt(this.$route.query.shareType)
    }
    this.loadMyContent()
  },
  methods: {
    handleSchoolChange() {
      this.$logger.info('handleSchoolChange called')
      this.pageNo = 1
      this.loadMyContent()
    },
    handleModeChange(userMode) {
      // 模式切换，个人还是学校 个人接口
      // if (userMode === USER_MODE.SELF) {
      //   this.pageNo = 1
      //   this.loadMyContent()
      // }
    },
    handleSearch (data) {
      this.$logger.info('handleSearch', data)
      this.searchText = data
      this.pageNo = 1
      this.loadMyContent()
    },
    loadMyContent () {
      this.loading = true
      let params = {
        shareType: this.shareType === this.sourceType.Archived ? this.sourceType.CreatedByMe : this.shareType,
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize,
        searchKey: this.searchText ? this.searchText : '',
        types: this.filterType ? [this.filterType] : [],
        delFlag: this.shareType === this.sourceType.Archived ? 1 : 0,
        schoolId: this.school
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
    handleSelectShareType(item) {
      this.shareType = item.type
      this.loadMyContent()
    },

    handleUpdateFilterType (filterType) {
      this.$logger.info('handleUpdateFilterType', filterType)
      this.filterType = filterType
      this.pageNo = 1
      this.loadMyContent()
    }
  },
  mounted() {
    EventBus.$on(MyContentEvent.ReloadMyContent, this.loadMyContent)
  },
  beforeDestroy() {
    EventBus.$off(MyContentEvent.ReloadMyContent, this.loadMyContent)
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

    @media screen and (max-width: 1300px) {
     /deep/ .radio-item {
        font-size:12px;
      }
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
