<template>
  <div class="library-iframe-container">
    <div class='library-search'>
      <div class='create-new'>
        <a-space>
          <global-search-input @search='handleSearch' />
          <user-profile-avatar />
        </a-space>
      </div>
    </div>
    <div class='library-iframe-wrapper'>

      <card-list
        title="Recommendation For You"
        sub-title='Based on the curriculum, subjects and grades you chose'
        title-position='center'
        category="recommended"
        :list="recommendList"
        :card-size="20"
        :inner-desc="false"
        :outer-desc="true"
        v-show="recommendList.length > 0" />

      <card-list
        title="Latest published"
        sub-title='Recently designed and published by certified educators'
        title-position='center'
        category="released"
        :list="lastPublishedList"
        :card-size="20"
        :inner-desc="true"
        :outer-desc="false"
        v-show="lastPublishedList.length > 0" />

      <card-list
        title="Explore by Professional development"
        category="pd"
        :list="pdList"
        :card-size="15"
        :inner-desc="false"
        :outer-desc="true"
        v-show="pdList.length > 0" />

      <card-list
        title="Explore by Unit Plans"
        category="plan"
        :list="unitList"
        :card-size="15"
        :inner-desc="false"
        :outer-desc="true"
        v-show="unitList.length > 0" />

      <card-list
        title="Explore by Tasks"
        category="task"
        :list="taskList"
        :card-size="15"
        :inner-desc="false"
        :outer-desc="true"
        v-show="taskList.length > 0" />
    </div>
  </div>
</template>

<script>

import GlobalSearchInput from '@/components/GlobalSearch/GlobalSearchInput'
import UserProfileAvatar from '@/components/User/UserProfileAvatar'
import { mapState } from 'vuex'
import CardList from '@/components/LibraryV3/CardList'
import { getLibraryRecommend, getLibraryResource, getLibraryPDContent } from '@/api/v2/library'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

export default {
  name: 'Library',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: { CardList, UserProfileAvatar, GlobalSearchInput },
  data () {
    return {
      recommendList: [],
      lastPublishedList: [],
      unitList: [],
      pdList: [],
      taskList: []
    }
  },
  computed: {
    ...mapState({
      currentSchool: state => state.user.currentSchool
    })
  },
  created() {
    this.initData()
  },
  methods: {

    handleSchoolChange() {
      console.info('handleSchoolChange called')
      this.initData()
    },

    initData () {
      console.log('initData library page')
      this.getLibraryRecommend()
      this.getLibraryResource()
      this.getLibraryPd()
    },

    async getLibraryRecommend() {
      const ret = await getLibraryRecommend({ schoolId: 0 })
      console.log('getLibraryRecommend', ret.result)
      this.recommendList = ret.result || []
    },

    async getLibraryResource () {
      const ret = await getLibraryResource({ schoolId: 0 })
      console.log('getLibraryResource', ret.result)
      this.lastPublishedList = ret.result.latestReleased || []
      this.unitList = ret.result.plans || []
      // this.pdList = ret.result.pds || []
      this.taskList = ret.result.tasks || []
    },

    async getLibraryPd() {
      const ret = await getLibraryPDContent({ schoolId: 0 })
      console.log('getLibraryPd', ret.result)
      this.pdList = ret.result || []
    },

    handleSearch (data) {
      console.info('handleSearch', data)
      if (data && data.length >= 2) {
        this.$router.push({ path: '/teacher/library/search/' + data })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.library-iframe-container {
  background-color: #fff;
  height: 100vh;
  width: 100%;
  .library-search {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
    height: 80px;
    width: 100%;
  }

  .library-iframe-wrapper {
    height: calc(100vh - 80px);
    overflow-y: auto;
    width: 100%;
    padding: 0 100px;
  }
}
</style>
