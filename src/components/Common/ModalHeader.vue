<template>
  <div class="my-modal-header">
    <div v-if="title" class="title" :style="{fontSize: size + 'px'}">{{ title }}</div>
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
    },
    size: {
      type: Number,
      default: 16
    }
  },
  methods: {
    handleClickClose () {
      console.info('handleClickClose')
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.title{
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: row;
  width: 100%;
  color: rgba(44, 42, 80, 1);
  font-weight: bold;
  line-height: 40px;
  padding-bottom: 10px;
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
