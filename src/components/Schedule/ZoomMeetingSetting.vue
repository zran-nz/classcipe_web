<template>
  <a-modal
    v-model="zoomSettingVisible"
    :footer="null"
    :title='null'
    :closable='false'
    destroyOnClose
    :zIndex="6000">
    <modal-header title='Zoom meeting setting' @close='handleClose' />
    <div class='modal-form'>
      <div class='modal-form-item'>
        <div class='form-title vertical-right'>
          Passcode
          <div class='title-tips'>
            <a-tooltip title=''>
              <a-icon type="question-circle" :style="{ fontSize: '14px', color: '#bbb' }" />
            </a-tooltip>
          </div>
        </div>
        <div class='form-body'>
          <a-switch v-model='isPassword' size="small"/>
        </div>
      </div>
      <div class='modal-form-item'>
        <div class='form-title vertical-right'>
          Waiting room
          <div class='title-tips'>
            <a-tooltip title=''>
              <a-icon type="question-circle" :style="{ fontSize: '14px', color: '#bbb' }" />
            </a-tooltip>
          </div>
        </div>
        <div class='form-body'>
          <a-switch v-model='isWaitingRoom' size="small" />
        </div>
      </div>
    </div>
    <div class='modal-action-right'>
      <a-button type='primary' @click='handleConfirmSelect'>Confirm</a-button>
    </div>
  </a-modal>
</template>

<script>
import ModalHeader from '@/components/Common/ModalHeader'
export default {
  name: 'ZoomMeetingSetting',
  components: { ModalHeader },
  props: {
    zoomSettingVisible: {
      type: Boolean,
      default: false
    },
    password: {
      type: Boolean,
      default: false
    },
    waitingRoom: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isPassword: this.password,
      isWaitingRoom: this.waitingRoom
    }
  },
  created() {
  },
  methods: {
    handleConfirmSelect () {
      this.$emit('confirm', {
        password: this.isPassword,
        waitingRoom: this.isWaitingRoom
      })
    },
    handleClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.modal-form {
  .modal-form-item {
    margin: 10px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding-left: 80px;
    .form-title {
      padding-right: 10px;
      width: 150px;
      text-align: right;
      .title-tips {
        padding: 0 5px;
      }
    }
  }
}
</style>
