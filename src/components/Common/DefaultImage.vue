<template>
  <div class='default-image'>
    <div class='img-wrapper'>
      <img src='~@/assets/v2/icons/broken.png' />
    </div>
    <div class='no-image-tips'>
      No image
    </div>
    <div class='cover-content'>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DefaultImage',
}
</script>
<style lang='less' scoped>
@import "~@/components/index.less";

.default-image {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #ddedfa;
  position: relative;
  width: 550px;
  height: 330px;
  padding-bottom: 50px;

  .img-wrapper {
    img {
      width: 140px;
    }
  }

  .no-image-tips {
    padding-top: 10px;
    text-align: center;
    font-size: 24px;
    color: #104791
  }

  .cover-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

</style>