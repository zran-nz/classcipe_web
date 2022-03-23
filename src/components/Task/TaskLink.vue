<template>
  <div class="common-link">
    <div class="link-group-wrapper">
      <template v-if="ownerLinkGroupList.length && !linkGroupLoading">
        <div class="link-group" v-for="(linkGroup, lIndex) in ownerLinkGroupList" :key="lIndex">
          <div class="group-item">
            <div class="group-header">
              <div class="group-left-info">
                <div class="group-name">
                  <div class="group-name-text">
                    {{ linkGroup.group }}
                  </div>
                </div>
              </div>
              <div class="group-right-info" >
                <div class="group-action">
                  <a-button v-show="canEdit" type="primary" @click="handleLinkGroup(linkGroup)" :style="{'background-color': '#fff', 'color': '#000', 'border': 'none'}">
                    <div class="btn-text" style="line-height: 20px">
                      + Link
                    </div>
                  </a-button>
                </div>
              </div>
            </div>
            <div class="group-body">
              <draggable v-model="linkGroup.contents" group="site" animation="300" @end="handleDragEnd" :disabled="!canEdit">
                <transition-group>
                  <div class="group-link-item" v-for="item in linkGroup.contents" :key="item.id">
                    <div class="left-info" @click="handleViewDetail(item)">
                      <div class="icon">
                        <content-type-icon :type="item.type"/>
                      </div>
                      <div class="name">
                        <a-tooltip placement="top" v-if='showDragTips'>
                          <template slot="title">
                            Click and drag content to change the order
                          </template>
                          {{ item.name ? item.name : 'untitled' }}
                        </a-tooltip>
                        <template v-if='!showDragTips'>
                          {{ item.name ? item.name : 'untitled' }}
                        </template>
                      </div>
                      <template v-if='item.type === typeMap.task'>
                        <a-tag class='task-type-tag green-active-task-type' v-if="item.taskType.toLowerCase() === 'fa'">
                          {{ item.taskType }}
                        </a-tag>
                        <a-tag class='task-type-tag red-active-task-type' v-if="item.taskType.toLowerCase() === 'sa'">
                          {{ item.taskType }}
                        </a-tag>
                        <a-tag class='task-type-tag blue-active-task-type' v-if="item.taskType.toLowerCase() === 'activity'">
                          {{ item.taskType }}
                        </a-tag>
                      </template>
                    </div>
                    <div class="right-info">
                      <div class="date" @click="handleViewDetail(item)">{{ item.createTime | dayjs }}</div>
                      <div class="status" @click="handleViewDetail(item)">
                        <template v-if="item.status === 0">Draft</template>
                        <template v-if="item.status === 1">Published</template>
                      </div>
                      <div class="more-action-wrapper action-item-wrapper" v-if="canEdit">
                        <a-dropdown>
                          <a-icon type="more" style="margin-right: 8px" />
                          <a-menu slot="overlay">
                            <a-menu-item>
                              <a-popconfirm :title="$t('teacher.my-content.action-delete') + '?'" ok-text="Yes" @confirm="handleDeleteLinkItem(item)" cancel-text="No">
                                <a href="#" class="delete-action">
                                  <a-icon type="delete" /> {{ $t('teacher.my-content.action-delete') }}
                                </a>
                              </a-popconfirm>
                            </a-menu-item>
                            <a-menu-item>
                              <a @click="handleEditLinkItem(item)">
                                <a-icon type="form" /> {{ $t('teacher.my-content.action-edit') }}
                              </a>
                            </a-menu-item>
                          </a-menu>
                        </a-dropdown>
                      </div>
                    </div>
                  </div>
                </transition-group>
              </draggable>
              <div class='no-link-group-contents' v-if='linkGroup.contents.length === 0'>
                <no-more-resources />
              </div>
            </div>
          </div>

        </div>
      </template>
    </div>

    <a-modal
      v-model="selectLinkContentVisible"
      :footer="null"
      :dialog-style="{ top: '10px'}"
      destroyOnClose
      width="900px">
      <div class="my-modal-title" slot="title">
        {{ linkTitle }}
      </div>

      <div class="link-content-wrapper">
        <task-new-my-content
          :from-id="fromId"
          :from-type="fromType"
          :filter-type="subFilterType"
          :no-selected-tips='noSelectedTips'
          :selected-list="selectedList"
          :group-name='groupName'
          @cancel="selectLinkContentVisible = false"
          @ensure="handleEnsureSelectedLink"/>
      </div>
    </a-modal>

    <a-drawer
      destroyOnClose
      placement="right"
      :closable="false"
      width="800px"
      :visible="previewVisible"
      @close="previewVisible = false"
    >
      <a-row class="preview-wrapper-row">
        <a-col span="2">
          <div class="view-back" @click="previewVisible = false">
            <div class="back-icon">
              <img src="~@/assets/icons/common/back.png" />
            </div>
          </div>
        </a-col>
        <a-col span="22">
          <div class="detail-wrapper" v-if="previewCurrentId && previewType">
            <common-preview-no-link :id="previewCurrentId" :type="previewType" />
          </div>
        </a-col>
      </a-row>
    </a-drawer>
  </div>
