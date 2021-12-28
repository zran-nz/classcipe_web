<template>
  <div class="collaborate-user-list">
    <div class="toggle-header">
      <div class="toggle-mode-type-wrapper">
        <div class="header-icon"><img src="~@/assets/icons/collaborate/group.png" /></div>
        <div>Invite People</div>
      </div>
    </div>
    <div class="user-select-wrapper">
      <div class="user-search-wrapper">
        <div class="search-header">
          <a-input-group compact>
            <a-input-search
              size="large"
              placeholder="Invite teacher by email"
              v-model="userNameOrEmail"
              @search="searchUser"
              @change="searchUser">
              <a-icon slot="prefix" type="search" />
              <div slot="suffix"> </div>
              <a-select slot="addonAfter" default-value="Edit" style="width: 80px;">
                <a-select-option value="Edit">
                  Edit
                </a-select-option>
                <a-select-option value="View">
                  View
                </a-select-option>
              </a-select>
            </a-input-search>

          </a-input-group>

        </div>

        <div class="user-list" v-if="showUser">
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

        <div class="collaborate-user" v-if="selectedUserList.length && !showUser">
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
        <div class="no-collaborate-users" v-if="!showUser && selectedUserList.length === 0">
          <div class="icon">
            <img src="~@/assets/icons/collaborate/no_user.png" />
          </div>
          <div class="tips">
            <a>
              No collaborated users find
            </a>
          </div>
        </div>
      </div>
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
      inviteAll: false,
      showUser: false
    }
  },
  methods: {
    handleEnsureSelect () {
      this.$logger.info('handleEnsureSelect', this.selectedUserInfoMap, this.selectedEmailList)
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
      this.showUser = true
      SearchUser({ name: this.userNameOrEmail }).then(response => {
        this.$logger.info('SearchUser response', response)
        this.userList = response.result
        this.selectedEditorEmailList = []
        this.selectedViewerEmailList = []

        this.selectedViewerEmailList = []
        this.selectedEditorEmailList = []
      })
    },

    handleAddToEditor (id) {
      this.$logger.info('handleAddToEditor ' + id)
      const index = this.selectedEditorEmailList.indexOf(id)
      if (index !== -1) {
        this.selectedEditorEmailList.splice(index, 1)
      } else {
        this.selectedEditorEmailList.push(id)
      }
      this.$logger.info('selectedEditorEmailList ', this.selectedEditorEmailList)
    },

    handleAddToViewer (id) {
      this.$logger.info('handleAddToViewer ' + id)
      const index = this.selectedViewerEmailList.indexOf(id)
      if (index !== -1) {
        this.selectedViewerEmailList.splice(index, 1)
      } else {
        this.selectedViewerEmailList.push(id)
      }
      this.$logger.info('selectedViewerEmailList ', this.selectedViewerEmailList)
    },

    handleAddToSelect (userInfo) {
      this.$logger.info('handleAddToSelect ' + userInfo.email)
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
        this.$logger.info('user ' + email, userInfo)
        this.selectedUserList.push(userInfo)
      }
      this.$logger.info('selectedEmailList ', this.selectedEmailList)
    },

    handleToggleType (currentType) {
      this.$logger.info('handleToggleType ' + currentType)
      this.userSelectMode = currentType
    },

    handleCancel () {
      this.$logger.info('handleCancel')
      this.$emit('cancel')
    }

  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.collaborate-user-list {
  margin-top: 5px;

  .toggle-header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 5px 0;

    .toggle-mode-type-wrapper {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .header-icon{
        img{
          width:40px;
          margin:5px;
        }
      }
      font-size: 16px;
      font-family: Segoe UI;
      font-weight: bold;
      line-height: 20px;
      color: #000000;
      opacity: 1;
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
      margin-bottom: 10px;
      //padding: 15px 10px 5px 10px;

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

      /deep/ .ant-input{
        border-bottom-left-radius: 30px;
        border-top-left-radius: 30px
      }
    }

    .user-list {
      display: flex;
      padding: 0 10px;
      max-height: 380px;
      width: 90%;
      margin: auto;
      //overflow-y: scroll;
      border: 1px solid #D8D8D8;
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

.no-collaborate-users {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin:20px;

  .icon {
    img {
      width: 250px;
    }
  }

  .tips {
    line-height: 24px;
  }
}

.user-select-wrapper {
  min-height: 100px;
}
</style>
