<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="#">©{{ year }} Classcipe, Inc.</a>
    </template>
    <template v-slot:copyright>
      <a href="#">All Rights Reserved.</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  },
  data () {
    return {
      year: new Date().getFullYear()
    }
  }
}
</script>
<style lang='less'>
.custom-render {
  margin: 5px 0;
}
</style>
