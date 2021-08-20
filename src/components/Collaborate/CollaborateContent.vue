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
        <collaborate-user-list @selected="handleSelectedCollaborateUser" @cancel="handleCancel"/>
      </div>
    </a-modal>
  </div>
</template>

<script>
import CollaborateContentList from '@/components/Collaborate/CollaborateContentList'
import CollaborateUserList from '@/components/Collaborate/CollaborateUserList'
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
      const postData = {
        contents: [],
        emails: [],
        permissions: [],
        message: '',
        isFindUser: false
      }
      postData.permissions.push('view')
      postData.permissions.push('edit')
      if (data.selectedViewerEmailList.length === 0 && data.selectedEditorEmailList.length === 0) {
        this.$message.error('Please select user')
        return
      }
      this.selectedViewerContentList.forEach(contentItem => {
        this.$logger.info('selectedViewerContentList contentItem', contentItem)
        if (postData.contents.findIndex(item => item.id === contentItem.id) === -1) {
          postData.contents.push(contentItem)
        }
      })

      this.selectedEditorContentList.forEach(contentItem => {
        if (postData.contents.findIndex(item => item.id === contentItem.id) === -1) {
          postData.contents.push(contentItem)
        }
      })
      if (data.userSelectMode === 'invite') {
        data.selectedViewerEmailList.forEach(email => {
          if (postData.emails.indexOf(email) === -1) {
            postData.emails.push(email)
          }
        })
        data.selectedEditorEmailList.forEach(email => {
          if (postData.emails.indexOf(email) === -1) {
            postData.emails.push(email)
          }
        })
        postData.message = data.inviteMessage
        this.$logger.info('post data', postData)
        InviteCollaborate(postData).then(response => {
          this.$logger.info('InviteCollaborate response', response)
          this.userSelectVisible = false
          this.$message.success('success!')
        })
      } else if (data.userSelectMode === 'publish') {
        postData.isFindUser = true
        postData.findUserType = data.inviteExperts ? 0 : (data.inviteAll ? 1 : 0)
        postData.message = data.publishMessage
        this.$logger.info('publishMessage post data', postData)
        InviteCollaborate(postData).then(response => {
          this.$logger.info('InviteCollaborate response', response)
          this.userSelectVisible = false
          this.$message.success('Collaborate success!')
        })
      }
    },

    handleCancel () {
      this.$logger.info('handleCancel')
      this.userSelectVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

</style>
