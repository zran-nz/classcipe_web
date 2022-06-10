<template>
  <div class='search-result'>
    <div class='library-search'>
      <div class='create-new'>
        <a-space>
          <global-search-input @search='handleSearch' />
          <user-profile-avatar />
        </a-space>
      </div>
    </div>
    <div class='content-wrapper'>
      <a-spin tip='Loading...' :spinning="searching">
        <div class='content-list'>
          <template v-if='list.length !== 0 && !searching'>
            <content-item v-for='item in list' :key='item.id' :content='item' :show-button='false'></content-item>
          </template>
          <template v-if='list.length === 0 && !searching'>
            <div class='empty-tips'>
              <common-no-data />
            </div>
            <div class='go-back'>
              <a-button shape='round' @click='$router.go(-1)' type='primary'>Go Back</a-button>
            </div>
          </template>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script>
import GlobalSearchInput from '@/components/GlobalSearch/GlobalSearchInput'
import UserProfileAvatar from '@/components/User/UserProfileAvatar'
import ContentItem from '@/components/MyContentV2/ContentItem'
import CommonNoData from '@/components/Common/CommonNoData'
import { QueryContentsFilter } from '@/api/library'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { mapState } from 'vuex'

export default {
  name: 'ResourceSearch',
  components: {
    CommonNoData,
    ContentItem,
    UserProfileAvatar,
    GlobalSearchInput
  },
  props: {
    keyword: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      searching: true,
      searchKeyword: this.keyword,
      list: []
    }
  },
  computed: {
    ...mapState({
      school: state => state.user.school
    })
  },
  mixins: [ UserModeMixin ],
  created() {
    this.$logger.info('LibrarySearch: created', this.searchKeyword)
    this.handleDoSearch()
  },
  methods: {
    handleDoSearch () {
      this.searching = true
      QueryContentsFilter({
        searchKey: this.searchKeyword,
        schoolId: this.school
      }).then(response => {
        this.$logger.info('QueryContentsFilter result : ', response)
        this.dataList = response.result ? response.result : []
      }).finally(() => {
        this.searching = false
      })
    },

    handleSearch(keyword) {
      this.$logger.info('LibrarySearch handleSearch', keyword)
      this.searchKeyword = keyword
      this.handleDoSearch()
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.search-result {
  padding: 15px;
  background: #fff;
  height: 100%;
  .library-search {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    .create-new {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
    }
  }

  .content-wrapper {
    min-height: calc(100vh - 160px);
    .content-list {
      min-height: calc(100vh - 200px);

      .empty-tips {
        min-height: 120px;
        height: calc(100vh - 300px);
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

.go-back {
  text-align: center;
  margin-top: 10px;
}
</style>
