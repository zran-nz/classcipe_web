<template>
  <div class="collaborate-user-list">
    <div class="toggle-header">
      <div class="toggle-mode-type-wrapper">
        <div class="toggle-mode-type">
          <div class="toggle-mode">
            <div :class="{'mode-item': true, 'skill-active-mode' : userSelectMode === 'invite'}" @click="handleToggleType('invite')">
              Invite people I know
            </div>
            <div :class="{'mode-item': true, 'knowledge-active-mode' : userSelectMode === 'publish'}" @click="handleToggleType('publish')">
              Publish to find collaborators
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="user-select-wrapper">
      <template v-if="userSelectMode === 'invite'">
        <div class="user-search-wrapper">
          <div class="search-header">
            <a-input-search placeholder="Invite teacher by email" v-model="userNameOrEmail" enter-button @search="searchUser" @change="searchUser"/>
          </div>
          <div class="user-list">
            <div class="user-item" v-for="(user,index) in userList" :key="index" v-if="userList.length">
              <div class="user-avatar-email">
                <div class="avatar">
                  <img :src="user.avatar" />
                </div>
                <div class="email">
                  {{ user.nickname }}
                </div>
              </div>
              <div class="user-name">
                {{ user.email }}
              </div>
              <div class="action" >
                <div slot="actions">
                  <div class="action-wrapper">
                    <div class="action-item" @click="handleAddToSelect(user)">
                      <div class="active-status-icon">
                        <img src="~@/assets/icons/collaborate/round.png" v-if="selectedEmailList.indexOf(user.email) === -1"/>
                        <a-icon theme="filled" type="check-circle" v-if="selectedEmailList.indexOf(user.email) !== -1" />
                      </div>
                      <div class="action-name"> + Select</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="empty-user" v-if="userList.length === 0 && selectedUserList.length === 0">
              <no-more-resources tips="no user found!"/>
            </div>
          </div>
          <div class="collaborate-user" v-show="selectedUserList.length">
            <div class="collaborate-title">
              Collaborator
            </div>
            <div class="collaborate-user-list">
              <div class="user-item" v-for="(user,index) in selectedUserList" :key="index">
                <div class="user-avatar-email">
                  <div class="avatar">
                    <img :src="user.avatar" />
                  </div>
                  <div class="email">
                    {{ user.nickname }}
                  </div>
                </div>
                <div class="user-name">
                  {{ user.email }}
                </div>
                <div class="action" >
                  <div slot="actions">
                    <div class="action-wrapper">
                      <div class="action-item" @click="handleAddToEditor(user.email)">
                        <div class="active-status-icon">
                          <img src="~@/assets/icons/collaborate/round.png" v-if="selectedEditorEmailList.indexOf(user.email) === -1"/>
                          <a-icon theme="filled" type="check-circle" v-if="selectedEditorEmailList.indexOf(user.email) !== -1" />
                        </div>
                        <div class="action-name">Editor</div>
                        <div class="active-icon">
                          <img src="~@/assets/icons/collaborate/editor.png" />
                        </div>
                      </div>
                      <div class="action-item" @click="handleAddToViewer(user.email)">
                        <div class="active-status-icon">
                          <img src="~@/assets/icons/collaborate/round.png" v-if="selectedViewerEmailList.indexOf(user.email) === -1"/>
                          <a-icon theme="filled" type="check-circle" v-if="selectedViewerEmailList.indexOf(user.email) !== -1" />
                        </div>
                        <div class="action-name">Viewer</div>
                        <div class="active-icon">
                          <img src="~@/assets/icons/collaborate/viewer.png" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="message-action-wrapper">
          <a-button class="button-item" type="primary" shape="round" @click="handleEnsureSelect" v-show="selectedEmailList.length > 0"> Next</a-button>
        </div>
      </template>
      <!--      <template v-if="userSelectMode === 'publish'">-->
      <!--        <div class="publish-wrapper">-->
      <!--          <div class="publish-tips">-->
      <!--            <div class="tips-icon">-->
      <!--              <img src="~@/assets/icons/collaborate/quanqiu_jiaoyu@2x.png" />-->
      <!--            </div>-->
      <!--            <div class="tips-text">-->
      <!--              We will recommend your selected content with global experts/educators to collaborate-->
      <!--            </div>-->
      <!--          </div>-->
      <!--          <div class="publish-message">-->
      <!--            <a-textarea v-model="publishMessage" :autosize="{ minRows: 6, maxRows: 12 }" class="my-publish-textarea" placeholder="Message to your collaborators" />-->
      <!--          </div>-->
      <!--          <div class="extra-action">-->
      <!--            <div class="extra-item" @click="inviteExperts = !inviteExperts">-->
      <!--              <div class="extra-selected-icon">-->
      <!--                <img src="~@/assets/icons/collaborate/round.png" v-if="!inviteExperts"/>-->
      <!--                <a-icon theme="filled" type="check-circle" v-if="inviteExperts" />-->
      <!--              </div>-->
      <!--              <div class="extra-text">Only invite experts/teachers specialized in this subject</div>-->
      <!--            </div>-->
      <!--            <div class="extra-item" @click="inviteAll = !inviteAll">-->
      <!--              <div class="extra-selected-icon">-->
      <!--                <img src="~@/assets/icons/collaborate/round.png" v-if="!inviteAll"/>-->
      <!--                <a-icon theme="filled" type="check-circle" v-if="inviteAll" />-->
      <!--              </div>-->
      <!--              <div class="extra-text">Invite all</div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <div class="publish-action">-->
      <!--          <div class="action-item">-->
      <!--            <a-button class="button-item" shape="round" @click="handleCancel"> Cancel</a-button>-->
      <!--          </div>-->
      <!--          <div class="action-item">-->
      <!--            <a-button class="button-item" type="primary" shape="round" @click="handleEnsurePublishSelect"> Invite collaborators</a-button>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </template>-->
    </div>
  </div>
