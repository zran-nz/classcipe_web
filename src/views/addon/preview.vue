<template>

  <div>
    <div class="preview-wrapper">
      <div class="preview-detail">
        <main-task-preview :task-id="taskId" :can-edit="false" />
      </div>
    </div>
  </div>

</template>

<script>

import MainTaskPreview from '../../components/Task/MainTaskPreview'
import { warning } from 'ant-design-vue/lib/vc-util/warning'
import { getSlotOptions } from 'ant-design-vue/lib/_util/props-util'
import storage from 'store'
import { ACCESS_TOKEN } from '../../store/mutation-types'

export default {
  name: 'TaskPreview',
  components: {
    MainTaskPreview
  },
  created () {
    if (this.$route.query.token) {
      storage.set(ACCESS_TOKEN, this.$route.query.token)
    }
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
    width: 800px;
    /*margin: 0 auto;*/
  }
</style>
