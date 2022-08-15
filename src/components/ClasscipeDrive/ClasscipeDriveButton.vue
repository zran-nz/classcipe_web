<template>
  <div class='classcipe-drive'>
    <custom-button label='Classcipe Drive' @click='handleShowClasscipeDrive' style='width: 160px;'>
      <template v-slot:icon>
        <a-icon type='plus-circle' />
      </template>
    </custom-button>

    <a-modal
      v-model="driveVisible"
      :dialog-style="{ top: '50px'}"
      :footer="null"
      destroyOnClose
      width="1030px"
      title="Classcipe Drive"
      class='classcipe-drive-modal'
      @ok="driveVisible = false"
      @cancel="driveVisible = false">
      <classcipe-drive
        v-bind='$attrs'
        :content-id='contentId'
        :content-type='contentType'
        :field='field'
        :filter-type='filterType'/>
    </a-modal>
  </div>
</template>

<script>

import ClasscipeDrive from '@/components/ClasscipeDrive/ClasscipeDrive'
import CustomButton from '@/components/Common/CustomButton'
export default {
  name: 'ClasscipeDriveButton',
  props: {
    field: {
      type: String,
      default: null
    },
    filterType: {
      type: String,
      default: 'video'
    },
    contentId: {
      type: [String, Number],
      default: null
    },
    contentType: {
      type: [String, Number],
      default: null
    }
  },
  components: {
    CustomButton,
    ClasscipeDrive
  },
  data() {
    return {
      driveVisible: false
    }
  },
  methods: {
    handleShowClasscipeDrive () {
      this.driveVisible = true
    },
    hiddenClasscipeDrive () {
      this.$logger.info('hiddenClasscipeDrive')
      this.driveVisible = false
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
