<template>
  <div class='create-new'>
    <a-dropdown>
      <a-menu slot="overlay" class='create-new-menu'>
        <a-menu-item>
          <router-link to='/teacher/unit-plan-redirect/create'>
            {{ $t('menu.unit-plan') }}
          </router-link>
        </a-menu-item>
        <a-menu-item>
          <a @click='showTaskModeChoose'> {{ $t('menu.task') }}</a>
        </a-menu-item>
        <a-menu-item>
          <router-link to='/teacher/pd-content-redirect/create'>
            PD CONTENT
          </router-link>
        </a-menu-item>
        <a-menu-item>
          <router-link to='/teacher/video-redirect/create'>
            Video
          </router-link>
        </a-menu-item>
      </a-menu>
      <a-button class='create-new-btn'>Create New <a-icon type="caret-down" :style="{color: '#4F4F4F'}"/>
      </a-button>
    </a-dropdown>
    <task-mode-choose @close='closeTaskModeChoose' :visible='showTaskMode' v-if='showTaskMode'/>
  </div>
</template>

<script>
import TaskModeChoose from '@/components/QuickSession/TaskModeChoose'
export default {
  name: 'CreateNew',
  components: { TaskModeChoose },
  data () {
    return {
      showTaskMode: false
    }
  },
  methods: {
    showTaskModeChoose () {
      this.showTaskMode = true
    },
    closeTaskModeChoose() {
      this.showTaskMode = false
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.create-new-btn {
  border: 1px solid #D0D0D0;
  width: 130px;
  font-size: 0.7rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  line-height: 38px;
  color: #4F4F4F;
  span {
    padding-right: 5px;
  }
}

.create-new-menu {
  a {
    font-family: Arial;
    font-weight: 400;
    color: #525252;
  }
}
</style>
