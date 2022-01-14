<template>
  <div class='share-content-detail'>
    <div class='share-header'>
      <share-common-header
        :id='shareContent.task.id'
        :type='shareContent.task.type'
        :title='shareContent.task.name'
        :image='shareContent.task.image'
        :avatar='shareContent.task.avatar'
        :create-by='shareContent.task.createBy'
        :create-time='shareContent.task.createTime'
        :is-favorite.sync='shareContent.task.isFavorite'
      />
    </div>

    <div class='share-body'>
      <div class='share-ppt-preview'>
        <share-ppt-preview :ppt-images='shareContent.presentationImages' />
      </div>
    </div>
  </div>
</template>

<script>
import ShareCommonHeader from '@/components/Share/ShareCommonHeader'
import SharePptPreview from '@/components/Share/SharePptPreview'
export default {
  name: 'ShareTask',
  components: { SharePptPreview, ShareCommonHeader },
  props: {
    shareContent: {
      type: Object,
      required: true
    }
  },
  created() {
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.share-body {
  max-width: 1000px;
  margin: 20px auto;
}

</style>
