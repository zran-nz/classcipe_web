<template>
  <div class="my-content">
    <div class="filter-line">
      <div class='header-title'>
        <div class='back-icon' @click='goBack'>
          <a-icon type="left" />
        </div>
        <div class='category-title'>
          Library
        </div>
      </div>
      <div class='create-new'>
        <a-space>
          <custom-search-input :round='false' :value.sync='queryParams.searchKey' @search='loadMyContent' placeholder='Search your content'/>
          <common-content-filter
            @update-filter='handleUpdateFilter'
            :show-fa-sa-activity-type="true"
            :show-content-type="true"
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
          <template v-if='(!pagination.total || pagination.total === 0) && !loading'>
            <div class='empty-tips'>
              <!-- <no-more-resources /> -->
              <common-no-data text='No Data Found!' :isBig="true">
                <template v-slot:icon>
                  <no-content />
                </template>
              </common-no-data>
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
import { CommonFilterMixin } from '@/mixins/CommonFilterMixin'
import CommonContentFilter from '@/components/Common/CommonContentFilter'
import PdContentFilter from '@/components/Common/PdContentFilter'
import { QueryContentsFilter } from '@/api/library'
import CommonNoData from '@/components/Common/CommonNoData'
import NoContent from '@/assets/v2/icons/no_content.svg?inline'

export default {
  name: 'LibraryAll',
  props: {
    keyword: {
      type: String,
      default: null
    }
  },
  components: {
    PdContentFilter,
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
    NoMoreResources,
    CommonNoData,
    NoContent
  },
  computed: {
    ...mapState({
      school: state => state.user.school
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
      filterParams: {},

      typeMap: typeMap,

      viewPreviewSessionVisible: false,
      PPTCommentPreviewVisible: false,
      classList: [],
      lessonSelectTagVisible: false,
      sessionTags: [],
      sessionItem: {},
      startLoading: false,
      userTags: {}
    }
  },
  created () {
    this.queryParams.searchKey = this.keyword
    this.loadMyContent(true)
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
    loadMyContent (init = false) {
      this.loading = true
      let params = JSON.parse(JSON.stringify(this.queryParams))
      params.curriculumId = this.$store.getters.bindCurriculum
      if (init) {
        params = { searchKey: this.keyword, schoolId: 0 }
      }
      QueryContentsFilter(params).then(res => {
        this.$logger.info('QueryContentsFilter', res)
        if (res.result) {
          res.result.forEach((record, index) => {
            record.key = index
          })
          this.myContentList = res.result
          this.pagination.total = res.result.total || res.result.length
          this.pagination.current = res.result.current || 1
          this.pagination.pageSize = res.result.total ? 15 : res.result.length
          this.pageNo = this.pagination.current || 1
        } else {
          this.myContentList = []
          this.pagination.total = 0
        }
        this.$logger.info('QueryContentsFilter myContentList', this.myContentList)
      }).finally(() => {
        this.loading = false
      })
    },

    goBack () {
      this.$router.replace({
        path: '/teacher/library'
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
