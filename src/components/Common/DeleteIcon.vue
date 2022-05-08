<template>
  <div class='delete-icon' :style="{ width: size + 'px', height: size + 'px'}" @click='handleClick'>
    <delete-btn :style="{ width: size + 'px', height: size + 'px', fill: color}" />
  </div>
</template>

<script>

import DeleteBtn from '@/assets/v2/icons/delete.svg?inline'

export default {
  name: 'DeleteIcon',
  props: {
    size: {
      type: Number,
      default: 15
    },
    color: {
      type: String,
      default: '#e611'
    }
  },
  components: {
    DeleteBtn
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

.delete-icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
