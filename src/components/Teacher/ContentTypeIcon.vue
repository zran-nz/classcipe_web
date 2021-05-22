<template>
  <div class="status-icon-item">
    <template v-if="type === 1">
      <a-icon type="flag" />
    </template>
    <template v-if="type === 2">
      <a-icon type="project" />
    </template>
    <template v-if="type === 3">
      <a-icon type="read" />
    </template>
    <template v-if="type === 4">
      <a-icon type="cluster" />
    </template>
    <template v-if="type === 5">
      <a-icon type="usergroup-add" />
    </template>
    <template v-if="type === 6">
      <a-icon type="wallet" />
    </template>
  </div>
</template>

<script>
/**
 'topic': 1,
 'unit-plan': 2,
 'material': 3,
 'task': 4,
 'lesson': 5,
 'assessment': 6
 */
export default {
  name: 'ContentTypeIcon',
  props: {
    type: {
      type: Number,
      default: -1
    }
  }
}
</script>

<style lang='less' scoped>
.status-icon-item {
  text-align: center;
  display: inline-block;
}

.ant-menu-item .anticon, .ant-menu-submenu-title .anticon {
  margin-right: 0;
}
</style>
