<template>
  <div class='img-draw'></div>
</template>

<script>
export default {
  name: 'ImageDraw',
  props: {
    imgData: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      imgBase64Data: null,
    }
  },
  created() {
    this.imgBase64Data = this.imgData
  }
}
</script>


<style lang="less" scoped>
@import "~@/components/index.less";

</style>