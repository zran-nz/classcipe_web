<template>
  <div class="my-content">
    <div class="filter-line">
      <div class="status-tab">
      </div>
      <div class="type-owner">
        <div class="type-filter">
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item disabled>
                <span>{{ $t('teacher.my-content.choose-types-of-content') }}</span>
              </a-menu-item>
              <a-menu-item
                @click="toggleType('all-type', $t('teacher.my-content.all-type'))"
                v-show="$store.getters.currentRole === 'teacher'">
                <span>{{ $t('teacher.my-content.all-type') }}</span>
              </a-menu-item>
              <a-menu-item @click="toggleType('topic', $t('teacher.my-content.topics-type') )">
                <span>{{ $t('teacher.my-content.topics-type') }}</span>
              </a-menu-item>
              <!--                <a-menu-item @click="toggleType('material', $t('teacher.my-content.materials-type'))">
                <span>{{ $t('teacher.my-content.materials-type') }}</span>
              </a-menu-item>-->
              <a-menu-item
                @click="toggleType('unit-plan', $t('teacher.my-content.unit-plan-type'))"
                v-show="$store.getters.currentRole === 'teacher'">
                <span>{{ $t('teacher.my-content.unit-plan-type') }}</span>
              </a-menu-item>
              <a-menu-item @click="toggleType('task', $t('teacher.my-content.tasks-type') )">
                <span>{{ $t('teacher.my-content.tasks-type') }}</span>
              </a-menu-item>
              <!--              <a-menu-item
                @click="toggleType('lesson', $t('teacher.my-content.lesson-type'))"
                v-show="$store.getters.currentRole === 'teacher'">
                <span>{{ $t('teacher.my-content.lesson-type') }}</span>
              </a-menu-item>-->
              <a-menu-item
                @click="toggleType('evaluation', $t('teacher.my-content.evaluation-type'))"
                v-show="$store.getters.currentRole === 'teacher'">
                <span>{{ $t('teacher.my-content.evaluation-type') }}</span>
              </a-menu-item>
            </a-menu>
            <a-button
              style="padding: 0 20px;display:flex; box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);align-items:center ;height: 40px;border-radius: 6px;background: #FFFFFF;border: 1px solid #eee;font-family: Inter-Bold;color: #182552;">
              Choose type(s)of content
              <a-icon type="caret-down"/>
            </a-button>
          </a-dropdown>
        </div>
        <div class="view-mode-toggle">
          <div class="view-mode">
            <div :class="{'view-mode-item': true, 'active-view': viewMode === 'img'}" @click="toggleViewMode('img')">
              <a-icon type="appstore" theme="filled" v-if="viewMode === 'img'"/>
              <a-icon type="appstore" v-if="viewMode === 'list'"/>
            </div>
            <div :class="{'view-mode-item': true, 'active-view': viewMode === 'list'}" @click="toggleViewMode('list')">
              <a-icon type="unordered-list"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-wrapper">
      <a-skeleton :loading="skeletonLoading" active>
        <div class="label-title-blue">
          <div class="label-text">Collaborate with global teachers/experts</div>
        </div>
        <div class="no-received-wrapper">
          <template v-if="sharedNotReceivedList.length">
            <div class="no-received-list" v-if="viewMode === 'list'">
              <div class="no-received-my-list-item " v-for="(item,index) in sharedNotReceivedList" :key="index">
                <div class="collaborate-item">
                  <div class="message-wrapper">
                    {{ item.message }}
                  </div>
                  <div class="collaborate-action-wrapper">
                    <div class="collaborate-content-info" @click="handleViewDetail(item.content)">
                      <div class="type-icon">
                        <content-type-icon size="40px" :type="item.content.type"/>
                      </div>
                      <div class="name"> {{ item.content.name }}</div>
                      <div class="time"> {{ item.createTime }}</div>
                      <div class="author">
                        {{ item.createBy }}
                      </div>
                    </div>
                    <div class="collaborate-action">
                      <div class="collaborate-action-item">
                        <a-button
                          class="button-item button-item-view"
                          @click="handleCollaborate(item)">
                          <img src="~@/assets/icons/collaborate/collaborate.png" class="collaborate-icon"/>
                          <span
                            class="btn-text">
                            Collaborate
                          </span>
                        </a-button>
                      </div>
                      <div class="collaborate-action-item">
                        <a-popconfirm
                          :title="$t('teacher.my-content.action-delete') + '?'"
                          ok-text="Yes"
                          @confirm="handleDeleteCollaborate(item)"
                          cancel-text="No">
                          <a-button
                            class="button-item button-item-delete">
                            <img src="~@/assets/icons/collaborate/shanchu@2x.png" class="collaborate-icon"/>
                            <span
                              class="btn-text">
                              Delete
                            </span>
                          </a-button>
                        </a-popconfirm>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="no-received-card-list" v-if="viewMode === 'img'">
              <div class="no-received-card-my-list-item" v-for="(item,index) in sharedNotReceivedList" :key="index">
                <div class="card-collaborate-item">
                  <div class="message-wrapper">
                    {{ item.message }}
                  </div>
                  <div class="collaborate-action-wrapper">
                    <div class="collaborate-content-info" @click="handleViewDetail(item.content)">
                      <div class="type-icon">
                        <content-type-icon size="40px" :type="item.content.type"/>
                        <div class="name"> {{ item.content.name }}</div>
                      </div>
                      <div class="sub-info">
                        <div class="time"> {{ item.createTime }}</div>
                        <div class="author">
                          {{ item.createBy }}
                        </div>
                      </div>
                    </div>
                    <div class="collaborate-action">
                      <div class="collaborate-action-item">
                        <a-button
                          class="button-item button-item-view"
                          @click="handleCollaborate(item)">
                          <img src="~@/assets/icons/collaborate/collaborate.png" class="collaborate-icon"/>
                          <span
                            class="btn-text">
                            Collaborate
                          </span>
                        </a-button>
                      </div>
                      <div class="collaborate-action-item">
                        <a-popconfirm
                          :title="$t('teacher.my-content.action-delete') + '?'"
                          ok-text="Yes"
                          @confirm="handleDeleteCollaborate(item)"
                          cancel-text="No">
                          <a-button
                            class="button-item button-item-delete"
                            style="">
                            <img src="~@/assets/icons/collaborate/refuse.png" class="collaborate-icon"/>
                            <span
                              class="btn-text">
                              Delete
                            </span>
                          </a-button>
                        </a-popconfirm>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div class="no-received-empty" v-if="sharedNotReceivedList.length === 0">
            <no-more-resources tips="No Invitation received"/>
          </div>
        </div>
      </a-skeleton>

      <a-drawer
        destroyOnClose
        placement="right"
        :closable="false"
        width="1000px"
        :visible="previewVisible"
        @close="handlePreviewClose"
      >
        <div class="preview-wrapper-row">
          <div class="view-back">
            <a-button type='primary' class='preview-back-btn' shape='round' @click="handlePreviewClose"><a-icon type="left" :style="{'font-size': '12px'}" />Back</a-button>
          </div>
          <div class="detail-wrapper" v-if="previewCurrentId && previewType">
            <common-preview-v2 :id="previewCurrentId" :type="previewType" />
          </div>
        </div>
      </a-drawer>
    </div>
  </div>
