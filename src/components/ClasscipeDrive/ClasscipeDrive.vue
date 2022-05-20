<template>
  <div class='classcipe-drive'>
    <custom-text-button label='Classcipe Drive'>
      <template v-slot:icon>
        <a-icon type='plus-circle' />
      </template>
    </custom-text-button>
  </div>
</template>

<script>

import CustomTextButton from '@/components/Common/CustomTextButton'
export default {
  name: 'ClasscipeDrive',
  components: {
    CustomTextButton
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {}
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

</style>
