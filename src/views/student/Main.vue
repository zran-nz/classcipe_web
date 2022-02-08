<template>
  <a-card :bordered="false" :bodyStyle="{ padding: '16px 24px', height: '100%' }" :style="{ height: '100%' }">
    <AddPreference />
  </a-card>
</template>

<script>
import AddPreference from './AddPreference'

export default {
  name: 'Main',
  components: {
    AddPreference
  },
  data() {
    return {}
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="css">
</style>
