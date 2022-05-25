<template>
  <div class='content-type-filter'>
    <a-dropdown>
      <a-menu slot="overlay">
        <a-menu-item @click="toggleType(null, 'All')">
          <span>All</span>
        </a-menu-item>
        <a-menu-item @click="toggleType('unit-plan', 'Units')">
          <span>Units</span>
        </a-menu-item>
        <a-menu-item @click="toggleType('task', 'Tasks')">
          <span>Tasks</span>
        </a-menu-item>
        <a-menu-item @click="toggleType('pdContent', 'PD contents')">
          <span>PD contents</span>
        </a-menu-item>
        <a-menu-item @click="toggleType('video', 'Videos')">
          <span>Videos</span>
        </a-menu-item>
      </a-menu>
      <a-button
        class="type-filter-button"
        style="padding: 0 20px;display:flex; align-items:center ;height: 40px;border-radius: 6px;background: #FFFFFF;font-family: Inter-Bold;color: #182552;">
        <span v-if="currentTypeLabel">{{ currentTypeLabel }}</span> <span v-else>Choose type(s)of content</span>
        <a-icon type="caret-down" /> </a-button>
    </a-dropdown>
  </div>
</template>

<script>
import { SESSION_CURRENT_PAGE, SESSION_CURRENT_TYPE, SESSION_CURRENT_TYPE_LABEL } from '@/const/common'
import * as logger from '@/utils/logger'

export default {
  name: 'ContentTypeFilter',
  data() {
    return {
      currentType: null,
      currentTypeLabel: 'All'
    }
  },
  created() {
    this.currentType = sessionStorage.getItem(SESSION_CURRENT_TYPE) ? parseInt(sessionStorage.getItem(SESSION_CURRENT_TYPE)) : null
    this.currentTypeLabel = sessionStorage.getItem(SESSION_CURRENT_TYPE_LABEL) ? sessionStorage.getItem(SESSION_CURRENT_TYPE_LABEL) : 'All'
  },
  methods: {
    toggleType (type, label) {
      logger.info('toggleType ' + type + ' label ' + label)
      this.currentType = type
      this.currentTypeLabel = label
      this.pageNo = 1
      sessionStorage.setItem(SESSION_CURRENT_PAGE, this.pageNo)
      sessionStorage.setItem(SESSION_CURRENT_TYPE_LABEL, label)
      if (type) {
        sessionStorage.setItem(SESSION_CURRENT_TYPE, type)
      }
      this.$emit('change', {
        type: this.currentType
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>