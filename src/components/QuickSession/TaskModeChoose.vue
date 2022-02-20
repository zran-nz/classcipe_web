<template>
  <a-modal
    width="640px"
    :maskClosable="false"
    :keyboard="false"
    :footer="null"
    :closable="false"
    :visible="visible"
    destroyOnClose>
    <div class='quick-choose-task-mode'>
      <modal-header title='Choose the mode' @close='handleCloseModal'/>
      <div class='task-mode-type'>
        <div class='task-mode-item' :class="{'active-mode': taskMode === 1}" @click='taskMode = 1'>
          <div class='mode-title'>
            Create in Google Slides
          </div>
          <div class='mode-icon'>
            <img src='~@/assets/icons/quickSession/taskMode1.png' alt='' />
          </div>
          <div class='mode-tips'>
            Choose templates or existing tasks then edit your PPT with Google Slides.
          </div>
        </div>
        <div class='task-mode-item' :class="{'active-mode': taskMode === 2}" @click='taskMode = 2'>
          <div class='mode-title'>
            Quick task
          </div>
          <div class='mode-icon'>
            <img src='~@/assets/icons/quickSession/taskMode2.png' alt='' />
          </div>
          <div class='mode-tips'>
            Select a prompt slide or relevant content, then start the session without editing.
          </div>
        </div>
      </div>
      <div class='choose-task-mode'>
        <a-button
          shape='round'
          type='primary'
          :loading='startCreating'
          @click='handleEnsureSelect'
          :disabled='taskMode === null'>Confirm</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>

import ModalHeader from '@/components/Common/ModalHeader'
import NoMoreResources from '@/components/Common/NoMoreResources'

export default {
  name: 'TaskModeChoose',
  components: { NoMoreResources, ModalHeader },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      taskMode: null,
      startCreating: false
    }
  },
  methods: {
    handleEnsureSelect () {
      this.startCreating = true
      if (this.taskMode === 1) {
        this.$router.replace('/teacher/task-redirect')
      } else if (this.taskMode === 2) {
        this.$router.replace('/teacher/task-redirect-by-mode/' + this.taskMode)
      }
      this.$emit('close')
      this.startCreating = false
    },

    handleCloseModal () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.quick-choose-task-mode {

  .choose-task-mode {
    margin-top: 10px;
    text-align: center;
  }

  .task-mode-type {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    .task-mode-item {
      padding: 20px 10px;
      margin: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #FBFBFBFF;
      border-radius: 4px;
      border: 2px solid #eee;
      cursor: pointer;
      user-select: none;

      .mode-title {
        font-size: 16px;
        font-family: Arial;
        font-weight: 900;
        line-height: 20px;
        color: #070707;
      }
      .mode-icon {
        padding: 10px 0;
        img {
          width: 120px;
          height: 75px;
        }
      }
      .mode-tips {
        padding: 0 25px;
        font-size: 12px;
        font-family: Inter-Bold;
        color: #aaa;
      }
    }

    .active-mode {
      background: #FFFFFFFF;
      border: 2px dotted #15C39AFF;
    }
  }
}
</style>
