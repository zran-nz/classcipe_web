<template>
  <div class="collaborate-wrapper">
    <div class="collaborate-content-wrapper">
      <collaborate-user-list
        v-show="userSelectVisible"
        @selected="handleSelectedCollaborateUser"
        @cancel="handleCancel"/>
      <collaborate-content-list
        v-show="collaborateContentSelectVisible"
        @selected="handleSelectedCollaborateContent"
        @go-previous="handlePrevious"
        :main-content="mainContent"
        :content-id="contentId"
        :content-type="contentType"/>
    </div>
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
    mainContent: {
      type: Object,
      required: true
    },
    contentId: {
      type: String,
      required: true
    },
    contentType: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      showModal: true,
      collaborateContentSelectVisible: false,

      userSelectVisible: true,
      selectedUserList: [],
      selectedViewerEmailList: [],
      selectedEditorEmailList: [],
      selectedContentList: [],
      selectedEditorContentList: []
    }
  },
  created () {
    console.info('CollaborateContent')
  },
  methods: {
    handleSelectedCollaborateContent (data) {
      console.info('handleSelectedCollaborateContent ', data)
      this.selectedContentList = data.selectedContentList
      const postData = {
        contents: this.selectedContentList,
        viewUser: this.selectedViewerEmailList,
        editUser: this.selectedEditorEmailList,
        message: data.message
      }

      console.info('collaborate post data', postData)
      InviteCollaborate(postData).then((response) => {
        console.info('InviteCollaborate response', response)
      }).finally(() => {
        this.$emit('finished')
      })
    },
    handleSelectedCollaborateUser (data) {
      console.info('handleSelectedCollaborateUser', data)
      this.selectedUserList = data.selectedUserList
      this.selectedViewerEmailList = data.selectedViewerEmailList
      this.selectedEditorEmailList = data.selectedEditorEmailList
      this.userSelectVisible = false
      this.collaborateContentSelectVisible = true
    },

    handlePrevious () {
      console.info('handlePrevious now')
      this.userSelectVisible = true
      this.collaborateContentSelectVisible = false
    },
    handleCancel () {
      console.info('handleCancel')
      this.userSelectVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

</style>
