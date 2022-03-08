<template>

  <j-modal
    title="Tab library"
    :width="width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="Close">
    <a-spin :spinning="confirmLoading">
    </a-spin>
    <!-- table区域-begin -->
    <div>

      <!--      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
      <!--        <i class="anticon anticon-info-circle ant-alert-icon"></i> Choosed <a style="font-weight: 600">{{ selectedRowKeys.length }}</a> items-->
      <!--        &lt;!&ndash;        <a style="margin-left: 24px" @click="onClearSelected">Clear</a>&ndash;&gt;-->
      <!--      </div>-->

      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        :indentSize="30"
        :scroll="{x:true}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :expandedRowKeys="expandedRowKeys"
        @expand="handleExpand"
        v-bind="tableProps"
      >
      </a-table>
    </div>

  </j-modal>

</template>

<script>

import { getAction, postAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { filterObj } from '@/utils/util'
import JModal from '@/components/jeecg/JModal'

export default {
  name: 'TagLibrary',
  mixins: [JeecgListMixin],
  components: {
    JModal
  },
  props: {
    selectCommonTagIds: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      condition: {},
      curriculumList: [],
      assessmentNameList: [],
      description: 'Tag Settings',
      // 表头
      columns: [
        {
          title: 'Tag Category',
          align: 'left',
          dataIndex: 'name'
        },
        {
          title: 'Hint',
          align: 'left',
          dataIndex: 'tooltip'
        },
        {
          title: 'Optional',
          align: 'center',
          dataIndex: 'isOptional',
          customRender: (text, row, index) => {
            return text ? 'Yes' : 'No'
          }
        },
        {
          title: 'Create their own',
          align: 'center',
          dataIndex: 'createOwn',
          customRender: (text, row, index) => {
            return text ? 'Yes' : 'No'
          }
        }
      ],
      url: {
        list: '/classcipe/api/tag/rootSchoolLibraryList',
        childList: '/classcipe/api/tag/childList',
        getChildListBatch: '/classcipe/api/tag/getChildListBatch'
      },
      expandedRowKeys: [],
      hasChildrenField: 'hasChild',
      pidField: 'parentId',
      dictOptions: {},
      loadParent: false,
      superFieldList: [],
      confirmLoading: false,
      width: 1000,
      visible: false,
      selectedRowKeys: []
    }
  },
  created () {
    // this.loadData()
     this.selectedRowKeys = this.selectCommonTagIds
  },
  watch: {
    selectCommonTagIds(val) {
      this.selectedRowKeys = val
    }
  },
  computed: {
    tableProps () {
      const _this = this
      return {
        // 列表项是否可选择
        rowSelection: {
          selections: false,
          selectedRowKeys: _this.selectedRowKeys,
          // eslint-disable-next-line no-return-assign
          onChange: (selectedRowKeys) => _this.selectedRowKeys = selectedRowKeys,
          hideDefaultSelections: true,
          getCheckboxProps: record => ({
            props: {
              disabled: (record.isCommon && !record.isOptional) || (record.parentId !== '0' && record.hasChild === '0'),
              name: record.name
            }
          })
        }
      }
    }
  },
  methods: {
    loadData (arg) {
      if (arg === 1) {
        this.ipagination.current = 1
      }
      this.loading = true
      const params = this.getQueryParams()
      params.hasQuery = 'true'
      params.isCustom = true
      // params.schoolId = this.$store.getters.userInfo.school
      postAction(this.url.list, params).then(res => {
        if (res.success) {
          const result = res.result
          if (Number(result.total) > 0) {
            this.ipagination.total = Number(result.total)
            this.dataSource = this.getDataByResult(res.result.records)
            return this.loadDataByExpandedRows(this.dataSource)
          } else {
            this.ipagination.total = 0
            this.dataSource = []
          }
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    // 根据已展开的行查询数据（用于保存后刷新时异步加载子级的数据）
    loadDataByExpandedRows (dataList) {
      if (this.expandedRowKeys.length > 0) {
        return getAction(this.url.getChildListBatch, { parentIds: this.expandedRowKeys.join(',') }).then(res => {
          if (res.success && res.result.records.length > 0) {
            // 已展开的数据批量子节点
            const records = res.result.records
            const listMap = new Map()
            for (const item of records) {
              const pid = item[this.pidField]
              if (this.expandedRowKeys.join(',').includes(pid)) {
                let mapList = listMap.get(pid)
                if (mapList == null) {
                  mapList = []
                }
                mapList.push(item)
                listMap.set(pid, mapList)
              }
            }
            const childrenMap = listMap
            const fn = (list) => {
              if (list) {
                list.forEach(data => {
                  if (this.expandedRowKeys.includes(data.id)) {
                    data.children = this.getDataByResult(childrenMap.get(data.id))
                    fn(data.children)
                  }
                })
              }
            }
            fn(dataList)
          }
        })
      } else {
        return Promise.resolve()
      }
    },
    getQueryParams (arg) {
      // 获取查询条件
      const sqp = {}
      let param = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        sqp['superQueryMatchType'] = this.superQueryMatchType
      }
      if (arg) {
        param = Object.assign(sqp, this.isorter, this.filters)
      } else {
        param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
      }
      if (JSON.stringify(this.queryParam) === '{}' || arg) {
        param.hasQuery = 'false'
      } else {
        param.hasQuery = 'true'
      }
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      return filterObj(param)
    },
    getDataByResult (result) {
      if (result) {
        return result.map(item => {
          // 判断是否标记了带有子节点
          if (item[this.hasChildrenField] === '1') {
            const loadChild = { id: item.id + '_loadChild', name: 'loading...', isLoading: true }
            item.children = [loadChild]
          }
          return item
        })
      }
    },
    handleExpand (expanded, record) {
      // 判断是否是展开状态
      if (expanded) {
        this.expandedRowKeys.push(record.id)
        if (record.children.length > 0 && record.children[0].isLoading === true) {
          const params = this.getQueryParams(1)// 查询条件
          params[this.pidField] = record.id
          params.hasQuery = 'false'
          params.superQueryParams = ''
          getAction(this.url.childList, params).then((res) => {
            if (res.success) {
              if (res.result.records) {
                record.children = this.getDataByResult(res.result.records)
                this.dataSource = [...this.dataSource]
              } else {
                record.children = ''
                record.hasChildrenField = '0'
              }
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      } else {
        const keyIndex = this.expandedRowKeys.indexOf(record.id)
        if (keyIndex >= 0) {
          this.expandedRowKeys.splice(keyIndex, 1)
        }
      }
    },
    handleOk () {
      this.$emit('ok', this.selectedRowKeys)
      this.visible = false
    },
    handleCancel () {
      this.visible = false
    }

  }
}
</script>
<style lang="less" scoped>

</style>
