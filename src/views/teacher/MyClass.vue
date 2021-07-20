<template>
  <a-card :bordered="false" ref="card">

    <a-row class="class-header">
      <a-col span="12">
        <a-space>
          <a-button class="nav-back-btn" type="link" @click="$router.go(-1)">
            <a-icon type="left" />
            {{ $t('teacher.add-unit-plan.back') }}
          </a-button>
        </a-space>
      </a-col>
    </a-row>
    <a-skeleton :loading="skeletonLoading" active>
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        rowKey="id">

        <span slot="date" slot-scope="date"> {{ date | formatDate }}</span>

        <span slot="status" slot-scope="status">
          {{ status }}
          <!--        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />-->
        </span>

        <span slot="action" slot-scope="text, record">
          <a @click="handleProject(record)"><a-icon type="select" /></a>
          <a-divider type="vertical" />
          <a @click="handleOpenDashboard(record)"><a-icon type="layout" /></a>
          <a-divider type="vertical" />
          <template v-if="record.status === 'live'">
            <a-dropdown>
              <a-icon type="more" />
              <a-menu slot="overlay">
                <a-menu-item>
                  <a @click="handleTurnOnStudentPaced(record)">
                    <a-icon type="usergroup-add" /> Turn On Student Paced
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="handleEndSession(record)">
                    <a-icon type="poweroff" /> End Session
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="handleShowNameSessionModal(record)">
                    <a-icon type="edit" /> Name This Session
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
          <template v-else>
            <a-dropdown>
              <a-icon type="more" />
              <a-menu slot="overlay">
                <a-menu-item>
                  <a @click="handleReopenSession(record)">
                    <a-icon type="sync" /> Reopen Session
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="handleShowNameSessionModal(record)">
                    <a-icon type="edit" /> Name This Session
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </span>
      </a-table>
    </a-skeleton>

    <div class="loading-status">
      <a-spin v-if="loading && !skeletonLoading"/>
      <span v-if="loadFinished">All data loaded~</span>
    </div>
    <a-modal
      :closable="false"
      v-model="showNameSessionModal"
      title="Name This Session"
      ok-text="ensure"
      cancel-text="cancel"
      @ok="handleEnsureNameSession(nameSessionRecord)"
      @cancel="handleCancelNameSession">
      <a-input placeholder="Please input new session name" allow-clear v-model="nameSessionRecord.class_name"/>
    </a-modal>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import { endSession, getMyClasses, nameSession, reopenSession, turnOnStudentPaced } from '@/api/lesson'
import * as logger from '@/utils/logger'

const columns = [
  {
    title: 'Date',
    dataIndex: 'date',
    scopedSlots: { customRender: 'date' }
  },
  {
    title: 'Status',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: 'Class name',
    dataIndex: 'class_name'
  },
  {
    title: 'Type',
    dataIndex: 'type'
  },
  {
    title: 'File name',
    dataIndex: 'file_name'
  },
  {
    title: 'Action',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' }
  }
]

const statusMap = {
  'live': {
    status: 'success',
    text: 'Live'
  },
  'student-paced': {
    status: 'processing',
    text: 'Student-paced '
  },
  'close': {
    status: 'default',
    text: 'Close'
  }
}

export default {
  name: 'Class',
  components: {
    STable,
    Ellipsis,
    PageHeaderWrapper
  },
  data () {
    return {
      columns: columns,
      data: [],
      loading: true,
      selectedRowKeys: [],
      selectedRows: [],

      showNameSessionModal: false,
      nameSessionRecord: {
        class_id: '',
        class_name: ''
      },

      skeletonLoading: true,
      loadFailed: false,
      cursor: 0,
      currentPage: 0,
      pageSize: 50,
      total: 0
    }
  },
  computed: {
    loadFinished: function () {
      return !this.loading && this.total === this.data.length
    }
  },
  created () {
    this.loadTeacherClasses(this.pageSize, this.cursor, this.$route.query.slideId)
  },
  mounted () {
    window.addEventListener('scroll', this.loadTeacherClassesOnScroll, true)
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  methods: {
    loadTeacherClasses (limit, cursor, slideId) {
      logger.info('loadTeacherClasses ' + ' limit:' + limit + 'cursor:' + cursor + ' slideId:' + slideId)
      this.loading = true
      getMyClasses({ limit, cursor, slideId }).then(response => {
        logger.info('getMyClasses', response.data)
        if (response.data.records) {
          response.data.records.forEach((item) => {
            item.date = item.date * 1000
          })
          if (limit && cursor) {
            this.data = this.data.concat(response.data.records)
          } else {
            this.data = response.data.records
          }
        }
        this.total = response.data.total
        logger.info('cursor ' + cursor + ' data', this.data)
        this.loading = false
      }).finally(() => {
        this.skeletonLoading = false
      })
    },

    loadTeacherClassesOnScroll () {
      const rect = this.$refs.card.$el.getBoundingClientRect()
      const scrollOffsetY = rect.y
      const rectHeight = rect.height
      const clientHeight = document.documentElement.clientHeight

      if ((clientHeight) >= (scrollOffsetY + rectHeight) && !this.loading) {
        logger.info('到达底部')
        if (this.data.length === this.total) {
          logger.info('数据全部加载完')
        } else {
          this.loadTeacherClasses(this.pageSize, this.data.length ? this.data[this.data.length - 1].id : undefined)
        }
      }
    },
    handleProject (record) {
      logger.info('handleProject', record)
      window.open(record.class_link_for_teacher)
    },

    handleOpenDashboard (record) {
      logger.info('handleOpenDashboard', record)
      window.open(record.dashboard_link)
    },

    handleEndSession (record) {
      logger.info('handleEndSession', record)
      endSession({ class_id: record.class_id }).then(response => {
        this.loadTeacherClasses(this.data.length)
      })
    },

    handleShowNameSessionModal (record) {
      this.showNameSessionModal = true
      this.nameSessionRecord.class_id = record.class_id
      this.nameSessionRecord.class_name = record.class_name
    },

    handleEnsureNameSession (record) {
      logger.info('handleEnsureNameSession', record)
      nameSession({ class_id: record.class_id, class_name: this.nameSessionRecord.class_name }).then(response => {
        this.showNameSessionModal = false
        this.nameSessionRecord.class_name = ''
        this.nameSessionRecord.class_id = ''
        this.loadTeacherClasses(this.data.length)
        this.$message.success('name session success!')
      })
    },

    handleCancelNameSession () {
      this.showNameSessionModal = false
      this.nameSessionRecord.class_name = ''
      this.nameSessionRecord.class_id = ''
    },

    handleTurnOnStudentPaced (record) {
      logger.info('handleTurnOnStudentPaced', record)
      turnOnStudentPaced({ class_id: record.class_id }).then(response => {
        this.loadTeacherClasses(this.data.length)
      })
    },

    handleReopenSession (record) {
      logger.info('handleReopenSession', record)
      reopenSession({ class_id: record.class_id }).then(response => {
        this.loadTeacherClasses(this.data.length)
      })
    }
  }
}
</script>

<style lang="less" scoped>

.class-header {
  padding-bottom: 16px;
  border-bottom: 1px solid rgb(235, 238, 240);

  .nav-back-btn {
    padding-left: 0;
  }
}

.loading-status {
  display: flex;
  justify-content: center;
  padding: 30px 0 10px 0;

  span {
    color: #aaa;
  }
}
</style>
