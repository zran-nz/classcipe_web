<template>
  <a-card>
    <div class="operator">
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
      <span slot="roles" slot-scope="roles">
        <span v-for="role in roles" :key="role.id">
          {{ role.name }}
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
                <a-popconfirm
                  title="Archived this group ?"
                  ok-text="Yes"
                  @confirm="handleArchived(item)"
                  cancel-text="No"
                >
                  <a> <a-icon type="delete" theme="filled" /> Archived </a>
                </a-popconfirm>
              </a-menu-item>
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

    <SchoolUserGroupAdd ref="modalForm" @ok="loadData" />
  </a-card>
</template>

<script>
import SchoolUserGroupAdd from './SchoolUserGroupAdd.vue'
import { getSchoolGroupList } from '@/api/schoolGroup'
import { schoolGroupType } from '@/const/schoolGroup'

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
    SchoolUserGroupAdd
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
      }
    }
  },
  created() {
    this.loadData()
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
    handleView() {},
    handleEdit(data) {},
    handleArchived() {},
    handleDelete(item) {}
  }
}
</script>

<style lang="less">
.ant-table-thead {
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
.table-action {
  display: flex;
  align-items: center;

  button.reject {
    color: red;
  }
}
</style>
