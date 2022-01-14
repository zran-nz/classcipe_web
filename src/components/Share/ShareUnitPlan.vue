<template>
  <div class='share-content-detail'>
    <div class='share-header'>
      <share-common-header
        :title='shareContent.plan.name'
        :image='shareContent.plan.image'
        :avatar='shareContent.plan.avatar'
        :create-by='shareContent.plan.createBy'
        :create-time='shareContent.plan.createTime'
        :is-favorite.sync='shareContent.plan.isFavorite'
      />
    </div>
  </div>
</template>

<script>
import ShareCommonHeader from '@/components/Share/ShareCommonHeader'
export default {
  name: 'ShareUnitPlan',
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
