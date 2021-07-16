<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%' }" :style="{ height: '100%' }">
    <a-layout>
      <a-layout-sider>
        <div class="nav-bar-left">
          <div class="nav-bar-wrapper">
            <div :class="{'nav-bar-item': true, 'selected-nav-bar' : selectedKey === '/expert/main/created-by-me'}">
              <router-link to="/expert/main/created-by-me">
                <a-icon type="container" :theme="selectedKey === '/expert/main/created-by-me' ? 'filled': 'outlined'"/>
                {{ $t('teacher.main.created-by-me') }}
              </router-link>
            </div>
            <div :class="{'nav-bar-item': true, 'selected-nav-bar' : selectedKey === '/expert/main/my-favorite'}">
              <router-link to="/expert/main/my-favorite">
                <a-icon type="like" :theme="selectedKey === '/expert/main/my-favorite' ? 'filled': 'outlined'" />
                {{ $t('teacher.main.my-favorite') }}
              </router-link>
            </div>
            <div :class="{'nav-bar-item': true, 'selected-nav-bar' : selectedKey === '/expert/main/shared'}">
              <router-link to="/expert/main/shared">
                <a-icon type="share-alt"/>
                {{ $t('teacher.main.shared') }}
              </router-link>
            </div>
            <a-divider />
            <div :class="{'nav-bar-item': true, 'selected-nav-bar' : selectedKey === '/expert/main/discover'}">
              <router-link to="/expert/main/discover">
                <a-icon type="compass" :theme="selectedKey === '/expert/main/discover' ? 'filled': 'outlined'" />
                {{ $t('teacher.main.discover') }}
              </router-link>
            </div>
            <div :class="{'nav-bar-item': true, 'selected-nav-bar' : selectedKey === '/expert/main/subscribes'}">
              <router-link to="/expert/main/subscribes">
                <a-icon type="star" :theme="selectedKey === '/expert/main/subscribes' ? 'filled': 'outlined'" />
                {{ $t('teacher.main.subscribes') }}
              </router-link>
            </div>
            <div :class="{'nav-bar-item': true, 'selected-nav-bar' : selectedKey === '/expert/main/popular'}">
              <router-link to="/expert/main/popular">F
                <a-icon type="alert" :theme="selectedKey === '/expert/main/popular' ? 'filled': 'outlined'" />
                {{ $t('teacher.main.popular') }}
              </router-link>
            </div>
          </div>
        </div>
      </a-layout-sider>
      <a-layout-content class="main-content">
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
      selectedKey: '/expert/main/created-by-me'
    }
  },
  watch: {
    '$route.path' (to) {
      logger.debug('My Content route.path change ' + to)
      this.selectedKey = to
    }
  },
  computed: {
  },
  created () {
    this.selectedKey = this.$route.path
    logger.info('selectedKey ', this.selectedKey)
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>

@black: #000;
@primary-color: #15c39a;
@text-color-secondary: fade(@black, 45%);
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
  box-sizing: border-box;
  .nav-bar-wrapper {
    .nav-bar-item {
      margin: 10px 0;
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;

      a {
        display: inline-block;
        height: 50px;
        line-height: 30px;
        border-radius: 25px;
        padding: 10px 20px;
        color: @text-color-secondary;
        &:hover {
          color: @primary-color;
        }
      }

      &:hover {
        a {
          background-color: fade(@primary-color, 10%);
          color: @primary-color;
        }
      }
    }

    .selected-nav-bar {
      a {
        background-color: fade(@primary-color, 10%);
        color: @primary-color;
        border-radius: 25px;
      }
    }
  }
}

</style>
