<template>
  <div class="task-details">
    <a-card class="cover-card" >
      <div slot="title" class="assessment-task-button">
        <div @click="hideModel()" style="width:200px">
          <a-icon type="left"/>
          Assessment task details
        </div>
      </div>

      <div class="tab-content">
        <div value="1" :class="{'tab-item':true,'tab-item-active':tab==='1'}" @click="changeTab('1')">
          Assessment task(s)
        </div>
        <div value="2" :class="{'tab-item':true,'tab-item-active':tab==='2'}" @click="changeTab('2')">
          Learning experience
        </div>
      </div>

      <div class="tab1-details" v-if="tab==='1'">
        <div class="tab-item-block" v-for="(task,index) in associateTaskList" :key="index">
          <div class="tab1-item">
            <div class="left-card">
              <div class="time-top">
                <span class="time-month">{{ formatMonth(task) }}</span>
                <span class="time-day">{{ formatDay(task) }}</span>
              </div>
              <div class="time-bottom">
                {{ formatTime(task) }}
              </div>

            </div>
            <div class="center-card">
              <div class="title-image">
                <div class="center-title">
                  {{ task.name }}
                </div>
                <Go-Icon class="go-icon" @click="handleEditTask(task)" />
                <!--                <img class="go-icon" src="~@/assets/icons/unitplan/go.png" @click="handleEditTask(task)" />-->
              </div>
              <div class="center-tags">
                <div class="tag-list-item">
                  <a-tag v-if="task.taskType == 'FA'" class="tag-item" :closable="false">Formative</a-tag>
                  <a-tag v-if="task.taskType == 'SA'" class="tag-item" :closable="false">Summative</a-tag>
                  <a-tag v-if="task.taskType == 'Activity'" class="tag-item" :closable="false">Activity</a-tag>
                  <a-tag v-if="task.taskType == 'IA'" class="tag-item" :closable="false">IA</a-tag>
                </div>
              </div>
            </div>
            <div class="right-card" @click="showTaskLearnOut(task)" >
              <a-button shape="round" v-if="task.showLearnOut" type="link" icon="caret-up">Show objectives </a-button>
              <a-button shape="round" v-if="!task.showLearnOut" type="link" icon="caret-down">Show objectives </a-button>
            </div>
          </div>

          <div class=" learn-out" v-if="task.showLearnOut">
            <ui-learn-out-sub :learn-outs="task.learnOuts"/>
          </div>
        </div>
        <template v-if="associateTaskList.length === 0">
          <no-more-resources tips="no data!"/>
        </template>
      </div>

      <div class="tab2-details" v-if="tab==='2'">
        <template v-if="associateTaskList.length === 0">
          <no-more-resources tips="no data!"/>
        </template>
        <template v-else>
          <div class="tab2-title">
            Learning experience/Student expectations
          </div>
          <div class="tab2-task-list">
            <div class="task-card" v-for="(task,index) in associateTaskList" :key="index">
              <div class="title-image">
                <div class="center-title">
                  {{ task.name }}
                </div>
                <Go-Icon class="go-icon" @click="handleEditTask(task)" />
              </div>
              <div class="overview">
                {{ task.overview }}
              </div>
            </div>
          </div>

          <div class="tab2-title">
            Teaching strategie
          </div>
          <div class="tab2-task-list">
            <div class="task-card" v-for="(task,index) in associateTaskList" :key="index">
              <div class="title-image">
                <div class="center-title">
                  {{ task.name }}
                </div>
                <Go-Icon class="go-icon" @click="handleEditTask(task)" />
              </div>
              <div class="task-tags">
                <div class="tag-list-item">
                  <a-tag v-if="tag.parentName === 'Teaching strategies'" v-for="(tag,tIndex) in task.customTags" :key="tIndex" class="tag-item" :closable="false">{{ tag.name }}</a-tag>
                </div>
              </div>
            </div>
          </div>

          <div class="tab2-title">
            Differentiate instructions
          </div>
          <div class="tab2-task-list">
            <div class="task-card" v-for="(task,index) in associateTaskList" :key="index">
              <div class="title-image">
                <div class="center-title">
                  {{ task.name }}
                </div>
                <Go-Icon class="go-icon" @click="handleEditTask(task)" />
              </div>
              <div class="task-tags">
                <div class="tag-list-item">
                  <a-tag v-if="tag.parentName === 'Differentiated instructions'" v-for="(tag,tIndex) in task.customTags" :key="tIndex" class="tag-item" :closable="false">{{ tag.name }}</a-tag>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </a-card></div></a-card>
  </div>
