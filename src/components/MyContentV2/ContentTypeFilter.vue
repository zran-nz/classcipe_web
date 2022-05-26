<template>
  <div class='content-type-filter'>
    <a-dropdown>
      <a-menu slot="overlay" class='create-new-menu'>
        <a-menu-item @click="toggleType(null, 'All')">
          <span>All</span>
        </a-menu-item>
        <a-menu-item @click="toggleType(typeMap['unit-plan'], 'Units')">
          <span>Units</span>
        </a-menu-item>
        <a-menu-item @click="toggleType(typeMap.task, 'Tasks')">
          <span>Tasks</span>
        </a-menu-item>
        <a-menu-item @click="toggleType(typeMap.pd, 'PD contents')">
          <span>PD contents</span>
        </a-menu-item>
        <a-menu-item @click="toggleType(typeMap.video, 'Videos')">
          <span>Videos</span>
        </a-menu-item>
      </a-menu>
      <a-button
        class="type-filter-button"
        style="padding: 0 25px;display:flex; align-items:center ;border-radius: 6px;background: #FFFFFF;font-family: Inter-Bold;color: #182552;">
        <span v-if="currentTypeLabel">{{ currentTypeLabel }}</span> <span v-else>Choose type(s)of content</span>
        <a-icon type="caret-down" /> </a-button>
    </a-dropdown>
  </div>
</template>

<script>
import { SESSION_CURRENT_PAGE, SESSION_CURRENT_TYPE, SESSION_CURRENT_TYPE_LABEL } from '@/const/common'
import { typeMap } from '@/const/teacher'

export default {
  name: 'ContentTypeFilter',
  data() {
    return {
      currentType: null,
      typeMap: typeMap,
      currentTypeLabel: 'All'
    }
  },
  created() {
    this.currentType = sessionStorage.getItem(SESSION_CURRENT_TYPE) ? parseInt(sessionStorage.getItem(SESSION_CURRENT_TYPE)) : null
    this.currentTypeLabel = sessionStorage.getItem(SESSION_CURRENT_TYPE_LABEL) ? sessionStorage.getItem(SESSION_CURRENT_TYPE_LABEL) : 'All'
  },
  methods: {
    toggleType (type, label) {
      this.$logger.info('toggleType ' + type + ' label ' + label)
      this.currentType = type
      this.currentTypeLabel = label
      this.pageNo = 1
      sessionStorage.setItem(SESSION_CURRENT_PAGE, this.pageNo)
      sessionStorage.setItem(SESSION_CURRENT_TYPE_LABEL, label)
      if (type) {
        sessionStorage.setItem(SESSION_CURRENT_TYPE, type)
      }
      this.$emit('change', this.currentType)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.type-filter-button {
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
  span {
    font-family: Arial;
    font-weight: 400;
    color: #525252;
  }
}

</style>
