<template>
  <div class="my-content">
    <!--    <div class="created-type-filter">
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item @click="handleToggleType('All')">
            <span>All</span>
          </a-menu-item>
          <a-menu-item @click="handleToggleType('Created by me')">
            <span> {{ $t('teacher.main.created-by-me') }}</span>
          </a-menu-item>
          <a-menu-item @click="handleToggleType('My favorite')">
            <span> {{ $t('teacher.main.my-favorite') }}</span>
          </a-menu-item>
          <a-menu-item @click="handleToggleType('Shared')">
            <span>{{ $t('teacher.main.shared') }}</span>
          </a-menu-item>
        </a-menu>
        <a-button
          class="type-filter-button"
          style="padding: 0 20px;display:flex; align-items:center ;height: 40px;border-radius: 6px;background: #FFFFFF;font-family: Inter-Bold;color: #182552;">
          {{ createdType }}
          <a-icon type="caret-down"/>
        </a-button>
      </a-dropdown>
    </div>-->
    <div class="display-type-toggle">
      <div
        :class="{'display-type-item': true,
                 'active-display-type': currentType === typeMap.topic}"
        v-if="filterTypeList.indexOf(typeMap.topic) !== -1"
        @click="handleToggleDisplayType(typeMap.topic)">
        {{ $t('teacher.my-content.topics-type') }}
      </div>
      <div
        :class="{'display-type-item': true,
                 'active-display-type': currentType === typeMap['unit-plan']}"
        v-if="filterTypeList.indexOf(typeMap['unit-plan']) !== -1"
        @click="handleToggleDisplayType(typeMap['unit-plan'])">
        {{ $t('teacher.my-content.unit-plan-type') }}
      </div>
      <div
        :class="{'display-type-item': true,
                 'active-display-type': currentType === typeMap.task}"
        v-if="filterTypeList.indexOf(typeMap.task) !== -1"
        @click="handleToggleDisplayType(typeMap.task)">
        {{ $t('teacher.my-content.tasks-type') }}
      </div>
      <div
        :class="{'display-type-item': true,
                 'active-display-type': currentType === typeMap.evaluation}"
        v-if="filterTypeList.indexOf(typeMap.evaluation) !== -1"
        @click="handleToggleDisplayType(typeMap.evaluation)">
        {{ $t('teacher.my-content.evaluation-type') }}
      </div>
    </div>
    <div class="create-new-action">
      <div class="create-action" @click="handleCreateNew">
        Create New {{ currentTypeLabel }}
      </div>
      <div class="create-new-input">
        <input type="text" placeholder="Input name" v-model="createNewName" v-if="createNewNameMode === 'input'">
        <a-icon type="check" class="create-new-icon" v-if="createNewNameMode === 'input'" @click="handleEnsureCreate"/>
      </div>
    </div>
    <div class="group-label">
      <template v-if="groupNameMode === 'select'">
        <div class="choose-label">Choose term</div>
        <a-select :default-value="defaultGroupName" style="width: 100%" v-model="selectedGroup">
          <a-select-option :value="groupNameItem" v-for="(groupNameItem, gIndex) in groupNameList" :key="gIndex">
            {{ groupNameItem }}
          </a-select-option>
        </a-select>
      </template>
      <template v-if="groupNameMode === 'input'">
        <div class="choose-label">Group name</div>
        <a-input v-model="groupName" />
      </template>
    </div>
    <div class="content-wrapper">
      <a-skeleton :loading="skeletonLoading" active>
        <div class="content-list">
          <a-list
            size="large"
            :pagination="pagination"
            :data-source="myContentList"
            :loading="loading"
            v-if="dataListMode === 'list'">
            <a-list-item
              slot="renderItem"
              key="item.key"
              slot-scope="item"
              :class="{'my-list-item': true, 'active-item': mySelectedList.indexOf(item.type + '-' + item.id) !== -1}"
              @click="handleToggleSelect(item)">

              <div class="select-block" @click="handleLinkItem(item, $event)">
                <a-icon
                  class="select-block-icon"
                  type="border"
                  v-if="mySelectedList.indexOf(item.type + '-' + item.id) === -1"/>
                <div class="selected-icon" v-if="mySelectedList.indexOf(item.type + '-' + item.id) !== -1">
                  <img src="~@/assets/icons/lesson/selected.png"/>
                </div>
              </div>
              <span class="content-info-left">
                <content-type-icon :type="item.type"/>

                <span class="name-content" @click="handleViewDetail(item, $event)">
                  <span class="name-text" >
                    {{ item.name ? item.name : 'Untitled' }}
                  </span>
                </span>
              </span>

              <span class="content-info-right">
                <span class="status">
                  <template v-if="item.status === 0">Draft</template>
                  <template v-if="item.status === 1">Published</template>
                </span>
                <span class="update-time">
                  {{ item.updateTime || item.createTime | dayjs }}
                </span>
                <div class="action">
                  <div class="action-wrapper">
                    <div class="action-item" @click="handleViewDetail(item, $event)">
                      <span class="btn-text">Preview</span>
                    </div>
                  </div>
                  <div slot="actions" v-if="mode === displayMode.Link">
                    <div class="action-wrapper">
                      <div class="action-item">
                        <a-popconfirm
                          :title="'Link this content to my Unit' + '?'"
                          ok-text="Yes"
                          @confirm="handleLinkItem(item, $event)"
                          cancel-text="No">
                          <span>
                            <a-icon type="form"/> Link
                          </span>
                        </a-popconfirm>
                      </div>
                    </div>
                  </div>
                  <div slot="actions" v-if="mode === displayMode.Refer">
                    <div class="action-wrapper">
                      <div class="action-item refer-item">
                        <a-button class="refer-btn" type="primary" @click="handleReferItem(item, $event)">
                          <img src="~@/assets/icons/myContent/refer_white.png" class="btn-icon btn-icon-white"/>
                          <img src="~@/assets/icons/myContent/refer_color.png" class="btn-icon btn-icon-color"/>
                          <div class="btn-text">
                            Refer
                          </div>
                        </a-button>
                      </div>
                    </div>
                  </div>
                  <div slot="actions" v-show="mode === displayMode.Evaluation">
                    <div class="action-wrapper">
                      <div class="action-item">
                        <a-popconfirm
                          :title="'Link ?'"
                          ok-text="Yes"
                          @confirm="handleLinkItem(item, $event)"
                          cancel-text="No">
                          <div class="link-item">
                            <img src="~@/assets/icons/myContent/link-icon.png" class="link-icon"/>
                            {{
                              'Link this evaluation to this ' + (item.type === typeMap.task ? 'task' : (item.type === typeMap.task ? 'lesson' : ''))
                            }}
                          </div>
                        </a-popconfirm>
                      </div>
                    </div>
                  </div>
                </div>
              </span>
            </a-list-item>
          </a-list>

          <a-list
            size="large"
            :pagination="pagination"
            :data-source="myContentList"
            :loading="loading"
            v-if="dataListMode === 'card'">
            <div
              slot="renderItem"
              key="item.key"
              class="my-card-list-item"
              slot-scope="item"
              @click="handleToggleSelect(item)">
              <div class="cover-img-wrapper">
                <div
                  class="cover-image"
                  :style="{backgroundImage: 'url(' + item.image + ')' }"
                >
                </div>
              </div>
              <div class="item-intro">
                <div class="page-info">
                  <span class="page-num-tag">
                    1/1
                  </span>
                </div>
                <div class="main-title" @click="handleViewDetail(item, $event)">
                  {{ item.name ? item.name : 'Untitled' }}
                </div>
                <div class="sub-title">
                  {{ item.createTime | dayjs }}
                </div>
              </div>
              <div class="item-action-wrapper">
                <div v-show="mode === displayMode.Link">
                  <div class="action-wrapper">
                    <div class="action-item">
                      <a-popconfirm
                        :title="'Link this content to my Unit' + '?'"
                        ok-text="Yes"
                        @confirm="handleLinkItem(item, $event)"
                        cancel-text="No">
                        <span>
                          <a-icon type="form"/> Link
                        </span>
                      </a-popconfirm>
                    </div>
                  </div>
                </div>
                <!-- refer mode -->
                <div v-show="mode === displayMode.Refer">
                  <div class="action-wrapper">
                    <div class="action-item refer-item">
                      <a-button class="refer-btn" type="primary" @click="handleReferItem(item, $event)">
                        <img src="~@/assets/icons/myContent/refer_white.png" class="btn-icon btn-icon-white"/>
                        <img src="~@/assets/icons/myContent/refer_color.png" class="btn-icon btn-icon-color"/>
                        <div class="btn-text">
                          Refer
                        </div>
                      </a-button>
                    </div>
                  </div>
                </div>
                <!-- refer mode -->
                <div v-show="mode === displayMode.Evaluation">
                  <div class="action-wrapper">
                    <div class="action-item">
                      <a-popconfirm
                        :title="'Link ?'"
                        ok-text="Yes"
                        @confirm="handleLinkItem(item, $event)"
                        cancel-text="No">
                        <div class="link-item">
                          <img src="~@/assets/icons/myContent/link-icon.png" class="link-icon"/>
                          {{
                            'Link this evaluation to this ' + (item.type === typeMap.task ? 'task' : (item.type === typeMap.task ? 'lesson' : ''))
                          }}
                        </div>
                      </a-popconfirm>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-action-icon">
                <img
                  src="~@/assets/icons/lesson/selected.png"
                  v-if="mySelectedList.indexOf(item.type + '-' + item.id) !== -1"/>
              </div>
            </div>
          </a-list>
          <div class="modal-ensure-action-line">
            <a-button class="action-item action-cancel" shape="round" @click="handleCancel">Cancel</a-button>
            <a-button class="action-ensure action-item" type="primary" shape="round" @click="handleEnsure">Ok</a-button>
          </div>
        </div>

      </a-skeleton>

      <a-drawer
        destroyOnClose
        placement="right"
        width="700px"
        :closable="false"
        :visible="previewVisible"
        @close="handlePreviewClose"
      >
        <div class="preview-wrapper">
          <a-row class="preview-wrapper-row">
            <a-col span="3">
              <div class="view-back" @click="handlePreviewClose">
                <div class="back-icon">
                  <img src="~@/assets/icons/common/back.png"/>
                </div>
              </div>
            </a-col>
            <a-col span="21">
              <div class="detail-wrapper">
                <div class="preview-detail" v-if="previewCurrentId && previewType">
                  <common-preview-no-link :id="previewCurrentId" :type="previewType"/>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </a-drawer>
    </div>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import UnitPlanPreview from '@/components/UnitPlan/UnitPlanPreview'
