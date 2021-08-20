<template>
  <div class="my-modal-header">
    <div class="close-icon" @click="handleClickClose">
      <img src="~@/assets/icons/common/close.png" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalHeader',
  methods: {
    handleClickClose () {
      this.$logger.info('handleClickClose')
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.my-modal-header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.close-icon {
  padding: 0 10px 10px 0;
}
.close-icon img {
  height: 22px;
}
</style>
