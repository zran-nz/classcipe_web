<template>
  <div class='delete-icon' :style="{ width: size + 'px', height: size + 'px'}">
    <delete-btn :style="{ width: size + 'px', height: size + 'px'}" />
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
  methods: {}
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
