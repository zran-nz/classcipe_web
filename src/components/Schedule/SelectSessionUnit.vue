<template>
  <a-modal
    v-model='visible'
    :closable='false'
    :footer='null'
    :maskClosable='false'
    destroyOnClose
    width='700px'>
    <modal-header title='Please select a Unit this session belongs to' :allow-close='false'/>
    <div class='data-list'>
      <div class='data-content-item' v-for='content in list' :key='content.id'>
        <content-item
          :show-button='false'
          :click-preview='false'
          :border-style="selected === content ? 'solid' : 'dashed'"
          :content='content'
          @click.native='handleSelect(content)' />
      </div>
    </div>
    <div class='modal-action-right'>
      <a-space>
        <a-button @click='handleClose'>Back</a-button>
        <a-button type='primary' @click='handleConfirmSelect' :disabled='!selected'>Next</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script>

import ModalHeader from '@/components/Common/ModalHeader'
import ContentItem from '@/components/MyContentV2/ContentItem'

export default {
  name: 'SelectSessionUnit',
  components: { ContentItem, ModalHeader },
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      visible: true,
      selected: null
    }
  },
  created() {
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleSelect (content) {
      this.selected = content
    },
    handleConfirmSelect () {
      this.$emit('select', this.selected)
      this.handleClose()
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