</template>

<script>
import { SearchUser } from '@/api/user'
import NoMoreResources from '@/components/Common/NoMoreResources'
export default {
  name: 'CollaborateUserList',
  components: { NoMoreResources },
  data () {
    return {
      userSelectMode: 'invite',
      userNameOrEmail: null,

      userList: [],
      selectedUserList: [],
      selectedEmailList: [],
      selectedUserInfoMap: new Map(),
      selectedViewerEmailList: [],
      selectedEditorEmailList: [],

      inviteMessage: null,
      publishMessage: null,

      inviteExperts: false,
      inviteAll: false
    }
  },
  methods: {
    handleEnsureSelect () {
      console.info('handleEnsureSelect', this.selectedUserInfoMap, this.selectedEmailList)
      this.$emit('selected', {
        selectedUserList: this.selectedUserList,
        selectedViewerEmailList: this.selectedViewerEmailList,
        selectedEditorEmailList: this.selectedEditorEmailList
      })
    },
    searchUser () {
      if (!this.userNameOrEmail || this.userNameOrEmail.length < 3) {
        return
      }
      SearchUser({ name: this.userNameOrEmail }).then(response => {
        console.info('SearchUser response', response)
        this.userList = response.result
        this.selectedEditorEmailList = []
        this.selectedViewerEmailList = []

        this.selectedViewerEmailList = []
        this.selectedEditorEmailList = []
      })
    },

    handleAddToEditor (id) {
      console.info('handleAddToEditor ' + id)
      const index = this.selectedEditorEmailList.indexOf(id)
      if (index !== -1) {
        this.selectedEditorEmailList.splice(index, 1)
      } else {
        this.selectedEditorEmailList.push(id)
      }
      console.info('selectedEditorEmailList ', this.selectedEditorEmailList)
    },

    handleAddToViewer (id) {
      console.info('handleAddToViewer ' + id)
      const index = this.selectedViewerEmailList.indexOf(id)
      if (index !== -1) {
        this.selectedViewerEmailList.splice(index, 1)
      } else {
        this.selectedViewerEmailList.push(id)
      }
      console.info('selectedViewerEmailList ', this.selectedViewerEmailList)
    },

    handleAddToSelect (userInfo) {
      console.info('handleAddToSelect ' + userInfo.email)
      const index = this.selectedEmailList.indexOf(userInfo.email)
      if (index !== -1) {
        this.selectedEmailList.splice(index, 1)
        this.selectedUserInfoMap.delete(userInfo.email)
      } else {
        this.selectedEmailList.push(userInfo.email)
        this.selectedUserInfoMap.set(userInfo.email, userInfo)
      }
      this.selectedUserList = []
      for (const [email, userInfo] of this.selectedUserInfoMap.entries()) {
        console.info('user ' + email, userInfo)
        this.selectedUserList.push(userInfo)
      }
      console.info('selectedEmailList ', this.selectedEmailList)
    },

    handleToggleType (currentType) {
      console.info('handleToggleType ' + currentType)
      this.userSelectMode = currentType
    },

    handleCancel () {
      console.info('handleCancel')
      this.$emit('cancel')
    }

  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.collaborate-user-list {
  margin-top: 10px;

  .toggle-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 15px 0;

    .toggle-mode-type-wrapper {
      box-sizing: border-box;
      .toggle-mode-type {
        height: 40px;
        display: inline-block;
        border-radius: 40px;
        background: rgba(228, 228, 228, 0.3);

        .toggle-mode {
          border-radius: 40px;
          height: 40px;
          display: flex;
          flex-direction: row;
          font-size: 14px;

          .mode-item {
            cursor: pointer;
            padding: 0 15px;
            font-size: 12px;
            height: 40px;
            color: rgba(17, 20, 45, 1);
            border-radius: 40px;
            font-family: Inter-Bold;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .skill-active-mode {
            color: #fff;
            background: rgba(21, 195, 154, 1);
          }

          .knowledge-active-mode {
            color: #fff;
            background: rgba(21, 195, 154, 1);
          }

          .general-active-mode {
            color: #fff;
            background: rgba(21, 195, 154, 1);
          }
        }
      }
    }
  }

  .user-search-wrapper {
    display: flex;
    flex-direction: column;
    opacity: 1;
    border-radius: 4px;
    box-sizing: border-box;
    .search-header {
      margin: auto;
      width: 90%;
      border-radius: 4px;
      padding: 15px 10px 5px 10px;

      .search-line {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .label {
          display: flex;
          flex-direction: row;
          align-items: center;

          img {
            height: 30px;
          }

          .label-title {
            font-family: PingFang SC;
            font-weight: bold;
            color: #11142D;
            padding-left: 10px;
          }
        }

        .search-by-id {
          border-radius: 4px;
          .user-search {
            border-radius: 4px;
            outline: none;
            border: 1px solid rgba(216, 216, 216, 1);
            box-shadow: none;
          }
          .search-icon {
            height: 15px;
          }
        }

        .search-by-group {
          margin-left: 10px;
        }
      }

      .header-label-line {
        padding: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 24px;
        color: #11142D;
        cursor: pointer;

        .label-item-email {
          width: 30%;
        }

        .label-item-name {
          width: 30%;
        }

        .label-item-action {
          width: 40%;
        }
      }
    }

    .user-list {
      display: flex;
      padding: 0 10px;
      max-height: 380px;
      width: 90%;
      margin: auto;
      overflow-y: scroll;
      flex-direction: column;

      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }
      &::-webkit-scrollbar-track {
        border-radius: 3px;
        background: rgba(0,0,0,0.00);
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
      }
      /* 滚动条滑块 */
      &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: rgba(0,0,0,0.12);
        -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
      }
      .empty-user {
        padding: 15px 0;
      }
      .user-item {
        margin: 10px 0;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        opacity: 1;
        border-radius: 4px;
        padding: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;

        .user-avatar-email {
          width: 30%;
          line-height: 24px;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #000000;
          display: flex;
          flex-direction: row;
          align-items: center;
          .avatar {
            img {
              height: 40px;
              border-radius: 40px;
            }
          }
          .email {
            padding-left: 10px;
          }
        }

        .user-name {
          width: 30%;
          font-family: Inter-Bold;
          line-height: 24px;
          padding-left: 15px;
          color: #000000;
        }

        .action {
          width: 40%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;
          .action-wrapper {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            .action-item {
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              padding: 0 10px;
              user-select: none;

              .active-status-icon {
                display: flex;
                flex-direction: row;
                align-items: center;
                width: 20px;
                img {
                  height: 18px;
                }

                font-size: 15px;
                color: rgba(21, 195, 154, 1);
              }
              .action-name {
                padding: 0 5px;
              }

              .active-icon {
                img {
                  height: 14px;
                }
              }
            }
          }
        }
      }
    }

    .collaborate-user {
      .collaborate-title {
        font-size: 16px;
        line-height: 25px;
        width: 90%;
        margin: auto;
        color: #000;
        padding: 0px 18px;
      }
      .collaborate-user-list {
        display: flex;
        width: 90%;
        margin: auto;
        padding: 0px 10px;
        max-height: 380px;
        overflow-y: scroll;
        flex-direction: column;

        &::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        &::-webkit-scrollbar-track {
          border-radius: 3px;
          background: rgba(0,0,0,0.00);
          -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);
        }
        /* 滚动条滑块 */
        &::-webkit-scrollbar-thumb {
          border-radius: 5px;
          background: rgba(0,0,0,0.12);
          -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
        }
        .empty-user {
          padding: 15px 0;
        }
        .user-item {
          margin: 10px 0;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
          opacity: 1;
          border-radius: 4px;
          padding: 10px;
          display: flex;
          flex-direction: row;
          align-items: center;

          .user-avatar-email {
            width: 30%;
            line-height: 24px;
            font-family: Inter-Bold;
            line-height: 24px;
            color: #000000;
            display: flex;
            flex-direction: row;
            align-items: center;
            .avatar {
              img {
                height: 40px;
                border-radius: 40px;
              }
            }
            .email {
              padding-left: 10px;
            }
          }

          .user-name {
            width: 30%;
            font-family: Inter-Bold;
            line-height: 24px;
            padding-left: 15px;
            color: #000000;
          }

          .action {
            width: 40%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            .action-wrapper {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
              .action-item {
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                padding: 0 10px;
                user-select: none;

                .active-status-icon {
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  width: 20px;
                  img {
                    height: 18px;
                  }

                  font-size: 15px;
                  color: rgba(21, 195, 154, 1);
                }
                .action-name {
                  padding: 0 5px;
                }

                .active-icon {
                  img {
                    height: 14px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .publish-wrapper {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid #eee;
    opacity: 1;
    border-radius: 4px;
    min-height: 300px;
    padding: 10px;
    box-sizing: border-box;
    .publish-tips {
      margin-bottom: 25px;
      padding: 15px 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      background: #FFFFFF;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 4px;
      .tips-icon {
        img {
          height: 30px;
        }
      }

      .tips-text {
        padding-left: 10px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #11142D;
      }
    }

    .publish-message {
      .my-publish-textarea {
        background: rgba(245, 245, 245, 0.5);
        border: 1px solid #eee;
        outline: none;
        box-shadow: none;
        border-radius: 5px;
        min-height: 150px;
      }
    }

    .extra-action {
      margin-top: 20px;

      .extra-item {
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        user-select: none;
        align-items: center;

        .extra-selected-icon {
          color: #07AB84;
          font-size: 17px;
          width: 20px;
          display: flex;
          flex-direction: row;
          align-items: center;

          img {
            height: 17px;
          }
        }

        .extra-text {
          padding-left: 5px;
        }
      }
    }
  }

  .publish-action {
    display: flex;
    margin-top: 30px;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .button-item {
      margin: 0 20px;
    }
  }

  .message-action-wrapper {
    height: 50px;
    display: flex;
    margin-top: 10px;
    padding-bottom: 10px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}

.user-select-wrapper {
  min-height: 100px;
}
</style>
