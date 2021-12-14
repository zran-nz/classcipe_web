<template>
  <div class="task-details">
    <a-card class="cover-card" >
      <div slot="title" class="assessment-task-button">
        <a-icon type="left"/>
        Assessment task details
      </div>

      <div class="tab-content">
        <div value="1" :class="{'tab-item':true,'tab-item-active':tab==='1'}" @click="changeTab('1')">
          Assessment task(s)
        </div>
        <div value="2" :class="{'tab-item':true,'tab-item-active':tab==='2'}" @click="changeTab('2')">
          Learning experience
        </div>
      </div>

      <div class="tab1-details">
        <div class="tab1-item">
          <div class="left-card">
          </div>
          <div class="center-card">
            <div class="title-image">
              <div class="center-title">
                Task 1 title Task 1 title Task 1 title Task 1 title
                Task 1 title Task 1 titleTask 1 title Task 1 title
              </div>
              <img class="go-icon" src="~@/assets/icons/unitplan/go.png" />
            </div>
            <div class="center-tags">
              <div class="tag-list-item">
                <a-tag class="tag-item" :closable="false">Formative</a-tag>
              </div>
              <div class="tag-list-item">
                <a-tag class="tag-item" :closable="false">Formative Formative Formative</a-tag>
              </div>
              <div class="tag-list-item">
                <a-tag class="tag-item" :closable="false">Formative</a-tag>
              </div>
              <div class="tag-list-item">
                <a-tag class="tag-item" :closable="false">Formative</a-tag>
              </div>
              <div class="tag-list-item">
                <a-tag class="tag-item" :closable="false">Formative</a-tag>
              </div> <div class="tag-list-item">
                <a-tag class="tag-item" :closable="false">Formative</a-tag>
              </div>
              <div class="tag-list-item">
                <a-tag class="tag-item" :closable="false">Formative</a-tag>
              </div>

              <div class="tag-list-item">
                <a-tag class="tag-item" :closable="false">Formative</a-tag>
              </div>
              <div class="tag-list-item">
                <a-tag class="tag-item" :closable="false">Formative</a-tag>
              </div>
              <div class="tag-list-item">
                <a-tag class="tag-item" :closable="false">Formative</a-tag>
              </div>
            </div>
          </div>
          <div class="right-card" >
            <a-icon type="caret-down" />
          </div>
        </div>

        <div class="tab1-item">
          <div class="left-card">
          </div>
          <div class="center-card">
            <div class="title-image">
              <div class="center-title">
                Unnamed Unit Plan 123456789
              </div>
              <img class="go-icon" src="~@/assets/icons/unitplan/go.png" />
            </div>
            <div class="center-tags">
              <div class="tag-list-item">
                <a-tag class="tag-item" :closable="false">Formative</a-tag>
              </div>
              <div class="tag-list-item">
                <a-tag class="tag-item" :closable="false">Formative Formative Formative</a-tag>
              </div>
            </div>
          </div>
          <div class="right-card" >
            <a-icon type="caret-down" />
          </div>
        </div>

        <div class="tab1-item">
          <div class="left-card">
          </div>
          <div class="center-card">
            <div class="title-image">
              <div class="center-title">
                Task 1 title Task 1 title Task 1 title Task 1 title
                Task 1 title Task 1 titleTask 1 title Task 1 title
              </div>
              <img class="go-icon" src="~@/assets/icons/unitplan/go.png" />
            </div>
            <div class="center-tags">
              <div class="tag-list-item">
                <a-tag class="tag-item" :closable="false">Formative</a-tag>
              </div>
              <div class="tag-list-item">
                <a-tag class="tag-item" :closable="false">Formative Formative Formative</a-tag>
              </div>
              <div class="tag-list-item">
                <a-tag class="tag-item" :closable="false">Formative</a-tag>
              </div>
              <div class="tag-list-item">
                <a-tag class="tag-item" :closable="false">Formative</a-tag>
              </div>
              <div class="tag-list-item">
                <a-tag class="tag-item" :closable="false">Formative</a-tag>
              </div>
              <div class="tag-list-item">
                <a-tag class="tag-item" :closable="false">Formative</a-tag>
              </div>
            </div>
          </div>
          <div class="right-card" >
            <a-icon type="caret-down" />
          </div>
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
      loading: false,
      tab: '1'
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
    changeTab (tab) {
      this.tab = tab
    }

  }

}
</script>

<style lang="less" scoped>

@import "~@/components/index.less";
.task-details {
  //border: 1px solid #e8e8e8;
  box-sizing: border-box;
  position: relative;
  border-radius: 8px;

  .assessment-task-button{
    border: none;
    font-size: 16px;
    font-family: Inter-Bold;
    line-height: 24px;
    color: #15C39A;
    opacity: 1;
    cursor: pointer;
    margin-top: 5px;
    .radio-1-test{
      height: 21px;
      font-size: 14px;
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

  .tab1-details{
    display:flex;
    flex-direction: column;
    margin-top: 20px;
    .tab1-item{
      display:flex;
      width: 100%;
      margin-bottom: 5px;
      //height: 80px;
      background: #FFFFFF;
      border: 1px solid #E1E1E1;
      opacity: 1;
      border-radius: 6px;
    }
    .left-card{
      margin: 5px;
      width: 20%;
      background: #F2F2F2;
      opacity: 1;
      border-radius: 4px;
    }
    .center-card{
      width: 70%;
      margin: 5px;
      display:flex;
      flex-direction: column;
      .title-image{
        display: flex;
        .center-title{
          font-family: Inter-Bold;
          line-height: 20px;
          color: #474747;
          font-size:13px;
        }
        .go-icon{
          width:20px;
          height: 20px;
          cursor: pointer;
          margin-top: 2px;
          margin-left: 10px;
          &:hover{
            color:#15C39A
          }
        }
      }

    }
    .right-card{
      display: flex;
      cursor: pointer;
      font-size: 25px;
      justify-content: center;
      flex-direction: column;
      &:hover{
        color:#15C39A
      }
    }
    .center-tags{
       display: flex;
       margin-top:4px;
       flex-wrap: wrap;
       overflow: hidden;
       max-height:62px;
       overflow-x: hidden;
      .tag-list-item {
        margin: 3px 10px 3px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        cursor: pointer;
        .tag-item {
          background:#15C39A;
          cursor: pointer;
          border-radius: 10px;
          word-break:normal;
          width:auto;
          color: #FFFFFF;
          display:block;
          white-space:pre-wrap;
          word-wrap : break-word ;
          overflow: hidden ;
          padding-bottom: 3px;
        }
      }
    }

  }

}
</style>
