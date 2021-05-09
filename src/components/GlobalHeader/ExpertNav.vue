<template>
  <div class="top-nav expert-nav">
    <div class="nav-left">
      <div class="nav-items search-box">
        <a-input-search placeholder="input search text" style="width: 200px" v-model="searchText" @search="triggerSearch" @pressEnter="triggerSearch"/>
      </div>
      <div class="nav-items menu-list teacher-nav-items">
        <a-menu mode="horizontal" theme="dark" :defaultSelectedKeys="defaultSelectedKeys">
          <a-menu-item key="/expert/library">
            <router-link to="/expert/library">
              <a-icon type="profile" /> {{ $t('menu.library') }}
            </router-link>
          </a-menu-item>
          <!--          <a-menu-item>-->
          <!--            <router-link to="/expert/my-content">-->
          <!--              <a-icon type="pushpin" /> {{ $t('menu.my-content') }}-->
          <!--            </router-link>-->
          <!--          </a-menu-item>-->
        </a-menu>
      </div>
    </div>
    <div class="nav-right">
      <div class="add-new">
        <a-dropdown>
          <a-button type="primary" icon="plus" >
            Add new
          </a-button>
          <a-menu slot="overlay">
            <a-menu-item>
              <router-link to="/expert/add-topic">
                Topic
              </router-link>
            </a-menu-item>
            <a-menu-item>
              <router-link to="/expert/add-material">
                Material
              </router-link>
            </a-menu-item>
            <a-menu-item>
              <router-link to="/expert/add-task">
                Task
              </router-link>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>
<script>

import * as logger from '@/utils/logger'

export default {
  name: 'ExpertNav',
  data () {
    return {
      searchText: null,
      defaultSelectedKeys: []
    }
  },
  mounted () {
    this.defaultSelectedKeys.push(this.$route.path)
  },
  methods: {
    triggerSearch () {
      logger.info('expert triggerSearch ' + this.searchText)
      this.$emit('triggerSearch', 'teacher', this.searchText)
    }
  }
}
</script>
