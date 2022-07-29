<template>
  <div>
    <a-table
      ref="table"
      :rowKey="item => item.key"
      :columns="tableColumns"
      :dataSource="dataSource"
      :loading="loading"
      :rowSelection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps: getCheckboxProps
      }"
    >
      <template
        v-for="col in ['firstName', 'lastName', 'inviteEmail', 'parentEmail']"
        :slot="col"
        slot-scope="text, record"
      >
        <div :key="col" :id="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChangeRow(e.target.value, record.key, col)"
          />
          <template v-else>
            {{ text }} {{ record.editable }}
          </template>
        </div>
      </template>
      <template
        slot="classes"
        slot-scope="text, record"
      >
        <div>
          <a-select
            v-if="record.editable"
            style="margin: -5px 0; width: 170px;"
            :value="text"
            @change="value => handleChangeRow(value, record.key, 'classes')"
          >
            <a-select-option
              v-for="(param) in tableOptions['classes']"
              :value="param.value"
              :key="'options_'+ 'classes' + param.value"
            >
              {{ param.label }}
            </a-select-option>
          </a-select>
          <template v-else>
            {{ formatOption(text, tableOptions['classes']) }}
          </template>
        </div>
      </template>
      <a-space slot="action" slot-scope="text, record">
        <span v-if="record.editable">
          <a @click="() => saveRow(record.key)">Save</a>
          <a-divider type="vertical"/>
          <a @click="() => cancelRow(record.key)">Cancel</a>
        </span>
        <template v-else>
          <a-icon type="check" :class="'status_1'" v-if="!record.status"></a-icon>
          <label for="" :class="'status_2'" v-else>{{ record.status }}</label>
          <a-icon v-show="editingKey === ''" @click="() => editRow(record.key)" class="action-edit" type="edit"></a-icon>
          <a-icon v-show="editingKey === ''" @click="() => delRow(record.key)" class="action-edit" type="delete"></a-icon>
        </template>
      </a-space>
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'SchoolUserUpload',
  props: {
    datas: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    verify: {
      type: Function,
      default: (item) => ''
    },
    verifyDuplicate: {
      type: Function,
      default: () => Promise.resolve([])
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    datas: {
      handler(next, prev) {
        if (next !== prev) {
          this.dataSource = [ ...next ]
          this.cachedData = this.dataSource.map(item => ({ ...item }))
          this.editingKey = ''
          this.initData()
        }
      },
      immediate: true,
      deep: true
    },
    columns: {
      handler(val) {
        this.tableColumns = [ ...val ]
      },
      immediate: true,
      deep: true
    },
    options: {
      handler(val) {
        this.tableOptions = { ...val }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      dataSource: this.datas,
      cachedData: [],
      tableColumns: this.columns,
      tableOptions: this.options,
      editingKey: '',
      selectedRowKeys: [],
      selectionRows: [],
      loading: false
    }
  },
  created() {
    this.cachedData = this.dataSource.map(item => ({ ...item }))
    this.initData()
  },
  methods: {
    onSelectChange (selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    getCheckboxProps(record) {
      return {
        props: {
          disabled: !!record.status
        }
      }
    },
    formatOption(text, options) {
      const find = options.find(item => item.value === text)
      return find ? find.label : text
    },
    initData() {
      this.selectionRows = this.dataSource.filter(item => {
        return !item.status
      })
      this.selectedRowKeys = this.selectionRows.map(item => item.key)
    },
    handleChangeRow(value, key, column) {
      const newData = this.dataSource.map(item => ({ ...item }))
      const target = newData.find(item => key === item.key)
      const old = this.cachedData.find(item => key === item.key)
      if (target) {
        target[column] = value
        this.dataSource = newData
        console.log(old[column])
      }
    },
    editRow(key) {
      console.log(key)
      if (this.editingKey) {
        this.$message.error('Please save frist')
        return
      }
      const newData = this.dataSource.map(item => ({ ...item }))
      const target = newData.find(item => key === item.key)
      this.editingKey = key
      if (target) {
        target.editable = true
        this.dataSource = newData
      }
    },
    cancelRow(key) {
      const newData = this.dataSource.map(item => ({ ...item }))
      const target = newData.find(item => key === item.key)
      this.editingKey = ''
      if (target) {
        if (!target.isNew) {
          Object.assign(target, this.cachedData.find(item => key === item.key))
          delete target.editable
          this.dataSource = newData
        } else {
          this.dataSource = newData.filter(item => key !== item.key)
        }
      }
    },
    delRow(key) {
      const newData = this.dataSource.map(item => ({ ...item }))
      const target = newData.find(item => key === item.key)
      if (target) {
        this.dataSource = newData.filter(item => key !== item.key)
        this.cachedData = this.cachedData.filter(item => key !== item.key)
        this.$emit('change', this.dataSource)
      }
    },
    async saveRow(key) {
      // 验证 ，更新status
      const newData = this.dataSource.map(item => ({ ...item }))
      const newCachedData = this.cachedData.map(item => ({ ...item }))
      const target = newData.find(item => key === item.key)
      const targetCache = newCachedData.find(item => key === item.key)
      if (target) {
        if (!targetCache) target.key = ''
        if (target.key) {
          const statusArr = this.verify(target)
          const res = await this.verifyDuplicate(target)
          target.status = Array.from(new Set(statusArr.concat(res))).join(',')
          delete target.editable
          this.dataSource = newData
          Object.assign(targetCache, target)
          this.cachedData = newCachedData
          this.$emit('change', this.dataSource)
        }
        this.editingKey = ''
      }
    }
  }
}
</script>

<style scoped lang="less">
.status_1 {
  color: #007990;
  font-weight: bold;
  font-size: 16px;
}
.status_2 {
  color: #E73D3D;
}
.action-edit {
  cursor: pointer;
  color: #2A5D96;
}
</style>
