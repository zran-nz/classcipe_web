<template>
  <div class='sidebar-menu-item' :class="{'active-sidebar-menu-item': path && ($route.path === path || ($route.meta.owner && $route.meta.owner === path)), 'collapsed-menu': $store.getters.collapsed }" @click='handleClickMenu' @dblclick='handleDbClickMenu'>
    <div class='menu-icon'>
      <slot name='icon'></slot>
    </div>

    <div class='menu-label'>
      {{ label }}
    </div>
    <span class='menu-arrow'>
      <a-icon type='right' :style="{ fontSize: '12px', color: '#fff' }"></a-icon>
    </span>
  </div>
</template>

<script>
import { SESSION_SHARE_TYPE } from '@/const/common'

export default {
  name: 'SidebarMenuItem',
  props: {
    label: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    },
    onClick: {
      type: Function,
      default: () => {}
    },
    onDbClick: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {
    handleClickMenu () {
      this.$logger.info('handleClickMenu', this.path)
      // 特殊清除shareType逻辑
      if (this.path === '/teacher/main/created-by-me') {
        sessionStorage.removeItem(SESSION_SHARE_TYPE)
      }
      this.onClick(this.label, this.path)
      if (this.path) {
        this.$router.push(this.path)
      }
    },

    handleDbClickMenu () {
      this.onDbClick(this.label, this.path)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.sidebar-menu-item {
  display: flex;
  width: 100%;
  height: 50px;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  cursor: pointer;
  background-color: #222634;
  transition: all 0.3s ease-in-out;
  margin-bottom: 10px;
  padding-left: 12px;

  &:hover {
    background-color: #2F3341;

    .menu-arrow {
      display: flex;
    }

    .menu-label {
      color: #fff;
    }
  }

  .menu-icon {
    padding: 5px 15px 0 15px;
    svg {
      height: 22px;
      width: 22px;
    }
    i {
      font-size: 20px;
    }
  }

  .menu-label {
    font-size: 14px;
    font-family: Arial;
    font-weight: 400;
    color: #F1F3F8;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;
  }

  .menu-arrow {
    display: none;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 18px;
    top: 50%;
    margin-top: -10px;
    height: 20px;
    transition: all 0.3s ease-in-out;
  }
}

.active-sidebar-menu-item {
  background-color: #2F3341;

  .menu-arrow {
    display: flex;
  }

  .menu-label {
    color: #fff;
  }
}

.collapsed-menu {
  .menu-label {
    opacity: 0 !important;
  }

  .menu-arrow {
    opacity: 0 !important;
  }
}
</style>
