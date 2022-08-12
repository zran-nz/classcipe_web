<template>
  <div class='cc-fixed-form-header' :style="{left: collapsed ? $classcipe.sysConfig.collapsedSidebarWidth + 'px' : $classcipe.sysConfig.sidebarWidth + 'px'}">
    <div class='cc-header-item vertical-left'>
      <slot name='left'></slot>
    </div>
    <div class='cc-header-item vertical-right'>
      <slot name='right'></slot>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'FixedVerticalHeader',
  data() {
    return {}
  },
  computed: {
    ...mapState({
      collapsed: state => state.app.sideCollapsed
    })
  },
  created() {
  },
  methods: {}
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";
.cc-fixed-form-header {
  position: fixed;
  top: 0;
  right: 0;
  transition: all 0.3s ease-in-out;
  height: 70px;
  background-color: #fff;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  z-index: 900;
  overflow-x: auto;
  border-bottom: 1px solid #ECECEC;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 0 20px;
}
</style>
