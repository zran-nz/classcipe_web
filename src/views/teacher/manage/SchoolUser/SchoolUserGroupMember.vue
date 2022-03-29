<template>
  <a-modal
    :title="title"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :footer="null"
  >
    <div>
      <a-row>
        <a-col :span="12">
          <a-auto-complete
            size="large"
            style="width: 100%; margin-bottom: 16px"
            placeholder="Search here to add member"
            option-label-prop="title"
            @focus="handleSearch"
            @search="handleSearch"
          >
            <template slot="dataSource">
              <a-select-option v-for="item in dataSource" :key="item.id" :title="item.userInfo.email">
                <div style="display: flex">
                  <div class="user-avatar">
                    <div class="avatar">
                      <img :src="item.userInfo.avatar" />
                    </div>
                  </div>
                  <div class="user-name-email">
                    <div class="user-name">
                      {{ item.userInfo.nickname }}
                    </div>
                    <div class="email">
                      {{ item.userInfo.email }}
                    </div>
                  </div>
                  <div class="action-wrapper">
                    <a-button type="link" @click="handleAdd(item.userInfo)"> Add </a-button>
                  </div>
                </div>
              </a-select-option>
            </template>
            <a-input>
              <a-icon slot="suffix" type="search" class="certain-category-icon" />
            </a-input>
          </a-auto-complete>
        </a-col>
      </a-row>
      <a-table
        :columns="columns"
        :data-source="memberList"
        :loading="loading"
        :pagination="pagination"
        @change="handleTableChange"
        :scroll="{ x: true }"
        rowKey="id"
      >
        <div slot="classes" slot-scope="classes" class="table-tag">
          <span v-for="clas in classes" :key="clas.id">
            {{ clas.name }}
          </span>
        </div>

        <span slot="action" slot-scope="item" class="table-action">
          <a-popconfirm title="Remove this teacher ?" ok-text="Yes" @confirm="handleRemove(item)" cancel-text="No">
            <a href="#">Remove</a>
          </a-popconfirm>
          <!-- <a-button type="primary" shape="round" @click="handleRemove(item)"> Remove </a-button> -->
          <!-- <div class="more-action-wrapper action-item-wrapper">
          <a-dropdown>
            <a-icon type="more" style="margin-right: 8px" />
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="Delete this group ?" ok-text="Yes" @confirm="handleDelete(item)" cancel-text="No">
                  <a> <a-icon type="delete" theme="filled" /> Delete </a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div> -->
          <!-- <a-divider type="vertical" /> -->
        </span>
      </a-table>
    </div>
  </a-modal>
</template>

<script>
import { addSchoolGroupMembers, getSchoolGroupMembers, removeSchoolGroupMembers } from '@/api/schoolGroup'
import { mapState } from 'vuex'

const columns = [
  {
    title: 'Teacher Name',
    dataIndex: 'userInfo',
    customRender: (text, row, index) => {
      return `${text.firstname} ${text.lastname}`
    },
    key: 'name'
  },
  {
    title: 'Class',
    dataIndex: 'classes',
    scopedSlots: { customRender: 'classes' },
    key: 'classes'
  },
  {
    title: 'Join at',
    dataIndex: 'schoolJoinDate',
    key: 'joinat'
  },
  {
    title: 'Action',
    key: 'action',
    // dataIndex: 'id',
    scopedSlots: { customRender: 'action' },
    width: '150px'
  }
]
export default {
  name: 'SchoolUserGroupMember',
  mixins: [],
  components: {},
  props: {
    teacherList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      title: '',
      width: 800,
      visible: false,
      confirmLoading: false,
      defaultData: {},
      groupId: undefined,
      columns,
      loading: false,
      pagination: {
        pageSize: 15,
        current: 1,
        pageSizeOptions: ['15', '30', '50'],
        showTotal: (total, range) => {
          return 'Total ' + total + ' items'
        },
        total: 0
      },
      dataSource: [],
      memberList: []
    }
  },
  created() {},
  watch: {
    defaultData(value) {
      if (value) {
        this.groupId = value.id
        this.title = 'Group: ' + value.name
        this.loadData()
      }
    }
  },
  computed: {
    ...mapState({
      info: state => state.user.info,
      currentSchool: state => state.user.currentSchool
    })
  },
  methods: {
    show() {
      this.visible = true
    },
    async loadData() {
      this.loading = true
      const res = await getSchoolGroupMembers({
        schoolId: this.currentSchool.id,
        groupId: this.groupId
      })
      this.memberList = res?.result || []
      this.loading = false
    },
    handleCancel() {
      this.visible = false
      this.confirmLoading = false
      this.$emit('ok')
    },
    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.loadData()
    },
    async handleRemove(item) {
      const res = await removeSchoolGroupMembers({
        schoolId: this.currentSchool.id,
        groupId: this.groupId,
        userId: item.id
      })
      if (res.success) {
        this.$message.success(res.message)
        this.loadData()
      } else {
        this.$message.warning(res.message)
      }
    },
    async handleAdd(item) {
      const res = await addSchoolGroupMembers({
        schoolId: this.currentSchool.id,
        groupId: this.groupId,
        userId: item.id
      })
      if (res.success) {
        this.$message.success(res.message)
        this.loadData()
      } else {
        this.$message.warning(res.message)
      }
    },
    handleSearch(value) {
      if (!value) {
        this.dataSource = this.teacherList
      } else {
        this.dataSource = this.teacherList.filter(item => item.userInfo.email.indexOf(value) > -1)
      }
    }
  }
}
</script>
<style lang="less">
.ant-select-dropdown {
  z-index: 9999;
}
</style>
<style lang="less" scoped>
.user-avatar {
  width: 50px;
  .avatar {
    img {
      height: 40px;
      border-radius: 40px;
    }
  }
}
.user-name-email {
  display: flex;
  flex-direction: column;
  width: 250px;
  line-height: 24px;
  font-family: Inter-Bold;
  color: #000000;
  display: flex;
  align-items: flex-start;
  .email {
    padding-left: 10px;
  }
  .user-name {
    text-align: center;
    font-family: Inter-Bold;
    line-height: 24px;
    padding-left: 15px;
    color: #000000;
  }
}
.table-tag {
  span {
    display: table;
    // border: 1px solid #15c39a;
    border-radius: 6px;
    margin: 4px;
    padding: 0px 4px;
  }
}
</style>
