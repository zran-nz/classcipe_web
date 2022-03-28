<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row type="flex" justify="start">
          <a-col :span="8">
            <a-input-search placeholder="Search for tag name" v-model="queryParam.name" enter-button @search="loadData"/>
          </a-col>
          <a-col :span="8">
          </a-col>
          <a-col :span="8">
            <a-button @click="handleAdd" type="primary" icon="plus" style="margin-right: 20px;" >Add tag</a-button>

            <a-button @click="handleLibary" type="primary" icon="mail" style="margin-right: 20px;" >Tag  library</a-button>

            <!--            <a-upload-->
            <!--              name="file"-->
            <!--              :showUploadList="false"-->
            <!--              :multiple="false"-->
            <!--              :headers="tokenHeader"-->
            <!--              :action="importExcelUrl"-->
            <!--              @change="handleMyImportExcel">-->
            <!--              <a-button :loading="importLoading" type="primary" icon="import">{{ importLoadingText }}</a-button>-->
            <!--              <a-dropdown>-->
            <!--                <a-button type="link" shape="circle" icon="download" />-->
            <!--                <a-menu slot="overlay">-->
            <!--                  <a-menu-item key="1">-->
            <!--                    <a-button type="link" icon="download" @click="downloadTemplate">Download template</a-button>-->
            <!--                  </a-menu-item>-->
            <!--                </a-menu>-->
            <!--              </a-dropdown>-->
            <!--            </a-upload>-->

          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!--          &lt;!&ndash; 高级查询区域 &ndash;&gt;-->
      <!--          &lt;!&ndash; 高级查询区域 &ndash;&gt;-->
      <!--          <a-dropdown v-if="selectedRowKeys.length > 0">-->
      <!--            <a-menu slot="overlay">-->
      <!--              <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>Delete</a-menu-item>-->
      <!--            </a-menu>-->
      <!--            <a-button style="margin-left: 8px"> Batch operation <a-icon type="down" /></a-button>-->
      <!--          </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <!--      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
      <!--        <i class="anticon anticon-info-circle ant-alert-icon"></i> Choosed <a style="font-weight: 600">{{ selectedRowKeys.length }}</a> items-->
      <!--        <a style="margin-left: 24px" @click="onClearSelected">Clear</a>-->
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
        @change="handleTableChange"
        @expand="handleExpand"
      >
        <span slot="hint" placement='top' slot-scope="text" class="hint-text" :title='text' >
          {{ text }}
        </span>

        <span slot="action" slot-scope="text, record">
          <template v-if="record.isCommon">
            <div v-if="record.createOwn && record.hasChild == '1'">
              <a @click="handleAddChild(record)"><a-icon type="plus"/> Add child</a>
            </div>
            <div v-if="record.isOptional && record.parentId == '0'">
              <a @click="handleSchoolTagRemove(record)"><a-icon type="delete"/> Remove</a>
            </div>
          </template>
          <template v-if="!record.isCommon">
            <a @click="handleEdit(record)">  <a-icon type="edit"/>Edit</a>
            <a-divider type="vertical" />
            <a-popconfirm v-if="record.parentId !== '0'" title="Confirm Delete?" @confirm="() => handleDeleteNode(record.id)" placement="topLeft">
              <a> <a-icon type="delete"/>Delete</a>
            </a-popconfirm>
            <a-dropdown v-if="record.parentId == '0'">
              <a class="ant-dropdown-link">More <a-icon type="down" /></a>
              <a-menu slot="overlay">
                <a-menu-item >
                  <a @click="handleAddChild(record)"><a-icon type="plus"/> Add child</a>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm title="Confirm Delete?" @confirm="() => handleDeleteNode(record.id)" placement="topLeft">
                    <a> <a-icon type="delete"/>Delete</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>

        </span>

      </a-table>
    </div>
    <Tag-Modal ref="modalForm" @ok="modalFormOk"></Tag-Modal>
    <Tag-Library ref="libraryForm" :selectCommonTagIds="selectCommonTagIds" @ok="modalLibraryOk"></Tag-Library>
  </a-card>
</template>

<script>

