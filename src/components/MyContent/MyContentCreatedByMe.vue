<template>
  <div class="my-content">
    <div class="filter-line">
      <div class="status-tab">
        <template v-if="selectedType === 'created-by-me'">
          <span :class="{'status-item': true, 'active-status-item': currentStatus === 'all-status'}" @click="toggleStatus('all-status', $t('teacher.my-content.all-status'))">
            {{ $t('teacher.my-content.all-status') }}
          </span>
          <a-divider type="vertical" />
          <span :class="{'status-item': true, 'active-status-item': currentStatus === 'published'}" @click="toggleStatus('published', $t('teacher.my-content.published-status'))">
            {{ $t('teacher.my-content.published-status') }}
          </span>
          <a-divider type="vertical" />
          <span :class="{'status-item': true, 'active-status-item': currentStatus === 'draft'}" @click="toggleStatus('draft', $t('teacher.my-content.draft-status'))">
            {{ $t('teacher.my-content.draft-status') }}
          </span>
        </template>
      </div>
      <div class="type-owner">
        <a-space>
          <div class="type-filter">
            <a-dropdown v-show="filterTypeList.length">
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                {{ currentTypeLabel }} <a-icon type="down" />
              </a>
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
                <a-menu-item @click="toggleType('assessment', $t('teacher.my-content.assessment-type'))" v-if="filterTypeList.indexOf('assessment') !== -1">
                  <span>{{ $t('teacher.my-content.assessment-type') }}</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </a-space>
      </div>
    </div>
    <div class="content-wrapper">
      <a-skeleton :loading="skeletonLoading" active>
        <div class="content-list">
          <a-list size="large" :pagination="pagination" :data-source="myContentList" :loading="loading">
            <a-list-item slot="renderItem" key="item.key" slot-scope="item" :class="{'active-item': selectedList.indexOf(item.type + '-' + item.id) !== -1}" @click="handleToggleSelect(item)">

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
                <div class="action" >
                  <div slot="actions" v-show="mode === 'link'">
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
        width="900px"
        :visible="previewVisible"
        @close="handlePreviewClose"
      >
        <div class="preview-wrapper">
          <div class="preview-detail">
            <unit-plan-preview :unit-plan-id="previewCurrentId" :show-associate="true" v-if="previewType === typeMap['unit-plan']" />
            <material-preview :material-id="previewCurrentId" :show-associate="true" v-if="previewType === typeMap.material" />
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

export default {
  name: 'MyContentCreatedByMe',
  components: {
    ContentStatusIcon,
    ContentTypeIcon,
    UnitPlanPreview,
    MaterialPreview
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
      default: 'link'
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
          &:hover {
            color: @primary-color;
          }
        }
      }

      .action {
        width: 80px;
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
        }
      }

      .name-content {
        text-align: left;
        display: inline-block;
        max-width: 450px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}

a.delete-action {
  color: @red-4;
}
</style>
