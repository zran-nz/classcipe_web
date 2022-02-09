<template>
  <a-modal
    :dialog-style="{ top: '50px' }"
    width="700px"
    :maskClosable="false"
    :keyboard="false"
    :footer="null"
    :closable="false"
    :visible="visible"
    destroyOnClose>
    <div class='quick-start-session'>
      <modal-header title='Quick start a course' @close='handleCloseModal'/>
      <div class='quick-start-tips'>
        <div class='tip-item'>Quickly select a lesson template and start the class immediately!</div>
        <div class='tip-item'>We know that some classes only need 1 Text topic, or 1 video to start the educational journey, thus we offer you a quick start!</div>
      </div>
      <div class='quick-filter-line'>
        <div class='interactive-type'>
          <div
            class='type-item'
            :class="{'active-type': selectedInteractiveList.indexOf(interactive.value) !== -1}"
            v-for='(interactive, idx) in interactiveTypeList'
            @click='handleToggleInteractiveType(interactive)'
            :key='idx'>
            {{ interactive.title }}
          </div>
        </div>
        <div class='purpose-type'>
          <a-dropdown :getPopupContainer="trigger => trigger.parentElement">
            <span>
              Purpose of questions <a-icon type="down" />
            </span>
            <a-menu slot="overlay">
              <a-menu-item
                :class="{'active-purpose': selectedPurposeList.indexOf(purposeItem.value) !== -1}"
                @click='handleTogglePurposeType(purposeItem)'
                v-for='(purposeItem, pIdx) in purposeTypeList'
                :key='pIdx'>
                {{ purposeItem.title }}
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </div>
      <div class='prompt-list'>
        <div class='prompt-item' :class="{'active-prompt-item': selectedPrompt && promptItem.id === selectedPrompt.id}" v-for='(promptItem, pIdx) in promptList' :key='pIdx' @click='selectedPrompt = promptItem'>
          <div class='prompt-cover' :style="{'background-image': 'url(' + promptItem.cover + ')'}">
            <template v-if='selectedPrompt && promptItem.id === selectedPrompt.id'>
              <div class='mask'></div>
              <div class='template-select-icon'>
                <img src='~@/assets/icons/task/selected.png' alt=''/>
              </div>
            </template>
          </div>
          <div class='prompt-title'>
            {{ promptItem.name }}
          </div>
        </div>
      </div>
      <div class='start-session'>
        <a-button size='large' shape='round' type='primary' @click='handleStartSession'>Start session</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { GetDictItems } from '@/api/common'
import { DICT_PROMPT_PURPOSE, DICT_PROMPT_TYPE } from '@/const/common'
import ModalHeader from '@/components/Common/ModalHeader'
import { filterNewPromptTemplates } from '@/api/quickTask'

export default {
  name: 'QuickSession',
  components: { ModalHeader },
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      loading: true,

      selectedInteractiveList: [],
      interactiveTypeList: [],

      selectedPurposeList: [],
      purposeTypeList: [],

      searching: false,
      promptList: [],

      selectedPrompt: null
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData () {
      this.loading = true
      this.searching = true
      Promise.all([
        GetDictItems(DICT_PROMPT_TYPE),
        GetDictItems(DICT_PROMPT_PURPOSE),
        filterNewPromptTemplates({
          interactiveList: this.selectedInteractiveList,
          limit: 1000,
          pruposeList: this.selectedPurposeList
        })
      ]).then(response => {
        this.$logger.info('quick session dict', response)

        if (response[0].success) {
          this.interactiveTypeList = response[0].result
        }

        if (response[1].success) {
          this.purposeTypeList = response[1].result
        }

        if (response[2].success) {
          this.promptList = response[2].result
        }
      }).finally(() => {
        this.loading = false
        this.searching = false
      })
    },

    handleToggleInteractiveType (interactive) {
      this.$logger.info('toggle interactive type', interactive)
      const idx = this.selectedInteractiveList.indexOf(interactive.value)
      if (idx === -1) {
        this.selectedInteractiveList.push(interactive.value)
      } else {
        this.selectedInteractiveList.splice(idx, 1)
      }
    },
    handleTogglePurposeType (purpose) {
      this.$logger.info('toggle purpose type', purpose)
      const idx = this.selectedPurposeList.indexOf(purpose.value)
      if (idx === -1) {
        this.selectedPurposeList.push(purpose.value)
      } else {
        this.selectedPurposeList.splice(idx, 1)
      }
    },

    handleStartSession () {

    },

    handleCloseModal () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.quick-start-session {

  .quick-start-tips {
    padding: 10px 0;
    width: 70%;
    margin: auto;
  }

  .tip-item {
    font-size: 12px;
    font-family: Inter-Bold;
    color: #aaa;
    text-align: center;
  }

  .quick-filter-line {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .interactive-type {
      display: flex;
      overflow: hidden;
      flex-direction: row;
      align-items: center;

      .type-item {
        cursor: pointer;
        user-select: none;
        padding-right: 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        font-family: Arial;
        line-height: 20px;
        color: #070707;
      }

      .active-type {
        font-weight: 600;
        color: #15C39A;
      }
    }

    .purpose-type {
      font-family: Inter-Bold;
      line-height: 24px;
      color: #070707;

      .ant-dropdown-menu-item {
        color: #070707;
      }
      .active-purpose {
        font-weight: 600;
        color: #15C39A;
      }
    }
  }

  .prompt-list {
    height: 460px;
    padding: 15px 5px 5px 0;
    box-sizing: border-box;
    overflow-y: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    .prompt-item {
      cursor: pointer;
      user-select: none;
      width: 310px;
      margin-bottom: 10px;
      position: relative;

      .prompt-cover {
        position: relative;
        border-radius: 4px;
        height: 180px;
        width: 100%;
        background-position: center center;
        background-size: cover;
        background-repeat: no-repeat;

        .mask {
          position: absolute;
          border-radius: 4px;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1;
        }

        .template-select-icon {
          z-index: 50;
          position: absolute;
          user-select: none;
          right: 5px;
          top: 5px;

          img {
            user-select: none;
            height: 18px;
          }
        }
      }

      .prompt-title {
        line-height: 30px;
        text-align: center;
        font-family: Leelawadee UI;
        font-weight: 600;
        color: #000000;
      }

      .active-prompt-item {
        .prompt-title {
          color: #15C39A;
        }
      }
    }
  }

  .start-session {
    margin-top: 10px;
    text-align: center;
  }
}
</style>
