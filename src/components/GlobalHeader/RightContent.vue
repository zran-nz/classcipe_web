<template>
  <div :class="wrpCls">
    <div class="tips">
      <router-link to="/notification">
        <a-badge>
          <a-icon type="notification" :class="{'icon-active': routeActive, 'icon-inactive': !routeActive}" />
        </a-badge>
      </router-link>
    </div>
    <avatar-dropdown :menu="showMenu" :current-user="$store.getters.userInfo" :class="prefixCls" @switch-role="handleSwitchRole" />
    <!--    <select-lang :class="prefixCls" />-->
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
import * as logger from '@/utils/logger'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SelectLang
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  watch: {
    '$route.path' (toPath) {
      logger.debug('icon route change ' + toPath)
      if (toPath === '/notification') {
        this.routeActive = true
      } else {
        this.routeActive = false
      }
    }
  },
  data () {
    return {
      showMenu: true,
      routeActive: false
    }
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    }
  },
  mounted () {
    if (this.$route.path === '/notification') {
      this.routeActive = true
    } else {
      this.routeActive = false
    }
  },
  methods: {
    handleSwitchRole (role) {
      logger.info('handleSwitchRole ' + role)
      this.$emit('switch-role', role)
    }
  }
}
</script>
<style scoped lang='less'>
@import "~@/components/index.less";
.ant-badge {
  svg {
    height: 30px;
    width: 30px;
    color: #fff;
  }
  .icon-inactive {
    color: #fff;
  }
  .icon-active {
    color: @primary-color;
  }
}
</style>
