<template>
  <div></div>
</template>
<script>
export default {
  async mounted() {
    this.$store.dispatch('Logout').then(() => {
      this.$router.push({ name: 'login' })
    })
  }
}
</script>
