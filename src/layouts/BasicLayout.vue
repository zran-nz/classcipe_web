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
      <div class="home-nav" @click="goHome">
        <img src="~@/assets/logo/logo.png">
        <h1>{{ title }}</h1>
      </div>
    </template>
    <!-- 1.0.0+ 版本 pro-layout 提供 API,
          增加 Header 左侧内容区自定义
    -->
    <template v-slot:menuRender>
      <expert-nav v-show="$store.getters.currentRole === 'expert'"></expert-nav>
      <teacher-nav v-show="$store.getters.currentRole === 'teacher'"></teacher-nav>
      <student-nav v-show="$store.getters.currentRole === 'student'"></student-nav>
    </template>
    <template v-slot:rightContentRender>
      <right-content :top-menu="settings.layout === 'topmenu'" :is-mobile="isMobile" :theme="settings.theme" @switch-role="handleSwitchRole" />
    </template>
    <!-- custom footer / 自定义Footer -->
    <template v-slot:footerRender>
      <global-footer />
    </template>
    <div :class="{'classcipe-main': true, 'no-full-layout': !fullLayoutFlag}">
      <router-view />
    </div>
  </pro-layout>
</template>

<script>
import { i18nRender } from '@/locales'
import { mapState } from 'vuex'
import { CONTENT_WIDTH_TYPE } from '@/store/mutation-types'

import defaultSettings from '@/config/defaultSettings'
import RightContent from '@/components/GlobalHeader/RightContent'
import GlobalFooter from '@/components/GlobalFooter'
import * as logger from '@/utils/logger'

import TeacherNav from '@/components/GlobalHeader/TeacherNav'
import ExpertNav from '@/components/GlobalHeader/ExpertNav'

export default {
  name: 'BasicLayout',
  components: {
    RightContent,
    GlobalFooter,
    TeacherNav,
    ExpertNav
  },
  data () {
    return {
      // preview.pro.antdv.com only use.
      isProPreviewSite: process.env.VUE_APP_PREVIEW === 'true' && process.env.NODE_ENV !== 'development',
      // end

      // base
      menus: [],
      // 侧栏收起状态
      collapsed: false,
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
      mainMenu: state => state.permission.addRouters
    }),
    fullLayoutFlag () {
      return this.$route.meta.fullLayout
    }
  },
  created () {
    logger.info('BasicLayout created, path ' + this.$route.path)
    if (this.$route.path === '/') {
      logger.info('go to defaultRouter ' + this.$store.getters.defaultRouter)
      this.$router.replace(this.$store.getters.defaultRouter)
    }
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }

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

    // first update color
    // TIPS: THEME COLOR HANDLER!! PLEASE CHECK THAT!!
    // if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
    //   updateTheme(this.settings.primaryColor)
    // }
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
        this.isMobile = false
        return
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.collapsed = false
        this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
        // this.settings.fixSiderbar = false
      }
    },
    handleCollapse (val) {
      this.collapsed = val
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
    }
  }
}
</script>

<style lang='less'>
@import "./BasicLayout.less";
  .home-nav {
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

</style>
