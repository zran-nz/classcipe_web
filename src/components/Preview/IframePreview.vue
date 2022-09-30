<template>
  <a-drawer
    v-show="v2Show"
    class='iframePreview'
    :visible='true'
    :closable='false'
    :title='null'
    width='1000px'
    :bodyStyle="{ height: '100%' }"
    @close='handleClose'
  >
    <iframe id="iframebox" style="width:100%;height:100%;" src="/v2/v2Box" frameborder="0"></iframe>
  </a-drawer>
</template>
<style>
.iframePreview .ant-drawer-body{padding:0;}
</style>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'IframePreview',
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['v2Show']),
  },
  watch: {
    '$store.getters.v2Box': function(data) {
      iframebox.contentWindow.postMessage({ id: 'iframeBox', data })
    },
  },
  methods: {
    handleClose () {
      this.$store.commit('setV2Box', null)
    }
  },
  mounted() {
    window._router = this.$router
  }
}
</script>
