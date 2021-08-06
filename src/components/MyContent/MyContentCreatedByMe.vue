<template>
  <div class="my-content">
    <div class="filter-line">
      <div class="status-tab">
        <div class="toggle-mode-type-wrapper" v-if="selectedType === 'created-by-me'">
          <div class="toggle-mode-type">
            <div class="toggle-mode">
              <div :class="{'mode-item': true, 'skill-active-mode' : currentStatus === 'all-status'}" @click="toggleStatus('all-status', $t('teacher.my-content.all-status'))">
                {{ $t('teacher.my-content.all-status') }}
              </div>
              <div :class="{'mode-item': true, 'knowledge-active-mode' : currentStatus === 'published'}" @click="toggleStatus('published', $t('teacher.my-content.published-status'))">
                {{ $t('teacher.my-content.published-status') }}
              </div>
              <div :class="{'mode-item': true, 'general-active-mode' : currentStatus === 'draft'}" @click="toggleStatus('draft', $t('teacher.my-content.draft-status'))">
                {{ $t('teacher.my-content.draft-status') }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="type-owner">
        <a-space>
          <div class="type-filter">
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item disabled>
                  <span>{{ $t('teacher.my-content.choose-types-of-content') }}</span>
                </a-menu-item>
                <a-menu-item @click="toggleType('all-type', $t('teacher.my-content.all-type'))" v-if="filterTypeList.length === 6">
                  <span>{{ $t('teacher.my-content.all-type') }}</span>
                </a-menu-item>
                <a-menu-item @click="toggleType('topic', $t('teacher.my-content.topics-type') )" v-if="filterTypeList.indexOf('topic') !== -1">
                  <span>{{ $t('teacher.my-content.topics-type') }}</span>
                </a-menu-item>
                <a-menu-item @click="toggleType('material', $t('teacher.my-content.materials-type'))" v-if="filterTypeList.indexOf('material') !== -1">
                  <span>{{ $t('teacher.my-content.materials-type') }}</span>
                </a-menu-item>
                <a-menu-item @click="toggleType('unit-plan', $t('teacher.my-content.unit-plan-type'))" v-if="filterTypeList.indexOf('unit-plan') !== -1">
                  <span>{{ $t('teacher.my-content.unit-plan-type') }}</span>
                </a-menu-item>
                <a-menu-item @click="toggleType('task', $t('teacher.my-content.tasks-type') )" v-if="filterTypeList.indexOf('task') !== -1">
                  <span>{{ $t('teacher.my-content.tasks-type') }}</span>
                </a-menu-item>
                <a-menu-item @click="toggleType('lesson', $t('teacher.my-content.lesson-type'))" v-if="filterTypeList.indexOf('lesson') !== -1">
                  <span>{{ $t('teacher.my-content.lesson-type') }}</span>
                </a-menu-item>
                <a-menu-item @click="toggleType('evaluation', $t('teacher.my-content.evaluation-type'))" v-if="filterTypeList.indexOf('evaluation') !== -1">
                  <span>{{ $t('teacher.my-content.evaluation-type') }}</span>
                </a-menu-item>
              </a-menu>
              <a-button
                style="padding: 0 20px;display:flex; box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);align-items:center ;height: 40px;border-radius: 6px;background: #FFFFFF;border: 1px solid #eee;font-family: Inter-Bold;color: #182552;"> Choose type(s)of content <a-icon type="caret-down" /> </a-button>
            </a-dropdown>
          </div>
        </a-space>
      </div>
    </div>
    <div class="content-wrapper">
      <a-skeleton :loading="skeletonLoading" active>
        <div class="content-list">
          <a-list size="large" :pagination="pagination" :data-source="myContentList" :loading="loading">
            <a-list-item slot="renderItem" key="item.key" slot-scope="item" :class="{'my-list-item': true, 'active-item': selectedList.indexOf(item.type + '-' + item.id) !== -1}" @click="handleToggleSelect(item)">

              <span class="content-info-left" @click="handleViewDetail(item, $event)">
                <content-type-icon :type="item.type" />

                <span class="name-content">
                  {{ item.name }}
                </span>
              </span>

              <span class="content-info-right">
                <span class="update-time" >
                  {{ item.updateTime || item.createTime | dayjs }}
                </span>
                <span class="status">
                  <template v-if="item.status === 0">Draft</template>
                  <template v-if="item.status === 1">Published</template>
                </span>
                <div class="action" >
                  <div slot="actions" v-show="mode === displayMode.Link">
                    <div class="action-wrapper">
                      <div class="action-item">
                        <a-popconfirm :title="'Link this content to my Unit' + '?'" ok-text="Yes" @confirm="handleLinkItem(item, $event)" cancel-text="No">
                          <span>
                            <a-icon type="form" /> Link
                          </span>
                        </a-popconfirm>
                      </div>
                    </div>
                  </div>
                  <div slot="actions" v-show="mode === displayMode.Evaluatioin">
                    <div class="action-wrapper">
                      <div class="action-item">
                        <a-popconfirm :title="'Link ?'" ok-text="Yes" @confirm="handleLinkItem(item, $event)" cancel-text="No">
                          <div class="link-item">
                            <img src="~@/assets/icons/myContent/link-icon.png" class="link-icon"/>
                            {{ 'Link this evaluation to this ' + (item.type === typeMap.task ? 'task' : (item.type === typeMap.lesson ? 'lesson' : '')) }}
                          </div>
                        </a-popconfirm>
                      </div>
                    </div>
                  </div>
                </div>
              </span>
            </a-list-item>
          </a-list>
        </div>
      </a-skeleton>

      <a-drawer
        destroyOnClose
        placement="right"
        closable
        width="800px"
        :visible="previewVisible"
        @close="handlePreviewClose"
      >
        <div class="preview-wrapper">
          <div class="preview-detail" v-if="previewCurrentId && previewType">
            <common-preview :id="previewCurrentId" :type="previewType" />
          </div>
        </div>
      </a-drawer>
    </div>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import UnitPlanPreview from '@/components/UnitPlan/UnitPlanPreview'
import MaterialPreview from '@/components/Material/MaterialPreview'
import { getMyContent } from '@/api/teacher'
import { FavoritesGetMyFavorites } from '@/api/favorites'
import { ownerMap, statusMap, typeMap, getLabelNameType } from '@/const/teacher'
import ContentStatusIcon from '@/components/Teacher/ContentStatusIcon'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import { MyContentEventBus, MyContentEvent } from '@/components/MyContent/MyContentEventBus'
import DisplayMode from '@/components/MyContent/DisplayMode'
import CommonPreview from '@/components/Common/CommonPreview'
import NoMoreResources from '@/components/Common/NoMoreResources'

export default {
  name: 'MyContentCreatedByMe',
  components: {
    CommonPreview,
    ContentStatusIcon,
    ContentTypeIcon,
    UnitPlanPreview,
    MaterialPreview,
    NoMoreResources
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
      currentType: 'all-type',
      currentTypeLabel: this.$t('teacher.my-content.all-type'),
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
        pageSize: 8
      },
      pageNo: 1,

      typeMap: typeMap
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
    }
  },
  created () {
    logger.info('teacher my content filter type ', this.filterTypeList)
    if (this.filterTypeList) {
      this.currentType = this.filterTypeList[0]
      this.currentTypeLabel = getLabelNameType(this.typeMap[this.filterTypeList[0]])
    }
    this.$logger.info('currentType ' + this.currentType + ' , currentTypeLabel ' + this.currentTypeLabel + ', selected type ' + this.selectedType)
    this.loadMyContent()
  },
  mounted () {
  },
  methods: {
    loadMyContent () {
      this.loading = true
      if (this.selectedType === 'created-by-me') {
        this.getMyContent()
      } else if (this.selectedType === 'my-favorite') {
        this.getMyFavorites()
      } else if (this.selectedType === 'shared') {
        this.loading = false
        this.skeletonLoading = false
        this.$logger.info('shared coming soon!')
      }
    },

    getMyContent () {
      getMyContent({
        owner: ownerMap[this.currentOwner],
        status: statusMap[this.currentStatus],
        type: typeMap[this.currentType],
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize
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
        type: typeMap[this.currentType],
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
      MyContentEventBus.$emit(MyContentEvent.LinkToMyContentItem, { item })
    },
    handleViewDetail (item, event) {
      logger.info('handleViewDetail', item)
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

.active-item {
  background-color: fade(@outline-color, 20%);
  color: @primary-color;
}

.my-list-item {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 4px;
  background: #FFFFFF;
  padding: 12px 10px;
  margin-bottom: 15px;
}
.my-content {
  padding: 0 15px 25px 15px;
  .filter-line {
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    .status-tab {
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

    .type-owner {
    }
  }

  .content-wrapper {
    .content-list {
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

      .action {
        color: @primary-color;
        font-weight: 500;
      }

      .action-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        .action-item {
          display: inline;
          margin-left: 20px;
          user-select: none;
          .link-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            height: 35px;
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
      }

      .name-content {
        text-align: left;
        padding-left: 5px;
        display: inline-block;
        max-width: 450px;
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
</style>
