<!--<template>-->

<!--  <a-card :bordered="false">-->

<!--    &lt;!&ndash; 抽屉 &ndash;&gt;-->
<!--    <a-drawer-->
<!--      title="Tag List"-->
<!--      :width="screenWidth"-->
<!--      @close="onClose"-->
<!--      :visible="visible"-->
<!--    >-->

<!--      &lt;!&ndash; 查询区域 &ndash;&gt;-->
<!--      <div class="table-page-search-wrapper">-->
<!--        <a-form layout="inline" @keyup.enter.native="searchQuery">-->
<!--          <a-row :gutter="24">-->
<!--            <a-col :xl="10" :lg="7" :md="8" :sm="24">-->
<!--              <a-form-item label="Tag type">-->
<!--                <a-select v-model="queryParam.tagType" placeholder="请选择type" >-->
<!--                  <a-select-option value="1">Knowledge</a-select-option>-->
<!--                  <a-select-option value="2">Skill</a-select-option>-->
<!--                </a-select>-->
<!--              </a-form-item>-->
<!--            </a-col>-->
<!--            <a-col :xl="6" :lg="7" :md="8" :sm="24">-->
<!--              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">-->
<!--                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>-->
<!--              </span>-->
<!--            </a-col>-->
<!--          </a-row>-->
<!--        </a-form>-->
<!--      </div>-->
<!--      &lt;!&ndash; 查询区域-END &ndash;&gt;-->
<!--      <a-alert :message="description" type="success" class="description-alert" />-->

<!--      &lt;!&ndash; 操作按钮区域 &ndash;&gt;-->
<!--      <div class="table-operator">-->
<!--        <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
<!--        &lt;!&ndash;      <a-button type="primary" icon="download" @click="handleExportXls('cc_knowledge_tag')">导出</a-button>-->
<!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
<!--        <a-button type="primary" icon="import">导入</a-button>-->
<!--      </a-upload>&ndash;&gt;-->
<!--        &lt;!&ndash; 高级查询区域 &ndash;&gt;-->
<!--        <a-dropdown v-if="selectedRowKeys.length > 0">-->
<!--          <a-menu slot="overlay">-->
<!--            <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>-->
<!--          </a-menu>-->
<!--          <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>-->
<!--        </a-dropdown>-->
<!--      </div>-->

<!--      &lt;!&ndash; table区域-begin &ndash;&gt;-->
<!--      <div>-->
<!--        <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">-->
<!--          <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项-->
<!--          <a style="margin-left: 24px" @click="onClearSelected">清空</a>-->
<!--        </div>-->

<!--        <a-table-->
<!--          ref="table"-->
<!--          size="middle"-->
<!--          :scroll="{x:true}"-->
<!--          bordered-->
<!--          rowKey="id"-->
<!--          :columns="columns"-->
<!--          :dataSource="dataSource"-->
<!--          :pagination="ipagination"-->
<!--          :loading="loading"-->
<!--          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
<!--          class="j-table-force-nowrap"-->
<!--          @change="handleTableChange">-->

<!--          <template slot="htmlSlot" slot-scope="text">-->
<!--            <div v-html="text"></div>-->
<!--          </template>-->
<!--          <template slot="imgSlot" slot-scope="text">-->
<!--            <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>-->
<!--            <img v-else :src="getImgView(text)" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>-->
<!--          </template>-->
<!--          <template slot="fileSlot" slot-scope="text">-->
<!--            <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>-->
<!--            <a-button-->
<!--              v-else-->
<!--              :ghost="true"-->
<!--              type="primary"-->
<!--              icon="download"-->
<!--              size="small"-->
<!--              @click="downloadFile(text)">-->
<!--              下载-->
<!--            </a-button>-->
<!--          </template>-->

<!--          <span slot="action" slot-scope="text, record">-->
<!--            <a @click="handleEdit(record)">编辑</a>-->

<!--            <a-divider type="vertical" />-->
<!--            <a-dropdown>-->
<!--              <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>-->
<!--              <a-menu slot="overlay">-->
<!--                <a-menu-item>-->
<!--                  <a @click="handleDetail(record)">详情</a>-->
<!--                </a-menu-item>-->
<!--                <a-menu-item>-->
<!--                  <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">-->
<!--                    <a>删除</a>-->
<!--                  </a-popconfirm>-->
<!--                </a-menu-item>-->
<!--              </a-menu>-->
<!--            </a-dropdown>-->
<!--          </span>-->

<!--        </a-table>-->
<!--      </div>-->

<!--      <knowledge-tag-modal ref="modalForm" @ok="modalFormOk"></knowledge-tag-modal>-->
<!--    </a-drawer>-->
<!--  </a-card>-->

<!--</template>-->

<!--<script>-->

<!--  import { mixinDevice } from '@/utils/mixin'-->
<!--  import { JeecgListMixin } from '@/mixins/JeecgListMixin'-->
<!--  import KnowledgeTagModal from './modules/KnowledgeTagModal'-->
<!--  import { filterObj } from '@/utils/util'-->
<!--  import pick from 'lodash.pick'-->

