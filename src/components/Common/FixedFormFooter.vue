<template>
  <div class='cc-fixed-form-footer' :style="{left: collapsed ? $classcipe.sysConfig.collapsedSidebarWidth + 'px' : $classcipe.sysConfig.sidebarWidth + 'px'}">
    <div class='step-mask' v-if='showMask'>
    </div>
    <div class='left'>
      <slot name='left'></slot>
    </div>
    <div class='right'>
      <slot name='right'></slot>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'FixedFormFooter',
  props: {
    showMask: {
      type: Boolean,
      default: false
    }
  },
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
  padding: 0 30px;
  position: fixed;
  box-shadow: 2px 0 2px rgba(0, 0, 0, 0.1);
  bottom: 0;
  right: 0;
  height: 50px;
  background: #F4F5F7;
  align-items: center;
  display: flex;
  justify-content: space-between;
  z-index: 999;
  transition: all 0.3s ease-in-out;
  overflow-x: auto;
}

.step-mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 800;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}
</style>
