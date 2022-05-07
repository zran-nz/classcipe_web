<template>
  <div class='cc-fixed-form-header' :style="{left: collapsed ? $classcipe.sysConfig.collapsedSidebarWidth + 'px' : $classcipe.sysConfig.sidebarWidth + 'px'}">
    <div class='cc-header'>
      <slot name='header'></slot>
    </div>
    <div class='cc-nav'>
      <slot name='nav'></slot>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'FixedFormHeader',
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
  height: 110px;
  background-color: #fff;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);

  .cc-header {
    border-bottom: 1px solid #ECECEC;
  }
}
</style>
