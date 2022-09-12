<template>

</template>
<script>
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  async mounted() {
    const token =  storage.get(ACCESS_TOKEN)
    const rs = await fetch('/classcipe/sys/logout', { headers: {'x-access-token': token } }).then(r => r.json())
    this.$router.replace('/user/login')
  }
}
</script>
