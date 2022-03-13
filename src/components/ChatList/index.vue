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
            @click="toogleContact(item.id)"
            :class="{active: item.id === currentContact}"
            v-for="(item, index) in contactListFilter"
            :key="'teacher_'+index">
            <a-badge :count="item.noRead">
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
        <template v-for="(item, index) in dataSource">
          <div :key="'item_msg_' + item.id" class="chat-item" :class="{self: item.ownerId === user.info.id}">
            <img class="chat-avatar" :src="item.avatar" />
            <div class="chat-message" v-html="item.message">
              {{ item.message }}
            </div>
          </div>
          <div v-show="!isSameNext(item.date, index)" :key="'item_date_' + item.id" class="chat-time">{{ item.date }}</div>
        </template>
      </div>
      <div class="chat-line"></div>
      <div class="chat-send">
        <div class="chat-send__text">
          <a-textarea
            placeholder="Enter your message......"
            ref="chatSend"
            v-model="subForm.content"
            @change="e => changeContent(e.target.value)"
            :rows="5"
            allowClear
          />
        </div>
        <!-- <text-editor :value="subForm.content" @change="changeContent"/> -->
        <div class="chat-send__opt">
          <a-button type="primary" @click="handleSend" :disabled="!subForm.content">Send</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'

  import TextEditor from '@/components/Editor/WangEditor'

  import { mapState } from 'vuex'
  export default {
    name: 'ChatList',
    components: {
      TextEditor
    },
    data() {
      return {
        dataSource: [{
          id: 1,
          owner: 'Teacher A',
          ownerId: 1,
          avatar: 'https://lh3.googleusercontent.com/a/AATXAJz5xyNabdkLEyV9BXw74tgHPSu9zPMpek2eSUsU=s96-c',
          message: 'interface IImageGuide] nterface IImageGuide] nterface IImageGuide] nterface IImageGuide]',
          date: '2022-03-08 12:00:00'
        }, {
          id: 3,
          owner: 'Teacher A',
          ownerId: 2,
          avatar: 'https://lh3.googleusercontent.com/a/AATXAJz5xyNabdkLEyV9BXw74tgHPSu9zPMpek2eSUsU=s96-c',
          message: 'interface IImageGuide] nterface IImageGuide] nterface IImageGuide] nterface IImageGuide]',
          date: '2022-03-08 14:00:00'
        }, {
          id: 2,
          owner: 'jacob',
          ownerId: '1496403869212160002',
          avatar: 'https://lh3.googleusercontent.com/a/AATXAJz5xyNabdkLEyV9BXw74tgHPSu9zPMpek2eSUsU=s96-c',
          message: 'You can subscribe to any of your calendars (i.e. iCal, Google Calendar, Outlook etc.) by clicking My Full Calendar from your "Dashboard". From there you can click on Subscribe to Calendar. jf',
          date: moment().format('YYYY-MM-DD hh:mm:ss')
        }],
        contactList: [{
          id: 1,
          name: 'Teacher A',
          avatar: 'https://lh3.googleusercontent.com/a/AATXAJz5xyNabdkLEyV9BXw74tgHPSu9zPMpek2eSUsU=s96-c',
          messages: [{
            content: 'You can subscribe to any of your calendars (i.e. iCal, Google Calendar, Outlook etc.)'
          }],
          noRead: 0
        }, {
          id: 2,
          name: 'Teacher B',
          avatar: 'https://lh3.googleusercontent.com/a/AATXAJz5xyNabdkLEyV9BXw74tgHPSu9zPMpek2eSUsU=s96-c',
          messages: [{
            content: 'You can subscribe to any of your calendars (i.e. iCal, Google Calendar, Outlook etc.)'
          }],
          noRead: 3
        }, {
          id: 3,
          name: 'Teacher C',
          avatar: 'https://lh3.googleusercontent.com/a/AATXAJz5xyNabdkLEyV9BXw74tgHPSu9zPMpek2eSUsU=s96-c',
          messages: [{
            content: 'You can subscribe to any of your calendars (i.e. iCal, Google Calendar, Outlook etc.)'
          }],
          noRead: 5
        }],
        currentContact: 1,
        subForm: {
          content: ''
        },
        queryForm: {
          keyword: ''
        },
        contactSendBack: []
      }
    },
    computed: {
      contactListFilter() {
        return this.contactList.filter(item => item.name.toLowerCase().indexOf(this.queryForm.keyword) > -1)
      },
      ...mapState({
        user: state => state.user
      })
    },
    created() {
      this.initData()
    },
    mounted() {
      this.goBottom()
    },
    methods: {
      initData() {
        this.contactSendBack = this.contactList.map(item => {
          return {
            id: item.id,
            content: ''
          }
        })
      },
      triggerSearch() {

      },
      toogleContact(id) {
        this.currentContact = id
        this.subForm.content = this.contactSendBack.find(item => item.id === id).content
        this.goBottom()
      },
      changeContent(val) {
        // this.subForm.content = val
        this.contactSendBack.find(item => item.id === this.currentContact).content = val
      },
      isSameNext(val, index) {
        let next = moment()
        const nextData = this.dataSource[index + 1]
        if (nextData) {
          next = moment(nextData.date)
        }
        if (moment(val).isSame(next, 'day') || moment(val).isSame(moment())) {
          return true
        } else {
          return false
        }
      },
      handleSend() {
        const message = this.contactSendBack.find(item => item.id === this.currentContact).content
        this.dataSource.push({
          id: Math.random(),
          owner: 'jacob',
          ownerId: '1496403869212160002',
          avatar: 'https://lh3.googleusercontent.com/a/AATXAJz5xyNabdkLEyV9BXw74tgHPSu9zPMpek2eSUsU=s96-c',
          message: message,
          date: moment().format('YYYY-MM-DD hh:mm:ss')
        })
        this.initSend()
      },
      initSend() {
        this.subForm.content = ''
        this.changeContent('')
        this.goBottom()
      },
      goBottom() {
        this.$nextTick(() => {
          if (this.$refs.chatList) {
            this.$refs.chatList.scrollTop = this.$refs.chatList.scrollHeight
          }
        })
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
            white-space: pre-wrap;
            word-break: break-word;
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
        z-index: 999;
      }
    }
  }
}
</style>
