<template>
  <div>
    <a-spin size="large">
    </a-spin>
  </div>
</template>

<script>
  import storage from 'store'
  import { ACCESS_TOKEN } from '../../store/mutation-types'
  import { typeMap } from '@/const/teacher'

  export default {
  name: 'PageRedirect',
  components: {
  },
  data () {
  },
  created () {
    const token = this.$route.query.token
    const id = this.$route.query.id
    const type = this.$route.query.type
    if (token) {
      storage.set(ACCESS_TOKEN, token)
      if (type === typeMap.lesson) {
        this.$router.replace('/teacher/add-lesson/' + id)
      } else if (type === typeMap.task) {
        this.$router.replace('/teacher/add-task/' + id)
      } else {
        this.$router.push({ path: '/teacher/main/created-by-me' })
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
