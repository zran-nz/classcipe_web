<template>
  <a-button type="primary" class="third-login-btn" :disabled="disabled">
    <div class="svg-icon">
      <google-icon-svg v-if="type === 'google'" />
      <zoom-icon-svg v-if="type === 'zoom'" />
    </div>
    <div class="label">{{ label }}</div>
  </a-button>
</template>

<script>
import GoogleIconSvg from '@/assets/icons/google/googleIcon.svg?inline'
import ZoomIconSvg from '@/assets/icons/zoom/zoomus-icon.svg?inline'

export default {
  name: 'ThirdLoginButton',
  components: {
    GoogleIconSvg,
    ZoomIconSvg
  },
  props: {
    label: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'google'
    }
  },
  computed: {}
}
</script>

<style lang='less' scoped>
@import '~@/components/index.less';
.third-login-btn {
  // cursor: pointer;
  // user-select: none;
  margin: 10px 0;
  min-width: 260px;
  width: 100%;
  height: 40px;
  font-size: 16px;
  // background: @primary-color;
  // color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  // transition: all 200ms ease-in;
  border: 1px solid rgba(27, 31, 35, 0.1);
  border-radius: 8px;
  &:hover {
    // background: fade(@primary-color, 80%);
  }
  &:disabled {
    color: rgba(0, 0, 0, 0.25);
  }
  .svg-icon {
    height: 40px;
    width: 40px;
    svg {
      height: 40px;
      width: 40px;
    }
  }
}
</style>
