<template>
  <div class="common-link">
    <div class="link-group-wrapper">
      <template v-if="groups.length && !linkGroupLoading">
        <div class="link-group" v-for="(group, lIndex) in groups" :key="lIndex" >
          <div class="group-item">
            <div class="group-header" v-if="group.groupName">
              <div class="group-left-info">
                <!-- unit plan下才有term概念,task不显示对应的操作和term名称-->
                <div class="group-name">
                  <div class="group-name-text" v-if="!group.editing">
                    {{ group.groupName }}
                  </div>
                  <div class="group-name-input" v-if="group.editing">
                    <a-input
                      v-model="group.groupName"
                      class="group-name-input"
                      @pressEnter="handleToggleEditGroupName(group,lIndex)"/>
                  </div>
                </div>
                <div class="group-edit-icon" @click="handleToggleEditGroupName(group,lIndex)" v-if="canEdit">
                  <a-tooltip>
                    <template slot="title">
                      Rename
                    </template>
                    <a-icon type="edit" v-if="!group.editing"/>
                  </a-tooltip>
                  <a-icon type="check" v-if="group.editing"/>
                </div>

              </div>
              <div class="group-right-info" v-if="canEdit">
                <div class="group-action">
                  <a-button type="primary" @click="handleLinkGroup(group)" :style="{'background-color': '#fff', 'color': '#000', 'border': 'none'}">
                    <div class="btn-text" style="line-height: 20px">
                      + Link
                    </div>
                  </a-button>
                </div>
                <a-popconfirm title="Delete group?" ok-text="Yes" @confirm="handleDeleteGroup(group)" cancel-text="No">
                  <span class="delete-action" >
                    <img src="~@/assets/icons/tag/delete.png"/>
                  </span>
                </a-popconfirm>
              </div>
            </div>
            <draggable
              style="width: 100%; min-height: 50px"
              v-model="group.contents"
              group="site"
              animation="300"
              @end="handleDragEnd"
              :disabled="!canEdit">
              <div class="group-body">
                <transition-group >
                  <div class="group-link-item" v-for="item in group.contents" :key="item.id">
                    <div class="left-info">
                      <div class="icon">
                        <content-type-icon :type="item.type"/>
                      </div>
                      <div class="name" @click="handleViewDetail(item)">
                        <a-tooltip placement="top">
                          <template slot="title">
                            Click and drag tasks to move between categorys
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
              </div>
            </draggable>
          </div>

        </div>
      </template>
      <!--      <template v-if="othersLinkGroupList.length && !linkGroupLoading">-->
      <!--        <div class="link-group" data-group="othersLinkGroupList">-->
      <!--          <div class="group-item">-->
      <!--            <div class="group-header">-->
      <!--              <div class="group-left-info">-->
      <!--                <div class="group-name">-->
      <!--                  <div class="group-name-text">Linked by others</div>-->
      <!--                  &lt;!&ndash;                  <div class="group-name-text" v-if="fromType === typeMap.task" >Relevant Unit plan(s)</div>&ndash;&gt;-->
      <!--                  &lt;!&ndash;                  <div class="group-name-input" v-if="linkGroup.editing">&ndash;&gt;-->
      <!--                  &lt;!&ndash;                    <input v-model="linkGroup.group" class="group-name-input"/>&ndash;&gt;-->
      <!--                  &lt;!&ndash;                  </div>&ndash;&gt;-->
      <!--                </div>-->
      <!--                &lt;!&ndash;                <div class="group-edit-icon" @click="handleToggleEditGroupName(linkGroup)">&ndash;&gt;-->
      <!--                &lt;!&ndash;                  <a-icon type="edit" v-if="!linkGroup.editing"/>&ndash;&gt;-->
      <!--                &lt;!&ndash;                  <a-icon type="check" v-if="linkGroup.editing"/>&ndash;&gt;-->
      <!--                &lt;!&ndash;                </div>&ndash;&gt;-->
      <!--              </div>-->
      <!--              &lt;!&ndash;              <div class="group-right-info">&ndash;&gt;-->
      <!--              &lt;!&ndash;                <div class="group-action">&ndash;&gt;-->
      <!--              &lt;!&ndash;                  <a-button type="primary" @click="handleLinkGroup(linkGroup)">&ndash;&gt;-->
      <!--              &lt;!&ndash;                    <div class="btn-text" style="line-height: 20px">&ndash;&gt;-->
      <!--              &lt;!&ndash;                      + Link&ndash;&gt;-->
      <!--              &lt;!&ndash;                    </div>&ndash;&gt;-->
      <!--              &lt;!&ndash;                  </a-button>&ndash;&gt;-->
      <!--              &lt;!&ndash;                </div>&ndash;&gt;-->
      <!--              &lt;!&ndash;              </div>&ndash;&gt;-->
      <!--            </div>-->
      <!--            <div class="group-body">-->
      <!--              <div class="group-link-item" v-for="(item,index) in othersLinkGroupList" :key="index">-->
      <!--                <div class="left-info">-->
      <!--                  <div class="icon">-->
      <!--                    <content-type-icon :type="item.type"/>-->
      <!--                  </div>-->
      <!--                  <div class="name" @click="handleViewDetail(item)">-->
      <!--                    <a-tooltip placement="top">-->
      <!--                      <template slot="title">-->
      <!--                        {{ item.name ? item.name : 'untitled' }}-->
      <!--                      </template>-->
      <!--                      {{ item.name ? item.name : 'untitled' }}-->
      <!--                    </a-tooltip>-->
      <!--                  </div>-->
      <!--                </div>-->
      <!--                <div class="right-info">-->
      <!--                  <div class="date">{{ item.createTime | dayjs }}</div>-->
      <!--                  <div class="status">-->
      <!--                    <template v-if="item.status === 0">Draft</template>-->
      <!--                    <template v-if="item.status === 1">Published</template>-->
      <!--                  </div>-->
      <!--                </div>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </template>-->
    </div>

    <a-modal
      v-model="selectLinkContentVisible"
      :footer="null"
      :dialog-style="{ top: '0px'}"
      destroyOnClose
      width="900px">
      <div class="my-modal-title" slot="title">
        {{ linkTitle }}
      </div>

      <div class="link-content-wrapper">
        <new-my-content
          :from-type="fromType"
          :from-id="fromId"
          :filter-type-list="subFilterTypeList"
          :show-create="showCreate"
          :show-tabs="showTabs"
          :group-name-list="groupNameList"
          :default-group-name="subDefaultGroupName"
          :selected-list="selectedList"
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

