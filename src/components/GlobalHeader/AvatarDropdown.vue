<template>
  <a-dropdown v-if="currentUser && currentUser.username" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <span class="avatar-name">{{ currentUser.currentRole.substr(0, 1).toUpperCase() + currentUser.currentRole.substr(1) }}</span>
      <a-avatar size="small" :src="currentUser.avatar" class="antd-pro-global-header-index-avatar" v-if="currentUser.avatar"/>
      <a-avatar size="small" src="~@/assets/logo/beatop.png" class="antd-pro-global-header-index-avatar" v-else/>
      <a-icon type="caret-down" />
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <a-menu-item v-if="menu" key="settings" @click="handleToSettings">
          <a-icon type="user" />
          {{ $t('menu.account.profile') }}
        </a-menu-item>
        <!--        <a-menu-item v-if="menu" key="center" @click="switchRole">-->
        <!--          <a-icon type="setting" />-->
        <!--          <template v-if="currentUser.currentRole === &quot;expert&quot;">-->
        <!--            {{ $t('menu.account.switchToTeacher') }}-->
        <!--          </template>-->
        <!--          <template v-if="currentUser.currentRole === &quot;teacher&quot;">-->
        <!--            {{ $t('menu.account.switchToExpert') }}-->
        <!--          </template>-->
        <!--        </a-menu-item>-->
        <template v-if="navMenu && navMenu.length > 0">
          <a-menu-item-group :key="'g1'+index" v-for="(item, index) in navMenu">
            <template slot="title"><span>{{ $t(item.meta.title) }}</span> </template>
            <a-menu-item :key="'g1_child_'+childIndex" v-for="(child, childIndex) in item.children">
              <router-link :to="child.path">
                {{ $t(child.meta.title) }}
              </router-link>
            </a-menu-item>
          </a-menu-item-group>
        </template>
        <a-menu-divider v-if="menu" />
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout" />
          {{ $t('menu.account.logout') }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script>
import { Modal } from 'ant-design-vue'
import { SESSION_CURRENT_PAGE, SESSION_CURRENT_TYPE, SESSION_CURRENT_TYPE_LABEL } from '@/const/common'
import { mapState } from 'vuex'

export default {
  name: 'AvatarDropdown',
  props: {
    currentUser: {
      type: Object,
      default: () => null
    },
    menu: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      mainRouter: ['TeacherBuyMain', 'TeacherSellMain']
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters,
      currentRole: state => state.user.currentRole
    }),
    navMenu() {
      const addRouters = this.mainMenu
      if (addRouters && addRouters.length > 0) {
        // 寻找路由 index => teacher => OrderMain
        const mainRouter = addRouters.find(item => item.name === 'index')
        if (mainRouter && mainRouter.children && mainRouter.children.length > 0) {
          const currentRouter = mainRouter.children.find(item => item.name === this.currentRole)
          if (currentRouter && currentRouter.children && currentRouter.children.length > 0) {
            const Mains = currentRouter.children.filter(item => this.mainRouter.includes(item.name))
            return Mains
          }
        }
      }
      return []
    }
  },
  methods: {
    switchRole () {
      // del cache
      sessionStorage.removeItem(SESSION_CURRENT_PAGE)
      sessionStorage.removeItem(SESSION_CURRENT_TYPE_LABEL)
      sessionStorage.removeItem(SESSION_CURRENT_TYPE)
      if (this.currentUser.currentRole === 'expert') {
        this.$emit('switch-role', 'teacher')
      } else {
        this.$emit('switch-role', 'expert')
      }
    },
    handleToSettings () {
      this.$router.push({ path: '/account/settings' })
    },
    handleLogout (e) {
      Modal.confirm({
        title: this.$t('layouts.usermenu.dialog.title'),
        content: this.$t('layouts.usermenu.dialog.content'),
        onOk: () => {
          // return new Promise((resolve, reject) => {
          //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1500)
          // }).catch(() => console.log('Oops errors!'))
          return this.$store.dispatch('Logout').then(() => {
            this.$router.push({ name: 'login' })
          })
        },
        onCancel () {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
  /deep/ .ant-dropdown-menu-item-group-title {
    line-height: 20px;
  }
}

.avatar-name {
  padding-right: 10px;
}
</style>
