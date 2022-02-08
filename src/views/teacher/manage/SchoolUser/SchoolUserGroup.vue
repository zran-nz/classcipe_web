<template>
  <a-card>
    <div class="operator">
      <div></div>
      <!-- <a-input-search style="width: 300px" placeholder="Search for Group Name" enter-button @search="handleSearch" /> -->
      <a-button @click="handleAdd" type="primary" icon="plus">Add</a-button>
      <!-- <a-button type="primary" icon="download" @click="downloadTemplate">Download template</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false">
        <a-button type="primary" icon="import">Upload</a-button>
      </a-upload> -->
    </div>

    <a-table
      :columns="columns"
      :data-source="groupList"
      :loading="loading"
      :pagination="pagination"
      @change="handleTableChange"
      :scroll="{ x: true }"
      rowKey="id"
    >
      <span slot="advisor" slot-scope="advisor" class="table-tag">
        <span v-for="adv in advisor" :key="adv.id">
          {{ adv.email }}
        </span>
      </span>

      <span slot="action" slot-scope="item" class="table-action">
        <a-button type="primary" shape="round" @click="handleView(item)"> View </a-button>
        <a-button type="primary" shape="round" @click="handleEdit(item)" icon="edit"> Edit </a-button>

        <div class="more-action-wrapper action-item-wrapper">
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
        </div>
        <!-- <a-divider type="vertical" /> -->
      </span>
    </a-table>

    <SchoolUserGroupAdd ref="modalForm" @ok="loadData" :teacherList="teacherList" />
    <SchoolUserGroupMember ref="modalMemberForm" @ok="loadData" :teacherList="teacherList" />
  </a-card>
</template>

<script>
import SchoolUserGroupAdd from './SchoolUserGroupAdd.vue'
import SchoolUserGroupMember from './SchoolUserGroupMember.vue'
import { getSchoolGroupList } from '@/api/schoolGroup'
import { schoolGroupType } from '@/const/schoolGroup'
import { getSchoolUsers } from '@/api/schoolUser'
import store from '@/store'
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Members',
    dataIndex: 'memberCount',
    key: 'members'
  },
  {
    title: 'Group type',
    dataIndex: 'groupType',
    customRender: (text, row, index) => {
      return schoolGroupType.find(item => item.id === text)?.name
    },
    key: 'groupType'
  },
  {
    title: 'Advisor',
    dataIndex: 'advisor',
    scopedSlots: { customRender: 'advisor' },
    key: 'advisor'
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
  name: 'SchoolUserGroup',
  mixins: [],
  components: {
    SchoolUserGroupAdd,
    SchoolUserGroupMember
  },
  data() {
    return {
      groupList: [],
      columns,
      loading: false,
      pagination: {
        pageSize: 20,
        current: 1,
        total: 0
      },
      teacherList: []
    }
  },
  created() {
    this.loadData()
    this.loadTeacherList()
  },
  computed: {},
  methods: {
    async loadData() {
      this.loading = true
      const res = await getSchoolGroupList({
        schoolId: store.getters.userInfo.school
      })
      this.groupList = res?.result?.records || []
      this.loading = false
    },
    async loadTeacherList() {
      const res = await getSchoolUsers({
        school: store.getters.userInfo.school,
        currentRole: 'teacher',
        pageSize: 1000,
        userStatus: '1'
      })
      this.teacherList = res?.result?.records || []
    },
    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.loadData()
    },
    handleAdd: function() {
      this.$refs.modalForm.title = 'Add Group'
      this.$refs.modalForm.mode = 'add'
      this.$refs.modalForm.defaultData = {}
      this.$refs.modalForm.show()
    },
    handleView(data) {
      console.log(data)
      this.$refs.modalMemberForm.title = ''
      this.$refs.modalMemberForm.defaultData = data
      this.$refs.modalMemberForm.show()
    },
    handleEdit(data) {
      console.log(data)
      this.$refs.modalForm.title = 'Edit Group'
      this.$refs.modalForm.mode = 'edit'
      this.$refs.modalForm.defaultData = data
      this.$refs.modalForm.show()
    },
    async handleSearch(name) {
      const pager = { ...this.pagination }
      pager.current = 1
      this.pagination = pager
      this.loading = true
      const res = await getSchoolGroupList({
        schoolId: store.getters.userInfo.school,
        name: name
      })
      this.groupList = res?.result?.records || []
      this.loading = false
    },
    handleDelete(item) {}
  }
}
</script>

<style lang="less">
.ant-table-thead,
.ant-table-tbody {
  white-space: nowrap;
}
</style>
<style lang="less" scoped>
.operator {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  .status-select {
    a {
      color: #11142d;
    }
    span {
      padding: 8px 16px;
      cursor: pointer;
    }
    .active {
      color: #15c39a;
    }
  }
  .upload-wrapper {
    button {
      margin-right: 8px;
    }
  }
}
.search-box {
  margin-bottom: 16px;
  .search-box-btn {
    margin-top: 4px;
    text-align: center;
    button {
      margin: 0px 8px;
    }
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
.table-action {
  display: flex;
  align-items: center;

  button.reject {
    color: red;
  }
}
</style>
