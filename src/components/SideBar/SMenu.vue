<template>
  <div :class="className">
    <a-layout-sider
      :class="[ theme ]"
      width="200px"
      :collapsible="collapsible"
      v-model="collapsed"
      :trigger="null">
      <side-menu
        :collapsed="collapsed"
        :menus="menus"
        :theme="theme"
        :initSelected="initSelected"
        @select="onSelect"
        @updateMenuTitle="onUpdateMenuTitle"
        :mode="mode"
        :hiddenRoute="hiddenRoute"
        :iconTheme="iconTheme"
        :style="smenuStyle">
      </side-menu>
    </a-layout-sider>
  </div>
</template>

<script>
  import SideMenu from './index'
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'SMenu',
    components: { SideMenu },
    props: {
      mode: {
        type: String,
        required: false,
        default: 'inline'
      },
      theme: {
        type: String,
        required: false,
        default: 'light'
      },
      collapsible: {
        type: Boolean,
        required: false,
        default: false
      },
      collapsed: {
        type: Boolean,
        required: false,
        default: false
      },
      className: {
        type: String,
        default: ''
      },
      // 是否直接读取当前角色的路由，为空则读取currentRouterName路由
      fromRole: {
        type: String,
        default: 'student'
      },
      mainRouter: {
        type: String,
        default: 'Main'
      },
      currentRouterName: {
        type: String,
        default: 'student'
      },
      initSelected: {
        type: String,
        default: '/student/main'
      },
      hiddenRoute: {
        type: Function,
        default: () => false
      },
      iconTheme: {
        type: String,
        default: 'filled'
      }
    },
    computed: {
      ...mapState({
        // 动态主路由
        mainMenu: state => state.permission.addRouters,
        currentRole: state => state.user.currentRole
      }),
      ...mapGetters(['currentClassList']), // dynamicKey
      menus() {
        const addRouters = this.mainMenu
        if (addRouters && addRouters.length > 0) {
          // 寻找路由 index => teacher => mainRouter
          const mainRouter = addRouters.find(item => item.name === 'index')
          if (mainRouter && mainRouter.children && mainRouter.children.length > 0) {
            const currentRouter = mainRouter.children.find(item => item.name === (this.fromRole ? this.currentRole : this.currentRouterName))
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
                        title: route.name,
                        icon: 'none'
                      },
                      children: undefined
                    })
                  })
                  if (routes.length === 0) {
                    noDynamic.push(item.path)
                  } else {
                    item.children = children
                  }
                })
                console.log(Final)
                return Final.filter(item => !noDynamic.includes(item.path))
              }
            }
          }
        }
        return []
      },
      smenuStyle() {
        const style = { 'padding': '0' }
        if (this.fixSiderbar) {
          style['height'] = 'calc(100% - 59px)'
          style['overflow'] = 'auto'
          style['overflow-x'] = 'hidden'
        }
        return style
      }
    },
    methods: {
      onSelect (obj) {
        this.$emit('menuSelect', obj)
      },
      onUpdateMenuTitle (obj) {
        this.$emit('updateMenuTitle', obj)
      }
    }
  }
</script>
<style lang="less" scoped>

  /* update_begin author:sunjianlei date:20190509 for: 修改侧边导航栏滚动条的样式 */
  .sider {
    @scrollBarSize: 10px;

    ul.ant-menu {

      /* 定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
      &::-webkit-scrollbar {
        width: @scrollBarSize;
        height: @scrollBarSize;
        background-color: transparent;
        display: none;
      }

      & .-o-scrollbar {
        display: none;
      }

      /* 兼容IE */
      -ms-overflow-style: none;
      -ms-scroll-chaining: chained;
      -ms-content-zooming: zoom;
      -ms-scroll-rails: none;
      -ms-content-zoom-limit-min: 100%;
      -ms-content-zoom-limit-max: 500%;
      scroll-snap-type: proximity;
      -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);

      /* 定义滚动条轨道 */
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }

      /* 定义滑块 */
      &::-webkit-scrollbar-thumb {
        border-radius: @scrollBarSize;
        background-color: #eee;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);

        &:hover {
          background-color: #dddddd;
        }

        &:active {
          background-color: #bbbbbb;
        }
      }
    }

    /** 暗色系滚动条样式 */
    &.dark ul.ant-menu {
      &::-webkit-scrollbar-thumb {
        background-color: #666666;

        &:hover {
          background-color: #808080;
        }

        &:active {
          background-color: #999999;
        }
      }
    }

  }

  /* update_end author:sunjianlei date:20190509 for: 修改侧边导航栏滚动条的样式 */
</style>

<!-- update_begin author:sunjianlei date:20190530 for: 选中首页的时候不显示背景颜色 -->
<style lang="less">
  .ant-menu.ant-menu-root {
    & > .ant-menu-item:first-child {
      background-color: transparent;

      & > a, & > a:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &.ant-menu-item-selected {
        & > a, & > a:hover {
          color: @primary-color;
        }
      }
    }

    &.ant-menu-dark > .ant-menu-item:first-child {
      & > a, & > a:hover {
        color: rgba(255, 255, 255, 0.65);
      }

      &.ant-menu-item-selected {
        & > a, & > a:hover {
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
  .cc-menu {
    .ant-menu-submenu-title, .ant-menu-item{
      height: auto!important;
      min-height: 40px;
      padding-top: 10px !important;
      padding-bottom: 10px !important;
      white-space: unset!important;
      line-height: 20px!important;
    }
  }
</style>
<!-- update_end author:sunjianlei date:20190530 for: 选中首页的时候不显示背景颜色 -->
