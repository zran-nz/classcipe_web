<template>
  <pro-layout
    :menus="menus"
    :collapsed="collapsed"
    :mediaQuery="query"
    :isMobile="isMobile"
    :siderWidth="$classcipe.sysConfig.sidebarWidth"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
    :i18nRender="i18nRender"
    v-bind="settings"
  >
    <!-- 1.0.0+ 版本 pro-layout 提供 API，
          我们推荐使用这种方式进行 LOGO 和 title 自定义
    -->
    <template v-slot:menuHeaderRender>
      <div class="home-nav" @click="goHome">
        <img src="~@/assets/logo/50.png" class='single-logo-img' alt='classcipe' />
        <div class='home-title'>
          <div class='classcipe-title'>Classcipe</div>
          <div class='classcipe-type'>
            <template v-if='userMode === USER_MODE.SCHOOL'>
              {{ currentSchool.schoolName }}
            </template>
            <template v-if='userMode === USER_MODE.SELF'>
              Personal
            </template>
          </div>
        </div>
      </div>
    </template>
    <!-- 1.0.0+ 版本 pro-layout 提供 API,
          增加 Header 左侧内容区自定义
    -->
    <template v-slot:menuRender>
      <teacher-nav-v2 v-if="!noSidebar"></teacher-nav-v2>
      <!-- <student-nav v-if="$store.getters.currentRole === 'student' && !noSidebar"></student-nav> -->
    </template>

    <!-- custom footer / 自定义Footer -->
    <!--    <template v-slot:footerRender v-if='showFooter'>-->
    <!--      <global-footer />-->
    <!--    </template>-->
    <!-- 主页面内容 -->
    <div class='cc-main-content'>
      <keep-alive v-if="keepAlive">
        <router-view />
      </keep-alive>
      <router-view v-else />
    </div>
  </pro-layout>
</template>

<script>
import { i18nRender } from '@/locales'
import { mapState } from 'vuex'
import { CONTENT_WIDTH_TYPE, HIDDEN_SIDEBAR } from '@/store/mutation-types'

import defaultSettings from '@/config/defaultSettings'
import GlobalFooter from '@/components/GlobalFooter'
import * as logger from '@/utils/logger'
import TeacherNavV2 from '@/components/GlobalHeader/TeacherNavV2'
import StudentNav from '@/components/GlobalHeader/StudentNav'
import { USER_MODE } from '@/const/common'

export default {
  name: 'BasicLayout',
  components: {
    StudentNav,
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
      isMobile: false,
      USER_MODE: USER_MODE,
      noSidebar: false
    }
  },
  watch: {
    '$route': {
      handler(to, from) {
        logger.info('route change', to, from)
        if (to.meta && this.headerDom && this.headerDom.length) {
          if (to.meta.editPage) {
            this.showGlobalHeader(!to.meta.editPage)
          } else {
            this.showGlobalHeader(true)
          }
        }

        setTimeout(() => {
          if (to.meta && to.meta.noSidebar) {
            if (document.querySelector('.ant-pro-basicLayout')) {
              document.querySelector('.ant-pro-basicLayout').classList.add('no-side')
            }
          } else {
            if (document.querySelector('.ant-pro-basicLayout')) {
              document.querySelector('.ant-pro-basicLayout').classList.remove('no-side')
            }
          }
        }, 100)

        if (to.path === '/') {
          logger.info('go to defaultRouter ' + this.$store.getters.defaultRouter)
          this.$router.replace(this.$store.getters.defaultRouter)
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters,
      collapsed: state => state.app.sideCollapsed,
      currentSchool: state => state.user.currentSchool,
      userMode: state => state.app.userMode,
      currentRole: state => state.user.currentRole
    }),
    keepAlive () {
      return this.$route.meta?.keepAlive
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
    },
    handleCollapse (val) {
      this.$logger.info('handleCollapse ' + val)
      this.$store.commit(HIDDEN_SIDEBAR, val)
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
      this.$store.commit(HIDDEN_SIDEBAR, !this.collapsed)
    }
  }
}
</script>

<style lang='less'>
@import "./BasicLayout.less";
  .home-nav {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding-left: 10px;
    height: 50px;
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

.ant-pro-sider-menu-logo {
  padding-left: 0;
  display: flex;
  align-items: center;
  height: 90px;
  background-color: #222634;
  img {
    image-rendering:-moz-crisp-edges;
    image-rendering:-o-crisp-edges;
    image-rendering: crisp-edges;
    -ms-interpolation-mode: nearest-neighbor;
    -webkit-font-smooting:  antialiased;
  }

  img.full-logo {
    height: 100%;
    width: auto !important;
  }

  img.single-logo-img {
    height: 50px;
    width: auto !important;
  }
}

.home-nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.home-title {
  padding-left: 16px;
  .classcipe-title {
    font-weight: 500;
    font-size: 18px;
    line-height: 28px;
  }

  .classcipe-type {
    line-height: 14px;
    font-size: 13px;
    padding-bottom: 5px;
  }
}

.no-side {
  & > .ant-layout-sider {
    display: none!important;
  }
  & > .sidemenu {
    padding-left: 0!important;
  }
  .cc-fixed-form-header {
    left: 0!important;
  }
   .cc-fixed-form-footer {
    left: 0!important;
  }
}
</style>
