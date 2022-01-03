<template>
  <div>
    <div class="header">
      <header
        class="ant-layout-header ant-pro-fixed-header ant-pro-top-menu"
        style="padding: 0px; width: 100%; z-index: 9; right: 0px; opacity: 1; pointer-events: auto;">
        <div class="ant-pro-top-nav-header dark">
          <div class="ant-pro-top-nav-header-main wide">
            <div class="ant-pro-top-nav-header-left">
              <div id="logo" class="ant-pro-top-nav-header-logo">
                <div class="home-nav"><img src="/img/logo.81b6ef9b.png">
                  <h1>Classcipe</h1></div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
    <div class="link-wrapper">
      <div class="img">
        <img src="~@/assets/icons/collaborate/link_valid.png">
      </div>
      <div class="title">
        The link is no longer valid or you has been removed
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'LinkValid',
  components: {

  },
  data () {
    return {
      loading: false
    }
  },
  created () {

  },
  props: {
    code: {
      type: String,
      default: null
    }
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
.header {
  height: 44px;
  line-height: 44px;

  .badge {
    position: absolute;
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
    margin-left: -12px;
    margin-top: -10px;
    opacity: 0.8;
  }

  .logo {
    height: 44px;
    vertical-align: top;
    margin-right: 16px;
    border-style: none;
  }

  .title {
    font-size: 33px;
    color: rgba(0, 0, 0, .85);
    font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
    font-weight: 600;
    position: relative;
    top: 2px;
  }
}
  .link-wrapper {
    margin:0 auto;
    text-align: center;
    img{
      width:300px;
      height:300px;
      margin-top:50px;
      text-align: center;
    }
  }
  .title{
    color: rgba(44, 42, 80, 1);
    font-size: 16px;
    margin-top: 40px;
    font-family: FZCuYuan-M03S;
  }
</style>
