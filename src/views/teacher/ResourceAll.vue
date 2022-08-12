<template>
  <div class="my-content">
    <div class="filter-line">
      <div class='header-title'>
        <div class='back-icon' @click='goBack'>
          <a-icon type="left" />
        </div>
        <div class='category-title' v-if='categoryDisplayMap && category'>
          {{ categoryDisplayMap[category] }}
        </div>
      </div>
      <div class='create-new'>
        <a-space>
          <custom-search-input :round='false' :value.sync='queryParams.searchKey' @search='loadMyContent' placeholder='Search your content'/>
          <common-content-filter
            @update-filter='handleUpdateFilter'
            :show-fa-sa-activity-type="category === 'task'"
          />
          <user-profile-avatar />
        </a-space>
      </div>
    </div>
    <div class='content-wrapper'>
      <a-spin tip='Loading...' :spinning="loading">
        <div class='content-list'>
          <template v-if='pagination.total !== 0 && !loading'>
            <library-content-item v-for='item in myContentList' :key='item.id' :content='item'></library-content-item>
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
import { typeMap } from '@/const/teacher'
import ContentStatusIcon from '@/components/Teacher/ContentStatusIcon'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { queryAllResource } from '@/api/v2/library'
import ModalHeader from '@/components/Common/ModalHeader'
import { USER_MODE } from '@/const/common'
import CommonPreviewV2 from '@/components/Common/CommonPreviewV2'
import CustomTag from '@/components/UnitPlan/CustomTag'
import RadioSwitch from '@/components/Common/RadioSwitch'
import NoMoreResources from '@/components/Common/NoMoreResources'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'
import GlobalSearchInput from '@/components/GlobalSearch/GlobalSearchInput'
import UserProfileAvatar from '@/components/User/UserProfileAvatar'
import CustomSearchInput from '@/components/Common/CustomSearchInput'
import ContentTypeFilter from '@/components/MyContentV2/ContentTypeFilter'
import LibraryContentItem from '@/components/MyContentV2/LibraryContentItem'
import { mapState } from 'vuex'
import CommonContentFilter from '@/components/Common/CommonContentFilter'
import { CommonFilterMixin } from '@/mixins/CommonFilterMixin'

export default {
  name: 'ResourceAll',
  props: {
    category: {
      type: String,
      required: true,
      validator: (category) => [ 'recommended', 'released', 'plan', 'task', 'pd' ].indexOf(category) !== -1
    }
  },
  components: {
    CommonContentFilter,
    LibraryContentItem,
    ContentTypeFilter,
    CustomSearchInput,
    UserProfileAvatar,
    GlobalSearchInput,
    RadioSwitch,
    CommonPreviewV2,
    ContentStatusIcon,
    ContentTypeIcon,
    ModalHeader,
    CustomTag,
    NoMoreResources
  },
  computed: {
    ...mapState({
      currentSchool: state => state.user.currentSchool
    })
  },
  mixins: [ UserModeMixin, CurrentSchoolMixin, CommonFilterMixin ],
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
          this.pageNo = page
          this.loadMyContent()
        },
        showTotal: total => `Total ${total} items`,
        total: 0,
        pageSize: 15
      },
      pageNo: 1,

      searchText: '',

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

      categoryDisplayMap: {
        recommended: 'Recommended',
        released: 'Released',
        plan: 'Unit Plan',
        task: 'Task',
        pd: 'PD Content'
      }
    }
  },
  created () {
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
      const params = JSON.parse(JSON.stringify(this.queryParams))
      params.pageSize = 15
      params.pageNo = this.pageNo
      this.$logger.info('ResourceAll queryAllResource params', params)
      queryAllResource(params).then(res => {
        this.$logger.info('queryAllResource', res)
        if (res.result && res.result.records && res.result.records.length) {
          res.result.records.forEach((record, index) => {
            record.key = index
          })
          this.myContentList = res.result.records
          this.pagination.total = res.result.total
          this.pagination.current = res.result.current
          this.pageNo = this.pagination.current
        } else {
          this.myContentList = []
          this.pagination.total = 0
        }
        this.$logger.info('LibraryAll myContentList', this.myContentList)
      }).finally(() => {
        this.loading = false
      })
    },

    goBack () {
      this.$router.replace({
        path: '/teacher/resource'
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
  .filter-line {
    display: flex;
    justify-content: space-between;

    .header-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      .back-icon {
        cursor: pointer;
      }

      .category-title {
        padding-left: 10px;
        font-size: 20px;
        color: #333;
        font-weight: bold;
      }
    }

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
