<template>
  <div class="library-wrapper-container">
    <div class='library-search'>
    </div>
    <div class='library-content-wrapper'>
      <library-content />
    </div>
  </div>
</template>

<script>
import Browser from '@/components/LibraryV2/Browser'
import LibraryContent from '@/components/LibraryV3/LibraryContent'

export default {
  name: 'LibraryV2',
  components: {
    LibraryContent,
    Browser
  },
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
</style>
