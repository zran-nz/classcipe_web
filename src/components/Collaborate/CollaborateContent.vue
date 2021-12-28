<template>
  <div class="collaborate-wrapper">
    <div class="collaborate-content-wrapper">
      <collaborate-user-list
        v-show="userSelectVisible"
        @selected="handleSelectedCollaborateUser"
        @cancel="handleCancel"/>
      <!--      <collaborate-content-list-->
      <!--        v-show="collaborateContentSelectVisible"-->
      <!--        @selected="handleSelectedCollaborateContent"-->
      <!--        @go-previous="handlePrevious"-->
      <!--        :main-content="mainContent"-->
      <!--        :content-id="contentId"-->
      <!--        :content-type="contentType"/>-->

      <div class="link-wrapper">

        <div class="link-setting">
          <a-tooltip placement="top" title="Click to Reset link"><img src="~@/assets/icons/collaborate/refresh.png" class="refresh-icon" /></a-tooltip>
          <div class="link-text">
            https://dev.classcipe.com/c/vxrcywpbclmztgpnztjairzpqcavaetz
          </div>
          <a-button class="action-copy" type="primary" shape="round" @click="handleCopy()">
            copy
          </a-button>
        </div>
        <div class="link-approve">
          <a-radio @click="checked =!checked" :checked="checked">Approval confirmation is required when passing the link</a-radio>
        </div>
      </div>
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
      selectedEditorContentList: [],
      checked: false
    }
  },
  created () {
    this.$logger.info('CollaborateContent')
  },
  methods: {
    handleSelectedCollaborateContent (data) {
      this.$logger.info('handleSelectedCollaborateContent ', data)
      this.selectedContentList = data.selectedContentList
      const postData = {
        contents: this.selectedContentList,
        viewUser: this.selectedViewerEmailList,
        editUser: this.selectedEditorEmailList,
        message: data.message
      }

      this.$logger.info('collaborate post data', postData)
      InviteCollaborate(postData).then((response) => {
        this.$logger.info('InviteCollaborate response', response)
      }).finally(() => {
        this.$emit('finished')
      })
    },
    handleSelectedCollaborateUser (data) {
      this.$logger.info('handleSelectedCollaborateUser', data)
      this.selectedUserList = data.selectedUserList
      this.selectedViewerEmailList = data.selectedViewerEmailList
      this.selectedEditorEmailList = data.selectedEditorEmailList
      this.userSelectVisible = false
      this.collaborateContentSelectVisible = true
    },

    handlePrevious () {
      this.$logger.info('handlePrevious now')
      this.userSelectVisible = true
      this.collaborateContentSelectVisible = false
    },
    handleCancel () {
      this.$logger.info('handleCancel')
      this.userSelectVisible = false
    },
    handleCopy () {
      this.$logger.info('handleCopy')
      this.$copyText('https://dev.classcipe.com/c/vxrcywpbclmztgpnztjairzpqcavaetz').then(() => {
        this.$message.success('Copy successfully')
      }).catch(() => {
        this.$message.error('Copy failed')
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.link-wrapper{
  margin:10px auto;
  margin-bottom:30px;
  .link-setting{
    margin: 0 auto;
    width: 80%;
    height: 50px;
    background: #F7F9FD;
    opacity: 1;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .refresh-icon{
      width:30px;
      margin:5px;
      margin-left: 10px;
      cursor: pointer;
    }
    .link-text{
      max-width: 450px;
      text-align: center;
      overflow: hidden;
      height: 19px;
      font-size: 14px;
      font-family: Segoe UI;
      font-weight: 400;
      line-height: 20px;
      color: #000000;
      opacity: 1;
    }
  }
  .link-approve{
    margin: 0 auto;
    width: 80%;
    font-size: 12px;
    font-family: Segoe UI;
    font-weight: 400;
    line-height: 20px;
    color: #000000;
    opacity: 1;
    margin-top:20px;
  }
}

</style>
