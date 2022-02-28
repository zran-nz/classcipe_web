<template>
  <div class="library-wrapper-container">
    <browser />
  </div>
</template>

<script>
import Browser from '@/components/LibraryV2/Browser'
import { mapState } from 'vuex'

export default {
  name: 'LibraryV2',
  components: {
    Browser
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      studyMode: state => state.app.studyMode
    })
  },
  created () {
    if (this.studyMode === 'schoolStudy' && this.$route.name === 'StudentLibraryV2') {
      this.$router.push({ path: '/student/main/my-task' })
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
