<template>
  <a-card :bordered="false">
    Notification
  </a-card>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'

const directionType = {
  horizontal: 'horizontal',
  vertical: 'vertical'
}

export default {
  name: 'Notification',
  mixins: [baseMixin],
  data () {
    this.directionType = directionType
    return {
      // title: this.$t('result.success.title'),
      // description: this.$t('result.success.description')
    }
  },
  computed: {
    result () {
      return {
      title: this.$t('result.success.title'),
      description: this.$t('result.success.description')
      }
    }
  }
}
</script>
