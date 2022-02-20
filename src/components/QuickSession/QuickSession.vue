<template>
  <a-modal
    :dialog-style="{ top: '50px' }"
    width="640px"
    :maskClosable="false"
    :keyboard="false"
    :footer="null"
    :closable="false"
    :visible="visible"
    destroyOnClose>
    <div class='quick-start-session' @click='handleHiddenInputOptionList'>
      <modal-header title='' @close='handleCloseModal'/>
      <div class='quick-start-tips'>
        <div class='tip-item'>You can start a quick session by selecting <span style='font-weight: bold; color: #15C39A;'>one template</span> <br/> without editing it in Google Slides.</div>
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
              <a-badge :dot="!!selectedPurposeList.length">
                Purpose of questions <a-icon type="down" />
              </a-badge>
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
      <a-spin :spinning="searching">
        <div class='prompt-list'>
          <div
            class='prompt-item'
            :class="{'active-prompt-item': selectedPrompt && promptItem.id === selectedPrompt.id}"
            v-for='(promptItem, pIdx) in promptList'
            :key='pIdx'
            @click='handleSelectPromptItem(promptItem)'>
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
          <div class='no-data-tips' v-if='promptList.length === 0 && !searching'>
            <no-more-resources />
          </div>
        </div>
      </a-spin>
      <div class='class-tips'>
        You can also start an open session without choosing any class.
      </div>
      <div class='link-class'>
        <div class='linked-class-list'>
          <div class='class-type-tag' v-if='classItem && classItem.classType === 1'>
            <a-tag color="#F4B183">
              Classcipe International School
            </a-tag>
          </div>
          <div class='class-type-tag' v-if='classItem && classItem.classType === 2'>
            <a-tag color="#9DC3E6">
              Personal
            </a-tag>
          </div>
          <a-form-item label='Choose class'>
            <input-with-create
              ref='inputOptionList'
              :option-list='classList'
              :option-list-height='80'
              :tag-type-config='tagTypeConfig'
              @selected='handleSelectClass'
              @create-new='handleCreateNewClass'/>
          </a-form-item>
        </div>
      </div>
      <div class='start-session'>
        <a-button
          v-if="mode === 'quick-session'"
          shape='round'
          :loading='startLoading'
          type='primary'
          @click='handleStartSession'
          :disabled='selectedPrompt === null'>Start session</a-button>
        <a-button
          v-if="mode === 'choose-another'"
          shape='round'
          type='primary'
          @click='handleEnsureSelect'
          :disabled='selectedPrompt === null'>Confirm</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { GetDictItems } from '@/api/common'
import { DICT_PROMPT_PURPOSE, DICT_PROMPT_TYPE } from '@/const/common'
import ModalHeader from '@/components/Common/ModalHeader'
import { filterNewPromptTemplates, quickStartSession } from '@/api/quickTask'
import NoMoreResources from '@/components/Common/NoMoreResources'
import { lessonHost } from '@/const/googleSlide'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import InputWithCreate from '@/components/Common/InputWithCreate'
import { PersonalAddOrUpdateClass, SchoolClassGetMyClasses } from '@/api/schoolClass'

