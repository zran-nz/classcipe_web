<template>
  <div class="third-login-btn">
    <div class="btn-content">
      <div class="svg-icon">
        <google-icon-svg />
      </div>
      <div class="label">{{ label }}</div>
    </div>
  </div>
</template>

<script>
import GoogleIconSvg from '@/assets/icons/google/googleIcon.svg?inline'

export default {
  name: 'ThirdLoginButton',
  components: {
    GoogleIconSvg
  },
  props: {
    label: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    }
  },
  computed: {}
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";
.third-login-btn {
  cursor: pointer;
  user-select: none;
  min-width: 260px;
  width: 368px;
  height: 40px;
  font-size: 16px;
  background: @primary-color;
  color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease-in;
  border: 1px solid rgba(27, 31, 35, 0.1);
  &:hover {
    background: #fafbfc;
  }
  .btn-content {
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .svg-icon {
      height: 40px;
      width: 40px;
      svg {
        height: 40px;
        width: 40px;
      }
    }
    .label {
    }
  }
}

</style>
