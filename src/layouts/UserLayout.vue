<template>
  <div id="userLayout" :class="['user-layout-wrapper', isMobile && 'mobile']">
    <div class="container">
      <div class="user-layout-left">
        <img src="~@/assets/background/login-bg.png" class="bg" />
        <div class="user-layout-title">
          <img src="~@/assets/logo/logo1.png" class="logo" />
          <img src="~@/assets/logo/Lasscipe.png" class="name" />
          <div class="title">Empowering, sharing and networking</div>
        </div>
      </div>
      <div class="user-layout-right">
        <div class="user-layout-lang">
          <select-lang class="select-lang-trigger" />
        </div>
        <router-view />
      </div>

      <!-- <div class="user-layout-content">
        <div class="top">
          <div class="header">
            <a href="/">
              <img src="~@/assets/logo/beatop.png" class="logo" alt="logo">
            </a>
          </div>
          <div class="desc">
            {{ $t('layouts.userLayout.title') }}
          </div>
        </div>
      </div> -->

      <!-- <div class="footer">
        <div class="links">
          <a href="https://www.classcipe.com" target="_blank">Help</a>
          <a href="https://www.classcipe.com/policy.html" target="_blank">Privacy Policy</a>
          <a href="https://www.classcipe.com/term.html" target="_blank">Terms</a>
        </div>
        <div class="copyright">
          Copyright &copy; 2021 Classcipe. All rights reserved <a href="https://my.classcipe.com" target="_blank"></a>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { deviceMixin } from '@/store/device-mixin'
import SelectLang from '@/components/SelectLang'

export default {
  name: 'UserLayout',
  components: {
    SelectLang
  },
  mixins: [deviceMixin],
  mounted () {
    document.body.classList.add('userLayout')
  },
  beforeDestroy () {
    document.body.classList.remove('userLayout')
  }
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;
  background-color: #f7f8ff;
  overflow: scroll;

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
    min-width: 1148px;
    height: 100vh;
    min-height: 900px;
    // background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;
    // background-size: 100%;
    // padding: 50px 0 84px;
    position: relative;
    display: flex;
    background-color: #f7f8ff;

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

    .user-layout-left {
      width: 40%;
      min-width: 528px;
      max-width: 628px;
      background: #15c39a;
      position: relative;

      .user-layout-title {
        position: absolute;
        top: 106px;
        left: 77px;
        .logo {
          margin-right: 13px;
        }
        .title {
          font-size: 24px;
          color: #fff;
          margin-top: 9px;
        }
      }
      .bg {
        position: absolute;
        bottom: 0px;
        left: 0px;
        width: 160%;
      }
    }
    .user-layout-right {
      min-width: 560px;
      flex: 1;
      z-index: 1;
      padding: 0px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    // .user-layout-content {
    //   padding: 32px 0 24px;

    //   .top {
    //     text-align: center;

    //     .header {
    //       height: 44px;
    //       line-height: 44px;

    //       .badge {
    //         position: absolute;
    //         display: inline-block;
    //         line-height: 1;
    //         vertical-align: middle;
    //         margin-left: -12px;
    //         margin-top: -10px;
    //         opacity: 0.8;
    //       }

    //       .logo {
    //         height: 44px;
    //         vertical-align: top;
    //         margin-right: 16px;
    //         border-style: none;
    //       }

    //       .title {
    //         font-size: 33px;
    //         color: rgba(0, 0, 0, 0.85);
    //         font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
    //         font-weight: 600;
    //         position: relative;
    //         top: 2px;
    //       }
    //     }
    //     .desc {
    //       font-size: 14px;
    //       color: rgba(0, 0, 0, 0.45);
    //       margin-top: 12px;
    //       margin-bottom: 40px;
    //     }
    //   }

    //   .main {
    //     min-width: 260px;
    //     width: 368px;
    //     margin: 0 auto;
    //   }
    // }

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