</template>

<script>

import { AddOrSaveGroupName, AssociateCancel, GetAssociate } from '@/api/teacher'
import MyContentSelector from '@/components/MyContent/MyContentSelector'
import TaskNewMyContent from '@/components/Task/TaskNewMyContent'
import { typeMap } from '@/const/teacher'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import * as logger from '@/utils/logger'
import CommonPreviewNoLink from '@/components/Common/CommonPreviewNoLink'

import draggable from 'vuedraggable'
import NoMoreResources from '@/components/Common/NoMoreResources'

export default {
  name: 'TaskLink',
  components: { NoMoreResources, ContentTypeIcon, TaskNewMyContent, MyContentSelector, CommonPreviewNoLink, draggable },
  props: {
    fromType: {
      type: Number,
      required: true
    },
    fromId: {
      type: String,
      required: true
    },
    filterType: {
      type: Number,
      default: 0
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    isLibrary: {
      type: Boolean,
      default: false
    },
    showDragTips: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      // 初次加载显示一个默认的空link面板
      defaultGroupName: 'Untitled category',
      defaultGroupNameEditMode: 'view',
      defaultGroupOtherContents: [],

      linkGroupLoading: true,
      ownerLinkGroupList: [],
      subDefaultGroupName: ['Untitled category'],
      noSelectedTips: '',
      // 当前点击的groupId
      currentGroupId: null,

      selectLinkContentVisible: false,
      typeMap: typeMap,
      previewVisible: false,
      previewCurrentId: '',
      previewType: '',
      subFilterType: null,
      selectedList: [],

      showCreate: true,
      showTabs: true,
      linkTitle: null,
      groupName: null
    }
  },
  created () {
    this.$logger.info('load TaskLink with id[' + this.fromId + '] fromType[' + this.fromType + ']')
    this.getAssociate()
  },
  methods: {
    getAssociate () {
      this.$logger.info('GetAssociate id[' + this.fromId + '] fromType[' + this.fromType + ']')
      this.linkGroupLoading = true
      GetAssociate({
        id: this.fromId,
        type: this.fromType,
        published: this.isLibrary ? 1 : 0
      }).then(response => {
        this.$logger.info('TaskLink GetAssociate response', response)
        if (response.success) {
          const associateData = response.result
          this.ownerLinkGroupList = []
          associateData.groups.forEach(item => {
            this.ownerLinkGroupList.push({
              group: item.groupName,
              contents: []
            })
            item.editing = false
          })
          associateData.owner.forEach(item => {
            const groupItem = this.ownerLinkGroupList.find(group => group.group === item.group)
            groupItem.contents = item.contents
          })
          this.ownerLinkGroupList = this.ownerLinkGroupList.sort((a, b) => a.group.indexOf('Unit Plan') !== -1 ? -1 : 1)
          this.selectedList = []
          this.ownerLinkGroupList.forEach(group => {
            group.contents.forEach(content => {
              this.selectedList.push(content.type + '-' + content.id)
            })
          })
          this.$logger.info('ownerLinkGroupList', this.ownerLinkGroupList)
        } else {
          this.$message.error(response.message)
        }
      }).finally(() => {
        this.linkGroupLoading = false
      })
    },

    handleEnsureSelectedLink (data) {
      this.$logger.info('handleEnsureSelectedLink', data)
      this.selectLinkContentVisible = false
      this.getAssociate()
    },

    handleLinkGroup (group) {
      this.$logger.info('handleLinkGroup', group)
      this.subDefaultGroupName = group.group
      if (group.group.trim() === 'Linked assessment tool(s)') {
        this.subFilterType = typeMap.evaluation
        this.linkTitle = 'Link Assessment tool(s)'
        this.groupName = 'Linked assessment tool(s)'
        this.noSelectedTips = 'No assessment rubric(s) selected'
        this.selectLinkContentVisible = true
      } else if (group.group.trim() === 'Relevant Unit Plan(s)') {
        this.subFilterType = typeMap['unit-plan']
        this.linkTitle = 'Link Unit Plan'
        this.groupName = 'Relevant Unit Plan(s)'
        this.noSelectedTips = 'No new Unit plan selected'
        this.selectLinkContentVisible = true
      } else {
        this.$logger.warn('handleLinkGroup unknown group', group)
        this.$message.warn('handleLinkGroup unknown group ' + group)
      }
    },

    handleToggleEditGroupName (linkGroup) {
      this.$logger.info('handleToggleEditGroupName', linkGroup)
      if (linkGroup.editing) {
        linkGroup.editing = false
        const ids = []
        linkGroup.contents.forEach(item => {
          ids.push(item.id)
        })
        AddOrSaveGroupName({
          fromId: this.fromId,
          fromType: this.fromType,
          groupName: linkGroup.group,
          ids: ids
        }).then(response => {
          this.$logger.info('AddOrSaveGroupName', response)
          linkGroup.editing = false
        })
      } else {
        linkGroup.editing = true
      }
    },
    handleViewDetail (item) {
      logger.info('handleViewDetail', item)
      this.previewCurrentId = item.id
      this.previewType = item.type
      this.previewVisible = true
    },
    handleEditLinkItem (item) {
      logger.info('handleEditLinkItem', item)
      if (item.type === typeMap['unit-plan']) {
        window.open('/teacher/unit-plan-redirect/' + item.id, '_blank')
      } else if (item.type === typeMap.evaluation) {
        window.open('/teacher/evaluation-redirect/' + item.id, '_blank')
      }
    },
    handleDeleteLinkItem (item) {
      this.$logger.info('handleDeleteLinkItem', item)
      AssociateCancel({
        fromId: this.fromId,
        fromType: this.fromType,
        toId: item.id,
        toType: item.type
      }).then(response => {
        this.$logger.info('handleDeleteLinkItem response ', response)
        // 刷新子组件的关联数据
        this.getAssociate()
      })
    },
    handleDragEnd () {
      logger.info('handleDragEnd ', this.ownerLinkGroupList)
      this.ownerLinkGroupList.forEach(linkGroup => {
        const ids = []
        linkGroup.contents.forEach(item => {
          ids.push(item.id)
        })
        AddOrSaveGroupName({
          fromId: this.fromId,
          fromType: this.fromType,
          groupName: linkGroup.group,
          ids: ids
        }).then(response => {
          this.$logger.info('AddOrSaveGroupName', response)
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.common-link {
  .link-group-wrapper {
    .link-group {
      margin-bottom: 25px;
      .group-item {
        .group-header {
          background-color: #C3EAFC;
          display: flex;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 10px 15px;
          .group-left-info {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            .group-name {
              padding-right: 5px;
              cursor: pointer;
              .group-name-text {
                font-family: Inter-Bold;
                font-size: 14px;
                font-family: Inter-Bold;
                line-height: 26px;
                color: #000000;
              }

              .group-name-input {
                padding: 0 5px;
                outline: none;
                font-size: 14px;
                font-family: Inter-Bold;
                line-height: 26px;
                box-sizing: border-box;
                color: #000000;
                width: 200px;
                border: none;
                background: #fff;
              }
            }

            .group-edit-icon {
              padding-left: 5px;
              cursor: pointer;
              color: #fff;
            }
          }

          .group-right-info {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            .group-action {

            }
          }
        }

        .group-body {
          .group-link-item {
            border-bottom: 1px solid #eee;
            padding: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            flex: 1;
            position: relative;

            .left-info {
              z-index: 50;
              display: flex;
              flex-direction: row;
              align-items: center;
              width: calc(100% - 280px);
              .icon {
                width: 40px;
              }
              &:hover{
                background-color: #fdfdfd;
                cursor: move;
              }

              .name {
                color: #000;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                word-break: break-all;
              }

            }

            .right-info {
              z-index: 100;
              background-color: #fff;
              position: absolute;
              right: 0;
              width: 280px;
              padding-left: 15px;
              display: flex;
              flex-direction: row;
              align-items: center;
              .status {
                text-align: right;
                width: 70px;
              }
              .more-action-wrapper{
                width: 30px;
                display: flex;
                justify-content: flex-end;
              }
            }
          }
        }
      }
    }
  }
}

.my-modal-title {
  text-align: center;
}

.green-active-task-type {
  background: rgba(21, 195, 154, 0.1);
  border: 2px solid #15C39A;
  border-radius: 50%;
  font-weight: bold;
  color: #15C39A;
}

.red-active-task-type {
  background: rgba(255, 51, 85, 0.1);
  border: 2px solid #FF3355;
  border-radius: 50%;
  opacity: 1;
  font-weight: bold;
  color: #FF3355;
  opacity: 1;
}

.blue-active-task-type {
  background: rgb(230, 247, 255);
  border: 2px solid rgb(145, 213, 255);
  border-radius: 50px;
  opacity: 1;
  font-weight: bold;
  color: rgb(24, 144, 255);
}

.task-type-tag {
  margin-left: 5px;
  height: 25px;
  display: flex;
  align-items: center;
  font-weight: bold;
  justify-content: center;
}

.no-link-group-contents {
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
