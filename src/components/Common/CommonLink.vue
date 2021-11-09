<template>
  <div class="common-link">
    <div class="link-group-wrapper">
      <template v-if="!ownerLinkGroupList.length && !linkGroupLoading">
        <!-- 初次加载显示一个默认的空link面板-->
        <div class="link-group">
          <div class="group-item">
            <div class="group-header">
              <div class="group-left-info">
                <div class="group-name">
                  <div class="group-name-text" v-if="defaultGroupNameEditMode === 'view'">{{ defaultGroupName ? defaultGroupName : 'Untitled Term' }}</div>
                  <div class="group-name-input" v-if="defaultGroupNameEditMode === 'edit'">
                    <input v-model="defaultGroupName" class="group-name-input"/>
                  </div>
                </div>
                <div class="group-edit-icon" @click="handleToggleEditDefaultGroupName" v-if="canEdit">
                  <a-icon type="edit" v-if="defaultGroupNameEditMode === 'view'"/>
                  <a-icon type="check" v-if="defaultGroupNameEditMode === 'edit'"/>
                </div>
              </div>
              <div class="group-right-info" v-if="canEdit">
                <div class="group-action">
                  <a-button type="primary" @click="handleDefaultGroupLink" :style="{'background-color': '#fff', 'color': '#000', 'border': 'none'}">
                    <div class="btn-text" style="line-height: 20px">
                      + Link
                    </div>
                  </a-button>
                </div>
              </div>
            </div>
            <div class="group-body">
              <div class="group-link-item"></div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="ownerLinkGroupList.length && !linkGroupLoading">
        <div class="link-group" v-for="(linkGroup, lIndex) in ownerLinkGroupList" :key="lIndex">
          <div class="group-item">
            <div class="group-header">
              <div class="group-left-info">
                <div class="group-name">
                  <div class="group-name-text" v-if="!linkGroup.editing">{{ linkGroup.group ? linkGroup.group : 'Untitled Term' }}</div>
                  <div class="group-name-input" v-if="linkGroup.editing">
                    <input v-model="linkGroup.group" class="group-name-input"/>
                  </div>
                </div>
                <div class="group-edit-icon" @click="handleToggleEditGroupName(linkGroup)" v-if="canEdit">
                  <a-icon type="edit" v-if="!linkGroup.editing"/>
                  <a-icon type="check" v-if="linkGroup.editing"/>
                </div>
              </div>
              <div class="group-right-info" v-if="canEdit">
                <div class="group-action">
                  <a-button type="primary" @click="handleLinkGroup(linkGroup)" :style="{'background-color': '#fff', 'color': '#000', 'border': 'none'}">
                    <div class="btn-text" style="line-height: 20px">
                      + Link
                    </div>
                  </a-button>
                </div>
              </div>
            </div>
            <div class="group-body">
              <draggable v-model="ownerLinkGroupList[lIndex].contents" group="site" animation="300" @end="handleDragEnd" :disabled="!canEdit">
                <transition-group>
                  <div class="group-link-item" v-for="item in linkGroup.contents" :key="item.id">
                    <div class="left-info">
                      <div class="icon">
                        <content-type-icon :type="item.type"/>
                      </div>
                      <div class="name" @click="handleViewDetail(item)">
                        <a-tooltip placement="top">
                          <template slot="title">
                            {{ item.name ? item.name : 'untitled' }}
                          </template>
                          {{ item.name ? item.name : 'untitled' }}
                        </a-tooltip>
                      </div>
                    </div>
                    <div class="right-info">
                      <div class="date">{{ item.createTime | dayjs }}</div>
                      <div class="status">
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
            </div>
          </div>

        </div>
      </template>
      <template v-if="othersLinkGroupList.length && !linkGroupLoading">
        <div class="link-group">
          <div class="group-item">
            <div class="group-header">
              <div class="group-left-info">
                <div class="group-name">
                  <div class="group-name-text" >Linked by others</div>
                  <!--                  <div class="group-name-input" v-if="linkGroup.editing">-->
                  <!--                    <input v-model="linkGroup.group" class="group-name-input"/>-->
                  <!--                  </div>-->
                </div>
                <!--                <div class="group-edit-icon" @click="handleToggleEditGroupName(linkGroup)">-->
                <!--                  <a-icon type="edit" v-if="!linkGroup.editing"/>-->
                <!--                  <a-icon type="check" v-if="linkGroup.editing"/>-->
                <!--                </div>-->
              </div>
              <!--              <div class="group-right-info">-->
              <!--                <div class="group-action">-->
              <!--                  <a-button type="primary" @click="handleLinkGroup(linkGroup)">-->
              <!--                    <div class="btn-text" style="line-height: 20px">-->
              <!--                      + Link-->
              <!--                    </div>-->
              <!--                  </a-button>-->
              <!--                </div>-->
              <!--              </div>-->
            </div>
            <div class="group-body">
              <div class="group-link-item" v-for="(item,index) in othersLinkGroupList" :key="index">
                <div class="left-info">
                  <div class="icon">
                    <content-type-icon :type="item.type"/>
                  </div>
                  <div class="name" @click="handleViewDetail(item)">
                    <a-tooltip placement="top">
                      <template slot="title">
                        {{ item.name ? item.name : 'untitled' }}
                      </template>
                      {{ item.name ? item.name : 'untitled' }}
                    </a-tooltip>
                  </div>
                </div>
                <div class="right-info">
                  <div class="date">{{ item.createTime | dayjs }}</div>
                  <div class="status">
                    <template v-if="item.status === 0">Draft</template>
                    <template v-if="item.status === 1">Published</template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <a-modal
      v-model="selectLinkContentVisible"
      :footer="null"
      destroyOnClose
      width="800px">
      <div class="my-modal-title" slot="title" v-if="fromType === typeMap.task">
        Link Evaluation Form(s)
      </div>
      <div class="my-modal-title" slot="title" v-else>
        Link my content
      </div>

      <div class="link-content-wrapper">
        <new-my-content
          :from-type="fromType"
          :from-id="fromId"
          :filter-type-list="subFilterTypeList"
          :group-name-list="groupNameList"
          :default-group-name="subDefaultGroupName"
          :mode="'common-link'"
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

