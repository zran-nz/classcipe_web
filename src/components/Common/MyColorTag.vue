<template>
  <div class="my-color-tag">
    <div class="tag-text">
      {{ name }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyColorTag',
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
