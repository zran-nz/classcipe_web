<template>
  <div style="width: 600px">
    <div class="preview-wrapper">
      <div class="preview-detail">
        <common-preview  :id="taskId" :type="4" :can-edit="false"/>
      </div>
    </div>
  </div>
</template>

<script>
  import storage from 'store'
  import { ACCESS_TOKEN } from '../../store/mutation-types'
  import CommonPreview from '@/components/Common/CommonPreview'

  export default {
  name: 'TaskPreview',
  components: {
    CommonPreview
  },
  created () {
    const token = this.$route.query.token
    storage.set(ACCESS_TOKEN, token)
  },
  props: {
    taskId: {
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
