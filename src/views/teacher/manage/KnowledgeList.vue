<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="Subject">
              <a-select :allowClear="true" v-model="queryParam.subjectId" placeholder="Please select subject" >
                <a-select-option v-if="item.subjectType === subjectType.Skill || item.subjectType === subjectType.LearnAndSkill" :value="item.id" :key="item.id" v-for="item in subjectList">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="Grade">
              <a-select mode="multiple" :allowClear="true" v-model="queryParam.gradeIds" placeholder="Please select grade" >
                <a-select-option :value="item.id" :key="item.id" v-for="item in gradeAllList">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <!--          <a-col :xl="6" :lg="7" :md="8" :sm="24">-->
          <!--            <a-form-item label="Assessment Type">-->
          <!--              <a-select mode="multiple" :allowClear="true" v-model="queryParam.assessmentNames"  placeholder="请选择Assessment Type" >-->
          <!--                <a-select-option  :value="name" :key="name" v-for="name in assessmentNameList">{{name}}</a-select-option>-->
          <!--              </a-select>-->
          <!--            </a-form-item>-->
          <!--          </a-col>-->

          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">Search</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">Add</a-button>
      <a-button type="primary" icon="download" @click="downloadTemplate">Download template</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :data="{'curriculumId':queryParam.curriculumId}"
        :action="importIBSkillExcelUrl"
        @change="handleMyImportExcelCommon">
        <a-button :loading="importLoading" type="primary" icon="import">{{ importLoadingText }}</a-button>
      </a-upload>
      <!-- 高级查询区域 -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>Delete</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> Batch operation <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> Choosed <a style="font-weight: 600">{{ selectedRowKeys.length }}</a> items
        <a style="margin-left: 24px" @click="onClearSelected">Clear</a>
      </div>

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
        v-bind="tableProps">

        <template slot="imgSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">  <a-icon type="edit"/>Edit</a>
          <!--          <a-divider type="vertical"/>-->
          <!--          <a v-if="record.parentId != '0' && record.hasChild === '0'" @click="editKnowledgeTag(record)"><a-icon type="setting"/>Tags</a>-->
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">More <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleAddChild(record)">Add sub</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="Confirm Delete?" @confirm="() => handleDeleteNode(record.id)" placement="topLeft">
                  <a>Delete</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!--    <knowledge-tag-list ref="knowledgeTagList"></knowledge-tag-list>-->
    <knowledge-modal :subject-list="subjectList" :grade-list="gradeAllList" ref="modalForm" @ok="modalFormOk"></knowledge-modal>
  </a-card>
</template>

<script>

