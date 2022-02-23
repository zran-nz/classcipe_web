<template>
  <div class='share-content-detail'>
    <div class='share-header'>
      <share-common-header
        :id='shareContent.plan.id'
        :type='shareContent.plan.type'
        :title='shareContent.plan.name'
        :image='shareContent.plan.image'
        :avatar='shareContent.plan.avatar'
        :create-by='shareContent.plan.createBy'
        :create-time='shareContent.plan.createTime'
        :is-favorite.sync='shareContent.plan.isFavorite'
      />
    </div>
    <div class='share-body'>
      <div
        class='share-action'
        v-if='$store.getters.userInfo.email && (collaborateUserEmailList.indexOf($store.getters.userInfo.email) !== -1 || $store.getters.userInfo.email === shareContent.plan.createBy)'>
        <a-button type='primary' @click='handleEdit'>Edit</a-button>
      </div>
      <div class='share-ppt-preview'>
        <share-ppt-preview :ppt-images='shareContent.presentationImages' />
      </div>
      <div class='share-form'>
        <div class='share-form-detail'>
          <share-unit-plan-form :share-content='shareContent' />
        </div>
        <div class='share-form-link-tag'>
          <div class='share-tags'>
            <share-content-tag :share-content='shareContent' />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ShareCommonHeader from '@/components/Share/ShareCommonHeader'
import SharePptPreview from '@/components/Share/SharePptPreview'
import ShareContentTag from '@/components/Share/ShareContentTag'
import ShareUnitPlanForm from '@/components/Share/ShareUnitPlanForm'
import { QueryContentCollaborates } from '@/api/collaborate'

export default {
  name: 'ShareUnitPlan',
  components: { ShareUnitPlanForm, SharePptPreview, ShareContentTag, ShareCommonHeader },
  props: {
    shareContent: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      collaborateUserEmailList: []
    }
  },
  created() {
    this.$logger.info('ShareUnitPlan created', this.shareContent)
    if (this.$store.getters.token) {
      this.queryContentCollaborates()
    }
  },
  methods: {
    queryContentCollaborates() {
      QueryContentCollaborates({ id: this.shareContent.plan.id, type: this.shareContent.plan.type }).then(response => {
        this.$logger.info('QueryContentCollaborates response:', response)
        if (response.success) {
          this.collaborateUserEmailList = response.result.users.map(user => user.email)
        }
      })
    },

    handleEdit () {
      this.$router.push({
        path: '/teacher/unit-plan-redirect/' + this.shareContent.plan.id
      })
    }
  }
}
</script>

<style lang='less' scoped>
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
.share-action {
  padding: 10px 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
