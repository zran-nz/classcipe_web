<template>
  <div class="my-content">
    <div class="filter-line">
      <radio-switch @select="toggleType" :menu-list='menuList'/>
      <div class='create-new'>
        <a-space>
          <custom-search-input :round='false' :value.sync='searchText' @search='handleSearch' placeholder='Search your content'/>
          <user-profile-avatar />
        </a-space>
      </div>
    </div>
    <div class='content-wrapper'>
      <a-spin tip='Loading...' :spinning="loading">
        <div class='content-list'>
          <template v-if='pagination.total !== 0 && !loading'>
            <favorite-content-item v-for='item in myContentList' :key='item.id' :content='item' @delete='handleDeleteItem' @duplicate='handleDuplicateItem'></favorite-content-item>
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
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { Duplicate } from '@/api/teacher'
import { typeMap } from '@/const/teacher'
import ContentStatusIcon from '@/components/Teacher/ContentStatusIcon'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { FavoritesDelete, FavoritesGetMyFavorites } from '@/api/favorites'
import ModalHeader from '@/components/Common/ModalHeader'
import { USER_MODE } from '@/const/common'
import CommonPreviewV2 from '@/components/Common/CommonPreviewV2'
import ClassList from '@/components/Teacher/ClassList'
import CustomTag from '@/components/UnitPlan/CustomTag'
import { GoogleAuthCallBackMixin } from '@/mixins/GoogleAuthCallBackMixin'
import ContentItem from '@/components/MyContentV2/ContentItem'
import FavoriteContentItem from '@/components/MyContentV2/FavoriteContentItem'
import RadioSwitch from '@/components/Common/RadioSwitch'
import NoMoreResources from '@/components/Common/NoMoreResources'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import GlobalSearchInput from '@/components/GlobalSearch/GlobalSearchInput'
import UserProfileAvatar from '@/components/User/UserProfileAvatar'
import CustomSearchInput from '@/components/Common/CustomSearchInput'
import ContentTypeFilter from '@/components/MyContentV2/ContentTypeFilter'

export default {
  name: 'MyFavorite',
  components: {
    ContentTypeFilter,
    CustomSearchInput,
    UserProfileAvatar,
    GlobalSearchInput,
    RadioSwitch,
    FavoriteContentItem,
    ContentItem,
    CommonPreviewV2,
    ContentStatusIcon,
    ContentTypeIcon,
    ModalHeader,
    ClassList,
    CustomTag,
    NoMoreResources
  },
  mixins: [ GoogleAuthCallBackMixin, UserModeMixin, CurrentSchoolMixin ],
  data () {
    return {
      loading: true,
      myContentList: [],
      currentType: null,

      previewCurrentId: '',
      previewType: '',
      currentPreviewLesson: null,

      searchKey: null,
      pagination: {
        onChange: page => {
          logger.info('pagination onChange', page)
          this.pageNo = page
          this.loadMyContent()
        },
        showTotal: total => `Total ${total} items`,
        total: 0,
        pageSize: 15
      },
      pageNo: 1,

      searchText: '',
      filterParams: {},

      typeMap: typeMap,

      viewPreviewSessionVisible: false,
      PPTCommentPreviewVisible: false,
      classList: [],
      lessonSelectTagVisible: false,
      sessionTags: [],
      sessionItem: {},
      startLoading: false,
      userTags: {},

      customTagList: [],

      menuList: [
        {
          name: 'All types',
          type: null
        },
        {
          name: 'Unit Plan',
          type: this.$classcipe.typeMap['unit-plan']
        },
        {
          name: 'Task',
          type: this.$classcipe.typeMap['task']
        }
      ]
    }
  },
  computed: {
  },
  created () {
    logger.info('teacher my content')
    this.loadMyContent()
  },
  methods: {
    handleSchoolChange() {
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
    loadMyContent () {
      this.loading = true
      let params = {
        shareType: this.shareType,
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize,
        searchKey: this.searchText ? this.searchText : '',
        types: this.currentType ? [this.currentType] : [],
        delFlag: 0,
        schoolId: this.school
      }
      if (this.filterParams) {
        params = Object.assign(this.filterParams, params)
      }

      if (this.currentType) {
        params.type = this.currentType
      }
      FavoritesGetMyFavorites(params).then(res => {
        logger.info('FavoritesGetMyFavorites', res)
        if (res.result && res.result.records && res.result.records.length) {
          res.result.records.forEach((record, index) => {
            record.key = index
          })
          this.myContentList = res.result.records
          this.pagination.total = res.result.total
          this.pagination.current = res.result.current
        } else {
          this.myContentList = []
          this.pagination.total = 0
        }
        logger.info('myContentList', this.myContentList)
      }).finally(() => {
        this.loading = false
      })
    },
    toggleType (item) {
      logger.info('toggleType ', item)
      this.currentType = item.type
      this.loadMyContent()
    },

    handleEditItem (item) {
      logger.info('handleEditItem', ...item)
      if (item.type === typeMap['unit-plan']) {
        this.$router.push({
          path: '/teacher/unit-plan-redirect/' + item.id
        })
      } else if (item.type === typeMap.task) {
        this.$router.push({
          path: '/teacher/task-redirect/' + item.id
        })
      } else if (item.type === typeMap.evaluation) {
        this.$router.push({
          path: '/teacher/evaluation-redirect/' + item.id
        })
      }
    },

    handleDuplicateItem (data) {
      this.$logger.info('handleDuplicateItem', data)
      const item = data.content
      this.$confirm({
        title: 'Confirm duplicate',
        content: 'Are you sure to duplicate ' + item.name + ' ?',
        centered: true,
        onOk: () => {
          Duplicate({ id: item.id, type: item.type }).then((response) => {
            if (response.code !== this.ErrorCode.ppt_google_token_expires && response.code !== this.ErrorCode.ppt_forbidden) {
              this.$logger.info('Duplicate response', response)
              this.$message.success('Duplicate successfully! Please check in My Content.')
            } else {
              this.currentMethodName = 'handleDuplicateItem'
              this.currentMethodParam = data
            }
          })
        }
      })
    },

    handleAuthCallback () {
      this.$logger.info('Shared handleAuthCallback')
      if (this.currentMethodName === 'handleDuplicateItem') {
        this.handleDuplicateItem(this.currentMethodParam)
      }
    },
    handleDeleteItem (item) {
      logger.info('handleDeleteItem', item)
      FavoritesDelete(item).then(res => {
        logger.info('DeleteMyContentByType', res)
      }).then(() => {
        this.loadMyContent()
      })
    },

    handleSearch (data) {
      this.$logger.info('handleSearch', data)
      this.searchText = data
      this.pageNo = 1
      this.loadMyContent()
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.my-content {
  padding: 15px;
  background: #fff;
  .filter-line {
    display: flex;
    justify-content: space-between;

    .type-owner {
      height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .create-new {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
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
