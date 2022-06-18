<template>
  <div class='assessment-content'>
    <div class='assessment-header'>
      <div class='title'>
        <a-space>
          <div class='title-name' :class="{'active-table-title': isActiveTable }">
            {{ assessment.title }}
          </div>
          <div class='delete'>
            <a-popconfirm title="Delete?" ok-text="Yes" @confirm="deleteAssessmentTool" cancel-text="No">
              <delete-icon color='#F16A39' />
            </a-popconfirm>
          </div>
          <div class='table-saving' v-if='saving'>
            <a-spin>
              <a-icon slot="indicator" type="loading" style="font-size: 18px" spin />
            </a-spin>
            &nbsp;saving...
          </div>
        </a-space>
      </div>
      <div class='right-action'>
        <a-space v-if='assessment.type === AssessmentToolType.Rubric && allowCreate'>
          <custom-link-text text='Option' @click='selectHeaderSet'>
            <template v-slot:prefix>
              <a-icon type='plus-circle' />
            </template>
          </custom-link-text>
        </a-space>
      </div>
    </div>
    <div class='assessment-body'>
      <assessment-tool-table
        ref='table'
        :allow-create='allowCreate'
        :assessment='assessment'
        :is-active-table='isActiveTable'
        :saving.sync='saving' />
    </div>
  </div>
</template>

<script>
import CustomTextButton from '@/components/Common/CustomTextButton'
import CustomLinkText from '@/components/Common/CustomLinkText'
import AssessmentToolMixin from '@/components/AssessmentTool/Mixin/AssessmentToolMixin'
import AssessmentToolTable from '@/components/AssessmentTool/AssessmentToolTable'
import { AssessmentToolType } from '@/components/AssessmentTool/Constant'
import { AssessmentToolHeaderNamesList, AssessmentToolInfoDelete } from '@/api/v2/assessment'
import DeleteIcon from '@/components/Common/DeleteIcon'

export default {
  name: 'AssessmentTool',
  components: { DeleteIcon, AssessmentToolTable, CustomLinkText, CustomTextButton },
  props: {
    assessment: {
      type: Object,
      required: true
    },
    isActiveTable: {
      type: Boolean,
      required: true
    },
    allowCreate: {
      type: Boolean,
      default: true
    }
  },
  mixins: [ AssessmentToolMixin ],
  data() {
    return {
      AssessmentToolType: AssessmentToolType,
      saving: false
    }
  },
  methods: {
    selectHeaderSet () {
      this.$logger.info('selectHeaderSet')
      AssessmentToolHeaderNamesList().then(res => {
        this.$logger.info('AssessmentToolHeaderNamesList', res)
        if (res.code === 0) {
          const headerList = []
          const headerNameStrSet = new Set()
          res.result.forEach(item => {
            headerList.push({
              id: item.id,
              headerNameList: JSON.parse(item.headerNameList)
            })
            headerNameStrSet.add(item.headerNameList)
          })
          this.$logger.info('headerList', headerList)
          this.$refs.table.optionStrSet = headerNameStrSet
          this.$refs.table.optionList = headerList
          this.$refs.table.selectHeaderSetModalVisible = true
        } else {
          this.$message.error(res.message)
        }
      })
    },

    deleteAssessmentTool () {
      this.$logger.info('deleteAssessmentTool', this.assessment)
      if (this.assessment.id) {
        AssessmentToolInfoDelete({
          id: this.assessment.id
        }).then((res) => {
          this.$logger.info('deleteAssessmentTool res', res)
          this.$emit('delete', this.assessment.key)
        })
      } else {
        this.$emit('delete', this.assessment.key)
      }
    },

    saveAssessment() {
      this.$refs.table.autoSaveAssessment()
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.assessment-content {
  padding: 0 10px;

  .title {
    cursor: pointer;
    font-size: 14px;
    font-family: Arial;
    font-weight: 400;
    color: #222328;
    line-height: 30px;
    transition: all 0.2s ease-in-out;
  }

  .active-table-title {
    color: #15c39a;
    font-size: 16px;
    font-weight: bold;
  }

  .assessment-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .delete {
      visibility: hidden;
    }
  }

  &:hover {
    .assessment-header {
      .delete {
        visibility: visible;
      }
    }
  }

  .assessment-body {

  }
}

</style>
