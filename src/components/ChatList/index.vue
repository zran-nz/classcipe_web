<template>
  <div class="chat-list">
    <div class="chat-contact">
      <div class="contact-search">
        <a-input-search
          placeholder="Search"
          v-model="queryForm.keyword"
          @search="triggerSearch"
          @pressEnter="triggerSearch"
          :allowClear="true"
        >
        </a-input-search>
      </div>
      <div class="contact-list">
        <div class="contact-title">All Teachers</div>
        <div class="contact-content">
          <div
            class="contact-item"
            @click="toogleTeacher(item.id)"
            :class="{active: item.id === currentTeacher}"
            v-for="(item, index) in teacherListFilter"
            :key="'teacher_'+index">
            <a-badge count="5">
              <img class="contact-item-avatar" :src="item.avatar" />
            </a-badge>
            <div class="contact-item-detail">
              <div class="contact-item-title">{{ item.name }}</div>
              <div class="contact-item-des">{{ (item.messages && item.messages.length > 0) ? item.messages[0].content : '' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-wrap">
      <div class="chat-content" ref="chatList">
        <div class="chat-item">
          <img class="chat-avatar" src="~@/assets/icons/common/preview/star_gray.png" />
          <div class="chat-message">
            interface IImageGuide {
            type?: 'image';
            top?: boolean;  // 指定 giude 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
            zIndex?: number;
          </div>
        </div>
        <div class="chat-item self">
          <img class="chat-avatar" src="~@/assets/icons/common/preview/star_yellow.png" />
          <div class="chat-message">
            You can subscribe to any of your calendars (i.e. iCal, Google Calendar, Outlook etc.)
            by clicking My Full Calendar from your "Dashboard". From there you can click on Subscribe to Calendar. jf
          </div>
        </div>
        <div class="chat-time">Yesterday 8:30PM</div>
      </div>
      <div class="chat-line"></div>
      <div class="chat-send">
        <div class="chat-send__text">
          <a-textarea
            placeholder="Enter your message......"
            ref="chatSend"
            v-model="subForm.content"
            :rows="5"
            allowClear
          />
        </div>
        <div class="chat-send__opt">
          <a-button type="primary">Send</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ChatList',
    data() {
      return {
        dataSource: [],
        teacherList: [{
          id: 1,
          name: 'Teacher A',
          avatar: 'https://lh3.googleusercontent.com/a/AATXAJz5xyNabdkLEyV9BXw74tgHPSu9zPMpek2eSUsU=s96-c',
          messages: [{
            content: 'You can subscribe to any of your calendars (i.e. iCal, Google Calendar, Outlook etc.)'
          }]
        }, {
          id: 2,
          name: 'Teacher B',
          avatar: 'https://lh3.googleusercontent.com/a/AATXAJz5xyNabdkLEyV9BXw74tgHPSu9zPMpek2eSUsU=s96-c',
          messages: [{
            content: 'You can subscribe to any of your calendars (i.e. iCal, Google Calendar, Outlook etc.)'
          }]
        }, {
          id: 3,
          name: 'Teacher C',
          avatar: 'https://lh3.googleusercontent.com/a/AATXAJz5xyNabdkLEyV9BXw74tgHPSu9zPMpek2eSUsU=s96-c',
          messages: [{
            content: 'You can subscribe to any of your calendars (i.e. iCal, Google Calendar, Outlook etc.)'
          }]
        }],
        currentTeacher: 1,
        subForm: {
          content: ''
        },
        queryForm: {
          keyword: ''
        }
      }
    },
    computed: {
      teacherListFilter() {
        return this.teacherList.filter(item => item.name.toLowerCase().indexOf(this.queryForm.keyword) > -1)
      }
    },
    mounted() {
      this.$refs.chatList.scrollTop = this.$refs.chatList.scrollHeight
    },
    methods: {
      triggerSearch() {

      },
      toogleTeacher(id) {
        this.currentTeacher = id
      }
    }
  }
</script>

<style scoped lang="less">
.chat-list {
  position: relative;
  border: 1px solid #dfdfdf;
  border-radius: 5px;
  padding: 0px;
  height: 500px;
  display: flex;
  flex-direction: row;
  .chat-contact {
    height: 100%;
    border-right: 1px solid #dfdfdf;
    width: 250px;
    display: flex;
    flex-direction: column;
    .contact-search {
      padding: 20px;
      width: 100%;
    }
    .contact-list {
      padding: 0;
      overflow-y: auto;
      .contact-title {
        font-size: 14px;
        color: #666;
        height: 30px;
        line-height: 30px;
        padding:0 15px;
      }
      .contact-content {
        display: flex;
        flex-direction: column;
        .contact-item {
          height: 70px;
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0 15px;
          cursor: pointer;
          &.active {
            background: #eee;
          }
          .contact-item-avatar {
            width: 40px;
            height: 40px;
            border-radius: 5px;
          }
          .contact-item-detail {
            display: flex;
            flex-direction: column;
            margin-left: 10px;
            width: calc(100% - 50px);
            .contact-item-title {
              font-size: 15px;
              color: #333;
              font-weight: bold;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .contact-item-des {
              font-size: 12px;
              color: #666;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
  .chat-wrap {
    flex: 1;
    .chat-content {
      overflow-y: auto;
      height: 365px;
      padding: 20px;
      .chat-item {
        padding: 0;
        margin-bottom: 10px;
        display: flex;
        &.self {
          flex-direction: row-reverse;
          .chat-message {
            background: #9eea6a;
            margin-right: 15px;
            &::before {
              left: unset;
              right: -20px;
              border-bottom-color: transparent;
              border-top-color: transparent;
              border-right-color: transparent;
              border-left-color: #9eea6a;
            }
          }
        }
        .chat-avatar {
          width: 36px;
          height: 36px;
          border-radius: 5px;
        }
        .chat-message {
          background: #eee;
          border-radius: 5px;
          line-height: 24px;
          font-size: 14px;
          text-align: left;
          color: #333;
          padding: 10px;
          width: 300px;
          margin-left: 15px;
          position: relative;
          &::before {
            display: block;
            content: '';
            width: 0;
            height: 0;
            border: 10px solid #eee;
            border-bottom-color: transparent;
            border-top-color: transparent;
            border-left-color: transparent;
            position: absolute;
            left: -20px;
            top: 10px;
          }
        }
      }
      .chat-time {
        color: #a1a1a1;
        font-size: 12px;
        line-height: 40px;
        padding-left: 10px;
        text-align: center;
      }
    }
    .chat-line {
      height: 1px;
      background: #dfdfdf;
      width: 100%;
    }
    .chat-send {
      padding: 10px 0;
      position: relative;
      .chat-send__text {
        /deep/ textarea {
          resize: none;
          border: none!important;
          box-shadow: none!important;
          padding-left: 20px;
        }
      }
      .chat-send__opt {
        position: absolute;
        bottom: 20px;
        right: 20px;
      }
    }
  }
}
</style>
