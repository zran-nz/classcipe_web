<template>
  <div class='share-expired'>
    <div class='expired-img'>
      <img src="~@/assets/background/expired.png"/>
    </div>
    <div class='expired-text'>
      Sorry, the link is no longer available.
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShareExpired'
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.share-expired {
  padding: 30px;
  margin-top: 70px;
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .expired-img {
    img {
      height: 250px;
    }
  }
  .expired-text {
    margin-top: 60px;
    font-weight: 500;
    font-size: 16px;
    color: #000;
    text-align: center;
    line-height: 30px;
    height: 60px;
  }
}

</style>