import { deleteAction, getAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import TagModal from './TagModal'
import { filterObj } from '@/utils/util'
import { CurriculumType } from '@/const/common'
import TagLibrary from '@/views/teacher/manage/tags/TagLibrary'
import { SchoolCommonTagList, SchoolSelectLibrary, SchoolTagDelete } from '@/api/tag'

export default {
  name: 'TagSettingsList',
  mixins: [JeecgListMixin],
  components: {
    TagModal, TagLibrary
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
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: 'Hint',
          align: 'left',
          dataIndex: 'tooltip',
          scopedSlots: { customRender: 'hint' }
        },
        // {
        //   title: 'Optional',
        //   align: 'center',
        //   dataIndex: 'isOptional',
        //   customRender: (text, row, index) => {
        //     return text ? 'Yes' : 'No'
        //   }
        // },
        // {
        //   title: 'Create their own',
        //   align: 'center',
        //   dataIndex: 'createOwn',
        //   customRender: (text, row, index) => {
        //     return text ? 'Yes' : 'No'
        //   }
        // },
        {
          title: 'Linked Tasks',
          align: 'center',
          dataIndex: 'taskCount'
        },
        {
          title: 'Linked Unit',
          align: 'center',
          dataIndex: 'planCount'
        },
        {
          title: 'Settings',
          align: 'center',
          fixed: 'right',
          width: 147,
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/classcipe/api/tag/rootSchoolCustomList',
        childList: '/classcipe/api/tag/childList',
        getChildListBatch: '/classcipe/api/tag/getChildListBatch',
        delete: '/classcipe/api/tag/delete',
        deleteBatch: '/classcipe/api/tag/deleteBatch',
        exportXlsUrl: '/classcipe/api/tag/exportXls',
        importExcelUrl: '/classcipe/api/tag/importExcel'
      },
      expandedRowKeys: [],
      hasChildrenField: 'hasChild',
      pidField: 'parentId',
      dictOptions: {},
      loadParent: false,
      superFieldList: [],
      curriculumType: CurriculumType,
      baseUrl: process.env.VUE_APP_API_BASE_URL,
      importLoadingText: 'Import',
      selectCommonTagIds: []
    }
  },
  created () {
    this.loadData()
    this.getCommonSelectTags()
  },
  computed: {
    // importIBSkillExcelUrl () {
    //   return this.baseUrl + `${this.url.importIBSkillExcelUrl}`
    // }
  },
  methods: {
    handleAdd: function () {
      this.$refs.modalForm.add({})
      this.$refs.modalForm.title = 'Add'
      this.$refs.modalForm.disableSubmit = false
    },
    handleLibary: function () {
      this.$refs.libraryForm.visible = true
      this.$refs.libraryForm.disableSubmit = false
    },
    loadData (arg) {
      if (arg === 1) {
        this.ipagination.current = 1
      }
      this.loading = true
      const params = this.getQueryParams()
      params.hasQuery = 'true'
      params.isCustom = true
      params.schoolId = this.$store.getters.userInfo.school
      getAction(this.url.list, params).then(res => {
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
        return getAction(this.url.getChildListBatch, { parentIds: this.expandedRowKeys.join(','), schoolId: this.$store.getters.userInfo.school }).then(res => {
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
    searchReset () {
      // 重置
      this.expandedRowKeys = []
      this.queryParam = {}
      this.loadData(1)
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
          params.sId = this.$store.getters.userInfo.school
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
    handleAddChild (record) {
      this.loadParent = true
      const obj = {}
      obj[this.pidField] = record['id']
      obj.curriculumId = record['curriculumId']
      this.$refs.modalForm.add(obj)
    },

    handleSchoolTagRemove: function (record) {
      this.$logger.info('SchoolTagDelete', record)
      this.loading = true
      SchoolTagDelete({ id: record.id }).then((res) => {
        if (res.success) {
          this.loadData()
          this.getCommonSelectTags()
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    handleDeleteNode (id) {
      var that = this
      deleteAction(that.url.delete, { id: id }).then((res) => {
        if (res.success) {
          that.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    modalLibraryOk (selectTagIds) {
      this.$logger.info('modalLibraryOk', selectTagIds)
      this.selectCommonTagIds = []
      selectTagIds.forEach(id => {
          if (id.indexOf('loadChild') === -1) {
            this.selectCommonTagIds.push(id)
          }
      })
      this.loading = true
      SchoolSelectLibrary({ tagIds: this.selectCommonTagIds, schoolId: this.$store.getters.userInfo.school }).then(res => {
        this.loadData()
      })
    },
    getCommonSelectTags() {
      SchoolCommonTagList({ schoolId: this.$store.getters.userInfo.school }).then(response => {
        this.$logger.info('SchoolCommonTagList', response)
        if (response.success) {
          this.selectCommonTagIds = response.result.map(tag => { return tag.id })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>

.hint-text{
  display: block;
  width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}

</style>
