<template>
  <div class="my-content">
    <div class="content-wrapper">
      <a-skeleton :loading="skeletonLoading" active>
        <div class="content-list">
          <a-list
            size="large"
            :pagination="pagination"
            :data-source="myContentList"
            :loading="loading">
            <a-list-item
              slot="renderItem"
              key="item.key"
              slot-scope="item"
              :class="{'my-list-item': true, 'active-item': mySelectedList.indexOf(item.type + '-' + item.id) !== -1}"
              @click="handleToggleSelect(item)">

              <div class="my-list-item-info">
                <div class="select-block" @click="handleSelectItem(item, $event)">
                  <a-icon
                    class="select-block-icon"
                    type="border"
                    v-if="mySelectedList.indexOf(item.type + '-' + item.id) === -1"/>
                  <div class="selected-icon" v-if="mySelectedList.indexOf(item.type + '-' + item.id) !== -1">
                    <img src="~@/assets/icons/lesson/selected.png"/>
                  </div>
                </div>
                <span class="content-info-left" @click="handleSelectItem(item, $event)">
                  <content-type-icon :type="item.type"/>

                  <span class="name-content">
                    <span class="name-text" >
                      {{ item.name ? item.name : 'Untitled' }}
                    </span>
                  </span>
                </span>
                <span class="content-info-right">
                  <span class="link-status" @click="handleSelectItem(item, $event)">
                    Linked
                  </span>
                  <span class="status" @click="handleSelectItem(item, $event)">
                    <template v-if="item.status === 0">Draft</template>
                    <template v-if="item.status === 1">Published</template>
                  </span>
                  <span class="update-time" @click="handleSelectItem(item, $event)">
                    {{ item.updateTime || item.createTime | dayjs }}
                  </span>
                  <div class="action" >
                    <div class="action-wrapper">
                      <div class="action-item" @click="item.expand = !item.expand">
                        <arrow-top v-if="item.expand"/>
                        <arrow-down v-else/>
                      </div>
                    </div>
                  </div>
                </span>
              </div>
              <div class="my-list-expand" v-show="item.expand && item.forms.length">
                <div class="form-list">
                  <div :class="{'form-item': true, 'form-item-active': selectedFormIdList.indexOf(formItem.formId) !== -1}" v-for="(formItem, fIndex) in item.forms" :key="fIndex">
                    <div class="form-mask" @click="handleAddFormItem(formItem)">
                    </div>
                    <evaluation-table
                      ref="evaluationTable"
                      :form-id="formItem.formId"
                      :init-raw-headers="formItem.initRawHeaders"
                      :init-raw-data="formItem.initRawData"
                      :form-type="formItem.formType"
                      :mode="EvaluationTableMode.Preview"
                    />
                  </div>
                </div>
              </div>
            </a-list-item>
          </a-list>
          <div class="modal-ensure-action-line">
            <a-button class="action-item action-cancel" shape="round" @click="handleCancel">Cancel</a-button>
            <a-button class="action-ensure action-item" type="primary" shape="round" @click="handleEnsure">Confirm</a-button>
          </div>
        </div>
      </a-skeleton>
    </div>
  </div>
</template>

<script>
import * as logger from '@/utils/logger'
import { FindMyContent } from '@/api/teacher'
import { ownerMap, typeMap } from '@/const/teacher'
import ContentTypeIcon from '@/components/Teacher/ContentTypeIcon'
import DisplayMode from '@/components/MyContent/DisplayMode'
import NoMoreResources from '@/components/Common/NoMoreResources'
import ArrowTop from '@/assets/svgIcon/evaluation/select/jiantoushang.svg?inline'
import ArrowDown from '@/assets/svgIcon/evaluation/select/jiantouxia.svg?inline'
import { EvaluationQueryByIds } from '@/api/evaluation'
import EvaluationTableMode from '@/components/Evaluation/EvaluationTableMode'
import EvaluationTable from '@/components/Evaluation/EvaluationTable'

