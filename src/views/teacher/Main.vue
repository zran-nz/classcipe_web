<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 0', height: '100%' }" :style="{ height: '100%' }">
    <a-layout>
      <a-layout-sider>
        <div class="nav-bar-left">
          <a-menu mode="inline" :defaultSelectedKeys="defaultSelectedKeys" :selectedKeys="selectedKeys">
            <a-menu-item key="/teacher/main/my-content">
              <router-link to="/teacher/main/my-content">
                <a-icon type="container" />
                My Content
              </router-link>
            </a-menu-item>
            <a-menu-item key="/teacher/main/favorites">
              <router-link to="/teacher/main/favorites">
                <a-icon type="star" />
                Favorites
              </router-link>
            </a-menu-item>
            <a-menu-item key="/teacher/main/my-subscribes">
              <router-link to="/teacher/main/my-subscribes">
                <a-icon type="flag" />
                My Subscribes
              </router-link>
            </a-menu-item>
          </a-menu>
        </div>
      </a-layout-sider>
      <a-layout-content>
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-card>
</template>

<script>
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import * as logger from '@/utils/logger'

export default {
  name: 'Main',
  components: {
    PageHeaderWrapper
  },
  data () {
    return {
      defaultSelectedKeys: [],
      selectedKeys: []
    }
  },
  watch: {
    '$route.path' (to) {
      logger.debug('My Content route.path change ' + to)
      this.selectedKeys = [to]
    }
  },
  computed: {
  },
  created () {
    this.defaultSelectedKeys = [this.$route.path]
    this.selectedKeys = [this.$route.path]
    logger.info('defaultSelectedKeys ', this.defaultSelectedKeys)
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>

.ant-layout-sider {
  background: #fff;
  min-height: 400px;
}

.ant-layout-content {
  background: #fff;
  padding: 0 15px;
  min-height: 400px;
  box-sizing: border-box;
}

.nav-bar-left {
  height: 100%;
  border-right: 1px solid #e8e8e8;
  .ant-menu-inline, .ant-menu-vertical, .ant-menu-vertical-left {
    border-right: unset;
  }
}
</style>
