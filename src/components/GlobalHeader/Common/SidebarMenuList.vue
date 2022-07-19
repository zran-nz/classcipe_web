<template>
  <div class='sidebar-menu-list'>
    <div class='sidebar-menu-item' :class="{'active-sidebar-menu-item': pathPrefix && $route.path.startsWith(pathPrefix), 'collapsed-menu': $store.getters.collapsed }" @click='handleExpandMenuList'>
      <div class='menu-icon'>
        <a-tooltip :title='label' placement="right" >
          <slot name='icon'></slot>
        </a-tooltip>>
      </div>
      <div class='menu-label' :title='label'>
        {{ label }}
      </div>
      <span class='menu-arrow'>
        <a-icon type='right' :style="{ fontSize: '12px', color: '#fff' }" v-if='!expand'></a-icon>
        <a-icon type='down' :style="{ fontSize: '12px', color: '#fff' }" v-if='expand'></a-icon>
      </span>
    </div>
    <div class='sub-menu-list' v-if='expand && !$store.getters.collapsed'>
      <template v-if='menuList.length'>
        <div class='sub-menu-item' :class="{'active-menu-item': menu.id === activeId && activeId}" v-for='menu in menuList' :key='menu.id' @click='handleClickMenu(menu)'>
          <div class='sub-menu-icon'>
            <student-icon />
          </div>
          <div class='sub-menu-label' :title='menu.name'>
            {{ menu.name }}
          </div>
        </div>
      </template>
      <template v-if='!menuList.length'>
        <span>No class</span>
      </template>
    </div>
  </div>
</template>

<script>

import StudentIcon from '@/assets/v2/icons/student.svg?inline'
export default {
  name: 'SidebarMenuList',
  components: {
    StudentIcon
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    pathPrefix: {
      type: String,
      default: ''
    },
    activeId: {
      type: String,
      default: ''
    },
    menuList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      expand: false
    }
  },
  watch: {
    '$route.path' (toPath) {
      if (toPath.startsWith('/teacher/class-session')) {
        this.expand = true
      }
    }
  },
  created() {
  },
  methods: {
    handleExpandMenuList () {
      this.$logger.info('handleExpandMenuList')
      this.expand = !this.expand
    },
    handleClickMenu (item) {
      this.$logger.info('handleClickMenu', item)
      // this.onClick(this.label, this.path)
      this.$router.push({ path: '/teacher/class-session/' + item.id })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.sidebar-menu-list {
  width: 100%;
  margin-bottom: 10px;
  cursor: pointer;
}
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

.sub-menu-list {
  width: 100%;
  text-align: center;
  overflow: hidden;
  background-color: #1e2230;
  .sub-menu-item {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 30px;
    width: 100%;
    font-family: Arial;
    font-weight: 400;
    height: 40px;
    color: #fff;
    font-size: 14px;
    transition: all 0.3s ease-in-out;
    overflow: hidden;

    .sub-menu-icon {
      display: flex;
      flex-direction: row;
      align-items: center;
      svg {
        width: 16px;
        height: 16px;
      }
    }

    .sub-menu-label {
      padding-left: 15px;
      color: #fff;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
    }
    &:hover {
      background-color: #2F3341;
    }
  }

  .active-menu-item {
    .sub-menu-label {
      color: #15C39A;
      font-weight: bold;
    }
  }

  span {
    line-height: 40px;
    color: #aaa;
  }
}

.collapsed-menu {
  .menu-label {
    display: none;
  }

  .menu-arrow {
    display: none !important;
  }
}
</style>