</template>

<script>
import { UtilMixin } from '@/mixins/UtilMixin'
import UiLearnOutSub from '@/components/UnitPlan/UiLearnOutSub'
import { typeMap } from '@/const/teacher'
import moment from 'moment'
import GoIcon from '@/assets/icons/unitplan/go.svg?inline'
import NoMoreResources from '@/components/Common/NoMoreResources'

export default {
  name: 'AssessmentTaskDetails',
  components: {
    NoMoreResources,
    UiLearnOutSub,
GoIcon
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
      tab: '1',
      contentType: typeMap
    }
  },
  created () {
    this.$logger.info('associateTaskList ', this.associateTaskList)
  },
  computed: {
    formatMonth () {
      return function (task) {
        let date = task.startDate
        if (!date) {
          date = task.createTime
        }
        return moment.utc(date).local().format('MMM')
      }
    },
    formatDay () {
      return function (task) {
        let date = task.startDate
        if (!date) {
          date = task.createTime
        }
        return moment.utc(date).local().format('DD')
      }
    },
    formatTime () {
      return function (task) {
        let date = task.startDate
        if (!date) {
          date = task.createTime
        }
        return moment.utc(date).local().format('ddd HH:mm a')
      }
    }
  },
  watch: {
    // selectedTagsList () {
    //    this.tagList = this.selectedTagsList
    // },
  },
  methods: {
    changeTab (tab) {
      this.tab = tab
    },
    showTaskLearnOut (task) {
      this.$logger.info('showTaskLearnOut ', task)
      const index = this.associateTaskList.findIndex(item => item.id === task.id)
      task.showLearnOut = !task.showLearnOut
      this.$set(this.associateTaskList, index, task)
    },
    handleEditTask (item) {
      window.open('/teacher/task-redirect/' + item.id
        , '_blank')
    },
    hideModel () {
      this.$emit('hide-assessment-task')
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
    width : 94%;
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
      width: 50%;
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
    .tab-item-block{
      display: flex;
      flex-direction: column;
      border: 1px solid #E1E1E1;
      border-radius: 6px;
      margin-bottom: 10px;
      min-height:87px;
    }
    .learn-out{
      margin:10px;
    }
    .tab1-item{
      display:flex;
      width: 100%;
      //height: 87px;
      //background: #FFFFFF;
      opacity: 1;
    }
    .left-card{
      margin: 5px;
      width: 20%;
      background: #F2F2F2;
      opacity: 1;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .time-top{
        width: 80px;
        height: 50px;
        background: #EC808D;
        opacity: 1;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 5px;
        .time-month{
          height: 19px;
          font-size: 14px;
          font-family: Leelawadee UI;
          font-weight: bold;
          line-height: 24px;
          color: #FFFFFF;
          opacity: 1;
        }
        .time-day{
          font-size: 14px;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #FFFFFF;
          opacity: 1;
        }
      }
      .time-bottom{
        //width: 66px;
        //height: 16px;
        font-size: 12px;
        font-family: Inter-Bold;
        line-height: 24px;
        color: #474747;
        opacity: 1;
      }
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
        }
        .go-icon{
          width:30px;
          //height: 20px;
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
      //font-size: 25px;
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

  .tab2-details {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    .tab2-title{
      margin:10px;
      font-size: 16px;
      font-family: Inter-Bold;
      line-height: 14px;
      color: #15C39A;
      opacity: 1;
    }
    .tab2-task-list{
      .task-card{
        background: #FFFFFF;
        border: 1px solid #E1E1E1;
        opacity: 1;
        border-radius: 6px;
        margin: 10px;
        padding:10px;
        display:flex;
        flex-direction: column;
        .title-image{
          display: flex;
          .center-title{
            font-size: 16px;
            font-family: Leelawadee UI;
            font-weight: bold;
            line-height: 24px;
            color: #474747;
            opacity: 1;
          }
          .go-icon{
            width:30px;
            //height: 20px;
            cursor: pointer;
            margin-top: 2px;
            margin-left: 10px;
            &:hover{
              color:#15C39A
            }
          }
        }
        .overflow{
          font-size: 16px;
          font-family: Inter-Bold;
          line-height: 24px;
          color: #474747;
          opacity: 1;
        }
        .task-tags{
          margin-top:10px;
          margin-left: 5px;
        }
        .tag-list-item {
          margin: 3px 1px 3px 0;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          vertical-align: middle;
          flex-wrap: wrap;
          cursor: pointer;
          .tag-item {
            margin-bottom: 5px;
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

}
</style>
