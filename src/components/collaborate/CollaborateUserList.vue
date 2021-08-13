<template>
  <div class="collaborate-user-list">
    <div class="toggle-header"></div>
    <div class="user-search-wrapper">
      <div class="search-header">
        <div class="label"></div>
        <div class="search-by-id"></div>
        <div class="search-by-group"></div>
      </div>
      <div class="user-list">
        <div class="user-item" v-for="(user,index) in userList" :key="index">
          <div class="user-avatar">
            {{ user.avatar }}
          </div>
          <div class="user-name">
            {{ user.name }}
          </div>
          <div class="action" >
            <div slot="actions">
              <div class="action-wrapper">
                <div class="action-item">
                  <div class="active-status-icon">
                    <img src="~@/assets/icons/collaborate/round.png" v-if="selectedEditorContentIdList.indexOf(item.id) === -1"/>
                    <a-icon theme="filled" type="check-circle" v-if="selectedEditorContentIdList.indexOf(item.id) !== -1" />
                  </div>
                  <div class="action-name" @click="handleAddToEditor(item.id)">Editor</div>
                  <div class="active-icon" @click="handleAddToEditor(item.id)">
                    <img src="~@/assets/icons/collaborate/editor.png" />
                  </div>
                </div>
                <div class="action-item">
                  <div class="active-status-icon">
                    <img src="~@/assets/icons/collaborate/round.png" v-if="selectedViewerContentIdList.indexOf(item.id) === -1"/>
                    <a-icon theme="filled" type="check-circle" v-if="selectedViewerContentIdList.indexOf(item.id) !== -1" />
                  </div>
                  <div class="action-name" @click="handleAddToViewer(item.id)">Viewer</div>
                  <div class="active-icon" @click="handleAddToViewer(item.id)">
                    <img src="~@/assets/icons/collaborate/viewer.png" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="action-wrapper">
      <div class="message-wrapper">
        <a-textarea v-model="message" />
      </div>
      <div class="action-item">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollaborateUserList'
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

</style>