</template>

<script>
  import * as logger from '@/utils/logger'
  import UnitPlanPreview from '@/components/UnitPlan/UnitPlanPreview'
  import { typeMap } from '@/const/teacher'
  import ContentStatusIcon from '@/components/Teacher/ContentStatusIcon'
  import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
  import { DeleteCollaborate, GetFindSharedNotReceived, ReceiveCollaborate } from '@/api/collaborate'
  import storage from 'store'
  import { VIEW_MODE } from '@/store/mutation-types'
  import CommonPreviewV2 from '@/components/Common/CommonPreviewV2'
  import NoMoreResources from '@/components/Common/NoMoreResources'

  export default {
    name: 'Discover',
    components: {
      NoMoreResources,
      CommonPreviewV2,
      ContentStatusIcon,
      ContentTypeIcon,
      UnitPlanPreview
    },
    data () {
      return {
        skeletonLoading: true,
        loading: true,
        loadFailed: false,
        myContentList: [],
        currentStatus: 'all-status',
        currentStatusLabel: this.$t('teacher.my-content.all-status'),
        currentType: 'all-type',
        currentTypeLabel: this.$t('teacher.my-content.all-type'),
        currentOwner: 'all-owner',
        currentOwnerLabel: this.$t('teacher.my-content.all-owner'),
        previewVisible: false,
        previewCurrentId: '',
        previewType: '',
        typeMap: typeMap,
        viewMode: storage.get(VIEW_MODE) ? storage.get(VIEW_MODE) : 'list',
        sharedNotReceivedList: []
      }
    },
    computed: {},
    created () {
      logger.info('teacher my content')
      this.loadMyContent()
    },
    methods: {
      toggleViewMode (viewMode) {
        this.$logger.info('viewMode', viewMode)
        storage.set(VIEW_MODE, viewMode)
        this.viewMode = viewMode
      },
      loadMyContent () {
        this.loading = true
        GetFindSharedNotReceived().then((response) => {
          this.$logger.info('GetFindSharedNotReceived response', response)
          this.sharedNotReceivedList = response.result
        }).finally(() => {
          this.loading = false
          this.skeletonLoading = false
        })
      },
      toggleStatus (status, label) {
        logger.info('toggleStatus ' + status + ' label ' + label)
        this.currentStatus = status
        this.currentStatusLabel = label
        this.loadMyContent()
      },
      toggleType (type, label) {
        logger.info('toggleType ' + type + ' label ' + label)
        this.currentType = type
        this.currentTypeLabel = label
        this.loadMyContent()
      },
      toggleOwner (owner, label) {
        logger.info('toggleOwner ' + owner + ' label ' + label)
        this.currentOwner = owner
        this.currentOwnerLabel = label
        this.loadMyContent()
      },

      handleEditItem (item) {
        logger.info('handleEditItem', item)
        if (item.type === typeMap['unit-plan']) {
          this.$router.push({
            path: '/teacher/unit-plan-redirect/' + item.id
          })
        } else if (item.type === typeMap['topic']) {
          this.$router.push({
            path: '/expert/topic-redirect/' + item.id
          })
        } else if (item.type === typeMap['material']) {
          this.$router.push({
            path: '/teacher/add-material/' + item.id
          })
        } else if (item.type === typeMap.task) {
          this.$router.push({
            path: '/teacher/task-redirect/' + item.id
          })
        } else if (item.type === typeMap.lesson) {
          this.$router.push({
            path: '/teacher/lesson-redirect/' + item.id
          })
        } else if (item.type === typeMap.evaluation) {
          this.$router.push({
            path: '/teacher/evaluation-redirect/' + item.id
          })
        }
      },
      handleDeleteItem (item) {
        logger.info('handleDeleteItem', item)
        DeleteCollaborate({ id: item.id }).then(res => {
          logger.info('DeleteCollaborate', res)
        }).then(() => {
          this.loadMyContent()
        })
      },
      handleViewDetail (item) {
        logger.info('handleViewDetail', item)
        this.previewCurrentId = item.id
        this.previewType = item.type
        this.previewVisible = true
      },

      handlePreviewClose () {
        logger.info('handlePreviewClose')
        this.previewVisible = false
        this.$nextTick(() => {
          this.previewCurrentId = null
          this.previewType = -1
        })
      },

      handleCollaborate (item) {
        this.$logger.info('handleCollaborate', item)
        ReceiveCollaborate({ id: item.id }).then(res => {
          logger.info('ReceiveCollaborate', res)
          this.$message.success('collaborate successfully')
        }).then(() => {
          this.loadMyContent()
        })
      },

      handleDeleteCollaborate (item) {
        this.$logger.info('handleDeleteCollaborate', item)
        DeleteCollaborate({ id: item.id }).then(res => {
          logger.info('DeleteCollaborate', res)
        }).then(() => {
          this.loadMyContent()
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~@/components/index.less";

  .ant-list-item {
    padding: 8px 0;
    position: relative;
  }
  .my-content {
    padding: 0 15px 25px 15px;

    .filter-line {
      padding: 15px 0;
      display: flex;
      justify-content: space-between;

      .status-item {
        border-radius: @btn-border-radius-base;
        cursor: pointer;
        display: inline-block;
        min-width: 50px;
        text-align: center;
        line-height: 28px;
        padding: 0 15px;
        color: @text-color;
        font-size: @btn-font-size-sm;
        font-weight: @btn-font-weight;
      }

      .active-status-item {
        background: @primary-color;
        color: #fff;
      }

      .type-owner {
        height: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }

  }

  a.delete-action {
    color: @red-4;
  }

  .type-owner {
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .view-mode-toggle {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-right: 10px;
    background: #FFFFFF;
    border: 1px solid #F7F8FF;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 6px;
    height: 40px;
    padding: 0px 15px;
    margin-left: 20px;

    .view-mode {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      color: @text-color-secondary;

      .view-mode-item {
        font-size: 20px;
        padding-left: 5px;
        margin: 0 3px;
      }

      .active-view {
        i {
          color: @primary-color;
        }
      }
    }
  }

  .cover-image {
    height: 150px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    border-bottom: 1px solid #eee;
  }

  .label-title-blue {
    margin: 10px 0;
    padding: 10px 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background: rgba(41, 157, 247, 0.1);
    opacity: 1;
    border-radius: 6px;

    .label-icon {
      img {
        height: 20px;
      }
    }

    .label-text {
      padding-left: 10px;
      font-family: Inter-Bold;
      line-height: 24px;
      color: #299DF7;
      margin: 0 auto;
    }
  }

  .no-received-card-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    background: rgba(228, 228, 228, 0.2);
    border: 1px solid #D8D8D8;
    opacity: 1;
    border-radius: 4px;
    padding: 15px 10px;
  }

  .no-received-my-list-item {
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 4px;
    background: #FFFFFF;
    padding: 15px;
    margin-bottom: 15px;
    width: 100%;

    .collaborate-item {
      width: 100%;

      .message-wrapper {
        min-height: 80px;
        background: rgba(245, 245, 245, 0.5);
        border: 1px solid #BCBCBC;
        opacity: 1;
        border-radius: 4px;
        padding: 10px;
        box-sizing: border-box;
        width: 100%;
      }

      .collaborate-action-wrapper {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        margin: 20px 0 0;

        .collaborate-content-info {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          cursor: pointer;

          .name {
            padding-left: 10px;
            font-family: Inter-Bold;
            line-height: 24px;
            color: #11142D;
            padding-right: 10px;
          }

          .time {
            width: 150px;
            color: #000000;
            opacity: 0.5;
          }
        }

        .collaborate-action {
          display: flex;
          flex-direction: row;
          align-items: center;

          .collaborate-action-item {
            margin: 0 10px;

            .collaborate-icon {
              height: 17px;
            }

            .btn-text {
              padding: 0 5px;
            }
          }
        }
      }
    }
  }

  .no-received-card-my-list-item {
    margin: 0 10px 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .card-collaborate-item {
      width: 350px;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 4px;
      background: #FFFFFF;
      padding: 15px;

      .message-wrapper {
        min-height: 150px;
        background: rgba(245, 245, 245, 0.5);
        border: 1px solid #BCBCBC;
        opacity: 1;
        border-radius: 4px;
        padding: 10px;
        box-sizing: border-box;
        width: 100%;
      }

      .collaborate-action-wrapper {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 10px 0;

        .collaborate-content-info {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          cursor: pointer;

          .type-icon {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;

            .name {
              padding-left: 10px;
              font-family: Inter-Bold;
              line-height: 24px;
              color: #11142D;
              padding-right: 10px;
            }
          }

          .sub-info {
            width: 100%;
            padding-left: 45px;
            box-sizing: border-box;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .time {
              width: 130px;
              opacity: 0.5;
              font-size: 12px;
              color: #000000;
            }

            .author {
              font-size: 13px;
              color: #000000;
            }
          }
        }

        .collaborate-action {
          display: flex;
          flex-direction: row;
          width: 100%;
          margin-top: 20px;
          justify-content: flex-end;

          .collaborate-action-item {
            margin: 0 10px;

            .collaborate-icon {
              height: 17px;
            }

            .btn-text {
              padding: 0 5px;
            }
          }
        }
      }
    }
  }

  .collaborate-action-wrapper {
    .button-item-delete {
      padding: 0 10px;
      display: flex;
      align-items: center;
      height: 36px;
      border-radius: 6px;
      background: rgba(255, 51, 85, 1);
      border: 1px solid #eee;
      font-family: Inter-Bold;
      color: #fff;
    }
    .button-item-view {
      padding: 0 10px;display:flex; align-items:center ;height: 36px;border-radius: 6px;background: #15C39A;border: 1px solid #eee;
      font-family: Inter-Bold;color: #fff;
    }
  }
</style>
