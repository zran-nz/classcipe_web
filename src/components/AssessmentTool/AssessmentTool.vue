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
        </a-space>
      </div>
      <div class='right-action'>
        <a-space v-if='assessment.type === AssessmentToolType.Rubric'>
          <custom-link-text text='Option' @click='selectHeaderSet'>
            <template v-slot:prefix>
              <a-icon type='plus-circle' />
            </template>
          </custom-link-text>
        </a-space>
      </div>
    </div>
    <div class='assessment-body'>
      <assessment-tool-table ref='table' :is-active-table='isActiveTable' />
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
    }
  },
  provide () {
    return {
      assessment: this.assessment
    }
  },
  mixins: [ AssessmentToolMixin ],
  data() {
    return {
      AssessmentToolType: AssessmentToolType
    }
  },
  methods: {
    selectHeaderSet () {
      this.$logger.info('selectHeaderSet')
      AssessmentToolHeaderNamesList().then(res => {
        this.$logger.info('AssessmentToolHeaderNamesList', res)
        if (res.code === 0) {
          const headerSet = new Set()
          res.result.forEach(item => headerSet.add(item.headerNameList))
          const headerStrList = [...headerSet]
          const headerList = []
          headerStrList.forEach(item => headerList.push(JSON.parse(item)))
          this.$logger.info('headerList', headerList)
          this.$refs.table.optionStrSet = headerSet
          this.$refs.table.optionList = headerList
          this.$refs.table.selectHeaderSetModalVisible = true
        } else {
          this.$message.error(res.message)
        }
      })
    },

    deleteAssessmentTool () {
      AssessmentToolInfoDelete({
        id: this.assessment.id
      }).then((res) => {
        this.$logger.info('deleteAssessmentTool res', res)
        this.$emit('delete', this.assessment.key)
      })
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
  }

  .assessment-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .assessment-body {

  }
}

</style>
