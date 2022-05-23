<template>
  <div class='cc-google-drive'>
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

.cc-google-drive {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
