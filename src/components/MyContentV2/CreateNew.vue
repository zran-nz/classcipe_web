<template>
  <div class='create-new'>
    <a-dropdown>
      <a-menu slot="overlay">
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
      <a-button
        style="padding: 0 20px;
      display:flex;
      align-items:center ;
      border-radius: 6px;
      background: #FFFFFF;
      border: 1px solid #D3D3D3;
      font-family: Inter-Bold;
      color: #182552;"> Create New <a-icon type="caret-down" />
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

<style scoped>

</style>
