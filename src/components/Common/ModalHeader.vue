<template>
  <div class="my-modal-header">
    <div v-if="title" class="title">{{ title }}</div>
    <div class="close-icon" @click="handleClickClose" v-show='allowClose'>
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
    },
    title: {
      type: String,
      default: ''
    },
    allowClose: {
      type: Boolean,
      default: true
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
.title{
  text-align: center;
  display: flex;
  /* justify-content: center; */
  display: block;
  width: 100%;
  color: rgba(44, 42, 80, 1);
  font-size: 20px;
  font-weight: bold;
  font-family: FZCuYuan-M03S;
}
.my-modal-header {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.close-icon {
  cursor: pointer;
  padding: 0 10px 10px 0;
}
.close-icon img {
  height: 22px;
}
</style>
