<template>
  <div class="no-more-resources" @click="showDialog()">
    <a-empty :image='simpleImage' :description='tips'/>
  </div>
</template>

<script>

import { Empty } from 'ant-design-vue'

export default {
  name: 'NoMoreResources',
  data () {
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE
    }
  },
  methods: {
    showDialog () {
      this.$emit('show-library')
    }
  },
  props: {
    tips: {
      type: String,
      default: 'No data'
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.no-more-resources {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .icon {
    img {
      width: 150px;
    }
  }

  .tips {
    line-height: 24px;
  }
}
</style>
