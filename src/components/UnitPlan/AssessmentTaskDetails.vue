<template>
  <div class="task-details">
    <a-card class="cover-card" >
      <div slot="title" class="assessment-task-button">
        <a-icon type="left"/>
        Assessment task details
      </div>

      <div class="tab-content">
        <div value="1" class="tab-item tab-item-active">
          Assessment task(s)
        </div>
        <div value="2" class="tab-item">
          Learning experience
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { UtilMixin } from '@/mixins/UtilMixin'

export default {
  name: 'AssessmentTaskDetails',
  components: {
  },
  mixins: [UtilMixin],
  props: {
    associateTaskList: {
      type: Array,
      default: () => []
    }
  },
  mounted () {
  },
  destroyed () {

  },
  data () {
    return {
      loading: false
    }
  },
  created () {

  },
  computed: {

  },
  watch: {
    // selectedTagsList () {
    //    this.tagList = this.selectedTagsList
    // },
  },
  methods: {

  }

}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";
.task-details {
  //border: 1px solid #e8e8e8;
  box-sizing: border-box;
  position: relative;

  .assessment-task-button{
    border: none;
    font-size: 16px;
    font-family: Inter-Bold;
    line-height: 24px;
    color: #15C39A;
    opacity: 1;
    margin-top: 5px;
    .radio-1-test{
      height: 21px;
      font-size: 16px;
      font-family: Inter-Bold;
      line-height: 24px;
      color: #FFFFFF;
      opacity: 1;
    }
  }
  .tab-content{
    display : flex;
    width : 560px;
    justify-content: center;
    margin:0 auto;
    cursor: pointer;
    /deep/ .ant-card-head{
      border-bottom:none;
    }
    .tab-item{
      display:flex;
      justify-content: center;
      align-items: center;
      display:flex;
      width: 280px;
      height: 50px;
      background: #F2F2F2;
      opacity: 1;
      border-radius: 0px 5px 5px 0px;
      color: #393939;
      font-size: 14px;
      font-family: Inter-Bold;
      line-height: 24px;
    }
    .tab-item-active{
      background: #15C39A;
      color: #FFFFFF;
    }
  }

}
</style>
