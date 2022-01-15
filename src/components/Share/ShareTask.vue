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
      <div class='share-form'>
        <div class='share-form-detail'>
          <share-task-form :share-content='shareContent' />
        </div>
        <div class='share-form-link-tag'>
          <div class='share-tags'>
            <share-content-tag :share-content='shareContent'/>
          </div>
          <div class='share-links'>
            <share-content-link :share-content='shareContent'/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ShareCommonHeader from '@/components/Share/ShareCommonHeader'
import SharePptPreview from '@/components/Share/SharePptPreview'
import ShareTaskForm from '@/components/Share/ShareTaskForm'
import ShareContentTag from '@/components/Share/ShareContentTag'
import ShareContentLink from '@/components/Share/ShareContentLink'
export default {
  name: 'ShareTask',
  components: { ShareContentTag, ShareTaskForm, SharePptPreview, ShareCommonHeader, ShareContentLink },
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

.share-form {
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;

  .share-form-detail {
    width: 680px;
  }

  .share-form-link-tag {
    width: 320px;
    padding-left: 20px;
  }
}

</style>
