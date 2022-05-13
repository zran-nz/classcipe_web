<template>
  <div class='assessment-content'>
    <div class='assessment-header'>
      <div class='title'>
        {{ assessment.title }}
      </div>
      <div class='right-action'>
        <a-space>
          <custom-link-text text='Option'>
            <template v-slot:prefix>
              <a-icon type='plus-circle' />
            </template>
          </custom-link-text>
        </a-space>
      </div>
    </div>
    <div class='assessment-body'>
      <assessment-tool-table />
    </div>
  </div>
</template>

<script>
import CustomTextButton from '@/components/Common/CustomTextButton'
import CustomLinkText from '@/components/Common/CustomLinkText'
import AssessmentToolMixin from '@/components/AssessmentTool/Mixin/AssessmentToolMixin'
import AssessmentToolTable from '@/components/AssessmentTool/AssessmentToolTable'

export default {
  name: 'AssessmentTool',
  components: { AssessmentToolTable, CustomLinkText, CustomTextButton },
  props: {
    assessment: {
      type: Object,
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
    return {}
  },
  created() {
  },
  methods: {}
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
