<template>
  <div>
  </div>
</template>

<script>
  import storage from 'store'
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import { typeMap } from '@/const/teacher'

  export default {
  name: 'PageRedirect',
  components: {
  },
    data () {
      return {
        type: 4
      }
    },
  created () {
    const token = this.$route.query.token
    if (!token) {
      token = this.$route.query.accessToken
    }
    if (token) {
      storage.set(ACCESS_TOKEN, token)
      if (parseInt(this.sourceType) === typeMap.lesson) {
          this.$router.push({ path: '/teacher/add-lesson/' + this.id })
      } else if (parseInt(this.sourceType) === typeMap.task) {
        this.$router.push('/teacher/add-task/' + this.id)
      }
    } else {
      this.$router.push({ path: '/user/login' })
    }
  },
  props: {
    id: {
      type: String,
      default: null
    },
    sourceType: {
      type: String,
      default: null
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
  .preview-detail{
    /*margin: 0 auto;*/
  }
</style>
