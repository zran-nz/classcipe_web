<template>
  <div class="my-content">
    <div class="filter-line">
      <div class="status-tab">
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
      </div>
      <div class="type-owner">
        <a-space>
          <div class="type-filter">
            <a-dropdown>
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                {{ currentTypeLabel }} <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item @click="toggleType('all-type', $t('teacher.my-content.all-type'))">
                  <span>{{ $t('teacher.my-content.all-type') }}</span>
                </a-menu-item>
                <a-menu-item @click="toggleType('topic', $t('teacher.my-content.topics-type') )">
                  <span>{{ $t('teacher.my-content.topics-type') }}</span>
                </a-menu-item>
                <a-menu-item @click="toggleType('material', $t('teacher.my-content.materials-type'))">
                  <span>{{ $t('teacher.my-content.materials-type') }}</span>
                </a-menu-item>
                <a-menu-item @click="toggleType('unit-plan', $t('teacher.my-content.unit-plan-type'))">
                  <span>{{ $t('teacher.my-content.unit-plan-type') }}</span>
                </a-menu-item>
                <a-menu-item @click="toggleType('task', $t('teacher.my-content.tasks-type') )">
                  <span>{{ $t('teacher.my-content.tasks-type') }}</span>
                </a-menu-item>
                <a-menu-item @click="toggleType('lesson', $t('teacher.my-content.lesson-type'))">
                  <span>{{ $t('teacher.my-content.lesson-type') }}</span>
                </a-menu-item>
                <a-menu-item @click="toggleType('assessment', $t('teacher.my-content.assessment-type'))">
                  <span>{{ $t('teacher.my-content.assessment-type') }}</span>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
          <a-divider type="vertical" />
          <div class="owner-filter">
            <a-dropdown>
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                {{ currentOwnerLabel }} <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item @click.native="toggleOwner('all-owner', $t('teacher.my-content.all-owner') )">
                  <span>{{ $t('teacher.my-content.all-owner') }}</span>
                </a-menu-item>
                <a-menu-item @click="toggleOwner('owner-by-me', $t('teacher.my-content.owner-by-me') )">
                  <span>{{ $t('teacher.my-content.owner-by-me') }}</span>
                </a-menu-item>
                <a-menu-item @click="toggleOwner('owner-by-others', $t('teacher.my-content.owner-by-others'))">
                  <span>{{ $t('teacher.my-content.owner-by-others') }}</span>
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
            <a-list-item slot="renderItem" key="item.key" slot-scope="item">

              <span class="content-info-left" @click="handleViewDetail(item)">
                <content-type-icon :type="item.type" />

                <span class="name-content">
                  {{ item.name }}
                </span>
                <content-status-icon :status="item.status" />
              </span>

              <span class="content-info-right">
                <span class="owner">
                  {{ item.createBy === $store.getters.email ? 'me' : item.createBy }}
                </span>
                <span class="update-time" >
                  {{ item.updateTime }}
                </span>
                <div class="action">
                  <a slot="actions">
                    <a-dropdown>
                      <a-icon type="more" style="margin-right: 8px" />
                      <a-menu slot="overlay">
                        <a-menu-item>
                          <a @click="handleEditItem(item)">
                            <a-icon type="form" /> {{ $t('teacher.my-content.action-edit') }}
                          </a>
                        </a-menu-item>
                        <a-menu-item>
                          <a @click="handleDeleteItem(item)" class="delete-action">
                            <a-icon type="delete" /> {{ $t('teacher.my-content.action-delete') }}
                          </a>
                        </a-menu-item>
                      </a-menu>
                    </a-dropdown>
                  </a>
                </div>
              </span>

            </a-list-item>
          </a-list>
        </div>
      </a-skeleton>
    </div>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { deleteMyContentByType, getMyContent } from '@/api/teacher'
import { ownerMap, statusMap, typeMap } from '@/const/teacher'
import ContentStatusIcon from '@/components/Teacher/ContentStatusIcon'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'

export default {
  name: 'MyContent',
  components: {
    ContentStatusIcon,
    ContentTypeIcon
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

      pagination: {
        onChange: page => {
          logger.info('pagination onChange', page)
          this.pageNo = page
          this.loadMyContent()
        },
        showTotal: total => `Total ${total} items`,
        total: 0,
        pageSize: 15
      },
      pageNo: 1
    }
  },
  computed: {
  },
  created () {
    logger.info('teacher my content')
    this.loadMyContent()
  },
  mounted () {
  },
  methods: {
    loadMyContent () {
      this.loading = true
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
        }
        logger.info('myContentList', this.myContentList)
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
    },
    handleDeleteItem (item) {
      logger.info('handleDeleteItem', item)
      deleteMyContentByType(item).then(res => {
        logger.info('DeleteMyContentByType', res)
      })
    },
    handleViewDetail (item) {
      logger.info('handleViewDetail', item)
      if (item.type === typeMap['unit-plan']) {
        this.$router.push({
          path: '/teacher/unit-plan/' + item.id
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
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
          width: 30px;
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

        .owner {
          width: 200px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:hover {
            color: @primary-color;
          }
        }

        .update-time {
          width: 200px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:hover {
            color: @primary-color;
          }
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
  color: @red-6;
}
</style>
