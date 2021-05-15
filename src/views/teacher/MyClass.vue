<template>
  <a-card :bordered="false">
    <a-table :columns="columns" :data-source="data" :loading="loading" :pagination="{pageSize: pageSize, current: current + 1, total: 10}" @change="pageChange">

      <span slot="date" slot-scope="text"> {{ text | localFormatDate }}</span>

      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
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

      current: 0,
      cursor: 0,
      pageSize: 10
    }
  },
  computed: {
  },
  created () {
    this.loadTeacherClasses()
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
    loadTeacherClasses (cursor) {
      logger.info('loadTeacherClasses ' + ' ' + cursor + ' ' + cursor)
      this.loading = true
      getMyClasses({ limit: this.pageSize, cursor }).then(response => {
          logger.info('getMyClasses', response.data)
          let cursor
          response.data.forEach((item, index) => {
            item.key = index
            item.date = item.date * 1000
            if (!cursor || item.id < cursor) {
              cursor = item.id
            }
          })
          this.cursor = cursor
          this.data = response.data
          logger.info('cursor ' + cursor + ' data', this.data)
          this.loading = false
      })
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
        this.loadTeacherClasses(this.cursor)
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
        this.loadTeacherClasses(this.cursor)
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
        this.loadTeacherClasses(this.cursor)
      })
    },

    handleReopenSession (record) {
      logger.info('handleReopenSession', record)
      reopenSession({ class_id: record.class_id }).then(response => {
        this.loadTeacherClasses(this.cursor)
      })
    },

    pageChange (pagination) {
      logger.info('pageChange target page ' + pagination.current)
      if (pagination.current === 1) {
        this.loadTeacherClasses()
      } else if (pagination.current > 1) {
        this.loadTeacherClasses(this.data[this.pageSize * (pagination.current - 1)])
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
