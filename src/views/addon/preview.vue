<template>
  <div style="width: 600px">
    <div class="preview-wrapper">
      <div class="preview-detail">
        <common-preview-v2 :id="id" :type="type" :can-edit="false"/>
      </div>
    </div>
  </div>
</template>

<script>
  import storage from 'store'
  import { ACCESS_TOKEN } from '../../store/mutation-types'
  import CommonPreviewV2 from '@/components/Common/CommonPreviewV2'

  export default {
  name: 'AddonPreview',
  components: {
    CommonPreview
  },
  data () {
    return {
      type: 4
    }
  },
  created () {
    this.type = parseInt(this.sourceType)
    let token = this.$route.query.token
    if (!token) {
      token = this.$route.query.accessToken
    }
    storage.set(ACCESS_TOKEN, token)
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
