<template>
  <div class="chat-list" ref="chatList">
    <div class="chat-content">
      <img class="chat-avatar" src="~@/assets/icons/common/preview/star_gray.png" />
      <div class="chat-message">
        interface IImageGuide {
        type?: 'image';
        top?: boolean;  // 指定 giude 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
        zIndex?: number;
      </div>
    </div>
    <div class="chat-content self">
      <img class="chat-avatar" src="~@/assets/icons/common/preview/star_yellow.png" />
      <div class="chat-message">
        You can subscribe to any of your calendars (i.e. iCal, Google Calendar, Outlook etc.)
        by clicking My Full Calendar from your "Dashboard". From there you can click on Subscribe to Calendar. jf
      </div>
    </div>
    <div class="chat-time">Yesterday 8:30PM</div>
  </div>
</template>

<script>
  export default {
    name: 'ChatList',
    data() {
      return {
        dataSource: []
      }
    },
    mounted() {
      this.$refs.chatList.scrollTop = this.$refs.chatList.scrollHeight
    },
    methods: {

    }
  }
</script>

<style scoped lang="less">
.chat-list {
  position: relative;
  border: 1px solid #dfdfdf;
  border-radius: 5px;
  padding: 20px;
  height: 500px;
  overflow-y: auto;
  .chat-content {
    padding: 0 20px;
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
</style>
