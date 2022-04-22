<template>
  <div :class="wrpCls">
    <!--    <div class="tips">-->
    <!--      <router-link to="/notification">-->
    <!--        <a-badge>-->
    <!--          <a-icon type="mail" theme="filled" :class="{'icon-active': routeActive, 'icon-inactive': !routeActive}" />-->
    <!--        </a-badge>-->
    <!--      </router-link>-->
    <Notice-Icon v-show="$store.getters.currentRole !== 'student'"></Notice-Icon>
    <!--    </div>-->
    <avatar-dropdown :menu="showMenu" :current-user="$store.getters.userInfo" :class="prefixCls" @switch-role="handleSwitchRole" />
    <!--    <select-lang :class="prefixCls" />-->
    <a-tooltip title='Hide menu'>
      <a-icon type="caret-up" :style="{ fontSize: '16px', color: '#fff' }" v-if='allowHiddenHeader' @click='toggleHiddenHeader'/>
    </a-tooltip>
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
import * as logger from '@/utils/logger'
import NoticeIcon from '@/components/NoticeIcon'
import { HIDDEN_HEADER } from '@/store/mutation-types'
import { mapState } from 'vuex'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SelectLang,
    NoticeIcon
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
    },
    allowHiddenHeader () {
      return this.$route.meta.allowHiddenHeader
    },
    ...mapState({
      hiddenHeader: state => state.app.hiddenHeader
    })
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
    },
    toggleHiddenHeader() {
      this.$store.commit(HIDDEN_HEADER, !this.$store.getters.hiddenHeader)
    }
  }
}
</script>
<style scoped lang='less'>
@import "~@/components/index.less";
.ant-badge {
  svg {
    height: 35px;
    width: 35px;
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
