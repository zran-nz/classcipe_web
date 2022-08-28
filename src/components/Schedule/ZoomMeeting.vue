<template>
  <div class='zoom-meeting'>
    <div class='zoom-meeting-title vertical-left'>
      Zoom meeting setting
    </div>
    <div class='modal-form'>
      <div class='modal-form-item'>
        <div class='form-title vertical-left'>
          Passcode
          <div class='title-tips'>
            <a-tooltip title='You can enable a Zoom passcode to secure who joins your meetings. Once enabled, your Zoom meeting will automatically include a passcode same as your session code.'>
              <a-icon type="question-circle" :style="{ fontSize: '14px', color: '#bbb' }" />
            </a-tooltip>
          </div>
        </div>
        <div class='form-body'>
          <a-switch v-model='isPassword' size="small"/>
        </div>
      </div>
      <div class='modal-form-item'>
        <div class='form-title vertical-left'>
          Waiting room
          <div class='title-tips'>
            <a-tooltip title='The Waiting Room feature allows the host to control when a participant joins the meeting.'>
              <a-icon type="question-circle" :style="{ fontSize: '14px', color: '#bbb' }" />
            </a-tooltip>
          </div>
        </div>
        <div class='form-body'>
          <a-switch v-model='isWaitingRoom' size="small" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ZoomMeeting',
  props: {
    password: {
      type: Boolean,
      default: true
    },
    waitingRoom: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    isPassword(v) {
      this.update()
    },
    isWaitingRoom(v) {
      this.update()
    }
  },
  data() {
    return {
      isPassword: this.password,
      isWaitingRoom: this.waitingRoom
    }
  },
  methods: {
    update() {
      this.$emit('update', {
        password: this.isPassword,
        waitingRoom: this.isWaitingRoom
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.modal-form {
  padding: 0 5px;
  .modal-form-item {
    margin: 10px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .form-title {
      padding-right: 10px;
      width: 150px;
      text-align: left;
      color: #333;
      line-height: 30px;
      .title-tips {
        padding: 0 5px;
      }
    }
  }
}

.zoom-meeting-title {
  font-weight: bold;
  font-size: 16px;
  padding: 5px;
  color: #333;
}
</style>
