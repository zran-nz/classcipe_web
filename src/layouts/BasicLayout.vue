<template>
  <pro-layout
    :menus="menus"
    :collapsed="collapsed"
    :mediaQuery="query"
    :isMobile="isMobile"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
    :i18nRender="i18nRender"
    v-bind="settings"
  >
    <!-- 1.0.0+ 版本 pro-layout 提供 API，
          我们推荐使用这种方式进行 LOGO 和 title 自定义
    -->
    <template v-slot:menuHeaderRender>
      <div class="home-nav">
        <div class='home-logo'>
          <img src="~@/assets/logo/logo.png" alt='classcipe' @click="goHome">
          <h1 @click="goHome">{{ title }}</h1>
        </div>
        <span class='collapse-icon' @click.stop.prevent='handleMenuCollapse'>
          <a-icon type="menu-fold" />
        </span>
      </div>
    </template>
    <!-- 1.0.0+ 版本 pro-layout 提供 API,
          增加 Header 左侧内容区自定义
    -->
    <template v-slot:menuRender>
      <teacher-nav-v2 v-show="$store.getters.currentRole === 'teacher'"></teacher-nav-v2>
      <student-nav v-show="$store.getters.currentRole === 'student'"></student-nav>
    </template>

    <!-- custom footer / 自定义Footer -->
    <!--    <template v-slot:footerRender v-if='showFooter'>-->
    <!--      <global-footer />-->
    <!--    </template>-->
    <!-- 主页面内容 -->
    <div :class="{'classcipe-main': true, 'no-full-layout': !fullLayoutFlag}">
      <router-view />
    </div>
  </pro-layout>
</template>

<script>
import { i18nRender } from '@/locales'
import { mapState } from 'vuex'
import { CONTENT_WIDTH_TYPE, SIDEBAR_TYPE } from '@/store/mutation-types'

import defaultSettings from '@/config/defaultSettings'
import RightContent from '@/components/GlobalHeader/RightContent'
import GlobalFooter from '@/components/GlobalFooter'
import * as logger from '@/utils/logger'

import TeacherNavV2 from '@/components/GlobalHeader/TeacherNavV2'
import StudentNav from '@/components/GlobalHeader/StudentNav'

export default {
  name: 'BasicLayout',
  components: {
    StudentNav,
    RightContent,
    GlobalFooter,
    TeacherNavV2
  },
  data () {
    return {
      // preview.pro.antdv.com only use.
      isProPreviewSite: process.env.VUE_APP_PREVIEW === 'true' && process.env.NODE_ENV !== 'development',
      // end

      // base
      menus: [],
      // 侧栏收起状态
      title: defaultSettings.title,
      settings: {
        // 布局类型
        layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
        // CONTENT_WIDTH_TYPE
        contentWidth: defaultSettings.layout === 'sidemenu' ? CONTENT_WIDTH_TYPE.Fluid : defaultSettings.contentWidth,
        // 主题 'dark' | 'light'
        theme: defaultSettings.navTheme,
        // 主色调
        primaryColor: defaultSettings.primaryColor,
        fixedHeader: defaultSettings.fixedHeader,
        fixSiderbar: defaultSettings.fixSiderbar,
        colorWeak: defaultSettings.colorWeak,

        hideHintAlert: false,
        hideCopyButton: false
      },
      // 媒体查询
      query: {},

      // 是否手机模式
      isMobile: false
    }
  },
  watch: {
    '$route' (to, from) {
      logger.info('route change', to, from)
      if (to.meta && this.headerDom.length) {
        if (to.meta.editPage) {
          this.showGlobalHeader(!to.meta.editPage)
        } else {
          this.showGlobalHeader(true)
        }
      }

      if (to.path === '/') {
        logger.info('go to defaultRouter ' + this.$store.getters.defaultRouter)
        this.$router.replace(this.$store.getters.defaultRouter)
      }
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters,
      collapsed: state => state.app.sideCollapsed
    }),
    fullLayoutFlag () {
      return this.$route.meta.fullLayout
    }
  },
  created () {
    logger.info('BasicLayout created, path ' + this.$route.path)
    const routes = this.mainMenu.find(item => item.path === '/')
    this.menus = (routes && routes.children) || []
    this.$logger.info('menus -> ', this.menus)
    if (this.$route.path === '/') {
      logger.info('go to defaultRouter ' + this.$store.getters.defaultRouter)
      this.$router.replace(this.$store.getters.defaultRouter)
    }
  },
  mounted () {
    this.headerDom = []
    this.headerDom = document.getElementsByTagName('header')

    if (this.$route.meta && this.headerDom.length) {
      if (this.$route.meta.editPage) {
        this.showGlobalHeader(!this.$route.meta.editPage)
      } else {
        this.showGlobalHeader(true)
      }
    }

    this.$logger.info('fullLayoutFlag', this.fullLayoutFlag)
  },
  methods: {
    i18nRender,
    handleSwitchRole (role) {
      logger.info('switch-role ' + role)
      this.$store.dispatch('ChangeRole', { role }).then(() => {
        window.location.href = '/'
      })
    },
    goHome () {
      this.$router.push('/')
    },
    onSearch () {
      this.$message.success('search something')
    },
    handleMediaQuery (val) {
      this.query = val
      if (this.isMobile && !val['screen-xs']) {
        this.$store.commit(SIDEBAR_TYPE, false)
        return
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.$store.commit(SIDEBAR_TYPE, false)
        this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
        // this.settings.fixSiderbar = false
      }
    },
    handleCollapse (val) {
      this.$logger.info('handleCollapse ' + val)
      this.$store.commit(SIDEBAR_TYPE, val)
    },
    handleSettingChange ({ type, value }) {
      console.log('type', type, value)
      type && (this.settings[type] = value)
      switch (type) {
        case 'contentWidth':
          this.settings[type] = value
          break
        case 'layout':
          if (value === 'sidemenu') {
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
          } else {
            this.settings.fixSiderbar = false
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed
          }
          break
      }
    },
    reload () {
      window.location.reload()
    },

    showGlobalHeader (visible) {
      logger.info('showGlobalHeader ' + visible)
      this.headerDom.forEach(domItem => {
        domItem.style.opacity = visible ? 1 : 0
        domItem.style['pointer-events'] = visible ? 'auto' : 'none'
      })
    },

    handleMenuCollapse () {
      this.$logger.info('handleMenuCollapse ' + this.collapsed)
      this.$store.commit(SIDEBAR_TYPE, !this.collapsed)
    }
  }
}
</script>

<style lang='less'>
@import "./BasicLayout.less";
  .home-nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    h1 {
      font-family: Inter-Bold;
    }
  }

.nav-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .nav-icon {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    svg {
      height: 28px;

      .cls-1, .cls-4 {
        fill: rgba(255, 255, 255, 1);
      }

      .cls-2, .cls-3{
        fill: none;
      }
    }
  }

  .nav-label {
    cursor: pointer;
    user-select: none;
    font-size: 13px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    font-family: Inter-Bold;
  }
}

.router-link-active {
  .nav-item {
    .nav-icon {
      svg {
        .cls-1, .cls-4 {
          fill: #15c39a;
        }

        .cls-2, .cls-3{
          fill: none;
        }
      }
    }

    .nav-label {
      color: #fff;
    }
  }
}

.collapse-icon {
  padding-right: 10px;
  color: @text-color-secondary-dark;

  &:hover {
    color: @primary-color;
  }
}

.ant-pro-sider-menu-logo svg {
  width: 20px;
  height: 20px;
}

</style>
