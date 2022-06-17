<template>
  <div class='create-new'>
    <a-dropdown>
      <a-menu slot="overlay" class='create-new-menu'>
        <a-menu-item>
          <a @click='handleImport'>
            Import
          </a>
        </a-menu-item>
        <a-menu-item>
          <router-link to='/teacher/unit-plan-redirect/create'>
            {{ $t('menu.unit-plan') }}
          </router-link>
        </a-menu-item>
        <a-menu-item>
          <router-link to='/teacher/task-redirect'>
            {{ $t('menu.task') }}
          </router-link>
        </a-menu-item>
        <a-menu-item>
          <router-link to='/teacher/pd-content-redirect'>
            PD Content
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

    <import-content :visible='showImportContent' v-if='showImportContent' @close='showImportContent = false'/>
  </div>
</template>

<script>
import ImportContent from '@/components/ImportContent/ImportContent'
export default {
  name: 'CreateNew',
  components: { ImportContent },
  data () {
    return {
      showImportContent: false
    }
  },
  methods: {
    handleImport () {
      this.showImportContent = true
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
