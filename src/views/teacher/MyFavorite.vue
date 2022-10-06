<template>
<div class="my-content">
  <iframe class='content-wrapper' src="/v2/my/saved?header=0" style="width:100%;" frameborder="0"></iframe>
</div>
</template>

<script>
export default {
  name: 'MyFavorite',
}
</script>

<style lang="less" scoped>
.my-content {
  background: #fff;
  .content-wrapper {
    min-height: calc(100vh - 10px);
  }
}

</style>
