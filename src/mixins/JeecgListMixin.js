
import { filterObj } from '@/utils/util'
import { deleteAction, getAction, downFile, getFileAccessHttpUrl } from '@/api/manage'
import Vue from 'vue'
import store from '@/store'
import { Modal } from 'ant-design-vue'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export const JeecgListMixin = {
  data () {
    return {
      /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
      queryParam: {},
      /* 数据源 */
      dataSource: [],
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return 'Total ' + total + ' items'
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      /* 排序参数 */
      isorter: {
        column: 'createTime',
        order: 'desc'
      },
      /* 筛选参数 */
      filters: {},
      /* table加载状态 */
      loading: false,
      importLoading: false,
      importLoadingText: 'Import',
      /* table选中keys */
      selectedRowKeys: [],
      /* table选中records */
      selectionRows: [],
      /* 查询折叠 */
      toggleSearchStatus: false,
      /* 高级查询条件生效状态 */
      superQueryFlag: false,
      /* 高级查询条件 */
      superQueryParams: '',
      /** 高级查询拼接方式 */
      superQueryMatchType: 'and'
    }
  },
  created () {
      if (!this.disableMixinCreated) {
        console.log(' -- mixin created -- ')
        this.loadData()
        // 初始化字典配置 在自己页面定义
        this.initDictConfig()
      }
  },
  computed: {
    // token header
    tokenHeader () {
      const head = { 'X-Access-Token': storage.get(ACCESS_TOKEN) }
      return head
    }
  },
  methods: {
    loadData (arg) {
      if (!this.url.list) {
        this.$message.error('Please set the url.list attribute!')
        return
      }
      // 加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      var params = this.getQueryParams()// 查询条件
      this.loading = true
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          // update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          this.dataSource = res.result.records || res.result
          if (res.result.total) {
            this.ipagination.total = res.result.total
          } else {
            this.ipagination.total = 0
          }
          // update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
    initDictConfig () {
      console.log('--这是一个假的方法!')
    },
    handleSuperQuery (params, matchType) {
      // 高级查询方法
      if (!params) {
        this.superQueryParams = ''
        this.superQueryFlag = false
      } else {
        this.superQueryFlag = true
        this.superQueryParams = JSON.stringify(params)
        this.superQueryMatchType = matchType
      }
      this.loadData(1)
    },
    getQueryParams () {
      // 获取查询条件
      const sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        sqp['superQueryMatchType'] = this.superQueryMatchType
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      return filterObj(param)
    },
    getQueryField () {
      // TODO 字段权限控制
      var str = 'id,'
      this.columns.forEach(function (value) {
        str += ',' + value.dataIndex
      })
      return str
    },

    onSelectChange (selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    onClearSelected () {
      this.selectedRowKeys = []
      this.selectionRows = []
    },
    searchQuery () {
      this.loadData(1)
    },
    superQuery () {
      this.$refs.superQueryModal.show()
    },
    searchReset () {
      this.queryParam = {}
      this.loadData(1)
    },
    batchDel: function () {
      if (!this.url.deleteBatch) {
        this.$message.error('Please set the url.list attribute!')
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('Please select a record!')
      } else {
        var ids = ''
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ','
        }
        var that = this
        this.$confirm({
          title: 'Confirm deletion',
          content: 'Do you want to delete the selected data?',
          onOk: function () {
            that.loading = true
            deleteAction(that.url.deleteBatch, { ids: ids }).then((res) => {
              if (res.success) {
                // 重新计算分页问题
                that.reCalculatePage(that.selectedRowKeys.length)
                that.$message.success(res.message)
                that.loadData()
                that.onClearSelected()
              } else {
                that.$message.warning(res.message)
              }
            }).finally(() => {
              that.loading = false
            })
          }
        })
      }
    },
    handleDelete: function (id) {
      if (!this.url.delete) {
        this.$message.error('Please set the url.delete attribute!')
        return
      }
      var that = this
      deleteAction(that.url.delete, { id: id }).then((res) => {
        if (res.success) {
          // 重新计算分页问题
          that.reCalculatePage(1)
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    reCalculatePage (count) {
      // 总数量-count
      const total = this.ipagination.total - count
      // 获取删除后的分页数
      const currentIndex = Math.ceil(total / this.ipagination.pageSize)
      // 删除后的分页数<所在当前页
      if (currentIndex < this.ipagination.current) {
        this.ipagination.current = currentIndex
      }
      console.log('currentIndex', currentIndex)
    },
    handleEdit: function (record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = 'Edit'
      this.$refs.modalForm.disableSubmit = false
    },
    handleAdd: function () {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = 'Add'
      this.$refs.modalForm.disableSubmit = false
    },
    handleTableChange (pagination, filters, sorter) {
      // 分页、排序、筛选变化时触发
      // TODO 筛选
      console.log(pagination)
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field
        this.isorter.order = sorter.order === 'ascend' ? 'asc' : 'desc'
      }
      this.ipagination = pagination
      this.loadData()
    },
    handleToggleSearch () {
      this.toggleSearchStatus = !this.toggleSearchStatus
    },
    // 给popup查询使用(查询区域不支持回填多个字段，限制只返回一个字段)
    getPopupField (fields) {
      return fields.split(',')[0]
    },
    modalFormOk () {
      // 新增/修改 成功时，重载列表
      this.loadData()
      // 清空列表选中
      this.onClearSelected()
    },
    handleDetail: function (record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = 'Details'
      this.$refs.modalForm.disableSubmit = true
    },
    /* 导出 */
    handleExportXls2 () {
      const paramsStr = encodeURI(JSON.stringify(this.getQueryParams()))
      const url = `${window._CONFIG['domianURL']}/${this.url.exportXlsUrl}?paramsStr=${paramsStr}`
      window.location.href = url
    },
    handleExportXls (fileName) {
      if (!fileName || typeof fileName !== 'string') {
        fileName = 'Export file'
      }
      const param = this.getQueryParams()
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        param['selections'] = this.selectedRowKeys.join(',')
      }
      console.log('导出参数', param)
      downFile(this.url.exportXlsUrl, param).then((data) => {
        if (!data) {
          this.$message.warning('文件下载失败')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), fileName + '.xls')
        } else {
          const url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) // 下载完成移除元素
          window.URL.revokeObjectURL(url) // 释放掉blob对象
        }
      })
    },
    /* 导入 */
    handleImportExcel (info) {
      console.log(info.file.status)
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          // this.$message.success(`${info.file.name} 文件上传成功`);
          if (info.file.response.code === 201) {
            const { message, result: { msg, fileUrl, fileName } } = info.file.response
            const href = window._CONFIG['domianURL'] + fileUrl
            this.$warning({
              title: message,
              content: (<div>
                  <span>{msg}</span><br/>
                  <span>Details <a href={href} target="_blank" download={fileName}>Click download</a> </span>
                </div>
              )
            })
          } else {
            this.$message.success(info.file.response.message || `${info.file.name} 文件上传成功`)
          }
          this.loadData()
        } else {
          this.$message.error(`${info.file.name} ${info.file.response.message}.`)
        }
      } else if (info.file.status === 'error') {
        if (info.file.response.status === 500) {
          const data = info.file.response
          const token = Vue.ls.get(ACCESS_TOKEN)
          if (token && data.message.includes('Token失效')) {
            Modal.error({
              title: '登录已过期',
              content: '很抱歉，登录已过期，请重新登录',
              okText: '重新登录',
              mask: false,
              onOk: () => {
                store.dispatch('Logout').then(() => {
                  Vue.ls.remove(ACCESS_TOKEN)
                  window.location.reload()
                })
              }
            })
          }
        } else {
          this.$message.error(`文件上传失败: ${info.file.msg} `)
        }
      }
    },
    /* 图片预览 */
    getImgView (text) {
      if (text && text.indexOf(',') > 0) {
        text = text.substring(0, text.indexOf(','))
      }
      return getFileAccessHttpUrl(text)
    },
    /* 文件下载 */
    // update--autor:lvdandan-----date:20200630------for：修改下载文件方法名uploadFile改为downloadFile------
    downloadFile (text) {
      if (!text) {
        this.$message.warning('未知的文件')
        return
      }
      if (text.indexOf(',') > 0) {
        text = text.substring(0, text.indexOf(','))
      }
      const url = getFileAccessHttpUrl(text)
      window.open(url)
    }
  }

}