import { GetAssociate, AddOrSaveGroupName, AssociateCancel, SaveGroupItems, DeleteGroup } from '@/api/teacher'
import MyContentSelector from '@/components/MyContent/MyContentSelector'
import NewMyContent from '@/components/MyContent/NewMyContent'
import { typeMap } from '@/const/teacher'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import * as logger from '@/utils/logger'
import CommonPreviewNoLink from '@/components/Common/CommonPreviewNoLink'

import draggable from 'vuedraggable'

export default {
  name: 'PlanLink',
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
  computed: {
    groupNameList () {
       var result = []
       this.groups.forEach(group => {
         result.push(group.groupName)
       })
      return result
    },
    selectedList () {
      const list = []
      this.ownerLinkGroupList.forEach(groupItem => {
        groupItem.contents.forEach(content => {
          list.push(content.type + '-' + content.id)
        })
      })
      return list
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
      othersLinkGroupList: [],
      groups: [],
      subDefaultGroupName: ['Untitled category'],
      // 当前点击的groupId
      currentGroupId: null,

      selectLinkContentVisible: false,
      typeMap: typeMap,
      previewVisible: false,
      previewCurrentId: '',
      previewType: '',
      subFilterTypeList: [typeMap.evaluation],

      showCreate: true,
      showTabs: true,
      linkTitle: 'Link Content',
      editingGroup: '',
      groupRransition: []
    }
  },
  created () {
    this.$logger.info('load PlanLink with id[' + this.fromId + '] fromType[' + this.fromType + ']')
    this.subFilterTypeList = [typeMap.task]
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
        this.groups = response.result.groups
        this.$logger.info('formatted owner', response.result.owner)
        this.$logger.info('formatted others', response.result.others)
        this.othersLinkGroupList = []
        this.ownerLinkGroupList = response.result.owner
        this.groups.forEach(item => {
          item.editing = false
          item.contents = []
          this.ownerLinkGroupList.forEach(groupItem => {
            if (groupItem.group === item.groupName) {
              item.contents = groupItem.contents
            }
          })
        })
        this.groups = this.groups.sort((a, b) => !a.groupName ? -1 : 1)
        this.$logger.info('formatted groups', this.groups)

        this.$logger.info('ownerLinkGroupList', this.ownerLinkGroupList)
        response.result.others.forEach(item => {
          this.othersLinkGroupList.unshift(...item.contents)
        })
        this.$logger.info('othersLinkGroupList', this.othersLinkGroupList)
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
      this.$logger.info('groups', this.groups)
      this.selectLinkContentVisible = true
    },

    handleEnsureSelectedLink (data) {
      this.$logger.info('handleEnsureSelectedLink', data)
      this.selectLinkContentVisible = false
      this.getAssociate()
    },

    handleLinkGroup (group) {
      this.$logger.info('handleLinkGroup', group)
      this.subDefaultGroupName = group.groupName
      this.selectLinkContentVisible = true
      if (this.fromType === typeMap['unit-plan']) {
        this.subFilterTypeList = [typeMap.task]
      } else if (this.filterType === typeMap.task) {
        this.subFilterTypeList = [typeMap.evaluation, typeMap['unit-plan']]
      }
    },

    handleToggleEditGroupName (linkGroup, index) {
      this.$logger.info('handleToggleEditGroupName', linkGroup)
      if (linkGroup.editing) {
        AddOrSaveGroupName({
          fromId: this.fromId,
          fromType: this.fromType,
          id: linkGroup.id,
          groupName: linkGroup.groupName
        }).then(response => {
          this.$logger.info('AddOrSaveGroupName', response)
        }).finally(() => {
          // this.getAssociate()
          linkGroup.editing = false
          this.$set(this.groups, index, linkGroup)
        })
      } else {
        linkGroup.editing = true
        this.$set(this.groups, index, linkGroup)
      }
    },
    handleDeleteGroup (linkGroup) {
      this.$logger.info('handleDeleteGroup', linkGroup)
      DeleteGroup({
        fromId: this.fromId,
        fromType: this.fromType,
        id: linkGroup.id
      }).then(response => {
        this.$logger.info('DeleteGroup', response)
        this.getAssociate()
      })
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
      logger.info('handleDragEnd ', this.groups)
      this.groups.forEach((group, index) => {
        this.$set(this.groups, index, group)
      })

      SaveGroupItems({
        fromId: this.fromId,
        fromType: this.fromType,
        groups: this.groups
      }).then(response => {
        this.$logger.info('AddOrSaveGroupName', response)
      }).finally(() => {
        // this.getAssociate()
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
          margin-right: 25px;
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

          position: relative;
          &:hover{
            .delete-action {
              display: block;
            }
          }
          .delete-action {
            position: absolute;
            top:7px;
            right: -30px;
            display: none;
            cursor: pointer;
            height: 35px;
            img {
              width: 35px;
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
/deep/ .ant-spin-nested-loading{
  max-height:400px;
  overflow-y: auto;
}

</style>
