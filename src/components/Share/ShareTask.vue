<template>
  <div class='share-content-detail'>
    <div class='share-header'>
      <share-common-header
        :title='shareContent.task.name'
        :image='shareContent.task.image'
        :avatar='shareContent.task.avatar'
        :create-by='shareContent.task.createBy'
        :create-time='shareContent.task.createTime'
        :is-favorite.sync='shareContent.task.isFavorite'
      />
    </div>
  </div>
</template>

<script>
import ShareCommonHeader from '@/components/Share/ShareCommonHeader'
export default {
  name: 'ShareTask',
  components: { ShareCommonHeader },
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

<style scoped>

</style>