import { GetAssociate, AddOrSaveGroupName, AssociateCancel } from '@/api/teacher'
import MyContentSelector from '@/components/MyContent/MyContentSelector'
import NewMyContent from '@/components/MyContent/NewMyContent'
import { typeMap } from '@/const/teacher'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import * as logger from '@/utils/logger'
import CommonPreviewNoLink from '@/components/Common/CommonPreviewNoLink'

import draggable from 'vuedraggable'

export default {
  name: 'CommonLink',
  components: { ContentTypeIcon, NewMyContent, MyContentSelector, CommonPreviewNoLink, draggable },
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
    }
  },
  data () {
    return {
      // 初次加载显示一个默认的空link面板
      defaultGroupName: 'Untitled Term',
      defaultGroupNameEditMode: 'view',
      defaultGroupOtherContents: [],

      linkGroupLoading: true,
      ownerLinkGroupList: [],
      othersLinkGroupList: [],
      groupNameList: ['Untitled Term'],
      subDefaultGroupName: ['Untitled Term'],
      // 当前点击的groupId
      currentGroupId: null,

      selectLinkContentVisible: false,
      typeMap: typeMap,
      previewVisible: false,
      previewCurrentId: '',
      previewType: '',
      subFilterTypeList: [typeMap.evaluation]
    }
  },
  created () {
    this.$logger.info('load CommonLink with id[' + this.fromId + '] fromType[' + this.fromType + ']')
    if (this.fromType === typeMap['unit-plan']) {
      this.subFilterTypeList = [typeMap.task, typeMap.evaluation]
    } else if (this.filterType === typeMap.task) {
      this.subFilterTypeList = [typeMap.evaluation]
    }
    this.getAssociate()
  },
  methods: {
    getAssociate () {
      this.$logger.info('GetAssociate id[' + this.fromId + '] fromType[' + this.fromType + ']')
      this.linkGroupLoading = true
      GetAssociate({
        id: this.fromId,
        type: this.fromType
      }).then(response => {
        this.$logger.info('CommonLink GetAssociate response', response)
        const groupNameList = []
        response.result.owner.forEach(item => {
          if (groupNameList.indexOf(item.group) === -1) {
            groupNameList.push(item.group)
          }
          item.editing = false
        })
        // response.result.others.forEach(item => {
        //   if (groupNameList.indexOf(item.group) === -1) {
        //     groupNameList.push(item.group)
        //   }
        //   item.editing = false
        // })
        this.$logger.info('formatted owner', response.result.owner)
        this.$logger.info('formatted others', response.result.others)
        this.$logger.info('formatted groupNameList', groupNameList)
        this.ownerLinkGroupList = response.result.owner.reverse()
        this.othersLinkGroupList = []
        response.result.others.forEach(item => {
          this.othersLinkGroupList.unshift(...item.contents)
        })
        // this.othersLinkGroupList = response.result.others
        if (groupNameList.length) {
          this.groupNameList = groupNameList
        }
        this.$emit('group-name-list-update')
      }).finally(() => {
        this.linkGroupLoading = false
      })
    },

    handleToggleEditDefaultGroupName () {
      this.$logger.info('handleToggleEditDefaultGroupName ' + this.defaultGroupNameEditMode)
      this.defaultGroupNameEditMode = this.defaultGroupNameEditMode === 'view' ? 'edit' : 'view'
    },

    handleDefaultGroupLink () {
      this.$logger.info('handleDefaultGroupLink')
      this.$logger.info('groupNameList', this.groupNameList)
      this.selectLinkContentVisible = true
    },

    handleEnsureSelectedLink (data) {
      this.$logger.info('handleEnsureSelectedLink', data)
      this.selectLinkContentVisible = false
      this.getAssociate()
    },

    handleLinkGroup (group) {
      this.$logger.info('handleLinkGroup', group)
      this.subDefaultGroupName = group.group
      this.selectLinkContentVisible = true
    },

    handleToggleEditGroupName (linkGroup) {
      this.$logger.info('handleToggleEditGroupName', linkGroup)
      if (linkGroup.editing) {
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
          this.getAssociate()
        })
      }
      linkGroup.editing = !linkGroup.editing
    },
    handleViewDetail (item) {
      if (!this.canEdit) {
        return
      }
      logger.info('handleViewDetail', item)
      this.previewCurrentId = item.id
      this.previewType = item.type
      this.previewVisible = true
    },
    handleEditLinkItem (item) {
      logger.info('handleEditLinkItem', item)
      if (item.type === typeMap['unit-plan']) {
        window.open('/teacher/unit-plan-redirect/' + item.id, '_blank')
      } else if (item.type === typeMap['topic']) {
        window.open('/expert/topic-redirect/' + item.id, '_blank')
      } else if (item.type === typeMap['material']) {
        window.open('/teacher/add-material/' + item.id, '_blank')
      } else if (item.type === typeMap.task) {
        window.open('/teacher/task-redirect/' + item.id, '_blank')
      } else if (item.type === typeMap.lesson) {
        window.open('/teacher/lesson-redirect/' + item.id, '_blank')
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

            .left-info {
              display: flex;
              flex-direction: row;
              align-items: center;
              .icon {
                width: 40px;
              }
              &:hover{
                background-color: #fdfdfd;
                cursor: move;
              }

              .name {
                color: #000;
                width: 300px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                word-break: break-all;
              }

            }

            .right-info {
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

</style>
