<template>
  <header class='base-nav ant-pro-fixed-header ant-pro-top-menu'>
    <div class='ant-pro-top-nav-header dark'>
      <div class='ant-pro-top-nav-header-main wide nav-content'>
        <div class='left-logo'>
          <div class="home-nav ant-pro-top-nav-header-logo" @click="goHome">
            <img src="~@/assets/logo/logo.png">
            <h1>{{ title }}</h1>
          </div>
        </div>
        <div class='right-action'>
          <template v-if='!loading'>
            <template v-if='isLogin'>
              <avatar-dropdown :menu="true" :current-user="$store.getters.userInfo" :class="prefixCls" @switch-role="handleSwitchRole" />
            </template>
            <template v-if='!isLogin'>
              <div class='login'>
                <a-button shape='round' class='my-plain-button wide-action-button' @click='handleLogin'>Log in</a-button>
              </div>
              <div class='sign-up'>
                <a-button shape='round' type='primary' class='wide-action-button' @click='handleSignUp'>Sign up</a-button>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import * as logger from '@/utils/logger'
import AvatarDropdown from '@/components/GlobalHeader/AvatarDropdown'

export default {
  name: 'BaseNav',
  components: { AvatarDropdown },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    }
  },
  data () {
    return {
      title: 'Classcipe',
      loading: true,
      isLogin: false
    }
  },
  mounted() {
    if (this.$store.getters.nickname) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
    this.loading = false
  },
  methods: {
    goHome () {
      this.$router.push('/')
    },

    handleLogin () {
      this.$router.push('/')
    },
    handleSignUp () {
      this.$router.push('/')
    },

    handleSwitchRole (role) {
      logger.info('handleSwitchRole ' + role)
      this.$emit('switch-role', role)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.base-nav, .nav-content {
  background: #182552;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.home-nav {
  h1 {
    font-family: Inter-Bold;
  }
}

.right-action {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .login, .sign-up {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
  }
}

</style>
