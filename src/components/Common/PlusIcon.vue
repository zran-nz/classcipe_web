<template>
  <div class='plus-icon' :style="{ width: size + 'px', height: size + 'px'}" @click='handleClick'>
    <plus-btn :style="{ width: size + 'px', height: size + 'px', fill: color}" />
  </div>
</template>

<script>

import PlusBtn from '@/assets/v2/icons/plus.svg?inline'

export default {
  name: 'PlusIcon',
  props: {
    size: {
      type: Number,
      default: 15
    },
    color: {
      type: String,
      default: '#007A8E'
    }
  },
  components: {
    PlusBtn
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {
    handleClick () {
      this.$emit('click')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.plus-icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