import { deleteAction, getAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import KnowledgeModal from './modules/KnowledgeModal'
import KnowledgeTagList from './KnowledgeTagList'
import { filterObj } from '@/utils/util'
import { GetGradesByCurriculumId } from '@/api/preference'
import { CurriculumType, SubjectType, TagType } from '@/const/common'
import JTreeSelect from '@/components/jeecg/JTreeSelect'
import { SubjectTree } from '@/api/subject'

export default {
  name: 'KnowledgeList',
  mixins: [JeecgListMixin],
  components: {
    KnowledgeModal, KnowledgeTagList, JTreeSelect
  },
  data () {
    return {
      condition: {},
      curriculumList: [],
      subjectList: [],
      subjectAllList: [],
      gradeList: [],
      gradeAllList: [],
      assessmentNameList: [],
      description: 'Skill Manage',
      subjectType: SubjectType,
      // 表头
      columns: [
        {
          title: 'branch or Description',
          align: 'left',
          dataIndex: 'name',
          width: '50%'
        },
        {
          title: 'Subject',
          align: 'left',
          dataIndex: 'subjectId',
          customRender: (value, row, index) => {
            const filterList = this.subjectAllList.filter(item => item.id === value)
            return filterList.length > 0 ? filterList[0].name : value
          }
        },
        {
          title: 'Grade',
          align: 'left',
          dataIndex: 'gradeIds',
          sorter: true,
          customRender: (value, row, index) => {
            if (!value) {
              return ''
            }
            var names = []
            this.gradeAllList.forEach(item => {
              if (value.indexOf(item.id) > -1) {
                names.push(item.name)
              }
            })
            return names ? names.join(',') : ''
          }
        },
        {
          title: 'Operate',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/classcipe/api/knowledge/rootList',
        childList: '/classcipe/api/knowledge/childList',
        getChildListBatch: '/classcipe/api/knowledge/getChildListBatch',
        delete: '/classcipe/api/knowledge/delete',
        deleteBatch: '/classcipe/api/knowledge/deleteBatch',
        exportXlsUrl: '/classcipe/api/knowledge/exportXls',
        importExcelUrl: '/classcipe/api/knowledge/importExcel',
        importIBSkillExcelUrl: '/classcipe/api/knowledge/importIBSkillExcel'
      },
      expandedRowKeys: [],
      hasChildrenField: 'hasChild',
      pidField: 'parentId',
      dictOptions: {},
      loadParent: false,
      superFieldList: [],
      curriculumType: CurriculumType,
      importLoadingText: 'Upload',
      baseUrl: process.env.VUE_APP_API_BASE_URL
    }
  },
  created () {
    this.condition = JSON.stringify({ 'curriculum_id': '1', 'del_flag': 0 })
    // this.getSuperFieldList();
    // this.getSuperFieldList();
    Promise.all([
      GetGradesByCurriculumId({ curriculumId: this.$store.getters.bindCurriculum }),
      SubjectTree({ curriculumId: this.$store.getters.bindCurriculum })
    ]).then((res) => {
      if (res[0].success) {
        this.gradeAllList = res[0].result
        console.log('this.getAllGrades: ', this.gradeAllList)
      }
      if (res[1].success) {
        this.subjectAllList = []
        this.subjectList = res[1].result
        res[1].result.forEach(subject => {
          this.subjectAllList.push(subject)
          if (subject.children.length > 0) {
            subject.children.forEach(child => {
              this.subjectAllList.push(child)
            })
          }
        })
        console.log('this.subjectAllList: ', this.subjectAllList)
      }
    }).finally(() => {
      this.loadData()
  })
},
  computed: {
    importIBSkillExcelUrl () {
      return this.baseUrl + `${this.url.importIBSkillExcelUrl}`
    },
    tableProps () {
      const _this = this
      return {
        // 列表项是否可选择
        rowSelection: {
          selectedRowKeys: _this.selectedRowKeys,
          // eslint-disable-next-line no-return-assign
          onChange: (selectedRowKeys) => _this.selectedRowKeys = selectedRowKeys
        }
      }
    }
  },
  methods: {
    handleAdd: function () {
      this.$refs.modalForm.add({ 'subjectId': this.queryParam.subjectId })
      this.$refs.modalForm.title = 'Add'
      this.$refs.modalForm.disableSubmit = false
    },
    // 编辑字典数据
    editKnowledgeTag (record) {
      this.$refs.knowledgeTagList.edit(record)
    },
    loadData (arg) {
      if (arg === 1) {
        this.ipagination.current = 1
      }
      this.loading = true
      const params = this.getQueryParams()
      params.hasQuery = 'true'
      params.curriculumId = this.$store.getters.bindCurriculum
      params.tagType = TagType.ibSkill
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
      obj.gradeIds = record['gradeIds']
      obj.subjectId = record['subjectId']
      obj.curriculumId = record['curriculumId']
      this.$refs.modalForm.add(obj)
    },
    handleDeleteNode (id) {
      var that = this
      deleteAction(that.url.delete, { id: id }).then((res) => {
        if (res.success) {
          that.loadData(1)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleMyImportExcelCommon (info) {
      if (info.file.status === 'uploading') {
        this.importLoading = true
        this.importLoadingText = 'Uploading...'
        // var hideLoading = this.$message.loading(`正在导入excel`, 0)
      }
      if (info.file.status === 'done') {
        this.importLoading = false
        this.importLoadingText = 'Upload'
      }
      this.handleImportExcel(info)
    },
    downloadTemplate () {
      const link = document.createElement('a')
      link.style.display = 'none'
      const url = this.baseUrl + '/classcipe/excel/knowledge_template_example.xlsx'
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
      window.URL.revokeObjectURL(url) // 释放掉blob对象
    }
  }
}
</script>
<style lang="less" scoped>

</style>
