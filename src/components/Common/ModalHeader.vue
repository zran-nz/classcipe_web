<template>
  <div class="my-modal-header">
    <div class="close-icon" @click="handleClickClose">
      <img src="~@/assets/icons/common/close.png" v-if="!white" />
      <img src="~@/assets/icons/common/close_white.png" v-if="white"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalHeader',
  props: {
    white: {
      type: Boolean,
      default: false
    }
  },
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
  width: 100%;
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
