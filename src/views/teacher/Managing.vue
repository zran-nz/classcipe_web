<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%' }" :style="{ height: '100%' }">
    <a-layout>
      <a-layout-sider>
        <div class="school-name">{{ $store.getters.userInfo.schoolName }}</div>
        <a-menu
          :v-model="selectedKey"
          class="cc-menu"
          mode="inline"
          :inline-collapsed="false"
        >
          <template v-for="item in currentMenu">
            <template v-if="!item.children || item.children.length === 0">
              <a-menu-item
                :key="item.path"
                :class="{
                  'nav-bar-item': true,
                  'nav-bar-item-split': true,
                  'selected-nav-bar': selectedKey.includes(item.path),
                }"
                v-if="!item.meta.curriculumtype || item.meta.curriculumtype == bindCurriculum"
              >
                <router-link :to="item.path">
                  <component
                    :is="item.meta.svg"
                    v-if="item.meta.svg"
                  ></component>
                  <a-icon class="nav-bar-icon" :type="item.meta.icon" v-if="item.meta.icon"/>
                  {{ $t(item.meta.title) }}
                </router-link>
              </a-menu-item>
            </template>
            <template v-else>
              <a-sub-menu
                :key="item.path"
                :class="{
                  'nav-bar-item': true,
                  'nav-bar-item-split': true,
                  'selected-nav-bar': selectedKey.includes(item.path),
                }"
                v-if="!item.meta.curriculumtype || item.meta.curriculumtype == bindCurriculum"
              >
                <a slot="title">
                  <component
                    :is="item.meta.svg"
                    v-if="item.meta.svg"
                  ></component>
                  <a-icon class="nav-bar-icon" :type="item.meta.icon" v-if="item.meta.icon"/>
                  {{ $t(item.meta.title) }}
                </a>
                <template v-for="(sub) in item.children">
                  <a-menu-item
                    :key="sub.path"
                    :class="{
                      'nav-bar-item': true,
                      'nav-bar-item-split': true,
                      'selected-nav-bar': selectedKey.includes(sub.path),
                    }"
                    v-if="!sub.meta.curriculumtype || sub.meta.curriculumtype == bindCurriculum"
                  >
                    <router-link :to="sub.path">
                      {{ $t(sub.meta.title) }}
                    </router-link>
                  </a-menu-item>
                </template>
              </a-sub-menu>
            </template>
          </template>
          <!-- <a-menu-item key="/teacher/managing/school-user">
            <a-icon type="user" />
            <span>School User</span>
          </a-menu-item>
          <a-menu-item key="/teacher/managing/class">
            <a-icon type="desktop" />
            <span>Classes</span>
          </a-menu-item>
          <a-sub-menu>
            <span slot="title"><a-icon type="schedule" /><span>Academics</span></span>
            --            <a-menu-item key="/teacher/managing/term"> Academics Terms </a-menu-item>--
            <a-menu-item key="/teacher/managing/planning-format">  Planning format </a-menu-item>
            <a-menu-item key="/teacher/managing/tag-settings">  Tags </a-menu-item>
            <a-menu-item key="/teacher/managing/skill" v-if="$store.getters.bindCurriculum == curriculumType.IBMYP">
              <a-tooltip title="Upload achievement objectives">Upload achievement objectives</a-tooltip>
            </a-menu-item>
          </a-sub-menu> -->
        </a-menu>
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
import CreatedByMeSvg from '@/assets/svgIcon/myContent/Created_by_me.svg?inline'
import DiscoverSvg from '@/assets/svgIcon/myContent/Discover.svg?inline'
import MyFavoriteSvg from '@/assets/svgIcon/myContent/My_favorite.svg?inline'
import PopularSvg from '@/assets/svgIcon/myContent/Popular.svg?inline'
import SharedSvg from '@/assets/svgIcon/myContent/Shared.svg?inline'
import SubscribesSvg from '@/assets/svgIcon/myContent/Subscribes.svg?inline'
import { CurriculumType } from '@/const/common'

