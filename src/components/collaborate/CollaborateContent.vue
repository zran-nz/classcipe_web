<template>
  <div class="collaborate-wrapper">
    <a-modal
      v-model="collaborateContentSelectVisible"
      :footer="null"
      :maskClosable="false"
      :closable="true"
      destroyOnClose
      width="1000px">
      <div class="collaborate-content-wrapper">
        <collaborate-content-list @selected="handleSelectedCollaborateContent" :main-content="currentContent" :content-id="currentContentId" :content-type="currentContentType" v-if="currentContentId"/>
      </div>
    </a-modal>

    <a-modal
      v-model="userSelectVisible"
      :footer="null"
      :maskClosable="false"
      :closable="true"
      destroyOnClose
      width="1000px">
      <div class="collaborate-content-wrapper">
        <collaborate-user-list @select="handleSelectedCollaborateUser"/>
      </div>
    </a-modal>
  </div>
</template>

<script>
import CollaborateContentList from '@/components/collaborate/CollaborateContentList'
import CollaborateUserList from '@/components/collaborate/CollaborateUserList'

export default {
  name: 'CollaborateContent',
  components: { CollaborateUserList, CollaborateContentList },
  props: {
  },
  data () {
    return {
      currentContentId: null,
      currentContent: null,
      currentContentType: null,
      collaborateContentSelectVisible: false,

      userSelectVisible: false,
      userSelectMode: 'invite'
    }
  },
  created () {
    this.$logger.info('CollaborateContent')
  },
  methods: {
    startCollaborateModal (mainContent, id, type) {
      this.$logger.info('startCollaborateModal ' + id + ' type ' + type)
      this.currentContent = mainContent
      this.currentContentType = type
      this.currentContentId = id
      this.collaborateContentSelectVisible = true
    },
    handleSelectedCollaborateContent (data) {
      this.$logger.info('handleSelectedCollaborateContent', data)
      this.collaborateContentSelectVisible = false
      this.userSelectVisible = true
    },
    handleSelectedCollaborateUser (data) {
      this.$logger.info('handleSelectedCollaborateUser', data)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

</style>
