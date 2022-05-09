<template>
  <div class='cc-no-data'>
    <div class='icon-no-data'>
      <no-data-icon />
    </div>
    <div class='cc-no-data-text'>
      {{ text }}
    </div>
  </div>
</template>

<script>

import NoDataIcon from '@/assets/v2/icons/no_data.svg?inline'
export default {
  name: 'CommonNoData',
  props: {
    text: {
      type: String,
      default: 'No data'
    }
  },
  components: {
    NoDataIcon
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
.cc-no-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;

  .icon-no-data {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    svg {
      width: 70px;
      height: 70px;
    }
  }

  .cc-no-data-text {
    font-size: 12px;
    color: #292929;
    line-height: 25px;
  }
}
</style>
