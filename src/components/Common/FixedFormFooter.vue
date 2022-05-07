<template>
  <div class='cc-fixed-form-footer' :style="{left: collapsed ? $classcipe.sysConfig.collapsedSidebarWidth + 'px' : $classcipe.sysConfig.sidebarWidth + 'px'}">
    <slot></slot>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'FixedFormFooter',
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
.cc-fixed-form-footer {
  position: fixed;
  top: 0;
  right: 0;
  transition: all 0.3s ease-in-out;
}
</style>