export default {
  name: 'SelectEvaluationList',
  components: {
    ContentTypeIcon,
    NoMoreResources,
    ArrowTop,
    ArrowDown,
    EvaluationTable
  },
  props: {
    taskId: {
      type: String,
      required: false,
      default: null
    },
    classId: {
      type: String,
      required: false,
      default: null
    },
    hiddenEvaluationId: {
      type: String,
      default: () => []
    }
  },
  data () {
    return {
      skeletonLoading: true,
      loading: true,
      loadFailed: false,
      myContentList: [],
      displayMode: DisplayMode,
      EvaluationTableMode: EvaluationTableMode,

      pagination: {
        onChange: page => {
          console.info('pagination onChange', page)
          this.pageNo = page
          this.loadMyContent()
        },
        showTotal: total => `Total ${total} items`,
        total: 0,
        pageSize: 10
      },
      pageNo: 1,

      typeMap: typeMap,

      mySelectedList: [],
      mySelectedMap: new Map(),

      selectedFormIdList: [],
      selectedFormList: []
    }
  },
  created () {
    this.$logger.info('SelectEvaluationList taskId ' + this.taskId + ' classId ' + this.classId + ' hiddenEvaluationId ' + this.hiddenEvaluationId)
    this.loadMyContent()
  },
  methods: {
    loadMyContent () {
      this.loading = true
      FindMyContent({
        owner: ownerMap[this.currentOwner],
        types: [typeMap.evaluation],
        pageNo: this.pageNo,
        pageSize: this.pagination.pageSize,
        currentId: this.currentId
      }).then(res => {
        console.info('loadMyContent', res)
        if (res.result && res.result.records && res.result.records.length) {
          res.result.records = res.result.records.filter(item => item.id !== this.hiddenEvaluationId)
          res.result.records.forEach((record, index) => {
            record.key = index
            record.expand = false
          })
          const list = res.result.records
          list.forEach(item => {
            item.forms = []
          })
          this.myContentList = res.result.records
          this.pagination.total = res.result.total
        } else {
          this.myContentList = []
          this.pagination.total = 0
        }
        console.info('myContentList', this.myContentList)
      }).finally(() => {
        this.loading = false
        this.skeletonLoading = false
      })
    },

    handleSelectItem (item, event) {
      console.info('handleSelectItem', item)
      event.preventDefault()
      event.stopPropagation()
      const itemId = item.type + '-' + item.id
      const index = this.mySelectedList.indexOf(itemId)
      if (index !== -1) {
        this.mySelectedList.splice(index, 1)
        this.mySelectedMap.delete(itemId)
      } else {
        this.mySelectedList.push(itemId)
        this.mySelectedMap.set(itemId, item)
      }
      this.$logger.info('mySelectedList', this.mySelectedList)
    },

    handleToggleSelect (item) {
      console.info('handleToggleSelect', item)
      if (item.expand) {
        EvaluationQueryByIds({ ids: [item.id] }).then((response) => {
          this.$logger.info('handleToggleSelect EvaluationQueryByIds ' + item.id, response)
          const forms = []
          response.result.forEach(evaluationItem => {
            evaluationItem.forms.forEach(formItem => {
              forms.push({
                title: formItem.title,
                titleEditing: false,
                formType: formItem.formType,
                se: formItem.se,
                pe: formItem.pe,
                menuVisible: false,
                id: formItem.id,
                formId: formItem.formId,
                initRawHeaders: JSON.parse(formItem.initRawHeaders),
                initRawData: JSON.parse(formItem.initRawData)
              })
            })
          })
          item.forms = forms
          if (item.forms.length === 0) {
            this.$message.warn('The current assessment tool form has not been created')
          }
        })
      }
    },

    handleCancel () {
      this.$logger.info('cancel')
      this.$emit('cancel')
    },

    handleEnsure () {
      this.$logger.info('handleEnsure')
      const list = []
      this.mySelectedList.forEach(item => {
        list.push(item.split('-')[1])
      })
      const data = {
        evaluationIdList: list,
        selectedFormList: this.selectedFormList
      }
      this.$emit('selected', data)
    },

    handleAddFormItem (formItem) {
      console.info('handleAddFormItem', formItem)
      const index = this.selectedFormList.findIndex(item => item.formId === formItem.formId)
      if (index !== -1) {
        this.selectedFormList.splice(index, 1)
      } else {
        this.selectedFormList.push(formItem)
      }
      const selectedFormIdList = []
      this.selectedFormList.forEach(item => {
        selectedFormIdList.push(item.formId)
      })
      this.selectedFormIdList = selectedFormIdList
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.ant-list-item {
  padding: 0;
  margin: 10px;
  position: relative;
  width: 200px;
}

.my-list-item {
  opacity: 1;
  margin: 0 0 15px 0;
  border-radius: 4px;
  background: #FFFFFF;
  padding: 12px 10px;
  width: 100%;
  border: 2px solid #fff;
  display: flex;
  flex-direction: column;
}

.my-list-item:hover {
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.16);
}

.my-list-item-info {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.active-item {
  border: 2px solid #15C39A;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}

.my-content {

  .content-wrapper {
    .content-list {
      .select-block {
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .select-block-icon {
          color: #ccc;
          font-size: 20px;
          cursor: pointer;
        }

        .selected-icon {
          img {
            width: 20px;
          }
        }
      }

      .content-info-left {
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .status-icon-item {
          margin-left: 5px;
          font-size: 18px;
          width: 40px;
        }

        &:hover {
          color: @primary-color;
        }
      }

      .content-info-right {
        cursor: pointer;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .update-time {
          width: 140px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-family: Inter-Bold;
          font-size: 13px;
          color: #000000;
          opacity: 0.5;
        }

        .link-status {
          font-family: Inter-Bold;
          line-height: 24px;
          color: #15C39A;
        }

        .status {
          width: 80px;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #000000;
          opacity: 1;
          text-align: center;
        }
      }

      .action-icon {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        padding: 0 10px;
        width: 80px;
        box-sizing: border-box;

        img {
          height: 18px;
        }
      }

      .action {
        color: @primary-color;
        font-weight: 500;
      }

      .action-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        .action-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-right: 10px;
          user-select: none;

          .btn-text {
            padding: 0 5px;
          }

          .link-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            padding: 5px 15px;
            border-radius: 35px;
            border: 1px solid #BCBCBC;
            font-family: Inter-Bold;
            color: #182552;
            font-size: 13px;
            background: rgba(228, 228, 228, 0.2);
            transition: all 0.3s ease;

            .link-icon {
              margin-right: 5px;
              width: 15px;
            }
          }

          svg {
            color: #182552;
          }

          .link-item:hover {
            background: rgba(228, 228, 228, 0.5);
          }
        }
      }

      .name-content {
        text-align: left;
        padding-left: 5px;
        display: inline-block;
        width: 420px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-family: Inter-Bold;
        color: #11142D;
      }
    }
  }
}

.my-list-expand {
  width: 100%;

  .form-list {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    overflow-x: scroll;

    .form-item {
      position: relative;
      border: 2px solid #fff;
      padding: 15px;
      margin: 10px 15px 10px 0;
    }

    .form-mask {
      z-index: 150;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      opacity: 0;

      .form-checked {
        position: absolute;
        left: 5px;
        top: 5px;
      }
    }

    .form-item-active {
      border: 2px solid #15C39A;
    }
  }
}
</style>
