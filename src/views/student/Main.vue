<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%' }" :style="{ height: '100%' }">
    <a-layout>
      <a-layout-sider>
        <div class="nav-bar-left">
          <a-menu
            class="nav-bar-wrapper"
            v-model="selectedKey"
            :open-keys.sync="openKeys"
            mode="inline"
          >
            <a-menu-item
              :key="item.path"
              :class="{
                'nav-bar-item': true,
                'nav-bar-item-split': true,
                'selected-nav-bar': selectedKey.includes(item.path),
              }"
              v-for="item in currentMenu"
              v-if="!item.children || item.children.length === 0"
            >
              <router-link :to="item.path">
                <component
                  :is="item.meta.svg"
                  v-if="item.meta.svg"
                ></component>
                <a-icon class="nav-bar-icon" theme="filled" :type="item.meta.icon" v-if="item.meta.icon"/>
                {{ $t(item.meta.title) }}
              </router-link>
            </a-menu-item>
            <a-sub-menu
              v-for="subItem in currentMenu"
              :key="subItem.path"
              :class="{
                'nav-bar-item': true,
                'nav-bar-item-split': true,
                'selected-nav-bar': selectedKey.includes(subItem.path),
              }"
              v-if="subItem.children && subItem.children.length > 0"
            >
              <a slot="title">
                <component
                  :is="subItem.meta.svg"
                  v-if="subItem.meta.svg"
                ></component>
                <a-icon class="nav-bar-icon" theme="filled" :type="subItem.meta.icon" v-if="subItem.meta.icon"/>
                {{ $t(subItem.meta.title) }}
              </a>
              <a-menu-item
                :key="sub.path"
                :class="{
                  'nav-bar-item': true,
                  'nav-bar-item-split': true,
                  'selected-nav-bar': selectedKey.includes(sub.path),
                }"
                v-for="(sub) in subItem.children"
              >
                <router-link :to="sub.path">
                  {{ $t(sub.meta.title) }}
                </router-link>
              </a-menu-item>
            </a-sub-menu>
          </a-menu>
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
import * as logger from '@/utils/logger'
import CreatedByMeSvg from '@/assets/svgIcon/myContent/Created_by_me.svg?inline'
import DiscoverSvg from '@/assets/svgIcon/myContent/Discover.svg?inline'
import MyFavoriteSvg from '@/assets/svgIcon/myContent/My_favorite.svg?inline'
import PopularSvg from '@/assets/svgIcon/myContent/Popular.svg?inline'
import SharedSvg from '@/assets/svgIcon/myContent/Shared.svg?inline'
import SubscribesSvg from '@/assets/svgIcon/myContent/Subscribes.svg?inline'
import AddPreference from './AddPreference.vue'
import { mapState } from 'vuex'

export default {
  name: 'Main',
  components: {
    CreatedByMeSvg,
    DiscoverSvg,
    MyFavoriteSvg,
    PopularSvg,
    SharedSvg,
    SubscribesSvg,
    AddPreference
  },
  data() {
    return {
      selectedKey: ['/student/main/my-task'],
      quickSessionVisible: false,
      currentRouterName: 'student',
      openKeys: []
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
      studyMode: state => state.app.studyMode,
      user: state => state.user
    }),
    currentMenu() {
      const addRouters = this.mainMenu
      if (addRouters && addRouters.length > 0) {
        // 寻找路由 index => student => main
        const mainRouter = addRouters.find(item => item.name === 'index')
        if (mainRouter && mainRouter.children && mainRouter.children.length > 0) {
          const currentRouter = mainRouter.children.find(item => item.name === this.currentRouterName)
          if (currentRouter && currentRouter.children && currentRouter.children.length > 0) {
            const Main = currentRouter.children.find(item => item.name === 'Main')
            // 根据自学习模式，还是学校模式进行type过滤
            if (Main && Main.children && Main.children.length > 0) {
              // 动态路由需要额外生成并放入children中 TODO
              const Final = Main.children.filter(item => !item.meta.type || item.meta.type === this.studyMode)
              const Dynamcis = Final.filter(item => item.meta.dynamicKey)
              Dynamcis.forEach(item => {
                const routes = this.user[item.meta.dynamicKey] || [{
                  id: '1',
                  name: 'class1'
                }, {
                  id: '2',
                  name: 'class2'
                }, {
                  id: '3',
                  name: 'class3'
                }]
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
                item.children = children
              })
              return Final
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
    handleClick() {

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
  .nav-bar-wrapper {
    .nav-bar-item {
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
        background: #edf1f5;
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
      /deep/ .ant-menu-submenu-title {
        margin: 0!important;
        height: 50px;
        line-height: 50px;
      }
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
</style>
