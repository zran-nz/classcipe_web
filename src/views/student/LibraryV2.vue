<template>
  <div class="library-wrapper-container">
    <browser />
  </div>
</template>

<script>
import Browser from '@/components/LibraryV2/Browser'
import { UserModeMixin } from '@/mixins/UserModeMixin'

export default {
  name: 'LibraryV2',
  mixins: [UserModeMixin],
  components: {
    Browser
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
</style>
