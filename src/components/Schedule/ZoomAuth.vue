<template>
  <div class='zoom-auth'>
    <div class='list-item vertical-between'>
      <div class='zoom-icon'>
        <img src='~@/assets/icons/zoom/img.png' />
      </div>
      <div class='zoom-switch'>
        <a-switch :disabled="disabled" size='small' v-model='myEnableZoom' @change='handleZoomStatusChange'></a-switch>
      </div>
    </div>
    <template v-if='myEnableZoom'>
      <div class='auth-button' v-if='!zoomAccessToken'>
        <a-button type='primary' @click='goToZoomAuth'>Link your Zoom account to schedule a Zoom meeting</a-button>
      </div>
      <div class='auth-result' v-if='zoomAccessToken'>
        <a-alert message='The link to this meeting will be generated automatically when you schedule it' type="info"></a-alert>
      </div>
    </template>
  </div>
</template>

<script>
import { ZoomAuthMixin } from '@/mixins/ZoomAuthMixin'

export default {
  name: 'ZoomAuth',
  mixins: [ ZoomAuthMixin ],
  props: {
    enableZoom: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      myEnableZoom: this.enableZoom
    }
  },
  methods: {
    handleZoomStatusChange(v) {
      this.$emit('update:enableZoom', this.myEnableZoom)
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.zoom-auth {
  padding: 5px 0;
  .zoom-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 5px;
    img {
      height: 30px;
    }
  }

  .list-item {
    margin-bottom: 15px;
  }

  .auth-button {
    margin-bottom: 15px;
  }

  .auth-result {
    margin-bottom: 15px;
  }

  .zoom-switch {
    /deep/ .ant-switch {
      opacity: .8!important;
    }
  }
}
</style>
