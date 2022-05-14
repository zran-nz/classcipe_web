<template>
  <div class='assessment-content'>
    <div class='assessment-header'>
      <div class='title' :class="{'active-table-title': isActiveTable }">
        {{ assessment.title }}
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

export default {
  name: 'AssessmentTool',
  components: { AssessmentToolTable, CustomLinkText, CustomTextButton },
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
      this.$logger.info('selectHeaderSet', this.$refs.table)
      this.$refs.table.selectHeaderSetModalVisible = true
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
