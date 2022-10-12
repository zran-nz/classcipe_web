<template>
<div class="my-content" style="padding:0 1rem;">
  <iframe class='content-wrapper' :src="src" style="width:100%;" frameborder="0"></iframe>
</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'LiveWorkShops',
  computed: {
    ...mapState({
      currentSchool: state => state.user.currentSchool,
    }),
    src() {
      if (this.currentSchool?.id) return `/v2/my/workshop?header=0&school=${this.currentSchool?.id}`
      return '/v2/my/workshop?header=0'
    }
  },
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
