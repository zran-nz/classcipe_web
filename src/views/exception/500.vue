<template>
  <!--  <a-result status="500" title="500" :sub-title="message">-->
  <a-result status="500" :title="message" >
    <template #extra>
      <a-button type="primary" @click="toHome">
        Back Home
      </a-button>
    </template>
  </a-result>
</template>

<script>

  export default {
    name: 'Exception500',
    data () {
      return {
        message: 'Sorry, the server is reporting an error.'
      }
    },
    created() {
      const msg = this.$route.query.msg
      if (msg) {
        this.message = decodeURIComponent(msg)
      }
    },
    methods: {
      toHome () {
        this.$router.push({ path: '/' })
      }
    }
  }
</script>

<style lang="less" scoped>
/deep/ .ant-result-title{
  font-size:20px;
  width:80%;
  margin: 0 auto;
}
</style>
