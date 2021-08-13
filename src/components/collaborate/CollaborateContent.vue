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
      width="800px">
      <div class="collaborate-content-wrapper">
        <collaborate-user-list @selected="handleSelectedCollaborateUser"/>
      </div>
    </a-modal>
  </div>
</template>

<script>
import CollaborateContentList from '@/components/collaborate/CollaborateContentList'
import CollaborateUserList from '@/components/collaborate/CollaborateUserList'
import { InviteCollaborate } from '@/api/collaborate'

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
      selectedViewerContentList: [],
      selectedEditorContentList: []
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
      this.selectedViewerContentList = data.selectedViewerContentList
      this.selectedEditorContentList = data.selectedEditorContentList
      this.collaborateContentSelectVisible = false
      this.userSelectVisible = true
    },
    handleSelectedCollaborateUser (data) {
      this.$logger.info('handleSelectedCollaborateUser', data)
      this.$logger.info('selectedViewerContentList', this.selectedViewerContentList)
      this.$logger.info('selectedEditorContentList', this.selectedEditorContentList)
      if (data.userSelectMode === 'invite') {
        const postData = {
          contents: [],
          emails: [],
          permissions: [],
          message: ''
        }
        postData.contents = postData.contents.concat(this.selectedViewerContentList)
        postData.contents = postData.contents.concat(this.selectedEditorContentList)
        postData.emails = postData.emails.concat(data.selectedViewerEmailList)
        postData.emails = postData.emails.concat(data.selectedEditorEmailList)
        postData.permissions.push('view')
        postData.permissions.push('edit')
        postData.message = data.inviteMessage
        this.$logger.info('post data', postData)
        InviteCollaborate(postData).then(response => {
          this.$logger.info('InviteCollaborate response', response)
          this.userSelectVisible = false
          this.$message.success('success!')
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

</style>
