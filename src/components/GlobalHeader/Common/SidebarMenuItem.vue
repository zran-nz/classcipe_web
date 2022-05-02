<template>
  <div class='sidebar-menu-item' :class="{'active-sidebar-menu-item': path && $route.path === path}" @click='handleClickMenu' @dblclick='handleDbClickMenu'>
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
  background-color: #001529;
  transition: all 0.3s ease-in-out;
  margin-bottom: 10px;
  padding-left: 10px;

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
  }

  .menu-label {
    font-size: 14px;
    font-family: Arial;
    font-weight: 400;
    color: #F1F3F8;
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
</style>
