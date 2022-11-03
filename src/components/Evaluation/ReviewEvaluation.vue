<template>
  <div class="review-evaluation">
    <div class="toggle-mode-type-wrapper">
      <div class="toggle-mode-type">
        <div class="toggle-mode">
          <div :class="{'mode-item': true, 'skill-active-mode' : currentMode === 'block-list'}" @click="toggleMode('block-list')">
            Edit students
          </div>
          <div :class="{'mode-item': true, 'knowledge-active-mode' : currentMode === 'evaluation'}" @click="toggleMode('evaluation')">
            Evaluation&Learning evidence
          </div>
          <div :class="{'mode-item': true, 'general-active-mode' : currentMode === 'statistic'}" @click="toggleMode('statistic')">
            Statistics Results
          </div>
        </div>
      </div>
    </div>
    <div class="review-content-wrapper">
      <div class="block-list" v-if="currentMode === 'block-list'">
        <div class="user-search-wrapper">
          <div class="search-header">
            <div class="search-line">
              <div class="label">
                <img src="~@/assets/icons/collaborate/friend.png" />
                <div class="label-title">Select Students</div>
              </div>
              <div class="search-by-id">
                <a-input
                  v-model="userNameOrEmail"
                  class="user-search"
                  aria-placeholder="Search"
                  placeholder="Search"
                  @change="searchUser">
                  <img slot="prefix" src="~@/assets/icons/collaborate/search.png" class="search-icon" />
                </a-input>
              </div>
              <div class="search-by-group">
                <a-button
                  style="padding: 0 10px;display:flex; align-items:center ;height: 36px;border-radius: 6px;background: #FFFFFF;border: 1px solid #eee;font-family: Inter-Bold;color: #182552;">
                  <span>All Students（20）</span>
                  <a-icon type="caret-down" /> </a-button>
              </div>
            </div>
            <div class="header-label-line">
              <div class="label-item label-item-email">Email</div>
              <div class="label-item label-item-name">Student Name</div>
              <div class="label-item label-item-name">Student ID</div>
              <div class="label-item label-item-action"></div>
            </div>
          </div>
          <div class="user-list">
            <div class="user-item" v-for="(user,index) in displayUserList" :key="index" v-if="userList.length">
              <div class="user-avatar-email">
                <div class="avatar">
                  <img :src="user.avatar" />
                </div>
                <div class="email">
                  {{ user.email }}
                </div>
                <div class="id">
                  {{ user.id }}
                </div>
              </div>
              <div class="user-name">
                {{ user.nickname }}
              </div>
              <div class="action" >
                <div slot="actions">
                  <div class="action-wrapper">
                    <div class="action-item" @click="handleBlockStudent(user)">
                      <div class="action-name">Block</div>
                      <div class="active-icon">
                        <img src="~@/assets/icons/collaborate/editor.png" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="evaluation-review" v-if="currentMode === 'evaluation'">
        <start-evaluation-view :slide-id="slideId" :class-id="classId" :evaluation-id="evaluationId" />
      </div>
      <div class="evaluation-review" v-if="currentMode === 'statistic'">
        <no-more-resources tips="comming soon!"/>
      </div>
    </div>
  </div>
</template>

<script>
import NoMoreResources from '@/components/Common/NoMoreResources'
import StartEvaluationView from '@/components/Evaluation/StartEvaluationView'
export default {
  name: 'ReviewEvaluation',
  components: { StartEvaluationView, NoMoreResources },
  props: {
    evaluationId: {
      type: String,
      default: null
    },
    classId: {
      type: String,
      default: null
    },
    slideId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      currentMode: 'evaluation',
      userList: [],
      displayUserList: [],
      userNameOrEmail: null
    }
  },
  created () {
    console.info('review evaluation ' + this.evaluationId + ' class id ' + this.classId)
  },
  methods: {
    toggleMode (mode) {
      console.info('toggleMode ' + mode)
      this.currentMode = mode
    },
    searchUser () {
      console.info('searchUser ' + this.userNameOrEmail)
      if (this.userList.length) {
        const list = []
        this.userList.forEach(user => {
          if (user.name.indexOf(this.userNameOrEmail) !== -1 || user.email.indexOf(this.userNameOrEmail) !== -1) {
            list.push(user)
          }
        })
        this.displayUserList = list
      }
      console.info('displayUserList', this.displayUserList)
    },

    handleBlockStudent () {
      console.info('handleBlockStudent')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.review-evaluation {
  min-height: 500px;
  .toggle-mode-type-wrapper {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    padding-bottom: 10px;
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
          padding: 10px 15px;
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

  .user-search-wrapper {
    display: flex;
    flex-direction: column;
    opacity: 1;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid #D8D8D8;
    background: rgba(255, 255, 255, 0.2);
    opacity: 1;
    border-radius: 4px;
    .search-header {
      border-radius: 4px;
      padding: 15px 10px 5px 10px;
      background: #F7F7F7;

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
      height: 480px;
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
          width: 55%;
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
            padding-left: 15px;
          }
        }

        .user-name {
          width: 25%;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #000000;
        }

        .action {
          width: 20%;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;
          .action-wrapper {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            .action-item {
              display: flex;
              flex-direction: row;
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
</style>
