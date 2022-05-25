<template>
  <a-modal
    width="640px"
    :maskClosable="false"
    :keyboard="false"
    :footer="null"
    :closable="false"
    :visible="visible"
    destroyOnClose>
    <modal-header title='Import' @close='handleCloseModal'/>
  </a-modal>
</template>

<script>

import ModalHeader from '@/components/Common/ModalHeader'

export default {
  name: 'ImportContent',
  components: {
    ModalHeader
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    handleCloseModal () {
      this.$emit('close')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