export default {
  name: 'QuickSession',
  components: { InputWithCreate, NoMoreResources, ModalHeader },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    mode: {
      type: String,
      default: 'quick-session'
    }
  },
  data () {
    return {
      selectedInteractiveList: [],
      interactiveTypeList: [],

      selectedPurposeList: [],
      purposeTypeList: [],

      searching: false,
      promptList: [],

      selectedPrompt: null,
      startLoading: false,

      tagTypeConfig: {
        1: {
          color: '#F4B183',
          label: 'Classcipe International School'
        },
        2: {
          color: '#9DC3E6',
          label: 'Personal'
        }
      },
      classList: [],
      classItem: null
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData () {
      this.searching = true
      Promise.all([
        GetDictItems(DICT_PROMPT_TYPE),
        GetDictItems(DICT_PROMPT_PURPOSE),
        filterNewPromptTemplates({
          interactiveList: this.selectedInteractiveList,
          limit: 1000,
          pruposeList: this.selectedPurposeList
        }),
        SchoolClassGetMyClasses()
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

        if (!response[3].code) {
          this.$logger.info('class list', response[3].result)
          this.classList = response[3].result
        }
      }).finally(() => {
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
      this.updatePromptList()
    },
    handleTogglePurposeType (purpose) {
      this.$logger.info('toggle purpose type', purpose)
      const idx = this.selectedPurposeList.indexOf(purpose.value)
      if (idx === -1) {
        this.selectedPurposeList.push(purpose.value)
      } else {
        this.selectedPurposeList.splice(idx, 1)
      }
      this.updatePromptList()
    },

    updatePromptList () {
      this.searching = true
      this.selectedPrompt = null
      filterNewPromptTemplates({
        interactiveList: this.selectedInteractiveList,
        limit: 1000,
        pruposeList: this.selectedPurposeList
      }).then((response) => {
        if (response.success) {
          this.promptList = response.result
        } else {
          this.promptList = []
        }
      }).finally(() => {
        this.searching = false
      })
    },

    handleSelectPromptItem (promptItem) {
      this.$logger.info('select prompt item', promptItem)
      if (this.selectedPrompt !== promptItem) {
        this.selectedPrompt = promptItem
      } else {
        this.selectedPrompt = null
      }
    },

    handleStartSession () {
      this.$logger.info('start session', this.selectedPrompt)
      this.startLoading = true
      quickStartSession({
        name: this.selectedPrompt.name,
        presentationId: this.selectedPrompt.presentationId,
        classId: this.classItem ? this.classItem.id : null
      }).then((response) => {
        this.$logger.info('start session response', response)
        this.startLoading = false
        if (response.success) {
          const targetUrl = lessonHost + 'd/' + response.result.classId + '?token=' + storage.get(ACCESS_TOKEN)
          this.$logger.info('try open ' + targetUrl)
          // 课堂那边需要点击返回回到表单，改成location.href跳转
          const url = lessonHost + 't/' + response.result.classId + '?token=' + storage.get(ACCESS_TOKEN)
          var windowObjectReference
          var height = document.documentElement.clientHeight * 0.7
          var width = document.documentElement.clientWidth * 0.7
          var strWindowFeatures = 'width=' + width + ',height=' + height + ',menubar=yes,location=yes,resizable=yes,scrollbars=true,status=true,top=100,left=200'

          windowObjectReference = window.open(
            'about:blank',
            '_blank',
            strWindowFeatures
          )
          windowObjectReference.location = url
          setTimeout(function () {
            window.location.href = targetUrl
          }, 1000)
        } else {
          this.$message.warn(response.message)
        }
      })
    },

    handleEnsureSelect () {
      this.$emit('select', {
        presentationId: this.selectedPrompt.presentationId,
        selectPageObjectIds: this.selectedPrompt.pageObjectIds,
        selectedPrompt: this.selectedPrompt,
        classItem: this.classItem
      })
    },

    handleCloseModal () {
      this.$emit('close')
    },

    handleSelectClass (eventData) {
      this.$logger.info('handleSelectClass', eventData)
      this.classItem = eventData
    },

    handleCreateNewClass (data) {
      this.$logger.info('handleCreateNewClass', data)
      PersonalAddOrUpdateClass({ name: data.value }).then(response => {
        SchoolClassGetMyClasses().then(response => {
          this.$logger.info('SchoolClassGetMyClasses', response)
          this.classList = response.result
          // 自动选中刚刚新建的班级
          const selectedClassItem = this.classList.find(item => item.name === data.value)
          if (data.index !== -1 && this.form.taskClassList.length > data.index && selectedClassItem) {
            this.$logger.info('handleCreateNewClass selectedClassItem', selectedClassItem)
            this.form.taskClassList[data.index].classId = selectedClassItem.id
          }
        })
      })
    },

    handleHiddenInputOptionList () {
      this.$refs.inputOptionList.handleClick()
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.quick-start-session {

  .quick-start-tips {
    padding-bottom: 10px;
    width: 70%;
    margin: -30px auto 0 auto;
  }

  .tip-item {
    font-family: Inter-Bold;
    color: #999;
    text-align: center;
  }

  .quick-filter-line {
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
    height: 300px;
    padding: 10px 0 5px 0;
    box-sizing: border-box;
    overflow-y: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    .prompt-item {
      cursor: pointer;
      user-select: none;
      width: 280px;
      height: 180px;
      position: relative;

      .prompt-cover {
        position: relative;
        border-radius: 4px;
        height: 150px;
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

    .no-data-tips {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .start-session {
    margin-top: 10px;
    text-align: center;
  }
}

.linked-class-list {
  padding: 10px 10px 0 10px;
  cursor: pointer;
  border: 1px dashed #15c39a;
  margin-bottom: 15px;
  position: relative;

  .mask {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    background: rgba(0,0,0, 0.07);
  }

  .remove-class-icon {
    position: absolute;
    right: -25px;
    top: 0;
    width: 25px;
    height: 100%;
    display: none;
    text-align: center;
    img {
      width: 30px;
    }
  }

  .class-type-tag {
    position: absolute;
    right: 10px;
    top: 44px;
    text-align: center;
    z-index: 150;
  }

  &:hover {
    .remove-class-icon {
      display: block;
    }
  }
}

.class-tips {
  font-size: 13px;
  color: #999;
  line-height: 30px;
}
</style>
