<template>
  <div class='check-icon' :style="{ 'background-color': bgColor, 'border-radius': width + 'px' }">
    <check-svg :style="{ fill: color, width: size + 'px', height: size + 'px' }" />
  </div>
</template>

<script>

import CheckSvg from '@/assets/v2/icons/check.svg?inline'

export default {
  name: 'CheckIcon',
  props: {
    size: {
      type: Number,
      default: 18
    },
    color: {
      type: String,
      default: '#fff'
    },
    bgColor: {
      type: String,
      default: '#007A8E'
    }
  },
  components: {
    CheckSvg
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

.check-icon {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 1px;
  border-radius: 50%;
}

</style>