import { mapState } from 'vuex'

export default {
  name: 'Main',
  components: {
    PageHeaderWrapper,
    CreatedByMeSvg,
    DiscoverSvg,
    MyFavoriteSvg,
    PopularSvg,
    SharedSvg,
    SubscribesSvg
  },
  data() {
    return {
      selectedKey: ['/teacher/managing/skill'],
      currentRouterName: 'teacher',
      mainRouter: 'Managing',
      curriculumType: CurriculumType
    }
  },
  watch: {
    '$route.path'(to) {
      logger.debug('My Content route.path change ' + to)
      this.selectedKey = [to]
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters,
      currentRole: state => state.user.currentRole,
      bindCurriculum: state => state.bindCurriculum
    }),
    currentMenu() {
      const addRouters = this.mainMenu
      if (addRouters && addRouters.length > 0) {
        // 寻找路由 index => teacher => mainRouter
        const mainRouter = addRouters.find(item => item.name === 'index')
        if (mainRouter && mainRouter.children && mainRouter.children.length > 0) {
          const currentRouter = mainRouter.children.find(item => item.name === this.currentRole)
          if (currentRouter && currentRouter.children && currentRouter.children.length > 0) {
            const Main = currentRouter.children.find(item => item.name === this.mainRouter)
            if (Main && Main.children && Main.children.length > 0) {
              // 动态路由需要额外生成并放入children中
              const Final = Main.children.concat()
              const Dynamcis = Final.filter(item => item.meta.dynamicKey)
              const noDynamic = []
              Dynamcis.forEach(item => {
                const routes = this[item.meta.dynamicKey] || []
                const children = []
                routes.forEach(route => {
                  children.push({
                    ...item,
                    path: item.path.replace(/(:.*)$/, route.id),
                    meta: {
                      ...item.meta,
                      title: route.name
                    }
                  })
                })
                if (routes.length === 0) {
                  noDynamic.push(item.path)
                } else {
                  item.children = children
                }
              })

              return Final.filter(item => !noDynamic.includes(item.path))
            }
          }
        }
      }
      return []
    }
  },
  created() {
    this.selectedKey = [this.$route.path]
    logger.info('selectedKey ', this.selectedKey)
  },
  mounted() {},
  methods: {
    handleMenuSelect({ key }) {
      this.$router.push({ path: key })
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

.nav-bar-left {
  height: 100%;
  box-sizing: border-box;
  margin-top: 10px;
  padding-right: 5px;
  .nav-bar-wrapper {
    .nav-bar-item {
      font-family: Inter-Bold;
      font-size: 14px;
      cursor: pointer;
      background-image: url('~@/assets/icons/myContent/Rectangle@2x.png');
      background-repeat: repeat;
      background-size: cover;

      .memu-icon {
        width: 30px;
        height: 30px;
        margin: 0px 10px;
      }

      a {
        display: flex;
        align-items: center;
        width: 100%;
        line-height: 30px;
        padding: 10px 20px;
        color: #000000;

        i {
          width: 50px;
          font-size: 20px;
        }
      }

      &:hover {
        background: #edf1f5;
        a {
          color: @primary-color;
        }
      }
    }

    .nav-bar-item-split {
      margin-bottom: 20px;
    }

    .selected-nav-bar {
      background: #edf1f5;
      a {
        color: @primary-color;
        font-weight: bold;
      }
    }
  }
}
.school-name{
  color: rgba(0,0,0,.85);
  font-size: 16px;
  margin: 5px;
  line-height: 25px;
  font-weight: 500;
}
.cc-menu {
  /deep/ .ant-menu-submenu-title, .ant-menu-item{
    height: auto!important;
    min-height: 40px;
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    white-space: unset!important;
    line-height: 20px!important;
  }
}
</style>
