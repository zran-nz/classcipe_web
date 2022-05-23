<template>
  <div class='classcipe-drive'>
    <custom-text-button label='Classcipe Drive' @click='handleShowClasscipeDrive'>
      <template v-slot:icon>
        <a-icon type='plus-circle' />
      </template>
    </custom-text-button>

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
      <classcipe-drive v-bind='$attrs'/>
    </a-modal>
  </div>
</template>

<script>

import CustomTextButton from '@/components/Common/CustomTextButton'
import ClasscipeDrive from '@/components/ClasscipeDrive/ClasscipeDrive'
export default {
  name: 'ClasscipeDriveButton',
  components: {
    ClasscipeDrive,
    CustomTextButton
  },
  data() {
    return {
      driveVisible: false
    }
  },
  created() {
  },
  methods: {
    handleShowClasscipeDrive () {
      this.driveVisible = true
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
