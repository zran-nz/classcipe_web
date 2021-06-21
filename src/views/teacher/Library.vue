<template>
  <a-card :bordered="false" >
    <!--    <new-browser />-->
    <browser />
  </a-card>
</template>

<script>
import Browser from '@/components/Library/Browser'

export default {
  name: 'NewLibrary',
  components: {
    Browser
  },
  data () {
    return {
    }
  },
  computed: {
  },
  created () {

  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
</style>
