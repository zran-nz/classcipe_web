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

      <card-list title="Recommend" category="recommended" :list="recommendList" :card-size="30" v-show="recommendList.length > 0" />

      <card-list
        title="Latest published"
        category="released"
        :list="lastPublishedList"
        :card-size="27"
        :inner-desc="true"
        v-show="lastPublishedList.length > 0" />

      <card-list
        title="Professional development"
        category="pd"
        :list="pdList"
        :card-size="22"
        :inner-desc="true"
        :outer-desc="false"
        v-show="pdList.length > 0" />

      <card-list
        title="Unit Plan"
        category="plan"
        :list="unitList"
        :card-size="22"
        :inner-desc="true"
        :outer-desc="false"
        v-show="unitList.length > 0" />

      <card-list
        title="Task"
        category="task"
        :list="taskList"
        :card-size="22"
        :inner-desc="true"
        :outer-desc="false"
        v-show="taskList.length > 0" />
    </div>
  </div>
</template>

<script>

import GlobalSearchInput from '@/components/GlobalSearch/GlobalSearchInput'
import UserProfileAvatar from '@/components/User/UserProfileAvatar'
import { mapState } from 'vuex'
import CardList from '@/components/LibraryV3/CardList'
import { getLibraryRecommend, getLibraryResource } from '@/api/v2/library'
import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

export default {
  name: 'Resource',
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
      this.$logger.info('handleSchoolChange called')
      this.initData()
    },

    initData () {
      console.log('initData library page')
      this.getLibraryRecommend()
      this.getLibraryResource()
    },

    async getLibraryRecommend() {
      const ret = await getLibraryRecommend({
        schoolId: this.schoolId
      })
      console.log('getLibraryRecommend', ret.result)
      this.recommendList = ret.result || []
    },

    async getLibraryResource () {
      const ret = await getLibraryResource({
        schoolId: this.schoolId
      })
      console.log('getLibraryResource', ret.result)
      this.lastPublishedList = ret.result.latestReleased || []
      this.unitList = ret.result.plans || []
      this.pdList = ret.result.pds || []
      this.taskList = ret.result.tasks || []
    },

    handleSearch (data) {
      this.$logger.info('handleSearch', data)
      if (data && data.length >= 3) {
        this.$router.push({ path: '/teacher/resource/search/' + data })
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
    padding: 15px 20px;
  }
}
</style>
