<template>
  <div class='cc-google-drive'>
    <div class='drive-loading'>
      <template v-show='driveLoading'>
        <a-spin>
          <a-icon slot="indicator" type="loading" style="font-size: 24px" spin />
        </a-spin>
      </template>
    </div>
    <custom-text-button label='Google Drive' @click='showGoogleDrive'>
      <template v-slot:icon>
        <a-icon type='plus-circle' />
      </template>
    </custom-text-button>
  </div>
</template>

<script>
import CustomTextButton from '@/components/Common/CustomTextButton'
export default {
  name: 'GoogleDrive',
  components: { CustomTextButton },
  props: {
    driveLoading: {
      type: Boolean,
      default: false
    },
    driveProcess: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {
    showGoogleDrive () {
      this.$emit('show-google-drive')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.drive-loading {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin: 10px 0;
}

.cc-google-drive {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

</style>
