<template>
  <div class="status-icon-item">
    <template v-if="status === 0">
      <a-icon type="cloud-upload" />
    </template>
  </div>
</template>

<script>

export default {
  name: 'ContentStatusIcon',
  props: {
    status: {
      type: Number,
      default: -1
    }
  }
}
</script>

<style lang='less' scoped>
.status-icon-item {
  width: 30px;
  text-align: center;
  display: inline-block;
}
</style>
