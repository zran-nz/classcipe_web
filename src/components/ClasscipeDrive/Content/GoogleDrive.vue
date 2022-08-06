<template>
  <div class='cc-google-drive'>
    <custom-text-button label='Open Google Drive' @click='showGoogleDrive'>
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
    driveProcess: {
      type: Number,
      default: 0
    },
    field: {
      type: String,
      default: null
    }
  },
  data() {
    return {}
  },
  created() {
    this.$logger.info(`GoogleDrive field ${this.field}`)
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
