<template>
  <div class="library-wrapper-container">
    <browser />
  </div>
</template>

<script>
import Browser from '@/components/LibraryV2/Browser'
import { StudyModeMixin } from '@/mixins/StudyModeMixin'

export default {
  name: 'LibraryV2',
  mixins: [StudyModeMixin],
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
