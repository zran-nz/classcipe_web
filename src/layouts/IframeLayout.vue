<template>
  <div id="iframe-layout" :class="['iframe-layout-wrapper', isMobile && 'mobile']">
    <router-view />
  </div>
</template>

<script>
import { deviceMixin } from '@/store/device-mixin'
import SelectLang from '@/components/SelectLang'

export default {
  name: 'IframeLayout',
  components: {
    SelectLang
  },
  mixins: [deviceMixin],
  mounted() {
    document.body.classList.add('iframe-layout')
  },
  beforeDestroy() {
    document.body.classList.remove('iframe-layout')
  }
}
</script>

<style lang="less" scoped>
#iframe-layout.iframe-layout-wrapper {
  height: 100%;
  background-color: #fff;
  overflow: hidden;

  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }

  .container {
    width: 100%;
    height: 100vh;
    // min-height: 900px;
    background: #f0f2f5 url(~@/assets/background.svg) no-repeat;
    background-size: 100%;
    // padding: 50px 0 84px;
    // position: relative;
    background-color: #f7f8ff;

    .user-layout-content {
      max-width: 1148px;
      margin: 0 auto;
      padding: 20px 0 20px;

      .top {
        // text-align: center;

        .header {
          height: 56px;
          line-height: 56px;
          margin-bottom: 20px;

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
            height: 56px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 33px;
            color: rgba(0, 0, 0, 0.85);
            font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        min-width: 260px;
        width: 368px;
        margin: 0 auto;
      }
    }

    .user-layout-lang {
      position: absolute;
      top: 0;
      right: 0;
      // width: 100%;
      height: 40px;
      line-height: 44px;
      text-align: right;

      .select-lang-trigger {
        cursor: pointer;
        padding: 12px;
        margin-right: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        vertical-align: middle;
      }
    }

    a {
      text-decoration: none;
    }
  }

  .footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 40px;
    margin: 0 auto;
    min-width: 260px;
    text-align: center;
    .links {
      margin-bottom: 8px;
      font-size: 14px;
      a {
        color: #15c39a;
        transition: all 0.3s;
        &:not(:last-child) {
          margin-right: 40px;
        }
      }
    }
    .copyright {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
    }
  }
}
</style>
