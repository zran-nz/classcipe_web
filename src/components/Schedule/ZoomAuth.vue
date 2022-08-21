<template>
  <div class='zoom-auth'>
    <div class='vertical-left'>
      <div class='zoom-icon'>
        <img src='~@/assets/icons/zoom/img.png' />
      </div>
    </div>
    <div class='auth-button' v-if='!zoomAccessToken'>
      <a-button type='primary' @click='goToZoomAuth'>Link your Zoom account to schedule a Zoom meeting</a-button>
    </div>
    <div class='auth-result' v-if='zoomAccessToken'>
      <a-alert message='The link to this meeting will be generated automatically when you schedule it' type="info"></a-alert>
    </div>
  </div>
</template>

<script>
import { ZoomAuthMixin } from '@/mixins/ZoomAuthMixin'

export default {
  name: 'ZoomAuth',
  mixins: [ ZoomAuthMixin ],
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.zoom-auth {
  padding: 15px 0;

  .zoom-icon {
    margin-bottom: 15px;
    img {
      height: 30px;
    }
  }

  .auth-button {
    margin-bottom: 15px;
  }

  .auth-result {
    margin-bottom: 15px;
  }
}
</style>