<!--  export default {-->
<!--    name: 'KnowledgeTagList',-->
<!--    mixins: [JeecgListMixin, mixinDevice],-->
<!--    components: {-->
<!--      KnowledgeTagModal-->
<!--    },-->
<!--    data () {-->
<!--      return {-->
<!--        screenWidth: 800,-->
<!--        visible: false,-->
<!--        subKnowledgeId: '',-->
<!--        description: '',-->
<!--        queryParam: {-->
<!--          subKnowledgeId: '',-->
<!--          name: ''-->
<!--        },-->
<!--        form: this.$form.createForm(this),-->
<!--        // 表头-->
<!--        columns: [-->
<!--          {-->
<!--            title: '#',-->
<!--            dataIndex: '',-->
<!--            key: 'rowIndex',-->
<!--            width: 60,-->
<!--            align: 'center',-->
<!--            customRender: function (t, r, index) {-->
<!--              return parseInt(index) + 1-->
<!--            }-->
<!--          },-->
<!--          {-->
<!--            title: 'name',-->
<!--            align: 'center',-->
<!--            dataIndex: 'name'-->
<!--          },-->
<!--          {-->
<!--            title: 'tagType',-->
<!--            align: 'center',-->
<!--            dataIndex: 'tagType',-->
<!--            customRender: function (t, r, index) {-->
<!--              if (t === 1) {-->
<!--                return 'Knowledge Tag'-->
<!--              } else {-->
<!--                return 'Skill Tag'-->
<!--              }-->
<!--            }-->
<!--          },-->
<!--          {-->
<!--            title: '操作',-->
<!--            dataIndex: 'action',-->
<!--            align: 'center',-->
<!--            fixed: 'right',-->
<!--            width: 147,-->
<!--            scopedSlots: { customRender: 'action' }-->
<!--          }-->
<!--        ],-->
<!--        url: {-->
<!--          list: '/api/knowledgeTag/list',-->
<!--          delete: '/api/knowledge/deleteTag',-->
<!--          deleteBatch: '/api/knowledge/deleteTagBatch',-->
<!--          exportXlsUrl: '/api/knowledgeTag/exportXls',-->
<!--          importExcelUrl: 'api/knowledgeTag/importExcel'-->

<!--        },-->
<!--        dictOptions: {},-->
<!--        superFieldList: []-->
<!--      }-->
<!--    },-->
<!--    created () {-->
<!--    },-->
<!--    computed: {-->
<!--      importExcelUrl: function () {-->
<!--        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`-->
<!--      }-->
<!--    },-->
<!--    methods: {-->
<!--      add (tagId) {-->
<!--        this.subKnowledgeId = tagId-->
<!--        this.edit({})-->
<!--      },-->
<!--      edit (record) {-->
<!--        if (record.id) {-->
<!--          this.subKnowledgeId = record.id-->
<!--          this.description = record.name-->
<!--        }-->
<!--        this.queryParam = {}-->
<!--        this.form.resetFields()-->
<!--        this.model = Object.assign({}, record)-->
<!--        this.model.subKnowledgeId = this.subKnowledgeId-->
<!--        this.visible = true-->
<!--        this.$nextTick(() => {-->
<!--          this.form.setFieldsValue(pick(this.model, 'itemText', 'itemValue'))-->
<!--        })-->
<!--        // 当其它模块调用该模块时,调用此方法加载字典数据-->
<!--        this.loadData()-->
<!--      },-->

<!--      getQueryParams () {-->
<!--        // update&#45;&#45;begin&#45;&#45;autor:wangshuai-&#45;&#45;&#45;&#45;date:20191204&#45;&#45;&#45;&#45;&#45;&#45;for：清空总条数 teambition JT-113&#45;&#45;&#45;&#45;&#45;&#45;-->
<!--        this.ipagination.total = 0-->
<!--        // update&#45;&#45;end&#45;&#45;autor:wangshuai-&#45;&#45;&#45;&#45;date:20191204&#45;&#45;&#45;&#45;&#45;&#45;for：清空总条数 teambition JT-113&#45;&#45;&#45;&#45;&#45;&#45;-->
<!--        var param = Object.assign({}, this.queryParam)-->
<!--        param.subKnowledgeId = this.subKnowledgeId-->
<!--        param.field = this.getQueryField()-->
<!--        param.pageNo = this.ipagination.current-->
<!--        param.pageSize = this.ipagination.pageSize-->
<!--        if (this.superQueryParams) {-->
<!--          param['superQueryParams'] = encodeURI(this.superQueryParams)-->
<!--          param['superQueryMatchType'] = this.superQueryMatchType-->
<!--        }-->
<!--        return filterObj(param)-->
<!--      },-->

<!--      handleAdd () {-->
<!--        this.$refs.modalForm.add(this.subKnowledgeId)-->
<!--        this.$refs.modalForm.title = '新增'-->
<!--      },-->
<!--      showDrawer () {-->
<!--        this.visible = true-->
<!--      },-->
<!--      onClose () {-->
<!--        this.visible = false-->
<!--        this.form.resetFields()-->
<!--        this.dataSource = []-->
<!--      },-->
<!--      // 抽屉的宽度随着屏幕大小来改变-->
<!--      resetScreenSize () {-->
<!--        const screenWidth = document.body.clientWidth-->
<!--        if (screenWidth < 600) {-->
<!--          this.screenWidth = screenWidth-->
<!--        } else {-->
<!--          this.screenWidth = 600-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--</script>-->
<!--<style scoped>-->
<!--  @import '~@assets/less/common.less';-->
<!--  .description-alert{-->
<!--    margin: 6px;-->
<!--  }-->
<!--</style>-->