import MaterialPreview from '@/components/Material/MaterialPreview'
import { FindMyContent, Associate } from '@/api/teacher'
import { FavoritesGetMyFavorites } from '@/api/favorites'
import { ownerMap, typeMap, getLabelNameType } from '@/const/teacher'
import ContentStatusIcon from '@/components/Teacher/ContentStatusIcon'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { MyContentEventBus, MyContentEvent } from '@/components/MyContent/MyContentEventBus'
import DisplayMode from '@/components/MyContent/DisplayMode'
import NoMoreResources from '@/components/Common/NoMoreResources'
import PuBuIcon from '@/assets/icons/library/pubu .svg?inline'
import ListModeIcon from '@/assets/icons/library/liebiao .svg?inline'
import { EvaluationAddOrUpdate } from '@/api/evaluation'
import { TaskAddOrUpdate } from '@/api/task'
import { UnitPlanAddOrUpdate } from '@/api/unitPlan'
import { TopicAddOrUpdate } from '@/api/topic'
import CommonPreviewNoLink from '@/components/Common/CommonPreviewNoLink'

export default {
  name: 'NewMyContent',
  components: {
    CommonPreviewNoLink,
    ContentStatusIcon,
    ContentTypeIcon,
    UnitPlanPreview,
    MaterialPreview,
    NoMoreResources,
    PuBuIcon,
    ListModeIcon
  },
  props: {
    filterTypeList: {
      type: Array,
      default: () => []
    },
    selectedList: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: DisplayMode.Link
    },
    selectedType: {
      type: String,
      default: 'created-by-me'
    },
    currentId: {
      type: String,
      default: ''
    },
    fromType: {
      type: Number,
      required: true
    },
    fromId: {
      type: String,
      required: true
    },
    defaultGroupName: {
      type: String,
      default: null
    },
    groupNameList: {
      type: Array,
      required: true
    },
    groupNameMode: {
      type: String,
      default: 'select'
    }
  },
  data () {
    return {
      skeletonLoading: true,
      loading: true,
      loadFailed: false,
      myContentList: [],
      displayMode: DisplayMode,
      currentStatus: 'all-status',
      currentStatusLabel: this.$t('teacher.my-content.all-status'),
      currentType: null,
      currentTypeLabel: null,
      currentOwner: 'all-owner',
      currentOwnerLabel: this.$t('teacher.my-content.all-owner'),

      previewVisible: false,
      previewCurrentId: '',
      previewType: '',

      pagination: {
        onChange: page => {
          logger.info('pagination onChange', page)
          this.pageNo = page
          this.loadMyContent()
        },
        showTotal: total => `Total ${total} items`,
        total: 0,
        pageSize: 9
      },
      pageNo: 1,

      typeMap: typeMap,

      dataListMode: 'list',
      createdType: 'All',
      createNewName: '',
      createNewNameMode: 'hide',

      mySelectedList: [],
      mySelectedMap: new Map(),

      selectedGroup: null,
      groupName: null
    }
  },
  watch: {
    selectedType (value) {
      this.$logger.info('watch select type ' + value)
      this.pageNo = 1
      this.myContentList = []
      this.pagination.total = 0
      this.pagination.pageSize = 8
      this.loadMyContent()
    },
    groupNameList (value) {
      this.$logger.info('groupNameList', value)
    }
  },
  created () {
    this.$logger.info('NewMyContent filterTypeList', this.filterTypeList)
    this.$logger.info('NewMyContent groupNameList', this.groupNameList)
    if (this.filterTypeList.length) {
      this.currentType = this.filterTypeList[0]
      this.currentTypeLabel = getLabelNameType(this.filterTypeList[0])
    }
    this.$logger.info('currentTypeLabel ' + this.currentTypeLabel)
    this.mySelectedList = this.selectedList
    this.selectedGroup = this.defaultGroupName
    this.groupName = this.defaultGroupName
    this.loadMyContent()
  },
  methods: {
    loadMyContent () {
      this.loading = true
      if (this.createdType === 'Created by me') {
        this.getMyContent()
      } else if (this.createdType === 'My Favorite') {
        this.getMyFavorites()
      } else if (this.createdType === 'Shared') {
        this.loading = false
        this.skeletonLoading = false
        this.$logger.info('shared coming soon!')
      } else {
        this.getMyContent()
      }
    },

    handleToggleDataListMode (mode) {
      this.$logger.info('handleToggleDataListMode' + mode)
      this.dataListMode = mode
    },

    getMyContent () {
      const typeList = []
      this.filterTypeList.forEach(item => {
        typeList.push(typeMap[item])
      })
      FindMyContent({
        owner: ownerMap[this.currentOwner],
        // status: statusMap[this.currentStatus],
        types: this.currentType ? [this.currentType] : typeList,
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize,
        currentId: this.currentId
      }).then(res => {
        logger.info('getMyContent', res)
        if (res.result && res.result.records && res.result.records.length) {
          res.result.records.forEach((record, index) => {
            record.key = index
          })
          this.myContentList = res.result.records
          this.pagination.total = res.result.total
        } else {
          this.myContentList = []
          this.pagination.total = 0
        }
        logger.info('myContentList', this.myContentList)
      }).finally(() => {
        this.loading = false
        this.skeletonLoading = false
      })
    },

    getMyFavorites () {
      this.$logger.info('getMyFavorites')
      FavoritesGetMyFavorites({
        type: this.currentType,
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize
      }).then((res) => {
        this.$logger.info('FavoritesGetMyFavorites response', res)
        if (res.result && res.result.records && res.result.records.length) {
          res.result.records.forEach((record, index) => {
            record.key = index
          })
          this.myContentList = res.result.records
          this.pagination.total = res.result.total
          this.pagination.current = res.result.current
        } else {
          this.myContentList = []
          this.pagination.total = 0
        }
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

    handleLinkItem (item, event) {
      logger.info('handleLinkItem', item)
      event.preventDefault()
      event.stopPropagation()
      const itemId = item.type + '-' + item.id
      const index = this.mySelectedList.indexOf(itemId)
      if (index !== -1) {
        this.mySelectedList.splice(index, 1)
        this.mySelectedMap.delete(itemId)
      } else {
        this.mySelectedList.push(itemId)
        this.mySelectedMap.set(itemId, item)
      }
    },
    handleViewDetail (item, event) {
      logger.info('my content created by me handleViewDetail', item, event)
      event.preventDefault()
      event.stopPropagation()
      this.previewCurrentId = item.id
      this.previewType = item.type
      this.previewVisible = true
    },

    handleToggleSelect (item) {
      logger.info('handleToggleSelect', item)
      MyContentEventBus.$emit(MyContentEvent.ToggleSelectContentItem, { ...item })
    },

    handlePreviewClose () {
      logger.info('handlePreviewClose')
      this.previewCurrentId = ''
      this.previewType = ''
      this.previewVisible = false
    },

    handleReferItem (item, event) {
      logger.info('handleReferItem', item)
      event.preventDefault()
      event.stopPropagation()
      MyContentEventBus.$emit(MyContentEvent.ReferContentItem, { item })
    },

    handleToggleType (type) {
      this.$logger.info('handleToggleType ' + type)
      this.createdType = type
      this.loadMyContent()
    },

    handleToggleDisplayType (type) {
      this.$logger.info('handleToggleDisplayType' + type)
      if (this.currentType === type) {
        this.currentType = null
        this.currentTypeLabel = null
      } else {
        this.currentType = type
        this.currentTypeLabel = getLabelNameType(type)
      }

      this.$logger.info('after handleToggleDisplayType' + this.currentType)
      this.loadMyContent()
    },

    handleCreateNew () {
      this.$logger.info('handleCreateNew')
      if (this.createNewNameMode === 'hide') {
        this.createNewName = ''
      }
      this.createNewNameMode = this.createNewNameMode === 'input' ? 'hide' : 'input'
    },

    handleEnsureCreate () {
      this.$logger.info('handleEnsureCreate ' + this.currentType + ' ' + this.createNewName)
      if (this.createNewName) {
        if (this.currentType === this.typeMap.evaluation) {
          EvaluationAddOrUpdate({
            name: this.createNewName
          }).then((response) => {
            this.$logger.info('EvaluationAddOrUpdate response', response)
            this.loadMyContent()
          }).finally(() => {
            this.createNewNameMode = 'hide'
            this.createNewName = ''
          })
        } else if (this.currentType === this.typeMap.task) {
          TaskAddOrUpdate({
            name: this.createNewName
          }).then((response) => {
            this.$logger.info('TaskAddOrUpdate response', response)
            this.loadMyContent()
          }).finally(() => {
            this.createNewNameMode = 'hide'
            this.createNewName = ''
          })
        } else if (this.currentType === this.typeMap['unit-plan']) {
          UnitPlanAddOrUpdate({
            name: this.createNewName
          }).then((response) => {
            this.$logger.info('UnitPlanAddOrUpdate response', response)
            this.loadMyContent()
          }).finally(() => {
            this.createNewNameMode = 'hide'
            this.createNewName = ''
          })
        } else if (this.currentType === this.typeMap.topic) {
          TopicAddOrUpdate({
            name: this.createNewName
          }).then((response) => {
            this.$logger.info('TopicAddOrUpdate response', response)
            this.loadMyContent()
          }).finally(() => {
            this.createNewNameMode = 'hide'
            this.createNewName = ''
          })
        }
      } else {
        this.$message.warn('Name is empty!')
      }
    },

    handleCancel () {
      this.$emit('cancel')
    },

    handleEnsure () {
      this.$logger.info('handleEnsure add group associate' + this.selectedGroup, this.groupNameList, this.mySelectedMap, this.groupName)
      if (!this.mySelectedMap.size) {
        this.$message.warn('No my content be selected!')
      } else if ((this.groupNameMode === 'select' && !this.selectedGroup)) {
        this.$message.warn('No group be selected!')
      } else if (this.groupNameMode === 'input' && !this.groupName) {
        this.$message.warn('group name is empty!')
      } else {
        // 开始关联数据
        const groupName = this.groupNameMode === 'input' ? this.groupName : (this.selectedGroup.length > 0 ? this.selectedGroup : '')
        const postData = {
          fromId: this.fromId,
          fromType: this.fromType,
          groupName: groupName,
          otherContents: []
        }

        for (const [id, item] of this.mySelectedMap) {
          this.$logger.info('ensure ' + id, item)
          postData.otherContents.push({
            toId: item.id,
            toType: item.type
          })
        }

        this.$logger.info('associate data', postData)
        Associate(postData).then((response) => {
          this.$message.success('Success!')
          this.$emit('ensure', postData)
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.ant-list-item {
  padding: 0;
  margin: 10px;
  position: relative;
  width: 200px;
}

.my-list-item {
  opacity: 1;
  margin: 0 0 15px 0;
  border-radius: 4px;
  background: #FFFFFF;
  padding: 12px 10px;
  width: 100%;
  border: 2px solid #fff;
}

.my-list-item:hover {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}

.active-item {
  border: 2px solid #15C39A;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}

.my-content {
  .filter-line {
    padding: 15px 0;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;

    .status-tab {
      cursor: pointer;

      .toggle-mode-type-wrapper {
        width: 280px;
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

            //.mode-item:first-child {
            //  border-bottom-left-radius: 35px;
            //  border-top-left-radius: 35px;
            //}
            //
            //.mode-item:last-child {
            //  border-bottom-right-radius: 35px;
            //  border-top-right-radius: 35px;
            //}

            .mode-item {
              padding: 0 8px;
              font-size: 12px;
              height: 40px;
              color: rgba(17, 20, 45, 1);
              border-radius: 40px;
              font-family: Inter-Bold;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 90px;
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
  }

  .created-type-filter {
    display: flex;
    justify-content: flex-end;
  }

  .display-type-toggle {
    display: flex;
    justify-content: flex-start;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;

    .display-type-item {
      cursor: pointer;
      user-select: none;
      padding-right: 5px;
      margin-right: 10px;
      font-family: Inter-Bold;
      font-weight: bold;
      color: #000;
    }

    .active-display-type {
      color: #15c39a;
      font-weight: bold;
    }
  }

  .create-new-action {
    display: flex;
    justify-content: flex-start;

    .create-action {
      cursor: pointer;
      display: inline-block;
      margin: 15px 15px 15px 0;
      border-radius: 20px;
      border: 1px solid #D8D8D8;
      padding: 5px 10px;
      font-family: Inter-Bold;
      color: #000;
    }

    .create-new-input {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      input {
        padding: 0 5px;
        outline: none;
        font-size: 14px;
        font-family: Inter-Bold;
        line-height: 30px;
        box-sizing: border-box;
        color: #000000;
        width: 400px;
        border: 1px solid #eee;
        background: #fff;
      }

      .create-new-icon {
        padding-left: 5px;
        cursor: pointer;
      }
    }
  }

  .content-wrapper {
    .content-list {
      .select-block {
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .select-block-icon {
          color: #ccc;
          font-size: 20px;
          cursor: pointer;
        }

        .selected-icon {
          img {
            width: 20px;
          }
        }
      }

      .content-info-left {
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .status-icon-item {
          font-size: 18px;
          width: 40px;
        }

        &:hover {
          color: @primary-color;
        }
      }

      .content-info-right {
        cursor: pointer;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .update-time {
          width: 140px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-family: Inter-Bold;
          font-size: 13px;
          color: #000000;
          opacity: 0.5;
        }

        .status {
          width: 80px;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #000000;
          opacity: 1;
          text-align: center;
        }
      }

      .action-icon {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        padding: 0 10px;
        width: 80px;
        box-sizing: border-box;

        img {
          height: 18px;
        }
      }

      .action {
        color: @primary-color;
        font-weight: 500;
      }

      .action-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        .action-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-right: 10px;
          user-select: none;

          .btn-text {
            padding: 0 5px;
          }

          .link-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            padding: 5px 15px;
            border-radius: 35px;
            border: 1px solid #BCBCBC;
            font-family: Inter-Bold;
            color: #182552;
            font-size: 13px;
            background: rgba(228, 228, 228, 0.2);
            transition: all 0.3s ease;

            .link-icon {
              margin-right: 5px;
              width: 15px;
            }
          }

          .link-item:hover {
            background: rgba(228, 228, 228, 0.5);
          }
        }

        .refer-item {
          .refer-btn {
            background: rgba(21, 195, 154, 0.1);
            border: 1px solid #15C39A;
            border-radius: 20px;
            color: #15C39A;
            padding: 10px 15px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
          }

          .btn-icon {
            height: 10px;
            width: 10px;
          }

          .btn-icon-white {
            display: none;
          }

          .btn-icon-color {
            display: inline-block;
          }

          .btn-text {
            padding-left: 8px;
          }
        }

        .refer-btn:hover {
          background: #07AB84;
          color: #fff;

          .btn-icon-white {
            display: inline-block;
          }

          .btn-icon-color {
            display: none;
          }
        }
      }

      .name-content {
        text-align: left;
        padding-left: 5px;
        display: inline-block;
        width: 360px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: Inter-Bold;
        color: #11142D;
      }
    }
  }
}

a.delete-action {
  color: @red-4;
}

.switch-icon {
  background: #FFFFFF;
  border: 1px solid #F7F8FF;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 6px;
  padding: 5px 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .icon-item {
    cursor: pointer;
    margin-left: 5px;
    margin-right: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;

    svg {
      width: 20px;
      color: rgba(24, 37, 82, 1);
    }
  }

  .active-icon {
    svg {
      color: rgba(21, 195, 154, 1);
    }
  }
}

.preview-wrapper {
  display: flex;
  flex-direction: row;
  width: 100%;

  .preview-wrapper-row {
    width: 100%;

    .view-back {
      .back-icon {
        text-align: center;

        img {
          width: 70px;
          cursor: pointer;
        }
      }
    }

    .detail-wrapper {
      background: #FFFFFF;
      border: 1px solid #ddd;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
      opacity: 1;
      border-radius: 10px;
    }
  }
}

.my-card-list-item {
  overflow: hidden;
  box-sizing: border-box;
  margin: 10px;
  width: 250px;
  position: relative;
  user-select: none;
  background: #FFFFFF;
  border: 1px solid #F7F8FF;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 6px;

  &:hover {
    background-size: 110%;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: 0 0 2px 1px @primary-color;
  }

  .cover-img-wrapper {
    border-radius: 6px;
    border: none;
    outline: none;

    .cover-image {
      border: none;
      outline: none;
      height: 150px;
      width: 250px;
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      border-bottom: 1px solid #eee;
      -webkit-transition: all 0.3s ease-in-out;
      transition: all 0.3s ease-in-out;
    }
  }

  .item-intro {
    padding: 10px;
    display: flex;
    flex-direction: column;

    .page-info {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      align-items: center;

      .page-num-tag {
        display: inline;
        background: rgba(228, 228, 228, 0.5);
        padding: 1px 10px;
        border-radius: 16px;
        font-size: 8px;
        font-family: Segoe UI;
        font-weight: 400;
        color: #808191;
      }
    }

    .main-title {
      padding: 5px 0;
      font-size: 14px;
      font-family: Inter-Bold;
      line-height: 24px;
      color: #000000;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sub-title {
      font-size: 8px;
      font-family: Segoe UI;
      font-weight: 400;
      color: #808191;
    }
  }

  .item-action-wrapper {
    padding: 5px 10px 15px 10px;

    .action-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .action-item {
        display: inline;
        margin-right: 10px;
        user-select: none;

        .link-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          padding: 5px 15px;
          border-radius: 35px;
          border: 1px solid #BCBCBC;
          font-family: Inter-Bold;
          color: #182552;
          font-size: 13px;
          background: rgba(228, 228, 228, 0.2);
          transition: all 0.3s ease;

          .link-icon {
            margin-right: 5px;
            width: 15px;
          }
        }

        .link-item:hover {
          background: rgba(228, 228, 228, 0.5);
        }
      }

      .refer-item {
        .refer-btn {
          background: rgba(21, 195, 154, 0.1);
          border: 1px solid #15C39A;
          border-radius: 20px;
          color: #15C39A;
          padding: 10px 15px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
        }

        .btn-icon {
          height: 10px;
          width: 10px;
        }

        .btn-icon-white {
          display: none;
        }

        .btn-icon-color {
          display: inline-block;
        }

        .btn-text {
          padding-left: 8px;
        }
      }

      .refer-btn:hover {
        background: #07AB84;
        color: #fff;

        .btn-icon-white {
          display: inline-block;
        }

        .btn-icon-color {
          display: none;
        }
      }
    }
  }

  .card-action-icon {
    position: absolute;
    bottom: 10px;
    right: 10px;

    img {
      height: 18px;
    }
  }
}

.choose-group {
  margin: 10px 0;

  .choose-label {
    padding-bottom: 10px;
    color: #000000;
    font-family: Inter-Bold;
  }
}

.group-label {
  margin-bottom: 15px;

  .choose-label {
    padding-bottom: 3px;
  }
}
</style>
