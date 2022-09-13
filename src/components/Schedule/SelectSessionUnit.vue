<template>
  <a-modal
    v-model='visible'
    :closable='false'
    :footer='null'
    :maskClosable='false'
    :dialog-style="{ top: '50px'}"
    destroyOnClose
    width='750px'>
    <modal-header title='Please select a Unit this session belongs to' :allow-close='false'/>
    <div class='content'>
      <div class='data-list'>
        <div class='data-content-item' :class="{'active-item': content === selected, 'unselect': calculateCantSelect(content)}" v-for='content in list' :key='content.id' @click='handleSelect(content)'>
          <content-item
            :show-button='false'
            :click-preview='false'
            :show-edit='false'
            :border-style="selected === content ? 'solid' : 'dashed'"
            :content='content' />
          <div class='inComTip'>
            <a-tooltip title="Incompleted content" v-if="calculateCantSelect(content)">
              <a-icon type="exclamation" style="font-size:16px;font-weight:bold;color:#ef4136;" />
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div class='modal-action-right'>
      <a-space>
        <a-button @click='handleBack'>Back</a-button>
        <a-tooltip v-if="!selected || calculateCantSelect(selected)" title="No completed content selected">
          <a-button :disabled="true" type="primary">Next</a-button>
        </a-tooltip>
        <a-button v-else type="primary" @click="handleConfirmSelect">Next</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script>

import ModalHeader from '@/components/Common/ModalHeader'
import ContentItem from '@/components/MyContentV2/ContentItem'
import ContentPreviewDetail from '@/components/Preview/ContentPreviewDetail'

export default {
  name: 'SelectSessionUnit',
  components: { ContentPreviewDetail, ContentItem, ModalHeader },
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      visible: true,
      selected: null,
      previewCurrentId: null,
      previewType: null,
      previewVisible: false
    }
  },
  created() {
    if (this.list.length) {
      this.selected = this.list[0]
      this.handleSelect(this.selected)
    }
  },
  methods: {
    handleBack() {
      this.$emit('back')
    },
    handleSelect (content) {
      this.$logger.info('handleSelect', content)
      this.selected = content
      this.handlePreviewDetail(content)
    },
    handlePreviewDetail (data) {
      this.$logger.info('handlePreviewDetail', data, 'allowPreview', this.allowPreview)
      this.previewVisible = false
      this.$nextTick(() => {
        this.previewCurrentId = data.id
        this.previewType = data.type
        this.previewVisible = true
      })
    },
    handlePreviewClose () {
      this.$logger.info('handlePreviewClose')
      this.previewVisible = false
      this.previewCurrentId = null
      this.previewType = null
    },
    handleConfirmSelect () {
      this.$emit('select', this.selected)
    },
    calculateCantSelect(content) {
      // (content.type === typeMap.task || content.type === typeMap.pd) &&
      return !content || ((!content.canPublish || content.slideEditing))
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.active-item {
  outline: 2px solid #15c39a;
  border-radius: 6px;
}

.content {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
}

.data-list {
  padding: 0 10px 0 5px;
  max-height: 500px;
  width: 700px;
  overflow-y: auto;
}

.preview-item {
  padding: 0 10px 0 5px;
  max-height: 500px;
  width: 650px;
  overflow-y: auto;
}

.modal-action-right {
  margin-top: 10px;
}

.data-content-item {
  box-shadow: 0 0 3px 3px #eee;
  position: relative;
  .inComTip {
    position: absolute;
    bottom: 30px;
    right: 20px;
  }
}
</style>
