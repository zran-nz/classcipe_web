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
      <div class="content-list">
        <a-table
          :columns="columns"
          :data-source="myContentList"
          :pagination="false"
          rowKey="key">

          <span slot="name" slot-scope="name, record">
            <content-type-icon :type="record.type" />
            {{ name }}
            <span class="status-icon record-icon">
              {{ record.status }}
            </span>
          </span>

          <span slot="status" slot-scope="status">
            <content-status-icon :status="status" />
          </span>

          <span slot="updateTime" slot-scope="updateTime">
            <template v-if="updateTime">
              {{ updateTime | formatDate }}
            </template>
          </span>
          <span slot="createBy" slot-scope="createBy"> {{ createBy === $store.getters.email ? 'me' : createBy }}</span>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { getMyContent } from '@/api/teacher'
import { ownerMap, statusMap, typeMap } from '@/const/teacher'
import ContentStatusIcon from '@/components/Teacher/ContentStatusIcon'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 450,
    ellipsis: true,
    scopedSlots: { customRender: 'name' }
  },
  {
    title: 'Status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: 'CreateBy',
    dataIndex: 'createBy',
    width: 200,
    scopedSlots: { customRender: 'createBy' }
  },
  {
    title: 'Update Time',
    dataIndex: 'updateTime',
    width: 200,
    scopedSlots: { customRender: 'updateTime' }
  }
]

export default {
  name: 'MyContent',
  components: {
    ContentStatusIcon,
    ContentTypeIcon
  },
  data () {
    return {
      columns: columns,
      loading: true,
      loadFailed: false,
      myContentList: [],
      currentStatus: 'all-status',
      currentStatusLabel: this.$t('teacher.my-content.all-status'),
      currentType: 'all-type',
      currentTypeLabel: this.$t('teacher.my-content.all-type'),
      currentOwner: 'all-owner',
      currentOwnerLabel: this.$t('teacher.my-content.all-owner'),

      pageNo: 0,
      pageSize: 15
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
      getMyContent({
        owner: ownerMap[this.currentOwner],
        status: statusMap[this.currentStatus],
        type: typeMap[this.currentType],
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }).then(res => {
        logger.info('getMyContent', res)
        if (res.result && res.result.records && res.result.records.length) {
          res.result.records.forEach((record, index) => {
            record.key = index
          })
          this.myContentList = res.result.records
        } else {
          this.myContentList = []
        }
        logger.info('myContentList', this.myContentList)
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
      color: @btn-default-color;
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
}
</style>
