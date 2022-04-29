<template>
  <a-drawer
    destroyOnClose
    placement="right"
    :closable="false"
    width="1000px"
    :visible="previewVisible"
    @close="handlePreviewClose"
  >
    <div class="preview-wrapper-row">
      <div class="view-back">
        <a-button type='primary' class='preview-back-btn' shape='round' @click="handlePreviewClose"><a-icon type="left" :style="{'font-size': '12px'}" />Back</a-button>
      </div>
      <div class="detail-wrapper" v-if="previewCurrentId && previewType">
        <common-preview-v2 :id="previewCurrentId" :type="previewType" />
      </div>
    </div>
  </a-drawer>
</template>

<script>
import CommonPreviewV2 from '@/components/Common/CommonPreviewV2'

export default {
  name: 'PreviewContent',
  components: { CommonPreviewV2 },
  props: {
    previewCurrentId: {
      type: String,
      required: true
    },
    previewType: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      previewVisible: true
    }
  },
  created() {
  },
  methods: {
    handlePreviewClose() {
      this.$emit('close')
    },
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>