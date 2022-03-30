<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%' }" :style="{ height: '100%' }">
    <a-layout>
      <a-layout-sider>
        <div class="nav-bar-left">
          <s-menu
            :mainRouter="mainRouter"
            :currentRouterName="currentRouterName"
            :initSelected="selectedKey"
            :hiddenRoute="hiddenRoute"
          />
        </div>
      </a-layout-sider>
      <a-layout-content class="main-content">
        <router-view />
      </a-layout-content>
    </a-layout>
    <AddPreference />
  </a-card>
</template>

<script>
import AddPreference from './AddPreference.vue'
import { mapState } from 'vuex'

import SMenu from '@/components/SideBar/SMenu'

export default {
  name: 'Main',
  components: {
    SMenu,
    AddPreference
  },
  data() {
    return {
      selectedKey: '/student/main/my-task',
      quickSessionVisible: false,
      currentRouterName: 'student',
      mainRouter: 'Main',
      openKeys: []
    }
  },
  computed: {
    ...mapState({
      userMode: state => state.app.userMode,
      user: state => state.user
    })
  },
  mounted() {},
  methods: {
    hiddenRoute(route) {
      return route.meta.mode && route.meta.mode !== this.userMode
    }
  }
}
</script>

<style lang="css">
.nav-bar-left .ant-badge-count {
  right: 5px;
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  color: #fff;
  font-size: 10px;
  line-height: 16px;
  border-radius: 10px;
}
</style>

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

.main-content {
  min-width: 1050px;
}

.nav-bar-left {
  height: 100%;
  box-sizing: border-box;
  padding-right: 5px;
  /deep/ .nav-bar-item {
    font-family: Inter-Bold;
    font-size: 14px;
    cursor: pointer;
    background-image: url('~@/assets/icons/myContent/Rectangle@2x.png');
    background-repeat: repeat;
    background-size: cover;
    margin: 0!important;
    height: 50px;
    line-height: 50px;

    a {
      display: flex;
      align-items: center;
      width: 100%;
      line-height: 30px;
      padding: 10px 0px;
      color: #000000;

      svg {
        width: 50px;
      }
    }

    &:hover {
      background: #edf1f5!important;
      a {
        color: @primary-color;
      }
    }
    .nav-bar-icon {
      font-size: 30px;
      width: 50px;
      margin: 0;
      color: #f35;
    }
    .ant-menu-submenu-title {
      margin: 0!important;
      height: 50px;
      line-height: 50px;
    }
  }

  /deep/ .selected-nav-bar {
    background: #edf1f5!important;
    a {
      color: @primary-color;
      font-weight: bold;
    }
  }
}
</style>
